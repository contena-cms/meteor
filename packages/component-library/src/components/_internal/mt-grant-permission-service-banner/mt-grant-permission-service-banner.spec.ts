import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import flushPromises from "flush-promises";
import MtGrantPermissionServiceBanner from "./mt-grant-permission-service-banner.vue";

const isService = vi.hoisted(() => vi.fn());
const grant = vi.hoisted(() => vi.fn());
const isGranted = vi.hoisted(() => vi.fn());
const getAppInformation = vi.hoisted(() => vi.fn());
const dispatch = vi.hoisted(() => vi.fn());

vi.mock("@contena/meteor-admin-sdk/es/context", () => ({ getAppInformation }));
vi.mock("@contena/meteor-admin-sdk/es/telemetry", () => ({ dispatch }));
vi.mock("@contena/meteor-admin-sdk/es/_private/context", () => ({ isService }));
vi.mock("@contena/meteor-admin-sdk/es/_private/permissions", () => ({
  grant,
  isGranted,
}));

/**
 * Renders the banner and waits for the `isService` round-trip to settle, because
 * the banner stays hidden until the Administration confirms a service context.
 */
async function renderBanner() {
  const result = render(MtGrantPermissionServiceBanner);

  await flushPromises();

  return result;
}

function getGrantButton() {
  return screen.getByRole("button", { name: /Grant permissions/ });
}

beforeEach(() => {
  // The mocks live at module scope, so their call history has to be dropped
  // between tests before the per-test behaviour is re-established.
  vi.clearAllMocks();

  isService.mockResolvedValue(true);
  grant.mockResolvedValue(undefined);
  isGranted.mockResolvedValue(false);
  getAppInformation.mockResolvedValue({
    name: "ContenaExample",
    version: "1.2.3",
    type: "app",
    privileges: {},
  });
  dispatch.mockResolvedValue(undefined);
});

describe("mt-grant-permission-service-banner", () => {
  it("renders nothing outside of a service context", async () => {
    isService.mockResolvedValue(false);

    await renderBanner();

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("renders nothing when the service context can not be resolved", async () => {
    isService.mockRejectedValue(new Error("no channel counterpart"));

    await renderBanner();

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("renders nothing when the permission has already been granted", async () => {
    isGranted.mockResolvedValue(true);

    await renderBanner();

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("renders nothing when the granted state can not be resolved", async () => {
    isGranted.mockRejectedValue(new Error("no channel counterpart"));

    await renderBanner();

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("renders a decorative icon that is hidden from assistive technology", async () => {
    const { container } = await renderBanner();

    const icon = container.querySelector(".mt-grant-permission-service-banner__icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("labels the banner with its own heading", async () => {
    await renderBanner();

    expect(screen.getByRole("region")).toHaveAccessibleName(
      "Grant permissions to activate this service.",
    );
  });

  it("sizes itself against a query container instead of a layout prop", async () => {
    const { container } = await renderBanner();

    expect(screen.getByRole("region").parentElement).toHaveClass(
      "mt-grant-permission-service-banner__container",
    );
    expect(container.querySelector("[class*='mt-grant-permission-service-banner--']")).toBeNull();
  });

  it("renders both grant labels so the container query can pick one", async () => {
    await renderBanner();

    const grantButton = getGrantButton();
    expect(
      grantButton.querySelector(".mt-grant-permission-service-banner__label--short"),
    ).toHaveTextContent("Grant permissions");
    expect(
      grantButton.querySelector(".mt-grant-permission-service-banner__label--long"),
    ).toHaveTextContent("Grant permissions and activate");
  });

  it("grants the service permission when the user confirms", async () => {
    const user = userEvent.setup();
    await renderBanner();

    await user.click(getGrantButton());

    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state while the permission is being granted", async () => {
    const user = userEvent.setup();
    let resolveGrant: () => void = () => {};
    grant.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveGrant = resolve;
      }),
    );

    const { container } = await renderBanner();

    await user.click(getGrantButton());

    expect(getGrantButton()).toBeDisabled();
    expect(container.querySelector(".mt-button__loader")).toBeInTheDocument();

    resolveGrant();
    await flushPromises();

    expect(getGrantButton()).toBeEnabled();
  });

  it("blocks a second permission request while the first one runs", async () => {
    const user = userEvent.setup();
    grant.mockReturnValue(new Promise<void>(() => {}));

    await renderBanner();

    const grantButton = getGrantButton();
    await user.click(grantButton);
    await user.click(grantButton);

    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("recovers from a failed permission request", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    grant.mockRejectedValue(new Error("permission denied"));

    await renderBanner();
    await user.click(getGrantButton());

    expect(consoleError).toHaveBeenCalled();
    expect(getGrantButton()).toBeEnabled();

    grant.mockResolvedValue(undefined);
    await user.click(getGrantButton());

    expect(grant).toHaveBeenCalledTimes(2);

    consoleError.mockRestore();
  });

  it("reports the grant click to telemetry", async () => {
    const user = userEvent.setup();
    await renderBanner();

    await user.click(getGrantButton());

    expect(dispatch).toHaveBeenCalledWith({
      event: "ContenaExample_grant_permission_clicked",
      data: { contena_version: "1.2.3" },
    });
  });

  it("grants the permission when the app information is unavailable", async () => {
    const user = userEvent.setup();
    getAppInformation.mockRejectedValue(new Error("no channel counterpart"));

    await renderBanner();
    await user.click(getGrantButton());

    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("grants the permission when telemetry is unavailable", async () => {
    const user = userEvent.setup();
    dispatch.mockRejectedValue(new Error("no channel counterpart"));

    await renderBanner();
    await user.click(getGrantButton());

    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("reports the more info click to telemetry", async () => {
    const user = userEvent.setup();
    await renderBanner();

    await user.click(screen.getByRole("link", { name: "More info" }));

    expect(dispatch).toHaveBeenCalledWith({
      event: "ContenaExample_grant_permission_more_info",
    });
  });

  it("opens the more info target in a new tab", async () => {
    await renderBanner();

    const link = screen.getByRole("link", { name: "More info" });
    expect(link).toHaveAttribute("href", "https://developer.contena.cn/docs/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });
});
