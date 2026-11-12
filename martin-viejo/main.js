/* Martín Viejo · JS vanilla, sin dependencias. */
(function () {
  "use strict";

  // ---- Configuración: sustituir antes de publicar ----------------------
  var CONFIG = {
    email: "[EMAIL]",
    // Número de WhatsApp en formato internacional sin "+" ni espacios.
    // VERIFICAR: el 974 es un fijo; si no tiene WhatsApp Business, usar el móvil del local.
    whatsapp: "34974227492"
  };

  document.documentElement.classList.add("js");

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---- Cabecera y botón flotante al hacer scroll ------------------------
  var header = document.querySelector(".header");
  var quick = document.querySelector(".quick");
  var hero = document.querySelector(".hero");

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    quick.classList.toggle("is-visible", y > (hero ? hero.offsetHeight * 0.6 : 400));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Menú móvil ------------------------------------------------------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav-toggle__label").textContent = open ? "Cerrar" : "Menú";
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", function (mq) {
    if (mq.matches) setNav(false);
  });

  // ---- Aparición lenta de bloques --------------------------------------
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // ---- Mapa bajo demanda (sin cookies de Google hasta que se pide) ------
  var mapBtn = document.getElementById("map-load");
  if (mapBtn) {
    mapBtn.addEventListener("click", function () {
      var map = document.getElementById("map");
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.google.com/maps?q=" +
        encodeURIComponent("Calle los Pirineos 15, 22004 Huesca") + "&output=embed";
      iframe.title = "Mapa: Martín Viejo, Calle los Pirineos 15, Huesca";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      map.innerHTML = "";
      map.appendChild(iframe);
    });
  }

  // ---- Formulario de reserva --------------------------------------------
  var form = document.getElementById("reserva-form");
  var errorBox = document.getElementById("form-error");
  var done = document.getElementById("form-done");
  var fecha = document.getElementById("f-fecha");

  // Fecha mínima: hoy (hora local).
  var now = new Date();
  fecha.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function formatDate(iso) {
    var p = iso.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }

  function buildMessage(data) {
    var lines = [
      "Solicitud de reserva · Martín Viejo",
      "",
      "Nombre: " + data.get("nombre").trim()
    ];
    var empresa = data.get("empresa").trim();
    if (empresa) lines.push("Empresa: " + empresa);
    lines.push(
      "Fecha: " + formatDate(data.get("fecha")),
      "Hora: " + data.get("hora"),
      "Comensales: " + data.get("comensales")
    );
    if (data.get("ocasion")) lines.push("Ocasión: " + data.get("ocasion"));
    var notas = data.get("notas").trim();
    if (notas) lines.push("Alergias / notas: " + notas);
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validación accesible: marca campos inválidos y lleva el foco al primero.
    var invalid = Array.prototype.filter.call(form.elements, function (el) {
      if (!el.willValidate) return false;
      var bad = !el.checkValidity();
      if (el.type !== "checkbox") el.setAttribute("aria-invalid", bad ? "true" : "false");
      return bad;
    });

    if (invalid.length) {
      var first = invalid[0];
      errorBox.textContent = first.type === "checkbox"
        ? "Para enviar la solicitud debe aceptar la política de privacidad."
        : "Revise los campos marcados: " + document.querySelector('label[for="' + first.id + '"]').firstChild.textContent.trim() + ".";
      errorBox.hidden = false;
      first.focus();
      return;
    }
    errorBox.hidden = true;

    var channel = (e.submitter && e.submitter.value) || "whatsapp";
    var text = buildMessage(new FormData(form));
    var url = channel === "email"
      ? "mailto:" + CONFIG.email +
        "?subject=" + encodeURIComponent("Solicitud de reserva · " + formatDate(form.fecha.value)) +
        "&body=" + encodeURIComponent(text)
      : "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);

    if (channel === "email") {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }

    form.hidden = true;
    done.hidden = false;
    done.focus();
  });

  // Limpia el estado de error al corregir.
  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) {
      e.target.setAttribute("aria-invalid", "false");
    }
  });
})();
