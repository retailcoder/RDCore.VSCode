// The tests of npm test, with node's test coverage: the code they load (out/launch.js, built by esbuild.mjs with its source map) is
// counted in the files of src/ it was bundled from. The report is printed, and written to lcov.info for the coverage badge (build.yml).
//
// npm run coverage

import { spawnSync } from "node:child_process";

const steps = [
    ["esbuild.mjs"],
    [
        "--test",
        "--enable-source-maps",
        "--experimental-test-coverage",
        "--test-coverage-exclude=test/**",
        "--test-reporter=spec",
        "--test-reporter-destination=stdout",
        "--test-reporter=lcov",
        "--test-reporter-destination=lcov.info",
        "test/*.test.mjs",
    ],
];

for (const args of steps) {
    const { status } = spawnSync(process.execPath, args, { stdio: "inherit" });
    if (status !== 0) {
        process.exit(status ?? 1);
    }
}
