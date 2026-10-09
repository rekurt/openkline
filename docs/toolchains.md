# Compiler and analysis toolchains

TypeScript 7 is installed as `typescript-native` and is invoked explicitly by the typecheck command. TypeScript 6 remains under the `typescript` package name for tools using the JavaScript compiler API (Astro Check, TypeDoc, tsup, typescript-eslint). This preserves their supported peer ranges; no peer overrides or forced installs are needed.

Main lint runs ESLint 10. The existing React recommended rules run separately with ESLint 9 in `tools/react-lint`; the root postinstall installs its checked-in lockfile. Both checks are required by `npm run lint`. React hooks and TypeScript lint remain on ESLint 10. Pages deploys only master/main builds; tag/release builds still validate and produce artifacts without attempting a deployment forbidden by environment protection.

jsdom stays on the supported 29.x line because jsdom 30 requires Node 22+, while the verification matrix continues to cover Node 20 and 22.

The private build workspace requires Node 20.19+, Node 22.13+, or Node 24+ (the supported tool-engine ranges). The library runtime manifest is unchanged. CI continues to verify Node 20 and 22.
