# ORBIT / Space Observatory

An independent, buildless solar-system explorer. Serve `dist/` over HTTP. The original Site ID is retained; the audience is public at the owner’s request. Hosting is configured in `.openai/hosting.json`.

## What changed in v4

- Graphite, warm-white, and restrained amber interface. Planet selection stays above the viewer and follows the page; immersive views have their own synchronized selector.
- Continuous logarithmic planet zoom from 200 planetary radii to 0.00012 radii of altitude (about 0.77 km on Earth). Mouse, trackpad with Ctrl, pinch, keyboard, buttons, reset, and five camera presets. Adaptive near clipping and a local curved terrain patch keep the close camera outside the surface.
- Real geometric procedural relief on rocky planets: adaptive globe tessellation, a denser local patch, rock material, and desktop self-shadowing. Relief and near-surface geology are illustrative, not measured elevation or geographic land cover. Gas and ice giants use an atmospheric reference level.
- JPL approximate Keplerian elements and secular rates, referenced to the J2000 ecliptic frame, valid 1800–2050. Date and timeline controls, reverse, playback speed in days/second, tracking, two camera perspectives, orbital planes, trails, and normalized velocity directions. Physical diameters automatically select a common true-distance scale; presentation mode explicitly enlarges bodies and rescales each ellipse.
- 3D vacuum drop experiment with mass, destination, release height, replay, fall time, force, and Earth-weight ratio. Two selectable 3D worlds with true diameter ratios, synchronized/independent drag rotation, and numerical comparisons.
- Analytical chart with metric, units, linear/log scale, sorting, body filter, pair comparison, keyboard-accessible values, and linked planet selection. Negative temperatures fall back to a labeled linear scale.
- Six-mode, navigable 3D workspace: round-trip signals; dipole magnetic fields; inverse-square gravitational field and test mass; solar wind; schematic radiation belts; circular coplanar Hohmann transfers. Shared orbit/pan/zoom camera, optional WASD/Q/E free flight, reset, pause, visual density/speed, line visibility, and relevant cross-sections.
- Signals show emission, outbound travel, arrival, response, and return reception. Physical light time, separation, and animation acceleration are separate. Repeated packets, interval, trails, replay, concept probes, and movable custom sandbox nodes are supported.
- Lazy-loaded original Surveyor GLB, plus browser-local self-contained GLB/embedded glTF imports up to 15 MB. Numerical controls and the original transmission calculator survive unavailable graphics. A footer link selects basic graphics explicitly.
- Existing planet profiles, cinematic six-world flyby, mission archive, landmark camera targets, atmosphere composition, PNG capture, scientific readouts, and command palette remain available. Additional world information is in the expandable inspector below the viewer.

## Run and verify

Serve `dist/` with any static HTTP server; no dependency installation or build is needed. The engine and loader are vendored locally. UI fonts use the existing Google Fonts imports and system fallbacks.

Run:

    node --test tests/science.test.mjs tests/dynamics.test.mjs

The 16 tests cover reference orbital coordinates, Kepler residuals, elliptical radii, date-dependent separation, light time, Hohmann transfer values and reversibility, fall time, logarithmic zoom, bounded relief, gravity, irradiance, and existing calculations. JavaScript modules also pass `node --check`.

Real-browser QA used desktop and 390-pixel mobile layouts. Checked the 3D planet/terrain view, date-driven orbital rendering, linked selection, metric and temperature-unit controls, all six field modes, round-trip completion, GLB loading, global motion pause/static signal output, and basic-graphics numerical fallback. Corrected near-surface depth overlap and fallback initialization failures during QA. Physical touch hardware and broad GPU/browser compatibility were not tested; pointer/pinch support is implemented.

## Scientific and rendering limits

- Orbital results are JPL's low-accuracy approximation, not Horizons ephemerides or live tracking. Earth is the Earth–Moon barycenter; UTC is used as an approximation to TDB. Dates are bounded to the documented fit interval.
- Planet constants are rounded educational values from the existing NASA fact-sheet dataset. Gas-giant temperatures and gravity refer to atmospheric reference levels. Mean temperatures are never presented as detailed temperature maps.
- Near-surface geometry is synthetic. It is not photogrammetry, measured topography, or a Civilization-quality terrain dataset. Local adaptive meshes and clipping are used; this is not a geospatial streaming engine.
- Magnetic fields, wind obstacles, belts, and particles are schematic educational models. They are not measured magnetic fields, live space weather, or radiation safety information.
- Ping positions are sampled and frozen at emission; retarded moving-endpoint interception is not solved. Probe and custom-node positions are explicitly fictional sandbox inputs. Signal animations are accelerated.
- Transfers assume circular, coplanar heliocentric orbits and impulsive two-body burns. No launch window, rendezvous, inclination change, or full mission trajectory is solved.
- The GLB importer requires self-contained standard assets. External resources, Draco, and KTX2/Basis decoders are not enabled. Failed imports retain the concept fallback. Uploaded models are not sent to a server or persisted across reloads.
- Rendering pauses outside the viewport and in hidden tabs. Pixel ratio, tessellation, and particle density are reduced on small screens. Desktop shadows are disabled on mobile. Context loss restores numerical/fallback tools.

## Sources and assets

- Orbital elements: https://ssd.jpl.nasa.gov/planets/approx_pos.html
- Constants: https://ssd.jpl.nasa.gov/astro_par.html
- Planetary data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/
- Textures: Solar System Scope / CC BY 4.0, https://www.solarsystemscope.com/textures/
- Three.js and Earth normal/specular maps: MIT; see `dist/assets/THREE-LICENSE.txt`.
- Original spacecraft: CC0, reproducible with `node scripts/generate-craft.mjs`. See `dist/assets/ASSET-LICENSES.md`.

Independent project. Not affiliated with NASA.

## Expedition Studio / v5

Four shared-scene instruments add orbital descent (12-second camera transition to a selected latitude/longitude), local generated terrain with rover/drone views, movable interior cutting planes, a mission sketch designer with dated departure orientation and Hohmann/rocket-equation reference outputs, and a scaled eclipse geometry lab with system/observer cameras. Each instrument has playback, reset, keyboard-accessible controls, and a numerical fallback. Tool links can be shared with `?instrument=surface`, `interior`, `mission`, or `eclipse`, followed by `#expeditions`.

The old multi-screen scroll flyby was replaced by a compact 650–720 px scene with a route slider and waypoints. Reveal transitions no longer hide large sections, and the transmission viewport no longer leaves a tall sticky space.

New limitations: local terrain is synthetic and rover scale/speed are illustrative; orbital descent animates a camera rather than solving entry dynamics. Interior radii are schematic; Earth pressure/temperature are explicitly labeled toy interpolations, not measured profiles, while uncertain giant-interior profiles remain unquantified. The mission sketch does not solve continuous thrust or rendezvous: flight time, delta-v, and fuel fraction refer to its circular two-body reference only. Eclipse sizes and distances are scaled; classifications apply to the observer at the scene origin, not a real event forecast. No gravity-assist optimizer is claimed.

Additional tests in `tests/expedition.test.mjs` verify four eclipse classes, rocket-equation bounds, and terrain/slope reproducibility. Total: 19 passing calculation tests. Browser rendering and readout checks cover the new instrument scenes; exhaustive physical touch-device and maneuver-handle gesture testing remain unavailable.
Gravity comparison correction: equal-sized spherical test masses now drop simultaneously against an Earth reference, with two wireframe nets and vertical measuring grids. Mass changes force but no longer change ball radius or vacuum fall time. The net marks first contact rather than simulating an elastic catch. Replay, reset, real/half/quarter speed, and analytic time difference are provided. Basic graphics mode keeps the numerical comparison.

## Gravity Dynamics, transmission effects, and Singularity Observatory

The ball experiment now owns `#gravity-studio`, with a larger three-lane 3D bench and these additions:
1. Three independently selectable gravitational environments in one synchronized release.
2. Controlled vacuum, air, and dense-air drag chambers.
3. Aerodynamic sphere-radius adjustment (fixed spherical drag coefficient 0.47).
4. Positive or negative initial vertical velocity.
5. Adjustable impact restitution and repeated bounces.
6. Run/pause/reset and variable playback speed.
7. Single-frame stepping at 1/60 second.
8. Scrubbable recorded simulation timeline.
9. Height and signed-velocity plots with an automatically chosen time window.
10. Per-world kinetic/potential energy, velocity, height, and first-contact readouts.
11. Vacuum/drag/bounce/launch presets and trajectory markers.
12. Drag a ball before release to set height; geometry renormalizes on release.
13. CSV export of all three traces and the complete physical input parameters.

Mass and release-height controls and the wireframe nets remain. The model uses a constant local g, fixed spherical drag coefficient, a shared selected chamber density, and 240 Hz semi-implicit Euler integration sampled at 60 Hz. No buoyancy, lift, spin, varying air density, or deformable-net mechanics are solved. The impact plane uses a restitution approximation; geometry is normalized independently of the physical meters. Vacuum first-contact tests agree with the analytic result to within 0.005 seconds for the tested Earth/Mars/Jupiter cases. Export validation produced 3,604 CSV lines for a three-world 20-second experiment.

Transmission control now has a full-width scene, a lower instrument console, directional wavefronts, glow, a packet trail, an optional focused beam, intensity/style controls, an optional cinematic camera orbit, a phase/progress strip, an illustrative waveform, and a bounded emission/response/reception log. Physical c, frozen endpoint geometry, round-trip timing, and the animation multiplier remain separate. Existing five field modes and GLB support remain. Waveform and beam envelopes are illustrative visual encodings, not a radio-frequency or diffraction simulation.

A new `#singularity` section directly follows transmission. Its locally rendered black-hole illustration includes a procedural animated accretion disk, luminous arcs, particle flow, a potential-well grid, illustrative bent-light paths, matter injection, turbulence/exposure controls, mass/radius readouts, three camera presets, orbit navigation, and pause/reset. Physical readouts use a nonrotating Schwarzschild reference; the GPU image is an educational illustration, not a relativistic ray-tracing solution. Mass changes readouts while the image stays normalized in horizon radii. Mobile particle counts are lower; scene rendering pauses offscreen, in hidden tabs, and under the global motion pause. Basic graphics mode retains numerical mass/radius readouts and the numerical gravity laboratory.

Validation: all 24 calculation tests pass, including drag, mass independence in vacuum, bounce energy loss, launch, time-sample bounds, and Schwarzschild mass scaling. All application JavaScript passes syntax checks. Real-browser desktop and 390-pixel layout checks covered gravity playback/frame stepping, a drag preset, timeline reset, CSV download, the new round-trip event log, accretion shaders and mass scaling, and the basic-graphics numerical fallback. Exhaustive touch-device gesture and GPU compatibility testing remain outside this verification.

## Event Horizon / v9

The entrance now centers on a new Event Horizon experience, with a dark editorial layout, warm optical emission, a persistent chapter navigation, and an index linking the planetary, gravity, and transmission tools. The initial hero is in the HTML, so loading the graphics module does not first expose a different homepage. Planet selection belongs to the planetary section; existing instruments remain available. The command palette now finds the new sections.

Black-hole additions:
- A fragment-shader renderer numerically bends rays and samples a synthetic accretion disk at plane crossings. It produces a warped far-side image and a dark capture region. This replaces the earlier mesh-and-torus illustration.
- Lensing on/off comparison, lensed coordinate grid, disk visibility, illustrative polar jets, exposure, flow speed, matter-injection luminosity pulse, local pause, three camera presets, pointer/pinch/keyboard navigation, fullscreen, PNG capture, and three render-quality levels.
- Stellar, Sagittarius A*, and M87* mass presets with a logarithmic mass slider. Their mass values are rounded educational references. Physical horizon radius, photon-sphere radius, stable-orbit radius, and diameter light-crossing time update independently of the image's normalized horizon scale.
- Four manually advanced explanatory chapters.
- Photon experiment: a separate planar Schwarzschild null-geodesic RK4 integrator, adjustable impact parameter, capture/escape presets, neighboring-ray comparison, pointer aiming, and replay. Rays near the critical boundary remain limited by numerical resolution.
- Time experiment: two animated clocks, an adjustable stationary observer radius, proper-time ratio and gravitational-redshift readouts, pause and reset. Motion-induced time dilation is excluded.
- Tidal experiment: three selectable masses and observer radius, radial acceleration difference across two meters, and an exaggerated particle deformation illustration. No object-material or survival model is implied.
- Share links restore the selected experiment and its physical inputs. Clipboard failure exposes a selectable URL.

The GPU integration is an educational approximation, with bounded steps, finite camera distance, synthetic emissivity, approximate beaming, a thin ring-glow enhancement, and illustrative jets. It is not an observational reconstruction, precision relativistic renderer, or Kerr simulation. The separate CPU experiment uses the normalized nonrotating planar null-geodesic equation and RK4. Critical impact b = 3sqrt(3)/2 Rs. The clock uses sqrt(1-Rs/r); the tidal reference uses 2GM L/r^3. Source explanations: https://science.nasa.gov/universe/black-holes/anatomy/ and https://www.nasa.gov/universe/nasa-visualization-shows-a-black-holes-warped-world/ ; clock calculation reference: https://www.nasa.gov/wp-content/uploads/2013/05/black_hole_math.pdf .

Thirty calculation tests pass, including six new checks for black-hole reference dimensions, stationary clock limits, inverse-square mass dependence of tides at fixed Rs, photon capture boundary, reflection symmetry, and integration convergence. JavaScript syntax checks pass. Browser QA covers desktop and 390px layouts, all three experiment tabs, near-horizon clock rate and pause, mass/tidal scaling, capture and escape, lensing and quality controls, camera presets, share-link restoration, and the existing planet selector. Basic graphics retains the scientific experiments. GPU/browser compatibility and physical touch-device coverage remain limited to the available browser environment.

## ORBIT ATLAS / v10

This release expands every major instrument and introduces the Universe Atelier. A single graphics selector offers Auto, Efficient, Ultra and a 3840×2160 cap. Planet, black-hole and Universe exports render at exactly 3840×2160; realtime dimensions depend on the viewport and selected profile. Hidden instruments use smaller drawing buffers. 4K is an optional rendering/export mode, not a claim that every asset is a measured 4K reconstruction.

### Universe Atelier

Six locally generated scenes: a differential-rotation spiral galaxy (up to 120,000 stellar points plus dust), a ray-marched nebula volume, a clustered cosmic web, a deforming two-galaxy encounter, a scale-factor expansion demonstration with a selectable Hubble reference, and an animated supernova remnant. Includes orbit/pan/zoom, cinematic camera, pause, timeline scrubbing, density, arm count, illustrative wavelength palettes, dust/stars/filament/glow toggles, inspection and 4K export. Galaxy encounters, ejecta, gas and the cosmic web are artistic educational models, not N-body, radiation-hydrodynamics, catalog or cosmological data products. The expansion reference v=H0*d is a local approximation. References: https://science.nasa.gov/universe/galaxies/ and https://science.nasa.gov/universe/galaxies/types/ .

### Black holes and photons

The GPU renderer now offers more integration steps and higher output resolution. New optical experiments include disk inclination, an adjustable inner emission boundary, thermal/infrared/high-energy palettes, an orbiting hot spot, Doppler-brightness comparison, a synthetic stellar-disruption event, split-screen curved/straight paths, a close photon-pass camera and true 4K capture. These remain nonrotating-space-time approximations; disk emission and disruption are synthetic, with no Kerr spin solution.

The photon bench now has 13-ray fans and 31-ray beams, adjustable spread and wavelength, a capture-boundary scan, playback speed, scrubbing, step/pause, a straight-line comparison, grid visibility, outgoing direction, bundle counts and CSV export. Shared links retain beam mode, spread, wavelength and playback rate. Geometric vacuum lensing is achromatic; color labels wavelength rather than introducing artificial dispersion. Replay follows sample progress, not coordinate time.

### Earth and orbital engine

- Named viewer presets use physical altitudes. Orbit/atmosphere/terrain cameras frame a curved horizon. Atmosphere shading is visible inside and outside its shell; the close terrain patch retains the globe behind it. Comparison resets camera up correctly. Existing HD Earth/Mars/Jupiter texture assets remain local. Procedural terrain is synthetic.
- More detailed spacecraft and a concept orbital network add two stations, six relays/surveyors, ground sites, orbital paths, coverage guides, unobstructed links, packet motion, camera tracking and orbital time control. Orbit periods use a circular Earth reference; Earth blocks occulted links. These are enlarged fictional assets, not ISS or live satellite tracking.
- The solar-system engine adds date steps/Today, inner/outer camera shortcuts, schematic asteroid belt and Pluto reference, an optional simplified solar habitable band, a physical distance/light-time ruler and numerical orbital speed. Trail buffers are reused and DOM/date events throttled. Pluto phase and the belt are illustrative; the habitable band is not a habitability forecast.

### Gravity and expeditions

Gravity adds a spring/damper net contact model, adjustable stiffness/damping, animated pinned net geometry, illustrative ripples, impact glow and a synchronized-vacuum-landing experiment. A 960 Hz unilateral center-contact integration allows rebound; a net cannot pull an escaping ball downward. Membrane shape is driven by center sag rather than a full cloth solver, and displayed deformation is compressed. Plots/CSV sample at 60 Hz; negative height means sag below the undeformed net. CSV includes sag, spring energy, contact mode and each world's release height. The slanted plot cursor was corrected.

Expeditions no longer reset the camera during every slider adjustment. Added local world selection; detailed six-wheel rover, rocks/shadows, lidar, headlights, tracks, directional driving and sun elevation; atmospheric alternatives for giant worlds; exploded/translucent interior layers; a Kepler-timed Hohmann baseline, corrected maneuver-frame dragging, dry-mass/fuel readout and a coarse next-780-days departure scan; and eclipse disk-obscuration percentage. Launch scanning compares a circular two-body reference against approximate target positions, not a Lambert/rendezvous solution. Rover scale, local terrain and interior layers remain illustrative.

Transmission reuses endpoint and route data, reduces particle-tail allocations, throttles waveform drawing, avoids static redraws when settled, and cleans up packet/spacecraft resources on replacement. Physical signal timing and its frozen-endpoint approximation remain unchanged.

### Validation and limits

All 40 calculation tests pass. JavaScript syntax checks and the Git whitespace check pass. A Node DOM/Three.js integration harness exercised controls and frame updates in both desktop-sized and mobile-sized branches: six Universe scenes, 4K render dimensions, black-hole controls and numerical fallback, photon boundary scan, clock reference, five planet camera presets, network tracking/world switches, orbital date/ruler/scale, net/rigid gravity and timeline, all expedition tools including launch scan and giant-world guard, and all transmission modes and replay cleanup. Seventeen unique GLSL programs passed syntax parsing. This harness uses a renderer double; it does not verify actual GPU compilation, rendered pixels, browser layout, performance or touch hardware. Live browser inspection was unavailable for this release. Runtime graphics failures retain the relevant numerical/fallback tools.
