/* Página Mi reserva: selección editable, totales con descuento, fecha/lugar con mapa
   y mensaje de WhatsApp con el detalle completo. */
(function () {
  const S = window.GBS, { $, $$, esc, dinero, P, G, C } = S;
  const ESTUDIO = C.coordenadas || [10.16093, -64.69238];

  if (S.promo) {
    $("#promo-aviso").innerHTML = `<b>−${P.porcentaje}%</b><span>Tu descuento de noviembre ya está aplicado. Llega a Gaby en el mensaje con el código <strong>${esc(P.codigo)}</strong>.</span>`;
    $("#promo-aviso").hidden = false;
  }
  $("#res-cats").innerHTML = S.cats.map(S.tarjeta).join("");
  $("#res-mas").innerHTML = `Agregar más: ${S.cats.map(c => `<a href="${c.pagina}">${esc(c.nombre)}</a>`).join("")}`;
  $("#res-nota").textContent = `${G.notaPrecio} El traslado a domicilio u hotel se suma según la zona y te lo confirma Gaby.`;

  // Lista de servicios elegidos: se repinta solo cuando cambia qué servicios hay, no la cantidad
  let firmaLista = "";
  function pintarLista() {
    const sel = S.sel();
    const firma = sel.map(x => x.cod).join();
    $("#res-vacia").hidden = !!sel.length;
    $("#res-mas").hidden = $("#res-tot").hidden = !sel.length;
    if (firma !== firmaLista) {
      firmaLista = firma;
      $("#res-items").innerHTML = sel.map(x => {
        const s = S.catalogo[x.cod];
        return `<li class="res-item" data-cod="${s.cod}"><div><span class="cat-chica">${esc(s.cat.nombre)}</span><h3>${esc(s.nombre)}</h3></div><span class="res-pr"></span>${S.botonAgregar(s)}</li>`;
      }).join("");
    }
    sel.forEach(x => {
      const s = S.catalogo[x.cod], li = $(`.res-item[data-cod="${x.cod}"]`); if (!li) return;
      const lista = s.precio * x.cant, fin = S.precioFinal(s) * x.cant;
      $(".res-pr", li).innerHTML = s.precio == null ? `<span class="pr consultar">Consultar</span>` : S.conDesc(s) ? `<span class="pr"><s>${dinero(lista)}</s><b>${dinero(fin)}</b></span>` : `<span class="pr"><b>${dinero(lista)}</b></span>`;
    });
    S.pintarBotones();
    const t = S.totales();
    $("#res-tot").innerHTML = (t.ahorro > 0 ? `<dt>Precio de lista</dt><dd>${dinero(t.lista)}</dd><dt class="desc">Descuento web ${P.porcentaje}%</dt><dd class="desc">−${dinero(t.ahorro)}</dd>` : "")
      + `<dt class="tot-l">Total${t.consultar ? " (sin lo que es a consultar)" : ""}</dt><dd class="tot">${dinero(t.final)}</dd>`
      + (t.final ? `<dt class="abono">Abono para apartar (50%)</dt><dd class="abono">${dinero(t.final / 2)}</dd>` : "");
    actualizar();
  }

  // Formulario y mensaje
  const form = $("#agenda"), zona = $("#c-zona"), burbuja = $(".burbuja");
  const fechaLarga = v => { if (!v) return ""; const t = new Date(v + "T12:00:00").toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); return t.charAt(0).toUpperCase() + t.slice(1); };
  const horaTxt = v => { if (!v) return ""; const [h, m] = v.split(":").map(Number); return new Date(2000, 0, 1, h, m).toLocaleTimeString("es-VE", { hour: "numeric", minute: "2-digit" }); };
  function mensaje() {
    const sel = S.sel(), t = S.totales();
    const nombre = $("#f-nombre").value.trim();
    const lugar = document.querySelector("input[name=lugar]:checked").value;
    const dir = $("#f-zona").value.trim();
    const m = [`Hola Gaby${nombre ? ", soy " + nombre : ""}. Quiero reservar desde la web:`];
    if (S.promo && t.ahorro > 0) m.push(`Promo de noviembre ${P.codigo} (−${P.porcentaje}%)`);
    m.push("");
    sel.forEach(x => {
      const s = S.catalogo[x.cod], q = x.cant > 1 ? `${x.cant} × ` : "";
      if (s.precio == null) m.push(`• ${q}${s.nombre}: precio a consultar`);
      else if (S.conDesc(s)) m.push(`• ${q}${s.nombre}: ${dinero(s.precio * x.cant)} → ${dinero(S.precioFinal(s) * x.cant)}`);
      else m.push(`• ${q}${s.nombre}: ${dinero(s.precio * x.cant)}`);
    });
    m.push("");
    if (t.ahorro > 0) { m.push(`Precio de lista: ${dinero(t.lista)}`); m.push(`Descuento web ${P.porcentaje}%: −${dinero(t.ahorro)}`); }
    if (t.final) { m.push(`*Total: ${dinero(t.final)}* (bolívares a tasa BCV)`); m.push(`Abono del 50% para apartar: ${dinero(t.final / 2)}`); }
    m.push("");
    if ($("#f-fecha").value) m.push(`Fecha: ${fechaLarga($("#f-fecha").value)}`);
    if ($("#f-hora").value) m.push(`Debo estar lista a las: ${horaTxt($("#f-hora").value)}`);
    m.push(`Lugar: ${lugar}${lugar !== "En el estudio" && dir ? " (" + dir + ")" : ""}`);
    if (lugar !== "En el estudio") {
      if (punto) m.push(`Ubicación: https://maps.google.com/?q=${punto.lat.toFixed(6)},${punto.lng.toFixed(6)} (a ${kmTxt(distancia(punto))} del estudio en línea recta)`);
      m.push("¿Cuánto sería el traslado?");
    }
    if ($("#f-nota").value.trim()) m.push(`Nota: ${$("#f-nota").value.trim()}`);
    const o = S.origen(); if (o) m.push(`Te encontré por: ${o.src}${o.camp ? " (" + o.camp + ")" : ""}`);
    return m.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  let pulso;
  function actualizar() {
    const hay = S.sel().length;
    const txt = mensaje();
    $("#vista-msj").textContent = hay ? txt : "Elige al menos un servicio para armar tu mensaje.";
    $("#vista-hora").textContent = new Date().toLocaleTimeString("es-VE", { hour: "numeric", minute: "2-digit" });
    const env = $("#f-enviar");
    env.href = hay ? S.wa(txt) : "#"; env.setAttribute("aria-disabled", hay ? "false" : "true");
    const domicilio = $("#f-lugar-domicilio").checked;
    zona.inert = !domicilio;
    if (domicilio) abrirMapa();
    const faltan = [!hay && "un servicio", !$("#f-fecha").value && "la fecha", !$("#f-nombre").value.trim() && "tu nombre", domicilio && !punto && "el punto en el mapa"].filter(Boolean);
    $("#f-ayuda").innerHTML = faltan.length ? `Para que Gaby te responda más rápido, agrega <b>${faltan.join(", ").replace(/, ([^,]*)$/, " y $1")}</b>.` : "Se abre WhatsApp con tu mensaje listo. Solo tienes que tocar enviar.";
    clearTimeout(pulso); burbuja.classList.add("late"); pulso = setTimeout(() => burbuja.classList.remove("late"), 450);
  }
  form.addEventListener("input", actualizar);
  form.addEventListener("change", actualizar);
  form.addEventListener("submit", e => e.preventDefault());
  $("#f-enviar").addEventListener("click", e => { if (!S.sel().length) { e.preventDefault(); $("#res-items").scrollIntoView({ behavior: "smooth", block: "center" }); } else S.toast("Abriendo WhatsApp con tu reserva…"); });
  if (matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
    form.addEventListener("pointermove", e => { const r = form.getBoundingClientRect(); form.style.setProperty("--mx", (e.clientX - r.left) + "px"); form.style.setProperty("--my", (e.clientY - r.top) + "px"); });
  }

  // Mapa del domicilio (Leaflet + OpenStreetMap, sin clave). Se carga solo al elegir domicilio.
  let punto = null, mapa = null, marcador = null, cargando = null, zonaAuto = false;
  const rad = x => x * Math.PI / 180;
  const distancia = p => { const R = 6371, dLat = rad(p.lat - ESTUDIO[0]), dLng = rad(p.lng - ESTUDIO[1]); const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(ESTUDIO[0])) * Math.cos(rad(p.lat)) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const kmTxt = km => km < 1 ? `${Math.round(km * 1000)} m` : `${km.toLocaleString("es-VE", { maximumFractionDigits: 1 })} km`;
  const estado = html => { $("#m-estado").innerHTML = html; };
  function cargarLeaflet() {
    if (window.L) return Promise.resolve();
    if (cargando) return cargando;
    cargando = new Promise((ok, mal) => {
      const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(css);
      const js = document.createElement("script"); js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; js.onload = ok; js.onerror = mal; document.head.appendChild(js);
    });
    return cargando;
  }
  function marcar(lat, lng, centrar) {
    punto = { lat, lng };
    if (!marcador) {
      marcador = L.marker([lat, lng], { draggable: true, keyboard: true, title: "Punto del servicio", icon: L.divIcon({ className: "", html: '<div class="pin"></div>', iconSize: [0, 0] }) }).addTo(mapa);
      marcador.on("dragend", () => { const p = marcador.getLatLng(); marcar(p.lat, p.lng, false); });
    } else marcador.setLatLng([lat, lng]);
    if (centrar) mapa.setView([lat, lng], Math.max(mapa.getZoom(), 16));
    estado(`Punto marcado a <b>${kmTxt(distancia(punto))}</b> del estudio en línea recta. Puedes arrastrarlo para ajustarlo.`);
    rellenarZona(lat, lng);
    actualizar();
  }
  async function rellenarZona(lat, lng) {
    const z = $("#f-zona");
    if (z.value.trim() && !zonaAuto) return;
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=17&accept-language=es&lat=${lat}&lon=${lng}`).then(r => r.json());
      const a = r.address || {};
      const txt = [a.road, a.neighbourhood || a.suburb || a.quarter, a.city || a.town || a.village].filter(Boolean).join(", ");
      if (txt && (!z.value.trim() || zonaAuto)) { z.value = txt; zonaAuto = true; actualizar(); }
    } catch (e) {}
  }
  async function abrirMapa() {
    if (mapa) { setTimeout(() => mapa.invalidateSize(), 420); return; }
    try { await cargarLeaflet(); } catch (e) { estado("No se pudo cargar el mapa. Escribe la dirección y Gaby la ubica."); return; }
    if (mapa) return;
    mapa = L.map("mapa", { zoomControl: true, scrollWheelZoom: false, tap: true }).setView(ESTUDIO, 13);
    mapa.attributionControl.setPrefix(false);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(mapa);
    L.marker(ESTUDIO, { interactive: false, keyboard: false, icon: L.divIcon({ className: "", html: '<div class="pin-estudio">GB</div>', iconSize: [0, 0] }) }).addTo(mapa);
    mapa.on("click", e => marcar(e.latlng.lat, e.latlng.lng, false));
    setTimeout(() => mapa.invalidateSize(), 420);
  }
  async function buscar() {
    const q = $("#f-zona").value.trim();
    if (!q) { $("#f-zona").focus(); return; }
    zonaAuto = false;
    estado("Buscando…");
    try {
      await abrirMapa();
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ve&accept-language=es&viewbox=-65.1,10.45,-64.3,9.95&q=${encodeURIComponent(q)}`).then(r => r.json());
      if (!r.length) { estado("No encontré esa dirección. Toca el mapa para marcar el punto."); return; }
      const z = $("#f-zona").value; marcar(+r[0].lat, +r[0].lon, true); $("#f-zona").value = z;
    } catch (e) { estado("No pude buscar ahora. Toca el mapa para marcar el punto."); }
  }
  $("#m-buscar").addEventListener("click", buscar);
  $("#f-zona").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); buscar(); } });
  $("#f-zona").addEventListener("input", () => { zonaAuto = false; });
  $("#m-yo").addEventListener("click", () => {
    if (!navigator.geolocation) { estado("Tu teléfono no permite compartir la ubicación. Toca el mapa para marcar el punto."); return; }
    estado("Buscando tu ubicación…");
    navigator.geolocation.getCurrentPosition(
      async pos => { await abrirMapa(); marcar(pos.coords.latitude, pos.coords.longitude, true); },
      () => estado("No pude obtener tu ubicación. Revisa el permiso del navegador o toca el mapa."),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  });

  S.alCambiar(pintarLista);
  pintarLista();
  S.avisar();
})();
