---
"@contena-ag/meteor-component-library": patch
---

Fix simplified Chinese text being rendered with traditional glyph shapes (e.g. 登录 → 登錄). The `body` styles enabled the Inter character variant `cv10` alongside `cv11` (and previously `ss01`), and those settings are inherited by CJK fallback fonts (PingFang, Source Han Sans, Sarasa), which map the same OpenType tags to traditional glyph variants — verified with a controlled feature matrix where `cv10` alone reproduced the traditional rendering while `ss01` and `cv11` did not. `cv10` is no longer enabled document-wide; `cv11` does not affect CJK glyphs and stays enabled for Latin text. The `:lang(zh|ja|ko)` reset is kept as a safety net for documents that declare a language.
