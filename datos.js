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
  sitio: "",

  // Enlaces cortos de cotización (opcional). Con estos dos datos de Supabase
  // el enlace queda como  .../c.html#kAB12CD . Vacíos = enlace largo.
  // Instrucciones y SQL en LEEME.md.
  acortador: { supabaseUrl: "", supabaseKey: "" },

  marca: "Gaby Bravo",
  nombreLegal: "Gabriela Bravo",
  descriptor: "Maquilladora profesional y especialista en peinado",

  contacto: {
    whatsapp: "584248454819",           // formato internacional, solo números
    whatsappVisible: "0424-845 4819",
    instagram: "gabybravoartist",
    estudio: "Studio Valles Makeup",
    direccion: "C. C. Plaza Mayor, Lechería, Anzoátegui",
    // Punto del estudio para medir la distancia del domicilio (C. C. Plaza Mayor). Ajústalo si hace falta.
    coordenadas: [10.18029, -64.68392],
    mapa: "https://www.google.com/maps/search/?api=1&query=Studio+Valles+Makeup+Centro+Comercial+Plaza+Mayor+Lecheria",
    atencion: "Con cita previa, en el estudio o a domicilio"
  },

  notaPrecio: "Bolívares a tasa BCV del día. Pagando en divisas, Zelle o Binance tienes precio especial.",

  /* Catálogo. "cod" es el código corto que viaja en el enlace de la
     cotización: no lo cambies una vez que hayas enviado cotizaciones.
     precio: null = "Consultar". web: false = solo aparece en el cotizador. */
  categorias: [
    {
      id: "novias",
      nombre: "Novias",
      script: "Novias",
      titulo2: "Tu gran día",
      intro: "Peinado de alta durabilidad y maquillaje que aguanta toda la celebración. Antes del día hay una cita de asesoría para definir tu look.",
      foto: "fotos/novia-recogido-trenza.webp",
      fotoAlt: "Novia de perfil con recogido trenzado y tocado",
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
      id: "social",
      nombre: "Eventos",
      script: "Social",
      titulo2: "Eventos y sesiones",
      intro: "Para invitadas, graduaciones, sesiones de fotos y cualquier noche que quieras recordar.",
      foto: "fotos/gaby-peinando.webp",
      fotoAlt: "Gaby terminando un peinado recogido",
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
    { src: "fotos/novia-recogido-trenza.webp", alt: "Recogido trenzado con tocado de novia", texto: "Recogido trenzado con tocado", ancho: "doble" },
    { src: "fotos/novia-tiara-proceso.webp", alt: "Colocación de tiara a una novia", texto: "Fijación de tiara, día de la boda" },
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
