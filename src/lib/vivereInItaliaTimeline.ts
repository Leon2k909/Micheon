import type { CountryTimelineEvent } from "@/lib/countryStudies";

/**
 * La linea del tempo del corso «Vivere in Italia».
 *
 * Costruita sul modello britannico, tedesco, francese e polacco, con la
 * stessa regola che vale lì: un periodo appartiene al suo ULTIMO anno, non
 * al primo. Il fascismo sta al 1945 e non al 1922 — altrimenti la linea si
 * leggerebbe come se un'epoca finisse prima di cominciare.
 *
 * Sei epoche, perché la storia d'Italia si spezza proprio in questi punti:
 * l'eredità romana e i Comuni, il Rinascimento degli Stati italiani, il
 * Risorgimento fino a Roma capitale, l'Italia liberale fino alla marcia su
 * Roma, il ventennio con la guerra, e la Repubblica. I nomi sono quelli con
 * cui l'Italia divide la propria storia, senza periodizzazioni prese altrove.
 */

type ItEra =
  | "roma-medioevo"
  | "rinascimento"
  | "risorgimento"
  | "italia-liberale"
  | "fascismo-guerra"
  | "repubblica";

export const IT_ERA_LABELS: Record<ItEra, string> = {
  "roma-medioevo": "Roma e il Medioevo",
  rinascimento: "Rinascimento e Stati italiani",
  risorgimento: "Risorgimento e Unità d'Italia",
  "italia-liberale": "L'Italia liberale",
  "fascismo-guerra": "Fascismo e guerra",
  repubblica: "La Repubblica",
};

export const IT_ERA_ORDER: ItEra[] = [
  "roma-medioevo",
  "rinascimento",
  "risorgimento",
  "italia-liberale",
  "fascismo-guerra",
  "repubblica",
];

const event = (
  id: string,
  year: number,
  displayYear: string,
  era: ItEra,
  title: string,
  summary: string,
  detail: string,
  tags: string[],
  category = "Storia"
): CountryTimelineEvent => ({ id, year, displayYear, era, title, summary, detail, tags, category });

export const IT_TIMELINE: CountryTimelineEvent[] = [
  event(
    "caduta-impero",
    476,
    "476",
    "roma-medioevo",
    "Fine dell'Impero romano d'Occidente",
    "La deposizione di Romolo Augustolo chiude un'epoca e ne apre una lunghissima.",
    "Nel 476 Odoacre depone l'ultimo imperatore d'Occidente, Romolo Augustolo. La penisola non tornerà a essere un solo Stato per quasi millequattrocento anni: è la frattura da cui nasce l'Italia dei mille poteri, dei ducati, dei Comuni e dei regni stranieri.",
    ["476", "Romolo Augustolo", "Odoacre", "impero"],
  ),
  event(
    "comuni",
    1176,
    "1176",
    "roma-medioevo",
    "La Lega Lombarda a Legnano",
    "Le città del Nord battono l'imperatore e si tengono le loro libertà.",
    "A Legnano i Comuni riuniti nella Lega Lombarda sconfiggono Federico Barbarossa. La pace di Costanza del 1183 riconosce alle città il diritto di governarsi da sé. È l'atto di nascita politico dei Comuni, un modello di autogoverno urbano che in Europa non ha eguali per densità.",
    ["1176", "Legnano", "Lega Lombarda", "Barbarossa", "Comuni"],
    "Ordinamento",
  ),
  event(
    "lorenzo",
    1492,
    "1492",
    "rinascimento",
    "Morte di Lorenzo il Magnifico",
    "Con lui finisce l'equilibrio fra gli Stati italiani.",
    "Lorenzo de' Medici muore nel 1492, l'anno in cui Colombo attraversa l'Atlantico. Due anni dopo Carlo VIII di Francia scende in Italia e comincia mezzo secolo di guerre combattute in casa da eserciti stranieri. Il Rinascimento raggiunge il suo culmine artistico mentre la penisola perde ogni autonomia politica.",
    ["1492", "Lorenzo de' Medici", "Firenze", "Rinascimento"],
    "Cultura",
  ),
  event(
    "unita",
    1861,
    "17 marzo 1861",
    "risorgimento",
    "Proclamazione del Regno d'Italia",
    "Vittorio Emanuele II diventa re d'Italia: la penisola torna uno Stato solo.",
    "Il 17 marzo 1861 il primo Parlamento italiano proclama il Regno d'Italia. Mancano ancora il Veneto, che arriverà nel 1866, e Roma, che sarà presa nel 1870. La capitale è Torino, poi Firenze, e solo alla fine Roma: l'Italia unita nasce spostando il proprio centro tre volte in dieci anni.",
    ["1861", "Vittorio Emanuele II", "Regno d'Italia", "Torino"],
    "Ordinamento",
  ),
  event(
    "roma-capitale",
    1870,
    "20 settembre 1870",
    "risorgimento",
    "Presa di Roma",
    "La breccia di Porta Pia chiude il Risorgimento e apre la questione romana.",
    "I bersaglieri entrano a Roma attraverso una breccia aperta presso Porta Pia. Lo Stato pontificio finisce e Roma diventa capitale l'anno successivo. Il papa si dichiara prigioniero in Vaticano: il rapporto fra Stato e Chiesa resterà irrisolto fino ai Patti Lateranensi del 1929.",
    ["1870", "Porta Pia", "Roma capitale", "questione romana"],
  ),
  event(
    "marcia-su-roma",
    1922,
    "28 ottobre 1922",
    "italia-liberale",
    "Marcia su Roma",
    "Il re incarica Mussolini invece di firmare lo stato d'assedio.",
    "Le squadre fasciste convergono su Roma e Vittorio Emanuele III rifiuta di firmare il decreto di stato d'assedio che l'esercito avrebbe eseguito. Il 30 ottobre incarica Mussolini di formare il governo. Il passaggio avviene formalmente dentro le regole dello Statuto albertino: è così che finisce l'Italia liberale.",
    ["1922", "Mussolini", "Vittorio Emanuele III", "fascismo"],
    "Ordinamento",
  ),
  event(
    "liberazione",
    1945,
    "25 aprile 1945",
    "fascismo-guerra",
    "Liberazione",
    "L'insurrezione delle città del Nord chiude vent'anni di dittatura e due di occupazione.",
    "Il Comitato di liberazione nazionale alta Italia proclama l'insurrezione generale. Milano e Torino sono liberate prima dell'arrivo degli Alleati. Il 25 aprile è oggi festa nazionale: ricorda la Resistenza, non la firma della resa, che avverrà pochi giorni dopo.",
    ["1945", "Resistenza", "25 aprile", "CLN"],
  ),
  event(
    "referendum-1946",
    1946,
    "2 giugno 1946",
    "repubblica",
    "Referendum istituzionale",
    "Gli italiani scelgono la repubblica, e per la prima volta votano anche le donne.",
    "Con il referendum del 2 e 3 giugno 1946 la repubblica prevale sulla monarchia. Lo stesso giorno viene eletta l'Assemblea costituente. È la prima consultazione a suffragio davvero universale della storia italiana: le donne votano per la prima volta a livello nazionale.",
    ["1946", "referendum", "repubblica", "suffragio femminile"],
    "Ordinamento",
  ),
  event(
    "costituzione",
    1948,
    "1º gennaio 1948",
    "repubblica",
    "Entra in vigore la Costituzione",
    "Centotrentanove articoli scritti da un'assemblea di forze politiche opposte.",
    "La Costituzione approvata il 22 dicembre 1947 entra in vigore il 1º gennaio 1948. È rigida: si modifica solo con la procedura aggravata dell'articolo 138, e la forma repubblicana non è modificabile affatto. Regge da allora senza essere mai riscritta.",
    ["1948", "Costituzione", "Assemblea costituente"],
    "Ordinamento",
  ),
  event(
    "trattati-roma",
    1957,
    "25 marzo 1957",
    "repubblica",
    "Trattati di Roma",
    "L'Italia è fra i sei paesi che fondano la Comunità economica europea.",
    "In Campidoglio i rappresentanti di Italia, Francia, Germania, Belgio, Paesi Bassi e Lussemburgo firmano i trattati che istituiscono la CEE e l'Euratom. L'Italia non entra nell'Europa comunitaria: la fonda, e lo fa nella propria capitale.",
    ["1957", "CEE", "Trattati di Roma", "Europa"],
    "L'Italia nel mondo",
  ),
];
