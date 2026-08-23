export default defineAppConfig({
  seo: {
    title: "Meteor Design System",
    description:
      "Meteor is Contena's open-source design system that drives our commerce solutions.",
  },
  navigation: {
    // Scope the docs sidebar to the current top-level section only.
    sub: "aside",
  },
  assistant: {
    floatingInput: false,
    explainWithAi: false,
  },
  header: {
    title: "Meteor Design System",
    logo: {
      light: "/contena-meteor-logo.svg",
      dark: "/contena-meteor-logo.svg",
      alt: "Contena Design",
      class: "h-7",
      favicon: "/contena-signet.svg",
      brandAssetsUrl: "https://brand.contena.cn",
    },
  },
  toc: {
    bottom: {
      title: "Useful resources",
      links: [
        {
          label: "Contena docs",
          to: "https://developer.contena.cn/",
          target: "_blank",
        },
        {
          label: "Admin SDK docs",
          to: "https://developer.contena.cn/resources/admin-extension-sdk/",
          target: "_blank",
        },
        {
          label: "Brand guidelines",
          to: "https://brand.contena.cn/",
          target: "_blank",
        },
      ],
    },
  },
  github: {
    url: "https://github.com/contena/meteor",
    branch: "main",
    rootDir: "apps/docs",
  },
  storybook: {
    // Base URL of the deployed component-library Storybook. Component pages link
    // to their autodocs page here (see DocsPageHeaderLinks.vue).
    url: "https://storybook.meteor.contena.cn",
  },
  ui: {
    colors: {
      primary: "brand",
      secondary: "purple",
      success: "green",
      info: "blue",
      warning: "orange",
      error: "red",
      neutral: "zinc",
    },
    pageHeader: {
      slots: {
        root: "border-b-0 pb-0",
        headline: "hidden",
        description: "hidden",
      },
    },
    contentToc: {
      compoundVariants: [
        {
          active: true,
          class: {
            link: "text-[var(--color-text-primary-default)]",
          },
        },
      ],
      defaultVariants: {
        highlightVariant: "straight",
        highlightColor: "neutral",
      },
    },
  },
});
