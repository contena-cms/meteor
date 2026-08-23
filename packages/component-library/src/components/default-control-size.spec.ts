import type { Component } from "vue";
import { render } from "@testing-library/vue";
import MtBaseField from "./_internal/mt-base-field/mt-base-field.vue";
import MtButton from "./mt-button/mt-button.vue";
import MtDatepicker from "./mt-datepicker/mt-datepicker.vue";
import MtEmailField from "./mt-email-field/mt-email-field.vue";
import MtNumberField from "./mt-number-field/mt-number-field.vue";
import MtPasswordField from "./mt-password-field/mt-password-field.vue";
import MtSearch from "./mt-search/mt-search.vue";
import MtSelect from "./mt-select/mt-select.vue";
import MtTextField from "./mt-text-field/mt-text-field.vue";
import MtUrlField from "./mt-url-field/mt-url-field.vue";

describe("control sizes", () => {
  it.each<{
    component: Component;
    name: string;
    props?: Record<string, unknown>;
    selector: string;
  }>([
    {
      component: MtBaseField,
      name: "base field",
      props: { hasFocus: false },
      selector: ".mt-field--default",
    },
    { component: MtButton, name: "button", selector: ".mt-button--default" },
    {
      component: MtDatepicker,
      name: "datepicker",
      selector: ".mt-datepicker__wrapper:not(.mt-datepicker__wrapper--small)",
    },
    {
      component: MtEmailField,
      name: "email field",
      selector: ".mt-email-field__block:not(.mt-email-field__block--small)",
    },
    { component: MtNumberField, name: "number field", selector: ".mt-field--default" },
    { component: MtPasswordField, name: "password field", selector: ".mt-field--default" },
    { component: MtSearch, name: "search", selector: ".mt-search--size-default" },
    {
      component: MtSelect,
      name: "select",
      props: { modelValue: null, options: [] },
      selector: ".mt-field--default",
    },
    { component: MtTextField, name: "text field", selector: ".mt-field--default" },
    {
      component: MtUrlField,
      name: "URL field",
      selector: ".mt-url-field__block--size-default",
    },
  ])("renders $name at the default size", ({ component, props, selector }) => {
    const { container } = render(component, { props });

    expect(container.querySelector(selector)).toBeInTheDocument();
  });

  it("allows fields to opt into the small size", () => {
    const { container } = render(MtTextField, {
      props: { size: "small" },
    });

    expect(container.querySelector(".mt-field--small")).toBeInTheDocument();
  });

  it("keeps the select size aligned with its base field", () => {
    const { container } = render(MtSelect, {
      props: { modelValue: null, options: [], small: true },
    });

    expect(container.querySelector(".mt-select--small.mt-field--small")).toBeInTheDocument();
  });
});
