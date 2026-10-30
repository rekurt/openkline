# Compiler and analysis toolchains

TypeScript 7 is installed as `typescript-native` and is invoked explicitly by the typecheck command. TypeScript 6 remains under the `typescript` package name for tools using the JavaScript compiler API (Astro Check, TypeDoc, tsup, typescript-eslint). This preserves their supported peer ranges; no peer overrides or forced installs are needed.

Main lint runs ESLint 10. The existing React recommended rules run separately with ESLint 9 in `tools/react-lint`; the root postinstall installs its checked-in lockfile. Both checks are required by `npm run lint`. React hooks and TypeScript lint remain on ESLint 10. Pages deploys only master/main builds; tag/release builds still validate and produce artifacts without attempting a deployment forbidden by environment protection.

jsdom remains on 29.x; this correction changes no dependency versions or lockfile resolutions.

The private build workspace requires Node `^22.13.0 || ^24.0.0 || >=26.0.0`, the intersection of the locked verification tools' Node engine ranges. Vitest 5 excludes Node 20 and 25; ESLint 10 raises the Node 22 minimum to 22.13.0. CI verifies Node 22 and 24, and Pages builds on Node 24. The published core package's Node runtime manifest is unchanged.
