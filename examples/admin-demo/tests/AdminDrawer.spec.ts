import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AdminDrawer from "~/components/layout/AdminDrawer.vue";

describe("AdminDrawer", () => {
  it("uses accessible dialog semantics and closes with Escape", async () => {
    const wrapper = mount(AdminDrawer, {
      attachTo: document.body,
      props: { open: true, title: "编辑用户" },
      slots: { default: "表单内容" },
      global: { stubs: { MtButton: { template: "<button @click=\"$emit('click')\"><slot /></button>" }, MtIcon: true } },
    });
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    await dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(wrapper.emitted("close")).toHaveLength(1);
    wrapper.unmount();
  });
});
