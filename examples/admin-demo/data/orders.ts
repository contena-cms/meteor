import type { DemoRecord } from "~/types";

const customers = ["杭州青禾商贸", "宁波远望科技", "绍兴华锦制造", "嘉兴云辰网络", "金华新锐实业", "温州嘉和电气"];
const channels = ["直营网店", "企业采购", "渠道分销", "线下合同"];
const paymentStatuses = ["待支付", "已支付", "已退款"];
const fulfillmentStatuses = ["待处理", "处理中", "已完成", "已关闭"];

export const orders: DemoRecord[] = Array.from({ length: 36 }, (_, index) => {
  const number = index + 1;
  const amount = 680 + index * 286.5;
  return {
    id: `order-${number.toString().padStart(3, "0")}`,
    orderNo: `CT202608${number.toString().padStart(5, "0")}`,
    customer: customers[index % customers.length]!,
    channel: channels[index % channels.length]!,
    itemCount: 1 + (index % 8),
    amount,
    amountText: new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(amount),
    paymentStatus: paymentStatuses[index % paymentStatuses.length]!,
    fulfillmentStatus: fulfillmentStatuses[index % fulfillmentStatuses.length]!,
    createdAt: `2026-08-${(24 - (index % 20)).toString().padStart(2, "0")} ${(8 + (index % 10)).toString().padStart(2, "0")}:15`,
    address: "浙江省杭州市滨江区江陵路 88 号",
  };
});
