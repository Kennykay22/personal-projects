# ORBIT — Space Observatory

An independent interactive space website, developed with AI assistance using OpenAI Codex.

**[Explore the live website](https://orbit-atlas-nasa-explorer.longalbum.chatgpt.site/)**

## Explore

- Black-hole lensing, accretion disks, stellar disruption, and photon experiments.
- Six Universe scenes: spiral galaxy, nebula, cosmic web, galactic encounter, expansion, and supernova.
- Eight planetary worlds, close-up terrain, atmosphere views, and an Earth satellite/station network.
- Orbital engine, distance rulers, gravity comparisons with spring-damper nets, and transmission tools.
- Surface rovers, planetary interiors, mission sketches, eclipse geometry, and optional 4K image export.

## Run locally

Requires Node.js 22 or newer. From this project folder:

```sh
npm start
```

Open [localhost:4173](http://localhost:4173/).

To use another port in PowerShell:

```powershell
$env:PORT = '4174'
npm start
```

This is a buildless HTML/CSS/JavaScript project. No npm dependencies need to be installed. Three.js and the required texture assets are included in `dist/assets/`; fonts have system fallbacks.

## Verify

```sh
npm test
```

The 40 calculation tests cover orbital approximations, gravity and net contact, photon capture, time dilation, eclipse geometry, satellite visibility, and related model behavior.

## Structure

```text
dist/                  Website source and static assets
scripts/serve.mjs      Local development server
scripts/generate-craft.mjs
                       Generator for the original concept spacecraft
tests/                 Calculation tests
TECHNICAL-NOTES.md      Implementation history, validation and model limits
```

## Models and attribution

The website mixes numerical educational approximations with illustrative graphics. It is not live telemetry, a precision mission planner, or an observational reconstruction. Terrain, spacecraft networks, galaxy scenes, and several optical effects are synthetic. See [technical notes](TECHNICAL-NOTES.md) for the model assumptions and verification limits.

Planet textures are credited to Solar System Scope under CC BY 4.0. Three.js and related loader code retain their MIT notices. See [asset attribution](dist/assets/ASSET-LICENSES.md) and [Three.js license](dist/assets/THREE-LICENSE.txt).

The running website is hosted separately. Hosting account metadata and deployment credentials are not included in this repository. Changes pushed here do not automatically deploy to the live website.

Independent project; not affiliated with NASA.
