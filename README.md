# RDCore.VSCode

A plain VS Code client for the RDCore language server and debug adapter. It's a reference client and a test harness, not a product:
it speaks the standard Language Server Protocol 3.17 and Debug Adapter Protocol to a platform you deploy yourself, with no other
language server competing for the same files.

What VS Code shows comes from the platform: completion, signature help, hover, diagnostics, code actions, code lenses, semantic
tokens (there is no TextMate grammar), inlay hints, folding, symbols, references, rename and formatting. The debugger runs a
program of the workspace, with breakpoints, conditional breakpoints, stepping and the debug console.

## Install

1. Build the extension, or take a `rdcore-vscode-<version>.vsix` that was built for you:

   ```powershell
   npm install
   npm run package
   ```

2. Install it: in VS Code, run **Extensions: Install from VSIX...** from the Command Palette and pick the `.vsix`, or:

   ```powershell
   code --install-extension rdcore-vscode-0.1.0.vsix
   ```

## Set the platform root

The extension starts the platform found in one setting, `rdcore.platformRoot`: the folder of the platform's `rdcore.json`
manifest. For a published RDCore build, that's its `artifacts/rdcore-dev` folder:

```json
{
  "rdcore.platformRoot": "C:\\Dev\\RDCore\\artifacts\\rdcore-dev"
}
```

When the setting is missing, or the folder isn't a platform, the extension says so, with a button that opens the setting. A change
to the setting restarts the language server.

`rdcore.trace.server` (`off`, `messages` or `verbose`) traces the protocol in the **RDCore** output channel.

## Open a workspace

Open the folder of an RDCore project: the folder that has the `.rdproj` file. The extension starts when the folder has one, or when
you open a module (`.bas`, `.cls`, `.frm`, `.ctl`, `.pag`, `.dob`, `.doccls`, `.rdform`). It opens the folder of the first
`.rdproj` it finds as the platform's workspace.

`samples/hello` is a small project to try it on.

## Debug

Press F5. With no `launch.json`, the extension runs the program from its entry point: `Main`, in the one standard module that
declares it. To choose, add a configuration of type `rdcore` (the **RDCore: Launch** snippets):

```json
{
  "type": "rdcore",
  "request": "launch",
  "name": "Run the program (RDCore)",
  "module": "Program",
  "entryPoint": "Main"
}
```

`module` and `entryPoint` are optional. A platform built before November 2026 needs `module`. An `attach` configuration brings
the platform up without running a program, and the debug console runs statements as at a prompt.

## Develop

- `npm run build` bundles the extension into `dist/`; `npm run watch` keeps doing it.
- F5 in this repository starts an Extension Development Host on `samples/hello`.
- `npm run smoke` starts the language server and the debug adapter of a deployed platform with the extension's own launch code,
  sends each its `initialize` request, and prints what they answer. It then runs the sample program to a conditional breakpoint.
  It takes `--platform-root <folder>` (or `RDCORE_SMOKE_PLATFORM_ROOT`) and `--workspace <folder>`.

## How it starts the platform

- **Language server:** the executable the manifest names as `langService`, under the platform root, started in its own folder with
  `--pipe-name <name> --workspace <folder URI> --client-process-id <pid>`, and `RDCORE_PLATFORM_ROOT` set to the platform root.
  The server listens on the pipe and the extension connects to it: `\\.\pipe\<name>` on Windows, .NET's Unix domain socket in the
  temporary folder elsewhere.
- **Debug adapter:** the same executable, with `--dap --workspace <folder URI>`, speaking DAP over its standard input and output.

## Licence

GPLv3: see [LICENSE-GPLv3.md](LICENSE-GPLv3.md).
