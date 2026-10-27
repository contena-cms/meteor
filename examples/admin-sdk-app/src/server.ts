import path from 'path';
import fs from 'fs';
import express from 'express';
import { AppServer, InMemoryShopRepository } from '@contena-ag/app-server-sdk';
import type { Configuration } from '@contena-ag/app-server-sdk';
import { createServer as createViteServer } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * The app server SDK works with the fetch-standard Request and Response
 * objects, so express requests are bridged before they reach the SDK.
 */
function toFetchRequest(req: express.Request, baseUrl: string): Request {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === 'string') {
            headers.set(key, value);
        } else if (Array.isArray(value)) {
            headers.set(key, value.join(', '));
        }
    }

    const method = req.method.toUpperCase();
    return new Request(`${baseUrl}${req.originalUrl}`, {
        method,
        headers,
        body: method === 'GET' || method === 'HEAD' ? undefined : (req.body as Buffer),
    });
}

async function sendResponse(response: Response, res: express.Response): Promise<void> {
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(Buffer.from(await response.arrayBuffer()));
}

async function createServer() {
    const PORT = process.env.PORT || 8888;
    const URL = process.env.URL || `http://localhost:${PORT}`;

    const app = express();

    /**
     * Configure the app server for authentication and verification
     */
    const cfg: Configuration = {
        appName: 'MeteorAdminSDKApp',
        appSecret: 'testSecret',
        authorizeCallbackUrl: `${URL}/authorize/callback`
    };

    const appServer = new AppServer(cfg, new InMemoryShopRepository());

    // Signature verification needs the raw request body
    const rawBody = express.raw({ type: '*/*' });

    app.get('/authorize', rawBody, async (req, res) => {
        const resp = await appServer.registration.authorize(toFetchRequest(req, URL));

        await sendResponse(resp, res);
    });

    app.post('/authorize/callback', rawBody, async (req, res) => {
        const resp = await appServer.registration.authorizeCallback(toFetchRequest(req, URL));

        await sendResponse(resp, res);
    });

    /**
     * Create Vite server in middleware mode and configure the app type as
     * 'custom', disabling Vite's own HTML serving logic so parent server
     * can take control
     */
    const vite = await createViteServer({
        root: path.resolve(__dirname, 'frontend'),
        server: {
            middlewareMode: true,
            watch: {
                // During tests we edit the files too fast and sometimes chokidar
                // misses change events, so enforce polling for consistency
                usePolling: true,
                interval: 100,
            },
        },
        appType: 'custom',
        plugins: [vue()],
        optimizeDeps: {
            include: [
                '@contena-ag/meteor-admin-sdk',
                '@contena-ag/meteor-component-library'
            ]
        },
    })

    // use vite's connect instance as middleware
    app.use(vite.middlewares)

    app.use('*', async (req, res) => {
        const template = fs.readFileSync(
            path.resolve(__dirname, 'frontend/index.html'),
            'utf-8'
        );

        /**
         * Don't use hot-reload because this don't work correctly
         * within the Contena Admin
         */
        // const url = req.originalUrl
        // template = await vite.transformIndexHtml(url, template)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    })

    app.listen(PORT, () => {
        console.log(`App listening at ${URL}`)
    })
}

void createServer();
