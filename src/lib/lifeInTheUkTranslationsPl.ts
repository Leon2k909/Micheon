/**
 * Polish for the Life in the UK course cards and headings.
 *
 * Keyed on the ENGLISH source text exactly as it appears in
 * lifeInTheUkCourse.ts. A missing key is not an error — the card simply shows
 * no translation and says so, which is why this can be filled in over time
 * rather than all at once. check-uk-translations fails on a key that matches
 * nothing in the course, because a typo there is silent otherwise.
 *
 * Names of institutions, laws and offices stay in English on purpose:
 * "House of Commons", "Magna Carta", "Royal Assent", "Bill of Rights". The
 * exam is sat in English and asks for those exact words — translating them
 * would teach the wrong answer. What gets translated is the explanation
 * around them. Place names follow the same rule: someone reading a map or a
 * road sign in Britain needs "Edinburgh", not "Edynburg", so the English form
 * leads and the Polish exonym is only used where Polish would never say
 * anything else (Londyn, Tamiza, Szkocja).
 */
export const LIFE_IN_THE_UK_PL: Record<string, string> = {
  // ── Lesson titles and chapter headings ──────────────────────────────────
  // Shown under the English on the lesson cards, so a topic can be found by
  // its Polish name without losing the English one that the exam uses.
  "Values and principles": "Wartości i zasady",
  "What is the UK?": "Czym jest Wielka Brytania?",
  "A long and illustrious history": "Długa i znamienita historia",
  "Government, the law and your role": "Rząd, prawo i twoja rola",
  "A modern, thriving society": "Nowoczesne, prężne społeczeństwo",
  "British Values & Principles": "Brytyjskie wartości i zasady",
  "The UK & Geography": "Wielka Brytania i jej geografia",
  "National Identity & Symbols": "Tożsamość narodowa i symbole",
  "Early British History": "Wczesna historia Brytanii",
  "Medieval Britain": "Brytania średniowieczna",
  "The Tudors": "Tudorowie",
  "Stuarts & Civil War": "Stuartowie i wojna domowa",
  "Britain 1700–1900": "Brytania w latach 1700–1900",
  "Britain 1900–Present": "Brytania od 1900 do dziś",
  "Important Dates & Timeline": "Ważne daty i oś czasu",
  "The Monarchy": "Monarchia",
  "Government & Parliament": "Rząd i parlament",
  // "Devolution" has no single Polish word; the short explanation is what
  // Polish needs anyway, and the English term stays because the exam uses it.
  "Devolution": "Devolution — przekazanie władzy krajom Wielkiej Brytanii",
  "Law & Justice": "Prawo i wymiar sprawiedliwości",
  "Rights & Responsibilities": "Prawa i obowiązki",
  "British Society & Culture": "Społeczeństwo i kultura brytyjska",
  "Religion & Beliefs": "Religia i wierzenia",
  "British Traditions & Celebrations": "Brytyjskie tradycje i święta",
  "Sports & Leisure": "Sport i czas wolny",
  "Literature, Art & Music": "Literatura, sztuka i muzyka",
  "Science & Inventions": "Nauka i wynalazki",
  "Famous British People": "Znani Brytyjczycy",
  "Education & Healthcare": "Edukacja i opieka zdrowotna",

  // ── The tagline under the course name ───────────────────────────────────
  "History, government and traditions — how life in the UK works.":
    "Historia, ustrój i tradycje — jak działa życie w Wielkiej Brytanii.",

  // ── British values ──────────────────────────────────────────────────────
  "The fundamental principles": "Podstawowe zasady",
  "Equality: the nine protected characteristics": "Równość: dziewięć cech chronionych",
  "Rights and responsibilities": "Prawa i obowiązki",
  "Democracy": "Demokracja",
  "Government by the people, through representatives you elect and can vote out.":
    "Rządy ludu, poprzez przedstawicieli, których wybierasz i których możesz odsunąć od władzy.",
  "The rule of law": "Rządy prawa",
  "Everyone is subject to the law — including ministers, the police and the government itself.":
    "Prawu podlegają wszyscy — także ministrowie, policja i sam rząd.",
  "Individual liberty": "Wolność osobista",
  "Freedom to live as you choose, within the law.":
    "Wolność życia tak, jak sam wybierzesz, w granicach prawa.",
  "Equality": "Równość",
  "No one may be treated less favourably because of who they are. The Equality Act 2010 makes this law.":
    "Nikogo nie wolno traktować gorzej z powodu tego, kim jest. Ustawa Equality Act 2010 czyni z tego prawo.",
  "Tolerance": "Tolerancja",
  "Respect for those of different faiths and beliefs, and of none.":
    "Szacunek dla osób innych wyznań i przekonań, a także dla osób niewierzących.",
  "Respect": "Szacunek",
  "For other people, for their property, and for the environment you share.":
    "Wobec innych ludzi, ich własności i wspólnego środowiska.",
  "Participation": "Uczestnictwo",
  "Taking part in community life — voting, volunteering, jury service.":
    "Udział w życiu wspólnoty — głosowanie, wolontariat, zasiadanie w ławie przysięgłych.",
  "Your rights": "Twoje prawa",
  "Freedom of speech and of the press. Freedom of religion and belief. Freedom from unfair discrimination. A fair trial. A vote in a free election.":
    "Wolność słowa i prasy. Wolność religii i przekonań. Wolność od niesprawiedliwej dyskryminacji. Rzetelny proces. Głos w wolnych wyborach.",
  "Your responsibilities": "Twoje obowiązki",
  "Obey the law. Pay tax and National Insurance. Serve on a jury when called. Respect the rights of others. Look after the area you live in.":
    "Przestrzegaj prawa. Płać podatki i składki National Insurance. Zasiadaj w ławie przysięgłych, gdy zostaniesz wezwany. Szanuj prawa innych. Dbaj o okolicę, w której mieszkasz.",

  // ── Geography ───────────────────────────────────────────────────────────
  "The four nations and their capitals": "Cztery kraje i ich stolice",
  "Other important cities": "Inne ważne miasta",
  "Regions and counties": "Regiony i hrabstwa",
  "Rivers": "Rzeki",
  "Mountains and high ground": "Góry i tereny wyżynne",
  "Lakes and lochs": "Jeziora i loch",
  "Islands and surrounding seas": "Wyspy i otaczające morza",
  "National Parks and famous places": "Parki narodowe i słynne miejsca",
  "Languages": "Języki",
  "England — London": "Anglia — Londyn",
  "Also the capital of the UK as a whole, and the seat of the UK Parliament. By far the largest nation by population.":
    "Zarazem stolica całej Wielkiej Brytanii i siedziba UK Parliament. Zdecydowanie najludniejszy z czterech krajów.",
  "Scotland — Edinburgh": "Szkocja — Edinburgh",
  "Home of the Scottish Parliament, at Holyrood. Glasgow is Scotland's largest city.":
    "Siedziba Scottish Parliament w Holyrood. Największym miastem Szkocji jest Glasgow.",
  "Wales — Cardiff": "Walia — Cardiff",
  "Home of the Welsh Parliament, the Senedd. Swansea and Newport are the other large cities.":
    "Siedziba walijskiego parlamentu, zwanego Senedd. Pozostałe duże miasta to Swansea i Newport.",
  "Northern Ireland — Belfast": "Irlandia Północna — Belfast",
  "Home of the Northern Ireland Assembly, at Stormont. Londonderry/Derry is the second city.":
    "Siedziba Northern Ireland Assembly w Stormont. Drugim miastem jest Londonderry/Derry.",
  "England": "Anglia",
  "Birmingham, Manchester, Liverpool, Leeds, Sheffield, Bristol, Newcastle upon Tyne, Oxford and Cambridge.":
    "Birmingham, Manchester, Liverpool, Leeds, Sheffield, Bristol, Newcastle upon Tyne, Oxford i Cambridge.",
  "Scotland": "Szkocja",
  "Glasgow (the largest), Aberdeen, Dundee, Inverness and Stirling.":
    "Glasgow (największe), Aberdeen, Dundee, Inverness i Stirling.",
  "Wales": "Walia",
  "Swansea, Newport, Bangor, and St Davids — the smallest city in Britain.":
    "Swansea, Newport, Bangor i St Davids — najmniejsze miasto Brytanii.",
  "Northern Ireland": "Irlandia Północna",
  "Londonderry/Derry, Lisburn, Newry and Armagh.": "Londonderry/Derry, Lisburn, Newry i Armagh.",
  "Severn": "Severn",
  "The longest river in the UK, at about 220 miles. It rises in Wales and reaches the sea through the Bristol Channel.":
    "Najdłuższa rzeka Wielkiej Brytanii, około 220 mil. Ma źródła w Walii i uchodzi do morza przez Bristol Channel.",
  "Thames": "Tamiza",
  "Flows through Oxford, Reading and London. The second longest, and the most famous.":
    "Płynie przez Oxford, Reading i Londyn. Druga co do długości i najbardziej znana.",
  "Trent, Mersey, Tyne": "Trent, Mersey, Tyne",
  "Major English rivers — the Mersey at Liverpool, the Tyne at Newcastle upon Tyne.":
    "Główne rzeki Anglii — Mersey w Liverpoolu, Tyne w Newcastle upon Tyne.",
  "Clyde, Tay and Bann": "Clyde, Tay i Bann",
  "The Clyde flows through Glasgow; the Tay is Scotland's longest. In Northern Ireland the Bann is the principal river.":
    "Clyde płynie przez Glasgow; Tay jest najdłuższą rzeką Szkocji. W Irlandii Północnej główną rzeką jest Bann.",
  "Ben Nevis — 1,345 m": "Ben Nevis — 1345 m",
  "In the Scottish Highlands. The highest mountain in Scotland and in the whole UK.":
    "W Scottish Highlands. Najwyższa góra Szkocji i całej Wielkiej Brytanii.",
  "Snowdon (Yr Wyddfa) — 1,085 m": "Snowdon (Yr Wyddfa) — 1085 m",
  "In Snowdonia (Eryri). The highest mountain in Wales.":
    "W Snowdonii (Eryri). Najwyższa góra Walii.",
  "Scafell Pike — 978 m": "Scafell Pike — 978 m",
  "In the Lake District. The highest mountain in England.":
    "W Lake District. Najwyższa góra Anglii.",
  "Slieve Donard — 850 m": "Slieve Donard — 850 m",
  "In the Mourne Mountains. The highest in Northern Ireland.":
    "W Mourne Mountains. Najwyższa góra Irlandii Północnej.",
  "Islands": "Wyspy",
  "The Isle of Wight, the Isles of Scilly, Anglesey, the Hebrides, Orkney and Shetland.":
    "Isle of Wight, Isles of Scilly, Anglesey, Hebrydy, Orkady i Szetlandy.",
  "Not UK islands": "Wyspy spoza Wielkiej Brytanii",
  "The Isle of Man and the Channel Islands are Crown Dependencies — self-governing and linked to the Crown, not part of the UK.":
    "Isle of Man i Channel Islands to Crown Dependencies — mają własny samorząd i są związane z Koroną, ale nie należą do Wielkiej Brytanii.",
  "Seas": "Morza",
  "The North Sea to the east, the English Channel to the south, the Irish Sea to the west, and the Atlantic Ocean to the north and west.":
    "Morze Północne na wschodzie, kanał La Manche na południu, Morze Irlandzkie na zachodzie oraz Ocean Atlantycki na północy i zachodzie.",
  "The Channel Tunnel": "Channel Tunnel",
  "Opened in 1994, linking Folkestone in England with Coquelles in France — the UK's only fixed land link to the continent.":
    "Otwarty w 1994 roku, łączy Folkestone w Anglii z Coquelles we Francji — jedyne stałe połączenie lądowe Wielkiej Brytanii z kontynentem.",

  // ── National identity and symbols ───────────────────────────────────────
  "The Union Flag": "Union Flag",
  "The four national flags": "Cztery flagi narodowe",
  "Patron saints and their days": "Święci patroni i ich dni",
  "National flowers and plants": "Kwiaty i rośliny narodowe",
  "Other national symbols": "Inne symbole narodowe",
  "National anthem": "Hymn państwowy",
  "St George's Cross — a red cross on a white background.":
    "St George's Cross — czerwony krzyż na białym tle.",
  "The Saltire — a white diagonal cross on a blue background.":
    "The Saltire — biały ukośny krzyż na niebieskim tle.",
  "Y Ddraig Goch, the Red Dragon, on a green and white field.":
    "Y Ddraig Goch, Czerwony Smok, na zielono-białym polu.",
  "St Patrick's Cross — a red diagonal cross on white — is the element carried into the Union Flag.":
    "St Patrick's Cross — czerwony ukośny krzyż na białym tle — to element przeniesiony do Union Flag.",
  "St David — 1 March": "St David — 1 marca",
  "Wales. Dewi Sant in Welsh.": "Walia. Po walijsku Dewi Sant.",
  "St Patrick — 17 March": "St Patrick — 17 marca",
  "Northern Ireland. A bank holiday there.": "Irlandia Północna. Dzień wolny od pracy.",
  "St George — 23 April": "St George — 23 kwietnia",
  "St Andrew — 30 November": "St Andrew — 30 listopada",
  "Scotland. St Andrew's Day is a bank holiday in Scotland.":
    "Szkocja. St Andrew's Day jest w Szkocji dniem wolnym od pracy.",
  "England — the Rose": "Anglia — róża",
  "The Tudor rose, red and white, dating from the end of the Wars of the Roses.":
    "Róża Tudorów, czerwono-biała, z czasów zakończenia Wojny Dwóch Róż.",
  "Scotland — the Thistle": "Szkocja — oset",
  "A spiny purple flower, Scotland's emblem for centuries.":
    "Kolczasty fioletowy kwiat, od stuleci godło Szkocji.",
  "Wales — the Daffodil": "Walia — żonkil",
  "Worn on St David's Day. The leek is also a Welsh emblem.":
    "Noszony w St David's Day. Drugim godłem Walii jest por.",
  "Northern Ireland — the Shamrock": "Irlandia Północna — koniczyna",
  "The three-leaved clover, associated with St Patrick.":
    "Trójlistna koniczyna, kojarzona ze świętym Patrykiem.",

  // ── Early history ───────────────────────────────────────────────────────
  "Stone Age, Bronze Age and Iron Age": "Epoka kamienia, brązu i żelaza",
  "The Romans": "Rzymianie",
  "The Anglo-Saxons": "Anglosasi",
  "The Vikings and the Danelaw": "Wikingowie i Danelaw",
  "The Norman Conquest": "Podbój normański",
  "Stone Age": "Epoka kamienia",
  "Hunter-gatherers first, then the first farmers around 6,000 years ago. They built **Stonehenge** and the tombs at **Skara Brae** in Orkney.":
    "Najpierw łowcy-zbieracze, potem pierwsi rolnicy około 6000 lat temu. Zbudowali **Stonehenge** oraz grobowce w **Skara Brae** na Orkadach.",
  "Bronze Age": "Epoka brązu",
  "From about 4,000 years ago. People learned to make bronze, lived in roundhouses and buried their dead in barrows.":
    "Od około 4000 lat temu. Nauczono się wytwarzać brąz, mieszkano w okrągłych domach, a zmarłych chowano w kurhanach.",
  "Iron Age": "Epoka żelaza",
  "Iron tools and weapons, hill forts such as **Maiden Castle**, and the first British coins. The people are known as the **Celts**.":
    "Żelazne narzędzia i broń, grodziska takie jak **Maiden Castle** oraz pierwsze brytyjskie monety. Ludność tę nazywa się **Celtami**.",

  // ── Medieval Britain ────────────────────────────────────────────────────
  "The Normans": "Normanowie",
  "Magna Carta": "Magna Carta",
  "Wales and Scotland": "Walia i Szkocja",
  "The Hundred Years War": "Wojna stuletnia",
  "The Black Death and the Peasants Revolt": "Czarna śmierć i bunt chłopski",
  "The Wars of the Roses": "Wojna Dwóch Róż",
  "William the Conqueror": "Wilhelm Zdobywca",
  "Won the **Battle of Hastings** in **1066** and became William I. Built castles across England, including the Tower of London.":
    "Wygrał **Battle of Hastings** w **1066** roku i został Wilhelmem I. Wzniósł zamki w całej Anglii, w tym Tower of London.",
  "The Domesday Book": "Domesday Book",
  "Ordered by William in **1086** — a survey of who owned what land, and what it was worth, across England.":
    "Zarządzony przez Wilhelma w **1086** roku spis ziem w całej Anglii: kto co posiada i ile to jest warte.",
  "The feudal system": "System feudalny",
  "The king owned all land and granted it to nobles in return for service; peasants worked it in return for protection.":
    "Król był właścicielem całej ziemi i nadawał ją możnym w zamian za służbę; chłopi uprawiali ją w zamian za ochronę.",
  "William Wallace": "William Wallace",
  "Led Scottish resistance to Edward I. Captured and executed in 1305, and remembered as a national hero.":
    "Przewodził szkockiemu oporowi przeciw Edwardowi I. Pojmany i stracony w 1305 roku, pamiętany jako bohater narodowy.",
  "Robert the Bruce": "Robert Bruce",
  "Crowned King of Scots, he defeated the English at the **Battle of Bannockburn in 1314**, securing Scottish independence.":
    "Koronowany na króla Szkotów, pokonał Anglików w **Battle of Bannockburn w 1314** roku, zapewniając Szkocji niepodległość.",
  "The result": "Skutek",
  "Scotland stayed a separate kingdom for nearly 400 more years, until the Act of Union of 1707.":
    "Szkocja pozostała odrębnym królestwem przez niemal 400 kolejnych lat, aż do Act of Union z 1707 roku.",

  // ── The Tudors ──────────────────────────────────────────────────────────
  "Henry VII and Henry VIII": "Henryk VII i Henryk VIII",
  "The Reformation": "Reformacja",
  "Edward VI, Mary I and Elizabeth I": "Edward VI, Maria I i Elżbieta I",
  "The Spanish Armada": "Wielka Armada",
  "Shakespeare": "Shakespeare",
  "Catherine of Aragon": "Katarzyna Aragońska",
  "Divorced. Mother of Mary I. The refusal of the Pope to annul this marriage triggered the Reformation in England.":
    "Rozwiedziona. Matka Marii I. Odmowa unieważnienia tego małżeństwa przez papieża zapoczątkowała reformację w Anglii.",
  "Anne Boleyn": "Anna Boleyn",
  "Beheaded. Mother of Elizabeth I.": "Ścięta. Matka Elżbiety I.",
  "Jane Seymour": "Jane Seymour",
  "Died — shortly after giving birth to Edward VI, Henry's only surviving son.":
    "Zmarła — wkrótce po urodzeniu Edwarda VI, jedynego syna Henryka, który przeżył.",
  "Anne of Cleves": "Anna Kliwijska",
  "Divorced. A political match that Henry disliked on sight.":
    "Rozwiedziona. Małżeństwo polityczne, do którego Henryk poczuł niechęć od pierwszego wejrzenia.",
  "Catherine Howard": "Katarzyna Howard",
  "Beheaded.": "Ścięta.",
  "Catherine Parr": "Katarzyna Parr",
  "Survived him, and outlived Henry by a year.": "Przeżyła go — o rok.",
  "Edward VI": "Edward VI",
  "Henry's young son. Strongly Protestant — the Book of Common Prayer dates from his reign. He died at 15.":
    "Młody syn Henryka. Gorliwy protestant — z jego panowania pochodzi Book of Common Prayer. Zmarł w wieku 15 lat.",
  "Mary I": "Maria I",
  "A devout Catholic who reversed the Reformation and had Protestants executed, earning the name Bloody Mary.":
    "Żarliwa katoliczka, która cofnęła reformację i kazała stracić protestantów, przez co nazwano ją Bloody Mary.",
  "Elizabeth I": "Elżbieta I",
  "Protestant, and reigned 45 years. She found a middle way in religion that largely held, and never married.":
    "Protestantka, panowała 45 lat. Znalazła w sprawach religii drogę pośrednią, która w dużej mierze się utrzymała, i nigdy nie wyszła za mąż.",

  // ── Stuarts and the Civil War ───────────────────────────────────────────
  "James I and the Gunpowder Plot": "Jakub I i spisek prochowy",
  "Charles I and the English Civil War": "Karol I i angielska wojna domowa",
  "Cromwell and the Commonwealth": "Cromwell i Commonwealth",
  "The Restoration": "Restauracja",
  "The Glorious Revolution and the Bill of Rights": "Chwalebna rewolucja i Bill of Rights",
  "Cavaliers": "Cavaliers",
  "Supporters of the King. Also called Royalists.":
    "Zwolennicy króla. Nazywani także rojalistami.",
  "Roundheads": "Roundheads",
  "Supporters of Parliament, named for their short haircuts. Also called Parliamentarians.":
    "Zwolennicy parlamentu, nazwani tak od krótkich fryzur. Zwani również parlamentarzystami.",
  "The outcome": "Rozstrzygnięcie",
  "Parliament won. Charles I was tried and **executed in 1649** — the only English king ever put to death by his own subjects.":
    "Zwyciężył parlament. Karol I został osądzony i **stracony w 1649** roku — jedyny król Anglii skazany na śmierć przez własnych poddanych.",

  // ── Britain 1700–1900 ───────────────────────────────────────────────────
  "The Act of Union and the Jacobites": "Act of Union i jakobici",
  "The Industrial Revolution": "Rewolucja przemysłowa",
  "Empire, slavery and abolition": "Imperium, niewolnictwo i abolicja",
  "Wars and revolutions": "Wojny i rewolucje",
  "Victorian Britain": "Brytania wiktoriańska",
  "Reform and reformers": "Reformy i reformatorzy",
  "The steam engine": "Maszyna parowa",
  "**James Watt** improved it decisively. Steam powered factories, mines, ships and trains.":
    "**James Watt** udoskonalił ją w sposób przełomowy. Para napędzała fabryki, kopalnie, statki i pociągi.",
  "Railways": "Koleje",
  "**George Stephenson** built the Rocket. Britain built the first passenger railways, and the network transformed travel and trade.":
    "**George Stephenson** zbudował lokomotywę Rocket. Brytania stworzyła pierwsze koleje pasażerskie, a sieć odmieniła podróżowanie i handel.",
  "Factories": "Fabryki",
  "Textiles led the way. Conditions were harsh, and child labour was common until reforming laws restricted it.":
    "Przodował przemysł włókienniczy. Warunki były ciężkie, a praca dzieci powszechna, dopóki nie ograniczyły jej ustawy reformujące.",
  "Engineering": "Inżynieria",
  "**Isambard Kingdom Brunel** built the Great Western Railway, bridges, tunnels and steamships — the most famous engineer of the age.":
    "**Isambard Kingdom Brunel** zbudował Great Western Railway, mosty, tunele i parowce — najsłynniejszy inżynier epoki.",
  "American Revolution": "Rewolucja amerykańska",
  "The thirteen American colonies declared independence in **1776** and won it. Britain lost its most valuable settler colonies.":
    "Trzynaście kolonii amerykańskich ogłosiło niepodległość w **1776** roku i ją wywalczyło. Brytania utraciła swoje najcenniejsze kolonie osadnicze.",
  "Napoleonic Wars": "Wojny napoleońskie",
  "Britain fought France under Napoleon for over twenty years.":
    "Brytania walczyła z Francją Napoleona przez ponad dwadzieścia lat.",
  "Trafalgar, 1805": "Trafalgar, 1805",
  "**Admiral Nelson** destroyed the French and Spanish fleets at sea and was killed in the battle. Nelson's Column stands in Trafalgar Square.":
    "**Admirał Nelson** zniszczył na morzu flotę francuską i hiszpańską, sam ginąc w bitwie. Nelson's Column stoi na Trafalgar Square.",
  "Waterloo, 1815": "Waterloo, 1815",
  "The **Duke of Wellington** finally defeated Napoleon on land, ending the wars.":
    "**Duke of Wellington** ostatecznie pokonał Napoleona na lądzie, kończąc wojny.",
  "Florence Nightingale": "Florence Nightingale",
  "Founded modern nursing during the Crimean War and set up the first nursing school, at St Thomas' Hospital in London.":
    "Stworzyła nowoczesne pielęgniarstwo podczas wojny krymskiej i założyła pierwszą szkołę pielęgniarską przy St Thomas' Hospital w Londynie.",
  "Charles Darwin": "Charles Darwin",
  "Published *On the Origin of Species* in 1859, setting out evolution by natural selection.":
    "W 1859 roku wydał *On the Origin of Species*, przedstawiając ewolucję drogą doboru naturalnego.",
  "Charles Dickens": "Charles Dickens",
  "Novelist whose books — *Oliver Twist*, *Great Expectations* — exposed the poverty of industrial Britain.":
    "Powieściopisarz, którego książki — *Oliver Twist*, *Great Expectations* — obnażyły biedę przemysłowej Brytanii.",
  "Emmeline Pankhurst": "Emmeline Pankhurst",
  "Later in the century she began organising the campaign that became the suffragette movement.":
    "Pod koniec stulecia zaczęła organizować kampanię, z której wyrósł ruch sufrażystek.",

  // ── Britain 1900 to today ───────────────────────────────────────────────
  "The First World War": "Pierwsza wojna światowa",
  "Votes for women": "Prawo wyborcze dla kobiet",
  "The Second World War": "Druga wojna światowa",
  "The Welfare State and the NHS": "Państwo opiekuńcze i NHS",
  "Empire to Commonwealth": "Od imperium do Commonwealth",
  "Immigration and modern Britain": "Imigracja i współczesna Brytania",
  "Europe and Brexit": "Europa i brexit",
  "Dunkirk, 1940": "Dunkierka, 1940",
  "British and Allied troops were evacuated from France by warships and hundreds of small civilian boats.":
    "Wojska brytyjskie i alianckie ewakuowano z Francji okrętami wojennymi i setkami małych cywilnych łodzi.",
  "The Battle of Britain, 1940": "Bitwa o Anglię, 1940",
  "The RAF held off the German air force, preventing invasion. Churchill: never was so much owed by so many to so few.":
    "RAF powstrzymał niemieckie lotnictwo i udaremnił inwazję. Churchill: nigdy tak wielu nie zawdzięczało tak wiele tak nielicznym.",
  "The Blitz": "The Blitz",
  "German bombing of London and other cities — Coventry, Liverpool, Glasgow, Belfast — night after night.":
    "Niemieckie bombardowania Londynu i innych miast — Coventry, Liverpoolu, Glasgow, Belfastu — noc po nocy.",
  "D-Day, 6 June 1944": "D-Day, 6 czerwca 1944",
  "Allied forces landed in Normandy, opening the campaign that liberated western Europe.":
    "Wojska alianckie wylądowały w Normandii, rozpoczynając kampanię, która wyzwoliła Europę Zachodnią.",

  // ── The timeline ────────────────────────────────────────────────────────
  "Before the Norman Conquest": "Przed podbojem normańskim",
  "1066 to 1500": "Od 1066 do 1500",
  "The Tudors and Stuarts": "Tudorowie i Stuartowie",
  "1700 to 1900": "Od 1700 do 1900",
  "1900 to today": "Od 1900 do dziś",
  "c. 6000 BC": "ok. 6000 p.n.e.",
  "Britain is cut off from the continent as the land bridge floods.":
    "Brytania zostaje odcięta od kontynentu, gdy most lądowy zalewa woda.",
  "c. 2500 BC": "ok. 2500 p.n.e.",
  "Stonehenge is built. Skara Brae in Orkney is occupied.":
    "Powstaje Stonehenge. Zamieszkane jest Skara Brae na Orkadach.",
  "55 BC": "55 p.n.e.",
  "Julius Caesar's expedition — and it fails.":
    "Wyprawa Juliusza Cezara — zakończona niepowodzeniem.",
  "AD 43": "43 n.e.",
  "Claudius invades. The Roman conquest of Britain begins.":
    "Klaudiusz najeżdża wyspę. Zaczyna się rzymski podbój Brytanii.",
  "AD 122": "122 n.e.",
  "Hadrian's Wall is begun across northern England.":
    "Rozpoczyna się budowa Hadrian's Wall w północnej Anglii.",
  "AD 410": "410 n.e.",
  "The Romans leave Britain.": "Rzymianie opuszczają Brytanię.",
  "AD 789": "789 n.e.",
  "The first Viking raids.": "Pierwsze najazdy wikingów.",
  "AD 878": "878 n.e.",
  "Alfred the Great defeats the Vikings; the Danelaw is agreed.":
    "Alfred Wielki pokonuje wikingów; zawarto porozumienie o Danelaw.",
  "1066": "1066",
  "Battle of Hastings. William the Conqueror takes the throne.":
    "Battle of Hastings. Wilhelm Zdobywca obejmuje tron.",
  "1086": "1086",
  "The Domesday Book.": "Domesday Book.",
  "1215": "1215",
  "Magna Carta — King John accepts that the king is bound by law.":
    "Magna Carta — król Jan uznaje, że król jest związany prawem.",
  "1284": "1284",
  "The Statute of Rhuddlan annexes Wales to the English Crown.":
    "Statute of Rhuddlan przyłącza Walię do korony angielskiej.",
  "1314": "1314",
  "Robert the Bruce wins at Bannockburn.": "Robert Bruce zwycięża pod Bannockburn.",
  "1337–1453": "1337–1453",
  "The Hundred Years War with France.": "Wojna stuletnia z Francją.",
  "1348": "1348",
  "The Black Death reaches Britain.": "Czarna śmierć dociera do Brytanii.",
  "1381": "1381",
  "The Peasants Revolt.": "Bunt chłopski.",
  "1415": "1415",
  "Henry V wins at Agincourt.": "Henryk V zwycięża pod Agincourt.",
  "1485": "1485",
  "Battle of Bosworth Field ends the Wars of the Roses. The Tudors begin.":
    "Battle of Bosworth Field kończy Wojnę Dwóch Róż. Zaczynają się rządy Tudorów.",
  "1534": "1534",
  "Henry VIII breaks with Rome and becomes Head of the Church of England.":
    "Henryk VIII zrywa z Rzymem i zostaje głową Church of England.",
  "1588": "1588",
  "The Spanish Armada is defeated.": "Wielka Armada zostaje pokonana.",
  "1603": "1603",
  "James VI of Scotland becomes James I of England.":
    "Jakub VI Szkocki zostaje Jakubem I Angielskim.",
  "1605": "1605",
  "The Gunpowder Plot fails — remembered every 5 November.":
    "Spisek prochowy zawodzi — upamiętniany co roku 5 listopada.",
  "1642–1651": "1642–1651",
  "The English Civil War.": "Angielska wojna domowa.",
  "1649": "1649",
  "Charles I is executed. The Commonwealth begins under Cromwell.":
    "Karol I zostaje stracony. Pod rządami Cromwella zaczyna się Commonwealth.",
  "1660": "1660",
  "The Restoration — Charles II returns.": "Restauracja — powrót Karola II.",
  "1666": "1666",
  "The Great Fire of London.": "Wielki pożar Londynu.",
  "1688": "1688",
  "The Glorious Revolution. William and Mary take the throne.":
    "Chwalebna rewolucja. Tron obejmują Wilhelm i Maria.",
  "1689": "1689",
  "The Bill of Rights makes the monarchy constitutional.":
    "Bill of Rights czyni monarchię konstytucyjną.",
  "1707": "1707",
  "The Act of Union joins England and Scotland as Great Britain.":
    "Act of Union łączy Anglię i Szkocję w Great Britain.",
  "1746": "1746",
  "Battle of Culloden — the last battle fought on British soil.":
    "Battle of Culloden — ostatnia bitwa stoczona na ziemi brytyjskiej.",
  "1776": "1776",
  "The American colonies declare independence.":
    "Kolonie amerykańskie ogłaszają niepodległość.",
  "1801": "1801",
  "The Act of Union with Ireland creates the United Kingdom.":
    "Act of Union z Irlandią tworzy United Kingdom.",
  "1805": "1805",
  "Nelson wins at Trafalgar.": "Nelson zwycięża pod Trafalgarem.",
  "1807": "1807",
  "The slave trade is abolished.": "Zniesiono handel niewolnikami.",
  "1815": "1815",
  "Wellington defeats Napoleon at Waterloo.":
    "Wellington pokonuje Napoleona pod Waterloo.",
  "1832": "1832",
  "The Reform Act begins widening the vote.":
    "Reform Act zapoczątkowuje rozszerzanie prawa wyborczego.",
  "1833": "1833",
  "Slavery itself is abolished across the Empire.":
    "W całym imperium zniesiono samo niewolnictwo.",
  "1837–1901": "1837–1901",
  "The reign of Queen Victoria.": "Panowanie królowej Wiktorii.",
  "1851": "1851",
  "The Great Exhibition.": "Wielka Wystawa.",
  "1859": "1859",
  "Darwin publishes On the Origin of Species.":
    "Darwin publikuje On the Origin of Species.",
  "1914–1918": "1914–1918",
  "The First World War. It ends on 11 November 1918.":
    "Pierwsza wojna światowa. Kończy się 11 listopada 1918 roku.",
  "1918": "1918",
  "Women over 30 with property win the vote.":
    "Prawo głosu uzyskują kobiety po trzydziestce posiadające majątek.",
  "1928": "1928",
  "Women win the vote on equal terms with men, at 21.":
    "Kobiety uzyskują prawo głosu na równi z mężczyznami, od 21. roku życia.",
  "1939–1945": "1939–1945",
  "The Second World War. VE Day is 8 May 1945.":
    "Druga wojna światowa. VE Day przypada 8 maja 1945 roku.",
  "1940": "1940",
  "The Battle of Britain and the Blitz. Churchill becomes Prime Minister.":
    "Bitwa o Anglię i The Blitz. Churchill zostaje premierem.",
  "1944": "1944",
  "D-Day, 6 June — the Normandy landings.": "D-Day, 6 czerwca — lądowanie w Normandii.",
  "1947": "1947",
  "India and Pakistan become independent.": "Indie i Pakistan uzyskują niepodległość.",
  "1948": "1948",
  "The NHS is founded. The Empire Windrush arrives.":
    "Powstaje NHS. Przypływa statek Empire Windrush.",
  "1973": "1973",
  "The UK joins the European Economic Community.":
    "Wielka Brytania przystępuje do Europejskiej Wspólnoty Gospodarczej.",
  "1979": "1979",
  "Margaret Thatcher becomes the first woman Prime Minister.":
    "Margaret Thatcher zostaje pierwszą kobietą na stanowisku premiera.",
  "1998": "1998",
  "The Good Friday Agreement.": "Good Friday Agreement.",
  "1999": "1999",
  "The Scottish Parliament and Welsh Assembly open.":
    "Rozpoczynają działalność Scottish Parliament i Welsh Assembly.",
  "2012": "2012",
  "London hosts the Olympic Games.": "Londyn gości igrzyska olimpijskie.",
  "2016": "2016",
  "The referendum votes to leave the EU.":
    "W referendum zapada decyzja o wyjściu z UE.",
  "2020": "2020",
  "The UK formally leaves the EU on 31 January.":
    "31 stycznia Wielka Brytania formalnie opuszcza UE.",
  "2022": "2022",
  "Queen Elizabeth II dies; King Charles III succeeds.":
    "Umiera królowa Elżbieta II; tron obejmuje król Karol III.",

  // ── The monarchy ────────────────────────────────────────────────────────
  "What the monarch actually does": "Czym monarcha zajmuje się naprawdę",
  "Succession and coronation": "Sukcesja i koronacja",
  "The Royal Family": "Rodzina królewska",
  "Monarchs worth knowing": "Monarchowie, których warto znać",
  "Royal Assent": "Royal Assent",
  "Every Act of Parliament needs the monarch's signature to become law. It has not been refused since 1708 — it is a formality.":
    "Każda Act of Parliament wymaga podpisu monarchy, aby stać się prawem. Odmówiono go ostatni raz w 1708 roku — to formalność.",
  "State Opening of Parliament": "State Opening of Parliament",
  "The monarch opens each parliamentary year and reads a speech setting out the government's plans. The speech is written by the government, not the monarch.":
    "Monarcha otwiera każdy rok parlamentarny i odczytuje mowę przedstawiającą plany rządu. Mowę pisze rząd, a nie monarcha.",
  "Appointing the Prime Minister": "Powoływanie premiera",
  "The monarch invites the leader who can command a majority in the House of Commons to form a government.":
    "Monarcha powierza misję utworzenia rządu przywódcy, który jest w stanie uzyskać większość w House of Commons.",
  "Ceremonial and representative": "Funkcje ceremonialne i reprezentacyjne",
  "State visits, honours, and representing the UK abroad. Also Head of the Commonwealth.":
    "Wizyty państwowe, odznaczenia i reprezentowanie Wielkiej Brytanii za granicą. Także Head of the Commonwealth.",
  "William I": "Wilhelm I",
  "1066 — the Norman Conquest.": "1066 — podbój normański.",
  "Henry VIII": "Henryk VIII",
  "Six wives, and the break with Rome.": "Sześć żon i zerwanie z Rzymem.",
  "45 years, the Armada, and the Elizabethan age.":
    "45 lat panowania, Wielka Armada i epoka elżbietańska.",
  "Charles I": "Karol I",
  "Executed in 1649 after the Civil War.":
    "Stracony w 1649 roku po wojnie domowej.",
  "Victoria": "Wiktoria",
  "1837–1901, the height of empire.": "1837–1901, szczyt potęgi imperium.",
  "Elizabeth II": "Elżbieta II",
  "1952–2022, the longest reign in British history.":
    "1952–2022, najdłuższe panowanie w historii Brytanii.",

  // ── Government and Parliament ───────────────────────────────────────────
  "The two Houses": "Dwie izby",
  "Government, Cabinet and Opposition": "Rząd, gabinet i opozycja",
  "Elections and voting": "Wybory i głosowanie",
  "How a law is made": "Jak powstaje ustawa",
  "Local government": "Samorząd lokalny",
  "House of Commons": "House of Commons",
  "**650 elected MPs**, one for each constituency. This is the chamber that matters: it makes law, controls tax and spending, and the government must hold its confidence.":
    "**650 wybieranych MPs**, po jednym z każdego okręgu. To izba, która ma znaczenie: stanowi prawo, kontroluje podatki i wydatki, a rząd musi cieszyć się jej zaufaniem.",
  "House of Lords": "House of Lords",
  "**Not elected.** Members are appointed — life peers, some hereditary peers, and senior bishops of the Church of England. It revises and scrutinises bills and can delay them, but cannot block the Commons indefinitely.":
    "**Nie pochodzi z wyborów.** Członków się powołuje — parowie dożywotni, część parów dziedzicznych oraz wyżsi biskupi Church of England. Izba poprawia i bada projekty ustaw oraz może je opóźnić, ale nie może blokować Commons w nieskończoność.",
  "The Prime Minister": "Premier",
  "The leader of the party that can command a majority in the Commons. Lives and works at **10 Downing Street**.":
    "Przywódca partii zdolnej uzyskać większość w Commons. Mieszka i pracuje pod adresem **10 Downing Street**.",
  "The Cabinet": "Gabinet",
  "About 20 senior ministers chosen by the PM, each running a department — Chancellor of the Exchequer, Home Secretary, Foreign Secretary and so on.":
    "Około 20 ministrów wybranych przez premiera, każdy kieruje resortem — Chancellor of the Exchequer, Home Secretary, Foreign Secretary i tak dalej.",
  "The Opposition": "Opozycja",
  "The largest party not in government. Its leader is **Leader of the Opposition** and heads a shadow cabinet that challenges each minister.":
    "Największa partia spoza rządu. Jej przywódca jest **Leader of the Opposition** i stoi na czele gabinetu cieni, który rozlicza każdego ministra.",
  "The Speaker": "The Speaker",
  "Chairs debates in the Commons, keeps order and is politically neutral — the Speaker gives up party allegiance.":
    "Przewodniczy debatom w Commons, pilnuje porządku i jest politycznie bezstronny — Speaker rezygnuje z przynależności partyjnej.",
  "Who can vote": "Kto może głosować",
  "You must be **18 or over** and on the **electoral register**. British, Irish and qualifying Commonwealth citizens may vote in general elections.":
    "Trzeba mieć **ukończone 18 lat** i figurować w **electoral register**. W wyborach powszechnych mogą głosować obywatele brytyjscy, irlandzcy i uprawnieni obywatele Commonwealth.",
  "How to vote": "Jak głosować",
  "In person at a polling station, by post, or by proxy. Photo ID is now required at polling stations in Great Britain.":
    "Osobiście w lokalu wyborczym, korespondencyjnie lub przez pełnomocnika. W lokalach wyborczych w Wielkiej Brytanii wymagany jest obecnie dokument ze zdjęciem.",
  "By-elections": "Wybory uzupełniające",
  "Held in a single constituency when its MP dies or resigns between general elections.":
    "Odbywają się w jednym okręgu, gdy jego MP umiera lub rezygnuje między wyborami powszechnymi.",
  "Political parties": "Partie polityczne",
  "The main UK-wide parties are Conservative, Labour and the Liberal Democrats. There are also national parties such as the SNP in Scotland and Plaid Cymru in Wales.":
    "Główne partie ogólnokrajowe to Conservative, Labour i Liberal Democrats. Istnieją też partie narodowe, jak SNP w Szkocji i Plaid Cymru w Walii.",

  // ── Devolution ──────────────────────────────────────────────────────────
  "The three devolved bodies": "Trzy organy o przekazanych kompetencjach",
  "What the devolved governments control": "Czym zarządzają rządy krajowe",
  "What stays with the UK Parliament": "Co pozostaje w gestii UK Parliament",
  "Scottish Parliament": "Scottish Parliament",
  "At **Holyrood** in Edinburgh. Members are **MSPs**. It has the widest powers of the three, including some power over income tax.":
    "W **Holyrood** w Edinburghu. Członkowie to **MSPs**. Ma najszersze kompetencje z całej trójki, w tym częściową władzę nad podatkiem dochodowym.",
  "Senedd Cymru": "Senedd Cymru",
  "The **Welsh Parliament**, in Cardiff. Members are **MSs**. It was called the National Assembly for Wales until 2020.":
    "**Parlament Walii**, w Cardiff. Członkowie to **MSs**. Do 2020 roku nosił nazwę National Assembly for Wales.",
  "Northern Ireland Assembly": "Northern Ireland Assembly",
  "At **Stormont** in Belfast. Members are **MLAs**. Created by the **Good Friday Agreement of 1998**, and power is shared between communities.":
    "W **Stormont** w Belfaście. Członkowie to **MLAs**. Powołane przez **Good Friday Agreement z 1998** roku; władzę dzielą między siebie obie wspólnoty.",

  // ── Law and justice ─────────────────────────────────────────────────────
  "Criminal law and civil law": "Prawo karne i prawo cywilne",
  "The courts": "Sądy",
  "Who is who": "Kto jest kim",
  "Jury service": "Służba w ławie przysięgłych",
  "Legal aid": "Pomoc prawna",
  "Criminal law": "Prawo karne",
  "Offences against society — theft, assault, dangerous driving. The state prosecutes, and the punishment can be a fine, community service or prison.":
    "Przestępstwa przeciwko społeczeństwu — kradzież, napaść, niebezpieczna jazda. Oskarża państwo, a karą może być grzywna, prace społeczne lub więzienie.",
  "Civil law": "Prawo cywilne",
  "Disputes between people or organisations — debt, employment, housing, discrimination. The remedy is usually compensation or an order, not punishment.":
    "Spory między osobami lub organizacjami — długi, zatrudnienie, mieszkalnictwo, dyskryminacja. Rozstrzygnięciem jest zwykle odszkodowanie lub nakaz, a nie kara.",
  "Magistrates' Court": "Magistrates' Court",
  "Handles most criminal cases in England, Wales and Northern Ireland. **Magistrates** are usually unpaid volunteers from the local community, not professional judges. In Scotland the equivalent is the Justice of the Peace Court.":
    "Rozpoznaje większość spraw karnych w Anglii, Walii i Irlandii Północnej. **Magistrates** to zwykle niewynagradzani ochotnicy z lokalnej społeczności, a nie zawodowi sędziowie. W Szkocji odpowiednikiem jest Justice of the Peace Court.",
  "Crown Court": "Crown Court",
  "Serious criminal cases, heard before a **judge and a jury of 12**. In Scotland serious cases go to the Sheriff Court or the High Court, where a jury has 15 members.":
    "Poważne sprawy karne, rozpoznawane przed **sędzią i ławą 12 przysięgłych**. W Szkocji poważne sprawy trafiają do Sheriff Court lub High Court, gdzie ława liczy 15 osób.",
  "County Court": "County Court",
  "Civil cases — debt, contracts, personal injury, family matters.":
    "Sprawy cywilne — długi, umowy, szkody na osobie, sprawy rodzinne.",
  "The Supreme Court": "The Supreme Court",
  "The highest court of appeal in the UK, sitting in London. It replaced the House of Lords in that role in 2009.":
    "Najwyższy sąd apelacyjny Wielkiej Brytanii, z siedzibą w Londynie. W 2009 roku zastąpił w tej roli House of Lords.",
  "Judges": "Sędziowie",
  "Independent of government. They interpret the law and make sure trials are fair. A government act found unlawful by a judge must be put right.":
    "Niezależni od rządu. Wykładają prawo i czuwają nad rzetelnością procesów. Działanie rządu uznane przez sędziego za bezprawne musi zostać naprawione.",
  "Solicitors": "Solicitors",
  "Give legal advice, prepare cases and represent clients, usually in the lower courts.":
    "Udzielają porad prawnych, przygotowują sprawy i reprezentują klientów, zwykle przed sądami niższych instancji.",
  "Barristers": "Barristers",
  "Specialist advocates who argue cases in the higher courts.":
    "Wyspecjalizowani adwokaci występujący przed sądami wyższych instancji.",
  "The police": "Policja",
  "Keep order, prevent and investigate crime. They must obey the law themselves, and complaints are investigated independently.":
    "Utrzymuje porządek, zapobiega przestępstwom i je bada. Sama musi przestrzegać prawa, a skargi rozpatruje niezależny organ.",

  // ── Rights and responsibilities ─────────────────────────────────────────
  "Tax and National Insurance": "Podatki i National Insurance",
  "Taking part": "Udział w życiu publicznym",
  "The vote": "Prawo głosu",
  "At 18, in free elections, by secret ballot. Your vote cannot be seen or traced.":
    "Od 18. roku życia, w wolnych wyborach, w głosowaniu tajnym. Twojego głosu nikt nie zobaczy ani nie powiąże z tobą.",
  "Freedom of speech": "Wolność słowa",
  "To say and publish what you think — subject to laws against incitement, hatred and defamation.":
    "Prawo do mówienia i publikowania tego, co się myśli — z zastrzeżeniem przepisów o nawoływaniu do przemocy, mowie nienawiści i zniesławieniu.",
  "Freedom of religion": "Wolność wyznania",
  "To follow any religion or none, to change religion, and to worship openly.":
    "Prawo do wyznawania dowolnej religii lub żadnej, do jej zmiany i do otwartego praktykowania.",
  "Protection from discrimination on any of the nine protected characteristics.":
    "Ochrona przed dyskryminacją ze względu na którąkolwiek z dziewięciu cech chronionych.",
  "A fair trial": "Rzetelny proces",
  "Presumed innocent until proven guilty, with legal representation and an independent judge.":
    "Domniemanie niewinności do czasu udowodnienia winy, prawo do obrońcy i do niezawisłego sędziego.",
  "Human rights": "Prawa człowieka",
  "Set out in the Human Rights Act 1998, which brought the European Convention on Human Rights into UK law.":
    "Określone w Human Rights Act 1998, która wprowadziła European Convention on Human Rights do prawa brytyjskiego.",
  "Obey the law": "Przestrzegaj prawa",
  "All of it, including laws you disagree with. Change them by campaigning and voting, not by ignoring them.":
    "Całego, także przepisów, z którymi się nie zgadzasz. Zmienia się je przez działanie i głosowanie, a nie przez ignorowanie.",
  "Pay tax": "Płać podatki",
  "**Income tax** and **National Insurance** on what you earn. NI pays towards the state pension and some benefits.":
    "**Income tax** i **National Insurance** od tego, co zarabiasz. NI finansuje emeryturę państwową i część świadczeń.",
  "Attend when summoned, between 18 and 70.":
    "Stawiaj się na wezwanie, w wieku od 18 do 70 lat.",
  "Respect others": "Szanuj innych",
  "Their rights, their property, and their freedom to live differently from you.":
    "Ich prawa, ich własność i ich wolność do życia inaczej niż ty.",
  "Look after your area": "Dbaj o swoją okolicę",
  "Recycle, do not litter, and take part in the community.":
    "Segreguj odpady, nie śmieć i bierz udział w życiu wspólnoty.",

  // ── Society and culture ─────────────────────────────────────────────────
  "Family life": "Życie rodzinne",
  "Marriage and civil partnership": "Małżeństwo i civil partnership",
  "Community and volunteering": "Wspólnota i wolontariat",
  "Everyday social values": "Codzienne wartości społeczne",
  "Marriage": "Małżeństwo",
  "You must be **16 or over** (18 in England, Wales and Northern Ireland since 2023) and both people must consent freely.":
    "Trzeba mieć **ukończone 16 lat** (od 2023 roku 18 w Anglii, Walii i Irlandii Północnej), a obie osoby muszą wyrazić zgodę dobrowolnie.",
  "Same-sex marriage": "Małżeństwa jednopłciowe",
  "Legal in England, Wales and Scotland since 2014, and in Northern Ireland since 2020.":
    "Legalne w Anglii, Walii i Szkocji od 2014 roku, a w Irlandii Północnej od 2020 roku.",
  "Civil partnership": "Civil partnership",
  "A legal alternative to marriage with similar rights, open to both same-sex and opposite-sex couples.":
    "Prawna alternatywa dla małżeństwa o zbliżonych uprawnieniach, dostępna dla par jedno- i różnopłciowych.",
  "Forced marriage": "Małżeństwo przymusowe",
  "A **criminal offence**. Marriage requires the free consent of both people — arranged is not the same as forced.":
    "**Przestępstwo**. Małżeństwo wymaga dobrowolnej zgody obu osób — zaaranżowane to nie to samo co przymusowe.",

  // ── Religion and beliefs ────────────────────────────────────────────────
  "The established churches": "Kościoły państwowe",
  "The main faiths practised in the UK": "Główne wyznania w Wielkiej Brytanii",
  "Tolerance in practice": "Tolerancja w praktyce",
  "Church of England": "Church of England",
  "The **established church** in England. The monarch is its Supreme Governor and the **Archbishop of Canterbury** its senior bishop. Its bishops sit in the House of Lords. Known as the Anglican Church or, in the US, Episcopal.":
    "**Kościół państwowy** w Anglii. Monarcha jest jego Supreme Governor, a **Archbishop of Canterbury** najwyższym biskupem. Jego biskupi zasiadają w House of Lords. Znany jako Kościół anglikański, a w USA jako episkopalny.",
  "Church of Scotland": "Church of Scotland",
  "The national church of Scotland, **Presbyterian** in form. It is not governed by the monarch and has no bishops in the Lords.":
    "Narodowy kościół Szkocji, o ustroju **prezbiteriańskim**. Nie podlega monarsze i nie ma biskupów w Lords.",
  "Wales and Northern Ireland": "Walia i Irlandia Północna",
  "There is **no established church** in Wales or Northern Ireland.":
    "W Walii i Irlandii Północnej **nie ma kościoła państwowego**.",
  "Christianity": "Chrześcijaństwo",
  "The largest faith. Includes Anglican, Roman Catholic, Presbyterian, Methodist, Baptist and Orthodox traditions.":
    "Największe wyznanie. Obejmuje tradycje anglikańską, rzymskokatolicką, prezbiteriańską, metodystyczną, baptystyczną i prawosławną.",
  "Islam": "Islam",
  "The second largest religion in the UK. Major festivals include Eid al-Fitr and Eid al-Adha.":
    "Druga co do wielkości religia w Wielkiej Brytanii. Do głównych świąt należą Eid al-Fitr i Eid al-Adha.",
  "Hinduism": "Hinduizm",
  "Festivals include Diwali, the festival of lights.":
    "Do świąt należy Diwali, święto świateł.",
  "Sikhism": "Sikhizm",
  "Founded by Guru Nanak. Vaisakhi is its major festival.":
    "Założony przez Guru Nanaka. Jego głównym świętem jest Vaisakhi.",
  "Judaism": "Judaizm",
  "A long-established community. Festivals include Hanukkah, Passover and Yom Kippur.":
    "Społeczność o długiej historii. Do świąt należą Chanuka, Pesach i Jom Kipur.",
  "Buddhism": "Buddyzm",
  "Practised across the UK, with Wesak among its main observances.":
    "Praktykowany w całej Wielkiej Brytanii; do głównych obchodów należy Wesak.",

  // ── Traditions and celebrations ─────────────────────────────────────────
  "The Christian calendar": "Kalendarz chrześcijański",
  "Other dates in the year": "Inne daty w roku",
  "The patron saints' days": "Dni świętych patronów",
  "Bank holidays": "Bank holidays",
  "Christmas Day — 25 December": "Boże Narodzenie — 25 grudnia",
  "A public holiday throughout the UK. Families exchange presents and eat a Christmas dinner, traditionally roast turkey.":
    "Dzień wolny od pracy w całej Wielkiej Brytanii. Rodziny wymieniają się prezentami i jedzą świąteczny obiad, tradycyjnie pieczonego indyka.",
  "Boxing Day — 26 December": "Boxing Day — 26 grudnia",
  "A public holiday, the day after Christmas.":
    "Dzień wolny od pracy, następnego dnia po Bożym Narodzeniu.",
  "Good Friday": "Wielki Piątek",
  "A public holiday. The Friday before Easter, marking the crucifixion.":
    "Dzień wolny od pracy. Piątek przed Wielkanocą, upamiętniający ukrzyżowanie.",
  "Easter Sunday and Easter Monday": "Niedziela i Poniedziałek Wielkanocny",
  "Easter Monday is a public holiday in most of the UK. The date moves each year — Easter falls in March or April.":
    "Poniedziałek Wielkanocny jest w większości Wielkiej Brytanii dniem wolnym. Data jest ruchoma — Wielkanoc wypada w marcu lub kwietniu.",
  "Pancake Day": "Pancake Day",
  "Shrove Tuesday, the day before Lent begins. Not a public holiday, but pancakes are eaten across the country.":
    "Ostatni wtorek przed początkiem Wielkiego Postu. Nie jest dniem wolnym, ale naleśniki je się w całym kraju.",
  "New Year's Day — 1 January": "Nowy Rok — 1 stycznia",
  "A public holiday. In Scotland **Hogmanay** on 31 December is the bigger celebration, and 2 January is also a holiday there.":
    "Dzień wolny od pracy. W Szkocji większym świętem jest **Hogmanay** 31 grudnia, a 2 stycznia również jest tam dniem wolnym.",
  "Valentine's Day — 14 February": "Walentynki — 14 lutego",
  "Cards and gifts between couples. Not a holiday.":
    "Kartki i prezenty między zakochanymi. Nie jest dniem wolnym.",
  "Mothering Sunday and Father's Day": "Dzień Matki i Dzień Ojca",
  "Mothering Sunday falls in March, three weeks before Easter; Father's Day is the third Sunday in June.":
    "Mothering Sunday wypada w marcu, trzy tygodnie przed Wielkanocą; Dzień Ojca w trzecią niedzielę czerwca.",
  "Halloween — 31 October": "Halloween — 31 października",
  "An ancient festival, now marked with costumes, pumpkins and trick-or-treating.":
    "Dawne święto, dziś obchodzone z przebraniami, dyniami i chodzeniem po domach po słodycze.",
  "Bonfire Night — 5 November": "Bonfire Night — 5 listopada",
  "Bonfires and fireworks marking the failure of the **Gunpowder Plot of 1605**. Also called Guy Fawkes Night.":
    "Ogniska i fajerwerki upamiętniające fiasko **spisku prochowego z 1605** roku. Zwana też Guy Fawkes Night.",
  "Remembrance Day — 11 November": "Remembrance Day — 11 listopada",
  "Marks the end of the First World War in 1918. Poppies are worn and there is a two-minute silence at 11am.":
    "Upamiętnia zakończenie pierwszej wojny światowej w 1918 roku. Nosi się maki, a o godzinie 11 zachowuje się dwie minuty ciszy.",

  // ── Sport and leisure ───────────────────────────────────────────────────
  "The major sports": "Najważniejsze dyscypliny",
  "Other sports and events": "Inne sporty i imprezy",
  "Leisure": "Czas wolny",
  "Football": "Piłka nożna",
  "The most popular sport. Each nation has its own team and league; the **FA Cup** is the oldest football competition in the world.":
    "Najpopularniejszy sport. Każdy z krajów ma własną reprezentację i ligę; **FA Cup** to najstarsze rozgrywki piłkarskie na świecie.",
  "Rugby": "Rugby",
  "Two codes, **rugby union** and **rugby league**. The **Six Nations** is contested by England, Scotland, Wales, Ireland, France and Italy.":
    "Dwie odmiany: **rugby union** i **rugby league**. W **Six Nations** grają Anglia, Szkocja, Walia, Irlandia, Francja i Włochy.",
  "Cricket": "Krykiet",
  "Originated in England. **The Ashes** is the historic Test series between England and Australia. **Lord's** in London is the most famous ground.":
    "Powstał w Anglii. **The Ashes** to historyczna seria meczów testowych między Anglią a Australią. **Lord's** w Londynie jest najsłynniejszym boiskiem.",
  "Tennis": "Tenis",
  "**Wimbledon**, held in London every summer, is the oldest tennis tournament in the world and the only Grand Slam still played on grass.":
    "**Wimbledon**, rozgrywany co lato w Londynie, jest najstarszym turniejem tenisowym świata i jedynym Wielkim Szlemem wciąż rozgrywanym na trawie.",
  "Golf": "Golf",
  "Originated in **Scotland**. **St Andrews** is its historic home and the Open Championship is the oldest golf major.":
    "Powstał w **Szkocji**. **St Andrews** to jego historyczna kolebka, a Open Championship jest najstarszym turniejem wielkoszlemowym w golfie.",
  "Horse racing": "Wyścigi konne",
  "Long royal associations. The **Grand National** at Aintree and **Royal Ascot** are the best-known meetings; the Derby at Epsom is the classic flat race.":
    "Od dawna związane z dworem królewskim. Najbardziej znane mityngi to **Grand National** w Aintree i **Royal Ascot**; klasyczną gonitwą płaską jest Derby w Epsom.",
  "The Olympics": "Igrzyska olimpijskie",
  "London has hosted the summer Games **three times** — 1908, 1948 and **2012**. The 2012 Games also included the Paralympics, whose modern origins are British, at Stoke Mandeville.":
    "Londyn gościł letnie igrzyska **trzykrotnie** — w 1908, 1948 i **2012** roku. Igrzyska z 2012 roku obejmowały także paraolimpiadę, której współczesne początki są brytyjskie, w Stoke Mandeville.",
  "Commonwealth Games": "Commonwealth Games",
  "Held every four years between Commonwealth nations. Each UK nation competes separately, rather than as one British team.":
    "Rozgrywane co cztery lata między państwami Commonwealth. Każdy z krajów Wielkiej Brytanii startuje osobno, a nie jako jedna brytyjska reprezentacja.",

  // ── Literature, art and music ───────────────────────────────────────────
  "Writers": "Pisarze",
  "Art and museums": "Sztuka i muzea",
  "Music": "Muzyka",
  "Geoffrey Chaucer": "Geoffrey Chaucer",
  "Wrote *The Canterbury Tales* in the fourteenth century — among the earliest great works in English.":
    "W XIV wieku napisał *The Canterbury Tales* — jedno z najwcześniejszych wielkich dzieł po angielsku.",
  "William Shakespeare": "William Shakespeare",
  "Born in Stratford-upon-Avon, 1564. Plays and sonnets; the Globe Theatre in London.":
    "Urodzony w Stratford-upon-Avon w 1564 roku. Dramaty i sonety; Globe Theatre w Londynie.",
  "Jane Austen": "Jane Austen",
  "*Pride and Prejudice*, *Sense and Sensibility* — novels of English social life in the early nineteenth century.":
    "*Pride and Prejudice*, *Sense and Sensibility* — powieści o angielskim życiu towarzyskim początku XIX wieku.",
  "*Oliver Twist*, *A Christmas Carol*, *Great Expectations* — the poverty of Victorian Britain, read by everyone.":
    "*Oliver Twist*, *A Christmas Carol*, *Great Expectations* — bieda wiktoriańskiej Brytanii, czytane przez wszystkich.",
  "Robert Burns": "Robert Burns",
  "Scotland's national poet, known as the Bard. Wrote *Auld Lang Syne*, sung at New Year. **Burns Night** is 25 January.":
    "Narodowy poeta Szkocji, zwany the Bard. Napisał *Auld Lang Syne*, śpiewane w Nowy Rok. **Burns Night** przypada 25 stycznia.",
  "Others to know": "Inni, których warto znać",
  "The Brontë sisters, Thomas Hardy, Rudyard Kipling, Agatha Christie, J. R. R. Tolkien, George Orwell, Dylan Thomas and J. K. Rowling.":
    "Siostry Brontë, Thomas Hardy, Rudyard Kipling, Agatha Christie, J. R. R. Tolkien, George Orwell, Dylan Thomas i J. K. Rowling.",
  "Artists": "Artyści",
  "**Thomas Gainsborough** and **John Constable** for portraits and landscape, **J. M. W. Turner** for light and sea, **Henry Moore** for sculpture, **David Hockney** among the living.":
    "**Thomas Gainsborough** i **John Constable** — portret i pejzaż, **J. M. W. Turner** — światło i morze, **Henry Moore** — rzeźba, **David Hockney** wśród żyjących.",
  "National Gallery": "National Gallery",
  "In **Trafalgar Square**, London. Holds the national collection of paintings. Free to enter.":
    "Przy **Trafalgar Square** w Londynie. Mieści narodową kolekcję malarstwa. Wstęp bezpłatny.",
  "British Museum": "British Museum",
  "In London, founded 1753 — the first national public museum in the world. Free to enter.":
    "W Londynie, założone w 1753 roku — pierwsze narodowe muzeum publiczne na świecie. Wstęp bezpłatny.",
  "Others": "Inne",
  "Tate Britain and Tate Modern in London, the National Museum of Scotland in Edinburgh, and the Turner Prize for contemporary art.":
    "Tate Britain i Tate Modern w Londynie, National Museum of Scotland w Edinburghu oraz Turner Prize dla sztuki współczesnej.",

  // ── Science and inventions ──────────────────────────────────────────────
  "Scientists": "Naukowcy",
  "Inventors and engineers": "Wynalazcy i inżynierowie",
  "Other British firsts": "Inne brytyjskie pierwszeństwa",
  "Isaac Newton": "Isaac Newton",
  "Gravity and the laws of motion. His *Principia Mathematica* is one of the most important scientific books ever written.":
    "Grawitacja i zasady dynamiki. Jego *Principia Mathematica* to jedna z najważniejszych książek naukowych, jakie powstały.",
  "*On the Origin of Species*, 1859 — evolution by natural selection.":
    "*On the Origin of Species*, 1859 — ewolucja drogą doboru naturalnego.",
  "Alexander Fleming": "Alexander Fleming",
  "A Scot who discovered **penicillin** in 1928, the first true antibiotic.":
    "Szkot, który w 1928 roku odkrył **penicylinę**, pierwszy prawdziwy antybiotyk.",
  "Michael Faraday": "Michael Faraday",
  "Electromagnetic induction — the principle behind the electric motor and the generator.":
    "Indukcja elektromagnetyczna — zasada, na której opierają się silnik elektryczny i prądnica.",
  "Ernest Rutherford": "Ernest Rutherford",
  "Split the atom and established the structure of the atomic nucleus.":
    "Rozbił atom i ustalił budowę jądra atomowego.",
  "Rosalind Franklin": "Rosalind Franklin",
  "Her X-ray work was essential to discovering the double-helix structure of DNA, alongside Crick and Watson.":
    "Jej badania rentgenowskie miały kluczowe znaczenie dla odkrycia podwójnej helisy DNA, obok Cricka i Watsona.",
  "James Watt": "James Watt",
  "Transformed the steam engine and made industrial power practical.":
    "Przekształcił maszynę parową i uczynił napęd przemysłowy praktycznym.",
  "George Stephenson": "George Stephenson",
  "The Rocket, and the first practical passenger railways.":
    "Lokomotywa Rocket i pierwsze praktyczne koleje pasażerskie.",
  "Isambard Kingdom Brunel": "Isambard Kingdom Brunel",
  "The Great Western Railway, the Clifton Suspension Bridge, and pioneering steamships.":
    "Great Western Railway, Clifton Suspension Bridge i pionierskie parowce.",
  "Alexander Graham Bell": "Alexander Graham Bell",
  "Born in Edinburgh; developed the **telephone**.":
    "Urodzony w Edinburghu; opracował **telefon**.",
  "John Logie Baird": "John Logie Baird",
  "A Scot who gave the first public demonstration of **television**.":
    "Szkot, który po raz pierwszy publicznie zademonstrował **telewizję**.",
  "Tim Berners-Lee": "Tim Berners-Lee",
  "Invented the **World Wide Web** in 1989 while working at CERN.":
    "W 1989 roku, pracując w CERN, wynalazł **World Wide Web**.",

  // ── Famous British people ───────────────────────────────────────────────
  "Monarchs": "Monarchowie",
  "Political figures": "Postaci polityczne",
  "Scientists, engineers and reformers": "Naukowcy, inżynierowie i reformatorzy",
  "Writers, artists and musicians": "Pisarze, artyści i muzycy",
  "Military and exploration": "Wojsko i odkrycia geograficzne",
  "Won at Hastings in 1066 and became the first Norman king.":
    "Zwyciężył pod Hastings w 1066 roku i został pierwszym normańskim królem.",
  "Six wives, and the break with Rome that created the Church of England.":
    "Sześć żon i zerwanie z Rzymem, z którego narodził się Church of England.",
  "Reigned 45 years; the Armada was defeated in 1588.":
    "Panowała 45 lat; w 1588 roku pokonano Wielką Armadę.",
  "1837–1901, at the height of British industrial and imperial power.":
    "1837–1901, u szczytu brytyjskiej potęgi przemysłowej i imperialnej.",
  "Charles III": "Karol III",
  "The present monarch, since September 2022.":
    "Obecny monarcha, od września 2022 roku.",
  "Oliver Cromwell": "Oliver Cromwell",
  "Led Parliament to victory in the Civil War and ruled as Lord Protector.":
    "Poprowadził parlament do zwycięstwa w wojnie domowej i rządził jako Lord Protector.",
  "William Wilberforce": "William Wilberforce",
  "Led the parliamentary campaign to abolish the slave trade.":
    "Kierował parlamentarną kampanią na rzecz zniesienia handlu niewolnikami.",
  "Winston Churchill": "Winston Churchill",
  "Prime Minister through the Second World War, and voted the greatest Briton in a national poll.":
    "Premier w czasie drugiej wojny światowej, wybrany największym Brytyjczykiem w ogólnokrajowym plebiscycie.",
  "Clement Attlee": "Clement Attlee",
  "Prime Minister from 1945; his government built the welfare state and the NHS.":
    "Premier od 1945 roku; jego rząd zbudował państwo opiekuńcze i NHS.",
  "Margaret Thatcher": "Margaret Thatcher",
  "The first woman Prime Minister, from 1979 to 1990.":
    "Pierwsza kobieta na stanowisku premiera, od 1979 do 1990 roku.",
  "Led the suffragette campaign for votes for women.":
    "Kierowała kampanią sufrażystek o prawo wyborcze dla kobiet.",
  "Gravity and the laws of motion.": "Grawitacja i zasady dynamiki.",
  "Evolution by natural selection.": "Ewolucja drogą doboru naturalnego.",
  "Penicillin, 1928.": "Penicylina, 1928.",
  "Railways, bridges and steamships.": "Koleje, mosty i parowce.",
  "Founded modern nursing.": "Stworzyła nowoczesne pielęgniarstwo.",
  "Alan Turing": "Alan Turing",
  "Computing, and the codebreakers at Bletchley Park.":
    "Informatyka i łamanie szyfrów w Bletchley Park.",
  "The most influential writer in the English language.":
    "Najbardziej wpływowy pisarz języka angielskiego.",
  "Jane Austen and Charles Dickens": "Jane Austen i Charles Dickens",
  "The two most widely read English novelists of the nineteenth century.":
    "Dwoje najczęściej czytanych angielskich powieściopisarzy XIX wieku.",
  "Scotland's national poet.": "Narodowy poeta Szkocji.",
  "J. M. W. Turner": "J. M. W. Turner",
  "Landscape and seascape painter; the Turner Prize is named after him.":
    "Malarz pejzaży i marin; jego imieniem nazwano Turner Prize.",
  "The Beatles": "The Beatles",
  "From Liverpool — the most successful British band.":
    "Z Liverpoolu — najbardziej znany brytyjski zespół.",
  "Sake Dean Mahomet": "Sake Dean Mahomet",
  "Opened Britain's first Indian restaurant and introduced shampooing; an early figure in Britain's multicultural history.":
    "Otworzył pierwszą indyjską restaurację w Brytanii i wprowadził mycie głowy szamponem; wczesna postać wielokulturowej historii kraju.",

  // ── Education and healthcare ────────────────────────────────────────────
  "Education": "Edukacja",
  "The NHS": "NHS",
  "Emergency services": "Służby ratunkowe",
  "Primary school": "Szkoła podstawowa",
  "From about age 5 to 11. One class teacher covers most subjects.":
    "Mniej więcej od 5. do 11. roku życia. Większość przedmiotów prowadzi jeden wychowawca.",
  "Secondary school": "Szkoła średnia",
  "From about 11 to 16, ending with **GCSEs** in England, Wales and Northern Ireland, or **National Qualifications** in Scotland.":
    "Mniej więcej od 11. do 16. roku życia, zakończona egzaminami **GCSEs** w Anglii, Walii i Irlandii Północnej lub **National Qualifications** w Szkocji.",
  "Further education": "Kształcenie ponadobowiązkowe",
  "**A levels**, or Highers in Scotland, and vocational courses at sixth form or college, usually 16 to 18.":
    "**A levels**, w Szkocji Highers, oraz kursy zawodowe w sixth form lub college, zwykle między 16. a 18. rokiem życia.",
  "Higher education": "Szkolnictwo wyższe",
  "Universities award degrees. **Oxford** and **Cambridge** are the oldest. Tuition fees and support differ between the four nations, because education is devolved.":
    "Uniwersytety nadają stopnie naukowe. Najstarsze to **Oxford** i **Cambridge**. Czesne i wsparcie różnią się w czterech krajach, bo edukacja podlega devolution.",
  "Your GP": "Twój GP",
  "A **general practitioner** is your first point of contact. Register with a local practice; you need to be registered to be referred for most other care.":
    "**General practitioner** to twój pierwszy kontakt z opieką zdrowotną. Zapisz się do lokalnej przychodni; bez rejestracji nie otrzymasz skierowania do większości innych świadczeń.",
  "Hospitals": "Szpitale",
  "You normally attend after a GP referral, except in an emergency.":
    "Zwykle trafia się tam ze skierowaniem od GP, z wyjątkiem nagłych przypadków.",
  "Prescriptions": "Recepty",
  "Charged in England, with many exemptions. Free in Scotland, Wales and Northern Ireland.":
    "W Anglii płatne, z licznymi zwolnieniami. W Szkocji, Walii i Irlandii Północnej bezpłatne.",
  "Dentists and opticians": "Dentyści i optycy",
  "NHS treatment is available but usually carries a charge.":
    "Leczenie w ramach NHS jest dostępne, ale zwykle wiąże się z opłatą.",

  // ── Study aids ──────────────────────────────────────────────────────────
  "What you must know": "Co musisz wiedzieć",
  "Key names": "Najważniejsze nazwiska",
  "Key dates and numbers": "Najważniejsze daty i liczby",
  "Key terms": "Najważniejsze pojęcia",
  "Why this lesson first: the test does not only ask facts. Several questions ask what British society expects of you, and those answers come straight from the values below.":
    "Dlaczego ta lekcja jest pierwsza: test nie pyta wyłącznie o fakty. Kilka pytań dotyczy tego, czego brytyjskie społeczeństwo od ciebie oczekuje, a odpowiedzi wynikają wprost z poniższych wartości.",
  "The UK sets out a short list of shared values. Learn them as a list — questions often ask you to pick which one is *not* included.":
    "Wielka Brytania określa krótką listę wspólnych wartości. Naucz się jej jako listy — pytania często proszą o wskazanie tej, której na niej *nie ma*.",
  "It is unlawful to discriminate against someone on any of these grounds: **age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, and sexual orientation**.":
    "Dyskryminacja z któregokolwiek z tych powodów jest niezgodna z prawem: **wiek, niepełnosprawność, korekta płci, małżeństwo i civil partnership, ciąża i macierzyństwo, rasa, religia lub przekonania, płeć oraz orientacja seksualna**.",
  "The values cut both ways. Living in the UK gives you rights, and each one carries a matching duty.":
    "Wartości działają w obie strony. Życie w Wielkiej Brytanii daje ci prawa, a każdemu z nich odpowiada obowiązek.",
  "Freedom of speech is not unlimited. Speech that incites violence or racial hatred is a criminal offence. The test does ask about that boundary.":
    "Wolność słowa nie jest nieograniczona. Wypowiedź nawołująca do przemocy lub nienawiści rasowej jest przestępstwem. Test pyta o tę granicę.",
  "No people to learn here — this lesson is about principles, not personalities.":
    "Tu nie ma nazwisk do zapamiętania — ta lekcja dotyczy zasad, nie postaci.",
  "This trips people up constantly, and the test knows it. **The United Kingdom** is England, Scotland, Wales and Northern Ireland. **Great Britain** is only England, Scotland and Wales — it is the island, so Northern Ireland is not part of it.":
    "To nieustanne źródło pomyłek i test dobrze o tym wie. **United Kingdom** to Anglia, Szkocja, Walia i Irlandia Północna. **Great Britain** to wyłącznie Anglia, Szkocja i Walia — to nazwa wyspy, więc Irlandia Północna do niej nie należy.",
  "The Channel Islands and the Isle of Man are Crown Dependencies. They are NOT part of the UK. They have their own governments and are linked to the Crown, not to Parliament in Westminster.":
    "Channel Islands i Isle of Man to Crown Dependencies. NIE należą do Wielkiej Brytanii. Mają własne rządy i są związane z Koroną, a nie z parlamentem w Westminsterze.",
  "England is divided into **counties** — Kent, Yorkshire, Cornwall, Devon, Lancashire and dozens more — and into broader regions such as the **South East, the Midlands, the North West and East Anglia**. Scotland has council areas and historic regions such as the **Highlands, the Lowlands and the Borders**. Northern Ireland has six counties: Antrim, Armagh, Down, Fermanagh, Londonderry and Tyrone.":
    "Anglia dzieli się na **counties** — Kent, Yorkshire, Cornwall, Devon, Lancashire i dziesiątki innych — oraz na szersze regiony, takie jak **South East, Midlands, North West i East Anglia**. Szkocja ma council areas oraz regiony historyczne, jak **Highlands, Lowlands i Borders**. Irlandia Północna liczy sześć hrabstw: Antrim, Armagh, Down, Fermanagh, Londonderry i Tyrone.",
  "**Lough Neagh** in Northern Ireland is the largest freshwater lake in the whole UK by area. **Loch Ness** and **Loch Lomond** are the best-known Scottish lochs — Loch Lomond is the largest by surface area in Great Britain, while Loch Ness holds the most water. **Windermere** in the Lake District is the largest lake in England.":
    "**Lough Neagh** w Irlandii Północnej jest największym pod względem powierzchni jeziorem słodkowodnym w całej Wielkiej Brytanii. **Loch Ness** i **Loch Lomond** to najbardziej znane szkockie loch — Loch Lomond ma największą powierzchnię w Great Britain, a Loch Ness mieści najwięcej wody. **Windermere** w Lake District to największe jezioro Anglii.",
  "There are **15 National Parks** across the UK. The best known are the **Lake District, Snowdonia (Eryri), the Peak District, the Yorkshire Dales, Dartmoor, the Cairngorms** and **Loch Lomond and the Trossachs**. Landmarks the test may mention include **Stonehenge**, **Hadrian's Wall**, the **Giant's Causeway** in County Antrim, the **Tower of London**, **Edinburgh Castle** and the **Lake District**.":
    "W Wielkiej Brytanii jest **15 parków narodowych**. Najbardziej znane to **Lake District, Snowdonia (Eryri), Peak District, Yorkshire Dales, Dartmoor, Cairngorms** oraz **Loch Lomond and the Trossachs**. Zabytki, o które może zapytać test, to między innymi **Stonehenge**, **Hadrian's Wall**, **Giant's Causeway** w hrabstwie Antrim, **Tower of London**, **Edinburgh Castle** i **Lake District**.",
  "English is spoken throughout. **Welsh** is an official language in Wales and is taught in schools there. **Gaelic** is spoken in parts of Scotland, and **Irish** is spoken in Northern Ireland. Scots and Ulster Scots are also recognised.":
    "Angielskim mówi się w całym kraju. **Walijski** jest językiem urzędowym w Walii i naucza się go tam w szkołach. **Gaelickim** mówi się w części Szkocji, a **irlandzkim** w Irlandii Północnej. Uznawane są także Scots i Ulster Scots.",
  "In one line: Great Britain is the island — three nations. The UK is four. The Isle of Man and the Channel Islands are in neither.":
    "W jednym zdaniu: Great Britain to wyspa — trzy kraje. UK to cztery. Isle of Man i Channel Islands nie należą do żadnego z tych pojęć.",
  "Every nation of the UK carries its own saint, flower, flag and symbol — and the Union brings three of the four together in one flag. The test asks which belongs to which, so learn them as four sets rather than as one long list.":
    "Każdy kraj Wielkiej Brytanii ma własnego świętego, kwiat, flagę i symbol — a Union łączy trzy z czterech w jednej fladze. Test pyta, co do kogo należy, więc ucz się ich jako czterech zestawów, a nie jednej długiej listy.",
  "The **Union Flag** — often called the **Union Jack** — combines three crosses: the red cross of **St George** on white for England, the white diagonal cross (saltire) of **St Andrew** on blue for Scotland, and the red diagonal cross of **St Patrick** on white for Ireland.":
    "**Union Flag** — często nazywana **Union Jack** — łączy trzy krzyże: czerwony krzyż **St George** na białym tle dla Anglii, biały ukośny krzyż (saltire) **St Andrew** na niebieskim tle dla Szkocji oraz czerwony ukośny krzyż **St Patrick** na białym tle dla Irlandii.",
  "Why Wales is missing: when the first Union Flag was designed in 1606, Wales had already been joined to England, so it was not treated as a separate kingdom. The Welsh dragon flies on its own flag instead.":
    "Dlaczego brakuje Walii: gdy w 1606 roku projektowano pierwszą Union Flag, Walia była już połączona z Anglią, więc nie traktowano jej jako odrębnego królestwa. Walijski smok widnieje za to na własnej fladze.",
  "Four saints, four dates. Two fall in March, and that is the pair people mix up.":
    "Czterech świętych, cztery daty. Dwie przypadają w marcu i to właśnie tę parę się myli.",
  "England.": "Anglia.",
  "The **Welsh Dragon** appears on the flag of Wales. The **lion** and the **unicorn** support the Royal Coat of Arms — the lion for England, the unicorn for Scotland. The **oak tree** is a long-standing English symbol, and the **poppy** is worn nationally for Remembrance.":
    "**Welsh Dragon** widnieje na fladze Walii. **Lew** i **jednorożec** podtrzymują Royal Coat of Arms — lew za Anglię, jednorożec za Szkocję. **Dąb** jest od dawna symbolem Anglii, a **mak** nosi się w całym kraju w Remembrance.",
  "The national anthem of the UK is **God Save the King** (God Save the Queen during a queen's reign). It is played at state occasions and when the monarch appears in public. In sport each nation may use its own song — **Flower of Scotland** for Scotland, **Hen Wlad Fy Nhadau (Land of My Fathers)** for Wales, and **Jerusalem** or the national anthem for England.":
    "Hymnem Wielkiej Brytanii jest **God Save the King** (God Save the Queen za panowania królowej). Gra się go podczas uroczystości państwowych i gdy monarcha pojawia się publicznie. W sporcie każdy kraj może mieć własną pieśń — **Flower of Scotland** dla Szkocji, **Hen Wlad Fy Nhadau (Land of My Fathers)** dla Walii, a dla Anglii **Jerusalem** lub hymn państwowy.",
  "Why the words change: they follow the monarch's gender, not the country. Nothing else in the song changes.":
    "Dlaczego zmieniają się słowa: zależą od płci monarchy, a nie od kraju. Nic innego w pieśni się nie zmienia.",
  "In one line: Four saints, four flowers, four dates — and only three crosses in the flag, because Wales was already joined to England.":
    "W jednym zdaniu: czterech świętych, cztery kwiaty, cztery daty — i tylko trzy krzyże we fladze, bo Walia była już połączona z Anglią.",
  "For most of prehistory Britain was not an island. It was joined to the continent by land, and people walked here. Around **10,000 years ago** the land bridge flooded and Britain was cut off.":
    "Przez większość prehistorii Brytania nie była wyspą. Łączył ją z kontynentem ląd i ludzie przychodzili tu pieszo. Około **10 000 lat temu** most lądowy zalała woda i Brytania została odcięta.",
  "The **Celts** spoke languages from which modern **Welsh, Gaelic and Irish** descend. **Stonehenge** in Wiltshire is the most famous prehistoric monument in Britain and is still a World Heritage Site.":
    "**Celtowie** mówili językami, od których pochodzą dzisiejszy **walijski, gaelicki i irlandzki**. **Stonehenge** w Wiltshire to najsłynniejszy prehistoryczny zabytek Brytanii i nadal obiekt World Heritage Site.",
  "**Julius Caesar** led an expedition in **55 BC** and it failed — he did not conquer Britain. The successful invasion came almost a century later, under the Emperor **Claudius in AD 43**.":
    "**Juliusz Cezar** poprowadził wyprawę w **55 roku p.n.e.** i zakończyła się ona niepowodzeniem — nie podbił Brytanii. Udana inwazja nastąpiła niemal sto lat później, za cesarza **Klaudiusza w 43 roku n.e.**",
  "55 BC and AD 43 are the pair the test loves. Caesar came and left; Claudius came and stayed. Do not swap them.":
    "55 p.n.e. i 43 n.e. to para, którą test uwielbia. Cezar przyszedł i odszedł; Klaudiusz przyszedł i został. Nie pomyl ich.",
  "**Boudicca**, queen of the Iceni in what is now East Anglia, led a famous revolt against Roman rule. Her statue stands on Westminster Bridge in London. The Romans never conquered what is now Scotland, and the Emperor **Hadrian** built **Hadrian's Wall** across the north of England to keep out the tribes he called the Picts. The Romans left Britain in **AD 410** to defend Rome itself.":
    "**Boudika**, królowa Icenów na terenie dzisiejszej East Anglia, poprowadziła słynne powstanie przeciw rzymskim rządom. Jej pomnik stoi na Westminster Bridge w Londynie. Rzymianie nigdy nie podbili terenów dzisiejszej Szkocji, a cesarz **Hadrian** zbudował **Hadrian's Wall** w północnej Anglii, aby powstrzymać plemiona, które nazywał Piktami. Rzymianie opuścili Brytanię w **410 roku n.e.**, by bronić samego Rzymu.",
  "After the Romans left, tribes from northern Europe — the **Angles, Saxons and Jutes** — settled in Britain. Their language became the basis of modern English, and the country took its name from the Angles: *Angle-land*, England. The burial ship at **Sutton Hoo** in Suffolk dates from this period.":
    "Po odejściu Rzymian w Brytanii osiedliły się plemiona z północnej Europy — **Anglowie, Sasi i Jutowie**. Ich język stał się podstawą dzisiejszej angielszczyzny, a kraj wziął nazwę od Anglów: *Angle-land*, England. Z tego okresu pochodzi pochówek łodziowy w **Sutton Hoo** w Suffolk.",
  "Christian missionaries arrived to convert the Anglo-Saxons — **St Augustine** in the south, who became the first Archbishop of Canterbury, and **St Columba** in Scotland, who founded a monastery on **Iona**.":
    "Przybyli chrześcijańscy misjonarze, by nawrócić Anglosasów — **St Augustine** na południu, który został pierwszym Archbishop of Canterbury, i **St Columba** w Szkocji, który założył klasztor na wyspie **Iona**.",
  "Vikings from Denmark and Norway first raided in **AD 789** and later settled. **Alfred the Great**, King of Wessex, defeated them and agreed a boundary: the north and east of England became the **Danelaw**, under Danish law, while Wessex remained English.":
    "Wikingowie z Danii i Norwegii po raz pierwszy najechali w **789 roku n.e.**, a później się osiedlili. **Alfred Wielki**, król Wesseksu, pokonał ich i uzgodnił granicę: północ i wschód Anglii stały się **Danelaw** pod prawem duńskim, a Wessex pozostał angielski.",
  "In **1066** **William, Duke of Normandy**, defeated King Harold at the **Battle of Hastings** and became William I — William the Conqueror. It is the last time Britain was successfully invaded, and the date every schoolchild in Britain knows.":
    "W **1066** roku **Wilhelm, książę Normandii**, pokonał króla Harolda w **Battle of Hastings** i został Wilhelmem I — Wilhelmem Zdobywcą. To ostatni raz, gdy inwazja na Brytanię się powiodła, i data, którą zna w Brytanii każde dziecko.",
  "In one line: Caesar came and left in 55 BC; Claudius came and stayed in AD 43. That pair is the trap this chapter is built around.":
    "W jednym zdaniu: Cezar przyszedł i odszedł w 55 p.n.e.; Klaudiusz przyszedł i został w 43 n.e. Wokół tej pary zbudowana jest pułapka tego rozdziału.",
  "The Middle Ages run from the Norman Conquest to the Tudors. Two themes carry most of the test questions: the slow limiting of the king's power, and the long wars with Wales, Scotland and France.":
    "Średniowiecze trwa od podboju normańskiego do Tudorów. Większość pytań testowych opiera się na dwóch wątkach: powolnym ograniczaniu władzy króla oraz długich wojnach z Walią, Szkocją i Francją.",
  "**King John** was forced by his barons to agree to **Magna Carta** — the Great Charter — in **1215** at Runnymede. It established that the king was **not above the law** and could not tax as he pleased. It is the foundation of the rule of law in Britain.":
    "**Król Jan** został zmuszony przez baronów do przyjęcia **Magna Carta** — Wielkiej Karty — w **1215** roku w Runnymede. Ustanowiła ona, że król **nie stoi ponad prawem** i nie może nakładać podatków wedle uznania. To fundament rządów prawa w Brytanii.",
  "Why Magna Carta still matters: it is the first written statement that a ruler is bound by law. The principle behind it is one of the fundamental values you learned in lesson 1.":
    "Dlaczego Magna Carta wciąż ma znaczenie: to pierwszy zapis stwierdzający, że władca jest związany prawem. Stojąca za nim zasada należy do podstawowych wartości z pierwszej lekcji.",
  "**Henry II** reformed the courts and quarrelled with **Thomas Becket**, Archbishop of Canterbury, who was murdered in Canterbury Cathedral in 1170. **Richard I**, the Lionheart, spent almost his whole reign abroad on crusade.":
    "**Henryk II** zreformował sądy i popadł w konflikt z **Thomasem Becketem**, Archbishop of Canterbury, zamordowanym w Canterbury Cathedral w 1170 roku. **Ryszard I** Lwie Serce spędził niemal całe panowanie za granicą, na krucjacie.",
  "**Edward I** conquered **Wales** and built a ring of castles there; the **Statute of Rhuddlan (1284)** annexed Wales to the English Crown. He tried the same in **Scotland** and failed.":
    "**Edward I** podbił **Walię** i zbudował tam pierścień zamków; **Statute of Rhuddlan (1284)** przyłączył Walię do korony angielskiej. Próbował tego samego w **Szkocji** i mu się nie udało.",
  "England and France fought on and off from **1337 to 1453**. The English won famous victories at **Crécy (1346)** and **Agincourt (1415)** under **Henry V**, but by the end had lost all their French lands except Calais.":
    "Anglia i Francja walczyły z przerwami od **1337 do 1453** roku. Anglicy odnieśli słynne zwycięstwa pod **Crécy (1346)** i **Agincourt (1415)** pod wodzą **Henryka V**, ale ostatecznie stracili wszystkie ziemie we Francji poza Calais.",
  "The **Black Death** reached Britain in **1348** and killed roughly a third of the population. So few labourers were left that survivors could demand better pay — the feudal system began to break down. When a poll tax was imposed, the **Peasants Revolt of 1381** broke out, led by **Wat Tyler**.":
    "**Czarna śmierć** dotarła do Brytanii w **1348** roku i zabiła około jednej trzeciej ludności. Robotników zostało tak niewielu, że ocalali mogli żądać lepszej zapłaty — system feudalny zaczął się rozpadać. Gdy nałożono pogłówne, wybuchł **bunt chłopski z 1381** roku pod wodzą **Wata Tylera**.",
  "A civil war between the **House of Lancaster** (red rose) and the **House of York** (white rose), ending at the **Battle of Bosworth Field in 1485**. Richard III was killed, Henry Tudor won, and the **Tudor rose** — red and white together — was the emblem of the peace that followed.":
    "Wojna domowa między **House of Lancaster** (czerwona róża) a **House of York** (biała róża), zakończona w **Battle of Bosworth Field w 1485** roku. Ryszard III zginął, zwyciężył Henryk Tudor, a **róża Tudorów** — czerwona i biała razem — stała się godłem pokoju, który po niej nastał.",
  "William the Conqueror · Henry II · Thomas Becket · Richard I · King John · Edward I · William Wallace · Robert the Bruce · Henry V · Wat Tyler.":
    "Wilhelm Zdobywca · Henryk II · Thomas Becket · Ryszard I · król Jan · Edward I · William Wallace · Robert Bruce · Henryk V · Wat Tyler.",
  "1066 Hastings · 1086 Domesday Book · 1215 Magna Carta · 1284 Statute of Rhuddlan · 1314 Bannockburn · 1337–1453 Hundred Years War · 1348 Black Death · 1381 Peasants' Revolt · 1415 Agincourt · 1485 Bosworth Field.":
    "1066 Hastings · 1086 Domesday Book · 1215 Magna Carta · 1284 Statute of Rhuddlan · 1314 Bannockburn · 1337–1453 wojna stuletnia · 1348 czarna śmierć · 1381 bunt chłopski · 1415 Agincourt · 1485 Bosworth Field.",
  "Feudal system · Magna Carta · Domesday Book · Wars of the Roses · poll tax · barons.":
    "System feudalny · Magna Carta · Domesday Book · Wojna Dwóch Róż · pogłówne · baronowie.",
  "In one line: Magna Carta in 1215 is the first written statement that a ruler is bound by law — the root of the rule of law you learned in lesson 1.":
    "W jednym zdaniu: Magna Carta z 1215 roku to pierwszy zapis stwierdzający, że władca jest związany prawem — korzeń rządów prawa z pierwszej lekcji.",
  "Five Tudor monarchs in 118 years, and between them they broke with Rome, changed the country's religion three times, and turned England into a naval power.":
    "Pięcioro monarchów z rodu Tudorów w 118 lat, a wspólnie zerwali z Rzymem, trzykrotnie zmienili religię kraju i uczynili z Anglii potęgę morską.",
  "**Henry VII** ended the Wars of the Roses and founded the dynasty. His son **Henry VIII** is remembered for his **six wives** and for breaking with the Pope.":
    "**Henryk VII** zakończył Wojnę Dwóch Róż i założył dynastię. Jego syn **Henryk VIII** zapisał się w pamięci **sześcioma żonami** i zerwaniem z papieżem.",
  "The rhyme British children learn: divorced, beheaded, died; divorced, beheaded, survived. It is the fastest way to keep the six in order.":
    "Rymowanka, której uczą się brytyjskie dzieci: rozwiedziona, ścięta, zmarła; rozwiedziona, ścięta, przeżyła. To najszybszy sposób, by zapamiętać kolejność szóstki.",
  "When the Pope refused to annul his first marriage, Henry VIII broke with Rome and made himself **Head of the Church of England**. The **Dissolution of the Monasteries** followed: monasteries were closed and their wealth taken by the Crown. Wales was formally united with England by law during his reign.":
    "Gdy papież odmówił unieważnienia jego pierwszego małżeństwa, Henryk VIII zerwał z Rzymem i ogłosił się **Head of the Church of England**. Nastąpiło **Dissolution of the Monasteries**: klasztory zamknięto, a ich majątek przejęła Korona. Za jego panowania Walię formalnie połączono z Anglią ustawą.",
  "In **1588** Catholic Spain sent a great fleet, the **Armada**, to invade England. It was defeated by the English navy and scattered by storms. The victory made Elizabeth's reputation and established England as a serious naval power.":
    "W **1588** roku katolicka Hiszpania wysłała wielką flotę, **Armadę**, by najechać Anglię. Rozbiła ją angielska marynarka, a resztę rozproszyły sztormy. Zwycięstwo ugruntowało pozycję Elżbiety i uczyniło z Anglii poważną potęgę morską.",
  "**William Shakespeare (1564–1616)** was born in **Stratford-upon-Avon**. He wrote plays and poetry, worked at the **Globe Theatre** in London, and shaped the English language more than any other writer. Famous works include *Hamlet*, *Macbeth*, *Romeo and Juliet* and *A Midsummer Night's Dream*.":
    "**William Shakespeare (1564–1616)** urodził się w **Stratford-upon-Avon**. Pisał dramaty i poezję, pracował w **Globe Theatre** w Londynie i ukształtował angielszczyznę bardziej niż jakikolwiek inny pisarz. Do znanych dzieł należą *Hamlet*, *Macbeth*, *Romeo and Juliet* i *A Midsummer Night's Dream*.",
  "Also in this period: **Mary, Queen of Scots**, a Catholic cousin of Elizabeth, fled to England, was imprisoned for years and eventually executed in 1587. Her son became James VI of Scotland — and then James I of England.":
    "W tym samym okresie: **Maria Stuart**, katolicka kuzynka Elżbiety, zbiegła do Anglii, przez lata była więziona i ostatecznie stracona w 1587 roku. Jej syn został Jakubem VI Szkockim — a potem Jakubem I Angielskim.",
  "Henry VII · Henry VIII · his six wives · Edward VI · Mary I · Elizabeth I · Mary, Queen of Scots · William Shakespeare.":
    "Henryk VII · Henryk VIII · jego sześć żon · Edward VI · Maria I · Elżbieta I · Maria Stuart · William Shakespeare.",
  "1485 Tudors begin · 1534 break with Rome · 1587 Mary, Queen of Scots executed · 1588 Spanish Armada · 1564–1616 Shakespeare.":
    "1485 początek rządów Tudorów · 1534 zerwanie z Rzymem · 1587 stracenie Marii Stuart · 1588 Wielka Armada · 1564–1616 Shakespeare.",
  "Reformation · Church of England · Dissolution of the Monasteries · annulment · Armada · the Globe Theatre.":
    "Reformacja · Church of England · Dissolution of the Monasteries · unieważnienie małżeństwa · Armada · Globe Theatre.",
  "In one line: Divorced, beheaded, died; divorced, beheaded, survived. The break with Rome started as a marriage dispute, not a change of belief.":
    "W jednym zdaniu: rozwiedziona, ścięta, zmarła; rozwiedziona, ścięta, przeżyła. Zerwanie z Rzymem zaczęło się jako spór o małżeństwo, a nie zmiana wiary.",
  "The seventeenth century is where Parliament wins. A king is executed, a republic is tried and abandoned, and by 1689 it is settled law that the Crown rules with Parliament, not over it.":
    "W XVII wieku zwycięża parlament. Król zostaje stracony, republikę wypróbowano i porzucono, a do 1689 roku prawo przesądza, że Korona rządzi z parlamentem, a nie ponad nim.",
  "When Elizabeth I died childless in 1603, **James VI of Scotland** became **James I of England** — the same man wearing two crowns, though the countries stayed separate. He ordered the **King James Bible**, still the best-known English translation.":
    "Gdy w 1603 roku Elżbieta I zmarła bezpotomnie, **Jakub VI Szkocki** został **Jakubem I Angielskim** — ten sam człowiek w dwóch koronach, choć kraje pozostały odrębne. Zlecił **King James Bible**, wciąż najbardziej znany angielski przekład.",
  "In **1605** a group of Catholics led by **Guy Fawkes** tried to blow up Parliament and the King. The **Gunpowder Plot** failed, and the country still marks it on **5 November** with bonfires and fireworks.":
    "W **1605** roku grupa katolików pod wodzą **Guya Fawkesa** próbowała wysadzić parlament wraz z królem. **Spisek prochowy** się nie powiódł, a kraj wciąż upamiętnia go **5 listopada** ogniskami i fajerwerkami.",
  "**Charles I** believed in the **divine right of kings** — that his authority came from God and Parliament could not limit it. He ruled for eleven years without calling Parliament at all. The quarrel became war in **1642**.":
    "**Karol I** wierzył w **boskie prawo królów** — że jego władza pochodzi od Boga i parlament nie może jej ograniczać. Przez jedenaście lat rządził, w ogóle nie zwołując parlamentu. W **1642** roku spór przerodził się w wojnę.",
  "England became a republic, the **Commonwealth**, with **Oliver Cromwell** as **Lord Protector**. His rule was strict and puritan — theatres closed, Christmas celebrations discouraged. He also campaigned brutally in Ireland. When he died his son could not hold the country together.":
    "Anglia stała się republiką, **Commonwealth**, z **Oliverem Cromwellem** jako **Lord Protector**. Jego rządy były surowe i purytańskie — zamknięto teatry, zniechęcano do obchodów Bożego Narodzenia. Prowadził też brutalną kampanię w Irlandii. Po jego śmierci syn nie zdołał utrzymać kraju w całości.",
  "In **1660** Parliament invited **Charles II** back to the throne — the **Restoration**. His reign saw the **Great Plague of 1665** and the **Great Fire of London in 1666**, and the founding of the **Royal Society**, Britain's oldest scientific institution.":
    "W **1660** roku parlament przywrócił na tron **Karola II** — to **restauracja**. Za jego panowania wybuchły **wielka zaraza w 1665** roku i **wielki pożar Londynu w 1666** roku oraz powstało **Royal Society**, najstarsza brytyjska instytucja naukowa.",
  "**James II** was Catholic, and Protestant leaders feared where he would take the country. They invited his Protestant daughter **Mary** and her Dutch husband **William of Orange** to take the throne. William landed in 1688 and James fled without a battle — hence **Glorious Revolution**, a revolution with almost no bloodshed in England.":
    "**Jakub II** był katolikiem, a przywódcy protestanccy obawiali się, dokąd poprowadzi kraj. Zaprosili na tron jego protestancką córkę **Marię** i jej holenderskiego męża **Wilhelma Orańskiego**. Wilhelm wylądował w 1688 roku, a Jakub uciekł bez bitwy — stąd **chwalebna rewolucja**, w Anglii niemal bezkrwawa.",
  "**William III and Mary II** ruled jointly. In **1689** the **Bill of Rights** settled the terms: the monarch may not raise taxes or keep an army without Parliament, Parliament must meet regularly, and elections must be free.":
    "**Wilhelm III i Maria II** panowali wspólnie. W **1689** roku **Bill of Rights** ustaliła zasady: monarcha nie może nakładać podatków ani utrzymywać armii bez parlamentu, parlament musi zbierać się regularnie, a wybory mają być wolne.",
  "Why 1689 is the hinge: everything after it is a constitutional monarchy. The monarch reigns, Parliament governs — the arrangement Britain still has.":
    "Dlaczego 1689 rok jest przełomem: wszystko po nim to monarchia konstytucyjna. Monarcha panuje, parlament rządzi — układ, który Brytania ma do dziś.",
  "James I · Guy Fawkes · Charles I · Oliver Cromwell · Charles II · James II · William III · Mary II.":
    "Jakub I · Guy Fawkes · Karol I · Oliver Cromwell · Karol II · Jakub II · Wilhelm III · Maria II.",
  "1603 James I · 1605 Gunpowder Plot · 1642–1651 Civil War · 1649 Charles I executed · 1660 Restoration · 1665 Plague · 1666 Great Fire · 1688 Glorious Revolution · 1689 Bill of Rights.":
    "1603 Jakub I · 1605 spisek prochowy · 1642–1651 wojna domowa · 1649 stracenie Karola I · 1660 restauracja · 1665 zaraza · 1666 wielki pożar · 1688 chwalebna rewolucja · 1689 Bill of Rights.",
  "Divine right of kings · Cavaliers · Roundheads · Commonwealth · Lord Protector · Restoration · Bill of Rights.":
    "Boskie prawo królów · Cavaliers · Roundheads · Commonwealth · Lord Protector · restauracja · Bill of Rights.",
  "In one line: 1689 is the hinge: after the Bill of Rights the monarch reigns and Parliament governs. Everything since is a constitutional monarchy.":
    "W jednym zdaniu: 1689 to przełom — po Bill of Rights monarcha panuje, a parlament rządzi. Wszystko od tamtej pory to monarchia konstytucyjna.",
  "Two centuries in which Britain becomes one kingdom, then the first industrial nation, then the largest empire in history — and in which a long argument about slavery and about the vote begins to be won.":
    "Dwa stulecia, w których Brytania staje się jednym królestwem, potem pierwszym krajem przemysłowym, a następnie największym imperium w dziejach — i w których zaczyna wygrywać długi spór o niewolnictwo i o prawo głosu.",
  "The **Act of Union in 1707** joined the parliaments of England and Scotland into the **Kingdom of Great Britain**, governed from Westminster. A second **Act of Union in 1801** added Ireland, creating the United Kingdom.":
    "**Act of Union z 1707** roku połączyła parlamenty Anglii i Szkocji w **Kingdom of Great Britain**, rządzone z Westminsteru. Druga **Act of Union z 1801** roku dołączyła Irlandię, tworząc United Kingdom.",
  "The **Jacobites** wanted the Stuart line restored. **Bonnie Prince Charlie** — Charles Edward Stuart — landed in Scotland in 1745, raised an army, and was crushed at the **Battle of Culloden in 1746**, the last battle fought on British soil.":
    "**Jakobici** chcieli przywrócenia linii Stuartów. **Bonnie Prince Charlie** — Karol Edward Stuart — wylądował w Szkocji w 1745 roku, zebrał armię i został rozbity w **Battle of Culloden w 1746** roku, ostatniej bitwie stoczonej na ziemi brytyjskiej.",
  "Britain was the first country to industrialise. Machines replaced hand tools, factories replaced workshops, and people moved from the countryside into fast-growing cities such as Manchester, Birmingham and Glasgow.":
    "Brytania uprzemysłowiła się jako pierwsza. Maszyny zastąpiły narzędzia ręczne, fabryki zastąpiły warsztaty, a ludzie przenosili się ze wsi do szybko rosnących miast, takich jak Manchester, Birmingham i Glasgow.",
  "The **British Empire** grew until it covered around a quarter of the world. Its wealth came partly from the **slave trade**, in which British ships carried enslaved Africans to the colonies.":
    "**British Empire** rosło, aż objęło około jednej czwartej świata. Jego bogactwo brało się po części z **handlu niewolnikami**, w którym brytyjskie statki woziły zniewolonych Afrykanów do kolonii.",
  "Two dates, often confused. **1807** abolished the slave TRADE — carrying and selling. **1833** abolished SLAVERY itself throughout the Empire. The Abolition Act freed those already enslaved.":
    "Dwie daty, często mylone. **1807** zniósł HANDEL niewolnikami — przewóz i sprzedaż. **1833** zniósł samo NIEWOLNICTWO w całym imperium. Abolition Act uwolniła tych, którzy już byli zniewoleni.",
  "**William Wilberforce** led the parliamentary campaign against the trade, and the Quakers were prominent among the campaigners.":
    "**William Wilberforce** kierował parlamentarną kampanią przeciw temu handlowi, a wśród działaczy wyróżniali się kwakrzy.",
  "**Queen Victoria** reigned from **1837 to 1901** — 64 years, the second longest reign in British history. Britain was at the height of its industrial and imperial power. The **Great Exhibition of 1851** in the Crystal Palace displayed it to the world.":
    "**Królowa Wiktoria** panowała od **1837 do 1901** roku — 64 lata, drugie najdłuższe panowanie w historii Brytanii. Kraj był u szczytu potęgi przemysłowej i imperialnej. **Wielka Wystawa z 1851** roku w Crystal Palace pokazała to światu.",
  "The **Reform Act of 1832** began widening the vote, and further acts in 1867 and 1884 extended it — though at the end of Victoria's reign no woman could vote and many working men still could not. Laws limited working hours and child labour, and free primary schooling was introduced.":
    "**Reform Act z 1832** roku zapoczątkowała rozszerzanie prawa wyborczego, a kolejne ustawy z 1867 i 1884 roku poszły dalej — choć pod koniec panowania Wiktorii żadna kobieta nie mogła głosować, a wielu robotników wciąż nie. Ustawy ograniczyły czas pracy i pracę dzieci oraz wprowadzono bezpłatną szkołę podstawową.",
  "Bonnie Prince Charlie · James Watt · George Stephenson · Isambard Kingdom Brunel · William Wilberforce · Admiral Nelson · the Duke of Wellington · Queen Victoria · Florence Nightingale · Charles Darwin.":
    "Bonnie Prince Charlie · James Watt · George Stephenson · Isambard Kingdom Brunel · William Wilberforce · admirał Nelson · Duke of Wellington · królowa Wiktoria · Florence Nightingale · Charles Darwin.",
  "1707 Act of Union · 1746 Culloden · 1776 American independence · 1801 Union with Ireland · 1805 Trafalgar · 1807 slave trade abolished · 1815 Waterloo · 1832 Reform Act · 1833 slavery abolished · 1837–1901 Victoria · 1851 Great Exhibition · 1859 Origin of Species.":
    "1707 Act of Union · 1746 Culloden · 1776 niepodległość Ameryki · 1801 unia z Irlandią · 1805 Trafalgar · 1807 zniesienie handlu niewolnikami · 1815 Waterloo · 1832 Reform Act · 1833 zniesienie niewolnictwa · 1837–1901 Wiktoria · 1851 Wielka Wystawa · 1859 Origin of Species.",
  "Jacobites · Industrial Revolution · British Empire · abolition · Reform Act · Crystal Palace.":
    "Jakobici · rewolucja przemysłowa · British Empire · abolicja · Reform Act · Crystal Palace.",
  "In one line: 1807 ended the trade in people; 1833 ended slavery itself. Two dates, twenty-six years apart, and the test asks which is which.":
    "W jednym zdaniu: 1807 zakończył handel ludźmi; 1833 zakończył samo niewolnictwo. Dwie daty, dwadzieścia sześć lat od siebie, a test pyta, która jest która.",
  "Two world wars, votes for women, the founding of the NHS, the end of empire and the arrival of the Britain you live in now.":
    "Dwie wojny światowe, prawo wyborcze dla kobiet, powstanie NHS, koniec imperium i narodziny Brytanii, w której dziś mieszkasz.",
  "Britain entered the war in **1914** and it ended on **11 November 1918**. Around a million from Britain and its Empire were killed. That date is why **Remembrance Day** falls on 11 November and why poppies are worn.":
    "Brytania przystąpiła do wojny w **1914** roku, a zakończyła się ona **11 listopada 1918** roku. Zginęło około miliona ludzi z Brytanii i jej imperium. Z tej daty bierze się **Remembrance Day** 11 listopada i noszenie maków.",
  "The **suffragettes**, led by **Emmeline Pankhurst**, campaigned for the vote — with protests, hunger strikes and imprisonment.":
    "**Sufrażystki** pod wodzą **Emmeline Pankhurst** walczyły o prawo głosu — protestami, głodówkami i więzieniem.",
  "Two dates again. **1918**: women over 30 who met a property qualification got the vote. **1928**: women got the vote on the same terms as men, at 21. The gap of ten years is a favourite question.":
    "Znowu dwie daty. **1918**: prawo głosu otrzymały kobiety po trzydziestce spełniające wymóg majątkowy. **1928**: kobiety uzyskały je na tych samych zasadach co mężczyźni, od 21. roku życia. Dziesięcioletnia różnica to ulubione pytanie.",
  "Britain declared war on Germany in **1939** after the invasion of Poland. **Winston Churchill** became Prime Minister in 1940 and led the country through it.":
    "Brytania wypowiedziała Niemcom wojnę w **1939** roku po napaści na Polskę. **Winston Churchill** został premierem w 1940 roku i przeprowadził przez nią kraj.",
  "The war in Europe ended on **VE Day, 8 May 1945**; the war against Japan ended that August. **Alan Turing** and the codebreakers at **Bletchley Park** broke German ciphers and shortened the war.":
    "Wojna w Europie zakończyła się w **VE Day, 8 maja 1945** roku; wojna z Japonią w sierpniu tego samego roku. **Alan Turing** i kryptolodzy z **Bletchley Park** złamali niemieckie szyfry i skrócili wojnę.",
  "The **Beveridge Report of 1942** set out a plan to tackle what it called the five giants — want, disease, ignorance, squalor and idleness. After the war the Labour government built the **welfare state**, and in **1948 Aneurin Bevan** founded the **National Health Service**, free at the point of use.":
    "**Beveridge Report z 1942** roku przedstawił plan walki z tak zwanymi pięcioma olbrzymami — niedostatkiem, chorobą, niewiedzą, nędzą mieszkaniową i bezczynnością. Po wojnie rząd Labour zbudował **państwo opiekuńcze**, a w **1948 roku Aneurin Bevan** powołał **National Health Service**, bezpłatną w chwili korzystania.",
  "After 1945 the colonies became independent, one after another — this is **decolonisation**. **India and Pakistan in 1947** came first, then most of Africa and the Caribbean. Many of the new countries joined the **Commonwealth**, a voluntary association of independent states, now around 56 members. The monarch is its Head, but the Commonwealth has no power over its members.":
    "Po 1945 roku kolonie kolejno uzyskiwały niepodległość — to **dekolonizacja**. Najpierw **Indie i Pakistan w 1947** roku, potem większość Afryki i Karaibów. Wiele nowych państw przystąpiło do **Commonwealth**, dobrowolnego stowarzyszenia niepodległych krajów, dziś liczącego około 56 członków. Monarcha jest jego głową, ale Commonwealth nie ma władzy nad członkami.",
  "Britain invited workers from the Caribbean, India, Pakistan and elsewhere to help rebuild after the war — the ship **Empire Windrush** arrived in **1948** and gave its name to that generation. Later arrivals came from Uganda, Eastern Europe and around the world. Britain today is a diverse, multi-faith society.":
    "Brytania zaprosiła pracowników z Karaibów, Indii, Pakistanu i innych stron, by pomogli odbudować kraj po wojnie — statek **Empire Windrush** przypłynął w **1948** roku i dał nazwę temu pokoleniu. Później przyjeżdżali ludzie z Ugandy, Europy Wschodniej i całego świata. Dzisiejsza Brytania jest społeczeństwem różnorodnym i wielowyznaniowym.",
  "The UK joined the **European Economic Community in 1973**, which became the **European Union**. In a referendum in **June 2016** the UK voted to leave, and it formally left on **31 January 2020**.":
    "Wielka Brytania przystąpiła do **Europejskiej Wspólnoty Gospodarczej w 1973** roku, która stała się **Unią Europejską**. W referendum w **czerwcu 2016** roku kraj opowiedział się za wyjściem i formalnie opuścił Unię **31 stycznia 2020** roku.",
  "Other landmarks: **Margaret Thatcher** became the first woman Prime Minister in **1979**; the **Good Friday Agreement of 1998** brought peace to Northern Ireland; devolved parliaments opened in Scotland and Wales in **1999**; London hosted the **Olympic Games in 2012**; **Queen Elizabeth II** died in **2022** after 70 years, and **King Charles III** succeeded her.":
    "Inne kamienie milowe: **Margaret Thatcher** została pierwszą kobietą premierem w **1979** roku; **Good Friday Agreement z 1998** roku przyniosło pokój Irlandii Północnej; w **1999** roku otwarto parlamenty krajowe w Szkocji i Walii; Londyn gościł **igrzyska olimpijskie w 2012** roku; **królowa Elżbieta II** zmarła w **2022** roku po 70 latach panowania, a tron objął **król Karol III**.",
  "Emmeline Pankhurst · Winston Churchill · Clement Attlee · William Beveridge · Aneurin Bevan · Alan Turing · Margaret Thatcher · Elizabeth II · Charles III.":
    "Emmeline Pankhurst · Winston Churchill · Clement Attlee · William Beveridge · Aneurin Bevan · Alan Turing · Margaret Thatcher · Elżbieta II · Karol III.",
  "1914–1918 First World War · 1918 and 1928 votes for women · 1939–1945 Second World War · 1940 Battle of Britain · 6 June 1944 D-Day · 8 May 1945 VE Day · 1947 India and Pakistan · 1948 NHS and Windrush · 1973 joined EEC · 1979 Thatcher · 1998 Good Friday Agreement · 1999 devolution · 2012 Olympics · 2016 referendum · 31 January 2020 left the EU · 2022 Charles III.":
    "1914–1918 pierwsza wojna światowa · 1918 i 1928 prawo wyborcze dla kobiet · 1939–1945 druga wojna światowa · 1940 bitwa o Anglię · 6 czerwca 1944 D-Day · 8 maja 1945 VE Day · 1947 Indie i Pakistan · 1948 NHS i Windrush · 1973 wejście do EWG · 1979 Thatcher · 1998 Good Friday Agreement · 1999 devolution · 2012 igrzyska · 2016 referendum · 31 stycznia 2020 wyjście z UE · 2022 Karol III.",
  "Suffragettes · the Blitz · welfare state · NHS · Commonwealth · decolonisation · Brexit.":
    "Sufrażystki · The Blitz · państwo opiekuńcze · NHS · Commonwealth · dekolonizacja · brexit.",
  "In one line: 1918 gave the vote to women over 30 with property; 1928 made it equal at 21. Ten years apart, and a favourite question.":
    "W jednym zdaniu: 1918 dał prawo głosu kobietom po trzydziestce z majątkiem; 1928 zrównał je od 21. roku życia. Dziesięć lat różnicy i ulubione pytanie.",
  "Every date in the six history lessons, in one place and in order. Read this last, and then read it again the night before the test — most history questions are really date questions wearing a costume.":
    "Wszystkie daty z sześciu lekcji historii, w jednym miejscu i po kolei. Przeczytaj to na końcu, a potem jeszcze raz w noc przed testem — większość pytań z historii to w istocie pytania o daty w przebraniu.",
  "Why a timeline earns its own lesson: the test rarely asks what happened. It asks WHEN, or which of two similar events came first. Order is the thing worth drilling.":
    "Dlaczego oś czasu zasługuje na osobną lekcję: test rzadko pyta, co się stało. Pyta KIEDY albo które z dwóch podobnych wydarzeń było pierwsze. Warto ćwiczyć kolejność.",
  "Every name in the six history lessons appears here in date order rather than by topic.":
    "Wszystkie nazwiska z sześciu lekcji historii są tu ułożone chronologicznie, a nie tematycznie.",
  "The whole course in order: c. 2500 BC Stonehenge · 55 BC · AD 43 · AD 410 · 1066 · 1215 · 1314 · 1348 · 1485 · 1588 · 1649 · 1689 · 1707 · 1805 · 1833 · 1918 · 1928 · 1945 · 1948 · 2020 · 2022.":
    "Cały kurs po kolei: ok. 2500 p.n.e. Stonehenge · 55 p.n.e. · 43 n.e. · 410 n.e. · 1066 · 1215 · 1314 · 1348 · 1485 · 1588 · 1649 · 1689 · 1707 · 1805 · 1833 · 1918 · 1928 · 1945 · 1948 · 2020 · 2022.",
  "Chronology · century · BC and AD · reign · era.":
    "Chronologia · stulecie · p.n.e. i n.e. · panowanie · epoka.",
  "In one line: Most history questions are really date questions. Learn the order and the 'which came first' questions answer themselves.":
    "W jednym zdaniu: większość pytań z historii to pytania o daty. Naucz się kolejności, a pytania „co było pierwsze” odpowiedzą się same.",
  "The UK is a **constitutional monarchy**. The monarch is **Head of State**, but does not govern. Parliament makes the law and the Prime Minister runs the government. The monarch's role is formal, ceremonial and strictly non-political.":
    "Wielka Brytania jest **monarchią konstytucyjną**. Monarcha jest **Head of State**, ale nie rządzi. Prawo stanowi parlament, a rządem kieruje premier. Rola monarchy jest formalna, ceremonialna i ściśle apolityczna.",
  "The monarch must be politically neutral. They do not vote, do not express political opinions in public, and act on the advice of ministers. That neutrality is the whole point of the office.":
    "Monarcha musi być politycznie bezstronny. Nie głosuje, nie wypowiada publicznie opinii politycznych i działa za radą ministrów. Ta bezstronność jest istotą urzędu.",
  "The throne passes by **hereditary succession**. Since a change in the law in 2013, the eldest child inherits regardless of sex — an older sister is no longer passed over for a younger brother. A **coronation** is the ceremony that crowns a new monarch; it takes place at **Westminster Abbey** and is conducted by the **Archbishop of Canterbury**. The monarch succeeds immediately on the death of the previous one — the coronation comes later.":
    "Tron przechodzi w drodze **dziedziczenia**. Od zmiany prawa w 2013 roku dziedziczy najstarsze dziecko bez względu na płeć — starszej siostry nie pomija się już na rzecz młodszego brata. **Koronacja** to ceremonia ukoronowania nowego monarchy; odbywa się w **Westminster Abbey** i przewodniczy jej **Archbishop of Canterbury**. Monarcha obejmuje tron natychmiast po śmierci poprzednika — koronacja następuje później.",
  "**King Charles III** became monarch in **September 2022** on the death of his mother, **Queen Elizabeth II**, who had reigned for **70 years** — the longest in British history. The heir to the throne is **Prince William, Prince of Wales**. Members of the Royal Family carry out public duties and support charities.":
    "**Król Karol III** objął tron we **wrześniu 2022** roku po śmierci matki, **królowej Elżbiety II**, która panowała **70 lat** — najdłużej w historii Brytanii. Następcą tronu jest **książę William, Prince of Wales**. Członkowie rodziny królewskiej pełnią obowiązki publiczne i wspierają organizacje dobroczynne.",
  "Elizabeth II · Charles III · Prince William · the Archbishop of Canterbury.":
    "Elżbieta II · Karol III · książę William · Archbishop of Canterbury.",
  "Elizabeth II reigned 1952–2022, 70 years. Charles III from September 2022. Royal Assent last refused 1708. Succession law changed 2013.":
    "Elżbieta II panowała w latach 1952–2022, 70 lat. Karol III od września 2022 roku. Royal Assent odmówiono ostatni raz w 1708 roku. Prawo o sukcesji zmieniono w 2013 roku.",
  "Constitutional monarchy · Head of State · Royal Assent · State Opening of Parliament · coronation · hereditary succession · Head of the Commonwealth.":
    "Monarchia konstytucyjna · Head of State · Royal Assent · State Opening of Parliament · koronacja · dziedziczenie tronu · Head of the Commonwealth.",
  "In one line: The monarch reigns but does not govern, and must stay politically neutral. Royal Assent is a formality, not a veto.":
    "W jednym zdaniu: monarcha panuje, ale nie rządzi, i musi pozostać politycznie bezstronny. Royal Assent to formalność, a nie weto.",
  "Parliament sits at the **Palace of Westminster** in London. It has two chambers — the House of Commons and the House of Lords — and the monarch. Almost every test question about government comes down to knowing which of the two chambers does what.":
    "Parlament obraduje w **Palace of Westminster** w Londynie. Składa się z dwóch izb — House of Commons i House of Lords — oraz monarchy. Niemal każde pytanie testowe o ustrój sprowadza się do tego, która z izb czym się zajmuje.",
  "A **general election** must be held at least every **five years**. The UK is divided into **constituencies**, and each elects one MP by **first past the post** — whoever gets the most votes wins the seat.":
    "**Wybory powszechne** muszą odbywać się co najmniej raz na **pięć lat**. Kraj dzieli się na **constituencies**, a każdy z okręgów wybiera jednego MP w systemie **first past the post** — mandat zdobywa ten, kto uzyska najwięcej głosów.",
  "A proposal is a **bill**. It is debated and voted on in the Commons, then in the Lords, then returns to the Commons if the Lords amended it. Once both agree, it goes to the monarch for **Royal Assent** and becomes an **Act of Parliament**.":
    "Projekt nazywa się **bill**. Debatuje się nad nim i głosuje w Commons, potem w Lords, a jeśli Lords wprowadzą poprawki, wraca do Commons. Gdy obie izby się zgodzą, trafia do monarchy po **Royal Assent** i staje się **Act of Parliament**.",
  "**Councils** run local services — schools, refuse collection, housing, roads, libraries and planning. Councillors are elected, usually for four years, and councils are funded by **council tax** and by central government. Many areas also elect a **mayor**.":
    "**Councils** prowadzą usługi lokalne — szkoły, wywóz odpadów, mieszkalnictwo, drogi, biblioteki i planowanie przestrzenne. Radnych wybiera się zwykle na cztery lata, a rady finansuje **council tax** oraz rząd centralny. Wiele okolic wybiera także **burmistrza**.",
  "Why the civil service is separate: civil servants carry out government policy but are politically neutral and stay in post when the government changes. Ministers come and go; the machine does not.":
    "Dlaczego służba cywilna jest oddzielona: urzędnicy realizują politykę rządu, ale są bezstronni politycznie i pozostają na stanowiskach przy zmianie rządu. Ministrowie przychodzą i odchodzą; aparat państwa nie.",
  "The Prime Minister · the Chancellor of the Exchequer · the Home Secretary · the Speaker · the Leader of the Opposition.":
    "Premier · Chancellor of the Exchequer · Home Secretary · Speaker · Leader of the Opposition.",
  "650 MPs. General elections at least every 5 years. Voting age 18. Councillors usually elected for 4 years.":
    "650 MPs. Wybory powszechne co najmniej raz na 5 lat. Prawo głosu od 18 lat. Radnych wybiera się zwykle na 4 lata.",
  "House of Commons · House of Lords · constituency · first past the post · by-election · Cabinet · shadow cabinet · bill · Act of Parliament · civil service · council tax.":
    "House of Commons · House of Lords · constituency · first past the post · wybory uzupełniające · gabinet · gabinet cieni · bill · Act of Parliament · służba cywilna · council tax.",
  "In one line: The Commons is elected and holds the power; the Lords is appointed and can only revise and delay. That split answers most questions here.":
    "W jednym zdaniu: Commons pochodzi z wyborów i ma władzę; Lords jest powoływana i może jedynie poprawiać i opóźniać. Ten podział odpowiada na większość pytań z tej lekcji.",
  "**Devolution** means powers handed from the UK Parliament in Westminster to elected bodies in Scotland, Wales and Northern Ireland. It began after referendums in the late 1990s, and the three bodies first sat in **1999**.":
    "**Devolution** oznacza przekazanie kompetencji z UK Parliament w Westminsterze wybieralnym organom w Szkocji, Walii i Irlandii Północnej. Rozpoczęła się po referendach z końca lat 90., a trzy organy zebrały się po raz pierwszy w **1999** roku.",
  "Broadly the same list in each nation: **health, education, housing, transport, policing (in Scotland and Northern Ireland), the environment, agriculture** and local government. This is why the NHS, schools and university fees genuinely differ between the four nations.":
    "W każdym kraju mniej więcej ta sama lista: **zdrowie, edukacja, mieszkalnictwo, transport, policja (w Szkocji i Irlandii Północnej), środowisko, rolnictwo** oraz samorząd lokalny. Dlatego NHS, szkoły i czesne rzeczywiście różnią się między czterema krajami.",
  "Westminster keeps the matters that must be decided for the whole country — these are called **reserved matters**: **defence, foreign policy, immigration and nationality, the currency, most taxation, and national security**.":
    "Westminster zachowuje sprawy, które trzeba rozstrzygać dla całego kraju — nazywa się je **reserved matters**: **obrona, polityka zagraniczna, imigracja i obywatelstwo, waluta, większość podatków oraz bezpieczeństwo narodowe**.",
  "England has no devolved parliament of its own. English matters are decided by the UK Parliament, which is why the two are easy to confuse.":
    "Anglia nie ma własnego parlamentu krajowego. O sprawach angielskich decyduje UK Parliament i dlatego łatwo te dwa pojęcia pomylić.",
  "Holyrood · the Senedd · Stormont.": "Holyrood · Senedd · Stormont.",
  "Referendums 1997. All three bodies first sat in 1999. Good Friday Agreement 1998. Senedd renamed 2020.":
    "Referenda w 1997 roku. Wszystkie trzy organy zebrały się po raz pierwszy w 1999 roku. Good Friday Agreement w 1998 roku. Zmiana nazwy na Senedd w 2020 roku.",
  "Devolution · devolved matter · reserved matter · MSP · MS · MLA · power sharing.":
    "Devolution · sprawa przekazana · sprawa zastrzeżona · MSP · MS · MLA · podział władzy.",
  "In one line: Health, education and housing are devolved; defence, foreign policy, immigration and the currency are reserved to Westminster. England has no devolved parliament.":
    "W jednym zdaniu: zdrowie, edukacja i mieszkalnictwo są przekazane; obrona, polityka zagraniczna, imigracja i waluta są zastrzeżone dla Westminsteru. Anglia nie ma własnego parlamentu krajowego.",
  "The **rule of law** means everyone is subject to the law — including the government, the police and the monarch's ministers. Judges are independent of government, and no one may be punished except by a court.":
    "**Rządy prawa** oznaczają, że prawu podlegają wszyscy — także rząd, policja i ministrowie monarchy. Sędziowie są niezależni od rządu, a nikogo nie wolno ukarać inaczej niż wyrokiem sądu.",
  "If you are on the electoral register and aged **18 to 70**, you may be summoned for **jury service**. It is a duty, not a request — you must attend unless you are excused. A jury decides the facts: whether the accused is guilty or not guilty. The judge decides the law and the sentence.":
    "Jeśli figurujesz w electoral register i masz **od 18 do 70 lat**, możesz zostać wezwany do **ławy przysięgłych**. To obowiązek, a nie prośba — musisz się stawić, o ile nie zostaniesz zwolniony. Ława rozstrzyga o faktach: czy oskarżony jest winny, czy nie. Sędzia rozstrzyga o prawie i wymierza karę.",
  "**Legal aid** is public funding that pays for legal advice or representation for people who cannot afford it. It exists so that the right to a fair trial is real rather than theoretical.":
    "**Legal aid** to finansowanie ze środków publicznych porad prawnych lub reprezentacji dla osób, których na to nie stać. Istnieje po to, by prawo do rzetelnego procesu było realne, a nie teoretyczne.",
  "Why juries are drawn at random: a jury of ordinary people, chosen by lot rather than appointed, is what stops the state deciding guilt on its own. That is the rule of law in practice.":
    "Dlaczego ławę losuje się przypadkowo: ława złożona ze zwykłych ludzi, wybranych losem, a nie powołanych, jest tym, co powstrzymuje państwo przed samodzielnym orzekaniem o winie. To rządy prawa w praktyce.",
  "Magistrates · judges · solicitors · barristers · the Supreme Court.":
    "Magistrates · sędziowie · solicitors · barristers · Supreme Court.",
  "Jury of 12 in England, Wales and Northern Ireland; 15 in Scotland. Jury service 18–70. Supreme Court took over from the Lords in 2009. Age of criminal responsibility 12 in Scotland, 10 elsewhere.":
    "Ława 12-osobowa w Anglii, Walii i Irlandii Północnej; 15-osobowa w Szkocji. Służba w ławie od 18 do 70 lat. Supreme Court przejął rolę Lords w 2009 roku. Wiek odpowiedzialności karnej: 12 lat w Szkocji, 10 gdzie indziej.",
  "Rule of law · criminal law · civil law · Magistrates' Court · Crown Court · County Court · legal aid · jury service.":
    "Rządy prawa · prawo karne · prawo cywilne · Magistrates' Court · Crown Court · County Court · legal aid · służba w ławie przysięgłych.",
  "In one line: The jury decides the facts, the judge decides the law and the sentence — and everyone, including the government, is subject to both.":
    "W jednym zdaniu: ława rozstrzyga o faktach, sędzia o prawie i karze — a wszyscy, łącznie z rządem, podlegają jednemu i drugiemu.",
  "Lesson 1 introduced the values. This one is the practical side: what you are entitled to, and what is expected of you in return.":
    "Lekcja pierwsza przedstawiła wartości. Ta jest ich praktyczną stroną: co ci przysługuje i czego w zamian się od ciebie oczekuje.",
  "Most people pay income tax through **PAYE** — deducted by an employer before wages are paid. The self-employed complete a **Self Assessment** tax return each year. Tax funds the NHS, schools, roads, defence and the police. **HM Revenue and Customs (HMRC)** collects it.":
    "Większość ludzi płaci podatek dochodowy przez **PAYE** — pracodawca potrąca go przed wypłatą. Osoby samozatrudnione co roku składają zeznanie **Self Assessment**. Podatki finansują NHS, szkoły, drogi, obronę i policję. Pobiera je **HM Revenue and Customs (HMRC)**.",
  "Volunteering, joining a school governing body, helping a charity, standing as a councillor, or simply voting — participation is treated as part of citizenship rather than an optional extra.":
    "Wolontariat, wejście do rady szkoły, pomoc organizacji dobroczynnej, kandydowanie na radnego albo po prostu głosowanie — uczestnictwo traktuje się jako część obywatelstwa, a nie dodatek.",
  // The name stays, as everywhere else; the gloss is what Polish adds — and it
  // is also what keeps this from reading as a paste that was never translated.
  "HM Revenue and Customs (HMRC).": "HM Revenue and Customs (HMRC) — brytyjski urząd skarbowy.",
  "Vote at 18. Jury service 18–70. Human Rights Act 1998. Equality Act 2010.":
    "Prawo głosu od 18 lat. Służba w ławie przysięgłych od 18 do 70 lat. Human Rights Act 1998. Equality Act 2010.",
  "PAYE · Self Assessment · National Insurance · income tax · secret ballot · human rights · protected characteristics.":
    "PAYE · Self Assessment · National Insurance · podatek dochodowy · głosowanie tajne · prawa człowieka · cechy chronione.",
  "In one line: Every right carries a duty: the vote and the electoral register, the NHS and your taxes, a fair trial and jury service.":
    "W jednym zdaniu: każdemu prawu odpowiada obowiązek — głos i electoral register, NHS i twoje podatki, rzetelny proces i służba w ławie przysięgłych.",
  "The UK is a diverse society of around **67 million** people. England is much the largest of the four nations. Roughly a fifth of people belong to a minority ethnic group, and the largest cities are the most diverse.":
    "Wielka Brytania to zróżnicowane społeczeństwo liczące około **67 milionów** osób. Anglia jest zdecydowanie największym z czterech krajów. Mniej więcej jedna piąta mieszkańców należy do mniejszości etnicznych, a największe miasta są najbardziej różnorodne.",
  "Most households are small. Both parents commonly work, and children usually leave home in their late teens or twenties. Older relatives often live independently rather than with their children.":
    "Gospodarstwa domowe są zwykle małe. Zazwyczaj pracuje oboje rodziców, a dzieci wyprowadzają się pod koniec nastoletnich lat albo po dwudziestce. Starsi krewni często mieszkają samodzielnie, a nie z dziećmi.",
  "Volunteering is widespread and highly regarded — charity shops, food banks, sports clubs, school governors, the National Trust, hospital and mountain rescue volunteers. Charities are a large part of British life, and giving time is seen as valuable as giving money.":
    "Wolontariat jest powszechny i wysoko ceniony — sklepy charytatywne, banki żywności, kluby sportowe, rady szkół, National Trust, wolontariusze w szpitalach i w ratownictwie górskim. Organizacje dobroczynne stanowią dużą część brytyjskiego życia, a poświęcony czas ceni się tak samo jak pieniądze.",
  "Queuing, punctuality, saying please and thank you, and apologising readily are all noticed. Politeness matters more than formality, and small talk about the weather is genuinely a social convention rather than a joke about one.":
    "Stanie w kolejce, punktualność, mówienie „proszę” i „dziękuję” oraz łatwe przepraszanie — wszystko to jest zauważane. Uprzejmość liczy się bardziej niż formalność, a rozmowa o pogodzie to naprawdę konwencja towarzyska, a nie żart o niej.",
  "No names to memorise — this lesson is about how people live rather than who they were.":
    "Nie ma tu nazwisk do zapamiętania — ta lekcja dotyczy tego, jak ludzie żyją, a nie kim byli.",
  "Population around 67 million. Same-sex marriage 2014 in England, Wales and Scotland; 2020 in Northern Ireland. Marriage age raised to 18 in England and Wales in 2023.":
    "Ludność około 67 milionów. Małżeństwa jednopłciowe od 2014 roku w Anglii, Walii i Szkocji; od 2020 roku w Irlandii Północnej. Wiek zawarcia małżeństwa podniesiony do 18 lat w Anglii i Walii w 2023 roku.",
  "Civil partnership · forced marriage · arranged marriage · volunteering · community · diversity.":
    "Civil partnership · małżeństwo przymusowe · małżeństwo zaaranżowane · wolontariat · wspólnota · różnorodność.",
  "In one line: An arranged marriage both people freely accept is lawful. A forced marriage is a crime. Consent is the whole distinction.":
    "W jednym zdaniu: zaaranżowane małżeństwo, na które obie osoby zgadzają się dobrowolnie, jest zgodne z prawem. Małżeństwo przymusowe to przestępstwo. Cała różnica tkwi w zgodzie.",
  "The UK is historically Christian but is now a multi-faith society, and a large and growing share of people report no religion at all. **Freedom of religion** is a legal right: you may practise any faith or none, and change your faith.":
    "Wielka Brytania jest historycznie chrześcijańska, ale dziś to społeczeństwo wielowyznaniowe, a duża i rosnąca część mieszkańców deklaruje brak religii. **Wolność wyznania** jest prawem: możesz praktykować dowolną wiarę lub żadnej i możesz ją zmienić.",
  "Religious tolerance is one of the fundamental values. It protects believers of every faith **and** those with none, and it is unlawful to discriminate against someone for their religion or belief. Places of worship for all major faiths are found across the UK.":
    "Tolerancja religijna należy do podstawowych wartości. Chroni wyznawców każdej wiary **oraz** osoby niewierzące, a dyskryminacja ze względu na religię lub przekonania jest niezgodna z prawem. Miejsca kultu wszystkich głównych wyznań znajdują się w całym kraju.",
  "The Archbishop of Canterbury · Guru Nanak · the Church of England · the Church of Scotland.":
    "Archbishop of Canterbury · Guru Nanak · Church of England · Church of Scotland.",
  "Church of England established since Henry VIII's break with Rome in the 1530s.":
    "Church of England jest kościołem państwowym od zerwania Henryka VIII z Rzymem w latach 30. XVI wieku.",
  "Established church · Supreme Governor · Anglican · Presbyterian · religious tolerance · freedom of belief.":
    "Kościół państwowy · Supreme Governor · anglikański · prezbiteriański · tolerancja religijna · wolność przekonań.",
  "In one line: England has an established church with the monarch at its head; Scotland's is Presbyterian; Wales and Northern Ireland have none.":
    "W jednym zdaniu: Anglia ma kościół państwowy z monarchą na czele; szkocki jest prezbiteriański; Walia i Irlandia Północna nie mają żadnego.",
  "Some of these are public holidays, some are simply widely marked. The test asks which is which, and it asks dates — so learn the date alongside the name.":
    "Część z nich to dni wolne od pracy, część jest po prostu szeroko obchodzona. Test pyta, co jest czym, i pyta o daty — ucz się więc daty razem z nazwą.",
  "**St David's Day, 1 March** (Wales); **St Patrick's Day, 17 March** (Northern Ireland); **St George's Day, 23 April** (England); **St Andrew's Day, 30 November** (Scotland). Only St Patrick's Day in Northern Ireland and St Andrew's Day in Scotland are public holidays.":
    "**St David's Day, 1 marca** (Walia); **St Patrick's Day, 17 marca** (Irlandia Północna); **St George's Day, 23 kwietnia** (Anglia); **St Andrew's Day, 30 listopada** (Szkocja). Dniami wolnymi od pracy są wyłącznie St Patrick's Day w Irlandii Północnej i St Andrew's Day w Szkocji.",
  "**Bank holidays** are public holidays when most businesses close. They differ between the four nations — Scotland and Northern Ireland each have days the others do not. Besides Christmas and Easter there are holidays in early May, late May and August.":
    "**Bank holidays** to dni wolne od pracy, gdy większość firm jest zamknięta. Różnią się między czterema krajami — Szkocja i Irlandia Północna mają dni, których nie mają pozostałe. Poza Bożym Narodzeniem i Wielkanocą wolne przypada na początku maja, pod koniec maja i w sierpniu.",
  "Guy Fawkes · Robert Burns · the four patron saints.":
    "Guy Fawkes · Robert Burns · czterej święci patroni.",
  "1 January · 25 January Burns Night · 1 March · 17 March · 23 April · 31 October · 5 November · 11 November · 30 November · 25 and 26 December. Gunpowder Plot 1605. Armistice 1918.":
    "1 stycznia · 25 stycznia Burns Night · 1 marca · 17 marca · 23 kwietnia · 31 października · 5 listopada · 11 listopada · 30 listopada · 25 i 26 grudnia. Spisek prochowy 1605. Rozejm 1918.",
  "Bank holiday · Hogmanay · Shrove Tuesday · Remembrance · Boxing Day.":
    "Bank holiday · Hogmanay · Shrove Tuesday · Remembrance · Boxing Day.",
  "In one line: Only St Patrick's Day in Northern Ireland and St Andrew's Day in Scotland are public holidays. The other two saints' days are not.":
    "W jednym zdaniu: dniami wolnymi są tylko St Patrick's Day w Irlandii Północnej i St Andrew's Day w Szkocji. Pozostałe dwa dni świętych nie są.",
  "Britain invented or codified a remarkable number of the world's sports, and the test asks about the events as much as the games — which tournament is played where.":
    "Brytania wymyśliła lub skodyfikowała zadziwiająco wiele światowych sportów, a test pyta o imprezy równie często jak o dyscypliny — który turniej rozgrywa się gdzie.",
  "Gardening, walking, going to the pub, watching television and following a team are all common. The **National Trust** cares for historic houses, gardens and coastline, and public footpaths give a legal right of way across much of the countryside.":
    "Powszechne są ogrodnictwo, spacery, wyjścia do pubu, oglądanie telewizji i kibicowanie drużynie. **National Trust** opiekuje się zabytkowymi domami, ogrodami i wybrzeżem, a publiczne ścieżki dają prawo przejścia przez znaczną część wsi.",
  "Wimbledon · Lord's · St Andrews · Aintree · Ascot · the National Trust.":
    "Wimbledon · Lord's · St Andrews · Aintree · Ascot · National Trust.",
  "London hosted the Olympics in 1908, 1948 and 2012. Commonwealth Games every four years.":
    "Londyn gościł igrzyska w 1908, 1948 i 2012 roku. Commonwealth Games co cztery lata.",
  "The Ashes · Six Nations · FA Cup · Grand National · rugby union and rugby league · Paralympics.":
    "The Ashes · Six Nations · FA Cup · Grand National · rugby union i rugby league · paraolimpiada.",
  "In one line: Golf is Scottish, cricket and rugby are English, and at the Commonwealth Games the four nations compete separately rather than as one team.":
    "W jednym zdaniu: golf jest szkocki, krykiet i rugby angielskie, a na Commonwealth Games cztery kraje startują osobno, a nie jako jedna drużyna.",
  "Names and one fact each. The test does not expect you to have read the books — it expects you to know who wrote what, and which nation claims them.":
    "Nazwiska i po jednym fakcie. Test nie oczekuje, że przeczytałeś te książki — oczekuje, że wiesz, kto co napisał i który kraj się do niego przyznaje.",
  "**The Beatles** — John Lennon, Paul McCartney, George Harrison and Ringo Starr — came from **Liverpool** and are the most successful British band ever. Also from Britain: the Rolling Stones, Queen, David Bowie, Elton John and Adele.":
    "**The Beatles** — John Lennon, Paul McCartney, George Harrison i Ringo Starr — pochodzili z **Liverpoolu** i są najbardziej znanym brytyjskim zespołem w historii. Z Brytanii pochodzą także the Rolling Stones, Queen, David Bowie, Elton John i Adele.",
  "In classical music, **Henry Purcell**, **Edward Elgar**, **Gustav Holst**, **Ralph Vaughan Williams** and **Benjamin Britten**. The **Proms** — a summer season of concerts at the Royal Albert Hall, ending with the Last Night — has run since 1895.":
    "W muzyce klasycznej **Henry Purcell**, **Edward Elgar**, **Gustav Holst**, **Ralph Vaughan Williams** i **Benjamin Britten**. **The Proms** — letni cykl koncertów w Royal Albert Hall, kończony Last Night — odbywa się od 1895 roku.",
  "Chaucer · Shakespeare · Jane Austen · Charles Dickens · Robert Burns · Turner · Constable · Gainsborough · Henry Moore · The Beatles · Elgar.":
    "Chaucer · Shakespeare · Jane Austen · Charles Dickens · Robert Burns · Turner · Constable · Gainsborough · Henry Moore · The Beatles · Elgar.",
  "Shakespeare 1564–1616. British Museum founded 1753. The Proms since 1895. Burns Night 25 January.":
    "Shakespeare 1564–1616. British Museum założone w 1753 roku. The Proms od 1895 roku. Burns Night 25 stycznia.",
  "The Globe Theatre · the Turner Prize · the National Gallery · the British Museum · the Last Night of the Proms.":
    "Globe Theatre · Turner Prize · National Gallery · British Museum · Last Night of the Proms.",
  "In one line: One name, one fact. Chaucer came before Shakespeare, Burns is Scotland's poet, and The Beatles came from Liverpool.":
    "W jednym zdaniu: jedno nazwisko, jeden fakt. Chaucer był przed Shakespeare'em, Burns jest poetą Szkocji, a The Beatles pochodzili z Liverpoolu.",
  "British science shows up repeatedly in the test, usually as one name attached to one discovery. Learn the pairs.":
    "Brytyjska nauka wraca w teście wielokrotnie, zwykle jako jedno nazwisko przypisane do jednego odkrycia. Ucz się par.",
  "**Alan Turing** laid the foundations of computer science and broke German codes at Bletchley Park. The first successful **IVF** birth took place in England in 1978. The **Royal Society**, founded in the 1660s, is the oldest scientific institution still in existence. **Dolly the sheep**, the first cloned mammal, was created in Scotland in 1996.":
    "**Alan Turing** położył podwaliny informatyki i łamał niemieckie szyfry w Bletchley Park. Pierwsze udane narodziny z **in vitro** miały miejsce w Anglii w 1978 roku. **Royal Society**, założone w latach 60. XVII wieku, to najstarsza istniejąca instytucja naukowa. **Owca Dolly**, pierwszy sklonowany ssak, powstała w Szkocji w 1996 roku.",
  "Isaac Newton · Charles Darwin · Alexander Fleming · Michael Faraday · Ernest Rutherford · Rosalind Franklin · James Watt · George Stephenson · Brunel · Alexander Graham Bell · John Logie Baird · Alan Turing · Tim Berners-Lee.":
    "Isaac Newton · Charles Darwin · Alexander Fleming · Michael Faraday · Ernest Rutherford · Rosalind Franklin · James Watt · George Stephenson · Brunel · Alexander Graham Bell · John Logie Baird · Alan Turing · Tim Berners-Lee.",
  "Origin of Species 1859 · penicillin 1928 · first IVF birth 1978 · World Wide Web 1989 · Dolly the sheep 1996. Royal Society founded in the 1660s.":
    "Origin of Species 1859 · penicylina 1928 · pierwsze narodziny z in vitro 1978 · World Wide Web 1989 · owca Dolly 1996. Royal Society założone w latach 60. XVII wieku.",
  "Natural selection · antibiotic · electromagnetic induction · DNA · the World Wide Web · cloning.":
    "Dobór naturalny · antybiotyk · indukcja elektromagnetyczna · DNA · World Wide Web · klonowanie.",
  "In one line: Learn these as pairs — one person, one discovery. That is exactly how the test asks about them.":
    "W jednym zdaniu: ucz się ich parami — jedna osoba, jedno odkrycie. Dokładnie tak pyta o nie test.",
  "One place to revise every name in the course, sorted by what they are known for. If a name here is unfamiliar, go back to the lesson it came from.":
    "Jedno miejsce, by powtórzyć wszystkie nazwiska z kursu, uporządkowane według tego, z czego są znane. Jeśli któreś jest ci obce, wróć do lekcji, z której pochodzi.",
  "**Admiral Nelson** at Trafalgar in 1805, the **Duke of Wellington** at Waterloo in 1815, **Boudicca** against the Romans, **William Wallace** and **Robert the Bruce** for Scotland, and **Captain James Cook**, whose voyages mapped much of the Pacific.":
    "**Admirał Nelson** pod Trafalgarem w 1805 roku, **Duke of Wellington** pod Waterloo w 1815 roku, **Boudika** przeciw Rzymianom, **William Wallace** i **Robert Bruce** dla Szkocji oraz **kapitan James Cook**, którego wyprawy pozwoliły opisać znaczną część Pacyfiku.",
  "Every name in the course, grouped by what they are known for — monarchs, politicians, scientists, writers, artists and reformers.":
    "Wszystkie nazwiska z kursu, pogrupowane według tego, z czego są znane — monarchowie, politycy, naukowcy, pisarze, artyści i reformatorzy.",
  "The dates belong to the lessons these people came from; this one is for matching the person to the achievement.":
    "Daty należą do lekcji, z których pochodzą te osoby; ta lekcja służy dopasowaniu osoby do osiągnięcia.",
  "Monarch · Prime Minister · reformer · abolitionist · suffragette · engineer · physicist.":
    "Monarcha · premier · reformator · abolicjonista · sufrażystka · inżynier · fizyk.",
  "In one line: If a name here is unfamiliar, go back to the lesson it came from rather than trying to learn it in isolation.":
    "W jednym zdaniu: jeśli któreś nazwisko jest ci obce, wróć do lekcji, z której pochodzi, zamiast uczyć się go w oderwaniu.",
  "Two things you will use, and two things the test asks about in practical terms: how school works, and how to get medical help.":
    "Dwie rzeczy, z których będziesz korzystać, i dwie, o które test pyta praktycznie: jak działa szkoła i jak uzyskać pomoc medyczną.",
  "Education is **compulsory** for children aged **5 to 16** (4 to 16 in Northern Ireland). In England, young people must stay in education or training until 18. State schooling is free.":
    "Nauka jest **obowiązkowa** dla dzieci od **5 do 16 lat** (od 4 do 16 w Irlandii Północnej). W Anglii młodzi ludzie muszą pozostać w edukacji lub szkoleniu do 18. roku życia. Szkoła państwowa jest bezpłatna.",
  "Parents must make sure their children attend. Schools have **governing bodies** that parents can join, and there is a national curriculum in England.":
    "Rodzice muszą dopilnować, by dzieci uczęszczały do szkoły. Szkoły mają **rady** (governing bodies), do których rodzice mogą wejść, a w Anglii obowiązuje podstawa programowa.",
  "The **National Health Service** was founded in **1948** by **Aneurin Bevan**. Its principle is care **free at the point of use**, paid for through taxation, based on need rather than ability to pay.":
    "**National Health Service** powstała w **1948** roku, założona przez **Aneurina Bevana**. Jej zasadą jest opieka **bezpłatna w chwili korzystania**, finansowana z podatków, udzielana według potrzeby, a nie zamożności.",
  "Dial **999** or **112** for police, ambulance, fire or coastguard. Both numbers are free from any phone. For urgent but non-life-threatening medical help call **111**; for non-emergency police matters call **101**.":
    "Wybierz **999** lub **112**, by wezwać policję, pogotowie, straż pożarną lub straż przybrzeżną. Oba numery są bezpłatne z każdego telefonu. Po pilną, ale niezagrażającą życiu pomoc medyczną dzwoń pod **111**; w sprawach policyjnych niebędących nagłymi pod **101**.",
  "999 is for emergencies only — a life at risk, a serious injury, a crime in progress or a fire. Misusing it is an offence, and 111 exists for everything urgent that is not an emergency.":
    "999 służy wyłącznie do nagłych wypadków — zagrożenie życia, poważny uraz, przestępstwo w toku lub pożar. Nadużywanie tego numeru jest wykroczeniem, a 111 istnieje po to, co pilne, ale nie jest nagłym wypadkiem.",
  "Aneurin Bevan · your GP · Oxford and Cambridge.":
    "Aneurin Bevan · twój GP · Oxford i Cambridge.",
  "School compulsory 5–16 (4–16 in Northern Ireland); education or training to 18 in England. NHS founded 1948. Emergency 999 or 112; urgent advice 111; non-emergency police 101.":
    "Obowiązek szkolny od 5 do 16 lat (od 4 do 16 w Irlandii Północnej); edukacja lub szkolenie do 18 lat w Anglii. NHS założona w 1948 roku. Nagłe wypadki 999 lub 112; pilna porada 111; policja w sprawach niepilnych 101.",
  "GCSE · A level · Highers · National Qualifications · further education · higher education · GP · free at the point of use · prescription charge.":
    "GCSE · A level · Highers · National Qualifications · kształcenie ponadobowiązkowe · szkolnictwo wyższe · GP · bezpłatne w chwili korzystania · opłata za receptę.",
  "In one line: 999 is for emergencies only and misusing it is an offence. 111 is the number for everything urgent that is not one.":
    "W jednym zdaniu: 999 służy tylko do nagłych wypadków, a nadużywanie go jest wykroczeniem. 111 to numer do wszystkiego, co pilne, ale nagłym wypadkiem nie jest.",
  "Ben Nevis · Snowdon (Yr Wyddfa) · Scafell Pike · Slieve Donard · Severn · Thames · Lough Neagh · Loch Lomond · Windermere.":
    "Ben Nevis · Snowdon (Yr Wyddfa) · Scafell Pike · Slieve Donard · Severn · Tamiza · Lough Neagh · Loch Lomond · Windermere.",
  "Channel Tunnel opened 1994. 15 National Parks. Northern Ireland has 6 counties.":
    "Channel Tunnel otwarty w 1994 roku. 15 parków narodowych. Irlandia Północna liczy 6 hrabstw.",
  "United Kingdom vs Great Britain · Crown Dependency · county · region · saltire · devolved capital.":
    "United Kingdom a Great Britain · Crown Dependency · hrabstwo · region · saltire · stolica kraju z własnym parlamentem.",
  "St David · St Patrick · St George · St Andrew · Y Ddraig Goch (the Red Dragon).":
    "St David · St Patrick · St George · St Andrew · Y Ddraig Goch (Czerwony Smok).",
  "St David 1 March · St Patrick 17 March · St George 23 April · St Andrew 30 November. First Union Flag 1606.":
    "St David 1 marca · St Patrick 17 marca · St George 23 kwietnia · St Andrew 30 listopada. Pierwsza Union Flag w 1606 roku.",
  "Union Flag / Union Jack · saltire · patron saint · Tudor rose · thistle · daffodil · leek · shamrock.":
    "Union Flag / Union Jack · saltire · święty patron · róża Tudorów · oset · żonkil · por · koniczyna.",
  "Julius Caesar · Claudius · Hadrian · Boudicca · Alfred the Great · St Augustine · St Columba · William of Normandy.":
    "Juliusz Cezar · Klaudiusz · Hadrian · Boudika · Alfred Wielki · St Augustine · St Columba · Wilhelm z Normandii.",
  "55 BC Caesar fails · AD 43 Claudius invades · AD 122 Hadrian's Wall · AD 410 Romans leave · AD 789 first Viking raids · 1066 Hastings.":
    "55 p.n.e. niepowodzenie Cezara · 43 n.e. inwazja Klaudiusza · 122 n.e. Hadrian's Wall · 410 n.e. odejście Rzymian · 789 n.e. pierwsze najazdy wikingów · 1066 Hastings.",
  "Celts · Danelaw · Anglo-Saxons · Iceni · Picts · Norman Conquest.":
    "Celtowie · Danelaw · Anglosasi · Icenowie · Piktowie · podbój normański.",
  "British society rests on a short list of shared values. They are not decoration: they are what the law, the courts and everyday expectations are built on, and understanding them explains a great deal of what follows in this course.":
    "Brytyjskie społeczeństwo opiera się na krótkiej liście wspólnych wartości. Nie są ozdobą: na nich zbudowane są prawo, sądy i codzienne oczekiwania, a ich zrozumienie tłumaczy bardzo wiele z dalszej części kursu.",
  "Equality Act 2010 — the law that sets out the nine protected characteristics. Human Rights Act 1998.":
    "Equality Act 2010 — ustawa określająca dziewięć cech chronionych. Human Rights Act 1998.",
  "Rule of law · individual liberty · tolerance · protected characteristics · discrimination · rights and responsibilities.":
    "Rządy prawa · wolność osobista · tolerancja · cechy chronione · dyskryminacja · prawa i obowiązki.",
  "In one line: The values are a list you may be asked to complete or spot a gap in, and every right on it has a matching duty.":
    "W jednym zdaniu: wartości to lista, którą możesz mieć uzupełnić albo wskazać w niej brak, a każdemu prawu na niej odpowiada obowiązek.",
  "Now answer these": "Teraz odpowiedz na te pytania",
};
