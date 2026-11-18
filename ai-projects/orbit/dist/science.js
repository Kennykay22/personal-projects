export const LIGHT_KM_S = 299792.458;
export function travelSeconds(distanceMillionKm, mode = 'light') {
  if (!Number.isFinite(distanceMillionKm) || distanceMillionKm < 0) throw new RangeError('Distance must be a positive finite number');
  return distanceMillionKm * 1e6 / (mode === 'probe' ? 17 : LIGHT_KM_S);
}
export function durationLabel(seconds) {
  if (seconds >= 86400 * 365.25) return `${(seconds / (86400 * 365.25)).toFixed(1)} years`;
  if (seconds >= 86400) return `${(seconds / 86400).toFixed(1)} days`;
  const rounded = Math.round(seconds), hours = Math.floor(rounded / 3600), minutes = Math.floor(rounded % 3600 / 60), rest = rounded % 60;
  return hours ? `${hours}h ${minutes}m ${rest}s` : `${minutes}m ${rest}s`;
}
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export function journeyProgress(top, height, viewportHeight) { return clamp(-top / Math.max(1, height - viewportHeight), 0, 1); }
export function gravitationalForce(massKg, gravity) {
  if (!Number.isFinite(massKg) || massKg < 0 || !Number.isFinite(gravity) || gravity < 0) throw new RangeError('Mass and gravity must be nonnegative finite numbers');
  return massKg * gravity;
}
export function escapeVelocityKmS(gravity,diameterKm) { return Math.sqrt(2 * gravity * diameterKm * 500) / 1000; }
export function solarIrradiance(distanceMillionKm) { return 1361 * (149.6 / distanceMillionKm) ** 2; }
export function orbitPosition(radius,periodDays,simulatedDays,phase=0) {
  const angle=phase+simulatedDays/periodDays*Math.PI*2;
  return {x:Math.cos(angle)*radius,z:Math.sin(angle)*radius};
}
