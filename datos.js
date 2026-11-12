/* ==========================================================================
   Gaby Bravo · datos del sitio y del cotizador
   Este es el ÚNICO archivo que hay que editar para cambiar precios,
   servicios, fotos, políticas o datos de contacto. La web (index.html),
   el cotizador (cotizar.html) y la cotización de la clienta (c.html)
   leen todo desde aquí.
   ========================================================================== */
window.GB = {
  // Dirección pública de la web, SIN barra final. Los enlaces de cotización
  // se arman con ella. Ejemplo: "https://gabybravoartist.com"
  // Si se deja vacía, el cotizador usa la dirección desde donde se abre.
  sitio: "https://gabybravoartist.com",

  // Enlaces cortos de cotización (opcional). Con estos dos datos de Supabase
  // el enlace queda como  .../c.html#kAB12CD . Vacíos = enlace largo.
  // Instrucciones y SQL en LEEME.md.
  // Supabase: enlaces cortos e historial. La clave es la publicable (pública por diseño; las reglas de la base deciden qué puede hacer).
  acortador: { supabaseUrl: "https://innaconhuyiyufxifhst.supabase.co", supabaseKey: "sb_publishable_gbNbX--sJLD_S_vAFZIMcg_ElNfsOp3" },

  marca: "Gaby Bravo",
  nombreLegal: "Gabriela Bravo",
  descriptor: "Maquilladora profesional y especialista en peinado",

  contacto: {
    whatsapp: "584248454819",           // formato internacional, solo números
    whatsappVisible: "0424-845 4819",
    instagram: "gabybravoartist",
    estudio: "Estefania Valles Makeup Studio",
    direccion: "C. C. Costanera, Plaza 1, piso 3, local P3-02, Av. El Ejército, Barcelona, Anzoátegui",
    // Punto del estudio para medir la distancia del domicilio (C. C. Costanera, Barcelona).
    coordenadas: [10.16093, -64.69238],
    mapa: "https://maps.app.goo.gl/hY5GYC6g1P1t3pZL8",
    atencion: "Con cita previa, en el estudio o a domicilio"
  },

  /* Promoción vigente. Se muestra sola entre "desde" y "hasta" (hora de Venezuela)
     y desaparece al terminar. Para apagarla antes: activa: false. */
  // Peinados para acompañantes: si la clienta agrega peinado de novia o de quinceañera,
  // cada peinado extra (mamá, damas, cortejo) tiene este descuento sobre el precio de "base".
  acompanantes: {
    activa: true,
    porcentaje: 5,
    base: "PSOC",                        // servicio del que sale el precio (Peinado social)
    con: ["PNOV", "PQUI"],               // se ofrece cuando está alguno de estos
    cod: "PACO",
    nombre: "Peinado para mamá o cortejo",
    titulo: "¿Peinamos también a tu mamá o a tu cortejo?",
    texto: "Cada peinado extra que agregues junto al tuyo tiene 5% de descuento."
  },

  promo: {
    activa: true,
    porcentaje: 10,
    desde: "2026-11-01",
    hasta: "2026-11-30",
    codigo: "WEB10",
    eventoDesde: "2026-11-01",           // la FECHA DEL EVENTO debe estar entre estas dos fechas
    eventoHasta: "2026-11-30",
    cinta: "Noviembre: 10% de descuento sobre el total para eventos de noviembre, reservando desde la web",
    corto: "−10% en eventos de noviembre",
    condiciones: "Válido para eventos con fecha hasta el 30 de noviembre de 2026, reservados desde esta web. El 10% se descuenta del total de todos los servicios elegidos. El traslado a domicilio u hotel lo confirma Gaby aparte."
  },

  notaPrecio: "Bolívares a tasa BCV del día. Pagando en divisas, Zelle o Binance tienes precio especial.",

  /* Catálogo. "cod" es el código corto que viaja en el enlace de la
     cotización: no lo cambies una vez que hayas enviado cotizaciones.
     precio: null = "Consultar". web: false = solo aparece en el cotizador. */
  categorias: [
    {
      id: "novias",
      tarjeta: "fotos/novia-espalda-mar.webp",   // foto de la tarjeta en la portada
      portada: "fotos/novia-perfil-laca.webp",   // foto grande de su página
      pagina: "novias.html",
      fotos: ["fotos/novia-espalda-mar.webp", "fotos/novia-perfil-laca.webp", "fotos/novia-tocado-detalle.webp", "fotos/gaby-colocando-tocado.webp", "fotos/novia-espejo.webp", "fotos/novia-bata-tiara.webp", "fotos/novia-recogido-trenza.webp"],
      nombre: "Novias",
      script: "Novias",
      titulo2: "Tu gran día",
      intro: "Peinado de alta durabilidad y maquillaje que aguanta toda la celebración. Antes del día hay una cita de asesoría para definir tu look.",
      foto: "fotos/gaby-colocando-tocado.webp",
      fotoAlt: "Gaby colocando el tocado a una novia",
      servicios: [
        { cod: "PNOV", nombre: "Peinado de novia", precio: 140, duracion: "",
          incluye: ["Cita presencial de asesoría", "Secado de cabello", "Relleno para moños", "Peinado de alta durabilidad, el estilo que desees", "Malla para ondas", "Fijación de tiara y tocado", "Colocación de velo", "Colocación de extensiones tipo cortina (las traes tú, opcional)"] },
        { cod: "MNOV", nombre: "Maquillaje de novia", precio: 140, duracion: "",
          incluye: ["Cita presencial de asesoría", "Preparación de la piel y skin care", "Piel resistente de larga duración", "Maquillaje de ojos de tu elección", "Pestañas postizas corridas de efecto natural", "Labial de larga duración"] },
        { cod: "PRP", nombre: "Prueba de peinado", precio: 70, duracion: "Máximo 20 días antes de la boda", incluye: [] },
        { cod: "PRM", nombre: "Prueba de maquillaje", precio: 70, duracion: "Máximo 20 días antes de la boda", incluye: [] }
      ]
    },
    {
      id: "quince",
      tarjeta: "fotos/quince-ondas.webp",   // foto de la tarjeta en la portada
      portada: "fotos/quince-ondas.webp",   // foto grande de su página
      pagina: "quinceaneras.html",
      fotos: ["fotos/quince-ondas.webp", "fotos/trenza-rosa.webp", "fotos/ondas-retro.webp"],
      nombre: "Quinceañeras",
      script: "Quince",
      titulo2: "Tu gran noche",
      intro: "Peinado y maquillaje para la quinceañera, pensados para durar toda la fiesta y lucir en las fotos.",
      foto: "fotos/quince-ondas.webp",
      fotoAlt: "Quinceañera con ondas laterales y tiara",
      servicios: [
        { cod: "PQUI", nombre: "Peinado de quinceañera", precio: 90,
          detalle: "Ondas, semirrecogido, recogido o trenzas, con tiara o tocado.",
          incluye: ["Preparación del cabello con protector térmico", "Espuma fijadora para la durabilidad", "Pulido con secado express", "Fijación de tiara y tocado", "Extensiones de clip (las traes tú)", "Fijación con laca líquida y sellado en aerosol"] },
        { cod: "MQUI", nombre: "Maquillaje de quinceañera", precio: 90,
          incluye: ["Preparación de la piel", "Corrección de ojeras y manchas", "Base resistente", "Contorno y blush en crema y polvo", "Sellado y fijación", "Diseño y fijación de cejas", "Ojos soft o glam, según su estilo", "Delineador, rímel y pestañas postizas corridas", "Labial de larga duración"] }
      ]
    },
    {
      id: "social",
      tarjeta: "fotos/maquillaje-glam.webp",   // foto de la tarjeta en la portada
      portada: "fotos/maquillaje-glam.webp",   // foto grande de su página
      pagina: "eventos.html",
      fotos: ["fotos/maquillaje-glam.webp", "fotos/ondas-retro.webp", "fotos/trenza-rosa.webp", "fotos/gaby-peinando.webp"],
      nombre: "Eventos",
      script: "Social",
      titulo2: "Eventos y sesiones",
      intro: "Para invitadas, graduaciones, sesiones de fotos y cualquier noche que quieras recordar.",
      foto: "fotos/maquillaje-glam.webp",
      fotoAlt: "Maquillaje de noche con sombra dorada y ondas",
      servicios: [
        { cod: "PSOC", nombre: "Peinado social", precio: 70, duracion: "1 h 30 min a 2 h",
          detalle: "Ondas glam, semirrecogido, moño, cola o trenza.",
          incluye: ["Preparación del cabello con protector térmico", "Espuma fijadora para la durabilidad", "Pulido con secado express", "Extensiones de clip (las traes tú)", "Fijación con laca líquida y sellado en aerosol", "Malla para recoger las ondas"] },
        { cod: "MSOC", nombre: "Maquillaje social", precio: 70, duracion: "2 h",
          incluye: ["Preparación de la piel", "Corrección de ojeras y manchas", "Base resistente", "Contorno y blush en crema y polvo", "Sellado y fijación", "Diseño y fijación de cejas", "Ojos soft o full glam", "Delineador, rímel y pestañas postizas corridas", "Labial de larga duración"] },
        { cod: "ONL", nombre: "Ondas naturales, cabello medio o largo", precio: 55, duracion: "1 h",
          detalle: "Totalmente suelto.", incluye: ["Protector térmico y espuma fijadora", "Secado express", "Ondas naturales", "Fijación y sellado con laca"] },
        { cod: "ONC", nombre: "Ondas naturales, cabello corto", precio: 45, duracion: "1 h",
          detalle: "Totalmente suelto.", incluye: ["Protector térmico y espuma fijadora", "Secado express", "Ondas naturales", "Fijación y sellado con laca"] }
      ]
    },
    {
      id: "cursos",
      tarjeta: "fotos/gaby-peinando.webp",   // foto de la tarjeta en la portada
      portada: "fotos/gaby-colocando-tocado.webp",   // foto grande de su página
      pagina: "cursos.html",
      fotos: ["fotos/gaby-peinando.webp", "fotos/novia-tiara-proceso.webp", "fotos/gaby-colocando-tocado.webp"],
      nombre: "Cursos",
      script: "Cursos",
      titulo2: "Formación",
      intro: "Aprende a peinar con la técnica que uso con mis novias. Clases personalizadas con práctica en modelo.",
      foto: "fotos/novia-tiara-proceso.webp",
      fotoAlt: "Gaby colocando una tiara durante el peinado de una novia",
      servicios: [
        { cod: "CES", nombre: "Curso Profesional de Estilismo Social", precio: 280, duracion: "16 horas en 4 clases",
          detalle: "Personalizado 1:1, lunes, martes o miércoles.",
          incluye: ["Arma tu maleta de peinado", "Preparación del cabello, secado y planchado", "Ondas Hollywood glam y semirrecogido con rulos", "Recogido bajo y coleta alta pulida", "Práctica supervisada en modelo", "Asesoría por 3 meses y corrección de tareas", "Guía de productos y certificado digital"] },
        { cod: "ODH", nombre: "Ondas de Hierro", precio: null, duracion: "Gira de peinados de alta resistencia",
          detalle: "Entrada general o VIP, según la fecha de cada ciudad.", incluye: ["Técnica de ondas blindadas", "Recogido alto estilo francés", "Certificado impreso"] },
        { cod: "AUT", nombre: "Curso de automaquillaje", precio: null, duracion: "", incluye: [] }
      ]
    },
    {
      id: "extras",
      nombre: "Complementos",
      web: false,
      servicios: [
        { cod: "DOM", nombre: "Domicilio u hotel", precio: 30, incluye: [] },
        { cod: "DOMI", nombre: "Domicilio, solo ida", precio: 15, incluye: [] },
        { cod: "SEC", nombre: "Secado y estilismo", precio: 17, incluye: [] },
        { cod: "MAD", nombre: "Recargo por servicio de madrugada", precio: 7, incluye: [] }
      ]
    }
  ],

  /* Galería: agrega aquí cada foto que subas a la carpeta "fotos".
     ancho: "doble" para que ocupe dos columnas en escritorio. */
  galeria: [
    { src: "fotos/novia-perfil-laca.webp", alt: "Novia de perfil con ondas y tocado, fijación final con laca", texto: "Fijación final: ondas y tocado", ancho: "doble" },
    { src: "fotos/novia-espalda-mar.webp", alt: "Novia de espalda con recogido bajo y tiara frente al mar", texto: "Recogido bajo con tiara" },
    { src: "fotos/novia-bata-tiara.webp", alt: "Novia en bata con semirrecogido, mechones sueltos y tiara", texto: "Preparación de novia" },
    { src: "fotos/ondas-retro.webp", alt: "Peinado de ondas al agua estilo retro con maquillaje de noche", texto: "Ondas retro" },
    { src: "fotos/maquillaje-glam.webp", alt: "Maquillaje de noche con sombra dorada brillante y labios gloss", texto: "Maquillaje glam" },
    { src: "fotos/novia-tocado-detalle.webp", alt: "Detalle de tocado de cristales sobre un semirrecogido", texto: "Tocado fijado para toda la noche" },
    { src: "fotos/trenza-rosa.webp", alt: "Semirrecogido con trenzas y una rosa trenzada sobre ondas largas", texto: "Trenzas con rosa", ancho: "doble" },
    { src: "fotos/quince-ondas.webp", alt: "Quinceañera con ondas laterales y tiara", texto: "Quince años: ondas laterales" },
    { src: "fotos/novia-espejo.webp", alt: "Novia sonriendo frente al espejo después del peinado", texto: "El momento del espejo" },
    { src: "fotos/gaby-colocando-tocado.webp", alt: "Gaby colocando el tocado a una novia", texto: "Colocación del tocado" },
    { src: "fotos/novia-recogido-trenza.webp", alt: "Recogido trenzado con tocado de novia", texto: "Recogido trenzado con tocado" },
    { src: "fotos/gaby-peinando.webp", alt: "Gaby dando el toque final a un peinado", texto: "Toque final antes de salir" }
  ],

  pagos: {
    metodos: ["Efectivo", "Pago Móvil", "Zelle", "Binance"],
    abono: "Tu fecha queda apartada con el 50% del servicio. El resto se paga el día de la cita.",
    divisas: "Pagando en divisas, Zelle o Binance tienes precio especial. Pregúntame al cotizar."
  },

  politicas: [
    { t: "Reserva", d: "Tu fecha queda apartada con el 50% del servicio. El resto se paga el día de la cita." },
    { t: "Reservas con más de 2 meses", d: "Si reservas con más de 2 meses de anticipación, el pago total se completa 1 mes antes de la fecha para confirmar tu cita." },
    { t: "Reembolsos", d: "No hago reembolsos de dinero. Si cancelas, lo que abonaste queda como saldo a tu favor para otra cita o un curso." },
    { t: "Puntualidad", d: "Después de 20 minutos de retraso se suma un recargo de $5 por cada lapso de espera adicional." },
    { t: "Garantía de cupo", d: "Si pasan 30 minutos sin empezar, ya no puedo garantizar el servicio, para no retrasar a las clientas que vienen después." },
    { t: "Cambios de hora", d: "Avísame cualquier cambio de hora con al menos 45 minutos de anticipación; si no, se suma un recargo de $3 por traslado." },
    { t: "Jornadas largas", d: "Si el servicio dura más de 5 horas, hago una pausa de 15 minutos para hidratarme y comer." },
    { t: "Horario de madrugada", d: "Los servicios de madrugada llevan un recargo que te indico al cotizar." }
  ],

  indicaciones: {
    rostro: [
      "Ven con la cara lavada y sin maquillaje.",
      "Avísame si tienes alergia o alguna condición en la piel: sensibilidad, rosácea, acné o vitíligo, entre otras.",
      "Si quieres armonizar tu look, mándame una foto de tu atuendo y accesorios.",
      "Compárteme fotos de referencia que te gusten.",
      "Mantén tu rutina de limpieza, hidratación y protector solar los días antes."
    ],
    cabello: [
      "Ven con el cabello limpio, sin aceites, cremas ni fijadores.",
      "Húmedo o seco, sin plancha. Si hace falta, plancha solo la raíz.",
      "Si vas a usar extensiones, que estén lavadas.",
      "Mándame con anticipación una foto del peinado que quieres."
    ]
  },

  faq: [
    { p: "¿Vas a domicilio o al hotel?", r: "Sí. El traslado tiene un costo adicional según la zona; te lo indico en la cotización." },
    { p: "¿Cuánto antes debo reservar mi boda?", r: "Lo ideal es apartar tu fecha en cuanto la tengas. La prueba de peinado y maquillaje se hace máximo 20 días antes." },
    { p: "¿Puedo traer mis propias extensiones?", r: "Sí, las coloco yo. Solo deben venir lavadas." },
    { p: "¿Atiendes grupos o cortejos?", r: "Sí. Para grupos te envío una cotización con el total por persona y por servicio." },
    { p: "¿Cuánto dura el peinado?", r: "Trabajo con técnicas de alta durabilidad: la idea es que el peinado llegue intacto al final de la noche." }
  ]
};
