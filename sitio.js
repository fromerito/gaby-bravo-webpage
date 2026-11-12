/* Gaby Bravo · lógica compartida de la web (todas las páginas).
   - Promoción: se activa sola entre promo.desde y promo.hasta (hora de Venezuela).
   - Selección de servicios: se guarda en el navegador y se mantiene al pasar de una página a otra.
   - Cabecera, menú del teléfono, cinta de la promo y barra inferior con el total. */
(function () {
  const G = window.GB, C = G.contacto, P = G.promo || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dinero = n => { const v = Math.round(n * 100) / 100; return "$" + v.toLocaleString("es-VE", { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 }); };
  const wa = t => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`;
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // Promoción (fecha de Venezuela, UTC-4)
  const hoyVE = () => new Date(Date.now() - 4 * 3600e3).toISOString().slice(0, 10);
  const promo = !!(P.activa && P.porcentaje > 0 && hoyVE() >= (P.desde || "0000") && hoyVE() <= (P.hasta || "9999"));
  const cats = G.categorias.filter(c => c.web !== false);
  const catalogo = {};
  G.categorias.forEach(c => c.servicios.forEach(s => { catalogo[s.cod] = Object.assign({}, s, { cat: c }); }));
  // Peinado para acompañantes: precio del servicio base con descuento, solo junto a novia o quinceañera
  const A = G.acompanantes && G.acompanantes.activa && catalogo[G.acompanantes.base] ? G.acompanantes : null;
  if (A) {
    const b = catalogo[A.base];
    catalogo[A.cod] = Object.assign({}, b, { cod: A.cod, nombre: A.nombre, precio: Math.round(b.precio * (100 - A.porcentaje)) / 100, precioLista: b.precio, acomp: true, detalle: "", duracion: "", cat: Object.assign({}, b.cat, { nombre: "Acompañantes" }) });
  }
  // El descuento NO va por servicio: se aplica al total, y solo si la fecha del evento cae en el rango.
  const eventoEnPromo = fecha => !!(promo && fecha && fecha >= (P.eventoDesde || P.desde) && fecha <= (P.eventoHasta || P.hasta));
  const conDesc = () => false;
  const precioFinal = s => s.precio;
  const desde = c => { const v = c.servicios.filter(s => s.precio != null); if (!v.length) return null; const s = v.reduce((a, b) => (b.precio < a.precio ? b : a)); return { lista: s.precio, final: s.precio }; };
  const precioHTML = (s, n) => s.precio == null ? `<span class="pr consultar">Consultar</span>`
    : s.precioLista ? `<span class="pr"><s>${dinero(s.precioLista * (n || 1))}</s><b>${dinero(s.precio * (n || 1))}</b><em>−${A.porcentaje}%</em></span>`
    : `<span class="pr"><b>${dinero(s.precio * (n || 1))}</b></span>`;

  // Selección (varias páginas, varios servicios)
  let sel = LS.get("gb-seleccion", []).filter(x => catalogo[x.cod] && x.cant > 0);
  const subs = [];
  const avisar = () => subs.forEach(f => f());
  const guardar = () => { LS.set("gb-seleccion", sel); avisar(); };
  const cant = cod => (sel.find(x => x.cod === cod) || {}).cant || 0;
  const fijar = (cod, n) => {
    const i = sel.findIndex(x => x.cod === cod);
    n = Math.max(0, Math.min(20, n));
    if (!n) { if (i >= 0) sel.splice(i, 1); }
    else if (i >= 0) sel[i].cant = n; else sel.push({ cod, cant: n });
    // Sin novia ni quinceañera, los peinados de acompañantes pasan a precio normal
    if (A && cant(A.cod) && !conAcomp()) { const k = cant(A.cod); sel = sel.filter(x => x.cod !== A.cod); const j = sel.findIndex(x => x.cod === A.base); if (j >= 0) sel[j].cant += k; else sel.push({ cod: A.base, cant: k }); }
    guardar();
  };
  const conAcomp = () => !!A && A.con.some(c => cant(c) > 0);
  // Recuadro que ofrece los peinados de acompañantes
  const ofertaAcomp = () => !A ? "" : `<div class="acomp">
      <div class="acomp-txt"><b>${esc(A.titulo)}</b><span>${esc(A.texto)}</span>${precioHTML(catalogo[A.cod])}</div>
      ${botonAgregar(catalogo[A.cod])}
    </div>`;
  const vaciar = () => { sel = []; guardar(); };
  // totales(fecha): con la fecha del evento dentro de la promo, descuenta el % del total en conjunto
  const totales = fecha => {
    const t = { lista: 0, final: 0, ahorro: 0, consultar: 0, n: 0, promo: false };
    sel.forEach(x => { const s = catalogo[x.cod]; t.n += x.cant; if (s.precio == null) { t.consultar++; return; } t.lista += s.precio * x.cant; });
    t.promo = eventoEnPromo(fecha) && t.lista > 0;
    t.ahorro = t.promo ? Math.round(t.lista * P.porcentaje) / 100 : 0;
    t.final = Math.round((t.lista - t.ahorro) * 100) / 100; return t;
  };
  addEventListener("storage", e => { if (e.key === "gb-seleccion") { sel = LS.get("gb-seleccion", []).filter(x => catalogo[x.cod] && x.cant > 0); avisar(); } });

  // Origen de la visita (anuncios): se recuerda para incluirlo en el mensaje
  try {
    const u = new URLSearchParams(location.search);
    const src = u.get("utm_source") || (u.get("fbclid") ? "facebook/instagram" : "");
    if (src) LS.set("gb-origen", { src, camp: u.get("utm_campaign") || "", t: Date.now() });
  } catch (e) {}
  const origen = () => { const o = LS.get("gb-origen", null); return o && Date.now() - o.t < 30 * 864e5 ? o : null; };

  // Botón Agregar / contador para un servicio
  const iconoPapelera = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';
  const botonAgregar = s => `<div class="agregar" data-cod="${s.cod}">
      <button type="button" class="ag-btn" data-ag="add">${s.precio == null ? "Agregar a mi consulta" : "Agregar"}</button>
      <div class="ag-paso" role="group" aria-label="Cantidad de ${esc(s.nombre)}"><button type="button" data-ag="-1"></button><output aria-live="polite">0</output><button type="button" data-ag="1" aria-label="Agregar otro">+</button></div>
    </div>`;
  const pintarBotones = () => $$(".agregar").forEach(el => {
    const n = cant(el.dataset.cod), s = catalogo[el.dataset.cod];
    el.classList.toggle("en", n > 0);
    $("output", el).textContent = n;
    const m = $('[data-ag="-1"]', el); m.innerHTML = n > 1 ? "−" : iconoPapelera; m.setAttribute("aria-label", n > 1 ? "Quitar uno" : "Quitar " + s.nombre);
  });
  let tToast;
  const toast = (txt, conEnlace) => {
    let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = `<span>${esc(txt)}</span>${conEnlace ? '<a href="reservar.html">Ver mi selección</a>' : ""}`;
    t.classList.add("ver"); clearTimeout(tToast); tToast = setTimeout(() => t.classList.remove("ver"), txt.length > 50 ? 4200 : 2600);
  };
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-ag]"); if (!b) return;
    const el = b.closest(".agregar"), cod = el.dataset.cod, s = catalogo[cod], n = cant(cod);
    if (b.dataset.ag === "add") { fijar(cod, 1); toast(A && A.con.includes(cod) && !cant(A.cod) ? `Agregado: ${s.nombre}. Si peinamos a tu mamá o cortejo, tienen ${A.porcentaje}% de descuento.` : `Agregado: ${s.nombre}`, !document.body.dataset.pagina.startsWith("reservar")); }
    else fijar(cod, n + (+b.dataset.ag));
    const o = $("output", el); o.classList.remove("salta"); void o.offsetWidth; o.classList.add("salta");
  });
  subs.push(pintarBotones);

  // Cinta de la promoción
  const cinta = $("#cinta");
  if (cinta && promo) { $("#cinta-txt").textContent = P.cinta || `${P.porcentaje}% de descuento reservando desde la web`; cinta.hidden = false; }

  // Cabecera: flotante al bajar, página actual, contador
  const cab = $("#cab"), hoja = $("#hoja");
  const alBajar = () => cab && cab.classList.toggle("flota", scrollY > 24);
  addEventListener("scroll", alBajar, { passive: true }); alBajar();
  const pag = document.body.dataset.pagina || "";
  $$(".cab nav a, .hoja nav a").forEach(a => { if (a.getAttribute("href") === pag + ".html") a.setAttribute("aria-current", "page"); });
  const pintarCuenta = () => { const t = totales(); $$(".cuenta").forEach(c => { c.textContent = t.n; c.hidden = !t.n; }); };
  subs.push(pintarCuenta);
  if (hoja) {
    $("#hoja-precios").innerHTML = cats.map(c => { const d = desde(c); return `<a href="${c.pagina}"><span>${esc(c.nombre)}</span><small>${d ? "desde " + dinero(d.final) : "Consultar"}</small></a>`; }).join("");
    const abrirMenu = si => { hoja.classList.toggle("abierta", si); hoja.inert = !si; document.body.classList.toggle("sin-scroll", si); $("#menu-abrir").setAttribute("aria-expanded", si); if (si) $("#menu-cerrar").focus(); else $("#menu-abrir").focus(); };
    $("#menu-abrir").addEventListener("click", () => abrirMenu(true));
    $("#menu-cerrar").addEventListener("click", () => abrirMenu(false));
    $$("a", hoja).forEach(a => a.addEventListener("click", () => { hoja.classList.remove("abierta"); hoja.inert = true; document.body.classList.remove("sin-scroll"); $("#menu-abrir").setAttribute("aria-expanded", "false"); }));
    addEventListener("keydown", e => { if (e.key === "Escape" && hoja.classList.contains("abierta")) abrirMenu(false); });
  }
  $$(".js-wa").forEach(a => { a.href = wa(a.dataset.msg || "Hola Gaby, tengo una pregunta."); a.target = "_blank"; a.rel = "noopener"; });

  // Barra inferior con la selección
  const bolsa = $("#bolsa");
  const pintarBolsa = () => {
    if (!bolsa) return;
    const t = totales();
    bolsa.classList.toggle("vacia", !t.n);
    document.body.classList.toggle("con-bolsa", !!t.n || bolsa.dataset.siempre === "1");
    const ir = $("#bolsa-ir");
    if (t.n) { ir.href = "reservar.html"; ir.textContent = "Continuar"; } else { ir.href = bolsa.dataset.vacioHref; ir.textContent = bolsa.dataset.vacioTxt; }
    if (!t.n) { $("#bolsa-txt").innerHTML = promo ? `<b>−${P.porcentaje}%</b> en eventos de noviembre` : "Elige tus servicios"; return; }
    $("#bolsa-txt").innerHTML = `<small>${t.n} ${t.n === 1 ? "servicio" : "servicios"}${t.consultar ? " · " + t.consultar + " por consultar" : ""}</small><b>${dinero(t.lista)}</b>${promo && t.lista ? `<em>−${P.porcentaje}% si tu evento es en noviembre</em>` : ""}`;
  };
  subs.push(pintarBolsa);

  const fechaLarga = iso => new Date(iso + "T12:00:00").toLocaleDateString("es-VE", { day: "numeric", month: "long" });
  const chica = src => String(src || "").replace("fotos/", "fotos/sm/");
  const enPromo = () => promo;
  const tarjeta = c => {
    const d = desde(c);
    const p = !d ? "Consultar" : `desde <b>${dinero(d.lista)}</b>`;
    return `<a class="tcat" href="${c.pagina}"><img src="${chica(c.tarjeta || c.foto)}" alt="" loading="lazy">
      <span class="tcat-txt"><span class="tcat-s">${esc(c.script)}</span><span class="tcat-n">${esc(c.titulo2 || c.nombre)}</span><span class="tcat-p">${p}</span></span>
      ${enPromo(c) && d ? `<span class="tcat-sello">−${P.porcentaje}%</span>` : ""}</a>`;
  };
  const anio = $("#anio"); if (anio) anio.textContent = new Date().getFullYear();
  window.GBS = { G, C, P, $, $$, esc, dinero, wa, LS, promo, fechaLarga, chica, enPromo, tarjeta, cats, catalogo, conDesc, precioFinal, precioHTML, eventoEnPromo, desde, cant, fijar, vaciar, totales, sel: () => sel, alCambiar: f => subs.push(f), avisar, botonAgregar, pintarBotones, toast, origen, A, conAcomp, ofertaAcomp };
  document.addEventListener("DOMContentLoaded", avisar);
  if (document.readyState !== "loading") setTimeout(avisar);
})();
