/* Gaby Bravo · lógica compartida de cotizaciones
   Dos modos de enlace:
   - Corto (recomendado): la cotización se guarda en Supabase y el enlace
     queda como  sitio/c.html#k3F9QX . Se activa llenando GB.acortador en datos.js.
   - Largo (sin configurar nada): la cotización completa viaja dentro del
     enlace, codificada solo con letras, números, - y _ para que WhatsApp
     no la corte.
   Contenido v1 (antes de codificar):
     1|nombre|evento|lugar|vigencia|items|divisas|nota|emitida
     items: COD*cant*precio~COD*cant*precio   (línea libre: _Texto*cant*precio)
     fechas: AAAAMMDD */
(function () {
  const G = window.GB;
  const catalogo = {};
  G.categorias.forEach(c => c.servicios.forEach(s => { catalogo[s.cod] = Object.assign({ categoria: c.nombre }, s); }));

  const limpio = s => String(s == null ? "" : s).replace(/[|~*]/g, " ");
  const fechaCod = d => d ? d.replace(/-/g, "") : "";
  const fechaISO = c => (c && c.length === 8) ? `${c.slice(0, 4)}-${c.slice(4, 6)}-${c.slice(6, 8)}` : "";

  // base64url con UTF-8
  const b64 = s => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unb64 = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)));

  function texto(q) {
    const items = q.items.map(it => {
      const cod = it.cod && catalogo[it.cod] ? it.cod : "_" + limpio(it.nombre || "Servicio");
      return [cod, it.cant || 1, +it.precio || 0].join("*");
    }).join("~");
    return ["1", limpio(q.nombre), fechaCod(q.evento), limpio(q.lugar), fechaCod(q.vigencia), items, q.divisas || "", limpio(q.nota), fechaCod(q.emitida)].join("|");
  }
  function leerTexto(raw) {
    const p = String(raw || "").split("|");
    if (p[0] !== "1" || p.length < 6) return null;
    const items = (p[5] || "").split("~").filter(Boolean).map(x => {
      const [c, cant, precio] = x.split("*");
      if (c.startsWith("_")) return { cod: "", nombre: c.slice(1), cant: +cant || 1, precio: +precio || 0 };
      const s = catalogo[c];
      return { cod: c, nombre: s ? s.nombre : c, cant: +cant || 1, precio: +precio || 0 };
    });
    if (!items.length) return null;
    return { nombre: p[1], evento: fechaISO(p[2]), lugar: p[3], vigencia: fechaISO(p[4]), items, divisas: p[6] ? +p[6] : null, nota: p[7] || "", emitida: fechaISO(p[8]) };
  }

  // Enlace largo
  const codificar = q => "b" + b64(texto(q));
  function decodificar(hash) {
    const raw = String(hash || "").replace(/^#/, "");
    try { if (raw.startsWith("b")) return leerTexto(unb64(raw.slice(1))); } catch (e) { return null; }
    return null;
  }

  // Enlace corto (Supabase)
  const A = G.acortador || {};
  const corto = !!(A.supabaseUrl && A.supabaseKey);
  const cab = () => ({ apikey: A.supabaseKey, Authorization: "Bearer " + A.supabaseKey, "Content-Type": "application/json" });
  const idNuevo = () => { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = ""; const r = crypto.getRandomValues(new Uint8Array(6)); r.forEach(n => s += a[n % a.length]); return s; };
  async function guardarCorto(q) {
    const datos = texto(q);
    for (let i = 0; i < 3; i++) {
      const id = idNuevo();
      const r = await fetch(`${A.supabaseUrl}/rest/v1/cotizaciones`, { method: "POST", headers: Object.assign(cab(), { Prefer: "return=minimal" }), body: JSON.stringify({ id, datos }) });
      if (r.ok) return "k" + id;
      if (r.status !== 409) throw new Error("No se pudo guardar la cotización (" + r.status + ").");
    }
    throw new Error("No se pudo crear el enlace. Intenta de nuevo.");
  }
  async function leer(hash) {
    const raw = String(hash || "").replace(/^#/, "");
    if (raw.startsWith("k") && corto) {
      const r = await fetch(`${A.supabaseUrl}/rest/v1/rpc/ver_cotizacion`, { method: "POST", headers: cab(), body: JSON.stringify({ p_id: raw.slice(1) }) });
      if (!r.ok) return null;
      const d = await r.json();
      return d ? leerTexto(d) : null;
    }
    return decodificar(raw);
  }

  // Folio corto y estable a partir del contenido (no es un consecutivo).
  function folio(code) {
    if (code.startsWith("k")) return "GB-" + code.slice(1, 5);
    let h = 2166136261;
    for (let i = 0; i < code.length; i++) { h ^= code.charCodeAt(i); h = Math.imul(h, 16777619); }
    return "GB-" + (h >>> 0).toString(36).toUpperCase().slice(-4).padStart(4, "0");
  }

  const total = q => q.items.reduce((s, it) => s + it.cant * it.precio, 0);
  const dinero = n => "$" + (Math.round(n * 100) / 100).toLocaleString("es-VE", { maximumFractionDigits: 2 });
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const fechaLarga = iso => { if (!iso) return ""; const [y, m, d] = iso.split("-").map(Number); return `${d} de ${MESES[m - 1]} de ${y}`; };
  const hoyISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  const sumarDias = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

  function baseSitio() {
    if (G.sitio) return G.sitio.replace(/\/$/, "");
    return location.href.replace(/[#?].*$/, "").replace(/\/[^/]*$/, "");
  }
  const enlace = code => `${baseSitio()}/c.html#${code}`;
  const wa = (t, numero) => `https://wa.me/${numero || ""}?text=${encodeURIComponent(t)}`;

  window.GBQ = { catalogo, codificar, decodificar, leer, corto, guardarCorto, folio, total, dinero, fechaLarga, hoyISO, sumarDias, enlace, wa };
})();
