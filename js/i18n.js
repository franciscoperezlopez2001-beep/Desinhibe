/** i18n.js — textos ES / EN. Los elementos usan data-i18n="clave" y data-i18n-attr="atributo:clave;..." */
import { split } from './util.js';

const DICT = {
  es: {
    skip: 'Saltar al contenido', 'nav.home': 'Inicio', 'nav.compare': 'Comparador', 'nav.gallery': 'Galería', 'nav.contact': 'Contacto',
    'nav.menu': 'Menú', 'nav.close': 'Cerrar', 'nav.main': 'Navegación principal', 'sound.on': 'Activar sonido', 'sound.off': 'Silenciar',
    'dots.label': 'Progreso por secciones',
    'hero.eyebrow': 'Showroom digital · Edición 2026', 'hero.title': 'Tres leyendas. Una obsesión.',
    'hero.sub': 'Ferrari, Lamborghini y Porsche: la ingeniería, el diseño y la emoción de las máquinas más deseadas del planeta.',
    'hero.pick': 'Elige tu marca', 'hero.scroll': 'Desliza para explorar',
    'ferrari.gate': 'Rosso · Maranello', 'lamborghini.gate': 'Giallo · Sant’Agata', 'porsche.gate': 'Blau · Stuttgart',
    'ferrari.eyebrow': '01 — Maranello, 1947', 'ferrari.lede': 'Velocidad con alma de competición.',
    'ferrari.history': 'Enzo Ferrari fundó la marca en Maranello en 1947 para financiar su verdadera pasión: las carreras. Desde entonces ha ganado decenas de títulos en Fórmula 1 y ha convertido al Cavallino Rampante en un símbolo universal. Cada modelo hereda la tecnología y la emoción de la pista.',
    'lamborghini.eyebrow': '02 — Sant’Agata Bolognese, 1963', 'lamborghini.lede': 'Diseño que desafía las reglas.',
    'lamborghini.history': 'Ferruccio Lamborghini fundó la marca en 1963 decidido a rivalizar con Ferrari. El Miura (1966) inventó el superdeportivo de motor central y el Countach grabó su silueta en una generación. Hoy, con el Revuelto, abre su era híbrida sin perder su carácter salvaje.',
    'porsche.eyebrow': '03 — Stuttgart-Zuffenhausen, 1948', 'porsche.lede': 'Ingeniería que se conduce cada día.',
    'porsche.history': 'Ferry Porsche presentó en 1948 el 356, el primer deportivo con su apellido. En 1963 llegó el 911, un icono que lleva seis décadas evolucionando sin perder su identidad. Precisión alemana, uso diario y un palmarés que incluye Le Mans.',
    'brand.models': 'Modelos', 'brand.color': 'Color de carrocería', 'brand.power': 'Potencia', 'brand.accel': '0-100 km/h', 'brand.top': 'V. máxima',
    'unit.cv': 'CV', 'unit.s': 's', 'unit.kmh': 'km/h', 'brand.from': 'Desde', 'brand.legacy': 'Legado', 'brand.request': 'Solicitar información',
    'brand.hint': 'Arrastra para girar', 'brand.drag': 'Visor 3D: arrastra o usa las flechas del teclado para girar el coche',
    'brand.prev': 'Anterior', 'brand.next': 'Siguiente', 'brand.select': 'Ver', 'brand.carousel': 'Carrusel de modelos',
    'brand.disclaimer': 'Datos orientativos. Verifica siempre las cifras con la web oficial de la marca.',
    'cmp.eyebrow': '04 — Cara a cara', 'cmp.title': 'Comparador', 'cmp.sub': 'Pon hasta tres modelos frente a frente. En verde, el mejor valor de cada fila.',
    'cmp.model': 'Modelo', 'cmp.engine': 'Motor', 'cmp.best': 'Mejor valor',
    'gal.eyebrow': '05 — Galería', 'gal.title': 'Galería de leyendas', 'gal.prev': 'Slide anterior', 'gal.next': 'Slide siguiente', 'gal.label': 'Galería de modelos',
    'con.eyebrow': '06 — Contacto', 'con.title': 'Reserva tu visita', 'con.sub': 'Cuéntanos qué modelo te interesa y un asesor se pondrá en contacto contigo.',
    'f.name': 'Nombre completo', 'f.email': 'Correo electrónico', 'f.phone': 'Teléfono (opcional)', 'f.model': 'Modelo de interés', 'f.date': 'Fecha preferida',
    'f.msg': 'Mensaje', 'f.consent': 'Acepto la política de privacidad y el tratamiento de mis datos.', 'f.send': 'Enviar solicitud', 'f.sending': 'Enviando…',
    'f.ok': '¡Solicitud enviada! Te contactaremos en menos de 24 horas.', 'f.demo': 'Demostración: el formulario no envía datos a ningún servidor.',
    'e.name': 'Escribe tu nombre (mínimo 3 caracteres).', 'e.email': 'Introduce un correo válido.', 'e.phone': 'Teléfono no válido.', 'e.model': 'Selecciona un modelo.',
    'e.date': 'Elige una fecha futura.', 'e.consent': 'Debes aceptar para continuar.',
    'prefill': 'Hola, me gustaría recibir información sobre el {m}.',
    'ft.news': 'Newsletter', 'ft.newsSub': 'Estrenos, ediciones limitadas y eventos privados. Sin spam.', 'ft.email': 'tu@correo.com', 'ft.subscribe': 'Suscribirme',
    'ft.ok': '¡Suscripción confirmada!', 'ft.err': 'Introduce un correo válido.', 'ft.legal': 'Aviso legal', 'ft.privacy': 'Privacidad', 'ft.cookies': 'Cookies', 'ft.social': 'Redes sociales',
    'ft.copy': '© 2026 APEX Showroom. Proyecto de demostración.',
    'legal.title': 'Aviso legal', 'legal.close': 'Cerrar', 'legal.photos': 'Créditos de las fotografías (Wikimedia Commons)',
    'legal.body': 'Ferrari, Lamborghini y Porsche son marcas registradas de sus respectivos propietarios. Esta web es un proyecto de demostración, sin vinculación oficial con dichas marcas ni con sus concesionarios. Las especificaciones y precios son orientativos y proceden de fuentes públicas de prensa del motor; verifícalos en las webs oficiales. Las siluetas y modelos 3D mostrados son representaciones genéricas generadas por código; las fotografías pertenecen a sus autores y se usan bajo las licencias indicadas abajo.',
  },
  en: {
    skip: 'Skip to content', 'nav.home': 'Home', 'nav.compare': 'Compare', 'nav.gallery': 'Gallery', 'nav.contact': 'Contact',
    'nav.menu': 'Menu', 'nav.close': 'Close', 'nav.main': 'Main navigation', 'sound.on': 'Turn sound on', 'sound.off': 'Mute',
    'dots.label': 'Section progress',
    'hero.eyebrow': 'Digital showroom · 2026 Edition', 'hero.title': 'Three legends. One obsession.',
    'hero.sub': 'Ferrari, Lamborghini and Porsche: the engineering, design and emotion of the most desired machines on the planet.',
    'hero.pick': 'Choose your marque', 'hero.scroll': 'Scroll to explore',
    'ferrari.gate': 'Rosso · Maranello', 'lamborghini.gate': 'Giallo · Sant’Agata', 'porsche.gate': 'Blau · Stuttgart',
    'ferrari.eyebrow': '01 — Maranello, 1947', 'ferrari.lede': 'Speed with a racing soul.',
    'ferrari.history': 'Enzo Ferrari founded the marque in Maranello in 1947 to fund his true passion: racing. Since then it has won dozens of Formula 1 titles and turned the Prancing Horse into a universal symbol. Every model inherits the technology and emotion of the track.',
    'lamborghini.eyebrow': '02 — Sant’Agata Bolognese, 1963', 'lamborghini.lede': 'Design that defies the rules.',
    'lamborghini.history': 'Ferruccio Lamborghini founded the marque in 1963, determined to rival Ferrari. The Miura (1966) invented the mid-engine supercar and the Countach burned its silhouette into a generation. Today, with the Revuelto, it enters its hybrid era without losing its wild character.',
    'porsche.eyebrow': '03 — Stuttgart-Zuffenhausen, 1948', 'porsche.lede': 'Engineering you can drive every day.',
    'porsche.history': 'Ferry Porsche unveiled the 356 in 1948, the first sports car to carry the family name. In 1963 came the 911, an icon that has evolved for six decades without losing its identity. German precision, everyday usability and a record that includes Le Mans.',
    'brand.models': 'Models', 'brand.color': 'Body colour', 'brand.power': 'Power', 'brand.accel': '0-100 km/h', 'brand.top': 'Top speed',
    'unit.cv': 'hp', 'unit.s': 's', 'unit.kmh': 'km/h', 'brand.from': 'From', 'brand.legacy': 'Legacy', 'brand.request': 'Request information',
    'brand.hint': 'Drag to rotate', 'brand.drag': '3D viewer: drag or use the keyboard arrows to rotate the car',
    'brand.prev': 'Previous', 'brand.next': 'Next', 'brand.select': 'View', 'brand.carousel': 'Model carousel',
    'brand.disclaimer': 'Indicative data. Always check figures on the brand’s official website.',
    'cmp.eyebrow': '04 — Head to head', 'cmp.title': 'Compare', 'cmp.sub': 'Put up to three models side by side. Green marks the best value in each row.',
    'cmp.model': 'Model', 'cmp.engine': 'Engine', 'cmp.best': 'Best value',
    'gal.eyebrow': '05 — Gallery', 'gal.title': 'Gallery of legends', 'gal.prev': 'Previous slide', 'gal.next': 'Next slide', 'gal.label': 'Model gallery',
    'con.eyebrow': '06 — Contact', 'con.title': 'Book a visit', 'con.sub': 'Tell us which model you like and an advisor will get in touch.',
    'f.name': 'Full name', 'f.email': 'Email', 'f.phone': 'Phone (optional)', 'f.model': 'Model of interest', 'f.date': 'Preferred date',
    'f.msg': 'Message', 'f.consent': 'I accept the privacy policy and the processing of my data.', 'f.send': 'Send request', 'f.sending': 'Sending…',
    'f.ok': 'Request sent! We will contact you within 24 hours.', 'f.demo': 'Demo: this form does not send data to any server.',
    'e.name': 'Enter your name (at least 3 characters).', 'e.email': 'Enter a valid email.', 'e.phone': 'Invalid phone number.', 'e.model': 'Select a model.',
    'e.date': 'Pick a future date.', 'e.consent': 'You must accept to continue.',
    'prefill': 'Hi, I would like to receive information about the {m}.',
    'ft.news': 'Newsletter', 'ft.newsSub': 'Launches, limited editions and private events. No spam.', 'ft.email': 'you@email.com', 'ft.subscribe': 'Subscribe',
    'ft.ok': 'Subscription confirmed!', 'ft.err': 'Enter a valid email.', 'ft.legal': 'Legal notice', 'ft.privacy': 'Privacy', 'ft.cookies': 'Cookies', 'ft.social': 'Social media',
    'ft.copy': '© 2026 APEX Showroom. Demo project.',
    'legal.title': 'Legal notice', 'legal.close': 'Close', 'legal.photos': 'Photo credits (Wikimedia Commons)',
    'legal.body': 'Ferrari, Lamborghini and Porsche are registered trademarks of their respective owners. This website is a demonstration project with no official affiliation to those brands or their dealers. Specifications and prices are indicative and come from public automotive press sources; please verify them on the official websites. The silhouettes and 3D models shown are generic, code-generated representations; photographs belong to their authors and are used under the licences listed below.',
  },
};

let lang = 'es';
try { lang = localStorage.getItem('apex-lang') || (navigator.language || 'es').slice(0, 2); } catch (e) { /* sin storage */ }
if (!DICT[lang]) lang = 'es';

export const getLang = () => lang;
export const t = (k, vars) => {
  let s = DICT[lang][k] ?? DICT.es[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
  return s;
};
/** Elige el campo del idioma actual en un objeto {es, en}. */
export const L = (o) => (o && typeof o === 'object' ? o[lang] ?? o.es : o);

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
    if (el.hasAttribute('data-split')) split(el);
  });
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });
  document.documentElement.lang = lang;
}

export function setLang(l) {
  if (!DICT[l] || l === lang) return;
  lang = l;
  try { localStorage.setItem('apex-lang', l); } catch (e) { /* ok */ }
  applyI18n();
  document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
}
