/**
 * English for the Vivre en France practice questions.
 *
 * The lesson cards are answered by VIVRE_EN_FRANCE_EN. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in English then asked its questions
 * in French.
 *
 * Keyed on the FRENCH source text exactly as it appears in frQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an e for
 * an é or a straight apostrophe where the sentence has a curly one, and the
 * lookup misses in silence. The question renders in French, the tap works,
 * and nothing anywhere reports it.
 *
 * WHAT STAYS FRENCH follows VIVRE_EN_FRANCE_EN exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing:
 *
 *   - the name of the law or the institution the exam asks about keeps its
 *     own name: laïcité, the SMIC, the Sécurité sociale, the Conseil
 *     constitutionnel, the Défenseur des droits, the cour d'assises, the
 *     conseil de prud'hommes, the Journal officiel, the Code civil;
 *   - so do the words with no English twin: the commune, the département,
 *     the lycée and the collège, the baccalauréat, the carte Vitale;
 *   - a line quoted as an option is given in French and then in English,
 *     because an answer nobody can read is an answer nobody can pick;
 *   - what English already names takes its English name: the Assemblée
 *     nationale is the National Assembly, the Sénat the Senate, a mairie a
 *     town hall, a préfecture a prefecture, the état civil the civil
 *     register.
 *
 * British spelling throughout, the same as the rest of the English catalogue:
 * offence, recognise, programme, defence, labour.
 *
 * A hundred and nineteen of the bank's strings are not here and that is
 * correct: they are years, bare numbers and short answers that
 * VIVRE_EN_FRANCE_EN already answers. Every English table is spread into one
 * object, so a key present in two of them would lose one silently — the later
 * spread would decide both. check-en-bank-translation measures coverage
 * through translateCourseText, the lookup a reader's tap actually goes
 * through, so those count as answered and are not duplicated here.
 */
export const FR_QUESTION_BANK_EN: Record<string, string> = {
  "Quelle est la devise de la République française ?": "What is the motto of the French Republic?",
  "Unité, Travail, Justice": "Unité, Travail, Justice",
  "Honneur et Patrie": "Honneur et Patrie",
  "Paix, Travail, Progrès": "Paix, Travail, Progrès",
  "Liberté, Égalité, Fraternité. Elle figure à l'article 2 de la Constitution et au fronton des bâtiments publics.":
    "Liberté, Égalité, Fraternité — liberty, equality, fraternity. It stands in article 2 of the Constitution and on the front of public buildings.",
  "Lequel de ces symboles représente la République française ?":
    "Which of these symbols stands for the French Republic?",
  "L'aigle impérial": "The imperial eagle",
  "La fleur de lys": "The fleur-de-lys",
  "Le lion couronné": "The crowned lion",
  "Marianne. La fleur de lys était l'emblème de la monarchie et l'aigle celui de l'Empire.":
    "Marianne. The fleur-de-lys was the emblem of the monarchy and the eagle that of the Empire.",
  "Où peut-on voir la devise de la République ?": "Where can you see the motto of the Republic?",
  "Au fronton des mairies et des écoles": "On the front of town halls and schools",
  "Uniquement sur les passeports": "On passports only",
  "Uniquement dans les églises": "In churches only",
  "Uniquement au Parlement européen": "In the European Parliament only",
  "Sur les bâtiments publics — mairies, écoles, tribunaux — ainsi que sur les pièces de monnaie et les documents officiels.":
    "On public buildings — town halls, schools, courts — and on coins and official documents.",
  "Sur quel document peut-on voir Marianne ?": "On which document can you see Marianne?",
  "Sur les timbres-poste": "On postage stamps",
  "Sur les factures d'électricité": "On electricity bills",
  "Sur les billets de train": "On train tickets",
  "Sur les ordonnances médicales": "On medical prescriptions",
  "Sur les timbres, sur les pièces d'euro françaises et sur les documents officiels. Son buste est aussi présent dans les mairies.":
    "On stamps, on French euro coins and on official documents. Her bust also stands in town halls.",
  "Quel symbole de la République peut-on voir sur les maillots de l'équipe de France de football ?":
    "Which symbol of the Republic can you see on the shirts of the French football team?",
  "Le coq": "The rooster",
  "La tour Eiffel": "The Eiffel Tower",
  "Le coq gaulois. C'est un symbole populaire de la France, plus ancien que la République elle-même.":
    "The Gallic rooster. It is a popular symbol of France, older than the Republic itself.",
  "Que commémore la fête nationale du 14 juillet ?":
    "What does the national day of 14 July commemorate?",
  "La prise de la Bastille et la Fête de la Fédération":
    "The storming of the Bastille and the Fête de la Fédération",
  "La fin de la Seconde Guerre mondiale": "The end of the Second World War",
  "La signature du traité de Maastricht": "The signing of the Maastricht Treaty",
  "L'abolition de l'esclavage": "The abolition of slavery",
  "La prise de la Bastille du 14 juillet 1789 et la Fête de la Fédération du 14 juillet 1790, qui célébrait l'unité de la nation.":
    "The storming of the Bastille on 14 July 1789 and the Fête de la Fédération of 14 July 1790, which celebrated the unity of the nation.",
  "Complétez les paroles de La Marseillaise : « Allons enfants de la Patrie... »":
    "Complete the words of La Marseillaise: « Allons enfants de la Patrie... »",
  "« ...le jour de gloire est arrivé ! »":
    "« ...le jour de gloire est arrivé ! » — the day of glory has come!",
  "« ...la liberté nous appelle ! »": "« ...la liberté nous appelle ! » — liberty is calling us!",
  "« ...le drapeau nous rassemble ! »":
    "« ...le drapeau nous rassemble ! » — the flag brings us together!",
  "« ...la République est en marche ! »":
    "« ...la République est en marche ! » — the Republic is on the march!",
  "« Allons enfants de la Patrie, le jour de gloire est arrivé ! » Ce sont les deux premiers vers de l'hymne national.":
    "« Allons enfants de la Patrie, le jour de gloire est arrivé ! » — arise, children of the Fatherland, the day of glory has come. Those are the first two lines of the national anthem.",
  "Peut-on brûler publiquement un drapeau français ?": "Can a French flag be burnt in public?",
  "Non, c'est une infraction": "No, it is an offence",
  "Oui, c'est protégé par la liberté d'expression": "Yes, freedom of expression protects it",
  "Oui, lors d'une manifestation déclarée": "Yes, at a declared demonstration",
  "Oui, si le drapeau vous appartient": "Yes, if the flag belongs to you",
  "Non. L'outrage public au drapeau tricolore est une infraction, y compris lors d'une manifestation.":
    "No. Publicly insulting the tricolour flag is an offence, including at a demonstration.",
  "Lequel de ces prénoms évoque un symbole de la République ?":
    "Which of these first names calls to mind a symbol of the Republic?",
  "Joséphine": "Joséphine",
  "Adélaïde": "Adélaïde",
  "Clotilde": "Clotilde",
  "Marianne est la figure allégorique de la République. Les trois autres sont des prénoms sans portée symbolique républicaine.":
    "Marianne is the allegorical figure of the Republic. The other three are first names with no republican meaning.",
  "Lesquels sont des symboles officiels de la République française ?":
    "Which of these are official symbols of the French Republic?",
  "Le drapeau tricolore, La Marseillaise et la devise":
    "The tricolour flag, La Marseillaise and the motto",
  "Le coq, le béret et la baguette": "The rooster, the beret and the baguette",
  "La tour Eiffel et le Louvre": "The Eiffel Tower and the Louvre",
  "Le lys, la couronne et le sceptre": "The lily, the crown and the sceptre",
  "L'article 2 de la Constitution nomme le drapeau tricolore, l'hymne national et la devise. Le coq est populaire mais pas officiel.":
    "Article 2 of the Constitution names the tricolour flag, the national anthem and the motto. The rooster is popular but not official.",
  "De quelles couleurs est le drapeau français ?": "What colours is the French flag?",
  "Bleu, blanc, rouge": "Blue, white, red",
  "Rouge, jaune, noir": "Red, yellow, black",
  "Bleu, jaune, rouge": "Blue, yellow, red",
  "Vert, blanc, rouge": "Green, white, red",
  "Bleu, blanc, rouge, en trois bandes verticales. Le bleu et le rouge viennent de Paris, le blanc de la royauté.":
    "Blue, white, red, in three vertical bands. Blue and red come from Paris, white from the monarchy.",
  "Qu'est-ce qu'une liberté ?": "What is a liberty?",
  "Le droit de faire ce que l'on veut sans nuire à autrui":
    "The right to do what you want without harming others",
  "Le droit de faire absolument tout ce que l'on veut":
    "The right to do absolutely anything you want",
  "Une autorisation délivrée par la mairie": "A permission issued by the town hall",
  "Un avantage réservé aux citoyens français": "A privilege kept for French citizens",
  "L'article 4 de la Déclaration de 1789 : « La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. »":
    "Article 4 of the Declaration of 1789: « La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. » — liberty consists in being able to do anything that does not harm others.",
  "La liberté d'association est :": "Freedom of association is:",
  "un droit garanti, sans autorisation préalable":
    "a guaranteed right, with no prior authorisation",
  "soumise à l'accord du préfet": "subject to the prefect's agreement",
  "réservée aux personnes de nationalité française": "kept for people of French nationality",
  "interdite aux salariés": "forbidden to employees",
  "Depuis la loi de 1901, créer une association demande une simple déclaration. Aucune autorisation n'est nécessaire.":
    "Since the law of 1901, setting up an association takes a simple declaration. No authorisation is needed.",
  "La liberté d'expression sur les réseaux sociaux en France est :":
    "Freedom of expression on social media in France is:",
  "encadrée par la loi, comme partout ailleurs": "framed by the law, as everywhere else",
  "totale et sans limite": "total and without limit",
  "interdite aux personnes étrangères": "forbidden to foreigners",
  "soumise à une autorisation préalable": "subject to prior authorisation",
  "La loi s'applique en ligne comme hors ligne : injure, diffamation, incitation à la haine et apologie du terrorisme restent des délits.":
    "The law applies online as it does offline: insult, defamation, incitement to hatred and the glorification of terrorism remain offences.",
  "En quoi consiste le devoir de solidarité ?": "What does the duty of solidarity consist of?",
  "Contribuer à la vie collective et venir en aide aux autres":
    "Contributing to collective life and coming to the aid of others",
  "Adhérer à une association humanitaire": "Joining a humanitarian association",
  "Donner de l'argent à une œuvre chaque année": "Giving money to a charity every year",
  "Travailler bénévolement pour la commune": "Working as a volunteer for the commune",
  "Il se traduit concrètement par l'impôt, les cotisations sociales et l'obligation de porter secours à une personne en danger.":
    "In practice it takes the form of tax, social contributions and the obligation to come to the aid of a person in danger.",
  "Que permet la liberté de circulation ?": "What does freedom of movement allow?",
  "Se déplacer et s'installer librement, quitter le pays et y revenir":
    "Moving and settling freely, leaving the country and coming back",
  "Circuler sans permis de conduire": "Driving without a licence",
  "Entrer dans tout bâtiment public à toute heure": "Entering any public building at any hour",
  "Choisir librement sa commune d'imposition": "Freely choosing the commune where you are taxed",
  "Elle couvre le déplacement à l'intérieur du territoire, le choix du domicile, la sortie du pays et le retour.":
    "It covers movement inside the country, the choice of where to live, leaving the country and returning.",
  "Qu'est-ce que la liberté d'expression ?": "What is freedom of expression?",
  "Le droit d'exprimer ses opinions dans les limites fixées par la loi":
    "The right to express your opinions within the limits the law sets",
  "Le droit de dire n'importe quoi sans conséquence":
    "The right to say anything at all without consequence",
  "Le droit réservé aux journalistes de publier": "A right to publish kept for journalists",
  "Le droit de manifester sans déclaration": "The right to demonstrate without a declaration",
  "C'est un droit fondamental, mais encadré : l'injure, la diffamation et l'incitation à la haine ne sont pas des opinions, ce sont des délits.":
    "It is a fundamental right, but a framed one: insult, defamation and incitement to hatred are not opinions, they are offences.",
  "Pour quel motif peut-on limiter la liberté d'expression ?":
    "On what ground can freedom of expression be limited?",
  "La protection de l'ordre public et des droits d'autrui":
    "The protection of public order and of the rights of others",
  "Le désaccord d'un ministre": "A minister's disagreement",
  "La demande d'une entreprise privée": "A private company's request",
  "Le vote d'une assemblée de copropriété": "A vote of a residents' meeting",
  "Seule la loi peut limiter cette liberté, et seulement pour protéger l'ordre public, la dignité et les droits des autres.":
    "Only the law can limit this freedom, and only to protect public order, dignity and the rights of others.",
  "Que garantit la liberté de la presse ?": "What does freedom of the press guarantee?",
  "Que les journalistes peuvent informer sans censure préalable":
    "That journalists can report without prior censorship",
  "Que tous les journaux sont gratuits": "That all newspapers are free of charge",
  "Que l'État choisit les articles publiés": "That the state chooses which articles are published",
  "Que seuls les journalistes peuvent s'exprimer": "That only journalists may speak out",
  "Elle protège le droit d'informer et celui d'être informé. Elle date de la loi de 1881 et n'autorise pas pour autant la diffamation.":
    "It protects the right to inform and the right to be informed. It dates from the law of 1881 and does not allow defamation for all that.",
  "Quelle situation est une atteinte à la dignité humaine ?":
    "Which situation is an attack on human dignity?",
  "Loger des travailleurs dans un local insalubre en les payant au noir":
    "Housing workers in unfit premises and paying them cash in hand",
  "Refuser une augmentation de salaire": "Refusing a pay rise",
  "Demander une pièce d'identité à un guichet": "Asking for identification at a counter",
  "Imposer un uniforme dans une entreprise": "Requiring a uniform in a company",
  "L'exploitation par le logement indigne et le travail dissimulé porte atteinte à la dignité, qui est un principe à valeur constitutionnelle.":
    "Exploitation through unfit housing and undeclared work attacks dignity, which is a principle of constitutional standing.",
  "L'article 4 de la Déclaration de 1789 affirme que la liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. Qu'est-ce que cela signifie ?":
    "Article 4 of the Declaration of 1789 states that liberty consists in being able to do anything that does not harm others. What does that mean?",
  "Ma liberté s'arrête là où commence celle des autres":
    "My liberty stops where that of others begins",
  "Je peux tout faire tant que personne ne me voit": "I can do anything as long as nobody sees me",
  "La liberté n'existe que pour les citoyens": "Liberty exists only for citizens",
  "Seul l'État décide ce qui est permis": "Only the state decides what is allowed",
  "C'est la règle de partage : chacun est libre jusqu'au point où son action porte atteinte à autrui.":
    "It is the rule of sharing: everyone is free up to the point where their action harms somebody else.",
  "Tous les citoyens français ont-ils une religion ?": "Do all French citizens have a religion?",
  "Non, chacun est libre de croire ou de ne pas croire":
    "No, everyone is free to believe or not to believe",
  "Oui, la loi impose d'en déclarer une": "Yes, the law requires one to be declared",
  "Oui, mais seulement à la naissance": "Yes, but only at birth",
  "Non, mais il faut le signaler à la mairie": "No, but it has to be reported to the town hall",
  "La liberté de conscience comprend le droit de n'avoir aucune religion. L'État ne tient d'ailleurs aucun registre des croyances.":
    "Freedom of conscience includes the right to have no religion. The state keeps no register of beliefs in any case.",
  "Qu'est-ce que la laïcité ?": "What is laïcité?",
  "La séparation des institutions publiques et des religions, avec la liberté de conscience":
    "The separation of public institutions and religions, with freedom of conscience",
  "L'interdiction de toute religion en France": "The banning of every religion in France",
  "L'obligation d'être athée pour travailler dans le public":
    "The obligation to be an atheist to work in the public service",
  "La reconnaissance d'une religion officielle": "The recognition of an official religion",
  "Trois idées : liberté de conscience, séparation de l'État et des cultes, égalité de tous quelles que soient leurs croyances.":
    "Three ideas: freedom of conscience, the separation of the state and religions, and the equality of everyone whatever they believe.",
  "Que garantit le principe de laïcité ?": "What does the principle of laïcité guarantee?",
  "La liberté de croire, de ne pas croire et de changer de conviction":
    "The freedom to believe, not to believe and to change your mind",
  "Que chaque religion reçoit une aide de l'État":
    "That every religion receives help from the state",
  "Que les religions choisissent les programmes scolaires":
    "That religions choose the school curriculum",
  "Que les fêtes religieuses sont toutes fériées":
    "That all religious festivals are public holidays",
  "Elle garantit la liberté de conscience et l'égalité de traitement, sans que l'État privilégie ou finance un culte.":
    "It guarantees freedom of conscience and equal treatment, without the state favouring or funding any religion.",
  "Que dit la loi de 1905 ?": "What does the law of 1905 say?",
  "Que la République ne reconnaît ni ne salarie aucun culte":
    "That the Republic recognises and pays no religion",
  "Que les religions sont interdites dans l'espace public":
    "That religions are forbidden in public space",
  "Que l'école devient gratuite": "That school becomes free of charge",
  "Que le clergé est nommé par l'État": "That the clergy are appointed by the state",
  "Son article 1er garantit la liberté de conscience, son article 2 pose que la République ne reconnaît, ne salarie ni ne subventionne aucun culte.":
    "Its article 1 guarantees freedom of conscience, its article 2 lays down that the Republic recognises, pays and subsidises no religion.",
  "Quel texte est considéré comme le texte fondateur de la laïcité ?":
    "Which text is held to be the founding text of laïcité?",
  "La Déclaration de 1789": "The Declaration of 1789",
  "La loi de séparation des Églises et de l'État du 9 décembre 1905. Les autres textes sont fondateurs, mais d'autre chose.":
    "The law separating the Churches and the state of 9 December 1905. The other texts are founding texts, but of something else.",
  "Quel jour célèbre-t-on officiellement la laïcité en France ?":
    "On what day is laïcité officially celebrated in France?",
  "Le 9 décembre": "9 December",
  "Le 1er mai": "1 May",
  "Le 11 novembre": "11 November",
  "Le 9 décembre, date anniversaire de la loi de 1905.":
    "9 December, the anniversary of the law of 1905.",
  "Quelle institution française doit rester neutre en matière de religion ?":
    "Which French institution has to stay neutral in matters of religion?",
  "L'État et ses services publics": "The state and its public services",
  "Les associations culturelles": "Cultural associations",
  "Les entreprises privées": "Private companies",
  "Les familles": "Families",
  "La neutralité s'impose à l'État et à ses agents. Les usagers, les familles et les associations restent libres.":
    "Neutrality binds the state and its officials. Members of the public, families and associations stay free.",
  "Quel symbole religieux peut être porté dans une école publique dans le respect de la laïcité ?":
    "Which religious symbol may be worn in a state school within laïcité?",
  "Un signe discret, non ostensible": "A discreet sign, not a conspicuous one",
  "N'importe quel signe, sans limite": "Any sign at all, without limit",
  "Aucun signe, même invisible": "No sign at all, even an invisible one",
  "Uniquement les signes chrétiens": "Christian signs only",
  "La loi de 2004 interdit les signes ostensibles à l'école publique. Un bijou discret n'est pas concerné.":
    "The law of 2004 forbids conspicuous signs in state schools. A discreet piece of jewellery is not covered.",
  "À l'école, la charte de la laïcité permet de :": "At school, the laïcité charter serves to:",
  "expliquer aux élèves et aux familles ce que la laïcité permet et interdit":
    "explain to pupils and families what laïcité allows and forbids",
  "choisir un enseignement religieux": "choose religious instruction",
  "dispenser certains élèves des cours": "excuse certain pupils from lessons",
  "organiser des célébrations religieuses": "hold religious services",
  "Affichée dans les écoles depuis 2013, elle énonce en quinze articles ce que la laïcité signifie au quotidien scolaire.":
    "Posted in schools since 2013, it sets out in fifteen articles what laïcité means in the school day.",
  "En France, il est possible pour l'État de financer :": "In France the state may pay for:",
  "l'entretien des édifices religieux construits avant 1905":
    "the upkeep of religious buildings put up before 1905",
  "le salaire des ministres du culte": "the salaries of ministers of religion",
  "la construction de nouveaux lieux de culte": "the building of new places of worship",
  "les activités de propagande religieuse": "religious propaganda",
  "L'État est propriétaire des édifices antérieurs à 1905 et en assure l'entretien. Il ne salarie ni ne subventionne aucun culte.":
    "The state owns the buildings that predate 1905 and keeps them in repair. It pays and subsidises no religion.",
  "Quel terme désigne précisément la haine ou les préjugés contre les Juifs ?":
    "Which word names exactly hatred of or prejudice against Jews?",
  "L'antisémitisme": "Antisemitism",
  "La xénophobie": "Xenophobia",
  "Le sexisme": "Sexism",
  "L'anticléricalisme": "Anticlericalism",
  "L'antisémitisme. La xénophobie vise les étrangers en général ; l'anticléricalisme s'oppose au pouvoir du clergé.":
    "Antisemitism. Xenophobia is aimed at foreigners in general; anticlericalism opposes the power of the clergy.",
  "Un agent d'accueil d'une mairie peut-il porter un signe religieux visible pendant son service ?":
    "May a town hall receptionist wear a visible religious sign while on duty?",
  "Non : la neutralité s'impose aux agents publics": "No: neutrality binds public officials",
  "Oui, c'est sa liberté de conscience": "Yes, it is their freedom of conscience",
  "Oui, si son responsable l'autorise": "Yes, if their manager allows it",
  "Oui, en dehors des heures d'ouverture au public": "Yes, outside public opening hours",
  "Un agent public représente l'État pendant son service et doit être neutre. L'usager qui vient au guichet, lui, reste libre.":
    "A public official represents the state while on duty and has to be neutral. The member of the public at the counter stays free.",
  "Qui a le droit de se syndiquer ?": "Who has the right to join a trade union?",
  "Tout salarié, quelle que soit sa nationalité": "Every employee, whatever their nationality",
  "Seuls les salariés français": "French employees only",
  "Seuls les salariés en contrat à durée indéterminée": "Employees on permanent contracts only",
  "Seuls les cadres": "Managers only",
  "La liberté syndicale vaut pour tous les salariés. Nul ne peut être sanctionné pour y avoir adhéré — ni pour ne pas l'avoir fait.":
    "Trade union freedom holds for every employee. Nobody may be punished for joining — or for not joining.",
  "En France, est-ce possible d'adhérer à un parti politique ?":
    "In France, is it possible to join a political party?",
  "Oui, librement": "Yes, freely",
  "Non, c'est réservé aux élus": "No, it is kept for elected representatives",
  "Oui, mais avec l'autorisation de la préfecture": "Yes, but with the prefecture's authorisation",
  "Non, les partis sont interdits": "No, parties are forbidden",
  "Les partis se forment et exercent leur activité librement. Adhérer, ou n'adhérer à aucun, est un choix personnel.":
    "Parties form and act freely. Joining one, or joining none, is a personal choice.",
  "Une manifestation sur la voie publique doit-elle être signalée ?":
    "Does a demonstration on the public highway have to be notified?",
  "Oui, elle doit être déclarée en préfecture": "Yes, it has to be declared to the prefecture",
  "Non, aucune formalité n'est nécessaire": "No, no formality is needed",
  "Oui, elle doit être autorisée par le maire": "Yes, the mayor has to authorise it",
  "Oui, elle doit être approuvée par un juge": "Yes, a judge has to approve it",
  "Une déclaration préalable, pas une autorisation : l'administration en est informée et peut l'interdire seulement en cas de risque avéré pour l'ordre public.":
    "A prior declaration, not an authorisation: the administration is informed and can forbid it only where there is a proven risk to public order.",
  "Un salarié peut-il être licencié parce qu'il a fait grève ?":
    "Can an employee be dismissed for going on strike?",
  "Non, la grève est un droit constitutionnel": "No, striking is a constitutional right",
  "Oui, après deux jours d'absence": "Yes, after two days away",
  "Oui, si l'entreprise perd de l'argent": "Yes, if the company is losing money",
  "Oui, si le syndicat n'est pas représentatif": "Yes, if the union is not representative",
  "L'exercice normal du droit de grève ne peut justifier ni licenciement ni sanction. Seule une faute lourde commise pendant la grève le pourrait.":
    "The normal exercise of the right to strike can justify neither dismissal nor punishment. Only gross misconduct during the strike could.",
  "Qu'est-ce que la liberté d'association permet exactement ?":
    "What exactly does freedom of association allow?",
  "Créer une association, y adhérer ou n'en rejoindre aucune":
    "Setting up an association, joining one or joining none",
  "Obliger ses collègues à rejoindre une association":
    "Forcing your colleagues to join an association",
  "Créer une association exemptée d'impôts": "Setting up an association exempt from tax",
  "Fonder un parti sans déclaration": "Founding a party without a declaration",
  "Elle comprend la liberté négative : personne ne peut être contraint d'adhérer à une association.":
    "It includes the negative freedom: nobody can be compelled to join an association.",
  "Dans quel cas une liberté peut-elle être restreinte en France ?":
    "In what case can a freedom be restricted in France?",
  "Lorsqu'une loi le prévoit pour protéger l'ordre public":
    "When a law provides for it to protect public order",
  "Lorsqu'une majorité de citoyens le souhaite": "When a majority of citizens wish it",
  "Lorsqu'un ministre le décide": "When a minister decides it",
  "Lorsque cela arrange une administration": "When it suits an administration",
  "La restriction doit être prévue par la loi, proportionnée et justifiée par l'ordre public — sécurité, santé publique, droits d'autrui.":
    "The restriction has to be provided for by law, proportionate and justified by public order — safety, public health, the rights of others.",
  "Un message haineux publié sur un réseau social est :":
    "A hateful message posted on social media is:",
  "une infraction, comme s'il avait été dit en public":
    "an offence, just as if it had been said in public",
  "protégé par l'anonymat": "protected by anonymity",
  "une simple opinion": "a mere opinion",
  "sanctionné uniquement par la plateforme": "punished by the platform alone",
  "La loi s'applique en ligne. L'incitation à la haine, l'injure publique et le harcèlement sont punis, l'anonymat n'y change rien.":
    "The law applies online. Incitement to hatred, public insult and harassment are punished, and anonymity changes nothing.",
  "Un employeur peut-il interdire à un salarié d'adhérer à un syndicat ?":
    "Can an employer forbid an employee to join a trade union?",
  "Non, c'est une discrimination interdite": "No, that is unlawful discrimination",
  "Oui, s'il l'écrit dans le contrat": "Yes, if it is written into the contract",
  "Oui, pendant la période d'essai": "Yes, during the probation period",
  "Oui, dans les petites entreprises": "Yes, in small companies",
  "Toute mesure prise contre un salarié en raison de son activité syndicale est une discrimination sanctionnée par la loi.":
    "Any measure taken against an employee because of their union activity is discrimination punished by law.",
  "La liberté de conscience comprend :": "Freedom of conscience includes:",
  "le droit de croire, de ne pas croire et de changer d'avis":
    "the right to believe, not to believe and to change your mind",
  "le droit d'imposer sa croyance aux autres": "the right to impose your belief on others",
  "le droit de refuser d'appliquer la loi": "the right to refuse to apply the law",
  "le droit d'être dispensé de l'école": "the right to be excused from school",
  "Elle porte sur ce que l'on pense et croit, jamais sur le droit de se soustraire à la loi commune.":
    "It covers what you think and believe, never a right to escape the common law.",
  "Quelle liberté la loi de 1881 a-t-elle établie ?":
    "Which freedom did the law of 1881 establish?",
  "La liberté de la presse": "Freedom of the press",
  "La liberté d'association": "Freedom of association",
  "La liberté de culte": "Freedom of worship",
  "La liberté syndicale": "Trade union freedom",
  "La loi du 29 juillet 1881 sur la liberté de la presse. Celle de 1901 concerne les associations, celle de 1905 la laïcité.":
    "The law of 29 July 1881 on freedom of the press. The one of 1901 covers associations, the one of 1905 laïcité.",
  "Peut-on critiquer publiquement le gouvernement en France ?":
    "Can the government be criticised publicly in France?",
  "Non, c'est un outrage": "No, that is an insult to authority",
  "Oui, mais uniquement par écrit": "Yes, but in writing only",
  "Oui, avec l'accord de la préfecture": "Yes, with the prefecture's agreement",
  "Critiquer le pouvoir est le cœur même de la liberté d'expression. Les limites concernent l'injure, la diffamation et l'incitation à la haine, pas la critique politique.":
    "Criticising those in power is the very heart of freedom of expression. The limits cover insult, defamation and incitement to hatred, not political criticism.",
  "En France, les impôts permettent de financer les dépenses publiques. Quelle proposition est correcte ?":
    "In France taxes pay for public spending. Which statement is correct?",
  "Ils financent les écoles, les hôpitaux, la police et la justice":
    "They pay for schools, hospitals, the police and the courts",
  "Ils servent uniquement à payer les fonctionnaires": "They serve only to pay civil servants",
  "Ils sont versés aux entreprises privées": "They are paid to private companies",
  "Ils financent uniquement la défense": "They pay for defence alone",
  "L'impôt paie l'ensemble des services publics : éducation, santé, sécurité, justice, transports, aides sociales.":
    "Tax pays for the whole of the public services: education, health, safety, justice, transport, social support.",
  "Est-ce obligatoire de déclarer ses impôts chaque année en France ?":
    "Is a tax return compulsory every year in France?",
  "Oui, même si l'on n'est pas imposable": "Yes, even if you owe nothing",
  "Non, seulement si l'on gagne beaucoup": "No, only if you earn a lot",
  "Non, l'administration s'en charge seule": "No, the administration handles it alone",
  "Oui, mais une année sur deux": "Yes, but every other year",
  "La déclaration est annuelle et obligatoire. Elle sert aussi à ouvrir des droits — aides au logement, bourses, tarifs sociaux.":
    "The return is yearly and compulsory. It also opens rights — housing support, grants, reduced rates.",
  "Quel est l'un des devoirs principaux d'un citoyen français ?":
    "What is one of the main duties of a French citizen?",
  "Payer ses impôts et respecter la loi": "Paying your taxes and obeying the law",
  "Adhérer à un parti politique": "Joining a political party",
  "Assister à toutes les commémorations": "Attending every commemoration",
  "Pratiquer une religion": "Practising a religion",
  "Respecter la loi, payer l'impôt, porter secours et répondre à une convocation comme juré sont des devoirs civiques.":
    "Obeying the law, paying tax, coming to the aid of others and answering a summons as a juror are civic duties.",
  "À quoi sert la Sécurité sociale ?": "What is the Sécurité sociale for?",
  "À couvrir la maladie, la vieillesse, la famille et les accidents du travail":
    "Covering illness, old age, the family and accidents at work",
  "À financer les partis politiques": "Funding political parties",
  "À payer les impôts locaux": "Paying local taxes",
  "À assurer les biens et les logements": "Insuring goods and homes",
  "Créée en 1945, elle mutualise les risques de la vie : santé, retraite, famille, accidents du travail.":
    "Created in 1945, it spreads the risks of life across everyone: health, retirement, family, accidents at work.",
  "Un service public doit traiter les usagers :":
    "A public service has to treat the people who use it:",
  "de la même façon, sans distinction d'origine ni de religion":
    "in the same way, without distinction of origin or religion",
  "en priorité selon leur ancienneté dans la commune":
    "in order of how long they have lived in the commune",
  "selon le montant de leurs impôts": "according to how much tax they pay",
  "selon leur nationalité": "according to their nationality",
  "L'égalité de traitement est un principe du service public, avec la neutralité et la continuité.":
    "Equal treatment is a principle of the public service, along with neutrality and continuity.",
  "Où s'inscrit-on sur les listes électorales quand on n'a pas d'accès à internet ?":
    "Where do you register on the electoral roll when you have no internet access?",
  "À la mairie de son domicile": "At the town hall where you live",
  "Au tribunal": "At the court",
  "En ligne ou, sans internet, directement à la mairie de la commune où l'on habite.":
    "Online or, without internet, straight at the town hall of the commune where you live.",
  "Que se passe-t-il si l'on ne déclare pas ses revenus ?":
    "What happens if you do not declare your income?",
  "On s'expose à des pénalités et, dans les cas graves, à des poursuites":
    "You face penalties and, in serious cases, prosecution",
  "Rien, la déclaration est facultative": "Nothing, the return is optional",
  "On perd son droit de vote": "You lose your right to vote",
  "On est automatiquement exonéré": "You are exempted automatically",
  "Le défaut de déclaration entraîne des majorations, et la fraude fiscale est un délit.":
    "Failing to file brings surcharges, and tax fraud is a criminal offence.",
  "Qui finance les écoles publiques, les hôpitaux et la police ?":
    "Who pays for state schools, hospitals and the police?",
  "L'impôt payé par les contribuables": "The tax paid by taxpayers",
  "Les dons des entreprises": "Donations from companies",
  "L'Union européenne seule": "The European Union alone",
  "Les cotisations des syndicats": "Trade union subscriptions",
  "L'impôt et les cotisations sociales financent les services publics. C'est la traduction concrète de la fraternité.":
    "Tax and social contributions pay for the public services. That is fraternity in concrete form.",
  "La continuité du service public signifie :": "The continuity of the public service means:",
  "qu'il fonctionne sans interruption, avec un service minimum si nécessaire":
    "that it runs without interruption, with a minimum service where necessary",
  "qu'il ne change jamais ses horaires": "that it never changes its opening hours",
  "que les agents ne peuvent pas faire grève": "that its staff cannot strike",
  "que les tarifs restent identiques chaque année": "that its charges stay the same every year",
  "La continuité justifie le service minimum dans certains secteurs, mais n'annule pas le droit de grève des agents.":
    "Continuity justifies a minimum service in certain sectors, but it does not cancel the staff's right to strike.",
  "Quelle démarche ne se fait PAS à la mairie ?": "Which step is NOT taken at the town hall?",
  "La demande d'un titre de séjour": "Applying for a residence permit",
  "La déclaration d'une naissance": "Declaring a birth",
  "L'inscription sur les listes électorales": "Registering on the electoral roll",
  "La demande d'une carte d'identité": "Applying for an identity card",
  "Le titre de séjour relève de la préfecture. L'état civil, les listes électorales et les titres d'identité passent par la mairie.":
    "A residence permit is a matter for the prefecture. The civil register, the electoral roll and identity documents go through the town hall.",
  "Les cotisations sociales prélevées sur un salaire servent à :":
    "The social contributions taken from a wage serve to:",
  "financer la santé, la retraite et les allocations familiales":
    "pay for health care, retirement and family benefits",
  "payer l'impôt sur le revenu": "pay income tax",
  "rémunérer les élus locaux": "pay local elected representatives",
  "financer les campagnes électorales": "pay for election campaigns",
  "Elles alimentent la Sécurité sociale. L'impôt sur le revenu, lui, est distinct et se déclare une fois par an.":
    "They feed the Sécurité sociale. Income tax is separate and is declared once a year.",
  "Que dit l'article 1er de la Constitution française ?":
    "What does article 1 of the French Constitution say?",
  "La France est une République indivisible, laïque, démocratique et sociale":
    "France is an indivisible, secular, democratic and social Republic",
  "La France est une monarchie constitutionnelle": "France is a constitutional monarchy",
  "La France est un État fédéral": "France is a federal state",
  "La France reconnaît une religion officielle": "France recognises an official religion",
  "Quatre adjectifs, dans cet ordre : indivisible, laïque, démocratique et sociale. L'article garantit aussi l'égalité devant la loi sans distinction d'origine, de race ou de religion.":
    "Four adjectives, in that order: indivisible, secular, democratic and social. The article also guarantees equality before the law without distinction of origin, race or religion.",
  "Qu'est-ce que l'État de droit ?": "What is the rule of law?",
  "Un système où tout le monde, y compris l'État, est soumis à la loi":
    "A system where everyone, the state included, is subject to the law",
  "Un système où l'État peut modifier la loi à tout moment":
    "A system where the state can change the law at any moment",
  "Un système où seuls les citoyens sont soumis à la loi":
    "A system where only citizens are subject to the law",
  "Un système où le président décide seul": "A system where the president decides alone",
  "Personne n'est au-dessus des règles. Un citoyen peut faire annuler une décision de l'administration devant un juge.":
    "Nobody is above the rules. A citizen can have a decision of the administration annulled before a judge.",
  "En quelle année la Constitution de la Ve République a-t-elle été adoptée ?":
    "In which year was the Constitution of the Fifth Republic adopted?",
  "1962": "1962",
  "Le 4 octobre 1958. La IVe République datait de 1946 ; 1962 est l'année du passage à l'élection du président au suffrage universel direct.":
    "4 October 1958. The Fourth Republic dated from 1946; 1962 is the year the president began to be elected by direct universal suffrage.",
  "Quelle est l'une des voies possibles pour modifier la Constitution ?":
    "What is one of the possible ways to amend the Constitution?",
  "Le référendum ou le vote du Congrès à la majorité des trois cinquièmes":
    "A referendum, or a vote of the Congress by a three-fifths majority",
  "Une décision du Premier ministre": "A decision of the prime minister",
  "Un vote du Conseil constitutionnel": "A vote of the Conseil constitutionnel",
  "Un décret du président de la République": "A decree of the President of the Republic",
  "Après un vote identique des deux chambres, la révision est approuvée soit par référendum, soit par le Congrès réuni à Versailles.":
    "After both chambers vote it in identical terms, the revision is approved either by referendum or by the Congress meeting at Versailles.",
  "Que signifie le mot « indivisible » dans l'article 1er de la Constitution ?":
    "What does the word « indivisible » mean in article 1 of the Constitution?",
  "Un seul peuple, un seul territoire, une même loi partout":
    "One people, one territory, the same law everywhere",
  "Qu'aucune loi ne peut être abrogée": "That no law can ever be repealed",
  "Que les régions n'existent pas": "That the regions do not exist",
  "Que le territoire ne peut pas être vendu": "That the territory cannot be sold",
  "Il n'existe pas de citoyenneté régionale ni de peuple particulier reconnu à l'intérieur de la République.":
    "There is no regional citizenship and no particular people recognised inside the Republic.",
  "Que signifie « la France est une République sociale » ?":
    "What does it mean that France is a social Republic?",
  "L'État garantit une protection : santé, retraite, aide aux plus fragiles":
    "The state guarantees protection: health care, retirement, help for the most fragile",
  "Tous les revenus sont identiques": "All incomes are the same",
  "L'État possède toutes les entreprises": "The state owns every company",
  "Les associations remplacent les services publics": "Associations replace the public services",
  "Le caractère social se traduit par la Sécurité sociale, l'école gratuite et les aides aux personnes en difficulté.":
    "The social character takes the form of the Sécurité sociale, free schooling and support for people in difficulty.",
  "Qui a inspiré le principe de la séparation des pouvoirs ?":
    "Who inspired the principle of the separation of powers?",
  "Montesquieu": "Montesquieu",
  "Voltaire": "Voltaire",
  "Napoléon Ier": "Napoleon I",
  "Montesquieu, dans De l'esprit des lois (1748). L'idée est de répartir les pouvoirs pour qu'aucun ne devienne absolu.":
    "Montesquieu, in De l'esprit des lois (1748). The idea is to share the powers out so that none becomes absolute.",
  "Le pouvoir de faire la loi s'appelle :": "The power to make the law is called:",
  "le pouvoir législatif": "the legislative power",
  "le pouvoir exécutif": "the executive power",
  "le pouvoir judiciaire": "the judicial power",
  "le pouvoir administratif": "the administrative power",
  "Législatif pour faire la loi, exécutif pour l'appliquer, judiciaire pour juger.":
    "Legislative to make the law, executive to apply it, judicial to judge.",
  "Qui a voulu la Constitution de la Ve République ?":
    "Who wanted the Constitution of the Fifth Republic?",
  "Le général de Gaulle": "General de Gaulle",
  "Georges Pompidou": "Georges Pompidou",
  "Charles de Gaulle, appelé au pouvoir en 1958. La Constitution renforce le rôle du président pour sortir de l'instabilité de la IVe République.":
    "Charles de Gaulle, called to power in 1958. The Constitution strengthens the president's role to escape the instability of the Fourth Republic.",
  "Un citoyen estime qu'une décision de l'administration est illégale. Que peut-il faire ?":
    "A citizen believes a decision of the administration is unlawful. What can they do?",
  "Saisir un juge pour en demander l'annulation": "Go to a judge and ask for it to be annulled",
  "Refuser d'appliquer toute autre décision": "Refuse to comply with every other decision",
  "Cesser de payer ses impôts": "Stop paying their taxes",
  "Rien : l'administration a toujours raison": "Nothing: the administration is always right",
  "C'est exactement ce que garantit l'État de droit : l'administration peut être jugée, et sa décision annulée.":
    "That is exactly what the rule of law guarantees: the administration can be judged, and its decision annulled.",
  "Le Congrès désigne :": "The Congress means:",
  "l'Assemblée nationale et le Sénat réunis à Versailles":
    "the National Assembly and the Senate meeting at Versailles",
  "une réunion du gouvernement": "a meeting of the government",
  "un rassemblement des maires de France": "a gathering of the mayors of France",
  "le Parlement européen": "the European Parliament",
  "Le Congrès réunit les deux chambres pour approuver une révision de la Constitution à la majorité des trois cinquièmes.":
    "The Congress brings the two chambers together to approve a revision of the Constitution by a three-fifths majority.",
  "Qui dirige l'action du gouvernement ?": "Who directs the action of the government?",
  "Le Premier ministre dirige l'action du gouvernement et fait appliquer les lois. Le président de la République est chef de l'État.":
    "The prime minister directs the action of the government and sees that the laws are applied. The President of the Republic is head of state.",
  "Quel est le rôle du président de la République ?":
    "What is the role of the President of the Republic?",
  "Chef de l'État et chef des armées, il nomme le Premier ministre":
    "Head of state and head of the armed forces, he appoints the prime minister",
  "Il vote les lois à l'Assemblée nationale": "He votes the laws in the National Assembly",
  "Il juge les crimes les plus graves": "He tries the most serious crimes",
  "Il gère les collèges et les lycées": "He runs the collèges and the lycées",
  "Il préside le Conseil des ministres, promulgue les lois, nomme le Premier ministre et peut dissoudre l'Assemblée nationale.":
    "He chairs the Council of Ministers, promulgates the laws, appoints the prime minister and can dissolve the National Assembly.",
  "Quel est le rôle du Premier ministre ?": "What is the role of the prime minister?",
  "Diriger l'action du gouvernement et faire appliquer les lois":
    "Directing the action of the government and seeing that the laws are applied",
  "Représenter la France à l'étranger en toutes circonstances":
    "Representing France abroad in all circumstances",
  "Présider le Conseil constitutionnel": "Chairing the Conseil constitutionnel",
  "Élire le président de la République": "Electing the President of the Republic",
  "Il propose les ministres, coordonne leur action et dispose de l'administration. Il est responsable devant l'Assemblée nationale.":
    "He proposes the ministers, coordinates their action and has the administration at his disposal. He answers to the National Assembly.",
  "Qui peut se présenter aux élections présidentielles ?":
    "Who can stand in the presidential election?",
  "Tout Français de 18 ans jouissant de ses droits civils et politiques, avec 500 parrainages":
    "Any French citizen of 18 enjoying their civil and political rights, with 500 sponsorships",
  "Tout résident en France depuis dix ans": "Anyone resident in France for ten years",
  "Seuls les anciens ministres": "Former ministers only",
  "Seuls les députés en exercice": "Sitting deputies only",
  "Nationalité française, 18 ans révolus, droits civils et politiques, inscription sur les listes électorales et 500 parrainages d'élus.":
    "French nationality, 18 years turned, civil and political rights, registration on the electoral roll and 500 sponsorships from elected officials.",
  "Quelle condition est obligatoire pour se présenter à l'élection présidentielle ?":
    "Which condition is compulsory to stand in the presidential election?",
  "Être de nationalité française": "Holding French nationality",
  "Avoir exercé un mandat local": "Having held a local office",
  "Avoir fait des études de droit": "Having studied law",
  "Résider à Paris": "Living in Paris",
  "La nationalité française est indispensable. Le reste — expérience, diplômes, domicile — n'entre pas en compte.":
    "French nationality is indispensable. The rest — experience, qualifications, where you live — does not come into it.",
  "Le Défenseur des droits est :": "The Défenseur des droits is:",
  "une autorité indépendante que toute personne peut saisir":
    "an independent authority anyone can turn to",
  "un ministre du gouvernement": "a minister of the government",
  "un tribunal spécialisé": "a specialised court",
  "un service de la préfecture": "a department of the prefecture",
  "Son indépendance est ce qui lui permet de s'opposer à une administration. Il n'appartient ni au gouvernement ni à la justice.":
    "Its independence is what lets it stand up to an administration. It belongs neither to the government nor to the courts.",
  "Le président de la République peut-il être renversé par une motion de censure ?":
    "Can the President of the Republic be brought down by a motion of censure?",
  "Non : la motion de censure vise le gouvernement, pas le président":
    "No: the motion of censure is aimed at the government, not the president",
  "Oui, par l'Assemblée nationale": "Yes, by the National Assembly",
  "Oui, par le Sénat": "Yes, by the Senate",
  "Oui, par le Conseil constitutionnel": "Yes, by the Conseil constitutionnel",
  "La motion de censure fait tomber le gouvernement. Le président, élu au suffrage universel, n'est pas responsable devant le Parlement.":
    "The motion of censure brings the government down. The president, elected by universal suffrage, does not answer to Parliament.",
  "Qui préside le Conseil des ministres ?": "Who chairs the Council of Ministers?",
  "Le ministre de l'Intérieur": "The minister of the interior",
  "Le président de la République, chaque semaine à l'Élysée. Le Premier ministre y assiste et peut le suppléer exceptionnellement.":
    "The President of the Republic, every week at the Élysée. The prime minister attends and can stand in for him in exceptional cases.",
  "Les ministres sont :": "The ministers are:",
  "nommés par le président sur proposition du Premier ministre":
    "appointed by the president on the prime minister's proposal",
  "élus par les citoyens": "elected by the citizens",
  "désignés par le Conseil constitutionnel": "designated by the Conseil constitutionnel",
  "tirés au sort parmi les députés": "drawn by lot from among the deputies",
  "Ils ne sont jamais élus à leur fonction ministérielle, même lorsqu'ils sont par ailleurs élus locaux ou nationaux.":
    "They are never elected to their ministerial post, even when they hold a local or national mandate elsewhere.",
  "Combien de parrainages d'élus faut-il pour se présenter à l'élection présidentielle ?":
    "How many sponsorships from elected officials are needed to stand in the presidential election?",
  "500": "500",
  "1 000": "1,000",
  "500 parrainages d'élus, provenant d'au moins trente départements ou collectivités différents.":
    "500 sponsorships from elected officials, from at least thirty different départements or territories.",
  "Qui est le chef des armées en France ?": "Who is the head of the armed forces in France?",
  "Le ministre de la Défense": "The minister of defence",
  "Le chef d'état-major": "The chief of the general staff",
  "Le président de la République est chef des armées et garant de l'indépendance nationale.":
    "The President of the Republic is head of the armed forces and the guarantor of national independence.",
  "Qui vote les lois ?": "Who votes the laws?",
  "Le Parlement, c'est-à-dire l'Assemblée nationale et le Sénat":
    "Parliament, that is, the National Assembly and the Senate",
  "Le gouvernement seul": "The government alone",
  "Le président de la République seul": "The President of the Republic alone",
  "Le Parlement vote la loi. Le gouvernement peut proposer un texte, mais il ne le vote pas.":
    "Parliament votes the law. The government can put a text forward, but it does not vote it.",
  "Qui est élu lors des élections législatives ?": "Who is elected in the legislative elections?",
  "Les députés de l'Assemblée nationale": "The deputies of the National Assembly",
  "Les sénateurs": "The senators",
  "Les conseillers municipaux": "The municipal councillors",
  "Les législatives élisent les députés. Les sénateurs sont élus au suffrage indirect par des grands électeurs.":
    "The legislative elections elect the deputies. Senators are elected by indirect suffrage by an electoral college.",
  "Quelle est la durée du mandat des sénateurs ?": "How long is a senator's term?",
  "Six ans, avec un renouvellement par moitié tous les trois ans. Les députés, eux, sont élus pour cinq ans.":
    "Six years, with half the seats renewed every three. Deputies are elected for five.",
  "Comment sont désignés les sénateurs ?": "How are senators chosen?",
  "Au suffrage indirect, par des grands électeurs":
    "By indirect suffrage, by an electoral college",
  "Au suffrage universel direct": "By direct universal suffrage",
  "Par nomination du président": "By appointment by the president",
  "Par tirage au sort": "By drawing lots",
  "Des grands électeurs — députés, conseillers régionaux et départementaux, délégués des conseils municipaux — les élisent.":
    "An electoral college — deputies, regional and departmental councillors, delegates of the municipal councils — elects them.",
  "En cas de désaccord persistant entre les deux chambres, qui a le dernier mot ?":
    "Where disagreement between the two chambers persists, who has the last word?",
  "L'Assemblée nationale": "The National Assembly",
  "Le Sénat": "The Senate",
  "Le gouvernement peut donner le dernier mot à l'Assemblée nationale, qui est élue au suffrage universel direct.":
    "The government can give the last word to the National Assembly, which is elected by direct universal suffrage.",
  "Un texte proposé par le gouvernement s'appelle :":
    "A text put forward by the government is called:",
  "un projet de loi": "un projet de loi, a government bill",
  "une proposition de loi": "une proposition de loi, a private member's bill",
  "un décret": "un décret, a decree",
  "une ordonnance": "une ordonnance, an ordinance",
  "Projet de loi quand il vient du gouvernement, proposition de loi quand il vient de parlementaires.":
    "A projet de loi when it comes from the government, a proposition de loi when it comes from members of parliament.",
  "Que fait le président de la République une fois une loi votée ?":
    "What does the President of the Republic do once a law is voted?",
  "Il la promulgue, puis elle est publiée au Journal officiel":
    "He promulgates it, and then it is published in the Journal officiel",
  "Il la vote une dernière fois": "He votes it one last time",
  "Il la transmet au Conseil constitutionnel pour approbation obligatoire":
    "He sends it to the Conseil constitutionnel for compulsory approval",
  "Il la fait appliquer par les préfets sans la publier":
    "He has the prefects apply it without publishing it",
  "La promulgation la rend exécutoire ; la publication au Journal officiel la rend opposable à tous.":
    "Promulgation makes it enforceable; publication in the Journal officiel makes it binding on everyone.",
  "Combien y a-t-il de députés à l'Assemblée nationale ?":
    "How many deputies are there in the National Assembly?",
  "577": "577",
  "348": "348",
  "700": "700",
  "577 députés, un par circonscription. Le Sénat compte un peu plus de trois cents sénateurs.":
    "577 deputies, one for each constituency. The Senate has a little over three hundred senators.",
  "Où siège l'Assemblée nationale ?": "Where does the National Assembly sit?",
  "Au Palais Bourbon": "At the Palais Bourbon",
  "Au Palais du Luxembourg": "At the Palais du Luxembourg",
  "À l'Élysée": "At the Élysée",
  "À Matignon": "At Matignon",
  "Palais Bourbon pour l'Assemblée, Palais du Luxembourg pour le Sénat. L'Élysée est la résidence du président, Matignon celle du Premier ministre.":
    "The Palais Bourbon for the Assembly, the Palais du Luxembourg for the Senate. The Élysée is the president's residence, Matignon the prime minister's.",
  "Laquelle de ces assemblées peut renverser le gouvernement ?":
    "Which of these chambers can bring the government down?",
  "Seule l'Assemblée nationale peut voter une motion de censure et contraindre le gouvernement à démissionner.":
    "Only the National Assembly can vote a motion of censure and force the government to resign.",
  "Les partis politiques en France :": "Political parties in France:",
  "se forment et exercent leur activité librement":
    "form themselves and go about their activity freely",
  "doivent être autorisés par le ministère de l'Intérieur":
    "have to be authorised by the ministry of the interior",
  "sont limités à quatre": "are limited to four",
  "sont interdits aux personnes étrangères": "are closed to foreigners",
  "La Constitution garantit leur liberté, dans le respect de la souveraineté nationale et de la démocratie.":
    "The Constitution guarantees their freedom, respecting national sovereignty and democracy.",
  "Être juré d'assises est :": "Being a juror at the assizes is:",
  "obligatoire lorsqu'on est tiré au sort": "compulsory once you are drawn by lot",
  "un choix personnel": "a personal choice",
  "réservé aux juristes": "kept for lawyers",
  "un métier rémunéré à plein temps": "a paid full-time job",
  "C'est un devoir civique. Ne pas répondre à la convocation sans motif légitime est sanctionné par une amende.":
    "It is a civic duty. Failing to answer the summons without a legitimate reason is punished with a fine.",
  "Que doit faire un citoyen appelé à être juré dans un procès d'assises ?":
    "What must a citizen called as a juror in an assize trial do?",
  "Se présenter à la date indiquée": "Turn up on the date given",
  "Refuser s'il n'a pas de formation juridique": "Refuse if they have no legal training",
  "Demander l'accord de son employeur avant de répondre":
    "Ask their employer's agreement before answering",
  "Se faire remplacer par un proche": "Send a relative in their place",
  "Il doit se présenter. L'employeur ne peut pas s'y opposer, et l'absence de formation juridique n'est pas un motif d'exemption.":
    "They must turn up. The employer cannot object, and having no legal training is no ground for exemption.",
  "Suite à une interpellation par la police, il est possible de :":
    "After being stopped by the police, you may:",
  "garder le silence, être assisté d'un avocat et prévenir un proche":
    "stay silent, have a lawyer beside you and tell a relative",
  "quitter les lieux immédiatement": "leave the place at once",
  "exiger d'être jugé sur place": "demand to be tried on the spot",
  "refuser de décliner son identité sans conséquence":
    "refuse to give your identity with no consequence",
  "Ce sont les droits notifiés au début d'une garde à vue : silence, avocat, examen médical, information d'un proche.":
    "These are the rights read out at the start of a garde à vue, police custody: silence, a lawyer, a medical examination, a relative informed.",
  "Quelle aide permet aux personnes qui ont des difficultés financières d'avoir un avocat ?":
    "Which support lets people in financial difficulty have a lawyer?",
  "L'allocation de solidarité": "The solidarity allowance",
  "La prime d'activité": "The activity bonus",
  "L'aide juridictionnelle : l'État prend en charge tout ou partie des frais d'avocat et de procédure selon les revenus.":
    "Legal aid: the state covers all or part of the lawyer's and court costs depending on income.",
  "Lequel de ces crimes ou délits peut entraîner la privation des droits civils et politiques par un juge ?":
    "Which of these crimes or offences can lead a judge to take away civil and political rights?",
  "Une condamnation pour corruption ou fraude électorale":
    "A conviction for corruption or electoral fraud",
  "Un excès de vitesse": "Speeding",
  "Un retard de paiement d'impôts": "Paying tax late",
  "Un différend avec son propriétaire": "A dispute with your landlord",
  "Certaines condamnations, notamment pour atteinte à la probité, permettent au juge de prononcer l'inéligibilité et la privation du droit de vote.":
    "Certain convictions, in particular for breach of probity, allow a judge to declare a person ineligible for office and to take away the right to vote.",
  "Une personne est privée de ses droits civils et politiques pendant 5 ans. Pendant cette période :":
    "A person is deprived of their civil and political rights for 5 years. During that time:",
  "elle ne peut ni voter ni être élue": "they can neither vote nor be elected",
  "elle perd la nationalité française": "they lose French nationality",
  "elle ne peut plus travailler": "they can no longer work",
  "elle n'est plus soumise à la loi": "they are no longer subject to the law",
  "La privation touche les droits politiques. La nationalité, le travail et les obligations légales ne sont pas concernés.":
    "The deprivation touches political rights. Nationality, work and legal obligations are not affected.",
  "Quel tribunal juge les crimes les plus graves ?": "Which court tries the most serious crimes?",
  "La cour d'assises": "The cour d'assises",
  "Le tribunal correctionnel": "The tribunal correctionnel",
  "Le conseil de prud'hommes": "The conseil de prud'hommes",
  "Le tribunal de police": "The tribunal de police",
  "La cour d'assises, avec des jurés citoyens. Le tribunal correctionnel juge les délits, le tribunal de police les contraventions.":
    "The cour d'assises, with citizen jurors. The tribunal correctionnel tries délits, the tribunal de police contraventions.",
  "Qui rend la justice en France ?": "Who delivers justice in France?",
  "Des magistrats indépendants, au nom du peuple français":
    "Independent magistrates, in the name of the French people",
  "Le ministre de la Justice": "The minister of justice",
  "Le préfet du département": "The prefect of the département",
  "L'indépendance de la justice interdit à l'exécutif de dicter une décision. Les jugements sont rendus au nom du peuple français.":
    "The independence of the courts forbids the executive to dictate a decision. Judgments are delivered in the name of the French people.",
  "Le Conseil constitutionnel contrôle également :": "The Conseil constitutionnel also oversees:",
  "la régularité des élections nationales et des référendums":
    "the regularity of national elections and referendums",
  "les décisions des tribunaux correctionnels": "the decisions of the tribunaux correctionnels",
  "les comptes des communes": "the accounts of the communes",
  "les contrats de travail": "employment contracts",
  "Il veille à la conformité des lois à la Constitution et à la régularité des scrutins nationaux.":
    "It sees that laws conform to the Constitution and that national ballots are regular.",
  "Un stationnement gênant est :": "Obstructive parking is:",
  "une contravention": "a contravention",
  "un délit": "a délit",
  "un crime": "a crime",
  "une faute civile sans sanction": "a civil wrong with no penalty",
  "C'est l'infraction la plus légère, sanctionnée par une amende.":
    "It is the lightest kind of offence, punished with a fine.",
  "Peut-on faire appel d'une décision de justice ?": "Can a court decision be appealed?",
  "Oui, la plupart des décisions peuvent être réexaminées":
    "Yes, most decisions can be looked at again",
  "Non, un jugement est définitif": "No, a judgment is final",
  "Oui, mais seulement en matière pénale": "Yes, but only in criminal matters",
  "Oui, uniquement avec l'accord du procureur": "Yes, only with the prosecutor's agreement",
  "Le double degré de juridiction permet de faire réexaminer l'affaire par une cour d'appel.":
    "The two levels of jurisdiction allow the case to be re-examined by a court of appeal.",
  "À quel âge peut-on devenir électeur en France ?":
    "At what age can you become a voter in France?",
  "25 ans": "25",
  "18 ans, à condition d'être français, d'être inscrit sur les listes électorales et de jouir de ses droits civils et politiques.":
    "18, provided you are French, registered on the electoral roll and enjoy your civil and political rights.",
  "L'inscription sur les listes électorales est :": "Registration on the electoral roll is:",
  "obligatoire": "compulsory",
  "facultative": "optional",
  "réservée aux propriétaires": "kept for property owners",
  "automatique pour toute personne résidant en France": "automatic for anyone living in France",
  "Elle est obligatoire. L'inscription est automatique à 18 ans pour les jeunes recensés, mais doit être refaite après un déménagement.":
    "It is compulsory. Registration is automatic at 18 for young people on the census, but has to be done again after a move.",
  "Quelle condition est nécessaire pour voter aux élections présidentielles ?":
    "Which condition is needed to vote in the presidential election?",
  "Avoir la nationalité française": "Holding French nationality",
  "Résider en France depuis cinq ans": "Having lived in France for five years",
  "Payer des impôts locaux": "Paying local taxes",
  "Être né en France": "Being born in France",
  "Les présidentielles et les législatives sont réservées aux citoyens français. Les Européens résidant en France votent aux municipales et aux européennes.":
    "The presidential and legislative elections are kept for French citizens. Europeans living in France vote in the local and European elections.",
  "Qui est élu lors des élections municipales ?": "Who is elected in the local elections?",
  "Le maire directement": "The mayor directly",
  "Les députés": "The deputies",
  "Les habitants élisent le conseil municipal ; c'est ensuite le conseil qui élit le maire parmi ses membres.":
    "The inhabitants elect the municipal council; the council then elects the mayor from among its members.",
  "Quelle condition faut-il remplir pour être candidat aux élections municipales ?":
    "Which condition must be met to stand in the local elections?",
  "Avoir 18 ans, ses droits civils et politiques, et un lien avec la commune":
    "Being 18, holding your civil and political rights, and having a tie to the commune",
  "Habiter la commune depuis dix ans": "Having lived in the commune for ten years",
  "Être propriétaire d'un logement": "Owning a home",
  "Avoir déjà exercé un mandat": "Having already held office",
  "Il faut être inscrit sur la liste électorale de la commune ou y être contribuable, et jouir de ses droits civils et politiques.":
    "You have to be on the commune's electoral roll or pay taxes there, and enjoy your civil and political rights.",
  "Parmi ces autorités, laquelle est élue ?": "Which of these office-holders is elected?",
  "Le recteur d'académie": "The rector of the education authority",
  "Le procureur de la République": "The public prosecutor",
  "Le maire est élu par le conseil municipal, lui-même élu. Le préfet, le recteur et le procureur sont nommés.":
    "The mayor is elected by the municipal council, which is itself elected. The prefect, the rector and the prosecutor are appointed.",
  "Un citoyen d'un autre pays de l'Union européenne résidant en France peut voter :":
    "A citizen of another European Union country living in France may vote:",
  "aux élections municipales et européennes": "in the local and European elections",
  "à toutes les élections françaises": "in every French election",
  "aux élections législatives seulement": "in the legislative elections only",
  "à aucune élection en France": "in no election in France",
  "La citoyenneté européenne ouvre le vote municipal et européen dans le pays de résidence, pas les scrutins nationaux.":
    "European citizenship opens the local and European vote in the country of residence, not the national ballots.",
  "Quelles sont les durées du mandat du conseil municipal et du maire ?":
    "How long are the terms of the municipal council and of the mayor?",
  "6 ans pour les deux": "6 years for both",
  "5 ans pour les deux": "5 years for both",
  "6 ans pour le conseil, 5 ans pour le maire": "6 years for the council, 5 for the mayor",
  "5 ans pour le conseil, 6 ans pour le maire": "5 years for the council, 6 for the mayor",
  "Six ans dans les deux cas : le maire est élu par le conseil pour la durée du mandat de celui-ci.":
    "Six years in both cases: the mayor is elected by the council for the length of its own term.",
  "Qui élit les députés européens ?": "Who elects the members of the European Parliament?",
  "Les citoyens des États membres, au suffrage universel direct":
    "The citizens of the member states, by direct universal suffrage",
  "Les gouvernements nationaux": "The national governments",
  "Les députés nationaux": "The national deputies",
  "La Commission européenne": "The European Commission",
  "Depuis 1979, les députés européens sont élus directement par les citoyens de chaque État membre.":
    "Since 1979, members of the European Parliament have been elected directly by the citizens of each member state.",
  "Le référendum permet aux citoyens :": "A referendum lets citizens:",
  "de se prononcer directement sur une question posée":
    "decide directly on a question put to them",
  "d'élire un député supplémentaire": "elect an extra deputy",
  "de destituer un maire": "remove a mayor from office",
  "d'annuler un jugement": "annul a judgment",
  "C'est l'exercice direct de la souveraineté, à côté de l'élection des représentants.":
    "It is the direct exercise of sovereignty, alongside the election of representatives.",
  "Un électeur qui déménage doit :": "A voter who moves house has to:",
  "se réinscrire sur les listes électorales de sa nouvelle commune":
    "register again on the electoral roll of their new commune",
  "ne rien faire, l'inscription suit automatiquement":
    "do nothing, the registration follows automatically",
  "prévenir uniquement la préfecture": "tell the prefecture only",
  "attendre la prochaine élection présidentielle": "wait for the next presidential election",
  "L'inscription est liée à la commune. Sans démarche, l'électeur reste inscrit là où il n'habite plus.":
    "Registration is tied to the commune. Without taking a step, the voter stays registered where they no longer live.",
  "Combien y a-t-il de départements en France ?": "How many départements are there in France?",
  "101": "101",
  "95": "95",
  "83": "83",
  "101 départements, dont cinq d'outre-mer. Mayotte est devenue le 101e en 2011.":
    "101 départements, five of them overseas. Mayotte became the 101st in 2011.",
  "Comment est organisé le découpage administratif de la France ?":
    "How is France divided administratively?",
  "En communes, départements et régions": "Into communes, départements and regions",
  "En cantons et provinces": "Into cantons and provinces",
  "En Länder et arrondissements": "Into Länder and arrondissements",
  "En comtés et districts": "Into counties and districts",
  "Trois niveaux de collectivités territoriales : la commune, le département, la région.":
    "Three levels of local authority: the commune, the département, the region.",
  "Qui représente l'État dans un département ?": "Who represents the state in a département?",
  "Le président du conseil départemental": "The president of the departmental council",
  "Le député": "The deputy",
  "Le préfet est nommé par le président de la République et représente l'État. Les autres sont élus.":
    "The prefect is appointed by the President of the Republic and represents the state. The others are elected.",
  "Qui gère les écoles primaires et maternelles publiques ?":
    "Who runs the state nursery and primary schools?",
  "La commune. Le département gère les collèges, la région les lycées.":
    "The commune. The département runs the collèges, the region the lycées.",
  "Quelle collectivité territoriale est responsable des transports régionaux ?":
    "Which local authority is responsible for regional transport?",
  "L'État": "The state",
  "La région organise les transports régionaux, dont les TER, ainsi que les lycées et la formation professionnelle.":
    "The region organises regional transport, the TER trains among it, as well as the lycées and vocational training.",
  "Quelles sont les fonctions du maire ?": "What are the mayor's functions?",
  "Diriger la commune, célébrer les mariages et tenir l'état civil":
    "Running the commune, celebrating marriages and keeping the civil register",
  "Voter les lois nationales": "Voting the national laws",
  "Juger les litiges entre habitants": "Judging disputes between inhabitants",
  "Le maire est à la fois exécutif de la commune, officier d'état civil et officier de police judiciaire.":
    "The mayor is at once the executive of the commune, a registrar of civil status and an officer of the judicial police.",
  "Combien y a-t-il de régions en France métropolitaine ?":
    "How many regions are there in mainland France?",
  "22": "22",
  "13 régions métropolitaines depuis la réforme de 2016. Avec l'outre-mer, la France compte 18 régions.":
    "13 mainland regions since the reform of 2016. With the overseas ones, France has 18 regions.",
  "Quel est le 101e département français depuis 2011 ?":
    "Which is the 101st French département, since 2011?",
  "Saint-Martin": "Saint-Martin",
  "Mayotte, dans l'océan Indien. La Réunion et la Guyane étaient départements depuis 1946.":
    "Mayotte, in the Indian Ocean. La Réunion and Guyane had been départements since 1946.",
  "Le conseil municipal est élu pour :": "The municipal council is elected for:",
  "Six ans, comme le maire qu'il élit ensuite en son sein.":
    "Six years, like the mayor it then elects from among its own members.",
  "Un ressortissant d'un autre pays de l'Union européenne peut-il être maire en France ?":
    "Can a national of another European Union country be mayor in France?",
  "Non, mais il peut être conseiller municipal": "No, but they can be a municipal councillor",
  "Oui, sans condition": "Yes, with no condition",
  "Non, il ne peut pas non plus être conseiller": "No, and they cannot be a councillor either",
  "Oui, après dix ans de résidence": "Yes, after ten years of residence",
  "Il peut siéger au conseil municipal, mais les fonctions de maire et d'adjoint sont réservées aux citoyens français.":
    "They can sit on the municipal council, but the posts of mayor and deputy mayor are kept for French citizens.",
  "Qui gère les lycées publics ?": "Who runs the state lycées?",
  "Le rectorat seul": "The rectorat alone",
  "La région construit et entretient les lycées ; l'État reste responsable des enseignants et des programmes.":
    "The region builds and maintains the lycées; the state stays responsible for the teachers and the curriculum.",
  "Où est le siège du Parlement européen ?": "Where does the European Parliament have its seat?",
  "Strasbourg est le siège officiel du Parlement européen. La Commission siège à Bruxelles, la BCE à Francfort.":
    "Strasbourg is the official seat of the European Parliament. The Commission sits in Brussels, the ECB in Frankfurt.",
  "Où est le siège de la Commission européenne ?":
    "Where does the European Commission have its seat?",
  "Bruxelles. La Commission propose les textes européens et veille à leur application.":
    "Brussels. The Commission proposes European texts and sees that they are applied.",
  "En quelle année le traité de Maastricht a-t-il été signé ?":
    "In which year was the Maastricht Treaty signed?",
  "1957": "1957",
  "1979": "1979",
  "1992. Il fonde l'Union européenne et crée la citoyenneté européenne.":
    "1992. It founds the European Union and creates European citizenship.",
  "En quelle année la citoyenneté européenne a-t-elle été créée ?":
    "In which year was European citizenship created?",
  "En 1992, par le traité de Maastricht. Tout ressortissant d'un État membre est aussi citoyen de l'Union.":
    "In 1992, by the Maastricht Treaty. Every national of a member state is also a citizen of the Union.",
  "Quand est célébrée la journée de l'Europe ?": "When is Europe Day celebrated?",
  "Le 9 mai": "9 May",
  "Le 8 mai": "8 May",
  "Le 9 novembre": "9 November",
  "Le 9 mai, anniversaire de la déclaration Schuman de 1950. Le 8 mai est la victoire de 1945.":
    "9 May, the anniversary of the Schuman declaration of 1950. 8 May is the victory of 1945.",
  "De quoi est composé le drapeau européen ?": "What is the European flag made of?",
  "De douze étoiles dorées en cercle sur fond bleu":
    "Twelve golden stars in a circle on a blue ground",
  "De vingt-sept étoiles blanches": "Twenty-seven white stars",
  "De trois bandes bleu, blanc, jaune": "Three bands of blue, white and yellow",
  "D'une carte de l'Europe sur fond bleu": "A map of Europe on a blue ground",
  "Douze étoiles, qui ne comptent pas les États membres : le douze est un symbole d'unité et de perfection.":
    "Twelve stars, which do not count the member states: twelve is a symbol of unity and perfection.",
  "Combien d'États font partie de l'Union européenne au 1er janvier 2025 ?":
    "How many states belong to the European Union on 1 January 2025?",
  "28": "28",
  "27 depuis le départ du Royaume-Uni en 2020.": "27 since the United Kingdom left in 2020.",
  "Quelle est la première étape de la construction européenne, en 1951 ?":
    "What is the first step of European construction, in 1951?",
  "La Communauté européenne du charbon et de l'acier": "The European Coal and Steel Community",
  "Le traité de Rome": "The Treaty of Rome",
  "L'espace Schengen": "The Schengen area",
  "La zone euro": "The euro area",
  "La CECA, créée par le traité de Paris de 1951. Le traité de Rome date de 1957.":
    "The ECSC, created by the Treaty of Paris of 1951. The Treaty of Rome dates from 1957.",
  "Qui a composé l'hymne de l'Union européenne ?":
    "Who composed the anthem of the European Union?",
  "Claude Debussy": "Claude Debussy",
  "L'Ode à la joie est extraite de la Neuvième Symphonie de Beethoven. Elle est jouée sans paroles.":
    "The Ode to Joy is taken from Beethoven's Ninth Symphony. It is played without words.",
  "Qui siège au Parlement européen ?": "Who sits in the European Parliament?",
  "Des députés élus par les citoyens des États membres":
    "Members elected by the citizens of the member states",
  "Les ministres des États membres": "The ministers of the member states",
  "Les chefs d'État et de gouvernement": "The heads of state and government",
  "Des fonctionnaires nommés par la Commission": "Officials appointed by the Commission",
  "Des députés européens élus au suffrage universel direct. Les ministres siègent au Conseil de l'Union.":
    "Members of the European Parliament elected by direct universal suffrage. The ministers sit in the Council of the Union.",
  "En quelle année l'euro est-il devenu la monnaie officielle en pièces et en billets en France ?":
    "In which year did the euro become the official currency in coins and notes in France?",
  "Les pièces et les billets sont entrés en circulation le 1er janvier 2002. L'euro existait déjà comme monnaie de compte depuis 1999.":
    "The coins and notes came into circulation on 1 January 2002. The euro already existed as a unit of account from 1999.",
  "Quel traité concerne la construction de l'Union européenne ?":
    "Which treaty concerns the building of the European Union?",
  "Le traité de Maastricht": "The Maastricht Treaty",
  "Le traité de Versailles": "The Treaty of Versailles",
  "Le traité de Vienne": "The Treaty of Vienna",
  "Le traité de Tordesillas": "The Treaty of Tordesillas",
  "Maastricht (1992) fonde l'Union. Versailles (1919) mettait fin à la Première Guerre mondiale.":
    "Maastricht (1992) founds the Union. Versailles (1919) ended the First World War.",
  "Quel est le texte fondateur établissant les droits et les devoirs de chaque citoyen ?":
    "Which is the founding text setting out the rights and duties of every citizen?",
  "Adoptée le 26 août 1789, elle fait partie du bloc de constitutionnalité et a donc encore aujourd'hui valeur de droit.":
    "Adopted on 26 August 1789, it belongs to the bloc de constitutionnalité and so still has the force of law today.",
  "Laquelle de ces citations est inscrite dans la Déclaration des Droits de l'Homme et du Citoyen de 1789 ?":
    "Which of these quotations is written into the Declaration of the Rights of Man and of the Citizen of 1789?",
  "« Les hommes naissent et demeurent libres et égaux en droits »":
    "« Les hommes naissent et demeurent libres et égaux en droits » — men are born and remain free and equal in rights",
  "« La propriété, c'est le vol »": "« La propriété, c'est le vol » — property is theft",
  "« Liberté, Égalité, Fraternité »":
    "« Liberté, Égalité, Fraternité » — liberty, equality, fraternity",
  "« Travail, Famille, Patrie »": "« Travail, Famille, Patrie » — work, family, fatherland",
  "C'est l'article 1er. La devise républicaine, elle, figure dans la Constitution, pas dans la Déclaration.":
    "It is article 1. The republican motto stands in the Constitution, not in the Declaration.",
  "En quelle année la Déclaration des droits de l'homme et du citoyen a-t-elle été adoptée ?":
    "In which year was the Declaration of the Rights of Man and of the Citizen adopted?",
  "Le 26 août 1789, quelques semaines après la prise de la Bastille.":
    "26 August 1789, a few weeks after the storming of the Bastille.",
  "Quelle est la différence entre la Déclaration de 1789 et la Déclaration universelle des droits de l'homme ?":
    "What is the difference between the Declaration of 1789 and the Universal Declaration of Human Rights?",
  "La première est française et date de 1789, la seconde est celle de l'ONU et date de 1948":
    "The first is French and dates from 1789, the second is the UN's and dates from 1948",
  "Ce sont deux noms du même texte": "They are two names for the same text",
  "La première date de 1948, la seconde de 1789":
    "The first dates from 1948, the second from 1789",
  "La seconde n'a jamais été adoptée": "The second was never adopted",
  "Deux textes distincts. La Déclaration universelle a été adoptée par l'ONU en 1948, à Paris.":
    "Two separate texts. The Universal Declaration was adopted by the UN in 1948, in Paris.",
  "Que signifie « la loi est l'expression de la volonté générale » ?":
    "What does « la loi est l'expression de la volonté générale » mean — the law is the expression of the general will?",
  "La loi est faite par les représentants du peuple et vaut pour tous":
    "The law is made by the people's representatives and holds for everyone",
  "La loi change selon l'opinion du moment": "The law changes with the opinion of the moment",
  "La loi ne s'applique qu'aux citoyens": "The law applies only to citizens",
  "La loi est décidée par le gouvernement seul": "The law is decided by the government alone",
  "C'est l'article 6 de la Déclaration : la loi doit être la même pour tous, qu'elle protège ou qu'elle punisse.":
    "It is article 6 of the Declaration: the law must be the same for everyone, whether it protects or punishes.",
  "Les droits fondamentaux appartiennent :": "Fundamental rights belong:",
  "à toute personne, sans condition de nationalité":
    "to every person, with no condition of nationality",
  "aux seuls citoyens français": "to French citizens alone",
  "aux seuls contribuables": "to taxpayers alone",
  "aux seules personnes majeures": "to adults alone",
  "Les droits fondamentaux tiennent à la personne humaine. Les droits politiques, eux, sont liés à la citoyenneté.":
    "Fundamental rights attach to the human person. Political rights are tied to citizenship.",
  "Que garantit l'article 11 de la Déclaration de 1789 ?":
    "What does article 11 of the Declaration of 1789 guarantee?",
  "La libre communication des pensées et des opinions":
    "The free communication of thoughts and opinions",
  "Le droit au logement": "The right to housing",
  "L'article 11 fonde la liberté d'expression, « un des droits les plus précieux de l'homme ».":
    "Article 11 founds freedom of expression, « un des droits les plus précieux de l'homme » — one of the most precious rights of man.",
  "Que signifie être citoyen d'un État ?": "What does it mean to be a citizen of a state?",
  "Avoir sa nationalité, avec les droits politiques et les devoirs qui vont avec":
    "Holding its nationality, with the political rights and duties that go with it",
  "Y résider depuis plus de cinq ans": "Having lived there for more than five years",
  "Y payer ses impôts": "Paying your taxes there",
  "Y être né": "Having been born there",
  "La citoyenneté ouvre le droit de vote, l'éligibilité et l'accès aux emplois publics, et impose les devoirs civiques.":
    "Citizenship opens the right to vote, the right to stand for office and access to public employment, and imposes the civic duties.",
  "Le bloc de constitutionnalité comprend :": "The bloc de constitutionnalité includes:",
  "la Constitution, la Déclaration de 1789 et le préambule de 1946":
    "the Constitution, the Declaration of 1789 and the preamble of 1946",
  "uniquement la Constitution de 1958": "the Constitution of 1958 alone",
  "l'ensemble des lois votées depuis 1958": "every law voted since 1958",
  "les traités européens": "the European treaties",
  "C'est pourquoi un texte de 1789 peut encore aujourd'hui servir à faire annuler une loi.":
    "That is why a text from 1789 can still be used today to have a law annulled.",
  "Dans quelle ville la Déclaration universelle des droits de l'homme a-t-elle été adoptée en 1948 ?":
    "In which city was the Universal Declaration of Human Rights adopted in 1948?",
  "À New York": "In New York",
  "À Genève": "In Geneva",
  "À Paris, au palais de Chaillot, par l'Assemblée générale des Nations unies.":
    "In Paris, at the Palais de Chaillot, by the General Assembly of the United Nations.",
  "La Déclaration de 1789 a-t-elle encore une valeur juridique aujourd'hui ?":
    "Does the Declaration of 1789 still have legal force today?",
  "Oui, elle fait partie du bloc de constitutionnalité":
    "Yes, it belongs to the bloc de constitutionnalité",
  "Non, c'est un texte purement historique": "No, it is a purely historical text",
  "Oui, mais seulement pour les débats parlementaires": "Yes, but only for parliamentary debates",
  "Non, elle a été remplacée en 1958": "No, it was replaced in 1958",
  "Le Conseil constitutionnel s'appuie sur elle pour censurer des lois. Elle est du droit vivant, pas un souvenir.":
    "The Conseil constitutionnel leans on it to strike laws down. It is living law, not a memory.",
  "Qu'est-ce que la citoyenneté numérique ?": "What is digital citizenship?",
  "Appliquer en ligne les mêmes droits et devoirs qu'ailleurs":
    "Applying the same rights and duties online as anywhere else",
  "Le droit d'accéder gratuitement à internet": "The right to free internet access",
  "Le fait de posséder un ordinateur": "Owning a computer",
  "Une carte d'identité électronique": "An electronic identity card",
  "S'informer, s'exprimer et participer en ligne, sans harceler, insulter ni diffuser de fausses informations.":
    "Finding out, speaking out and taking part online, without harassing, insulting or spreading false information.",
  "Un mineur de 14 ans veut s'inscrire sur un réseau social. Que dit la loi ?":
    "A 14-year-old wants to sign up to a social network. What does the law say?",
  "Il lui faut l'accord d'un parent": "They need a parent's agreement",
  "C'est totalement interdit": "It is forbidden altogether",
  "Il peut s'inscrire librement": "They can sign up freely",
  "Il doit attendre 18 ans": "They have to wait until 18",
  "La majorité numérique est fixée à 15 ans. En dessous, l'accord d'un titulaire de l'autorité parentale est requis.":
    "The digital age of majority is set at 15. Below it, the agreement of someone with parental authority is required.",
  "Quel est l'âge de la majorité civile en France ?":
    "What is the age of civil majority in France?",
  "À 18 ans on devient juridiquement responsable : on peut signer un contrat, voter et se marier sans autorisation.":
    "At 18 you become legally responsible: you can sign a contract, vote and marry without permission.",
  "Le droit à la sûreté signifie :": "The right to security of person means:",
  "qu'on ne peut être arrêté que dans les cas et les formes prévus par la loi":
    "that you can be arrested only in the cases and the forms the law provides",
  "que l'État doit assurer la sécurité des biens": "that the state has to keep property safe",
  "qu'on a droit à une assurance": "that you are entitled to insurance",
  "qu'on ne peut jamais être placé en garde à vue": "that you can never be held in police custody",
  "C'est la protection contre l'arbitraire. Toute privation de liberté est encadrée et contrôlée par un juge.":
    "It is the protection against arbitrary power. Every deprivation of liberty is framed by law and watched over by a judge.",
  "Une personne étrangère en situation régulière a-t-elle des droits fondamentaux en France ?":
    "Does a foreign national with legal status have fundamental rights in France?",
  "Oui, les droits fondamentaux valent pour toute personne":
    "Yes, fundamental rights hold for every person",
  "Non, ils sont réservés aux Français": "No, they are kept for French citizens",
  "Oui, mais seulement après cinq ans de résidence": "Yes, but only after five years of residence",
  "Oui, uniquement le droit de propriété": "Yes, the right to property only",
  "Dignité, sûreté, liberté de conscience, accès à la justice : ces droits tiennent à la personne, pas à la nationalité.":
    "Dignity, security of person, freedom of conscience, access to justice: these rights attach to the person, not to nationality.",
  "Le droit d'être élu appartient :": "The right to be elected belongs:",
  "aux citoyens jouissant de leurs droits civils et politiques":
    "to citizens enjoying their civil and political rights",
  "à toute personne résidant en France": "to anyone living in France",
  "aux seuls diplômés": "to graduates alone",
  "aux seuls membres d'un parti": "to party members alone",
  "C'est un droit politique lié à la citoyenneté, et un juge peut le retirer par une peine d'inéligibilité.":
    "It is a political right tied to citizenship, and a judge can take it away with a sentence of ineligibility.",
  "Le harcèlement en ligne est :": "Harassment online is:",
  "un délit puni par la loi": "an offence punished by law",
  "un comportement seulement sanctionné par les plateformes":
    "behaviour punished by the platforms alone",
  "autorisé entre adultes consentants": "allowed between consenting adults",
  "toléré s'il reste anonyme": "tolerated as long as it stays anonymous",
  "Le harcèlement, y compris en ligne, est un délit. L'anonymat n'empêche ni l'enquête ni la condamnation.":
    "Harassment, online included, is an offence. Anonymity stops neither the investigation nor the conviction.",
  "Le droit à un procès équitable comprend :": "The right to a fair trial includes:",
  "être jugé par un tribunal indépendant et pouvoir se défendre":
    "being tried by an independent court and being able to defend yourself",
  "choisir son juge": "choosing your judge",
  "être jugé dans la journée": "being tried within the day",
  "refuser de comparaître": "refusing to appear",
  "Indépendance du tribunal, droits de la défense, publicité des débats et possibilité de faire appel.":
    "The independence of the court, the rights of the defence, hearings held in public and the possibility of appeal.",
  "Qu'est-ce qui distingue un droit fondamental d'un droit politique ?":
    "What sets a fundamental right apart from a political right?",
  "Le droit fondamental vaut pour toute personne, le droit politique pour les citoyens":
    "The fundamental right holds for every person, the political right for citizens",
  "Le droit fondamental est facultatif": "The fundamental right is optional",
  "Le droit politique est plus ancien": "The political right is older",
  "Il n'y a aucune différence": "There is no difference",
  "Voter et être élu supposent la citoyenneté ; la dignité et la sûreté ne supposent rien d'autre qu'être une personne.":
    "Voting and standing for office presuppose citizenship; dignity and security of person presuppose nothing but being a person.",
  "Une administration refuse un service à cause de l'origine d'une personne. C'est :":
    "An administration refuses a service because of a person's origin. That is:",
  "une discrimination interdite par la loi": "discrimination forbidden by law",
  "une décision de gestion normale": "an ordinary management decision",
  "autorisé si le service est saturé": "allowed if the service is overloaded",
  "une simple erreur sans conséquence": "a simple mistake with no consequence",
  "C'est une discrimination. Le Défenseur des droits peut être saisi gratuitement, et une plainte est possible.":
    "It is discrimination. The Défenseur des droits can be approached free of charge, and a complaint is possible.",
  "Diffuser une fausse information pour nuire à quelqu'un est :":
    "Spreading false information to harm somebody is:",
  "sanctionné par la loi": "punished by law",
  "un exercice normal de la liberté d'expression": "an ordinary exercise of freedom of expression",
  "autorisé si la source est citée": "allowed if the source is named",
  "toléré sur les réseaux sociaux": "tolerated on social media",
  "Selon les cas, cela relève de la diffamation, de la dénonciation calomnieuse ou de la diffusion de fausse nouvelle.":
    "Depending on the case, it falls under defamation, false accusation or the spreading of false news.",
  "Quel comportement est un devoir du citoyen ?": "Which behaviour is a citizen's duty?",
  "Respecter la loi et les valeurs de la République":
    "Obeying the law and the values of the Republic",
  "Adhérer à un syndicat": "Joining a trade union",
  "Participer à toutes les manifestations": "Taking part in every demonstration",
  "Assister à la messe du dimanche": "Attending Sunday mass",
  "Respecter la loi, payer l'impôt, porter secours et répondre à une convocation de juré sont des devoirs.":
    "Obeying the law, paying tax, coming to the aid of others and answering a juror's summons are duties.",
  "Un citoyen voit une personne s'effondrer dans la rue. Que doit-il faire ?":
    "A citizen sees somebody collapse in the street. What must they do?",
  "Appeler les secours ou porter assistance s'il le peut sans risque":
    "Call the emergency services, or help if they can do so without risk",
  "Continuer son chemin, ce n'est pas son affaire": "Walk on, it is not their business",
  "Attendre qu'un professionnel passe": "Wait for a professional to come by",
  "Filmer la scène pour prévenir plus tard": "Film the scene and raise the alarm later",
  "Ne rien faire est le délit de non-assistance à personne en danger. Appeler le 15 ou le 112 suffit à remplir l'obligation.":
    "Doing nothing is the offence of non-assistance à personne en danger, failing to assist a person in danger. Calling 15 or 112 is enough to meet the obligation.",
  "À quel âge le recensement citoyen est-il obligatoire pour les jeunes Français ?":
    "At what age is census registration compulsory for young French people?",
  "À 16 ans, en mairie. Il ouvre la convocation à la Journée défense et citoyenneté et l'inscription automatique sur les listes électorales.":
    "At 16, at the town hall. It opens the summons to the Journée défense et citoyenneté and automatic registration on the electoral roll.",
  "Le devoir de solidarité se traduit concrètement par :":
    "In practice the duty of solidarity takes the form of:",
  "l'impôt, les cotisations sociales et l'obligation de porter secours":
    "tax, social contributions and the obligation to come to the aid of others",
  "l'obligation de donner à une association": "an obligation to give to a charity",
  "l'obligation de faire du bénévolat": "an obligation to do voluntary work",
  "l'obligation d'héberger un proche": "an obligation to house a relative",
  "Il n'impose ni don ni bénévolat : il passe par la contribution commune et par l'obligation légale d'assistance.":
    "It imposes neither gift nor volunteering: it runs through the common contribution and the legal obligation to assist.",
  "Un employeur peut-il empêcher un salarié d'exercer sa mission de juré d'assises ?":
    "Can an employer stop an employee from serving as a juror at the assizes?",
  "Non, c'est une obligation légale que l'employeur doit respecter":
    "No, it is a legal obligation the employer has to respect",
  "Oui, s'il a besoin du salarié": "Yes, if they need the employee",
  "Oui, en période de forte activité": "Yes, in a busy period",
  "Oui, si le salarié est en période d'essai": "Yes, if the employee is on probation",
  "Être juré est un devoir civique. L'absence est justifiée de plein droit et ne peut pas être sanctionnée.":
    "Being a juror is a civic duty. The absence is justified as of right and cannot be punished.",
  "Le devoir de mémoire concerne notamment :": "The duty of remembrance covers in particular:",
  "la Shoah, l'esclavage et les guerres mondiales": "the Shoah, slavery and the world wars",
  "l'obligation de conserver ses relevés bancaires": "an obligation to keep your bank statements",
  "l'apprentissage par cœur de l'hymne national": "learning the national anthem by heart",
  "la fréquentation des musées": "going to museums",
  "Commémorations, enseignement et lieux de mémoire : nommer ce qui s'est passé pour que cela ne recommence pas.":
    "Commemorations, teaching and places of remembrance: naming what happened so that it does not begin again.",
  "Voter en France est :": "Voting in France is:",
  "un droit, alors que l'inscription sur les listes est une obligation":
    "a right, while registering on the roll is an obligation",
  "une obligation sanctionnée par une amende": "an obligation enforced with a fine",
  "obligatoire seulement aux présidentielles": "compulsory in the presidential election only",
  "L'inscription est obligatoire, l'acte de voter reste libre. Certains pays voisins font l'inverse ; pas la France.":
    "Registration is compulsory, the act of voting stays free. Some neighbouring countries do the opposite; France does not.",
  "Nul n'est censé ignorer la loi. Qu'est-ce que cela signifie ?":
    "Nobody is deemed to be ignorant of the law. What does that mean?",
  "On ne peut pas invoquer son ignorance pour échapper à une sanction":
    "You cannot plead ignorance to escape a penalty",
  "Chacun doit connaître tous les textes par cœur": "Everyone has to know every text by heart",
  "Seuls les juristes sont responsables": "Only lawyers are responsible",
  "La loi ne s'applique qu'après information personnelle":
    "The law applies only after you have been told personally",
  "La publication au Journal officiel rend la loi opposable à tous, sans notification individuelle.":
    "Publication in the Journal officiel makes the law binding on everyone, with no individual notice.",
  "La Journée défense et citoyenneté est :": "The Journée défense et citoyenneté is:",
  "obligatoire pour les jeunes Français recensés":
    "compulsory for young French people on the census",
  "réservée aux futurs militaires": "kept for future soldiers",
  "remplacée par le service militaire": "replaced by military service",
  "Elle est obligatoire et son attestation est exigée pour passer certains examens, dont le baccalauréat et le permis de conduire.":
    "It is compulsory and its certificate is required to sit certain exams, the baccalauréat and the driving test among them.",
  "Payer ses impôts est :": "Paying your taxes is:",
  "un devoir de tout contribuable": "a duty of every taxpayer",
  "un geste volontaire": "a voluntary gesture",
  "réservé aux personnes nées en France": "kept for people born in France",
  "une contribution demandée tous les cinq ans": "a contribution asked for every five years",
  "La contribution commune est répartie entre tous en raison de leurs facultés — l'article 13 de la Déclaration de 1789 le disait déjà.":
    "The common contribution is shared among everyone according to their means — article 13 of the Declaration of 1789 said as much already.",
  "Respecter les valeurs de la République signifie notamment :":
    "Respecting the values of the Republic means in particular:",
  "respecter la laïcité, l'égalité femmes-hommes et la dignité de chacun":
    "respecting laïcité, equality between women and men and the dignity of everyone",
  "adhérer aux idées du gouvernement": "agreeing with the government's ideas",
  "pratiquer la religion majoritaire": "practising the majority religion",
  "parler exclusivement français chez soi": "speaking only French at home",
  "Ce sont des principes juridiques : liberté de conscience, égalité, dignité, respect de la loi commune.":
    "These are legal principles: freedom of conscience, equality, dignity, respect for the common law.",
  "Dans lequel de ces endroits est-on autorisé à fumer ?":
    "In which of these places may you smoke?",
  "En terrasse ouverte d'un café": "On the open terrace of a café",
  "Dans un restaurant": "In a restaurant",
  "Dans une gare couverte": "In a covered station",
  "Dans une cour d'école": "In a school yard",
  "Il est interdit de fumer dans tous les lieux fermés accueillant du public et dans les établissements scolaires.":
    "Smoking is forbidden in every enclosed place open to the public and in schools.",
  "En France, la conduite sans permis d'une moto est :":
    "In France, riding a motorcycle without a licence is:",
  "une contravention légère": "a light contravention",
  "autorisée en dessous de 125 cm³": "allowed below 125 cc",
  "sans conséquence si l'on est assuré": "of no consequence if you are insured",
  "C'est un délit, puni d'une amende importante et pouvant aller jusqu'à une peine d'emprisonnement.":
    "It is an offence, punished with a heavy fine and possibly with a prison sentence.",
  "Le non-respect du code de la route est :": "Breaking the highway code is:",
  "une infraction sanctionnée": "an offence that is punished",
  "toléré hors agglomération": "tolerated outside built-up areas",
  "sans conséquence pour les piétons": "of no consequence for pedestrians",
  "une simple recommandation": "a mere recommendation",
  "Selon la gravité, c'est une contravention ou un délit : amende, retrait de points, suspension du permis, voire prison.":
    "Depending on how serious it is, it is a contravention or a délit: a fine, points off the licence, suspension, even prison.",
  "Est-ce légal d'être marié à plusieurs personnes en même temps ?":
    "Is it lawful to be married to several people at once?",
  "Non, la polygamie est interdite": "No, polygamy is forbidden",
  "Oui, si le mariage a été célébré à l'étranger": "Yes, if the marriage was celebrated abroad",
  "Oui, avec l'accord des conjoints": "Yes, with the spouses' agreement",
  "Oui, dans certaines communes": "Yes, in certain communes",
  "La bigamie est un délit. Un mariage contracté alors qu'on est déjà marié est nul en France.":
    "Bigamy is an offence. A marriage entered into while already married is void in France.",
  "Pour obtenir une carte d'identité, il faut :": "To obtain an identity card you have to:",
  "en faire la demande en mairie avec un justificatif de domicile et une photo":
    "apply at the town hall with proof of address and a photograph",
  "s'adresser au commissariat": "go to the police station",
  "écrire à la préfecture de région": "write to the regional prefecture",
  "passer un examen": "sit an exam",
  "La demande se fait en mairie, dans une commune équipée du dispositif de recueil. La première demande est gratuite.":
    "The application is made at a town hall, in a commune equipped to take the details. The first application is free.",
  "Le stationnement sur une place réservée aux personnes handicapées est :":
    "Parking in a space reserved for disabled people is:",
  "une infraction lourdement sanctionnée": "an offence that is heavily punished",
  "toléré pendant quelques minutes": "tolerated for a few minutes",
  "autorisé le dimanche": "allowed on Sundays",
  "autorisé si aucune autre place n'est libre": "allowed if no other space is free",
  "L'amende est de plusieurs centaines d'euros, et le véhicule peut être mis en fourrière. La place conditionne l'autonomie de quelqu'un.":
    "The fine runs to several hundred euros, and the vehicle can be towed away. That space is what makes somebody's independence possible.",
  "À partir de quel âge peut-on acheter du tabac en France ?":
    "From what age can you buy tobacco in France?",
  "17 ans": "17",
  "18 ans, comme pour l'alcool. Le commerçant doit demander une pièce d'identité en cas de doute.":
    "18, as for alcohol. The shopkeeper has to ask for identification in case of doubt.",
  "Quelle est la différence entre un délit et une contravention ?":
    "What is the difference between a délit and a contravention?",
  "Le délit est plus grave et relève du tribunal correctionnel":
    "The délit is more serious and belongs to the tribunal correctionnel",
  "La contravention est plus grave": "The contravention is more serious",
  "Le délit ne concerne que les entreprises": "The délit concerns companies only",
  "Il n'y a aucune différence de gravité": "There is no difference in seriousness",
  "Contravention, délit, crime, dans l'ordre croissant. Le tribunal de police, le tribunal correctionnel et la cour d'assises les jugent.":
    "Contravention, délit, crime, in rising order. The tribunal de police, the tribunal correctionnel and the cour d'assises try them.",
  "À quel âge devient-on pénalement majeur en France ?":
    "At what age do you come of age in criminal law in France?",
  "18 ans. En dessous, la justice des mineurs s'applique, avec des peines et une procédure adaptées.":
    "18. Below that, juvenile justice applies, with sentences and a procedure of its own.",
  "Dissimuler entièrement son visage dans l'espace public est :":
    "Covering your face entirely in public space is:",
  "interdit depuis 2010": "forbidden since 2010",
  "autorisé partout": "allowed everywhere",
  "interdit uniquement dans les administrations": "forbidden in government offices only",
  "autorisé pendant les manifestations": "allowed during demonstrations",
  "La loi de 2010 interdit la dissimulation du visage dans l'espace public, avec des exceptions prévues par le texte.":
    "The law of 2010 forbids covering the face in public space, with exceptions the text provides for.",
  "La première demande d'une carte nationale d'identité est :":
    "A first application for a national identity card is:",
  "gratuite": "free of charge",
  "payante, quel que soit le cas": "chargeable in every case",
  "réservée aux personnes majeures": "kept for adults",
  "faite en préfecture": "made at the prefecture",
  "Elle est gratuite. Seul un renouvellement après perte ou vol donne lieu à un timbre fiscal.":
    "It is free. Only a renewal after loss or theft calls for a tax stamp.",
  "Un collègue tient des propos racistes pendant une réunion. Quelle est la bonne attitude ?":
    "A colleague makes racist remarks during a meeting. What is the right course?",
  "Signaler les faits à la hiérarchie ou aux représentants du personnel":
    "Report it to management or to the staff representatives",
  "Ne rien dire, ce sont ses opinions": "Say nothing, they are his opinions",
  "Répondre par des insultes": "Answer with insults",
  "Quitter l'entreprise": "Leave the company",
  "Les propos racistes sont un délit, et l'employeur a l'obligation de protéger ses salariés. Le Défenseur des droits peut aussi être saisi.":
    "Racist remarks are an offence, and the employer is obliged to protect their staff. The Défenseur des droits can be approached as well.",
  "Un voisin fait beaucoup de bruit tard le soir, régulièrement. Que faire d'abord ?":
    "A neighbour makes a lot of noise late at night, regularly. What should you do first?",
  "Lui en parler calmement, puis saisir le syndic, le bailleur ou la mairie":
    "Speak to them calmly, then turn to the managing agent, the landlord or the town hall",
  "Couper son électricité": "Cut off their electricity",
  "Faire du bruit à son tour": "Make noise back",
  "Déménager sans rien dire": "Move out without a word",
  "On règle d'abord par le dialogue, puis par l'institution compétente. On ne se fait jamais justice soi-même.":
    "You settle it first by talking, then through the competent institution. You never take justice into your own hands.",
  "Une entreprise refuse d'embaucher une candidate parce qu'elle est enceinte. Cette décision est :":
    "A company refuses to hire a candidate because she is pregnant. That decision is:",
  "un choix légitime de gestion": "a legitimate management choice",
  "autorisée dans les petites entreprises": "allowed in small companies",
  "légale si le poste est physique": "lawful if the job is physical",
  "La grossesse fait partie des critères de discrimination interdits. La candidate n'est même pas tenue de la mentionner.":
    "Pregnancy is one of the forbidden grounds of discrimination. The candidate is not even obliged to mention it.",
  "Un agent de mairie refuse de célébrer un mariage parce que les époux ne partagent pas ses convictions. Que dit le droit ?":
    "A town hall official refuses to celebrate a marriage because the couple do not share his convictions. What does the law say?",
  "Il doit célébrer le mariage : le service public est neutre et égal pour tous":
    "He has to celebrate the marriage: the public service is neutral and equal for everyone",
  "Il a le droit de refuser au nom de sa liberté de conscience":
    "He has the right to refuse in the name of his freedom of conscience",
  "Il doit demander l'avis du préfet": "He has to ask the prefect's opinion",
  "Il peut refuser si le maire l'y autorise": "He can refuse if the mayor allows it",
  "La neutralité du service public interdit à un agent de faire dépendre un service de ses convictions personnelles.":
    "The neutrality of the public service forbids an official to make a service depend on their personal convictions.",
  "Un parent demande que sa fille soit dispensée du cours de natation. L'école :":
    "A parent asks for their daughter to be excused from the swimming lesson. The school:",
  "maintient l'obligation : les programmes s'appliquent à tous les élèves":
    "keeps the obligation: the curriculum applies to every pupil",
  "doit accepter la demande": "has to accept the request",
  "doit organiser un cours séparé": "has to arrange a separate lesson",
  "doit demander l'avis de la mairie": "has to ask the town hall's opinion",
  "Les motifs d'absence acceptés sont limités et ne comprennent pas les convictions personnelles. Seul un certificat médical peut dispenser.":
    "The accepted grounds for absence are limited and do not include personal convictions. Only a medical certificate can excuse a pupil.",
  "Un propriétaire refuse de louer un logement à cause du nom de famille du candidat. C'est :":
    "A landlord refuses to let a flat because of the applicant's surname. That is:",
  "une discrimination punie par la loi": "discrimination punished by law",
  "une liberté du propriétaire": "a freedom of the owner",
  "légal si le logement est meublé": "lawful if the flat is furnished",
  "légal si le candidat n'a pas de garant": "lawful if the applicant has no guarantor",
  "Refuser pour un motif tenant à l'origine, réelle ou supposée, est un délit. Un refus doit reposer sur la solvabilité, pas sur le nom.":
    "Refusing on a ground of origin, real or supposed, is an offence. A refusal has to rest on ability to pay, not on a name.",
  "Un salarié constate qu'il est payé en dessous du SMIC. Que peut-il faire ?":
    "An employee finds they are paid below the SMIC. What can they do?",
  "Saisir l'inspection du travail ou le conseil de prud'hommes":
    "Turn to the labour inspectorate or the conseil de prud'hommes",
  "Rien, le contrat a été signé": "Nothing, the contract was signed",
  "Cesser de venir travailler sans prévenir": "Stop coming to work without a word",
  "Attendre la fin de son contrat": "Wait for the contract to end",
  "Aucun contrat ne peut prévoir moins que le SMIC. L'inspection du travail contrôle, les prud'hommes tranchent le litige.":
    "No contract can provide for less than the SMIC. The labour inspectorate checks, the prud'hommes settle the dispute.",
  "Une personne est harcelée en ligne par un compte anonyme. Que peut-elle faire ?":
    "Somebody is harassed online by an anonymous account. What can they do?",
  "Conserver les preuves et porter plainte": "Keep the evidence and make a complaint",
  "Rien, l'anonymat empêche toute action": "Nothing, anonymity blocks any action",
  "Répondre sur le même ton": "Answer in the same tone",
  "Supprimer son compte et oublier": "Delete their account and forget it",
  "Le harcèlement en ligne est un délit. Les captures d'écran servent de preuves et l'enquête peut identifier l'auteur.":
    "Harassment online is an offence. Screenshots serve as evidence and the investigation can identify the author.",
  "Un usager estime qu'une administration l'a mal traité. Quel recours gratuit existe ?":
    "A member of the public believes an administration has treated them badly. What free remedy exists?",
  "Saisir le Défenseur des droits": "Turning to the Défenseur des droits",
  "Écrire au président de la République": "Writing to the President of the Republic",
  "Engager un avocat obligatoirement": "Hiring a lawyer, which is compulsory",
  "Aucun recours n'existe": "No remedy exists",
  "La saisine du Défenseur des droits est gratuite et se fait en ligne, par courrier ou auprès d'un délégué local.":
    "Approaching the Défenseur des droits is free and can be done online, by post or through a local delegate.",
  "Dans une file d'attente à la préfecture, quelqu'un veut passer devant parce qu'il est pressé. Que dit le principe d'égalité ?":
    "In a queue at the prefecture, somebody wants to go ahead because they are in a hurry. What does the principle of equality say?",
  "Chacun est traité dans les mêmes conditions, sans passe-droit":
    "Everyone is treated on the same terms, with no favours",
  "Le plus pressé passe en premier": "Whoever is in the biggest hurry goes first",
  "L'agent décide selon son humeur": "The official decides according to their mood",
  "Les personnes âgées passent toujours après": "Older people always go last",
  "L'égalité de traitement est un principe du service public. Des priorités existent, mais elles sont prévues, pas improvisées.":
    "Equal treatment is a principle of the public service. Priorities do exist, but they are provided for, not improvised.",
  "Deux réponses semblent raisonnables dans une mise en situation. Laquelle choisir ?":
    "Two answers look reasonable in a situation question. Which one to choose?",
  "Celle qui s'adresse à l'institution compétente et respecte l'égalité":
    "The one that turns to the competent institution and respects equality",
  "Celle qui règle l'affaire le plus vite": "The one that settles the matter fastest",
  "Celle qui évite le conflit à tout prix": "The one that avoids conflict at any cost",
  "Celle qui suit l'usage local": "The one that follows local custom",
  "La bonne réponse fait passer le droit commun avant l'arrangement privé, et l'institution avant la justice personnelle.":
    "The right answer puts the common law before a private arrangement, and the institution before taking justice into your own hands.",
  "Quel roi de France a été guillotiné pendant la Révolution française ?":
    "Which king of France was guillotined during the French Revolution?",
  "Louis XVI": "Louis XVI",
  "Louis XIV": "Louis XIV",
  "Charles X": "Charles X",
  "Henri IV": "Henry IV",
  "Louis XVI, en 1793. Louis XIV, le Roi-Soleil, est mort en 1715 ; Henri IV a été assassiné en 1610.":
    "Louis XVI, in 1793. Louis XIV, the Sun King, died in 1715; Henry IV was assassinated in 1610.",
  "En quelle année Napoléon Ier est-il devenu empereur ?":
    "In which year did Napoleon I become emperor?",
  "1799": "1799",
  "1815": "1815",
  "En 1804, la même année que le Code civil. 1799 est le coup d'État du 18 Brumaire, 1815 la défaite de Waterloo.":
    "In 1804, the same year as the Code civil. 1799 is the coup of 18 Brumaire, 1815 the defeat at Waterloo.",
  "Que signifie la date du 14 juillet pour les Français ?":
    "What does the date of 14 July mean to the French?",
  "La fête nationale, qui rappelle 1789 et 1790": "The national day, which recalls 1789 and 1790",
  "L'entrée dans l'Union européenne": "Joining the European Union",
  "Prise de la Bastille le 14 juillet 1789, Fête de la Fédération le 14 juillet 1790. La fête nationale a été instituée en 1880.":
    "The storming of the Bastille on 14 July 1789, the Fête de la Fédération on 14 July 1790. The national day was instituted in 1880.",
  "Quel château célèbre se trouve près de Paris et symbolise le pouvoir royal de Louis XIV ?":
    "Which famous château stands near Paris and stands for the royal power of Louis XIV?",
  "Le château de Chambord": "The château de Chambord",
  "Le château de Fontainebleau": "The château de Fontainebleau",
  "Le château d'Amboise": "The château d'Amboise",
  "Versailles, où Louis XIV installe la cour en 1682 pour tenir la noblesse sous son regard.":
    "Versailles, where Louis XIV settled the court in 1682 to keep the nobility under his eye.",
  "Le Code civil est aussi appelé :": "The Code civil is also called:",
  "le Code Napoléon": "the Code Napoléon",
  "le Code Louis": "the Code Louis",
  "le Code républicain": "the Republican Code",
  "le Code de la Révolution": "the Code of the Revolution",
  "Adopté en 1804 sous Napoléon Ier, il unifie le droit privé et reste la base du droit français.":
    "Adopted in 1804 under Napoleon I, it unifies private law and remains the base of French law.",
  "En quelle année la Première République a-t-elle été proclamée ?":
    "In which year was the First Republic proclaimed?",
  "En septembre 1792, après la chute de la monarchie. La Marseillaise a été écrite la même année.":
    "In September 1792, after the fall of the monarchy. La Marseillaise was written the same year.",
  "Avant 1789, la société française était divisée en :":
    "Before 1789 French society was divided into:",
  "trois ordres : clergé, noblesse et tiers état":
    "three orders: clergy, nobility and third estate",
  "deux classes : riches et pauvres": "two classes: rich and poor",
  "quatre régions autonomes": "four autonomous regions",
  "cinq provinces royales": "five royal provinces",
  "Le tiers état représentait la très grande majorité de la population et payait l'essentiel des impôts.":
    "The third estate was the great majority of the population and paid most of the taxes.",
  "Qu'était la Bastille ?": "What was the Bastille?",
  "Une prison royale devenue symbole de l'arbitraire":
    "A royal prison that had become the symbol of arbitrary rule",
  "Un palais du roi": "A palace of the king",
  "Une cathédrale parisienne": "A cathedral in Paris",
  "Un port militaire": "A naval port",
  "Une forteresse-prison où l'on pouvait être enfermé sur simple ordre du roi. Sa prise, le 14 juillet 1789, a valeur de symbole.":
    "A fortress-prison where a person could be shut away on the king's order alone. Its storming, on 14 July 1789, carries the weight of a symbol.",
  "Qui étaient les penseurs des Lumières ?": "Who were the thinkers of the Enlightenment?",
  "Voltaire, Rousseau, Diderot et Montesquieu": "Voltaire, Rousseau, Diderot and Montesquieu",
  "Molière, Racine et Corneille": "Molière, Racine and Corneille",
  "Monet, Renoir et Cézanne": "Monet, Renoir and Cézanne",
  "Danton, Robespierre et Marat": "Danton, Robespierre and Marat",
  "Les philosophes du XVIIIe siècle qui défendent la raison, la tolérance et la séparation des pouvoirs, et préparent la Révolution.":
    "The eighteenth-century philosophers who defend reason, tolerance and the separation of powers, and prepare the Revolution.",
  "La monarchie absolue signifie que :": "Absolute monarchy means that:",
  "le roi détient tous les pouvoirs": "the king holds every power",
  "le roi partage le pouvoir avec un parlement": "the king shares power with a parliament",
  "le roi est élu": "the king is elected",
  "le roi n'a qu'un rôle religieux": "the king has only a religious role",
  "Le roi de droit divin concentrait le pouvoir de faire la loi, de l'appliquer et de juger.":
    "The king by divine right gathered in one hand the power to make the law, to apply it and to judge.",
  "Le Code civil de 1804 a servi à :": "The Code civil of 1804 served to:",
  "unifier le droit privé pour tout le pays": "unify private law for the whole country",
  "créer la Sécurité sociale": "create the Sécurité sociale",
  "instaurer la laïcité": "establish laïcité",
  "organiser les élections": "organise the elections",
  "Avant lui, le droit variait d'une province à l'autre. Il reste aujourd'hui le socle du droit de la famille, des contrats et de la propriété.":
    "Before it, the law varied from one province to another. It is still today the base of family law, contract law and property law.",
  "Quand a eu lieu la Première Guerre mondiale ?": "When did the First World War take place?",
  "De 1914 à 1918": "From 1914 to 1918",
  "De 1939 à 1945": "From 1939 to 1945",
  "De 1870 à 1871": "From 1870 to 1871",
  "De 1900 à 1910": "From 1900 to 1910",
  "1914-1918. L'armistice du 11 novembre 1918 y met fin, et le 11 novembre est resté férié.":
    "1914-1918. The armistice of 11 November 1918 ended it, and 11 November has stayed a public holiday.",
  "Quand a eu lieu la Seconde Guerre mondiale ?": "When did the Second World War take place?",
  "De 1936 à 1940": "From 1936 to 1940",
  "De 1945 à 1950": "From 1945 to 1950",
  "1939-1945. Le 8 mai commémore la fin de la guerre en Europe.":
    "1939-1945. 8 May commemorates the end of the war in Europe.",
  "Que célèbre-t-on le 8 mai ?": "What is celebrated on 8 May?",
  "La victoire des Alliés et la fin de la guerre en Europe en 1945":
    "The victory of the Allies and the end of the war in Europe in 1945",
  "L'armistice de 1918": "The armistice of 1918",
  "La libération de Paris": "The liberation of Paris",
  "La fête du Travail": "Labour Day",
  "La capitulation de l'Allemagne nazie, le 8 mai 1945. Le 1er mai est la fête du Travail.":
    "The surrender of Nazi Germany, on 8 May 1945. 1 May is Labour Day.",
  "De quand date l'appel à la résistance du général de Gaulle ?":
    "What is the date of General de Gaulle's call to resistance?",
  "Du 18 juin 1940": "18 June 1940",
  "Du 14 juillet 1940": "14 July 1940",
  "Du 8 mai 1945": "8 May 1945",
  "Du 6 juin 1944": "6 June 1944",
  "L'appel du 18 juin 1940, prononcé depuis Londres sur les ondes de la BBC.":
    "The appeal of 18 June 1940, made from London over the BBC.",
  "Dans quelle région est située une partie des plages du débarquement de 1944 ?":
    "In which region are some of the 1944 landing beaches?",
  "En Normandie": "In Normandy",
  "En Bretagne": "In Brittany",
  "En Provence uniquement": "In Provence only",
  "Dans les Hauts-de-France": "In the Hauts-de-France",
  "Le débarquement du 6 juin 1944 a eu lieu sur les plages normandes. Un second débarquement a suivi en Provence en août.":
    "The landing of 6 June 1944 took place on the Normandy beaches. A second landing followed in Provence in August.",
  "À quelle date la ville de Paris a-t-elle été libérée ?": "On what date was Paris liberated?",
  "Le 25 août 1944": "25 August 1944",
  "Le 6 juin 1944": "6 June 1944",
  "Le 8 mai 1945": "8 May 1945",
  "Le 11 novembre 1944": "11 November 1944",
  "Le 25 août 1944, après une insurrection parisienne et l'arrivée de la 2e division blindée du général Leclerc.":
    "25 August 1944, after a rising in the city and the arrival of General Leclerc's 2nd Armoured Division.",
  "Quelle organisation a été créée en 1945 après la Seconde Guerre mondiale ?":
    "Which organisation was created in 1945 after the Second World War?",
  "L'Organisation des Nations unies": "The United Nations Organisation",
  "L'Union européenne": "The European Union",
  "L'OTAN": "NATO",
  "Le Conseil de l'Europe": "The Council of Europe",
  "L'ONU, en 1945. L'OTAN date de 1949, le Conseil de l'Europe de 1949 également, l'Union européenne de 1992.":
    "The UN, in 1945. NATO dates from 1949, the Council of Europe from 1949 as well, the European Union from 1992.",
  "En 1944, qu'est-ce qui a changé pour les femmes en France ?":
    "What changed for women in France in 1944?",
  "Elles ont obtenu le droit de vote": "They won the right to vote",
  "Elles ont obtenu le droit de travailler": "They won the right to work",
  "Elles ont obtenu le droit d'étudier": "They won the right to study",
  "Elles ont obtenu le droit de se marier librement": "They won the right to marry freely",
  "L'ordonnance d'avril 1944 leur accorde le droit de vote et d'éligibilité. Elles votent pour la première fois en 1945.":
    "The ordinance of April 1944 grants them the right to vote and to stand for office. They voted for the first time in 1945.",
  "Depuis quand les Français élisent-ils le président de la République au suffrage universel direct ?":
    "Since when have the French elected the President of the Republic by direct universal suffrage?",
  "Depuis 1962": "Since 1962",
  "Depuis 1946": "Since 1946",
  "Depuis 1958": "Since 1958",
  "Depuis 1981": "Since 1981",
  "Le référendum de 1962 l'a instauré ; la première élection de ce type a eu lieu en 1965.":
    "The referendum of 1962 brought it in; the first election of that kind was held in 1965.",
  "Qui a été président de la Ve République ?": "Who has been a president of the Fifth Republic?",
  "Napoléon III": "Napoleon III",
  "Léon Blum": "Léon Blum",
  "Jules Ferry": "Jules Ferry",
  "Jacques Chirac a été président de 1995 à 2007. Napoléon III fut empereur, Léon Blum et Jules Ferry présidents du Conseil ou ministres.":
    "Jacques Chirac was president from 1995 to 2007. Napoleon III was an emperor; Léon Blum and Jules Ferry were heads of government or ministers.",
  "En quelle année la Constitution actuelle a-t-elle remplacé celle de la IVe République ?":
    "In which year did the present Constitution replace that of the Fourth Republic?",
  "1969": "1969",
  "La Constitution du 4 octobre 1958 fonde la Ve République, en réponse à l'instabilité gouvernementale de la IVe.":
    "The Constitution of 4 October 1958 founds the Fifth Republic, in answer to the governmental instability of the Fourth.",
  "Qui était une figure de la Résistance française pendant la Seconde Guerre mondiale ?":
    "Who was a figure of the French Resistance during the Second World War?",
  "Émile Zola": "Émile Zola",
  "Gustave Eiffel": "Gustave Eiffel",
  "Jean Moulin a unifié les mouvements de résistance en 1943 avant d'être arrêté et torturé à mort. Il repose au Panthéon.":
    "Jean Moulin united the resistance movements in 1943 before being arrested and tortured to death. He rests in the Panthéon.",
  "Qui a aboli l'esclavage en France ?": "Who abolished slavery in France?",
  "Victor Schœlcher, en 1848": "Victor Schœlcher, in 1848",
  "Napoléon Ier, en 1804": "Napoleon I, in 1804",
  "Jules Ferry, en 1881": "Jules Ferry, in 1881",
  "Léon Gambetta, en 1870": "Léon Gambetta, in 1870",
  "Victor Schœlcher a porté le décret d'abolition de 1848. Napoléon avait au contraire rétabli l'esclavage en 1802.":
    "Victor Schœlcher carried the abolition decree of 1848. Napoleon had on the contrary restored slavery in 1802.",
  "Quel était le principal port français impliqué dans la traite négrière au XVIIIe siècle ?":
    "Which was the main French port involved in the slave trade in the eighteenth century?",
  "Marseille": "Marseille",
  "Calais": "Calais",
  "Strasbourg": "Strasbourg",
  "Nantes, devant Bordeaux et La Rochelle. La ville consacre aujourd'hui un mémorial à l'abolition de l'esclavage.":
    "Nantes, ahead of Bordeaux and La Rochelle. The city today keeps a memorial to the abolition of slavery.",
  "Quel célèbre philosophe des Lumières a dénoncé l'esclavage ?":
    "Which famous philosopher of the Enlightenment denounced slavery?",
  "Descartes": "Descartes",
  "Pascal": "Pascal",
  "Machiavel": "Machiavelli",
  "Montesquieu, dans De l'esprit des lois, par une critique ironique restée célèbre. Descartes et Pascal sont antérieurs aux Lumières.":
    "Montesquieu, in De l'esprit des lois, in an ironic passage that has stayed famous. Descartes and Pascal come before the Enlightenment.",
  "Quel pays a été une colonie française ?": "Which country was a French colony?",
  "L'Algérie": "Algeria",
  "Le Brésil": "Brazil",
  "L'Inde entière": "The whole of India",
  "La Grèce": "Greece",
  "L'Algérie, jusqu'en 1962. Le Brésil était portugais ; l'Inde fut surtout britannique, la France n'y ayant que cinq comptoirs.":
    "Algeria, until 1962. Brazil was Portuguese; India was mostly British, France holding only five trading posts there.",
  "En quelle année l'Algérie est-elle devenue indépendante ?":
    "In which year did Algeria become independent?",
  "1954": "1954",
  "1975": "1975",
  "En 1962, après huit ans de guerre commencée en 1954.":
    "In 1962, after eight years of war begun in 1954.",
  "Nier publiquement l'existence de la Shoah est :":
    "Publicly denying the existence of the Shoah is:",
  "une opinion protégée": "a protected opinion",
  "une faute civile sans sanction pénale": "a civil wrong with no criminal penalty",
  "autorisé dans un cadre universitaire": "allowed in a university setting",
  "La contestation de crimes contre l'humanité est un délit. C'est l'une des limites explicites de la liberté d'expression.":
    "Denying crimes against humanity is an offence. It is one of the explicit limits of freedom of expression.",
  "Où repose Jean Moulin ?": "Where does Jean Moulin rest?",
  "Au Panthéon": "In the Panthéon",
  "Aux Invalides": "In the Invalides",
  "À Notre-Dame de Paris": "In Notre-Dame de Paris",
  "Au château de Versailles": "In the château de Versailles",
  "Au Panthéon depuis 1964. Les Invalides abritent notamment le tombeau de Napoléon Ier.":
    "In the Panthéon since 1964. The Invalides hold, among others, the tomb of Napoleon I.",
  "Une première abolition de l'esclavage avait eu lieu en 1794. Que s'est-il passé ensuite ?":
    "A first abolition of slavery took place in 1794. What happened next?",
  "Napoléon l'a rétabli en 1802": "Napoleon restored it in 1802",
  "Elle a été maintenue sans interruption": "It was kept without a break",
  "Elle a été étendue à toute l'Europe": "It was extended to the whole of Europe",
  "Elle n'a jamais été appliquée nulle part": "It was never applied anywhere",
  "Rétabli en 1802, l'esclavage n'a été aboli définitivement qu'en 1848.":
    "Restored in 1802, slavery was not abolished for good until 1848.",
  "Le 10 mai est en France :": "In France 10 May is:",
  "la journée de commémoration de l'abolition de l'esclavage":
    "the day commemorating the abolition of slavery",
  "la fête nationale": "the national day",
  "la journée de la laïcité": "laïcité day",
  "la journée de l'Europe": "Europe Day",
  "La journée nationale des mémoires de la traite, de l'esclavage et de leurs abolitions, en métropole.":
    "The national day of remembrance of the slave trade, of slavery and of their abolition, in mainland France.",
  "Le régime de Vichy pendant la Seconde Guerre mondiale a :":
    "During the Second World War the Vichy regime:",
  "collaboré avec l'Allemagne nazie": "collaborated with Nazi Germany",
  "dirigé la Résistance": "led the Resistance",
  "gouverné depuis Londres": "governed from London",
  "refusé toute coopération avec l'occupant": "refused all cooperation with the occupier",
  "Il a collaboré, notamment aux arrestations et aux déportations de Juifs. La République l'a officiellement reconnu en 1995.":
    "It collaborated, not least in the arrest and deportation of Jews. The Republic acknowledged this officially in 1995.",
  "Quelle chaîne de montagnes est située entre la France et l'Italie ?":
    "Which mountain range lies between France and Italy?",
  "Les Pyrénées": "The Pyrenees",
  "Le Jura": "The Jura",
  "Le Massif central": "The Massif Central",
  "Les Alpes. Les Pyrénées séparent la France de l'Espagne.":
    "The Alps. The Pyrenees separate France from Spain.",
  "Quelle mer ou quel océan borde la France métropolitaine ?":
    "Which sea or ocean borders mainland France?",
  "La mer Méditerranée": "The Mediterranean Sea",
  "La mer Noire": "The Black Sea",
  "La mer Baltique": "The Baltic Sea",
  "L'océan Pacifique": "The Pacific Ocean",
  "La Manche, la mer du Nord, l'océan Atlantique et la mer Méditerranée bordent la métropole.":
    "The Channel, the North Sea, the Atlantic Ocean and the Mediterranean border mainland France.",
  "Quelle est la population approximative de la France en 2025 ?":
    "Roughly what is the population of France in 2025?",
  "Environ 68 millions d'habitants": "About 68 million",
  "Environ 45 millions": "About 45 million",
  "Environ 90 millions": "About 90 million",
  "Environ 55 millions": "About 55 million",
  "Environ 68,6 millions au 1er janvier 2025 : 66,4 en métropole et 2,3 dans les cinq départements d'outre-mer.":
    "About 68.6 million on 1 January 2025: 66.4 in mainland France and 2.3 in the five overseas départements.",
  "Quel est le principal port maritime de France ?": "Which is France's main seaport?",
  "Bordeaux": "Bordeaux",
  "Marseille, sur la Méditerranée, est le premier port français par le tonnage traité.":
    "Marseille, on the Mediterranean, is the first French port by tonnage handled.",
  "Quelle ville française fait partie des dix plus grandes métropoles du pays ?":
    "Which French city is among the ten largest urban areas in the country?",
  "Toulouse": "Toulouse",
  "Chartres": "Chartres",
  "Vannes": "Vannes",
  "Colmar": "Colmar",
  "Paris, Lyon, Marseille, Toulouse, Lille, Bordeaux et Nice figurent parmi les plus grandes aires urbaines.":
    "Paris, Lyon, Marseille, Toulouse, Lille, Bordeaux and Nice are among the largest urban areas.",
  "Quel est le chef-lieu de la région Auvergne-Rhône-Alpes ?":
    "Which is the regional capital of Auvergne-Rhône-Alpes?",
  "Lyon": "Lyon",
  "Grenoble": "Grenoble",
  "Clermont-Ferrand": "Clermont-Ferrand",
  "Saint-Étienne": "Saint-Étienne",
  "Lyon. Clermont-Ferrand était le chef-lieu de l'ancienne région Auvergne avant la fusion de 2016.":
    "Lyon. Clermont-Ferrand was the capital of the old Auvergne region before the merger of 2016.",
  "Quel est le chef-lieu de la région Provence-Alpes-Côte d'Azur ?":
    "Which is the regional capital of Provence-Alpes-Côte d'Azur?",
  "Nice": "Nice",
  "Toulon": "Toulon",
  "Avignon": "Avignon",
  "Marseille, qui est aussi la deuxième ville de France par la population.":
    "Marseille, which is also the second city of France by population.",
  "Quelle région française est réputée pour ses stations de ski ?":
    "Which French region is known for its ski resorts?",
  "Centre-Val de Loire": "Centre-Val de Loire",
  "Les Alpes du Nord concentrent les plus grandes stations. Les Pyrénées, en Occitanie, en comptent également.":
    "The northern Alps hold the largest resorts. The Pyrenees, in Occitanie, have them too.",
  "La Corse est :": "Corsica is:",
  "une île de la Méditerranée qui fait partie de la métropole":
    "an island in the Mediterranean that is part of mainland France",
  "un département d'outre-mer": "an overseas département",
  "un État indépendant": "an independent state",
  "une collectivité située dans l'Atlantique": "a territory in the Atlantic",
  "La Corse est une collectivité de la France métropolitaine, en mer Méditerranée.":
    "Corsica is a territory of mainland France, in the Mediterranean Sea.",
  "Où peut-on voir des peintures préhistoriques en France ?":
    "Where can you see prehistoric paintings in France?",
  "Dans la grotte de Lascaux, en Dordogne": "In the cave of Lascaux, in the Dordogne",
  "Au château de Chambord": "At the château de Chambord",
  "Dans les catacombes de Paris": "In the catacombs of Paris",
  "Au Mont-Saint-Michel": "At Mont-Saint-Michel",
  "Lascaux, découverte en 1940, abrite des peintures vieilles d'environ 17 000 ans. La grotte Chauvet en Ardèche est plus ancienne encore.":
    "Lascaux, discovered in 1940, holds paintings some 17,000 years old. The Chauvet cave in the Ardèche is older still.",
  "Quel fleuve français se jette dans la Méditerranée ?":
    "Which French river flows into the Mediterranean?",
  "Le Rhône. La Seine se jette dans la Manche, la Loire et la Garonne dans l'Atlantique.":
    "The Rhône. The Seine flows into the Channel, the Loire and the Garonne into the Atlantic.",
  "Qu'est-ce que la France d'outre-mer ?": "What is overseas France?",
  "L'ensemble des territoires français situés hors d'Europe":
    "All the French territories outside Europe",
  "Les anciennes colonies devenues indépendantes": "The former colonies that became independent",
  "Les régions frontalières de la métropole": "The border regions of mainland France",
  "Les ambassades françaises à l'étranger": "The French embassies abroad",
  "Leurs habitants sont français et citoyens de l'Union européenne, votent aux mêmes élections et relèvent des mêmes lois.":
    "Their inhabitants are French and citizens of the European Union, vote in the same elections and come under the same laws.",
  "Quelle île fait partie des Antilles françaises ?":
    "Which island is part of the French Antilles?",
  "La Guadeloupe et la Martinique sont aux Antilles. La Réunion et Mayotte sont dans l'océan Indien.":
    "Guadeloupe and Martinique are in the Antilles. La Réunion and Mayotte are in the Indian Ocean.",
  "Quelle île est un département d'outre-mer français ?":
    "Which island is a French overseas département?",
  "Madagascar": "Madagascar",
  "Maurice": "Mauritius",
  "Haïti": "Haiti",
  "La Martinique est un département d'outre-mer. Madagascar, Maurice et Haïti sont des États indépendants.":
    "Martinique is an overseas département. Madagascar, Mauritius and Haiti are independent states.",
  "De quelle ville française décolle la fusée Ariane ?":
    "From which French town does the Ariane rocket lift off?",
  "Kourou, en Guyane": "Kourou, in Guyane",
  "Fort-de-France": "Fort-de-France",
  "Le port spatial européen est à Kourou, en Guyane. La proximité de l'équateur facilite les lancements.":
    "The European spaceport is at Kourou, in Guyane. Being close to the equator makes launches easier.",
  "Quelle île française se trouve au sud-est du continent africain ?":
    "Which French island lies to the south-east of the African continent?",
  "Saint-Pierre-et-Miquelon": "Saint-Pierre-et-Miquelon",
  "La Nouvelle-Calédonie": "New Caledonia",
  "La Réunion, dans l'océan Indien, près de Madagascar et de l'île Maurice.":
    "La Réunion, in the Indian Ocean, near Madagascar and Mauritius.",
  "Combien y a-t-il de départements d'outre-mer ?": "How many overseas départements are there?",
  "5": "5",
  "7": "7",
  "Guadeloupe, Martinique, Guyane, La Réunion et Mayotte.":
    "Guadeloupe, Martinique, Guyane, La Réunion and Mayotte.",
  "Les habitants des départements d'outre-mer :": "The inhabitants of the overseas départements:",
  "sont français et citoyens de l'Union européenne":
    "are French and citizens of the European Union",
  "ont une nationalité distincte": "have a nationality of their own",
  "ne votent pas aux élections nationales": "do not vote in national elections",
  "relèvent d'un droit entièrement séparé": "come under an entirely separate law",
  "Mêmes droits, mêmes devoirs, mêmes élections, avec seulement des adaptations locales prévues par la loi.":
    "The same rights, the same duties, the same elections, with only the local adaptations the law provides for.",
  "La Nouvelle-Calédonie se trouve :": "New Caledonia lies:",
  "dans l'océan Pacifique": "in the Pacific Ocean",
  "dans l'océan Indien": "in the Indian Ocean",
  "dans la mer des Caraïbes": "in the Caribbean Sea",
  "en Atlantique Nord": "in the North Atlantic",
  "Dans le Pacifique Sud, comme la Polynésie française et Wallis-et-Futuna.":
    "In the South Pacific, like French Polynesia and Wallis-et-Futuna.",
  "Saint-Pierre-et-Miquelon se situe :": "Saint-Pierre-et-Miquelon lies:",
  "au large du Canada, dans l'Atlantique Nord": "off Canada, in the North Atlantic",
  "aux Antilles": "in the Antilles",
  "en Méditerranée": "in the Mediterranean",
  "Un archipel au sud de Terre-Neuve, dernier vestige de la Nouvelle-France en Amérique du Nord.":
    "An archipelago south of Newfoundland, the last remnant of New France in North America.",
  "La Guyane est située :": "Guyane lies:",
  "en Amérique du Sud": "in South America",
  "en Afrique": "in Africa",
  "en Asie": "in Asia",
  "en Océanie": "in Oceania",
  "Sur le continent sud-américain, entre le Brésil et le Suriname. C'est le plus vaste département français.":
    "On the South American continent, between Brazil and Suriname. It is the largest French département.",
  "Combien d'habitants vivent dans les cinq départements d'outre-mer ?":
    "How many people live in the five overseas départements?",
  "Environ 2,3 millions": "About 2.3 million",
  "Environ 500 000": "About 500,000",
  "Environ 8 millions": "About 8 million",
  "Environ 15 millions": "About 15 million",
  "Environ 2,3 millions au 1er janvier 2025, sur 68,6 millions d'habitants au total.":
    "About 2.3 million on 1 January 2025, out of 68.6 million inhabitants in all.",
  "Dans quel grand musée parisien est exposée la Joconde ?":
    "In which great Paris museum is the Mona Lisa shown?",
  "Au Louvre": "In the Louvre",
  "Au musée d'Orsay": "In the musée d'Orsay",
  "Au Centre Pompidou": "In the Centre Pompidou",
  "Au musée Rodin": "In the musée Rodin",
  "Au Louvre. Le tableau de Léonard de Vinci est entré dans les collections royales au XVIe siècle.":
    "In the Louvre. Leonardo da Vinci's painting entered the royal collections in the sixteenth century.",
  "Quel peintre célèbre a peint les Nymphéas ?":
    "Which famous painter painted the Nymphéas, the Water Lilies?",
  "Édouard Manet": "Édouard Manet",
  "Claude Monet. Les grands panneaux sont exposés au musée de l'Orangerie, à Paris.":
    "Claude Monet. The great panels are shown in the musée de l'Orangerie, in Paris.",
  "Qui était Molière ?": "Who was Molière?",
  "Un auteur de théâtre du XVIIe siècle": "A playwright of the seventeenth century",
  "Un peintre impressionniste": "An impressionist painter",
  "Un compositeur": "A composer",
  "Un homme politique de la Révolution": "A politician of the Revolution",
  "Le maître de la comédie française. On appelle le français « la langue de Molière ».":
    "The master of French comedy. French is called « la langue de Molière », the language of Molière.",
  "Qui était Charles Baudelaire ?": "Who was Charles Baudelaire?",
  "Un poète du XIXe siècle": "A poet of the nineteenth century",
  "Un sculpteur": "A sculptor",
  "Un roi de France": "A king of France",
  "Un scientifique": "A scientist",
  "Poète, auteur des Fleurs du mal, publié en 1857.":
    "A poet, author of Les Fleurs du mal, published in 1857.",
  "Qui était George Sand ?": "Who was George Sand?",
  "Une romancière du XIXe siècle": "A novelist of the nineteenth century",
  "Un peintre anglais": "An English painter",
  "Un compositeur allemand": "A German composer",
  "Un général de l'Empire": "A general of the Empire",
  "Une femme écrivain, de son vrai nom Aurore Dupin, qui avait choisi un pseudonyme masculin pour être publiée.":
    "A woman writer, Aurore Dupin by her real name, who took a man's pen name in order to be published.",
  "Qui était Marguerite Yourcenar ?": "Who was Marguerite Yourcenar?",
  "La première femme élue à l'Académie française":
    "The first woman elected to the Académie française",
  "Une chanteuse d'opéra": "An opera singer",
  "Écrivaine, élue à l'Académie française en 1980, la première femme à y entrer.":
    "A writer, elected to the Académie française in 1980, the first woman to enter it.",
  "Qui était Marie Curie ?": "Who was Marie Curie?",
  "Une scientifique, deux fois prix Nobel": "A scientist, twice a Nobel prizewinner",
  "Une reine de France": "A queen of France",
  "Physicienne et chimiste, prix Nobel de physique puis de chimie. Elle repose au Panthéon.":
    "A physicist and chemist, Nobel prizewinner in physics and then in chemistry. She rests in the Panthéon.",
  "Qui était Auguste Rodin ?": "Who was Auguste Rodin?",
  "Un peintre": "A painter",
  "Un écrivain": "A writer",
  "Un architecte": "An architect",
  "Sculpteur, auteur du Penseur et du Baiser. Un musée parisien lui est consacré.":
    "A sculptor, who made Le Penseur, The Thinker, and Le Baiser, The Kiss. A museum in Paris is given over to him.",
  "Qui était un célèbre compositeur français ?": "Who was a famous French composer?",
  "Piotr Tchaïkovski": "Pyotr Tchaikovsky",
  "Debussy, comme Ravel et Berlioz. Beethoven était allemand, Verdi italien, Tchaïkovski russe.":
    "Debussy, like Ravel and Berlioz. Beethoven was German, Verdi Italian, Tchaikovsky Russian.",
  "Quel monument historique se trouve sur une île en Normandie ?":
    "Which historic monument stands on an island in Normandy?",
  "Le pont du Gard": "The pont du Gard",
  "La cité de Carcassonne": "The walled city of Carcassonne",
  "Le Mont-Saint-Michel, sur un îlot rocheux dans la baie, classé au patrimoine mondial.":
    "Mont-Saint-Michel, on a rocky islet in the bay, on the world heritage list.",
  "Pendant quelles journées peut-on visiter gratuitement des lieux culturels en France ?":
    "On which days can you visit cultural places free of charge in France?",
  "Les Journées européennes du patrimoine": "The European Heritage Days",
  "Les vacances de Noël": "The Christmas holidays",
  "Le 14 juillet uniquement": "14 July only",
  "La Fête de la musique": "The Fête de la musique",
  "Le troisième week-end de septembre, des lieux habituellement fermés ouvrent gratuitement au public.":
    "On the third weekend of September, places usually closed open free of charge to the public.",
  "Que symbolise le 1er mai en France ?": "What does 1 May stand for in France?",
  "La fête nationale": "The national day",
  "Le 1er mai est la fête du Travail, jour férié et chômé pour la plupart des salariés.":
    "1 May is Labour Day, a public holiday and a day off for most employees.",
  "Quel plat est une spécialité de la cuisine française ?":
    "Which dish is a speciality of French cooking?",
  "Le pot-au-feu": "Pot-au-feu",
  "La paella": "Paella",
  "Le couscous royal marocain": "Moroccan royal couscous",
  "Les spaghettis carbonara": "Spaghetti carbonara",
  "Le pot-au-feu, comme le bœuf bourguignon ou le cassoulet. Le repas gastronomique des Français est inscrit au patrimoine de l'UNESCO.":
    "Pot-au-feu, like bœuf bourguignon or cassoulet. The gastronomic meal of the French is on the UNESCO heritage list.",
  "Qui était Albert Camus ?": "Who was Albert Camus?",
  "Un écrivain et philosophe du XXe siècle": "A writer and philosopher of the twentieth century",
  "Un peintre du XIXe siècle": "A painter of the nineteenth century",
  "Un président de la République": "A President of the Republic",
  "Écrivain et philosophe, prix Nobel de littérature en 1957, auteur de L'Étranger et de La Peste.":
    "A writer and philosopher, Nobel prizewinner in literature in 1957, author of L'Étranger, The Outsider, and La Peste, The Plague.",
  "Quel mariage est reconnu légalement en France ?":
    "Which marriage is recognised in law in France?",
  "Le mariage civil célébré en mairie": "The civil marriage celebrated at the town hall",
  "Le mariage religieux": "The religious marriage",
  "Le mariage célébré chez un notaire": "A marriage celebrated at a notary's",
  "Le mariage déclaré devant témoins": "A marriage declared before witnesses",
  "Seul le mariage civil produit des effets juridiques. Une cérémonie religieuse ne peut avoir lieu qu'après lui.":
    "Only the civil marriage has legal effect. A religious ceremony can take place only after it.",
  "Dans quel cas faut-il déclarer son enfant au service d'état civil ?":
    "In which case must a child be declared to the civil register?",
  "Pour tout enfant né en France, quelle que soit la nationalité des parents":
    "For every child born in France, whatever the parents' nationality",
  "Seulement si les deux parents sont français": "Only if both parents are French",
  "Seulement si l'enfant naît à l'hôpital": "Only if the child is born in hospital",
  "Seulement si les parents sont mariés": "Only if the parents are married",
  "Toute naissance survenue en France est déclarée à la mairie du lieu de naissance.":
    "Every birth that takes place in France is declared at the town hall of the place of birth.",
  "Quand faut-il déclarer son enfant au service d'état civil ?":
    "When must a child be declared to the civil register?",
  "Dans les cinq jours qui suivent la naissance": "Within the five days following the birth",
  "Dans le mois": "Within the month",
  "Dans l'année": "Within the year",
  "Avant le premier anniversaire": "Before the first birthday",
  "Cinq jours, le jour de l'accouchement n'étant pas compté. Passé ce délai, il faut un jugement pour régulariser.":
    "Five days, the day of the birth not counted. After that a court decision is needed to put it right.",
  "Qui peut demander le divorce de personnes mariées ?":
    "Who can ask for the divorce of a married couple?",
  "L'un des deux époux, ou les deux d'un commun accord": "Either spouse, or both by agreement",
  "Uniquement les deux ensemble": "Only the two of them together",
  "Uniquement l'époux qui travaille": "Only the spouse who works",
  "La famille des époux": "The family of the spouses",
  "Le divorce peut être demandé unilatéralement. L'accord de l'autre n'est pas nécessaire pour engager la procédure.":
    "A divorce can be asked for by one side alone. The other's agreement is not needed to begin the procedure.",
  "Quelle est la définition de l'autorité parentale ?":
    "What is the definition of parental authority?",
  "L'ensemble des droits et devoirs pour protéger l'enfant : sécurité, santé, éducation, moralité":
    "All the rights and duties that protect the child: safety, health, education, morals",
  "Le droit de décider seul de la vie de l'enfant": "The right to decide the child's life alone",
  "Le droit de punir physiquement un enfant": "The right to punish a child physically",
  "Le pouvoir du parent le plus âgé": "The power of the older parent",
  "C'est un ensemble de devoirs autant que de droits, exercé dans l'intérêt de l'enfant et sans violence.":
    "It is a body of duties as much as of rights, exercised in the child's interest and without violence.",
  "Quelle action peut réaliser le locataire d'un logement sans l'autorisation du propriétaire ?":
    "What can the tenant of a flat do without the owner's permission?",
  "Repeindre les murs et meubler le logement": "Repaint the walls and furnish the flat",
  "Abattre une cloison": "Knock down a partition wall",
  "Transformer un garage en chambre": "Turn a garage into a bedroom",
  "Changer les fenêtres": "Change the windows",
  "L'entretien et la décoration relèvent du locataire ; toute transformation demande l'accord écrit du propriétaire.":
    "Upkeep and decoration are the tenant's; any alteration needs the owner's written agreement.",
  "Si la machine à laver fournie avec le logement tombe en panne, il est possible de :":
    "If the washing machine supplied with the flat breaks down, you may:",
  "demander au propriétaire de la réparer ou de la remplacer":
    "ask the owner to repair or replace it",
  "l'enlever et déduire son prix du loyer": "take it out and deduct its price from the rent",
  "cesser de payer le loyer": "stop paying the rent",
  "exiger un déménagement immédiat": "demand an immediate move",
  "Un équipement fourni avec le logement est à la charge du propriétaire, sauf si le locataire l'a détérioré.":
    "Equipment supplied with the flat is the owner's responsibility, unless the tenant has damaged it.",
  "Le PACS est :": "The PACS is:",
  "un contrat d'union civile ouvert à tous les couples":
    "a civil union contract open to every couple",
  "un contrat de travail": "an employment contract",
  "un régime de retraite": "a pension scheme",
  "un type de bail d'habitation": "a kind of tenancy agreement",
  "Le pacte civil de solidarité organise la vie commune de deux personnes majeures, avec moins de formalités que le mariage.":
    "The pacte civil de solidarité arranges the shared life of two adults, with fewer formalities than marriage.",
  "Depuis quelle année le mariage entre personnes de même sexe est-il légal en France ?":
    "Since which year has marriage between people of the same sex been lawful in France?",
  "2013": "2013",
  "2021": "2021",
  "Depuis la loi de 2013. Le PACS, ouvert aux couples de même sexe, existait depuis 1999.":
    "Since the law of 2013. The PACS, open to same-sex couples, had existed since 1999.",
  "Un parent frappe régulièrement son enfant pour le punir. Que dit la loi depuis 2019 ?":
    "A parent regularly hits their child as punishment. What has the law said since 2019?",
  "Les violences éducatives sont interdites, quelle que soit leur intensité":
    "Violence in upbringing is forbidden, however slight",
  "C'est autorisé jusqu'à un certain âge": "It is allowed up to a certain age",
  "C'est autorisé si l'autre parent est d'accord": "It is allowed if the other parent agrees",
  "C'est une affaire strictement privée": "It is a strictly private matter",
  "L'autorité parentale s'exerce sans violence physique ni psychologique. Le principe figure dans le Code civil.":
    "Parental authority is exercised without physical or psychological violence. The principle stands in the Code civil.",
  "Où obtient-on un acte de naissance ?": "Where do you get a birth certificate?",
  "À la mairie du lieu de naissance": "At the town hall of the place of birth",
  "La mairie tient les registres de l'état civil et délivre les actes de naissance, de mariage et de décès.":
    "The town hall keeps the civil registers and issues birth, marriage and death certificates.",
  "Auprès de quel organisme faut-il demander le remboursement des frais de santé ?":
    "Which body do you ask to reimburse health costs?",
  "L'Assurance maladie, par l'intermédiaire de la caisse primaire d'assurance maladie (CPAM).":
    "The Assurance maladie, through the caisse primaire d'assurance maladie, the CPAM.",
  "L'inscription à l'Assurance maladie est :": "Registration with the Assurance maladie is:",
  "réservée aux salariés": "kept for employees",
  "renouvelable chaque année": "renewable each year",
  "C'est une affiliation obligatoire, pas un contrat que l'on choisit de signer ou non.":
    "It is a compulsory affiliation, not a contract you choose to sign or not.",
  "À quoi sert une mutuelle santé ?": "What is a mutuelle santé for?",
  "À rembourser ce que l'Assurance maladie ne couvre pas":
    "Reimbursing what the Assurance maladie does not cover",
  "À remplacer l'Assurance maladie": "Replacing the Assurance maladie",
  "À payer les médicaments à la place du patient": "Paying for medicines in the patient's place",
  "À financer les hôpitaux publics": "Paying for the state hospitals",
  "C'est une complémentaire santé, facultative. Beaucoup d'employeurs en proposent une à leurs salariés.":
    "It is a top-up health cover, and optional. Many employers offer one to their staff.",
  "La contraception en France est :": "Contraception in France is:",
  "libre, et gratuite pour les jeunes femmes":
    "free to choose, and free of charge for young women",
  "interdite aux mineures": "forbidden to under-18s",
  "soumise à l'accord du conjoint": "subject to a partner's agreement",
  "réservée aux personnes mariées": "kept for married people",
  "Elle est libre et confidentielle, et prise en charge intégralement pour les femmes jusqu'à 25 ans.":
    "It is free to choose and confidential, and fully covered for women up to 25.",
  "L'interruption volontaire de grossesse est-elle possible en France ?":
    "Is abortion possible in France?",
  "Oui, elle est légale depuis 1975": "Yes, it has been lawful since 1975",
  "Non, elle est interdite": "No, it is forbidden",
  "Oui, mais uniquement à l'étranger": "Yes, but only abroad",
  "Oui, avec l'accord du conjoint": "Yes, with a partner's agreement",
  "Légale depuis la loi Veil de 1975. Depuis 2024, la liberté d'y recourir est garantie par la Constitution.":
    "Lawful since the loi Veil of 1975. Since 2024 the freedom to seek one has been guaranteed by the Constitution.",
  "Le médecin traitant sert à :":
    "The médecin traitant, the doctor you are registered with, serves to:",
  "coordonner les soins et donner droit au meilleur taux de remboursement":
    "coordinate care and open the best rate of reimbursement",
  "délivrer la carte Vitale": "issue the carte Vitale",
  "fixer le prix des consultations": "set the price of consultations",
  "gérer la mutuelle du patient": "manage the patient's mutuelle",
  "Le parcours de soins coordonné passe par lui. Consulter un spécialiste sans passer par lui réduit le remboursement.":
    "The coordinated care pathway runs through them. Seeing a specialist without going through them lowers the reimbursement.",
  "La carte Vitale sert-elle à payer les consultations ?":
    "Does the carte Vitale pay for consultations?",
  "Non, elle atteste des droits et transmet les soins":
    "No, it shows your entitlement and sends on the record of treatment",
  "Oui, c'est une carte de paiement": "Yes, it is a payment card",
  "Oui, mais seulement à la pharmacie": "Yes, but only at the pharmacy",
  "Oui, dans les hôpitaux publics": "Yes, in state hospitals",
  "Elle n'est ni un moyen de paiement ni une pièce d'identité : elle prouve les droits et transmet la feuille de soins.":
    "It is neither a means of payment nor an identity document: it proves entitlement and sends on the record of treatment.",
  "Une personne aux revenus modestes peut bénéficier :": "A person on a low income can have:",
  "de la complémentaire santé solidaire": "the complémentaire santé solidaire",
  "d'une exonération d'impôts automatique": "an automatic exemption from tax",
  "d'une carte Vitale gratuite en plus": "a second, free carte Vitale",
  "d'un médecin traitant imposé": "a doctor assigned to them",
  "La complémentaire santé solidaire prend en charge, gratuitement ou à faible coût, ce que l'Assurance maladie ne rembourse pas.":
    "The complémentaire santé solidaire covers, free or at low cost, what the Assurance maladie does not reimburse.",
  "En quelle année la loi légalisant l'IVG a-t-elle été votée ?":
    "In which year was the law making abortion lawful passed?",
  "1965": "1965",
  "La loi Veil, portée par Simone Veil, alors ministre de la Santé.":
    "The loi Veil, carried by Simone Veil, then minister of health.",
  "Que couvre la Sécurité sociale ?": "What does the Sécurité sociale cover?",
  "La maladie, la vieillesse, la famille et les accidents du travail":
    "Illness, old age, the family and accidents at work",
  "Uniquement les hospitalisations": "Hospital stays only",
  "Uniquement les retraites": "Pensions only",
  "Les dommages causés à un logement": "Damage caused to a home",
  "Quatre branches. Les dommages au logement relèvent d'une assurance privée, pas de la Sécurité sociale.":
    "Four branches. Damage to a home is a matter for private insurance, not for the Sécurité sociale.",
  "Une jeune femme de 17 ans souhaite une contraception. Le professionnel de santé doit :":
    "A young woman of 17 wants contraception. The health professional has to:",
  "la lui délivrer de façon confidentielle": "provide it confidentially",
  "prévenir ses parents": "tell her parents",
  "refuser jusqu'à sa majorité": "refuse until she comes of age",
  "demander l'autorisation de la mairie": "ask the town hall's permission",
  "La délivrance est confidentielle et gratuite pour les mineures. Le secret médical s'applique pleinement.":
    "It is provided confidentially and free of charge to under-18s. Medical confidentiality applies in full.",
  "Quelle est la durée légale du temps de travail par semaine ?":
    "What is the legal working week?",
  "35 heures": "35 hours",
  "39 heures": "39 hours",
  "40 heures": "40 hours",
  "42 heures": "42 hours",
  "35 heures. Au-delà, ce sont des heures supplémentaires, qui donnent lieu à une majoration de salaire ou à un repos.":
    "35 hours. Beyond that it is overtime, which brings either a higher rate of pay or time off.",
  "Quelle est la première démarche à réaliser pour chercher un emploi ?":
    "What is the first step in looking for work?",
  "S'inscrire à France Travail": "Registering with France Travail",
  "Se rendre à la préfecture": "Going to the prefecture",
  "Attendre une offre par courrier": "Waiting for an offer by post",
  "L'inscription à France Travail — l'ancien Pôle emploi — ouvre l'accompagnement, les offres et, sous conditions, l'allocation chômage.":
    "Registering with France Travail — the former Pôle emploi — opens support, job offers and, under conditions, unemployment benefit.",
  "Quels sont les textes qui définissent les règles au travail ?":
    "Which texts set the rules at work?",
  "Le Code du travail, les conventions collectives et le contrat de travail":
    "The Code du travail, the collective agreements and the employment contract",
  "Le Code civil uniquement": "The Code civil alone",
  "Le règlement de la commune": "The commune's by-laws",
  "Les statuts du syndicat": "The union's rules",
  "Trois niveaux qui s'emboîtent, le plus favorable au salarié s'appliquant généralement.":
    "Three levels that fit inside one another, the one most favourable to the employee generally applying.",
  "Qui peut demander un congé parental d'éducation ?": "Who can ask for parental leave?",
  "Le père comme la mère": "The father as well as the mother",
  "La mère uniquement": "The mother only",
  "Le parent qui gagne le moins": "The parent who earns less",
  "Les seuls salariés en contrat à durée indéterminée": "Employees on permanent contracts only",
  "Les deux parents y ont droit, sous condition d'ancienneté, à la naissance ou à l'adoption d'un enfant.":
    "Both parents are entitled to it, subject to length of service, at the birth or the adoption of a child.",
  "Une personne étrangère en situation régulière peut créer son entreprise :":
    "A foreign national with legal status can start a business:",
  "oui, comme toute personne remplissant les conditions":
    "yes, like anyone who meets the conditions",
  "non, c'est réservé aux Français": "no, it is kept for French citizens",
  "seulement après dix ans de résidence": "only after ten years of residence",
  "seulement avec un associé français": "only with a French partner",
  "Le titre de séjour doit permettre l'activité envisagée, mais la nationalité n'est pas une condition en soi.":
    "The residence permit has to allow the activity in question, but nationality is not a condition in itself.",
  "Une femme peut-elle créer son entreprise ?": "Can a woman start a business?",
  "Oui, dans les mêmes conditions qu'un homme": "Yes, on the same terms as a man",
  "Non, sans l'accord de son conjoint": "No, not without her husband's agreement",
  "Seulement dans certains secteurs": "Only in certain sectors",
  "Seulement si elle a plus de 25 ans": "Only if she is over 25",
  "L'égalité entre les femmes et les hommes vaut aussi pour l'entrepreneuriat. Aucune autorisation d'un tiers n'est requise.":
    "Equality between women and men holds for business too. No third party's permission is required.",
  "Est-il possible de licencier une femme enceinte ou en congé maternité en raison de sa grossesse ?":
    "Can a woman who is pregnant or on maternity leave be dismissed because of her pregnancy?",
  "Non, c'est illégal": "No, it is unlawful",
  "Oui, avec un préavis plus long": "Yes, with a longer notice period",
  "Oui, dans les entreprises de moins de dix salariés":
    "Yes, in companies with fewer than ten employees",
  "Oui, si le poste est supprimé": "Yes, if the post is abolished",
  "La grossesse et la maternité sont des motifs de licenciement expressément interdits, et la protection est renforcée pendant le congé.":
    "Pregnancy and maternity are expressly forbidden grounds for dismissal, and the protection is stronger during the leave.",
  "Depuis le 1er juillet 2021, quelle est la durée du congé paternité ?":
    "Since 1 July 2021, how long is paternity leave?",
  "25 jours, auxquels s'ajoutent 3 jours de naissance":
    "25 days, with 3 days of birth leave on top",
  "11 jours": "11 days",
  "6 semaines": "6 weeks",
  "3 jours seulement": "3 days only",
  "25 jours calendaires, portés à 32 pour des naissances multiples, plus les 3 jours de congé de naissance.":
    "25 calendar days, raised to 32 for multiple births, plus the 3 days of birth leave.",
  "À quoi sert l'inspection du travail ?": "What is the labour inspectorate for?",
  "À contrôler l'application du droit du travail dans les entreprises":
    "Checking that employment law is applied in companies",
  "À juger les licenciements": "Judging dismissals",
  "À payer les salaires en cas de faillite": "Paying wages if a company fails",
  "À délivrer les contrats de travail": "Issuing employment contracts",
  "Elle contrôle et peut sanctionner. Les litiges individuels, eux, sont tranchés par le conseil de prud'hommes.":
    "It checks and can punish. Individual disputes are settled by the conseil de prud'hommes.",
  "Quelle conséquence a le travail dissimulé pour le salarié ?":
    "What does undeclared work mean for the employee?",
  "Il perd ses droits à la retraite, au chômage et à la couverture accident":
    "They lose their rights to a pension, to unemployment benefit and to accident cover",
  "Il paie moins d'impôts sans risque": "They pay less tax with no risk",
  "Il conserve tous ses droits": "They keep every right",
  "Il ne peut plus être embauché légalement": "They can never be hired lawfully again",
  "Sans déclaration, il n'y a pas de cotisations — donc ni trimestres de retraite, ni allocation chômage, ni prise en charge d'un accident du travail.":
    "With no declaration there are no contributions — so no pension quarters, no unemployment benefit, no cover for an accident at work.",
  "Un employeur peut-il payer un salarié moins que le SMIC ?":
    "Can an employer pay an employee less than the SMIC?",
  "Non, jamais": "No, never",
  "Oui, pour un temps partiel": "Yes, for part-time work",
  "Oui, si le salarié est d'accord": "Yes, if the employee agrees",
  "Le SMIC est un plancher légal. Aucun accord, même signé par le salarié, ne peut y déroger.":
    "The SMIC is a legal floor. No agreement, even signed by the employee, can go below it.",
  "L'instruction des enfants est obligatoire de :": "Instruction is compulsory for children from:",
  "3 à 16 ans": "3 to 16",
  "6 à 16 ans": "6 to 16",
  "3 à 18 ans": "3 to 18",
  "6 à 18 ans": "6 to 18",
  "De 3 à 16 ans depuis la rentrée 2019, complétée par une obligation de formation de 16 à 18 ans.":
    "From 3 to 16 since the school year 2019, with an obligation of training from 16 to 18 on top.",
  "Jusqu'à quel âge l'école est-elle obligatoire ?": "Up to what age is school compulsory?",
  "14 ans": "14",
  "L'instruction est obligatoire jusqu'à 16 ans ; de 16 à 18 ans, le jeune doit être en formation, en emploi ou en accompagnement.":
    "Instruction is compulsory up to 16; from 16 to 18 a young person has to be in training, in work or in a support scheme.",
  "Auprès de quelle institution les parents inscrivent-ils leurs enfants à l'école publique ?":
    "With which body do parents enrol their children in a state school?",
  "Le rectorat": "The rectorat",
  "Le conseil départemental": "The departmental council",
  "La mairie procède à l'inscription et affecte l'enfant à une école de la commune.":
    "The town hall does the enrolment and assigns the child to a school in the commune.",
  "Quel motif d'absence est accepté par l'école ?":
    "Which reason for absence does the school accept?",
  "La maladie de l'enfant": "The child's illness",
  "Un voyage familial pendant la période scolaire": "A family trip during term time",
  "Le désaccord avec un enseignement": "Disagreement with something taught",
  "Le mauvais temps": "Bad weather",
  "Maladie, maladie contagieuse dans la famille, réunion solennelle de famille, empêchement de transport, absence des responsables.":
    "Illness, a contagious illness in the family, a solemn family occasion, transport failure, the absence of those responsible.",
  "Des parents ne respectent pas l'obligation d'instruction. Quelle sanction maximale risquent-ils ?":
    "Parents do not meet the obligation of instruction. What is the heaviest penalty they risk?",
  "Une amende et, dans les cas les plus graves, une peine d'emprisonnement":
    "A fine and, in the most serious cases, a prison sentence",
  "Un simple rappel à l'ordre": "A simple reminder",
  "La perte des allocations uniquement": "The loss of benefits only",
  "Aucune sanction": "No penalty at all",
  "Le manquement à l'obligation d'instruction est un délit, sanctionné après des étapes de rappel et de mise en demeure.":
    "Failing the obligation of instruction is an offence, punished after steps of reminder and formal notice.",
  "En tant que parent d'élève, il est possible de :": "As the parent of a pupil you may:",
  "se faire élire au conseil d'école ou au conseil d'administration":
    "be elected to the school council or the board",
  "choisir les enseignants de son enfant": "choose your child's teachers",
  "modifier les programmes scolaires": "change the school curriculum",
  "dispenser son enfant d'une matière": "excuse your child from a subject",
  "Les parents élisent leurs représentants chaque année et participent aux instances de l'établissement.":
    "Parents elect their representatives each year and take part in the school's bodies.",
  "Quelle instruction est prévue pour les enfants qui ne parlent pas français ?":
    "What schooling is provided for children who do not speak French?",
  "Un accueil avec des cours de français adaptés, en suivant les autres enseignements":
    "A place with French lessons suited to them, while following the other subjects",
  "Une scolarisation reportée d'un an": "Schooling put off for a year",
  "Un enseignement uniquement dans leur langue": "Teaching in their own language only",
  "Aucun dispositif particulier": "No particular provision",
  "Des dispositifs d'accueil permettent d'apprendre le français tout en suivant le reste de la scolarité.":
    "Reception schemes let them learn French while following the rest of their schooling.",
  "S'agissant de l'accueil des enfants en situation de handicap à l'école, laquelle de ces propositions est vraie ?":
    "On schooling children with a disability, which of these statements is true?",
  "Ils ont droit à être scolarisés en milieu ordinaire avec les aménagements nécessaires":
    "They have the right to be schooled in an ordinary setting with the adjustments they need",
  "Ils doivent être scolarisés dans des établissements séparés":
    "They have to be schooled in separate establishments",
  "Leur scolarisation dépend de l'accord des autres parents":
    "Their schooling depends on the other parents' agreement",
  "Ils sont dispensés d'instruction": "They are excused from instruction",
  "L'école inclusive est un droit : aménagements, matériel adapté et accompagnement humain quand c'est nécessaire.":
    "Inclusive schooling is a right: adjustments, adapted equipment and a human helper where necessary.",
  "Depuis quelle année l'école publique est-elle gratuite ?":
    "Since which year has the state school been free of charge?",
  "La loi Jules Ferry de 1881 rend l'école gratuite ; celle de 1882 la rend obligatoire et laïque.":
    "The Jules Ferry law of 1881 makes school free; the one of 1882 makes it compulsory and secular.",
  "Le lycée mène à :": "The lycée leads to:",
  "au baccalauréat": "the baccalauréat",
  "au brevet": "the brevet",
  "au certificat d'études": "the certificat d'études",
  "au doctorat": "the doctorate",
  "Le baccalauréat s'obtient en fin de lycée ; le brevet marque la fin du collège.":
    "The baccalauréat is taken at the end of the lycée; the brevet marks the end of the collège.",
  "L'instruction obligatoire signifie que :": "Compulsory instruction means that:",
  "l'enfant doit être instruit, à l'école ou, sous conditions, dans la famille":
    "the child has to be taught, at school or, under conditions, at home",
  "l'enfant doit obligatoirement être scolarisé dans une école publique":
    "the child must be enrolled in a state school",
  "l'enfant peut choisir de ne pas apprendre à lire": "the child may choose not to learn to read",
  "les parents doivent enseigner eux-mêmes": "the parents have to teach the child themselves",
  "C'est l'instruction qui est obligatoire, pas l'établissement. L'instruction en famille est soumise à autorisation et à contrôle.":
    "It is the instruction that is compulsory, not the school. Home instruction needs authorisation and is inspected.",
  "Quel numéro d'urgence permet d'appeler la police ?": "Which emergency number calls the police?",
  "119": "119",
  "Le 17 pour la police ou la gendarmerie, le 15 pour le SAMU, le 18 pour les pompiers.":
    "17 for the police or the gendarmerie, 15 for the SAMU ambulance service, 18 for the fire brigade.",
  "Quel numéro d'urgence fonctionne dans toute l'Union européenne ?":
    "Which emergency number works across the European Union?",
  "Le 112 est le numéro d'urgence européen, joignable gratuitement depuis n'importe quel téléphone.":
    "112 is the European emergency number, free to call from any telephone.",
  "Quel numéro appeler en cas d'incendie ?": "Which number do you call in case of fire?",
  "114": "114",
  "Le 18 pour les pompiers. Le 114 est le numéro d'urgence par SMS pour les personnes sourdes ou malentendantes.":
    "18 for the fire brigade. 114 is the emergency number by text for deaf and hard-of-hearing people.",
  "Où demande-t-on un titre de séjour ?": "Where do you apply for a residence permit?",
  "À la CPAM": "At the CPAM",
  "La préfecture, où le préfet représente l'État. La mairie s'occupe de l'état civil et des titres d'identité français.":
    "The prefecture, where the prefect represents the state. The town hall deals with the civil register and French identity documents.",
  "Une administration traite un usager différemment à cause de sa religion. Quel organisme peut-il saisir gratuitement ?":
    "An administration treats somebody differently because of their religion. Which body can they turn to free of charge?",
  "La Cour des comptes": "The Cour des comptes",
  "Le Défenseur des droits est compétent pour les discriminations et les relations avec les services publics.":
    "The Défenseur des droits is competent for discrimination and for relations with the public services.",
  "Quel numéro appeler pour signaler un enfant en danger ?":
    "Which number do you call to report a child in danger?",
  "Le 119, joignable gratuitement et anonymement, 24 heures sur 24.":
    "119, free and anonymous, twenty-four hours a day.",
  "Un usager du service public peut :": "A member of the public using a public service may:",
  "demander une information, obtenir un document et déposer une réclamation":
    "ask for information, obtain a document and lodge a complaint",
  "exiger d'être servi avant les autres": "demand to be served before the others",
  "choisir l'agent qui le reçoit": "choose which official sees them",
  "obtenir un document sans justificatif": "obtain a document with no supporting papers",
  "Le service public doit l'information, le traitement égal et une voie de réclamation. Il ne doit pas de passe-droit.":
    "The public service owes information, equal treatment and a way to complain. It owes no favours.",
  "Le 114 sert à :": "114 is for:",
  "joindre les secours par SMS pour les personnes sourdes ou malentendantes":
    "reaching the emergency services by text, for deaf and hard-of-hearing people",
  "signaler une panne d'électricité": "reporting a power cut",
  "joindre un médecin de garde": "reaching an on-call doctor",
  "déclarer un vol de téléphone": "reporting a stolen telephone",
  "C'est le numéro d'urgence accessible par SMS et par visio, pour toute urgence médicale, policière ou incendie.":
    "It is the emergency number reachable by text and by video, for any medical, police or fire emergency.",
  "Où s'adresser pour une demande de permis de conduire ?":
    "Where do you apply for a driving licence?",
  "Aux services de l'État, en ligne, sous l'autorité de la préfecture":
    "To the state services, online, under the prefecture's authority",
  "Au conseil régional": "To the regional council",
  "Les démarches de permis et de carte grise relèvent de l'État et se font en ligne, la préfecture restant l'autorité compétente.":
    "Licence and vehicle registration matters belong to the state and are done online, the prefecture remaining the competent authority.",
  "France Travail s'occupe :": "France Travail deals with:",
  "de la recherche d'emploi et de l'accompagnement des demandeurs":
    "the search for work and the support of jobseekers",
  "du remboursement des soins": "the reimbursement of health care",
  "de l'état civil": "the civil register",
  "des titres de séjour": "residence permits",
  "C'est l'ancien Pôle emploi. L'inscription est la première démarche pour chercher un emploi.":
    "It is the former Pôle emploi. Registering is the first step in looking for work.",
  "Un agent public refuse de recevoir un usager parce qu'il porte un signe religieux. Cette attitude est :":
    "A public official refuses to see somebody because they are wearing a religious sign. That conduct is:",
  "illégale : la neutralité s'impose à l'agent, pas à l'usager":
    "unlawful: neutrality binds the official, not the member of the public",
  "conforme au principe de laïcité": "in keeping with the principle of laïcité",
  "laissée à l'appréciation de l'agent": "left to the official's judgement",
  "autorisée dans les mairies": "allowed in town halls",
  "La laïcité oblige l'agent à être neutre et à servir tout le monde. Elle n'impose rien à la tenue des usagers.":
    "Laïcité obliges the official to be neutral and to serve everyone. It imposes nothing on what members of the public wear.",
};
