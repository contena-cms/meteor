---
"@contena-ag/meteor-component-library": patch
---

Fix simplified Chinese text being rendered with traditional glyph shapes. The `body` styles enabled the Inter stylistic sets `ss01`, `cv10` and `cv11`, and those settings are inherited by CJK fallback fonts (PingFang, Source Han Sans, Sarasa), which map the same OpenType tags to traditional/alternate glyph variants — simplified Chinese content was displayed with traditional glyphs while the underlying text stayed simplified. `ss01` is no longer enabled document-wide; `cv10`/`cv11` do not affect CJK glyphs and stay enabled for Latin text. The `:lang(zh|ja|ko)` reset is kept as a safety net for documents that declare a language.
