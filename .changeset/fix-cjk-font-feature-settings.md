---
"@contena-ag/meteor-component-library": patch
---

Fix simplified Chinese text rendering in traditional glyph variants: the Inter font-feature-settings ("ss01", "cv10", "cv11") on `body` are inherited by CJK fallback fonts that map the same OpenType tags to traditional/alternate glyph forms. The component library now resets `font-feature-settings` to `normal` for `:lang(zh)`, `:lang(ja)` and `:lang(ko)` content, so Chinese text always renders with the font's default (simplified) glyphs while Latin locales keep the Inter stylistic sets.
