/* Página de una categoría (novias, quinceañeras, eventos, cursos). Todo sale de datos.js. */
(function () {
  const S = window.GBS, { $, esc, dinero, P, G } = S;
  const c = G.categorias.find(x => x.id === document.body.dataset.cat);
  if (!c) return;
  const img = $("#cat-portada");
  if (c.portada && !img.src.endsWith(c.portada)) img.src = c.portada;
  img.alt = c.fotoAlt || "";
  $("#cat-miga").textContent = c.nombre;
  $("#cat-script").textContent = c.script;
  $("#cat-t2").textContent = c.titulo2 || c.nombre;
  $("#cat-intro").textContent = c.intro || "";

  const d = S.desde(c);
  if (d) $("#cat-desde").innerHTML = `Desde ${S.precioHTML(Object.assign({}, c.servicios.find(s => s.precio === d.lista), { cat: c }))}`;
  if (S.enPromo(c)) {
    $("#promo-aviso").innerHTML = `<b>−${P.porcentaje}%</b><span>Los precios ya tienen el descuento de noviembre por reservar desde esta página. Válido hasta el ${S.fechaLarga(P.hasta)}.</span>`;
    $("#promo-aviso").hidden = false;
  }

  $("#servs").innerHTML = c.servicios.map(s0 => {
    const s = S.catalogo[s0.cod];
    const meta = [s.detalle, s.duracion].filter(Boolean).map(esc).join(" · ");
    return `<li class="serv">
      <div class="serv-cab"><h3>${esc(s.nombre)}</h3>${S.precioHTML(s)}</div>
      ${meta ? `<p class="serv-meta">${meta}</p>` : ""}
      <div class="serv-pie">
        ${s.incluye && s.incluye.length ? `<details class="incluye"><summary>Qué incluye</summary><ul>${s.incluye.map(x => `<li>${esc(x)}</li>`).join("")}</ul></details>` : "<span></span>"}
        ${S.botonAgregar(s)}
      </div>
    </li>`;
  }).join("");
  $("#nota-precio").textContent = c.id === "cursos" ? "" : `${G.notaPrecio} El traslado a domicilio u hotel tiene costo adicional según la zona.`;

  const fotos = (c.fotos || []).map(src => { const g = G.galeria.find(x => x.src === src) || {}; return `<figure><img src="${S.chica(src)}" alt="${esc(g.alt || "")}" loading="lazy"><figcaption>${esc(g.texto || "")}</figcaption></figure>`; });
  if (fotos.length) $("#tira").innerHTML = fotos.join(""); else $(".tira-sec").remove();
  $("#otras").innerHTML = S.cats.filter(x => x.id !== c.id).map(S.tarjeta).join("");
  S.avisar();
})();
