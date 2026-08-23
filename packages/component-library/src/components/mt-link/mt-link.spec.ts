import { render, screen } from "@testing-library/vue";
import MtLink from "./mt-link.vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent, markRaw } from "vue";

/**
 * Minimal stand-in for vue-router's RouterLink: it accepts a route location and
 * resolves its own href, the way the real component does. vue-router itself is not a
 * dependency of this package, so we cannot use it here.
 */
const RouterLinkStub = defineComponent({
  props: {
    to: { type: [String, Object], required: true },
  },
  template: `<a :href="typeof to === 'string' ? to : '/resolved/' + to.name"><slot /></a>`,
});

describe("mt-link", () => {
  it("renders a link", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
      },
    });

    // ASSERT
    expect(screen.getByRole("link")).toBeVisible();
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://www.contena.cn");
    expect(screen.getByRole("link")).toHaveRole("link");
  });

  it("renders the correct slot content", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
      },
      slots: {
        default: "Contena",
      },
    });

    // ASSERT
    expect(screen.getByRole("link")).toHaveTextContent("Contena");
  });

  it("passes route objects to router-link without rendering them as href attributes", async () => {
    const route = {
      name: "ct.users.permissions.user.detail",
      params: { id: "user-id" },
    };
    const RouterLinkStub = defineComponent({
      props: {
        to: {
          type: Object,
          required: true,
        },
      },
      template: '<a data-testid="router-link"><slot /></a>',
    });

    render(MtLink, {
      props: {
        as: markRaw(RouterLinkStub),
        to: route,
      },
      slots: { default: "User" },
    });

    expect(screen.getByTestId("router-link")).not.toHaveAttribute("href", "[object Object]");
  });

  it("does not redirect when clicking on a disabled link", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("link")).not.toHaveAttribute("href", "https://www.contena.cn");
  });

  it("does not emit a click event when clicking on a disabled link", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
        disabled: true,
        onClick: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("link"));

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("announces the link as disabled when it is disabled", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("link")).toHaveAttribute("aria-disabled", "true");
  });

  it("is not possible to focus a disabled link", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
        disabled: true,
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("link")).not.toHaveFocus();
  });

  it("renders as a custom component", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "button",
      },
    });

    // ASSERT
    expect(screen.getByRole("button")).toBeVisible();
    expect(screen.getByRole("button")).toHaveRole("button");
  });

  it("emits a click event when clicking on the link", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
        onClick: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("link"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits a focus event when focusing the link", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
        // @ts-expect-error -- focus event gets added via prop fallthrough
        onFocus: handler,
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits a blur event when blurring the link", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
        // @ts-expect-error -- blur event gets added via prop fallthrough
        onBlur: handler,
      },
    });

    // ACT
    await userEvent.tab();
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("lets router-link resolve its own href instead of overriding it", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        to: { name: "ct.customer.detail", params: { id: "abc" } },
      },
      slots: {
        default: "Max Mustermann",
      },
      global: {
        components: { "router-link": RouterLinkStub },
      },
    });

    // ASSERT
    expect(screen.getByRole("link")).toHaveAttribute("href", "/resolved/ct.customer.detail");
  });

  it("does not render a route location object into the href", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "a",
        to: { name: "ct.customer.detail", params: { id: "abc" } },
      },
    });

    // ASSERT
    expect(screen.getByRole("link")).not.toHaveAttribute("href");
  });

  it("does not expose an href on a disabled router-link", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        disabled: true,
        to: { name: "ct.customer.detail", params: { id: "abc" } },
      },
      slots: {
        default: "Max Mustermann",
      },
      global: {
        components: { "router-link": RouterLinkStub },
      },
    });

    // ASSERT
    expect(screen.getByText("Max Mustermann")).not.toHaveAttribute("href");
  });

  it("does not navigate a disabled router-link on click", async () => {
    // ARRANGE
    const navigate = vi.fn();
    // Mimics router-link's click guard, which ignores default-prevented events.
    const GuardedRouterLinkStub = defineComponent({
      props: {
        to: { type: [String, Object], required: true },
      },
      setup: () => ({
        onClick: (event: MouseEvent) => {
          if (!event.defaultPrevented) navigate();
          event.preventDefault();
        },
      }),
      template: `<a href="/resolved" @click="onClick"><slot /></a>`,
    });

    render(MtLink, {
      props: {
        disabled: true,
        to: { name: "ct.customer.detail", params: { id: "abc" } },
      },
      slots: {
        default: "Max Mustermann",
      },
      global: {
        components: { "router-link": GuardedRouterLinkStub },
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Max Mustermann"));

    // ASSERT
    expect(navigate).not.toHaveBeenCalled();
  });

  it("still renders a string href when it is not a router-link", async () => {
    // ARRANGE
    render(MtLink, {
      props: {
        as: "a",
        to: "https://www.contena.cn",
      },
    });

    // ASSERT
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://www.contena.cn");
  });
});
