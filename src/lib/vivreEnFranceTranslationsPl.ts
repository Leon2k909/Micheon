/**
 * Polish for the Vivre en France course cards and headings.
 *
 * Keyed on the FRENCH source text exactly as it appears in
 * vivreEnFranceCourse.ts. A missing key is not an error — the card simply
 * shows no translation and says so — but a key that matches nothing is,
 * because a stray character fails silently: the card renders, the tap works,
 * and the learner is told a translated card has no translation.
 * check-fr-translations catches that.
 *
 * Names of laws and institutions stay French — la laïcité, le Sénat, le SMIC,
 * la Marseillaise — because those are the words the exam asks for. What gets
 * translated is the explanation around them. Where a French term carries no
 * meaning at all in Polish, it leads and a Polish gloss follows it once.
 */
export const VIVRE_EN_FRANCE_PL: Record<string, string> = {
  "France – Land and Culture": "Francja – kraj i kultura",
  "Valeurs, institutions et vie quotidienne — comment le pays fonctionne.":
    "Wartości, instytucje i życie codzienne — jak funkcjonuje ten kraj.",

  // ── The symbols of the Republic ─────────────────────────────────────────
  "Les symboles de la République": "Symbole Republiki",
  "Principes et valeurs de la République": "Zasady i wartości Republiki",
  "Pourquoi commencer par là : les symboles reviennent dans presque chaque série de questions, et ils sont faciles à retenir parce qu'on les voit tous les jours — sur une mairie, sur un timbre, sur un maillot de football.":
    "Dlaczego zaczynamy od tego: symbole wracają w niemal każdej serii pytań, a łatwo je zapamiętać, bo widuje się je codziennie — na merostwie, na znaczku pocztowym, na koszulce piłkarskiej.",
  "Le drapeau tricolore": "Flaga trójkolorowa",
  "Le drapeau français est **bleu, blanc, rouge**, en trois bandes verticales. Le bleu et le rouge sont les couleurs de Paris, le blanc celle de la royauté : la Révolution a mis les trois ensemble. Il est décrit à l'**article 2 de la Constitution**.":
    "Flaga francuska jest **niebiesko-biało-czerwona**, w trzech pionowych pasach. Niebieski i czerwony to barwy Paryża, biały — barwa królewska: rewolucja połączyła wszystkie trzy. Opisuje ją **artykuł 2 Konstytucji**.",
  "Brûler publiquement un drapeau français est **interdit** et constitue une infraction. Le drapeau est un symbole de l'État, pas un objet ordinaire.":
    "Publiczne spalenie francuskiej flagi jest **zabronione** i stanowi wykroczenie. Flaga jest symbolem państwa, a nie zwykłym przedmiotem.",
  "La devise": "Dewiza",
  "**Liberté, Égalité, Fraternité.** On la lit au fronton des mairies, des écoles et des tribunaux, et elle figure sur les pièces de monnaie et les documents officiels. Elle aussi est inscrite à l'article 2 de la Constitution.":
    "**Liberté, Égalité, Fraternité** — wolność, równość, braterstwo. Widnieje na frontonach merostw, szkół i sądów, a także na monetach i dokumentach urzędowych. Ona również jest zapisana w artykule 2 Konstytucji.",
  "Marianne": "Marianne",
  "**Marianne** est le visage de la République. Elle porte le **bonnet phrygien**, le couvre-chef des esclaves affranchis dans la Rome antique : le symbole de la liberté conquise. On la voit sur les **timbres**, sur les pièces d'euro françaises, sur les documents officiels et dans les mairies, sous forme de buste.":
    "**Marianne** jest twarzą Republiki. Nosi **czapkę frygijską**, nakrycie głowy wyzwoleńców w starożytnym Rzymie: symbol wywalczonej wolności. Widuje się ją na **znaczkach pocztowych**, na francuskich monetach euro, na dokumentach urzędowych i w merostwach, w postaci popiersia.",
  "Le coq et l'hymne": "Kogut i hymn",
  "Le coq gaulois": "Kogut galijski",
  "Symbole populaire plutôt qu'officiel. C'est lui qui figure sur les maillots des équipes de France.":
    "Symbol raczej ludowy niż oficjalny. To on widnieje na koszulkach reprezentacji Francji.",
  "La Marseillaise": "La Marseillaise (Marsylianka)",
  "L'hymne national, écrit et composé en 1792 par Rouget de Lisle. Il commence par « Allons enfants de la Patrie, le jour de gloire est arrivé ! »":
    "Hymn narodowy, napisany i skomponowany w 1792 roku przez Rougeta de Lisle'a. Zaczyna się słowami „Allons enfants de la Patrie, le jour de gloire est arrivé !”",
  "Le 14 juillet": "14 lipca",
  "La fête nationale. Elle commémore la prise de la Bastille de 1789 et la Fête de la Fédération de 1790.":
    "Święto narodowe. Upamiętnia zdobycie Bastylii w 1789 roku i Święto Federacji z 1790 roku.",
  "Le faisceau de licteur": "Fasces liktorskie",
  "L'emblème de la République française, présent sur le passeport et les documents diplomatiques.":
    "Godło Republiki Francuskiej, obecne w paszporcie i na dokumentach dyplomatycznych.",
  "À retenir": "Do zapamiętania",
  "Noms importants": "Ważne nazwiska",
  "Marianne · Rouget de Lisle · le coq gaulois.": "Marianne · Rouget de Lisle · kogut galijski.",
  "Chiffres importants": "Ważne liczby",
  "40 questions · 45 minutes · 32 bonnes réponses pour réussir. Drapeau et devise : article 2 de la Constitution. Marseillaise : 1792. Fête nationale : 14 juillet.":
    "40 pytań · 45 minut · 32 poprawne odpowiedzi, by zdać. Flaga i dewiza: artykuł 2 Konstytucji. Marsylianka: 1792. Święto narodowe: 14 lipca.",
  "Mots importants": "Ważne słowa",
  "Tricolore · devise · bonnet phrygien · hymne national · fête nationale.":
    "Trójkolorowa · dewiza · czapka frygijska · hymn narodowy · święto narodowe.",
  "En une phrase : les symboles disent en images ce que la devise dit en mots — une République née d'une révolution et qui s'en souvient.":
    "W jednym zdaniu: symbole mówią obrazem to, co dewiza mówi słowami — Republika zrodzona z rewolucji i pamiętająca o tym.",
  "Répondez à ces questions": "Odpowiedz na te pytania",

  // ── Liberty, equality, fraternity ───────────────────────────────────────
  "Liberté, Égalité, Fraternité": "Wolność, równość, braterstwo",
  "Pourquoi cette leçon : la devise n'est pas une décoration. Chacun de ses trois mots correspond à des droits précis, et les questions portent sur ce qu'ils veulent dire concrètement, pas sur leur ordre.":
    "Po co ta lekcja: dewiza nie jest ozdobą. Każde z jej trzech słów odpowiada konkretnym prawom, a pytania dotyczą tego, co one oznaczają w praktyce, nie ich kolejności.",
  "La liberté": "Wolność",
  "Une **liberté**, c'est le droit de faire ce que l'on veut sans nuire à autrui. L'article 4 de la Déclaration des droits de l'homme et du citoyen de 1789 le dit ainsi : « La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. » Ma liberté s'arrête donc là où commence celle des autres — et nulle part avant.":
    "**Wolność** to prawo do robienia tego, co się chce, bez szkody dla innych. Artykuł 4 Deklaracji praw człowieka i obywatela z 1789 roku ujmuje to tak: „Wolność polega na możności czynienia wszystkiego, co nie szkodzi drugiemu”. Moja wolność kończy się więc tam, gdzie zaczyna się wolność innych — i ani o krok wcześniej.",
  "Liberté d'expression": "Wolność wypowiedzi",
  "Dire, écrire et publier ce que l'on pense. Elle vaut aussi sur les réseaux sociaux, où la loi s'applique exactement comme ailleurs.":
    "Mówić, pisać i publikować to, co się myśli. Obowiązuje także w mediach społecznościowych, gdzie prawo stosuje się dokładnie tak samo jak gdzie indziej.",
  "Liberté d'association": "Wolność zrzeszania się",
  "Créer une association ou y adhérer librement, sans autorisation préalable. Elle date de la loi de 1901.":
    "Zakładać stowarzyszenie lub swobodnie do niego przystępować, bez uprzedniego zezwolenia. Pochodzi z ustawy z 1901 roku.",
  "Liberté de conscience": "Wolność sumienia",
  "Croire, ne pas croire, changer de religion ou n'en avoir aucune. Personne n'a à s'en justifier.":
    "Wierzyć, nie wierzyć, zmienić religię albo nie mieć żadnej. Nikt nie musi się z tego tłumaczyć.",
  "Liberté de circulation": "Wolność przemieszczania się",
  "Aller et venir librement sur le territoire, s'installer où l'on veut, quitter le pays et y revenir.":
    "Swobodnie poruszać się po terytorium kraju, osiedlać się, gdzie się chce, wyjeżdżać i wracać.",
  "La liberté d'expression a des limites, et elles sont dans la loi : l'injure, la diffamation, l'incitation à la haine, l'apologie du terrorisme et la négation des crimes contre l'humanité sont des délits. « C'était sur internet » n'est pas une excuse.":
    "Wolność wypowiedzi ma granice, a wyznacza je prawo: zniewaga, zniesławienie, nawoływanie do nienawiści, pochwała terroryzmu i negowanie zbrodni przeciwko ludzkości są przestępstwami. „To było w internecie” nie jest usprawiedliwieniem.",
  "L'égalité": "Równość",
  "L'**égalité** signifie que la loi est la même pour tous et que tous ont les mêmes droits, quels que soient leur origine, leur sexe, leur religion, leur handicap ou leur fortune. Ce n'est pas l'égalité des situations : c'est l'égalité **devant la loi** et l'égalité **des droits**.":
    "**Równość** oznacza, że prawo jest takie samo dla wszystkich i że wszyscy mają te same prawa, bez względu na pochodzenie, płeć, religię, niepełnosprawność czy majątek. Nie jest to równość sytuacji: to równość **wobec prawa** i równość **praw**.",
  "La fraternité": "Braterstwo",
  "La **fraternité** est le devoir de solidarité envers les autres. Elle prend une forme légale : l'obligation de **porter secours** à une personne en danger, l'impôt qui finance les services publics, la Sécurité sociale qui répartit les risques entre tous.":
    "**Braterstwo** to obowiązek solidarności wobec innych. Przybiera formę prawną: obowiązek **udzielenia pomocy** osobie w niebezpieczeństwie, podatek finansujący usługi publiczne, Sécurité sociale rozkładająca ryzyko na wszystkich.",
  "Déclaration des droits de l'homme et du citoyen (1789) · loi de 1901 sur les associations.":
    "Deklaracja praw człowieka i obywatela (1789) · ustawa o stowarzyszeniach z 1901 roku.",
  "1789 : la Déclaration. Article 4 : la liberté ne nuit pas à autrui. 1901 : liberté d'association.":
    "1789: Deklaracja. Artykuł 4: wolność nie szkodzi drugiemu. 1901: wolność zrzeszania się.",
  "Liberté · égalité · fraternité · solidarité · discrimination · devoir de secours.":
    "Wolność · równość · braterstwo · solidarność · dyskryminacja · obowiązek udzielenia pomocy.",
  "En une phrase : liberté pour chacun, égalité entre tous, fraternité de tous envers chacun — et les trois sont des règles de droit, pas des vœux.":
    "W jednym zdaniu: wolność dla każdego, równość między wszystkimi, braterstwo wszystkich wobec każdego — i wszystkie trzy są normami prawa, nie życzeniami.",

  // ── Laïcité and the 1905 law ────────────────────────────────────────────
  "La laïcité et la loi de 1905": "Laïcité i ustawa z 1905 roku",
  "Pourquoi cette leçon : la laïcité est le sujet le plus souvent mal compris de l'examen. Elle n'interdit pas la religion — elle organise la neutralité de l'État. La différence est exactement ce qui est demandé.":
    "Po co ta lekcja: laïcité to temat najczęściej źle rozumiany na egzaminie. Nie zakazuje religii — porządkuje neutralność państwa. Właśnie o tę różnicę się pyta.",
  "Ce qu'est la laïcité": "Czym jest laïcité",
  "La **laïcité** repose sur trois idées : la **liberté de conscience**, la **séparation des institutions publiques et des religions**, et l'**égalité de tous devant la loi** quelles que soient leurs croyances. L'État ne reconnaît, ne salarie et ne subventionne aucun culte.":
    "**Laïcité** — świeckość państwa — opiera się na trzech ideach: **wolności sumienia**, **rozdziale instytucji publicznych i religii** oraz **równości wszystkich wobec prawa** niezależnie od wyznania. Państwo nie uznaje, nie opłaca i nie dotuje żadnego kultu.",
  "La loi du 9 décembre 1905": "Ustawa z 9 grudnia 1905 roku",
  "La **loi de séparation des Églises et de l'État** a été votée le **9 décembre 1905**. C'est le texte fondateur de la laïcité française. Son article 1er garantit la liberté de conscience et le libre exercice des cultes ; son article 2 dispose que la République ne reconnaît ni ne salarie aucun culte.":
    "**Ustawa o rozdziale Kościołów i państwa** została uchwalona **9 grudnia 1905 roku**. To akt założycielski francuskiej laïcité. Jej artykuł 1 gwarantuje wolność sumienia i swobodne sprawowanie kultów; artykuł 2 stanowi, że Republika nie uznaje ani nie opłaca żadnego kultu.",
  "La **journée de la laïcité** est fixée au **9 décembre**, date anniversaire de la loi. C'est une question qui revient.":
    "**Dzień laïcité** przypada **9 grudnia**, w rocznicę ustawy. To pytanie, które się powtarza.",
  "Qui doit être neutre": "Kto musi być neutralny",
  "La neutralité s'impose à l'**État et à ses agents**, pas aux usagers. Un fonctionnaire, un enseignant, un agent de mairie ne peuvent pas manifester leurs convictions religieuses dans l'exercice de leurs fonctions. Une personne qui vient à la mairie, elle, reste libre.":
    "Neutralność obowiązuje **państwo i jego funkcjonariuszy**, nie interesantów. Urzędnik, nauczyciel, pracownik merostwa nie mogą manifestować swoich przekonań religijnych podczas pełnienia obowiązków. Osoba, która przychodzi do merostwa, pozostaje wolna.",
  "À l'école publique": "W szkole publicznej",
  "Les élèves ne peuvent pas porter de signes religieux ostensibles (loi de 2004). Un bijou discret reste possible ; c'est l'ostentation qui est visée.":
    "Uczniowie nie mogą nosić ostentacyjnych symboli religijnych (ustawa z 2004 roku). Dyskretna biżuteria pozostaje dopuszczalna; chodzi o ostentację.",
  "La charte de la laïcité": "Karta laïcité",
  "Affichée dans les écoles depuis 2013, elle explique aux élèves et aux familles ce que la laïcité permet et ce qu'elle interdit.":
    "Wywieszana w szkołach od 2013 roku, wyjaśnia uczniom i rodzinom, na co laïcité pozwala, a czego zakazuje.",
  "Dans la rue": "Na ulicy",
  "L'espace public n'est pas soumis à la neutralité. Chacun peut y porter ce qu'il veut, à l'exception de la dissimulation intégrale du visage, interdite depuis 2010.":
    "Przestrzeń publiczna nie podlega obowiązkowi neutralności. Każdy może nosić w niej, co chce, z wyjątkiem całkowitego zasłaniania twarzy, zakazanego od 2010 roku.",
  "Le financement": "Finansowanie",
  "L'État ne finance pas les cultes, mais il peut financer l'entretien des édifices religieux construits avant 1905, dont il est propriétaire.":
    "Państwo nie finansuje kultów, może natomiast finansować utrzymanie budynków religijnych wzniesionych przed 1905 rokiem, których jest właścicielem.",
  "Croire ou ne pas croire": "Wierzyć albo nie wierzyć",
  "Chacun peut **changer de religion** ou n'en avoir aucune, librement et à tout moment. Une personne qui déclare ne croire en aucun dieu est **athée** ; celle qui estime qu'on ne peut pas savoir est **agnostique**. Ni l'une ni l'autre n'a de compte à rendre.":
    "Każdy może **zmienić religię** albo nie mieć żadnej, swobodnie i w każdej chwili. Osoba, która deklaruje, że nie wierzy w żadnego boga, jest **ateistą**; ta, która uważa, że nie sposób tego wiedzieć — **agnostykiem**. Ani jedna, ani druga nie musi się z tego tłumaczyć.",
  "L'**antisémitisme** désigne précisément la haine ou les préjugés visant les Juifs. Comme le racisme et les autres discriminations, il est un délit puni par la loi, et non une opinion.":
    "**Antysemityzm** oznacza konkretnie nienawiść lub uprzedzenia wymierzone w Żydów. Podobnie jak rasizm i inne formy dyskryminacji jest przestępstwem karanym przez prawo, a nie poglądem.",
  "Loi du 9 décembre 1905 · loi de 2004 sur les signes religieux à l'école · charte de la laïcité (2013).":
    "Ustawa z 9 grudnia 1905 roku · ustawa z 2004 roku o symbolach religijnych w szkole · karta laïcité (2013).",
  "1905 : séparation des Églises et de l'État. 9 décembre : journée de la laïcité. 2004 : signes religieux à l'école. 2013 : charte de la laïcité.":
    "1905: rozdział Kościołów i państwa. 9 grudnia: dzień laïcité. 2004: symbole religijne w szkole. 2013: karta laïcité.",
  "Laïcité · neutralité · liberté de conscience · culte · athée · agnostique · antisémitisme.":
    "Laïcité · neutralność · wolność sumienia · kult · ateista · agnostyk · antysemityzm.",
  "En une phrase : l'État ne croit rien pour que chacun puisse croire ce qu'il veut.":
    "W jednym zdaniu: państwo nie wierzy w nic, aby każdy mógł wierzyć w to, co chce.",

  // ── Fundamental freedoms ────────────────────────────────────────────────
  "Les libertés fondamentales": "Wolności podstawowe",
  "Pourquoi cette leçon : les questions ne demandent pas de réciter une liste de libertés, mais de reconnaître où elles s'appliquent et où elles s'arrêtent. C'est là que se joue la différence entre une bonne et une mauvaise réponse.":
    "Po co ta lekcja: pytania nie wymagają wyliczenia listy wolności, lecz rozpoznania, gdzie one obowiązują, a gdzie się kończą. To tam rozstrzyga się różnica między dobrą a złą odpowiedzią.",
  "S'exprimer": "Wypowiadać się",
  "La **liberté d'expression** permet de dire et d'écrire ce que l'on pense, y compris pour critiquer le gouvernement, une religion ou une idée. Elle est **encadrée par la loi** : on ne peut pas injurier, diffamer, inciter à la haine, faire l'apologie du terrorisme ni nier des crimes contre l'humanité.":
    "**Wolność wypowiedzi** pozwala mówić i pisać to, co się myśli, w tym krytykować rząd, religię czy ideę. Jest **ujęta w ramy prawa**: nie wolno znieważać, zniesławiać, nawoływać do nienawiści, pochwalać terroryzmu ani negować zbrodni przeciwko ludzkości.",
  "La **liberté de la presse** garantit que les journalistes peuvent enquêter et publier sans autorisation ni censure préalable. Elle protège le droit d'être informé autant que celui d'informer.":
    "**Wolność prasy** gwarantuje, że dziennikarze mogą prowadzić śledztwa i publikować bez zezwolenia i bez cenzury prewencyjnej. Chroni prawo do bycia informowanym tak samo jak prawo do informowania.",
  "Sur les **réseaux sociaux**, la liberté d'expression est la même qu'ailleurs, et la loi aussi : un message haineux publié en ligne est une infraction, pas un avis.":
    "W **mediach społecznościowych** wolność wypowiedzi jest taka sama jak wszędzie indziej — i prawo również: nienawistny wpis opublikowany w sieci to przestępstwo, nie opinia.",
  "Se réunir, s'associer, se syndiquer": "Zgromadzać się, zrzeszać, należeć do związku",
  "Manifester": "Manifestować",
  "Se rassembler pacifiquement est un droit. Une manifestation sur la voie publique doit être déclarée en préfecture.":
    "Pokojowe zgromadzenie jest prawem. Manifestację na drodze publicznej należy zgłosić w prefekturze.",
  "S'associer": "Zrzeszać się",
  "Depuis 1901, créer une association demande une simple déclaration, jamais une autorisation.":
    "Od 1901 roku założenie stowarzyszenia wymaga zwykłego zgłoszenia, nigdy zezwolenia.",
  "Se syndiquer": "Należeć do związku zawodowego",
  "Tout salarié peut adhérer au syndicat de son choix — ou à aucun. Personne ne peut être sanctionné pour cela.":
    "Każdy pracownik może wstąpić do wybranego związku zawodowego — albo do żadnego. Nikt nie może być za to ukarany.",
  "Faire grève": "Strajkować",
  "Le droit de grève est constitutionnel. Il sert à défendre des revendications professionnelles collectives.":
    "Prawo do strajku ma rangę konstytucyjną. Służy obronie zbiorowych postulatów zawodowych.",
  "Aller et venir": "Poruszać się swobodnie",
  "La **liberté de circulation** permet de se déplacer et de s'installer librement sur le territoire, de le quitter et d'y revenir. En Europe, l'espace Schengen l'étend au-delà des frontières françaises.":
    "**Wolność przemieszczania się** pozwala swobodnie podróżować i osiedlać się na terytorium kraju, opuszczać je i wracać. W Europie strefa Schengen rozszerza ją poza granice Francji.",
  "Quand une liberté peut être restreinte": "Kiedy wolność może zostać ograniczona",
  "L'État peut restreindre une liberté, mais seulement **au nom de l'ordre public** et **dans les limites fixées par la loi** — jamais parce qu'une opinion déplaît. La sécurité, la santé publique et les droits d'autrui sont les motifs admis.":
    "Państwo może ograniczyć wolność, ale wyłącznie **w imię porządku publicznego** i **w granicach określonych przez prawo** — nigdy dlatego, że jakiś pogląd się nie podoba. Bezpieczeństwo, zdrowie publiczne i prawa innych osób to dopuszczalne przesłanki.",
  "Loi de 1901 (associations) · loi de 1881 (liberté de la presse).":
    "Ustawa z 1901 roku (stowarzyszenia) · ustawa z 1881 roku (wolność prasy).",
  "1881 : liberté de la presse. 1901 : liberté d'association. L'ordre public est le seul motif général de restriction.":
    "1881: wolność prasy. 1901: wolność zrzeszania się. Porządek publiczny to jedyna ogólna przesłanka ograniczenia.",
  "Expression · presse · association · syndicat · grève · circulation · ordre public.":
    "Wypowiedź · prasa · stowarzyszenie · związek zawodowy · strajk · przemieszczanie się · porządek publiczny.",
  "En une phrase : toutes ces libertés existent par défaut, et il faut une loi pour les limiter — jamais l'inverse.":
    "W jednym zdaniu: wszystkie te wolności istnieją domyślnie, a do ich ograniczenia potrzeba ustawy — nigdy odwrotnie.",

  // ── Taxes, solidarity and public service ────────────────────────────────
  "Impôts, solidarité et service public": "Podatki, solidarność i służba publiczna",
  "Pourquoi cette leçon : la fraternité de la devise se paie. Les questions sur l'impôt et la Sécurité sociale demandent de comprendre à quoi sert l'argent, pas de connaître des taux.":
    "Po co ta lekcja: braterstwo z dewizy kosztuje. Pytania o podatki i Sécurité sociale wymagają zrozumienia, na co idą pieniądze, a nie znajomości stawek.",
  "L'impôt": "Podatek",
  "Les impôts financent les **dépenses publiques** : écoles, hôpitaux, routes, police, justice, défense, aides sociales. **Déclarer ses revenus** à l'administration fiscale est **obligatoire chaque année**, même quand on ne paie pas d'impôt sur le revenu.":
    "Podatki finansują **wydatki publiczne**: szkoły, szpitale, drogi, policję, sądownictwo, obronę, świadczenia socjalne. **Zgłoszenie dochodów** administracji skarbowej jest **obowiązkowe co roku**, nawet jeśli nie płaci się podatku dochodowego.",
  "Ne pas déclarer, ou déclarer faux, expose à des pénalités et, dans les cas graves, à des poursuites pénales. La déclaration est un devoir, pas une formalité facultative.":
    "Brak zgłoszenia lub zgłoszenie nieprawdziwe naraża na kary, a w poważnych przypadkach na postępowanie karne. Deklaracja jest obowiązkiem, a nie formalnością do wyboru.",
  "La Sécurité sociale": "Sécurité sociale",
  "La **Sécurité sociale** a été créée en **1945**, au sortir de la Seconde Guerre mondiale. Elle couvre la maladie, la vieillesse, la famille et les accidents du travail. Elle repose sur un principe simple : chacun cotise selon ses moyens et reçoit selon ses besoins.":
    "**Sécurité sociale** — francuski system zabezpieczenia społecznego — powstała w **1945 roku**, tuż po drugiej wojnie światowej. Obejmuje chorobę, starość, rodzinę i wypadki przy pracy. Opiera się na prostej zasadzie: każdy płaci składki według swoich możliwości i otrzymuje według swoich potrzeb.",
  "Le service public": "Służba publiczna",
  "Égalité": "Równość",
  "Le service public traite tous les usagers de la même façon, sans distinction d'origine, de religion ou de fortune.":
    "Służba publiczna traktuje wszystkich interesantów jednakowo, bez względu na pochodzenie, religię czy majątek.",
  "Neutralité": "Neutralność",
  "Ses agents ne montrent ni leurs convictions religieuses ni leurs préférences politiques dans leur fonction.":
    "Jej funkcjonariusze nie okazują podczas pełnienia obowiązków ani przekonań religijnych, ani sympatii politycznych.",
  "Continuité": "Ciągłość",
  "Il fonctionne sans interruption : c'est pourquoi certains services ont un service minimum même en cas de grève.":
    "Działa bez przerwy: dlatego niektóre służby mają zapewnione minimum usług nawet podczas strajku.",
  "Gratuité relative": "Względna bezpłatność",
  "Beaucoup de services sont gratuits à l'usage — l'école publique, l'état civil — parce qu'ils sont payés par l'impôt.":
    "Wiele usług jest bezpłatnych w użyciu — szkoła publiczna, urząd stanu cywilnego — ponieważ opłaca je podatek.",
  "Ce qu'on peut faire à la mairie": "Co można załatwić w merostwie",
  "La mairie tient l'**état civil** : déclarer une naissance, se marier, obtenir un acte. On y fait aussi sa demande de **carte d'identité** ou de **passeport**, on s'**inscrit sur les listes électorales** et on inscrit ses enfants à l'**école publique**.":
    "Merostwo prowadzi **akta stanu cywilnego**: zgłoszenie narodzin, zawarcie małżeństwa, uzyskanie odpisu. Składa się tam również wniosek o **dowód osobisty** lub **paszport**, **wpisuje się do rejestru wyborców** i zapisuje dzieci do **szkoły publicznej**.",
  "Sécurité sociale · services fiscaux · mairie · état civil.":
    "Sécurité sociale · urzędy skarbowe · merostwo · urząd stanu cywilnego.",
  "1945 : création de la Sécurité sociale. Déclaration de revenus : tous les ans, obligatoire.":
    "1945: utworzenie Sécurité sociale. Deklaracja dochodów: co roku, obowiązkowo.",
  "Impôt · dépense publique · cotisation · service public · état civil · listes électorales.":
    "Podatek · wydatek publiczny · składka · służba publiczna · akta stanu cywilnego · rejestr wyborców.",
  "En une phrase : l'impôt est la forme concrète de la fraternité, et le service public est ce qu'il achète.":
    "W jednym zdaniu: podatek jest konkretną postacią braterstwa, a służba publiczna tym, co za niego kupujemy.",

  // ── The Constitution and the rule of law ────────────────────────────────
  "La Constitution et l'État de droit": "Konstytucja i państwo prawa",
  "Système institutionnel et politique": "Ustrój instytucjonalny i polityczny",
  "Pourquoi cette leçon avant les autres du thème : tout le reste — le président, le Parlement, les communes — est organisé par un seul texte. Le connaître, c'est comprendre pourquoi les institutions sont ainsi et pas autrement.":
    "Po co ta lekcja przed pozostałymi w tym dziale: cała reszta — prezydent, parlament, gminy — jest zorganizowana przez jeden tekst. Poznać go znaczy zrozumieć, dlaczego instytucje wyglądają tak, a nie inaczej.",
  "La Ve République": "V Republika",
  "La **Constitution du 4 octobre 1958** fonde la **Ve République**. Elle a été voulue par le **général de Gaulle** après l'instabilité de la IVe. Elle donne au président de la République un rôle central, ce qui la distingue des républiques précédentes.":
    "**Konstytucja z 4 października 1958 roku** ustanawia **V Republikę**. Doprowadził do niej **generał de Gaulle** po niestabilności IV Republiki. Nadaje prezydentowi Republiki rolę centralną, co odróżnia ją od poprzednich republik.",
  "L'article 1er": "Artykuł 1",
  "L'article 1er dispose que la France est une **République indivisible, laïque, démocratique et sociale**. Elle assure l'égalité devant la loi de tous les citoyens sans distinction d'origine, de race ou de religion, et respecte toutes les croyances. Ces quatre adjectifs sont demandés tels quels.":
    "Artykuł 1 stanowi, że Francja jest **Republiką niepodzielną, świecką, demokratyczną i socjalną**. Zapewnia równość wobec prawa wszystkim obywatelom bez względu na pochodzenie, rasę czy religię i szanuje wszystkie wyznania. O te cztery przymiotniki pyta się dosłownie.",
  "Indivisible": "Niepodzielna",
  "Un seul peuple, un seul territoire, une seule loi. Il n'existe pas de citoyenneté régionale.":
    "Jeden naród, jedno terytorium, jedno prawo. Nie istnieje obywatelstwo regionalne.",
  "Laïque": "Świecka",
  "L'État est neutre en matière de religion et ne reconnaît aucun culte.":
    "Państwo jest neutralne w sprawach religii i nie uznaje żadnego kultu.",
  "Démocratique": "Demokratyczna",
  "Le pouvoir vient du peuple, qui l'exerce par ses représentants et par le référendum.":
    "Władza pochodzi od narodu, który sprawuje ją przez swoich przedstawicieli i w referendum.",
  "Sociale": "Socjalna",
  "L'État garantit une protection : santé, retraite, aide aux plus fragiles.":
    "Państwo gwarantuje ochronę: zdrowie, emerytury, pomoc najsłabszym.",
  "L'État de droit": "Państwo prawa",
  "L'**État de droit** signifie que tout le monde est soumis à la loi, y compris l'État lui-même. Un citoyen peut attaquer une décision de l'administration devant un juge et obtenir son annulation. Personne n'est au-dessus des règles.":
    "**Państwo prawa** oznacza, że wszyscy podlegają prawu, łącznie z samym państwem. Obywatel może zaskarżyć decyzję administracji przed sądem i doprowadzić do jej uchylenia. Nikt nie stoi ponad regułami.",
  "On n'a **pas le droit de ne pas respecter une loi**, même quand on la juge injuste. On peut la contester, faire campagne pour la changer, saisir un juge — mais pas s'en dispenser.":
    "**Nie ma prawa do nieprzestrzegania ustawy**, nawet gdy uznaje się ją za niesprawiedliwą. Można ją kwestionować, prowadzić kampanię na rzecz jej zmiany, zwrócić się do sądu — ale nie zwolnić się z niej.",
  "La séparation des pouvoirs": "Podział władz",
  "Les trois pouvoirs sont le **législatif** (faire la loi), l'**exécutif** (l'appliquer) et le **judiciaire** (juger). Les séparer empêche qu'une seule main les tienne tous : c'est l'idée de **Montesquieu**, et c'est la garantie principale contre l'arbitraire.":
    "Trzy władze to **ustawodawcza** (stanowi prawo), **wykonawcza** (stosuje je) i **sądownicza** (sądzi). Ich rozdzielenie nie pozwala, by wszystkie znalazły się w jednym ręku: to myśl **Monteskiusza** i główna gwarancja przeciw samowoli.",
  "Modifier la Constitution": "Zmiana Konstytucji",
  "Une révision constitutionnelle est votée dans les mêmes termes par les deux assemblées, puis approuvée soit par **référendum**, soit par le **Congrès** (Assemblée nationale et Sénat réunis à Versailles) à la majorité des trois cinquièmes.":
    "Rewizję konstytucyjną uchwalają w tym samym brzmieniu obie izby, a następnie zatwierdza ją albo **referendum**, albo **Kongres** (Zgromadzenie Narodowe i Senat obradujące razem w Wersalu) większością trzech piątych.",
  "Charles de Gaulle · Montesquieu · le Congrès de Versailles.":
    "Charles de Gaulle · Monteskiusz · Kongres w Wersalu.",
  "4 octobre 1958 : Constitution de la Ve République. Trois pouvoirs. Trois cinquièmes au Congrès pour réviser.":
    "4 października 1958: Konstytucja V Republiki. Trzy władze. Trzy piąte w Kongresie, by dokonać rewizji.",
  "Constitution · Ve République · État de droit · séparation des pouvoirs · référendum · Congrès.":
    "Konstytucja · V Republika · państwo prawa · podział władz · referendum · Kongres.",
  "En une phrase : la Constitution place la loi au-dessus de tous, y compris de ceux qui la font.":
    "W jednym zdaniu: Konstytucja stawia prawo ponad wszystkimi, także ponad tymi, którzy je stanowią.",

  // ── The president and the government ────────────────────────────────────
  "Le président et le gouvernement": "Prezydent i rząd",
  "Pourquoi cette leçon : la confusion entre le président et le Premier ministre est l'erreur la plus fréquente. L'un est élu par le peuple, l'autre est nommé — et cela change tout ce qu'ils font.":
    "Po co ta lekcja: mylenie prezydenta z premierem to najczęstszy błąd. Jeden jest wybierany przez naród, drugi mianowany — i to zmienia wszystko, co robią.",
  "Le président de la République": "Prezydent Republiki",
  "Le président est élu au **suffrage universel direct** pour **cinq ans**, au scrutin majoritaire à deux tours. Il est le **chef de l'État** et le **chef des armées**. Il nomme le Premier ministre, préside le Conseil des ministres, promulgue les lois et peut dissoudre l'Assemblée nationale.":
    "Prezydent jest wybierany w **wyborach powszechnych bezpośrednich** na **pięć lat**, w głosowaniu większościowym dwuturowym. Jest **głową państwa** i **zwierzchnikiem sił zbrojnych**. Mianuje premiera, przewodniczy Radzie Ministrów, promulguje ustawy i może rozwiązać Zgromadzenie Narodowe.",
  "Pour se présenter, il faut être de **nationalité française**, avoir **18 ans révolus**, jouir de ses droits civils et politiques, être inscrit sur les listes électorales et réunir **500 parrainages** d'élus.":
    "By kandydować, trzeba mieć **obywatelstwo francuskie**, **ukończone 18 lat**, korzystać z praw cywilnych i politycznych, być wpisanym do rejestru wyborców i zebrać **500 podpisów poparcia** od osób z mandatem.",
  "Si le président décède ou démissionne, c'est le **président du Sénat** qui assure l'intérim — pas le Premier ministre. C'est une question classique.":
    "Jeśli prezydent umrze lub ustąpi, obowiązki tymczasowo przejmuje **przewodniczący Senatu** — nie premier. To klasyczne pytanie.",
  "Le Premier ministre et le gouvernement": "Premier i rząd",
  "Le **Premier ministre** est **nommé par le président de la République**. Il n'est pas élu. Il **dirige l'action du gouvernement**, propose les ministres au président et fait appliquer les lois. Le gouvernement est responsable devant l'Assemblée nationale, qui peut le renverser par une motion de censure.":
    "**Premier** jest **mianowany przez prezydenta Republiki**. Nie jest wybierany. **Kieruje działaniami rządu**, przedstawia prezydentowi kandydatów na ministrów i dba o wykonywanie ustaw. Rząd odpowiada przed Zgromadzeniem Narodowym, które może go obalić wotum nieufności.",
  "Le président": "Prezydent",
  "Chef de l'État et des armées. Élu 5 ans au suffrage universel direct. Nomme le Premier ministre.":
    "Głowa państwa i zwierzchnik sił zbrojnych. Wybierany na 5 lat w wyborach powszechnych bezpośrednich. Mianuje premiera.",
  "Le Premier ministre": "Premier",
  "Chef du gouvernement. Nommé, pas élu. Dirige l'action du gouvernement.":
    "Szef rządu. Mianowany, nie wybierany. Kieruje działaniami rządu.",
  "Les ministres": "Ministrowie",
  "Nommés par le président sur proposition du Premier ministre. Chacun dirige un domaine.":
    "Mianowani przez prezydenta na wniosek premiera. Każdy kieruje jednym resortem.",
  "Le Conseil des ministres": "Rada Ministrów",
  "Réunion hebdomadaire, présidée par le président de la République à l'Élysée.":
    "Cotygodniowe posiedzenie, któremu przewodniczy prezydent Republiki w Pałacu Elizejskim.",
  "Le Défenseur des droits": "Défenseur des droits (Rzecznik Praw)",
  "Le **Défenseur des droits** est une autorité indépendante. Toute personne qui s'estime victime d'une discrimination ou mal traitée par une administration peut le saisir **gratuitement**. Il n'est ni un juge ni un ministre : il enquête, recommande et fait pression.":
    "**Défenseur des droits** to niezależny organ. Każdy, kto uważa się za ofiarę dyskryminacji lub za źle potraktowanego przez administrację, może się do niego zwrócić **bezpłatnie**. Nie jest ani sędzią, ani ministrem: prowadzi postępowanie wyjaśniające, wydaje zalecenia i wywiera nacisk.",
  "Président de la République · Premier ministre · Défenseur des droits · président du Sénat.":
    "Prezydent Republiki · premier · Défenseur des droits · przewodniczący Senatu.",
  "5 ans de mandat présidentiel. 18 ans et 500 parrainages pour être candidat. Intérim : président du Sénat.":
    "5 lat kadencji prezydenckiej. 18 lat i 500 podpisów poparcia, by kandydować. Zastępstwo: przewodniczący Senatu.",
  "Suffrage universel direct · chef de l'État · nomination · motion de censure · autorité indépendante.":
    "Wybory powszechne bezpośrednie · głowa państwa · nominacja · wotum nieufności · organ niezależny.",
  "En une phrase : le peuple choisit le président, le président choisit le Premier ministre, et l'Assemblée peut renvoyer le second sans toucher au premier.":
    "W jednym zdaniu: naród wybiera prezydenta, prezydent wybiera premiera, a Zgromadzenie może odwołać tego drugiego, nie tykając pierwszego.",

  // ── Parliament and the law ──────────────────────────────────────────────
  "Le Parlement et la loi": "Parlament i ustawa",
  "Pourquoi cette leçon : les deux chambres portent des noms proches et des durées de mandat différentes. Les questions jouent précisément là-dessus.":
    "Po co ta lekcja: obie izby noszą podobne nazwy i mają różne kadencje. Pytania grają właśnie na tym.",
  "Deux chambres": "Dwie izby",
  "Le **Parlement** vote la loi. Il comprend l'**Assemblée nationale** et le **Sénat**. Les deux examinent les textes ; en cas de désaccord persistant, c'est l'Assemblée nationale qui a le dernier mot.":
    "**Parlament** uchwala ustawy. Składa się ze **Zgromadzenia Narodowego** i **Senatu**. Obie izby rozpatrują teksty; przy utrzymującej się rozbieżności ostatnie słowo należy do Zgromadzenia Narodowego.",
  "Assemblée nationale": "Assemblée nationale (Zgromadzenie Narodowe)",
  "577 députés, élus au suffrage universel DIRECT pour 5 ans. Siège au Palais Bourbon.":
    "577 deputowanych, wybieranych w wyborach powszechnych BEZPOŚREDNICH na 5 lat. Siedziba: Palais Bourbon.",
  "Sénat": "Sénat (Senat)",
  "Sénateurs élus au suffrage INDIRECT par de grands électeurs, pour 6 ans. Siège au Palais du Luxembourg.":
    "Senatorowie wybierani w wyborach POŚREDNICH przez elektorów, na 6 lat. Siedziba: Palais du Luxembourg.",
  "Qui fait quoi": "Kto co robi",
  "Les deux votent la loi et contrôlent le gouvernement. Seule l'Assemblée peut le renverser.":
    "Obie izby uchwalają ustawy i kontrolują rząd. Tylko Zgromadzenie może go obalić.",
  "Le Congrès": "Kongres",
  "Les deux chambres réunies à Versailles, pour réviser la Constitution.":
    "Obie izby obradujące razem w Wersalu, w celu rewizji Konstytucji.",
  "Comment naît une loi": "Jak powstaje ustawa",
  "Un texte proposé par le gouvernement est un **projet de loi** ; proposé par des parlementaires, c'est une **proposition de loi**. Il fait la navette entre les deux chambres jusqu'à un vote identique, puis le président de la République le **promulgue** et il est publié au *Journal officiel*.":
    "Tekst zgłoszony przez rząd to **projet de loi** (projekt rządowy); zgłoszony przez parlamentarzystów — **proposition de loi** (projekt poselski). Krąży między izbami aż do jednobrzmiącego głosowania, po czym prezydent Republiki go **promulguje**, a tekst zostaje ogłoszony w *Journal officiel*.",
  "Les partis politiques": "Partie polityczne",
  "**Adhérer à un parti politique est libre.** Les partis concourent à l'expression du suffrage, se forment et exercent leur activité librement, dans le respect de la souveraineté nationale et de la démocratie.":
    "**Przystąpienie do partii politycznej jest wolne.** Partie współuczestniczą w wyrażaniu woli wyborców, powstają i prowadzą działalność swobodnie, z poszanowaniem suwerenności narodowej i demokracji.",
  "Assemblée nationale · Sénat · Palais Bourbon · Palais du Luxembourg · Journal officiel.":
    "Assemblée nationale · Sénat · Palais Bourbon · Palais du Luxembourg · Journal officiel.",
  "577 députés, 5 ans. Sénateurs, 6 ans. Dernier mot : l'Assemblée nationale.":
    "577 deputowanych, 5 lat. Senatorowie, 6 lat. Ostatnie słowo: Zgromadzenie Narodowe.",
  "Parlement · député · sénateur · suffrage indirect · navette · promulgation.":
    "Parlament · deputowany · senator · wybory pośrednie · procedura wahadłowa · promulgacja.",
  "En une phrase : deux chambres écrivent la loi, une seule peut faire tomber le gouvernement.":
    "W jednym zdaniu: dwie izby piszą ustawy, tylko jedna może obalić rząd.",

  // ── Justice and the Conseil constitutionnel ─────────────────────────────
  "La justice et le Conseil constitutionnel": "Wymiar sprawiedliwości i Conseil constitutionnel",
  "Pourquoi cette leçon : plusieurs questions demandent qui sanctionne quoi. Un maire n'est pas un juge, et le Conseil constitutionnel ne juge pas les voleurs.":
    "Po co ta lekcja: kilka pytań dotyczy tego, kto co karze. Mer nie jest sędzią, a Conseil constitutionnel nie sądzi złodziei.",
  "Qui juge": "Kto sądzi",
  "Seul un **juge** peut sanctionner l'auteur d'une infraction. La justice est rendue au nom du peuple français par des magistrats **indépendants**, et personne — ni un ministre, ni un maire, ni la police — ne peut prononcer une peine à leur place.":
    "Tylko **sędzia** może ukarać sprawcę czynu zabronionego. Sprawiedliwość wymierzają w imieniu narodu francuskiego **niezawiśli** sędziowie i nikt — ani minister, ani mer, ani policja — nie może orzec kary zamiast nich.",
  "Contravention": "Wykroczenie",
  "L'infraction la plus légère : stationnement gênant, petit excès de vitesse. Amende.":
    "Najlżejszy czyn zabroniony: parkowanie utrudniające ruch, niewielkie przekroczenie prędkości. Grzywna.",
  "Délit": "Występek",
  "Plus grave : vol, escroquerie, violences. Jugé par le tribunal correctionnel.":
    "Poważniejszy: kradzież, oszustwo, przemoc. Sądzi go tribunal correctionnel.",
  "Crime": "Zbrodnia",
  "Le plus grave : meurtre, viol. Jugé par la cour d'assises, avec des jurés citoyens.":
    "Najcięższy: zabójstwo, gwałt. Sądzi go cour d'assises, z udziałem ławników z grona obywateli.",
  "Conseil de prud'hommes": "Conseil de prud'hommes (sąd pracy)",
  "Les litiges entre un salarié et son employeur : licenciement, salaires, contrat.":
    "Spory między pracownikiem a pracodawcą: zwolnienie, wynagrodzenie, umowa.",
  "Être juré d'assises": "Być ławnikiem w cour d'assises",
  "Un citoyen tiré au sort peut être appelé comme **juré d'assises**. Ce n'est pas une invitation : c'est **obligatoire**, et se dérober sans motif légitime est sanctionné. Le juré siège aux côtés des magistrats professionnels et participe au verdict.":
    "Obywatel wylosowany może zostać powołany na **ławnika w cour d'assises**. To nie zaproszenie: jest to **obowiązek**, a uchylenie się bez uzasadnionej przyczyny jest karane. Ławnik zasiada obok sędziów zawodowych i współdecyduje o wyroku.",
  "Le Conseil constitutionnel": "Conseil constitutionnel (Rada Konstytucyjna)",
  "Le **Conseil constitutionnel** vérifie que les lois sont **conformes à la Constitution**. Il contrôle aussi la régularité des élections nationales et des référendums. Il ne juge ni les crimes ni les litiges entre personnes.":
    "**Conseil constitutionnel** bada, czy ustawy są **zgodne z Konstytucją**. Kontroluje także prawidłowość wyborów krajowych i referendów. Nie sądzi ani zbrodni, ani sporów między osobami.",
  "Se défendre": "Bronić się",
  "Après une interpellation, on peut **garder le silence**, **être assisté d'un avocat** et **prévenir un proche**. L'**aide juridictionnelle** permet aux personnes aux revenus modestes d'avoir un avocat pris en charge par l'État.":
    "Po zatrzymaniu można **zachować milczenie**, **korzystać z pomocy adwokata** i **powiadomić bliską osobę**. **Aide juridictionnelle** — pomoc prawna z urzędu — pozwala osobom o skromnych dochodach mieć adwokata opłacanego przez państwo.",
  "Une condamnation peut s'accompagner de la **privation des droits civils et politiques** : pendant cette période, la personne ne peut ni voter ni être élue. Elle reste soumise à la loi comme tout le monde.":
    "Skazaniu może towarzyszyć **pozbawienie praw cywilnych i politycznych**: w tym czasie osoba nie może ani głosować, ani być wybierana. Nadal podlega prawu jak wszyscy.",
  "Conseil constitutionnel · cour d'assises · tribunal correctionnel · conseil de prud'hommes.":
    "Conseil constitutionnel · cour d'assises · tribunal correctionnel · conseil de prud'hommes.",
  "Trois degrés d'infraction : contravention, délit, crime. Le crime est le plus grave.":
    "Trzy stopnie czynów zabronionych: wykroczenie, występek, zbrodnia. Zbrodnia jest najcięższa.",
  "Magistrat · juré · aide juridictionnelle · droits civils et politiques · constitutionnalité.":
    "Sędzia · ławnik · pomoc prawna z urzędu · prawa cywilne i polityczne · zgodność z konstytucją.",
  "En une phrase : la justice punit les personnes, le Conseil constitutionnel corrige les lois.":
    "W jednym zdaniu: wymiar sprawiedliwości karze ludzi, Conseil constitutionnel poprawia ustawy.",

  // ── Voting in France ────────────────────────────────────────────────────
  "Voter en France": "Głosowanie we Francji",
  "Pourquoi cette leçon : les questions sur le vote portent sur des conditions précises — l'âge, la nationalité, l'inscription — et sur ce qui est obligatoire et ce qui ne l'est pas.":
    "Po co ta lekcja: pytania o głosowanie dotyczą konkretnych warunków — wieku, obywatelstwa, wpisu do rejestru — oraz tego, co jest obowiązkowe, a co nie.",
  "La souveraineté": "Suwerenność",
  "La **souveraineté nationale appartient au peuple**, qui l'exerce par ses **représentants** et par la voie du **référendum**. Aucune section du peuple ni aucun individu ne peut s'en attribuer l'exercice.":
    "**Suwerenność narodowa należy do narodu**, który sprawuje ją przez swoich **przedstawicieli** i w drodze **referendum**. Żadna część narodu ani żadna osoba nie może przypisać sobie jej wykonywania.",
  "Qui peut voter": "Kto może głosować",
  "Pour voter aux élections présidentielles et législatives, il faut être de **nationalité française**, avoir **18 ans**, jouir de ses **droits civils et politiques** et être **inscrit sur les listes électorales**.":
    "Aby głosować w wyborach prezydenckich i parlamentarnych, trzeba mieć **obywatelstwo francuskie**, **18 lat**, korzystać z **praw cywilnych i politycznych** oraz być **wpisanym do rejestru wyborców**.",
  "Les citoyens d'un autre pays de l'Union européenne résidant en France peuvent voter aux élections **municipales** et **européennes**, mais pas aux présidentielles ni aux législatives.":
    "Obywatele innego kraju Unii Europejskiej mieszkający we Francji mogą głosować w wyborach **samorządowych** i **europejskich**, ale nie w prezydenckich ani parlamentarnych.",
  "S'inscrire": "Wpisać się do rejestru",
  "L'inscription sur les listes électorales est **obligatoire**. On s'inscrit **en ligne** ou, sans internet, **à la mairie** de son domicile. Le **vote lui-même n'est pas obligatoire** en France — l'inscription l'est, l'acte de voter est un droit.":
    "Wpis do rejestru wyborców jest **obowiązkowy**. Wpisuje się **przez internet**, a bez internetu — **w merostwie** właściwym dla miejsca zamieszkania. **Samo głosowanie nie jest obowiązkowe** we Francji — obowiązkowy jest wpis, a oddanie głosu jest prawem.",
  "Les principales élections": "Najważniejsze wybory",
  "Présidentielle": "Prezydenckie",
  "Le président de la République, tous les 5 ans, au suffrage universel direct.":
    "Prezydent Republiki, co 5 lat, w wyborach powszechnych bezpośrednich.",
  "Législatives": "Parlamentarne",
  "Les députés de l'Assemblée nationale, tous les 5 ans.":
    "Deputowani do Zgromadzenia Narodowego, co 5 lat.",
  "Municipales": "Samorządowe",
  "Les conseillers municipaux, tous les 6 ans. Le conseil élit ensuite le maire.":
    "Radni gminni, co 6 lat. Rada wybiera następnie mera.",
  "Européennes": "Europejskie",
  "Les députés européens, tous les 5 ans, élus directement par les citoyens.":
    "Posłowie do Parlamentu Europejskiego, co 5 lat, wybierani bezpośrednio przez obywateli.",
  "Listes électorales · mairie · référendum.": "Rejestr wyborców · merostwo · referendum.",
  "18 ans pour voter. 5 ans : président, députés, députés européens. 6 ans : conseil municipal et maire.":
    "18 lat, by głosować. 5 lat: prezydent, deputowani, posłowie do PE. 6 lat: rada gminy i mer.",
  "Souveraineté · suffrage universel · inscription · droits civils et politiques.":
    "Suwerenność · wybory powszechne · wpis do rejestru · prawa cywilne i polityczne.",
  "En une phrase : s'inscrire est obligatoire, voter est libre, et les deux se font à la mairie quand internet manque.":
    "W jednym zdaniu: wpis jest obowiązkowy, głosowanie dobrowolne, a jedno i drugie załatwia się w merostwie, gdy brakuje internetu.",

  // ── Communes, departments, regions ──────────────────────────────────────
  "Communes, départements, régions": "Gminy, departamenty, regiony",
  "Pourquoi cette leçon : plusieurs questions demandent qui s'occupe de quoi. Écoles, collèges et lycées relèvent de trois niveaux différents, et c'est exactement ce que l'examen vérifie.":
    "Po co ta lekcja: kilka pytań dotyczy tego, kto czym się zajmuje. Szkoły podstawowe, gimnazja i licea podlegają trzem różnym szczeblom i właśnie to sprawdza egzamin.",
  "Trois niveaux": "Trzy szczeble",
  "La France est découpée en **communes**, **départements** et **régions**. À chaque niveau, une assemblée élue et des compétences propres.":
    "Francja dzieli się na **gminy**, **departamenty** i **regiony**. Na każdym szczeblu działa wybierana rada i przysługują własne kompetencje.",
  "La commune": "Gmina",
  "Le conseil municipal est élu pour 6 ans ; il élit le maire parmi ses membres. La commune gère les écoles maternelles et élémentaires.":
    "Rada gminy jest wybierana na 6 lat; spośród swoich członków wybiera mera. Gmina prowadzi przedszkola i szkoły podstawowe.",
  "Le département": "Departament",
  "Le conseil départemental gère les collèges, l'action sociale et les routes départementales. Il y a 101 départements.":
    "Rada departamentu prowadzi gimnazja, pomoc społeczną i drogi departamentalne. Departamentów jest 101.",
  "La région": "Region",
  "Le conseil régional gère les lycées, la formation professionnelle et les transports régionaux. 13 régions en métropole.":
    "Rada regionu prowadzi licea, kształcenie zawodowe i transport regionalny. W metropolii jest 13 regionów.",
  "Le préfet": "Prefekt",
  "Il représente l'État dans le département. Il est nommé, pas élu.":
    "Reprezentuje państwo w departamencie. Jest mianowany, nie wybierany.",
  "Le maire": "Mer",
  "Le maire est **élu par le conseil municipal**, non directement par les habitants, pour **six ans**. Il dirige la commune, célèbre les mariages, tient l'état civil et est **officier de police judiciaire**. Il est à la fois élu de la commune et représentant de l'État sur son territoire.":
    "Mer jest **wybierany przez radę gminy**, a nie bezpośrednio przez mieszkańców, na **sześć lat**. Kieruje gminą, udziela ślubów, prowadzi akta stanu cywilnego i jest **funkcjonariuszem policji sądowej**. Jest zarazem przedstawicielem gminy i reprezentantem państwa na jej terenie.",
  "Pour être candidat aux municipales, il faut avoir 18 ans, jouir de ses droits civils et politiques, et être inscrit sur la liste électorale de la commune ou y payer des impôts locaux. Un ressortissant de l'Union européenne peut être conseiller municipal, mais pas maire.":
    "Aby kandydować w wyborach samorządowych, trzeba mieć 18 lat, korzystać z praw cywilnych i politycznych oraz być wpisanym do rejestru wyborców gminy albo płacić w niej podatki lokalne. Obywatel Unii Europejskiej może być radnym gminy, ale nie merem.",
  "Le découpage": "Podział terytorialny",
  "Il y a **101 départements**, dont **cinq d'outre-mer**, et **13 régions en métropole**. Le 101e département est **Mayotte**, devenue département en **2011**.":
    "Jest **101 departamentów**, w tym **pięć zamorskich**, oraz **13 regionów w metropolii**. Sto pierwszym departamentem jest **Majotta**, która stała się departamentem w **2011 roku**.",
  "Commune · département · région · préfet · maire · Mayotte.":
    "Gmina · departament · region · prefekt · mer · Majotta.",
  "101 départements · 13 régions métropolitaines · 6 ans pour le conseil municipal et le maire · Mayotte 101e depuis 2011.":
    "101 departamentów · 13 regionów metropolitalnych · 6 lat dla rady gminy i mera · Majotta sto pierwsza od 2011 roku.",
  "Collectivité territoriale · conseil municipal · conseil départemental · conseil régional · officier d'état civil.":
    "Jednostka samorządu terytorialnego · rada gminy · rada departamentu · rada regionu · urzędnik stanu cywilnego.",
  "En une phrase : école la commune, collège le département, lycée la région — dans l'ordre où l'enfant grandit.":
    "W jednym zdaniu: szkoła podstawowa — gmina, gimnazjum — departament, liceum — region, w kolejności, w jakiej dziecko rośnie.",

  // ── France in the European Union ────────────────────────────────────────
  "La France dans l'Union européenne": "Francja w Unii Europejskiej",
  "Pourquoi cette leçon : une part régulière des questions porte sur l'Europe — les dates, les sièges, le drapeau, l'hymne. Ce sont des faits, et ils se retiennent en une fois.":
    "Po co ta lekcja: stała część pytań dotyczy Europy — dat, siedzib, flagi, hymnu. To fakty i zapamiętuje się je za jednym razem.",
  "La construction européenne": "Budowa Europy",
  "La première étape est la **Communauté européenne du charbon et de l'acier (CECA)**, créée par le **traité de Paris de 1951**. L'idée : mettre en commun les industries de la guerre pour la rendre matériellement impossible.":
    "Pierwszym krokiem jest **Europejska Wspólnota Węgla i Stali (CECA)**, powołana **traktatem paryskim z 1951 roku**. Zamysł: połączyć przemysły zbrojeniowe, by wojna stała się materialnie niemożliwa.",
  "Le **traité de Maastricht**, signé en **1992**, fonde l'**Union européenne** et crée la **citoyenneté européenne**. Tout citoyen d'un État membre est aussi citoyen de l'Union.":
    "**Traktat z Maastricht**, podpisany w **1992 roku**, ustanawia **Unię Europejską** i tworzy **obywatelstwo europejskie**. Każdy obywatel państwa członkowskiego jest zarazem obywatelem Unii.",
  "Au 1er janvier 2025, l'Union compte **27 États membres**. Le **Royaume-Uni** l'a quittée en **2020** — c'est le seul État à être sorti.":
    "Na 1 stycznia 2025 roku Unia liczy **27 państw członkowskich**. **Zjednoczone Królestwo** opuściło ją w **2020 roku** — jako jedyne państwo, które wystąpiło.",
  "Les symboles": "Symbole",
  "Le drapeau": "Flaga",
  "Douze étoiles dorées en cercle sur fond bleu. Les douze ne comptent pas les pays : c'est un symbole de perfection et d'unité.":
    "Dwanaście złotych gwiazd w kręgu na niebieskim tle. Dwanaście nie oznacza liczby państw: to symbol doskonałości i jedności.",
  "L'hymne": "Hymn",
  "L'Ode à la joie, tirée de la Neuvième Symphonie de Beethoven. Sans paroles officielles.":
    "Oda do radości z IX Symfonii Beethovena. Bez oficjalnych słów.",
  "La journée de l'Europe": "Dzień Europy",
  "Le 9 mai, anniversaire de la déclaration Schuman de 1950.":
    "9 maja, w rocznicę deklaracji Schumana z 1950 roku.",
  "La monnaie": "Waluta",
  "L'euro, monnaie officielle de la France depuis 2002 pour les pièces et les billets.":
    "Euro, oficjalna waluta Francji od 2002 roku, w monetach i banknotach.",
  "Les institutions et leurs sièges": "Instytucje i ich siedziby",
  "Parlement européen": "Parlament Europejski",
  "Strasbourg. Ses députés sont élus directement par les citoyens des États membres.":
    "Strasburg. Jego posłowie są wybierani bezpośrednio przez obywateli państw członkowskich.",
  "Commission européenne": "Komisja Europejska",
  "Bruxelles. Elle propose les textes et veille à leur application.":
    "Bruksela. Przedstawia projekty aktów prawnych i czuwa nad ich stosowaniem.",
  "Banque centrale européenne": "Europejski Bank Centralny",
  "Francfort. Elle conduit la politique monétaire de la zone euro.":
    "Frankfurt. Prowadzi politykę pieniężną strefy euro.",
  "Conseil de l'UE": "Rada UE",
  "Bruxelles. Il réunit les ministres des États membres.":
    "Bruksela. Zbiera ministrów państw członkowskich.",
  "CECA · traité de Maastricht · déclaration Schuman · Beethoven · Strasbourg, Bruxelles, Francfort.":
    "CECA · traktat z Maastricht · deklaracja Schumana · Beethoven · Strasburg, Bruksela, Frankfurt.",
  "1951 CECA · 1992 Maastricht et citoyenneté européenne · 2002 euro · 2020 départ du Royaume-Uni · 27 États au 1er janvier 2025 · 9 mai journée de l'Europe · 12 étoiles.":
    "1951 CECA · 1992 Maastricht i obywatelstwo europejskie · 2002 euro · 2020 wyjście Zjednoczonego Królestwa · 27 państw na 1 stycznia 2025 · 9 maja Dzień Europy · 12 gwiazd.",
  "Union européenne · citoyenneté européenne · zone euro · Parlement européen · Commission.":
    "Unia Europejska · obywatelstwo europejskie · strefa euro · Parlament Europejski · Komisja.",
  "En une phrase : Strasbourg vote, Bruxelles propose, Francfort tient la monnaie.":
    "W jednym zdaniu: Strasburg głosuje, Bruksela proponuje, Frankfurt trzyma pieniądz.",

  // ── The Declaration of the Rights of Man ────────────────────────────────
  "La Déclaration des droits de l'homme et du citoyen": "Deklaracja praw człowieka i obywatela",
  "Droits et devoirs": "Prawa i obowiązki",
  "Pourquoi cette leçon : un texte de 1789 est encore en vigueur aujourd'hui, et plusieurs questions le citent mot pour mot. Il vaut mieux l'avoir lu une fois.":
    "Po co ta lekcja: tekst z 1789 roku obowiązuje do dziś, a kilka pytań cytuje go słowo w słowo. Lepiej przeczytać go raz.",
  "Le texte fondateur": "Tekst założycielski",
  "La **Déclaration des droits de l'homme et du citoyen** a été adoptée le **26 août 1789**, quelques semaines après la prise de la Bastille. C'est le **texte fondateur** qui établit les droits et les devoirs de chaque citoyen, et il fait partie du **bloc de constitutionnalité** : il a encore aujourd'hui valeur de droit.":
    "**Deklaracja praw człowieka i obywatela** została przyjęta **26 sierpnia 1789 roku**, kilka tygodni po zdobyciu Bastylii. To **tekst założycielski**, który ustanawia prawa i obowiązki każdego obywatela, i należy do **bloku konstytucyjnego**: do dziś ma moc prawną.",
  "Les articles à connaître": "Artykuły, które trzeba znać",
  "Article 1er": "Artykuł 1",
  "« Les hommes naissent et demeurent libres et égaux en droits. » C'est la phrase la plus citée du texte.":
    "„Ludzie rodzą się i pozostają wolni i równi w prawach”. To najczęściej cytowane zdanie tego tekstu.",
  "Article 4": "Artykuł 4",
  "« La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. » Ma liberté s'arrête où commence celle des autres.":
    "„Wolność polega na możności czynienia wszystkiego, co nie szkodzi drugiemu”. Moja wolność kończy się tam, gdzie zaczyna się wolność innych.",
  "Article 6": "Artykuł 6",
  "La loi est l'expression de la volonté générale et doit être la même pour tous.":
    "Ustawa jest wyrazem woli powszechnej i musi być taka sama dla wszystkich.",
  "Article 11": "Artykuł 11",
  "La libre communication des pensées et des opinions est un des droits les plus précieux de l'homme.":
    "Swobodne przekazywanie myśli i poglądów jest jednym z najcenniejszych praw człowieka.",
  "Ne pas confondre : la **Déclaration de 1789** est française et fondatrice ; la **Déclaration universelle des droits de l'homme** est celle de l'ONU, adoptée en **1948**. Les deux existent, et les questions distinguent l'une de l'autre.":
    "Nie mylić: **Deklaracja z 1789 roku** jest francuska i założycielska; **Powszechna deklaracja praw człowieka** to dokument ONZ, przyjęty w **1948 roku**. Obie istnieją, a pytania je od siebie odróżniają.",
  "Les droits fondamentaux": "Prawa podstawowe",
  "Les **droits fondamentaux** sont les droits reconnus à toute personne du seul fait qu'elle est humaine. Ils ne se méritent pas et ne se retirent pas : dignité, sûreté, liberté de conscience, égalité devant la loi, droit à un procès équitable.":
    "**Prawa podstawowe** to prawa przysługujące każdemu z samego faktu bycia człowiekiem. Nie zasługuje się na nie i nie można ich odebrać: godność, nietykalność osobista, wolność sumienia, równość wobec prawa, prawo do rzetelnego procesu.",
  "Déclaration des droits de l'homme et du citoyen · Déclaration universelle de 1948.":
    "Deklaracja praw człowieka i obywatela · Powszechna deklaracja z 1948 roku.",
  "26 août 1789 : la Déclaration. Article 1er : libres et égaux en droits. Article 4 : ne pas nuire à autrui. 1948 : Déclaration universelle.":
    "26 sierpnia 1789: Deklaracja. Artykuł 1: wolni i równi w prawach. Artykuł 4: nie szkodzić drugiemu. 1948: Powszechna deklaracja.",
  "Droits fondamentaux · dignité · sûreté · volonté générale · bloc de constitutionnalité.":
    "Prawa podstawowe · godność · nietykalność osobista · wola powszechna · blok konstytucyjny.",
  "En une phrase : un texte écrit pour renverser une monarchie sert encore, deux siècles plus tard, à annuler une loi.":
    "W jednym zdaniu: tekst napisany po to, by obalić monarchię, dwa wieki później wciąż służy do uchylania ustaw.",

  // ── The rights of the citizen ───────────────────────────────────────────
  "Les droits du citoyen": "Prawa obywatela",
  "Pourquoi cette leçon : être citoyen n'est pas un statut décoratif. Il ouvre des droits précis, et les questions demandent lesquels.":
    "Po co ta lekcja: bycie obywatelem to nie ozdobny status. Otwiera konkretne prawa, a pytania dotyczą tego, które.",
  "Être citoyen": "Być obywatelem",
  "Être **citoyen d'un État**, c'est en avoir la nationalité et, avec elle, des **droits politiques** : voter, être élu, accéder aux emplois publics. C'est aussi être soumis à ses lois et à ses devoirs.":
    "Być **obywatelem państwa** znaczy mieć jego obywatelstwo, a wraz z nim **prawa polityczne**: głosować, być wybieranym, mieć dostęp do stanowisk publicznych. To także podleganie jego prawu i obowiązkom.",
  "Droit de vote": "Prawo wyborcze",
  "Choisir ses représentants à partir de 18 ans, une fois inscrit sur les listes électorales.":
    "Wybierać swoich przedstawicieli od 18. roku życia, po wpisaniu do rejestru wyborców.",
  "Droit d'être élu": "Prawo do bycia wybieranym",
  "Se présenter à une élection, du conseil municipal à la présidence de la République.":
    "Kandydować w wyborach, od rady gminy po urząd prezydenta Republiki.",
  "Droit à la sûreté": "Prawo do nietykalności osobistej",
  "Ne pas être arrêté ni détenu arbitrairement. Toute privation de liberté est encadrée par la loi et contrôlée par un juge.":
    "Nie być zatrzymanym ani pozbawionym wolności w sposób arbitralny. Każde pozbawienie wolności jest ujęte w ramy prawa i kontrolowane przez sędziego.",
  "Droit à la justice": "Prawo do sądu",
  "Être jugé par un tribunal indépendant, être assisté d'un avocat, faire appel d'une décision.":
    "Być sądzonym przez niezawisły sąd, korzystać z pomocy adwokata, odwołać się od orzeczenia.",
  "La sûreté": "Nietykalność osobista",
  "Le **droit à la sûreté** protège contre l'arrestation arbitraire. On ne peut être arrêté que dans les cas prévus par la loi et selon les formes qu'elle prescrit. C'est ce droit qui distingue un État de droit d'un régime arbitraire.":
    "**Prawo do nietykalności osobistej** chroni przed arbitralnym zatrzymaniem. Zatrzymać można wyłącznie w przypadkach przewidzianych przez ustawę i w formach przez nią określonych. To właśnie to prawo odróżnia państwo prawa od reżimu samowoli.",
  "La dignité": "Godność",
  "La **dignité humaine** ne se négocie pas. Y porter atteinte — traitements dégradants, esclavage moderne, logement indigne, humiliation raciste — est une infraction, quelle que soit la situation administrative de la victime.":
    "**Godność człowieka** nie podlega negocjacji. Naruszenie jej — poniżające traktowanie, współczesne niewolnictwo, mieszkanie urągające godności, rasistowskie upokorzenie — jest przestępstwem, bez względu na status administracyjny ofiary.",
  "La citoyenneté numérique": "Obywatelskość cyfrowa",
  "La **citoyenneté numérique**, c'est appliquer en ligne les mêmes droits et les mêmes devoirs qu'ailleurs : s'informer, s'exprimer, participer — sans harceler, insulter ni diffuser de fausses informations. La **majorité numérique** est fixée à **15 ans** : en dessous, l'inscription sur un réseau social requiert l'accord des parents.":
    "**Obywatelskość cyfrowa** to stosowanie w sieci tych samych praw i obowiązków co wszędzie indziej: informować się, wypowiadać, uczestniczyć — bez nękania, obrażania i rozpowszechniania fałszywych informacji. **Pełnoletność cyfrowa** przypada na **15 lat**: poniżej tego wieku założenie konta w serwisie społecznościowym wymaga zgody rodziców.",
  "Défenseur des droits · avocat · aide juridictionnelle.":
    "Défenseur des droits · adwokat · pomoc prawna z urzędu.",
  "18 ans : majorité civile et droit de vote. 15 ans : majorité numérique.":
    "18 lat: pełnoletność cywilna i prawo wyborcze. 15 lat: pełnoletność cyfrowa.",
  "Citoyenneté · sûreté · dignité · arrestation arbitraire · citoyenneté numérique.":
    "Obywatelstwo · nietykalność osobista · godność · arbitralne zatrzymanie · obywatelskość cyfrowa.",
  "En une phrase : les droits fondamentaux valent pour toute personne, les droits politiques pour les citoyens.":
    "W jednym zdaniu: prawa podstawowe przysługują każdemu człowiekowi, prawa polityczne — obywatelom.",

  // ── The duties of the citizen ───────────────────────────────────────────
  "Les devoirs du citoyen": "Obowiązki obywatela",
  "Pourquoi cette leçon : les devoirs sont la moitié la plus vite oubliée du thème, et pourtant plusieurs d'entre eux sont pénalement sanctionnés.":
    "Po co ta lekcja: obowiązki to ta połowa tematu, o której zapomina się najszybciej, a przecież kilka z nich jest zagrożonych karą.",
  "Respecter la loi": "Przestrzegać prawa",
  "Le premier devoir est de **respecter la loi**, la Constitution et les valeurs de la République. Nul n'est censé ignorer la loi, et on ne peut pas s'en dispenser au motif qu'on la juge injuste.":
    "Pierwszym obowiązkiem jest **przestrzeganie prawa**, Konstytucji i wartości Republiki. Nieznajomość prawa nie usprawiedliwia i nie można się z niego zwolnić, uznając je za niesprawiedliwe.",
  "Payer l'impôt": "Płacić podatki",
  "**Déclarer ses revenus** et **payer ses impôts** est un devoir. La contribution commune est répartie entre les citoyens en raison de leurs facultés — l'article 13 de la Déclaration de 1789 le disait déjà.":
    "**Zgłaszanie dochodów** i **płacenie podatków** jest obowiązkiem. Wspólne obciążenie rozkłada się między obywateli stosownie do ich możliwości — mówił o tym już artykuł 13 Deklaracji z 1789 roku.",
  "Porter secours": "Udzielać pomocy",
  "Il est **obligatoire de porter secours** à une personne en danger : appeler les secours, ou intervenir si l'on peut le faire sans risque pour soi. Ne rien faire est le délit de **non-assistance à personne en danger**.":
    "**Udzielenie pomocy** osobie w niebezpieczeństwie jest **obowiązkowe**: wezwać służby ratunkowe albo interweniować, jeśli można to zrobić bez narażania siebie. Bierność to przestępstwo **nieudzielenia pomocy osobie w niebezpieczeństwie**.",
  "Être **juré d'assises** est un devoir civique, pas une proposition. Le citoyen tiré au sort doit se présenter ; ne pas répondre sans motif légitime est puni d'une amende.":
    "Bycie **ławnikiem w cour d'assises** to obowiązek obywatelski, nie propozycja. Wylosowany obywatel musi się stawić; niestawienie się bez uzasadnionej przyczyny jest karane grzywną.",
  "Le devoir de solidarité et le devoir de mémoire": "Obowiązek solidarności i obowiązek pamięci",
  "Devoir de solidarité": "Obowiązek solidarności",
  "Contribuer à la vie collective : impôts, cotisations sociales, secours à autrui, service à la communauté.":
    "Współtworzyć życie zbiorowe: podatki, składki społeczne, pomoc innym, służba na rzecz wspólnoty.",
  "Devoir de mémoire": "Obowiązek pamięci",
  "Se souvenir des événements douloureux de l'histoire — Shoah, esclavage, guerres — pour qu'ils ne se répètent pas.":
    "Pamiętać o bolesnych wydarzeniach historii — Zagładzie, niewolnictwie, wojnach — aby się nie powtórzyły.",
  "Devoir de vote ?": "Obowiązek głosowania?",
  "Non : voter est un droit. Mais s'inscrire sur les listes électorales est une obligation.":
    "Nie: głosowanie jest prawem. Ale wpis do rejestru wyborców jest obowiązkiem.",
  "Devoir de défense": "Obowiązek obronny",
  "Le recensement à 16 ans et la Journée défense et citoyenneté sont obligatoires pour les jeunes Français.":
    "Rejestracja w wieku 16 lat i Journée défense et citoyenneté są obowiązkowe dla młodych Francuzów.",
  "Non-assistance à personne en danger · juré d'assises · Journée défense et citoyenneté.":
    "Nieudzielenie pomocy osobie w niebezpieczeństwie · ławnik w cour d'assises · Journée défense et citoyenneté.",
  "16 ans : recensement. 18 ans : majorité civile. Déclaration de revenus : chaque année.":
    "16 lat: rejestracja. 18 lat: pełnoletność cywilna. Deklaracja dochodów: co roku.",
  "Devoir · solidarité · mémoire · non-assistance · civisme.":
    "Obowiązek · solidarność · pamięć · nieudzielenie pomocy · postawa obywatelska.",
  "En une phrase : la République donne des droits à chacun et demande en retour trois choses concrètes — respecter la loi, payer sa part, secourir qui est en danger.":
    "W jednym zdaniu: Republika daje każdemu prawa i żąda w zamian trzech konkretnych rzeczy — przestrzegać prawa, płacić swoją część, ratować tego, kto jest w niebezpieczeństwie.",

  // ── The law in everyday life ────────────────────────────────────────────
  "La loi au quotidien": "Prawo na co dzień",
  "Pourquoi cette leçon : ce sont les questions les plus concrètes de l'examen — un âge, une interdiction, une amende. Elles se retiennent comme une liste.":
    "Po co ta lekcja: to najbardziej konkretne pytania egzaminu — wiek, zakaz, grzywna. Zapamiętuje się je jak listę.",
  "Les âges": "Granice wieku",
  "18 ans": "18 lat",
  "La majorité civile. On devient responsable de ses actes, on peut voter, signer un contrat, se marier sans autorisation.":
    "Pełnoletność cywilna. Odpowiada się za swoje czyny, można głosować, podpisać umowę, zawrzeć małżeństwo bez zezwolenia.",
  "15 ans": "15 lat",
  "La majorité numérique : en dessous, un réseau social demande l'accord des parents.":
    "Pełnoletność cyfrowa: poniżej tego wieku serwis społecznościowy wymaga zgody rodziców.",
  "16 ans": "16 lat",
  "Fin de l'instruction obligatoire, et recensement pour la Journée défense et citoyenneté.":
    "Koniec obowiązku nauki i rejestracja na Journée défense et citoyenneté.",
  "3 ans": "3 lata",
  "Début de l'instruction obligatoire, depuis la rentrée 2019.":
    "Początek obowiązku nauki, od roku szkolnego 2019.",
  "Interdictions à connaître": "Zakazy, które trzeba znać",
  "La **vente d'alcool** est interdite aux personnes de **moins de 18 ans**, comme celle du tabac. **Fumer est interdit** dans tous les lieux fermés accueillant du public — bureaux, restaurants, gares, transports — et dans les écoles ; en terrasse ouverte, c'est autorisé.":
    "**Sprzedaż alkoholu** osobom **poniżej 18. roku życia** jest zakazana, podobnie jak sprzedaż tytoniu. **Palenie jest zabronione** we wszystkich zamkniętych miejscach dostępnych publicznie — biurach, restauracjach, dworcach, środkach transportu — oraz w szkołach; na otwartym tarasie jest dozwolone.",
  "La **polygamie** est interdite : on ne peut pas être marié à plusieurs personnes en même temps. Un mariage contracté alors qu'on est déjà marié est nul, et la bigamie est un délit.":
    "**Poligamia** jest zakazana: nie można pozostawać w małżeństwie z kilkoma osobami jednocześnie. Małżeństwo zawarte przez osobę już pozostającą w związku małżeńskim jest nieważne, a bigamia jest przestępstwem.",
  "Sur la route": "Na drodze",
  "Le **non-respect du code de la route** est une infraction, sanctionnée par une amende et un retrait de points, et par des peines plus lourdes dans les cas graves. **Conduire une moto sans permis** est un **délit**, pas une simple contravention.":
    "**Nieprzestrzeganie kodeksu drogowego** jest czynem zabronionym, karanym grzywną i odjęciem punktów, a w poważnych przypadkach karami surowszymi. **Prowadzenie motocykla bez prawa jazdy** to **występek**, a nie zwykłe wykroczenie.",
  "Les papiers": "Dokumenty",
  "Pour obtenir une **carte d'identité**, il faut en faire la demande **en mairie** avec un justificatif d'identité, un justificatif de domicile et une photo. La carte est **gratuite** lors d'une première demande.":
    "Aby otrzymać **dowód osobisty**, należy złożyć wniosek **w merostwie** wraz z dokumentem tożsamości, potwierdzeniem zamieszkania i zdjęciem. Przy pierwszym wniosku dowód jest **bezpłatny**.",
  "Le stationnement réservé": "Miejsce parkingowe zastrzeżone",
  "Se garer sur une place réservée aux **personnes handicapées** sans y avoir droit est une infraction lourdement sanctionnée. La place n'est pas une commodité : elle est la condition pour que quelqu'un puisse sortir de sa voiture.":
    "Parkowanie bez uprawnienia na miejscu zastrzeżonym dla **osób z niepełnosprawnością** jest czynem zabronionym, surowo karanym. To miejsce nie jest udogodnieniem: jest warunkiem tego, by ktoś mógł w ogóle wysiąść z samochodu.",
  "Code de la route · carte nationale d'identité · mairie.":
    "Kodeks drogowy · krajowy dowód osobisty · merostwo.",
  "18 ans : majorité, alcool, tabac. 15 ans : réseaux sociaux. 3 à 16 ans : instruction obligatoire.":
    "18 lat: pełnoletność, alkohol, tytoń. 15 lat: media społecznościowe. Od 3 do 16 lat: obowiązek nauki.",
  "Contravention · délit · crime · amende · polygamie · lieu fermé accueillant du public.":
    "Wykroczenie · występek · zbrodnia · grzywna · poligamia · zamknięte miejsce dostępne publicznie.",
  "En une phrase : la plupart de ces règles protègent quelqu'un d'autre que celui à qui elles s'imposent.":
    "W jednym zdaniu: większość tych reguł chroni kogoś innego niż tego, komu je narzucono.",

  // ── The situational questions ───────────────────────────────────────────
  "Les mises en situation": "Pytania sytuacyjne",
  "Pourquoi cette leçon : douze des quarante questions de l'examen ne demandent aucune date. Elles décrivent une scène et demandent quelle attitude est la bonne. Elles se préparent, mais autrement.":
    "Po co ta lekcja: dwanaście z czterdziestu pytań egzaminu nie wymaga żadnej daty. Opisują sytuację i pytają, która postawa jest właściwa. Do nich też się przygotowujemy, tylko inaczej.",
  "Ce qu'est une mise en situation": "Czym jest pytanie sytuacyjne",
  "Une **mise en situation** raconte un cas concret : un collègue au travail, une règle à l'école, un voisin, une démarche administrative. Quatre réactions sont proposées ; une seule est conforme au droit et aux valeurs de la République.":
    "**Pytanie sytuacyjne** opisuje konkretny przypadek: kolegę w pracy, regulamin szkolny, sąsiada, sprawę urzędową. Podane są cztery reakcje; tylko jedna jest zgodna z prawem i wartościami Republiki.",
  "La règle qui les résout presque toutes": "Reguła, która rozwiązuje niemal wszystkie",
  "La bonne réponse est celle qui fait passer **le droit commun, l'égalité entre les personnes et le respect mutuel** avant la préférence personnelle, la coutume ou l'arrangement privé. Quand deux réponses semblent raisonnables, choisir celle qui **s'adresse à l'institution compétente** plutôt que celle qui règle l'affaire soi-même.":
    "Właściwa odpowiedź to ta, która stawia **prawo powszechne, równość między ludźmi i wzajemny szacunek** ponad osobistą preferencją, zwyczajem czy prywatną ugodą. Gdy dwie odpowiedzi wydają się rozsądne, wybierz tę, która **zwraca się do właściwej instytucji**, a nie tę, która załatwia sprawę na własną rękę.",
  "Laïcité": "Laïcité",
  "L'agent public reste neutre ; l'usager reste libre. Une administration ne refuse pas un service au motif d'une croyance.":
    "Funkcjonariusz publiczny pozostaje neutralny; interesant pozostaje wolny. Urząd nie odmawia usługi z powodu czyjegoś wyznania.",
  "Aucune différence de traitement selon le sexe, l'origine, la religion ou le handicap. Une femme peut créer une entreprise, diriger, se syndiquer, exactement comme un homme.":
    "Żadnej różnicy w traktowaniu ze względu na płeć, pochodzenie, religię czy niepełnosprawność. Kobieta może założyć firmę, kierować nią, należeć do związku zawodowego — dokładnie tak samo jak mężczyzna.",
  "On peut être en désaccord et le dire. On ne peut ni insulter, ni menacer, ni inciter à la haine.":
    "Można się nie zgadzać i to powiedzieć. Nie można obrażać, grozić ani nawoływać do nienawiści.",
  "Vivre ensemble": "Współżycie sąsiedzkie",
  "Le bruit, les parties communes, le tri des déchets : on en parle d'abord, on saisit ensuite le syndic, le bailleur ou la mairie.":
    "Hałas, części wspólne, segregacja odpadów: najpierw się o tym rozmawia, potem zwraca się do zarządcy budynku, właściciela lub merostwa.",
  "Trois exemples et leur raisonnement": "Trzy przykłady i tok rozumowania",
  "**Un employeur demande à une candidate si elle compte avoir des enfants.** La question est illégale : lors d'un entretien d'embauche, on ne peut interroger le candidat que sur ce qui sert à évaluer sa capacité à occuper le poste.":
    "**Pracodawca pyta kandydatkę, czy zamierza mieć dzieci.** Pytanie jest niezgodne z prawem: podczas rozmowy kwalifikacyjnej wolno pytać kandydata wyłącznie o to, co służy ocenie jego zdolności do wykonywania pracy na danym stanowisku.",
  "**Un voisin met la musique très fort à minuit.** On lui en parle d'abord ; si cela continue, on prévient le syndic ou le bailleur, puis la mairie ou la police. On ne se fait pas justice soi-même.":
    "**Sąsiad puszcza bardzo głośną muzykę o północy.** Najpierw się z nim rozmawia; jeśli to trwa, powiadamia się zarządcę budynku lub właściciela, następnie merostwo albo policję. Nie wymierza się sprawiedliwości samemu.",
  "**Un enfant refuse un cours parce qu'il heurte ses convictions.** L'instruction est obligatoire et les programmes s'appliquent à tous. Les seuls motifs d'absence acceptés par l'école sont la maladie, une réunion familiale solennelle, un empêchement de transport ou une absence des personnes responsables.":
    "**Dziecko odmawia udziału w lekcji, bo jest ona sprzeczna z jego przekonaniami.** Nauka jest obowiązkowa, a programy obowiązują wszystkich. Jedyne przyczyny nieobecności uznawane przez szkołę to choroba, uroczystość rodzinna, przeszkoda w dojeździe lub nieobecność opiekunów.",
  "Défenseur des droits · inspection du travail · conseil de prud'hommes · syndic.":
    "Défenseur des droits · inspekcja pracy · conseil de prud'hommes · zarządca budynku.",
  "40 questions au total : 28 de connaissance, 12 de mise en situation.":
    "Łącznie 40 pytań: 28 z wiedzy, 12 sytuacyjnych.",
  "Discrimination · neutralité · droit commun · institution compétente · vivre-ensemble.":
    "Dyskryminacja · neutralność · prawo powszechne · właściwa instytucja · współżycie społeczne.",
  "En une phrase : la bonne réponse est presque toujours la plus égalitaire et la moins expéditive.":
    "W jednym zdaniu: właściwa odpowiedź jest niemal zawsze tą najbardziej egalitarną i najmniej pochopną.",

  // ── From monarchy to Republic ───────────────────────────────────────────
  "De la monarchie à la République": "Od monarchii do Republiki",
  "Histoire, géographie et culture": "Historia, geografia i kultura",
  "Pourquoi cette leçon : presque tous les symboles, la devise et la Déclaration viennent de dix années entre 1789 et 1799. Les dates de cette période reviennent sans arrêt.":
    "Po co ta lekcja: niemal wszystkie symbole, dewiza i Deklaracja pochodzą z dziesięciu lat między 1789 a 1799 rokiem. Daty z tego okresu wracają bez przerwy.",
  "Avant 1789": "Przed 1789 rokiem",
  "La France était une **monarchie absolue**. Les rois étaient sacrés à **Reims**, dans la cathédrale, et **Louis XIV** — le Roi-Soleil — avait fait de **Versailles** le centre du pouvoir royal. La société était divisée en trois ordres : clergé, noblesse et tiers état.":
    "Francja była **monarchią absolutną**. Królów koronowano w katedrze w **Reims**, a **Ludwik XIV** — Król Słońce — uczynił z **Wersalu** ośrodek władzy królewskiej. Społeczeństwo dzieliło się na trzy stany: duchowieństwo, szlachtę i stan trzeci.",
  "1789": "1789",
  "La **Révolution française** commence en **1789**. Le **14 juillet**, le peuple prend la **Bastille**, prison royale devenue symbole de l'arbitraire. Le **26 août**, l'Assemblée adopte la **Déclaration des droits de l'homme et du citoyen**. En 1790, la **Fête de la Fédération** célèbre l'unité du pays : la fête nationale commémore les deux.":
    "**Rewolucja francuska** zaczyna się w **1789 roku**. **14 lipca** lud zdobywa **Bastylię**, królewskie więzienie, które stało się symbolem samowoli. **26 sierpnia** Zgromadzenie przyjmuje **Deklarację praw człowieka i obywatela**. W 1790 roku **Święto Federacji** czci jedność kraju: święto narodowe upamiętnia oba wydarzenia.",
  "**Louis XVI** est jugé, condamné et **guillotiné en 1793**. C'est le seul roi de France exécuté pendant la Révolution — la question porte sur lui.":
    "**Ludwik XVI** zostaje osądzony, skazany i **ścięty na gilotynie w 1793 roku**. To jedyny król Francji stracony w czasie rewolucji — pytanie dotyczy właśnie jego.",
  "Napoléon": "Napoleon",
  "**Napoléon Bonaparte** devient **empereur en 1804**. La même année, il fait adopter le **Code civil**, aussi appelé Code Napoléon : il unifie le droit privé et sert encore de base au droit français d'aujourd'hui.":
    "**Napoleon Bonaparte** zostaje **cesarzem w 1804 roku**. W tym samym roku doprowadza do uchwalenia **Kodeksu cywilnego**, zwanego też Kodeksem Napoleona: ujednolica on prawo prywatne i do dziś stanowi podstawę prawa francuskiego.",
  "Début de la Révolution. Prise de la Bastille le 14 juillet, Déclaration des droits le 26 août.":
    "Początek rewolucji. Zdobycie Bastylii 14 lipca, Deklaracja praw 26 sierpnia.",
  "1792": "1792",
  "Proclamation de la Première République. La Marseillaise est écrite la même année.":
    "Proklamacja Pierwszej Republiki. W tym samym roku powstaje Marsylianka.",
  "1793": "1793",
  "Louis XVI est guillotiné.": "Ludwik XVI zostaje ścięty na gilotynie.",
  "1804": "1804",
  "Napoléon Ier devient empereur et promulgue le Code civil.":
    "Napoleon I zostaje cesarzem i promulguje Kodeks cywilny.",
  "Louis XIV · Louis XVI · Napoléon Ier · Reims · Versailles · la Bastille.":
    "Ludwik XIV · Ludwik XVI · Napoleon I · Reims · Wersal · Bastylia.",
  "1789 Révolution · 1792 Première République · 1793 Louis XVI guillotiné · 1804 Empire et Code civil.":
    "1789 rewolucja · 1792 Pierwsza Republika · 1793 ścięcie Ludwika XVI · 1804 cesarstwo i Kodeks cywilny.",
  "Monarchie absolue · tiers état · Bastille · Code civil · sacre.":
    "Monarchia absolutna · stan trzeci · Bastylia · Kodeks cywilny · koronacja.",
  "En une phrase : en quinze ans, la France passe d'un roi de droit divin à un code de lois qui vaut pour tous.":
    "W jednym zdaniu: w piętnaście lat Francja przechodzi od króla z Bożej łaski do kodeksu praw obowiązującego wszystkich.",

  // ── The Republics and the two wars ──────────────────────────────────────
  "Les Républiques et les deux guerres": "Republiki i dwie wojny",
  "Pourquoi cette leçon : les deux guerres mondiales fournissent trois jours fériés et plusieurs questions. Les dates et ce qu'elles commémorent sont à distinguer soigneusement.":
    "Po co ta lekcja: dwie wojny światowe dają trzy dni wolne i kilka pytań. Daty i to, co upamiętniają, trzeba starannie rozróżniać.",
  "Les guerres": "Wojny",
  "Première Guerre mondiale": "Pierwsza wojna światowa",
  "1914-1918. L'armistice est signé le 11 novembre 1918 : c'est ce que commémore le 11 novembre, jour férié.":
    "1914-1918. Rozejm podpisano 11 listopada 1918 roku: właśnie to upamiętnia 11 listopada, dzień wolny od pracy.",
  "Seconde Guerre mondiale": "Druga wojna światowa",
  "1939-1945. Le 8 mai commémore la victoire des Alliés et la fin de la guerre en Europe en 1945.":
    "1939-1945. 8 maja upamiętnia zwycięstwo aliantów i koniec wojny w Europie w 1945 roku.",
  "L'appel du 18 juin": "Apel z 18 czerwca",
  "En 1940, depuis Londres, le général de Gaulle appelle à continuer le combat. C'est l'acte fondateur de la France libre.":
    "W 1940 roku generał de Gaulle wzywa z Londynu do dalszej walki. To akt założycielski Wolnej Francji.",
  "Le débarquement": "Lądowanie",
  "Le 6 juin 1944, en Normandie. Paris est libéré le 25 août 1944.":
    "6 czerwca 1944 roku, w Normandii. Paryż zostaje wyzwolony 25 sierpnia 1944 roku.",
  "Les Républiques": "Republiki",
  "La **Première République** est proclamée en 1792. La **Troisième** dure de 1870 à 1940 et donne à la France l'école gratuite et laïque et la loi de 1905. La **Quatrième** naît en 1946. La **Cinquième**, née de la Constitution du 4 octobre 1958, est celle d'aujourd'hui.":
    "**Pierwszą Republikę** proklamowano w 1792 roku. **Trzecia** trwa od 1870 do 1940 roku i daje Francji bezpłatną i świecką szkołę oraz ustawę z 1905 roku. **Czwarta** powstaje w 1946 roku. **Piąta**, zrodzona z Konstytucji z 4 października 1958 roku, jest tą dzisiejszą.",
  "Après 1945": "Po 1945 roku",
  "L'**Organisation des Nations unies (ONU)** est créée en **1945**. En France, les femmes obtiennent le **droit de vote en 1944** et votent pour la première fois en 1945. Depuis **1962**, le président de la République est élu au **suffrage universel direct** ; la première élection de ce type a lieu en 1965.":
    "**Organizacja Narodów Zjednoczonych (ONZ)** powstaje w **1945 roku**. We Francji kobiety uzyskują **prawo wyborcze w 1944 roku** i głosują po raz pierwszy w 1945. Od **1962 roku** prezydent Republiki jest wybierany w **wyborach powszechnych bezpośrednich**; pierwsze takie wybory odbywają się w 1965 roku.",
  "La **peine de mort** est abolie en **1981**, sous la présidence de **François Mitterrand**, sur proposition du garde des Sceaux Robert Badinter.":
    "**Karę śmierci** zniesiono w **1981 roku**, za prezydentury **François'a Mitterranda**, na wniosek ministra sprawiedliwości Roberta Badintera.",
  "Les présidents de la Ve République": "Prezydenci V Republiki",
  "Charles de Gaulle, Georges Pompidou, Valéry Giscard d'Estaing, François Mitterrand, Jacques Chirac, Nicolas Sarkozy, François Hollande, Emmanuel Macron. Le premier est aussi le fondateur du régime.":
    "Charles de Gaulle, Georges Pompidou, Valéry Giscard d'Estaing, François Mitterrand, Jacques Chirac, Nicolas Sarkozy, François Hollande, Emmanuel Macron. Pierwszy jest zarazem twórcą ustroju.",
  "Charles de Gaulle · François Mitterrand · Robert Badinter · ONU.":
    "Charles de Gaulle · François Mitterrand · Robert Badinter · ONZ.",
  "1914-1918 et 1939-1945 · 11 novembre et 8 mai · 18 juin 1940 · 6 juin et 25 août 1944 · 1944 vote des femmes · 1945 ONU · 1958 Ve République · 1962 suffrage universel direct · 1981 abolition de la peine de mort.":
    "1914-1918 i 1939-1945 · 11 listopada i 8 maja · 18 czerwca 1940 · 6 czerwca i 25 sierpnia 1944 · 1944 prawo wyborcze kobiet · 1945 ONZ · 1958 V Republika · 1962 wybory powszechne bezpośrednie · 1981 zniesienie kary śmierci.",
  "Armistice · Libération · France libre · République · abolition.":
    "Rozejm · wyzwolenie · Wolna Francja · Republika · zniesienie.",
  "En une phrase : le 11 novembre est un armistice, le 8 mai une victoire, le 14 juillet une révolution — trois jours fériés, trois choses différentes.":
    "W jednym zdaniu: 11 listopada to rozejm, 8 maja zwycięstwo, 14 lipca rewolucja — trzy dni wolne, trzy różne rzeczy.",

  // ── Memory: Shoah, Resistance, slavery ──────────────────────────────────
  "Mémoire : Shoah, Résistance, esclavage": "Pamięć: Zagłada, ruch oporu, niewolnictwo",
  "Pourquoi cette leçon : le devoir de mémoire est une valeur de la République autant qu'un chapitre d'histoire. Ces questions demandent de nommer les faits exactement.":
    "Po co ta lekcja: obowiązek pamięci jest wartością Republiki w takim samym stopniu jak rozdziałem historii. Te pytania wymagają nazwania faktów dokładnie.",
  "La Shoah": "Zagłada",
  "La **Shoah** est le **génocide des Juifs d'Europe** perpétré par l'Allemagne nazie pendant la Seconde Guerre mondiale : environ six millions de personnes assassinées. En France, l'État de Vichy a participé aux arrestations et aux déportations — un fait reconnu officiellement par la République en 1995.":
    "**Zagłada (Shoah)** to **ludobójstwo Żydów europejskich** dokonane przez nazistowskie Niemcy w czasie drugiej wojny światowej: około sześciu milionów zamordowanych. We Francji państwo Vichy uczestniczyło w aresztowaniach i deportacjach — fakt uznany oficjalnie przez Republikę w 1995 roku.",
  "**Nier la Shoah** est un délit en France, et non une opinion. C'est l'une des limites explicites de la liberté d'expression.":
    "**Negowanie Zagłady** jest we Francji przestępstwem, a nie poglądem. To jedna z wyraźnych granic wolności wypowiedzi.",
  "La Résistance": "Ruch oporu",
  "La **Résistance** rassemble ceux qui combattent l'occupation et le régime de Vichy. **Jean Moulin** en est la figure la plus connue : envoyé par de Gaulle, il unifie les mouvements de résistance en 1943 avant d'être arrêté et torturé à mort. Il repose au **Panthéon**.":
    "**Résistance** skupia tych, którzy walczą z okupacją i reżimem Vichy. **Jean Moulin** jest jej najbardziej znaną postacią: wysłany przez de Gaulle'a, jednoczy organizacje ruchu oporu w 1943 roku, po czym zostaje aresztowany i zamęczony na śmierć. Spoczywa w **Panteonie**.",
  "L'esclavage": "Niewolnictwo",
  "L'esclavage a été **aboli définitivement en 1848**, sur l'initiative de **Victor Schœlcher**. Une première abolition, en 1794, avait été annulée par Napoléon en 1802. **Nantes** fut le principal port français de la traite négrière au XVIIIe siècle. Parmi les philosophes des Lumières, **Montesquieu** a dénoncé l'esclavage dans *De l'esprit des lois*.":
    "Niewolnictwo zostało **zniesione ostatecznie w 1848 roku**, z inicjatywy **Victora Schœlchera**. Pierwsze zniesienie, z 1794 roku, Napoleon unieważnił w 1802. **Nantes** był w XVIII wieku głównym francuskim portem handlu niewolnikami. Spośród filozofów oświecenia **Monteskiusz** napiętnował niewolnictwo w dziele *O duchu praw*.",
  "La colonisation": "Kolonizacja",
  "La France a possédé un vaste empire colonial : l'**Algérie**, le Maroc, la Tunisie, une grande partie de l'Afrique de l'Ouest, l'Indochine, Madagascar. La décolonisation s'achève pour l'essentiel entre 1954 et 1962 ; l'Algérie devient indépendante en **1962**.":
    "Francja posiadała rozległe imperium kolonialne: **Algierię**, Maroko, Tunezję, znaczną część Afryki Zachodniej, Indochiny, Madagaskar. Dekolonizacja kończy się w zasadzie między 1954 a 1962 rokiem; Algieria uzyskuje niepodległość w **1962 roku**.",
  "Shoah": "Shoah",
  "Génocide des Juifs d'Europe, 1941-1945. Le nier est un délit.":
    "Ludobójstwo Żydów europejskich, 1941-1945. Negowanie go jest przestępstwem.",
  "Jean Moulin": "Jean Moulin",
  "Unificateur de la Résistance, mort en 1943. Au Panthéon depuis 1964.":
    "Zjednoczyciel ruchu oporu, zginął w 1943 roku. W Panteonie od 1964 roku.",
  "Victor Schœlcher": "Victor Schœlcher",
  "Artisan de l'abolition définitive de l'esclavage en 1848.":
    "Sprawca ostatecznego zniesienia niewolnictwa w 1848 roku.",
  "Le 10 mai": "10 maja",
  "Journée nationale de commémoration de l'abolition de l'esclavage en métropole.":
    "Ogólnokrajowy dzień upamiętnienia zniesienia niewolnictwa w metropolii.",
  "Shoah · Jean Moulin · Victor Schœlcher · Montesquieu · Nantes · Panthéon.":
    "Shoah · Jean Moulin · Victor Schœlcher · Monteskiusz · Nantes · Panteon.",
  "1848 abolition définitive de l'esclavage · 1943 unification de la Résistance · 1962 indépendance de l'Algérie · 10 mai journée de commémoration.":
    "1848 ostateczne zniesienie niewolnictwa · 1943 zjednoczenie ruchu oporu · 1962 niepodległość Algierii · 10 maja dzień pamięci.",
  "Génocide · déportation · Résistance · traite négrière · colonisation · devoir de mémoire.":
    "Ludobójstwo · deportacja · ruch oporu · handel niewolnikami · kolonizacja · obowiązek pamięci.",
  "En une phrase : la République nomme ce qu'elle a fait de pire, parce que taire un crime est la première étape pour le refaire.":
    "W jednym zdaniu: Republika nazywa to, co zrobiła najgorszego, bo przemilczenie zbrodni jest pierwszym krokiem do jej powtórzenia.",

  // ── The geography of France ─────────────────────────────────────────────
  "La géographie de la France": "Geografia Francji",
  "Pourquoi cette leçon : montagnes, fleuves, mers et chefs-lieux sont des faits simples, et une série de questions porte dessus chaque fois.":
    "Po co ta lekcja: góry, rzeki, morza i stolice regionów to fakty proste, a seria pytań dotyczy ich za każdym razem.",
  "Les chiffres": "Liczby",
  "Au **1er janvier 2025**, la France compte environ **68,6 millions d'habitants** : 66,4 millions en métropole et 2,3 millions dans les cinq départements d'outre-mer. Il y a **101 départements** et **13 régions en métropole**.":
    "Na **1 stycznia 2025 roku** Francja liczy około **68,6 miliona mieszkańców**: 66,4 miliona w metropolii i 2,3 miliona w pięciu departamentach zamorskich. Jest **101 departamentów** i **13 regionów w metropolii**.",
  "Reliefs et eaux": "Ukształtowanie terenu i wody",
  "Le mont Blanc": "Mont Blanc",
  "Le plus haut sommet de France, dans les Alpes, à environ 4 800 mètres.":
    "Najwyższy szczyt Francji, w Alpach, około 4800 metrów.",
  "Les Alpes": "Alpy",
  "La chaîne de montagnes située entre la France et l'Italie. Les Pyrénées séparent la France de l'Espagne.":
    "Łańcuch górski między Francją a Włochami. Pireneje oddzielają Francję od Hiszpanii.",
  "La Seine": "Sekwana",
  "Le fleuve qui traverse Paris. Les autres grands fleuves : Loire, Rhône, Garonne, Rhin.":
    "Rzeka przepływająca przez Paryż. Pozostałe wielkie rzeki: Loara, Rodan, Garonna, Ren.",
  "Les mers": "Morza",
  "La France métropolitaine est bordée par la Manche, la mer du Nord, l'océan Atlantique et la mer Méditerranée.":
    "Francja metropolitalna graniczy z kanałem La Manche, Morzem Północnym, Oceanem Atlantyckim i Morzem Śródziemnym.",
  "Villes et régions": "Miasta i regiony",
  "Les plus grandes métropoles sont **Paris**, **Lyon**, **Marseille**, **Toulouse**, **Lille**, **Bordeaux** et **Nice**. **Marseille** est le premier **port maritime** de France.":
    "Największe metropolie to **Paryż**, **Lyon**, **Marsylia**, **Tuluza**, **Lille**, **Bordeaux** i **Nicea**. **Marsylia** jest największym **portem morskim** Francji.",
  "Auvergne-Rhône-Alpes": "Auvergne-Rhône-Alpes",
  "Chef-lieu : Lyon. Région réputée pour ses stations de ski.":
    "Stolica regionu: Lyon. Region znany z ośrodków narciarskich.",
  "Bretagne": "Bretania",
  "Chef-lieu : Rennes.": "Stolica regionu: Rennes.",
  "Provence-Alpes-Côte d'Azur": "Prowansja-Alpy-Lazurowe Wybrzeże",
  "Chef-lieu : Marseille.": "Stolica regionu: Marsylia.",
  "Normandie": "Normandia",
  "Chef-lieu : Rouen. Les plages du débarquement de 1944 s'y trouvent.":
    "Stolica regionu: Rouen. Znajdują się tu plaże lądowania z 1944 roku.",
  "Mont Blanc · Alpes · Pyrénées · Seine · Marseille · Lyon · Rennes · Rouen.":
    "Mont Blanc · Alpy · Pireneje · Sekwana · Marsylia · Lyon · Rennes · Rouen.",
  "68,6 millions d'habitants en 2025 · 101 départements · 13 régions métropolitaines · mont Blanc environ 4 800 m.":
    "68,6 miliona mieszkańców w 2025 roku · 101 departamentów · 13 regionów metropolitalnych · Mont Blanc około 4800 m.",
  "Métropole · chef-lieu · fleuve · port maritime · massif.":
    "Metropolia · stolica regionu · rzeka · port morski · masyw górski.",
  "En une phrase : la France tient dans quatre mers, deux grandes chaînes de montagnes et treize régions.":
    "W jednym zdaniu: Francja mieści się w czterech morzach, dwóch wielkich łańcuchach górskich i trzynastu regionach.",

  // ── Overseas France ─────────────────────────────────────────────────────
  "La France d'outre-mer": "Francja zamorska",
  "Pourquoi cette leçon : la France ne s'arrête pas à l'hexagone, et l'examen le vérifie. Les questions demandent quel territoire est où.":
    "Po co ta lekcja: Francja nie kończy się na sześciokącie i egzamin to sprawdza. Pytania dotyczą tego, które terytorium gdzie leży.",
  "Ce qu'est la France d'outre-mer": "Czym jest Francja zamorska",
  "La **France d'outre-mer** rassemble les territoires français situés hors d'Europe. Leurs habitants sont **français et citoyens de l'Union européenne**, votent aux mêmes élections et sont soumis aux mêmes lois, avec des adaptations locales.":
    "**Francja zamorska** obejmuje terytoria francuskie położone poza Europą. Ich mieszkańcy są **Francuzami i obywatelami Unii Europejskiej**, głosują w tych samych wyborach i podlegają temu samemu prawu, z lokalnymi dostosowaniami.",
  "Les cinq départements d'outre-mer": "Pięć departamentów zamorskich",
  "La Guadeloupe": "Gwadelupa",
  "Aux Antilles, dans la mer des Caraïbes.": "Na Antylach, na Morzu Karaibskim.",
  "La Martinique": "Martynika",
  "Aux Antilles également.": "Również na Antylach.",
  "La Guyane": "Gujana Francuska",
  "En Amérique du Sud. C'est le seul territoire français à avoir une frontière avec le Brésil.":
    "W Ameryce Południowej. To jedyne terytorium francuskie graniczące z Brazylią.",
  "La Réunion": "Reunion",
  "Dans l'océan Indien, au sud-est du continent africain, près de Madagascar.":
    "Na Oceanie Indyjskim, na południowy wschód od kontynentu afrykańskiego, blisko Madagaskaru.",
  "Mayotte": "Majotta",
  "Dans l'océan Indien aussi. Devenue le 101e département français en 2011.":
    "Również na Oceanie Indyjskim. Stała się sto pierwszym departamentem francuskim w 2011 roku.",
  "Les autres territoires": "Pozostałe terytoria",
  "S'y ajoutent la **Nouvelle-Calédonie**, la **Polynésie française**, **Saint-Pierre-et-Miquelon**, **Wallis-et-Futuna**, **Saint-Martin**, **Saint-Barthélemy** et les Terres australes et antarctiques françaises. La **Corse** n'est pas outre-mer : c'est une île de la Méditerranée qui fait partie de la métropole.":
    "Dochodzą do tego **Nowa Kaledonia**, **Polinezja Francuska**, **Saint-Pierre-et-Miquelon**, **Wallis i Futuna**, **Saint-Martin**, **Saint-Barthélemy** oraz Francuskie Terytoria Południowe i Antarktyczne. **Korsyka** nie jest terytorium zamorskim: to wyspa na Morzu Śródziemnym należąca do metropolii.",
  "La fusée **Ariane** décolle de **Kourou**, en **Guyane**. La proximité de l'équateur donne un avantage physique au lancement — c'est pourquoi le port spatial européen s'y trouve.":
    "Rakieta **Ariane** startuje z **Kourou** w **Gujanie Francuskiej**. Bliskość równika daje fizyczną przewagę przy starcie — dlatego właśnie tam znajduje się europejski port kosmiczny.",
  "Guadeloupe · Martinique · Guyane · La Réunion · Mayotte · Kourou · Nouvelle-Calédonie.":
    "Gwadelupa · Martynika · Gujana Francuska · Reunion · Majotta · Kourou · Nowa Kaledonia.",
  "5 départements d'outre-mer · 2,3 millions d'habitants · Mayotte 101e département en 2011.":
    "5 departamentów zamorskich · 2,3 miliona mieszkańców · Majotta sto pierwszym departamentem w 2011 roku.",
  "Outre-mer · département d'outre-mer · métropole · Antilles · océan Indien.":
    "Terytoria zamorskie · departament zamorski · metropolia · Antyle · Ocean Indyjski.",
  "En une phrase : la France est présente sur tous les océans, et ses habitants y sont français de plein droit.":
    "W jednym zdaniu: Francja jest obecna na wszystkich oceanach, a jej mieszkańcy są tam Francuzami z pełnią praw.",

  // ── Arts, letters and heritage ──────────────────────────────────────────
  "Arts, lettres et patrimoine": "Sztuka, literatura i dziedzictwo",
  "Pourquoi cette leçon : une longue série de questions se résume à « qui était cette personne ? ». Les classer par métier est le moyen le plus rapide de les retenir.":
    "Po co ta lekcja: długa seria pytań sprowadza się do „kim była ta osoba?”. Uporządkowanie ich według zajęcia to najszybszy sposób na zapamiętanie.",
  "Les écrivains": "Pisarze",
  "Molière": "Molier",
  "Auteur de théâtre du XVIIe siècle, maître de la comédie. On appelle le français « la langue de Molière ».":
    "Dramaturg XVII wieku, mistrz komedii. Francuski nazywa się „językiem Moliera”.",
  "Charles Baudelaire": "Charles Baudelaire",
  "Poète du XIXe siècle, auteur des Fleurs du mal.":
    "Poeta XIX wieku, autor Kwiatów zła.",
  "George Sand": "George Sand",
  "Romancière du XIXe siècle. Une femme, malgré le prénom qu'elle s'était choisi.":
    "Powieściopisarka XIX wieku. Kobieta, mimo imienia, które sobie wybrała.",
  "Albert Camus": "Albert Camus",
  "Écrivain et philosophe du XXe siècle, prix Nobel de littérature.":
    "Pisarz i filozof XX wieku, laureat Nagrody Nobla w dziedzinie literatury.",
  "Simone de Beauvoir": "Simone de Beauvoir",
  "Philosophe et écrivaine, autrice du Deuxième Sexe, figure majeure du féminisme.":
    "Filozofka i pisarka, autorka Drugiej płci, czołowa postać feminizmu.",
  "Marguerite Yourcenar": "Marguerite Yourcenar",
  "Écrivaine, première femme élue à l'Académie française, en 1980.":
    "Pisarka, pierwsza kobieta wybrana do Akademii Francuskiej, w 1980 roku.",
  "Victor Hugo": "Victor Hugo",
  "Poète, romancier et dramaturge. Les Misérables, Notre-Dame de Paris.":
    "Poeta, powieściopisarz i dramaturg. Nędznicy, Katedra Marii Panny w Paryżu.",
  "Les Lumières": "Oświecenie",
  "Voltaire, Rousseau, Diderot, Montesquieu : les penseurs du XVIIIe siècle qui préparent la Révolution.":
    "Wolter, Rousseau, Diderot, Monteskiusz: myśliciele XVIII wieku, którzy przygotowują rewolucję.",
  "Les artistes": "Artyści",
  "Claude Monet": "Claude Monet",
  "Peintre impressionniste, auteur des Nymphéas, visibles au musée de l'Orangerie.":
    "Malarz impresjonista, autor Nenufarów, które można oglądać w muzeum Orangerie.",
  "Auguste Renoir": "Auguste Renoir",
  "Peintre impressionniste également.": "Również malarz impresjonista.",
  "Paul Cézanne": "Paul Cézanne",
  "Peintre, figure de la transition vers l'art moderne.":
    "Malarz, postać przejścia ku sztuce nowoczesnej.",
  "Auguste Rodin": "Auguste Rodin",
  "Sculpteur : Le Penseur, Le Baiser.": "Rzeźbiarz: Myśliciel, Pocałunek.",
  "**Eugène Delacroix** a peint *La Liberté guidant le peuple*, où Marianne brandit le drapeau tricolore. Parmi les compositeurs français : **Claude Debussy**, **Maurice Ravel**, **Hector Berlioz**. **Marie Curie** était une scientifique, deux fois prix Nobel — la seule personne primée dans deux disciplines scientifiques différentes.":
    "**Eugène Delacroix** namalował *Wolność wiodącą lud na barykady*, gdzie Marianne wznosi trójkolorową flagę. Wśród kompozytorów francuskich: **Claude Debussy**, **Maurice Ravel**, **Hector Berlioz**. **Maria Skłodowska-Curie** była uczoną, dwukrotną laureatką Nagrody Nobla — jedyną osobą nagrodzoną w dwóch różnych dziedzinach nauki.",
  "Le patrimoine": "Dziedzictwo",
  "Le Louvre": "Luwr",
  "À Paris. La Joconde de Léonard de Vinci y est exposée.":
    "W Paryżu. Wystawiona jest tam Mona Lisa Leonarda da Vinci.",
  "Le château de Versailles": "Pałac wersalski",
  "Près de Paris. Symbole du pouvoir royal de Louis XIV.":
    "Pod Paryżem. Symbol władzy królewskiej Ludwika XIV.",
  "Le Mont-Saint-Michel": "Mont-Saint-Michel",
  "En Normandie, sur un îlot rocheux dans la baie.":
    "W Normandii, na skalistej wysepce w zatoce.",
  "Lascaux": "Lascaux",
  "En Dordogne. Peintures préhistoriques, vieilles d'environ 17 000 ans.":
    "W Dordogne. Malowidła prehistoryczne sprzed około 17 000 lat.",
  "Les fêtes culturelles": "Święta kultury",
  "La **tour Eiffel** a été construite pour l'**Exposition universelle de 1889**. Les **Journées européennes du patrimoine**, en septembre, permettent de visiter gratuitement des lieux habituellement fermés. Le **1er mai** est la **Fête du Travail**, jour férié et chômé.":
    "**Wieża Eiffla** powstała na **Wystawę Powszechną w 1889 roku**. **Europejskie Dni Dziedzictwa** we wrześniu pozwalają bezpłatnie zwiedzać miejsca zwykle zamknięte. **1 maja** to **Święto Pracy**, dzień ustawowo wolny od pracy.",
  "Molière · Baudelaire · George Sand · Camus · Beauvoir · Yourcenar · Monet · Renoir · Cézanne · Rodin · Delacroix · Marie Curie.":
    "Molier · Baudelaire · George Sand · Camus · Beauvoir · Yourcenar · Monet · Renoir · Cézanne · Rodin · Delacroix · Maria Skłodowska-Curie.",
  "1889 tour Eiffel · 1980 Yourcenar à l'Académie · 1er mai Fête du Travail · Journées du patrimoine en septembre.":
    "1889 wieża Eiffla · 1980 Yourcenar w Akademii · 1 maja Święto Pracy · Dni Dziedzictwa we wrześniu.",
  "Impressionnisme · Lumières · patrimoine · Académie française · musée.":
    "Impresjonizm · oświecenie · dziedzictwo · Akademia Francuska · muzeum.",
  "En une phrase : trois classements suffisent — ceux qui écrivaient, ceux qui peignaient ou sculptaient, et les lieux qu'on visite.":
    "W jednym zdaniu: wystarczą trzy porządki — ci, którzy pisali, ci, którzy malowali lub rzeźbili, i miejsca, które się zwiedza.",

  // ── Civil status, family and housing ────────────────────────────────────
  "État civil, famille et logement": "Stan cywilny, rodzina i mieszkanie",
  "Vivre dans la société française": "Życie we francuskim społeczeństwie",
  "Pourquoi cette leçon : ce sont les démarches que tout le monde fait un jour. Les questions demandent où aller et dans quel délai.":
    "Po co ta lekcja: to sprawy, które każdy kiedyś załatwia. Pytania dotyczą tego, dokąd pójść i w jakim terminie.",
  "L'état civil": "Akta stanu cywilnego",
  "L'**état civil** est tenu par la **mairie**. C'est là qu'on **déclare une naissance**, qu'on se marie, qu'on déclare un décès et qu'on obtient un acte. La naissance doit être déclarée **dans les cinq jours** qui suivent l'accouchement, pour **tout enfant né en France**, quelle que soit la nationalité des parents.":
    "**Akta stanu cywilnego** prowadzi **merostwo**. Tam **zgłasza się narodziny**, zawiera małżeństwo, zgłasza zgon i uzyskuje odpisy. Narodziny należy zgłosić **w ciągu pięciu dni** od porodu, w przypadku **każdego dziecka urodzonego we Francji**, bez względu na obywatelstwo rodziców.",
  "Le mariage": "Małżeństwo",
  "Seul le **mariage civil célébré en mairie** est reconnu légalement. Une cérémonie religieuse peut avoir lieu, mais **après** le mariage civil et sans effet juridique propre. Le mariage entre personnes de même sexe est légal depuis 2013. La **polygamie est interdite**.":
    "Prawnie uznawane jest wyłącznie **małżeństwo cywilne zawarte w merostwie**. Ceremonia religijna może się odbyć, ale **po** ślubie cywilnym i bez własnych skutków prawnych. Małżeństwo osób tej samej płci jest legalne od 2013 roku. **Poligamia jest zakazana**.",
  "Le divorce": "Rozwód",
  "Chacun des deux époux peut le demander, seul ou d'un commun accord. Il n'est pas nécessaire d'obtenir l'accord de l'autre.":
    "Może o niego wystąpić każde z małżonków, samodzielnie lub za obopólną zgodą. Zgoda drugiej strony nie jest konieczna.",
  "L'autorité parentale": "Władza rodzicielska",
  "En cas de divorce, elle reste en principe exercée EN COMMUN par les deux parents. C'est l'exception qui doit être décidée par un juge.":
    "W razie rozwodu sprawują ją co do zasady WSPÓLNIE oboje rodzice. To wyjątek wymaga orzeczenia sędziego.",
  "Le PACS": "PACS",
  "Un contrat d'union civile, plus simple que le mariage, ouvert à tous les couples.":
    "Umowa o związku cywilnym, prostsza niż małżeństwo, dostępna dla wszystkich par.",
  "L'aide juridictionnelle": "Pomoc prawna z urzędu",
  "Elle permet aux personnes à faibles revenus d'avoir un avocat pris en charge par l'État.":
    "Pozwala osobom o niskich dochodach mieć adwokata opłacanego przez państwo.",
  "Le logement": "Mieszkanie",
  "Un **locataire** peut décorer, meubler et vivre normalement chez lui sans rien demander. Il doit en revanche l'**accord écrit du propriétaire** pour tout **travaux de transformation** — abattre une cloison, changer la destination d'une pièce. Les **réparations importantes** et le remplacement d'un équipement fourni avec le logement, comme une machine à laver cassée, incombent au **propriétaire**.":
    "**Najemca** może dekorować, umeblować i normalnie mieszkać u siebie, o nic nie pytając. Potrzebuje natomiast **pisemnej zgody właściciela** na wszelkie **prace przebudowy** — wyburzenie ścianki działowej, zmianę przeznaczenia pomieszczenia. **Poważne naprawy** i wymiana sprzętu dostarczonego wraz z mieszkaniem, na przykład zepsutej pralki, obciążają **właściciela**.",
  "L'autorité parentale est le devoir de protéger l'enfant : sa sécurité, sa santé, son éducation, sa moralité. Les **punitions physiques sont interdites** depuis la loi de 2019.":
    "Władza rodzicielska to obowiązek ochrony dziecka: jego bezpieczeństwa, zdrowia, wychowania i moralności. **Kary cielesne są zakazane** od czasu ustawy z 2019 roku.",
  "Mairie · état civil · PACS · aide juridictionnelle · juge aux affaires familiales.":
    "Merostwo · akta stanu cywilnego · PACS · pomoc prawna z urzędu · sędzia do spraw rodzinnych.",
  "5 jours pour déclarer une naissance · mariage pour tous depuis 2013 · interdiction des violences éducatives depuis 2019.":
    "5 dni na zgłoszenie narodzin · małżeństwo dla wszystkich od 2013 roku · zakaz przemocy wychowawczej od 2019 roku.",
  "État civil · mariage civil · autorité parentale · locataire · propriétaire.":
    "Akta stanu cywilnego · małżeństwo cywilne · władza rodzicielska · najemca · właściciel.",
  "En une phrase : la mairie enregistre la vie de famille, et le juge n'intervient que lorsque les adultes ne s'accordent plus.":
    "W jednym zdaniu: merostwo rejestruje życie rodzinne, a sędzia wkracza dopiero wtedy, gdy dorośli przestają się porozumiewać.",

  // ── Health and the Assurance maladie ────────────────────────────────────
  "La santé et l'Assurance maladie": "Zdrowie i Assurance maladie",
  "Pourquoi cette leçon : quatre mots reviennent — carte Vitale, mutuelle, tiers payant, Assurance maladie — et les questions demandent lequel fait quoi.":
    "Po co ta lekcja: wracają cztery słowa — carte Vitale, mutuelle, tiers payant, Assurance maladie — a pytania dotyczą tego, które z nich co robi.",
  "L'Assurance maladie": "Assurance maladie (ubezpieczenie zdrowotne)",
  "Le remboursement des frais de santé est demandé à l'**Assurance maladie**, branche de la Sécurité sociale, à travers la **CPAM** (caisse primaire d'assurance maladie). L'**inscription est obligatoire** : ce n'est pas un contrat qu'on choisit, c'est une affiliation.":
    "O zwrot kosztów leczenia występuje się do **Assurance maladie**, gałęzi Sécurité sociale, za pośrednictwem **CPAM** (kasy podstawowego ubezpieczenia zdrowotnego). **Zgłoszenie jest obowiązkowe**: to nie umowa, którą się wybiera, lecz przynależność.",
  "La carte Vitale": "Carte Vitale (karta ubezpieczenia)",
  "Elle atteste des droits à l'Assurance maladie et transmet la feuille de soins électronique. Elle ne sert pas à payer.":
    "Poświadcza uprawnienia z Assurance maladie i przesyła elektroniczny druk rozliczeniowy. Nie służy do płacenia.",
  "La mutuelle": "Mutuelle (ubezpieczenie dodatkowe)",
  "Une complémentaire santé, facultative, qui rembourse ce que l'Assurance maladie ne couvre pas.":
    "Dobrowolne ubezpieczenie uzupełniające, które zwraca to, czego nie pokrywa Assurance maladie.",
  "Le tiers payant": "Tiers payant (zwolnienie z płatności z góry)",
  "Le dispositif qui évite d'avancer les frais : le professionnel de santé se fait payer directement par l'Assurance maladie.":
    "Rozwiązanie pozwalające nie wykładać pieniędzy z góry: pracownik ochrony zdrowia otrzymuje zapłatę bezpośrednio od Assurance maladie.",
  "Le médecin traitant": "Lekarz prowadzący",
  "Le médecin déclaré comme référent. Passer par lui donne droit au meilleur taux de remboursement.":
    "Lekarz zgłoszony jako prowadzący. Skorzystanie z jego pośrednictwa daje prawo do najwyższej stawki zwrotu.",
  "Les droits sur son corps": "Prawa do własnego ciała",
  "La **contraception est libre**, remboursée pour les mineures et les jeunes femmes, et confidentielle. L'**interruption volontaire de grossesse (IVG)** est **légale** en France depuis la loi Veil de 1975 ; depuis 2024, la liberté d'y recourir est garantie par la **Constitution**.":
    "**Antykoncepcja jest dostępna bez ograniczeń**, refundowana dla nieletnich i młodych kobiet oraz objęta poufnością. **Przerwanie ciąży (IVG)** jest we Francji **legalne** od ustawy Veil z 1975 roku; od 2024 roku wolność skorzystania z niego gwarantuje **Konstytucja**.",
  "Assurance maladie · CPAM · carte Vitale · mutuelle · loi Veil.":
    "Assurance maladie · CPAM · carte Vitale · mutuelle · ustawa Veil.",
  "1945 Sécurité sociale · 1975 loi Veil · 2024 IVG inscrite dans la Constitution.":
    "1945 Sécurité sociale · 1975 ustawa Veil · 2024 wpisanie IVG do Konstytucji.",
  "Affiliation · remboursement · complémentaire santé · tiers payant · confidentialité.":
    "Przynależność · zwrot kosztów · ubezpieczenie uzupełniające · tiers payant · poufność.",
  "En une phrase : la carte prouve, l'Assurance rembourse, la mutuelle complète et le tiers payant évite d'avancer.":
    "W jednym zdaniu: karta poświadcza, ubezpieczenie zwraca, mutuelle uzupełnia, a tiers payant oszczędza wykładania pieniędzy.",

  // ── Work and employee rights ────────────────────────────────────────────
  "Le travail et les droits des salariés": "Praca i prawa pracowników",
  "Pourquoi cette leçon : les questions sur le travail portent presque toutes sur une protection — contre le travail non déclaré, contre le licenciement abusif, contre la discrimination.":
    "Po co ta lekcja: pytania o pracę dotyczą niemal zawsze jakiejś ochrony — przed pracą na czarno, przed bezprawnym zwolnieniem, przed dyskryminacją.",
  "Le salaire et le temps de travail": "Wynagrodzenie i czas pracy",
  "Le **SMIC** est le **salaire minimum** légal en France : aucun employeur ne peut payer un salarié en dessous. La **durée légale du travail** est de **35 heures par semaine** ; au-delà, ce sont des heures supplémentaires, majorées.":
    "**SMIC** to ustawowa **płaca minimalna** we Francji: żaden pracodawca nie może zapłacić pracownikowi mniej. **Ustawowy czas pracy** wynosi **35 godzin tygodniowo**; powyżej są to nadgodziny, płatne wyżej.",
  "**Travailler sans être déclaré est illégal** — pour l'employeur comme pour le salarié. C'est le travail dissimulé : pas de cotisations, donc pas de retraite, pas d'assurance chômage, pas de couverture en cas d'accident.":
    "**Praca bez zgłoszenia jest nielegalna** — zarówno dla pracodawcy, jak i dla pracownika. To praca na czarno: brak składek, a więc brak emerytury, brak zasiłku dla bezrobotnych, brak ochrony w razie wypadku.",
  "Les textes qui font la règle": "Akty, które ustanawiają regułę",
  "Les règles du travail viennent du **Code du travail**, des **conventions collectives** de la branche et du **contrat de travail**. En cas de litige entre un salarié et son employeur, c'est le **conseil de prud'hommes** qui tranche.":
    "Reguły pracy wynikają z **Kodeksu pracy**, **układów zbiorowych** danej branży oraz **umowy o pracę**. W sporze między pracownikiem a pracodawcą rozstrzyga **conseil de prud'hommes**.",
  "Ce que personne ne peut vous refuser": "Czego nikt nie może wam odmówić",
  "Tout salarié, quels que soient sa nationalité, son poste ou son ancienneté, peut adhérer au syndicat de son choix.":
    "Każdy pracownik, bez względu na obywatelstwo, stanowisko czy staż, może wstąpić do wybranego związku zawodowego.",
  "Créer une entreprise": "Założyć firmę",
  "Une femme le peut exactement comme un homme. Une personne étrangère en situation régulière le peut aussi.":
    "Kobieta może to zrobić dokładnie tak samo jak mężczyzna. Cudzoziemiec przebywający legalnie również.",
  "Le congé parental": "Urlop wychowawczy",
  "Le père comme la mère peuvent le demander, à la naissance ou à l'adoption d'un enfant.":
    "Może o niego wystąpić zarówno ojciec, jak i matka, przy narodzinach lub przysposobieniu dziecka.",
  "Le congé paternité": "Urlop ojcowski",
  "25 jours depuis le 1er juillet 2021, auxquels s'ajoutent les 3 jours de naissance — 28 jours en tout.":
    "25 dni od 1 lipca 2021 roku, do których dochodzą 3 dni z tytułu narodzin — łącznie 28 dni.",
  "La grossesse au travail": "Ciąża w pracy",
  "**Licencier une femme en raison de sa grossesse ou de son congé de maternité est illégal.** La protection est renforcée pendant le congé et dans les semaines qui suivent le retour.":
    "**Zwolnienie kobiety z powodu ciąży lub urlopu macierzyńskiego jest nielegalne.** Ochrona jest wzmocniona w czasie urlopu i w tygodniach po powrocie do pracy.",
  "Chercher un emploi": "Szukać pracy",
  "La première démarche est de **s'inscrire à France Travail** — l'ancien Pôle emploi. L'inscription ouvre l'accompagnement, les offres et, sous conditions, l'allocation chômage.":
    "Pierwszym krokiem jest **rejestracja we France Travail** — dawnym Pôle emploi. Rejestracja otwiera dostęp do wsparcia, ofert i — pod pewnymi warunkami — do zasiłku dla bezrobotnych.",
  "SMIC · Code du travail · convention collective · conseil de prud'hommes · France Travail · inspection du travail.":
    "SMIC · Kodeks pracy · układ zbiorowy · conseil de prud'hommes · France Travail · inspekcja pracy.",
  "35 heures par semaine · congé paternité 25 jours depuis le 1er juillet 2021 (+3 jours de naissance).":
    "35 godzin tygodniowo · urlop ojcowski 25 dni od 1 lipca 2021 roku (+3 dni z tytułu narodzin).",
  "Travail dissimulé · heures supplémentaires · syndicat · congé parental · licenciement.":
    "Praca na czarno · nadgodziny · związek zawodowy · urlop wychowawczy · zwolnienie.",
  "En une phrase : être déclaré est ce qui transforme un travail en droits.":
    "W jednym zdaniu: zgłoszenie do ubezpieczenia jest tym, co zamienia pracę w prawa.",

  // ── School and instruction ──────────────────────────────────────────────
  "L'école et l'instruction": "Szkoła i obowiązek nauki",
  "Pourquoi cette leçon : deux âges, un nom d'établissement et une règle d'absence. C'est tout ce que l'examen demande, et il le demande souvent.":
    "Po co ta lekcja: dwie granice wieku, nazwa placówki i reguła nieobecności. To wszystko, o co pyta egzamin — i pyta często.",
  "L'instruction obligatoire": "Obowiązek nauki",
  "L'instruction est obligatoire **de 3 à 16 ans**, depuis la rentrée 2019. Ce n'est pas l'école qui est obligatoire, c'est l'**instruction** : elle peut se faire dans un établissement public, privé ou, sous conditions strictes, dans la famille. De 16 à 18 ans s'ajoute une obligation de **formation**.":
    "Nauka jest obowiązkowa **od 3 do 16 lat**, od roku szkolnego 2019. Obowiązkowa jest nie szkoła, lecz **nauka**: może się odbywać w placówce publicznej, prywatnej lub — pod ścisłymi warunkami — w domu. Od 16 do 18 lat dochodzi obowiązek **kształcenia**.",
  "Des parents qui ne respectent pas l'obligation d'instruction risquent une amende et, dans les cas les plus graves, une peine d'emprisonnement. Ce n'est pas une simple formalité administrative.":
    "Rodzicom, którzy nie dopełniają obowiązku nauki, grozi grzywna, a w najcięższych przypadkach kara pozbawienia wolności. To nie jest zwykła formalność administracyjna.",
  "Le parcours": "Ścieżka edukacyjna",
  "L'école maternelle": "Przedszkole",
  "De 3 à 6 ans. Gérée par la commune.": "Od 3 do 6 lat. Prowadzone przez gminę.",
  "L'école élémentaire": "Szkoła podstawowa",
  "De 6 à 11 ans. Gérée par la commune également.":
    "Od 6 do 11 lat. Również prowadzona przez gminę.",
  "Le collège": "Collège (gimnazjum)",
  "Après l'école élémentaire, de 11 à 15 ans. Géré par le département.":
    "Po szkole podstawowej, od 11 do 15 lat. Prowadzone przez departament.",
  "Le lycée": "Lycée (liceum)",
  "Après le collège. Géré par la région. Il mène au baccalauréat.":
    "Po collège. Prowadzone przez region. Kończy się maturą (baccalauréat).",
  "S'inscrire et participer": "Zapisać dziecko i uczestniczyć",
  "On inscrit son enfant à l'école publique **auprès de la mairie**, qui l'affecte ensuite à une école. L'école publique est **gratuite** depuis les lois de Jules Ferry, en **1881**, et laïque depuis 1882. Les parents d'élèves peuvent **se faire élire au conseil d'école** ou au conseil d'administration et rencontrer les enseignants.":
    "Dziecko zapisuje się do szkoły publicznej **w merostwie**, które przydziela je następnie do konkretnej placówki. Szkoła publiczna jest **bezpłatna** od ustaw Jules'a Ferry'ego z **1881 roku** i świecka od 1882. Rodzice uczniów mogą **zostać wybrani do rady szkoły** lub rady administracyjnej i spotykać się z nauczycielami.",
  "Les absences": "Nieobecności",
  "Les motifs d'absence acceptés sont limités : **maladie de l'enfant**, maladie contagieuse dans la famille, **réunion solennelle de famille**, empêchement de transport, absence des personnes responsables. Les convictions personnelles n'en font pas partie.":
    "Uznawane przyczyny nieobecności są ograniczone: **choroba dziecka**, choroba zakaźna w rodzinie, **uroczystość rodzinna**, przeszkoda w dojeździe, nieobecność opiekunów. Osobiste przekonania do nich nie należą.",
  "Accueillir tous les enfants": "Przyjąć każde dziecko",
  "Les enfants qui **ne parlent pas français** bénéficient d'un dispositif d'accueil et de cours de français adapté, tout en suivant les autres enseignements. Les enfants **en situation de handicap** ont **droit à être scolarisés** en milieu ordinaire, avec les aménagements et l'accompagnement nécessaires.":
    "Dzieci, które **nie mówią po francusku**, są objęte programem przyjęcia i dostosowanymi lekcjami francuskiego, uczestnicząc jednocześnie w pozostałych zajęciach. Dzieci **z niepełnosprawnością** mają **prawo do nauki** w szkole ogólnodostępnej, z niezbędnymi udogodnieniami i wsparciem.",
  "Jules Ferry · collège · lycée · conseil d'école · mairie.":
    "Jules Ferry · collège · lycée · rada szkoły · merostwo.",
  "3 à 16 ans : instruction obligatoire · 16 à 18 ans : obligation de formation · 1881 gratuité · 1882 laïcité de l'école.":
    "Od 3 do 16 lat: obowiązek nauki · od 16 do 18 lat: obowiązek kształcenia · 1881 bezpłatność · 1882 świeckość szkoły.",
  "Instruction · scolarisation · inclusion · absence justifiée · baccalauréat.":
    "Nauka · objęcie nauczaniem · włączenie · nieobecność usprawiedliwiona · matura.",
  "En une phrase : l'école est gratuite, laïque et obligatoire depuis Jules Ferry, et depuis 2019 elle commence à trois ans.":
    "W jednym zdaniu: szkoła jest bezpłatna, świecka i obowiązkowa od czasów Jules'a Ferry'ego, a od 2019 roku zaczyna się w wieku trzech lat.",

  // ── Public services and emergencies ─────────────────────────────────────
  "Services publics et urgences": "Usługi publiczne i numery alarmowe",
  "Pourquoi cette leçon en dernier : ce sont les numéros et les guichets. On les apprend en une minute, et ils valent des points sûrs.":
    "Po co ta lekcja na końcu: to numery i okienka. Uczy się ich w minutę, a dają pewne punkty.",
  "Les numéros d'urgence": "Numery alarmowe",
  "17 — Police": "17 — Policja",
  "Police secours ou gendarmerie. Agression, vol en cours, danger immédiat.":
    "Pogotowie policyjne lub żandarmeria. Napaść, kradzież w toku, bezpośrednie zagrożenie.",
  "15 — SAMU": "15 — SAMU",
  "Urgence médicale : malaise, accident, détresse vitale.":
    "Nagły przypadek medyczny: zasłabnięcie, wypadek, stan zagrożenia życia.",
  "18 — Pompiers": "18 — Straż pożarna",
  "Incendie, accident, secours à personne.": "Pożar, wypadek, ratowanie osób.",
  "112 — Numéro européen": "112 — Numer europejski",
  "Fonctionne partout dans l'Union européenne, depuis n'importe quel téléphone.":
    "Działa w całej Unii Europejskiej, z każdego telefonu.",
  "À retenir aussi : le **114** est le numéro d'urgence par SMS pour les personnes sourdes ou malentendantes, et le **119** celui de l'enfance en danger.":
    "Warto też zapamiętać: **114** to numer alarmowy SMS dla osób głuchych i słabosłyszących, a **119** — dla dzieci w niebezpieczeństwie.",
  "Où s'adresser": "Dokąd się zwrócić",
  "La mairie": "Merostwo",
  "État civil, carte d'identité, passeport, listes électorales, inscription à l'école.":
    "Akta stanu cywilnego, dowód osobisty, paszport, rejestr wyborców, zapis do szkoły.",
  "La préfecture": "Prefektura",
  "Titres de séjour, permis de conduire, carte grise. Le préfet y représente l'État.":
    "Karty pobytu, prawo jazdy, dowód rejestracyjny. Prefekt reprezentuje tam państwo.",
  "La CPAM": "CPAM",
  "Assurance maladie : carte Vitale, remboursements, complémentaire santé solidaire.":
    "Ubezpieczenie zdrowotne: carte Vitale, zwroty kosztów, solidarnościowe ubezpieczenie uzupełniające.",
  "France Travail": "France Travail",
  "Recherche d'emploi, accompagnement, allocation chômage.":
    "Poszukiwanie pracy, wsparcie, zasiłek dla bezrobotnych.",
  "Ce que le service public vous doit": "Co służba publiczna jest wam winna",
  "Un **usager** peut demander une information, obtenir un document, déposer une réclamation et exiger d'être traité comme tout le monde. Si une administration refuse un service pour un motif interdit — origine, religion, sexe, handicap — c'est une **discrimination**, et le **Défenseur des droits** peut être saisi gratuitement.":
    "**Interesant** może poprosić o informację, uzyskać dokument, złożyć skargę i żądać, by traktowano go jak wszystkich. Jeśli urząd odmawia usługi z niedozwolonego powodu — pochodzenia, religii, płci, niepełnosprawności — jest to **dyskryminacja** i można bezpłatnie zwrócić się do **Défenseur des droits**.",
  "SAMU · police secours · pompiers · CPAM · France Travail · Défenseur des droits.":
    "SAMU · pogotowie policyjne · straż pożarna · CPAM · France Travail · Défenseur des droits.",
  "17 police · 15 SAMU · 18 pompiers · 112 Europe · 114 SMS urgence · 119 enfance en danger.":
    "17 policja · 15 SAMU · 18 straż pożarna · 112 Europa · 114 SMS alarmowy · 119 dzieci w niebezpieczeństwie.",
  "Usager · réclamation · discrimination · préfecture · titre de séjour.":
    "Interesant · skarga · dyskryminacja · prefektura · karta pobytu.",
  "En une phrase : trois numéros pour l'urgence, quatre guichets pour le reste — et un recours gratuit quand un guichet vous traite mal.":
    "W jednym zdaniu: trzy numery na wypadek nagły, cztery okienka na całą resztę — i bezpłatne odwołanie, gdy okienko potraktuje was źle.",
};
