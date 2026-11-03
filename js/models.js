/**
 * models.js — Sustituye los modelos 3D placeholder por tus .glb (comprimidos con Draco).
 *
 * Deja '' para usar el coche procedural. Con un .glb real:
 *   MODEL_URL['sf90'] = 'models/sf90.glb';
 * - Orientación esperada: frente del coche hacia +X, ruedas en el suelo (y = 0).
 * - Los materiales cuyo nombre contenga "body", "paint" o "carpaint" cambian de color con el selector.
 * - Nota: cargar .glb requiere servir la web por HTTP (no funciona abriendo el .html con doble clic).
 *
 * HDRI_URL: opcional, por defecto se usa un estudio procedural (RoomEnvironment).
 */
export const MODEL_URL = {
  '296gtb': '', sf90: '', '12cilindri': '', purosangue: '',
  revuelto: '', temerario: '', urusse: '', huracan: '',
  '911turbos': '', taycangt: '', 918: '',
};
export const DRACO_PATH = 'js/vendor/draco/';
export const HDRI_URL = '';
