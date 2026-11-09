/* Portada: categorías, promo, galería, pagos, políticas y contacto. */
(function () {
  const S = window.GBS, { $, esc, P, G, C } = S;

  // Enlaces viejos (#novias, #reservar…) → sus páginas nuevas
  const viejos = Object.fromEntries(S.cats.map(c => [c.id, c.pagina]).concat([["reservar", "reservar.html"], ["quinceaneras", "quinceaneras.html"], ["eventos", "eventos.html"]]));
  const h = location.hash.slice(1);
  if (viejos[h]) { location.replace(viejos[h] + location.search); return; }

  // Promo
  if (S.promo) {
    $("#sello-promo").innerHTML = `<b>−${P.porcentaje}%</b><span>eventos de noviembre</span><small>reservando por la web</small>`;
    $("#sello-promo").hidden = false;
    $("#hero-cta").textContent = `Ver servicios con −${P.porcentaje}%`;
    $("#como-3").textContent = `Se abre WhatsApp con el detalle y el total. Si tu evento es en noviembre, ya va con el ${P.porcentaje}% de descuento y el código ${P.codigo}.`;
    $("#promo-nota").textContent = P.condiciones || "";
    $("#promo-nota").hidden = !P.condiciones;
  }
  $("#tarjetas").innerHTML = S.cats.map(S.tarjeta).join("");

  // Galería
  const ig = `https://instagram.com/${C.instagram}`;
  $("#ig-link").href = ig; $("#ig-link").target = "_blank"; $("#ig-link").rel = "noopener";
  $("#mosaico").innerHTML = G.galeria.map((f, i) => `
    <figure class="${f.ancho === "doble" ? "doble" : ""}">
      <button type="button" data-i="${i}" aria-label="Ampliar: ${esc(f.texto)}"><img src="${f.ancho === "doble" ? f.src : S.chica(f.src)}" alt="${esc(f.alt)}" loading="lazy"></button>
      <figcaption>${esc(f.texto)}</figcaption>
    </figure>`).join("");
  const visor = $("#visor");
  $("#mosaico").addEventListener("click", e => {
    const b = e.target.closest("button[data-i]"); if (!b) return;
    const f = G.galeria[+b.dataset.i];
    $("#visor-img").src = f.src; $("#visor-img").alt = f.alt; $("#visor-txt").textContent = f.texto;
    if (visor.showModal) visor.showModal();
  });
  $("#visor-cerrar").addEventListener("click", () => visor.close());
  visor.addEventListener("click", e => { if (e.target === visor) visor.close(); });

  // Pagos, indicaciones, políticas, preguntas
  $("#metodos").innerHTML = G.pagos.metodos.map(m => `<li>${esc(m)}</li>`).join("");
  $("#abono").textContent = G.pagos.abono;
  $("#divisas").textContent = G.pagos.divisas;
  $("#ind-rostro").innerHTML = G.indicaciones.rostro.map(x => `<li>${esc(x)}</li>`).join("");
  $("#ind-cabello").innerHTML = G.indicaciones.cabello.map(x => `<li>${esc(x)}</li>`).join("");
  $("#clausulas").innerHTML = G.politicas.map(p => `<li><div><b>${esc(p.t)}</b><span>${esc(p.d)}</span></div></li>`).join("");
  $("#faq").innerHTML = G.faq.map(f => `<details><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join("");

  // Contacto
  $("#d-estudio").innerHTML = `${esc(C.estudio)}<small>${esc(C.direccion)}. ${esc(C.atencion)}.</small>`;
  $("#d-wa").textContent = C.whatsappVisible;
  $("#d-ig").href = ig; $("#d-ig").textContent = "@" + C.instagram;
  $("#d-mapa").href = C.mapa;
  $("#copiar-wa").addEventListener("click", async e => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(C.whatsappVisible); b.textContent = "Copiado"; }
    catch { const r = document.createRange(); r.selectNodeContents($("#d-wa")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Número seleccionado"; }
    setTimeout(() => b.textContent = "Copiar número", 2200);
  });
  S.avisar();
})();
