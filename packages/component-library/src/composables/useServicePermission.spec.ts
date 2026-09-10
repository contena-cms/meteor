import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGrant, mockIsGranted, mockIsService } = vi.hoisted(() => ({
  mockGrant: vi.fn(),
  mockIsGranted: vi.fn(),
  mockIsService: vi.fn(),
}));

vi.mock("@contena/meteor-admin-sdk/es/_private/context", () => ({
  isService: mockIsService,
}));

vi.mock("@contena/meteor-admin-sdk/es/_private/permissions", () => ({
  grant: mockGrant,
  isGranted: mockIsGranted,
}));

describe("useServicePermission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsService.mockResolvedValue(false);
    mockIsGranted.mockResolvedValue(true);
    mockGrant.mockResolvedValue(undefined);
  });

  async function mountHarness() {
    const module = await import("./useServicePermission");
    let api: ReturnType<typeof module.useServicePermission> | null = null;

    const Harness = defineComponent({
      setup() {
        api = module.useServicePermission();
        return () => h("div");
      },
    });

    const wrapper = mount(Harness);
    await flushPromises();

    return { api: api!, wrapper };
  }

  it("shows the permission UI for a service without permission", async () => {
    mockIsService.mockResolvedValue(true);
    mockIsGranted.mockResolvedValue(false);

    const { api, wrapper } = await mountHarness();

    expect(api.isService.value).toBe(true);
    expect(api.permissionGranted.value).toBe(false);
    expect(api.isShowPermissionUI.value).toBe(true);

    wrapper.unmount();
  });

  it("hides the permission UI outside a service context", async () => {
    mockIsGranted.mockResolvedValue(false);

    const { api, wrapper } = await mountHarness();

    expect(api.isShowPermissionUI.value).toBe(false);

    wrapper.unmount();
  });

  it("hides the permission UI when either state cannot be resolved", async () => {
    mockIsService.mockRejectedValue(new Error("Context unavailable"));
    mockIsGranted.mockRejectedValue(new Error("Permission unavailable"));

    const { api, wrapper } = await mountHarness();

    expect(api.isService.value).toBeNull();
    expect(api.permissionGranted.value).toBeNull();
    expect(api.isShowPermissionUI.value).toBe(false);

    wrapper.unmount();
  });

  it("grants service permissions through the private API", async () => {
    const { api, wrapper } = await mountHarness();

    await api.grant();

    expect(mockGrant).toHaveBeenCalledOnce();

    wrapper.unmount();
  });

  it("exposes loading state and ignores duplicate grant requests", async () => {
    let resolveGrant!: () => void;
    mockGrant.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveGrant = resolve;
        }),
    );

    const { api, wrapper } = await mountHarness();

    const grantPromise = api.grant();
    await flushPromises();
    const duplicateGrantPromise = api.grant();

    expect(api.isGranting.value).toBe(true);
    expect(mockGrant).toHaveBeenCalledOnce();

    resolveGrant();
    await Promise.all([grantPromise, duplicateGrantPromise]);

    expect(api.isGranting.value).toBe(false);

    wrapper.unmount();
  });

  it("resets loading state and rethrows when granting fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Grant failed");
    mockGrant.mockRejectedValueOnce(error);

    const { api, wrapper } = await mountHarness();

    await expect(api.grant()).rejects.toThrow("Grant failed");
    expect(consoleError).toHaveBeenCalledWith("Error granting permission:", error);
    expect(api.isGranting.value).toBe(false);

    consoleError.mockRestore();
    wrapper.unmount();
  });
});
