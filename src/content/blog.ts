import { PHOTOS, type Photo } from "./images";

/**
 * Journal de Cara: artículos de belleza y bienestar escritos para la demo.
 * Es contenido orientativo; antes de publicar conviene que el equipo de Cara lo revise y lo firme.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: "Headspa" | "Piel" | "Cuerpo" | "Bienestar";
  date: string;
  readMin: number;
  cover: Photo;
  /** Servicio que el artículo recomienda reservar (slug del catálogo). */
  service?: { slug: string; label: string };
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: "que-es-un-headspa",
    title: "Qué es un headspa y por qué todo el mundo habla de él",
    excerpt: "El ritual japonés que trata el cuero cabelludo como la piel que es: limpieza profunda, masaje y agua. Te contamos qué pasa en cada paso.",
    category: "Headspa",
    date: "2026-11-12",
    readMin: 6,
    cover: PHOTOS.faceMassage,
    service: { slug: "headspa-signature-cara", label: "Reservar Headspa Signature" },
    body: [
      { type: "p", text: "Pasamos años cuidando la piel del rostro con sérums, protector solar y limpiezas, pero olvidamos que el cuero cabelludo también es piel. Y una muy exigida: tiene más glándulas sebáceas que la frente, recibe calor, sol, champú seco, peinados tirantes y estrés. El headspa nació en Japón justamente para cuidarlo." },
      { type: "h2", id: "origen", text: "Un ritual que viene de Japón" },
      { type: "p", text: "En los salones japoneses, el lavado nunca fue un trámite: es el momento central de la visita. De ahí surgió el headspa, una sesión dedicada solo al cuero cabelludo que combina diagnóstico, limpieza profunda y un masaje craneal largo y lento. El resultado es doble: un cuero cabelludo más sano y una sensación de calma difícil de conseguir de otra forma." },
      { type: "h2", id: "pasos", text: "Qué pasa en cada paso" },
      { type: "ul", items: [
        "**Diagnóstico.** Con una cámara capilar miramos de cerca tu cuero cabelludo: grasa, descamación, sensibilidad o folículos obstruidos.",
        "**Doble limpieza.** Un aceite tibio disuelve el sebo y los residuos de producto; luego un champú suave limpia sin resecar.",
        "**Exfoliación.** Retira células muertas y deja respirar el folículo, como una limpieza facial pero en la raíz.",
        "**Masaje craneal.** Presión lenta en sienes, nuca y coronilla. Es el momento en que mucha gente se queda dormida.",
        "**Cascada de agua.** Un hilo de agua tibia y constante cae sobre la cabeza. Es tan relajante como suena.",
        "**Mascarilla y vapor.** Activos según tu diagnóstico, con vapor para que penetren mejor.",
        "**Secado y cierre.** Un secado suave y un masaje de cuello y hombros para volver despacio.",
      ] },
      { type: "quote", text: "No es un lavado largo: es una limpieza facial para la raíz de tu cabello, con un masaje que baja las revoluciones." },
      { type: "h2", id: "para-quien", text: "¿Para quién es?" },
      { type: "p", text: "Para casi todo el mundo. Es especialmente útil si tienes el cuero cabelludo graso o con picazón, si usas mucho producto o champú seco, si sientes la cabeza tensa por el estrés o si simplemente necesitas noventa minutos sin pantallas. Si tienes una condición dermatológica activa (psoriasis, dermatitis o heridas), lo primero es la evaluación de tu dermatólogo." },
      { type: "h2", id: "cada-cuanto", text: "¿Cada cuánto conviene hacerlo?" },
      { type: "p", text: "Como mantenimiento, una vez al mes funciona muy bien. Si buscas un objetivo concreto, como acompañar una temporada de caída o controlar la grasa, suele recomendarse una serie de cuatro a seis sesiones cada dos o tres semanas. Lo definimos contigo después del diagnóstico." },
    ],
  },
  {
    slug: "doble-limpieza-guia",
    title: "Doble limpieza: la guía sin complicaciones",
    excerpt: "Aceite primero, gel o espuma después. Por qué funciona, cuándo hacerla y los errores que más vemos en cabina.",
    category: "Piel",
    date: "2026-11-05",
    readMin: 5,
    cover: PHOTOS.facial,
    service: { slug: "limpieza-facial-profunda", label: "Reservar Limpieza Facial Profunda" },
    body: [
      { type: "p", text: "Si solo cambias un hábito este año, que sea este. La doble limpieza es la forma más simple de que el resto de tu rutina funcione: un sérum no puede hacer su trabajo sobre una piel con restos de protector solar y maquillaje." },
      { type: "h2", id: "como", text: "Cómo se hace" },
      { type: "ul", items: [
        "**Primer paso, un limpiador oleoso.** Bálsamo o aceite sobre la piel seca. Masajea un minuto: disuelve protector, maquillaje y sebo. Emulsiona con un poco de agua y retira.",
        "**Segundo paso, un limpiador acuoso.** Gel, espuma o leche según tu piel. Limpia lo que el aceite aflojó y deja la piel lista.",
        "**Seca con toques**, sin frotar, y sigue con tu tónico o sérum.",
      ] },
      { type: "h2", id: "cuando", text: "¿Mañana y noche?" },
      { type: "p", text: "La doble limpieza es sobre todo nocturna, que es cuando llegas con protector y maquillaje encima. En la mañana basta con un limpiador suave o incluso solo agua si tu piel es seca." },
      { type: "h2", id: "errores", text: "Los errores que más vemos" },
      { type: "ul", items: [
        "Usar el aceite sobre la piel mojada: pierde capacidad de arrastre.",
        "Elegir un segundo limpiador que deja la piel tirante. Si tira, es demasiado fuerte.",
        "Agua muy caliente: rompe la barrera y enrojece.",
        "Olvidar el cuello y la línea del cabello, donde se acumula el protector.",
      ] },
      { type: "quote", text: "Una piel limpia no es una piel tirante. Es una piel que se siente cómoda y absorbe mejor lo que le pones después." },
    ],
  },
  {
    slug: "cuero-cabelludo-la-piel-olvidada",
    title: "Tu cuero cabelludo es piel (y te está pidiendo atención)",
    excerpt: "Picazón, grasa a mitad del día o caspa que va y viene. Señales de que tu cuero cabelludo necesita algo más que champú.",
    category: "Headspa",
    date: "2026-10-28",
    readMin: 5,
    cover: PHOTOS.hairWash,
    service: { slug: "headspa-detox", label: "Reservar Headspa Detox" },
    body: [
      { type: "p", text: "Pensamos en el cabello como algo que se peina, se corta y se colorea. Pero el cabello nace en el cuero cabelludo, y un cabello brillante empieza por una raíz que vive en un entorno sano." },
      { type: "h2", id: "senales", text: "Señales de alerta" },
      { type: "ul", items: [
        "Sientes la raíz grasa al final del día aunque te laves seguido.",
        "Aparece picazón o pequeñas escamas al usar champú seco.",
        "Notas la cabeza tensa o adolorida al final de la semana.",
        "El cabello se ve opaco aunque uses mascarillas.",
      ] },
      { type: "h2", id: "habitos", text: "Hábitos que ayudan" },
      { type: "ul", items: [
        "Lava con la frecuencia que tu cuero cabelludo pida: no hay una regla única.",
        "Aplica el champú en la raíz y masajea con las yemas, nunca con las uñas.",
        "Una vez por semana, usa un exfoliante o un champú purificante.",
        "Enjuaga bien: los residuos de acondicionador en la raíz pesan y engrasan.",
        "Protégelo del sol con sombrero o un protector en spray para el cabello.",
      ] },
      { type: "p", text: "Si los síntomas persisten, o notas caída en placas o zonas inflamadas, consulta con un dermatólogo. Un headspa acompaña, pero no reemplaza un tratamiento médico." },
    ],
  },
  {
    slug: "drenaje-linfatico-mitos-y-verdades",
    title: "Drenaje linfático: mitos y verdades",
    excerpt: "No es un masaje fuerte, no \"quema grasa\" y sí puede ayudarte a sentirte más ligera. Lo que conviene saber antes de tu primera sesión.",
    category: "Cuerpo",
    date: "2026-10-20",
    readMin: 4,
    cover: PHOTOS.backMassage,
    service: { slug: "drenaje-linfatico-corporal", label: "Reservar Drenaje Linfático" },
    body: [
      { type: "p", text: "El drenaje linfático se volvió popular, y con la popularidad llegaron las promesas exageradas. Separemos lo que sí hace de lo que no." },
      { type: "h2", id: "mitos", text: "Mitos" },
      { type: "ul", items: [
        "**\"Tiene que doler para funcionar.\"** Al revés: las maniobras son suaves, lentas y rítmicas.",
        "**\"Elimina grasa.\"** No. Ayuda a movilizar líquidos, no a reducir tejido graso.",
        "**\"Una sesión basta.\"** Se siente desde la primera, pero los efectos se sostienen con constancia.",
      ] },
      { type: "h2", id: "verdades", text: "Verdades" },
      { type: "ul", items: [
        "Puede aliviar la sensación de pesadez e hinchazón, sobre todo en las piernas.",
        "Es muy relajante: el ritmo lento calma el sistema nervioso.",
        "Combina bien con hábitos simples: agua, movimiento y menos sal.",
      ] },
      { type: "h2", id: "cuidado", text: "Cuándo consultar antes" },
      { type: "p", text: "Si tienes problemas cardíacos, renales, trombosis, una infección activa o estás embarazada, consulta con tu médico antes de reservar y cuéntanos en la evaluación." },
    ],
  },
  {
    slug: "piel-lista-para-un-evento",
    title: "Tu piel lista para un evento: el calendario ideal",
    excerpt: "Qué hacer un mes, una semana y un día antes de una boda o una fecha importante para llegar con la piel luminosa (y sin sorpresas).",
    category: "Piel",
    date: "2026-10-09",
    readMin: 5,
    cover: PHOTOS.facialMask,
    service: { slug: "ritual-novia-radiante", label: "Reservar Ritual Novia Radiante" },
    body: [
      { type: "p", text: "El error más común antes de un evento es probar algo nuevo dos días antes. La piel necesita tiempo para responder y, si algo la irrita, también para recuperarse. Este es el calendario que recomendamos." },
      { type: "h2", id: "un-mes", text: "Un mes antes" },
      { type: "ul", items: [
        "Empieza tu serie de faciales: limpieza profunda primero y luminosidad después.",
        "Si quieres un peeling, este es el momento, nunca la última semana.",
        "Fija tu rutina en casa y no la cambies más.",
      ] },
      { type: "h2", id: "una-semana", text: "Una semana antes" },
      { type: "ul", items: [
        "Último facial: hidratación y luminosidad, sin extracciones agresivas.",
        "Dermaplaning si lo toleras bien: el maquillaje se funde mejor.",
        "Duerme, toma agua y baja la sal para llegar sin hinchazón.",
      ] },
      { type: "h2", id: "un-dia", text: "El día antes" },
      { type: "ul", items: [
        "Gua sha o drenaje facial para desinflamar.",
        "Mascarilla hidratante y nada de activos nuevos.",
        "Un headspa te deja el cabello liviano y, sobre todo, te ayuda a dormir mejor.",
      ] },
      { type: "quote", text: "La piel de un evento se prepara con semanas, no con un milagro de último minuto." },
    ],
  },
  {
    slug: "rutina-de-calma-en-casa",
    title: "Cinco minutos de calma: ritual de masaje craneal en casa",
    excerpt: "Una secuencia simple para hacer antes de dormir, con tus manos y un poco de aceite. Lleva un pedacito del santuario a tu casa.",
    category: "Bienestar",
    date: "2026-09-30",
    readMin: 4,
    cover: PHOTOS.oilDrop,
    service: { slug: "headspa-zen-con-aromaterapia", label: "Reservar Headspa Zen" },
    body: [
      { type: "p", text: "No reemplaza un headspa, pero estos cinco minutos ayudan a soltar la tensión acumulada en la cabeza y el cuello. Hazlo sentada, con luz baja y sin el celular cerca." },
      { type: "h2", id: "secuencia", text: "La secuencia" },
      { type: "ul", items: [
        "**Respira.** Tres respiraciones lentas, exhalando más largo de lo que inhalas.",
        "**Sienes.** Círculos lentos con las yemas, diez hacia adelante y diez hacia atrás.",
        "**Línea del cabello.** Pequeñas presiones desde la frente hasta la coronilla, como si caminaras con los dedos.",
        "**Nuca.** Entrelaza las manos detrás de la cabeza y presiona con los pulgares la base del cráneo durante cinco respiraciones.",
        "**Tracciones suaves.** Toma mechones cerca de la raíz y tira con suavidad un segundo. Libera tensión al instante.",
        "**Cierre.** Desliza las manos por el cuello hacia los hombros, tres veces.",
      ] },
      { type: "p", text: "Si quieres sumar un aceite, aplica unas gotas en la raíz antes del masaje y lava al día siguiente. Funciona como pre-lavado nutritivo." },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}
