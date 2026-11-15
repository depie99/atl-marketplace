# Agent Trust Ladder — Plugin Marketplace

Public distribution of the **Agent Trust Ladder (ATL)** plugin: evidence-gated engineering
skills, persistent tasks, bounded execution, and a local Control Plane for coding-agent
harnesses.

This repository is a plugin marketplace. Every release ships prebuilt plugin bundles for
each supported harness — no build step required on your side.

| Directory | Harness |
|---|---|
| [`zcode/`](zcode/) | ZCode Desktop |
| [`claude/`](claude/) | Claude Code |
| [`codex/`](codex/) | Codex CLI |
| [`cursor/`](cursor/) | Cursor |
| [`gemini/`](gemini/) | Gemini CLI |
| [`deepseek/`](deepseek/) | DeepSeek Harness (`dsh`) |
| [`universal/`](universal/) | Any harness with local MCP tools |

DeepSeek release: **0.6.12**, with an embedded Control Plane whose workspace reopens
automatically after tab switches and reloads and recovers from a dead control plane.
Other harness bundles: **0.6.10**.

Project home and documentation: [depie99/Agent-Trust-Ladder](https://github.com/depie99/Agent-Trust-Ladder)
· [Docs site](https://depie99.github.io/Agent-Trust-Ladder/)

## Install

### ZCode Desktop

```text
/plugin marketplace add depie99/atl-marketplace
/plugin install agent-trust-ladder@atl-marketplace
```

Restart ZCode after installing. ATL sessions show the full Control Plane in the plugin panel;
other sessions can open the bundled browser UI.

### Claude Code

```text
/plugin marketplace add depie99/atl-marketplace
/plugin install agent-trust-ladder@atl-marketplace
```

### DeepSeek Harness

`dsh plugin` forwards to pnpm, so install straight from this repository:

```sh
dsh plugin --profile web add "github:depie99/atl-marketplace#path:deepseek"
```

Restart or reload DeepSeek after upgrading. Select **ATL** in the sidebar, or open
**Plugins → @depie99/atl-plugin → Open Control Plane**. Enter the absolute project
directory on the machine running DeepSeek. The complete ATL interface opens inside
the harness, including Tasks and Plan Studio. Opening prepares project state and
starts no workers. The panel requires the authenticated owner connection.

Use the package specification above in DeepSeek's Add plugin dialog. The repository
root is a marketplace catalog for other harnesses; the DeepSeek package lives in
`deepseek/`. If an earlier attempt left an unresolved `atl-marketplace` bundle, remove
that entry with `dsh plugin --profile web remove atl-marketplace`, then install again.

### Codex CLI, Cursor, Gemini CLI

Copy the matching directory (`codex/`, `cursor/`, `gemini/`) into your harness's plugin
folder, or clone this repo and follow the harness-specific manifest inside:

```sh
git clone --depth 1 https://github.com/depie99/atl-marketplace.git
```

- Codex: [`codex/.codex-plugin/plugin.json`](codex/.codex-plugin/plugin.json)
- Cursor: [`cursor/.cursor-plugin/plugin.json`](cursor/.cursor-plugin/plugin.json)
- Gemini CLI: [`gemini/gemini-extension.json`](gemini/gemini-extension.json)

### Skills only (any harness)

If you only want the ATL skills without the runtime and Control Plane:

```sh
npx skills add depie99/Agent-Trust-Ladder --all
```

## Requirements

- Node.js 22+
- Git
- A configured model provider for the harness you use (ATL execution calls your provider;
  nothing is sent anywhere else — the Control Plane runs entirely on your machine)

## Getting started

Inside the project you want ATL to manage:

```sh
atl init
atl ui --port 4317
```

Open the printed loopback URL for the Control Plane, or start an ATL session in your harness
and invoke `$atl` with the problem. Full guide:
[Getting started](https://github.com/depie99/Agent-Trust-Ladder/blob/main/README.md).

## Updating

Marketplaces cache installed versions. After a new release is announced, refresh:

- ZCode / Claude Code: `/plugin` → marketplace `atl-marketplace` → update
- DeepSeek Harness: re-run `dsh plugin add github:depie99/atl-marketplace#path:deepseek`

## Releases

Each release mirrors the build output of
[depie99/Agent-Trust-Ladder](https://github.com/depie99/Agent-Trust-Ladder) (`dist/atl-plugin-<version>`),
with marketplace manifests named `atl-marketplace`. Files are stored byte-exact so skill tree
hashes and verification tooling match the source release.

## License

MIT — see [LICENSE](LICENSE).
