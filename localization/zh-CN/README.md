# zh-CN localization work (client-side approach, archived)

This branch keeps the first zh-CN localization attempt, which translated text inside the addon and GlueXML. The maintainer asked for native localization in hordes-of-azeroth-server instead (issue #4), so this branch is not meant to be merged. It is kept as the source of the translations for the server-side work.

- `translations/*.json`: English to Simplified Chinese source tables. Numbers in the English text appear as `{1}`, `{2}`... in the Chinese text.
- `tools/`: the Node scripts that extracted strings, generated `VanillaBonkLocaleZhCN.lua`, subset the font and patched call sites. They resolve paths from the repo root; scratch files go to `%TEMP%/hoa-zh`.
- `GLOSSARY.md`: terminology used across all translations.

Rebuild the generated locale tables (needs `npm install` in `tools/`):

```
node localization/zh-CN/tools/build-locale.js
```
