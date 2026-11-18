# ORBIT · Space Observatory

**Explore the universe. Change the inputs. Discover what happens next.**

ORBIT is an interactive space observatory that brings planets, black holes, orbital mechanics, and cosmic phenomena into the browser. It combines cinematic 3D scenes with hands-on experiments, letting you move from watching a simulation to controlling it.

Built by **Kenny**, with AI assistance from **OpenAI Codex**.

[**Launch the live experience ↗**](https://orbit-atlas-nasa-explorer.longalbum.chatgpt.site/) · [Technical notes](TECHNICAL-NOTES.md) · [Asset credits](dist/assets/ASSET-LICENSES.md)

---

## The idea

Space is easier to understand when you can interact with it. What happens to a photon that passes too close to a black hole? How does the same object fall on different planets? How long does a message take to reach another world?

ORBIT turns those questions into experiments. Its visual scenes are designed to encourage exploration, while numerical readouts and model notes explain what each simulation represents.

## Explore ORBIT

| Instrument | What you can do |
| --- | --- |
| **Black Hole Observatory** | Orbit an accretion disk, compare straight and curved light paths, adjust disk tilt and emission, follow a hot spot, and trigger an illustrative stellar disruption. |
| **Relativity Lab** | Launch individual photons or ray bundles, scan the capture boundary, compare clocks near a horizon, and investigate tidal forces. |
| **Universe Atelier** | Explore six generated scenes: a spiral galaxy, stellar nursery, cosmic web, galactic encounter, expanding space, and supernova remnant. |
| **Planetary Observatory** | Explore eight planets, change viewing altitude, inspect atmosphere and terrain, and follow an Earth network of concept stations and satellites. |
| **Orbital Engine** | Control the simulation date, follow planetary orbits, compare distances and light travel times, and switch between presentation and physical scales. |
| **Gravity Dynamics** | Release identical balls in three gravitational environments, experiment with drag and launch velocity, and compare rigid impacts with spring-damper catch nets. |
| **Expedition Studio** | Drive a rover over generated terrain, inspect planetary layers, edit mission sketches, and explore eclipse geometry. |
| **Transmission Control** | Send round-trip signals and explore schematic magnetic fields, solar wind, radiation belts, gravity, and idealized orbital transfers. |

Additional tools include planetary comparisons, data charts, an exploration archive, and a six-world cinematic flyby.

## Features

- **Interactive 3D navigation:** orbit, pan, zoom, camera presets, and dedicated controls for each instrument.
- **Experiments you can replay:** pause, scrub, step through supported simulations, and compare different inputs.
- **Optional 4K image export:** capture supported planet, black-hole, and Universe views at 3840 × 2160.
- **Adjustable graphics profiles:** Auto, Efficient, Ultra, and a 4K rendering cap.
- **Shareable relativity experiments:** links preserve the selected experiment and supported settings.
- **CSV exports:** inspect gravity traces and photon bundles outside the browser.
- **Local spacecraft imports:** the transmission workspace accepts supported self-contained GLB and embedded glTF files.
- **Numerical fallbacks:** several instruments retain their calculations when advanced graphics are unavailable.

## Quick start

### Requirements

- **Node.js 22 or newer** with npm.
- A modern browser with WebGL support for the 3D scenes.

### Run from this project folder

```powershell
npm start
```

Open **[http://localhost:4173](http://localhost:4173)**.

There is **no dependency installation or build step**. The website is static HTML, CSS, and JavaScript; its Three.js engine and required texture assets are included in the repository.

### Run from the repository root

```powershell
cd ai-projects/orbit
npm start
```

The repository root also provides an `npm start` shortcut for ORBIT.

### Choose another port

If port 4173 is already in use:

```powershell
$env:PORT = '4174'
npm start
```

Press **Ctrl+C** in the terminal to stop the server.

## Controls

| Action | Control |
| --- | --- |
| Navigate between instruments | Header links or the **Explore** directory |
| Open the command palette | The **Command / K** button |
| Rotate a supported 3D scene | Click and drag |
| Pan supported workspace scenes | Shift + drag |
| Zoom a focused supported scene | `+` / `−`, pinch, or the scene's zoom controls |
| Restore a view | The instrument's reset button |
| Pause a simulation | Its playback or pause controls |

Controls vary by instrument; on-screen hints describe the available interactions.

For a lighter experience, select **Efficient** graphics or use the website's **Basic graphics** link. Higher rendering profiles and 4K exports require more GPU resources.

## Project structure

```text
orbit/
├── dist/
│   ├── index.html             # Website entry point
│   ├── app.js                 # Shared application state and planet selection
│   ├── universe.js            # Universe Atelier
│   ├── singularity.js         # Black-hole observatory
│   ├── relativity-lab.js      # Photon, clock, and tidal experiments
│   ├── precision-viewer.js    # Planetary viewer and camera controls
│   ├── orbital-network.js    # Concept stations, satellites, and links
│   ├── orbital-engine.js     # Solar-system simulation
│   ├── gravity-studio.js     # Three-world gravity laboratory
│   ├── expeditions.js        # Expedition instruments
│   ├── workspace.js          # Transmission and field tools
│   ├── graphics.js           # Shared graphics profiles and image exports
│   ├── assets/               # Local engine, textures, models, and licenses
│   └── …                     # Styling, physics helpers, and supporting modules
├── scripts/
│   ├── serve.mjs             # Dependency-free local HTTP server
│   └── generate-craft.mjs    # Original concept spacecraft generator
├── tests/                    # Calculation tests
├── package.json
└── TECHNICAL-NOTES.md         # Model assumptions and implementation history
```

## Tests and development

Run the calculation tests from this project folder:

```powershell
npm test
```

The existing suite contains **40 tests**, covering orbital approximations, photon capture, stationary-clock time dilation, eclipse geometry, net contact, satellite visibility, and other calculation helpers. These tests check numerical behavior; they do not replace visual or GPU testing.

To regenerate the included original concept spacecraft:

```powershell
npm run generate:spacecraft
```

Edit files inside `dist/`, then refresh the browser to see your changes. The local server disables caching for development.

## Science and simulation scope

ORBIT combines numerical educational models with artistic visualization. The distinction matters:

- **Planetary orbits** use JPL approximate elements within their documented date interval, rather than live ephemerides.
- **Black-hole calculations** use a nonrotating reference. The GPU imagery, disk emission, hot spots, and disruption effects include visual approximations.
- **Terrain and Universe scenes** are generated illustrations, not measured surface maps, telescope reconstructions, or full cosmological simulations.
- **Stations and satellite networks** are enlarged concept assets, not live tracking of real spacecraft.
- **Gravity nets** use a simplified spring-damper contact model with a driven visual membrane, rather than a full cloth solver.
- **Mission and transmission tools** use the assumptions described beside their controls; they are not operational mission-planning systems.

See [TECHNICAL-NOTES.md](TECHNICAL-NOTES.md) for detailed assumptions, sources, and validation limits.

## AI-assisted development

This project belongs in the repository's **AI-assisted projects** category. OpenAI Codex assisted with implementation, interface development, simulation code, debugging, and documentation. The project is maintained and directed by Kenny.

## Credits and licensing

- **Three.js and bundled loaders:** MIT; see [THREE-LICENSE.txt](dist/assets/THREE-LICENSE.txt).
- **Planet and cloud textures:** Solar System Scope, credited under CC BY 4.0.
- **Earth normal and specular maps:** Three.js examples, with their retained attribution.
- **ORBIT Surveyor spacecraft:** an original concept model, distributed under CC0 as documented in the asset credits.
- **Scientific references:** NASA Science and JPL, linked throughout the website and technical notes.

See [ASSET-LICENSES.md](dist/assets/ASSET-LICENSES.md) before reusing third-party assets. Their licenses remain separate from the project's own code; this README does not grant additional reuse rights.

## Live website and repository

The public website is hosted separately from this GitHub repository. **Pushing code to GitHub does not automatically update the live website.** Hosting account metadata and deployment credentials are excluded from this repository.

ORBIT is an independent educational project and is **not affiliated with NASA**.
