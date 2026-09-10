/**
 * English for the Zycie w Polsce practice questions.
 *
 * The lesson cards are answered by ZYCIE_W_POLSCE_EN. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in English then asked its questions
 * in Polish.
 *
 * Keyed on the POLISH source text exactly as it appears in plQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an l for
 * an ł or a straight quotation mark where the sentence has „ and ”, and the
 * lookup misses in silence. The question renders in Polish, the tap works,
 * and nothing anywhere reports it.
 *
 * WHAT STAYS POLISH follows ZYCIE_W_POLSCE_EN exactly, because a reader meets
 * the lesson and its questions one after the other and a word glossed two
 * ways between them teaches nothing:
 *
 *   - the word that IS the answer and that English has nothing short for
 *     keeps its own name, with the meaning beside it: Sejm, Senat, gmina,
 *     powiat, Marszałek, sołectwo, wójt, Solidarność, ZUS, NFZ, KRUS, REGON,
 *     PESEL, NIP, matura, liceum, technikum;
 *   - what English does name takes its English name: the Trybunał
 *     Konstytucyjny is the Constitutional Tribunal, the Rzecznik Praw
 *     Obywatelskich the Commissioner for Human Rights, a województwo a
 *     voivodeship and a wojewoda a voivode;
 *   - the European regulation Polish calls RODO is the GDPR in English, and
 *     the lesson calls it that too.
 *
 * British spelling throughout, the same as the rest of the English catalogue:
 * offence, recognise, programme, defence, labour.
 *
 * Ninety of the bank's strings are not here and that is correct: they are
 * years, bare numbers and short answers that ZYCIE_W_POLSCE_EN already
 * answers. Every English table is spread into one object, so a key present in
 * two of them would lose one silently — the later spread would decide both.
 * check-en-bank-translation measures coverage through translateCourseText,
 * the lookup a reader's tap actually goes through, so those count as answered
 * and are not duplicated here.
 */
export const PL_QUESTION_BANK_EN: Record<string, string> = {
  "Co przedstawia godło Rzeczypospolitej Polskiej?":
    "What does the coat of arms of the Republic of Poland show?",
  "Białego orła w złotej koronie na czerwonym tle":
    "A white eagle with a golden crown on a red field",
  "Czarnego orła na złotym tle": "A black eagle on a golden field",
  "Białego orła bez korony na niebieskim tle": "A white eagle without a crown on a blue field",
  "Złotego lwa na czerwonym tle": "A golden lion on a red field",
  "Orzeł biały w złotej koronie, na czerwonym polu — opisuje go artykuł 28 Konstytucji.":
    "A white eagle with a golden crown on a red field — Article 28 of the Constitution describes it.",
  "Kiedy obchodzi się Dzień Flagi Rzeczypospolitej Polskiej?":
    "When is Flag Day of the Republic of Poland?",
  "1 maja": "1 May",
  "2 maja": "2 May",
  "2 maja, między Świętem Pracy a Świętem Konstytucji 3 Maja.":
    "2 May, between Labour Day and the Constitution Day of 3 May.",
  "W którym roku orzeł w godle odzyskał koronę?":
    "In which year did the eagle in the coat of arms get its crown back?",
  "W 1990 roku. W czasach PRL orzeł korony nie miał; 1918 to odzyskanie niepodległości, 1997 to Konstytucja.":
    "In 1990. Under the People's Republic the eagle had no crown; 1918 is the regaining of independence and 1997 the Constitution.",
  "Który akt prawny jest w Polsce najwyższy?": "Which legal act stands highest in Poland?",
  "Ustawa sejmowa": "A statute of the Sejm",
  "Rozporządzenie ministra": "A minister's regulation",
  "Uchwała rady gminy": "A resolution of a gmina council",
  "Konstytucja. Żadna ustawa ani rozporządzenie nie może być z nią sprzeczne.":
    "The Constitution. No statute or regulation may contradict it.",
  "W jakim trybie przyjęto obowiązującą Konstytucję RP?":
    "How was the Constitution now in force adopted?",
  "Uchwalona przez Sejm i zatwierdzona w referendum":
    "Passed by the Sejm and confirmed by referendum",
  "Nadana przez Prezydenta": "Granted by the President",
  "Uchwalona wyłącznie przez Senat": "Passed by the Senat alone",
  "Przyjęta rozporządzeniem Rady Ministrów": "Adopted by a regulation of the Council of Ministers",
  "Zgromadzenie Narodowe ją uchwaliło, a obywatele potwierdzili w referendum w 1997 roku.":
    "The National Assembly passed it and the citizens confirmed it by referendum in 1997.",
  "Jak nazywa się hymn państwowy Polski?": "What is the national anthem of Poland called?",
  "Rota": "Rota, \"The Oath\"",
  "Warszawianka": "Warszawianka, the Varsovian song",
  "Bogurodzica": "Bogurodzica, \"Mother of God\"",
  "Mazurek Dąbrowskiego, z 1797 roku. Rota i Warszawianka to pieśni patriotyczne, ale nie hymn.":
    "Mazurek Dąbrowskiego, from 1797. Rota and Warszawianka are patriotic songs, but not the anthem.",
  "Jakie kolory ma flaga Polski?": "What colours does the Polish flag have?",
  "Biały i czerwony": "White and red",
  "Czerwony i złoty": "Red and gold",
  "Biały i niebieski": "White and blue",
  "Czerwony i czarny": "Red and black",
  "Biel u góry, czerwień u dołu — barwy wzięte z orła i pola herbowego.":
    "White above, red below — the colours taken from the eagle and the field of the arms.",
  "W którym artykule Konstytucji opisane są godło, barwy i hymn?":
    "Which article of the Constitution describes the coat of arms, the colours and the anthem?",
  "W artykule 1": "Article 1",
  "W artykule 28": "Article 28",
  "W artykule 30": "Article 30",
  "W artykule 87": "Article 87",
  "Artykuł 28 wymienia wszystkie trzy symbole i obejmuje je ochroną prawną.":
    "Article 28 names all three symbols and places them under legal protection.",
  "W którym roku powstał Mazurek Dąbrowskiego?": "In which year was Mazurek Dąbrowskiego written?",
  "1791": "1791",
  "1797": "1797",
  "1830": "1830",
  "1797, we Włoszech, w Legionach Polskich — gdy państwa polskiego nie było na mapie.":
    "1797, in Italy, in the Polish Legions — when there was no Polish state on the map.",
  "Kiedy oficjalnie ustalono biel i czerwień jako barwy narodowe?":
    "When were white and red officially settled as the national colours?",
  "W 1791 roku": "In 1791",
  "W 1831 roku": "In 1831",
  "W 1918 roku": "In 1918",
  "W 1990 roku": "In 1990",
  "7 lutego 1831 roku, w czasie powstania listopadowego. Herb jest o wieki starszy niż same barwy.":
    "7 February 1831, during the November Uprising. The coat of arms is centuries older than the colours themselves.",
  "Czym różni się flaga z godłem od zwykłej flagi państwowej?":
    "How does the flag with the coat of arms differ from the plain state flag?",
  "Używają jej wyłącznie polskie statki i placówki dyplomatyczne":
    "Only Polish ships and diplomatic posts use it",
  "Wywiesza się ją tylko 11 listopada": "It is flown only on 11 November",
  "Jest wersją historyczną, dziś nieużywaną": "It is a historical version, no longer used",
  "Różni się odcieniem czerwieni": "It differs in the shade of red",
  "Wersja z godłem jest zastrzeżona dla statków i placówek za granicą — nie wywiesza się jej na balkonie.":
    "The version with the coat of arms is reserved for ships and posts abroad — you do not hang it from a balcony.",
  "Dlaczego orzeł w godle nosi koronę, choć Polska jest republiką?":
    "Why does the eagle in the coat of arms wear a crown, although Poland is a republic?",
  "Bo korona oznacza suwerenność państwa, a nie monarchię":
    "Because the crown stands for the sovereignty of the state, not for a monarchy",
  "Bo Polska formalnie pozostaje królestwem": "Because Poland formally remains a kingdom",
  "Bo tak zdecydował Sejm w 1997 roku": "Because the Sejm decided so in 1997",
  "Bo korona odróżnia godło od herbu Warszawy":
    "Because the crown tells the state arms from the arms of Warsaw",
  "Korona jest znakiem niezawisłości państwa. Wróciła na głowę orła w 1990 roku, po okresie PRL.":
    "The crown is a sign of the state's independence. It returned to the eagle's head in 1990, after the years of the People's Republic.",
  "Kiedy obchodzi się Dzień Flagi?": "When is Flag Day?",
  "2 maja — dzień między Świętem Pracy a Świętem Konstytucji 3 Maja.":
    "2 May — the day between Labour Day and the Constitution Day of 3 May.",
  "Jakie są pierwsze słowa polskiego hymnu?": "What are the first words of the Polish anthem?",
  "Boże, coś Polskę": "Boże, coś Polskę — the hymn \"God who has held Poland\"",
  "Jeszcze Polska nie zginęła": "Jeszcze Polska nie zginęła, \"Poland is not yet lost\"",
  "Nie rzucim ziemi": "Nie rzucim ziemi, \"We shall not abandon our land\"",
  "Warszawo ma": "Warszawo ma, \"My Warsaw\"",
  "„Jeszcze Polska nie zginęła, kiedy my żyjemy” — zdanie napisane w czasie rozbiorów.":
    "\"Poland is not yet lost, so long as we still live\" — a line written during the partitions.",
  "Jaką formą państwa jest Polska według Konstytucji?":
    "What form of state is Poland under the Constitution?",
  "Monarchią": "A monarchy",
  "Republiką": "A republic",
  "Federacją": "A federation",
  "Konfederacją": "A confederation",
  "Republiką — głowę państwa się wybiera na kadencję, a nie dziedziczy.":
    "A republic — the head of state is elected for a term, not inherited.",
  "Która konstytucja obowiązywała w PRL do 1997 roku?":
    "Which constitution was in force in the People's Republic until 1997?",
  "Marcowa z 1921": "The March one of 1921",
  "Kwietniowa z 1935": "The April one of 1935",
  "Z 1952 roku": "The one of 1952",
  "Z 1989 roku": "The one of 1989",
  "Konstytucja PRL z 1952 roku, wielokrotnie zmieniana, obowiązywała do wejścia w życie obecnej.":
    "The constitution of the People's Republic of 1952, amended many times, was in force until the present one came in.",
  "Ile miesięcy obowiązywała Konstytucja 3 maja?":
    "For how many months was the Constitution of 3 May in force?",
  "Czternaście miesięcy": "Fourteen months",
  "Pięć lat": "Five years",
  "Dwadzieścia lat": "Twenty years",
  "Do rozbiorów w 1795 roku": "Until the partitions of 1795",
  "Czternaście miesięcy. Sąsiedzi wkroczyli zbrojnie, a w 1793 roku doszło do drugiego rozbioru.":
    "Fourteen months. The neighbours marched in, and in 1793 came the second partition.",
  "Która konstytucja wzmocniła pozycję prezydenta kosztem parlamentu?":
    "Which constitution strengthened the president at parliament's expense?",
  "Z 1997 roku": "The one of 1997",
  "Kwietniowa z 1935 roku, uchwalona pod koniec życia Piłsudskiego.":
    "The April constitution of 1935, passed towards the end of Piłsudski's life.",
  "Kiedy przy zmianie Konstytucji można zażądać referendum?":
    "When can a referendum be demanded over a change to the Constitution?",
  "Zawsze, przy każdej zmianie": "Always, for any change",
  "Gdy zmiana dotyczy rozdziałów o ustroju, wolnościach albo o samej procedurze zmiany":
    "When the change touches the chapters on the system of government, on freedoms or on the amending procedure itself",
  "Nigdy — Konstytucję zmienia wyłącznie parlament":
    "Never — only parliament changes the Constitution",
  "Tylko gdy zażąda tego Prezydent": "Only if the President demands it",
  "Referendum zatwierdzające dotyczy rozdziałów I, II i XII — ustroju, wolności i trybu zmiany.":
    "A confirming referendum covers chapters I, II and XII — the system of government, freedoms and the amending procedure.",
  "Co oznacza zasada, że organy władzy działają „na podstawie i w granicach prawa”?":
    "What does the rule that public authorities act \"on the basis of and within the limits of the law\" mean?",
  "Że urząd może zrobić tylko to, na co pozwala mu przepis":
    "That an office may do only what a provision allows it to do",
  "Że urząd może zrobić wszystko, czego przepis nie zakazuje":
    "That an office may do anything a provision does not forbid",
  "Że przepisy obowiązują tylko obywateli": "That the provisions bind only citizens",
  "Że decyzje urzędu są ostateczne": "That an office's decisions are final",
  "Odwrotnie niż u obywatela: obywatelowi wolno wszystko, czego prawo nie zabrania, urzędowi tylko to, na co prawo zezwala.":
    "The opposite of the citizen's position: a citizen may do anything the law does not forbid, an office only what the law allows.",
  "Czy ustawa może być sprzeczna z Konstytucją?": "May a statute contradict the Constitution?",
  "Nie, Konstytucja jest najwyższym prawem": "No; the Constitution is the highest law",
  "Tak, jeśli uchwali ją Sejm większością 2/3":
    "Yes, if the Sejm passes it by a two-thirds majority",
  "Tak, jeśli podpisze ją Prezydent": "Yes, if the President signs it",
  "Tak, w stanie wyjątkowym": "Yes, in a state of emergency",
  "Nie. Sprzeczną z Konstytucją ustawę może uchylić Trybunał Konstytucyjny.":
    "No. A statute that contradicts the Constitution can be struck down by the Constitutional Tribunal.",
  "Jak nazywa się zasada rozdzielenia władzy ustawodawczej, wykonawczej i sądowniczej?":
    "What is the principle of separating legislative, executive and judicial power called?",
  "Federalizm": "Federalism",
  "Centralizm": "Centralism",
  "Subsydiarność": "Subsidiarity",
  "Podział i równowaga władz — jedna z podstawowych zasad ustrojowych.":
    "The separation and balance of powers — one of the basic principles of the system.",
  "Który organ uchwalił Konstytucję z 1997 roku?": "Which body passed the Constitution of 1997?",
  "Zgromadzenie Narodowe, czyli Sejm i Senat obradujące wspólnie; obywatele potwierdzili ją w referendum.":
    "The National Assembly, that is the Sejm and the Senat sitting together; the citizens confirmed it by referendum.",
  "Co oznacza domniemanie niewinności?": "What does the presumption of innocence mean?",
  "Że oskarżony jest niewinny, dopóki sąd nie orzeknie prawomocnie":
    "That the accused is innocent until a court rules finally",
  "Że oskarżony musi udowodnić swoją niewinność": "That the accused has to prove their innocence",
  "Że policja nie może nikogo zatrzymać": "That the police may not detain anyone",
  "Że wyrok można wydać tylko za zgodą oskarżonego":
    "That a verdict can be given only with the accused's consent",
  "Ciężar dowodu spoczywa na oskarżycielu, nie na oskarżonym.":
    "The burden of proof rests on the prosecution, not on the accused.",
  "Od którego roku życia przysługuje prawo głosowania?":
    "From what age do you have the right to vote?",
  "Od 16": "From 16",
  "Od 18": "From 18",
  "Od 21": "From 21",
  "Od 25": "From 25",
  "Od 18 lat. 21 lat trzeba mieć, żeby kandydować do Sejmu, 30 — do Senatu.":
    "From 18. You have to be 21 to stand for the Sejm and 30 for the Senat.",
  "Co można zrobić, gdy naruszył wolność sam przepis, a nie wyrok?":
    "What can you do when it is the provision itself, not a judgment, that has infringed a freedom?",
  "Złożyć skargę konstytucyjną do Trybunału Konstytucyjnego":
    "Lodge a constitutional complaint with the Constitutional Tribunal",
  "Wnieść apelację do sądu okręgowego": "Appeal to the regional court",
  "Złożyć wniosek do wojewody": "Put a request to the voivode",
  "Nic — przepisów nie da się zakwestionować": "Nothing — provisions cannot be challenged",
  "Skarga konstytucyjna, po wyczerpaniu drogi sądowej; sporządza ją adwokat albo radca prawny.":
    "A constitutional complaint, once the courts are exhausted; it is drawn up by an advocate or a legal counsel.",
  "Co gwarantuje europejskie rozporządzenie RODO?":
    "What does the European GDPR regulation guarantee?",
  "Prawo do informacji o swoich danych, ich poprawienia i usunięcia":
    "The right to know what data is held about you, to have it corrected and to have it deleted",
  "Prawo do bezpłatnego internetu": "The right to free internet",
  "Prawo do zasiłku dla bezrobotnych": "The right to unemployment benefit",
  "Prawo do pracy w każdym kraju świata": "The right to work in any country in the world",
  "RODO obowiązuje od 2018 roku; nadzoruje je Prezes Urzędu Ochrony Danych Osobowych.":
    "The GDPR has applied since 2018; it is overseen by the President of the Personal Data Protection Office.",
  "Kto stoi na straży praw dzieci?": "Who guards the rights of children?",
  "Rzecznik Praw Dziecka": "The Commissioner for Children's Rights",
  "Rzecznik Praw Obywatelskich": "The Commissioner for Human Rights",
  "Kurator oświaty": "The superintendent of schools",
  "Sąd rodzinny": "The family court",
  "Rzecznik Praw Dziecka działa osobno od Rzecznika Praw Obywatelskich.":
    "The Commissioner for Children's Rights works separately from the Commissioner for Human Rights.",
  "Czego nigdy nie wolno naruszyć przy ograniczaniu wolności?":
    "What may never be infringed when a freedom is limited?",
  "Istoty danej wolności": "The essence of that freedom",
  "Terminu wejścia w życie ustawy": "The date a statute comes into force",
  "Zasady jawności obrad": "The rule that proceedings are public",
  "Kompetencji wojewody": "The powers of the voivode",
  "Ograniczenie musi być konieczne i wprowadzone ustawą, ale istoty wolności naruszyć nie może.":
    "A limit has to be necessary and brought in by statute, but it may not touch the essence of the freedom.",
  "Dlaczego nie można ukarać kogoś za czyn, który w chwili popełnienia nie był zabroniony?":
    "Why can nobody be punished for an act that was not forbidden when it was done?",
  "Bo prawo karne nie działa wstecz": "Because criminal law does not work backwards",
  "Bo przedawnienie następuje po roku": "Because it becomes time-barred after a year",
  "Bo zgody musiałby udzielić Sejm": "Because the Sejm would have to consent",
  "Bo taki czyn zawsze jest wykroczeniem, nie przestępstwem":
    "Because such an act is always a minor offence, not a crime",
  "Zasada lex retro non agit — prawo karne nie działa wstecz.":
    "The rule lex retro non agit — criminal law does not work backwards.",
  "Czy w Polsce obowiązuje cenzura prewencyjna?": "Is there prior censorship in Poland?",
  "Nie, jest zakazana przez Konstytucję": "No; the Constitution forbids it",
  "Tak, sprawuje ją ministerstwo kultury": "Yes; the ministry of culture exercises it",
  "Tak, wobec prasy zagranicznej": "Yes, over the foreign press",
  "Tak, w czasie kampanii wyborczej": "Yes, during an election campaign",
  "Konstytucja zakazuje cenzury prewencyjnej i koncesjonowania prasy.":
    "The Constitution forbids prior censorship and the licensing of the press.",
  "Do jakiego wieku nauka w szkole publicznej jest bezpłatna i obowiązkowa?":
    "Up to what age is education at a state school free and compulsory?",
  "Do 15 lat": "To 15",
  "Do 16 lat": "To 16",
  "Do 18 lat": "To 18",
  "Do ukończenia studiów": "Until you finish university",
  "Do 18. roku życia. Studia dzienne na uczelniach publicznych też są bezpłatne, ale nieobowiązkowe.":
    "To the age of 18. Full-time study at a state university is free as well, but not compulsory.",
  "Kogo obowiązuje przestrzeganie prawa Rzeczypospolitej?":
    "Who is bound to obey the law of the Republic?",
  "Każdego, kto znajduje się pod jej władzą, także cudzoziemca":
    "Everyone under its authority, foreigners included",
  "Wyłącznie obywateli polskich": "Polish citizens only",
  "Wyłącznie osoby pełnoletnie": "Adults only",
  "Wyłącznie osoby zameldowane": "Only people who are registered as resident",
  "Obowiązek dotyczy każdego na terytorium państwa, niezależnie od obywatelstwa.":
    "The duty falls on everyone on the state's territory, whatever their citizenship.",
  "Co może nałożyć podatek?": "What can impose a tax?",
  "Tylko ustawa": "Only a statute",
  "Decyzja wojewody": "A decision of the voivode",
  "Ciężary publiczne nakłada wyłącznie ustawa — to gwarancja konstytucyjna.":
    "Only a statute imposes public burdens — a constitutional guarantee.",
  "Co przysługuje osobie, która ze względu na przekonania nie może pełnić służby wojskowej?":
    "What is open to someone whose convictions prevent them from serving in the army?",
  "Służba zastępcza": "Substitute service",
  "Zwolnienie bez żadnych obowiązków": "Exemption with no duties at all",
  "Kara grzywny": "A fine",
  "Utrata prawa głosu": "Loss of the right to vote",
  "Konstytucja przewiduje skierowanie do służby zastępczej.":
    "The Constitution provides for assignment to substitute service.",
  "W którym roku zawieszono w Polsce obowiązkową zasadniczą służbę wojskową?":
    "In which year was compulsory basic military service suspended in Poland?",
  "2009": "2009",
  "2014": "2014",
  "W 2009 roku. Obowiązek obrony ojczyzny pozostał w Konstytucji, ale poboru w czasie pokoju się nie prowadzi.":
    "In 2009. The duty to defend the homeland stayed in the Constitution, but there is no conscription in peacetime.",
  "Czy udział w wyborach jest w Polsce obowiązkowy?": "Is voting compulsory in Poland?",
  "Nie, głosowanie jest prawem, nie obowiązkiem": "No; voting is a right, not a duty",
  "Tak, za nieoddanie głosu grozi grzywna": "Yes; not voting risks a fine",
  "Tak, dla osób powyżej 25 lat": "Yes, for people over 25",
  "Tak, w wyborach prezydenckich": "Yes, in presidential elections",
  "Nie ma kary za nieoddanie głosu. Prawo wybierania przysługuje od 18. roku życia.":
    "There is no penalty for not voting. The right to vote begins at 18.",
  "Gdzie mogą głosować obywatele mieszkający za granicą?":
    "Where can citizens living abroad vote?",
  "W obwodach przy placówkach dyplomatycznych": "In districts set up at diplomatic posts",
  "Nigdzie — tracą prawo głosu": "Nowhere — they lose the right to vote",
  "Wyłącznie korespondencyjnie do Sejmu": "Only by post to the Sejm",
  "Wyłącznie po powrocie do kraju": "Only after returning to the country",
  "Przy ambasadach i konsulatach tworzy się obwody głosowania.":
    "Polling districts are set up at embassies and consulates.",
  "Kto odpowiada za pogorszenie stanu środowiska?": "Who answers for damage to the environment?",
  "Ten, kto je spowodował": "Whoever caused it",
  "Wyłącznie gmina": "The gmina alone",
  "Wyłącznie Skarb Państwa": "The State Treasury alone",
  "Nikt — to obowiązek moralny bez sankcji": "Nobody — it is a moral duty with no sanction",
  "Konstytucja wprost wiąże odpowiedzialność ze sprawcą pogorszenia.":
    "The Constitution ties responsibility directly to whoever did the damage.",
  "Kto odpowiada za to, żeby dziecko wypełniało obowiązek nauki?":
    "Who is responsible for a child meeting the duty to be educated?",
  "Rodzice albo opiekunowie": "The parents or guardians",
  "Wyłącznie szkoła": "The school alone",
  "Wójt gminy": "The head of the gmina",
  "Kurator sądowy": "The court probation officer",
  "Odpowiadają rodzice albo opiekunowie prawni; szkoła publiczna jest przy tym bezpłatna.":
    "The parents or legal guardians answer for it; the state school is free.",
  "Na ile lat wybiera się Sejm i Senat?": "For how many years are the Sejm and the Senat elected?",
  "Na 3 lata": "For 3 years",
  "Na 4 lata": "For 4 years",
  "Na 5 lat": "For 5 years",
  "Na 6 lat": "For 6 years",
  "Na 4 lata. Prezydenta wybiera się na 5 lat, samorząd również na 5.":
    "For 4 years. The President is elected for 5, and local government for 5 as well.",
  "Ile lat musi mieć kandydat na posła?": "How old must a candidate for the Sejm be?",
  "21": "21",
  "25": "25",
  "30": "30",
  "21 lat. Senatorem można zostać po ukończeniu 30 lat.":
    "21. You can become a senator once you are 30.",
  "Ile dni ma Senat na zajęcie stanowiska wobec ustawy Sejmu?":
    "How many days does the Senat have to take a position on a statute of the Sejm?",
  "7 dni": "7 days",
  "14 dni": "14 days",
  "30 dni": "30 days",
  "60 dni": "60 days",
  "30 dni. Po bezskutecznym upływie terminu ustawę uznaje się za przyjętą.":
    "30 days. If the deadline passes without action, the statute counts as accepted.",
  "Ilu obywateli musi podpisać się pod obywatelskim projektem ustawy?":
    "How many citizens have to sign a citizens' bill?",
  "10 tysięcy": "10 thousand",
  "50 tysięcy": "50 thousand",
  "100 tysięcy": "100 thousand",
  "500 tysięcy": "500 thousand",
  "100 tysięcy — tyle samo, ile potrzeba do zgłoszenia kandydata na Prezydenta.":
    "100 thousand — the same number needed to put forward a candidate for President.",
  "Jaki próg wyborczy obowiązuje pojedynczą partię w wyborach do Sejmu?":
    "What electoral threshold applies to a single party in elections to the Sejm?",
  "3 procent": "3 per cent",
  "5 procent": "5 per cent",
  "8 procent": "8 per cent",
  "Nie ma progu": "There is no threshold",
  "5 procent dla partii, 8 dla koalicji. Mniejszości narodowe są z progu zwolnione.":
    "5 per cent for a party, 8 for a coalition. National minorities are exempt from the threshold.",
  "Czym różni się sposób wyboru Sejmu od sposobu wyboru Senatu?":
    "How does the way the Sejm is elected differ from the way the Senat is?",
  "Sejm wybiera się proporcjonalnie z list, Senat większościowo w stu okręgach":
    "The Sejm is elected proportionally from lists, the Senat by majority in a hundred districts",
  "Sejm wybiera się większościowo, Senat proporcjonalnie":
    "The Sejm is elected by majority, the Senat proportionally",
  "Oba wybiera się identycznie": "Both are elected the same way",
  "Senatorów wskazuje Prezydent": "The President names the senators",
  "Do Sejmu głosuje się na listy i dzieli mandaty metodą d'Hondta; w Senacie w każdym okręgu wygrywa jeden kandydat.":
    "For the Sejm you vote for lists and the seats are shared by the d'Hondt method; in the Senat one candidate wins in each district.",
  "Jaką większością Sejm odrzuca poprawki Senatu?":
    "By what majority does the Sejm reject the Senat's amendments?",
  "Bezwzględną. Trzy piąte potrzebne są do odrzucenia weta Prezydenta.":
    "An absolute one. Three fifths are needed to override the President's veto.",
  "Co to jest Zgromadzenie Narodowe?": "What is the National Assembly?",
  "Sejm i Senat obradujące wspólnie": "The Sejm and the Senat sitting together",
  "Zjazd przedstawicieli samorządów": "A congress of local government representatives",
  "Posiedzenie Rady Ministrów z Prezydentem":
    "A meeting of the Council of Ministers with the President",
  "Zebranie wszystkich sędziów Sądu Najwyższego":
    "A gathering of all the judges of the Supreme Court",
  "Zbiera się rzadko: przysięga Prezydenta, uznanie go za trwale niezdolnego, postawienie przed Trybunałem Stanu.":
    "It meets rarely: the President's oath, a finding that they are permanently unfit, and putting them before the Tribunal of State.",
  "Co chroni immunitet poselski?": "What does a member's immunity protect?",
  "Mandat, a nie osobę — izba może go uchylić":
    "The mandate, not the person — the chamber can lift it",
  "Osobę dożywotnio": "The person, for life",
  "Wyłącznie wypowiedzi na sali sejmowej": "Only what is said in the chamber",
  "Majątek posła przed egzekucją": "A member's property against enforcement",
  "Bez zgody izby nie można pociągnąć posła do odpowiedzialności karnej, ale izba może immunitet uchylić.":
    "Without the chamber's consent a member cannot be held criminally liable, but the chamber can lift the immunity.",
  "Kto podpisuje ustawę na końcu drogi legislacyjnej?":
    "Who signs a statute at the end of its legislative path?",
  "Marszałek Sejmu": "The Marszałek of the Sejm",
  "Premier": "The prime minister",
  "Prezes Trybunału Konstytucyjnego": "The president of the Constitutional Tribunal",
  "Prezydent — albo podpisuje, albo wetuje, albo kieruje ustawę do Trybunału Konstytucyjnego.":
    "The President — who either signs, or vetoes, or sends the statute to the Constitutional Tribunal.",
  "Ile lat musi mieć kandydat na Prezydenta?": "How old must a candidate for President be?",
  "35": "35",
  "40": "40",
  "35 lat i 100 tysięcy podpisów poparcia.": "35, and 100 thousand signatures of support.",
  "Ile kadencji może sprawować ta sama osoba jako Prezydent?":
    "How many terms may the same person serve as President?",
  "Jedną": "One",
  "Bez ograniczeń": "Without limit",
  "Najwyżej dwie pięcioletnie kadencje.": "Two five-year terms at most.",
  "Ile dni ma Prezydent na podpisanie ustawy?":
    "How many days does the President have to sign a statute?",
  "21 dni": "21 days",
  "21 dni. W tym czasie może też zawetować ustawę albo skierować ją do Trybunału.":
    "21 days. In that time they can also veto the statute or send it to the Tribunal.",
  "Kto zastępuje Prezydenta, gdy ten nie może sprawować urzędu?":
    "Who stands in for the President when they cannot hold office?",
  "Marszałek Senatu": "The Marszałek of the Senat",
  "Prezes Sądu Najwyższego": "The president of the Supreme Court",
  "Marszałek Sejmu, a gdyby i on nie mógł — Marszałek Senatu. Tak było w kwietniu 2010 roku.":
    "The Marszałek of the Sejm, and if they could not either, the Marszałek of the Senat. That is what happened in April 2010.",
  "Co to jest kontrasygnata?": "What is a countersignature?",
  "Podpis Prezesa Rady Ministrów pod aktem Prezydenta":
    "The prime minister's signature under an act of the President",
  "Drugie czytanie ustawy w Sejmie": "The second reading of a statute in the Sejm",
  "Zgoda Senatu na powołanie ministra": "The Senat's consent to a minister's appointment",
  "Podpis Prezydenta pod uchwałą Sejmu":
    "The President's signature under a resolution of the Sejm",
  "Premier bierze przez nią odpowiedzialność za akt przed Sejmem. Prerogatywy jej nie wymagają.":
    "By it the prime minister takes responsibility for the act before the Sejm. Prerogatives do not need one.",
  "Która z tych czynności NIE wymaga kontrasygnaty premiera?":
    "Which of these does NOT need the prime minister's countersignature?",
  "Prawo łaski": "The power of pardon",
  "Ratyfikacja umowy międzynarodowej": "Ratifying an international treaty",
  "Powołanie ambasadora": "Appointing an ambassador",
  "Wydanie rozporządzenia": "Issuing a regulation",
  "Prawo łaski jest prerogatywą — podobnie jak zarządzenie wyborów czy nadanie obywatelstwa.":
    "The power of pardon is a prerogative — as is calling an election or granting citizenship.",
  "Co się dzieje, gdy w pierwszej turze nikt nie zdobędzie ponad połowy głosów?":
    "What happens if nobody wins more than half the votes in the first round?",
  "Po dwóch tygodniach odbywa się druga tura między dwoma najlepszymi":
    "Two weeks later there is a second round between the two leading candidates",
  "Wybiera Zgromadzenie Narodowe": "The National Assembly chooses",
  "Wygrywa kandydat z największą liczbą głosów": "The candidate with the most votes wins",
  "Wybory powtarza się w całości": "The whole election is held again",
  "Druga tura, dwa tygodnie później, między dwoma kandydatami z najlepszym wynikiem.":
    "A second round, two weeks later, between the two candidates with the best results.",
  "Gdzie mieści się siedziba Prezydenta Rzeczypospolitej?":
    "Where is the seat of the President of the Republic?",
  "Na Wawelu": "At Wawel",
  "W Pałacu Prezydenckim w Warszawie": "In the Presidential Palace in Warsaw",
  "W Belwederze w Krakowie": "In the Belweder in Kraków",
  "W Sejmie": "In the Sejm",
  "Pałac Prezydencki przy Krakowskim Przedmieściu w Warszawie.":
    "The Presidential Palace on Krakowskie Przedmieście in Warsaw.",
  "Kim jest Prezydent wobec Sił Zbrojnych?":
    "What is the President in relation to the Armed Forces?",
  "Najwyższym zwierzchnikiem": "Their supreme commander",
  "Dowódcą operacyjnym": "Their operational commander",
  "Doradcą Ministra Obrony": "An adviser to the minister of defence",
  "Nie ma z nimi związku": "Has nothing to do with them",
  "Najwyższym zwierzchnikiem; w czasie pokoju sprawuje to zwierzchnictwo przez Ministra Obrony Narodowej.":
    "Their supreme commander; in peacetime that command is exercised through the minister of national defence.",
  "Jak inaczej nazywa się Prezes Rady Ministrów?":
    "What else is the Chairman of the Council of Ministers called?",
  "Marszałek": "Marszałek, the Marshal",
  "Kanclerz": "Chancellor",
  "Premier. Marszałek kieruje obradami Sejmu albo Senatu.":
    "The prime minister. The Marszałek chairs the sittings of the Sejm or the Senat.",
  "Kto desygnuje Prezesa Rady Ministrów?":
    "Who designates the Chairman of the Council of Ministers?",
  "Prezydent desygnuje, a Sejm udziela rządowi wotum zaufania.":
    "The President designates, and the Sejm gives the government its vote of confidence.",
  "W ciągu ilu miesięcy parlament musi uchwalić budżet, żeby Prezydent nie mógł skrócić kadencji Sejmu?":
    "Within how many months must parliament pass the budget if the President is not to be able to cut the Sejm's term short?",
  "Dwóch": "Two",
  "Trzech": "Three",
  "Czterech": "Four",
  "Sześciu": "Six",
  "Czterech miesięcy od przedłożenia projektu.":
    "Four months from the day the bill is laid before it.",
  "Który organ bada wydatki państwa i podlega Sejmowi?":
    "Which body examines the state's spending and answers to the Sejm?",
  "Ministerstwo Finansów": "The ministry of finance",
  "NIK podlega Sejmowi, nie rządowi — dlatego może kontrolować rząd.":
    "The NIK, the Supreme Audit Office, answers to the Sejm and not to the government — which is why it can audit the government.",
  "Co określa podział działów administracji rządowej między ministrów?":
    "What sets out how the branches of government administration are divided among ministers?",
  "Ustawa": "A statute",
  "Decyzja premiera": "A decision of the prime minister",
  "Rozporządzenie Prezydenta": "A regulation of the President",
  "Uchwała Sejmu": "A resolution of the Sejm",
  "Ustawa o działach administracji rządowej. Liczba ministerstw bywa różna, ale działy są ustawowe.":
    "The act on the branches of government administration. The number of ministries varies, but the branches are set by statute.",
  "Który organ sądzi najwyższych urzędników za naruszenie Konstytucji lub ustawy?":
    "Which body tries the highest officials for breaching the Constitution or a statute?",
  "Trybunał Stanu — za delikty konstytucyjne, a nie za zwykłe przestępstwa.":
    "The Tribunal of State — for constitutional wrongs, not for ordinary crimes.",
  "Kto prowadzi bieżącą politykę wewnętrzną i zagraniczną państwa?":
    "Who runs the state's day-to-day home and foreign policy?",
  "Rada Ministrów. Prezydent reprezentuje państwo i stoi na straży Konstytucji.":
    "The Council of Ministers. The President represents the state and guards the Constitution.",
  "Jakiej większości wymaga wotum zaufania dla rządu?":
    "What majority does a vote of confidence in the government need?",
  "Bezwzględnej większości głosów w obecności co najmniej połowy ustawowej liczby posłów.":
    "An absolute majority of votes, with at least half the statutory number of members present.",
  "W którym sądzie zaczyna się większość spraw?": "In which court do most cases begin?",
  "W rejonowym": "In the district court",
  "W okręgowym": "In the regional court",
  "W apelacyjnym": "In the court of appeal",
  "W Sądzie Najwyższym": "In the Supreme Court",
  "W sądzie rejonowym; odwołania trafiają do okręgowego, dalej do apelacyjnego.":
    "In the district court; appeals go to the regional court and on to the court of appeal.",
  "Który sąd rozpatruje skargę na decyzję urzędu?":
    "Which court hears a complaint against a decision of an office?",
  "Wojewódzki sąd administracyjny": "The voivodeship administrative court",
  "Sąd rejonowy": "The district court",
  "Sądy administracyjne mają własną drogę; kasację rozpatruje Naczelny Sąd Administracyjny.":
    "The administrative courts have a path of their own; the Supreme Administrative Court hears the final appeal.",
  "Co oznacza dwuinstancyjność postępowania?": "What does a two-instance procedure mean?",
  "Że od wyroku przysługuje odwołanie": "That a judgment can be appealed",
  "Że sprawę sądzi dwóch sędziów": "That two judges try the case",
  "Że wyrok zapada po dwóch rozprawach": "That the judgment comes after two hearings",
  "Że rozprawa jest jawna": "That the hearing is public",
  "Każdą sprawę można poddać ocenie sądu wyższej instancji.":
    "Every case can be put before a higher court.",
  "Kto prowadzi postępowanie przygotowawcze i oskarża przed sądem?":
    "Who conducts the investigation and brings the charge in court?",
  "Adwokat": "The advocate",
  "Ławnik": "The lay judge",
  "Prokurator. Adwokat broni, komornik wykonuje orzeczenia.":
    "The prosecutor. The advocate defends, and the bailiff enforces judgments.",
  "Czym zajmuje się Sąd Najwyższy?": "What does the Supreme Court do?",
  "Czuwa nad jednolitością orzecznictwa, nie sądzi spraw od początku":
    "It watches over the consistency of case law; it does not try cases from the start",
  "Rozpatruje wszystkie sprawy karne w kraju": "It hears every criminal case in the country",
  "Bada zgodność ustaw z Konstytucją": "It checks whether statutes agree with the Constitution",
  "Nadzoruje pracę urzędów wojewódzkich": "It supervises the work of the voivodeship offices",
  "Rozpatruje kasacje i podejmuje uchwały wykładnicze; zgodnością ustaw z Konstytucją zajmuje się Trybunał.":
    "It hears final appeals and passes resolutions of interpretation; whether statutes agree with the Constitution is the Tribunal's business.",
  "Czemu podlegają sędziowie przy orzekaniu?": "What are judges subject to when they rule?",
  "Tylko Konstytucji i ustawom": "The Constitution and statutes alone",
  "Ministrowi Sprawiedliwości": "The minister of justice",
  "Uchwałom Sejmu": "The resolutions of the Sejm",
  "Wytycznym prokuratora": "The prosecutor's guidelines",
  "Sędziowie są niezawiśli i podlegają wyłącznie Konstytucji oraz ustawom.":
    "Judges are independent and subject only to the Constitution and to statutes.",
  "Kto może otrzymać obrońcę z urzędu?": "Who can be given a court-appointed defence lawyer?",
  "Osoba, której nie stać na adwokata": "Someone who cannot afford an advocate",
  "Każdy, kto o to poprosi": "Anyone who asks for one",
  "Tylko cudzoziemcy": "Foreigners only",
  "Nikt — obrońcę trzeba opłacić": "Nobody — a defence lawyer has to be paid for",
  "Sąd wyznacza obrońcę z urzędu, gdy oskarżony nie ma środków na obronę.":
    "The court appoints a defence lawyer when the accused has no means to pay for a defence.",
  "Kto wykonuje prawomocne orzeczenia sądu, gdy dłużnik ich nie wypełnia?":
    "Who enforces a final court judgment when the debtor does not comply?",
  "Policja": "The police",
  "Komornik sądowy prowadzi egzekucję.": "The court bailiff carries out the enforcement.",
  "Jak nazywa się podstawowa jednostka samorządu terytorialnego?":
    "What is the basic unit of local government called?",
  "Sołectwo": "Sołectwo, a village unit",
  "Gmina odpowiada za wszystko, czego nie zastrzeżono dla innych szczebli.":
    "The gmina answers for everything not reserved to the other levels.",
  "Kto kieruje gminą wiejską?": "Who runs a rural gmina?",
  "Wójt": "The wójt, the head of a rural gmina",
  "Burmistrz": "The burmistrz, the mayor of a town",
  "Starosta": "The starosta, the head of a powiat",
  "Wójt na wsi, burmistrz w mieście, prezydent w większym mieście.":
    "The wójt in the country, the burmistrz in a town, the prezydent in a larger city.",
  "Kto stoi na czele powiatu?": "Who heads a powiat?",
  "Starosta, wybierany przez radę powiatu.": "The starosta, elected by the powiat council.",
  "Który szczebel samorządu zarządza funduszami europejskimi w regionie?":
    "Which level of local government manages the European funds in a region?",
  "Samorząd województwa odpowiada za rozwój regionu i programy regionalne.":
    "The voivodeship government answers for the region's development and its regional programmes.",
  "Co ile lat odbywają się wybory samorządowe?": "How often are local elections held?",
  "Co 3 lata": "Every 3 years",
  "Co 4 lata": "Every 4 years",
  "Co 5 lat": "Every 5 years",
  "Co 6 lat": "Every 6 years",
  "Co 5 lat — kadencję wydłużono z czterech lat w 2018 roku.":
    "Every 5 years — the term was lengthened from four years in 2018.",
  "Skąd gmina bierze dochody własne?": "Where does a gmina get its own income?",
  "Z podatku od nieruchomości i opłat lokalnych": "From property tax and local charges",
  "Wyłącznie z dotacji rządowych": "From government grants alone",
  "Z podatku VAT": "From VAT",
  "Ze składek zdrowotnych": "From health contributions",
  "Do tego dochodzi udział w PIT i CIT oraz subwencje z budżetu państwa.":
    "On top of that come a share of income and corporation tax and subsidies from the state budget.",
  "Jak nazywa się jednostka pomocnicza gminy na wsi?":
    "What is a gmina's auxiliary unit in the countryside called?",
  "Dzielnica": "A dzielnica, a district",
  "Osiedle": "An osiedle, a housing estate",
  "Obwód": "An obwód, a precinct",
  "Sołectwo, z sołtysem na czele. W mieście są dzielnice albo osiedla.":
    "The sołectwo, headed by a sołtys. In a town there are dzielnice or osiedla.",
  "Jak mieszkańcy mogą odwołać wójta przed końcem kadencji?":
    "How can residents remove a wójt before the end of the term?",
  "W referendum lokalnym": "By a local referendum",
  "Uchwałą wojewody": "By a resolution of the voivode",
  "Decyzją premiera": "By a decision of the prime minister",
  "Nie da się tego zrobić": "It cannot be done",
  "Referendum lokalne może odwołać zarówno wójta, jak i radę.":
    "A local referendum can remove both the wójt and the council.",
  "Który szczebel samorządu wydaje prawo jazdy i rejestruje pojazdy?":
    "Which level of local government issues driving licences and registers vehicles?",
  "Starostwo powiatowe. Gmina zajmuje się szkołami podstawowymi i sprawami lokalnymi.":
    "The powiat office. The gmina looks after primary schools and local matters.",
  "Który władca przyjął chrzest w 966 roku?": "Which ruler was baptised in 966?",
  "Mieszko I": "Mieszko I",
  "Bolesław Chrobry": "Bolesław the Brave",
  "Kazimierz Wielki": "Casimir the Great",
  "Władysław Jagiełło": "Władysław Jagiełło",
  "Mieszko I, książę Polan. Jego syn Bolesław Chrobry koronował się w 1025 roku.":
    "Mieszko I, duke of the Polans. His son Bolesław the Brave was crowned in 1025.",
  "Jak nazywała się pierwsza dynastia panująca w Polsce?":
    "What was the first ruling dynasty in Poland called?",
  "Piastowie": "The Piasts",
  "Jagiellonowie": "The Jagiellons",
  "Wazowie": "The Vasas",
  "Habsburgowie": "The Habsburgs",
  "Piastowie, od Mieszka I do 1370 roku. Potem przyszli Jagiellonowie.":
    "The Piasts, from Mieszko I to 1370. The Jagiellons came after them.",
  "Kto był pierwszym koronowanym królem Polski?": "Who was the first crowned king of Poland?",
  "Władysław Łokietek": "Władysław the Elbow-high",
  "Bolesław Chrobry, w 1025 roku. Mieszko I był księciem, nie królem.":
    "Bolesław the Brave, in 1025. Mieszko I was a duke, not a king.",
  "O którym władcy mówi się, że „zastał Polskę drewnianą, a zostawił murowaną”?":
    "Which ruler is said to have found Poland built of wood and left it built of brick?",
  "O Bolesławie Chrobrym": "Bolesław the Brave",
  "O Kazimierzu Wielkim": "Casimir the Great",
  "O Władysławie Jagielle": "Władysław Jagiełło",
  "O Janie III Sobieskim": "John III Sobieski",
  "O Kazimierzu Wielkim (1333–1370), ostatnim królu z dynastii Piastów.":
    "Casimir the Great (1333–1370), the last king of the Piast dynasty.",
  "Co ustaliła unia lubelska z 1569 roku?": "What did the Union of Lublin of 1569 establish?",
  "Powstanie Rzeczypospolitej Obojga Narodów":
    "The founding of the Polish-Lithuanian Commonwealth",
  "Chrzest Litwy": "The baptism of Lithuania",
  "Rozejm z Krzyżakami": "A truce with the Teutonic Order",
  "Powrót stolicy do Gniezna": "The return of the capital to Gniezno",
  "Polska i Litwa utworzyły jedno państwo ze wspólnym sejmem i wspólnym królem.":
    "Poland and Lithuania formed one state with a common sejm and a common king.",
  "Co oznaczało liberum veto?": "What did the liberum veto mean?",
  "Że jeden poseł mógł zerwać obrady sejmu":
    "That one member could break up a sitting of the sejm",
  "Że król mógł odrzucić każdą ustawę": "That the king could reject any statute",
  "Że szlachta wybierała króla": "That the nobility elected the king",
  "Że mieszczanie mieli głos w sejmie": "That the townspeople had a voice in the sejm",
  "Sprzeciw jednego posła unieważniał obrady — z czasem sparaliżowało to państwo.":
    "One member's objection annulled the sitting — in time this paralysed the state.",
  "Co wydarzyło się w 1385 roku w Krewie?": "What happened at Krewo in 1385?",
  "Zawarto unię Polski z Litwą": "A union of Poland with Lithuania was concluded",
  "Wybuchła wojna z Krzyżakami": "War broke out with the Teutonic Order",
  "Uchwalono pierwszą konstytucję": "The first constitution was passed",
  "Przeniesiono stolicę do Warszawy": "The capital was moved to Warsaw",
  "Jagiełło przyjął chrzest, ożenił się z Jadwigą i został królem Polski.":
    "Jagiełło was baptised, married Jadwiga and became king of Poland.",
  "Kto ogłosił teorię heliocentryczną w polskim złotym wieku?":
    "Who set out the heliocentric theory in Poland's golden age?",
  "Mikołaj Kopernik": "Nicolaus Copernicus",
  "Jan Kochanowski": "Jan Kochanowski",
  "Jan Długosz": "Jan Długosz",
  "Andrzej Frycz Modrzewski": "Andrzej Frycz Modrzewski",
  "Mikołaj Kopernik. Kochanowski był poetą piszącym po polsku zamiast po łacinie.":
    "Nicolaus Copernicus. Kochanowski was a poet who wrote in Polish instead of Latin.",
  "Które miasto było pierwszą stolicą Polski?": "Which city was Poland's first capital?",
  "Gniezno": "Gniezno",
  "Gniezno; tam w 1000 roku doszło do zjazdu z cesarzem Ottonem III.":
    "Gniezno; the meeting with Emperor Otto III took place there in the year 1000.",
  "Które państwa dokonały rozbiorów Polski?": "Which states carried out the partitions of Poland?",
  "Rosja, Prusy i Austria": "Russia, Prussia and Austria",
  "Rosja, Szwecja i Turcja": "Russia, Sweden and Turkey",
  "Prusy, Francja i Austria": "Prussia, France and Austria",
  "Austria, Węgry i Rosja": "Austria, Hungary and Russia",
  "Trzy rozbiory w latach 1772, 1793 i 1795.": "Three partitions, in 1772, 1793 and 1795.",
  "W którym roku doszło do trzeciego rozbioru Polski?":
    "In which year did the third partition of Poland take place?",
  "1772": "1772",
  "1795": "1795",
  "1795 — po nim państwo polskie zniknęło z mapy na 123 lata.":
    "1795 — after it the Polish state vanished from the map for 123 years.",
  "Kto poprowadził insurekcję z 1794 roku?": "Who led the insurrection of 1794?",
  "Tadeusz Kościuszko": "Tadeusz Kościuszko",
  "Romuald Traugutt": "Romuald Traugutt",
  "Jan Henryk Dąbrowski": "Jan Henryk Dąbrowski",
  "Tadeusz Kościuszko. Po klęsce nastąpił trzeci rozbiór.":
    "Tadeusz Kościuszko. The third partition followed the defeat.",
  "W którym roku wybuchło powstanie listopadowe?":
    "In which year did the November Uprising break out?",
  "1846": "1846",
  "1863": "1863",
  "1830, w Warszawie, przeciw Rosji. Styczniowe wybuchło w 1863.":
    "1830, in Warsaw, against Russia. The January Uprising broke out in 1863.",
  "Który zabór uzyskał w 1867 roku autonomię z polskimi szkołami i sejmem?":
    "Which partition zone gained autonomy in 1867, with Polish schools and a diet?",
  "Rosyjski": "The Russian one",
  "Pruski": "The Prussian one",
  "Austriacki": "The Austrian one",
  "Żaden": "None of them",
  "Galicja w zaborze austriackim — uboga, ale z sejmem krajowym we Lwowie.":
    "Galicia, in the Austrian zone — poor, but with a provincial diet in Lwów.",
  "Na czym polegała praca organiczna?": "What did organic work consist of?",
  "Na zakładaniu szkół, spółdzielni i czytelni zamiast zbrojnych zrywów":
    "Founding schools, cooperatives and reading rooms instead of armed risings",
  "Na przygotowaniach do kolejnego powstania": "Preparing for another uprising",
  "Na emigracji zarobkowej do Ameryki": "Going to America for work",
  "Na współpracy z władzami zaborczymi w administracji":
    "Working with the partitioning powers in the administration",
  "Kierunek przyjęty po klęsce 1863 roku: wzmacnianie społeczeństwa zamiast walki zbrojnej.":
    "The course taken after the defeat of 1863: strengthening society instead of fighting.",
  "Za co Maria Skłodowska-Curie otrzymała pierwszą Nagrodę Nobla w 1903 roku?":
    "What did Maria Skłodowska-Curie receive her first Nobel Prize for, in 1903?",
  "Za fizykę": "For physics",
  "Za chemię": "For chemistry",
  "Za literaturę": "For literature",
  "Za medycynę": "For medicine",
  "Fizyka w 1903, chemia w 1911 — jako pierwsza osoba uhonorowana Noblem dwukrotnie.":
    "Physics in 1903, chemistry in 1911 — the first person to be honoured with a Nobel twice.",
  "Który kompozytor jest najbardziej znanym Polakiem epoki romantyzmu?":
    "Which composer is the best known Pole of the Romantic age?",
  "Karol Szymanowski": "Karol Szymanowski",
  "Stanisław Moniuszko": "Stanisław Moniuszko",
  "Fryderyk Chopin. Jego imię nosi konkurs pianistyczny w Warszawie.":
    "Fryderyk Chopin. The piano competition in Warsaw carries his name.",
  "Komu Rada Regencyjna przekazała władzę wojskową 11 listopada 1918 roku?":
    "To whom did the Regency Council hand over military power on 11 November 1918?",
  "Józefowi Piłsudskiemu": "To Józef Piłsudski",
  "Romanowi Dmowskiemu": "To Roman Dmowski",
  "Ignacemu Paderewskiemu": "To Ignacy Paderewski",
  "Wincentemu Witosowi": "To Wincenty Witos",
  "Józefowi Piłsudskiemu. Dzień ten jest dziś Narodowym Świętem Niepodległości.":
    "To Józef Piłsudski. That day is now the National Independence Day.",
  "Jak nazywa się reforma, która w 1924 roku wprowadziła złotego?":
    "What is the reform that brought in the złoty in 1924 called?",
  "Reforma Grabskiego": "The Grabski reform",
  "Plan Balcerowicza": "The Balcerowicz plan",
  "Reforma Wielopolskiego": "The Wielopolski reform",
  "Plan Marshalla": "The Marshall Plan",
  "Reforma Władysława Grabskiego. Plan Balcerowicza to rok 1990.":
    "The reform of Władysław Grabski. The Balcerowicz plan belongs to 1990.",
  "Który port zbudowano od podstaw w dwudziestoleciu międzywojennym?":
    "Which port was built from nothing between the wars?",
  "Gdynię": "Gdynia",
  "Szczecin": "Szczecin",
  "Świnoujście": "Świnoujście, on the Baltic coast",
  "Gdynię, od 1926 roku — Gdańsk był wtedy Wolnym Miastem.":
    "Gdynia, from 1926 — Gdańsk was then a Free City.",
  "Jaka część mieszkańców II Rzeczypospolitej należała do mniejszości narodowych?":
    "What share of the inhabitants of the Second Republic belonged to national minorities?",
  "Około jedna dziesiąta": "About a tenth",
  "Około jedna trzecia": "About a third",
  "Około połowa": "About half",
  "Prawie nikt": "Almost nobody",
  "Około jednej trzeciej: Ukraińcy, Żydzi, Białorusini, Niemcy, Litwini. Dziś kraj jest jednolity narodowościowo.":
    "About a third: Ukrainians, Jews, Belarusians, Germans, Lithuanians. Today the country is nationally uniform.",
  "Ile systemów prawnych odziedziczyła Polska po zaborcach w 1918 roku?":
    "How many legal systems did Poland inherit from the partitioning powers in 1918?",
  "Jeden": "One",
  "Dwa": "Two",
  "Sześć": "Six",
  "Trzy — po każdym z zaborców. Do tego różne koleje i cztery waluty w obiegu.":
    "Three — one from each of them. On top of that came different railways and four currencies in circulation.",
  "Jak nazywano okres rządów obozu piłsudczykowskiego po 1926 roku?":
    "What was the period of rule by Piłsudski's camp after 1926 called?",
  "Sanacja": "Sanacja, the healing",
  "Odwilż": "Odwilż, the thaw",
  "Transformacja": "Transformacja, the transformation",
  "Restauracja": "Restauracja, the restoration",
  "Sanacja, czyli „uzdrowienie”. Rola parlamentu w tym czasie malała.":
    "Sanacja, meaning a return to health. Parliament's part shrank in those years.",
  "W którym roku uchwalono konstytucję marcową?":
    "In which year was the March constitution passed?",
  "1921": "1921",
  "1926": "1926",
  "1935": "1935",
  "1921. Konstytucja kwietniowa to 1935 rok.": "1921. The April constitution belongs to 1935.",
  "Od ostrzału którego miejsca rozpoczęła się II wojna światowa?":
    "The shelling of which place began the Second World War?",
  "Westerplatte": "Westerplatte",
  "Wawelu": "Wawel",
  "Twierdzy Modlin": "The fortress of Modlin",
  "Helu": "Hel",
  "Westerplatte pod Gdańskiem, 1 września 1939 roku o świcie.":
    "Westerplatte near Gdańsk, at dawn on 1 September 1939.",
  "Które państwo zaatakowało Polskę 17 września 1939 roku?":
    "Which state attacked Poland on 17 September 1939?",
  "Związek Radziecki": "The Soviet Union",
  "Węgry": "Hungary",
  "Słowacja": "Slovakia",
  "Rumunia": "Romania",
  "ZSRR, wykonując tajny protokół paktu Ribbentrop–Mołotow.":
    "The USSR, carrying out the secret protocol of the Ribbentrop–Molotov pact.",
  "Jak nazywała się największa podziemna armia okupowanej Europy?":
    "What was the largest underground army in occupied Europe called?",
  "Armia Ludowa": "The Armia Ludowa, the People's Army",
  "Legiony Polskie": "The Polish Legions",
  "Bataliony Chłopskie": "The Bataliony Chłopskie, the Peasants' Battalions",
  "Armia Krajowa, podległa rządowi w Londynie.":
    "The Armia Krajowa, the Home Army, under the government in London.",
  "W którym roku wybuchło powstanie w getcie warszawskim?":
    "In which year did the uprising in the Warsaw ghetto break out?",
  "1940": "1940",
  "1942": "1942",
  "1943": "1943",
  "1944": "1944",
  "Kwiecień 1943. Powstanie Warszawskie to sierpień 1944 — to dwa różne zrywy.":
    "April 1943. The Warsaw Uprising was August 1944 — two different risings.",
  "Ile dni trwało Powstanie Warszawskie?": "How many days did the Warsaw Uprising last?",
  "23 dni": "23 days",
  "43 dni": "43 days",
  "63 dni": "63 days",
  "83 dni": "83 days",
  "63 dni, od 1 sierpnia 1944. Po jego upadku miasto zostało celowo zburzone.":
    "63 days, from 1 August 1944. After it fell the city was deliberately destroyed.",
  "Co wydarzyło się w Katyniu wiosną 1940 roku?": "What happened at Katyn in the spring of 1940?",
  "NKWD zamordowało blisko 22 tysiące polskich oficerów":
    "The NKVD murdered nearly 22 thousand Polish officers",
  "Wybuchło powstanie przeciw Niemcom": "An uprising against the Germans broke out",
  "Podpisano rozejm z ZSRR": "A truce with the USSR was signed",
  "Utworzono getto": "A ghetto was set up",
  "Zbrodnia katyńska — mord na oficerach, policjantach i urzędnikach, przez dekady zaprzeczany.":
    "The Katyn massacre — the murder of officers, policemen and officials, denied for decades.",
  "Jak nazywała się organizacja niosąca w okupowanej Polsce pomoc Żydom?":
    "What was the organisation that helped Jews in occupied Poland called?",
  "Żegota": "Żegota, the code name of the council",
  "Żagiew": "Żagiew, a group set up by the occupiers",
  "Zośka": "Zośka, a scouting battalion",
  "Wachlarz": "Wachlarz, a sabotage unit",
  "Rada Pomocy Żydom „Żegota”. Za pomoc groziła kara śmierci, także dla całej rodziny.":
    "The Council to Aid Jews, code-named Żegota. Helping carried the death penalty, for the whole family as well.",
  "Którą bitwę stoczyli w 1944 roku żołnierze generała Andersa we Włoszech?":
    "Which battle did General Anders's soldiers fight in Italy in 1944?",
  "O Monte Cassino": "Monte Cassino",
  "Pod Lenino": "Lenino",
  "Pod Falaise": "Falaise",
  "O Arnhem": "Arnhem",
  "Monte Cassino, po przejściu szlaku przez Bliski Wschód.":
    "Monte Cassino, after the long road through the Middle East.",
  "Jaką część ludności straciła Polska w czasie II wojny światowej?":
    "What share of its population did Poland lose in the Second World War?",
  "Około jedną dwudziestą": "About a twentieth",
  "Około jedną dziesiątą": "About a tenth",
  "Około jedną piątą": "About a fifth",
  "Około połowę": "About half",
  "Około 6 milionów osób, blisko jedna piąta przedwojennej ludności.":
    "About 6 million people, close to a fifth of the pre-war population.",
  "Jak nazywała się partia rządząca w PRL?":
    "What was the ruling party in the People's Republic called?",
  "PZPR": "The PZPR",
  "PSL": "The PSL",
  "AK": "The AK",
  "NSZZ": "The NSZZ",
  "Polska Zjednoczona Partia Robotnicza, jedyna partia sprawująca władzę.":
    "The Polish United Workers' Party, the only party that held power.",
  "W której stoczni wybuchł strajk, który doprowadził do powstania Solidarności?":
    "At which shipyard did the strike break out that led to Solidarność?",
  "W Gdańskiej": "At the Gdańsk one",
  "W Szczecińskiej": "At the Szczecin one",
  "W Gdyńskiej": "At the Gdynia one",
  "W Ustce": "At Ustka",
  "Stocznia Gdańska, sierpień 1980. Strajki objęły też Szczecin i inne miasta.":
    "The Gdańsk shipyard, August 1980. The strikes reached Szczecin and other cities as well.",
  "Kto stanął na czele Solidarności w 1980 roku?": "Who came to lead Solidarność in 1980?",
  "Jacek Kuroń": "Jacek Kuroń",
  "Bronisław Geremek": "Bronisław Geremek",
  "Lech Wałęsa, elektryk ze Stoczni Gdańskiej, późniejszy prezydent.":
    "Lech Wałęsa, an electrician at the Gdańsk shipyard and later president.",
  "Kto wprowadził stan wojenny 13 grudnia 1981 roku?":
    "Who imposed martial law on 13 December 1981?",
  "Edward Gierek": "Edward Gierek",
  "Władysław Gomułka": "Władysław Gomułka",
  "Stanisław Kania": "Stanisław Kania",
  "Generał Wojciech Jaruzelski. Solidarność została zdelegalizowana, działacze internowani.":
    "General Wojciech Jaruzelski. Solidarność was outlawed and its activists interned.",
  "W którym roku Karol Wojtyła został papieżem?": "In which year did Karol Wojtyła become pope?",
  "1978": "1978",
  "1978. Jego pielgrzymka do Polski rok później miała ogromne znaczenie społeczne.":
    "1978. His pilgrimage to Poland a year later mattered enormously to the society.",
  "Jak nazywano nielegalny obieg książek i pism w PRL?":
    "What was the illegal circulation of books and papers in the People's Republic called?",
  "Drugi obieg": "The second circulation",
  "Czarna prasa": "The black press",
  "Wolne słowo": "The free word",
  "Podziemna poczta": "The underground post",
  "Drugi obieg, zwany też samizdatem — druk i kolportaż poza cenzurą.":
    "The second circulation, also called samizdat — printing and distribution outside the censorship.",
  "Jaki organ powstał po strajkach w Radomiu i Ursusie w 1976 roku?":
    "What body was formed after the strikes in Radom and Ursus in 1976?",
  "Komitet Obrony Robotników": "The Workers' Defence Committee",
  "Polska Zjednoczona Partia Robotnicza": "The Polish United Workers' Party",
  "Rada Państwa": "The Council of State",
  "KOR — inteligenci wspierający represjonowanych robotników; jeden z korzeni Solidarności.":
    "The KOR — intellectuals supporting the workers who had been punished; one of the roots of Solidarność.",
  "Co oznaczały kartki w PRL?": "What did ration cards mean in the People's Republic?",
  "Reglamentację towarów, na przykład mięsa i cukru":
    "The rationing of goods, meat and sugar for instance",
  "Bilety komunikacji miejskiej": "Tickets for public transport",
  "Zaproszenia na zebrania partyjne": "Invitations to party meetings",
  "Legitymacje szkolne": "School identity cards",
  "System kartkowy przydzielał ograniczone ilości towarów w gospodarce niedoboru.":
    "The card system handed out limited quantities of goods in an economy of shortage.",
  "Jak nazywały się rozmowy władzy z opozycją wiosną 1989 roku?":
    "What were the talks between the authorities and the opposition in the spring of 1989 called?",
  "Porozumienia sierpniowe": "The August Agreements",
  "Konferencja w Poczdamie": "The Potsdam Conference",
  "Pakt gdański": "The Gdańsk Pact",
  "Okrągły Stół; ustalono na nim częściowo wolne wybory 4 czerwca.":
    "The Round Table; it settled the partly free elections of 4 June.",
  "Kto został pierwszym niekomunistycznym premierem w bloku wschodnim?":
    "Who became the first non-communist prime minister in the eastern bloc?",
  "Leszek Balcerowicz": "Leszek Balcerowicz",
  "Jan Olszewski": "Jan Olszewski",
  "Tadeusz Mazowiecki, we wrześniu 1989 roku.": "Tadeusz Mazowiecki, in September 1989.",
  "Jak nazywał się program reform gospodarczych z 1990 roku?":
    "What was the programme of economic reform of 1990 called?",
  "Program Wilczka": "The Wilczek programme",
  "Plan Balcerowicza otworzył rynek; ceny wzrosły, ale zniknęły puste półki.":
    "The Balcerowicz plan opened the market; prices rose, but the empty shelves went.",
  "Co zmieniła reforma administracyjna z 1999 roku?":
    "What did the administrative reform of 1999 change?",
  "49 województw zastąpiono 16 i przywrócono powiaty":
    "49 voivodeships were replaced by 16 and the powiats came back",
  "Zniesiono gminy": "The gminas were abolished",
  "Wprowadzono podział na dzielnice": "A division into districts was brought in",
  "Połączono województwa z powiatami": "The voivodeships were merged with the powiats",
  "Z 49 województw zrobiono 16, a powiaty wróciły jako środkowy szczebel.":
    "49 voivodeships became 16, and the powiats returned as the middle level.",
  "Ilu członków miało Zgromadzenie Narodowe wybrać na prezydenta w 1989 roku, zanim wprowadzono wybory powszechne?":
    "How was the president chosen in 1989, before general elections were brought in?",
  "Prezydenta wybrało wtedy Zgromadzenie Narodowe, nie obywatele":
    "The National Assembly chose the president then, not the citizens",
  "Prezydenta wybrali obywatele już w 1989 roku":
    "The citizens already elected the president in 1989",
  "Urzędu prezydenta wtedy nie było": "There was no office of president then",
  "Prezydenta wskazał premier": "The prime minister named the president",
  "W 1989 roku prezydenta wybrało Zgromadzenie Narodowe; pierwsze wybory powszechne odbyły się rok później.":
    "In 1989 the National Assembly chose the president; the first general election came a year later.",
  "Co wydarzyło się 10 kwietnia 2010 roku?": "What happened on 10 April 2010?",
  "Katastrofa samolotu pod Smoleńskiem": "The aircraft crash near Smolensk",
  "Wejście do strefy Schengen": "Entry into the Schengen area",
  "Referendum europejskie": "The European referendum",
  "Powódź tysiąclecia": "The flood of the millennium",
  "Zginęło 96 osób, w tym prezydent Lech Kaczyński. Delegacja leciała na obchody rocznicy zbrodni katyńskiej.":
    "96 people died, among them President Lech Kaczyński. The delegation was flying to the commemoration of the Katyn massacre.",
  "W którym roku odbyły się w Polsce pierwsze wolne wybory samorządowe?":
    "In which year were the first free local elections held in Poland?",
  "1990 — odrodziły się wtedy gminy jako samorząd.":
    "1990 — that is when the gminas were reborn as local government.",
  "Z iloma państwami graniczy Polska?": "How many states does Poland border on?",
  "Z pięcioma": "Five",
  "Z sześcioma": "Six",
  "Z siedmioma": "Seven",
  "Z ośmioma": "Eight",
  "Siedem: Niemcy, Czechy, Słowacja, Ukraina, Białoruś, Litwa i Rosja.":
    "Seven: Germany, Czechia, Slovakia, Ukraine, Belarus, Lithuania and Russia.",
  "Nad którym morzem leży Polska?": "Which sea does Poland lie on?",
  "Nad Bałtykiem": "The Baltic",
  "Nad Morzem Północnym": "The North Sea",
  "Nad Adriatykiem": "The Adriatic",
  "Nad Morzem Czarnym": "The Black Sea",
  "Nad Morzem Bałtyckim, na północy kraju.": "On the Baltic Sea, in the north of the country.",
  "Ile wynosi powierzchnia Polski?": "What is the area of Poland?",
  "Około 213 tysięcy km²": "About 213 thousand km²",
  "Około 312 tysięcy km²": "About 312 thousand km²",
  "Około 412 tysięcy km²": "About 412 thousand km²",
  "Około 512 tysięcy km²": "About 512 thousand km²",
  "Około 312 700 km² — szóste miejsce w Unii Europejskiej.":
    "About 312,700 km² — sixth place in the European Union.",
  "Jak nazywa się kraina jezior na północnym wschodzie kraju?":
    "What is the lakeland in the north-east of the country called?",
  "Podlasie": "Podlasie",
  "Kaszuby": "Kashubia",
  "Kujawy": "Kuyavia",
  "Mazury; największe jezioro to Śniardwy.": "Masuria; the largest lake is Śniardwy.",
  "Które zwierzę jest symbolem Puszczy Białowieskiej?":
    "Which animal is the symbol of the Białowieża Forest?",
  "Żubr": "The European bison",
  "Ryś": "The lynx",
  "Niedźwiedź": "The bear",
  "Bocian": "The stork",
  "Żubr. Puszcza Białowieska jest ostatnim fragmentem pierwotnej puszczy niżowej Europy.":
    "The European bison. The Białowieża Forest is the last piece of Europe's primeval lowland forest.",
  "Jaki klimat panuje w Polsce?": "What climate does Poland have?",
  "Umiarkowany przejściowy": "Temperate and transitional",
  "Śródziemnomorski": "Mediterranean",
  "Kontynentalny suchy": "Dry continental",
  "Oceaniczny wilgotny": "Wet oceanic",
  "Przejściowy między morskim a kontynentalnym — stąd zmienna pogoda i wyraźne cztery pory roku.":
    "Transitional between maritime and continental — hence the changeable weather and four clear seasons.",
  "Ile parków narodowych jest w Polsce?": "How many national parks are there in Poland?",
  "23": "23",
  "23. Najwyżej położony to Tatrzański, nad morzem leży Słowiński z ruchomymi wydmami.":
    "23. The highest is the Tatra park, and on the coast lies the Słowiński park with its moving dunes.",
  "W którym kierunku opada rzeźba terenu Polski?": "Which way does the land of Poland slope?",
  "Z południa na północ": "From south to north",
  "Ze wschodu na zachód": "From east to west",
  "Z północy na południe": "From north to south",
  "Z zachodu na wschód": "From west to east",
  "Góry na południu, niziny i wybrzeże na północy — dlatego rzeki płyną na północ.":
    "Mountains in the south, lowlands and coast in the north — which is why the rivers run north.",
  "Ile metrów wysokości mają Rysy?": "How high is Rysy?",
  "1602 m": "1602 m",
  "2499 m": "2499 m",
  "3000 m": "3000 m",
  "1725 m": "1725 m",
  "2499 m n.p.m. Śnieżka w Karkonoszach ma 1602 m.":
    "2499 m above sea level. Śnieżka in the Karkonosze is 1602 m.",
  "Które miasto jest stolicą Polski?": "Which city is the capital of Poland?",
  "Warszawa, od końca XVI wieku. Wcześniej stolicą był Kraków.":
    "Warsaw, since the end of the sixteenth century. Before that the capital was Kraków.",
  "Ile mniej więcej osób mieszka w Polsce?": "Roughly how many people live in Poland?",
  "Około 18 milionów": "About 18 million",
  "Około 28 milionów": "About 28 million",
  "Około 37 milionów": "About 37 million",
  "Około 50 milionów": "About 50 million",
  "Około 37–38 milionów.": "About 37 to 38 million.",
  "Które miasto jest największym portem Polski?": "Which city is Poland's largest port?",
  "Kołobrzeg": "Kołobrzeg",
  "Gdańsk — także miasto porozumień sierpniowych i początku Solidarności.":
    "Gdańsk — also the city of the August Agreements and the start of Solidarność.",
  "Nad którą rzeką leży Wrocław?": "Which river does Wrocław lie on?",
  "Nad Wisłą": "The Vistula",
  "Nad Odrą": "The Oder",
  "Nad Wartą": "The Warta",
  "Nad Bugiem": "The Bug",
  "Nad Odrą. Poznań leży nad Wartą, Warszawa i Kraków nad Wisłą.":
    "The Oder. Poznań lies on the Warta, and Warsaw and Kraków on the Vistula.",
  "Który obiekt w Polsce wpisano na listę UNESCO jako kopalnię czynną od średniowiecza?":
    "Which site in Poland is on the UNESCO list as a mine worked since the Middle Ages?",
  "Wieliczkę": "Wieliczka",
  "Zamość": "Zamość",
  "Malbork": "Malbork",
  "Toruń": "Toruń",
  "Kopalnia soli w Wieliczce, z kaplicami wykutymi w solnej skale.":
    "The salt mine at Wieliczka, with chapels cut into the rock salt.",
  "Za co wpisano warszawską Starówkę na listę UNESCO?":
    "Why was Warsaw's Old Town put on the UNESCO list?",
  "Za powojenną odbudowę zniszczonego miasta": "For the post-war rebuilding of the ruined city",
  "Za zachowane oryginalne mury średniowieczne": "For its preserved original medieval walls",
  "Za architekturę modernistyczną": "For its modernist architecture",
  "Za układ urbanistyczny z XIX wieku": "For its nineteenth-century town plan",
  "Właśnie za odbudowę — wyjątkowy przypadek na tej liście.":
    "For the rebuilding itself — an unusual case on that list.",
  "Które województwo ma siedziby władz w dwóch różnych miastach?":
    "Which voivodeship has its seats of power in two different cities?",
  "Kujawsko-pomorskie": "Kuyavian-Pomeranian",
  "Mazowieckie": "Masovian",
  "Małopolskie": "Lesser Poland",
  "Podlaskie": "Podlaskie",
  "Sejmik obraduje w Toruniu, a wojewoda urzęduje w Bydgoszczy. Podobnie dzieli się województwo lubuskie.":
    "The sejmik, the voivodeship assembly, sits in Toruń, while the voivode has their office in Bydgoszcz. The Lubusz voivodeship is split the same way.",
  "Jaki język ma w Polsce status języka regionalnego?":
    "Which language has the status of a regional language in Poland?",
  "Kaszubski": "Kashubian",
  "Śląski": "Silesian",
  "Łemkowski": "Lemko",
  "Góralski": "The highlanders' speech",
  "Kaszubski. Uznanych mniejszości narodowych jest dziewięć, etnicznych cztery.":
    "Kashubian. There are nine recognised national minorities and four ethnic ones.",
  "Które miasto jest siedzibą Uniwersytetu Jagiellońskiego?":
    "Which city is the seat of the Jagiellonian University?",
  "Lublin": "Lublin",
  "Kraków; uczelnia działa od 1364 roku.": "Kraków; the university has been running since 1364.",
  "Na ile groszy dzieli się złoty?": "How many grosze does the złoty divide into?",
  "10": "10",
  "1000": "1000",
  "Na 100 groszy.": "Into 100 grosze.",
  "Który bank emituje polski pieniądz?": "Which bank issues Polish money?",
  "Bank Gospodarstwa Krajowego": "Bank Gospodarstwa Krajowego, the state development bank",
  "Europejski Bank Centralny": "The European Central Bank",
  "PKO BP": "PKO BP",
  "Narodowy Bank Polski. EBC emituje euro, którego Polska nie przyjęła.":
    "The National Bank of Poland. The European Central Bank issues the euro, which Poland has not adopted.",
  "Ile wynosi podstawowa stawka VAT?": "What is the basic rate of VAT?",
  "19 procent": "19 per cent",
  "21 procent": "21 per cent",
  "23 procent": "23 per cent",
  "25 procent": "25 per cent",
  "23 procent. Na żywność, książki i niektóre usługi obowiązują stawki niższe.":
    "23 per cent. Lower rates apply to food, books and some services.",
  "Ile dni urlopu przysługuje pracownikowi ze stażem powyżej 10 lat?":
    "How many days of leave does an employee with more than 10 years' service get?",
  "20 dni": "20 days",
  "24 dni": "24 days",
  "26 dni": "26 days",
  "26 dni. Poniżej 10 lat stażu — 20 dni. Nauka wlicza się do stażu.":
    "26 days. Under 10 years' service it is 20 days. Time in education counts towards the service.",
  "Która instytucja pobiera składki emerytalne i rentowe?":
    "Which institution collects pension and disability contributions?",
  "ZUS": "ZUS",
  "NBP": "The NBP",
  "KRUS dla wszystkich": "KRUS, for everybody",
  "Zakład Ubezpieczeń Społecznych. NFZ finansuje leczenie, KRUS dotyczy rolników.":
    "The Social Insurance Institution, ZUS. The NFZ pays for treatment, and KRUS covers farmers.",
  "W jakim wieku przechodzą na emeryturę kobiety i mężczyźni?":
    "At what age do women and men retire?",
  "Kobiety w wieku 60 lat, mężczyźni 65": "Women at 60, men at 65",
  "Wszyscy w wieku 65 lat": "Everyone at 65",
  "Kobiety 62, mężczyźni 67": "Women at 62, men at 67",
  "Wszyscy w wieku 67 lat": "Everyone at 67",
  "60 i 65 lat. Wysokość emerytury zależy od sumy składek i przewidywanej długości życia.":
    "60 and 65. The size of the pension depends on the contributions paid and on life expectancy.",
  "Gdzie wpisuje się spółki, a nie jednoosobową działalność?":
    "Where are companies entered, as opposed to sole traders?",
  "Do KRS": "In the KRS",
  "Do CEIDG": "In CEIDG",
  "Do ZUS": "At ZUS",
  "Do urzędu skarbowego": "At the tax office",
  "Krajowy Rejestr Sądowy. CEIDG służy jednoosobowej działalności gospodarczej.":
    "The National Court Register, KRS. CEIDG is for sole traders.",
  "Ile godzin dziennie wynosi zasadniczo czas pracy?":
    "How many hours a day is the standard working time?",
  "6 godzin": "6 hours",
  "7 godzin": "7 hours",
  "8 godzin": "8 hours",
  "10 godzin": "10 hours",
  "8 godzin dziennie i przeciętnie 40 tygodniowo w przyjętym okresie rozliczeniowym.":
    "8 hours a day and 40 a week on average over the agreed reference period.",
  "Jaki numer identyfikacyjny jest potrzebny do rozliczeń podatkowych firmy?":
    "Which identifying number does a company need for its tax affairs?",
  "NIP": "The NIP",
  "REGON": "REGON",
  "IBAN": "The IBAN",
  "NIP. PESEL identyfikuje osobę fizyczną, REGON jest numerem statystycznym.":
    "The NIP. PESEL identifies a natural person, and REGON is a statistical number.",
  "Ile państw wstąpiło do Unii Europejskiej razem z Polską w 2004 roku?":
    "How many states joined the European Union together with Poland in 2004?",
  "Cztery": "Four",
  "Dziewięć": "Nine",
  "Dwanaście": "Twelve",
  "Polska i dziewięć innych państw — największe rozszerzenie w historii Unii.":
    "Poland and nine other states — the largest enlargement in the Union's history.",
  "Od kiedy Polska należy do strefy Schengen?":
    "How long has Poland belonged to the Schengen area?",
  "Od 1999": "Since 1999",
  "Od 2004": "Since 2004",
  "Od 2007": "Since 2007",
  "Od 2014": "Since 2014",
  "Od 2007 roku — granice wewnętrzne przekracza się od tej pory bez kontroli.":
    "Since 2007 — the internal borders have been crossed without checks ever since.",
  "Jak nazywa się współpraca regionalna Polski z Czechami, Słowacją i Węgrami?":
    "What is Poland's regional cooperation with Czechia, Slovakia and Hungary called?",
  "Grupa Wyszehradzka": "The Visegrád Group",
  "Trójkąt Weimarski": "The Weimar Triangle",
  "Rada Nordycka": "The Nordic Council",
  "Inicjatywa Trójmorza": "The Three Seas Initiative",
  "Grupa Wyszehradzka. Trójkąt Weimarski to współpraca z Niemcami i Francją.":
    "The Visegrád Group. The Weimar Triangle is the cooperation with Germany and France.",
  "Co ile lat Polacy wybierają posłów do Parlamentu Europejskiego?":
    "How often do Poles elect members of the European Parliament?",
  "Co 7 lat": "Every 7 years",
  "Co 5 lat, w wyborach bezpośrednich.": "Every 5 years, in direct elections.",
  "Jaka część głosujących poparła wejście do Unii w referendum z 2003 roku?":
    "What share of voters backed joining the Union in the referendum of 2003?",
  "Ponad połowa": "More than half",
  "Ponad dwie trzecie": "More than two thirds",
  "Ponad trzy czwarte": "More than three quarters",
  "Ponad dziewięć dziesiątych": "More than nine tenths",
  "Ponad trzy czwarte głosujących, przy frekwencji blisko 59 procent.":
    "More than three quarters of those who voted, on a turnout of nearly 59 per cent.",
  "Dlaczego wschodnia granica Polski ma szczególne znaczenie?":
    "Why does Poland's eastern border matter especially?",
  "Jest zarazem zewnętrzną granicą Unii Europejskiej i NATO":
    "It is at once the external border of the European Union and of NATO",
  "Jest najkrótszą granicą kraju": "It is the country's shortest border",
  "Nie jest strzeżona": "It is not guarded",
  "Przebiega wyłącznie po rzekach": "It runs entirely along rivers",
  "Granica z Ukrainą, Białorusią i Rosją jest granicą zewnętrzną obu organizacji.":
    "The border with Ukraine, Belarus and Russia is the external border of both organisations.",
  "Ile mniej więcej osób liczy Polonia na świecie?":
    "Roughly how many people make up the Polish diaspora worldwide?",
  "Około miliona": "About a million",
  "Kilka milionów": "A few million",
  "Kilkanaście do dwudziestu milionów": "Somewhere between ten and twenty million",
  "Ponad pięćdziesiąt milionów": "More than fifty million",
  "Szacunki mówią o kilkunastu do dwudziestu milionów; największe skupiska są w USA, Niemczech i Wielkiej Brytanii.":
    "Estimates put it at between ten and twenty million; the largest communities are in the United States, Germany and Britain.",
  "Co stało się w Polsce po pełnoskalowej agresji Rosji na Ukrainę w 2022 roku?":
    "What happened in Poland after Russia's full-scale attack on Ukraine in 2022?",
  "Przez kraj przeszły miliony uchodźców": "Millions of refugees passed through the country",
  "Zamknięto granicę zachodnią": "The western border was closed",
  "Wprowadzono stan wojenny": "Martial law was imposed",
  "Polska wystąpiła z NATO": "Poland left NATO",
  "Największy ruch ludności w tej części Europy od czasów II wojny światowej.":
    "The largest movement of people in this part of Europe since the Second World War.",
  "Które wyznanie deklaruje w Polsce największa część mieszkańców?":
    "Which faith do most inhabitants of Poland declare?",
  "Rzymskokatolickie": "Roman Catholic",
  "Prawosławne": "Orthodox",
  "Ewangelickie": "Protestant",
  "Żadne": "None",
  "Rzymskokatolickie, choć udział praktykujących od lat maleje.":
    "Roman Catholic, though the share who practise has been falling for years.",
  "Jaka umowa reguluje stosunki państwa z Kościołem katolickim?":
    "Which agreement settles the state's relations with the Catholic Church?",
  "Konkordat": "The concordat",
  "Ustawa wyznaniowa": "A statute on religion",
  "Konkordat ze Stolicą Apostolską z 1993 roku.": "The concordat with the Holy See of 1993.",
  "W którym regionie mieszka najwięcej wyznawców prawosławia?":
    "In which region do most Orthodox believers live?",
  "Na Podlasiu": "In Podlasie",
  "Na Śląsku": "In Silesia",
  "Na Pomorzu": "In Pomerania",
  "W Wielkopolsce": "In Greater Poland",
  "Na Podlasiu, przy wschodniej granicy kraju.": "In Podlasie, on the country's eastern border.",
  "Kto decyduje, czy dziecko chodzi w szkole na religię?":
    "Who decides whether a child takes religion at school?",
  "Rodzice albo pełnoletni uczeń": "The parents, or the pupil once of age",
  "Dyrektor szkoły": "The head teacher",
  "Proboszcz parafii": "The parish priest",
  "Religia jest nieobowiązkowa; alternatywą jest etyka albo żadne z tych zajęć.":
    "Religion is not compulsory; the alternative is ethics, or neither of the two.",
  "Gdzie stoją zabytkowe meczety Tatarów polskich?":
    "Where do the historic mosques of the Polish Tatars stand?",
  "W Kruszynianach i Bohonikach": "In Kruszyniany and Bohoniki",
  "W Zakopanem i Nowym Targu": "In Zakopane and Nowy Targ",
  "W Gdańsku i Gdyni": "In Gdańsk and Gdynia",
  "We Wrocławiu i Opolu": "In Wrocław and Opole",
  "Na Podlasiu; Tatarzy osiedli tam przed wiekami.":
    "In Podlasie; the Tatars settled there centuries ago.",
  "W którym regionie żyje najwięcej ewangelików?": "In which region do most Protestants live?",
  "Na Śląsku Cieszyńskim": "In Cieszyn Silesia",
  "Na Mazurach": "In Masuria",
  "Na Kaszubach": "In Kashubia",
  "W Małopolsce": "In Lesser Poland",
  "Na Śląsku Cieszyńskim, gdzie protestantyzm ma nieprzerwaną tradycję od reformacji.":
    "In Cieszyn Silesia, where Protestantism has an unbroken tradition going back to the Reformation.",
  "Czy Polska ma religię państwową?": "Does Poland have a state religion?",
  "Nie": "No",
  "Tak, katolicyzm": "Yes, Catholicism",
  "Tak, prawosławie": "Yes, Orthodoxy",
  "Tak, ale tylko formalnie": "Yes, but only formally",
  "Nie. Państwo jest bezstronne w sprawach przekonań religijnych.":
    "No. The state is impartial in matters of religious belief.",
  "Które miasto jest siedzibą prymasa Polski?": "Which city is the seat of the Primate of Poland?",
  "Częstochowa": "Częstochowa",
  "Gniezno, pierwsza stolica i najstarsza metropolia w kraju.":
    "Gniezno, the first capital and the country's oldest archdiocese.",
  "Co upamiętnia 1 sierpnia?": "What does 1 August commemorate?",
  "Powstanie Warszawskie z 1944 roku. O 17.00 w Warszawie wyją syreny.":
    "The Warsaw Uprising of 1944. At five in the afternoon the sirens sound across Warsaw.",
  "Który dzień jest w Polsce Świętem Wojska Polskiego?":
    "Which day is the feast of the Polish Army?",
  "15 sierpnia": "15 August",
  "15 sierpnia, w rocznicę Bitwy Warszawskiej; tego samego dnia przypada Wniebowzięcie.":
    "15 August, the anniversary of the Battle of Warsaw; the Assumption falls on the same day.",
  "Ile potraw tradycyjnie podaje się na wigilijnym stole?":
    "How many dishes are traditionally served at the Christmas Eve table?",
  "Trzynaście": "Thirteen",
  "Dwanaście. Zwyczajowo zostawia się też jedno wolne miejsce przy stole.":
    "Twelve. By custom one place at the table is also left free.",
  "Jak nazywa się zwyczaj polewania wodą w poniedziałek wielkanocny?":
    "What is the custom of pouring water over people on Easter Monday called?",
  "Dożynki": "Dożynki, the harvest festival",
  "Ostatki": "Ostatki, the last days before Lent",
  "Śmigus-dyngus — zwyczaj starszy niż chrześcijaństwo w Polsce.":
    "Śmigus-dyngus — a custom older than Christianity in Poland.",
  "Co robi się w Polsce 1 listopada?": "What do people in Poland do on 1 November?",
  "Odwiedza się groby bliskich i zapala znicze":
    "They visit the graves of their families and light candles",
  "Świętuje się początek roku szkolnego": "They celebrate the start of the school year",
  "Obchodzi się rocznicę niepodległości": "They mark the anniversary of independence",
  "Organizuje się dożynki": "They hold the harvest festival",
  "Wszystkich Świętych. Cmentarze świecą wtedy przez całą noc.":
    "All Saints. The cemeteries glow all night.",
  "Kiedy obchodzi się andrzejki?": "When is andrzejki celebrated?",
  "29 listopada": "29 November",
  "6 grudnia": "6 December",
  "31 grudnia": "31 December",
  "2 lutego": "2 February",
  "Wieczór 29 listopada, z wróżbami z lanego wosku. 6 grudnia to mikołajki.":
    "The evening of 29 November, with fortunes told from poured wax. 6 December is mikołajki.",
  "Kiedy zaczyna się w Polsce rok szkolny?": "When does the school year start in Poland?",
  "1 września": "1 September",
  "15 września": "15 September",
  "1 października": "1 October",
  "Po Wszystkich Świętych": "After All Saints",
  "1 września; kończy się w drugiej połowie czerwca.":
    "1 September; it ends in the second half of June.",
  "Które dwa dni grudnia są w Polsce wolne od pracy z okazji Bożego Narodzenia?":
    "Which two days in December are non-working days for Christmas in Poland?",
  "24 i 25 grudnia": "24 and 25 December",
  "25 i 26 grudnia": "25 and 26 December",
  "26 i 27 grudnia": "26 and 27 December",
  "24 i 31 grudnia": "24 and 31 December",
  "25 i 26 grudnia. Wigilia 24 grudnia jest dniem pracującym, choć zwykle skróconym.":
    "25 and 26 December. Christmas Eve on the 24th is a working day, though usually a short one.",
  "Jakim egzaminem kończy się szkoła podstawowa?": "Which examination ends primary school?",
  "Egzaminem ósmoklasisty": "The eighth-year examination",
  "Maturą": "The matura",
  "Egzaminem zawodowym": "The vocational examination",
  "Testem kompetencji": "A competence test",
  "Egzaminem ósmoklasisty. Matura kończy liceum albo technikum.":
    "The eighth-year examination. The matura ends the liceum or the technikum.",
  "Ile lat trwa liceum ogólnokształcące?": "How many years does the general liceum last?",
  "3 lata": "3 years",
  "Cztery lata. Technikum trwa pięć.": "Four years. The technikum lasts five.",
  "Czy studia dzienne na uczelniach publicznych są płatne?":
    "Is full-time study at state universities paid for?",
  "Nie, są bezpłatne": "No; it is free",
  "Tak, dla wszystkich": "Yes, for everyone",
  "Tak, poza pierwszym rokiem": "Yes, apart from the first year",
  "Studia dzienne na uczelniach publicznych są bezpłatne; płatne bywają zaoczne i uczelnie prywatne.":
    "Full-time study at state universities is free; part-time courses and private universities can charge.",
  "Która instytucja finansuje leczenie ze składek?":
    "Which institution pays for treatment out of contributions?",
  "KRUS": "KRUS",
  "GUS": "GUS",
  "Narodowy Fundusz Zdrowia. ZUS zajmuje się emeryturami i rentami.":
    "The National Health Fund, NFZ. ZUS deals with pensions and disability payments.",
  "Do kogo idzie się najpierw z problemem zdrowotnym?":
    "Who do you go to first with a health problem?",
  "Do lekarza rodzinnego": "To the family doctor",
  "Bezpośrednio do specjalisty": "Straight to a specialist",
  "Na izbę przyjęć": "To the emergency department",
  "Do apteki": "To the pharmacy",
  "Lekarz podstawowej opieki zdrowotnej kieruje dalej do specjalisty.":
    "The primary care doctor refers you on to a specialist.",
  "Ile cyfr ma numer PESEL?": "How many digits does a PESEL number have?",
  "Dziesięć": "Ten",
  "Jedenaście": "Eleven",
  "Jedenaście. Zawiera datę urodzenia, a przedostatnia cyfra oznacza płeć.":
    "Eleven. It holds the date of birth, and the second-to-last digit gives the sex.",
  "Jak dziś wygląda recepta na lek?": "What does a prescription look like today?",
  "To e-recepta: kod z SMS-a albo z aplikacji":
    "It is an e-prescription: a code from a text message or from an app",
  "Papierowy druk z pieczątką": "A paper form with a stamp",
  "Wpis do książeczki zdrowia": "An entry in a health booklet",
  "Ustne polecenie lekarza": "The doctor's spoken instruction",
  "E-recepta. Część leków jest refundowana, czyli tańsza dzięki dopłacie NFZ.":
    "The e-prescription. Some medicines are reimbursed, that is, made cheaper by a payment from the NFZ.",
  "Która uczelnia w Polsce jest najstarsza?": "Which university in Poland is the oldest?",
  "Politechnika Warszawska": "The Warsaw University of Technology",
  "Uniwersytet Jagielloński, założony w 1364 roku.":
    "The Jagiellonian University, founded in 1364.",
  "Gdzie załatwia się większość spraw urzędowych mieszkańca?":
    "Where does a resident settle most official business?",
  "W urzędzie gminy albo miasta": "At the gmina or town office",
  "W sądzie rejonowym": "At the district court",
  "W urzędzie skarbowym": "At the tax office",
  "W urzędzie gminy lub miasta, a coraz częściej przez internet.":
    "At the gmina or town office, and more and more often online.",
  "Co pozwala potwierdzić tożsamość w urzędowych sprawach przez internet?":
    "What lets you prove your identity for official business online?",
  "Profil zaufany": "The Profil Zaufany, the trusted profile",
  "Numer REGON": "The REGON number",
  "Karta biblioteczna": "A library card",
  "Adres e-mail": "An email address",
  "Profil zaufany, obok aplikacji mObywatel.": "The Profil Zaufany, alongside the mObywatel app.",
  "Jak wygląda handel w niedziele?": "What is Sunday trading like?",
  "Jest ograniczony ustawą, z wyjątkami": "A statute restricts it, with exceptions",
  "Jest całkowicie zakazany": "It is banned altogether",
  "Odbywa się bez ograniczeń": "It goes on without restriction",
  "Zależy od decyzji wojewody": "It depends on the voivode's decision",
  "Otwarte pozostają między innymi piekarnie, stacje paliw i sklepy prowadzone przez właściciela.":
    "Bakeries, petrol stations and shops run by their owner, among others, stay open.",
  "Jak zwraca się do osoby starszej albo nieznajomej?":
    "How do you address someone older, or a stranger?",
  "„Pan” albo „pani”": "As \"pan\" or \"pani\", sir or madam",
  "Po imieniu": "By first name",
  "„Cześć”": "With \"cześć\", hello",
  "„Ty”": "With \"ty\", the familiar you",
  "Formy „pan” i „pani” są w Polsce standardem wobec osób nieznajomych i starszych.":
    "The forms \"pan\" and \"pani\" are the standard in Poland for strangers and for older people.",
  "Który organ konstytucyjny czuwa nad rynkiem mediów?":
    "Which constitutional body watches over the media market?",
  "Krajowa Rada Radiofonii i Telewizji": "The National Broadcasting Council",
  "Ministerstwo Kultury": "The ministry of culture",
  "Urząd Ochrony Konkurencji i Konsumentów": "The Office of Competition and Consumer Protection",
  "KRRiT, wymieniona wprost w Konstytucji.": "The KRRiT, named expressly in the Constitution.",
  "Co ile lat odbywa się w Warszawie Konkurs Chopinowski?":
    "How often is the Chopin Competition held in Warsaw?",
  "Co dwa lata": "Every two years",
  "Co trzy lata": "Every three years",
  "Co pięć lat": "Every five years",
  "Co dziesięć lat": "Every ten years",
  "Co pięć lat — jeden z najstarszych konkursów pianistycznych na świecie.":
    "Every five years — one of the oldest piano competitions in the world.",
  "Które dyscypliny sportu są w Polsce najpopularniejsze?":
    "Which sports are the most popular in Poland?",
  "Piłka nożna i siatkówka": "Football and volleyball",
  "Krykiet i rugby": "Cricket and rugby",
  "Baseball i hokej": "Baseball and ice hockey",
  "Golf i tenis": "Golf and tennis",
  "Piłka nożna i siatkówka; zimą kraj ogląda też skoki narciarskie.":
    "Football and volleyball; in winter the country also watches ski jumping.",
  "Które danie jest tradycyjną potrawą polskiej kuchni?":
    "Which dish is traditional in Polish cooking?",
  "Pierogi": "Pierogi, filled dumplings",
  "Paella": "Paella",
  "Sushi": "Sushi",
  "Gulasz węgierski": "Hungarian goulash",
  "Pierogi, obok bigosu, żurku, rosołu i kotleta schabowego.":
    "Pierogi, alongside bigos, żurek, broth and the breaded pork cutlet.",
  "Jak wygląda własność mieszkań w Polsce na tle Europy?":
    "How does home ownership in Poland compare with the rest of Europe?",
  "Udział własności jest jednym z najwyższych": "The share of owners is one of the highest",
  "Prawie wszyscy wynajmują": "Almost everyone rents",
  "Mieszkania należą do gmin": "The flats belong to the gminas",
  "Własność jest zakazana": "Ownership is forbidden",
  "Większość ludzi mieszka we własnym mieszkaniu albo domu.":
    "Most people live in a flat or a house of their own.",
  "Który poeta jest jednym z najbardziej znanych twórców dwudziestolecia międzywojennego?":
    "Which poet is one of the best known writers of the interwar years?",
  "Julian Tuwim": "Julian Tuwim",
  "Wisława Szymborska": "Wisława Szymborska",
  "Julian Tuwim. Mickiewicz to romantyzm, Kochanowski renesans, Szymborska druga połowa XX wieku.":
    "Julian Tuwim. Mickiewicz belongs to Romanticism, Kochanowski to the Renaissance, and Szymborska to the second half of the twentieth century.",
  "W którym roku powstało Polskie Radio?": "In which year was Polish Radio founded?",
  "1924": "1924",
  "1930": "1930",
  "1924 — jedna z instytucji budowanych w młodym państwie od podstaw.":
    "1924 — one of the institutions built from nothing in the young state.",
  "Który konflikt zakończyła Bitwa Warszawska?": "Which conflict did the Battle of Warsaw end?",
  "Wojnę z Rosją bolszewicką": "The war with Bolshevik Russia",
  "I wojnę światową": "The First World War",
  "Powstanie wielkopolskie": "The Greater Poland Uprising",
  "Wojnę z Czechosłowacją": "The war with Czechoslovakia",
  "Wojnę polsko-bolszewicką. Zatrzymała ofensywę zmierzającą na zachód Europy.":
    "The Polish-Bolshevik war. It stopped an advance heading for western Europe.",
  "Jaką część miejsc w Senacie zdobyła Solidarność w wyborach 4 czerwca 1989 roku?":
    "How many seats in the Senat did Solidarność win in the election of 4 June 1989?",
  "99 na 100": "99 out of 100",
  "65 na 100": "65 out of 100",
  "50 na 100": "50 out of 100",
  "35 na 100": "35 out of 100",
  "99 na 100. W Sejmie zdobyła wszystkie mandaty, o które wolno jej było się ubiegać.":
    "99 out of 100. In the Sejm it won every seat it was allowed to contest.",
  "Kto był prezydentem Polski bezpośrednio po Lechu Wałęsie?":
    "Who was president of Poland immediately after Lech Wałęsa?",
  "Lech Kaczyński": "Lech Kaczyński",
  "Bronisław Komorowski": "Bronisław Komorowski",
  "Andrzej Duda": "Andrzej Duda",
  "Aleksander Kwaśniewski, przez dwie kadencje.": "Aleksander Kwaśniewski, for two terms.",
  "Jaka była największa zmiana gospodarcza początku lat dziewięćdziesiątych?":
    "What was the biggest economic change of the early nineties?",
  "Przejście od gospodarki planowanej do rynkowej":
    "The move from a planned economy to a market one",
  "Wprowadzenie euro": "The introduction of the euro",
  "Nacjonalizacja przemysłu": "The nationalisation of industry",
  "Wprowadzenie kartek na żywność": "The introduction of food rationing",
  "Otwarcie rynku. Ceny wzrosły i wiele zakładów upadło, ale niedobory się skończyły.":
    "The opening of the market. Prices rose and many works closed, but the shortages ended.",
  "Czy Konstytucja nakłada obowiązki także na osoby niebędące obywatelami?":
    "Does the Constitution place duties on people who are not citizens as well?",
  "Tak, obowiązek przestrzegania prawa dotyczy każdego":
    "Yes; the duty to obey the law falls on everyone",
  "Nie, wyłącznie na obywateli": "No, on citizens alone",
  "Tylko na osoby pracujące": "Only on people in work",
  "Tylko na osoby zameldowane": "Only on people registered as resident",
  "Przestrzeganie prawa obowiązuje każdego pod władzą Rzeczypospolitej; obrona ojczyzny — obywateli.":
    "Obeying the law binds everyone under the Republic's authority; defending the homeland binds citizens.",
  "Czym jest wstępnie wypełnione zeznanie podatkowe?": "What is a pre-filled tax return?",
  "Rozliczeniem przygotowanym przez urząd, które wystarczy sprawdzić i zatwierdzić":
    "A return the office prepares, which you need only check and approve",
  "Zeznaniem składanym przez pracodawcę zamiast pracownika":
    "A return the employer files instead of the employee",
  "Wnioskiem o zwolnienie z podatku": "An application for exemption from tax",
  "Deklaracją składaną co miesiąc": "A declaration filed every month",
  "Urząd skarbowy udostępnia je przez internet; podatnik może je poprawić albo przyjąć.":
    "The tax office makes it available online; the taxpayer can correct it or accept it.",
  "Kto wybiera ławników?": "Who elects the lay judges?",
  "Rady gmin": "The gmina councils",
  "Minister Sprawiedliwości": "The minister of justice",
  "Rady gmin. Przy wyrokowaniu ławnik ma taki sam głos jak sędzia zawodowy.":
    "The gmina councils. In reaching a verdict a lay judge has the same vote as a professional judge.",
  "Czy Trybunał Konstytucyjny może zmienić wyrok w konkretnej sprawie?":
    "Can the Constitutional Tribunal change a judgment in a particular case?",
  "Nie, przygląda się przepisowi, a nie rozstrzygnięciu":
    "No; it looks at the provision, not at the decision",
  "Tak, jest sądem najwyższej instancji": "Yes; it is the court of highest instance",
  "Tak, na wniosek prokuratora": "Yes, at the prosecutor's request",
  "Tak, w sprawach karnych": "Yes, in criminal cases",
  "Trybunał bada zgodność przepisu z Konstytucją; wyroki zmieniają sądy wyższej instancji.":
    "The Tribunal checks whether a provision agrees with the Constitution; judgments are changed by higher courts.",
  "Czym są interpelacje poselskie?": "What are members' interpellations?",
  "Pisemnymi pytaniami posłów do członków rządu":
    "Written questions from members to members of the government",
  "Wnioskami o odwołanie rządu": "Motions to dismiss the government",
  "Projektami ustaw": "Bills",
  "Uchwałami Senatu": "Resolutions of the Senat",
  "Narzędzie kontroli: poseł pyta, minister ma obowiązek odpowiedzieć.":
    "A tool of scrutiny: a member asks and a minister is bound to answer.",
  "Co się dzieje, gdy Sejm nie udzieli rządowi wotum zaufania w pierwszym kroku?":
    "What happens if the Sejm does not give the government its confidence at the first step?",
  "Inicjatywę przejmuje Sejm, a Konstytucja przewiduje kolejne kroki":
    "The Sejm takes over, and the Constitution provides further steps",
  "Rozpisuje się natychmiast nowe wybory": "A new election is called at once",
  "Rząd i tak obejmuje urząd": "The government takes office anyway",
  "Decyduje Senat": "The Senat decides",
  "Konstytucja przewiduje trzy kolejne procedury, żeby państwo nie zostało bez rządu.":
    "The Constitution provides three procedures in turn, so that the state is never left without a government.",
  "Co zapoczątkował robotniczy protest w Poznaniu w 1956 roku?":
    "What did the workers' protest in Poznań in 1956 set off?",
  "Powstanie Solidarności": "The founding of Solidarność",
  "Rozwiązanie PZPR": "The dissolution of the PZPR",
  "Protest stłumiono wojskiem, ale zapoczątkował okres politycznej odwilży.":
    "The protest was put down with the army, but it began a period of political thaw.",
  "Ilu członków liczyła Solidarność w szczytowym momencie?":
    "How many members did Solidarność have at its height?",
  "Około trzech milionów": "About three million",
  "Blisko dziesięciu milionów": "Close to ten million",
  "Ponad dwadzieścia milionów": "More than twenty million",
  "Blisko dziesięć milionów — w kraju liczącym wtedy około 36 milionów mieszkańców.":
    "Close to ten million — in a country of about 36 million people at the time.",
  "Co nastąpiło po klęsce powstania styczniowego w zaborze rosyjskim?":
    "What followed the defeat of the January Uprising in the Russian zone?",
  "Nasilona rusyfikacja, konfiskaty i zsyłki": "Harsher Russification, confiscations and exile",
  "Przyznanie autonomii": "The granting of autonomy",
  "Zniesienie cenzury": "The lifting of censorship",
  "Powrót polskiego sejmu": "The return of a Polish sejm",
  "Represje objęły szkolnictwo, majątki i tysiące uczestników zesłanych na Sybir.":
    "The reprisals reached the schools and the estates, and thousands of those who took part were sent to Siberia.",
  "Który malarz utrwalał sceny z historii Polski w czasie zaborów?":
    "Which painter set down scenes from Polish history during the partitions?",
  "Jan Matejko": "Jan Matejko",
  "Stanisław Wyspiański": "Stanisław Wyspiański",
  "Jacek Malczewski": "Jacek Malczewski",
  "Józef Chełmoński": "Józef Chełmoński",
  "Jan Matejko, autor między innymi „Bitwy pod Grunwaldem” i „Konstytucji 3 Maja”.":
    "Jan Matejko, who painted the Battle of Grunwald and the Constitution of 3 May, among others.",
  "Jak nazywają się piesze wędrówki na Jasną Górę odbywające się latem?":
    "What are the summer walks to Jasna Góra called?",
  "Pielgrzymki": "Pilgrimages",
  "Procesje": "Processions",
  "Odpusty": "Parish feasts",
  "Rekolekcje": "Retreats",
  "Sierpniowe pielgrzymki idą tam z całego kraju, niektóre po kilkanaście dni.":
    "The August pilgrimages come from all over the country, some of them walking for a fortnight or more.",
  "Co jest alternatywą dla lekcji religii w szkole publicznej?":
    "What is the alternative to religion lessons in a state school?",
  "Etyka": "Ethics",
  "Filozofia": "Philosophy",
  "Historia Kościoła": "Church history",
  "Nic — udział jest obowiązkowy": "Nothing — taking part is compulsory",
  "Etyka albo rezygnacja z obu zajęć. Wybór należy do rodziców lub pełnoletniego ucznia.":
    "Ethics, or dropping both. The choice belongs to the parents, or to the pupil once of age.",
  "Który trybunał czuwa nad stosowaniem prawa Unii Europejskiej?":
    "Which court watches over how European Union law is applied?",
  "Trybunał Sprawiedliwości UE w Luksemburgu": "The Court of Justice of the EU in Luxembourg",
  "Międzynarodowy Trybunał Karny": "The International Criminal Court",
  "Luksemburg zajmuje się prawem unijnym, Strasburg skargami na naruszenie praw człowieka.":
    "Luxembourg deals with Union law, Strasbourg with complaints about breaches of human rights.",
  "Czy Polska zobowiązała się kiedyś do przyjęcia euro?":
    "Has Poland ever undertaken to adopt the euro?",
  "Tak, w traktacie akcesyjnym, bez wyznaczonej daty":
    "Yes, in the accession treaty, with no date set",
  "Nie, uzyskała trwałe wyłączenie": "No; it obtained a permanent opt-out",
  "Tak, z terminem na rok 2010": "Yes, with a deadline of 2010",
  "Nie, kwestii tej nigdy nie poruszano": "No; the question was never raised",
  "Zobowiązanie istnieje, ale bez terminu; waluta pozostaje złotym.":
    "The undertaking exists but has no deadline; the currency remains the złoty.",
  "Ile tygodni trwają zwykle ferie zimowe?": "How many weeks does the winter break usually last?",
  "Jeden tydzień": "One week",
  "Dwa tygodnie": "Two weeks",
  "Trzy tygodnie": "Three weeks",
  "Miesiąc": "A month",
  "Dwa tygodnie, w różnych terminach zależnie od województwa.":
    "Two weeks, at different dates depending on the voivodeship.",
  "Które święto kościelne jest w Polsce dniem wolnym i wypada w czwartek?":
    "Which church feast is a non-working day in Poland and falls on a Thursday?",
  "Boże Ciało": "Corpus Christi",
  "Wniebowzięcie": "The Assumption",
  "Trzech Króli": "Epiphany",
  "Boże Ciało zawsze wypada w czwartek; pozostałe mają stałe daty.":
    "Corpus Christi always falls on a Thursday; the others have fixed dates.",
  "Ile lat trwa technikum?": "How many years does the technikum last?",
  "Pięć lat. Liceum trwa cztery, szkoła branżowa krócej.":
    "Five years. The liceum lasts four, and the trade school less.",
  "Co oznacza, że lek jest refundowany?": "What does it mean that a medicine is reimbursed?",
  "Że NFZ dopłaca do jego ceny": "That the NFZ pays part of its price",
  "Że jest wydawany bez recepty": "That it is sold without a prescription",
  "Że można go zwrócić do apteki": "That it can be returned to the pharmacy",
  "Że produkuje go państwo": "That the state makes it",
  "Dopłata NFZ obniża cenę dla pacjenta.": "The NFZ's payment lowers the price for the patient.",
  "Kiedy wywiesza się flagę państwową?": "When is the state flag flown?",
  "W dni świąt państwowych i podczas uroczystości": "On national holidays and at ceremonies",
  "Codziennie na każdym domu": "Every day, on every house",
  "Wyłącznie w Warszawie": "In Warsaw alone",
  "Tylko podczas meczów reprezentacji": "Only during the national team's matches",
  "Na budynkach urzędów i podczas uroczystości; mieszkańcy wywieszają ją zwyczajowo w święta.":
    "On public buildings and at ceremonies; people hang it out at holidays by custom.",
  "Czym różni się pozycja obywatela od pozycji urzędu wobec prawa?":
    "How does a citizen's position before the law differ from an office's?",
  "Obywatelowi wolno wszystko, czego prawo nie zabrania; urzędowi tylko to, na co prawo zezwala":
    "A citizen may do anything the law does not forbid; an office only what the law allows",
  "Obie są identyczne": "The two are identical",
  "Urzędowi wolno więcej niż obywatelowi": "An office may do more than a citizen",
  "Obywatel podlega tylko Konstytucji": "A citizen is subject to the Constitution alone",
  "Ta różnica jest istotą państwa prawa.": "That difference is the essence of the rule of law.",
  "Kto poza posłami i rządem ma inicjatywę ustawodawczą?":
    "Who, besides members and the government, can introduce legislation?",
  "Senat, Prezydent i grupa 100 tysięcy obywateli":
    "The Senat, the President and a group of 100 thousand citizens",
  "Wyłącznie Prezydent": "The President alone",
  "Wojewodowie": "The voivodes",
  "Sądy powszechne": "The ordinary courts",
  "Projekt może złożyć także Senat, Prezydent albo grupa stu tysięcy obywateli.":
    "A bill can also be laid by the Senat, by the President or by a group of a hundred thousand citizens.",
  "Która kraina historyczna leży wokół Poznania?": "Which historic region lies around Poznań?",
  "Wielkopolska": "Greater Poland",
  "Małopolska": "Lesser Poland",
  "Mazowsze": "Masovia",
  "Wielkopolska. Mazowsze leży wokół Warszawy, Małopolska wokół Krakowa.":
    "Greater Poland. Masovia lies around Warsaw and Lesser Poland around Kraków.",
  "Ile mniej więcej osób mieszka w Warszawie?": "Roughly how many people live in Warsaw?",
  "Około 800 tysięcy": "About 800 thousand",
  "Około 1,2 miliona": "About 1.2 million",
  "Około 1,8 miliona": "About 1.8 million",
  "Około 3 milionów": "About 3 million",
  "Około 1,8 miliona — największe miasto kraju.":
    "About 1.8 million — the largest city in the country.",
  "Kto ustala wysokość płacy minimalnej?": "Who sets the minimum wage?",
  "Rada Ministrów w rozporządzeniu, co roku":
    "The Council of Ministers, by regulation, every year",
  "Każdy pracodawca osobno": "Each employer separately",
  "Sejm raz na kadencję": "The Sejm, once a term",
  "Wojewoda dla swojego regionu": "The voivode, for their own region",
  "Ustalana corocznie i obowiązuje wszystkich pracowników w kraju.":
    "It is set every year and binds every employee in the country.",
  "Czym jest budżet obywatelski?": "What is a participatory budget?",
  "Częścią budżetu gminy, o której przeznaczeniu decydują mieszkańcy":
    "The part of a gmina's budget whose use the residents decide",
  "Budżetem państwa na cele socjalne": "The state budget for social purposes",
  "Funduszem unijnym": "A European fund",
  "Podatkiem lokalnym": "A local tax",
  "Mieszkańcy zgłaszają projekty i głosują, na co pójdzie wydzielona kwota.":
    "Residents put forward projects and vote on what the set sum will go to.",
  "Przed kim Prezydent składa przysięgę?": "Before whom does the President take the oath?",
  "Przed Zgromadzeniem Narodowym": "Before the National Assembly",
  "Przed Sejmem": "Before the Sejm",
  "Przed Sądem Najwyższym": "Before the Supreme Court",
  "Przed Radą Ministrów": "Before the Council of Ministers",
  "Przed Zgromadzeniem Narodowym, czyli połączonymi izbami parlamentu.":
    "Before the National Assembly, that is the two chambers of parliament sitting together.",
  "Kto nadzoruje w Polsce ochronę danych osobowych?":
    "Who oversees the protection of personal data in Poland?",
  "Prezes Urzędu Ochrony Danych Osobowych": "The President of the Personal Data Protection Office",
  "Minister Cyfryzacji": "The minister for digital affairs",
  "Prezes UODO, na podstawie przepisów RODO obowiązujących od 2018 roku.":
    "The President of the UODO, under the GDPR rules in force since 2018.",
  "Jak nazywała się dynastia rządząca po Piastach?":
    "What was the dynasty that ruled after the Piasts called?",
  "Wettynowie": "The Wettins",
  "Andegawenowie": "The Angevins",
  "Jagiellonowie, od unii z Litwą w 1385 roku.":
    "The Jagiellons, from the union with Lithuania in 1385.",
  "Dokąd przeniósł się polski rząd po klęsce we wrześniu 1939 roku?":
    "Where did the Polish government move after the defeat of September 1939?",
  "Do Londynu": "To London",
  "Do Paryża na stałe": "To Paris, for good",
  "Do Moskwy": "To Moscow",
  "Do Sztokholmu": "To Stockholm",
  "Najpierw do Francji, a po jej upadku do Londynu.":
    "First to France, and after its fall to London.",
  "Kto prowadzi w Polsce koleje dalekobieżne?": "Who runs the long-distance railways in Poland?",
  "PKP": "PKP",
  "PKS": "PKS",
  "LOT": "LOT",
  "ZTM": "ZTM",
  "Polskie Koleje Państwowe i spółki z nimi związane. PKS to autobusy, LOT to linie lotnicze.":
    "The Polish State Railways and the companies tied to them. PKS means the coaches, LOT the airline.",
  "Co grozi za publiczne znieważenie symboli państwowych?":
    "What is the penalty for publicly insulting the state symbols?",
  "Odpowiedzialność karna — symbole są chronione prawem":
    "Criminal liability — the symbols are protected by law",
  "Nic, to kwestia obyczaju": "Nothing; it is a matter of custom",
  "Grzywna nakładana przez wojewodę": "A fine imposed by the voivode",
  "Godło, barwy i hymn są objęte ochroną prawną; znieważenie ich jest przestępstwem.":
    "The coat of arms, the colours and the anthem are protected by law; insulting them is a criminal offence.",
  "Ile rozdziałów Konstytucji podlega zatwierdzeniu w referendum przy zmianie?":
    "How many chapters of the Constitution need a confirming referendum when they are changed?",
  "Wszystkie": "All of them",
  "Rozdziały o ustroju, o wolnościach i o trybie zmiany Konstytucji.":
    "The chapters on the system of government, on freedoms and on how the Constitution is amended.",
  "Czy państwo zapewnia prawo do nauki?": "Does the state provide a right to education?",
  "Tak, nauka jest bezpłatna w szkołach publicznych": "Yes; education is free at state schools",
  "Nie, edukacja jest w pełni prywatna": "No; education is entirely private",
  "Tylko dla obywateli polskich": "Only for Polish citizens",
  "Tylko do 12. roku życia": "Only up to the age of 12",
  "Konstytucja gwarantuje prawo do nauki, bezpłatnej w szkołach publicznych.":
    "The Constitution guarantees a right to education, free at state schools.",
  "Ile czasu ma sąd na decyzję o tymczasowym aresztowaniu po przekazaniu zatrzymanego?":
    "How long does a court have to decide on remand once a detainee is handed over?",
  "24 godziny": "24 hours",
  "72 godziny": "72 hours",
  "Do 48 godzin na przekazanie sądowi i kolejne 24 na decyzję — razem najwyżej 72 godziny.":
    "Up to 48 hours to hand the person to a court and another 24 for the decision — 72 hours at most in all.",
  "Co Konstytucja wymienia jako pierwszy obowiązek obywatela?":
    "What does the Constitution name as a citizen's first duty?",
  "Wierność Rzeczypospolitej i troskę o dobro wspólne":
    "Loyalty to the Republic and care for the common good",
  "Płacenie podatków": "Paying taxes",
  "Służbę wojskową": "Military service",
  "Z tego ogólnego sformułowania wynikają pozostałe obowiązki.":
    "The other duties follow from that general wording.",
  "Które ugrupowania są zwolnione z progu wyborczego do Sejmu?":
    "Which groupings are exempt from the electoral threshold for the Sejm?",
  "Komitety mniejszości narodowych": "The committees of national minorities",
  "Partie rządzące": "The governing parties",
  "Komitety obywatelskie": "Citizens' committees",
  "Nikt nie jest zwolniony": "Nobody is exempt",
  "Zwolnienie dotyczy komitetów mniejszości narodowych.":
    "The exemption covers the committees of national minorities.",
  "Co się stanie, jeśli Prezydent skieruje ustawę do Trybunału Konstytucyjnego?":
    "What happens if the President sends a statute to the Constitutional Tribunal?",
  "Nie może już jej zawetować": "They can no longer veto it",
  "Może ją potem jeszcze zawetować": "They can still veto it afterwards",
  "Ustawa wchodzi w życie natychmiast": "The statute comes into force at once",
  "Sejm musi ją uchwalić ponownie": "The Sejm has to pass it again",
  "Wybór jest rozłączny: albo weto, albo droga do Trybunału.":
    "The choice is one or the other: a veto, or the road to the Tribunal.",
  "Kto wchodzi w skład Rady Ministrów?": "Who makes up the Council of Ministers?",
  "Premier i ministrowie": "The prime minister and the ministers",
  "Premier i Prezydent": "The prime minister and the President",
  "Posłowie i senatorowie": "Members and senators",
  "Prezes Rady Ministrów i ministrowie kierujący działami administracji.":
    "The Chairman of the Council of Ministers and the ministers who head the branches of administration.",
  "Czy rozprawy sądowe są w Polsce jawne?": "Are court hearings public in Poland?",
  "Tak, co do zasady, a wyrok ogłasza się publicznie":
    "Yes, as a rule, and the judgment is pronounced in public",
  "Nie, wszystkie są tajne": "No; they are all secret",
  "Tylko w sprawach cywilnych": "Only in civil cases",
  "Tylko za zgodą stron": "Only if the parties agree",
  "Jawność jest zasadą; wyjątki wymagają podstawy w ustawie.":
    "Openness is the rule; exceptions need a basis in statute.",
  "Ile szczebli ma polski samorząd terytorialny?":
    "How many levels does Polish local government have?",
  "Gmina, powiat i województwo.": "The gmina, the powiat and the voivodeship.",
  "Co oznaczała wolna elekcja?": "What did free election mean?",
  "Że króla wybierała szlachta": "That the nobility elected the king",
  "Że tron dziedziczył najstarszy syn": "That the eldest son inherited the throne",
  "Że króla wskazywał papież": "That the pope named the king",
  "Że królem zostawał zwycięzca turnieju": "That the winner of a tournament became king",
  "Króla wybierała szlachta; zniosła to dopiero Konstytucja 3 maja.":
    "The nobility elected the king; only the Constitution of 3 May did away with it.",
  "W którym roku doszło do pierwszego rozbioru Polski?":
    "In which year did the first partition of Poland take place?",
  "1764": "1764",
  "1772. Drugi nastąpił w 1793, trzeci w 1795 roku.":
    "1772. The second came in 1793 and the third in 1795.",
  "Jak nazywano powstania, które zdecydowały o przynależności Górnego Śląska?":
    "What were the uprisings that decided where Upper Silesia belonged called?",
  "Powstania śląskie": "The Silesian Uprisings",
  "Powstanie warszawskie": "The Warsaw Uprising",
  "Powstanie krakowskie": "The Kraków Uprising",
  "Trzy powstania śląskie w latach 1919–1921, obok plebiscytu.":
    "Three Silesian Uprisings between 1919 and 1921, alongside a plebiscite.",
  "Jak nazywał się największy niemiecki obóz koncentracyjny i zagłady na ziemiach polskich?":
    "What was the largest German concentration and extermination camp on Polish soil called?",
  "Mauthausen": "Mauthausen",
  "Auschwitz-Birkenau, dziś miejsce pamięci wpisane na listę UNESCO.":
    "Auschwitz-Birkenau, today a memorial site on the UNESCO list.",
  "Jak nazywały się porozumienia kończące strajk w Stoczni Gdańskiej?":
    "What were the agreements that ended the strike at the Gdańsk shipyard called?",
  "Umowa gdańska": "The Gdańsk agreement",
  "Pakt o stabilizacji": "The stabilisation pact",
  "Porozumienia sierpniowe z 1980 roku; na ich podstawie powstała Solidarność.":
    "The August Agreements of 1980; Solidarność was founded on them.",
  "Jaką część miejsc w Sejmie w 1989 roku obsadzono w wolnych wyborach?":
    "What share of the Sejm's seats was filled by free election in 1989?",
  "35 procent": "35 per cent",
  "50 procent": "50 per cent",
  "65 procent": "65 per cent",
  "100 procent": "100 per cent",
  "35 procent w Sejmie; Senat był wolny w całości.":
    "35 per cent in the Sejm; the Senat was free in its entirety.",
  "Jak nazywa się największe jezioro w Polsce?": "What is the largest lake in Poland called?",
  "Śniardwy": "Śniardwy",
  "Mamry": "Mamry",
  "Hańcza": "Hańcza",
  "Gopło": "Gopło",
  "Śniardwy na Mazurach. Hańcza jest najgłębsza, ale nie największa.":
    "Śniardwy, in Masuria. Hańcza is the deepest but not the largest.",
  "Ile jest w Polsce uznanych mniejszości narodowych?":
    "How many recognised national minorities are there in Poland?",
  "Dziewięć mniejszości narodowych i cztery etniczne; językiem regionalnym jest kaszubski.":
    "Nine national minorities and four ethnic ones; the regional language is Kashubian.",
  "Czym różni się umowa o pracę od umowy zlecenia?":
    "How does a contract of employment differ from a contract for services?",
  "Umowa o pracę daje urlop i ochronę przed zwolnieniem":
    "A contract of employment gives leave and protection against dismissal",
  "Umowa zlecenia jest zawsze korzystniejsza": "A contract for services is always better",
  "Nie różnią się niczym": "They do not differ at all",
  "Umowa o pracę nie wymaga składek": "A contract of employment needs no contributions",
  "Z umowy o pracę wynikają urlop, ochrona stosunku pracy i pełne składki.":
    "A contract of employment brings leave, protection of the employment and full contributions.",
  "Do której organizacji obronnej należy Polska od 1999 roku?":
    "Which defence organisation has Poland belonged to since 1999?",
  "Do NATO": "NATO",
  "Do Układu Warszawskiego": "The Warsaw Pact",
  "Do ONZ": "The United Nations",
  "Do OBWE": "The OSCE",
  "Do NATO, razem z Czechami i Węgrami. Układ Warszawski rozwiązano w 1991 roku.":
    "NATO, together with Czechia and Hungary. The Warsaw Pact was dissolved in 1991.",
  "Który obraz znajduje się na Jasnej Górze?": "Which painting is at Jasna Góra?",
  "Matki Boskiej Częstochowskiej": "The Black Madonna of Częstochowa",
  "Matki Boskiej Ostrobramskiej": "Our Lady of the Gate of Dawn",
  "Świętego Stanisława": "Saint Stanislaus",
  "Świętej Jadwigi": "Saint Hedwig",
  "Obraz Matki Boskiej Częstochowskiej, cel największych pielgrzymek w kraju.":
    "The image of the Black Madonna of Częstochowa, the goal of the country's largest pilgrimages.",
  "Kiedy w Polsce jada się kolację wigilijną?":
    "When is the Christmas Eve supper eaten in Poland?",
  "24 grudnia, po pierwszej gwiazdce": "On 24 December, after the first star",
  "25 grudnia w południe": "At noon on 25 December",
  "31 grudnia wieczorem": "On the evening of 31 December",
  "6 stycznia": "On 6 January",
  "Wieczorem 24 grudnia, tradycyjnie po pojawieniu się pierwszej gwiazdy.":
    "On the evening of 24 December, by tradition once the first star appears.",
  "Jaki egzamin otwiera drogę na studia?": "Which examination opens the way to university?",
  "Matura": "The matura",
  "Egzamin ósmoklasisty": "The eighth-year examination",
  "Egzamin zawodowy": "The vocational examination",
  "Test kompetencji": "A competence test",
  "Matura; jej wyniki decydują o przyjęciu na uczelnię.":
    "The matura; its results decide admission to a university.",
  "Skąd biorą się opłaty za wodę i ogrzewanie w bloku?":
    "Where do the charges for water and heating in a block of flats come from?",
  "Zwykle rozlicza je wspólnota albo spółdzielnia, osobno od czynszu najmu":
    "The owners' association or the cooperative usually settles them, separately from the rent",
  "Zawsze są wliczone w czynsz najmu": "They are always included in the rent",
  "Pobiera je gmina": "The gmina collects them",
  "Płaci je wyłącznie właściciel mieszkania": "Only the owner of the flat pays them",
  "Przy najmie opłaty eksploatacyjne często idą osobno, do wspólnoty albo spółdzielni.":
    "With a tenancy the running charges often go separately, to the association or the cooperative.",
};
