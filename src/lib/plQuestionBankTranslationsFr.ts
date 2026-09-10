/**
 * French for the Życie w Polsce practice questions.
 *
 * The lesson cards are answered by ZYCIE_W_POLSCE_FR. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in French and then asked its
 * questions in Polish.
 *
 * Keyed on the POLISH source text exactly as it appears in plQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an l for
 * an ł or a plain quotation mark where the sentence carries the Polish pair,
 * and the lookup misses in silence. The question renders in Polish, the tap
 * works, and nothing anywhere reports it.
 *
 * WHAT STAYS POLISH follows ZYCIE_W_POLSCE_FR exactly, because a reader meets
 * the lesson and its questions one after the other and a word glossed two
 * ways between them teaches nothing. The line runs where French itself draws
 * it:
 *
 *   - an institution French has a conventional name for gets that name — the
 *     Rada Ministrów is the Conseil des ministres, the Sąd Najwyższy the Cour
 *     suprême, the Trybunał Konstytucyjny the Tribunal constitutionnel, with
 *     the Polish name leading where the exam asks for it;
 *   - Sejm and Senat keep their own names, which French uses as they are;
 *   - where the word IS the answer and has no French equivalent — gmina,
 *     powiat, wójt, sołectwo, sejmik, Marszałek, PESEL, REGON, ZUS, NFZ,
 *     KRUS, RODO — the French gives the meaning and keeps the Polish word
 *     beside it, so the reader learns the term they will actually meet.
 *
 * The keep list in check-fr-bank-translation was measured against this table
 * before it was written down, not guessed. Two needles that look as if they
 * belong are deliberately absent because they hide inside another word:
 * "gminy" is the plural and the French renders the singular, and "złoty" is
 * the currency in two keys but the adjective for golden in three more — a
 * black eagle on a golden field is not a sum of money, and a gate watching
 * that needle would accuse the heraldry questions of losing a word they never
 * carried. Sejm and Senat stay on the list even though two entries each drop
 * them, because those two are "sejmik" and "Senatorem" — the needle hiding
 * inside a longer Polish word, and both are correctly French in the value.
 *
 * Ninety-four of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that ZYCIE_W_POLSCE_FR already
 * answers. Every French table is spread into one object, so a key present in
 * two of them would lose one silently — the later spread would decide both.
 * check-fr-bank-translation measures coverage through translateCourseText,
 * the lookup a reader's tap actually goes through, so those count as answered
 * and are not duplicated here.
 */
export const PL_QUESTION_BANK_FR: Record<string, string> = {
  "Co przedstawia godło Rzeczypospolitej Polskiej?":
    "Que représente l'emblème de la République de Pologne ?",
  "Białego orła w złotej koronie na czerwonym tle":
    "Un aigle blanc à couronne d'or sur fond rouge",
  "Czarnego orła na złotym tle": "Un aigle noir sur fond d'or",
  "Białego orła bez korony na niebieskim tle": "Un aigle blanc sans couronne sur fond bleu",
  "Złotego lwa na czerwonym tle": "Un lion d'or sur fond rouge",
  "Orzeł biały w złotej koronie, na czerwonym polu — opisuje go artykuł 28 Konstytucji.":
    "L'aigle blanc à couronne d'or, sur champ rouge — l'article 28 de la Constitution le décrit.",
  "Kiedy obchodzi się Dzień Flagi Rzeczypospolitej Polskiej?":
    "Quand célèbre-t-on la fête du drapeau de la République de Pologne ?",
  "1 maja": "Le 1er mai",
  "2 maja": "Le 2 mai",
  "2 maja, między Świętem Pracy a Świętem Konstytucji 3 Maja.":
    "Le 2 mai, entre la fête du Travail et la fête de la Constitution du 3 mai.",
  "W którym roku orzeł w godle odzyskał koronę?":
    "En quelle année l'aigle de l'emblème a-t-il retrouvé sa couronne ?",
  "W 1990 roku. W czasach PRL orzeł korony nie miał; 1918 to odzyskanie niepodległości, 1997 to Konstytucja.":
    "En 1990. Sous la République populaire, l'aigle n'avait pas de couronne ; 1918 est le retour à l'indépendance, 1997 la Constitution.",
  "Który akt prawny jest w Polsce najwyższy?": "Quel texte est le plus élevé en Pologne ?",
  "Ustawa sejmowa": "Une loi du Sejm",
  "Rozporządzenie ministra": "Un arrêté ministériel",
  "Uchwała rady gminy": "Une délibération du conseil de gmina",
  "Konstytucja. Żadna ustawa ani rozporządzenie nie może być z nią sprzeczne.":
    "La Constitution. Aucune loi ni aucun arrêté ne peut la contredire.",
  "W jakim trybie przyjęto obowiązującą Konstytucję RP?":
    "Selon quelle procédure la Constitution en vigueur a-t-elle été adoptée ?",
  "Uchwalona przez Sejm i zatwierdzona w referendum":
    "Votée par le Sejm et confirmée par référendum",
  "Nadana przez Prezydenta": "Octroyée par le président",
  "Uchwalona wyłącznie przez Senat": "Votée par le seul Senat",
  "Przyjęta rozporządzeniem Rady Ministrów": "Adoptée par arrêté du Conseil des ministres",
  "Zgromadzenie Narodowe ją uchwaliło, a obywatele potwierdzili w referendum w 1997 roku.":
    "Zgromadzenie Narodowe, l'Assemblée nationale, l'a votée, et les citoyens l'ont confirmée par référendum en 1997.",
  "Jak nazywa się hymn państwowy Polski?": "Comment s'appelle l'hymne national polonais ?",
  "Rota": "Rota",
  "Warszawianka": "Warszawianka",
  "Bogurodzica": "Bogurodzica",
  "Mazurek Dąbrowskiego, z 1797 roku. Rota i Warszawianka to pieśni patriotyczne, ale nie hymn.":
    "Mazurek Dąbrowskiego, de 1797. Rota et Warszawianka sont des chants patriotiques, mais non l'hymne.",
  "Jakie kolory ma flaga Polski?": "Quelles couleurs a le drapeau polonais ?",
  "Biały i czerwony": "Blanc et rouge",
  "Czerwony i złoty": "Rouge et or",
  "Biały i niebieski": "Blanc et bleu",
  "Czerwony i czarny": "Rouge et noir",
  "Biel u góry, czerwień u dołu — barwy wzięte z orła i pola herbowego.":
    "Le blanc en haut, le rouge en bas — les couleurs viennent de l'aigle et du champ de l'écu.",
  "W którym artykule Konstytucji opisane są godło, barwy i hymn?":
    "Quel article de la Constitution décrit l'emblème, les couleurs et l'hymne ?",
  "W artykule 1": "L'article 1",
  "W artykule 28": "L'article 28",
  "W artykule 30": "L'article 30",
  "W artykule 87": "L'article 87",
  "Artykuł 28 wymienia wszystkie trzy symbole i obejmuje je ochroną prawną.":
    "L'article 28 nomme les trois symboles et les place sous la protection de la loi.",
  "W którym roku powstał Mazurek Dąbrowskiego?":
    "En quelle année Mazurek Dąbrowskiego a-t-il vu le jour ?",
  "1791": "1791",
  "1797": "1797",
  "1830": "1830",
  "1797, we Włoszech, w Legionach Polskich — gdy państwa polskiego nie było na mapie.":
    "En 1797, en Italie, dans les Légions polonaises — alors qu'aucun État polonais ne figurait sur la carte.",
  "Kiedy oficjalnie ustalono biel i czerwień jako barwy narodowe?":
    "Quand le blanc et le rouge ont-ils été fixés officiellement comme couleurs nationales ?",
  "W 1791 roku": "En 1791",
  "W 1831 roku": "En 1831",
  "W 1918 roku": "En 1918",
  "W 1990 roku": "En 1990",
  "7 lutego 1831 roku, w czasie powstania listopadowego. Herb jest o wieki starszy niż same barwy.":
    "Le 7 février 1831, pendant l'insurrection de Novembre. L'écu est de plusieurs siècles plus ancien que les couleurs elles-mêmes.",
  "Czym różni się flaga z godłem od zwykłej flagi państwowej?":
    "En quoi le drapeau à l'emblème diffère-t-il du drapeau national ordinaire ?",
  "Używają jej wyłącznie polskie statki i placówki dyplomatyczne":
    "Seuls les navires polonais et les postes diplomatiques l'emploient",
  "Wywiesza się ją tylko 11 listopada": "On ne l'arbore que le 11 novembre",
  "Jest wersją historyczną, dziś nieużywaną":
    "C'est une version historique, aujourd'hui hors d'usage",
  "Różni się odcieniem czerwieni": "Il se distingue par la nuance de rouge",
  "Wersja z godłem jest zastrzeżona dla statków i placówek za granicą — nie wywiesza się jej na balkonie.":
    "La version à l'emblème est réservée aux navires et aux postes à l'étranger — on ne l'accroche pas à son balcon.",
  "Dlaczego orzeł w godle nosi koronę, choć Polska jest republiką?":
    "Pourquoi l'aigle de l'emblème porte-t-il une couronne, alors que la Pologne est une république ?",
  "Bo korona oznacza suwerenność państwa, a nie monarchię":
    "Parce que la couronne dit la souveraineté de l'État, non la monarchie",
  "Bo Polska formalnie pozostaje królestwem": "Parce que la Pologne reste formellement un royaume",
  "Bo tak zdecydował Sejm w 1997 roku": "Parce que le Sejm en a décidé ainsi en 1997",
  "Bo korona odróżnia godło od herbu Warszawy":
    "Parce que la couronne distingue l'emblème des armes de Varsovie",
  "Korona jest znakiem niezawisłości państwa. Wróciła na głowę orła w 1990 roku, po okresie PRL.":
    "La couronne est le signe de l'indépendance de l'État. Elle est revenue sur la tête de l'aigle en 1990, après la période de la République populaire.",
  "Kiedy obchodzi się Dzień Flagi?": "Quand célèbre-t-on la fête du drapeau ?",
  "2 maja — dzień między Świętem Pracy a Świętem Konstytucji 3 Maja.":
    "Le 2 mai — la journée qui sépare la fête du Travail de la fête de la Constitution du 3 mai.",
  "Jakie są pierwsze słowa polskiego hymnu?": "Quels sont les premiers mots de l'hymne polonais ?",
  "Boże, coś Polskę": "Boże, coś Polskę — Dieu, toi qui la Pologne",
  "Jeszcze Polska nie zginęła": "Jeszcze Polska nie zginęła — la Pologne n'a pas encore péri",
  "Nie rzucim ziemi": "Nie rzucim ziemi — nous ne quitterons pas la terre",
  "Warszawo ma": "Warszawo ma — ô ma Varsovie",
  "„Jeszcze Polska nie zginęła, kiedy my żyjemy” — zdanie napisane w czasie rozbiorów.":
    "« Jeszcze Polska nie zginęła, kiedy my żyjemy » — la Pologne n'a pas encore péri tant que nous vivons : une phrase écrite au temps des partages.",
  "Jaką formą państwa jest Polska według Konstytucji?":
    "Quelle forme d'État la Pologne est-elle selon la Constitution ?",
  "Monarchią": "Une monarchie",
  "Republiką": "Une république",
  "Federacją": "Une fédération",
  "Konfederacją": "Une confédération",
  "Republiką — głowę państwa się wybiera na kadencję, a nie dziedziczy.":
    "Une république — le chef de l'État s'élit pour un mandat, il ne s'hérite pas.",
  "Która konstytucja obowiązywała w PRL do 1997 roku?":
    "Quelle constitution valait sous la République populaire jusqu'en 1997 ?",
  "Marcowa z 1921": "Celle de mars 1921",
  "Kwietniowa z 1935": "Celle d'avril 1935",
  "Z 1952 roku": "Celle de 1952",
  "Z 1989 roku": "Celle de 1989",
  "Konstytucja PRL z 1952 roku, wielokrotnie zmieniana, obowiązywała do wejścia w życie obecnej.":
    "La constitution de 1952, maintes fois modifiée, a valu jusqu'à l'entrée en vigueur de celle d'aujourd'hui.",
  "Ile miesięcy obowiązywała Konstytucja 3 maja?":
    "Combien de mois la Constitution du 3 mai a-t-elle été en vigueur ?",
  "Czternaście miesięcy": "Quatorze mois",
  "Pięć lat": "Cinq ans",
  "Dwadzieścia lat": "Vingt ans",
  "Do rozbiorów w 1795 roku": "Jusqu'aux partages de 1795",
  "Czternaście miesięcy. Sąsiedzi wkroczyli zbrojnie, a w 1793 roku doszło do drugiego rozbioru.":
    "Quatorze mois. Les voisins sont entrés en armes, et en 1793 vint le deuxième partage.",
  "Która konstytucja wzmocniła pozycję prezydenta kosztem parlamentu?":
    "Quelle constitution a renforcé le président aux dépens du parlement ?",
  "Z 1997 roku": "Celle de 1997",
  "Kwietniowa z 1935 roku, uchwalona pod koniec życia Piłsudskiego.":
    "Celle d'avril 1935, votée à la fin de la vie de Piłsudski.",
  "Kiedy przy zmianie Konstytucji można zażądać referendum?":
    "Quand peut-on exiger un référendum lors d'une révision de la Constitution ?",
  "Zawsze, przy każdej zmianie": "Toujours, à chaque révision",
  "Gdy zmiana dotyczy rozdziałów o ustroju, wolnościach albo o samej procedurze zmiany":
    "Quand la révision touche aux chapitres sur le régime, sur les libertés ou sur la procédure de révision elle-même",
  "Nigdy — Konstytucję zmienia wyłącznie parlament":
    "Jamais — le parlement révise seul la Constitution",
  "Tylko gdy zażąda tego Prezydent": "Seulement si le président l'exige",
  "Referendum zatwierdzające dotyczy rozdziałów I, II i XII — ustroju, wolności i trybu zmiany.":
    "Le référendum de confirmation porte sur les chapitres I, II et XII — le régime, les libertés et la procédure de révision.",
  "Co oznacza zasada, że organy władzy działają „na podstawie i w granicach prawa”?":
    "Que signifie le principe voulant que les autorités agissent « sur le fondement et dans les limites du droit » ?",
  "Że urząd może zrobić tylko to, na co pozwala mu przepis":
    "Qu'une administration ne peut faire que ce qu'un texte lui permet",
  "Że urząd może zrobić wszystko, czego przepis nie zakazuje":
    "Qu'une administration peut faire tout ce qu'aucun texte n'interdit",
  "Że przepisy obowiązują tylko obywateli": "Que les textes n'obligent que les citoyens",
  "Że decyzje urzędu są ostateczne": "Que les décisions de l'administration sont définitives",
  "Odwrotnie niż u obywatela: obywatelowi wolno wszystko, czego prawo nie zabrania, urzędowi tylko to, na co prawo zezwala.":
    "L'inverse du citoyen : au citoyen tout est permis que la loi n'interdit pas, à l'administration seulement ce que la loi autorise.",
  "Czy ustawa może być sprzeczna z Konstytucją?": "Une loi peut-elle contredire la Constitution ?",
  "Nie, Konstytucja jest najwyższym prawem": "Non, la Constitution est la norme la plus élevée",
  "Tak, jeśli uchwali ją Sejm większością 2/3":
    "Oui, si le Sejm la vote à la majorité des deux tiers",
  "Tak, jeśli podpisze ją Prezydent": "Oui, si le président la signe",
  "Tak, w stanie wyjątkowym": "Oui, en état d'exception",
  "Nie. Sprzeczną z Konstytucją ustawę może uchylić Trybunał Konstytucyjny.":
    "Non. Le Trybunał Konstytucyjny, le Tribunal constitutionnel, peut annuler une loi qui la contredit.",
  "Jak nazywa się zasada rozdzielenia władzy ustawodawczej, wykonawczej i sądowniczej?":
    "Comment s'appelle le principe qui sépare le pouvoir législatif, exécutif et judiciaire ?",
  "Federalizm": "Le fédéralisme",
  "Centralizm": "Le centralisme",
  "Subsydiarność": "La subsidiarité",
  "Podział i równowaga władz — jedna z podstawowych zasad ustrojowych.":
    "La séparation et l'équilibre des pouvoirs — l'un des principes fondateurs du régime.",
  "Który organ uchwalił Konstytucję z 1997 roku?": "Quel organe a voté la Constitution de 1997 ?",
  "Zgromadzenie Narodowe, czyli Sejm i Senat obradujące wspólnie; obywatele potwierdzili ją w referendum.":
    "Zgromadzenie Narodowe, l'Assemblée nationale, c'est-à-dire le Sejm et le Senat siégeant ensemble ; les citoyens l'ont confirmée par référendum.",
  "Co oznacza domniemanie niewinności?": "Que signifie la présomption d'innocence ?",
  "Że oskarżony jest niewinny, dopóki sąd nie orzeknie prawomocnie":
    "Que l'accusé est innocent tant qu'un tribunal n'a pas statué définitivement",
  "Że oskarżony musi udowodnić swoją niewinność": "Que l'accusé doit prouver son innocence",
  "Że policja nie może nikogo zatrzymać": "Que la police ne peut arrêter personne",
  "Że wyrok można wydać tylko za zgodą oskarżonego":
    "Qu'un jugement ne peut être rendu qu'avec l'accord de l'accusé",
  "Ciężar dowodu spoczywa na oskarżycielu, nie na oskarżonym.":
    "La charge de la preuve pèse sur celui qui accuse, non sur l'accusé.",
  "Od którego roku życia przysługuje prawo głosowania?":
    "À partir de quel âge a-t-on le droit de voter ?",
  "Od 16": "À 16 ans",
  "Od 18": "À 18 ans",
  "Od 21": "À 21 ans",
  "Od 25": "À 25 ans",
  "Od 18 lat. 21 lat trzeba mieć, żeby kandydować do Sejmu, 30 — do Senatu.":
    "À 18 ans. Il faut en avoir 21 pour se présenter au Sejm, et 30 pour le Senat.",
  "Co można zrobić, gdy naruszył wolność sam przepis, a nie wyrok?":
    "Que faire quand c'est le texte lui-même, et non un jugement, qui a porté atteinte à une liberté ?",
  "Złożyć skargę konstytucyjną do Trybunału Konstytucyjnego":
    "Déposer un recours constitutionnel devant le Trybunał Konstytucyjny",
  "Wnieść apelację do sądu okręgowego": "Faire appel devant le tribunal régional",
  "Złożyć wniosek do wojewody": "Adresser une demande au wojewoda",
  "Nic — przepisów nie da się zakwestionować": "Rien — les textes ne peuvent être contestés",
  "Skarga konstytucyjna, po wyczerpaniu drogi sądowej; sporządza ją adwokat albo radca prawny.":
    "Le recours constitutionnel, une fois la voie judiciaire épuisée ; il est rédigé par un avocat ou un conseil juridique.",
  "Co gwarantuje europejskie rozporządzenie RODO?": "Que garantit le règlement européen RODO ?",
  "Prawo do informacji o swoich danych, ich poprawienia i usunięcia":
    "Le droit d'être informé de ses données, de les corriger et de les faire effacer",
  "Prawo do bezpłatnego internetu": "Le droit à un internet gratuit",
  "Prawo do zasiłku dla bezrobotnych": "Le droit à l'allocation de chômage",
  "Prawo do pracy w każdym kraju świata":
    "Le droit de travailler dans n'importe quel pays du monde",
  "RODO obowiązuje od 2018 roku; nadzoruje je Prezes Urzędu Ochrony Danych Osobowych.":
    "Le RODO, la protection des données, s'applique depuis 2018 ; le président de l'Office de protection des données personnelles en surveille le respect.",
  "Kto stoi na straży praw dzieci?": "Qui veille sur les droits des enfants ?",
  "Rzecznik Praw Dziecka": "Le Rzecznik Praw Dziecka, le défenseur des droits de l'enfant",
  "Rzecznik Praw Obywatelskich":
    "Le Rzecznik Praw Obywatelskich, le défenseur des droits civiques",
  "Kurator oświaty": "L'inspecteur d'académie",
  "Sąd rodzinny": "Le tribunal des affaires familiales",
  "Rzecznik Praw Dziecka działa osobno od Rzecznika Praw Obywatelskich.":
    "Le Rzecznik Praw Dziecka agit séparément du Rzecznik Praw Obywatelskich.",
  "Czego nigdy nie wolno naruszyć przy ograniczaniu wolności?":
    "À quoi ne peut-on jamais toucher quand on restreint une liberté ?",
  "Istoty danej wolności": "À la substance même de cette liberté",
  "Terminu wejścia w życie ustawy": "À la date d'entrée en vigueur de la loi",
  "Zasady jawności obrad": "Au principe de publicité des débats",
  "Kompetencji wojewody": "Aux attributions du wojewoda",
  "Ograniczenie musi być konieczne i wprowadzone ustawą, ale istoty wolności naruszyć nie może.":
    "Une restriction doit être nécessaire et posée par une loi, mais elle ne peut atteindre la substance même de la liberté.",
  "Dlaczego nie można ukarać kogoś za czyn, który w chwili popełnienia nie był zabroniony?":
    "Pourquoi ne peut-on punir quelqu'un d'un acte qui n'était pas interdit au moment où il l'a commis ?",
  "Bo prawo karne nie działa wstecz": "Parce que la loi pénale n'est pas rétroactive",
  "Bo przedawnienie następuje po roku": "Parce que la prescription tombe au bout d'un an",
  "Bo zgody musiałby udzielić Sejm": "Parce qu'il faudrait l'accord du Sejm",
  "Bo taki czyn zawsze jest wykroczeniem, nie przestępstwem":
    "Parce qu'un tel acte est toujours une contravention, non un délit",
  "Zasada lex retro non agit — prawo karne nie działa wstecz.":
    "Le principe lex retro non agit — la loi pénale ne rétroagit pas.",
  "Czy w Polsce obowiązuje cenzura prewencyjna?":
    "La censure préalable existe-t-elle en Pologne ?",
  "Nie, jest zakazana przez Konstytucję": "Non, la Constitution l'interdit",
  "Tak, sprawuje ją ministerstwo kultury": "Oui, le ministère de la Culture l'exerce",
  "Tak, wobec prasy zagranicznej": "Oui, à l'égard de la presse étrangère",
  "Tak, w czasie kampanii wyborczej": "Oui, pendant la campagne électorale",
  "Konstytucja zakazuje cenzury prewencyjnej i koncesjonowania prasy.":
    "La Constitution interdit la censure préalable et la mise sous licence de la presse.",
  "Do jakiego wieku nauka w szkole publicznej jest bezpłatna i obowiązkowa?":
    "Jusqu'à quel âge l'école publique est-elle gratuite et obligatoire ?",
  "Do 15 lat": "Jusqu'à 15 ans",
  "Do 16 lat": "Jusqu'à 16 ans",
  "Do 18 lat": "Jusqu'à 18 ans",
  "Do ukończenia studiów": "Jusqu'à la fin des études supérieures",
  "Do 18. roku życia. Studia dzienne na uczelniach publicznych też są bezpłatne, ale nieobowiązkowe.":
    "Jusqu'à 18 ans. Les études à temps plein dans les établissements publics sont gratuites elles aussi, mais non obligatoires.",
  "Kogo obowiązuje przestrzeganie prawa Rzeczypospolitej?":
    "Qui est tenu de respecter le droit de la République ?",
  "Każdego, kto znajduje się pod jej władzą, także cudzoziemca":
    "Quiconque se trouve sous son autorité, l'étranger compris",
  "Wyłącznie obywateli polskich": "Les seuls citoyens polonais",
  "Wyłącznie osoby pełnoletnie": "Les seules personnes majeures",
  "Wyłącznie osoby zameldowane": "Les seules personnes déclarées domiciliées",
  "Obowiązek dotyczy każdego na terytorium państwa, niezależnie od obywatelstwa.":
    "L'obligation vaut pour chacun sur le territoire de l'État, quelle que soit sa nationalité.",
  "Co może nałożyć podatek?": "Qu'est-ce qui peut établir un impôt ?",
  "Tylko ustawa": "Une loi, et rien d'autre",
  "Decyzja wojewody": "Une décision du wojewoda",
  "Ciężary publiczne nakłada wyłącznie ustawa — to gwarancja konstytucyjna.":
    "Les charges publiques ne s'établissent que par une loi — c'est une garantie constitutionnelle.",
  "Co przysługuje osobie, która ze względu na przekonania nie może pełnić służby wojskowej?":
    "À quoi a droit celui qui, par conviction, ne peut faire son service militaire ?",
  "Służba zastępcza": "À un service de remplacement",
  "Zwolnienie bez żadnych obowiązków": "À une dispense sans aucune obligation",
  "Kara grzywny": "À une amende",
  "Utrata prawa głosu": "À la perte du droit de vote",
  "Konstytucja przewiduje skierowanie do służby zastępczej.":
    "La Constitution prévoit l'affectation à un service de remplacement.",
  "W którym roku zawieszono w Polsce obowiązkową zasadniczą służbę wojskową?":
    "En quelle année le service militaire obligatoire a-t-il été suspendu en Pologne ?",
  "2009": "2009",
  "W 2009 roku. Obowiązek obrony ojczyzny pozostał w Konstytucji, ale poboru w czasie pokoju się nie prowadzi.":
    "En 2009. Le devoir de défendre la patrie est resté dans la Constitution, mais on n'appelle plus sous les drapeaux en temps de paix.",
  "Czy udział w wyborach jest w Polsce obowiązkowy?": "Le vote est-il obligatoire en Pologne ?",
  "Nie, głosowanie jest prawem, nie obowiązkiem": "Non, voter est un droit, non un devoir",
  "Tak, za nieoddanie głosu grozi grzywna": "Oui, ne pas voter expose à une amende",
  "Tak, dla osób powyżej 25 lat": "Oui, pour les plus de 25 ans",
  "Tak, w wyborach prezydenckich": "Oui, à l'élection présidentielle",
  "Nie ma kary za nieoddanie głosu. Prawo wybierania przysługuje od 18. roku życia.":
    "Aucune peine ne frappe celui qui ne vote pas. Le droit de voter s'ouvre à 18 ans.",
  "Gdzie mogą głosować obywatele mieszkający za granicą?":
    "Où les citoyens qui vivent à l'étranger peuvent-ils voter ?",
  "W obwodach przy placówkach dyplomatycznych":
    "Dans les bureaux ouverts auprès des postes diplomatiques",
  "Nigdzie — tracą prawo głosu": "Nulle part — ils perdent le droit de vote",
  "Wyłącznie korespondencyjnie do Sejmu": "Uniquement par correspondance, pour le Sejm",
  "Wyłącznie po powrocie do kraju": "Uniquement après leur retour au pays",
  "Przy ambasadach i konsulatach tworzy się obwody głosowania.":
    "Des bureaux de vote sont créés auprès des ambassades et des consulats.",
  "Kto odpowiada za pogorszenie stanu środowiska?":
    "Qui répond de la dégradation de l'environnement ?",
  "Ten, kto je spowodował": "Celui qui l'a causée",
  "Wyłącznie gmina": "La gmina seule",
  "Wyłącznie Skarb Państwa": "Le Trésor public seul",
  "Nikt — to obowiązek moralny bez sankcji": "Personne — c'est un devoir moral sans sanction",
  "Konstytucja wprost wiąże odpowiedzialność ze sprawcą pogorszenia.":
    "La Constitution lie expressément la responsabilité à celui qui a causé la dégradation.",
  "Kto odpowiada za to, żeby dziecko wypełniało obowiązek nauki?":
    "Qui répond de ce qu'un enfant remplisse son obligation d'instruction ?",
  "Rodzice albo opiekunowie": "Les parents ou les tuteurs",
  "Wyłącznie szkoła": "L'école seule",
  "Wójt gminy": "Le wójt de la gmina",
  "Kurator sądowy": "Le délégué judiciaire",
  "Odpowiadają rodzice albo opiekunowie prawni; szkoła publiczna jest przy tym bezpłatna.":
    "Ce sont les parents ou les tuteurs légaux qui en répondent ; l'école publique, elle, est gratuite.",
  "Na ile lat wybiera się Sejm i Senat?": "Pour combien d'années élit-on le Sejm et le Senat ?",
  "Na 3 lata": "Pour 3 ans",
  "Na 4 lata": "Pour 4 ans",
  "Na 5 lat": "Pour 5 ans",
  "Na 6 lat": "Pour 6 ans",
  "Na 4 lata. Prezydenta wybiera się na 5 lat, samorząd również na 5.":
    "Pour 4 ans. Le président s'élit pour 5 ans, les assemblées locales pour 5 également.",
  "Ile lat musi mieć kandydat na posła?":
    "Quel âge faut-il avoir pour se présenter comme député ?",
  "30": "30",
  "21 lat. Senatorem można zostać po ukończeniu 30 lat.":
    "21 ans. On ne peut devenir sénateur qu'à 30 ans révolus.",
  "Ile dni ma Senat na zajęcie stanowiska wobec ustawy Sejmu?":
    "De combien de jours le Senat dispose-t-il pour se prononcer sur une loi du Sejm ?",
  "7 dni": "7 jours",
  "14 dni": "14 jours",
  "30 dni": "30 jours",
  "60 dni": "60 jours",
  "30 dni. Po bezskutecznym upływie terminu ustawę uznaje się za przyjętą.":
    "30 jours. Le délai passé sans suite, la loi est tenue pour adoptée.",
  "Ilu obywateli musi podpisać się pod obywatelskim projektem ustawy?":
    "Combien de citoyens doivent signer une proposition de loi d'initiative citoyenne ?",
  "10 tysięcy": "10 000",
  "50 tysięcy": "50 000",
  "100 tysięcy": "100 000",
  "500 tysięcy": "500 000",
  "100 tysięcy — tyle samo, ile potrzeba do zgłoszenia kandydata na Prezydenta.":
    "100 000 — autant qu'il en faut pour présenter un candidat à la présidence.",
  "Jaki próg wyborczy obowiązuje pojedynczą partię w wyborach do Sejmu?":
    "Quel seuil électoral s'applique à un parti isolé aux élections au Sejm ?",
  "3 procent": "3 pour cent",
  "5 procent": "5 pour cent",
  "8 procent": "8 pour cent",
  "Nie ma progu": "Il n'y a pas de seuil",
  "5 procent dla partii, 8 dla koalicji. Mniejszości narodowe są z progu zwolnione.":
    "5 pour cent pour un parti, 8 pour une coalition. Les minorités nationales en sont dispensées.",
  "Czym różni się sposób wyboru Sejmu od sposobu wyboru Senatu?":
    "En quoi le mode d'élection du Sejm diffère-t-il de celui du Senat ?",
  "Sejm wybiera się proporcjonalnie z list, Senat większościowo w stu okręgach":
    "Le Sejm s'élit à la proportionnelle sur des listes, le Senat au scrutin majoritaire dans cent circonscriptions",
  "Sejm wybiera się większościowo, Senat proporcjonalnie":
    "Le Sejm s'élit au scrutin majoritaire, le Senat à la proportionnelle",
  "Oba wybiera się identycznie": "Les deux s'élisent de la même façon",
  "Senatorów wskazuje Prezydent": "Le président désigne les sénateurs",
  "Do Sejmu głosuje się na listy i dzieli mandaty metodą d'Hondta; w Senacie w każdym okręgu wygrywa jeden kandydat.":
    "Pour le Sejm, on vote pour des listes et les sièges se répartissent selon la méthode d'Hondt ; au Senat, un seul candidat l'emporte dans chaque circonscription.",
  "Jaką większością Sejm odrzuca poprawki Senatu?":
    "À quelle majorité le Sejm rejette-t-il les amendements du Senat ?",
  "Bezwzględną. Trzy piąte potrzebne są do odrzucenia weta Prezydenta.":
    "À la majorité absolue. Les trois cinquièmes sont nécessaires pour repousser le veto du président.",
  "Co to jest Zgromadzenie Narodowe?": "Qu'est-ce que Zgromadzenie Narodowe ?",
  "Sejm i Senat obradujące wspólnie": "Le Sejm et le Senat siégeant ensemble",
  "Zjazd przedstawicieli samorządów": "Un congrès des représentants des collectivités",
  "Posiedzenie Rady Ministrów z Prezydentem":
    "Une séance du Conseil des ministres avec le président",
  "Zebranie wszystkich sędziów Sądu Najwyższego":
    "Une assemblée de tous les juges de la Cour suprême",
  "Zbiera się rzadko: przysięga Prezydenta, uznanie go za trwale niezdolnego, postawienie przed Trybunałem Stanu.":
    "Elle se réunit rarement : le serment du président, la constatation de son incapacité durable, sa mise en accusation devant le Trybunał Stanu.",
  "Co chroni immunitet poselski?": "Que protège l'immunité parlementaire ?",
  "Mandat, a nie osobę — izba może go uchylić":
    "Le mandat, et non la personne — la chambre peut la lever",
  "Osobę dożywotnio": "La personne, à vie",
  "Wyłącznie wypowiedzi na sali sejmowej": "Les seuls propos tenus dans l'hémicycle",
  "Majątek posła przed egzekucją": "Les biens du député contre les saisies",
  "Bez zgody izby nie można pociągnąć posła do odpowiedzialności karnej, ale izba może immunitet uchylić.":
    "Sans l'accord de la chambre, un député ne peut être poursuivi pénalement, mais la chambre peut lever l'immunité.",
  "Kto podpisuje ustawę na końcu drogi legislacyjnej?":
    "Qui signe la loi au bout du parcours législatif ?",
  "Marszałek Sejmu": "Le Marszałek, le président du Sejm",
  "Premier": "Le premier ministre",
  "Prezes Trybunału Konstytucyjnego": "Le président du Trybunał Konstytucyjny",
  "Prezydent — albo podpisuje, albo wetuje, albo kieruje ustawę do Trybunału Konstytucyjnego.":
    "Le président — il signe, ou bien il oppose son veto, ou bien il saisit le Trybunał Konstytucyjny.",
  "Ile lat musi mieć kandydat na Prezydenta?":
    "Quel âge faut-il avoir pour se présenter à la présidence ?",
  "35": "35",
  "40": "40",
  "35 lat i 100 tysięcy podpisów poparcia.": "35 ans et 100 000 signatures de soutien.",
  "Ile kadencji może sprawować ta sama osoba jako Prezydent?":
    "Combien de mandats une même personne peut-elle exercer comme président ?",
  "Jedną": "Un seul",
  "Bez ograniczeń": "Sans limite",
  "Najwyżej dwie pięcioletnie kadencje.": "Deux mandats de cinq ans au plus.",
  "Ile dni ma Prezydent na podpisanie ustawy?":
    "De combien de jours le président dispose-t-il pour signer une loi ?",
  "21 dni": "21 jours",
  "21 dni. W tym czasie może też zawetować ustawę albo skierować ją do Trybunału.":
    "21 jours. Dans ce délai, il peut aussi y opposer son veto ou la porter devant le Trybunał.",
  "Kto zastępuje Prezydenta, gdy ten nie może sprawować urzędu?":
    "Qui remplace le président lorsqu'il ne peut exercer sa charge ?",
  "Marszałek Senatu": "Le Marszałek du Senat",
  "Prezes Sądu Najwyższego": "Le premier président de la Cour suprême",
  "Marszałek Sejmu, a gdyby i on nie mógł — Marszałek Senatu. Tak było w kwietniu 2010 roku.":
    "Le Marszałek du Sejm, et s'il ne le peut pas non plus — le Marszałek du Senat. C'est ce qui s'est passé en avril 2010.",
  "Co to jest kontrasygnata?": "Qu'est-ce que le contreseing ?",
  "Podpis Prezesa Rady Ministrów pod aktem Prezydenta":
    "La signature du président du Conseil des ministres sous un acte du président",
  "Drugie czytanie ustawy w Sejmie": "La deuxième lecture d'une loi au Sejm",
  "Zgoda Senatu na powołanie ministra": "L'accord du Senat à la nomination d'un ministre",
  "Podpis Prezydenta pod uchwałą Sejmu": "La signature du président sous une résolution du Sejm",
  "Premier bierze przez nią odpowiedzialność za akt przed Sejmem. Prerogatywy jej nie wymagają.":
    "Par lui, le premier ministre prend devant le Sejm la responsabilité de l'acte. Les prérogatives propres n'en demandent pas.",
  "Która z tych czynności NIE wymaga kontrasygnaty premiera?":
    "Lequel de ces actes n'exige PAS le contreseing du premier ministre ?",
  "Prawo łaski": "Le droit de grâce",
  "Ratyfikacja umowy międzynarodowej": "La ratification d'un traité international",
  "Powołanie ambasadora": "La nomination d'un ambassadeur",
  "Wydanie rozporządzenia": "La prise d'un arrêté",
  "Prawo łaski jest prerogatywą — podobnie jak zarządzenie wyborów czy nadanie obywatelstwa.":
    "Le droit de grâce est une prérogative propre — comme la convocation des élections ou l'octroi de la nationalité.",
  "Co się dzieje, gdy w pierwszej turze nikt nie zdobędzie ponad połowy głosów?":
    "Que se passe-t-il si personne n'obtient plus de la moitié des voix au premier tour ?",
  "Po dwóch tygodniach odbywa się druga tura między dwoma najlepszymi":
    "Deux semaines plus tard a lieu un second tour entre les deux mieux placés",
  "Wybiera Zgromadzenie Narodowe": "Zgromadzenie Narodowe élit",
  "Wygrywa kandydat z największą liczbą głosów": "Le candidat le mieux placé l'emporte",
  "Wybory powtarza się w całości": "L'élection est entièrement recommencée",
  "Druga tura, dwa tygodnie później, między dwoma kandydatami z najlepszym wynikiem.":
    "Un second tour, deux semaines plus tard, entre les deux candidats les mieux placés.",
  "Gdzie mieści się siedziba Prezydenta Rzeczypospolitej?":
    "Où se trouve la résidence du président de la République ?",
  "Na Wawelu": "Au Wawel",
  "W Pałacu Prezydenckim w Warszawie": "Au palais présidentiel de Varsovie",
  "W Belwederze w Krakowie": "Au Belweder, à Cracovie",
  "W Sejmie": "Au Sejm",
  "Pałac Prezydencki przy Krakowskim Przedmieściu w Warszawie.":
    "Le palais présidentiel, sur le Krakowskie Przedmieście, à Varsovie.",
  "Kim jest Prezydent wobec Sił Zbrojnych?": "Qu'est le président à l'égard des forces armées ?",
  "Najwyższym zwierzchnikiem": "Leur chef suprême",
  "Dowódcą operacyjnym": "Leur commandant opérationnel",
  "Doradcą Ministra Obrony": "Le conseiller du ministre de la Défense",
  "Nie ma z nimi związku": "Il n'a rien à voir avec elles",
  "Najwyższym zwierzchnikiem; w czasie pokoju sprawuje to zwierzchnictwo przez Ministra Obrony Narodowej.":
    "Leur chef suprême ; en temps de paix, il exerce ce commandement par le ministre de la Défense nationale.",
  "Jak inaczej nazywa się Prezes Rady Ministrów?":
    "De quel autre nom appelle-t-on le président du Conseil des ministres ?",
  "Marszałek": "Marszałek",
  "Kanclerz": "Chancelier",
  "Premier. Marszałek kieruje obradami Sejmu albo Senatu.":
    "Premier ministre. Le Marszałek, lui, préside les séances du Sejm ou du Senat.",
  "Kto desygnuje Prezesa Rady Ministrów?": "Qui désigne le président du Conseil des ministres ?",
  "Prezydent desygnuje, a Sejm udziela rządowi wotum zaufania.":
    "Le président le désigne, et le Sejm accorde au gouvernement la confiance.",
  "W ciągu ilu miesięcy parlament musi uchwalić budżet, żeby Prezydent nie mógł skrócić kadencji Sejmu?":
    "En combien de mois le parlement doit-il voter le budget pour que le président ne puisse abréger la législature ?",
  "Dwóch": "Deux",
  "Trzech": "Trois",
  "Czterech": "Quatre",
  "Sześciu": "Six",
  "Czterech miesięcy od przedłożenia projektu.": "Quatre mois à compter du dépôt du projet.",
  "Który organ bada wydatki państwa i podlega Sejmowi?":
    "Quel organe examine les dépenses de l'État et relève du Sejm ?",
  "Ministerstwo Finansów": "Le ministère des Finances",
  "NIK podlega Sejmowi, nie rządowi — dlatego może kontrolować rząd.":
    "La NIK relève du Sejm et non du gouvernement — c'est pourquoi elle peut contrôler celui-ci.",
  "Co określa podział działów administracji rządowej między ministrów?":
    "Qu'est-ce qui fixe la répartition des domaines de l'administration entre les ministres ?",
  "Ustawa": "Une loi",
  "Decyzja premiera": "Une décision du premier ministre",
  "Rozporządzenie Prezydenta": "Un décret du président",
  "Uchwała Sejmu": "Une résolution du Sejm",
  "Ustawa o działach administracji rządowej. Liczba ministerstw bywa różna, ale działy są ustawowe.":
    "La loi sur les domaines de l'administration gouvernementale. Le nombre de ministères varie, mais les domaines sont fixés par la loi.",
  "Który organ sądzi najwyższych urzędników za naruszenie Konstytucji lub ustawy?":
    "Quel organe juge les plus hauts responsables pour violation de la Constitution ou de la loi ?",
  "Trybunał Stanu — za delikty konstytucyjne, a nie za zwykłe przestępstwa.":
    "Le Trybunał Stanu, la Haute Cour — pour les manquements constitutionnels, et non pour les délits ordinaires.",
  "Kto prowadzi bieżącą politykę wewnętrzną i zagraniczną państwa?":
    "Qui conduit au jour le jour la politique intérieure et étrangère de l'État ?",
  "Rada Ministrów. Prezydent reprezentuje państwo i stoi na straży Konstytucji.":
    "Le Conseil des ministres. Le président représente l'État et veille au respect de la Constitution.",
  "Jakiej większości wymaga wotum zaufania dla rządu?":
    "Quelle majorité la confiance au gouvernement exige-t-elle ?",
  "Bezwzględnej większości głosów w obecności co najmniej połowy ustawowej liczby posłów.":
    "La majorité absolue des voix, en présence d'au moins la moitié du nombre légal de députés.",
  "W którym sądzie zaczyna się większość spraw?":
    "Devant quel tribunal la plupart des affaires commencent-elles ?",
  "W rejonowym": "Le tribunal de district",
  "W okręgowym": "Le tribunal régional",
  "W apelacyjnym": "La cour d'appel",
  "W Sądzie Najwyższym": "La Cour suprême",
  "W sądzie rejonowym; odwołania trafiają do okręgowego, dalej do apelacyjnego.":
    "Devant le tribunal de district ; les recours vont au tribunal régional, puis à la cour d'appel.",
  "Który sąd rozpatruje skargę na decyzję urzędu?":
    "Quel tribunal examine un recours contre la décision d'une administration ?",
  "Wojewódzki sąd administracyjny": "Le tribunal administratif de voïvodie",
  "Sąd rejonowy": "Le tribunal de district",
  "Sądy administracyjne mają własną drogę; kasację rozpatruje Naczelny Sąd Administracyjny.":
    "Les juridictions administratives ont leur voie propre ; le pourvoi est examiné par la Cour administrative suprême.",
  "Co oznacza dwuinstancyjność postępowania?": "Que signifie le double degré de juridiction ?",
  "Że od wyroku przysługuje odwołanie": "Qu'un jugement peut faire l'objet d'un recours",
  "Że sprawę sądzi dwóch sędziów": "Que deux juges tranchent l'affaire",
  "Że wyrok zapada po dwóch rozprawach": "Que le jugement tombe après deux audiences",
  "Że rozprawa jest jawna": "Que l'audience est publique",
  "Każdą sprawę można poddać ocenie sądu wyższej instancji.":
    "Toute affaire peut être soumise à l'appréciation d'une juridiction supérieure.",
  "Kto prowadzi postępowanie przygotowawcze i oskarża przed sądem?":
    "Qui mène l'enquête et soutient l'accusation devant le tribunal ?",
  "Adwokat": "L'avocat",
  "Ławnik": "Le juge non professionnel",
  "Prokurator. Adwokat broni, komornik wykonuje orzeczenia.":
    "Le procureur. L'avocat défend, l'huissier exécute les décisions.",
  "Czym zajmuje się Sąd Najwyższy?": "De quoi la Cour suprême s'occupe-t-elle ?",
  "Czuwa nad jednolitością orzecznictwa, nie sądzi spraw od początku":
    "Elle veille à l'unité de la jurisprudence et ne juge pas les affaires depuis le début",
  "Rozpatruje wszystkie sprawy karne w kraju": "Elle examine toutes les affaires pénales du pays",
  "Bada zgodność ustaw z Konstytucją": "Elle contrôle la conformité des lois à la Constitution",
  "Nadzoruje pracę urzędów wojewódzkich":
    "Elle surveille le travail des administrations de voïvodie",
  "Rozpatruje kasacje i podejmuje uchwały wykładnicze; zgodnością ustaw z Konstytucją zajmuje się Trybunał.":
    "Elle examine les pourvois et rend des résolutions d'interprétation ; la conformité des lois à la Constitution revient au Trybunał.",
  "Czemu podlegają sędziowie przy orzekaniu?":
    "À quoi les juges sont-ils soumis lorsqu'ils jugent ?",
  "Tylko Konstytucji i ustawom": "À la seule Constitution et aux lois",
  "Ministrowi Sprawiedliwości": "Au ministre de la Justice",
  "Uchwałom Sejmu": "Aux résolutions du Sejm",
  "Wytycznym prokuratora": "Aux instructions du procureur",
  "Sędziowie są niezawiśli i podlegają wyłącznie Konstytucji oraz ustawom.":
    "Les juges sont indépendants et ne sont soumis qu'à la Constitution et aux lois.",
  "Kto może otrzymać obrońcę z urzędu?": "Qui peut obtenir un avocat commis d'office ?",
  "Osoba, której nie stać na adwokata": "Celui qui n'a pas les moyens de payer un avocat",
  "Każdy, kto o to poprosi": "Quiconque en fait la demande",
  "Tylko cudzoziemcy": "Les seuls étrangers",
  "Nikt — obrońcę trzeba opłacić": "Personne — il faut payer son défenseur",
  "Sąd wyznacza obrońcę z urzędu, gdy oskarżony nie ma środków na obronę.":
    "Le tribunal commet un avocat d'office quand l'accusé n'a pas de quoi se défendre.",
  "Kto wykonuje prawomocne orzeczenia sądu, gdy dłużnik ich nie wypełnia?":
    "Qui exécute les décisions définitives quand le débiteur ne s'y plie pas ?",
  "Policja": "La police",
  "Komornik sądowy prowadzi egzekucję.": "L'huissier de justice conduit l'exécution.",
  "Jak nazywa się podstawowa jednostka samorządu terytorialnego?":
    "Comment s'appelle l'échelon de base des collectivités territoriales ?",
  "Sołectwo": "Le sołectwo",
  "Gmina odpowiada za wszystko, czego nie zastrzeżono dla innych szczebli.":
    "La gmina répond de tout ce qui n'a pas été réservé aux autres échelons.",
  "Kto kieruje gminą wiejską?": "Qui dirige une gmina rurale ?",
  "Wójt": "Le wójt",
  "Burmistrz": "Le burmistrz",
  "Starosta": "Le starosta",
  "Wójt na wsi, burmistrz w mieście, prezydent w większym mieście.":
    "Le wójt à la campagne, le burmistrz en ville, le prezydent dans une ville plus grande.",
  "Kto stoi na czele powiatu?": "Qui est à la tête d'un powiat ?",
  "Starosta, wybierany przez radę powiatu.": "Le starosta, élu par le conseil du powiat.",
  "Który szczebel samorządu zarządza funduszami europejskimi w regionie?":
    "Quel échelon des collectivités gère les fonds européens dans la région ?",
  "Samorząd województwa odpowiada za rozwój regionu i programy regionalne.":
    "La collectivité de voïvodie répond du développement de la région et des programmes régionaux.",
  "Co ile lat odbywają się wybory samorządowe?":
    "Tous les combien d'années ont lieu les élections locales ?",
  "Co 3 lata": "Tous les 3 ans",
  "Co 4 lata": "Tous les 4 ans",
  "Co 5 lat": "Tous les 5 ans",
  "Co 6 lat": "Tous les 6 ans",
  "Co 5 lat — kadencję wydłużono z czterech lat w 2018 roku.":
    "Tous les 5 ans — le mandat est passé de quatre à cinq ans en 2018.",
  "Skąd gmina bierze dochody własne?": "D'où la gmina tire-t-elle ses recettes propres ?",
  "Z podatku od nieruchomości i opłat lokalnych": "De la taxe foncière et des redevances locales",
  "Wyłącznie z dotacji rządowych": "Uniquement des dotations de l'État",
  "Z podatku VAT": "De la TVA",
  "Ze składek zdrowotnych": "Des cotisations de santé",
  "Do tego dochodzi udział w PIT i CIT oraz subwencje z budżetu państwa.":
    "S'y ajoutent une part du PIT et du CIT ainsi que des subventions du budget de l'État.",
  "Jak nazywa się jednostka pomocnicza gminy na wsi?":
    "Comment s'appelle l'unité auxiliaire d'une gmina à la campagne ?",
  "Dzielnica": "La dzielnica",
  "Osiedle": "L'osiedle",
  "Obwód": "L'obwód",
  "Sołectwo, z sołtysem na czele. W mieście są dzielnice albo osiedla.":
    "Le sołectwo, avec un sołtys à sa tête. En ville, ce sont des dzielnice ou des osiedla.",
  "Jak mieszkańcy mogą odwołać wójta przed końcem kadencji?":
    "Comment les habitants peuvent-ils révoquer un wójt avant la fin de son mandat ?",
  "W referendum lokalnym": "Par un référendum local",
  "Uchwałą wojewody": "Par un arrêté du wojewoda",
  "Decyzją premiera": "Par une décision du premier ministre",
  "Nie da się tego zrobić": "C'est impossible",
  "Referendum lokalne może odwołać zarówno wójta, jak i radę.":
    "Un référendum local peut révoquer aussi bien le wójt que le conseil.",
  "Który szczebel samorządu wydaje prawo jazdy i rejestruje pojazdy?":
    "Quel échelon des collectivités délivre le permis de conduire et immatricule les véhicules ?",
  "Starostwo powiatowe. Gmina zajmuje się szkołami podstawowymi i sprawami lokalnymi.":
    "L'administration du powiat. La gmina, elle, s'occupe des écoles primaires et des affaires locales.",
  "Który władca przyjął chrzest w 966 roku?": "Quel souverain a reçu le baptême en 966 ?",
  "Mieszko I": "Mieszko I",
  "Bolesław Chrobry": "Bolesław Chrobry",
  "Kazimierz Wielki": "Kazimierz Wielki",
  "Władysław Jagiełło": "Władysław Jagiełło",
  "Mieszko I, książę Polan. Jego syn Bolesław Chrobry koronował się w 1025 roku.":
    "Mieszko I, duc des Polanes. Son fils Bolesław Chrobry s'est fait couronner en 1025.",
  "Jak nazywała się pierwsza dynastia panująca w Polsce?":
    "Comment s'appelait la première dynastie régnante de Pologne ?",
  "Piastowie": "Les Piast",
  "Jagiellonowie": "Les Jagellon",
  "Wazowie": "Les Vasa",
  "Habsburgowie": "Les Habsbourg",
  "Piastowie, od Mieszka I do 1370 roku. Potem przyszli Jagiellonowie.":
    "Les Piast, de Mieszko I à 1370. Vinrent ensuite les Jagellon.",
  "Kto był pierwszym koronowanym królem Polski?": "Qui fut le premier roi couronné de Pologne ?",
  "Władysław Łokietek": "Władysław Łokietek",
  "Bolesław Chrobry, w 1025 roku. Mieszko I był księciem, nie królem.":
    "Bolesław Chrobry, en 1025. Mieszko I était duc, non roi.",
  "O którym władcy mówi się, że „zastał Polskę drewnianą, a zostawił murowaną”?":
    "De quel souverain dit-on qu'il « trouva une Pologne de bois et en laissa une de pierre » ?",
  "O Bolesławie Chrobrym": "De Bolesław Chrobry",
  "O Kazimierzu Wielkim": "De Kazimierz Wielki",
  "O Władysławie Jagielle": "De Władysław Jagiełło",
  "O Janie III Sobieskim": "De Jan III Sobieski",
  "O Kazimierzu Wielkim (1333–1370), ostatnim królu z dynastii Piastów.":
    "De Kazimierz Wielki (1333–1370), le dernier roi de la dynastie des Piast.",
  "Co ustaliła unia lubelska z 1569 roku?": "Qu'a établi l'union de Lublin de 1569 ?",
  "Powstanie Rzeczypospolitej Obojga Narodów":
    "La naissance de la Rzeczpospolita des Deux Nations",
  "Chrzest Litwy": "Le baptême de la Lituanie",
  "Rozejm z Krzyżakami": "Une trêve avec les chevaliers Teutoniques",
  "Powrót stolicy do Gniezna": "Le retour de la capitale à Gniezno",
  "Polska i Litwa utworzyły jedno państwo ze wspólnym sejmem i wspólnym królem.":
    "La Pologne et la Lituanie ont formé un seul État, avec une diète commune et un roi commun.",
  "Co oznaczało liberum veto?": "Que signifiait le liberum veto ?",
  "Że jeden poseł mógł zerwać obrady sejmu":
    "Qu'un seul député pouvait faire échouer les travaux de la diète",
  "Że król mógł odrzucić każdą ustawę": "Que le roi pouvait rejeter toute loi",
  "Że szlachta wybierała króla": "Que la noblesse élisait le roi",
  "Że mieszczanie mieli głos w sejmie": "Que les bourgeois avaient voix à la diète",
  "Sprzeciw jednego posła unieważniał obrady — z czasem sparaliżowało to państwo.":
    "L'opposition d'un seul député annulait les travaux — avec le temps, cela a paralysé l'État.",
  "Co wydarzyło się w 1385 roku w Krewie?": "Que s'est-il passé à Krewo en 1385 ?",
  "Zawarto unię Polski z Litwą": "L'union de la Pologne et de la Lituanie fut conclue",
  "Wybuchła wojna z Krzyżakami": "La guerre contre les chevaliers Teutoniques éclata",
  "Uchwalono pierwszą konstytucję": "La première constitution fut votée",
  "Przeniesiono stolicę do Warszawy": "La capitale fut transférée à Varsovie",
  "Jagiełło przyjął chrzest, ożenił się z Jadwigą i został królem Polski.":
    "Jagiełło reçut le baptême, épousa Jadwiga et devint roi de Pologne.",
  "Kto ogłosił teorię heliocentryczną w polskim złotym wieku?":
    "Qui a énoncé la théorie héliocentrique pendant le siècle d'or polonais ?",
  "Mikołaj Kopernik": "Mikołaj Kopernik, Copernic",
  "Jan Kochanowski": "Jan Kochanowski",
  "Jan Długosz": "Jan Długosz",
  "Andrzej Frycz Modrzewski": "Andrzej Frycz Modrzewski",
  "Mikołaj Kopernik. Kochanowski był poetą piszącym po polsku zamiast po łacinie.":
    "Mikołaj Kopernik, que le français appelle Copernic. Kochanowski, lui, était un poète qui écrivait en polonais et non en latin.",
  "Które miasto było pierwszą stolicą Polski?":
    "Quelle ville fut la première capitale de la Pologne ?",
  "Gniezno": "Gniezno",
  "Gniezno; tam w 1000 roku doszło do zjazdu z cesarzem Ottonem III.":
    "Gniezno ; c'est là qu'eut lieu en l'an 1000 la rencontre avec l'empereur Otton III.",
  "Które państwa dokonały rozbiorów Polski?":
    "Quels États ont procédé aux partages de la Pologne ?",
  "Rosja, Prusy i Austria": "La Russie, la Prusse et l'Autriche",
  "Rosja, Szwecja i Turcja": "La Russie, la Suède et la Turquie",
  "Prusy, Francja i Austria": "La Prusse, la France et l'Autriche",
  "Austria, Węgry i Rosja": "L'Autriche, la Hongrie et la Russie",
  "Trzy rozbiory w latach 1772, 1793 i 1795.": "Trois partages, en 1772, 1793 et 1795.",
  "W którym roku doszło do trzeciego rozbioru Polski?":
    "En quelle année eut lieu le troisième partage de la Pologne ?",
  "1772": "1772",
  "1793": "1793",
  "1795": "1795",
  "1795 — po nim państwo polskie zniknęło z mapy na 123 lata.":
    "1795 — après lui, l'État polonais disparut de la carte pour 123 ans.",
  "Kto poprowadził insurekcję z 1794 roku?": "Qui a mené l'insurrection de 1794 ?",
  "Tadeusz Kościuszko": "Tadeusz Kościuszko",
  "Romuald Traugutt": "Romuald Traugutt",
  "Jan Henryk Dąbrowski": "Jan Henryk Dąbrowski",
  "Tadeusz Kościuszko. Po klęsce nastąpił trzeci rozbiór.":
    "Tadeusz Kościuszko. La défaite fut suivie du troisième partage.",
  "W którym roku wybuchło powstanie listopadowe?":
    "En quelle année a éclaté l'insurrection de Novembre ?",
  "1794": "1794",
  "1846": "1846",
  "1863": "1863",
  "1830, w Warszawie, przeciw Rosji. Styczniowe wybuchło w 1863.":
    "En 1830, à Varsovie, contre la Russie. Celle de Janvier a éclaté en 1863.",
  "Który zabór uzyskał w 1867 roku autonomię z polskimi szkołami i sejmem?":
    "Quelle zone de partage a obtenu en 1867 une autonomie avec des écoles et une diète polonaises ?",
  "Rosyjski": "La russe",
  "Pruski": "La prussienne",
  "Austriacki": "L'autrichienne",
  "Żaden": "Aucune",
  "Galicja w zaborze austriackim — uboga, ale z sejmem krajowym we Lwowie.":
    "La Galicie, en zone autrichienne — pauvre, mais dotée d'une diète régionale à Lwów.",
  "Na czym polegała praca organiczna?": "En quoi consistait le travail organique ?",
  "Na zakładaniu szkół, spółdzielni i czytelni zamiast zbrojnych zrywów":
    "À fonder des écoles, des coopératives et des salles de lecture au lieu de se soulever en armes",
  "Na przygotowaniach do kolejnego powstania": "À préparer une nouvelle insurrection",
  "Na emigracji zarobkowej do Ameryki": "À émigrer en Amérique pour y gagner sa vie",
  "Na współpracy z władzami zaborczymi w administracji":
    "À collaborer avec les autorités occupantes dans l'administration",
  "Kierunek przyjęty po klęsce 1863 roku: wzmacnianie społeczeństwa zamiast walki zbrojnej.":
    "La voie choisie après la défaite de 1863 : fortifier la société au lieu de combattre les armes à la main.",
  "Za co Maria Skłodowska-Curie otrzymała pierwszą Nagrodę Nobla w 1903 roku?":
    "Pour quoi Maria Skłodowska-Curie a-t-elle reçu son premier prix Nobel en 1903 ?",
  "Za fizykę": "Pour la physique",
  "Za chemię": "Pour la chimie",
  "Za literaturę": "Pour la littérature",
  "Za medycynę": "Pour la médecine",
  "Fizyka w 1903, chemia w 1911 — jako pierwsza osoba uhonorowana Noblem dwukrotnie.":
    "La physique en 1903, la chimie en 1911 — première personne à recevoir deux fois le Nobel.",
  "Który kompozytor jest najbardziej znanym Polakiem epoki romantyzmu?":
    "Quel compositeur est le Polonais le plus connu de l'époque romantique ?",
  "Karol Szymanowski": "Karol Szymanowski",
  "Stanisław Moniuszko": "Stanisław Moniuszko",
  "Fryderyk Chopin. Jego imię nosi konkurs pianistyczny w Warszawie.":
    "Fryderyk Chopin. Le concours de piano de Varsovie porte son nom.",
  "Komu Rada Regencyjna przekazała władzę wojskową 11 listopada 1918 roku?":
    "À qui le Conseil de régence a-t-il remis le pouvoir militaire le 11 novembre 1918 ?",
  "Józefowi Piłsudskiemu": "À Józef Piłsudski",
  "Romanowi Dmowskiemu": "À Roman Dmowski",
  "Ignacemu Paderewskiemu": "À Ignacy Paderewski",
  "Wincentemu Witosowi": "À Wincenty Witos",
  "Józefowi Piłsudskiemu. Dzień ten jest dziś Narodowym Świętem Niepodległości.":
    "À Józef Piłsudski. Ce jour est aujourd'hui la fête nationale de l'Indépendance.",
  "Jak nazywa się reforma, która w 1924 roku wprowadziła złotego?":
    "Comment s'appelle la réforme qui a introduit le złoty en 1924 ?",
  "Reforma Grabskiego": "La réforme de Grabski",
  "Plan Balcerowicza": "Le plan Balcerowicz",
  "Reforma Wielopolskiego": "La réforme de Wielopolski",
  "Plan Marshalla": "Le plan Marshall",
  "Reforma Władysława Grabskiego. Plan Balcerowicza to rok 1990.":
    "La réforme de Władysław Grabski. Le plan Balcerowicz, lui, date de 1990.",
  "Który port zbudowano od podstaw w dwudziestoleciu międzywojennym?":
    "Quel port a été bâti de rien pendant l'entre-deux-guerres ?",
  "Gdynię": "Gdynia",
  "Szczecin": "Szczecin",
  "Świnoujście": "Świnoujście",
  "Gdynię, od 1926 roku — Gdańsk był wtedy Wolnym Miastem.":
    "Gdynia, à partir de 1926 — Gdańsk était alors ville libre.",
  "Jaka część mieszkańców II Rzeczypospolitej należała do mniejszości narodowych?":
    "Quelle part des habitants de la deuxième République appartenait aux minorités nationales ?",
  "Około jedna dziesiąta": "Environ un dixième",
  "Około jedna trzecia": "Environ un tiers",
  "Około połowa": "Environ la moitié",
  "Prawie nikt": "Presque personne",
  "Około jednej trzeciej: Ukraińcy, Żydzi, Białorusini, Niemcy, Litwini. Dziś kraj jest jednolity narodowościowo.":
    "Un tiers environ : Ukrainiens, Juifs, Biélorusses, Allemands, Lituaniens. Aujourd'hui, le pays est d'une seule nationalité.",
  "Ile systemów prawnych odziedziczyła Polska po zaborcach w 1918 roku?":
    "Combien de systèmes juridiques la Pologne a-t-elle hérités des puissances de partage en 1918 ?",
  "Jeden": "Un",
  "Dwa": "Deux",
  "Sześć": "Six",
  "Trzy — po każdym z zaborców. Do tego różne koleje i cztery waluty w obiegu.":
    "Trois — un par puissance de partage. À quoi s'ajoutaient des chemins de fer différents et quatre monnaies en circulation.",
  "Jak nazywano okres rządów obozu piłsudczykowskiego po 1926 roku?":
    "Comment appelait-on la période de gouvernement du camp de Piłsudski après 1926 ?",
  "Sanacja": "La sanacja",
  "Odwilż": "Le dégel",
  "Transformacja": "La transformation",
  "Restauracja": "La restauration",
  "Sanacja, czyli „uzdrowienie”. Rola parlamentu w tym czasie malała.":
    "La sanacja, c'est-à-dire « l'assainissement ». Le rôle du parlement s'amenuisait pendant ces années.",
  "W którym roku uchwalono konstytucję marcową?":
    "En quelle année la constitution de mars a-t-elle été votée ?",
  "1921": "1921",
  "1926": "1926",
  "1935": "1935",
  "1921. Konstytucja kwietniowa to 1935 rok.":
    "En 1921. La constitution d'avril, elle, date de 1935.",
  "Od ostrzału którego miejsca rozpoczęła się II wojna światowa?":
    "Par le bombardement de quel lieu la Seconde Guerre mondiale a-t-elle commencé ?",
  "Westerplatte": "Westerplatte",
  "Wawelu": "Le Wawel",
  "Twierdzy Modlin": "La forteresse de Modlin",
  "Helu": "Hel",
  "Westerplatte pod Gdańskiem, 1 września 1939 roku o świcie.":
    "Westerplatte, près de Gdańsk, le 1er septembre 1939 à l'aube.",
  "Które państwo zaatakowało Polskę 17 września 1939 roku?":
    "Quel État a attaqué la Pologne le 17 septembre 1939 ?",
  "Związek Radziecki": "L'Union soviétique",
  "Węgry": "La Hongrie",
  "Słowacja": "La Slovaquie",
  "Rumunia": "La Roumanie",
  "ZSRR, wykonując tajny protokół paktu Ribbentrop–Mołotow.":
    "L'URSS, appliquant le protocole secret du pacte Ribbentrop-Molotov.",
  "Jak nazywała się największa podziemna armia okupowanej Europy?":
    "Comment s'appelait la plus grande armée clandestine de l'Europe occupée ?",
  "Armia Ludowa": "Armia Ludowa",
  "Legiony Polskie": "Les Légions polonaises",
  "Bataliony Chłopskie": "Bataliony Chłopskie",
  "Armia Krajowa, podległa rządowi w Londynie.":
    "L'Armia Krajowa, l'armée de l'intérieur, qui relevait du gouvernement de Londres.",
  "W którym roku wybuchło powstanie w getcie warszawskim?":
    "En quelle année a éclaté le soulèvement du ghetto de Varsovie ?",
  "1942": "1942",
  "1943": "1943",
  "Kwiecień 1943. Powstanie Warszawskie to sierpień 1944 — to dwa różne zrywy.":
    "Avril 1943. L'insurrection de Varsovie, elle, date d'août 1944 — ce sont deux soulèvements distincts.",
  "Ile dni trwało Powstanie Warszawskie?": "Combien de jours a duré l'insurrection de Varsovie ?",
  "23 dni": "23 jours",
  "43 dni": "43 jours",
  "63 dni": "63 jours",
  "83 dni": "83 jours",
  "63 dni, od 1 sierpnia 1944. Po jego upadku miasto zostało celowo zburzone.":
    "63 jours, à partir du 1er août 1944. Après sa chute, la ville fut détruite délibérément.",
  "Co wydarzyło się w Katyniu wiosną 1940 roku?": "Que s'est-il passé à Katyń au printemps 1940 ?",
  "NKWD zamordowało blisko 22 tysiące polskich oficerów":
    "Le NKVD a assassiné près de 22 000 officiers polonais",
  "Wybuchło powstanie przeciw Niemcom": "Un soulèvement contre les Allemands a éclaté",
  "Podpisano rozejm z ZSRR": "Un armistice a été signé avec l'URSS",
  "Utworzono getto": "Un ghetto a été créé",
  "Zbrodnia katyńska — mord na oficerach, policjantach i urzędnikach, przez dekady zaprzeczany.":
    "Le massacre de Katyń — le meurtre d'officiers, de policiers et de fonctionnaires, nié pendant des décennies.",
  "Jak nazywała się organizacja niosąca w okupowanej Polsce pomoc Żydom?":
    "Comment s'appelait l'organisation qui portait secours aux Juifs en Pologne occupée ?",
  "Żegota": "Żegota",
  "Żagiew": "Żagiew",
  "Zośka": "Zośka",
  "Wachlarz": "Wachlarz",
  "Rada Pomocy Żydom „Żegota”. Za pomoc groziła kara śmierci, także dla całej rodziny.":
    "Le conseil d'aide aux Juifs, « Żegota ». Aider valait la peine de mort, y compris pour toute la famille.",
  "Którą bitwę stoczyli w 1944 roku żołnierze generała Andersa we Włoszech?":
    "Quelle bataille les soldats du général Anders ont-ils livrée en Italie en 1944 ?",
  "O Monte Cassino": "Celle du Monte Cassino",
  "Pod Lenino": "Celle de Lenino",
  "Pod Falaise": "Celle de Falaise",
  "O Arnhem": "Celle d'Arnhem",
  "Monte Cassino, po przejściu szlaku przez Bliski Wschód.":
    "Le Monte Cassino, au terme d'un chemin qui passait par le Proche-Orient.",
  "Jaką część ludności straciła Polska w czasie II wojny światowej?":
    "Quelle part de sa population la Pologne a-t-elle perdue pendant la Seconde Guerre mondiale ?",
  "Około jedną dwudziestą": "Environ un vingtième",
  "Około jedną dziesiątą": "Environ un dixième",
  "Około jedną piątą": "Environ un cinquième",
  "Około połowę": "Environ la moitié",
  "Około 6 milionów osób, blisko jedna piąta przedwojennej ludności.":
    "Environ 6 millions de personnes, près d'un cinquième de la population d'avant-guerre.",
  "Jak nazywała się partia rządząca w PRL?":
    "Comment s'appelait le parti au pouvoir sous la République populaire ?",
  "PZPR": "Le PZPR",
  "PSL": "Le PSL",
  "AK": "AK",
  "NSZZ": "NSZZ",
  "Polska Zjednoczona Partia Robotnicza, jedyna partia sprawująca władzę.":
    "Le Parti ouvrier unifié polonais, seul parti à exercer le pouvoir.",
  "W której stoczni wybuchł strajk, który doprowadził do powstania Solidarności?":
    "Dans quel chantier naval a éclaté la grève qui a donné naissance à Solidarność ?",
  "W Gdańskiej": "Celui de Gdańsk",
  "W Szczecińskiej": "Celui de Szczecin",
  "W Gdyńskiej": "Celui de Gdynia",
  "W Ustce": "Celui d'Ustka",
  "Stocznia Gdańska, sierpień 1980. Strajki objęły też Szczecin i inne miasta.":
    "Le chantier naval de Gdańsk, en août 1980. Les grèves ont aussi gagné Szczecin et d'autres villes.",
  "Kto stanął na czele Solidarności w 1980 roku?": "Qui a pris la tête de Solidarność en 1980 ?",
  "Jacek Kuroń": "Jacek Kuroń",
  "Bronisław Geremek": "Bronisław Geremek",
  "Lech Wałęsa, elektryk ze Stoczni Gdańskiej, późniejszy prezydent.":
    "Lech Wałęsa, électricien du chantier naval de Gdańsk, plus tard président.",
  "Kto wprowadził stan wojenny 13 grudnia 1981 roku?":
    "Qui a proclamé l'état de guerre le 13 décembre 1981 ?",
  "Edward Gierek": "Edward Gierek",
  "Władysław Gomułka": "Władysław Gomułka",
  "Stanisław Kania": "Stanisław Kania",
  "Generał Wojciech Jaruzelski. Solidarność została zdelegalizowana, działacze internowani.":
    "Le général Wojciech Jaruzelski. Solidarność fut mise hors la loi et ses militants internés.",
  "W którym roku Karol Wojtyła został papieżem?":
    "En quelle année Karol Wojtyła est-il devenu pape ?",
  "1978": "1978",
  "1978. Jego pielgrzymka do Polski rok później miała ogromne znaczenie społeczne.":
    "En 1978. Son pèlerinage en Pologne l'année suivante eut une portée sociale immense.",
  "Jak nazywano nielegalny obieg książek i pism w PRL?":
    "Comment appelait-on la circulation clandestine des livres et des revues sous la République populaire ?",
  "Drugi obieg": "Le second circuit",
  "Czarna prasa": "La presse noire",
  "Wolne słowo": "La parole libre",
  "Podziemna poczta": "La poste clandestine",
  "Drugi obieg, zwany też samizdatem — druk i kolportaż poza cenzurą.":
    "Le second circuit, qu'on appelait aussi samizdat — imprimer et diffuser hors de la censure.",
  "Jaki organ powstał po strajkach w Radomiu i Ursusie w 1976 roku?":
    "Quel organe est né après les grèves de Radom et d'Ursus en 1976 ?",
  "Komitet Obrony Robotników": "Le Comité de défense des ouvriers",
  "Polska Zjednoczona Partia Robotnicza": "Le Parti ouvrier unifié polonais",
  "Rada Państwa": "Le Conseil d'État",
  "KOR — inteligenci wspierający represjonowanych robotników; jeden z korzeni Solidarności.":
    "Le KOR — des intellectuels au secours des ouvriers réprimés ; l'une des racines de Solidarność.",
  "Co oznaczały kartki w PRL?": "Que signifiaient les tickets sous la République populaire ?",
  "Reglamentację towarów, na przykład mięsa i cukru":
    "Le rationnement des marchandises, la viande et le sucre par exemple",
  "Bilety komunikacji miejskiej": "Des titres de transport urbain",
  "Zaproszenia na zebrania partyjne": "Des invitations aux réunions du parti",
  "Legitymacje szkolne": "Des cartes d'élève",
  "System kartkowy przydzielał ograniczone ilości towarów w gospodarce niedoboru.":
    "Le système de tickets attribuait des quantités limitées dans une économie de pénurie.",
  "Jak nazywały się rozmowy władzy z opozycją wiosną 1989 roku?":
    "Comment s'appelaient les pourparlers entre le pouvoir et l'opposition au printemps 1989 ?",
  "Porozumienia sierpniowe": "Les accords d'août",
  "Konferencja w Poczdamie": "La conférence de Potsdam",
  "Pakt gdański": "Le pacte de Gdańsk",
  "Okrągły Stół; ustalono na nim częściowo wolne wybory 4 czerwca.":
    "La Table ronde ; on y arrêta des élections partiellement libres pour le 4 juin.",
  "Kto został pierwszym niekomunistycznym premierem w bloku wschodnim?":
    "Qui est devenu le premier chef de gouvernement non communiste du bloc de l'Est ?",
  "Leszek Balcerowicz": "Leszek Balcerowicz",
  "Jan Olszewski": "Jan Olszewski",
  "Tadeusz Mazowiecki, we wrześniu 1989 roku.": "Tadeusz Mazowiecki, en septembre 1989.",
  "Jak nazywał się program reform gospodarczych z 1990 roku?":
    "Comment s'appelait le programme de réformes économiques de 1990 ?",
  "Program Wilczka": "Le programme Wilczek",
  "Plan Balcerowicza otworzył rynek; ceny wzrosły, ale zniknęły puste półki.":
    "Le plan Balcerowicz a ouvert le marché ; les prix ont monté, mais les rayons vides ont disparu.",
  "Co zmieniła reforma administracyjna z 1999 roku?":
    "Qu'a changé la réforme administrative de 1999 ?",
  "49 województw zastąpiono 16 i przywrócono powiaty":
    "Les 49 voïvodies ont été remplacées par 16 et les powiaty rétablis",
  "Zniesiono gminy": "Les gminy ont été supprimées",
  "Wprowadzono podział na dzielnice": "Une division en dzielnice a été introduite",
  "Połączono województwa z powiatami": "Les voïvodies ont été fondues avec les powiaty",
  "Z 49 województw zrobiono 16, a powiaty wróciły jako środkowy szczebel.":
    "Des 49 voïvodies on en a fait 16, et les powiaty sont revenus comme échelon intermédiaire.",
  "Ilu członków miało Zgromadzenie Narodowe wybrać na prezydenta w 1989 roku, zanim wprowadzono wybory powszechne?":
    "Comment le président était-il élu en 1989, avant l'instauration du suffrage universel ?",
  "Prezydenta wybrało wtedy Zgromadzenie Narodowe, nie obywatele":
    "Le président fut alors élu par Zgromadzenie Narodowe, et non par les citoyens",
  "Prezydenta wybrali obywatele już w 1989 roku":
    "Les citoyens élisaient déjà le président en 1989",
  "Urzędu prezydenta wtedy nie było": "La charge de président n'existait pas alors",
  "Prezydenta wskazał premier": "Le premier ministre désignait le président",
  "W 1989 roku prezydenta wybrało Zgromadzenie Narodowe; pierwsze wybory powszechne odbyły się rok później.":
    "En 1989, le président fut élu par Zgromadzenie Narodowe ; la première élection au suffrage universel eut lieu un an plus tard.",
  "Co wydarzyło się 10 kwietnia 2010 roku?": "Que s'est-il passé le 10 avril 2010 ?",
  "Katastrofa samolotu pod Smoleńskiem": "L'accident d'avion près de Smolensk",
  "Wejście do strefy Schengen": "L'entrée dans l'espace Schengen",
  "Referendum europejskie": "Le référendum européen",
  "Powódź tysiąclecia": "La crue du millénaire",
  "Zginęło 96 osób, w tym prezydent Lech Kaczyński. Delegacja leciała na obchody rocznicy zbrodni katyńskiej.":
    "96 personnes ont péri, dont le président Lech Kaczyński. La délégation se rendait aux commémorations du massacre de Katyń.",
  "W którym roku odbyły się w Polsce pierwsze wolne wybory samorządowe?":
    "En quelle année ont eu lieu en Pologne les premières élections locales libres ?",
  "1990 — odrodziły się wtedy gminy jako samorząd.":
    "En 1990 — les gminy renaissaient alors comme collectivités.",
  "Z iloma państwami graniczy Polska?": "Avec combien d'États la Pologne a-t-elle une frontière ?",
  "Z pięcioma": "Avec cinq",
  "Z sześcioma": "Avec six",
  "Z siedmioma": "Avec sept",
  "Z ośmioma": "Avec huit",
  "Siedem: Niemcy, Czechy, Słowacja, Ukraina, Białoruś, Litwa i Rosja.":
    "Sept : l'Allemagne, la Tchéquie, la Slovaquie, l'Ukraine, la Biélorussie, la Lituanie et la Russie.",
  "Nad którym morzem leży Polska?": "Au bord de quelle mer la Pologne se trouve-t-elle ?",
  "Nad Bałtykiem": "De la Baltique",
  "Nad Morzem Północnym": "De la mer du Nord",
  "Nad Adriatykiem": "De l'Adriatique",
  "Nad Morzem Czarnym": "De la mer Noire",
  "Nad Morzem Bałtyckim, na północy kraju.": "De la mer Baltique, au nord du pays.",
  "Ile wynosi powierzchnia Polski?": "Quelle est la superficie de la Pologne ?",
  "Około 213 tysięcy km²": "Environ 213 000 km²",
  "Około 312 tysięcy km²": "Environ 312 000 km²",
  "Około 412 tysięcy km²": "Environ 412 000 km²",
  "Około 512 tysięcy km²": "Environ 512 000 km²",
  "Około 312 700 km² — szóste miejsce w Unii Europejskiej.":
    "Environ 312 700 km² — le sixième rang dans l'Union européenne.",
  "Jak nazywa się kraina jezior na północnym wschodzie kraju?":
    "Comment s'appelle la région des lacs au nord-est du pays ?",
  "Podlasie": "La Podlachie",
  "Kaszuby": "La Cachoubie",
  "Kujawy": "La Cujavie",
  "Mazury; największe jezioro to Śniardwy.": "La Mazurie ; le plus grand lac en est le Śniardwy.",
  "Które zwierzę jest symbolem Puszczy Białowieskiej?":
    "Quel animal est le symbole de la forêt de Białowieża ?",
  "Żubr": "Le bison d'Europe",
  "Ryś": "Le lynx",
  "Niedźwiedź": "L'ours",
  "Bocian": "La cigogne",
  "Żubr. Puszcza Białowieska jest ostatnim fragmentem pierwotnej puszczy niżowej Europy.":
    "Le bison d'Europe. La forêt de Białowieża est le dernier morceau de la forêt primaire de plaine en Europe.",
  "Jaki klimat panuje w Polsce?": "Quel climat règne en Pologne ?",
  "Umiarkowany przejściowy": "Tempéré de transition",
  "Śródziemnomorski": "Méditerranéen",
  "Kontynentalny suchy": "Continental sec",
  "Oceaniczny wilgotny": "Océanique humide",
  "Przejściowy między morskim a kontynentalnym — stąd zmienna pogoda i wyraźne cztery pory roku.":
    "De transition entre le maritime et le continental — d'où un temps changeant et quatre saisons bien marquées.",
  "Ile parków narodowych jest w Polsce?": "Combien de parcs nationaux compte la Pologne ?",
  "23": "23",
  "23. Najwyżej położony to Tatrzański, nad morzem leży Słowiński z ruchomymi wydmami.":
    "23. Le plus haut est celui des Tatras ; au bord de la mer se trouve celui de Słowiński, avec ses dunes mouvantes.",
  "W którym kierunku opada rzeźba terenu Polski?":
    "Dans quelle direction le relief de la Pologne s'abaisse-t-il ?",
  "Z południa na północ": "Du sud vers le nord",
  "Ze wschodu na zachód": "De l'est vers l'ouest",
  "Z północy na południe": "Du nord vers le sud",
  "Z zachodu na wschód": "De l'ouest vers l'est",
  "Góry na południu, niziny i wybrzeże na północy — dlatego rzeki płyną na północ.":
    "Les montagnes au sud, les plaines et la côte au nord — c'est pourquoi les fleuves coulent vers le nord.",
  "Ile metrów wysokości mają Rysy?": "Quelle est l'altitude du Rysy ?",
  "1602 m": "1602 m",
  "2499 m": "2499 m",
  "3000 m": "3000 m",
  "1725 m": "1725 m",
  "2499 m n.p.m. Śnieżka w Karkonoszach ma 1602 m.":
    "2499 m au-dessus du niveau de la mer. La Śnieżka, dans les Karkonosze, culmine à 1602 m.",
  "Które miasto jest stolicą Polski?": "Quelle ville est la capitale de la Pologne ?",
  "Warszawa, od końca XVI wieku. Wcześniej stolicą był Kraków.":
    "Varsovie, depuis la fin du seizième siècle. Auparavant, la capitale était Cracovie.",
  "Ile mniej więcej osób mieszka w Polsce?": "Combien de personnes vivent à peu près en Pologne ?",
  "Około 18 milionów": "Environ 18 millions",
  "Około 28 milionów": "Environ 28 millions",
  "Około 37 milionów": "Environ 37 millions",
  "Około 50 milionów": "Environ 50 millions",
  "Około 37–38 milionów.": "Environ 37 à 38 millions.",
  "Które miasto jest największym portem Polski?":
    "Quelle ville est le plus grand port de Pologne ?",
  "Kołobrzeg": "Kołobrzeg",
  "Gdańsk — także miasto porozumień sierpniowych i początku Solidarności.":
    "Gdańsk — la ville, aussi, des accords d'août et des débuts de Solidarność.",
  "Nad którą rzeką leży Wrocław?": "Au bord de quel fleuve Wrocław se trouve-t-elle ?",
  "Nad Wisłą": "De la Vistule",
  "Nad Odrą": "De l'Oder",
  "Nad Wartą": "De la Warta",
  "Nad Bugiem": "Du Boug",
  "Nad Odrą. Poznań leży nad Wartą, Warszawa i Kraków nad Wisłą.":
    "De l'Oder. Poznań est sur la Warta, Varsovie et Cracovie sur la Vistule.",
  "Który obiekt w Polsce wpisano na listę UNESCO jako kopalnię czynną od średniowiecza?":
    "Quel site polonais figure au patrimoine de l'UNESCO comme une mine en activité depuis le Moyen Âge ?",
  "Wieliczkę": "Wieliczka",
  "Zamość": "Zamość",
  "Malbork": "Malbork",
  "Toruń": "Toruń",
  "Kopalnia soli w Wieliczce, z kaplicami wykutymi w solnej skale.":
    "La mine de sel de Wieliczka, avec ses chapelles taillées dans la roche de sel.",
  "Za co wpisano warszawską Starówkę na listę UNESCO?":
    "Pourquoi la vieille ville de Varsovie a-t-elle été inscrite au patrimoine de l'UNESCO ?",
  "Za powojenną odbudowę zniszczonego miasta":
    "Pour la reconstruction d'après-guerre de la ville détruite",
  "Za zachowane oryginalne mury średniowieczne":
    "Pour ses murailles médiévales d'origine conservées",
  "Za architekturę modernistyczną": "Pour son architecture moderniste",
  "Za układ urbanistyczny z XIX wieku": "Pour son plan urbain du dix-neuvième siècle",
  "Właśnie za odbudowę — wyjątkowy przypadek na tej liście.":
    "Précisément pour cette reconstruction — un cas unique sur cette liste.",
  "Które województwo ma siedziby władz w dwóch różnych miastach?":
    "Quelle voïvodie a le siège de ses autorités dans deux villes différentes ?",
  "Kujawsko-pomorskie": "La Cujavie-Poméranie",
  "Mazowieckie": "La Mazovie",
  "Małopolskie": "La Petite-Pologne",
  "Podlaskie": "La Podlachie",
  "Sejmik obraduje w Toruniu, a wojewoda urzęduje w Bydgoszczy. Podobnie dzieli się województwo lubuskie.":
    "Le sejmik siège à Toruń tandis que le wojewoda a ses bureaux à Bydgoszcz. La voïvodie de Lubusz se partage de la même façon.",
  "Jaki język ma w Polsce status języka regionalnego?":
    "Quelle langue a en Pologne le statut de langue régionale ?",
  "Kaszubski": "Le cachoube",
  "Śląski": "Le silésien",
  "Łemkowski": "Le lemke",
  "Góralski": "Le parler des montagnards",
  "Kaszubski. Uznanych mniejszości narodowych jest dziewięć, etnicznych cztery.":
    "Le cachoube. Les minorités nationales reconnues sont au nombre de neuf, les minorités ethniques de quatre.",
  "Które miasto jest siedzibą Uniwersytetu Jagiellońskiego?":
    "Quelle ville abrite l'université Jagellon ?",
  "Lublin": "Lublin",
  "Kraków; uczelnia działa od 1364 roku.": "Cracovie ; l'université fonctionne depuis 1364.",
  "Na ile groszy dzieli się złoty?": "En combien de grosz le złoty se divise-t-il ?",
  "1000": "1000",
  "Na 100 groszy.": "En 100 grosz.",
  "Który bank emituje polski pieniądz?": "Quelle banque émet la monnaie polonaise ?",
  "Bank Gospodarstwa Krajowego": "La Bank Gospodarstwa Krajowego",
  "Europejski Bank Centralny": "La Banque centrale européenne",
  "PKO BP": "La PKO BP",
  "Narodowy Bank Polski. EBC emituje euro, którego Polska nie przyjęła.":
    "La Banque nationale de Pologne. La BCE émet l'euro, que la Pologne n'a pas adopté.",
  "Ile wynosi podstawowa stawka VAT?": "Quel est le taux normal de la TVA ?",
  "19 procent": "19 pour cent",
  "21 procent": "21 pour cent",
  "23 procent": "23 pour cent",
  "25 procent": "25 pour cent",
  "23 procent. Na żywność, książki i niektóre usługi obowiązują stawki niższe.":
    "23 pour cent. Des taux plus bas s'appliquent aux denrées, aux livres et à certains services.",
  "Ile dni urlopu przysługuje pracownikowi ze stażem powyżej 10 lat?":
    "À combien de jours de congé a droit un salarié qui a plus de dix ans d'ancienneté ?",
  "20 dni": "20 jours",
  "24 dni": "24 jours",
  "26 dni": "26 jours",
  "26 dni. Poniżej 10 lat stażu — 20 dni. Nauka wlicza się do stażu.":
    "26 jours. Au-dessous de dix ans d'ancienneté — 20 jours. Les années d'études comptent dans l'ancienneté.",
  "Która instytucja pobiera składki emerytalne i rentowe?":
    "Quelle institution perçoit les cotisations de retraite et d'invalidité ?",
  "ZUS": "Le ZUS",
  "NBP": "La NBP",
  "KRUS dla wszystkich": "La KRUS, pour tous",
  "Zakład Ubezpieczeń Społecznych. NFZ finansuje leczenie, KRUS dotyczy rolników.":
    "Le ZUS, la caisse des assurances sociales. Le NFZ finance les soins, la KRUS concerne les agriculteurs.",
  "W jakim wieku przechodzą na emeryturę kobiety i mężczyźni?":
    "À quel âge les femmes et les hommes partent-ils à la retraite ?",
  "Kobiety w wieku 60 lat, mężczyźni 65": "Les femmes à 60 ans, les hommes à 65",
  "Wszyscy w wieku 65 lat": "Tous à 65 ans",
  "Kobiety 62, mężczyźni 67": "Les femmes à 62, les hommes à 67",
  "Wszyscy w wieku 67 lat": "Tous à 67 ans",
  "60 i 65 lat. Wysokość emerytury zależy od sumy składek i przewidywanej długości życia.":
    "60 et 65 ans. Le montant de la retraite dépend du total des cotisations et de l'espérance de vie retenue.",
  "Gdzie wpisuje się spółki, a nie jednoosobową działalność?":
    "Où inscrit-on les sociétés, et non l'activité en nom propre ?",
  "Do KRS": "Au KRS",
  "Do CEIDG": "Au CEIDG",
  "Do ZUS": "Au ZUS",
  "Do urzędu skarbowego": "Au centre des impôts",
  "Krajowy Rejestr Sądowy. CEIDG służy jednoosobowej działalności gospodarczej.":
    "Le KRS, le registre judiciaire national. Le CEIDG sert à l'activité économique en nom propre.",
  "Ile godzin dziennie wynosi zasadniczo czas pracy?":
    "Combien d'heures par jour dure en principe le temps de travail ?",
  "6 godzin": "6 heures",
  "7 godzin": "7 heures",
  "8 godzin": "8 heures",
  "10 godzin": "10 heures",
  "8 godzin dziennie i przeciętnie 40 tygodniowo w przyjętym okresie rozliczeniowym.":
    "8 heures par jour et 40 en moyenne par semaine sur la période de référence retenue.",
  "Jaki numer identyfikacyjny jest potrzebny do rozliczeń podatkowych firmy?":
    "Quel numéro d'identification faut-il pour les déclarations fiscales d'une entreprise ?",
  "NIP": "Le NIP",
  "REGON": "Le REGON",
  "IBAN": "L'IBAN",
  "NIP. PESEL identyfikuje osobę fizyczną, REGON jest numerem statystycznym.":
    "Le NIP. Le PESEL identifie une personne physique, le REGON est un numéro statistique.",
  "Ile państw wstąpiło do Unii Europejskiej razem z Polską w 2004 roku?":
    "Combien d'États sont entrés dans l'Union européenne en même temps que la Pologne en 2004 ?",
  "Cztery": "Quatre",
  "Dziewięć": "Neuf",
  "Dwanaście": "Douze",
  "Polska i dziewięć innych państw — największe rozszerzenie w historii Unii.":
    "La Pologne et neuf autres États — le plus grand élargissement de l'histoire de l'Union.",
  "Od kiedy Polska należy do strefy Schengen?":
    "Depuis quand la Pologne appartient-elle à l'espace Schengen ?",
  "Od 1999": "Depuis 1999",
  "Od 2004": "Depuis 2004",
  "Od 2007": "Depuis 2007",
  "Od 2014": "Depuis 2014",
  "Od 2007 roku — granice wewnętrzne przekracza się od tej pory bez kontroli.":
    "Depuis 2007 — on franchit depuis lors les frontières intérieures sans contrôle.",
  "Jak nazywa się współpraca regionalna Polski z Czechami, Słowacją i Węgrami?":
    "Comment s'appelle la coopération régionale de la Pologne avec la Tchéquie, la Slovaquie et la Hongrie ?",
  "Grupa Wyszehradzka": "Le groupe de Visegrád",
  "Trójkąt Weimarski": "Le triangle de Weimar",
  "Rada Nordycka": "Le Conseil nordique",
  "Inicjatywa Trójmorza": "L'initiative des Trois Mers",
  "Grupa Wyszehradzka. Trójkąt Weimarski to współpraca z Niemcami i Francją.":
    "Le groupe de Visegrád. Le triangle de Weimar, lui, est la coopération avec l'Allemagne et la France.",
  "Co ile lat Polacy wybierają posłów do Parlamentu Europejskiego?":
    "Tous les combien d'années les Polonais élisent-ils leurs députés au Parlement européen ?",
  "Co 7 lat": "Tous les 7 ans",
  "Co 5 lat, w wyborach bezpośrednich.": "Tous les 5 ans, au suffrage direct.",
  "Jaka część głosujących poparła wejście do Unii w referendum z 2003 roku?":
    "Quelle part des votants a approuvé l'entrée dans l'Union au référendum de 2003 ?",
  "Ponad połowa": "Plus de la moitié",
  "Ponad dwie trzecie": "Plus des deux tiers",
  "Ponad trzy czwarte": "Plus des trois quarts",
  "Ponad dziewięć dziesiątych": "Plus des neuf dixièmes",
  "Ponad trzy czwarte głosujących, przy frekwencji blisko 59 procent.":
    "Plus des trois quarts des votants, pour une participation proche de 59 pour cent.",
  "Dlaczego wschodnia granica Polski ma szczególne znaczenie?":
    "Pourquoi la frontière orientale de la Pologne compte-t-elle particulièrement ?",
  "Jest zarazem zewnętrzną granicą Unii Europejskiej i NATO":
    "Elle est en même temps la frontière extérieure de l'Union européenne et de l'OTAN",
  "Jest najkrótszą granicą kraju": "C'est la plus courte frontière du pays",
  "Nie jest strzeżona": "Elle n'est pas gardée",
  "Przebiega wyłącznie po rzekach": "Elle suit uniquement des cours d'eau",
  "Granica z Ukrainą, Białorusią i Rosją jest granicą zewnętrzną obu organizacji.":
    "La frontière avec l'Ukraine, la Biélorussie et la Russie est la frontière extérieure des deux organisations.",
  "Ile mniej więcej osób liczy Polonia na świecie?":
    "Combien de personnes compte à peu près la diaspora polonaise dans le monde ?",
  "Około miliona": "Environ un million",
  "Kilka milionów": "Quelques millions",
  "Kilkanaście do dwudziestu milionów": "De dix et quelques à vingt millions",
  "Ponad pięćdziesiąt milionów": "Plus de cinquante millions",
  "Szacunki mówią o kilkunastu do dwudziestu milionów; największe skupiska są w USA, Niemczech i Wielkiej Brytanii.":
    "Les estimations vont de dix et quelques à vingt millions ; les plus grands groupes se trouvent aux États-Unis, en Allemagne et au Royaume-Uni.",
  "Co stało się w Polsce po pełnoskalowej agresji Rosji na Ukrainę w 2022 roku?":
    "Que s'est-il passé en Pologne après l'agression russe à grande échelle contre l'Ukraine en 2022 ?",
  "Przez kraj przeszły miliony uchodźców": "Des millions de réfugiés ont traversé le pays",
  "Zamknięto granicę zachodnią": "La frontière occidentale a été fermée",
  "Wprowadzono stan wojenny": "L'état de guerre a été proclamé",
  "Polska wystąpiła z NATO": "La Pologne est sortie de l'OTAN",
  "Największy ruch ludności w tej części Europy od czasów II wojny światowej.":
    "Le plus grand mouvement de population dans cette partie de l'Europe depuis la Seconde Guerre mondiale.",
  "Które wyznanie deklaruje w Polsce największa część mieszkańców?":
    "Quelle confession la plus grande part des habitants déclare-t-elle en Pologne ?",
  "Rzymskokatolickie": "La catholique romaine",
  "Prawosławne": "L'orthodoxe",
  "Ewangelickie": "La protestante",
  "Żadne": "Aucune",
  "Rzymskokatolickie, choć udział praktykujących od lat maleje.":
    "La catholique romaine, même si la part des pratiquants recule depuis des années.",
  "Jaka umowa reguluje stosunki państwa z Kościołem katolickim?":
    "Quel accord règle les rapports de l'État avec l'Église catholique ?",
  "Konkordat": "Le concordat",
  "Ustawa wyznaniowa": "La loi sur les cultes",
  "Konkordat ze Stolicą Apostolską z 1993 roku.":
    "Le concordat conclu avec le Saint-Siège en 1993.",
  "W którym regionie mieszka najwięcej wyznawców prawosławia?":
    "Dans quelle région vivent le plus de fidèles orthodoxes ?",
  "Na Podlasiu": "En Podlachie",
  "Na Śląsku": "En Silésie",
  "Na Pomorzu": "En Poméranie",
  "W Wielkopolsce": "En Grande-Pologne",
  "Na Podlasiu, przy wschodniej granicy kraju.":
    "En Podlachie, le long de la frontière orientale du pays.",
  "Kto decyduje, czy dziecko chodzi w szkole na religię?":
    "Qui décide si un enfant suit le cours de religion à l'école ?",
  "Rodzice albo pełnoletni uczeń": "Les parents, ou l'élève majeur",
  "Dyrektor szkoły": "Le chef d'établissement",
  "Proboszcz parafii": "Le curé de la paroisse",
  "Religia jest nieobowiązkowa; alternatywą jest etyka albo żadne z tych zajęć.":
    "La religion est facultative ; on peut lui préférer l'éthique, ou ni l'une ni l'autre.",
  "Gdzie stoją zabytkowe meczety Tatarów polskich?":
    "Où se dressent les mosquées anciennes des Tatars de Pologne ?",
  "W Kruszynianach i Bohonikach": "À Kruszyniany et à Bohoniki",
  "W Zakopanem i Nowym Targu": "À Zakopane et à Nowy Targ",
  "W Gdańsku i Gdyni": "À Gdańsk et à Gdynia",
  "We Wrocławiu i Opolu": "À Wrocław et à Opole",
  "Na Podlasiu; Tatarzy osiedli tam przed wiekami.":
    "En Podlachie ; les Tatars s'y sont établis il y a des siècles.",
  "W którym regionie żyje najwięcej ewangelików?":
    "Dans quelle région vivent le plus de protestants ?",
  "Na Śląsku Cieszyńskim": "En Silésie de Cieszyn",
  "Na Mazurach": "En Mazurie",
  "Na Kaszubach": "En Cachoubie",
  "W Małopolsce": "En Petite-Pologne",
  "Na Śląsku Cieszyńskim, gdzie protestantyzm ma nieprzerwaną tradycję od reformacji.":
    "En Silésie de Cieszyn, où le protestantisme a une tradition ininterrompue depuis la Réforme.",
  "Czy Polska ma religię państwową?": "La Pologne a-t-elle une religion d'État ?",
  "Nie": "Non",
  "Tak, katolicyzm": "Oui, le catholicisme",
  "Tak, prawosławie": "Oui, l'orthodoxie",
  "Tak, ale tylko formalnie": "Oui, mais formellement seulement",
  "Nie. Państwo jest bezstronne w sprawach przekonań religijnych.":
    "Non. L'État est impartial en matière de convictions religieuses.",
  "Które miasto jest siedzibą prymasa Polski?": "Quelle ville est le siège du primat de Pologne ?",
  "Częstochowa": "Częstochowa",
  "Gniezno, pierwsza stolica i najstarsza metropolia w kraju.":
    "Gniezno, première capitale et plus ancienne métropole du pays.",
  "Co upamiętnia 1 sierpnia?": "Que commémore le 1er août ?",
  "Powstanie Warszawskie z 1944 roku. O 17.00 w Warszawie wyją syreny.":
    "L'insurrection de Varsovie de 1944. À 17 heures, les sirènes hurlent dans la ville.",
  "Który dzień jest w Polsce Świętem Wojska Polskiego?":
    "Quel jour est en Pologne la fête de l'armée ?",
  "15 sierpnia": "Le 15 août",
  "15 sierpnia, w rocznicę Bitwy Warszawskiej; tego samego dnia przypada Wniebowzięcie.":
    "Le 15 août, anniversaire de la bataille de Varsovie ; l'Assomption tombe le même jour.",
  "Ile potraw tradycyjnie podaje się na wigilijnym stole?":
    "Combien de plats sert-on traditionnellement au repas de la veille de Noël ?",
  "Trzynaście": "Treize",
  "Dwanaście. Zwyczajowo zostawia się też jedno wolne miejsce przy stole.":
    "Douze. L'usage veut aussi qu'on laisse une place libre à table.",
  "Jak nazywa się zwyczaj polewania wodą w poniedziałek wielkanocny?":
    "Comment s'appelle la coutume d'arroser d'eau le lundi de Pâques ?",
  "Dożynki": "Dożynki",
  "Ostatki": "Ostatki",
  "Śmigus-dyngus — zwyczaj starszy niż chrześcijaństwo w Polsce.":
    "Śmigus-dyngus — une coutume plus ancienne que le christianisme en Pologne.",
  "Co robi się w Polsce 1 listopada?": "Que fait-on en Pologne le 1er novembre ?",
  "Odwiedza się groby bliskich i zapala znicze":
    "On visite les tombes des siens et l'on y allume des lumignons",
  "Świętuje się początek roku szkolnego": "On fête la rentrée des classes",
  "Obchodzi się rocznicę niepodległości": "On célèbre l'anniversaire de l'indépendance",
  "Organizuje się dożynki": "On organise la fête des moissons",
  "Wszystkich Świętych. Cmentarze świecą wtedy przez całą noc.":
    "La Toussaint. Les cimetières brillent alors toute la nuit.",
  "Kiedy obchodzi się andrzejki?": "Quand fête-t-on les andrzejki ?",
  "29 listopada": "Le 29 novembre",
  "6 grudnia": "Le 6 décembre",
  "31 grudnia": "Le 31 décembre",
  "2 lutego": "Le 2 février",
  "Wieczór 29 listopada, z wróżbami z lanego wosku. 6 grudnia to mikołajki.":
    "Le soir du 29 novembre, avec les présages tirés de la cire versée. Le 6 décembre, c'est la Saint-Nicolas.",
  "Kiedy zaczyna się w Polsce rok szkolny?": "Quand commence l'année scolaire en Pologne ?",
  "1 września": "Le 1er septembre",
  "15 września": "Le 15 septembre",
  "1 października": "Le 1er octobre",
  "Po Wszystkich Świętych": "Après la Toussaint",
  "1 września; kończy się w drugiej połowie czerwca.":
    "Le 1er septembre ; elle s'achève dans la seconde moitié de juin.",
  "Które dwa dni grudnia są w Polsce wolne od pracy z okazji Bożego Narodzenia?":
    "Quels deux jours de décembre sont chômés en Pologne pour Noël ?",
  "24 i 25 grudnia": "Les 24 et 25 décembre",
  "25 i 26 grudnia": "Les 25 et 26 décembre",
  "26 i 27 grudnia": "Les 26 et 27 décembre",
  "24 i 31 grudnia": "Les 24 et 31 décembre",
  "25 i 26 grudnia. Wigilia 24 grudnia jest dniem pracującym, choć zwykle skróconym.":
    "Les 25 et 26 décembre. Le 24, la veillée, est un jour ouvré, le plus souvent écourté.",
  "Jakim egzaminem kończy się szkoła podstawowa?":
    "Par quel examen l'école primaire se termine-t-elle ?",
  "Egzaminem ósmoklasisty": "Par l'examen de huitième année",
  "Maturą": "Par la matura",
  "Egzaminem zawodowym": "Par un examen professionnel",
  "Testem kompetencji": "Par un test de compétences",
  "Egzaminem ósmoklasisty. Matura kończy liceum albo technikum.":
    "Par l'examen de huitième année. La matura, elle, clôt le lycée général ou le lycée technique.",
  "Ile lat trwa liceum ogólnokształcące?": "Combien d'années dure le lycée général ?",
  "3 lata": "3 ans",
  "Cztery lata. Technikum trwa pięć.": "Quatre ans. Le lycée technique en dure cinq.",
  "Czy studia dzienne na uczelniach publicznych są płatne?":
    "Les études à temps plein dans les établissements publics sont-elles payantes ?",
  "Nie, są bezpłatne": "Non, elles sont gratuites",
  "Tak, dla wszystkich": "Oui, pour tout le monde",
  "Tak, poza pierwszym rokiem": "Oui, sauf la première année",
  "Studia dzienne na uczelniach publicznych są bezpłatne; płatne bywają zaoczne i uczelnie prywatne.":
    "Les études à temps plein dans le public sont gratuites ; les cursus du soir et les établissements privés, eux, peuvent être payants.",
  "Która instytucja finansuje leczenie ze składek?":
    "Quelle institution finance les soins par les cotisations ?",
  "KRUS": "La KRUS",
  "GUS": "Le GUS",
  "Narodowy Fundusz Zdrowia. ZUS zajmuje się emeryturami i rentami.":
    "Le NFZ, le fonds national de santé. Le ZUS, lui, s'occupe des retraites et des pensions.",
  "Do kogo idzie się najpierw z problemem zdrowotnym?":
    "Vers qui va-t-on d'abord avec un problème de santé ?",
  "Do lekarza rodzinnego": "Chez le médecin de famille",
  "Bezpośrednio do specjalisty": "Directement chez un spécialiste",
  "Na izbę przyjęć": "Au service des urgences",
  "Do apteki": "À la pharmacie",
  "Lekarz podstawowej opieki zdrowotnej kieruje dalej do specjalisty.":
    "Le médecin de premier recours adresse ensuite au spécialiste.",
  "Ile cyfr ma numer PESEL?": "Combien de chiffres compte le numéro PESEL ?",
  "Dziesięć": "Dix",
  "Jedenaście": "Onze",
  "Jedenaście. Zawiera datę urodzenia, a przedostatnia cyfra oznacza płeć.":
    "Onze. Il contient la date de naissance, et l'avant-dernier chiffre indique le sexe.",
  "Jak dziś wygląda recepta na lek?": "À quoi ressemble aujourd'hui une ordonnance ?",
  "To e-recepta: kod z SMS-a albo z aplikacji":
    "C'est une ordonnance électronique : un code reçu par SMS ou dans une application",
  "Papierowy druk z pieczątką": "Un imprimé papier avec un cachet",
  "Wpis do książeczki zdrowia": "Une mention dans le carnet de santé",
  "Ustne polecenie lekarza": "Une consigne orale du médecin",
  "E-recepta. Część leków jest refundowana, czyli tańsza dzięki dopłacie NFZ.":
    "L'ordonnance électronique. Une partie des médicaments est remboursée, donc moins chère grâce à la participation du NFZ.",
  "Która uczelnia w Polsce jest najstarsza?":
    "Quelle est la plus ancienne université de Pologne ?",
  "Politechnika Warszawska": "L'École polytechnique de Varsovie",
  "Uniwersytet Jagielloński, założony w 1364 roku.": "L'université Jagellon, fondée en 1364.",
  "Gdzie załatwia się większość spraw urzędowych mieszkańca?":
    "Où règle-t-on la plupart de ses démarches administratives ?",
  "W urzędzie gminy albo miasta": "À la mairie de la gmina ou de la ville",
  "W sądzie rejonowym": "Au tribunal de district",
  "W urzędzie skarbowym": "Au centre des impôts",
  "W urzędzie gminy lub miasta, a coraz częściej przez internet.":
    "À la mairie de la gmina ou de la ville, et de plus en plus souvent par internet.",
  "Co pozwala potwierdzić tożsamość w urzędowych sprawach przez internet?":
    "Qu'est-ce qui permet de prouver son identité en ligne dans les démarches administratives ?",
  "Profil zaufany": "Le profil zaufany, le profil de confiance",
  "Numer REGON": "Le numéro REGON",
  "Karta biblioteczna": "La carte de bibliothèque",
  "Adres e-mail": "Une adresse électronique",
  "Profil zaufany, obok aplikacji mObywatel.":
    "Le profil zaufany, à côté de l'application mObywatel.",
  "Jak wygląda handel w niedziele?": "Qu'en est-il du commerce le dimanche ?",
  "Jest ograniczony ustawą, z wyjątkami": "Une loi le limite, avec des exceptions",
  "Jest całkowicie zakazany": "Il est entièrement interdit",
  "Odbywa się bez ograniczeń": "Il se fait sans restriction",
  "Zależy od decyzji wojewody": "Cela dépend d'une décision du wojewoda",
  "Otwarte pozostają między innymi piekarnie, stacje paliw i sklepy prowadzone przez właściciela.":
    "Restent ouverts, entre autres, les boulangeries, les stations-service et les magasins tenus par leur propriétaire.",
  "Jak zwraca się do osoby starszej albo nieznajomej?":
    "Comment s'adresse-t-on à une personne âgée ou inconnue ?",
  "„Pan” albo „pani”": "Par « pan » ou « pani », monsieur ou madame",
  "Po imieniu": "Par son prénom",
  "„Cześć”": "Par « cześć », salut",
  "„Ty”": "Par « ty », tu",
  "Formy „pan” i „pani” są w Polsce standardem wobec osób nieznajomych i starszych.":
    "Les formes « pan » et « pani » sont la règle en Pologne avec les inconnus et les personnes plus âgées.",
  "Który organ konstytucyjny czuwa nad rynkiem mediów?":
    "Quel organe constitutionnel veille sur le marché des médias ?",
  "Krajowa Rada Radiofonii i Telewizji": "Le Conseil national de la radio et de la télévision",
  "Ministerstwo Kultury": "Le ministère de la Culture",
  "Urząd Ochrony Konkurencji i Konsumentów": "L'Office de la concurrence et de la consommation",
  "KRRiT, wymieniona wprost w Konstytucji.": "La KRRiT, que la Constitution nomme expressément.",
  "Co ile lat odbywa się w Warszawie Konkurs Chopinowski?":
    "Tous les combien d'années le concours Chopin a-t-il lieu à Varsovie ?",
  "Co dwa lata": "Tous les deux ans",
  "Co trzy lata": "Tous les trois ans",
  "Co pięć lat": "Tous les cinq ans",
  "Co dziesięć lat": "Tous les dix ans",
  "Co pięć lat — jeden z najstarszych konkursów pianistycznych na świecie.":
    "Tous les cinq ans — l'un des plus anciens concours de piano au monde.",
  "Które dyscypliny sportu są w Polsce najpopularniejsze?":
    "Quels sports sont les plus aimés en Pologne ?",
  "Piłka nożna i siatkówka": "Le football et le volley-ball",
  "Krykiet i rugby": "Le cricket et le rugby",
  "Baseball i hokej": "Le baseball et le hockey",
  "Golf i tenis": "Le golf et le tennis",
  "Piłka nożna i siatkówka; zimą kraj ogląda też skoki narciarskie.":
    "Le football et le volley-ball ; l'hiver, le pays regarde aussi le saut à ski.",
  "Które danie jest tradycyjną potrawą polskiej kuchni?":
    "Quel plat appartient à la cuisine traditionnelle polonaise ?",
  "Pierogi": "Les pierogi",
  "Paella": "La paella",
  "Sushi": "Les sushis",
  "Gulasz węgierski": "Le goulasch hongrois",
  "Pierogi, obok bigosu, żurku, rosołu i kotleta schabowego.":
    "Les pierogi, à côté du bigos, du żurek, du bouillon et de l'escalope panée.",
  "Jak wygląda własność mieszkań w Polsce na tle Europy?":
    "Qu'en est-il de la propriété du logement en Pologne, comparée au reste de l'Europe ?",
  "Udział własności jest jednym z najwyższych":
    "La part des propriétaires est l'une des plus élevées",
  "Prawie wszyscy wynajmują": "Presque tout le monde loue",
  "Mieszkania należą do gmin": "Les logements appartiennent aux gminy",
  "Własność jest zakazana": "La propriété est interdite",
  "Większość ludzi mieszka we własnym mieszkaniu albo domu.":
    "La plupart des gens habitent leur propre appartement ou leur propre maison.",
  "Który poeta jest jednym z najbardziej znanych twórców dwudziestolecia międzywojennego?":
    "Quel poète est l'un des auteurs les plus connus de l'entre-deux-guerres ?",
  "Julian Tuwim": "Julian Tuwim",
  "Wisława Szymborska": "Wisława Szymborska",
  "Julian Tuwim. Mickiewicz to romantyzm, Kochanowski renesans, Szymborska druga połowa XX wieku.":
    "Julian Tuwim. Mickiewicz appartient au romantisme, Kochanowski à la Renaissance, Szymborska à la seconde moitié du vingtième siècle.",
  "W którym roku powstało Polskie Radio?":
    "En quelle année la Radio polonaise a-t-elle été créée ?",
  "1924": "1924",
  "1930": "1930",
  "1924 — jedna z instytucji budowanych w młodym państwie od podstaw.":
    "En 1924 — l'une des institutions bâties de rien dans le jeune État.",
  "Który konflikt zakończyła Bitwa Warszawska?":
    "Quel conflit la bataille de Varsovie a-t-elle clos ?",
  "Wojnę z Rosją bolszewicką": "La guerre contre la Russie bolchévique",
  "I wojnę światową": "La Première Guerre mondiale",
  "Powstanie wielkopolskie": "L'insurrection de Grande-Pologne",
  "Wojnę z Czechosłowacją": "La guerre contre la Tchécoslovaquie",
  "Wojnę polsko-bolszewicką. Zatrzymała ofensywę zmierzającą na zachód Europy.":
    "La guerre polono-bolchévique. Elle a arrêté une offensive qui marchait vers l'ouest de l'Europe.",
  "Jaką część miejsc w Senacie zdobyła Solidarność w wyborach 4 czerwca 1989 roku?":
    "Combien de sièges au Senat Solidarność a-t-elle emportés à l'élection du 4 juin 1989 ?",
  "99 na 100": "99 sur 100",
  "65 na 100": "65 sur 100",
  "50 na 100": "50 sur 100",
  "35 na 100": "35 sur 100",
  "99 na 100. W Sejmie zdobyła wszystkie mandaty, o które wolno jej było się ubiegać.":
    "99 sur 100. Au Sejm, elle a remporté tous les sièges auxquels il lui était permis de prétendre.",
  "Kto był prezydentem Polski bezpośrednio po Lechu Wałęsie?":
    "Qui a été président de Pologne immédiatement après Lech Wałęsa ?",
  "Lech Kaczyński": "Lech Kaczyński",
  "Bronisław Komorowski": "Bronisław Komorowski",
  "Andrzej Duda": "Andrzej Duda",
  "Aleksander Kwaśniewski, przez dwie kadencje.": "Aleksander Kwaśniewski, pour deux mandats.",
  "Jaka była największa zmiana gospodarcza początku lat dziewięćdziesiątych?":
    "Quel fut le plus grand changement économique du début des années quatre-vingt-dix ?",
  "Przejście od gospodarki planowanej do rynkowej":
    "Le passage de l'économie planifiée à l'économie de marché",
  "Wprowadzenie euro": "L'introduction de l'euro",
  "Nacjonalizacja przemysłu": "La nationalisation de l'industrie",
  "Wprowadzenie kartek na żywność": "L'instauration des tickets de rationnement",
  "Otwarcie rynku. Ceny wzrosły i wiele zakładów upadło, ale niedobory się skończyły.":
    "L'ouverture du marché. Les prix ont monté et bien des usines ont fermé, mais les pénuries ont cessé.",
  "Czy Konstytucja nakłada obowiązki także na osoby niebędące obywatelami?":
    "La Constitution impose-t-elle aussi des devoirs à ceux qui ne sont pas citoyens ?",
  "Tak, obowiązek przestrzegania prawa dotyczy każdego":
    "Oui, le devoir de respecter le droit vaut pour chacun",
  "Nie, wyłącznie na obywateli": "Non, pour les seuls citoyens",
  "Tylko na osoby pracujące": "Seulement pour ceux qui travaillent",
  "Tylko na osoby zameldowane": "Seulement pour ceux qui sont déclarés domiciliés",
  "Przestrzeganie prawa obowiązuje każdego pod władzą Rzeczypospolitej; obrona ojczyzny — obywateli.":
    "Respecter le droit oblige quiconque se trouve sous l'autorité de la République ; défendre la patrie oblige les citoyens.",
  "Czym jest wstępnie wypełnione zeznanie podatkowe?":
    "Qu'est-ce qu'une déclaration de revenus préremplie ?",
  "Rozliczeniem przygotowanym przez urząd, które wystarczy sprawdzić i zatwierdzić":
    "Un décompte préparé par l'administration, qu'il suffit de vérifier et de valider",
  "Zeznaniem składanym przez pracodawcę zamiast pracownika":
    "Une déclaration déposée par l'employeur à la place du salarié",
  "Wnioskiem o zwolnienie z podatku": "Une demande d'exonération d'impôt",
  "Deklaracją składaną co miesiąc": "Une déclaration à déposer chaque mois",
  "Urząd skarbowy udostępnia je przez internet; podatnik może je poprawić albo przyjąć.":
    "Le centre des impôts la met en ligne ; le contribuable peut la corriger ou l'accepter.",
  "Kto wybiera ławników?": "Qui élit les juges non professionnels ?",
  "Rady gmin": "Les conseils de gmina",
  "Minister Sprawiedliwości": "Le ministre de la Justice",
  "Rady gmin. Przy wyrokowaniu ławnik ma taki sam głos jak sędzia zawodowy.":
    "Les conseils de gmina. Au moment de juger, le ławnik a la même voix qu'un juge de métier.",
  "Czy Trybunał Konstytucyjny może zmienić wyrok w konkretnej sprawie?":
    "Le Trybunał Konstytucyjny peut-il réformer un jugement dans une affaire donnée ?",
  "Nie, przygląda się przepisowi, a nie rozstrzygnięciu":
    "Non, il examine le texte et non la décision",
  "Tak, jest sądem najwyższej instancji": "Oui, c'est la juridiction de dernier ressort",
  "Tak, na wniosek prokuratora": "Oui, à la demande du procureur",
  "Tak, w sprawach karnych": "Oui, en matière pénale",
  "Trybunał bada zgodność przepisu z Konstytucją; wyroki zmieniają sądy wyższej instancji.":
    "Le Trybunał contrôle la conformité d'un texte à la Constitution ; ce sont les juridictions supérieures qui réforment les jugements.",
  "Czym są interpelacje poselskie?": "Que sont les interpellations parlementaires ?",
  "Pisemnymi pytaniami posłów do członków rządu":
    "Des questions écrites de députés aux membres du gouvernement",
  "Wnioskami o odwołanie rządu": "Des motions de renvoi du gouvernement",
  "Projektami ustaw": "Des projets de loi",
  "Uchwałami Senatu": "Des résolutions du Senat",
  "Narzędzie kontroli: poseł pyta, minister ma obowiązek odpowiedzieć.":
    "Un outil de contrôle : le député interroge, le ministre est tenu de répondre.",
  "Co się dzieje, gdy Sejm nie udzieli rządowi wotum zaufania w pierwszym kroku?":
    "Que se passe-t-il si le Sejm refuse la confiance au gouvernement à la première étape ?",
  "Inicjatywę przejmuje Sejm, a Konstytucja przewiduje kolejne kroki":
    "L'initiative revient au Sejm, et la Constitution prévoit les étapes suivantes",
  "Rozpisuje się natychmiast nowe wybory": "De nouvelles élections sont aussitôt convoquées",
  "Rząd i tak obejmuje urząd": "Le gouvernement entre en fonction tout de même",
  "Decyduje Senat": "C'est le Senat qui décide",
  "Konstytucja przewiduje trzy kolejne procedury, żeby państwo nie zostało bez rządu.":
    "La Constitution prévoit trois procédures successives, pour que l'État ne reste pas sans gouvernement.",
  "Co zapoczątkował robotniczy protest w Poznaniu w 1956 roku?":
    "Qu'a inauguré la protestation ouvrière de Poznań en 1956 ?",
  "Powstanie Solidarności": "La naissance de Solidarność",
  "Rozwiązanie PZPR": "La dissolution du PZPR",
  "Protest stłumiono wojskiem, ale zapoczątkował okres politycznej odwilży.":
    "La protestation fut écrasée par l'armée, mais elle ouvrit une période de dégel politique.",
  "Ilu członków liczyła Solidarność w szczytowym momencie?":
    "Combien de membres Solidarność comptait-elle à son sommet ?",
  "Około trzech milionów": "Environ trois millions",
  "Blisko dziesięciu milionów": "Près de dix millions",
  "Ponad dwadzieścia milionów": "Plus de vingt millions",
  "Blisko dziesięć milionów — w kraju liczącym wtedy około 36 milionów mieszkańców.":
    "Près de dix millions — dans un pays qui comptait alors quelque 36 millions d'habitants.",
  "Co nastąpiło po klęsce powstania styczniowego w zaborze rosyjskim?":
    "Que s'ensuivit-il, en zone russe, après la défaite de l'insurrection de Janvier ?",
  "Nasilona rusyfikacja, konfiskaty i zsyłki":
    "Une russification renforcée, des confiscations et des déportations",
  "Przyznanie autonomii": "L'octroi d'une autonomie",
  "Zniesienie cenzury": "La suppression de la censure",
  "Powrót polskiego sejmu": "Le retour d'une diète polonaise",
  "Represje objęły szkolnictwo, majątki i tysiące uczestników zesłanych na Sybir.":
    "La répression a touché l'école, les biens, et des milliers de participants déportés en Sibérie.",
  "Który malarz utrwalał sceny z historii Polski w czasie zaborów?":
    "Quel peintre a fixé des scènes de l'histoire polonaise au temps des partages ?",
  "Jan Matejko": "Jan Matejko",
  "Stanisław Wyspiański": "Stanisław Wyspiański",
  "Jacek Malczewski": "Jacek Malczewski",
  "Józef Chełmoński": "Józef Chełmoński",
  "Jan Matejko, autor między innymi „Bitwy pod Grunwaldem” i „Konstytucji 3 Maja”.":
    "Jan Matejko, auteur entre autres de « La bataille de Grunwald » et de « La Constitution du 3 mai ».",
  "Jak nazywają się piesze wędrówki na Jasną Górę odbywające się latem?":
    "Comment appelle-t-on les marches à pied vers Jasna Góra qui ont lieu l'été ?",
  "Pielgrzymki": "Des pèlerinages",
  "Procesje": "Des processions",
  "Odpusty": "Des fêtes patronales",
  "Rekolekcje": "Des retraites spirituelles",
  "Sierpniowe pielgrzymki idą tam z całego kraju, niektóre po kilkanaście dni.":
    "Les pèlerinages d'août y montent de tout le pays, certains durant plus de dix jours.",
  "Co jest alternatywą dla lekcji religii w szkole publicznej?":
    "Que peut-on suivre à la place du cours de religion dans l'école publique ?",
  "Etyka": "L'éthique",
  "Filozofia": "La philosophie",
  "Historia Kościoła": "L'histoire de l'Église",
  "Nic — udział jest obowiązkowy": "Rien — la participation est obligatoire",
  "Etyka albo rezygnacja z obu zajęć. Wybór należy do rodziców lub pełnoletniego ucznia.":
    "L'éthique, ou le renoncement aux deux. Le choix revient aux parents ou à l'élève majeur.",
  "Który trybunał czuwa nad stosowaniem prawa Unii Europejskiej?":
    "Quelle juridiction veille sur l'application du droit de l'Union européenne ?",
  "Trybunał Sprawiedliwości UE w Luksemburgu":
    "La Cour de justice de l'Union européenne, à Luxembourg",
  "Międzynarodowy Trybunał Karny": "La Cour pénale internationale",
  "Luksemburg zajmuje się prawem unijnym, Strasburg skargami na naruszenie praw człowieka.":
    "Luxembourg s'occupe du droit de l'Union, Strasbourg des requêtes pour atteinte aux droits de l'homme.",
  "Czy Polska zobowiązała się kiedyś do przyjęcia euro?":
    "La Pologne s'est-elle jamais engagée à adopter l'euro ?",
  "Tak, w traktacie akcesyjnym, bez wyznaczonej daty":
    "Oui, dans le traité d'adhésion, sans date fixée",
  "Nie, uzyskała trwałe wyłączenie": "Non, elle a obtenu une dérogation permanente",
  "Tak, z terminem na rok 2010": "Oui, avec une échéance en 2010",
  "Nie, kwestii tej nigdy nie poruszano": "Non, la question n'a jamais été soulevée",
  "Zobowiązanie istnieje, ale bez terminu; waluta pozostaje złotym.":
    "L'engagement existe, mais sans échéance ; la monnaie reste le złoty.",
  "Ile tygodni trwają zwykle ferie zimowe?":
    "Combien de semaines durent d'ordinaire les vacances d'hiver ?",
  "Jeden tydzień": "Une semaine",
  "Dwa tygodnie": "Deux semaines",
  "Trzy tygodnie": "Trois semaines",
  "Miesiąc": "Un mois",
  "Dwa tygodnie, w różnych terminach zależnie od województwa.":
    "Deux semaines, à des dates différentes selon la voïvodie.",
  "Które święto kościelne jest w Polsce dniem wolnym i wypada w czwartek?":
    "Quelle fête religieuse est chômée en Pologne et tombe un jeudi ?",
  "Boże Ciało": "La Fête-Dieu",
  "Wniebowzięcie": "L'Assomption",
  "Trzech Króli": "L'Épiphanie",
  "Boże Ciało zawsze wypada w czwartek; pozostałe mają stałe daty.":
    "La Fête-Dieu tombe toujours un jeudi ; les autres ont des dates fixes.",
  "Ile lat trwa technikum?": "Combien d'années dure le lycée technique ?",
  "Pięć lat. Liceum trwa cztery, szkoła branżowa krócej.":
    "Cinq ans. Le lycée général en dure quatre, l'école de métier moins encore.",
  "Co oznacza, że lek jest refundowany?": "Que veut dire qu'un médicament est remboursé ?",
  "Że NFZ dopłaca do jego ceny": "Que le NFZ participe à son prix",
  "Że jest wydawany bez recepty": "Qu'il se délivre sans ordonnance",
  "Że można go zwrócić do apteki": "Qu'on peut le rapporter à la pharmacie",
  "Że produkuje go państwo": "Que l'État le fabrique",
  "Dopłata NFZ obniża cenę dla pacjenta.":
    "La participation du NFZ abaisse le prix pour le patient.",
  "Kiedy wywiesza się flagę państwową?": "Quand arbore-t-on le drapeau national ?",
  "W dni świąt państwowych i podczas uroczystości":
    "Les jours de fête nationale et lors des cérémonies",
  "Codziennie na każdym domu": "Chaque jour, sur chaque maison",
  "Wyłącznie w Warszawie": "À Varsovie seulement",
  "Tylko podczas meczów reprezentacji": "Seulement pendant les matchs de l'équipe nationale",
  "Na budynkach urzędów i podczas uroczystości; mieszkańcy wywieszają ją zwyczajowo w święta.":
    "Sur les bâtiments publics et lors des cérémonies ; les habitants l'accrochent par usage les jours de fête.",
  "Czym różni się pozycja obywatela od pozycji urzędu wobec prawa?":
    "En quoi la position du citoyen diffère-t-elle de celle de l'administration devant le droit ?",
  "Obywatelowi wolno wszystko, czego prawo nie zabrania; urzędowi tylko to, na co prawo zezwala":
    "Au citoyen tout est permis que la loi n'interdit pas ; à l'administration seulement ce que la loi autorise",
  "Obie są identyczne": "Les deux sont identiques",
  "Urzędowi wolno więcej niż obywatelowi": "L'administration a plus de latitude que le citoyen",
  "Obywatel podlega tylko Konstytucji": "Le citoyen n'est soumis qu'à la Constitution",
  "Ta różnica jest istotą państwa prawa.": "Cette différence est le cœur même de l'État de droit.",
  "Kto poza posłami i rządem ma inicjatywę ustawodawczą?":
    "Qui, hors les députés et le gouvernement, a l'initiative des lois ?",
  "Senat, Prezydent i grupa 100 tysięcy obywateli":
    "Le Senat, le président et un groupe de 100 000 citoyens",
  "Wyłącznie Prezydent": "Le président seul",
  "Wojewodowie": "Les wojewodowie",
  "Sądy powszechne": "Les juridictions ordinaires",
  "Projekt może złożyć także Senat, Prezydent albo grupa stu tysięcy obywateli.":
    "Un projet peut aussi venir du Senat, du président ou d'un groupe de cent mille citoyens.",
  "Która kraina historyczna leży wokół Poznania?": "Quelle région historique entoure Poznań ?",
  "Wielkopolska": "La Grande-Pologne",
  "Małopolska": "La Petite-Pologne",
  "Mazowsze": "La Mazovie",
  "Wielkopolska. Mazowsze leży wokół Warszawy, Małopolska wokół Krakowa.":
    "La Grande-Pologne. La Mazovie entoure Varsovie, la Petite-Pologne Cracovie.",
  "Ile mniej więcej osób mieszka w Warszawie?":
    "Combien de personnes vivent à peu près à Varsovie ?",
  "Około 800 tysięcy": "Environ 800 000",
  "Około 1,2 miliona": "Environ 1,2 million",
  "Około 1,8 miliona": "Environ 1,8 million",
  "Około 3 milionów": "Environ 3 millions",
  "Około 1,8 miliona — największe miasto kraju.":
    "Environ 1,8 million — la plus grande ville du pays.",
  "Kto ustala wysokość płacy minimalnej?": "Qui fixe le montant du salaire minimum ?",
  "Rada Ministrów w rozporządzeniu, co roku": "Le Conseil des ministres, par arrêté, chaque année",
  "Każdy pracodawca osobno": "Chaque employeur pour son compte",
  "Sejm raz na kadencję": "Le Sejm, une fois par législature",
  "Wojewoda dla swojego regionu": "Le wojewoda, pour sa région",
  "Ustalana corocznie i obowiązuje wszystkich pracowników w kraju.":
    "Il est fixé chaque année et s'impose à tous les salariés du pays.",
  "Czym jest budżet obywatelski?": "Qu'est-ce que le budget participatif ?",
  "Częścią budżetu gminy, o której przeznaczeniu decydują mieszkańcy":
    "Une part du budget de la gmina dont les habitants décident l'emploi",
  "Budżetem państwa na cele socjalne": "Le budget de l'État consacré au social",
  "Funduszem unijnym": "Un fonds de l'Union européenne",
  "Podatkiem lokalnym": "Un impôt local",
  "Mieszkańcy zgłaszają projekty i głosują, na co pójdzie wydzielona kwota.":
    "Les habitants proposent des projets et votent sur l'emploi de la somme mise à part.",
  "Przed kim Prezydent składa przysięgę?": "Devant qui le président prête-t-il serment ?",
  "Przed Zgromadzeniem Narodowym": "Devant Zgromadzenie Narodowe",
  "Przed Sejmem": "Devant le Sejm",
  "Przed Sądem Najwyższym": "Devant la Cour suprême",
  "Przed Radą Ministrów": "Devant le Conseil des ministres",
  "Przed Zgromadzeniem Narodowym, czyli połączonymi izbami parlamentu.":
    "Devant Zgromadzenie Narodowe, c'est-à-dire les deux chambres réunies.",
  "Kto nadzoruje w Polsce ochronę danych osobowych?":
    "Qui veille en Pologne sur la protection des données personnelles ?",
  "Prezes Urzędu Ochrony Danych Osobowych":
    "Le président de l'Office de protection des données personnelles",
  "Minister Cyfryzacji": "Le ministre du Numérique",
  "Prezes UODO, na podstawie przepisów RODO obowiązujących od 2018 roku.":
    "Le président de l'UODO, sur le fondement du RODO en vigueur depuis 2018.",
  "Jak nazywała się dynastia rządząca po Piastach?":
    "Comment s'appelait la dynastie qui a régné après les Piast ?",
  "Wettynowie": "Les Wettin",
  "Andegawenowie": "Les Anjou",
  "Jagiellonowie, od unii z Litwą w 1385 roku.":
    "Les Jagellon, depuis l'union avec la Lituanie en 1385.",
  "Dokąd przeniósł się polski rząd po klęsce we wrześniu 1939 roku?":
    "Où le gouvernement polonais s'est-il replié après la défaite de septembre 1939 ?",
  "Do Londynu": "À Londres",
  "Do Paryża na stałe": "À Paris, pour de bon",
  "Do Moskwy": "À Moscou",
  "Do Sztokholmu": "À Stockholm",
  "Najpierw do Francji, a po jej upadku do Londynu.":
    "D'abord en France, puis à Londres après la chute de celle-ci.",
  "Kto prowadzi w Polsce koleje dalekobieżne?":
    "Qui exploite les trains grandes lignes en Pologne ?",
  "PKP": "Les PKP",
  "PKS": "Le PKS",
  "LOT": "LOT",
  "ZTM": "Le ZTM",
  "Polskie Koleje Państwowe i spółki z nimi związane. PKS to autobusy, LOT to linie lotnicze.":
    "Les Chemins de fer polonais et les sociétés qui s'y rattachent. Le PKS, ce sont les autocars, LOT la compagnie aérienne.",
  "Co grozi za publiczne znieważenie symboli państwowych?":
    "Qu'encourt-on à outrager publiquement les symboles de l'État ?",
  "Odpowiedzialność karna — symbole są chronione prawem":
    "Une responsabilité pénale — la loi protège ces symboles",
  "Nic, to kwestia obyczaju": "Rien, c'est affaire d'usage",
  "Grzywna nakładana przez wojewodę": "Une amende infligée par le wojewoda",
  "Godło, barwy i hymn są objęte ochroną prawną; znieważenie ich jest przestępstwem.":
    "L'emblème, les couleurs et l'hymne sont protégés par la loi ; les outrager est un délit.",
  "Ile rozdziałów Konstytucji podlega zatwierdzeniu w referendum przy zmianie?":
    "Combien de chapitres de la Constitution doivent être confirmés par référendum en cas de révision ?",
  "Wszystkie": "Tous",
  "Rozdziały o ustroju, o wolnościach i o trybie zmiany Konstytucji.":
    "Les chapitres sur le régime, sur les libertés et sur la procédure de révision.",
  "Czy państwo zapewnia prawo do nauki?": "L'État garantit-il le droit à l'instruction ?",
  "Tak, nauka jest bezpłatna w szkołach publicznych":
    "Oui, l'instruction est gratuite dans les écoles publiques",
  "Nie, edukacja jest w pełni prywatna": "Non, l'enseignement est entièrement privé",
  "Tylko dla obywateli polskich": "Seulement pour les citoyens polonais",
  "Tylko do 12. roku życia": "Seulement jusqu'à 12 ans",
  "Konstytucja gwarantuje prawo do nauki, bezpłatnej w szkołach publicznych.":
    "La Constitution garantit le droit à l'instruction, gratuite dans les écoles publiques.",
  "Ile czasu ma sąd na decyzję o tymczasowym aresztowaniu po przekazaniu zatrzymanego?":
    "De combien de temps le tribunal dispose-t-il pour décider d'une détention provisoire après qu'on lui a remis la personne arrêtée ?",
  "24 godziny": "24 heures",
  "72 godziny": "72 heures",
  "Do 48 godzin na przekazanie sądowi i kolejne 24 na decyzję — razem najwyżej 72 godziny.":
    "Jusqu'à 48 heures pour la remise au tribunal et 24 de plus pour la décision — 72 heures au plus en tout.",
  "Co Konstytucja wymienia jako pierwszy obowiązek obywatela?":
    "Quel devoir la Constitution nomme-t-elle en premier pour le citoyen ?",
  "Wierność Rzeczypospolitej i troskę o dobro wspólne":
    "La fidélité à la République et le souci du bien commun",
  "Płacenie podatków": "Le paiement des impôts",
  "Służbę wojskową": "Le service militaire",
  "Z tego ogólnego sformułowania wynikają pozostałe obowiązki.":
    "De cette formule générale découlent les autres devoirs.",
  "Które ugrupowania są zwolnione z progu wyborczego do Sejmu?":
    "Quelles formations sont dispensées du seuil électoral au Sejm ?",
  "Komitety mniejszości narodowych": "Les comités des minorités nationales",
  "Partie rządzące": "Les partis au pouvoir",
  "Komitety obywatelskie": "Les comités de citoyens",
  "Nikt nie jest zwolniony": "Personne n'en est dispensé",
  "Zwolnienie dotyczy komitetów mniejszości narodowych.":
    "La dispense vaut pour les comités des minorités nationales.",
  "Co się stanie, jeśli Prezydent skieruje ustawę do Trybunału Konstytucyjnego?":
    "Que se passe-t-il si le président porte une loi devant le Trybunał Konstytucyjny ?",
  "Nie może już jej zawetować": "Il ne peut plus y opposer son veto",
  "Może ją potem jeszcze zawetować": "Il peut encore y opposer son veto ensuite",
  "Ustawa wchodzi w życie natychmiast": "La loi entre aussitôt en vigueur",
  "Sejm musi ją uchwalić ponownie": "Le Sejm doit la voter de nouveau",
  "Wybór jest rozłączny: albo weto, albo droga do Trybunału.":
    "Le choix est exclusif : ou bien le veto, ou bien le chemin du Trybunał.",
  "Kto wchodzi w skład Rady Ministrów?": "Qui compose le Conseil des ministres ?",
  "Premier i ministrowie": "Le premier ministre et les ministres",
  "Premier i Prezydent": "Le premier ministre et le président",
  "Posłowie i senatorowie": "Les députés et les sénateurs",
  "Prezes Rady Ministrów i ministrowie kierujący działami administracji.":
    "Le président du Conseil des ministres et les ministres à la tête des domaines de l'administration.",
  "Czy rozprawy sądowe są w Polsce jawne?": "Les audiences sont-elles publiques en Pologne ?",
  "Tak, co do zasady, a wyrok ogłasza się publicznie":
    "Oui, en principe, et le jugement se prononce publiquement",
  "Nie, wszystkie są tajne": "Non, elles sont toutes secrètes",
  "Tylko w sprawach cywilnych": "Seulement en matière civile",
  "Tylko za zgodą stron": "Seulement avec l'accord des parties",
  "Jawność jest zasadą; wyjątki wymagają podstawy w ustawie.":
    "La publicité est la règle ; les exceptions demandent un fondement dans la loi.",
  "Ile szczebli ma polski samorząd terytorialny?":
    "Combien d'échelons comptent les collectivités territoriales polonaises ?",
  "Gmina, powiat i województwo.": "La gmina, le powiat et la voïvodie.",
  "Co oznaczała wolna elekcja?": "Que signifiait l'élection libre du roi ?",
  "Że króla wybierała szlachta": "Que la noblesse élisait le roi",
  "Że tron dziedziczył najstarszy syn": "Que le fils aîné héritait du trône",
  "Że króla wskazywał papież": "Que le pape désignait le roi",
  "Że królem zostawał zwycięzca turnieju": "Que le vainqueur d'un tournoi devenait roi",
  "Króla wybierała szlachta; zniosła to dopiero Konstytucja 3 maja.":
    "La noblesse élisait le roi ; seule la Constitution du 3 mai y a mis fin.",
  "W którym roku doszło do pierwszego rozbioru Polski?":
    "En quelle année eut lieu le premier partage de la Pologne ?",
  "1764": "1764",
  "1772. Drugi nastąpił w 1793, trzeci w 1795 roku.":
    "En 1772. Le deuxième vint en 1793, le troisième en 1795.",
  "Jak nazywano powstania, które zdecydowały o przynależności Górnego Śląska?":
    "Comment appelait-on les insurrections qui décidèrent du sort de la Haute-Silésie ?",
  "Powstania śląskie": "Les insurrections de Silésie",
  "Powstanie warszawskie": "L'insurrection de Varsovie",
  "Powstanie krakowskie": "L'insurrection de Cracovie",
  "Trzy powstania śląskie w latach 1919–1921, obok plebiscytu.":
    "Trois insurrections de Silésie entre 1919 et 1921, à côté d'un plébiscite.",
  "Jak nazywał się największy niemiecki obóz koncentracyjny i zagłady na ziemiach polskich?":
    "Comment s'appelait le plus grand camp de concentration et d'extermination allemand en terre polonaise ?",
  "Mauthausen": "Mauthausen",
  "Auschwitz-Birkenau, dziś miejsce pamięci wpisane na listę UNESCO.":
    "Auschwitz-Birkenau, aujourd'hui lieu de mémoire inscrit au patrimoine de l'UNESCO.",
  "Jak nazywały się porozumienia kończące strajk w Stoczni Gdańskiej?":
    "Comment s'appelaient les accords qui mirent fin à la grève du chantier naval de Gdańsk ?",
  "Umowa gdańska": "L'accord de Gdańsk",
  "Pakt o stabilizacji": "Le pacte de stabilisation",
  "Porozumienia sierpniowe z 1980 roku; na ich podstawie powstała Solidarność.":
    "Les accords d'août 1980 ; c'est sur eux que Solidarność est née.",
  "Jaką część miejsc w Sejmie w 1989 roku obsadzono w wolnych wyborach?":
    "Quelle part des sièges du Sejm fut pourvue au suffrage libre en 1989 ?",
  "35 procent": "35 pour cent",
  "50 procent": "50 pour cent",
  "65 procent": "65 pour cent",
  "100 procent": "100 pour cent",
  "35 procent w Sejmie; Senat był wolny w całości.":
    "35 pour cent au Sejm ; le Senat, lui, était entièrement libre.",
  "Jak nazywa się największe jezioro w Polsce?":
    "Comment s'appelle le plus grand lac de Pologne ?",
  "Śniardwy": "Le Śniardwy",
  "Mamry": "Le Mamry",
  "Hańcza": "Le Hańcza",
  "Gopło": "Le Gopło",
  "Śniardwy na Mazurach. Hańcza jest najgłębsza, ale nie największa.":
    "Le Śniardwy, en Mazurie. Le Hańcza est le plus profond, mais non le plus grand.",
  "Ile jest w Polsce uznanych mniejszości narodowych?":
    "Combien de minorités nationales sont reconnues en Pologne ?",
  "Dziewięć mniejszości narodowych i cztery etniczne; językiem regionalnym jest kaszubski.":
    "Neuf minorités nationales et quatre minorités ethniques ; la langue régionale est le cachoube.",
  "Czym różni się umowa o pracę od umowy zlecenia?":
    "En quoi le contrat de travail diffère-t-il du contrat de mission ?",
  "Umowa o pracę daje urlop i ochronę przed zwolnieniem":
    "Le contrat de travail donne des congés et une protection contre le licenciement",
  "Umowa zlecenia jest zawsze korzystniejsza":
    "Le contrat de mission est toujours plus avantageux",
  "Nie różnią się niczym": "Ils ne diffèrent en rien",
  "Umowa o pracę nie wymaga składek": "Le contrat de travail n'exige pas de cotisations",
  "Z umowy o pracę wynikają urlop, ochrona stosunku pracy i pełne składki.":
    "Du contrat de travail découlent les congés, la protection de la relation de travail et des cotisations entières.",
  "Do której organizacji obronnej należy Polska od 1999 roku?":
    "À quelle organisation de défense la Pologne appartient-elle depuis 1999 ?",
  "Do NATO": "À l'OTAN",
  "Do Układu Warszawskiego": "Au pacte de Varsovie",
  "Do ONZ": "À l'ONU",
  "Do OBWE": "À l'OSCE",
  "Do NATO, razem z Czechami i Węgrami. Układ Warszawski rozwiązano w 1991 roku.":
    "À l'OTAN, en même temps que la Tchéquie et la Hongrie. Le pacte de Varsovie fut dissous en 1991.",
  "Który obraz znajduje się na Jasnej Górze?": "Quel tableau se trouve à Jasna Góra ?",
  "Matki Boskiej Częstochowskiej": "La Vierge noire de Częstochowa",
  "Matki Boskiej Ostrobramskiej": "La Vierge de la Porte de l'Aurore",
  "Świętego Stanisława": "Saint Stanislas",
  "Świętej Jadwigi": "Sainte Hedwige",
  "Obraz Matki Boskiej Częstochowskiej, cel największych pielgrzymek w kraju.":
    "Le tableau de la Vierge noire de Częstochowa, but des plus grands pèlerinages du pays.",
  "Kiedy w Polsce jada się kolację wigilijną?":
    "Quand prend-on en Pologne le repas de la veille de Noël ?",
  "24 grudnia, po pierwszej gwiazdce": "Le 24 décembre, après la première étoile",
  "25 grudnia w południe": "Le 25 décembre à midi",
  "31 grudnia wieczorem": "Le 31 décembre au soir",
  "6 stycznia": "Le 6 janvier",
  "Wieczorem 24 grudnia, tradycyjnie po pojawieniu się pierwszej gwiazdy.":
    "Le soir du 24 décembre, traditionnellement après l'apparition de la première étoile.",
  "Jaki egzamin otwiera drogę na studia?": "Quel examen ouvre la voie des études supérieures ?",
  "Matura": "La matura",
  "Egzamin ósmoklasisty": "L'examen de huitième année",
  "Egzamin zawodowy": "L'examen professionnel",
  "Test kompetencji": "Le test de compétences",
  "Matura; jej wyniki decydują o przyjęciu na uczelnię.":
    "La matura ; ses résultats décident de l'admission à l'université.",
  "Skąd biorą się opłaty za wodę i ogrzewanie w bloku?":
    "D'où viennent les charges d'eau et de chauffage dans un immeuble ?",
  "Zwykle rozlicza je wspólnota albo spółdzielnia, osobno od czynszu najmu":
    "La copropriété ou la coopérative les décompte d'ordinaire, à part du loyer",
  "Zawsze są wliczone w czynsz najmu": "Elles sont toujours comprises dans le loyer",
  "Pobiera je gmina": "C'est la gmina qui les perçoit",
  "Płaci je wyłącznie właściciel mieszkania": "Seul le propriétaire du logement les paie",
  "Przy najmie opłaty eksploatacyjne często idą osobno, do wspólnoty albo spółdzielni.":
    "En location, les charges d'exploitation vont souvent à part, à la copropriété ou à la coopérative.",
};
