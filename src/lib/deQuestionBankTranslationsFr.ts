/**
 * French for the Leben in Deutschland practice questions.
 *
 * The lesson cards are answered by LEBEN_IN_DEUTSCHLAND_FR. These are the
 * other body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in French and then asked its
 * questions in German.
 *
 * Keyed on the GERMAN source text exactly as it appears in deQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an ss for
 * an ß or a straight quotation mark where the sentence carries the German
 * pair, and the lookup misses in silence. The question renders in German, the
 * tap works, and nothing anywhere reports it.
 *
 * WHAT STAYS GERMAN follows LEBEN_IN_DEUTSCHLAND_FR exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing. The Einbürgerungstest is sat in
 * German and asks for those exact words, so translating them would teach the
 * wrong answer:
 *
 *   - the constitution, the organs and the offices — Grundgesetz, Bundestag,
 *     Bundesrat, Bundesregierung, Bundeskanzler, Bundespräsident,
 *     Bundesverfassungsgericht, Ministerpräsident, Fraktion, Budgetrecht,
 *     Erststimme and Zweitstimme, Volkskammer;
 *   - the counter a reader will actually stand at and the payment named on
 *     the letter — Standesamt, Bürgeramt, Finanzamt, Agentur für Arbeit,
 *     Kindergeld, Elterngeld, Bürgergeld, Arbeitslosengeld, Rundfunkbeitrag;
 *   - what French does have a word for gets it: l'État de droit, la
 *     séparation des pouvoirs, la liberté d'expression, les Länder, and the
 *     wording is the card's wording, not a second invention.
 *
 * The keep list in check-fr-bank-translation was measured against this table
 * before it was written down, not guessed. Two entries deliberately do not
 * carry their German term: "Die erste Bundeskanzlerin" is a wrong answer in a
 * question about Sophie Scholl, where the sentence is about a woman heading a
 * government and not about the office by name.
 *
 * Seventy-two of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that LEBEN_IN_DEUTSCHLAND_FR
 * already answers. Every French table is spread into one object, so a key
 * present in two of them would lose one silently — the later spread would
 * decide both. check-fr-bank-translation measures coverage through
 * translateCourseText, the lookup a reader's tap actually goes through, so
 * those count as answered and are not duplicated here.
 */
export const DE_QUESTION_BANK_FR: Record<string, string> = {
  "Wie heißt die Verfassung der Bundesrepublik Deutschland?":
    "Comment s'appelle la constitution de la République fédérale d'Allemagne ?",
  "Bundesverfassung": "Bundesverfassung",
  "Grundgesetz": "Grundgesetz",
  "Reichsverfassung": "Reichsverfassung",
  "Staatsvertrag": "Staatsvertrag",
  "Sie heißt Grundgesetz. Der Name war 1949 als Provisorium gedacht — bis zur Wiedervereinigung wollte man sich das Wort „Verfassung“ aufheben.":
    "Elle s'appelle Grundgesetz, loi fondamentale. Le nom se voulait provisoire en 1949 — on réservait le mot « constitution » pour la réunification.",
  "Seit wann gilt das Grundgesetz?": "Depuis quand le Grundgesetz est-il en vigueur ?",
  "Seit dem 8. Mai 1945": "Depuis le 8 mai 1945",
  "Seit dem 23. Mai 1949": "Depuis le 23 mai 1949",
  "Seit dem 7. Oktober 1949": "Depuis le 7 octobre 1949",
  "Seit dem 3. Oktober 1990": "Depuis le 3 octobre 1990",
  "23. Mai 1949. Der 7. Oktober 1949 ist die Gründung der DDR, der 3. Oktober 1990 die Wiedervereinigung.":
    "Le 23 mai 1949. Le 7 octobre 1949 est la fondation de la RDA, le 3 octobre 1990 la réunification.",
  "Welches Recht gehört zu den Grundrechten im Grundgesetz?":
    "Lequel de ces droits fait partie des droits fondamentaux du Grundgesetz ?",
  "Das Recht auf ein eigenes Auto": "Le droit d'avoir sa propre voiture",
  "Die Meinungsfreiheit": "La liberté d'expression",
  "Das Recht auf einen Arbeitsplatz beim Staat": "Le droit à un emploi dans la fonction publique",
  "Das Recht auf ein Studium ohne Abschluss": "Le droit à des études sans diplôme",
  "Die Meinungsfreiheit steht in Artikel 5. Die anderen drei sind keine Grundrechte.":
    "La liberté d'expression figure à l'article 5. Les trois autres ne sont pas des droits fondamentaux.",
  "Was sagt Artikel 3 des Grundgesetzes?": "Que dit l'article 3 du Grundgesetz ?",
  "Die Würde des Menschen ist unantastbar": "La dignité de l'être humain est intangible",
  "Alle Menschen sind vor dem Gesetz gleich": "Tous les êtres humains sont égaux devant la loi",
  "Jeder hat das Recht auf Leben": "Chacun a droit à la vie",
  "Die Kunst ist frei": "L'art est libre",
  "Artikel 3 ist der Gleichheitssatz. Die Menschenwürde steht in Artikel 1, die Kunstfreiheit in Artikel 5.":
    "L'article 3 est le principe d'égalité. La dignité humaine figure à l'article 1, la liberté de l'art à l'article 5.",
  "Welche Aussage über die Meinungsfreiheit in Deutschland ist richtig?":
    "Quelle affirmation sur la liberté d'expression en Allemagne est exacte ?",
  "Man darf alles sagen, ohne jede Grenze": "On peut tout dire, sans aucune limite",
  "Sie endet dort, wo Volksverhetzung oder Beleidigung beginnt":
    "Elle s'arrête là où commencent l'incitation à la haine ou l'injure",
  "Sie gilt nur für deutsche Staatsangehörige":
    "Elle ne vaut que pour les ressortissants allemands",
  "Sie gilt nur in privaten Gesprächen": "Elle ne vaut que dans les conversations privées",
  "Meinungsfreiheit ist weit, aber nicht grenzenlos: Volksverhetzung, Beleidigung und Holocaustleugnung sind Straftaten.":
    "La liberté d'expression est large, mais non sans limites : l'incitation à la haine, l'injure et la négation de la Shoah sont des délits.",
  "Wie viele Fragen umfasst der Einbürgerungstest, und wie viele davon betreffen das Bundesland?":
    "Combien de questions comporte le test de naturalisation, et combien portent sur le Land ?",
  "30 Fragen, davon 3 zum Bundesland": "30 questions, dont 3 sur le Land",
  "33 Fragen, davon 3 zum Bundesland": "33 questions, dont 3 sur le Land",
  "33 Fragen, davon 10 zum Bundesland": "33 questions, dont 10 sur le Land",
  "25 Fragen, davon 5 zum Bundesland": "25 questions, dont 5 sur le Land",
  "33 Fragen insgesamt: 30 aus dem bundesweiten Katalog und 3 zum Bundesland, in dem der Test geschrieben wird.":
    "33 questions en tout : 30 tirées du catalogue fédéral et 3 sur le Land où l'on passe le test.",
  "Von wem geht in Deutschland alle Staatsgewalt aus?":
    "De qui émane tout pouvoir d'État en Allemagne ?",
  "Vom Bundespräsidenten": "Du Bundespräsident",
  "Vom Volk": "Du peuple",
  "Von den Parteien": "Des partis",
  "Von den Bundesländern": "Des Länder",
  "Artikel 20: „Alle Staatsgewalt geht vom Volke aus.“ Ausgeübt wird sie durch Wahlen und durch die drei Gewalten.":
    "Article 20 : « tout pouvoir d'État émane du peuple ». Il s'exerce par les élections et par les trois pouvoirs.",
  "Welche Staatsform hat Deutschland?": "Quelle est la forme de l'État allemand ?",
  "Monarchie": "Une monarchie",
  "Diktatur": "Une dictature",
  "Kaiserreich": "Un empire",
  "Eine Republik: Das Staatsoberhaupt wird gewählt, es gibt keinen König und keinen Kaiser.":
    "Une république : le chef de l'État est élu, il n'y a ni roi ni empereur.",
  "Was gehört zur Exekutive?": "Qu'est-ce qui relève de l'exécutif ?",
  "Die Polizei": "La police",
  "Die Polizei führt Gesetze aus und gehört damit zur Exekutive. Bundestag und Bundesrat sind Legislative, die Gerichte Judikative.":
    "La police applique les lois et relève donc de l'exécutif. Le Bundestag et le Bundesrat sont le législatif, les tribunaux le judiciaire.",
  "Was bedeutet „Rechtsstaat“?": "Que signifie « Rechtsstaat », l'État de droit ?",
  "Der Staat kann tun, was er für richtig hält": "L'État peut faire ce qu'il juge bon",
  "Auch der Staat ist an Gesetze gebunden": "L'État lui-même est tenu par les lois",
  "Nur Juristen dürfen Politik machen": "Seuls les juristes ont le droit de faire de la politique",
  "Es gibt besonders viele Gesetze": "Il y a particulièrement beaucoup de lois",
  "Im Rechtsstaat gilt das Gesetz auch für den Staat selbst — und gegen jede staatliche Entscheidung kann man klagen.":
    "Dans l'État de droit, la loi vaut aussi pour l'État lui-même — et contre toute décision de l'État on peut aller en justice.",
  "Was bedeutet „wehrhafte Demokratie“?":
    "Que signifie « wehrhafte Demokratie », la démocratie apte à se défendre ?",
  "Deutschland hat eine starke Armee": "L'Allemagne a une armée forte",
  "Die Demokratie schützt sich vor denen, die sie abschaffen wollen":
    "La démocratie se protège de ceux qui veulent l'abolir",
  "Bürger dürfen sich mit Waffen verteidigen":
    "Les citoyens ont le droit de se défendre par les armes",
  "Der Staat wehrt sich gegen Kritik": "L'État se défend contre la critique",
  "Verfassungsfeindliche Parteien können verboten werden, und der Kern der Verfassung ist unabänderlich. Mit der Armee hat der Begriff nichts zu tun.":
    "Les partis hostiles à la constitution peuvent être interdits, et le noyau de la constitution est intangible. Le terme n'a rien à voir avec l'armée.",
  "Warum sind die Gewalten in Deutschland getrennt?":
    "Pourquoi les pouvoirs sont-ils séparés en Allemagne ?",
  "Damit die Arbeit schneller geht": "Pour que le travail aille plus vite",
  "Damit keine Stelle allein über alles bestimmen kann":
    "Pour qu'aucune instance ne puisse décider seule de tout",
  "Weil es die EU vorschreibt": "Parce que l'Union européenne l'impose",
  "Weil es in der Weimarer Verfassung so stand":
    "Parce que la constitution de Weimar le disait déjà",
  "Machtkontrolle ist der Zweck: Was die eine Gewalt beschließt, führt die zweite aus und überprüft die dritte.":
    "Le but est le contrôle du pouvoir : ce que l'un des pouvoirs décide, le deuxième l'applique et le troisième le vérifie.",
  "Welches Verfassungsorgan wird in Deutschland direkt vom Volk gewählt?":
    "Quel organe constitutionnel est élu directement par le peuple en Allemagne ?",
  "Die Bundesregierung": "La Bundesregierung",
  "Nur der Bundestag wird direkt gewählt. Alle anderen Organe gehen mittelbar aus Wahlen hervor.":
    "Seul le Bundestag est élu directement. Tous les autres organes procèdent des élections de façon indirecte.",
  "Was ist eine Fraktion im Bundestag?": "Qu'est-ce qu'une Fraktion au Bundestag ?",
  "Ein Ausschuss für Finanzfragen": "Une commission des finances",
  "Der Zusammenschluss der Abgeordneten einer Partei": "Le groupement des députés d'un même parti",
  "Die Regierungsmannschaft des Kanzlers": "L'équipe gouvernementale du chancelier",
  "Eine Gruppe von Ministerien": "Un ensemble de ministères",
  "Abgeordnete derselben Partei schließen sich zur Fraktion zusammen. Fraktionen bestimmen den Arbeitsalltag des Parlaments.":
    "Les députés d'un même parti se réunissent en Fraktion. Ce sont les Fraktionen qui règlent le quotidien du parlement.",
  "Wer darf einen Gesetzentwurf in den Bundestag einbringen?":
    "Qui a le droit de déposer un projet de loi au Bundestag ?",
  "Nur die Bundesregierung": "La Bundesregierung seule",
  "Bundesregierung, Bundestag oder Bundesrat": "La Bundesregierung, le Bundestag ou le Bundesrat",
  "Nur der Bundespräsident": "Le Bundespräsident seul",
  "Jeder Bürger direkt": "Tout citoyen, directement",
  "Drei Wege führen zu einem Gesetzentwurf: aus der Regierung, aus der Mitte des Bundestages oder aus dem Bundesrat.":
    "Trois chemins mènent à un projet de loi : le gouvernement, le Bundestag lui-même ou le Bundesrat.",
  "Was versteht man unter dem Budgetrecht des Bundestages?":
    "Qu'entend-on par le Budgetrecht du Bundestag ?",
  "Das Recht, die Steuern selbst einzuziehen": "Le droit de percevoir lui-même les impôts",
  "Das Recht, über den Haushalt des Bundes zu entscheiden":
    "Le droit de décider du budget fédéral",
  "Das Recht der Abgeordneten auf ein Gehalt": "Le droit des députés à une rémunération",
  "Das Recht, Kredite privat aufzunehmen": "Le droit d'emprunter à titre privé",
  "Das Parlament entscheidet, wofür der Staat Geld ausgibt. Deshalb gilt das Budgetrecht als Königsrecht des Bundestages.":
    "C'est le parlement qui décide à quoi l'État dépense son argent. C'est pourquoi le Budgetrecht passe pour le droit souverain du Bundestag.",
  "Wie viele Stimmen hat ein Bundesland im Bundesrat?":
    "Combien de voix un Land a-t-il au Bundesrat ?",
  "Jedes Land hat genau eine Stimme": "Chaque Land a exactement une voix",
  "Je nach Einwohnerzahl drei bis sechs Stimmen": "De trois à six voix selon la population",
  "Jedes Land hat zehn Stimmen": "Chaque Land a dix voix",
  "Die Zahl wechselt jedes Jahr": "Le nombre change chaque année",
  "Drei bis sechs Stimmen, gestaffelt nach Einwohnerzahl — und ein Land muss seine Stimmen einheitlich abgeben.":
    "De trois à six voix, échelonnées selon la population — et un Land doit voter d'un seul bloc.",
  "Was ist ein Untersuchungsausschuss?": "Qu'est-ce qu'un Untersuchungsausschuss ?",
  "Ein Gericht für Abgeordnete": "Un tribunal réservé aux députés",
  "Ein Gremium des Bundestages, das Vorgänge aufklärt und die Regierung kontrolliert":
    "Un organe du Bundestag qui fait la lumière sur une affaire et contrôle le gouvernement",
  "Eine Behörde zur Prüfung von Gesetzen": "Une administration chargée d'examiner les lois",
  "Der Ausschuss, der den Haushalt aufstellt": "La commission qui établit le budget",
  "Er gehört zur Kontrollfunktion des Parlaments: Der Bundestag klärt damit auf, was die Regierung lieber unerwähnt ließe.":
    "Il relève de la fonction de contrôle du parlement : le Bundestag met ainsi au jour ce que le gouvernement préférerait passer sous silence.",
  "Wer leitet die Bundesregierung?": "Qui dirige la Bundesregierung ?",
  "Der Bundestagspräsident": "Le président du Bundestag",
  "Der Präsident des Bundesrates": "Le président du Bundesrat",
  "Der Bundeskanzler führt die Regierung und bestimmt die Richtlinien der Politik. Der Bundespräsident regiert nicht.":
    "Le Bundeskanzler dirige le gouvernement et fixe les grandes lignes de la politique. Le Bundespräsident, lui, ne gouverne pas.",
  "Wer wählt den Bundespräsidenten?": "Qui élit le Bundespräsident ?",
  "Der Bundestag allein": "Le Bundestag seul",
  "Die Bundesversammlung — zur Hälfte Bundestagsabgeordnete, zur Hälfte Vertreter der Länder. Sie tritt nur zu diesem Zweck zusammen.":
    "La Bundesversammlung — pour moitié des députés du Bundestag, pour moitié des représentants des Länder. Elle ne se réunit que pour cela.",
  "Was bedeutet Richtlinienkompetenz?": "Que signifie Richtlinienkompetenz ?",
  "Der Kanzler bestimmt die Grundlinien der Politik":
    "Le chancelier fixe les grandes lignes de la politique",
  "Der Bundespräsident gibt die Gesetze vor": "Le Bundespräsident dicte les lois",
  "Die Ministerien schreiben eigene Richtlinien":
    "Les ministères écrivent leurs propres directives",
  "Der Bundesrat gibt den Ländern Richtlinien": "Le Bundesrat donne des directives aux Länder",
  "Der Kanzler setzt die Leitlinien; innerhalb dieser Linien führt jeder Minister sein Haus eigenständig.":
    "Le chancelier pose les lignes directrices ; à l'intérieur de ces lignes, chaque ministre dirige sa maison en toute autonomie.",
  "Wer ernennt die Bundesminister?": "Qui nomme les ministres fédéraux ?",
  "Der Bundestag durch Wahl": "Le Bundestag, par un vote",
  "Der Bundespräsident auf Vorschlag des Kanzlers":
    "Le Bundespräsident, sur proposition du chancelier",
  "Der Kanzler allein, ohne weitere Beteiligung": "Le chancelier seul, sans personne d'autre",
  "Vorschlagen darf der Kanzler, ernennen muss der Bundespräsident. Zwei Schritte, die gern zu einem verkürzt werden.":
    "Le chancelier propose, le Bundespräsident nomme. Deux étapes que l'on ramène volontiers à une seule.",
  "Wie oft darf eine Person das Amt des Bundespräsidenten ausüben?":
    "Combien de fois une personne peut-elle exercer la charge de Bundespräsident ?",
  "Nur einmal": "Une seule fois",
  "Höchstens zweimal": "Deux fois au plus",
  "Beliebig oft": "Autant de fois qu'elle veut",
  "Bis zum 70. Lebensjahr": "Jusqu'à 70 ans",
  "Zwei Amtszeiten zu je fünf Jahren, also höchstens zehn Jahre. Für den Kanzler gibt es keine solche Grenze.":
    "Deux mandats de cinq ans chacun, soit dix ans au plus. Pour le chancelier, aucune limite de ce genre n'existe.",
  "Wie nennt man Kanzler und Minister zusammen?":
    "Comment appelle-t-on le chancelier et les ministres réunis ?",
  "Bundesversammlung": "Bundesversammlung",
  "Bundesregierung oder Kabinett": "Bundesregierung, ou cabinet",
  "Bundesrat": "Bundesrat",
  "Bundestag": "Bundestag",
  "Bundeskanzler und Bundesminister bilden gemeinsam die Bundesregierung, umgangssprachlich das Kabinett.":
    "Le Bundeskanzler et les ministres fédéraux forment ensemble la Bundesregierung, que l'on appelle couramment le cabinet.",
  "Wie oft findet in Deutschland regulär eine Bundestagswahl statt?":
    "À quelle fréquence a lieu normalement une élection du Bundestag ?",
  "Alle zwei Jahre": "Tous les deux ans",
  "Alle vier Jahre": "Tous les quatre ans",
  "Alle fünf Jahre": "Tous les cinq ans",
  "Alle sechs Jahre": "Tous les six ans",
  "Alle vier Jahre. Das Europäische Parlament wird alle fünf Jahre gewählt — daher die häufige Verwechslung.":
    "Tous les quatre ans. Le Parlement européen est élu tous les cinq ans — d'où la confusion fréquente.",
  "Was bedeutet „freie Wahl“?": "Que signifie « freie Wahl », une élection libre ?",
  "Die Wahl kostet nichts": "L'élection ne coûte rien",
  "Niemand darf zu einer bestimmten Entscheidung gezwungen werden":
    "Personne ne peut être contraint à un choix déterminé",
  "Jeder kann sich aussuchen, wann er wählt": "Chacun peut choisir quand il vote",
  "Man kann mehrere Stimmen abgeben": "On peut déposer plusieurs bulletins",
  "Frei heißt: ohne Druck und ohne Zwang. Weder Staat noch Arbeitgeber noch Familie dürfen eine Stimme vorschreiben.":
    "Libre veut dire : sans pression et sans contrainte. Ni l'État, ni l'employeur, ni la famille ne peuvent dicter un vote.",
  "Was ist die Fünf-Prozent-Hürde?":
    "Qu'est-ce que la Fünf-Prozent-Hürde, le seuil des cinq pour cent ?",
  "Eine Partei braucht mindestens fünf Prozent der Zweitstimmen, um in den Bundestag zu kommen":
    "Un parti a besoin d'au moins cinq pour cent des Zweitstimmen pour entrer au Bundestag",
  "Fünf Prozent der Wähler müssen zur Wahl gehen":
    "Cinq pour cent des électeurs doivent se rendre aux urnes",
  "Ein Kandidat braucht fünf Prozent im Wahlkreis":
    "Un candidat a besoin de cinq pour cent dans sa circonscription",
  "Fünf Prozent der Sitze bleiben immer frei":
    "Cinq pour cent des sièges restent toujours vacants",
  "Sie hält Kleinstparteien draußen und soll das Parlament arbeitsfähig halten — eine Lehre aus der zersplitterten Weimarer Republik.":
    "Il tient les micro-partis à l'écart et doit garder au parlement sa capacité de travail — une leçon tirée de la République de Weimar en miettes.",
  "Wofür wird die Erststimme bei der Bundestagswahl verwendet?":
    "À quoi sert la Erststimme lors de l'élection du Bundestag ?",
  "Für die Wahl einer Partei": "À élire un parti",
  "Für die Wahl eines Kandidaten im eigenen Wahlkreis":
    "À élire un candidat de sa propre circonscription",
  "Für die Wahl des Bundeskanzlers": "À élire le Bundeskanzler",
  "Für die Wahl des Bundespräsidenten": "À élire le Bundespräsident",
  "Die Erststimme gilt einer Person im Wahlkreis, die Zweitstimme einer Partei. Kanzler und Präsident wählt das Volk gar nicht.":
    "La Erststimme va à une personne de la circonscription, la Zweitstimme à un parti. Le chancelier et le président, eux, ne sont pas élus par le peuple du tout.",
  "Wer darf in Deutschland bei Kommunalwahlen häufig mitwählen, ohne die deutsche Staatsangehörigkeit zu haben?":
    "Qui peut souvent voter aux élections communales en Allemagne sans avoir la nationalité allemande ?",
  "Niemand": "Personne",
  "Bürger anderer EU-Staaten, die hier wohnen":
    "Les ressortissants d'autres États de l'Union européenne qui habitent ici",
  "Alle Personen mit Aufenthaltstitel": "Toute personne munie d'un titre de séjour",
  "Nur Personen aus Nachbarländern": "Seules les personnes venant des pays voisins",
  "EU-Bürger dürfen dort wählen, wo sie leben — bei Kommunal- und Europawahlen. Für die Bundestagswahl braucht es den deutschen Pass.":
    "Les citoyens de l'Union européenne votent là où ils vivent — aux élections communales et européennes. Pour l'élection du Bundestag, il faut le passeport allemand.",
  "Was ist die Opposition im Bundestag?": "Qu'est-ce que l'opposition au Bundestag ?",
  "Die Parteien, die nicht die Regierung stellen": "Les partis qui ne forment pas le gouvernement",
  "Die Minister ohne eigenes Ministerium": "Les ministres sans ministère propre",
  "Die Abgeordneten des Bundesrates": "Les membres du Bundesrat",
  "Die Verwaltung des Parlaments": "L'administration du parlement",
  "Sie kontrolliert die Regierung, stellt Alternativen zur Debatte und ist damit ein fester Bestandteil der Demokratie.":
    "Elle contrôle le gouvernement, met d'autres solutions en débat et fait ainsi partie intégrante de la démocratie.",
  "Wie heißt das Parlament eines Bundeslandes in den meisten Ländern?":
    "Comment s'appelle le parlement d'un Land dans la plupart des Länder ?",
  "Gemeinderat": "Gemeinderat",
  "Landtag. In Hamburg und Bremen heißt es Bürgerschaft, in Berlin Abgeordnetenhaus.":
    "Landtag. À Hambourg et à Brême, il s'appelle Bürgerschaft, à Berlin Abgeordnetenhaus.",
  "Wie heißt der Regierungschef eines Flächenlandes?":
    "Comment s'appelle le chef du gouvernement d'un Land territorial ?",
  "Bürgermeister": "Bürgermeister",
  "Ministerpräsident": "Ministerpräsident",
  "Landeskanzler": "Landeskanzler",
  "Landrat": "Landrat",
  "Ministerpräsident. In den Stadtstaaten heißt das Amt Regierender Bürgermeister, Erster Bürgermeister oder Präsident des Senats.":
    "Ministerpräsident. Dans les villes-États, la charge s'appelle Regierender Bürgermeister, Erster Bürgermeister ou président du Sénat.",
  "Wofür ist der Bund und nicht das Bundesland zuständig?":
    "De quoi la Fédération est-elle compétente, et non le Land ?",
  "Für die Schulen": "Des écoles",
  "Für die Außenpolitik": "De la politique étrangère",
  "Für die Landespolizei": "De la police du Land",
  "Für die Bauordnung": "Du règlement de construction",
  "Außenpolitik, Verteidigung, Staatsangehörigkeit und Währung sind Bundessache. Schule, Polizei und Bauordnung sind Ländersache.":
    "La politique étrangère, la défense, la nationalité et la monnaie relèvent de la Fédération. L'école, la police et le règlement de construction relèvent des Länder.",
  "Welche Aussage über die Landesverfassungen ist richtig?":
    "Quelle affirmation sur les constitutions des Länder est exacte ?",
  "Es gibt keine, es gilt nur das Grundgesetz": "Il n'y en a pas, seul le Grundgesetz s'applique",
  "Jedes Land hat eine eigene, die dem Grundgesetz nicht widersprechen darf":
    "Chaque Land a la sienne, qui ne peut contredire le Grundgesetz",
  "Sie stehen über dem Grundgesetz": "Elles priment sur le Grundgesetz",
  "Nur die alten Bundesländer haben eine": "Seuls les anciens Länder en ont une",
  "Jedes Land hat eine eigene Verfassung — aber Bundesrecht bricht Landesrecht, und dem Grundgesetz darf keine widersprechen.":
    "Chaque Land a sa propre constitution — mais le droit fédéral l'emporte sur le droit du Land, et aucune ne peut contredire le Grundgesetz.",
  "Was entscheidet die Gemeinde selbst?": "Qu'est-ce que la commune décide elle-même ?",
  "Die Höhe der Einkommensteuer": "Le taux de l'impôt sur le revenu",
  "Bebauungspläne, Kitas und die örtliche Müllabfuhr":
    "Les plans d'urbanisme, les crèches et le ramassage des ordures",
  "Die Staatsangehörigkeit": "La nationalité",
  "Die kommunale Selbstverwaltung regelt, was direkt vor Ort anfällt. Steuersätze, Schulpflicht und Staatsangehörigkeit liegen höher.":
    "L'autonomie communale règle ce qui se présente sur place. Les taux d'impôt, l'obligation scolaire et la nationalité se décident plus haut.",
  "Wie viele Flächenländer hat Deutschland?":
    "Combien de Länder territoriaux l'Allemagne compte-t-elle ?",
  "11": "11",
  "13": "13",
  "3": "3",
  "13 Flächenländer plus die drei Stadtstaaten Berlin, Hamburg und Bremen ergeben 16 Bundesländer.":
    "13 Länder territoriaux plus les trois villes-États de Berlin, Hambourg et Brême font 16 Länder.",
  "An welches Gericht wendest du dich bei einem Streit über eine Kündigung?":
    "À quel tribunal s'adresse-t-on en cas de litige sur un licenciement ?",
  "An das Verwaltungsgericht": "Au tribunal administratif",
  "An das Arbeitsgericht": "Au tribunal du travail",
  "An das Finanzgericht": "Au tribunal des finances",
  "An das Sozialgericht": "Au tribunal des affaires sociales",
  "Arbeitsgerichte entscheiden über Streit zwischen Arbeitgeber und Arbeitnehmer, Kündigungen eingeschlossen.":
    "Les tribunaux du travail tranchent les litiges entre employeur et salarié, licenciements compris.",
  "Wer klagt im Strafverfahren gegen einen Angeklagten?":
    "Qui poursuit un accusé dans une procédure pénale ?",
  "Der Richter": "Le juge",
  "Die Staatsanwaltschaft": "Le parquet",
  "Der Verteidiger": "L'avocat de la défense",
  "Die Staatsanwaltschaft erhebt Anklage. Der Richter entscheidet, die Polizei ermittelt, der Verteidiger vertritt den Angeklagten.":
    "C'est le parquet qui met en accusation. Le juge tranche, la police enquête, l'avocat défend l'accusé.",
  "Was bedeutet die Unabhängigkeit der Richter?": "Que signifie l'indépendance des juges ?",
  "Richter dürfen selbst Gesetze machen": "Les juges ont le droit de faire eux-mêmes les lois",
  "Richter sind nur an das Gesetz gebunden und erhalten keine Weisungen":
    "Les juges ne sont tenus que par la loi et ne reçoivent aucune instruction",
  "Richter müssen nicht begründen, wie sie entscheiden":
    "Les juges n'ont pas à motiver leurs décisions",
  "Richter werden vom Volk gewählt": "Les juges sont élus par le peuple",
  "Kein Minister und kein Vorgesetzter darf einem Richter vorschreiben, wie er zu entscheiden hat. Gebunden ist er allein an das Gesetz.":
    "Aucun ministre et aucun supérieur ne peut dicter à un juge ce qu'il doit décider. Il n'est tenu que par la loi.",
  "Wann kann eine Person Verfassungsbeschwerde erheben?":
    "Quand une personne peut-elle former un recours constitutionnel ?",
  "Sofort, bevor sie andere Gerichte anruft": "Aussitôt, avant de saisir les autres tribunaux",
  "Wenn sie sich in Grundrechten verletzt sieht und der übrige Rechtsweg ausgeschöpft ist":
    "Quand elle s'estime atteinte dans ses droits fondamentaux et que les autres voies de recours sont épuisées",
  "Nur wenn der Bundestag zustimmt": "Seulement avec l'accord du Bundestag",
  "Nur als Gruppe von mindestens 100 Personen": "Seulement en groupe d'au moins 100 personnes",
  "Zuerst der normale Rechtsweg, dann Karlsruhe. Die Verfassungsbeschwerde ist der letzte Schritt, nicht der erste.":
    "D'abord la voie de recours ordinaire, ensuite Karlsruhe. Le recours constitutionnel est la dernière étape, non la première.",
  "Was gilt, wenn jemand in Deutschland eine Straftat begeht, die zur Tatzeit noch nicht strafbar war?":
    "Que se passe-t-il si quelqu'un commet en Allemagne un acte qui n'était pas encore punissable au moment des faits ?",
  "Er wird nachträglich bestraft": "Il est puni après coup",
  "Er kann dafür nicht bestraft werden": "Il ne peut pas en être puni",
  "Das Gericht entscheidet frei": "Le tribunal décide librement",
  "Die Strafe wird halbiert": "La peine est réduite de moitié",
  "Keine Strafe ohne Gesetz: Bestraft werden kann nur, was zum Zeitpunkt der Tat bereits unter Strafe stand.":
    "Pas de peine sans loi : ne peut être puni que ce qui était déjà punissable au moment des faits.",
  "Wer bekommt in Deutschland einen Verteidiger, wenn er sich keinen leisten kann?":
    "Qui obtient en Allemagne un avocat lorsqu'il n'a pas les moyens d'en payer un ?",
  "Niemand, ein Anwalt muss selbst bezahlt werden":
    "Personne, un avocat doit être payé par soi-même",
  "Jeder Angeklagte — der Staat hilft bei den Kosten":
    "Tout accusé — l'État aide à en supporter le coût",
  "Nur deutsche Staatsangehörige": "Seuls les ressortissants allemands",
  "Nur bei schweren Verbrechen und nur auf eigene Kosten":
    "Seulement pour les crimes graves, et à ses propres frais",
  "Das Recht auf Verteidigung darf nicht am Geld scheitern; deshalb gibt es Pflichtverteidigung und Prozesskostenhilfe.":
    "Le droit d'être défendu ne doit pas échouer faute d'argent ; d'où l'avocat commis d'office et l'aide aux frais de procédure.",
  "Welche Versicherung zahlt, wenn jemand seine Arbeit verliert?":
    "Quelle assurance paie lorsque quelqu'un perd son travail ?",
  "Die Rentenversicherung": "L'assurance retraite",
  "Die Arbeitslosenversicherung": "L'assurance chômage",
  "Die Pflegeversicherung": "L'assurance dépendance",
  "Die Unfallversicherung": "L'assurance accidents",
  "Die Arbeitslosenversicherung zahlt Arbeitslosengeld und finanziert Vermittlung und Weiterbildung.":
    "L'assurance chômage verse l'Arbeitslosengeld et finance le placement et la formation continue.",
  "Seit wann gibt es in Deutschland die Pflegeversicherung?":
    "Depuis quand l'assurance dépendance existe-t-elle en Allemagne ?",
  "Seit 1995": "Depuis 1995",
  "Seit 2005": "Depuis 2005",
  "Seit 2015": "Depuis 2015",
  "1995 kam sie als fünfte und jüngste Säule der Sozialversicherung hinzu.":
    "Elle s'est ajoutée en 1995 comme cinquième et plus jeune pilier de la sécurité sociale.",
  "Wer zahlt Kindergeld, und wovon hängt es ab?":
    "Qui verse le Kindergeld, et de quoi dépend-il ?",
  "Der Arbeitgeber, abhängig vom Gehalt": "L'employeur, selon le salaire",
  "Der Staat, unabhängig vom Einkommen der Eltern": "L'État, indépendamment du revenu des parents",
  "Die Krankenkasse, abhängig von den Beiträgen":
    "La caisse d'assurance maladie, selon les cotisations",
  "Die Gemeinde, abhängig vom Wohnort": "La commune, selon le lieu de résidence",
  "Kindergeld gibt es für jedes Kind, ohne Rücksicht auf das Einkommen der Eltern.":
    "Le Kindergeld est versé pour chaque enfant, sans égard au revenu des parents.",
  "Wie werden die Beiträge zur gesetzlichen Krankenversicherung berechnet?":
    "Comment les cotisations à l'assurance maladie légale sont-elles calculées ?",
  "Nach dem Alter der versicherten Person": "D'après l'âge de l'assuré",
  "Nach dem Einkommen": "D'après le revenu",
  "Nach der Anzahl der Arztbesuche": "D'après le nombre de visites chez le médecin",
  "Für alle gleich hoch": "Elles sont identiques pour tous",
  "Nach dem Einkommen — das ist das Solidarprinzip. In der privaten Versicherung zählen dagegen Alter und Gesundheitszustand.":
    "D'après le revenu — c'est le principe de solidarité. Dans l'assurance privée, en revanche, comptent l'âge et l'état de santé.",
  "Was ist das Elterngeld?": "Qu'est-ce que l'Elterngeld ?",
  "Ein Zuschuss zur Miete für Familien": "Une aide au loyer pour les familles",
  "Ein Ersatz für einen Teil des Einkommens nach der Geburt eines Kindes":
    "Un remplacement d'une partie du revenu après la naissance d'un enfant",
  "Das monatliche Geld für jedes Kind": "La somme mensuelle versée pour chaque enfant",
  "Eine einmalige Zahlung zur Geburt": "Un versement unique à la naissance",
  "Elterngeld ersetzt Einkommen, wenn Eltern nach der Geburt zu Hause bleiben. Kindergeld dagegen ist die laufende Zahlung pro Kind.":
    "L'Elterngeld remplace le revenu quand les parents restent à la maison après la naissance. Le Kindergeld, lui, est le versement courant par enfant.",
  "Welche Behörde ist für Arbeitslosengeld und Arbeitsvermittlung zuständig?":
    "Quelle administration s'occupe de l'Arbeitslosengeld et du placement ?",
  "Das Finanzamt": "Le Finanzamt",
  "Die Bundesagentur für Arbeit": "La Bundesagentur für Arbeit",
  "Das Bürgeramt": "Le Bürgeramt",
  "Die Krankenkasse": "La caisse d'assurance maladie",
  "Die Bundesagentur für Arbeit mit ihren Agenturen und Jobcentern vor Ort.":
    "La Bundesagentur für Arbeit, avec ses agences et ses Jobcenter sur place.",
  "Wer war der erste Reichskanzler des Deutschen Kaiserreichs?":
    "Qui fut le premier chancelier de l'Empire allemand ?",
  "Wilhelm II.": "Guillaume II",
  "Otto von Bismarck": "Otto von Bismarck",
  "Friedrich Ebert": "Friedrich Ebert",
  "Bismarck ab 1871. Ebert wurde 1919 erster Reichspräsident, Adenauer 1949 erster Bundeskanzler.":
    "Bismarck, à partir de 1871. Ebert devint premier président du Reich en 1919, Adenauer premier Bundeskanzler en 1949.",
  "Wann endete der Erste Weltkrieg?": "Quand la Première Guerre mondiale a-t-elle pris fin ?",
  "1914": "1914",
  "1933": "1933",
  "1918. Im selben Jahr dankte der Kaiser ab und die Republik wurde ausgerufen.":
    "En 1918. La même année, l'empereur abdiqua et la république fut proclamée.",
  "Was war der Versailler Vertrag?": "Qu'était le traité de Versailles ?",
  "Der Vertrag zur Gründung des Kaiserreichs": "Le traité fondant l'Empire",
  "Der Friedensvertrag nach dem Ersten Weltkrieg":
    "Le traité de paix après la Première Guerre mondiale",
  "Der Vertrag über die Wiedervereinigung": "Le traité sur la réunification",
  "Der Gründungsvertrag der EU": "Le traité fondateur de l'Union européenne",
  "1919 geschlossen. Er verpflichtete Deutschland zu Reparationen und Gebietsabtretungen und belastete die junge Republik schwer.":
    "Conclu en 1919. Il obligeait l'Allemagne à des réparations et à des cessions de territoire, et a lourdement pesé sur la jeune république.",
  "Welche Neuerung brachte die Weimarer Republik für Frauen?":
    "Quelle nouveauté la République de Weimar a-t-elle apportée aux femmes ?",
  "Das Recht auf eigenes Vermögen": "Le droit d'avoir des biens propres",
  "Das Wahlrecht": "Le droit de vote",
  "Das Recht zu studieren": "Le droit de faire des études",
  "Den Mutterschutz": "La protection de la maternité",
  "1919 durften Frauen erstmals wählen und gewählt werden — die wohl wichtigste demokratische Neuerung dieser Jahre.":
    "En 1919, les femmes purent pour la première fois voter et être élues — sans doute la plus importante nouveauté démocratique de ces années.",
  "Welche Schwäche der Weimarer Republik beantwortet das Grundgesetz mit der Fünf-Prozent-Hürde?":
    "À quelle faiblesse de la République de Weimar le Grundgesetz répond-il par le seuil des cinq pour cent ?",
  "Die hohe Arbeitslosigkeit": "Le chômage élevé",
  "Die Zersplitterung des Parlaments in viele kleine Parteien":
    "L'éclatement du parlement en une multitude de petits partis",
  "Die Reparationszahlungen": "Les paiements de réparations",
  "Die Macht des Reichspräsidenten": "Le pouvoir du président du Reich",
  "Viele Kleinstparteien machten stabile Mehrheiten unmöglich. Die Hürde soll genau das verhindern.":
    "Une multitude de micro-partis rendait toute majorité stable impossible. Le seuil doit précisément empêcher cela.",
  "Wofür ist Bismarck neben der Reichsgründung bekannt?":
    "Pour quoi Bismarck est-il connu, à côté de la fondation de l'Empire ?",
  "Für die Einführung der ersten Sozialversicherungen":
    "Pour l'introduction des premières assurances sociales",
  "Für die Einführung des Frauenwahlrechts": "Pour l'introduction du droit de vote des femmes",
  "Für die Gründung der Bundeswehr": "Pour la fondation de la Bundeswehr",
  "Für die Einführung des Euro": "Pour l'introduction de l'euro",
  "Kranken-, Unfall- und Rentenversicherung entstanden in den 1880er Jahren — der deutsche Sozialstaat ist älter als die Demokratie.":
    "L'assurance maladie, l'assurance accidents et l'assurance retraite sont nées dans les années 1880 — l'État social allemand est plus ancien que la démocratie.",
  "Wann kamen die Nationalsozialisten in Deutschland an die Macht?":
    "Quand les nationaux-socialistes sont-ils arrivés au pouvoir en Allemagne ?",
  "1939": "1939",
  "Am 30. Januar 1933 wurde Hitler Reichskanzler. 1939 begann der Krieg, 1945 endete er.":
    "Le 30 janvier 1933, Hitler devint chancelier du Reich. La guerre commença en 1939 et s'acheva en 1945.",
  "Was bewirkte das Ermächtigungsgesetz von 1933?":
    "Qu'a produit l'Ermächtigungsgesetz de 1933, la loi des pleins pouvoirs ?",
  "Es gab dem Parlament mehr Rechte": "Elle donnait plus de droits au parlement",
  "Es erlaubte der Regierung, Gesetze ohne das Parlament zu erlassen":
    "Elle permettait au gouvernement d'édicter des lois sans le parlement",
  "Es führte das Frauenwahlrecht ein": "Elle instaurait le droit de vote des femmes",
  "Es begrenzte die Macht des Reichskanzlers": "Elle limitait le pouvoir du chancelier du Reich",
  "Damit war die Gewaltenteilung beseitigt — der entscheidende Schritt von der Demokratie zur Diktatur.":
    "La séparation des pouvoirs était par là supprimée — le pas décisif de la démocratie vers la dictature.",
  "Welches Merkmal kennzeichnete den NS-Staat?":
    "Quel trait caractérisait l'État national-socialiste ?",
  "Mehrere Parteien im Wettbewerb": "Plusieurs partis en concurrence",
  "Nur eine erlaubte Partei": "Un seul parti autorisé",
  "Unabhängige Gerichte": "Des tribunaux indépendants",
  "Freie Presse": "Une presse libre",
  "Ab Sommer 1933 war die NSDAP die einzige zugelassene Partei. Freie Presse und unabhängige Gerichte gab es nicht mehr.":
    "À partir de l'été 1933, le NSDAP fut le seul parti admis. De presse libre et de tribunaux indépendants, il n'y en avait plus.",
  "Was geschah am 20. Juli 1944?": "Que s'est-il passé le 20 juillet 1944 ?",
  "Der Krieg endete": "La guerre s'est achevée",
  "Ein Attentat auf Hitler scheiterte": "Un attentat contre Hitler a échoué",
  "Die Nürnberger Gesetze wurden erlassen": "Les lois de Nuremberg ont été édictées",
  "Die Mauer wurde gebaut": "Le Mur a été construit",
  "Stauffenbergs Attentat scheiterte; die Beteiligten wurden hingerichtet. Der Tag steht für den militärischen Widerstand.":
    "L'attentat de Stauffenberg a échoué ; ceux qui y avaient pris part furent exécutés. La date incarne la résistance venue de l'armée.",
  "Wann endete der Zweite Weltkrieg in Europa?":
    "Quand la Seconde Guerre mondiale s'est-elle achevée en Europe ?",
  "Am 9. November 1945": "Le 9 novembre 1945",
  "Mit der bedingungslosen Kapitulation am 8. Mai 1945. Der 1. September 1939 war der Kriegsbeginn.":
    "Avec la capitulation sans condition du 8 mai 1945. Le 1er septembre 1939 fut le début de la guerre.",
  "Was waren die Nürnberger Gesetze von 1935?": "Qu'étaient les lois de Nuremberg de 1935 ?",
  "Gesetze zum Schutz von Arbeitnehmern": "Des lois protégeant les salariés",
  "Rassistische Gesetze, die jüdischen Deutschen ihre Bürgerrechte nahmen":
    "Des lois racistes qui retiraient aux Allemands juifs leurs droits civiques",
  "Die Verfassung des NS-Staates": "La constitution de l'État national-socialiste",
  "Die Urteile gegen NS-Verbrecher": "Les jugements rendus contre les criminels nazis",
  "Sie entrechteten jüdische Deutsche systematisch. Die Nürnberger *Prozesse* nach 1945 sind etwas völlig anderes.":
    "Elles ont privé les Allemands juifs de leurs droits, méthodiquement. Les *procès* de Nuremberg après 1945 sont tout autre chose.",
  "Wie viele Juden wurden im Nationalsozialismus ermordet?":
    "Combien de Juifs ont été assassinés sous le national-socialisme ?",
  "Etwa 600.000": "Environ 600 000",
  "Etwa sechs Millionen": "Environ six millions",
  "Etwa 60.000": "Environ 60 000",
  "Etwa 16 Millionen": "Environ 16 millions",
  "Etwa sechs Millionen europäische Juden. Ermordet wurden außerdem Sinti und Roma, Menschen mit Behinderung und viele andere Gruppen.":
    "Environ six millions de Juifs d'Europe. Furent aussi assassinés des Sintis et des Roms, des personnes handicapées et bien d'autres groupes.",
  "Welche Gruppen wurden im Nationalsozialismus neben den Juden verfolgt?":
    "Quels groupes furent persécutés sous le national-socialisme à côté des Juifs ?",
  "Nur politische Gegner": "Les seuls adversaires politiques",
  "Sinti und Roma, Menschen mit Behinderung, politische Gegner und weitere Gruppen":
    "Les Sintis et les Roms, les personnes handicapées, les adversaires politiques et d'autres groupes encore",
  "Ausschließlich Kriegsgefangene": "Uniquement les prisonniers de guerre",
  "Niemand sonst": "Personne d'autre",
  "Die Verfolgung traf viele Gruppen — nach rassistischen, politischen und weltanschaulichen Kriterien.":
    "La persécution a frappé de nombreux groupes — selon des critères racistes, politiques et idéologiques.",
  "Was ist in Deutschland strafbar?": "Qu'est-ce qui est punissable en Allemagne ?",
  "Die Regierung zu kritisieren": "Critiquer le gouvernement",
  "Den Holocaust öffentlich zu leugnen": "Nier publiquement la Shoah",
  "An einer Demonstration teilzunehmen": "Prendre part à une manifestation",
  "Eine Partei zu gründen": "Fonder un parti",
  "Holocaustleugnung ist Volksverhetzung und strafbar. Regierungskritik, Demonstrationen und Parteigründungen sind dagegen Grundrechte.":
    "Nier la Shoah relève de l'incitation à la haine et tombe sous le coup de la loi. Critiquer le gouvernement, manifester et fonder un parti sont au contraire des droits fondamentaux.",
  "Was war das Besondere an den Nürnberger Prozessen?":
    "Qu'avaient les procès de Nuremberg de particulier ?",
  "Sie fanden vor einem deutschen Gericht statt": "Ils se sont tenus devant un tribunal allemand",
  "Erstmals wurden Staatsführer persönlich für Kriegsverbrechen zur Verantwortung gezogen":
    "Pour la première fois, des dirigeants d'État ont eu à répondre personnellement de crimes de guerre",
  "Alle Angeklagten wurden freigesprochen": "Tous les accusés furent acquittés",
  "Sie führten zur Gründung der Bundesrepublik":
    "Ils ont conduit à la fondation de la République fédérale",
  "1945/46 klagten die Alliierten führende Nationalsozialisten an — die Geburtsstunde des modernen Völkerstrafrechts.":
    "En 1945 et 1946, les Alliés mirent en accusation de hauts dirigeants nazis — c'est l'heure de naissance du droit pénal international moderne.",
  "Was ist am 27. Januar in Deutschland?": "Qu'est-ce que le 27 janvier en Allemagne ?",
  "Der Gedenktag für die Opfer des Nationalsozialismus":
    "Le jour de mémoire des victimes du national-socialisme",
  "Der Tag des Grundgesetzes": "Le jour du Grundgesetz",
  "Am 27. Januar 1945 wurde Auschwitz befreit. Seitdem ist der Tag deutschlandweiter Gedenktag.":
    "Le 27 janvier 1945, Auschwitz fut libéré. Depuis, cette date est jour de mémoire dans toute l'Allemagne.",
  "Wie verhält sich Deutschland heute zu seiner NS-Vergangenheit?":
    "Quel rapport l'Allemagne entretient-elle aujourd'hui avec son passé nazi ?",
  "Sie wird nicht mehr thematisiert": "Il n'en est plus question",
  "Sie wird in Gedenkstätten, Schulen und Gedenktagen bewusst wachgehalten":
    "Il est délibérément tenu éveillé dans les lieux de mémoire, à l'école et par des jours de commémoration",
  "Sie ist nur in Fachbüchern nachzulesen": "On ne le trouve que dans les ouvrages spécialisés",
  "Sie darf nicht öffentlich besprochen werden": "Il ne peut être discuté publiquement",
  "Erinnerungskultur ist Teil des Selbstverständnisses: Gedenkstätten, Unterricht, Gedenktage und eine besondere Verantwortung gegenüber Israel.":
    "La culture de la mémoire fait partie de ce que le pays entend être : lieux de mémoire, enseignement, jours de commémoration et une responsabilité particulière envers Israël.",
  "Wann wurde die Bundesrepublik Deutschland gegründet?":
    "Quand la République fédérale d'Allemagne a-t-elle été fondée ?",
  "1949, mit dem Inkrafttreten des Grundgesetzes am 23. Mai. Im selben Jahr entstand im Osten die DDR.":
    "En 1949, avec l'entrée en vigueur du Grundgesetz le 23 mai. La même année naissait à l'est la RDA.",
  "Wann wurde die DDR gegründet?": "Quand la RDA a-t-elle été fondée ?",
  "Am 7. Oktober 1949": "Le 7 octobre 1949",
  "7. Oktober 1949, rund viereinhalb Monate nach der Bundesrepublik.":
    "Le 7 octobre 1949, environ quatre mois et demi après la République fédérale.",
  "Was war das „Wirtschaftswunder“?": "Qu'était le « Wirtschaftswunder », le miracle économique ?",
  "Der schnelle wirtschaftliche Aufschwung der Bundesrepublik in den 1950er Jahren":
    "L'essor économique rapide de la République fédérale dans les années 1950",
  "Die Einführung des Euro": "L'introduction de l'euro",
  "Der Wiederaufbau der DDR": "La reconstruction de la RDA",
  "Die Entdeckung von Rohstoffen": "La découverte de matières premières",
  "Nach der Zerstörung wuchs die westdeutsche Wirtschaft rasant; Vollbeschäftigung und steigender Wohlstand prägten das Jahrzehnt.":
    "Après les destructions, l'économie ouest-allemande a crû à toute allure ; le plein emploi et une aisance croissante ont marqué la décennie.",
  "Warum kamen ab 1955 „Gastarbeiter“ nach Westdeutschland?":
    "Pourquoi des « Gastarbeiter », des travailleurs invités, sont-ils venus en Allemagne de l'Ouest à partir de 1955 ?",
  "Weil Arbeitskräfte fehlten": "Parce que la main-d'œuvre manquait",
  "Weil die Bevölkerung zu groß geworden war":
    "Parce que la population était devenue trop nombreuse",
  "Weil die DDR sie schickte": "Parce que la RDA les envoyait",
  "Weil die Alliierten es verlangten": "Parce que les Alliés l'exigeaient",
  "Die wachsende Wirtschaft brauchte Arbeitskräfte. Angeworben wurde in Italien, Spanien, Griechenland, der Türkei und weiteren Ländern.":
    "L'économie en croissance avait besoin de bras. Le recrutement s'est fait en Italie, en Espagne, en Grèce, en Turquie et dans d'autres pays.",
  "Was war der Marshallplan?": "Qu'était le plan Marshall ?",
  "Ein Plan zur Teilung Deutschlands": "Un plan de partition de l'Allemagne",
  "Ein amerikanisches Hilfsprogramm für den Wiederaufbau":
    "Un programme d'aide américain pour la reconstruction",
  "Der Plan für die Berliner Mauer": "Le plan du mur de Berlin",
  "Ein Abkommen über Reparationen": "Un accord sur les réparations",
  "Ab 1948 halfen die USA westeuropäischen Staaten mit Krediten und Warenlieferungen beim Wiederaufbau.":
    "À partir de 1948, les États-Unis ont aidé les pays d'Europe de l'Ouest à se reconstruire par des crédits et des livraisons de marchandises.",
  "Welche Wirtschaftsordnung galt in der Bundesrepublik?":
    "Quel ordre économique valait en République fédérale ?",
  "Die Planwirtschaft": "L'économie planifiée",
  "Die soziale Marktwirtschaft": "L'économie sociale de marché",
  "Die reine freie Marktwirtschaft ohne Regeln": "L'économie de marché pure, sans règles",
  "Die Staatswirtschaft": "L'économie d'État",
  "Soziale Marktwirtschaft: freier Wettbewerb, aber mit sozialem Ausgleich. Die DDR hatte dagegen Planwirtschaft.":
    "L'économie sociale de marché : libre concurrence, mais avec compensation sociale. La RDA, elle, avait l'économie planifiée.",
  "Welche Partei bestimmte in der DDR die Politik?": "Quel parti dictait la politique en RDA ?",
  "Die CDU": "La CDU",
  "Die SED": "Le SED",
  "Die SPD": "Le SPD",
  "Die FDP": "Le FDP",
  "Die Sozialistische Einheitspartei Deutschlands hatte den Führungsanspruch. Andere Parteien existierten nur ohne echte Macht.":
    "Le Parti socialiste unifié d'Allemagne revendiquait la direction. D'autres partis existaient, mais sans pouvoir réel.",
  "Wie hieß das Parlament der DDR?": "Comment s'appelait le parlement de la RDA ?",
  "Volkskammer": "Volkskammer",
  "Reichstag": "Reichstag",
  "Die Volkskammer. Frei gewählt wurde sie erst ein einziges Mal, im März 1990.":
    "La Volkskammer. Elle n'a été élue librement qu'une seule fois, en mars 1990.",
  "Was geschah am 17. Juni 1953 in der DDR?": "Que s'est-il passé le 17 juin 1953 en RDA ?",
  "Ein Aufstand wurde mit sowjetischen Panzern niedergeschlagen":
    "Un soulèvement a été écrasé par les chars soviétiques",
  "Die DDR wurde gegründet": "La RDA a été fondée",
  "Die ersten freien Wahlen fanden statt": "Les premières élections libres ont eu lieu",
  "Aus Streiks gegen höhere Arbeitsnormen wurde ein Aufstand gegen die Regierung. Bis 1990 war der 17. Juni westdeutscher Nationalfeiertag.":
    "Des grèves contre le relèvement des normes de travail est né un soulèvement contre le gouvernement. Jusqu'en 1990, le 17 juin fut la fête nationale ouest-allemande.",
  "Warum wurde die Berliner Mauer gebaut?": "Pourquoi le mur de Berlin a-t-il été construit ?",
  "Um Angriffe aus dem Westen abzuwehren": "Pour repousser des attaques venues de l'Ouest",
  "Um die eigene Bevölkerung an der Flucht zu hindern":
    "Pour empêcher sa propre population de fuir",
  "Um die Stadt vor Hochwasser zu schützen": "Pour protéger la ville des crues",
  "Immer mehr Menschen verließen die DDR. Die Mauer hielt niemanden draußen, sondern die eigenen Bürger drinnen.":
    "De plus en plus de gens quittaient la RDA. Le Mur ne tenait personne dehors, mais ses propres citoyens dedans.",
  "Was können Betroffene heute mit ihrer Stasi-Akte tun?":
    "Que peuvent faire aujourd'hui les personnes concernées de leur dossier de la Stasi ?",
  "Nichts, die Akten sind vernichtet": "Rien, les dossiers ont été détruits",
  "Sie können Einsicht beantragen und ihre Akte lesen":
    "Elles peuvent en demander la consultation et lire leur dossier",
  "Nur Historiker dürfen sie einsehen": "Seuls les historiens ont le droit de les consulter",
  "Sie sind bis 2050 gesperrt": "Ils sont bloqués jusqu'en 2050",
  "Wer überwacht wurde, darf die eigene Akte lesen. Die Aufarbeitung gehört zum Umgang mit der SED-Diktatur.":
    "Qui a été surveillé peut lire son propre dossier. Ce travail de vérité fait partie de la façon dont on traite la dictature du SED.",
  "Wie wurde in der DDR gewählt?": "Comment votait-on en RDA ?",
  "Frei zwischen mehreren Parteien": "Librement, entre plusieurs partis",
  "Mit einer Einheitsliste, ohne echte Auswahl": "Avec une liste unique, sans choix véritable",
  "Nur in den Städten": "Seulement dans les villes",
  "Es gab Wahlen, aber keine Alternativen: Die Einheitsliste stand fest, echte Auswahl gab es nicht.":
    "Il y avait des élections, mais pas de choix : la liste unique était arrêtée d'avance, aucune véritable alternative n'existait.",
  "Welcher Ruf prägte die Montagsdemonstrationen 1989?":
    "Quel cri a marqué les manifestations du lundi en 1989 ?",
  "„Freiheit für alle“": "« Liberté pour tous »",
  "„Wir sind das Volk“": "« Wir sind das Volk » — nous sommes le peuple",
  "„Nie wieder Krieg“": "« Plus jamais la guerre »",
  "„Einigkeit und Recht“": "« Unité et droit »",
  "„Wir sind das Volk“ — wörtlich der Gedanke aus Artikel 20 des Grundgesetzes, den die DDR nur behauptete.":
    "« Wir sind das Volk » — nous sommes le peuple : mot pour mot l'idée de l'article 20 du Grundgesetz, que la RDA se contentait d'affirmer.",
  "In welcher Stadt waren die Montagsdemonstrationen 1989 besonders bedeutsam?":
    "Dans quelle ville les manifestations du lundi de 1989 ont-elles le plus compté ?",
  "Dresden": "Dresde",
  "Rostock": "Rostock",
  "Erfurt": "Erfurt",
  "In Leipzig, ausgehend von den Friedensgebeten in der Nikolaikirche, wuchsen die Demonstrationen auf Hunderttausende an.":
    "À Leipzig, parties des prières pour la paix de la Nikolaikirche, les manifestations ont grossi jusqu'à des centaines de milliers de personnes.",
  "Wer war zur Zeit der Wiedervereinigung Bundeskanzler?":
    "Qui était Bundeskanzler au moment de la réunification ?",
  "Helmut Schmidt": "Helmut Schmidt",
  "Gerhard Schröder": "Gerhard Schröder",
  "Helmut Kohl, Bundeskanzler von 1982 bis 1998, gilt deshalb als „Kanzler der Einheit“.":
    "Helmut Kohl, Bundeskanzler de 1982 à 1998, passe pour cette raison pour le « chancelier de l'unité ».",
  "Was regelte der Zwei-plus-Vier-Vertrag?": "Que réglait le traité deux plus quatre ?",
  "Die Aufteilung Berlins in vier Sektoren": "Le partage de Berlin en quatre secteurs",
  "Die volle Souveränität des vereinten Deutschlands und die Bestätigung seiner Grenzen":
    "La pleine souveraineté de l'Allemagne réunifiée et la confirmation de ses frontières",
  "Den Beitritt zur NATO": "L'adhésion à l'OTAN",
  "Die beiden deutschen Staaten und die vier Siegermächte einigten sich 1990 darauf — die außenpolitische Voraussetzung der Einheit.":
    "Les deux États allemands et les quatre puissances victorieuses s'y sont accordés en 1990 — c'était la condition diplomatique de l'unité.",
  "Wann zogen Bundestag und Bundesregierung nach Berlin um?":
    "Quand le Bundestag et la Bundesregierung ont-ils déménagé à Berlin ?",
  "2005": "2005",
  "Sie sind in Bonn geblieben": "Ils sont restés à Bonn",
  "1999. Berlin war schon 1990 wieder Hauptstadt, der Umzug von Parlament und Regierung folgte neun Jahre später.":
    "En 1999. Berlin était redevenue capitale dès 1990, le déménagement du parlement et du gouvernement a suivi neuf ans plus tard.",
  "Wie kam die staatliche Einheit 1990 zustande?":
    "Comment l'unité de l'État s'est-elle faite en 1990 ?",
  "Durch einen Krieg": "Par une guerre",
  "Durch den Beitritt der DDR zur Bundesrepublik":
    "Par l'adhésion de la RDA à la République fédérale",
  "Durch eine Entscheidung der Vereinten Nationen": "Par une décision des Nations unies",
  "Durch eine Volksabstimmung in beiden Staaten": "Par un référendum dans les deux États",
  "Die DDR trat der Bundesrepublik bei; das Grundgesetz galt fortan für ganz Deutschland.":
    "La RDA a adhéré à la République fédérale ; le Grundgesetz a valu dès lors pour toute l'Allemagne.",
  "Wie viele Mitgliedstaaten hat die Europäische Union heute?":
    "Combien d'États membres l'Union européenne compte-t-elle aujourd'hui ?",
  "27": "27",
  "31": "31",
  "50": "50",
  "27 — seit dem Austritt des Vereinigten Königreichs im Jahr 2020.":
    "27 — depuis la sortie du Royaume-Uni en 2020.",
  "Welche Währung galt in Deutschland vor dem Euro?":
    "Quelle monnaie avait cours en Allemagne avant l'euro ?",
  "Der Schilling": "Le schilling",
  "Die D-Mark": "Le deutsche mark",
  "Der Franken": "Le franc",
  "Die Reichsmark": "Le reichsmark",
  "Die Deutsche Mark, eingeführt 1948 und 2002 vom Euro-Bargeld abgelöst.":
    "Le deutsche mark, introduit en 1948 et remplacé en 2002 par les espèces en euros.",
  "Was bedeutet Freizügigkeit in der EU?":
    "Que signifie la libre circulation dans l'Union européenne ?",
  "Waren sind zollfrei": "Les marchandises sont exemptes de douane",
  "EU-Bürger dürfen in jedem Mitgliedstaat leben und arbeiten":
    "Les citoyens de l'Union peuvent vivre et travailler dans n'importe quel État membre",
  "Man darf überall Auto fahren": "On peut conduire partout",
  "Es gibt keine Steuern zwischen den Ländern": "Il n'y a pas d'impôts entre les pays",
  "Personenfreizügigkeit: leben und arbeiten, wo man möchte — eine der Grundfreiheiten des Binnenmarktes.":
    "La libre circulation des personnes : vivre et travailler où l'on veut — l'une des libertés fondamentales du marché intérieur.",
  "Wie oft wird das Europäische Parlament gewählt?":
    "À quelle fréquence le Parlement européen est-il élu ?",
  "Alle fünf Jahre, direkt von den Bürgerinnen und Bürgern. Der Bundestag wird dagegen alle vier Jahre gewählt.":
    "Tous les cinq ans, directement par les citoyennes et les citoyens. Le Bundestag, lui, est élu tous les quatre ans.",
  "Welche Organisation ist ein Verteidigungsbündnis?":
    "Laquelle de ces organisations est une alliance de défense ?",
  "Der Europarat": "Le Conseil de l'Europe",
  "Die Vereinten Nationen": "Les Nations unies",
  "Die NATO ist das Verteidigungsbündnis. Die EU ist ein politischer und wirtschaftlicher Zusammenschluss, der Europarat kümmert sich um Menschenrechte.":
    "L'OTAN est l'alliance de défense. L'Union européenne est une union politique et économique, et le Conseil de l'Europe s'occupe des droits de l'homme.",
  "Was bedeutet es, dass die Bundeswehr eine „Parlamentsarmee“ ist?":
    "Que veut dire que la Bundeswehr est une « armée du parlement » ?",
  "Abgeordnete dienen als Soldaten": "Les députés servent comme soldats",
  "Über Auslandseinsätze entscheidet der Bundestag":
    "C'est le Bundestag qui décide des missions à l'étranger",
  "Die Armee untersteht dem Bundespräsidenten":
    "L'armée est placée sous l'autorité du Bundespräsident",
  "Soldaten dürfen nicht wählen": "Les soldats n'ont pas le droit de voter",
  "Kein Auslandseinsatz ohne Zustimmung des Bundestages — die Kontrolle liegt beim Parlament, nicht allein bei der Regierung.":
    "Pas de mission à l'étranger sans l'accord du Bundestag — le contrôle appartient au parlement, et non au seul gouvernement.",
  "Wie heißt die Hauptstadt Deutschlands?": "Quelle est la capitale de l'Allemagne ?",
  "Bonn": "Bonn",
  "Hamburg": "Hambourg",
  "Berlin — seit 1990 wieder Hauptstadt, seit 1999 auch Sitz von Parlament und Regierung. Bonn war es bis dahin.":
    "Berlin — redevenue capitale en 1990, siège du parlement et du gouvernement depuis 1999. Bonn l'était jusque-là.",
  "Welche Stadt ist nach Berlin die zweitgrößte Deutschlands?":
    "Quelle est, après Berlin, la deuxième ville d'Allemagne ?",
  "Köln": "Cologne",
  "Frankfurt am Main": "Francfort-sur-le-Main",
  "Hamburg, gefolgt von München und Köln.": "Hambourg, suivie de Munich et de Cologne.",
  "An welche zwei Meere grenzt Deutschland?": "À quelles deux mers l'Allemagne touche-t-elle ?",
  "Nordsee und Ostsee": "La mer du Nord et la mer Baltique",
  "Nordsee und Mittelmeer": "La mer du Nord et la Méditerranée",
  "Ostsee und Schwarzes Meer": "La mer Baltique et la mer Noire",
  "Atlantik und Nordsee": "L'Atlantique et la mer du Nord",
  "Im Nordwesten die Nordsee, im Nordosten die Ostsee.":
    "Au nord-ouest la mer du Nord, au nord-est la mer Baltique.",
  "Welcher große deutsche Fluss fließt nach Osten ins Schwarze Meer?":
    "Quel grand fleuve allemand coule vers l'est jusqu'à la mer Noire ?",
  "Die Weser": "La Weser",
  "Die Donau ist der einzige große Fluss Deutschlands, der nach Osten fließt. Rhein, Elbe und Weser münden in die Nordsee.":
    "Le Danube est le seul grand fleuve d'Allemagne à couler vers l'est. Le Rhin, l'Elbe et la Weser se jettent dans la mer du Nord.",
  "Wie heißt das Wappentier der Bundesrepublik Deutschland?":
    "Quel est l'animal emblème de la République fédérale d'Allemagne ?",
  "Der Löwe": "Le lion",
  "Der Bundesadler": "L'aigle fédéral",
  "Der Bär": "L'ours",
  "Das Pferd": "Le cheval",
  "Der Bundesadler. Der Bär ist das Wappentier Berlins, nicht des Bundes.":
    "L'aigle fédéral. L'ours est l'emblème de Berlin, non celui de la Fédération.",
  "Wie viele Menschen leben ungefähr in Deutschland?":
    "Combien de personnes vivent environ en Allemagne ?",
  "Etwa 50 Millionen": "Environ 50 millions",
  "Etwa 84 Millionen": "Environ 84 millions",
  "Etwa 120 Millionen": "Environ 120 millions",
  "Etwa 30 Millionen": "Environ 30 millions",
  "Rund 84 Millionen — damit ist Deutschland der bevölkerungsreichste Staat der Europäischen Union.":
    "Environ 84 millions — l'Allemagne est ainsi l'État le plus peuplé de l'Union européenne.",
  "Welche zwei christlichen Kirchen sind in Deutschland am größten?":
    "Quelles sont les deux plus grandes Églises chrétiennes en Allemagne ?",
  "Die orthodoxe und die anglikanische": "L'orthodoxe et l'anglicane",
  "Die katholische und die evangelische": "La catholique et la protestante",
  "Die evangelische und die orthodoxe": "La protestante et l'orthodoxe",
  "Die katholische und die anglikanische": "La catholique et l'anglicane",
  "Die katholische und die evangelische Kirche. Etwa die Hälfte der Bevölkerung gehört heute gar keiner Religionsgemeinschaft an.":
    "L'Église catholique et l'Église protestante. Aujourd'hui, la moitié environ de la population n'appartient à aucune communauté religieuse.",
  "Darf man in Deutschland aus der Kirche austreten?":
    "A-t-on le droit de quitter l'Église en Allemagne ?",
  "Nein, die Mitgliedschaft ist lebenslang": "Non, l'appartenance dure toute la vie",
  "Ja, jederzeit": "Oui, à tout moment",
  "Nur mit Zustimmung der Gemeinde": "Seulement avec l'accord de la paroisse",
  "Nur einmal im Leben": "Une seule fois dans sa vie",
  "Der Austritt ist jederzeit möglich; danach entfällt auch die Kirchensteuer. Religionsfreiheit schließt die Freiheit ein, keiner Religion anzugehören.":
    "On peut en sortir à tout moment ; l'impôt d'Église cesse alors aussi. La liberté de religion comprend celle de n'appartenir à aucune.",
  "Wie ist der Staat in Deutschland gegenüber Religionen eingestellt?":
    "Quelle est l'attitude de l'État allemand envers les religions ?",
  "Er bevorzugt die christlichen Kirchen": "Il favorise les Églises chrétiennes",
  "Er ist weltanschaulich neutral": "Il est neutre en matière de convictions",
  "Er lehnt Religion ab": "Il rejette la religion",
  "Er schreibt eine Staatsreligion vor": "Il impose une religion d'État",
  "Weltanschauliche Neutralität: Der Staat hat keine eigene Religion und bevorzugt keine Gemeinschaft.":
    "La neutralité en matière de convictions : l'État n'a pas de religion propre et ne favorise aucune communauté.",
  "Wer zahlt Kirchensteuer?": "Qui paie l'impôt d'Église ?",
  "Alle Steuerzahler": "Tous les contribuables",
  "Nur Mitglieder einer steuererhebenden Religionsgemeinschaft":
    "Seuls les membres d'une communauté religieuse qui lève cet impôt",
  "Nur Selbstständige": "Seuls les indépendants",
  "Niemand, das ist abgeschafft": "Personne, il est supprimé",
  "Nur Mitglieder. Wer austritt oder keiner Gemeinschaft angehört, zahlt sie nicht.":
    "Les membres seulement. Qui en sort ou n'appartient à aucune communauté ne le paie pas.",
  "Was gilt für religiöse Gemeinschaften in Deutschland?":
    "Qu'en est-il des communautés religieuses en Allemagne ?",
  "Sie dürfen eigene Gerichte mit verbindlichen Urteilen einrichten":
    "Elles peuvent instituer leurs propres tribunaux aux jugements contraignants",
  "Sie müssen sich an die staatlichen Gesetze halten":
    "Elles doivent respecter les lois de l'État",
  "Sie stehen über dem staatlichen Recht": "Elles priment sur le droit de l'État",
  "Sie brauchen eine Erlaubnis des Bundespräsidenten":
    "Elles ont besoin d'une autorisation du Bundespräsident",
  "Religionsausübung ist frei, aber das staatliche Recht gilt für alle. Parallele Rechtsprechung mit verbindlicher Wirkung gibt es nicht.":
    "L'exercice du culte est libre, mais le droit de l'État vaut pour tous. Une justice parallèle aux effets contraignants n'existe pas.",
  "Welches Fach können Schüler wählen, die nicht am Religionsunterricht teilnehmen?":
    "Quelle matière les élèves qui ne suivent pas le cours de religion peuvent-ils choisir ?",
  "Ethik oder Philosophie": "L'éthique ou la philosophie",
  "Eine zweite Fremdsprache": "Une deuxième langue étrangère",
  "Gar keins": "Aucune",
  "Als Alternative wird meist Ethik oder Philosophie angeboten. Die Teilnahme am Religionsunterricht ist freiwillig.":
    "On propose le plus souvent l'éthique ou la philosophie comme solution de rechange. Le cours de religion est facultatif.",
  "Ab welchem Alter darf man in Deutschland heiraten?":
    "À partir de quel âge peut-on se marier en Allemagne ?",
  "Es gibt keine Altersgrenze": "Il n'y a pas d'âge minimum",
  "Ab der Volljährigkeit mit 18. Ehen mit Minderjährigen werden in Deutschland nicht anerkannt.":
    "À la majorité, soit 18 ans. Les mariages avec des mineurs ne sont pas reconnus en Allemagne.",
  "Wo wird in Deutschland rechtsgültig geheiratet?": "Où se marie-t-on valablement en Allemagne ?",
  "In der Kirche": "À l'église",
  "Beim Standesamt": "Au Standesamt",
  "Beim Notar": "Chez le notaire",
  "Beim Familiengericht": "Au tribunal des affaires familiales",
  "Nur die standesamtliche Eheschließung ist rechtsgültig. Eine religiöse Zeremonie kann hinzukommen, ersetzt sie aber nicht.":
    "Seul le mariage célébré au Standesamt est valable en droit. Une cérémonie religieuse peut s'y ajouter, mais ne le remplace pas.",
  "Was gilt in Deutschland vor einer Scheidung in der Regel?":
    "Que faut-il en règle générale en Allemagne avant un divorce ?",
  "Eine Wartezeit von einem Monat": "Un délai d'attente d'un mois",
  "Ein Trennungsjahr": "Une année de séparation",
  "Die Zustimmung beider Familien": "L'accord des deux familles",
  "Eine Genehmigung der Kirche": "Une autorisation de l'Église",
  "Meist muss ein Trennungsjahr vergangen sein. Über die Scheidung entscheidet das Familiengericht.":
    "Il faut le plus souvent qu'une année de séparation se soit écoulée. C'est le tribunal des affaires familiales qui prononce le divorce.",
  "Seit wann dürfen in Deutschland auch gleichgeschlechtliche Paare heiraten?":
    "Depuis quand les couples de même sexe peuvent-ils aussi se marier en Allemagne ?",
  "Seit 2001": "Depuis 2001",
  "Seit 2017": "Depuis 2017",
  "Das ist nicht möglich": "Ce n'est pas possible",
  "Seit 2017 steht die Ehe allen Paaren offen. Zuvor gab es seit 2001 die eingetragene Lebenspartnerschaft.":
    "Depuis 2017, le mariage est ouvert à tous les couples. Auparavant existait, depuis 2001, le partenariat enregistré.",
  "Welche Behörde hilft, wenn das Wohl eines Kindes gefährdet ist?":
    "Quelle administration intervient lorsque le bien-être d'un enfant est en danger ?",
  "Das Ordnungsamt": "L'Ordnungsamt",
  "Das Jugendamt": "Le Jugendamt",
  "Das Standesamt": "Le Standesamt",
  "Das Einwohnermeldeamt": "Le bureau de déclaration de domicile",
  "Das Jugendamt unterstützt Familien und schützt Kinder vor Gewalt und Vernachlässigung.":
    "Le Jugendamt soutient les familles et protège les enfants de la violence et de l'abandon.",
  "Eine Frau wird von ihrem Ehemann geschlagen. Was gilt in Deutschland?":
    "Une femme est frappée par son mari. Qu'en est-il en Allemagne ?",
  "Das ist Privatsache der Familie": "C'est une affaire privée de la famille",
  "Das ist eine Straftat, und sie kann Hilfe und Schutz bekommen":
    "C'est un délit, et elle peut obtenir aide et protection",
  "Nur bei schweren Verletzungen greift der Staat ein":
    "L'État n'intervient qu'en cas de blessures graves",
  "Sie muss zuerst die Scheidung einreichen": "Elle doit d'abord demander le divorce",
  "Gewalt in der Ehe ist eine Straftat. Die Polizei kann den Täter der Wohnung verweisen; Frauenhäuser und das Hilfetelefon helfen sofort.":
    "La violence dans le mariage est un délit. La police peut expulser l'auteur du logement ; les foyers pour femmes et la ligne d'assistance aident immédiatement.",
  "Ab welchem Alter beginnt in Deutschland üblicherweise die Schulpflicht?":
    "À partir de quel âge commence habituellement l'obligation scolaire en Allemagne ?",
  "Mit vier Jahren": "À quatre ans",
  "Mit sechs Jahren": "À six ans",
  "Mit acht Jahren": "À huit ans",
  "Mit zehn Jahren": "À dix ans",
  "In der Regel mit sechs Jahren, und sie dauert mindestens neun Schuljahre.":
    "En règle générale à six ans, et elle dure au moins neuf années scolaires.",
  "Wie lange dauert die Grundschule in den meisten Bundesländern?":
    "Combien de temps dure l'école primaire dans la plupart des Länder ?",
  "Zwei Jahre": "Deux ans",
  "Meist vier Jahre; in Berlin und Brandenburg sind es sechs. Auch das ist Ländersache.":
    "Quatre ans le plus souvent ; à Berlin et dans le Brandebourg, six. Cela aussi relève des Länder.",
  "Was ist BAföG?": "Qu'est-ce que le BAföG ?",
  "Eine Prüfung am Ende der Schule": "Un examen de fin de scolarité",
  "Eine staatliche Unterstützung für Schüler und Studierende":
    "Une aide de l'État pour les élèves et les étudiants",
  "Ein Zuschuss für Auszubildende vom Betrieb": "Une prime versée aux apprentis par l'entreprise",
  "Eine Gebühr für das Studium": "Des frais d'études",
  "Staatliche Ausbildungsförderung für alle, deren Eltern die Ausbildung nicht finanzieren können.":
    "L'aide publique à la formation pour tous ceux dont les parents ne peuvent pas la financer.",
  "Wer nimmt am Ende einer dualen Ausbildung die Abschlussprüfung ab?":
    "Qui fait passer l'examen final au terme d'une formation en alternance ?",
  "Die Berufsschule allein": "L'école professionnelle seule",
  "Die Industrie- und Handelskammer oder die Handwerkskammer":
    "La chambre de commerce et d'industrie ou la chambre des métiers",
  "Das Kultusministerium": "Le ministère de l'Éducation du Land",
  "Der Ausbildungsbetrieb selbst": "L'entreprise formatrice elle-même",
  "Die Kammern prüfen — deshalb ist der Abschluss bundesweit vergleichbar und nicht vom einzelnen Betrieb abhängig.":
    "Ce sont les chambres qui examinent — c'est pourquoi le diplôme est comparable dans toute la Fédération et ne dépend pas de l'entreprise en particulier.",
  "Du hast im Ausland einen Beruf erlernt. Was kannst du in Deutschland tun?":
    "Vous avez appris un métier à l'étranger. Que pouvez-vous faire en Allemagne ?",
  "Nichts, der Abschluss gilt hier nicht": "Rien, le diplôme ne vaut pas ici",
  "Du kannst deinen Abschluss anerkennen lassen": "Vous pouvez faire reconnaître votre diplôme",
  "Du musst die Ausbildung komplett wiederholen": "Vous devez refaire toute la formation",
  "Du darfst nur als Hilfskraft arbeiten": "Vous ne pouvez travailler que comme auxiliaire",
  "Es gibt ein Anerkennungsverfahren. Gerade in Pflege, Handwerk und technischen Berufen ist es der Schlüssel zum Arbeitsmarkt.":
    "Une procédure de reconnaissance existe. Dans les soins, l'artisanat et les métiers techniques surtout, elle est la clé du marché du travail.",
  "Ab wann haben Kinder in Deutschland einen Anspruch auf einen Kita-Platz?":
    "À partir de quand les enfants ont-ils droit à une place en crèche en Allemagne ?",
  "Ab der Geburt": "Dès la naissance",
  "Ab dem ersten Geburtstag": "À partir du premier anniversaire",
  "Ab drei Jahren": "À partir de trois ans",
  "Es gibt keinen Anspruch": "Il n'existe aucun droit",
  "Ab dem vollendeten ersten Lebensjahr besteht ein Rechtsanspruch auf einen Betreuungsplatz.":
    "Dès le premier anniversaire révolu, il existe un droit opposable à une place d'accueil.",
  "Wie viele Urlaubstage stehen bei einer Fünf-Tage-Woche mindestens zu?":
    "À combien de jours de congé a-t-on droit au minimum pour une semaine de cinq jours ?",
  "10 Tage": "10 jours",
  "20 Tage": "20 jours",
  "30 Tage": "30 jours",
  "Es gibt kein Minimum": "Il n'y a pas de minimum",
  "Das gesetzliche Minimum sind 20 Arbeitstage im Jahr. Viele Verträge und Tarifverträge geben mehr.":
    "Le minimum légal est de 20 jours ouvrés par an. Beaucoup de contrats et de conventions collectives en accordent davantage.",
  "In welcher Form muss eine Kündigung erfolgen?":
    "Sous quelle forme un licenciement ou une démission doit-il se faire ?",
  "Mündlich genügt": "À l'oral, cela suffit",
  "Schriftlich": "Par écrit",
  "Per E-Mail": "Par courriel",
  "Per Telefonanruf": "Par un appel téléphonique",
  "Nur schriftlich mit eigenhändiger Unterschrift. Eine mündliche Kündigung oder eine E-Mail ist unwirksam.":
    "Par écrit uniquement, avec une signature de la main même. Une notification orale ou un courriel est sans effet.",
  "Was ist Schwarzarbeit?": "Qu'est-ce que le travail au noir ?",
  "Arbeit in der Nachtschicht": "Le travail de nuit",
  "Arbeit ohne Anmeldung und ohne Sozialabgaben":
    "Un travail non déclaré et sans cotisations sociales",
  "Arbeit im Ausland": "Le travail à l'étranger",
  "Ehrenamtliche Arbeit": "Le travail bénévole",
  "Sie ist strafbar — und wer so arbeitet, hat weder Kranken- noch Rentenversicherung noch Kündigungsschutz.":
    "Il tombe sous le coup de la loi — et qui travaille ainsi n'a ni assurance maladie, ni assurance retraite, ni protection contre le licenciement.",
  "Was ist ein Tarifvertrag?": "Qu'est-ce qu'un Tarifvertrag, une convention collective ?",
  "Ein Vertrag zwischen Arbeitnehmer und Arbeitgeber":
    "Un contrat entre le salarié et l'employeur",
  "Eine Vereinbarung zwischen Gewerkschaft und Arbeitgeberseite über Löhne und Arbeitsbedingungen":
    "Un accord entre un syndicat et le patronat sur les salaires et les conditions de travail",
  "Der Vertrag über die Sozialversicherung": "Le contrat portant sur la sécurité sociale",
  "Ein Vertrag über Stromtarife": "Un contrat sur les tarifs de l'électricité",
  "Gewerkschaften und Arbeitgeberverbände handeln ihn kollektiv aus. Der einzelne Arbeitsvertrag steht davon getrennt.":
    "Syndicats et fédérations patronales le négocient collectivement. Le contrat de travail individuel en reste distinct.",
  "Darf ein Arbeitgeber jemandem kündigen, weil er sich an einem Streik beteiligt hat?":
    "Un employeur peut-il licencier quelqu'un parce qu'il a pris part à une grève ?",
  "Nein, das Streikrecht ist geschützt": "Non, le droit de grève est protégé",
  "Nur bei längeren Streiks": "Seulement en cas de grève prolongée",
  "Nur in kleinen Betrieben": "Seulement dans les petites entreprises",
  "Wer sich an einem gewerkschaftlich getragenen Streik beteiligt, darf dafür nicht gekündigt werden.":
    "Qui participe à une grève portée par un syndicat ne peut être licencié pour cela.",
  "Was bleibt vom Bruttolohn nach Abzug von Steuern und Sozialabgaben?":
    "Que reste-t-il du salaire brut après déduction des impôts et des cotisations sociales ?",
  "Der Tariflohn": "Le salaire conventionnel",
  "Der Nettolohn": "Le salaire net",
  "Der Mindestlohn": "Le salaire minimum",
  "Der Grundlohn": "Le salaire de base",
  "Das Netto ist der Betrag, der auf dem Konto ankommt. Brutto ist der Lohn vor allen Abzügen.":
    "Le net est la somme qui arrive sur le compte. Le brut est le salaire avant toute déduction.",
  "Was gehört in Deutschland in die Biotonne?":
    "Que met-on en Allemagne dans la poubelle des biodéchets ?",
  "Verpackungen aus Plastik": "Les emballages en plastique",
  "Küchen- und Gartenabfälle": "Les déchets de cuisine et de jardin",
  "Altpapier": "Le vieux papier",
  "Glasflaschen": "Les bouteilles en verre",
  "Mülltrennung ist Pflicht: Bioabfall, Papier, Verpackungen, Restmüll und Glas nach Farben getrennt.":
    "Le tri des déchets est obligatoire : biodéchets, papier, emballages, ordures résiduelles, et le verre séparé par couleur.",
  "Was ist Pfand?": "Qu'est-ce que le Pfand, la consigne ?",
  "Eine Steuer auf Getränke": "Une taxe sur les boissons",
  "Ein Betrag, den man beim Kauf zahlt und bei Rückgabe der Flasche zurückbekommt":
    "Une somme versée à l'achat et rendue lorsqu'on rapporte la bouteille",
  "Die Gebühr für die Mülltonne": "La redevance pour la poubelle",
  "Ein Rabatt beim Einkauf": "Une remise à l'achat",
  "Auf viele Flaschen und Dosen wird Pfand erhoben. Bei der Rückgabe im Laden bekommt man das Geld zurück.":
    "Beaucoup de bouteilles et de canettes sont consignées. En les rapportant au magasin, on récupère son argent.",
  "Darf ein Vermieter die Wohnung betreten, wann er möchte?":
    "Un bailleur peut-il entrer dans le logement quand il veut ?",
  "Ja, ihm gehört die Wohnung": "Oui, le logement lui appartient",
  "Nein, nur nach Ankündigung und mit einem berechtigten Grund":
    "Non, seulement après l'avoir annoncé et pour un motif légitime",
  "Ja, wenn er einen Schlüssel hat": "Oui, s'il a une clé",
  "Nur zusammen mit der Polizei": "Seulement accompagné de la police",
  "Die Wohnung ist geschützt. Ohne Ankündigung und triftigen Grund darf auch der Eigentümer nicht hinein.":
    "Le domicile est protégé. Sans annonce et sans motif sérieux, même le propriétaire n'a pas le droit d'y entrer.",
  "Wann musst du ein Ticket für Bus oder Bahn haben?":
    "Quand faut-il avoir un titre de transport pour le bus ou le train ?",
  "Erst wenn kontrolliert wird": "Seulement au moment du contrôle",
  "Vor dem Einsteigen": "Avant de monter",
  "Am Ende der Fahrt": "À la fin du trajet",
  "Nur zu Stoßzeiten": "Seulement aux heures de pointe",
  "Das gültige Ticket braucht man vor dem Einsteigen. Fahren ohne Fahrschein kostet ein erhöhtes Beförderungsentgelt.":
    "Il faut un titre valable avant de monter. Voyager sans billet coûte un supplément de transport majoré.",
  "Welche Behörde ist für Aufenthaltstitel und Einbürgerung zuständig?":
    "Quelle administration s'occupe des titres de séjour et de la naturalisation ?",
  "Die Ausländerbehörde": "L'Ausländerbehörde",
  "Die Agentur für Arbeit": "L'Agentur für Arbeit",
  "Die Ausländerbehörde. Das Bürgeramt macht die Meldung, das Finanzamt die Steuer, das Standesamt Heirat und Geburt.":
    "L'Ausländerbehörde. Le Bürgeramt fait la déclaration de domicile, le Finanzamt l'impôt, le Standesamt le mariage et la naissance.",
  "Was solltest du tun, bevor du einen Miet- oder Handyvertrag unterschreibst?":
    "Que faire avant de signer un bail ou un contrat de téléphonie ?",
  "Sofort unterschreiben, um das Angebot zu sichern":
    "Signer aussitôt, pour ne pas perdre l'offre",
  "Ihn lesen und bei Unklarheiten nachfragen oder dich beraten lassen":
    "Le lire et, en cas de doute, poser des questions ou se faire conseiller",
  "Nur den Preis prüfen": "Ne vérifier que le prix",
  "Ihn von einem Nachbarn unterschreiben lassen": "Le faire signer par un voisin",
  "Eine Unterschrift bindet. Die Verbraucherzentrale und Mietervereine beraten günstig, wenn etwas unklar ist.":
    "Une signature engage. Les associations de consommateurs et de locataires conseillent à bas prix quand quelque chose n'est pas clair.",
  "Welche Nummer wählst du in Deutschland, wenn du die Polizei brauchst?":
    "Quel numéro compose-t-on en Allemagne quand on a besoin de la police ?",
  "911": "911",
  "110 für die Polizei, 112 für Notarzt und Feuerwehr. Beide sind kostenlos.":
    "Le 110 pour la police, le 112 pour le SAMU et les pompiers. Les deux sont gratuits.",
  "Wer ist in Deutschland krankenversichert?": "Qui est assuré maladie en Allemagne ?",
  "Nur Berufstätige": "Seuls les actifs",
  "Alle Menschen — die Krankenversicherung ist Pflicht":
    "Tout le monde — l'assurance maladie est obligatoire",
  "Nur wer sich freiwillig versichert": "Seulement ceux qui s'assurent volontairement",
  "Versicherungspflicht für alle: gesetzlich oder privat, aber niemand bleibt ohne Versicherung.":
    "L'assurance est obligatoire pour tous : au régime légal ou en privé, mais personne ne reste sans couverture.",
  "Welche Versicherung zahlt Schäden, die du anderen zufügst?":
    "Quelle assurance paie les dommages que l'on cause à autrui ?",
  "Die Hausratversicherung": "L'assurance du mobilier",
  "Die Haftpflichtversicherung": "L'assurance responsabilité civile",
  "Die private Haftpflicht ist freiwillig, aber dringend zu empfehlen — sie deckt Schäden an fremdem Eigentum und an Personen.":
    "La responsabilité civile privée est facultative, mais vivement conseillée — elle couvre les dommages aux biens d'autrui et aux personnes.",
  "Welche Versicherung ist für jedes Auto gesetzlich vorgeschrieben?":
    "Quelle assurance la loi impose-t-elle pour toute voiture ?",
  "Die Vollkaskoversicherung": "L'assurance tous risques",
  "Die Kfz-Haftpflichtversicherung": "L'assurance responsabilité civile automobile",
  "Die Rechtsschutzversicherung": "L'assurance protection juridique",
  "Ohne Kfz-Haftpflicht darf kein Fahrzeug bewegt werden. Kasko ist dagegen freiwillig.":
    "Sans responsabilité civile automobile, aucun véhicule ne peut circuler. L'assurance dommages, elle, est facultative.",
  "An wen wendest du dich außerhalb der Sprechzeiten bei einem Problem, das kein Notfall ist?":
    "À qui s'adresse-t-on en dehors des heures de consultation pour un problème qui n'est pas une urgence ?",
  "An die 110": "Au 110",
  "An den ärztlichen Bereitschaftsdienst unter 116117": "À la permanence médicale, au 116117",
  "An das Gesundheitsamt": "Au service de santé publique",
  "An die Krankenkasse": "À la caisse d'assurance maladie",
  "116117 ist der ärztliche Bereitschaftsdienst. Die 112 bleibt echten Notfällen vorbehalten.":
    "Le 116117 est la permanence médicale. Le 112 reste réservé aux véritables urgences.",
  "Was musst du beim Arztbesuch dabeihaben?":
    "Que faut-il avoir sur soi en allant chez le médecin ?",
  "Den Personalausweis": "La carte d'identité",
  "Die Gesundheitskarte der Krankenkasse": "La carte de santé de la caisse d'assurance maladie",
  "Den Arbeitsvertrag": "Le contrat de travail",
  "Die Steuernummer": "Le numéro fiscal",
  "Ohne Gesundheitskarte kann die Praxis die Behandlung nicht abrechnen — dann musst du unter Umständen selbst zahlen.":
    "Sans carte de santé, le cabinet ne peut pas facturer les soins — il se peut alors qu'il faille payer soi-même.",
  "An welchen Tagen ist in Deutschland Weihnachten gesetzlicher Feiertag?":
    "Quels jours de Noël sont fériés en Allemagne ?",
  "Am 24. und 25. Dezember": "Les 24 et 25 décembre",
  "Am 25. und 26. Dezember": "Les 25 et 26 décembre",
  "Nur am 24. Dezember": "Le 24 décembre seulement",
  "Vom 24. bis 31. Dezember": "Du 24 au 31 décembre",
  "Der 25. und 26. Dezember sind gesetzliche Feiertage. Heiligabend am 24. ist ein normaler Arbeitstag, meist mit verkürzten Zeiten.":
    "Les 25 et 26 décembre sont fériés. Le 24, la veille de Noël, est un jour ouvré normal, le plus souvent écourté.",
  "Wie finanziert sich der öffentlich-rechtliche Rundfunk in Deutschland?":
    "Comment l'audiovisuel public se finance-t-il en Allemagne ?",
  "Aus Steuern": "Par l'impôt",
  "Über den Rundfunkbeitrag der Haushalte":
    "Par le Rundfunkbeitrag, la redevance audiovisuelle des foyers",
  "Allein durch Werbung": "Par la seule publicité",
  "Durch Spenden": "Par des dons",
  "Jeder Haushalt zahlt den Rundfunkbeitrag. Diese Finanzierung soll ARD und ZDF unabhängig von Regierung und Werbekunden halten.":
    "Chaque foyer paie le Rundfunkbeitrag. Ce financement doit garder l'ARD et la ZDF indépendantes du gouvernement et des annonceurs.",
  "Welcher deutsche Dichter schrieb den „Faust“?": "Quel poète allemand a écrit « Faust » ?",
  "Heinrich Heine": "Heinrich Heine",
  "Goethe. Schiller schrieb unter anderem „Wilhelm Tell“ und „Die Räuber“.":
    "Goethe. Schiller a écrit entre autres « Wilhelm Tell » et « Les Brigands ».",
  "Wofür ist Johannes Gutenberg bekannt?": "Pour quoi Johannes Gutenberg est-il connu ?",
  "Für die Entdeckung der Radioaktivität": "Pour la découverte de la radioactivité",
  "Für den Buchdruck mit beweglichen Lettern": "Pour l'imprimerie à caractères mobiles",
  "Für den Bau des ersten Automobils": "Pour la construction de la première automobile",
  "Für die Relativitätstheorie": "Pour la théorie de la relativité",
  "Gutenberg druckte im 15. Jahrhundert mit beweglichen Lettern. Carl Benz baute das Auto, Einstein entwickelte die Relativitätstheorie.":
    "Gutenberg imprimait au quinzième siècle avec des caractères mobiles. Carl Benz a construit l'automobile, Einstein a élaboré la théorie de la relativité.",
  "Was ist ein Ehrenamt?": "Qu'est-ce qu'un Ehrenamt, un engagement bénévole ?",
  "Ein besonders gut bezahltes Amt": "Une charge particulièrement bien payée",
  "Eine freiwillige, unbezahlte Tätigkeit für die Allgemeinheit":
    "Une activité volontaire et non rémunérée au service de tous",
  "Ein politisches Wahlamt": "Une charge politique élective",
  "Ein Ehrentitel für Verdienste": "Un titre honorifique pour services rendus",
  "Millionen Menschen engagieren sich unbezahlt in Vereinen, bei der Feuerwehr oder in der Nachbarschaftshilfe.":
    "Des millions de gens s'engagent sans être payés dans des associations, chez les pompiers ou dans l'entraide de voisinage.",
  "In welcher Stadt findet das Oktoberfest statt?": "Dans quelle ville se tient l'Oktoberfest ?",
  "In Köln": "À Cologne",
  "In München": "À Munich",
  "In Stuttgart": "À Stuttgart",
  "In Berlin": "À Berlin",
  "In München. Karneval wird dagegen vor allem im Rheinland gefeiert, etwa in Köln und Düsseldorf.":
    "À Munich. Le carnaval, lui, se fête surtout en Rhénanie, à Cologne et à Düsseldorf par exemple.",
  "Für wen gelten die Grundrechte in Deutschland?":
    "Pour qui les droits fondamentaux valent-ils en Allemagne ?",
  "Für alle Menschen in Deutschland, einige Rechte allerdings nur für Deutsche":
    "Pour toute personne en Allemagne, certains droits toutefois pour les seuls Allemands",
  "Nur für Erwachsene": "Pour les adultes seulement",
  "Nur für Menschen mit einem Aufenthaltstitel":
    "Pour les seules personnes munies d'un titre de séjour",
  "Die Menschenwürde und die meisten Grundrechte gelten für jeden. Einige wenige — etwa das Wahlrecht zum Bundestag — sind an die deutsche Staatsangehörigkeit gebunden.":
    "La dignité humaine et la plupart des droits fondamentaux valent pour chacun. Quelques-uns — le droit de vote au Bundestag par exemple — sont liés à la nationalité allemande.",
  "Was bedeutet die Versammlungsfreiheit?": "Que signifie la liberté de réunion ?",
  "Man darf sich überall aufhalten": "On a le droit de se tenir partout",
  "Man darf sich friedlich und ohne Waffen versammeln, auch zu Demonstrationen":
    "On a le droit de se réunir paisiblement et sans armes, y compris pour manifester",
  "Man darf jederzeit Straßen blockieren": "On a le droit de bloquer les rues à tout moment",
  "Man darf nur mit Genehmigung der Polizei demonstrieren":
    "On ne peut manifester qu'avec l'autorisation de la police",
  "Artikel 8 schützt friedliche Versammlungen. Unter freiem Himmel muss eine Demonstration angemeldet, aber nicht genehmigt werden.":
    "L'article 8 protège les réunions paisibles. En plein air, une manifestation doit être déclarée, mais non autorisée.",
  "Was schützt Artikel 13 des Grundgesetzes?": "Que protège l'article 13 du Grundgesetz ?",
  "Das Eigentum": "La propriété",
  "Die Unverletzlichkeit der Wohnung": "L'inviolabilité du domicile",
  "Das Briefgeheimnis": "Le secret de la correspondance",
  "Die Berufsfreiheit": "La liberté professionnelle",
  "Die Wohnung ist geschützt: Durchsuchungen brauchen in der Regel eine richterliche Anordnung.":
    "Le domicile est protégé : une perquisition exige en règle générale une décision de justice.",
  "Darf der Staat in Deutschland eine Zeitung verbieten, weil sie ihn kritisiert?":
    "L'État peut-il interdire un journal en Allemagne parce qu'il le critique ?",
  "Ja, bei scharfer Kritik": "Oui, en cas de critique acerbe",
  "Nein, es gilt die Pressefreiheit und eine Zensur findet nicht statt":
    "Non, la liberté de la presse s'applique et il n'y a pas de censure",
  "Nur mit Zustimmung des Bundeskanzlers": "Seulement avec l'accord du Bundeskanzler",
  "Artikel 5 verbietet die Zensur ausdrücklich. Kritik an der Regierung ist die Aufgabe freier Presse, nicht ihr Vergehen.":
    "L'article 5 interdit expressément la censure. Critiquer le gouvernement est la tâche d'une presse libre, non son délit.",
  "Wer darf in Deutschland ein Gesetz für verfassungswidrig erklären?":
    "Qui peut, en Allemagne, déclarer une loi contraire à la constitution ?",
  "Der Bundestag mit einfacher Mehrheit": "Le Bundestag, à la majorité simple",
  "Nur das Bundesverfassungsgericht. Der Bundespräsident prüft beim Unterschreiben lediglich, ob ein Gesetz ordnungsgemäß zustande gekommen ist.":
    "Le Bundesverfassungsgericht seul. En signant, le Bundespräsident vérifie uniquement si la loi a été adoptée dans les formes.",
  "Was bedeutet es, dass die Grundrechte den Staat binden?":
    "Que veut dire que les droits fondamentaux lient l'État ?",
  "Der Staat muss alle Bürger finanziell unterstützen":
    "L'État doit soutenir financièrement tous les citoyens",
  "Gesetzgebung, Verwaltung und Gerichte müssen die Grundrechte beachten":
    "Le législateur, l'administration et les tribunaux doivent respecter les droits fondamentaux",
  "Nur die Polizei muss sich daran halten": "Seule la police doit s'y tenir",
  "Die Grundrechte gelten ausschließlich zwischen Privatpersonen":
    "Les droits fondamentaux ne valent qu'entre particuliers",
  "Artikel 1 Absatz 3: Die Grundrechte binden alle drei Gewalten unmittelbar. Sie sind kein Programmsatz, sondern geltendes Recht.":
    "Article 1, alinéa 3 : les droits fondamentaux lient directement les trois pouvoirs. Ils ne sont pas une déclaration d'intention, mais du droit en vigueur.",
  "Was gehört NICHT zu den Grundrechten?":
    "Qu'est-ce qui ne fait PAS partie des droits fondamentaux ?",
  "Die Glaubensfreiheit": "La liberté de croyance",
  "Das Recht auf einen kostenlosen Führerschein": "Le droit à un permis de conduire gratuit",
  "Die Freiheit der Person": "La liberté de la personne",
  "Einen Anspruch auf einen kostenlosen Führerschein gibt es nicht. Glaube, Beruf und persönliche Freiheit sind dagegen Grundrechte.":
    "Aucun droit à un permis de conduire gratuit n'existe. La croyance, le métier et la liberté personnelle sont en revanche des droits fondamentaux.",
  "Wie lange hast du Zeit für den Einbürgerungstest?":
    "De combien de temps dispose-t-on pour le test de naturalisation ?",
  "30 Minuten": "30 minutes",
  "60 Minuten": "60 minutes",
  "90 Minuten": "90 minutes",
  "Es gibt kein Zeitlimit": "Il n'y a pas de limite de temps",
  "60 Minuten für 33 Fragen — knapp zwei Minuten pro Frage, also genug Zeit zum Nachdenken.":
    "60 minutes pour 33 questions — un peu moins de deux minutes par question, donc assez de temps pour réfléchir.",
  "Wer kontrolliert in Deutschland die Regierung?": "Qui contrôle le gouvernement en Allemagne ?",
  "Das Parlament, die Gerichte, die Presse und die Wähler":
    "Le parlement, les tribunaux, la presse et les électeurs",
  "Nur die Polizei": "La police seule",
  "Mehrere Instanzen zugleich: der Bundestag durch Anfragen und Ausschüsse, die Gerichte durch Urteile, die Presse durch Öffentlichkeit und die Wähler durch die nächste Wahl.":
    "Plusieurs instances à la fois : le Bundestag par ses questions et ses commissions, les tribunaux par leurs jugements, la presse par la publicité qu'elle donne aux choses, et les électeurs à l'élection suivante.",
  "Was ist mit „Volkssouveränität“ gemeint?":
    "Qu'entend-on par « Volkssouveränität », la souveraineté du peuple ?",
  "Das Volk kann jederzeit Gesetze aufheben": "Le peuple peut abroger les lois à tout moment",
  "Alle Staatsgewalt geht vom Volk aus": "Tout pouvoir d'État émane du peuple",
  "Das Volk verwaltet die Steuern selbst": "Le peuple gère lui-même les impôts",
  "Jeder darf selbst entscheiden, welche Gesetze für ihn gelten":
    "Chacun décide lui-même quelles lois valent pour lui",
  "Artikel 20: Die Macht kommt vom Volk und wird durch Wahlen und die drei Gewalten ausgeübt — nicht durch Einzelentscheidungen jedes Bürgers.":
    "Article 20 : le pouvoir vient du peuple et s'exerce par les élections et par les trois pouvoirs — non par la décision de chaque citoyen pris à part.",
  "Was ist eine Diktatur?": "Qu'est-ce qu'une dictature ?",
  "Ein Staat mit vielen Parteien": "Un État à plusieurs partis",
  "Ein Staat, in dem eine Person oder Gruppe ohne Kontrolle herrscht":
    "Un État où une personne ou un groupe règne sans contrôle",
  "Ein Staat mit einem Königshaus": "Un État doté d'une maison royale",
  "Ein Staat ohne Steuern": "Un État sans impôts",
  "Kennzeichen sind fehlende freie Wahlen, keine Gewaltenteilung, keine unabhängigen Gerichte und keine Meinungsfreiheit.":
    "Ses marques sont l'absence d'élections libres, de séparation des pouvoirs, de tribunaux indépendants et de liberté d'expression.",
  "Welcher Grundsatz macht Deutschland zu einem Rechtsstaat?":
    "Quel principe fait de l'Allemagne un État de droit ?",
  "Staatliches Handeln ist an Gesetz und Recht gebunden und gerichtlich überprüfbar":
    "L'action de l'État est tenue par la loi et le droit, et peut être contrôlée par un juge",
  "Gerichte entscheiden nach eigenem Ermessen": "Les tribunaux décident à leur gré",
  "Entscheidend ist die Überprüfbarkeit: Gegen jede staatliche Entscheidung kann man vor Gericht ziehen.":
    "L'essentiel est ce contrôle possible : contre toute décision de l'État on peut aller devant un juge.",
  "Was passiert, wenn eine Partei die freiheitliche demokratische Grundordnung beseitigen will?":
    "Que se passe-t-il si un parti veut abolir l'ordre démocratique et libéral fondamental ?",
  "Nichts, das ist von der Meinungsfreiheit gedeckt": "Rien, la liberté d'expression le couvre",
  "Das Bundesverfassungsgericht kann sie verbieten":
    "Le Bundesverfassungsgericht peut l'interdire",
  "Der Bundeskanzler löst sie auf": "Le Bundeskanzler le dissout",
  "Sie verliert automatisch ihre Zulassung": "Il perd automatiquement son agrément",
  "Ein Parteiverbot ist möglich, aber ausschließlich durch das Bundesverfassungsgericht — damit keine Regierung ihre Gegner ausschalten kann.":
    "Interdire un parti est possible, mais par le seul Bundesverfassungsgericht — pour qu'aucun gouvernement ne puisse écarter ses adversaires.",
  "Wer schreibt in Deutschland die Gesetze?": "Qui écrit les lois en Allemagne ?",
  "Die Gerichte": "Les tribunaux",
  "Bundestag und Bundesrat": "Le Bundestag et le Bundesrat",
  "Die Gesetzgebung liegt bei Bundestag und Bundesrat. Gerichte wenden Gesetze an, sie machen sie nicht.":
    "La législation appartient au Bundestag et au Bundesrat. Les tribunaux appliquent les lois, ils ne les font pas.",
  "Was bedeutet „Republik“?": "Que signifie « république » ?",
  "Das Staatsoberhaupt wird gewählt und regiert nicht auf Lebenszeit":
    "Le chef de l'État est élu et ne règne pas à vie",
  "Es gibt mehrere Bundesländer": "Il y a plusieurs Länder",
  "Der Staat erhebt keine Steuern": "L'État ne lève pas d'impôts",
  "Die Kirche ist vom Staat getrennt": "L'Église est séparée de l'État",
  "In einer Republik gibt es keinen Monarchen; das Staatsoberhaupt wird auf Zeit gewählt.":
    "Dans une république, il n'y a pas de monarque ; le chef de l'État est élu pour un temps donné.",
  "Warum ist die Unabhängigkeit der Gerichte für die Gewaltenteilung wichtig?":
    "Pourquoi l'indépendance des tribunaux importe-t-elle à la séparation des pouvoirs ?",
  "Damit Urteile schneller gefällt werden": "Pour que les jugements soient rendus plus vite",
  "Damit Gerichte auch gegen die Regierung entscheiden können":
    "Pour que les tribunaux puissent aussi trancher contre le gouvernement",
  "Damit Richter mehr verdienen": "Pour que les juges gagnent davantage",
  "Damit weniger Gesetze nötig sind": "Pour qu'il faille moins de lois",
  "Eine Justiz, die von der Regierung abhängt, kann sie nicht kontrollieren. Genau deshalb sind Richter nur dem Gesetz unterworfen.":
    "Une justice qui dépend du gouvernement ne peut pas le contrôler. C'est précisément pour cela que les juges ne sont soumis qu'à la loi.",
  "Wo hat der Deutsche Bundestag seinen Sitz?": "Où le Bundestag allemand siège-t-il ?",
  "In Bonn": "À Bonn",
  "In Frankfurt am Main": "À Francfort-sur-le-Main",
  "Im Reichstagsgebäude in Berlin. Bonn war bis 1999 Regierungssitz und ist heute Bundesstadt.":
    "Au Reichstag, à Berlin. Bonn fut siège du gouvernement jusqu'en 1999 et porte aujourd'hui le titre de ville fédérale.",
  "Was ist die Aufgabe der Opposition im Bundestag?":
    "Quelle est la tâche de l'opposition au Bundestag ?",
  "Die Regierung zu unterstützen": "Soutenir le gouvernement",
  "Die Regierung zu kontrollieren und Alternativen vorzuschlagen":
    "Contrôler le gouvernement et proposer d'autres solutions",
  "Die Gesetze auszuführen": "Appliquer les lois",
  "Die Wahlen zu organisieren": "Organiser les élections",
  "Kontrolle und Alternative — deshalb hat die Opposition eigene Rechte, etwa beim Einsetzen von Untersuchungsausschüssen.":
    "Contrôler et proposer autre chose — d'où les droits propres de l'opposition, notamment pour instituer des commissions d'enquête.",
  "Wer leitet die Sitzungen des Bundestages?": "Qui dirige les séances du Bundestag ?",
  "Der älteste Abgeordnete": "Le doyen des députés",
  "Der Bundestagspräsident führt die Sitzungen und wahrt die Ordnung des Hauses. Protokollarisch steht er an zweiter Stelle im Staat.":
    "Le président du Bundestag conduit les séances et fait respecter l'ordre de la maison. Au protocole, il vient au deuxième rang de l'État.",
  "Wann muss der Bundesrat einem Gesetz zwingend zustimmen?":
    "Quand le Bundesrat doit-il obligatoirement approuver une loi ?",
  "Bei jedem Gesetz": "Pour toute loi",
  "Bei Zustimmungsgesetzen, etwa wenn Interessen der Länder berührt sind":
    "Pour les lois soumises à approbation, par exemple lorsque les intérêts des Länder sont touchés",
  "Nur bei Verfassungsänderungen": "Seulement pour les révisions constitutionnelles",
  "Nie, er kann nur Empfehlungen abgeben": "Jamais, il ne peut que formuler des recommandations",
  "Zustimmungsgesetze brauchen sein Ja. Bei Einspruchsgesetzen kann der Bundestag einen Einspruch überstimmen.":
    "Les lois soumises à approbation ont besoin de son accord. Pour les lois sujettes à opposition, le Bundestag peut passer outre.",
  "Was ist der Vermittlungsausschuss?": "Qu'est-ce que le Vermittlungsausschuss ?",
  "Ein Gericht für Streit zwischen Parteien": "Un tribunal pour les litiges entre partis",
  "Ein gemeinsames Gremium von Bundestag und Bundesrat, das bei Uneinigkeit einen Kompromiss sucht":
    "Un organe commun au Bundestag et au Bundesrat, qui cherche un compromis en cas de désaccord",
  "Ein Ausschuss zur Vermittlung von Arbeitsplätzen":
    "Une commission de placement des demandeurs d'emploi",
  "Der Ausschuss, der den Kanzler vorschlägt": "La commission qui propose le chancelier",
  "Wenn sich Bundestag und Bundesrat über ein Gesetz nicht einig werden, sucht dieser Ausschuss einen gemeinsamen Vorschlag.":
    "Quand le Bundestag et le Bundesrat ne s'entendent pas sur une loi, cette commission cherche une proposition commune.",
  "Was bedeutet das freie Mandat eines Abgeordneten?":
    "Que signifie le mandat libre d'un député ?",
  "Er muss immer so stimmen, wie seine Partei es beschließt":
    "Il doit toujours voter comme son parti en a décidé",
  "Er ist nur seinem Gewissen verpflichtet und an Weisungen nicht gebunden":
    "Il n'est tenu que par sa conscience et n'est lié par aucune instruction",
  "Er darf beliebig oft fehlen": "Il peut s'absenter autant qu'il veut",
  "Er braucht keine Wahl": "Il n'a pas besoin d'être élu",
  "Artikel 38: Abgeordnete sind Vertreter des ganzen Volkes und an Aufträge nicht gebunden — auch nicht an die der eigenen Fraktion.":
    "Article 38 : les députés représentent le peuple tout entier et ne sont liés par aucun mandat impératif — pas même par celui de leur propre Fraktion.",
  "Wie oft muss ein Gesetzentwurf im Bundestag beraten werden?":
    "Combien de fois un projet de loi doit-il être débattu au Bundestag ?",
  "Einmal": "Une fois",
  "In der Regel in drei Lesungen": "En règle générale en trois lectures",
  "Fünfmal": "Cinq fois",
  "So oft die Regierung es wünscht": "Autant de fois que le gouvernement le souhaite",
  "Drei Lesungen, dazwischen die Arbeit in den Fachausschüssen — damit ein Gesetz nicht im Vorbeigehen beschlossen wird.":
    "Trois lectures, et entre elles le travail des commissions compétentes — pour qu'une loi ne soit pas votée en passant.",
  "Wer beschließt über die Einnahmen und Ausgaben des Bundes?":
    "Qui décide des recettes et des dépenses de la Fédération ?",
  "Der Bundesfinanzminister allein": "Le ministre fédéral des Finances, seul",
  "Der Bundestag mit dem Haushaltsgesetz": "Le Bundestag, par la loi de finances",
  "Die Bundesbank": "La Bundesbank",
  "Das Budgetrecht liegt beim Parlament. Die Regierung schlägt den Haushalt vor, beschließen muss ihn der Bundestag.":
    "Le Budgetrecht appartient au parlement. Le gouvernement propose le budget, c'est au Bundestag de l'adopter.",
  "Wo hat der Bundespräsident seinen Amtssitz?":
    "Où le Bundespräsident a-t-il sa résidence officielle ?",
  "Im Kanzleramt": "À la chancellerie",
  "Im Schloss Bellevue": "Au château de Bellevue",
  "Im Reichstagsgebäude": "Au Reichstag",
  "In der Villa Hammerschmidt in Bonn": "À la villa Hammerschmidt, à Bonn",
  "Schloss Bellevue in Berlin. Die Villa Hammerschmidt in Bonn ist der zweite Amtssitz.":
    "Le château de Bellevue, à Berlin. La villa Hammerschmidt à Bonn est la seconde résidence officielle.",
  "Wer ernennt und entlässt die Bundesminister?": "Qui nomme et révoque les ministres fédéraux ?",
  "Der Bundespräsident auf Vorschlag des Bundeskanzlers":
    "Le Bundespräsident, sur proposition du Bundeskanzler",
  "Die Partei des Kanzlers": "Le parti du chancelier",
  "Der Kanzler schlägt vor, der Bundespräsident vollzieht. Beides gehört zusammen und wird gern zu einem Schritt verkürzt.":
    "Le chancelier propose, le Bundespräsident exécute. Les deux vont ensemble et l'on ramène volontiers cela à une seule étape.",
  "Was ist das Ressortprinzip?": "Qu'est-ce que le principe des attributions ministérielles ?",
  "Jeder Minister leitet sein Ministerium eigenständig":
    "Chaque ministre dirige son ministère en toute autonomie",
  "Der Kanzler entscheidet alles allein": "Le chancelier décide seul de tout",
  "Die Ministerien wechseln jedes Jahr": "Les ministères changent chaque année",
  "Jedes Bundesland bekommt ein Ministerium": "Chaque Land reçoit un ministère",
  "Innerhalb der Richtlinien des Kanzlers führt jeder Minister sein Haus selbstständig und in eigener Verantwortung.":
    "À l'intérieur des lignes directrices du chancelier, chaque ministre dirige sa maison de façon autonome et sous sa propre responsabilité.",
  "Was ist eine Koalition?": "Qu'est-ce qu'une coalition ?",
  "Ein Bündnis mehrerer Parteien, die gemeinsam regieren":
    "Une alliance de plusieurs partis qui gouvernent ensemble",
  "Ein Zusammenschluss von Bundesländern": "Un regroupement de Länder",
  "Ein Vertrag mit anderen Staaten": "Un traité avec d'autres États",
  "Die Verbindung von Regierung und Gerichten": "L'union du gouvernement et des tribunaux",
  "Weil eine Partei selten allein die Mehrheit hat, schließen sich mehrere zusammen und einigen sich auf einen Koalitionsvertrag.":
    "Comme un parti a rarement la majorité à lui seul, plusieurs s'unissent et s'accordent sur un contrat de coalition.",
  "Welche Aufgabe hat der Bundespräsident bei einem neuen Gesetz?":
    "Quel rôle le Bundespräsident joue-t-il face à une loi nouvelle ?",
  "Er schreibt den Gesetzentwurf": "Il rédige le projet de loi",
  "Er fertigt das Gesetz aus und prüft dabei, ob es verfassungsgemäß zustande gekommen ist":
    "Il promulgue la loi et vérifie à cette occasion qu'elle a été adoptée conformément à la constitution",
  "Er stimmt im Bundestag mit ab": "Il prend part au vote du Bundestag",
  "Er kann jedes Gesetz nach Belieben ablehnen": "Il peut refuser n'importe quelle loi à sa guise",
  "Er unterschreibt und prüft dabei das ordnungsgemäße Zustandekommen — eine politische Bewertung steht ihm nicht zu.":
    "Il signe et vérifie ce faisant la régularité de l'adoption — un jugement politique ne lui revient pas.",
  "Wie nennt man die gemeinsame Sitzung von Kanzler und Ministern?":
    "Comment appelle-t-on la séance commune du chancelier et des ministres ?",
  "Kabinettssitzung": "Conseil des ministres",
  "Plenarsitzung": "Séance plénière",
  "Bundesratssitzung": "Séance du Bundesrat",
  "Kanzler und Minister bilden das Kabinett; dort werden Gesetzentwürfe und Regierungsvorhaben beschlossen.":
    "Le chancelier et les ministres forment le cabinet ; c'est là que sont arrêtés les projets de loi et les intentions du gouvernement.",
  "Wer vertritt Deutschland völkerrechtlich nach außen?":
    "Qui représente l'Allemagne au regard du droit international ?",
  "Der Außenminister allein": "Le ministre des Affaires étrangères, seul",
  "Das Staatsoberhaupt vertritt Deutschland nach außen, etwa beim Empfang von Botschaftern. Die tägliche Außenpolitik macht die Regierung.":
    "Le chef de l'État représente l'Allemagne au dehors, par exemple lorsqu'il reçoit les ambassadeurs. La politique étrangère au quotidien, c'est le gouvernement qui la fait.",
  "Was gilt für die Amtszeit des Bundeskanzlers?":
    "Qu'en est-il de la durée du mandat du Bundeskanzler ?",
  "Höchstens zwei Amtszeiten": "Deux mandats au plus",
  "Es gibt keine Begrenzung der Amtszeiten": "Il n'y a aucune limite au nombre de mandats",
  "Höchstens acht Jahre": "Huit ans au plus",
  "Höchstens eine Amtszeit": "Un seul mandat",
  "Anders als beim Bundespräsidenten gibt es keine Obergrenze — Helmut Kohl und Angela Merkel amtierten je sechzehn Jahre.":
    "À la différence du Bundespräsident, aucun plafond n'existe — Helmut Kohl et Angela Merkel sont restés seize ans chacun.",
  "Was bekommst du vor einer Wahl per Post zugeschickt?":
    "Que reçoit-on par la poste avant une élection ?",
  "Den Stimmzettel": "Le bulletin de vote",
  "Die Wahlbenachrichtigung": "L'avis électoral",
  "Eine Liste aller Kandidaten mit Adressen":
    "Une liste de tous les candidats avec leurs adresses",
  "Nichts": "Rien",
  "Die Wahlbenachrichtigung nennt Wahllokal und Öffnungszeiten. Den Stimmzettel bekommst du erst im Wahllokal.":
    "L'avis électoral indique le bureau de vote et ses heures d'ouverture. Le bulletin, on ne le reçoit qu'au bureau de vote.",
  "Was ist die Briefwahl?": "Qu'est-ce que le vote par correspondance ?",
  "Eine Wahl, bei der man dem Kandidaten schreibt": "Une élection où l'on écrit au candidat",
  "Die Möglichkeit, vorab per Post zu wählen statt im Wahllokal":
    "La possibilité de voter à l'avance par la poste au lieu du bureau de vote",
  "Eine Wahl nur für Auslandsdeutsche": "Une élection réservée aux Allemands de l'étranger",
  "Eine Wahl per E-Mail": "Une élection par courriel",
  "Wer am Wahltag verhindert ist, kann die Unterlagen vorher anfordern und per Post wählen. Ein Grund muss nicht angegeben werden.":
    "Qui est empêché le jour du scrutin peut demander les documents à l'avance et voter par la poste. Aucun motif n'a à être donné.",
  "Was ist ein Wahlkreis?": "Qu'est-ce qu'une circonscription électorale ?",
  "Ein Bundesland": "Un Land",
  "Ein regional abgegrenztes Gebiet, in dem ein Kandidat direkt gewählt wird":
    "Un territoire délimité dans lequel un candidat est élu directement",
  "Der Kreis der Wahlberechtigten einer Partei": "L'ensemble des électeurs d'un parti",
  "Ein Raum im Wahllokal": "Une pièce du bureau de vote",
  "Mit der Erststimme wird in jedem Wahlkreis eine Person direkt gewählt.":
    "La Erststimme élit directement une personne dans chaque circonscription.",
  "Was passiert mit den Zweitstimmen einer Partei, die unter fünf Prozent bleibt?":
    "Qu'advient-il des Zweitstimmen d'un parti resté sous les cinq pour cent ?",
  "Sie werden auf die anderen Parteien verteilt und die Partei zieht nicht ein":
    "Elles se répartissent entre les autres partis et le parti n'entre pas au parlement",
  "Sie werden für die nächste Wahl aufgehoben":
    "Elles sont mises de côté pour l'élection suivante",
  "Die Partei bekommt trotzdem Sitze": "Le parti obtient tout de même des sièges",
  "Die Wahl wird wiederholt": "L'élection est recommencée",
  "Die Partei bleibt draußen; die Sitze verteilen sich unter denen, die die Hürde geschafft haben. Ausnahme: mehrere direkt gewonnene Wahlkreise.":
    "Le parti reste dehors ; les sièges se répartissent entre ceux qui ont franchi le seuil. Exception : plusieurs circonscriptions gagnées directement.",
  "Wie finanzieren sich Parteien in Deutschland überwiegend?":
    "Comment les partis se financent-ils principalement en Allemagne ?",
  "Ausschließlich durch den Staat": "Uniquement par l'État",
  "Durch Mitgliedsbeiträge, Spenden und staatliche Teilfinanzierung":
    "Par les cotisations des adhérents, les dons et un financement public partiel",
  "Ausschließlich durch Spenden von Unternehmen": "Uniquement par les dons d'entreprises",
  "Durch Eintrittsgelder bei Veranstaltungen": "Par les droits d'entrée à leurs manifestations",
  "Drei Quellen zusammen. Großspenden müssen veröffentlicht werden, damit Einfluss nachvollziehbar bleibt.":
    "Trois sources à la fois. Les gros dons doivent être publiés, pour que l'influence reste traçable.",
  "Wer darf in Deutschland eine Partei gründen?":
    "Qui a le droit de fonder un parti en Allemagne ?",
  "Nur der Bundestag": "Le Bundestag seul",
  "Grundsätzlich jeder — die Parteigründung ist frei":
    "En principe tout le monde — la fondation d'un parti est libre",
  "Nur wer schon Abgeordneter ist": "Seuls ceux qui sont déjà députés",
  "Nur mit Genehmigung des Bundespräsidenten": "Seulement avec l'autorisation du Bundespräsident",
  "Artikel 21: Die Gründung von Parteien ist frei. Verboten werden kann eine Partei nur vom Bundesverfassungsgericht.":
    "Article 21 : la fondation des partis est libre. Un parti ne peut être interdit que par le Bundesverfassungsgericht.",
  "Was passiert mit deinem Stimmzettel, wenn du ihn falsch ausfüllst?":
    "Qu'arrive-t-il à votre bulletin si vous le remplissez mal ?",
  "Er wird trotzdem gezählt": "Il est compté tout de même",
  "Er ist ungültig und zählt für keine Partei": "Il est nul et ne compte pour aucun parti",
  "Du darfst noch einmal wählen": "Vous pouvez voter une seconde fois",
  "Die Wahlhelfer korrigieren ihn": "Les assesseurs le corrigent",
  "Ein ungültiger Stimmzettel zählt für niemanden. Wer sich verschreibt, kann im Wahllokal aber einen neuen verlangen.":
    "Un bulletin nul ne compte pour personne. Qui se trompe en écrivant peut toutefois en demander un autre au bureau de vote.",
  "Warum gibt es in Deutschland keine Volksabstimmungen auf Bundesebene über einzelne Gesetze?":
    "Pourquoi n'y a-t-il pas en Allemagne de référendum fédéral sur telle ou telle loi ?",
  "Weil das Grundgesetz die Entscheidungen dem gewählten Parlament überträgt":
    "Parce que le Grundgesetz confie les décisions au parlement élu",
  "Weil es zu teuer wäre": "Parce que ce serait trop cher",
  "Weil die EU es verbietet": "Parce que l'Union européenne l'interdit",
  "Weil es keine Wahllokale gibt": "Parce qu'il n'y a pas de bureaux de vote",
  "Das Grundgesetz sieht auf Bundesebene die repräsentative Demokratie vor. In den Ländern und Gemeinden gibt es dagegen Volks- und Bürgerentscheide.":
    "Au niveau fédéral, le Grundgesetz prévoit la démocratie représentative. Dans les Länder et les communes, en revanche, il existe des référendums locaux.",
  "Wie heißt die Hauptstadt von Bayern?": "Quelle est la capitale de la Bavière ?",
  "Nürnberg": "Nuremberg",
  "Augsburg": "Augsbourg",
  "Regensburg": "Ratisbonne",
  "München. Nürnberg und Augsburg sind große bayerische Städte, aber nicht die Landeshauptstadt.":
    "Munich. Nuremberg et Augsbourg sont de grandes villes bavaroises, mais non la capitale du Land.",
  "Welches Bundesland ist flächenmäßig das größte?":
    "Quel Land est le plus grand par la superficie ?",
  "Nordrhein-Westfalen": "La Rhénanie-du-Nord-Westphalie",
  "Bayern": "La Bavière",
  "Niedersachsen": "La Basse-Saxe",
  "Baden-Württemberg": "Le Bade-Wurtemberg",
  "Bayern ist das flächengrößte Land, Nordrhein-Westfalen das bevölkerungsreichste.":
    "La Bavière est le Land le plus vaste, la Rhénanie-du-Nord-Westphalie le plus peuplé.",
  "Wer wählt den Ministerpräsidenten eines Bundeslandes?":
    "Qui élit le Ministerpräsident d'un Land ?",
  "Die Bürger direkt": "Les citoyens, directement",
  "Der Landtag": "Le Landtag",
  "Das Landesparlament wählt ihn — wie der Bundestag den Kanzler. Direkt gewählt wird er nirgends.":
    "C'est le parlement du Land qui l'élit — comme le Bundestag élit le chancelier. Nulle part il n'est élu directement.",
  "Was gilt, wenn Bundesrecht und Landesrecht sich widersprechen?":
    "Que se passe-t-il quand le droit fédéral et le droit du Land se contredisent ?",
  "Das Landesrecht gilt": "Le droit du Land l'emporte",
  "Bundesrecht bricht Landesrecht": "Le droit fédéral l'emporte sur le droit du Land",
  "Das ältere Gesetz gilt": "La loi la plus ancienne l'emporte",
  "Ein Gericht entscheidet jedes Mal neu": "Un tribunal tranche à chaque fois",
  "Artikel 31 des Grundgesetzes: Bundesrecht bricht Landesrecht.":
    "Article 31 du Grundgesetz : le droit fédéral l'emporte sur le droit du Land.",
  "Welche fünf Länder werden als „neue Bundesländer“ bezeichnet?":
    "Quels cinq Länder appelle-t-on les « nouveaux Länder » ?",
  "Die fünf kleinsten Länder": "Les cinq Länder les plus petits",
  "Die Länder, die 1990 auf dem Gebiet der DDR entstanden":
    "Les Länder nés en 1990 sur le territoire de la RDA",
  "Die Länder mit den jüngsten Landesverfassungen":
    "Les Länder aux constitutions les plus récentes",
  "Die fünf Länder mit Küstenzugang": "Les cinq Länder qui touchent à la côte",
  "Brandenburg, Mecklenburg-Vorpommern, Sachsen, Sachsen-Anhalt und Thüringen — 1990 wiedergegründet.":
    "Le Brandebourg, le Mecklembourg-Poméranie-Occidentale, la Saxe, la Saxe-Anhalt et la Thuringe — refondés en 1990.",
  "Wer leitet die Verwaltung einer Stadt oder Gemeinde?":
    "Qui dirige l'administration d'une ville ou d'une commune ?",
  "Der Ministerpräsident": "Le Ministerpräsident",
  "Der Bürgermeister": "Le maire",
  "Der Landrat des Kreises": "Le Landrat de l'arrondissement",
  "Der Innenminister": "Le ministre de l'Intérieur",
  "Der Bürgermeister, meist direkt von den Bürgern gewählt. Der Landrat steht dem Landkreis vor.":
    "Le maire, le plus souvent élu directement par les habitants. Le Landrat, lui, est à la tête de l'arrondissement.",
  "In welchem Bundesland liegt die Stadt Dresden?":
    "Dans quel Land se trouve la ville de Dresde ?",
  "Thüringen": "La Thuringe",
  "Sachsen": "La Saxe",
  "Brandenburg": "Le Brandebourg",
  "Sachsen-Anhalt": "La Saxe-Anhalt",
  "Dresden ist die Landeshauptstadt von Sachsen. Erfurt gehört zu Thüringen, Magdeburg zu Sachsen-Anhalt.":
    "Dresde est la capitale de la Saxe. Erfurt relève de la Thuringe, Magdebourg de la Saxe-Anhalt.",
  "Woher bekommen Gemeinden hauptsächlich ihr Geld?":
    "D'où les communes tirent-elles principalement leur argent ?",
  "Ausschließlich aus Spenden": "Uniquement de dons",
  "Aus eigenen Steuern, Gebühren und Zuweisungen von Land und Bund":
    "De leurs propres impôts, de redevances et de dotations du Land et de la Fédération",
  "Nur aus der Einkommensteuer ihrer Einwohner": "Du seul impôt sur le revenu de leurs habitants",
  "Sie dürfen kein eigenes Geld einnehmen":
    "Elles n'ont pas le droit d'avoir des recettes propres",
  "Gewerbe- und Grundsteuer, Gebühren für Leistungen und Zuweisungen der höheren Ebenen — ein Mischsystem.":
    "Taxe professionnelle et taxe foncière, redevances pour services rendus et dotations des échelons supérieurs — un système mixte.",
  "Was ist ein Schöffe?": "Qu'est-ce qu'un Schöffe ?",
  "Ein Anwalt der Staatsanwaltschaft": "Un avocat du parquet",
  "Ein ehrenamtlicher Richter ohne juristische Ausbildung":
    "Un juge bénévole sans formation juridique",
  "Ein Protokollführer bei Gericht": "Un greffier au tribunal",
  "Ein Gefängnisaufseher": "Un gardien de prison",
  "Bürger wirken als Schöffen an Strafurteilen mit und haben in der Hauptverhandlung dasselbe Stimmrecht wie Berufsrichter.":
    "Des citoyens participent comme Schöffen aux jugements pénaux et disposent à l'audience de la même voix que les juges de métier.",
  "Welches Gericht ist für Streit über eine Rente zuständig?":
    "Quel tribunal est compétent pour un litige sur une retraite ?",
  "Das Arbeitsgericht": "Le tribunal du travail",
  "Das Sozialgericht": "Le tribunal des affaires sociales",
  "Das Finanzgericht": "Le tribunal des finances",
  "Das Amtsgericht": "Le tribunal d'instance",
  "Sozialgerichte entscheiden über Rente, Krankenversicherung und Bürgergeld.":
    "Les tribunaux des affaires sociales tranchent sur la retraite, l'assurance maladie et le Bürgergeld.",
  "Was bedeutet „rechtskräftig“?":
    "Que signifie « rechtskräftig », passé en force de chose jugée ?",
  "Das Urteil wurde verkündet": "Le jugement a été prononcé",
  "Das Urteil ist endgültig und kann nicht mehr mit normalen Rechtsmitteln angefochten werden":
    "Le jugement est définitif et ne peut plus être attaqué par les voies de recours ordinaires",
  "Der Angeklagte hat gestanden": "L'accusé a avoué",
  "Das Urteil wurde von der Regierung bestätigt": "Le jugement a été confirmé par le gouvernement",
  "Erst mit der Rechtskraft steht ein Urteil endgültig fest — bis dahin gilt die Unschuldsvermutung weiter.":
    "Ce n'est qu'une fois passé en force de chose jugée qu'un jugement est acquis — jusque-là, la présomption d'innocence continue de valoir.",
  "Ein Vermieter kündigt dir und du hältst das für unrechtmäßig. Was kannst du tun?":
    "Un bailleur vous donne congé et vous jugez cela illégal. Que pouvez-vous faire ?",
  "Nichts, der Vermieter entscheidet": "Rien, c'est le bailleur qui décide",
  "Der Kündigung widersprechen und notfalls vor dem Amtsgericht klagen":
    "Contester le congé et, s'il le faut, saisir le tribunal d'instance",
  "Die Wohnung sofort räumen": "Vider les lieux aussitôt",
  "Die Polizei rufen": "Appeler la police",
  "Mietstreitigkeiten gehören vor die ordentlichen Gerichte, in erster Instanz meist das Amtsgericht. Mietervereine beraten vorab.":
    "Les litiges locatifs relèvent des juridictions ordinaires, en première instance le plus souvent le tribunal d'instance. Les associations de locataires conseillent en amont.",
  "Was ist der Unterschied zwischen Zivilrecht und Strafrecht?":
    "Quelle est la différence entre le droit civil et le droit pénal ?",
  "Zivilrecht gilt nur für Zivilisten": "Le droit civil ne vaut que pour les civils",
  "Zivilrecht regelt Streit zwischen Privaten, Strafrecht die Verfolgung von Straftaten durch den Staat":
    "Le droit civil règle les litiges entre particuliers, le droit pénal la poursuite des infractions par l'État",
  "Strafrecht gilt nur für Ausländer": "Le droit pénal ne vaut que pour les étrangers",
  "Es gibt keinen Unterschied": "Il n'y a aucune différence",
  "Im Zivilprozess streiten zwei Parteien, im Strafverfahren klagt der Staat durch die Staatsanwaltschaft an.":
    "Au procès civil, deux parties s'opposent ; au procès pénal, c'est l'État qui accuse, par la voix du parquet.",
  "Wer ermittelt bei einer Straftat?": "Qui enquête en cas d'infraction ?",
  "Das Gericht": "Le tribunal",
  "Polizei und Staatsanwaltschaft": "La police et le parquet",
  "Die Staatsanwaltschaft leitet das Ermittlungsverfahren, die Polizei führt es durch. Das Gericht kommt erst danach.":
    "Le parquet dirige l'enquête, la police la mène. Le tribunal ne vient qu'ensuite.",
  "Was ist eine Berufung?": "Qu'est-ce qu'un appel ?",
  "Der Beruf des Angeklagten": "Le métier de l'accusé",
  "Ein Rechtsmittel, mit dem ein Urteil von einem höheren Gericht überprüft wird":
    "Une voie de recours par laquelle un jugement est réexaminé par une juridiction supérieure",
  "Die Ernennung eines Richters": "La nomination d'un juge",
  "Die Vorladung zum Gericht": "La convocation devant le tribunal",
  "Wer mit einem Urteil nicht einverstanden ist, kann es in der nächsten Instanz überprüfen lassen.":
    "Qui n'accepte pas un jugement peut le faire réexaminer à l'instance suivante.",
  "Was passiert, wenn jemand kein Geld für einen Anwalt hat?":
    "Que se passe-t-il si quelqu'un n'a pas d'argent pour un avocat ?",
  "Er muss sich selbst verteidigen": "Il doit se défendre lui-même",
  "Er kann Beratungs- oder Prozesskostenhilfe beantragen":
    "Il peut demander l'aide au conseil ou l'aide aux frais de procédure",
  "Das Verfahren wird eingestellt": "La procédure est abandonnée",
  "Er verliert automatisch": "Il perd automatiquement",
  "Der Zugang zum Recht darf nicht am Einkommen scheitern — dafür gibt es Beratungshilfe, Prozesskostenhilfe und Pflichtverteidigung.":
    "L'accès au droit ne doit pas échouer faute de revenus — d'où l'aide au conseil, l'aide aux frais de procédure et l'avocat commis d'office.",
  "Wer zahlt die Beiträge zur gesetzlichen Rentenversicherung?":
    "Qui paie les cotisations à l'assurance retraite légale ?",
  "Nur der Arbeitnehmer": "Le salarié seul",
  "Arbeitnehmer und Arbeitgeber je zur Hälfte": "Le salarié et l'employeur, pour moitié chacun",
  "Nur der Arbeitgeber": "L'employeur seul",
  "Der Staat": "L'État",
  "Wie bei Kranken-, Pflege- und Arbeitslosenversicherung teilen sich beide Seiten den Beitrag.":
    "Comme pour l'assurance maladie, dépendance et chômage, les deux parties se partagent la cotisation.",
  "Was ist das Umlageverfahren in der Rentenversicherung?":
    "Qu'est-ce que le système par répartition dans l'assurance retraite ?",
  "Jeder spart sein eigenes Geld an": "Chacun met son propre argent de côté",
  "Die heutigen Beitragszahler finanzieren die heutigen Renten":
    "Les cotisants d'aujourd'hui financent les retraites d'aujourd'hui",
  "Der Staat legt das Geld an der Börse an": "L'État place l'argent en bourse",
  "Die Renten kommen aus der Mehrwertsteuer": "Les retraites viennent de la TVA",
  "Ein Generationenvertrag: Wer heute arbeitet, zahlt die Renten von heute und erwirbt damit einen eigenen Anspruch für später.":
    "Un contrat entre les générations : qui travaille aujourd'hui paie les retraites d'aujourd'hui et acquiert par là un droit pour plus tard.",
  "Wer hilft bei der Suche nach Arbeit und zahlt Arbeitslosengeld?":
    "Qui aide à chercher du travail et verse l'Arbeitslosengeld ?",
  "Das Jobcenter und die Agentur für Arbeit": "Le Jobcenter et l'Agentur für Arbeit",
  "Die Agentur für Arbeit zahlt Arbeitslosengeld, das Jobcenter betreut Bürgergeld-Empfänger.":
    "L'Agentur für Arbeit verse l'Arbeitslosengeld, le Jobcenter suit les bénéficiaires du Bürgergeld.",
  "Wofür ist die Berufsgenossenschaft zuständig?":
    "De quoi la Berufsgenossenschaft s'occupe-t-elle ?",
  "Für die Rente": "De la retraite",
  "Für die gesetzliche Unfallversicherung bei Arbeitsunfällen und Berufskrankheiten":
    "De l'assurance accidents légale pour les accidents du travail et les maladies professionnelles",
  "Für die Arbeitsvermittlung": "Du placement des demandeurs d'emploi",
  "Für Tarifverhandlungen": "Des négociations collectives",
  "Die Berufsgenossenschaften sind die Träger der Unfallversicherung — bezahlt allein vom Arbeitgeber.":
    "Les Berufsgenossenschaften portent l'assurance accidents — financée par le seul employeur.",
  "Was ist das Ziel des Bürgergeldes?": "Quel est le but du Bürgergeld ?",
  "Ein Zuschuss für Besserverdienende": "Une aide aux hauts revenus",
  "Die Grundsicherung des Lebensunterhalts für Erwerbsfähige ohne ausreichendes Einkommen":
    "Garantir le minimum vital aux personnes aptes au travail dont le revenu ne suffit pas",
  "Eine zusätzliche Rente": "Une retraite supplémentaire",
  "Ein Darlehen für Selbstständige": "Un prêt aux indépendants",
  "Es sichert das Existenzminimum und unterstützt zugleich den Weg zurück in Arbeit.":
    "Il assure le minimum vital et soutient en même temps le retour à l'emploi.",
  "Wie lange kann Elterngeld in der Grundvariante höchstens bezogen werden?":
    "Combien de temps l'Elterngeld peut-il au plus être versé dans sa forme de base ?",
  "3 Monate": "3 mois",
  "14 Monate zwischen beiden Elternteilen": "14 mois à se partager entre les deux parents",
  "24 Monate": "24 mois",
  "36 Monate": "36 mois",
  "Bis zu 14 Monate, wenn sich beide Elternteile die Zeit teilen; ein Elternteil allein kann höchstens 12 Monate beziehen.":
    "Jusqu'à 14 mois si les deux parents se partagent la période ; un parent seul ne peut en toucher que 12 au plus.",
  "Was ist der Unterschied zwischen Brutto und Netto?":
    "Quelle est la différence entre le brut et le net ?",
  "Brutto ist der Lohn vor Abzügen, Netto der Betrag nach Steuern und Sozialabgaben":
    "Le brut est le salaire avant déductions, le net la somme après impôts et cotisations sociales",
  "Netto ist der Lohn vor Abzügen": "Le net est le salaire avant déductions",
  "Brutto gilt nur für Selbstständige": "Le brut ne vaut que pour les indépendants",
  "Es ist dasselbe": "C'est la même chose",
  "Vom Brutto gehen Lohnsteuer und Sozialabgaben ab; das Netto landet auf dem Konto.":
    "Du brut se retranchent l'impôt sur les salaires et les cotisations sociales ; le net arrive sur le compte.",
  "Was bedeutet Versicherungspflicht in der Krankenversicherung?":
    "Que signifie l'obligation d'assurance en matière de santé ?",
  "Jeder darf sich freiwillig versichern": "Chacun peut s'assurer s'il le veut",
  "Jede Person in Deutschland muss krankenversichert sein — gesetzlich oder privat":
    "Toute personne en Allemagne doit être assurée maladie — au régime légal ou en privé",
  "Nur Arbeitnehmer müssen versichert sein": "Seuls les salariés doivent être assurés",
  "Nur wer krank ist, muss sich versichern": "Seul celui qui est malade doit s'assurer",
  "Seit 2009 gilt die allgemeine Versicherungspflicht. Niemand soll ohne Absicherung dastehen.":
    "Depuis 2009, l'obligation d'assurance vaut pour tous. Personne ne doit rester sans couverture.",
  "Wie hieß das Parlament im Deutschen Kaiserreich?":
    "Comment s'appelait le parlement de l'Empire allemand ?",
  "Der Reichstag wurde gewählt, konnte die Regierung aber nicht stürzen — der Kanzler war dem Kaiser verantwortlich.":
    "Le Reichstag était élu, mais ne pouvait pas renverser le gouvernement — le chancelier était responsable devant l'empereur.",
  "Wann begann der Erste Weltkrieg?": "Quand la Première Guerre mondiale a-t-elle commencé ?",
  "1919": "1919",
  "1914, und er endete 1918 mit der deutschen Niederlage.":
    "En 1914, et elle s'est achevée en 1918 par la défaite allemande.",
  "Wer war der erste Reichspräsident der Weimarer Republik?":
    "Qui fut le premier président du Reich sous la République de Weimar ?",
  "Paul von Hindenburg": "Paul von Hindenburg",
  "Gustav Stresemann": "Gustav Stresemann",
  "Friedrich Ebert ab 1919. Hindenburg folgte 1925 und ernannte 1933 Hitler zum Reichskanzler.":
    "Friedrich Ebert, à partir de 1919. Hindenburg lui succéda en 1925 et nomma Hitler chancelier du Reich en 1933.",
  "Welche Farben hatte die Flagge der Weimarer Republik?":
    "Quelles couleurs avait le drapeau de la République de Weimar ?",
  "Schwarz-Weiß-Rot": "Noir, blanc et rouge",
  "Schwarz-Rot-Gold": "Noir, rouge et or",
  "Schwarz-Rot-Weiß": "Noir, rouge et blanc",
  "Blau-Weiß-Rot": "Bleu, blanc et rouge",
  "Schwarz-Rot-Gold, wie heute — im Kaiserreich war es Schwarz-Weiß-Rot. Um die Farben wurde in Weimar erbittert gestritten.":
    "Noir, rouge et or, comme aujourd'hui — sous l'Empire, c'était noir, blanc et rouge. On s'est âprement disputé ces couleurs à Weimar.",
  "Was war der Reichstagsbrand von 1933 für die Nationalsozialisten?":
    "Que fut l'incendie du Reichstag de 1933 pour les nationaux-socialistes ?",
  "Ein Grund, Grundrechte per Notverordnung außer Kraft zu setzen":
    "Un motif pour suspendre les droits fondamentaux par décret d'exception",
  "Ein Anlass für Neuwahlen zum Kaiser": "L'occasion d'élire un nouvel empereur",
  "Der Beginn des Zweiten Weltkriegs": "Le début de la Seconde Guerre mondiale",
  "Das Ende ihrer Herrschaft": "La fin de leur règne",
  "Unmittelbar danach wurden zentrale Grundrechte aufgehoben — ein entscheidender Schritt zur Diktatur.":
    "Aussitôt après, des droits fondamentaux essentiels furent abolis — un pas décisif vers la dictature.",
  "Was geschah am 9. November 1918?": "Que s'est-il passé le 9 novembre 1918 ?",
  "Der Kaiser dankte ab und die Republik wurde ausgerufen":
    "L'empereur a abdiqué et la république a été proclamée",
  "Der Erste Weltkrieg begann": "La Première Guerre mondiale a commencé",
  "Die Weimarer Verfassung trat in Kraft": "La constitution de Weimar est entrée en vigueur",
  "Das Ende der Monarchie. Der 9. November trägt in der deutschen Geschichte gleich mehrere schwere Daten.":
    "La fin de la monarchie. Le 9 novembre porte dans l'histoire allemande plusieurs dates lourdes à la fois.",
  "Wie viele Jahre bestand die Weimarer Republik ungefähr?":
    "Combien d'années la République de Weimar a-t-elle duré environ ?",
  "Etwa 5 Jahre": "Environ 5 ans",
  "Etwa 14 Jahre": "Environ 14 ans",
  "Etwa 30 Jahre": "Environ 30 ans",
  "Etwa 50 Jahre": "Environ 50 ans",
  "Von 1919 bis 1933, also rund vierzehn Jahre — die erste deutsche Demokratie.":
    "De 1919 à 1933, soit quatorze ans environ — la première démocratie allemande.",
  "Welche Rolle spielte Artikel 48 der Weimarer Verfassung?":
    "Quel rôle a joué l'article 48 de la constitution de Weimar ?",
  "Er sicherte das Frauenwahlrecht": "Il garantissait le droit de vote des femmes",
  "Er erlaubte dem Reichspräsidenten, mit Notverordnungen am Parlament vorbei zu regieren":
    "Il permettait au président du Reich de gouverner par décrets d'exception, en contournant le parlement",
  "Er regelte die Steuern": "Il réglait les impôts",
  "Er verbot politische Parteien": "Il interdisait les partis politiques",
  "Das Notverordnungsrecht wurde ab 1930 zur Regel statt zur Ausnahme und höhlte das Parlament aus — deshalb kennt das Grundgesetz nichts Vergleichbares.":
    "À partir de 1930, le décret d'exception devint la règle au lieu de l'exception et vida le parlement de sa substance — c'est pourquoi le Grundgesetz ne connaît rien de tel.",
  "Wie viele Parteien waren im NS-Staat ab Sommer 1933 zugelassen?":
    "Combien de partis étaient admis dans l'État national-socialiste à partir de l'été 1933 ?",
  "Keine": "Aucun",
  "Nur eine": "Un seul",
  "Zwei": "Deux",
  "Alle wie vorher": "Tous, comme auparavant",
  "Nur die NSDAP. Alle anderen wurden verboten oder lösten sich auf.":
    "Le seul NSDAP. Tous les autres furent interdits ou se dissolurent.",
  "Was bedeutet „Gleichschaltung“?": "Que signifie « Gleichschaltung », la mise au pas ?",
  "Die Angleichung der Löhne": "L'alignement des salaires",
  "Die Unterwerfung von Verwaltung, Verbänden und Medien unter die NSDAP":
    "La soumission de l'administration, des associations et des médias au NSDAP",
  "Die Vereinheitlichung der Stromnetze": "L'unification des réseaux électriques",
  "Die Gleichstellung von Mann und Frau": "L'égalité de l'homme et de la femme",
  "Innerhalb weniger Monate wurde jede eigenständige Organisation entweder verboten oder auf Linie gebracht.":
    "En quelques mois, toute organisation autonome fut soit interdite, soit mise au pas.",
  "Was waren Konzentrationslager?": "Qu'étaient les camps de concentration ?",
  "Schulungszentren der Partei": "Des centres de formation du parti",
  "Lager, in denen politische Gegner und verfolgte Gruppen eingesperrt, misshandelt und ermordet wurden":
    "Des camps où l'on enfermait, maltraitait et assassinait les adversaires politiques et les groupes persécutés",
  "Ferienlager für Jugendliche": "Des camps de vacances pour la jeunesse",
  "Kasernen der Wehrmacht": "Des casernes de la Wehrmacht",
  "Schon 1933 eingerichtet, zunächst für politische Gegner. Später wurden sie Teil des Systems der Massenvernichtung.":
    "Créés dès 1933, d'abord pour les adversaires politiques. Plus tard, ils devinrent une pièce du système d'extermination de masse.",
  "Wer war Sophie Scholl?": "Qui était Sophie Scholl ?",
  "Eine Ministerin der Weimarer Republik": "Une ministre de la République de Weimar",
  "Eine Studentin der Widerstandsgruppe Weiße Rose, 1943 hingerichtet":
    "Une étudiante du groupe de résistance de la Rose blanche, exécutée en 1943",
  "Die erste Bundeskanzlerin": "La première femme chancelière",
  "Eine Widerstandskämpferin des 20. Juli 1944": "Une résistante du 20 juillet 1944",
  "Sie verteilte mit ihrem Bruder Hans in München Flugblätter gegen das Regime. Der 20. Juli war der militärische Widerstand um Stauffenberg.":
    "Elle distribuait à Munich, avec son frère Hans, des tracts contre le régime. Le 20 juillet, c'était la résistance militaire autour de Stauffenberg.",
  "Welches Land überfiel Deutschland am 1. September 1939?":
    "Quel pays l'Allemagne a-t-elle envahi le 1er septembre 1939 ?",
  "Frankreich": "La France",
  "Polen": "La Pologne",
  "Die Sowjetunion": "L'Union soviétique",
  "Österreich": "L'Autriche",
  "Der Überfall auf Polen löste den Zweiten Weltkrieg aus. Der Angriff auf die Sowjetunion folgte 1941.":
    "L'invasion de la Pologne a déclenché la Seconde Guerre mondiale. L'attaque contre l'Union soviétique a suivi en 1941.",
  "Was ist am 8. Mai 1945 geschehen?": "Que s'est-il passé le 8 mai 1945 ?",
  "Der Krieg in Europa endete mit der bedingungslosen Kapitulation":
    "La guerre en Europe s'est achevée par la capitulation sans condition",
  "Die Bundesrepublik wurde gegründet": "La République fédérale a été fondée",
  "Der Krieg begann": "La guerre a commencé",
  "Das Kriegsende in Europa. Heute ist der 8. Mai ein Tag des Gedenkens und der Befreiung.":
    "La fin de la guerre en Europe. Aujourd'hui, le 8 mai est un jour de mémoire et de libération.",
  "Durften Menschen im NS-Staat frei ihre Meinung sagen?":
    "Les gens pouvaient-ils dire librement leur opinion dans l'État national-socialiste ?",
  "Ja, uneingeschränkt": "Oui, sans restriction",
  "Nein, Kritik konnte Verfolgung, Haft oder den Tod bedeuten":
    "Non, la critique pouvait valoir la persécution, la prison ou la mort",
  "Ja, aber nur schriftlich": "Oui, mais par écrit seulement",
  "Nur Parteimitglieder durften kritisieren":
    "Seuls les membres du parti avaient le droit de critiquer",
  "Presse und Rundfunk waren gleichgeschaltet, abweichende Meinungen wurden verfolgt.":
    "La presse et la radio étaient mises au pas, les opinions divergentes étaient poursuivies.",
  "Warum ist das Ermächtigungsgesetz von 1933 so bedeutsam?":
    "Pourquoi la loi des pleins pouvoirs de 1933 compte-t-elle tant ?",
  "Es führte die Todesstrafe ein": "Elle a instauré la peine de mort",
  "Es übertrug der Regierung die Gesetzgebung und beseitigte damit die Gewaltenteilung":
    "Elle a transféré la législation au gouvernement et supprimé par là la séparation des pouvoirs",
  "Es verbot die Kirchen": "Elle a interdit les Églises",
  "Es beendete den Ersten Weltkrieg": "Elle a mis fin à la Première Guerre mondiale",
  "Von da an konnte die Regierung Gesetze ohne das Parlament erlassen — die entscheidende Weichenstellung zur Diktatur.":
    "Dès lors, le gouvernement pouvait édicter des lois sans le parlement — l'aiguillage décisif vers la dictature.",
  "Was ist der Holocaust?": "Qu'est-ce que la Shoah ?",
  "Eine Hungersnot im Ersten Weltkrieg": "Une famine pendant la Première Guerre mondiale",
  "Der staatlich organisierte Massenmord an den europäischen Juden":
    "Le meurtre de masse des Juifs d'Europe, organisé par l'État",
  "Ein Luftangriff auf deutsche Städte": "Un bombardement aérien sur les villes allemandes",
  "Die Vertreibung nach 1945": "Les expulsions après 1945",
  "Etwa sechs Millionen Juden wurden ermordet. Der hebräische Begriff dafür ist Schoah.":
    "Environ six millions de Juifs furent assassinés. Le mot hébreu qui le désigne est Shoah.",
  "Wo befand sich das größte nationalsozialistische Vernichtungslager?":
    "Où se trouvait le plus grand camp d'extermination national-socialiste ?",
  "Dachau": "Dachau",
  "Auschwitz": "Auschwitz",
  "Bergen-Belsen": "Bergen-Belsen",
  "Buchenwald": "Buchenwald",
  "Auschwitz im besetzten Polen. Dachau, Buchenwald und Bergen-Belsen waren Konzentrationslager auf deutschem Boden.":
    "Auschwitz, en Pologne occupée. Dachau, Buchenwald et Bergen-Belsen étaient des camps de concentration en territoire allemand.",
  "Was steht in Berlin als zentrales Mahnmal für die ermordeten Juden Europas?":
    "Qu'est-ce qui se dresse à Berlin comme mémorial central aux Juifs assassinés d'Europe ?",
  "Das Brandenburger Tor": "La porte de Brandebourg",
  "Das Denkmal für die ermordeten Juden Europas mit seinen Stelen":
    "Le mémorial aux Juifs assassinés d'Europe, avec ses stèles",
  "Die Siegessäule": "La colonne de la Victoire",
  "Der Reichstag": "Le Reichstag",
  "Das Stelenfeld nahe dem Brandenburger Tor, eröffnet 2005.":
    "Le champ de stèles près de la porte de Brandebourg, ouvert en 2005.",
  "Was sind Stolpersteine?": "Que sont les Stolpersteine, les pavés de mémoire ?",
  "Hindernisse auf Gehwegen": "Des obstacles sur les trottoirs",
  "Kleine Gedenktafeln im Boden vor den letzten frei gewählten Wohnorten von NS-Opfern":
    "De petites plaques de mémoire scellées au sol devant le dernier domicile librement choisi de victimes du nazisme",
  "Grenzsteine zwischen Bundesländern": "Des bornes entre les Länder",
  "Steine aus zerstörten Synagogen": "Des pierres provenant de synagogues détruites",
  "Messingtafeln im Pflaster, die Namen und Schicksal einzelner Opfer nennen — inzwischen über 100.000 in ganz Europa.":
    "Des plaques de laiton dans le pavé, qui donnent le nom et le destin de victimes une à une — plus de 100 000 aujourd'hui dans toute l'Europe.",
  "Welche Folge hat die NS-Vergangenheit für die deutsche Außenpolitik?":
    "Quelle conséquence le passé nazi a-t-il pour la politique étrangère allemande ?",
  "Deutschland hält sich aus allem heraus": "L'Allemagne se tient à l'écart de tout",
  "Eine besondere Verantwortung gegenüber Israel und für den Schutz von Menschenrechten":
    "Une responsabilité particulière envers Israël et pour la défense des droits de l'homme",
  "Deutschland darf keine Verträge schließen":
    "L'Allemagne n'a pas le droit de conclure de traités",
  "Deutschland ist von der UNO ausgeschlossen": "L'Allemagne est exclue de l'ONU",
  "Aus der Geschichte folgt eine dauerhafte Verpflichtung — gegenüber Israel, gegenüber jüdischem Leben in Deutschland und für Menschenrechte allgemein.":
    "De cette histoire découle un engagement durable — envers Israël, envers la vie juive en Allemagne et pour les droits de l'homme en général.",
  "Was ist Antisemitismus?": "Qu'est-ce que l'antisémitisme ?",
  "Ablehnung aller Religionen": "Le rejet de toutes les religions",
  "Feindschaft und Hass gegen Juden": "L'hostilité et la haine envers les Juifs",
  "Kritik an einer Regierung": "La critique d'un gouvernement",
  "Eine politische Partei": "Un parti politique",
  "Judenfeindschaft in ihren verschiedenen Formen. In Deutschland wird sie strafrechtlich und gesellschaftlich entschieden bekämpft.":
    "L'hostilité aux Juifs sous ses diverses formes. En Allemagne, elle est combattue avec fermeté, par le droit pénal et par la société.",
  "Ist es in Deutschland erlaubt, Hakenkreuze öffentlich zu zeigen?":
    "A-t-on le droit en Allemagne de montrer publiquement des croix gammées ?",
  "Ja, das ist Kunstfreiheit": "Oui, cela relève de la liberté de l'art",
  "Nein, das Verwenden von Kennzeichen verfassungswidriger Organisationen ist strafbar":
    "Non, l'usage des emblèmes d'organisations anticonstitutionnelles est puni par la loi",
  "Ja, auf Kleidung": "Oui, sur les vêtements",
  "Nur bei Demonstrationen": "Seulement lors des manifestations",
  "Strafbar nach § 86a StGB. Ausnahmen gelten nur für Bildung, Kunst und Wissenschaft in eindeutig ablehnendem Zusammenhang.":
    "Punissable au titre du § 86a du code pénal. Les exceptions ne valent que pour l'enseignement, l'art et la recherche, dans un contexte clairement critique.",
  "Was bedeutet „Erinnerungskultur“?":
    "Que signifie « Erinnerungskultur », la culture de la mémoire ?",
  "Das Sammeln alter Gegenstände": "La collecte d'objets anciens",
  "Der bewusste gesellschaftliche Umgang mit der eigenen Geschichte, besonders mit der NS-Zeit":
    "La façon dont une société traite délibérément sa propre histoire, et singulièrement la période nazie",
  "Der Geschichtsunterricht an Universitäten": "L'enseignement de l'histoire à l'université",
  "Das Feiern von Jahrestagen": "La célébration d'anniversaires",
  "Gedenkstätten, Gedenktage, Unterricht und Forschung zusammen — die Vergangenheit wird nicht abgeschlossen, sondern wachgehalten.":
    "Lieux de mémoire, jours de commémoration, enseignement et recherche à la fois — le passé n'est pas clos, il est tenu éveillé.",
  "Welche Stadt war Hauptstadt der Bundesrepublik bis 1990?":
    "Quelle ville fut la capitale de la République fédérale jusqu'en 1990 ?",
  "Bonn. Berlin war geteilt und wurde erst 1990 wieder Hauptstadt.":
    "Bonn. Berlin était divisée et n'est redevenue capitale qu'en 1990.",
  "Was war die Währungsreform von 1948 in den Westzonen?":
    "Qu'était la réforme monétaire de 1948 dans les zones occidentales ?",
  "Die Einführung der D-Mark": "L'introduction du deutsche mark",
  "Die Abschaffung des Bargelds": "La suppression des espèces",
  "Die Einführung der Rentenmark": "L'introduction du rentenmark",
  "Die D-Mark löste die Reichsmark ab. Die sowjetische Antwort darauf war die Berliner Blockade.":
    "Le deutsche mark a remplacé le reichsmark. La réponse soviétique fut le blocus de Berlin.",
  "Wie heißt das Wirtschaftsmodell der Bundesrepublik?":
    "Comment s'appelle le modèle économique de la République fédérale ?",
  "Planwirtschaft": "L'économie planifiée",
  "Soziale Marktwirtschaft": "L'économie sociale de marché",
  "Staatswirtschaft": "L'économie d'État",
  "Tauschwirtschaft": "L'économie de troc",
  "Freier Wettbewerb mit sozialem Ausgleich — verbunden mit dem Namen Ludwig Erhard.":
    "Libre concurrence et compensation sociale — le nom de Ludwig Erhard y reste attaché.",
  "Aus welchen Zonen entstand die Bundesrepublik Deutschland?":
    "De quelles zones la République fédérale d'Allemagne est-elle née ?",
  "Aus der sowjetischen Zone": "De la zone soviétique",
  "Aus der amerikanischen, britischen und französischen Zone":
    "Des zones américaine, britannique et française",
  "Aus allen vier Zonen": "Des quatre zones",
  "Aus der amerikanischen Zone allein": "De la seule zone américaine",
  "Die drei Westzonen wurden 1949 zur Bundesrepublik, die sowjetische Zone zur DDR.":
    "Les trois zones occidentales sont devenues en 1949 la République fédérale, la zone soviétique la RDA.",
  "Welche Bedeutung hatte das Anwerbeabkommen mit der Türkei von 1961?":
    "Quelle portée eut l'accord de recrutement conclu avec la Turquie en 1961 ?",
  "Es beendete den Krieg": "Il a mis fin à la guerre",
  "Es holte Arbeitskräfte nach Westdeutschland, von denen viele blieben":
    "Il a fait venir en Allemagne de l'Ouest des travailleurs dont beaucoup sont restés",
  "Es regelte den Handel mit Öl": "Il réglait le commerce du pétrole",
  "Es öffnete die Grenze zur DDR": "Il a ouvert la frontière avec la RDA",
  "Aus angeworbenen Arbeitskräften wurden Nachbarn, Kollegen und Familien — ein prägender Teil der Einwanderungsgeschichte.":
    "De la main-d'œuvre recrutée sont nés des voisins, des collègues et des familles — une part décisive de l'histoire de l'immigration.",
  "Was waren die „Trümmerfrauen“?":
    "Qui étaient les « Trümmerfrauen », les femmes des décombres ?",
  "Frauen, die nach dem Krieg beim Aufräumen der zerstörten Städte halfen":
    "Des femmes qui, après la guerre, ont aidé à déblayer les villes détruites",
  "Eine Gewerkschaft": "Un syndicat",
  "Frauen, die in die Westzonen flohen": "Des femmes qui ont fui vers les zones occidentales",
  "Sie räumten Schutt und retteten Ziegel für den Wiederaufbau — ein Sinnbild für den Neuanfang nach 1945.":
    "Elles déblayaient les gravats et sauvaient les briques pour la reconstruction — une image du recommencement après 1945.",
  "Wie viele Besatzungszonen hatte Deutschland nach 1945?":
    "Combien de zones d'occupation l'Allemagne comptait-elle après 1945 ?",
  "Drei": "Trois",
  "Vier": "Quatre",
  "Fünf": "Cinq",
  "Vier — USA, Großbritannien, Frankreich und Sowjetunion. Berlin war zusätzlich in vier Sektoren geteilt.":
    "Quatre — États-Unis, Grande-Bretagne, France et Union soviétique. Berlin était en outre partagée en quatre secteurs.",
  "Was bedeutet „Kalter Krieg“?": "Que signifie « guerre froide » ?",
  "Ein Krieg im Winter": "Une guerre en hiver",
  "Die jahrzehntelange Konfrontation zwischen Ost und West ohne offenen Krieg zwischen den Blöcken":
    "L'affrontement de plusieurs décennies entre l'Est et l'Ouest, sans guerre ouverte entre les blocs",
  "Ein Krieg um Rohstoffe": "Une guerre pour les matières premières",
  "Der Krieg um Berlin": "La guerre pour Berlin",
  "Spannungen, Wettrüsten und Stellvertreterkonflikte — Deutschland lag genau an der Grenze zwischen beiden Blöcken.":
    "Tensions, course aux armements et conflits par procuration — l'Allemagne se trouvait exactement sur la ligne entre les deux blocs.",
  "Wofür steht die Abkürzung DDR?": "Que veut dire le sigle DDR ?",
  "Deutsches Demokratisches Reich": "Deutsches Demokratisches Reich",
  "Deutscher Demokratischer Rat": "Deutscher Demokratischer Rat",
  "Deutsche Demokratische Regierung": "Deutsche Demokratische Regierung",
  "Deutsche Demokratische Republik — der Name behauptete eine Demokratie, die es nicht gab.":
    "Deutsche Demokratische Republik, la République démocratique allemande — le nom affirmait une démocratie qui n'existait pas.",
  "Wie hieß die Jugendorganisation der DDR?":
    "Comment s'appelait l'organisation de jeunesse de la RDA ?",
  "Junge Pioniere und FDJ": "Junge Pioniere et FDJ",
  "Bundesjugendring": "Bundesjugendring",
  "Jungdemokraten": "Jungdemokraten",
  "Pfadfinder": "Les scouts",
  "Junge Pioniere für die Jüngeren, die Freie Deutsche Jugend für die Älteren — beide der SED unterstellt.":
    "Les Junge Pioniere pour les plus jeunes, la Freie Deutsche Jugend pour les plus grands — toutes deux sous l'autorité du SED.",
  "Was war die Nationale Volksarmee?": "Qu'était la Nationale Volksarmee ?",
  "Die Polizei der DDR": "La police de la RDA",
  "Der Geheimdienst": "Le service secret",
  "Eine Jugendorganisation": "Une organisation de jeunesse",
  "Die NVA war die Armee der DDR. Der Geheimdienst hieß Staatssicherheit.":
    "La NVA était l'armée de la RDA. Le service secret s'appelait Staatssicherheit.",
  "Was bedeutete „Republikflucht“ in der DDR?": "Que voulait dire « Republikflucht » en RDA ?",
  "Ein Urlaub im Ausland": "Des vacances à l'étranger",
  "Das Verlassen der DDR ohne Genehmigung — es war strafbar":
    "Quitter la RDA sans autorisation — c'était un délit",
  "Der Umzug in eine andere Stadt": "Un déménagement dans une autre ville",
  "Die Ausbürgerung von Künstlern": "La déchéance de nationalité frappant des artistes",
  "Wer ohne Erlaubnis in den Westen ging, machte sich strafbar; an der Grenze wurde geschossen.":
    "Qui passait à l'Ouest sans autorisation tombait sous le coup de la loi ; à la frontière, on tirait.",
  "Was war ein „Inoffizieller Mitarbeiter“ der Stasi?":
    "Qu'était un « Inoffizieller Mitarbeiter » de la Stasi ?",
  "Ein Angestellter ohne Vertrag": "Un employé sans contrat",
  "Eine Person, die heimlich Informationen über andere weitergab":
    "Une personne qui transmettait en secret des renseignements sur autrui",
  "Ein Grenzsoldat": "Un garde-frontière",
  "Ein Mitglied der Volkskammer": "Un membre de la Volkskammer",
  "Hunderttausende bespitzelten Nachbarn, Kollegen, Freunde und sogar die eigene Familie.":
    "Des centaines de milliers de gens espionnaient voisins, collègues, amis et jusqu'à leur propre famille.",
  "Wie war die Wirtschaft der DDR organisiert?":
    "Comment l'économie de la RDA était-elle organisée ?",
  "Als freie Marktwirtschaft": "En économie de marché libre",
  "Als Planwirtschaft mit staatlichen Betrieben":
    "En économie planifiée, avec des entreprises d'État",
  "Als soziale Marktwirtschaft": "En économie sociale de marché",
  "Ohne jede Planung": "Sans aucune planification",
  "Der Staat gab Produktionsziele vor und besaß die Betriebe (VEB — Volkseigener Betrieb).":
    "L'État fixait les objectifs de production et possédait les entreprises (VEB — Volkseigener Betrieb, entreprise propriété du peuple).",
  "Konnten DDR-Bürger frei in den Westen reisen?":
    "Les citoyens de la RDA pouvaient-ils voyager librement à l'Ouest ?",
  "Nein, das war für die meisten nicht möglich": "Non, pour la plupart c'était impossible",
  "Ja, einmal im Jahr": "Oui, une fois par an",
  "Nur mit einem Reisepass": "Seulement avec un passeport",
  "Reisen in den Westen waren streng beschränkt — genau deshalb wurde die Mauer gebaut.":
    "Les voyages à l'Ouest étaient étroitement limités — c'est précisément pour cela que le Mur a été construit.",
  "Warum gab es in der DDR trotz Wahlen keine echte Auswahl?":
    "Pourquoi n'y avait-il en RDA, malgré les élections, aucun choix véritable ?",
  "Weil niemand wählen wollte": "Parce que personne ne voulait voter",
  "Weil nur eine Einheitsliste zur Abstimmung stand":
    "Parce qu'une seule liste unique était soumise au vote",
  "Weil es keine Wahllokale gab": "Parce qu'il n'y avait pas de bureaux de vote",
  "Weil nur Parteimitglieder wählen durften":
    "Parce que seuls les membres du parti avaient le droit de voter",
  "Die Sitzverteilung stand vorher fest; man konnte der Liste zustimmen, aber nicht zwischen Alternativen wählen.":
    "La répartition des sièges était arrêtée d'avance ; on pouvait approuver la liste, mais non choisir entre des solutions différentes.",
  "In welchem Jahr wurde Deutschland wiedervereinigt?":
    "En quelle année l'Allemagne a-t-elle été réunifiée ?",
  "1991": "1991",
  "1993": "1993",
  "Am 3. Oktober 1990. Die Mauer fiel schon im November 1989.":
    "Le 3 octobre 1990. Le Mur, lui, était tombé dès novembre 1989.",
  "Von welcher Kirche gingen die Leipziger Montagsdemonstrationen aus?":
    "De quelle église sont parties les manifestations du lundi à Leipzig ?",
  "Vom Kölner Dom": "De la cathédrale de Cologne",
  "Von der Nikolaikirche": "De la Nikolaikirche",
  "Von der Frauenkirche": "De la Frauenkirche",
  "Von der Marienkirche": "De la Marienkirche",
  "Die Friedensgebete in der Leipziger Nikolaikirche waren der Ausgangspunkt der Montagsdemonstrationen.":
    "Les prières pour la paix de la Nikolaikirche de Leipzig furent le point de départ des manifestations du lundi.",
  "Welcher sowjetische Staatschef ermöglichte durch seine Reformpolitik den Wandel im Osten?":
    "Quel chef d'État soviétique a rendu possible, par sa politique de réformes, le changement à l'Est ?",
  "Leonid Breschnew": "Leonid Brejnev",
  "Michail Gorbatschow": "Mikhaïl Gorbatchev",
  "Josef Stalin": "Joseph Staline",
  "Boris Jelzin": "Boris Eltsine",
  "Gorbatschows Glasnost und Perestroika machten den friedlichen Umbruch in Mittel- und Osteuropa möglich.":
    "La glasnost et la perestroïka de Gorbatchev ont rendu possible le basculement pacifique de l'Europe centrale et orientale.",
  "Wie wurde die DDR Teil der Bundesrepublik?":
    "Comment la RDA est-elle devenue partie de la République fédérale ?",
  "Durch eine neue gemeinsame Verfassung": "Par une nouvelle constitution commune",
  "Durch Beitritt der DDR zum Geltungsbereich des Grundgesetzes":
    "Par l'adhésion de la RDA au domaine d'application du Grundgesetz",
  "Durch einen Beschluss der Vereinten Nationen": "Par une décision des Nations unies",
  "Durch eine Volksabstimmung im Westen": "Par un référendum à l'Ouest",
  "Der Beitrittsweg nach dem damaligen Artikel 23 — das Grundgesetz galt danach für ganz Deutschland.":
    "La voie de l'adhésion, selon l'article 23 d'alors — le Grundgesetz a valu ensuite pour toute l'Allemagne.",
  "Welche Rolle spielte die Währungsunion vom 1. Juli 1990?":
    "Quel rôle a joué l'union monétaire du 1er juillet 1990 ?",
  "Sie führte den Euro ein": "Elle a introduit l'euro",
  "Sie brachte die D-Mark in die DDR, noch vor der staatlichen Einheit":
    "Elle a porté le deutsche mark en RDA, avant même l'unité de l'État",
  "Sie schaffte das Bargeld ab": "Elle a supprimé les espèces",
  "Sie war Teil des Zwei-plus-Vier-Vertrags": "Elle faisait partie du traité deux plus quatre",
  "Drei Monate vor der Vereinigung wurde die D-Mark auch im Osten gesetzliches Zahlungsmittel.":
    "Trois mois avant l'unification, le deutsche mark est devenu monnaie légale à l'Est aussi.",
  "Welche vier Mächte unterzeichneten mit beiden deutschen Staaten den Zwei-plus-Vier-Vertrag?":
    "Quelles quatre puissances ont signé le traité deux plus quatre avec les deux États allemands ?",
  "USA, Frankreich, Polen, Italien": "États-Unis, France, Pologne, Italie",
  "USA, China, Frankreich, Sowjetunion": "États-Unis, Chine, France, Union soviétique",
  "Dieselben vier Siegermächte von 1945 — damit war die Nachkriegsordnung förmlich abgeschlossen.":
    "Les mêmes quatre puissances victorieuses de 1945 — l'ordre d'après-guerre était par là formellement clos.",
  "Wie wird der Umbruch von 1989 in der DDR genannt?":
    "Comment appelle-t-on le basculement de 1989 en RDA ?",
  "Bürgerkrieg": "Une guerre civile",
  "Friedliche Revolution": "La révolution pacifique",
  "Putsch": "Un putsch",
  "Reformation": "La Réforme",
  "Friedliche Revolution — sie kam ohne Gewalt der Demonstrierenden aus.":
    "La révolution pacifique — elle s'est faite sans violence de la part de ceux qui manifestaient.",
  "Was ist die Bedeutung des Brandenburger Tors für die deutsche Einheit?":
    "Quelle est la portée de la porte de Brandebourg pour l'unité allemande ?",
  "Dort wurde die Verfassung unterschrieben": "C'est là que la constitution a été signée",
  "Es stand direkt an der Mauer und wurde zum Symbol der Teilung und dann der Einheit":
    "Elle se dressait juste contre le Mur et est devenue le symbole de la division, puis de l'unité",
  "Dort tagt der Bundestag": "C'est là que siège le Bundestag",
  "Es ist das älteste Gebäude Berlins": "C'est le plus ancien bâtiment de Berlin",
  "Jahrzehntelang unzugänglich im Grenzstreifen, heute das Bild schlechthin für das wiedervereinigte Deutschland.":
    "Inaccessible pendant des décennies dans la bande frontalière, elle est aujourd'hui l'image même de l'Allemagne réunifiée.",
  "Welche Farbe hat die Flagge der Europäischen Union?":
    "De quelle couleur est le drapeau de l'Union européenne ?",
  "Blau mit zwölf goldenen Sternen im Kreis": "Bleu, avec douze étoiles d'or en cercle",
  "Grün mit weißem Kreuz": "Vert, avec une croix blanche",
  "Gold mit blauem Adler": "Or, avec un aigle bleu",
  "Zwölf Sterne auf blauem Grund — die Zahl steht für Vollständigkeit, nicht für die Mitgliederzahl.":
    "Douze étoiles sur fond bleu — le nombre dit la plénitude, non le nombre d'États membres.",
  "Wo hat das Europäische Parlament seinen Hauptsitz?":
    "Où le Parlement européen a-t-il son siège principal ?",
  "Brüssel": "Bruxelles",
  "Straßburg": "Strasbourg",
  "Luxemburg": "Luxembourg",
  "Den Haag": "La Haye",
  "Straßburg ist der Sitz; viele Ausschüsse tagen in Brüssel, das Generalsekretariat sitzt in Luxemburg.":
    "Le siège est à Strasbourg ; beaucoup de commissions se réunissent à Bruxelles, et le secrétariat général est à Luxembourg.",
  "Was ist der Schengen-Raum?": "Qu'est-ce que l'espace Schengen ?",
  "Ein Gebiet ohne Steuern": "Un territoire sans impôts",
  "Ein Gebiet, in dem an den Binnengrenzen normalerweise nicht kontrolliert wird":
    "Un territoire où l'on ne contrôle normalement pas aux frontières intérieures",
  "Der Sitz der EU-Kommission": "Le siège de la Commission européenne",
  "Die Zone der Euro-Länder": "La zone des pays de l'euro",
  "Reisen ohne Grenzkontrolle. Nicht dasselbe wie die Eurozone — die Mitgliederkreise überschneiden sich nur.":
    "Voyager sans contrôle aux frontières. Ce n'est pas la zone euro — les deux cercles de membres se recoupent seulement.",
  "Welches Land verließ die EU im Jahr 2020?": "Quel pays a quitté l'Union européenne en 2020 ?",
  "Norwegen": "La Norvège",
  "Das Vereinigte Königreich": "Le Royaume-Uni",
  "Die Schweiz": "La Suisse",
  "Island": "L'Islande",
  "Der Brexit. Norwegen, die Schweiz und Island waren nie Mitglied der EU.":
    "Le Brexit. La Norvège, la Suisse et l'Islande n'ont jamais été membres de l'Union européenne.",
  "Wofür ist der Europarat zuständig — im Unterschied zur EU?":
    "De quoi le Conseil de l'Europe s'occupe-t-il, à la différence de l'Union européenne ?",
  "Für den Binnenmarkt": "Du marché intérieur",
  "Für Menschenrechte, Demokratie und Rechtsstaatlichkeit, mit deutlich mehr Mitgliedstaaten":
    "Des droits de l'homme, de la démocratie et de l'État de droit, avec bien plus d'États membres",
  "Für die gemeinsame Währung": "De la monnaie commune",
  "Für die Verteidigung": "De la défense",
  "Zum Europarat gehört auch der Europäische Gerichtshof für Menschenrechte. Er ist älter und größer als die EU.":
    "La Cour européenne des droits de l'homme en relève aussi. Il est plus ancien et plus vaste que l'Union européenne.",
  "Was bedeutet die Unionsbürgerschaft?": "Que signifie la citoyenneté de l'Union ?",
  "Sie ersetzt die nationale Staatsangehörigkeit": "Elle remplace la nationalité nationale",
  "Sie kommt zur nationalen Staatsangehörigkeit hinzu und bringt Rechte wie Freizügigkeit und das Kommunalwahlrecht":
    "Elle s'ajoute à la nationalité et apporte des droits comme la libre circulation et le vote aux élections communales",
  "Sie gilt nur für Beamte der EU": "Elle ne vaut que pour les fonctionnaires de l'Union",
  "Sie muss beantragt werden": "Il faut la demander",
  "Jeder Staatsangehörige eines Mitgliedstaates ist automatisch auch Unionsbürger.":
    "Tout ressortissant d'un État membre est automatiquement citoyen de l'Union.",
  "Seit wann ist die Bundesrepublik Mitglied der NATO?":
    "Depuis quand la République fédérale est-elle membre de l'OTAN ?",
  "1955": "1955",
  "1955, im Zuge der Westbindung. 1949 wurde die Bundesrepublik gegründet, 1973 trat sie den UN bei.":
    "Depuis 1955, dans le mouvement de l'ancrage à l'Ouest. La République fédérale a été fondée en 1949 et est entrée à l'ONU en 1973.",
  "Welche deutsche Institution überwacht heute nicht mehr die Geldpolitik des Euro?":
    "Quelle institution allemande ne conduit plus aujourd'hui la politique monétaire de l'euro ?",
  "Die Deutsche Bundesbank — die Geldpolitik macht die Europäische Zentralbank":
    "La Deutsche Bundesbank — c'est la Banque centrale européenne qui fait la politique monétaire",
  "Das Bundesfinanzministerium": "Le ministère fédéral des Finances",
  "Der Bundesrechnungshof": "La Cour fédérale des comptes",
  "Die Bundesanstalt für Finanzdienstleistungsaufsicht":
    "L'autorité fédérale de surveillance des services financiers",
  "Seit der Währungsunion entscheidet die EZB in Frankfurt über die Geldpolitik; die Bundesbank wirkt dort mit.":
    "Depuis l'union monétaire, c'est la BCE, à Francfort, qui décide de la politique monétaire ; la Bundesbank y participe.",
  "Welches Land grenzt NICHT an Deutschland?": "Quel pays n'a PAS de frontière avec l'Allemagne ?",
  "Dänemark": "Le Danemark",
  "Italien": "L'Italie",
  "Belgien": "La Belgique",
  "Italien hat keine gemeinsame Grenze mit Deutschland — dazwischen liegen Österreich und die Schweiz.":
    "L'Italie n'a pas de frontière commune avec l'Allemagne — l'Autriche et la Suisse se trouvent entre les deux.",
  "Welcher Fluss fließt durch Köln?": "Quel fleuve traverse Cologne ?",
  "Der Rhein. Die Elbe fließt durch Dresden und Hamburg, die Weser durch Bremen.":
    "Le Rhin. L'Elbe traverse Dresde et Hambourg, la Weser passe à Brême.",
  "Wie heißt das höchste Mittelgebirge Norddeutschlands mit dem Brocken?":
    "Comment s'appelle le plus haut massif moyen d'Allemagne du Nord, celui du Brocken ?",
  "Der Schwarzwald": "La Forêt-Noire",
  "Der Harz": "Le Harz",
  "Das Erzgebirge": "Les monts Métallifères",
  "Der Thüringer Wald": "La forêt de Thuringe",
  "Der Harz mit dem Brocken. Schwarzwald und Erzgebirge liegen im Süden beziehungsweise Osten.":
    "Le Harz, avec le Brocken. La Forêt-Noire est au sud et les monts Métallifères à l'est.",
  "Was bedeuten die Farben Schwarz-Rot-Gold historisch?":
    "Que signifient historiquement les couleurs noir, rouge et or ?",
  "Die drei Besatzungsmächte": "Les trois puissances d'occupation",
  "Sie stehen seit dem 19. Jahrhundert für Einheit und Freiheit":
    "Elles disent, depuis le dix-neuvième siècle, l'unité et la liberté",
  "Die drei größten Bundesländer": "Les trois plus grands Länder",
  "Die drei Staatsgewalten": "Les trois pouvoirs de l'État",
  "Aus der Freiheitsbewegung des 19. Jahrhunderts, übernommen von der Paulskirche 1848 und der Weimarer Republik.":
    "Venues du mouvement pour la liberté du dix-neuvième siècle, reprises par l'assemblée de la Paulskirche en 1848 et par la République de Weimar.",
  "Welche deutsche Stadt ist zugleich Bundesland und liegt an der Weser?":
    "Quelle ville allemande est en même temps un Land et se trouve sur la Weser ?",
  "Bremen": "Brême",
  "Kiel": "Kiel",
  "Bremen liegt an der Weser, Hamburg an der Elbe — beide sind Stadtstaaten.":
    "Brême est sur la Weser, Hambourg sur l'Elbe — les deux sont des villes-États.",
  "Wer schrieb den Text der deutschen Nationalhymne?":
    "Qui a écrit les paroles de l'hymne national allemand ?",
  "August Heinrich Hoffmann von Fallersleben": "August Heinrich Hoffmann von Fallersleben",
  "Joseph Haydn": "Joseph Haydn",
  "Hoffmann von Fallersleben schrieb den Text 1841, die Melodie stammt von Joseph Haydn.":
    "Hoffmann von Fallersleben a écrit le texte en 1841, la mélodie est de Joseph Haydn.",
  "Welche Stadt ist die Hauptstadt von Nordrhein-Westfalen?":
    "Quelle est la capitale de la Rhénanie-du-Nord-Westphalie ?",
  "Düsseldorf": "Düsseldorf",
  "Dortmund": "Dortmund",
  "Essen": "Essen",
  "Düsseldorf. Köln ist zwar größer, aber nicht die Landeshauptstadt.":
    "Düsseldorf. Cologne est certes plus grande, mais n'est pas la capitale du Land.",
  "Welcher See bildet ein Dreiländereck mit Österreich und der Schweiz?":
    "Quel lac forme un point de rencontre à trois avec l'Autriche et la Suisse ?",
  "Der Chiemsee": "Le lac de Chiem",
  "Der Bodensee": "Le lac de Constance",
  "Die Müritz": "La Müritz",
  "Der Starnberger See": "Le lac de Starnberg",
  "Der Bodensee. Die Müritz ist der größte See, der ganz in Deutschland liegt.":
    "Le lac de Constance. La Müritz est le plus grand lac entièrement situé en Allemagne.",
  "Muss man in Deutschland einer Religion angehören?":
    "Faut-il appartenir à une religion en Allemagne ?",
  "Ja, man muss sich entscheiden": "Oui, il faut choisir",
  "Nein, niemand muss einer Religionsgemeinschaft angehören":
    "Non, personne n'est tenu d'appartenir à une communauté religieuse",
  "Ja, ab 18 Jahren": "Oui, à partir de 18 ans",
  "Nur für die Eheschließung": "Seulement pour se marier",
  "Religionsfreiheit schließt die Freiheit ein, keiner Religion anzugehören — etwa die Hälfte der Bevölkerung gehört keiner an.":
    "La liberté de religion comprend celle de n'appartenir à aucune — la moitié environ de la population n'en a aucune.",
  "Wie viele Menschen muslimischen Glaubens leben ungefähr in Deutschland?":
    "Combien de personnes de confession musulmane vivent environ en Allemagne ?",
  "Etwa 100.000": "Environ 100 000",
  "Etwa 5 Millionen": "Environ 5 millions",
  "Etwa 20 Millionen": "Environ 20 millions",
  "Etwa 500": "Environ 500",
  "Rund fünf Millionen — der Islam ist die größte nichtchristliche Religion in Deutschland.":
    "Environ cinq millions — l'islam est la plus grande religion non chrétienne d'Allemagne.",
  "Was passiert, wenn man aus der Kirche austritt?":
    "Que se passe-t-il quand on quitte l'Église ?",
  "Man muss eine Strafe zahlen": "Il faut payer une amende",
  "Man zahlt keine Kirchensteuer mehr und verliert Rechte innerhalb der Kirche":
    "On ne paie plus l'impôt d'Église et l'on perd des droits au sein de l'Église",
  "Man verliert die Staatsangehörigkeit": "On perd la nationalité",
  "Nichts ändert sich": "Rien ne change",
  "Der Austritt wird beim Standesamt oder Amtsgericht erklärt; danach entfällt die Kirchensteuer.":
    "La sortie se déclare au Standesamt ou au tribunal d'instance ; l'impôt d'Église cesse ensuite.",
  "Ein Vater will seine Tochter nicht am Schwimmunterricht teilnehmen lassen. Was gilt?":
    "Un père refuse que sa fille participe au cours de natation. Qu'en est-il ?",
  "Die Schulpflicht gilt auch für den Sportunterricht; die Schule sucht praktische Lösungen":
    "L'obligation scolaire vaut aussi pour l'éducation physique ; l'école cherche des solutions pratiques",
  "Der Vater entscheidet allein": "Le père décide seul",
  "Das Kind wird vom Unterricht befreit": "L'enfant est dispensé du cours",
  "Die Schule muss den Unterricht abschaffen": "L'école doit supprimer ce cours",
  "Die Schulpflicht steht über privaten Vorbehalten. Schulen ermöglichen etwa geeignete Badekleidung, ein Fernbleiben aber nicht.":
    "L'obligation scolaire prime sur les réserves privées. Les écoles admettent par exemple une tenue de bain appropriée, mais non l'absence.",
  "Was bedeutet die weltanschauliche Neutralität des Staates?":
    "Que signifie la neutralité de l'État en matière de convictions ?",
  "Der Staat verbietet Religion": "L'État interdit la religion",
  "Der Staat bevorzugt oder benachteiligt keine Religion und hat selbst keine":
    "L'État ne favorise ni ne désavantage aucune religion et n'en a lui-même aucune",
  "Der Staat bestimmt die Religion der Bürger": "L'État fixe la religion des citoyens",
  "Es gibt keine Staatskirche. Der Staat arbeitet mit Religionsgemeinschaften zusammen, ohne sich mit einer zu identifizieren.":
    "Il n'y a pas d'Église d'État. L'État travaille avec les communautés religieuses sans se confondre avec aucune.",
  "Welches Fest feiern Christen zu Ostern?": "Que fêtent les chrétiens à Pâques ?",
  "Die Geburt Jesu": "La naissance de Jésus",
  "Die Auferstehung Jesu": "La résurrection de Jésus",
  "Die Taufe Jesu": "Le baptême de Jésus",
  "Das Ende des Fastenmonats": "La fin du mois de jeûne",
  "Ostern ist das Fest der Auferstehung. Die Geburt wird zu Weihnachten gefeiert.":
    "Pâques est la fête de la résurrection. La naissance se fête à Noël.",
  "Darf man in Deutschland die Religion wechseln?":
    "A-t-on le droit de changer de religion en Allemagne ?",
  "Ja, jeder darf frei entscheiden": "Oui, chacun décide librement",
  "Der Wechsel des Glaubens und der Austritt sind ausdrücklich geschützt — auch gegen den Willen der Familie.":
    "Changer de croyance et sortir d'une communauté sont expressément protégés — même contre la volonté de la famille.",
  "Welche Rolle haben die Kirchen in der sozialen Arbeit in Deutschland?":
    "Quel rôle les Églises jouent-elles dans le travail social en Allemagne ?",
  "Sie dürfen keine sozialen Einrichtungen betreiben":
    "Elles n'ont pas le droit de tenir des établissements sociaux",
  "Caritas und Diakonie gehören zu den größten Trägern von Kitas, Krankenhäusern und Pflegeheimen":
    "Caritas et Diakonie comptent parmi les plus grands gestionnaires de crèches, d'hôpitaux et de maisons de retraite",
  "Sie betreiben nur Kirchen": "Elles ne tiennent que des églises",
  "Sie sind für die Sozialversicherung zuständig": "Elles s'occupent de la sécurité sociale",
  "Die kirchlichen Wohlfahrtsverbände sind neben AWO, DRK und Paritätischem tragende Säulen der sozialen Infrastruktur.":
    "Les œuvres sociales des Églises sont, à côté de l'AWO, de la Croix-Rouge allemande et du Paritätischer, des piliers de l'infrastructure sociale.",
  "Wer entscheidet in Deutschland, wen eine erwachsene Person heiratet?":
    "Qui décide en Allemagne de qui une personne adulte épouse ?",
  "Die Eltern": "Les parents",
  "Die Person selbst": "La personne elle-même",
  "Die Religionsgemeinschaft": "La communauté religieuse",
  "Jede volljährige Person entscheidet selbst. Zwangsheirat ist eine Straftat.":
    "Toute personne majeure décide elle-même. Le mariage forcé est un délit.",
  "Was ist das Sorgerecht?": "Qu'est-ce que l'autorité parentale ?",
  "Das Recht, für ein Kind zu sorgen und es zu vertreten":
    "Le droit de prendre soin d'un enfant et de le représenter",
  "Das Recht auf Unterhalt": "Le droit à une pension alimentaire",
  "Das Recht, die Wohnung zu behalten": "Le droit de garder le logement",
  "Das Recht auf Elternzeit": "Le droit au congé parental",
  "Es umfasst Erziehung, Aufenthaltsbestimmung und die rechtliche Vertretung des Kindes — nach einer Trennung oft gemeinsam.":
    "Elle comprend l'éducation, le choix du lieu de vie et la représentation juridique de l'enfant — souvent partagée après une séparation.",
  "Wer muss nach einer Scheidung für die gemeinsamen Kinder Unterhalt zahlen?":
    "Qui doit verser une pension alimentaire pour les enfants communs après un divorce ?",
  "In der Regel der Elternteil, bei dem die Kinder nicht überwiegend leben":
    "En règle générale, le parent chez qui les enfants ne vivent pas principalement",
  "Immer der Vater": "Toujours le père",
  "Beide Eltern bleiben unterhaltspflichtig; wer betreut, leistet seinen Teil durch die Betreuung.":
    "Les deux parents restent tenus à l'entretien ; celui qui garde les enfants s'acquitte de sa part par cette garde.",
  "Was kann die Polizei bei häuslicher Gewalt tun?":
    "Que peut faire la police en cas de violence au foyer ?",
  "Nichts, das ist Privatsache": "Rien, c'est une affaire privée",
  "Den Gewalttätigen aus der Wohnung verweisen und ein Kontaktverbot veranlassen":
    "Expulser l'auteur des violences du logement et faire prononcer une interdiction de contact",
  "Nur ein Protokoll aufnehmen": "Se borner à dresser un procès-verbal",
  "Beide Beteiligten mitnehmen": "Emmener les deux personnes",
  "Das Gewaltschutzgesetz erlaubt Wohnungsverweisung und Näherungsverbot — der Schutz geht vor dem Wohnrecht des Täters.":
    "La loi de protection contre la violence permet l'expulsion du logement et l'interdiction d'approcher — la protection passe avant le droit d'habiter de l'auteur.",
  "Ab welchem Alter gilt ein Mensch in Deutschland als volljährig?":
    "À partir de quel âge est-on majeur en Allemagne ?",
  "Mit 16": "À 16 ans",
  "Mit 18": "À 18 ans",
  "Mit 21": "À 21 ans",
  "Mit der Heirat": "Au mariage",
  "Mit 18 — damit gelten volle Geschäftsfähigkeit, Wahlrecht zum Bundestag und Ehefähigkeit.":
    "À 18 ans — d'où la pleine capacité juridique, le droit de vote au Bundestag et la capacité de se marier.",
  "Was ist eine Patchwork-Familie?": "Qu'est-ce qu'une famille recomposée ?",
  "Eine Familie mit vielen Kindern": "Une famille nombreuse",
  "Eine Familie, in der Partner mit Kindern aus früheren Beziehungen zusammenleben":
    "Une famille où des partenaires vivent ensemble avec des enfants nés d'unions antérieures",
  "Eine Familie ohne Kinder": "Une famille sans enfants",
  "Eine Familie, die im Ausland lebt": "Une famille qui vit à l'étranger",
  "Eine von vielen anerkannten Familienformen neben Ehepaaren, Alleinerziehenden und gleichgeschlechtlichen Paaren.":
    "L'une des nombreuses formes de famille reconnues, à côté des couples mariés, des parents seuls et des couples de même sexe.",
  "Dürfen Eltern in Deutschland ihre Kinder schlagen?":
    "Les parents ont-ils le droit de frapper leurs enfants en Allemagne ?",
  "Ja, zur Erziehung": "Oui, pour les élever",
  "Nein, Kinder haben ein Recht auf gewaltfreie Erziehung":
    "Non, les enfants ont droit à une éducation sans violence",
  "Nur leichte Strafen sind erlaubt": "Seules les punitions légères sont permises",
  "Nur bis zum 6. Lebensjahr": "Seulement jusqu'à six ans",
  "Körperliche Bestrafung ist verboten und kann strafbar sein — seit 2000 steht das ausdrücklich im Gesetz.":
    "Le châtiment corporel est interdit et peut être puni — depuis 2000, la loi le dit expressément.",
  "Was gilt für die Gleichberechtigung in der Ehe?": "Qu'en est-il de l'égalité dans le mariage ?",
  "Der Mann entscheidet über den Wohnort": "L'homme décide du lieu de résidence",
  "Beide Partner sind gleichberechtigt und entscheiden gemeinsam":
    "Les deux partenaires ont les mêmes droits et décident ensemble",
  "Die Frau muss den Haushalt führen": "La femme doit tenir le ménage",
  "Der Hauptverdiener entscheidet": "Celui qui gagne le plus décide",
  "Artikel 3 gilt auch in der Ehe. Aufgabenteilung ist Verhandlungssache, keine Vorschrift.":
    "L'article 3 vaut aussi dans le mariage. Le partage des tâches se négocie, il ne se prescrit pas.",
  "Kostet der Besuch staatlicher Schulen in Deutschland Schulgeld?":
    "L'école publique est-elle payante en Allemagne ?",
  "Ja, monatlich": "Oui, chaque mois",
  "Nein, staatliche Schulen sind grundsätzlich kostenfrei":
    "Non, les écoles publiques sont en principe gratuites",
  "Nur ab der Oberstufe": "Seulement à partir du cycle terminal",
  "Nur für Nichtdeutsche": "Seulement pour les non-Allemands",
  "Der Unterricht ist kostenfrei. Für Ausflüge oder Material können kleine Beiträge anfallen.":
    "L'enseignement est gratuit. De petites participations peuvent être demandées pour les sorties ou le matériel.",
  "Was ist ein Integrationskurs?": "Qu'est-ce qu'un Integrationskurs ?",
  "Ein Sportkurs": "Un cours de sport",
  "Ein Sprachkurs mit anschließendem Orientierungskurs zu Recht, Geschichte und Kultur":
    "Un cours de langue suivi d'un module d'orientation sur le droit, l'histoire et la culture",
  "Ein Kurs für Lehrer": "Un cours pour enseignants",
  "Eine Berufsausbildung": "Une formation professionnelle",
  "Er endet mit der Sprachprüfung und dem Test „Leben in Deutschland“ — demselben Katalog wie beim Einbürgerungstest.":
    "Il se termine par l'examen de langue et le test « Leben in Deutschland » — le même catalogue que celui du test de naturalisation.",
  "Wer entscheidet über die Lehrpläne an Schulen?": "Qui décide des programmes scolaires ?",
  "Die Schulen allein": "Les écoles seules",
  "Die EU": "L'Union européenne",
  "Bildung ist Ländersache — deshalb unterscheiden sich Lehrpläne, Schulformen und Ferienzeiten.":
    "L'éducation relève des Länder — d'où les différences de programmes, de types d'écoles et de vacances.",
  "Was ist die Fachhochschulreife?": "Qu'est-ce que la Fachhochschulreife ?",
  "Ein Abschluss, der zum Studium an einer Fachhochschule berechtigt":
    "Un diplôme qui ouvre les études en école supérieure spécialisée",
  "Ein Abschluss nach der 9. Klasse": "Un diplôme obtenu après la neuvième classe",
  "Ein Zeugnis über einen Sprachkurs": "Une attestation de cours de langue",
  "Sie öffnet den Weg an Fachhochschulen; das Abitur berechtigt zusätzlich zum Universitätsstudium.":
    "Elle ouvre la voie des Fachhochschulen ; l'Abitur ouvre en plus celle de l'université.",
  "Wer trägt bei einer dualen Ausbildung die Kosten der Berufsschule?":
    "Qui supporte, dans une formation en alternance, le coût de l'école professionnelle ?",
  "Der Auszubildende": "L'apprenti",
  "Das Bundesland als Schulträger": "Le Land, comme autorité scolaire",
  "Der Ausbildungsbetrieb allein": "L'entreprise formatrice seule",
  "Die Berufsschule ist eine staatliche Schule und damit Ländersache. Der Betrieb zahlt die Ausbildungsvergütung.":
    "L'école professionnelle est une école publique et relève donc du Land. L'entreprise, elle, verse la rémunération d'apprentissage.",
  "Was bietet eine Volkshochschule an?": "Que propose une Volkshochschule ?",
  "Nur Universitätsstudiengänge": "Uniquement des cursus universitaires",
  "Günstige Kurse für Erwachsene — Sprachen, Computer, Integrations- und Orientierungskurse":
    "Des cours peu coûteux pour adultes — langues, informatique, cours d'intégration et d'orientation",
  "Nur Sportkurse": "Uniquement des cours de sport",
  "Ausschließlich Kurse für Jugendliche": "Uniquement des cours pour la jeunesse",
  "Die VHS ist die verbreitetste Einrichtung der Erwachsenenbildung; dort wird auch der Test „Leben in Deutschland“ abgenommen.":
    "La VHS est l'établissement de formation des adultes le plus répandu ; c'est là aussi que se passe le test « Leben in Deutschland ».",
  "Wie lange dauert die Schulpflicht in Deutschland mindestens?":
    "Combien de temps l'obligation scolaire dure-t-elle au minimum en Allemagne ?",
  "4 Jahre": "4 ans",
  "9 Jahre": "9 ans",
  "12 Jahre": "12 ans",
  "13 Jahre": "13 ans",
  "Mindestens neun Schuljahre, in einigen Ländern zehn — dazu kommt oft die Berufsschulpflicht.":
    "Au moins neuf années scolaires, dix dans certains Länder — s'y ajoute souvent l'obligation d'école professionnelle.",
  "Wo lässt man einen im Ausland erworbenen Berufsabschluss anerkennen?":
    "Où fait-on reconnaître un diplôme professionnel obtenu à l'étranger ?",
  "Beim Einwohnermeldeamt": "Au bureau de déclaration de domicile",
  "Bei der zuständigen Stelle wie Kammer oder Landesbehörde, oft mit Beratung durch das IQ-Netzwerk":
    "Auprès de l'instance compétente — chambre ou administration du Land — souvent avec le conseil du réseau IQ",
  "Beim Finanzamt": "Au Finanzamt",
  "Bei der Krankenkasse": "À la caisse d'assurance maladie",
  "Welche Stelle zuständig ist, hängt vom Beruf ab — Kammern für Handwerk und Industrie, Landesbehörden für reglementierte Berufe.":
    "L'instance compétente dépend du métier — les chambres pour l'artisanat et l'industrie, les administrations du Land pour les professions réglementées.",
  "Was ist eine Probezeit?": "Qu'est-ce qu'une période d'essai ?",
  "Die ersten Wochen ohne Bezahlung": "Les premières semaines sans salaire",
  "Eine Anfangszeit, in der beide Seiten mit kürzerer Frist kündigen können":
    "Un temps initial pendant lequel les deux parties peuvent rompre avec un préavis plus court",
  "Eine unbezahlte Einarbeitung": "Une mise au courant non rémunérée",
  "Die Zeit bis zur ersten Gehaltserhöhung": "Le temps qui précède la première augmentation",
  "In der Probezeit — meist bis zu sechs Monate — gilt eine verkürzte Kündigungsfrist. Bezahlt wird ganz normal.":
    "Pendant la période d'essai — six mois au plus en général — le préavis est raccourci. Le salaire, lui, est versé normalement.",
  "Was ist eine Lohnsteuerbescheinigung?": "Qu'est-ce qu'une Lohnsteuerbescheinigung ?",
  "Die Rechnung des Arbeitgebers": "La facture de l'employeur",
  "Eine jährliche Übersicht über Lohn und abgeführte Steuern, wichtig für die Steuererklärung":
    "Un récapitulatif annuel du salaire et des impôts versés, important pour la déclaration de revenus",
  "Ein Antrag auf Arbeitslosengeld": "Une demande d'Arbeitslosengeld",
  "Der Arbeitgeber stellt sie am Jahresende aus; sie ist die Grundlage der Einkommensteuererklärung.":
    "L'employeur l'établit en fin d'année ; elle est la base de la déclaration d'impôt sur le revenu.",
  "Was regelt das Arbeitszeitgesetz unter anderem?":
    "Que règle notamment la loi sur le temps de travail ?",
  "Die Höhe des Lohns": "Le montant du salaire",
  "Höchstarbeitszeiten, Ruhepausen und die Ruhezeit zwischen zwei Arbeitstagen":
    "Les durées maximales de travail, les pauses et le repos entre deux journées de travail",
  "Die Urlaubsziele": "Les destinations de vacances",
  "Die Kleidung am Arbeitsplatz": "La tenue au travail",
  "In der Regel höchstens acht Stunden täglich, mit vorgeschriebenen Pausen und mindestens elf Stunden Ruhe bis zum nächsten Tag.":
    "En règle générale huit heures par jour au plus, avec des pauses prescrites et au moins onze heures de repos jusqu'au lendemain.",
  "Was gilt für schwangere Arbeitnehmerinnen?": "Qu'en est-il des salariées enceintes ?",
  "Sie können jederzeit gekündigt werden": "Elles peuvent être licenciées à tout moment",
  "Es gilt ein besonderer Kündigungsschutz und der Mutterschutz":
    "Une protection particulière contre le licenciement et la protection de la maternité s'appliquent",
  "Sie müssen sofort aufhören zu arbeiten": "Elles doivent cesser aussitôt de travailler",
  "Es gibt keine besonderen Regeln": "Il n'existe aucune règle particulière",
  "Der Mutterschutz umfasst Kündigungsschutz, Schutzfristen vor und nach der Geburt und Beschäftigungsverbote bei Gefährdung.":
    "La protection de la maternité comprend la protection contre le licenciement, des périodes protégées avant et après la naissance et des interdictions de travail en cas de danger.",
  "Was ist Kurzarbeit?": "Qu'est-ce que le chômage partiel ?",
  "Eine Teilzeitstelle": "Un poste à temps partiel",
  "Vorübergehend verkürzte Arbeitszeit, bei der die Agentur für Arbeit einen Teil des Lohnausfalls ersetzt":
    "Un temps de travail réduit provisoirement, l'Agentur für Arbeit compensant une partie de la perte de salaire",
  "Arbeit auf Abruf": "Le travail sur appel",
  "Ein befristeter Vertrag": "Un contrat à durée déterminée",
  "Ein Instrument, um in Krisen Entlassungen zu vermeiden — in der Finanzkrise und in der Pandemie im großen Stil eingesetzt.":
    "Un instrument pour éviter les licenciements en temps de crise — largement employé lors de la crise financière et de la pandémie.",
  "Wer vertritt die Interessen der Arbeitnehmer bei Tarifverhandlungen?":
    "Qui représente les intérêts des salariés dans les négociations collectives ?",
  "Der Betriebsrat": "Le comité d'entreprise",
  "Die Gewerkschaft": "Le syndicat",
  "Tarifverträge handeln Gewerkschaften mit Arbeitgeberverbänden aus. Der Betriebsrat vertritt die Belegschaft im einzelnen Betrieb.":
    "Les conventions collectives se négocient entre syndicats et fédérations patronales. Le comité d'entreprise, lui, représente le personnel d'un établissement.",
  "Was musst du tun, wenn du krank bist und nicht arbeiten kannst?":
    "Que faut-il faire quand on est malade et qu'on ne peut pas travailler ?",
  "Nichts, der Arbeitgeber merkt es": "Rien, l'employeur s'en apercevra",
  "Dich unverzüglich beim Arbeitgeber melden": "Prévenir l'employeur sans délai",
  "Erst nach drei Tagen Bescheid geben": "N'avertir qu'au bout de trois jours",
  "Nur die Krankenkasse informieren": "N'informer que la caisse d'assurance maladie",
  "Die Krankmeldung erfolgt sofort. Ab wann ein ärztliches Attest nötig ist, steht im Arbeitsvertrag oder Tarifvertrag.":
    "L'avis de maladie se donne aussitôt. À partir de quand un certificat médical est exigé, cela figure au contrat de travail ou à la convention collective.",
  "Was ist ein Minijob?": "Qu'est-ce qu'un Minijob ?",
  "Eine Beschäftigung mit geringem monatlichem Verdienst und besonderen Abgabenregeln":
    "Un emploi à faible revenu mensuel, soumis à des règles de cotisation particulières",
  "Ein Job für Jugendliche unter 16": "Un emploi pour les jeunes de moins de 16 ans",
  "Eine unbezahlte Tätigkeit": "Une activité non rémunérée",
  "Ein Praktikum": "Un stage",
  "Geringfügige Beschäftigung bis zu einer Verdienstgrenze; der Arbeitgeber führt Pauschalabgaben ab, Kündigungsschutz und Urlaub gelten trotzdem.":
    "Un emploi de faible ampleur jusqu'à un plafond de revenu ; l'employeur verse des cotisations forfaitaires, mais la protection contre le licenciement et les congés valent tout de même.",
  "Wohin gehören leere Glasflaschen ohne Pfand?":
    "Où vont les bouteilles de verre vides sans consigne ?",
  "In den Restmüll": "Dans les ordures résiduelles",
  "In den Altglascontainer, nach Farben getrennt": "Dans le conteneur à verre, triées par couleur",
  "In die Biotonne": "Dans la poubelle des biodéchets",
  "In den Papiercontainer": "Dans le conteneur à papier",
  "Weiß, grün und braun getrennt. Auf Pfandflaschen gibt es das Geld im Laden zurück.":
    "Blanc, vert et brun séparés. Pour les bouteilles consignées, on récupère son argent au magasin.",
  "Was sind Nebenkosten bei einer Mietwohnung?":
    "Que sont les charges d'un logement en location ?",
  "Die Miete selbst": "Le loyer lui-même",
  "Kosten für Heizung, Wasser, Müll und ähnliche Betriebskosten":
    "Les frais de chauffage, d'eau, d'ordures et autres charges d'exploitation",
  "Die Kaution": "Le dépôt de garantie",
  "Die Maklergebühr": "Les honoraires de l'agence",
  "Sie werden monatlich vorausgezahlt und einmal jährlich abgerechnet — mit Nachzahlung oder Guthaben.":
    "Elles se paient d'avance chaque mois et se règlent une fois l'an — avec un complément à verser ou un avoir.",
  "Wo meldest du dich an, wenn du nach Deutschland ziehst?":
    "Où se déclare-t-on quand on s'installe en Allemagne ?",
  "Beim Einwohnermeldeamt oder Bürgeramt": "Au bureau de déclaration de domicile ou au Bürgeramt",
  "Bei der Polizei": "À la police",
  "Beim Arbeitgeber": "Chez l'employeur",
  "Die Anmeldung erfolgt innerhalb von zwei Wochen beim Bürgeramt der Gemeinde.":
    "La déclaration se fait dans les deux semaines au Bürgeramt de la commune.",
  "Was ist der Rundfunkbeitrag?": "Qu'est-ce que le Rundfunkbeitrag ?",
  "Eine freiwillige Spende": "Un don volontaire",
  "Ein Beitrag pro Wohnung zur Finanzierung des öffentlich-rechtlichen Rundfunks":
    "Une contribution par logement, qui finance l'audiovisuel public",
  "Eine Steuer auf Fernsehgeräte": "Une taxe sur les téléviseurs",
  "Eine Gebühr für das Internet": "Une redevance pour internet",
  "Er wird je Wohnung erhoben, unabhängig davon, wie viele Geräte vorhanden sind. Bei geringem Einkommen ist Befreiung möglich.":
    "Il est perçu par logement, quel que soit le nombre d'appareils. En cas de faible revenu, une exonération est possible.",
  "Was passiert, wenn du beim Fahren ohne gültiges Ticket erwischt wirst?":
    "Que se passe-t-il si l'on est pris à voyager sans titre valable ?",
  "Du zahlst ein erhöhtes Beförderungsentgelt; bei Wiederholung droht eine Anzeige":
    "On paie un supplément de transport majoré ; en cas de récidive, une plainte est possible",
  "Du wirst sofort festgenommen": "On est arrêté sur-le-champ",
  "Du bekommst eine Verwarnung": "On reçoit un avertissement",
  "Beim ersten Mal ein Entgelt, bei wiederholtem Schwarzfahren kann es strafrechtlich verfolgt werden.":
    "La première fois un supplément ; en cas de fraude répétée, cela peut être poursuivi pénalement.",
  "Wann ist in Deutschland üblicherweise Mittagsruhe in Wohngebieten?":
    "Quand observe-t-on habituellement la pause de midi dans les quartiers d'habitation en Allemagne ?",
  "Es gibt keine": "Il n'y en a pas",
  "Vielerorts zwischen 13 und 15 Uhr, je nach örtlicher Regelung":
    "En bien des endroits entre 13 et 15 heures, selon la réglementation locale",
  "Zwischen 10 und 12 Uhr": "Entre 10 et 12 heures",
  "Den ganzen Nachmittag": "Tout l'après-midi",
  "Die Zeiten legen Gemeinden und Hausordnungen fest. Sonntags gilt meist ganztägig Ruhe.":
    "Ce sont les communes et les règlements d'immeuble qui fixent ces heures. Le dimanche, le calme vaut le plus souvent toute la journée.",
  "Was brauchst du, um in Deutschland ein Bankkonto zu eröffnen?":
    "De quoi a-t-on besoin pour ouvrir un compte bancaire en Allemagne ?",
  "Nur eine Telefonnummer": "D'un numéro de téléphone, et rien d'autre",
  "Einen Ausweis und meist eine Meldebescheinigung":
    "D'une pièce d'identité et, le plus souvent, d'une attestation de domicile",
  "Einen Arbeitsvertrag": "D'un contrat de travail",
  "Die deutsche Staatsangehörigkeit": "De la nationalité allemande",
  "Ein Basiskonto steht jedem zu, auch ohne festes Einkommen. Ausweis und Anschrift werden benötigt.":
    "Un compte de base est ouvert à tous, même sans revenu fixe. Il faut une pièce d'identité et une adresse.",
  "Wie lange ist ein ausländischer Führerschein aus einem Nicht-EU-Staat in Deutschland gültig?":
    "Combien de temps un permis de conduire d'un pays hors Union européenne vaut-il en Allemagne ?",
  "In der Regel sechs Monate nach der Anmeldung, danach ist eine Umschreibung nötig":
    "En règle générale six mois après la déclaration de domicile ; il faut ensuite le faire échanger",
  "Er gilt gar nicht": "Il ne vaut pas du tout",
  "Nach sechs Monaten muss umgeschrieben werden; je nach Herkunftsland mit oder ohne Prüfung. EU-Führerscheine gelten weiter.":
    "Au bout de six mois, l'échange est obligatoire ; avec ou sans examen selon le pays d'origine. Les permis de l'Union européenne, eux, restent valables.",
  "Was ist eine Überweisung beim Arzt?": "Qu'est-ce qu'une Überweisung chez le médecin ?",
  "Eine Zahlung an die Praxis": "Un paiement au cabinet",
  "Ein Schreiben, mit dem der Hausarzt zu einem Facharzt schickt":
    "Un document par lequel le médecin de famille adresse à un spécialiste",
  "Ein Rezept": "Une ordonnance",
  "Die Krankmeldung": "L'avis de maladie",
  "Nicht zu verwechseln mit der Geldüberweisung — hier geht es um die Weiterleitung zur fachärztlichen Behandlung.":
    "À ne pas confondre avec le virement d'argent — il s'agit ici d'être adressé à un spécialiste.",
  "Wer zahlt in der Regel Medikamente auf Rezept?":
    "Qui paie en règle générale les médicaments sur ordonnance ?",
  "Der Patient allein": "Le patient seul",
  "Die Krankenkasse, meist mit einer Zuzahlung des Patienten":
    "La caisse d'assurance maladie, le plus souvent avec une participation du patient",
  "Der Arbeitgeber": "L'employeur",
  "Die Kasse übernimmt den Großteil; es bleibt meist eine Zuzahlung, von der man sich bei geringem Einkommen befreien lassen kann.":
    "La caisse prend en charge l'essentiel ; il reste le plus souvent une participation, dont on peut être dispensé quand le revenu est faible.",
  "Wozu dient eine Patientenverfügung?": "À quoi sert une directive anticipée ?",
  "Zur Anmeldung im Krankenhaus": "À s'inscrire à l'hôpital",
  "Um im Voraus festzulegen, welche Behandlungen man möchte, wenn man selbst nicht mehr entscheiden kann":
    "À fixer d'avance quels soins l'on veut, pour le jour où l'on ne pourra plus décider soi-même",
  "Zur Abrechnung mit der Krankenkasse": "À régler les comptes avec la caisse d'assurance maladie",
  "Um einen Arzt zu wechseln": "À changer de médecin",
  "Sie ist verbindlich und sollte schriftlich vorliegen. Ergänzend regelt eine Vorsorgevollmacht, wer für einen sprechen darf.":
    "Elle est contraignante et devrait être écrite. En complément, une procuration de prévoyance désigne qui pourra parler en votre nom.",
  "Welche Nummer erreicht den ärztlichen Bereitschaftsdienst außerhalb der Sprechzeiten?":
    "Quel numéro joint la permanence médicale en dehors des heures de consultation ?",
  "116117 für dringende, aber nicht lebensbedrohliche Fälle. Die 112 bleibt echten Notfällen vorbehalten, die 115 ist die Behördennummer.":
    "Le 116117, pour les cas pressants mais sans danger de mort. Le 112 reste réservé aux véritables urgences, le 115 est le numéro des administrations.",
  "Was passiert, wenn du länger als sechs Wochen krank bist?":
    "Que se passe-t-il si l'on est malade plus de six semaines ?",
  "Du bekommst kein Geld mehr": "On ne reçoit plus rien",
  "Die Krankenkasse zahlt Krankengeld":
    "La caisse d'assurance maladie verse une indemnité journalière",
  "Der Arbeitgeber zahlt unbegrenzt weiter": "L'employeur continue de payer sans limite",
  "Du wirst automatisch gekündigt": "On est licencié automatiquement",
  "Nach sechs Wochen Lohnfortzahlung übernimmt die Krankenkasse mit dem Krankengeld.":
    "Après six semaines de maintien du salaire, la caisse d'assurance maladie prend le relais avec l'indemnité journalière.",
  "Was ist eine Vorsorgeuntersuchung?": "Qu'est-ce qu'un examen de dépistage ?",
  "Eine Untersuchung nach einem Unfall": "Un examen après un accident",
  "Eine Untersuchung zur Früherkennung von Krankheiten, meist von der Kasse bezahlt":
    "Un examen destiné à repérer tôt les maladies, le plus souvent pris en charge par la caisse",
  "Eine Untersuchung vor einer Operation": "Un examen avant une opération",
  "Eine Untersuchung beim Zahnarzt nach Schmerzen":
    "Un examen chez le dentiste après des douleurs",
  "Früherkennung statt Behandlung — etwa Krebsvorsorge, Kinderuntersuchungen und der Gesundheits-Check-up.":
    "Repérer tôt plutôt que soigner — dépistage du cancer, examens de l'enfant et bilan de santé.",
  "Muss man in Deutschland für den Notruf 112 bezahlen?":
    "Le numéro d'urgence 112 est-il payant en Allemagne ?",
  "Ja, pro Anruf": "Oui, à chaque appel",
  "Nein, der Notruf ist kostenlos": "Non, l'appel d'urgence est gratuit",
  "Nur vom Handy": "Seulement depuis un portable",
  "Nur nachts": "Seulement la nuit",
  "Der Anruf ist kostenlos und funktioniert von jedem Telefon, auch ohne Guthaben.":
    "L'appel est gratuit et fonctionne depuis n'importe quel téléphone, même sans crédit.",
  "Wofür ist eine private Haftpflichtversicherung wichtig?":
    "Pourquoi une assurance responsabilité civile privée importe-t-elle ?",
  "Für Schäden am eigenen Auto": "Pour les dommages à sa propre voiture",
  "Für Schäden, die man anderen zufügt — sie kann existenzsichernd sein":
    "Pour les dommages causés à autrui — elle peut préserver toute une existence",
  "Für die eigene Gesundheit": "Pour sa propre santé",
  "Für den Hausrat": "Pour le mobilier",
  "Wer fahrlässig einen großen Schaden verursacht, haftet unbegrenzt mit seinem Vermögen. Deshalb gilt sie als wichtigste freiwillige Versicherung.":
    "Qui cause par négligence un dommage important en répond sans limite sur ses biens. C'est pourquoi elle passe pour la plus importante des assurances facultatives.",
  "Wann ist der Tag der Deutschen Einheit?": "Quand tombe la fête de l'Unité allemande ?",
  "Am 1. Mai": "Le 1er mai",
  "Am 3. Oktober": "Le 3 octobre",
  "Am 9. November": "Le 9 novembre",
  "Am 23. Mai": "Le 23 mai",
  "Der 3. Oktober, der Nationalfeiertag. Der 9. November ist der Tag des Mauerfalls, aber auch der Pogromnacht.":
    "Le 3 octobre, la fête nationale. Le 9 novembre est le jour de la chute du Mur, mais aussi celui de la nuit de Cristal.",
  "Welcher Komponist schrieb die Melodie der „Ode an die Freude“, der Europahymne?":
    "Quel compositeur a écrit la mélodie de l'« Ode à la joie », l'hymne européen ?",
  "Ludwig van Beethoven": "Ludwig van Beethoven",
  "Richard Wagner": "Richard Wagner",
  "Aus Beethovens 9. Sinfonie. Der Text stammt von Friedrich Schiller.":
    "Elle vient de la neuvième symphonie de Beethoven. Le texte est de Friedrich Schiller.",
  "Was ist die Bundesliga?": "Qu'est-ce que la Bundesliga ?",
  "Eine politische Vereinigung": "Une association politique",
  "Die höchste deutsche Fußballliga": "Le championnat de football allemand de première division",
  "Ein Fernsehsender": "Une chaîne de télévision",
  "Ein Zusammenschluss der Bundesländer": "Un regroupement des Länder",
  "Sie spielt von August bis Mai. Fußball ist die mit Abstand beliebteste Sportart in Deutschland.":
    "Elle se joue d'août à mai. Le football est de loin le sport le plus aimé en Allemagne.",
  "Wofür ist Konrad Zuse bekannt?": "Pour quoi Konrad Zuse est-il connu ?",
  "Für den Buchdruck": "Pour l'imprimerie",
  "Für den Bau des ersten funktionsfähigen Computers":
    "Pour la construction du premier ordinateur en état de marche",
  "Für das Automobil": "Pour l'automobile",
  "Zuse baute 1941 die Z3. Gutenberg steht für den Buchdruck, Einstein für die Physik, Benz für das Auto.":
    "Zuse a construit la Z3 en 1941. Gutenberg, c'est l'imprimerie, Einstein la physique, Benz l'automobile.",
  "Was ist ein eingetragener Verein (e. V.)?": "Qu'est-ce qu'une association déclarée (e. V.) ?",
  "Ein Unternehmen": "Une entreprise",
  "Ein Zusammenschluss von Menschen für einen gemeinsamen Zweck, ins Vereinsregister eingetragen":
    "Un groupement de personnes réunies pour un but commun, inscrit au registre des associations",
  "Eine Behörde": "Une administration",
  "Eine Partei": "Un parti",
  "Sport, Musik, Feuerwehr, Naturschutz — Vereine sind für viele der einfachste Weg, Anschluss zu finden.":
    "Sport, musique, pompiers, protection de la nature — les associations sont pour beaucoup le chemin le plus simple vers les autres.",
  "Wann wird in Deutschland Karneval oder Fasching gefeiert?":
    "Quand fête-t-on en Allemagne le carnaval, Karneval ou Fasching ?",
  "Im Sommer": "En été",
  "Im Winter, vor der Fastenzeit": "En hiver, avant le carême",
  "Immer im Dezember": "Toujours en décembre",
  "Zu Ostern": "À Pâques",
  "Höhepunkt sind die Tage vor Aschermittwoch, besonders im Rheinland und in Süddeutschland.":
    "Le sommet en est les jours qui précèdent le mercredi des Cendres, surtout en Rhénanie et dans le sud de l'Allemagne.",
  "Wofür stehen die Buchstaben ARD und ZDF?": "Que désignent les lettres ARD et ZDF ?",
  "Für private Fernsehsender": "Des chaînes de télévision privées",
  "Für den öffentlich-rechtlichen Rundfunk": "L'audiovisuel public",
  "Für Zeitungen": "Des journaux",
  "Für Radiosender der Bundesländer": "Des stations de radio des Länder",
  "Beide werden über den Rundfunkbeitrag finanziert, damit sie unabhängig von Staat und Werbekunden berichten können.":
    "Toutes deux sont financées par le Rundfunkbeitrag, afin de pouvoir informer indépendamment de l'État et des annonceurs.",
  "Warum ist die Unabhängigkeit der Medien in einer Demokratie wichtig?":
    "Pourquoi l'indépendance des médias importe-t-elle dans une démocratie ?",
  "Damit die Regierung ihre Politik erklären kann":
    "Pour que le gouvernement puisse expliquer sa politique",
  "Damit Machtausübung öffentlich überprüft und kritisiert werden kann":
    "Pour que l'exercice du pouvoir puisse être examiné et critiqué publiquement",
  "Damit es mehr Unterhaltung gibt": "Pour qu'il y ait plus de divertissement",
  "Damit die Parteien gleich viel Sendezeit haben":
    "Pour que les partis aient le même temps d'antenne",
  "Freie Medien sind eine Kontrollinstanz. Genau das unterschied sie von der gelenkten Presse im NS-Staat und in der DDR.":
    "Des médias libres sont une instance de contrôle. C'est précisément ce qui les distinguait de la presse dirigée de l'État nazi et de la RDA.",
};
