
/**
 * The history of Britain as a line you can walk along.
 *
 * The syllabus teaches history as five chapters of prose, which is fine for
 * reading and poor for the thing the test actually asks: whether 1707 came
 * before or after 1801, and which of two adjacent dates belongs to which
 * event. A timeline puts them in the only order that makes that obvious.
 *
 * `year` is a number so the list can be sorted and searched arithmetically —
 * negative for BC. `displayYear` is what a human should read, because "55 BC"
 * and "1536–1543" are not numbers.
 */
export type UkTimelineEvent = {
  id: string;
  year: number;
  /**
   * The year a span ENDED, for events that cover one.
   *
   * The list sorts on this when it is present. A 70-year reign sorted by its
   * first year lands where it began, which put Elizabeth II between the NHS
   * and joining the EEC — reading down the line she appeared to be finished
   * before Thatcher took office. Undefined for a single date, and for an open
   * span like "1947 onwards" that has no end to sort by.
   */
  endYear?: number;
  displayYear: string;
  title: string;
  summary: string;
  /** The longer text revealed on click. */
  detail: string;
  era: UkEra;
  /** Which syllabus area it belongs to, as a label. */
  category: string;
  /** People, places and terms, so search reaches this event by any of them. */
  tags: string[];
};

type UkEra =
  | "prehistory"
  | "roman"
  | "medieval"
  | "tudor-stuart"
  | "georgian-victorian"
  | "modern";

export const UK_ERA_LABELS: Record<UkEra, string> = {
  prehistory: "Early Britain",
  roman: "Roman Britain",
  medieval: "The Middle Ages",
  "tudor-stuart": "Tudors and Stuarts",
  "georgian-victorian": "Georgians and Victorians",
  modern: "Modern Britain",
};

export const UK_ERA_ORDER: UkEra[] = [
  "prehistory",
  "roman",
  "medieval",
  "tudor-stuart",
  "georgian-victorian",
  "modern",
];

const event = (
  id: string,
  year: number,
  displayYear: string,
  era: UkEra,
  title: string,
  summary: string,
  detail: string,
  tags: string[],
  category = "History"
): UkTimelineEvent => ({ id, year, displayYear, era, title, summary, detail, tags, category });

/** Same, for an event that covers a span of years and ends in a known one. */
const span = (
  id: string,
  year: number,
  endYear: number,
  displayYear: string,
  era: UkEra,
  title: string,
  summary: string,
  detail: string,
  tags: string[],
  category = "History"
): UkTimelineEvent => ({ id, year, endYear, displayYear, era, title, summary, detail, tags, category });

export const UK_TIMELINE: UkTimelineEvent[] = [
  event("t-stonehenge", -3000, "c. 3000 BC", "prehistory", "Stonehenge is built",
    "Construction begins on Salisbury Plain.",
    "Built in stages over centuries on Salisbury Plain in Wiltshire, probably as a place of ceremony and burial. It stands today as a World Heritage Site. Skara Brae in Orkney, the best-preserved Stone Age village in northern Europe, dates from a similar period.",
    ["Stonehenge", "Wiltshire", "Skara Brae", "Orkney", "Stone Age"]),
  event("t-caesar", -55, "55 BC", "roman", "Julius Caesar's failed invasion",
    "Caesar lands in Britain — and does not stay.",
    "The famous date, and a trap: Caesar's expedition of 55 BC did not conquer Britain. It was a raid that withdrew. The invasion that actually took hold came almost a century later under Claudius.",
    ["Julius Caesar", "Romans", "55 BC"]),
  event("t-claudius", 43, "AD 43", "roman", "The Roman conquest under Claudius",
    "Britain becomes part of the Roman Empire.",
    "The Emperor Claudius invaded successfully in AD 43, and Roman rule lasted almost 400 years. The Romans built the towns, roads and baths that shaped Britain long after they left, but never conquered what is now Scotland or Ireland.",
    ["Claudius", "Romans", "AD 43"]),
  event("t-boudicca", 60, "AD 60", "roman", "Boudicca's rebellion",
    "The Iceni rise against Roman rule.",
    "Boudicca, queen of the Iceni in eastern England, led a fierce revolt against the Romans. It was defeated, but she is remembered as a symbol of resistance and her statue stands on Westminster Bridge in London.",
    ["Boudicca", "Iceni", "Romans", "London"]),
  event("t-hadrian", 122, "AD 122", "roman", "Hadrian's Wall is begun",
    "A frontier is built across northern England.",
    "Built on the orders of the Emperor Hadrian to defend the province against the Picts of what is now Scotland. Much of it still stands and it is a World Heritage Site.",
    ["Hadrian's Wall", "Picts", "Romans", "Scotland"]),
  event("t-romans-leave", 410, "AD 410", "roman", "The Romans leave Britain",
    "The legions withdraw and do not return.",
    "The Roman army left to defend other parts of a collapsing empire. Britain was left to defend itself, and within a few decades Anglo-Saxon settlers from the continent were arriving in numbers.",
    ["Romans", "AD 410"]),
  event("t-augustine", 597, "AD 597", "medieval", "St Augustine arrives in Kent",
    "Christianity spreads through southern England.",
    "Sent from Rome, St Augustine converted the south and became the first Archbishop of Canterbury. In the north, St Columba had founded a monastery on Iona, and St Patrick had already carried Christianity to Ireland.",
    ["St Augustine", "Canterbury", "St Columba", "Iona", "St Patrick"]),
  event("t-vikings", 789, "AD 789", "medieval", "The first Viking raids",
    "Raiders arrive from Denmark and Norway.",
    "At first they raided and left; later they settled, especially in the east and north, in the area that became known as the Danelaw. Place names ending in -by and -thorpe are their legacy. King Alfred the Great of Wessex was the Anglo-Saxon king who defeated them in battle.",
    ["Vikings", "Danelaw", "Alfred the Great", "Wessex"]),
  event("t-hastings", 1066, "1066", "medieval", "The Norman Conquest",
    "William of Normandy defeats Harold at Hastings.",
    "The single most important date in English history and the last time Britain was successfully invaded. William, Duke of Normandy, defeated King Harold — the last Anglo-Saxon king — at the Battle of Hastings and became William the Conqueror. The Bayeux Tapestry tells the story; the Domesday Book of 1086 recorded who owned what, for tax. Norman French reshaped the English language.",
    ["1066", "Battle of Hastings", "William the Conqueror", "Harold", "Normans", "Bayeux Tapestry", "Domesday Book"]),
  event("t-domesday", 1086, "1086", "medieval", "The Domesday Book",
    "England's land is surveyed and recorded.",
    "Ordered by William the Conqueror, it recorded landholding across England so that it could be taxed. It remains one of the most complete records of any medieval society.",
    ["Domesday Book", "William the Conqueror", "1086"]),
  event("t-magna-carta", 1215, "1215", "medieval", "Magna Carta",
    "King John accepts that the king is not above the law.",
    "Forced on King John by his barons at Runnymede. Magna Carta — the Great Charter — established that the monarch was subject to the law. It is the root of the rule of law, one of the UK's stated fundamental principles.",
    ["Magna Carta", "King John", "Runnymede", "1215", "rule of law"], "Values and principles"),
  event("t-rhuddlan", 1284, "1284", "medieval", "The Statute of Rhuddlan",
    "Wales is annexed to the English Crown.",
    "Welsh resistance continued long afterwards, most famously under Owain Glyndŵr in the early 1400s. Formal union with England came with the Acts of Union of 1536 and 1543.",
    ["Statute of Rhuddlan", "Wales", "Owain Glyndwr"]),
  event("t-bannockburn", 1314, "1314", "medieval", "The Battle of Bannockburn",
    "Robert the Bruce defeats the English.",
    "Scotland kept its independence for centuries more. The crowns were not joined until 1603, and the parliaments not until 1707.",
    ["Robert the Bruce", "Bannockburn", "Scotland", "1314"]),
  span("t-hundred-years", 1337, 1453, "1337–1453", "medieval", "The Hundred Years War",
    "England and France fight on and off for over a century.",
    "The best-remembered English victory is Agincourt in 1415, won by Henry V against far larger French numbers thanks largely to the longbow. The war ended in 1453 with England holding almost nothing in France.",
    ["Hundred Years War", "Agincourt", "Henry V", "France", "1415"]),
  event("t-black-death", 1348, "1348", "medieval", "The Black Death",
    "Plague kills about a third of the population.",
    "Because so few labourers survived, those who did could demand better conditions. It marked the beginning of the end of the feudal system and the rise of a middle class of landowning farmers.",
    ["Black Death", "plague", "1348", "feudalism"]),
  event("t-bosworth", 1485, "1485", "medieval", "The Battle of Bosworth Field",
    "The Wars of the Roses end and the Tudors begin.",
    "Richard III was killed and Henry Tudor took the throne as Henry VII, ending thirty years of civil war between the House of Lancaster (a red rose) and the House of York (a white rose). The Tudor rose — red with a white centre — marked the two houses joined.",
    ["Bosworth Field", "Wars of the Roses", "Richard III", "Henry VII", "Tudor rose", "1485"]),
  event("t-reformation", 1534, "1534", "tudor-stuart", "The break with Rome",
    "Henry VIII makes himself head of the Church of England.",
    "The Pope refused to annul Henry's marriage, so Henry broke with Rome, declared himself head of the Church of England and dissolved the monasteries. The English Reformation was as much dynastic as religious. Henry had six wives: Catherine of Aragon, Anne Boleyn, Jane Seymour, Anne of Cleves, Catherine Howard and Catherine Parr.",
    ["Henry VIII", "Reformation", "Church of England", "Anne Boleyn", "Catherine of Aragon"]),
  span("t-wales-union", 1536, 1543, "1536–1543", "tudor-stuart", "Wales is united with England",
    "The Acts of Union give Wales seats in Parliament.",
    "Wales gained representation in the English Parliament, and English became the language of its courts. This is why Wales is not represented separately on the Union Flag.",
    ["Acts of Union", "Wales", "1536", "1543"]),
  event("t-armada", 1588, "1588", "tudor-stuart", "The Spanish Armada is defeated",
    "Philip II's invasion fleet fails.",
    "Sent by Philip II of Spain to invade England, the Armada was defeated and scattered. It is one of the defining events of Elizabeth I's reign, alongside exploration and the theatre of Shakespeare.",
    ["Spanish Armada", "Elizabeth I", "Philip II", "1588"]),
  event("t-union-crowns", 1603, "1603", "tudor-stuart", "The Union of the Crowns",
    "James VI of Scotland becomes James I of England.",
    "Elizabeth I died childless, and the throne passed to her cousin's son — the king of Scotland. One monarch now ruled two still-separate kingdoms. His mother, Mary Queen of Scots, had been executed in 1587.",
    ["James I", "James VI", "Union of the Crowns", "Mary Queen of Scots", "1603"]),
  event("t-gunpowder", 1605, "1605", "tudor-stuart", "The Gunpowder Plot",
    "Guy Fawkes is caught beneath the House of Lords.",
    "A group of Catholic conspirators tried to blow up Parliament and kill James I. Guy Fawkes was found guarding the explosives. The failure is still marked every 5 November with bonfires and fireworks.",
    ["Gunpowder Plot", "Guy Fawkes", "Bonfire Night", "1605"], "Society and culture"),
  span("t-civil-war", 1642, 1651, "1642–1651", "tudor-stuart", "The English Civil War",
    "Parliament fights the king, and wins.",
    "Charles I believed he ruled by divine right and clashed with Parliament over money and religion. Cavaliers fought Roundheads; Parliament won. Charles I was executed in 1649, the only English king put to death by his own subjects, and Oliver Cromwell ruled as Lord Protector for eleven years.",
    ["English Civil War", "Charles I", "Oliver Cromwell", "Cavaliers", "Roundheads", "1649"]),
  event("t-restoration", 1660, "1660", "tudor-stuart", "The Restoration",
    "Charles II is invited back to the throne.",
    "Parliament restored the monarchy. Two disasters followed in quick succession: the Great Plague of 1665 and the Great Fire of London in 1666. The Royal Society, which promoted science and counted Isaac Newton among its members, was founded in this reign.",
    ["Charles II", "Restoration", "Great Plague", "Great Fire of London", "Royal Society", "1665", "1666"]),
  event("t-glorious", 1688, "1688", "tudor-stuart", "The Glorious Revolution",
    "William of Orange takes the throne almost without a fight.",
    "Parliament feared a Catholic dynasty under James II and invited William of Orange, the Dutch husband of James's daughter Mary. James fled. The Bill of Rights of 1689 followed, requiring the monarch to govern with Parliament — no taxes and no army without consent. This is where constitutional monarchy begins.",
    ["Glorious Revolution", "William of Orange", "James II", "Bill of Rights", "1688", "1689", "constitutional monarchy"], "Government and the law"),
  event("t-union-1707", 1707, "1707", "georgian-victorian", "The Act of Union with Scotland",
    "One parliament for the Kingdom of Great Britain.",
    "England and Scotland had shared a monarch since 1603; in 1707 their parliaments merged at Westminster. Jacobite supporters of the exiled Stuarts rebelled, most seriously under Bonnie Prince Charlie in 1745, crushed at Culloden in 1746 — the last battle fought on British soil.",
    ["Act of Union", "Great Britain", "1707", "Jacobites", "Bonnie Prince Charlie", "Culloden"], "Government and the law"),
  event("t-industrial", 1760, "c. 1760 onwards", "georgian-victorian", "The Industrial Revolution",
    "Britain becomes the first industrial nation.",
    "Steam power, coal, iron and textile machinery turned a farming country into a manufacturing one, and people moved from villages into fast-growing cities. James Watt's improvements to the steam engine and Richard Arkwright's factory methods were central. Conditions were brutal — long hours, dangerous machinery and child labour were normal.",
    ["Industrial Revolution", "James Watt", "Richard Arkwright", "steam engine"]),
  event("t-trafalgar", 1805, "1805", "georgian-victorian", "The Battle of Trafalgar",
    "Nelson destroys the French and Spanish fleets, and dies.",
    "Admiral Nelson's victory secured British control of the seas. Nelson's Column in Trafalgar Square commemorates him. Ten years later the Duke of Wellington finally defeated Napoleon at Waterloo in 1815.",
    ["Trafalgar", "Nelson", "Waterloo", "Wellington", "Napoleon", "1805", "1815"]),
  event("t-slave-trade", 1807, "1807", "georgian-victorian", "The slave trade is abolished",
    "Britain outlaws the trade — but not yet slavery itself.",
    "A campaign led by William Wilberforce and others, including Quakers, turned public opinion. The trade was abolished in 1807; slavery itself throughout the British Empire was not abolished until 1833. The two dates are commonly confused.",
    ["slave trade", "William Wilberforce", "abolition", "1807", "1833"]),
  event("t-union-1801", 1801, "1801", "georgian-victorian", "The Act of Union with Ireland",
    "The United Kingdom of Great Britain and Ireland is formed.",
    "Ireland was joined to Great Britain, and the country took the name it kept until 1922.",
    ["Act of Union", "Ireland", "1801"], "Government and the law"),
  span("t-victoria", 1837, 1901, "1837–1901", "georgian-victorian", "The reign of Queen Victoria",
    "64 years, and the empire at its height.",
    "At its peak the British Empire covered around a quarter of the world's population. At home the century brought reform: laws limiting the hours women and children could work, the growth of trade unions, and Reform Acts widening the vote. Florence Nightingale transformed nursing during the Crimean War; Brunel built the railways; the Great Exhibition of 1851 displayed British industry in the Crystal Palace.",
    ["Queen Victoria", "British Empire", "Florence Nightingale", "Brunel", "Great Exhibition", "Crimean War", "1851"]),
  span("t-famine", 1845, 1852, "1845–1852", "georgian-victorian", "The Irish famine",
    "About a million die and many more emigrate.",
    "Ireland's population fell sharply and the demand for Home Rule grew through the rest of the century.",
    ["Irish famine", "Ireland", "emigration"]),
  span("t-ww1", 1914, 1918, "1914–1918", "modern", "The First World War",
    "Britain enters after Germany invades Belgium.",
    "More than a million British and Empire servicemen died. The Battle of the Somme in 1916 saw around 60,000 British casualties on its first day alone. The war is remembered every 11 November — Remembrance Day — with poppies and a two-minute silence at 11am.",
    ["First World War", "Somme", "Remembrance Day", "poppy", "1914", "1918"]),
  span("t-suffrage", 1918, 1928, "1918 and 1928", "modern", "Votes for women",
    "Partial in 1918, equal in 1928.",
    "The suffragettes campaigned, and often went to prison, for the right to vote. In 1918 women over 30 who met a property qualification were enfranchised. It was 1928 before women could vote at 21 on the same terms as men. The two dates are a common test question.",
    ["suffrage", "suffragettes", "women's vote", "1918", "1928"], "Government and the law"),
  event("t-irish-free-state", 1922, "1922", "modern", "The Irish Free State",
    "Ireland divides and the UK takes its present name.",
    "After a war of independence the Irish Free State became a separate country, while six counties in the north remained. The country became the United Kingdom of Great Britain and Northern Ireland.",
    ["Irish Free State", "Northern Ireland", "1922"], "What is the UK?"),
  span("t-ww2", 1939, 1945, "1939–1945", "modern", "The Second World War",
    "Britain declares war after Germany invades Poland.",
    "Winston Churchill became Prime Minister in 1940. Over 300,000 troops were evacuated from Dunkirk, many by small civilian boats. The RAF held off the German air force in the Battle of Britain, preventing invasion. Allied forces landed in Normandy on D-Day, 6 June 1944. Alan Turing and colleagues at Bletchley Park broke German codes, work now credited with shortening the war.",
    ["Second World War", "Winston Churchill", "Dunkirk", "Battle of Britain", "D-Day", "Alan Turing", "Bletchley Park", "1940", "1944"]),
  event("t-nhs", 1948, "1948", "modern", "The NHS is founded",
    "Free healthcare at the point of use.",
    "The Beveridge Report of 1942 named five 'giants' — want, disease, ignorance, squalor and idleness. After the war the Labour government acted on it, and Health Minister Aneurin Bevan created the National Health Service in 1948. The same year, the Windrush brought an early group of workers invited from the Caribbean to help rebuild Britain.",
    ["NHS", "Aneurin Bevan", "Beveridge Report", "welfare state", "Windrush", "1948", "1942"], "Society and culture"),
  event("t-independence", 1947, "1947 onwards", "modern", "The end of empire",
    "India and Pakistan gain independence.",
    "Most remaining colonies followed over the next thirty years. Many joined the Commonwealth, a voluntary association of independent countries which now has around 56 members.",
    ["India", "Pakistan", "Commonwealth", "empire", "1947"]),
  event("t-eec", 1973, "1973", "modern", "The UK joins the EEC",
    "Britain enters the European Economic Community.",
    "The UK joined in 1973, voted in a referendum in 2016 to leave the European Union, and formally left in 2020.",
    ["EEC", "European Union", "Brexit", "1973", "2016", "2020"], "Government and the law"),
  event("t-thatcher", 1979, "1979", "modern", "The first female Prime Minister",
    "Margaret Thatcher takes office.",
    "Margaret Thatcher was Prime Minister from 1979 to 1990. Britain retook the Falkland Islands after an Argentine invasion in 1982.",
    ["Margaret Thatcher", "Falklands", "1979", "1982"], "Government and the law"),
  event("t-good-friday", 1998, "1998", "modern", "The Good Friday Agreement",
    "Three decades of conflict are brought to an end.",
    "The Troubles in Northern Ireland were largely ended by the agreement, which established a power-sharing assembly at Stormont.",
    ["Good Friday Agreement", "The Troubles", "Northern Ireland", "Stormont", "1998"], "Government and the law"),
  event("t-devolution", 1999, "1999", "modern", "Devolution",
    "Scotland, Wales and Northern Ireland get their own bodies.",
    "Following referendums, powers were transferred from Westminster to a Scottish Parliament, a Welsh Assembly (now the Senedd) and a Northern Ireland Assembly. Each controls devolved matters such as health and education; defence, foreign policy and immigration stay with the UK Parliament.",
    ["devolution", "Scottish Parliament", "Senedd", "Northern Ireland Assembly", "1999"], "Government and the law"),
  span("t-elizabeth", 1952, 2022, "1952–2022", "modern", "The reign of Elizabeth II",
    "The longest reign in British history.",
    "Elizabeth II reigned for 70 years, passing Queen Victoria's 64. She was succeeded by Charles III.",
    ["Elizabeth II", "Charles III", "1952", "2022"], "Government and the law"),
  event("t-olympics", 2012, "2012", "modern", "London hosts the Olympic Games",
    "The third time London has staged them.",
    "London held the Olympic and Paralympic Games in 2012, having also hosted in 1908 and 1948 — more often than any other city. The Paralympic movement began in Britain, at Stoke Mandeville hospital in Buckinghamshire.",
    ["Olympics", "Paralympics", "London", "2012", "Stoke Mandeville"], "Society and culture"),
  event("t-scotland-referendum", 2014, "2014", "modern", "The Scottish independence referendum",
    "Scotland votes to stay in the United Kingdom.",
    "Voters in Scotland were asked whether Scotland should become an independent country. The answer was no, by 55% to 45%, on a turnout of about 85% — the highest recorded for any vote in Scotland.",
    ["Scotland", "referendum", "independence", "2014"], "Government and the law"),
  event("t-eu-referendum", 2016, "2016", "modern", "The referendum on EU membership",
    "The UK votes to leave the European Union.",
    "In June 2016 the UK voted by 52% to 48% to leave the European Union, which it had joined as the EEC in 1973. Leaving took nearly four more years to negotiate.",
    ["European Union", "referendum", "Brexit", "2016"], "Government and the law"),
  event("t-brexit", 2020, "2020", "modern", "The UK leaves the European Union",
    "Membership formally ends on 31 January.",
    "The UK left the EU on 31 January 2020, followed by a transition period that ran to the end of that year. Note the gap the test likes: the vote was 2016, the departure 2020.",
    ["Brexit", "European Union", "2020", "31 January"], "Government and the law"),
  event("t-charles", 2022, "2022", "modern", "Charles III becomes King",
    "The throne passes on the death of Elizabeth II.",
    "Elizabeth II died in September 2022 after 70 years, and Charles III succeeded her immediately — a monarch becomes monarch on the death of the last one, not at the coronation.",
    ["Charles III", "Elizabeth II", "2022", "succession"], "Government and the law"),
  event("t-coronation", 2023, "2023", "modern", "The coronation of Charles III",
    "Crowned at Westminster Abbey in May.",
    "Charles III was crowned at Westminster Abbey by the Archbishop of Canterbury in May 2023, eight months after becoming King. The ceremony confirms a reign that has already begun.",
    ["coronation", "Westminster Abbey", "Charles III", "2023"], "Government and the law"),
];

/**
 * Chronological, which is the only order a timeline can be in.
 *
 * A span sorts on the year it ended, so a long reign or a long war sits where
 * it finished rather than where it started. Ties fall back to the start year,
 * so 2022 (Charles III succeeds) follows 1952–2022 (the reign that ended that
 * year) instead of ordering at random.
 */
const sortYear = (entry: UkTimelineEvent) => entry.endYear ?? entry.year;

export function ukTimelineSorted(): UkTimelineEvent[] {
  return [...UK_TIMELINE].sort((a, b) => sortYear(a) - sortYear(b) || a.year - b.year);
}
