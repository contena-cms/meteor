import { mount } from "@vue/test-utils";
import { reactive } from "vue";
import { describe, expect, it } from "vitest";
import RecordDrawer from "~/components/shared/RecordDrawer.vue";

describe("RecordDrawer", () => {
  it("opens and saves records received as Vue reactive proxies", async () => {
    const record = reactive({
      id: "order-1",
      orderNo: "CT20260800001",
      customer: "杭州青禾商贸",
      amount: 680,
      amountText: "¥680.00",
      paymentStatus: "待支付",
      fulfillmentStatus: "待处理",
      createdAt: "2026-08-24 08:15",
    });
    const wrapper = mount(RecordDrawer, {
      props: { open: true, kind: "order", mode: "edit", record },
      global: {
        stubs: {
          AdminDrawer: { template: "<div><slot /><slot name='footer' /></div>" },
          MtButton: { template: "<button @click='$emit(\"click\")'><slot /></button>" },
          MtDatepicker: true,
          MtNumberField: true,
          MtSelect: true,
          MtTextarea: true,
          MtTextField: true,
        },
      },
    });

    await wrapper.get("button:last-child").trigger("click");

    expect(wrapper.emitted("save")?.[0]?.[0]).toMatchObject({
      id: "order-1",
      orderNo: "CT20260800001",
      customer: "杭州青禾商贸",
    });
  });
});
