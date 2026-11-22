// Bundles the extension into dist/extension.js, and the launch code alone into out/launch.js for the smoke script.
import * as esbuild from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const common = {
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    sourcemap: !production,
    minify: production,
    logLevel: "info",
};

const contexts = await Promise.all([
    esbuild.context({ ...common, entryPoints: ["src/extension.ts"], outfile: "dist/extension.js", external: ["vscode"] }),
    esbuild.context({ ...common, entryPoints: ["src/launch.ts"], outfile: "out/launch.js" }),
]);

if (watch) {
    await Promise.all(contexts.map(context => context.watch()));
} else {
    await Promise.all(contexts.map(context => context.rebuild()));
    await Promise.all(contexts.map(context => context.dispose()));
}
