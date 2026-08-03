import bundledWordBank from "@/lib/bundledWordBank.json";

type WordBankEntry = {
  de?: string;
  en?: string;
  lookup?: string;
  tip?: string;
};

const stripGermanPunctuation = (value: string) => String(value ?? "")
  .normalize("NFC")
  .replace(/^[\s.,!?;:()[\]{}"'„“‚‘«»…–—-]+|[\s.,!?;:()[\]{}"'„“‚‘«»…–—-]+$/gu, "");

const wordKey = (value: string) => stripGermanPunctuation(value).toLocaleLowerCase("de-DE");

const conciseGloss = (value: string) => String(value ?? "")
  .trim()
  .replace(/\s+/g, " ")
  .replace(/,\s*/g, " / ");

const exactGlosses = new Map<string, string>();
const verbFormGlosses = new Map<string, string>();
const adjectiveFormGlosses = new Map<string, string>();
const nounGlosses = new Map<string, string>();

const addGloss = (map: Map<string, string>, words: string, gloss: string) => {
  for (const word of words.split(/\s+/).filter(Boolean)) {
    const key = wordKey(word);
    if (key && !map.has(key)) map.set(key, gloss);
  }
};

// High-frequency grammar words and irregular forms are deliberately curated.
// A single word can have several normal English meanings, so short alternatives
// are shown where context decides which one fits.
const coreGlossGroups: Array<[string, string]> = [
  ["ich", "I"],
  ["du", "you (informal)"],
  ["er", "he / it"],
  ["sie", "she / they / you (formal)"],
  ["es", "it"],
  ["wir", "we"],
  ["ihr", "you all / her / their"],
  ["ihre ihren ihrem ihrer ihres", "her / their / your (formal)"],
  ["mich", "me"],
  ["dich", "you (informal)"],
  ["ihn", "him / it"],
  ["uns", "us"],
  ["euch", "you all"],
  ["mir", "me / to me"],
  ["dir", "you / to you (informal)"],
  ["ihm", "him / it / to him"],
  ["ihnen", "them / you (formal)"],
  ["mein meine meinen meinem meiner meines", "my / mine"],
  ["dein deine deinen deinem deiner deines", "your / yours (informal)"],
  ["sein", "be / his / its"],
  ["seine seinen seinem seiner seines", "his / its"],
  ["unser unsere unseren unserem unserer unseres", "our / ours"],
  ["euer eure euren eurem eurer eures", "your / yours (plural)"],
  ["dies dieser diese diesen diesem dieses", "this / these"],
  ["jener jene jenen jenem jenes", "that / those"],
  ["der die das den dem des", "the / that / which"],
  ["ein eine einen einem einer eines", "a / an / one"],
  ["kein keine keinen keinem keiner keines", "no / not a / none"],
  ["wer", "who"],
  ["wen wem", "whom / who"],
  ["wessen", "whose"],
  ["was", "what"],
  ["wann", "when"],
  ["wo", "where"],
  ["wohin", "where to"],
  ["woher", "where from"],
  ["irgendwo", "somewhere"],
  ["warum wieso weshalb", "why"],
  ["wie", "how / like"],
  ["welch welcher welche welchen welchem welches", "which"],
  ["und", "and"],
  ["oder", "or"],
  ["aber", "but"],
  ["sondern", "but rather"],
  ["weil", "because"],
  ["denn", "because / then"],
  ["da", "there / since"],
  ["dass", "that"],
  ["wenn", "if / when"],
  ["falls", "if / in case"],
  ["ob", "whether / if"],
  ["obwohl", "although"],
  ["während", "while / during"],
  ["bevor", "before"],
  ["sobald", "as soon as"],
  ["nachdem", "after"],
  ["damit", "so that / with it"],
  ["als", "as / when / than"],
  ["also", "so / therefore"],
  ["deshalb deswegen darum", "that's why / therefore"],
  ["trotzdem", "still / nevertheless"],
  ["sonst", "otherwise / else"],
  ["für", "for"],
  ["wegen", "because of"],
  ["mit", "with"],
  ["ohne", "without"],
  ["gegen", "against / around"],
  ["durch", "through"],
  ["um", "around / at / in order to"],
  ["bis", "until / by"],
  ["von", "from / of / by"],
  ["zu", "to / too"],
  ["bei", "at / with / near"],
  ["nach", "after / to"],
  ["aus", "from / out of"],
  ["seit", "since / for"],
  ["vor", "before / in front of / ago"],
  ["hinter", "behind"],
  ["neben", "next to / besides"],
  ["zwischen", "between"],
  ["über", "over / about"],
  ["unter", "under / among"],
  ["an", "at / on"],
  ["auf", "on / onto"],
  ["in", "in / into"],
  ["im", "in the"],
  ["ins", "into the"],
  ["aufs", "onto the / on the"],
  ["am", "at the / on the"],
  ["ans", "to the / onto the"],
  ["beim", "at the / while"],
  ["vom", "from the / of the"],
  ["zum", "to the"],
  ["zur", "to the"],
  ["fürs", "for the"],
  ["übers", "over the / about the"],
  ["nicht", "not"],
  ["ja", "yes / of course"],
  ["nein", "no"],
  ["doch", "yes (contradicting) / though / actually"],
  ["auch", "also / too"],
  ["nur", "only / just"],
  ["schon", "already / certainly"],
  ["noch", "still / another / yet"],
  ["erst", "only / not until / first"],
  ["wieder", "again"],
  ["immer", "always"],
  ["nie niemals", "never"],
  ["oft", "often"],
  ["manchmal", "sometimes"],
  ["vielleicht", "maybe / perhaps"],
  ["wahrscheinlich", "probably"],
  ["wirklich", "really"],
  ["überhaupt", "at all / generally"],
  ["etwa", "about / approximately"],
  ["eigentlich", "actually / really"],
  ["genau", "exactly"],
  ["einfach", "simply / easy"],
  ["gerade", "just now / straight"],
  ["gleich", "in a moment / same"],
  ["mal", "just / sometime"],
  ["halt eben", "just / simply"],
  ["sehr", "very"],
  ["so", "so / like that"],
  ["zu", "too / to"],
  ["mehr", "more"],
  ["weniger", "less / fewer"],
  ["viel viele vielen vielem vieler vieles", "much / many / a lot"],
  ["wenig wenige wenigen wenigem weniger weniges", "little / few"],
  ["alles", "everything / all"],
  ["alle allen aller", "all / everyone"],
  ["etwas", "something / a little"],
  ["nichts", "nothing"],
  ["jemand jemanden jemandem", "someone / somebody"],
  ["niemand niemanden niemandem", "nobody / no one"],
  ["man", "you / people / one"],
  ["selbst selber", "self / yourself"],
  ["sich", "himself / herself / itself / themselves"],
  ["hier", "here"],
  ["dort", "there"],
  ["drinnen", "inside"],
  ["draußen", "outside"],
  ["heute", "today"],
  ["morgen", "tomorrow / morning"],
  ["gestern", "yesterday"],
  ["jetzt", "now"],
  ["dann", "then"],
  ["später", "later"],
  ["vorher", "before / beforehand"],
  ["früher", "earlier / in the past"],
  ["sofort", "right away"],
  ["gern gerne", "gladly / like to"],
  ["bitte", "please / you're welcome"],
  ["danke", "thanks / thank you"],
  ["hallo", "hello"],
  ["tschüss", "bye"],
  ["okay ok", "okay"],
  ["ab", "off / from"],
  ["dran", "on it / your turn"],
  ["daran", "on that / about that"],
  ["darauf", "on that / after that"],
  ["darüber", "about it / above it"],
  ["drüber", "about it / over it"],
  ["danach", "after that / afterwards"],
  ["drauf", "on it / onto it"],
  ["dabei", "with it / while doing so"],
  ["dafür", "for it / for that"],
  ["davon", "of it / from it"],
  ["dazu", "for that / with it / also"],
  ["zurück", "back"],
  ["hin", "there / toward"],
  ["her", "here / toward the speaker"],
  ["drin", "inside / in it"],
  ["raus", "out"],
  ["runter", "down"],
  ["vorne", "at the front"],
  ["hinten", "at the back"],
  ["zusammen", "together"],
  ["vorbei", "over / past"],
  ["los", "off / let's go"],
  ["einmal", "once / one time"],
  ["zweimal", "twice"],
  ["dreimal", "three times"],
  ["diesmal", "this time"],
  ["nochmal", "again / one more time"],
  ["bisschen", "a little / a bit"],
  ["gar", "at all / completely"],
  ["kaum", "hardly / barely"],
  ["eher", "rather / sooner"],
  ["genug", "enough"],
  ["fast", "almost"],
  ["wohl", "probably / well"],
  ["endlich", "finally"],
  ["ewig", "forever / ages"],
  ["eh", "anyway"],
  ["egal", "doesn't matter / no matter"],
  ["zuerst", "first / at first"],
  ["unbedingt", "definitely / absolutely"],
  ["ziemlich", "quite / fairly"],
  ["anders", "different / differently"],
  ["andere anderen anderem anderer anderes", "other / different"],
  ["allein alleine", "alone"],
  ["beide beiden beider beides", "both"],
  ["froh", "glad / happy"],
  ["kaputt", "broken"],
  ["länger", "longer"],
  ["verrückt", "crazy"],
  ["letzte letzten letzter letztem letztes", "last"],
  ["leider", "unfortunately"],
  ["sorry", "sorry"],
  ["na", "well / hey"],
  ["ach oh", "oh"],
  ["ne", "a / right? (colloquial)"],
  ["links", "left"],
  ["rechts", "right"],
  ["müde", "tired"],
  ["milch", "milk"],
  ["brot", "bread"],
  ["deutschland", "Germany"],
  ["waffe", "weapon"],
  ["jacke", "jacket"],
  ["regal", "shelf"],
  ["schluss", "end / finish"],
  ["ki", "AI"],
  ["weh", "sore / hurt"],
  ["ich's", "I ... it"],
  ["du's", "you ... it"],
  ["bescheid", "information / notice"],
  ["ahnung", "idea / clue"],
  ["entschuldigung", "sorry / excuse me"],
  ["vorsicht", "careful / watch out"],
  ["feierabend", "finished work / time off after work"],
  ["verspätung", "delay / lateness"],
  ["bad", "bathroom"],
  ["stück", "piece"],
  ["unterwegs", "on the way / out and about"],
  ["paar", "a few / a couple"],
  ["hab's", "have it"],
  ["geht's", "how's it going / is it going"],
  ["gibt's", "there is / there are"],
  ["jeder jede jeden jedem jedes", "every / each"],
  ["eins", "one"],
  ["zwei", "two"],
  ["drei", "three"],
  ["vier", "four"],
  ["fünf", "five"],
  ["sechs", "six"],
  ["sieben", "seven"],
  ["acht", "eight"],
  ["neun", "nine"],
  ["zehn", "ten"],
  ["elf", "eleven"],
  ["zwölf", "twelve"],
  ["dreizehn", "thirteen"],
  ["vierzehn", "fourteen"],
  ["fünfzehn", "fifteen"],
  ["sechzehn", "sixteen"],
  ["siebzehn", "seventeen"],
  ["achtzehn", "eighteen"],
  ["neunzehn", "nineteen"],
  ["zwanzig", "twenty"],
  ["dreißig", "thirty"],
  ["vierzig", "forty"],
  ["fünfzig", "fifty"],
  ["sechzig", "sixty"],
  ["siebzig", "seventy"],
  ["achtzig", "eighty"],
  ["neunzig", "ninety"],
  ["hundert", "hundred"],
  ["null", "zero"],
  ["erste ersten erster erstem erstes", "first"],
  ["zweite zweiten zweiter zweitem zweites", "second"],
  ["dritte dritten dritter drittem drittes", "third"],
  ["nächste nächsten nächster nächstem nächstes", "next"],
  ["beste besten bester bestem bestes", "best"],
  ["bin bist ist sind seid war warst waren wart gewesen", "be / am / is / are / was / were"],
  ["habe hast hat haben habt hatte hattest hatten hattet gehabt", "have / has / had"],
  ["werde wirst wird werden werdet wurde wurdest wurden wurdet geworden", "become / will / became"],
  ["kann kannst können könnt konnte konntest konnten konntet gekonnt", "can / be able to"],
  ["muss musst müssen müsst musste musstest mussten musstet gemusst", "must / have to"],
  ["will willst wollen wollt wollte wolltest wollten wolltet gewollt", "want / want to"],
  ["soll sollst sollen sollt sollte solltest sollten solltet gesollt", "should / be supposed to"],
  ["darf darfst dürfen dürft durfte durftest durften durftet gedurft", "may / be allowed to"],
  ["mag magst mögen mögt mochte mochtest mochten mochtet gemocht", "like"],
  ["möchte möchtest möchten möchtet", "would like"],
  ["wäre wär wärst wären wärt", "would be"],
  ["hätte hätt hättest hätten hättet", "would have"],
  ["würde würd würdest würden würdet", "would"],
  ["könnte könntest könnten könntet", "could"],
  ["müsste müsstest müssten müsstet", "would have to"],
  ["dürfte dürftest dürften dürftet", "might / would be allowed to"],
  ["weiß weißt wissen wisst wusste wusstest wussten wusstet gewusst", "know"],
  ["gehe gehst geht gehen ging gingst gingen gingt gegangen", "go / walk"],
  ["komme kommst kommt kommen kam kamst kamen kamt gekommen", "come"],
  ["angekommen", "arrived"],
  ["kriege krieg kriegst kriegt kriegen", "get / manage"],
  ["sehe siehst sieht sehen sah sahst sahen saht gesehen", "see"],
  ["spreche sprichst spricht sprechen sprach sprachst sprachen spracht gesprochen", "speak / talk"],
  ["sage sagst sagt sagen sagte sagtest sagten sagtet gesagt", "say / tell"],
  ["denke denkst denkt denken dachte dachtest dachten dachtet gedacht", "think"],
  ["finde findest findet finden fand fandest fanden fandet gefunden", "find / think"],
  ["nehme nimmst nimmt nehmen nahm nahmst nahmen nahmt genommen", "take"],
  ["nimm", "take"],
  ["gebe gibst gibt geben gab gabst gaben gabt gegeben", "give / there is"],
  ["koste kostest kostet kosten kostete gekostet", "cost / taste"],
  ["falle fällst fällt fallen fiel fielst fielen fielt gefallen", "fall / be pleasing"],
  ["gefällt", "is pleasing / likes"],
  ["bleibe bleibst bleibt bleiben blieb bliebst blieben bliebt geblieben", "stay / remain"],
  ["lasse lässt lasst lassen ließ ließt ließen ließt gelassen", "let / leave"],
  ["stehe stehst steht stehen stand standest standen standet gestanden", "stand"],
  ["liege liegst liegt liegen lag lagst lagen lagt gelegen", "lie / be located"],
  ["sitze sitzt sitzen saß saßt saßen gesessen", "sit"],
  ["esse isst esst essen aß aßt aßen gegessen", "eat"],
  ["trinke trinkst trinkt trinken trank trankst tranken trankt getrunken", "drink"],
  ["fahre fährst fährt fahren fuhr fuhrst fuhren fuhrt gefahren", "drive / travel"],
  ["schlafe schläfst schläft schlafen schlief schliefst schliefen schlieft geschlafen", "sleep"],
  ["lese liest lest lesen las last lasen gelesen", "read"],
  ["schreibe schreibst schreibt schreiben schrieb schriebst schrieben schriebt geschrieben", "write"],
  ["bringe bringst bringt bringen brachte brachtest brachten brachtet gebracht", "bring"],
  ["tue tust tut tun tat tatest taten tatet getan", "do"],
  ["heiße heißt heißen hieß hießt hießen geheißen", "be called / mean"],
  ["helfe hilfst hilft helfen half halfst halfen halft geholfen", "help"],
  ["treffe triffst trifft treffen traf trafst trafen traft getroffen", "meet / hit"],
  ["laufe läufst läuft laufen lief liefst liefen lieft gelaufen", "run / walk"],
  ["halte hältst hält halten hielt hieltest hielten hieltet gehalten", "hold / stop"],
  ["verstehe verstehst versteht verstehen verstand verstandest verstanden verstandet", "understand"],
  ["vergesse vergisst vergesst vergessen vergaß vergaßt vergaßen", "forget"],
  ["verliere verlierst verliert verlieren verlor verlorst verloren", "lose"],
  ["fange fängst fängt fangen fing fingst fingen fingt", "catch / start"],
  ["fang", "catch / start"],
  ["angefangen", "started"],
  ["rufe rufst ruft rufen rief riefst riefen gerufen angerufen", "call / shout"],
  ["gucke guckst guckt gucken geguckt", "look / watch"],
  ["gelte giltst gilt gelten galt galten gegolten", "apply / be valid"],
  ["wünsche wünschst wünscht wünschen wünschte wünschtest wünschten gewünscht", "wish"],
  ["verspreche versprichst verspricht versprechen versprach versprochen", "promise"],
  ["gedanke gedanken", "thought"],
  ["gleis gleise gleisen", "platform / track"],
  ["oma omas", "grandma"],
  ["opa opas", "grandpa"],
  ["blume blumen", "flower"],
  ["glückwunsch glückwünsche", "congratulations"],
  ["wäsche", "washing / laundry"],
  ["irgendwann", "at some point"],
  ["meistens", "usually / mostly"],
  ["super", "great / super"],
  ["abends", "in the evenings"],
  ["morgens", "in the mornings"],
  ["drüben", "over there"],
  ["rüber", "over / across"],
  ["oben", "up / at the top"],
  ["unten", "down / at the bottom"],
  ["kühlschrank kühlschränke", "fridge"],
  ["heizung heizungen", "heating"],
  ["online", "online"],
  ["per", "by / via"],
  ["sofa sofas", "sofa"],
  ["toi", "(toi, toi, toi) good luck"],
  ["geschnitten", "cut / sliced"],
  ["statt", "instead of"],
  ["daumen", "thumb"],
  ["reserviert", "reserved"],
  ["rieche riechst riecht riechen roch gerochen", "smell"],
  ["wach", "awake"],
  ["ausgefallen", "cancelled / unusual"],
  ["bloß", "just / only"],
  ["cent", "cent"],
  ["flur flure", "hall / hallway"],
  ["gebeten", "asked / requested"],
  ["guck", "look / watch"],
  ["hey", "hey"],
  ["irgendwie", "somehow"],
  ["kilo kilos", "kilo"],
  ["anna tom jonas", "(name)"],
  ["damals", "back then"],
  ["sogar", "even"],
  ["tüte tüten", "bag"],
  ["brille brillen", "glasses"],
  ["extra", "extra / specially"],
  ["irgendwas", "something / anything"],
  ["je", "ever / per"],
  ["komisch", "funny / odd"],
  ["lach lache lachst lacht lachen lachte gelacht", "laugh"],
  ["meinte meintest meinten gemeint", "meant / said"],
  ["mist", "darn / blast"],
  ["schlimmer", "worse"],
  ["tee tees", "tea"],
  ["überall", "everywhere"],
  ["übrigens", "by the way"],
  ["wenn's", "if it / when it"],
  ["zweihundert", "two hundred"],
  ["aufhören", "to stop"],
  ["schwanz schwänze", "tail"],
  ["deckel", "lid / beer mat (tab)"],
  ["mitternacht", "midnight"],
  ["suppe suppen", "soup"],
  ["anstoßen", "to clink glasses / to toast"],
  ["bald", "soon"],
  ["freut", "pleases / is glad"],
  ["hauptsache", "the main thing"],
  ["hoffentlich", "hopefully"],
  ["prost", "cheers"],
  ["schlimm", "bad / serious"],
  ["aufzug aufzüge", "lift / elevator"],
  ["automat automaten", "machine / dispenser"],
  ["besonders", "especially"],
  ["dünn", "thin"],
  ["eingeschlafen", "fallen asleep"],
  ["gib", "give"],
  ["homeoffice", "working from home"],
  ["beileid", "condolences"],
  ["abseits", "offside"],
  ["mail mails", "email"],
  ["nerven", "nerves"],
  ["treppenhaus", "stairwell"],
  ["unterschreiben unterschrieben", "to sign"],
  ["wlan", "wifi"],
  ["brötchen", "bread roll"],
  ["dasselbe", "the same"],
  ["hose hosen", "trousers"],
  ["inzwischen", "by now / meanwhile"],
  ["käse", "cheese"],
  ["kiste kisten", "box / crate"],
  ["manche", "some"],
  ["muskelkater", "muscle ache"],
  ["nachts", "at night"],
  ["pro", "per"],
  ["scheiße", "(rude) damn / crap"],
  ["kita kitas", "nursery / daycare"],
  ["fieber", "fever"],
  ["mathe", "maths"],
  ["router", "router"],
  ["süß", "sweet / cute"],
  ["vergiss", "forget"],
  ["werkstatt werkstätten", "garage / workshop"],
  ["zettel", "note / slip of paper"],
  ["allem", "everything (dative)"],
  ["bar", "cash"],
  ["fällig", "due"],
  ["heiraten", "to marry"],
  ["innerhalb", "within"],
  ["lädt", "loads / invites"],
  ["leihen", "to lend / to borrow"],
  ["schlaf", "sleep"],
  ["schwimmen", "to swim"],
  ["sonntags", "on Sundays"],
  ["abgemacht", "agreed / it is a deal"],
  ["billiger", "cheaper"],
  ["keller", "cellar / basement"],
  ["klingelt", "rings"],
  ["tomaten", "tomatoes"],
  ["übernimmt", "takes over"],
  ["überweisung", "bank transfer"],
  ["waschen", "to wash"],
  ["absagen", "to cancel / to decline"],
  ["briefkasten", "letterbox / postbox"],
  ["erstaunlich", "astonishing"],
  ["frisst", "eats (of an animal)"],
  ["genauso", "exactly the same"],
  ["grüß", "greet / say hello"],
  ["heb", "lift / keep"],
  ["kürzer", "shorter"],
  ["nachher", "afterwards / later"],
  ["rückmeldung", "reply / feedback"],
  ["hamburg", "Hamburg (city)"],
  ["koffer", "suitcase"],
  ["schlange", "queue / snake"],
  ["angemeldet", "signed up / registered"],
  ["arm", "arm / poor"],
  ["griff", "handle / grip"],
  ["hochzeit", "wedding"],
  ["salat", "salad / lettuce"],
  ["seitdem", "since then"],
  ["tafel", "board / bar of chocolate"],
  ["taxi", "taxi"],
  ["tippe", "type / tap in"],
  ["trägt", "carries / wears"],
  ["tüv", "TÜV, the vehicle inspection"],
  ["untertiteln", "subtitles"],
  ["vorsichtig", "careful / carefully"],
  ["weber", "Weber (surname)"],
  ["woran", "at what / of what"],
  ["abgegeben", "handed in"],
  ["größer", "bigger"],
  ["meisten", "most"],
  ["still", "quiet / still"],
  ["fundbüro", "lost-property office"],
  ["futter", "lining / animal feed"],
  ["herum", "around"],
  ["notdienst", "emergency duty"],
  ["öfter", "more often"],
  ["spiegel", "mirror"],
  ["trinkgeld", "tip"],
  ["worauf", "on what / for what"],
  ["zufällig", "by chance"],
  ["zwiebeln", "onions"],
  ["abendessen", "dinner / evening meal"],
  ["absage", "cancellation / rejection"],
  ["anstrengend", "tiring"],
  ["ärger", "trouble / annoyance"],
  ["salz", "salt"],
  ["schnee", "snow"],
  ["dahin", "until then / there"],
  ["jederzeit", "at any time"],
  ["kaution", "deposit"],
  ["längst", "long since"],
  ["locker", "loose / relaxed"],
  ["pflaster", "plaster / paving"],
  ["vertretung", "stand-in / cover"],
  ["abo", "subscription"],
  ["abschlag", "payment on account"],
  ["ausgang", "exit / outcome"],
  ["balkon", "balcony"],
  ["brei", "purée / porridge"],
  ["dagegen", "against it"],
  ["date", "date (romantic)"],
  ["deal", "deal"],
  ["e-mail", "email"],
  ["sperrmüll", "bulky waste"],
  ["stets", "always"],
  ["verboten", "forbidden"],
  ["erkältung", "cold (illness)"],
  ["erwischt", "caught"],
  ["kündigungsfrist", "notice period"],
  ["lüften", "to air (a room)"],
  ["schild", "sign"],
  ["schrank", "wardrobe / cupboard"],
  ["übergabe", "handover"],
  ["wenigstens", "at least"],
  ["brutto", "gross (before tax)"],
  ["eingefroren", "frozen"],
  ["einschlafen", "to fall asleep"],
  ["einschreiben", "registered letter"],
  ["entschuldigen", "to apologise / excuse"],
  ["erdbeeren", "strawberries"],
  ["erstattung", "refund"],
];

for (const [words, gloss] of coreGlossGroups) addGloss(exactGlosses, words, gloss);

const addGeneratedVerbForms = (lemma: string, gloss: string) => {
  if (!lemma || lemma.includes(" ") || lemma.includes("-")) return;
  const stem = lemma.endsWith("en") ? lemma.slice(0, -2) : lemma.endsWith("n") ? lemma.slice(0, -1) : "";
  if (stem.length < 3) return;

  const needsExtraE = /[td]$/u.test(stem);
  const endsInSibilant = /[sßxz]$/u.test(stem);
  const regularParticiple = `${stem}${needsExtraE ? "et" : "t"}`;
  const forms = [
    stem,
    `${stem}e`,
    needsExtraE ? `${stem}est` : endsInSibilant ? `${stem}t` : `${stem}st`,
    needsExtraE ? `${stem}et` : `${stem}t`,
    lemma,
    needsExtraE ? `${stem}et` : `${stem}t`,
    lemma,
  ];
  if (lemma.endsWith("ieren") || /^(be|emp|ent|er|ge|miss|ver|zer)/u.test(lemma)) {
    forms.push(regularParticiple);
  } else {
    forms.push(`ge${regularParticiple}`);
  }
  for (const form of forms) {
    const key = wordKey(form);
    if (key && !verbFormGlosses.has(key)) verbFormGlosses.set(key, gloss);
  }
};

const addGeneratedAdjectiveForms = (lemma: string, gloss: string) => {
  if (!lemma || lemma.includes(" ") || lemma.includes("-")) return;
  const stems = new Set([lemma]);
  if (lemma.endsWith("er") && lemma.length > 4) stems.add(lemma.slice(0, -2) + "r");
  if (lemma.endsWith("el") && lemma.length > 4) stems.add(lemma.slice(0, -2) + "l");
  if (lemma === "hoch") stems.add("hoh");
  for (const stem of stems) {
    for (const ending of ["e", "en", "er", "es", "em"]) {
      const key = wordKey(stem + ending);
      if (key && !adjectiveFormGlosses.has(key)) adjectiveFormGlosses.set(key, gloss);
    }
  }
};

for (const rawEntry of bundledWordBank as WordBankEntry[]) {
  const gloss = conciseGloss(rawEntry.en ?? "");
  if (!gloss) continue;

  const lookup = stripGermanPunctuation(rawEntry.lookup ?? "");
  const bareGerman = stripGermanPunctuation(rawEntry.de ?? "").replace(/^(der|die|das)\s+/iu, "");
  for (const source of [lookup, bareGerman]) {
    const key = wordKey(source);
    if (key && !exactGlosses.has(key)) exactGlosses.set(key, gloss);
  }

  const lemma = wordKey(lookup || bareGerman);
  if (rawEntry.tip === "verb") addGeneratedVerbForms(lemma, gloss);
  if (rawEntry.tip === "adjective") addGeneratedAdjectiveForms(lemma, gloss);
  if (rawEntry.tip === "noun" && lemma && !nounGlosses.has(lemma)) nounGlosses.set(lemma, gloss);
}

const deUmlaut = (value: string) => value
  .replaceAll("ä", "a")
  .replaceAll("ö", "o")
  .replaceAll("ü", "u")
  .replaceAll("äu", "au");

const nounGloss = (word: string, key: string) => {
  if (!/^\p{Lu}/u.test(stripGermanPunctuation(word))) return null;
  const candidates = new Set([key, deUmlaut(key)]);
  let frontier = [key];
  for (let pass = 0; pass < 2; pass += 1) {
    const next: string[] = [];
    for (const candidate of frontier) {
      for (const suffix of ["ern", "en", "er", "es", "e", "n", "s"]) {
        if (!candidate.endsWith(suffix) || candidate.length - suffix.length < 3) continue;
        const stem = candidate.slice(0, -suffix.length);
        for (const variant of [stem, deUmlaut(stem)]) {
          if (!candidates.has(variant)) {
            candidates.add(variant);
            next.push(variant);
          }
        }
      }
    }
    frontier = next;
  }
  for (const candidate of candidates) {
    const gloss = nounGlosses.get(candidate);
    if (gloss) return gloss;
  }
  return null;
};

/**
 * Returns a short English gloss for a visible German word. The lookup is
 * entirely offline: curated high-frequency forms plus the bundled hardcoded
 * word bank. Unknown words stay unlabelled instead of guessing from a server.
 */
export function germanWordGloss(word: string): string | null {
  const key = wordKey(word);
  if (!key) return null;
  return exactGlosses.get(key)
    ?? verbFormGlosses.get(key)
    ?? adjectiveFormGlosses.get(key)
    ?? nounGloss(word, key)
    ?? null;
}
