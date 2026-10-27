import meta, { type MtAvatarMeta, type MtAvatarStory } from "./mt-avatar.stories";

export default {
  ...meta,
  title: "Components/Avatar/Interaction tests",
  tags: ["!autodocs"],
} satisfies MtAvatarMeta;

export const VisualTestRenderAvatar: MtAvatarStory = {
  name: "Render avatar",
  args: {
    name: "John Doe",
  },
};

export const VisualTestAvatarSquare: MtAvatarStory = {
  name: "Render avatar in square variant",
  args: {
    name: "John Doe",
    variant: "square",
  },
};

export const VisualTestAvatarImage: MtAvatarStory = {
  name: "Render avatar with image",
  args: {
    imageUrl: "/avatar.jpg",
  },
};

export const VisualTestColorOrange: MtAvatarStory = {
  name: "Render avatar with orange color",
  args: {
    name: "Jane",
  },
};

export const VisualTestColorPink: MtAvatarStory = {
  name: "Render avatar with pink color",
  args: {
    name: "James",
  },
};

export const VisualTestColorYellow: MtAvatarStory = {
  name: "Render avatar with yellow color",
  args: {
    name: "Amanda",
  },
};

export const VisualTestColorPurple: MtAvatarStory = {
  name: "Render avatar with purple color",
  args: {
    name: "Abigail",
  },
};

export const VisualTestColorRed: MtAvatarStory = {
  name: "Render avatar with red color",
  args: {
    name: "A",
  },
};

export const VisualTestColorBlue: MtAvatarStory = {
  name: "Render avatar with blue color",
  args: {
    name: "Jo",
  },
};

export const VisualTestColorGreen: MtAvatarStory = {
  name: "Render avatar with green color",
  args: {
    name: "Joe",
  },
};
