import type { SlottedMeta } from "@/_internal/story-helper";
import MtAvatar from "./mt-avatar.vue";
import type { StoryObj } from "@storybook/vue3";

export type MtAvatarMeta = SlottedMeta<typeof MtAvatar, "default">;

const meta: MtAvatarMeta = {
  title: "Components/Avatar",
  component: MtAvatar,
  render: (args) => ({
    components: { MtAvatar },
    template: '<mt-avatar v-bind="args"></mt-avatar>',
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    name: "John Doe",
    size: "m",
    variant: "circle",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["2xs", "xs", "s", "m", "l"],
    },
    variant: {
      control: "select",
      options: ["circle", "square"],
    },
  },
};

export default meta;
export type MtAvatarStory = StoryObj<MtAvatarMeta>;

export const Default: MtAvatarStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar name="John Doe" size="m" variant="circle" />`,
      },
    },
  },
};

export const AllSizes: MtAvatarStory = {
  name: "Sizes",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar name="John Doe" size="2xs" />
<mt-avatar name="John Doe" size="xs" />
<mt-avatar name="John Doe" size="s" />
<mt-avatar name="John Doe" size="m" />
<mt-avatar name="John Doe" size="l" />`,
      },
    },
  },
  render: () => ({
    components: { MtAvatar },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <mt-avatar name="John Doe" size="2xs" />
        <mt-avatar name="John Doe" size="xs" />
        <mt-avatar name="John Doe" size="s" />
        <mt-avatar name="John Doe" size="m" />
        <mt-avatar name="John Doe" size="l" />
      </div>`,
  }),
};

export const WithImage: MtAvatarStory = {
  name: "With image",
  args: {
    imageUrl: "/avatar.jpg",
    name: undefined,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar image-url="/avatar.jpg" size="m" />`,
      },
    },
  },
};

export const Square: MtAvatarStory = {
  args: {
    name: "John Doe",
    variant: "square",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar name="John Doe" variant="square" size="m" />`,
      },
    },
  },
};

export const AllBackgroundColors: MtAvatarStory = {
  name: "All background colors",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-avatar name="Jane" />
<mt-avatar name="James" />
<mt-avatar name="Amanda" />
<mt-avatar name="Abigail" />
<mt-avatar name="A" />
<mt-avatar name="Jo" />
<mt-avatar name="Joe" />`,
      },
    },
  },
  render: () => ({
    components: { MtAvatar },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <mt-avatar name="Jane" />
        <mt-avatar name="James" />
        <mt-avatar name="Amanda" />
        <mt-avatar name="Abigail" />
        <mt-avatar name="A" />
        <mt-avatar name="Jo" />
        <mt-avatar name="Joe" />
      </div>`,
  }),
};
