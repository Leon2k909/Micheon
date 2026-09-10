/**
 * English for the Leben in Deutschland practice questions.
 *
 * The lesson cards are answered by LEBEN_IN_DEUTSCHLAND_EN. These are the
 * other body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs, and ukSessionQuizzes folds the UK bank into the stepped lesson.
 * Until this table a lesson read in English then asked its questions in
 * German.
 *
 * Keyed on the GERMAN source text exactly as it appears in deQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an ss for
 * an ß or a straight quotation mark where the sentence has „ and “, and the
 * lookup misses in silence. The question renders in German, the tap works,
 * and nothing anywhere reports it.
 *
 * WHAT STAYS GERMAN follows LEBEN_IN_DEUTSCHLAND_EN exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing:
 *
 *   - the Einbürgerungstest is sat in German and asks for these words by
 *     name, so the office, the law and the benefit keep theirs: Grundgesetz,
 *     Bundestag, Bundesrat, Bundesregierung, Bundeskanzler, Bundespräsident,
 *     Bundesverfassungsgericht, Standesamt, Bürgeramt, Finanzamt, Kindergeld,
 *     Elterngeld, Bürgergeld, Arbeitslosengeld, Rundfunkbeitrag;
 *   - where the German word is the answer and English has nothing short for
 *     it — Erststimme, Zweitstimme, Budgetrecht, Fraktion, Rechtsstaat,
 *     Schöffe, Minijob, Kurzarbeit — the English gives the meaning and keeps
 *     the word beside it;
 *   - what English does name takes its English name: the Gewaltenteilung is
 *     the separation of powers, the Länder are the states, the Exekutive the
 *     executive.
 *
 * British spelling throughout, the same as the rest of the English catalogue:
 * offence, recognise, programme, defence, labour.
 *
 * Sixty-eight of the bank's strings are not here and that is correct: they
 * are years, bare numbers and short answers that LEBEN_IN_DEUTSCHLAND_EN
 * already answers. Every English table is spread into one object, so a key
 * present in two of them would lose one silently — the later spread would
 * decide both. check-en-bank-translation measures coverage through
 * translateCourseText, the lookup a reader's tap actually goes through, so
 * those count as answered and are not duplicated here.
 */
export const DE_QUESTION_BANK_EN: Record<string, string> = {
  "Wie heißt die Verfassung der Bundesrepublik Deutschland?":
    "What is the constitution of the Federal Republic of Germany called?",
  "Bundesverfassung": "Bundesverfassung, the federal constitution",
  "Grundgesetz": "Grundgesetz, the basic law",
  "Reichsverfassung": "Reichsverfassung, the imperial constitution",
  "Staatsvertrag": "Staatsvertrag, a treaty between states",
  "Sie heißt Grundgesetz. Der Name war 1949 als Provisorium gedacht — bis zur Wiedervereinigung wollte man sich das Wort „Verfassung“ aufheben.":
    "It is called the Grundgesetz. The name was meant in 1949 as a temporary one: the word \"constitution\" was to be saved until reunification.",
  "Seit wann gilt das Grundgesetz?": "Since when has the Grundgesetz been in force?",
  "Seit dem 8. Mai 1945": "Since 8 May 1945",
  "Seit dem 23. Mai 1949": "Since 23 May 1949",
  "Seit dem 7. Oktober 1949": "Since 7 October 1949",
  "Seit dem 3. Oktober 1990": "Since 3 October 1990",
  "23. Mai 1949. Der 7. Oktober 1949 ist die Gründung der DDR, der 3. Oktober 1990 die Wiedervereinigung.":
    "23 May 1949. 7 October 1949 is the founding of the GDR, and 3 October 1990 reunification.",
  "Welches Recht gehört zu den Grundrechten im Grundgesetz?":
    "Which right is one of the basic rights in the Grundgesetz?",
  "Das Recht auf ein eigenes Auto": "The right to a car of one's own",
  "Die Meinungsfreiheit": "Freedom of expression",
  "Das Recht auf einen Arbeitsplatz beim Staat": "The right to a job with the state",
  "Das Recht auf ein Studium ohne Abschluss": "The right to study without taking a degree",
  "Die Meinungsfreiheit steht in Artikel 5. Die anderen drei sind keine Grundrechte.":
    "Freedom of expression is in Article 5. The other three are not basic rights.",
  "Was sagt Artikel 3 des Grundgesetzes?": "What does Article 3 of the Grundgesetz say?",
  "Die Würde des Menschen ist unantastbar": "Human dignity is inviolable",
  "Alle Menschen sind vor dem Gesetz gleich": "All people are equal before the law",
  "Jeder hat das Recht auf Leben": "Everyone has the right to life",
  "Die Kunst ist frei": "Art is free",
  "Artikel 3 ist der Gleichheitssatz. Die Menschenwürde steht in Artikel 1, die Kunstfreiheit in Artikel 5.":
    "Article 3 is the equality clause. Human dignity is in Article 1, freedom of art in Article 5.",
  "Welche Aussage über die Meinungsfreiheit in Deutschland ist richtig?":
    "Which statement about freedom of expression in Germany is correct?",
  "Man darf alles sagen, ohne jede Grenze": "You may say anything at all, without any limit",
  "Sie endet dort, wo Volksverhetzung oder Beleidigung beginnt":
    "It ends where incitement to hatred or insult begins",
  "Sie gilt nur für deutsche Staatsangehörige": "It applies only to German nationals",
  "Sie gilt nur in privaten Gesprächen": "It applies only in private conversation",
  "Meinungsfreiheit ist weit, aber nicht grenzenlos: Volksverhetzung, Beleidigung und Holocaustleugnung sind Straftaten.":
    "Freedom of expression is broad but not boundless: incitement to hatred, insult and Holocaust denial are criminal offences.",
  "Wie viele Fragen umfasst der Einbürgerungstest, und wie viele davon betreffen das Bundesland?":
    "How many questions does the Einbürgerungstest have, and how many of them are about the state?",
  "30 Fragen, davon 3 zum Bundesland": "30 questions, 3 of them about the state",
  "33 Fragen, davon 3 zum Bundesland": "33 questions, 3 of them about the state",
  "33 Fragen, davon 10 zum Bundesland": "33 questions, 10 of them about the state",
  "25 Fragen, davon 5 zum Bundesland": "25 questions, 5 of them about the state",
  "33 Fragen insgesamt: 30 aus dem bundesweiten Katalog und 3 zum Bundesland, in dem der Test geschrieben wird.":
    "33 questions in all: 30 from the nationwide catalogue and 3 about the state where the test is sat.",
  "Von wem geht in Deutschland alle Staatsgewalt aus?":
    "From whom does all state authority in Germany derive?",
  "Vom Bundespräsidenten": "From the Bundespräsident",
  "Vom Volk": "From the people",
  "Von den Parteien": "From the parties",
  "Von den Bundesländern": "From the states",
  "Artikel 20: „Alle Staatsgewalt geht vom Volke aus.“ Ausgeübt wird sie durch Wahlen und durch die drei Gewalten.":
    "Article 20: \"All state authority derives from the people.\" It is exercised through elections and through the three powers.",
  "Welche Staatsform hat Deutschland?": "What form of state does Germany have?",
  "Monarchie": "A monarchy",
  "Diktatur": "A dictatorship",
  "Kaiserreich": "An empire",
  "Eine Republik: Das Staatsoberhaupt wird gewählt, es gibt keinen König und keinen Kaiser.":
    "A republic: the head of state is elected, and there is no king and no emperor.",
  "Was gehört zur Exekutive?": "What belongs to the Exekutive, the executive power?",
  "Die Polizei": "The police",
  "Die Polizei führt Gesetze aus und gehört damit zur Exekutive. Bundestag und Bundesrat sind Legislative, die Gerichte Judikative.":
    "The police carry the laws out and so belong to the executive. The Bundestag and Bundesrat are the legislature, the courts the judiciary.",
  "Was bedeutet „Rechtsstaat“?": "What does \"Rechtsstaat\" mean?",
  "Der Staat kann tun, was er für richtig hält": "The state can do whatever it thinks right",
  "Auch der Staat ist an Gesetze gebunden": "The state itself is bound by law",
  "Nur Juristen dürfen Politik machen": "Only lawyers may go into politics",
  "Es gibt besonders viele Gesetze": "There are a particularly large number of laws",
  "Im Rechtsstaat gilt das Gesetz auch für den Staat selbst — und gegen jede staatliche Entscheidung kann man klagen.":
    "In a Rechtsstaat the law applies to the state itself, and any decision the state makes can be challenged in court.",
  "Was bedeutet „wehrhafte Demokratie“?":
    "What does \"wehrhafte Demokratie\", a democracy able to defend itself, mean?",
  "Deutschland hat eine starke Armee": "Germany has a strong army",
  "Die Demokratie schützt sich vor denen, die sie abschaffen wollen":
    "Democracy protects itself against those who want to abolish it",
  "Bürger dürfen sich mit Waffen verteidigen": "Citizens may defend themselves with weapons",
  "Der Staat wehrt sich gegen Kritik": "The state defends itself against criticism",
  "Verfassungsfeindliche Parteien können verboten werden, und der Kern der Verfassung ist unabänderlich. Mit der Armee hat der Begriff nichts zu tun.":
    "Parties hostile to the constitution can be banned, and the core of the constitution cannot be altered. The term has nothing to do with the army.",
  "Warum sind die Gewalten in Deutschland getrennt?": "Why are the powers separated in Germany?",
  "Damit die Arbeit schneller geht": "So that the work goes faster",
  "Damit keine Stelle allein über alles bestimmen kann":
    "So that no single body can decide everything on its own",
  "Weil es die EU vorschreibt": "Because the EU requires it",
  "Weil es in der Weimarer Verfassung so stand":
    "Because that is what the Weimar constitution said",
  "Machtkontrolle ist der Zweck: Was die eine Gewalt beschließt, führt die zweite aus und überprüft die dritte.":
    "Controlling power is the purpose: what one power decides, the second carries out and the third reviews.",
  "Welches Verfassungsorgan wird in Deutschland direkt vom Volk gewählt?":
    "Which constitutional body in Germany is elected directly by the people?",
  "Die Bundesregierung": "The Bundesregierung, the federal government",
  "Nur der Bundestag wird direkt gewählt. Alle anderen Organe gehen mittelbar aus Wahlen hervor.":
    "Only the Bundestag is elected directly. All the other bodies come out of elections indirectly.",
  "Was ist eine Fraktion im Bundestag?": "What is a Fraktion in the Bundestag?",
  "Ein Ausschuss für Finanzfragen": "A committee for financial matters",
  "Der Zusammenschluss der Abgeordneten einer Partei": "The grouping of the members of one party",
  "Die Regierungsmannschaft des Kanzlers": "The chancellor's governing team",
  "Eine Gruppe von Ministerien": "A group of ministries",
  "Abgeordnete derselben Partei schließen sich zur Fraktion zusammen. Fraktionen bestimmen den Arbeitsalltag des Parlaments.":
    "Members of the same party join together into a Fraktion. Fraktionen set the everyday work of parliament.",
  "Wer darf einen Gesetzentwurf in den Bundestag einbringen?":
    "Who may introduce a bill into the Bundestag?",
  "Nur die Bundesregierung": "Only the Bundesregierung",
  "Bundesregierung, Bundestag oder Bundesrat":
    "The Bundesregierung, the Bundestag or the Bundesrat",
  "Nur der Bundespräsident": "Only the Bundespräsident",
  "Jeder Bürger direkt": "Any citizen, directly",
  "Drei Wege führen zu einem Gesetzentwurf: aus der Regierung, aus der Mitte des Bundestages oder aus dem Bundesrat.":
    "Three routes lead to a bill: from the government, from within the Bundestag or from the Bundesrat.",
  "Was versteht man unter dem Budgetrecht des Bundestages?":
    "What is meant by the Budgetrecht of the Bundestag?",
  "Das Recht, die Steuern selbst einzuziehen": "The right to collect the taxes itself",
  "Das Recht, über den Haushalt des Bundes zu entscheiden":
    "The right to decide the federal budget",
  "Das Recht der Abgeordneten auf ein Gehalt": "The members' right to a salary",
  "Das Recht, Kredite privat aufzunehmen": "The right to take out loans privately",
  "Das Parlament entscheidet, wofür der Staat Geld ausgibt. Deshalb gilt das Budgetrecht als Königsrecht des Bundestages.":
    "Parliament decides what the state spends money on. That is why the Budgetrecht counts as the crowning right of the Bundestag.",
  "Wie viele Stimmen hat ein Bundesland im Bundesrat?":
    "How many votes does a state have in the Bundesrat?",
  "Jedes Land hat genau eine Stimme": "Every state has exactly one vote",
  "Je nach Einwohnerzahl drei bis sechs Stimmen": "Three to six votes, according to population",
  "Jedes Land hat zehn Stimmen": "Every state has ten votes",
  "Die Zahl wechselt jedes Jahr": "The number changes every year",
  "Drei bis sechs Stimmen, gestaffelt nach Einwohnerzahl — und ein Land muss seine Stimmen einheitlich abgeben.":
    "Three to six votes, graded by population — and a state has to cast its votes as a block.",
  "Was ist ein Untersuchungsausschuss?":
    "What is an Untersuchungsausschuss, a committee of inquiry?",
  "Ein Gericht für Abgeordnete": "A court for members of parliament",
  "Ein Gremium des Bundestages, das Vorgänge aufklärt und die Regierung kontrolliert":
    "A body of the Bundestag that investigates events and holds the government to account",
  "Eine Behörde zur Prüfung von Gesetzen": "An authority that reviews laws",
  "Der Ausschuss, der den Haushalt aufstellt": "The committee that draws up the budget",
  "Er gehört zur Kontrollfunktion des Parlaments: Der Bundestag klärt damit auf, was die Regierung lieber unerwähnt ließe.":
    "It belongs to parliament's oversight role: with it the Bundestag brings out what the government would rather leave unmentioned.",
  "Wer leitet die Bundesregierung?": "Who leads the Bundesregierung, the federal government?",
  "Der Bundestagspräsident": "The president of the Bundestag",
  "Der Präsident des Bundesrates": "The president of the Bundesrat",
  "Der Bundeskanzler führt die Regierung und bestimmt die Richtlinien der Politik. Der Bundespräsident regiert nicht.":
    "The Bundeskanzler leads the government and sets the guidelines of policy. The Bundespräsident does not govern.",
  "Wer wählt den Bundespräsidenten?": "Who elects the Bundespräsident?",
  "Der Bundestag allein": "The Bundestag alone",
  "Die Bundesversammlung — zur Hälfte Bundestagsabgeordnete, zur Hälfte Vertreter der Länder. Sie tritt nur zu diesem Zweck zusammen.":
    "The Bundesversammlung — half members of the Bundestag, half representatives of the states. It meets for this purpose alone.",
  "Was bedeutet Richtlinienkompetenz?": "What does Richtlinienkompetenz mean?",
  "Der Kanzler bestimmt die Grundlinien der Politik":
    "The chancellor sets the broad lines of policy",
  "Der Bundespräsident gibt die Gesetze vor": "The Bundespräsident lays down the laws",
  "Die Ministerien schreiben eigene Richtlinien": "The ministries write their own guidelines",
  "Der Bundesrat gibt den Ländern Richtlinien": "The Bundesrat gives the states guidelines",
  "Der Kanzler setzt die Leitlinien; innerhalb dieser Linien führt jeder Minister sein Haus eigenständig.":
    "The chancellor sets the guidelines; within them each minister runs their own ministry independently.",
  "Wer ernennt die Bundesminister?": "Who appoints the federal ministers?",
  "Der Bundestag durch Wahl": "The Bundestag, by election",
  "Der Bundespräsident auf Vorschlag des Kanzlers":
    "The Bundespräsident, on the chancellor's proposal",
  "Der Kanzler allein, ohne weitere Beteiligung":
    "The chancellor alone, with nobody else involved",
  "Vorschlagen darf der Kanzler, ernennen muss der Bundespräsident. Zwei Schritte, die gern zu einem verkürzt werden.":
    "The chancellor proposes, the Bundespräsident appoints. Two steps that are often shortened into one.",
  "Wie oft darf eine Person das Amt des Bundespräsidenten ausüben?":
    "How often may one person hold the office of Bundespräsident?",
  "Nur einmal": "Only once",
  "Höchstens zweimal": "Twice at most",
  "Beliebig oft": "As often as they like",
  "Bis zum 70. Lebensjahr": "Until the age of 70",
  "Zwei Amtszeiten zu je fünf Jahren, also höchstens zehn Jahre. Für den Kanzler gibt es keine solche Grenze.":
    "Two terms of five years each, so ten years at most. There is no such limit for the chancellor.",
  "Wie nennt man Kanzler und Minister zusammen?":
    "What are the chancellor and the ministers called together?",
  "Bundesversammlung": "Bundesversammlung, the federal convention",
  "Bundesregierung oder Kabinett": "Bundesregierung, the federal government, or the cabinet",
  "Bundesrat": "Bundesrat, the federal council",
  "Bundestag": "Bundestag, the federal parliament",
  "Bundeskanzler und Bundesminister bilden gemeinsam die Bundesregierung, umgangssprachlich das Kabinett.":
    "The Bundeskanzler and the federal ministers together form the Bundesregierung, in everyday speech the cabinet.",
  "Wie oft findet in Deutschland regulär eine Bundestagswahl statt?":
    "How often does a regular Bundestag election take place in Germany?",
  "Alle zwei Jahre": "Every two years",
  "Alle vier Jahre": "Every four years",
  "Alle fünf Jahre": "Every five years",
  "Alle sechs Jahre": "Every six years",
  "Alle vier Jahre. Das Europäische Parlament wird alle fünf Jahre gewählt — daher die häufige Verwechslung.":
    "Every four years. The European Parliament is elected every five years, which is where the frequent confusion comes from.",
  "Was bedeutet „freie Wahl“?": "What does a \"free\" election mean?",
  "Die Wahl kostet nichts": "The election costs nothing",
  "Niemand darf zu einer bestimmten Entscheidung gezwungen werden":
    "Nobody may be forced into a particular decision",
  "Jeder kann sich aussuchen, wann er wählt": "Everyone can choose when to vote",
  "Man kann mehrere Stimmen abgeben": "You can cast several votes",
  "Frei heißt: ohne Druck und ohne Zwang. Weder Staat noch Arbeitgeber noch Familie dürfen eine Stimme vorschreiben.":
    "Free means without pressure and without compulsion. Neither the state nor an employer nor a family may dictate a vote.",
  "Was ist die Fünf-Prozent-Hürde?":
    "What is the Fünf-Prozent-Hürde, the five per cent threshold?",
  "Eine Partei braucht mindestens fünf Prozent der Zweitstimmen, um in den Bundestag zu kommen":
    "A party needs at least five per cent of the Zweitstimmen to enter the Bundestag",
  "Fünf Prozent der Wähler müssen zur Wahl gehen": "Five per cent of voters have to turn out",
  "Ein Kandidat braucht fünf Prozent im Wahlkreis":
    "A candidate needs five per cent in the constituency",
  "Fünf Prozent der Sitze bleiben immer frei": "Five per cent of the seats always stay empty",
  "Sie hält Kleinstparteien draußen und soll das Parlament arbeitsfähig halten — eine Lehre aus der zersplitterten Weimarer Republik.":
    "It keeps the smallest parties out and is meant to keep parliament able to work — a lesson from the fragmented Weimar Republic.",
  "Wofür wird die Erststimme bei der Bundestagswahl verwendet?":
    "What is the Erststimme used for in a Bundestag election?",
  "Für die Wahl einer Partei": "For voting for a party",
  "Für die Wahl eines Kandidaten im eigenen Wahlkreis":
    "For voting for a candidate in your own constituency",
  "Für die Wahl des Bundeskanzlers": "For electing the Bundeskanzler",
  "Für die Wahl des Bundespräsidenten": "For electing the Bundespräsident",
  "Die Erststimme gilt einer Person im Wahlkreis, die Zweitstimme einer Partei. Kanzler und Präsident wählt das Volk gar nicht.":
    "The Erststimme goes to a person in the constituency, the Zweitstimme to a party. The chancellor and the president are not elected by the people at all.",
  "Wer darf in Deutschland bei Kommunalwahlen häufig mitwählen, ohne die deutsche Staatsangehörigkeit zu haben?":
    "Who can often vote in German local elections without holding German nationality?",
  "Niemand": "Nobody",
  "Bürger anderer EU-Staaten, die hier wohnen": "Citizens of other EU states who live here",
  "Alle Personen mit Aufenthaltstitel": "Everyone with a residence permit",
  "Nur Personen aus Nachbarländern": "Only people from neighbouring countries",
  "EU-Bürger dürfen dort wählen, wo sie leben — bei Kommunal- und Europawahlen. Für die Bundestagswahl braucht es den deutschen Pass.":
    "EU citizens may vote where they live, in local and European elections. A Bundestag election needs a German passport.",
  "Was ist die Opposition im Bundestag?": "What is the opposition in the Bundestag?",
  "Die Parteien, die nicht die Regierung stellen": "The parties that do not form the government",
  "Die Minister ohne eigenes Ministerium": "The ministers without a ministry of their own",
  "Die Abgeordneten des Bundesrates": "The members of the Bundesrat",
  "Die Verwaltung des Parlaments": "The administration of parliament",
  "Sie kontrolliert die Regierung, stellt Alternativen zur Debatte und ist damit ein fester Bestandteil der Demokratie.":
    "It holds the government to account, puts alternatives up for debate and is thereby a fixed part of democracy.",
  "Wie heißt das Parlament eines Bundeslandes in den meisten Ländern?":
    "What is the parliament of a state called in most states?",
  "Gemeinderat": "Gemeinderat, the local council",
  "Landtag. In Hamburg und Bremen heißt es Bürgerschaft, in Berlin Abgeordnetenhaus.":
    "Landtag. In Hamburg and Bremen it is called Bürgerschaft, in Berlin Abgeordnetenhaus.",
  "Wie heißt der Regierungschef eines Flächenlandes?":
    "What is the head of government of a territorial state called?",
  "Bürgermeister": "Bürgermeister, the mayor",
  "Ministerpräsident": "Ministerpräsident, the minister-president",
  "Landeskanzler": "Landeskanzler, a state chancellor",
  "Landrat": "Landrat, the district administrator",
  "Ministerpräsident. In den Stadtstaaten heißt das Amt Regierender Bürgermeister, Erster Bürgermeister oder Präsident des Senats.":
    "Ministerpräsident. In the city states the office is called Regierender Bürgermeister, Erster Bürgermeister or president of the senate.",
  "Wofür ist der Bund und nicht das Bundesland zuständig?":
    "What is the federation responsible for, rather than the state?",
  "Für die Schulen": "For the schools",
  "Für die Außenpolitik": "For foreign policy",
  "Für die Landespolizei": "For the state police",
  "Für die Bauordnung": "For building regulations",
  "Außenpolitik, Verteidigung, Staatsangehörigkeit und Währung sind Bundessache. Schule, Polizei und Bauordnung sind Ländersache.":
    "Foreign policy, defence, nationality and currency are matters for the federation. Schools, police and building regulations are matters for the states.",
  "Welche Aussage über die Landesverfassungen ist richtig?":
    "Which statement about the state constitutions is correct?",
  "Es gibt keine, es gilt nur das Grundgesetz": "There are none; only the Grundgesetz applies",
  "Jedes Land hat eine eigene, die dem Grundgesetz nicht widersprechen darf":
    "Every state has one of its own, and it may not contradict the Grundgesetz",
  "Sie stehen über dem Grundgesetz": "They stand above the Grundgesetz",
  "Nur die alten Bundesländer haben eine": "Only the western states have one",
  "Jedes Land hat eine eigene Verfassung — aber Bundesrecht bricht Landesrecht, und dem Grundgesetz darf keine widersprechen.":
    "Every state has its own constitution — but federal law overrides state law, and none of them may contradict the Grundgesetz.",
  "Was entscheidet die Gemeinde selbst?": "What does the municipality decide for itself?",
  "Die Höhe der Einkommensteuer": "The rate of income tax",
  "Bebauungspläne, Kitas und die örtliche Müllabfuhr":
    "Development plans, nurseries and the local refuse collection",
  "Die Staatsangehörigkeit": "Nationality",
  "Die kommunale Selbstverwaltung regelt, was direkt vor Ort anfällt. Steuersätze, Schulpflicht und Staatsangehörigkeit liegen höher.":
    "Local self-government settles what comes up on the spot. Tax rates, compulsory schooling and nationality lie higher up.",
  "Wie viele Flächenländer hat Deutschland?": "How many territorial states does Germany have?",
  "11": "11",
  "13": "13",
  "3": "3",
  "13 Flächenländer plus die drei Stadtstaaten Berlin, Hamburg und Bremen ergeben 16 Bundesländer.":
    "13 territorial states plus the three city states of Berlin, Hamburg and Bremen make 16 states in all.",
  "An welches Gericht wendest du dich bei einem Streit über eine Kündigung?":
    "Which court do you turn to in a dispute over a dismissal?",
  "An das Verwaltungsgericht": "To the administrative court",
  "An das Arbeitsgericht": "To the labour court",
  "An das Finanzgericht": "To the tax court",
  "An das Sozialgericht": "To the social court",
  "Arbeitsgerichte entscheiden über Streit zwischen Arbeitgeber und Arbeitnehmer, Kündigungen eingeschlossen.":
    "Labour courts decide disputes between employer and employee, dismissals included.",
  "Wer klagt im Strafverfahren gegen einen Angeklagten?":
    "Who brings the case against a defendant in criminal proceedings?",
  "Der Richter": "The judge",
  "Die Staatsanwaltschaft": "The public prosecutor's office",
  "Der Verteidiger": "The defence lawyer",
  "Die Staatsanwaltschaft erhebt Anklage. Der Richter entscheidet, die Polizei ermittelt, der Verteidiger vertritt den Angeklagten.":
    "The public prosecutor's office brings the charge. The judge decides, the police investigate, and the defence lawyer represents the defendant.",
  "Was bedeutet die Unabhängigkeit der Richter?": "What does the independence of judges mean?",
  "Richter dürfen selbst Gesetze machen": "Judges may make laws themselves",
  "Richter sind nur an das Gesetz gebunden und erhalten keine Weisungen":
    "Judges are bound only by the law and take no instructions",
  "Richter müssen nicht begründen, wie sie entscheiden":
    "Judges do not have to give reasons for their decisions",
  "Richter werden vom Volk gewählt": "Judges are elected by the people",
  "Kein Minister und kein Vorgesetzter darf einem Richter vorschreiben, wie er zu entscheiden hat. Gebunden ist er allein an das Gesetz.":
    "No minister and no superior may tell a judge how to decide. A judge is bound by the law alone.",
  "Wann kann eine Person Verfassungsbeschwerde erheben?":
    "When can a person lodge a constitutional complaint?",
  "Sofort, bevor sie andere Gerichte anruft": "At once, before going to any other court",
  "Wenn sie sich in Grundrechten verletzt sieht und der übrige Rechtsweg ausgeschöpft ist":
    "When they consider their basic rights violated and every other legal remedy is exhausted",
  "Nur wenn der Bundestag zustimmt": "Only if the Bundestag agrees",
  "Nur als Gruppe von mindestens 100 Personen": "Only as a group of at least 100 people",
  "Zuerst der normale Rechtsweg, dann Karlsruhe. Die Verfassungsbeschwerde ist der letzte Schritt, nicht der erste.":
    "First the ordinary courts, then Karlsruhe. The constitutional complaint is the last step, not the first.",
  "Was gilt, wenn jemand in Deutschland eine Straftat begeht, die zur Tatzeit noch nicht strafbar war?":
    "What applies if someone in Germany does something that was not yet a criminal offence at the time?",
  "Er wird nachträglich bestraft": "They are punished after the fact",
  "Er kann dafür nicht bestraft werden": "They cannot be punished for it",
  "Das Gericht entscheidet frei": "The court decides freely",
  "Die Strafe wird halbiert": "The sentence is halved",
  "Keine Strafe ohne Gesetz: Bestraft werden kann nur, was zum Zeitpunkt der Tat bereits unter Strafe stand.":
    "No punishment without a law: only what was already punishable at the time of the act can be punished.",
  "Wer bekommt in Deutschland einen Verteidiger, wenn er sich keinen leisten kann?":
    "Who gets a defence lawyer in Germany if they cannot afford one?",
  "Niemand, ein Anwalt muss selbst bezahlt werden":
    "Nobody; a lawyer has to be paid for out of your own pocket",
  "Jeder Angeklagte — der Staat hilft bei den Kosten":
    "Every defendant — the state helps with the costs",
  "Nur deutsche Staatsangehörige": "Only German nationals",
  "Nur bei schweren Verbrechen und nur auf eigene Kosten":
    "Only for serious crimes, and only at your own expense",
  "Das Recht auf Verteidigung darf nicht am Geld scheitern; deshalb gibt es Pflichtverteidigung und Prozesskostenhilfe.":
    "The right to a defence must not fail for want of money; hence the assigned defence lawyer and legal aid.",
  "Welche Versicherung zahlt, wenn jemand seine Arbeit verliert?":
    "Which insurance pays when someone loses their job?",
  "Die Rentenversicherung": "Pension insurance",
  "Die Arbeitslosenversicherung": "Unemployment insurance",
  "Die Pflegeversicherung": "Long-term care insurance",
  "Die Unfallversicherung": "Accident insurance",
  "Die Arbeitslosenversicherung zahlt Arbeitslosengeld und finanziert Vermittlung und Weiterbildung.":
    "Unemployment insurance pays Arbeitslosengeld and funds job placement and further training.",
  "Seit wann gibt es in Deutschland die Pflegeversicherung?":
    "How long has Germany had long-term care insurance?",
  "Seit 1995": "Since 1995",
  "Seit 2005": "Since 2005",
  "Seit 2015": "Since 2015",
  "1995 kam sie als fünfte und jüngste Säule der Sozialversicherung hinzu.":
    "It came in 1995 as the fifth and youngest pillar of social insurance.",
  "Wer zahlt Kindergeld, und wovon hängt es ab?":
    "Who pays Kindergeld, and what does it depend on?",
  "Der Arbeitgeber, abhängig vom Gehalt": "The employer, depending on the salary",
  "Der Staat, unabhängig vom Einkommen der Eltern": "The state, regardless of the parents' income",
  "Die Krankenkasse, abhängig von den Beiträgen":
    "The health insurer, depending on the contributions",
  "Die Gemeinde, abhängig vom Wohnort": "The municipality, depending on where you live",
  "Kindergeld gibt es für jedes Kind, ohne Rücksicht auf das Einkommen der Eltern.":
    "Kindergeld is paid for every child, with no regard to the parents' income.",
  "Wie werden die Beiträge zur gesetzlichen Krankenversicherung berechnet?":
    "How are the contributions to statutory health insurance worked out?",
  "Nach dem Alter der versicherten Person": "By the age of the insured person",
  "Nach dem Einkommen": "By income",
  "Nach der Anzahl der Arztbesuche": "By the number of visits to the doctor",
  "Für alle gleich hoch": "The same amount for everyone",
  "Nach dem Einkommen — das ist das Solidarprinzip. In der privaten Versicherung zählen dagegen Alter und Gesundheitszustand.":
    "By income — that is the solidarity principle. In private insurance, by contrast, age and state of health are what count.",
  "Was ist das Elterngeld?": "What is Elterngeld?",
  "Ein Zuschuss zur Miete für Familien": "A rent subsidy for families",
  "Ein Ersatz für einen Teil des Einkommens nach der Geburt eines Kindes":
    "A replacement for part of the income after the birth of a child",
  "Das monatliche Geld für jedes Kind": "The monthly payment for every child",
  "Eine einmalige Zahlung zur Geburt": "A one-off payment on the birth",
  "Elterngeld ersetzt Einkommen, wenn Eltern nach der Geburt zu Hause bleiben. Kindergeld dagegen ist die laufende Zahlung pro Kind.":
    "Elterngeld replaces income when parents stay at home after a birth. Kindergeld, by contrast, is the running payment per child.",
  "Welche Behörde ist für Arbeitslosengeld und Arbeitsvermittlung zuständig?":
    "Which authority is responsible for Arbeitslosengeld and job placement?",
  "Das Finanzamt": "The Finanzamt, the tax office",
  "Die Bundesagentur für Arbeit": "The Bundesagentur für Arbeit, the federal employment agency",
  "Das Bürgeramt": "The Bürgeramt, the citizens' office",
  "Die Krankenkasse": "The health insurer",
  "Die Bundesagentur für Arbeit mit ihren Agenturen und Jobcentern vor Ort.":
    "The Bundesagentur für Arbeit, with its local agencies and job centres.",
  "Wer war der erste Reichskanzler des Deutschen Kaiserreichs?":
    "Who was the first chancellor of the German Empire?",
  "Wilhelm II.": "Wilhelm II",
  "Otto von Bismarck": "Otto von Bismarck",
  "Friedrich Ebert": "Friedrich Ebert",
  "Bismarck ab 1871. Ebert wurde 1919 erster Reichspräsident, Adenauer 1949 erster Bundeskanzler.":
    "Bismarck, from 1871. Ebert became the first Reichspräsident in 1919, and Adenauer the first Bundeskanzler in 1949.",
  "Wann endete der Erste Weltkrieg?": "When did the First World War end?",
  "1914": "1914",
  "1933": "1933",
  "1945": "1945",
  "1918. Im selben Jahr dankte der Kaiser ab und die Republik wurde ausgerufen.":
    "1918. In the same year the emperor abdicated and the republic was proclaimed.",
  "Was war der Versailler Vertrag?": "What was the Treaty of Versailles?",
  "Der Vertrag zur Gründung des Kaiserreichs": "The treaty founding the empire",
  "Der Friedensvertrag nach dem Ersten Weltkrieg": "The peace treaty after the First World War",
  "Der Vertrag über die Wiedervereinigung": "The treaty on reunification",
  "Der Gründungsvertrag der EU": "The founding treaty of the EU",
  "1919 geschlossen. Er verpflichtete Deutschland zu Reparationen und Gebietsabtretungen und belastete die junge Republik schwer.":
    "Concluded in 1919. It obliged Germany to pay reparations and cede territory, and weighed heavily on the young republic.",
  "Welche Neuerung brachte die Weimarer Republik für Frauen?":
    "What was new for women in the Weimar Republic?",
  "Das Recht auf eigenes Vermögen": "The right to property of their own",
  "Das Wahlrecht": "The right to vote",
  "Das Recht zu studieren": "The right to study at university",
  "Den Mutterschutz": "Maternity protection",
  "1919 durften Frauen erstmals wählen und gewählt werden — die wohl wichtigste demokratische Neuerung dieser Jahre.":
    "In 1919 women could vote and stand for election for the first time — probably the most important democratic change of those years.",
  "Welche Schwäche der Weimarer Republik beantwortet das Grundgesetz mit der Fünf-Prozent-Hürde?":
    "Which weakness of the Weimar Republic does the Grundgesetz answer with the five per cent threshold?",
  "Die hohe Arbeitslosigkeit": "The high unemployment",
  "Die Zersplitterung des Parlaments in viele kleine Parteien":
    "The splintering of parliament into many small parties",
  "Die Reparationszahlungen": "The reparation payments",
  "Die Macht des Reichspräsidenten": "The power of the Reichspräsident",
  "Viele Kleinstparteien machten stabile Mehrheiten unmöglich. Die Hürde soll genau das verhindern.":
    "Many tiny parties made stable majorities impossible. The threshold is meant to prevent exactly that.",
  "Wofür ist Bismarck neben der Reichsgründung bekannt?":
    "What is Bismarck known for besides founding the empire?",
  "Für die Einführung der ersten Sozialversicherungen":
    "For introducing the first social insurance schemes",
  "Für die Einführung des Frauenwahlrechts": "For introducing votes for women",
  "Für die Gründung der Bundeswehr": "For founding the Bundeswehr",
  "Für die Einführung des Euro": "For introducing the euro",
  "Kranken-, Unfall- und Rentenversicherung entstanden in den 1880er Jahren — der deutsche Sozialstaat ist älter als die Demokratie.":
    "Health, accident and pension insurance came into being in the 1880s — the German welfare state is older than its democracy.",
  "Wann kamen die Nationalsozialisten in Deutschland an die Macht?":
    "When did the National Socialists come to power in Germany?",
  "1939": "1939",
  "Am 30. Januar 1933 wurde Hitler Reichskanzler. 1939 begann der Krieg, 1945 endete er.":
    "Hitler became Reichskanzler on 30 January 1933. The war began in 1939 and ended in 1945.",
  "Was bewirkte das Ermächtigungsgesetz von 1933?": "What did the Ermächtigungsgesetz of 1933 do?",
  "Es gab dem Parlament mehr Rechte": "It gave parliament more rights",
  "Es erlaubte der Regierung, Gesetze ohne das Parlament zu erlassen":
    "It allowed the government to pass laws without parliament",
  "Es führte das Frauenwahlrecht ein": "It introduced votes for women",
  "Es begrenzte die Macht des Reichskanzlers": "It limited the power of the Reichskanzler",
  "Damit war die Gewaltenteilung beseitigt — der entscheidende Schritt von der Demokratie zur Diktatur.":
    "With that the separation of powers was gone — the decisive step from democracy to dictatorship.",
  "Welches Merkmal kennzeichnete den NS-Staat?": "What marked out the National Socialist state?",
  "Mehrere Parteien im Wettbewerb": "Several parties competing",
  "Nur eine erlaubte Partei": "Only one permitted party",
  "Unabhängige Gerichte": "Independent courts",
  "Freie Presse": "A free press",
  "Ab Sommer 1933 war die NSDAP die einzige zugelassene Partei. Freie Presse und unabhängige Gerichte gab es nicht mehr.":
    "From the summer of 1933 the NSDAP was the only party allowed. A free press and independent courts no longer existed.",
  "Was geschah am 20. Juli 1944?": "What happened on 20 July 1944?",
  "Der Krieg endete": "The war ended",
  "Ein Attentat auf Hitler scheiterte": "An attempt on Hitler's life failed",
  "Die Nürnberger Gesetze wurden erlassen": "The Nuremberg laws were passed",
  "Die Mauer wurde gebaut": "The Wall was built",
  "Stauffenbergs Attentat scheiterte; die Beteiligten wurden hingerichtet. Der Tag steht für den militärischen Widerstand.":
    "Stauffenberg's attempt failed and those involved were executed. The day stands for the resistance within the military.",
  "Wann endete der Zweite Weltkrieg in Europa?": "When did the Second World War end in Europe?",
  "Am 9. November 1945": "On 9 November 1945",
  "Mit der bedingungslosen Kapitulation am 8. Mai 1945. Der 1. September 1939 war der Kriegsbeginn.":
    "With the unconditional surrender on 8 May 1945. The war had begun on 1 September 1939.",
  "Was waren die Nürnberger Gesetze von 1935?": "What were the Nuremberg laws of 1935?",
  "Gesetze zum Schutz von Arbeitnehmern": "Laws protecting employees",
  "Rassistische Gesetze, die jüdischen Deutschen ihre Bürgerrechte nahmen":
    "Racist laws that took their civil rights from Jewish Germans",
  "Die Verfassung des NS-Staates": "The constitution of the National Socialist state",
  "Die Urteile gegen NS-Verbrecher": "The judgments against National Socialist criminals",
  "Sie entrechteten jüdische Deutsche systematisch. Die Nürnberger *Prozesse* nach 1945 sind etwas völlig anderes.":
    "They stripped Jewish Germans of their rights systematically. The Nuremberg *trials* after 1945 are something else entirely.",
  "Wie viele Juden wurden im Nationalsozialismus ermordet?":
    "How many Jews were murdered under National Socialism?",
  "Etwa 600.000": "About 600,000",
  "Etwa sechs Millionen": "About six million",
  "Etwa 60.000": "About 60,000",
  "Etwa 16 Millionen": "About 16 million",
  "Etwa sechs Millionen europäische Juden. Ermordet wurden außerdem Sinti und Roma, Menschen mit Behinderung und viele andere Gruppen.":
    "About six million European Jews. Sinti and Roma, disabled people and many other groups were murdered as well.",
  "Welche Gruppen wurden im Nationalsozialismus neben den Juden verfolgt?":
    "Which groups were persecuted under National Socialism besides Jews?",
  "Nur politische Gegner": "Political opponents only",
  "Sinti und Roma, Menschen mit Behinderung, politische Gegner und weitere Gruppen":
    "Sinti and Roma, disabled people, political opponents and other groups",
  "Ausschließlich Kriegsgefangene": "Prisoners of war and nobody else",
  "Niemand sonst": "Nobody else at all",
  "Die Verfolgung traf viele Gruppen — nach rassistischen, politischen und weltanschaulichen Kriterien.":
    "The persecution reached many groups, on racist, political and ideological grounds.",
  "Was ist in Deutschland strafbar?": "What is a criminal offence in Germany?",
  "Die Regierung zu kritisieren": "Criticising the government",
  "Den Holocaust öffentlich zu leugnen": "Publicly denying the Holocaust",
  "An einer Demonstration teilzunehmen": "Taking part in a demonstration",
  "Eine Partei zu gründen": "Founding a party",
  "Holocaustleugnung ist Volksverhetzung und strafbar. Regierungskritik, Demonstrationen und Parteigründungen sind dagegen Grundrechte.":
    "Holocaust denial counts as incitement to hatred and is a criminal offence. Criticising the government, demonstrating and founding parties are basic rights.",
  "Was war das Besondere an den Nürnberger Prozessen?":
    "What was special about the Nuremberg trials?",
  "Sie fanden vor einem deutschen Gericht statt": "They took place before a German court",
  "Erstmals wurden Staatsführer persönlich für Kriegsverbrechen zur Verantwortung gezogen":
    "For the first time, heads of state were held personally to account for war crimes",
  "Alle Angeklagten wurden freigesprochen": "All the defendants were acquitted",
  "Sie führten zur Gründung der Bundesrepublik":
    "They led to the founding of the Federal Republic",
  "1945/46 klagten die Alliierten führende Nationalsozialisten an — die Geburtsstunde des modernen Völkerstrafrechts.":
    "In 1945 and 1946 the Allies put leading National Socialists on trial — the birth of modern international criminal law.",
  "Was ist am 27. Januar in Deutschland?": "What is 27 January in Germany?",
  "Der Gedenktag für die Opfer des Nationalsozialismus":
    "The day of remembrance for the victims of National Socialism",
  "Der Tag des Grundgesetzes": "The day of the Grundgesetz",
  "Am 27. Januar 1945 wurde Auschwitz befreit. Seitdem ist der Tag deutschlandweiter Gedenktag.":
    "Auschwitz was liberated on 27 January 1945. The day has been a nationwide day of remembrance ever since.",
  "Wie verhält sich Deutschland heute zu seiner NS-Vergangenheit?":
    "How does Germany deal with its National Socialist past today?",
  "Sie wird nicht mehr thematisiert": "It is no longer talked about",
  "Sie wird in Gedenkstätten, Schulen und Gedenktagen bewusst wachgehalten":
    "It is deliberately kept alive in memorials, schools and days of remembrance",
  "Sie ist nur in Fachbüchern nachzulesen": "It can be read about only in specialist books",
  "Sie darf nicht öffentlich besprochen werden": "It may not be discussed in public",
  "Erinnerungskultur ist Teil des Selbstverständnisses: Gedenkstätten, Unterricht, Gedenktage und eine besondere Verantwortung gegenüber Israel.":
    "A culture of remembrance is part of how the country understands itself: memorials, lessons, days of remembrance and a particular responsibility towards Israel.",
  "Wann wurde die Bundesrepublik Deutschland gegründet?":
    "When was the Federal Republic of Germany founded?",
  "1990": "1990",
  "1949, mit dem Inkrafttreten des Grundgesetzes am 23. Mai. Im selben Jahr entstand im Osten die DDR.":
    "1949, when the Grundgesetz came into force on 23 May. The GDR came into being in the east the same year.",
  "Wann wurde die DDR gegründet?": "When was the GDR founded?",
  "Am 7. Oktober 1949": "On 7 October 1949",
  "7. Oktober 1949, rund viereinhalb Monate nach der Bundesrepublik.":
    "7 October 1949, about four and a half months after the Federal Republic.",
  "Was war das „Wirtschaftswunder“?": "What was the \"Wirtschaftswunder\", the economic miracle?",
  "Der schnelle wirtschaftliche Aufschwung der Bundesrepublik in den 1950er Jahren":
    "The rapid economic upturn of the Federal Republic in the 1950s",
  "Die Einführung des Euro": "The introduction of the euro",
  "Der Wiederaufbau der DDR": "The rebuilding of the GDR",
  "Die Entdeckung von Rohstoffen": "The discovery of raw materials",
  "Nach der Zerstörung wuchs die westdeutsche Wirtschaft rasant; Vollbeschäftigung und steigender Wohlstand prägten das Jahrzehnt.":
    "After the destruction the West German economy grew at speed; full employment and rising prosperity shaped the decade.",
  "Warum kamen ab 1955 „Gastarbeiter“ nach Westdeutschland?":
    "Why did \"Gastarbeiter\", guest workers, come to West Germany from 1955?",
  "Weil Arbeitskräfte fehlten": "Because there were not enough workers",
  "Weil die Bevölkerung zu groß geworden war": "Because the population had grown too large",
  "Weil die DDR sie schickte": "Because the GDR sent them",
  "Weil die Alliierten es verlangten": "Because the Allies demanded it",
  "Die wachsende Wirtschaft brauchte Arbeitskräfte. Angeworben wurde in Italien, Spanien, Griechenland, der Türkei und weiteren Ländern.":
    "The growing economy needed workers. They were recruited in Italy, Spain, Greece, Turkey and other countries.",
  "Was war der Marshallplan?": "What was the Marshall Plan?",
  "Ein Plan zur Teilung Deutschlands": "A plan to divide Germany",
  "Ein amerikanisches Hilfsprogramm für den Wiederaufbau":
    "An American aid programme for reconstruction",
  "Der Plan für die Berliner Mauer": "The plan for the Berlin Wall",
  "Ein Abkommen über Reparationen": "An agreement on reparations",
  "Ab 1948 halfen die USA westeuropäischen Staaten mit Krediten und Warenlieferungen beim Wiederaufbau.":
    "From 1948 the United States helped western European states rebuild with credit and deliveries of goods.",
  "Welche Wirtschaftsordnung galt in der Bundesrepublik?":
    "What economic order applied in the Federal Republic?",
  "Die Planwirtschaft": "The planned economy",
  "Die soziale Marktwirtschaft": "The social market economy",
  "Die reine freie Marktwirtschaft ohne Regeln": "A purely free market with no rules",
  "Die Staatswirtschaft": "A state-run economy",
  "Soziale Marktwirtschaft: freier Wettbewerb, aber mit sozialem Ausgleich. Die DDR hatte dagegen Planwirtschaft.":
    "The social market economy: free competition, but with social balance. The GDR, by contrast, had a planned economy.",
  "Welche Partei bestimmte in der DDR die Politik?": "Which party set policy in the GDR?",
  "Die CDU": "The CDU",
  "Die SED": "The SED",
  "Die SPD": "The SPD",
  "Die FDP": "The FDP",
  "Die Sozialistische Einheitspartei Deutschlands hatte den Führungsanspruch. Andere Parteien existierten nur ohne echte Macht.":
    "The Socialist Unity Party of Germany claimed the leading role. Other parties existed but held no real power.",
  "Wie hieß das Parlament der DDR?": "What was the parliament of the GDR called?",
  "Volkskammer": "Volkskammer, the people's chamber",
  "Reichstag": "Reichstag, the imperial diet",
  "Die Volkskammer. Frei gewählt wurde sie erst ein einziges Mal, im März 1990.":
    "The Volkskammer. It was freely elected only once, in March 1990.",
  "Was geschah am 17. Juni 1953 in der DDR?": "What happened in the GDR on 17 June 1953?",
  "Ein Aufstand wurde mit sowjetischen Panzern niedergeschlagen":
    "An uprising was put down with Soviet tanks",
  "Die DDR wurde gegründet": "The GDR was founded",
  "Die ersten freien Wahlen fanden statt": "The first free elections were held",
  "Aus Streiks gegen höhere Arbeitsnormen wurde ein Aufstand gegen die Regierung. Bis 1990 war der 17. Juni westdeutscher Nationalfeiertag.":
    "Strikes against higher work quotas turned into a rising against the government. Until 1990 the 17th of June was the West German national holiday.",
  "Warum wurde die Berliner Mauer gebaut?": "Why was the Berlin Wall built?",
  "Um Angriffe aus dem Westen abzuwehren": "To fend off attacks from the west",
  "Um die eigene Bevölkerung an der Flucht zu hindern": "To stop its own people from leaving",
  "Um die Stadt vor Hochwasser zu schützen": "To protect the city from flooding",
  "Immer mehr Menschen verließen die DDR. Die Mauer hielt niemanden draußen, sondern die eigenen Bürger drinnen.":
    "More and more people were leaving the GDR. The Wall kept nobody out; it kept its own citizens in.",
  "Was können Betroffene heute mit ihrer Stasi-Akte tun?":
    "What can those affected do with their Stasi file today?",
  "Nichts, die Akten sind vernichtet": "Nothing; the files have been destroyed",
  "Sie können Einsicht beantragen und ihre Akte lesen":
    "They can apply for access and read their file",
  "Nur Historiker dürfen sie einsehen": "Only historians may see them",
  "Sie sind bis 2050 gesperrt": "They are sealed until 2050",
  "Wer überwacht wurde, darf die eigene Akte lesen. Die Aufarbeitung gehört zum Umgang mit der SED-Diktatur.":
    "Anyone who was spied on may read their own file. Coming to terms with the SED dictatorship includes that.",
  "Wie wurde in der DDR gewählt?": "How were elections held in the GDR?",
  "Frei zwischen mehreren Parteien": "Freely, between several parties",
  "Mit einer Einheitsliste, ohne echte Auswahl": "With a single list, and no real choice",
  "Nur in den Städten": "Only in the towns",
  "Es gab Wahlen, aber keine Alternativen: Die Einheitsliste stand fest, echte Auswahl gab es nicht.":
    "There were elections but no alternatives: the single list was fixed and there was no real choice.",
  "Welcher Ruf prägte die Montagsdemonstrationen 1989?":
    "Which chant marked the Monday demonstrations of 1989?",
  "„Freiheit für alle“": "\"Freedom for all\"",
  "„Wir sind das Volk“": "\"We are the people\"",
  "„Nie wieder Krieg“": "\"Never again war\"",
  "„Einigkeit und Recht“": "\"Unity and justice\"",
  "„Wir sind das Volk“ — wörtlich der Gedanke aus Artikel 20 des Grundgesetzes, den die DDR nur behauptete.":
    "\"We are the people\" — word for word the thought of Article 20 of the Grundgesetz, which the GDR only claimed to follow.",
  "In welcher Stadt waren die Montagsdemonstrationen 1989 besonders bedeutsam?":
    "In which city did the Monday demonstrations of 1989 matter most?",
  "Dresden": "Dresden",
  "Rostock": "Rostock",
  "Erfurt": "Erfurt",
  "In Leipzig, ausgehend von den Friedensgebeten in der Nikolaikirche, wuchsen die Demonstrationen auf Hunderttausende an.":
    "In Leipzig, starting from the peace prayers in the Nikolaikirche, the demonstrations grew to hundreds of thousands.",
  "Wer war zur Zeit der Wiedervereinigung Bundeskanzler?":
    "Who was Bundeskanzler at the time of reunification?",
  "Helmut Schmidt": "Helmut Schmidt",
  "Gerhard Schröder": "Gerhard Schröder",
  "Helmut Kohl, Bundeskanzler von 1982 bis 1998, gilt deshalb als „Kanzler der Einheit“.":
    "Helmut Kohl, Bundeskanzler from 1982 to 1998, is known for that reason as the \"chancellor of unity\".",
  "Was regelte der Zwei-plus-Vier-Vertrag?": "What did the Two Plus Four Treaty settle?",
  "Die Aufteilung Berlins in vier Sektoren": "The division of Berlin into four sectors",
  "Die volle Souveränität des vereinten Deutschlands und die Bestätigung seiner Grenzen":
    "The full sovereignty of a united Germany and the confirmation of its borders",
  "Den Beitritt zur NATO": "Joining NATO",
  "Die beiden deutschen Staaten und die vier Siegermächte einigten sich 1990 darauf — die außenpolitische Voraussetzung der Einheit.":
    "The two German states and the four victorious powers agreed on it in 1990 — the condition in foreign policy for unity.",
  "Wann zogen Bundestag und Bundesregierung nach Berlin um?":
    "When did the Bundestag and the Bundesregierung move to Berlin?",
  "2005": "2005",
  "Sie sind in Bonn geblieben": "They stayed in Bonn",
  "1999. Berlin war schon 1990 wieder Hauptstadt, der Umzug von Parlament und Regierung folgte neun Jahre später.":
    "1999. Berlin had been the capital again since 1990; the move of parliament and government followed nine years later.",
  "Wie kam die staatliche Einheit 1990 zustande?":
    "How did the unity of the state come about in 1990?",
  "Durch einen Krieg": "Through a war",
  "Durch den Beitritt der DDR zur Bundesrepublik": "Through the GDR joining the Federal Republic",
  "Durch eine Entscheidung der Vereinten Nationen": "Through a decision of the United Nations",
  "Durch eine Volksabstimmung in beiden Staaten": "Through a referendum in both states",
  "Die DDR trat der Bundesrepublik bei; das Grundgesetz galt fortan für ganz Deutschland.":
    "The GDR joined the Federal Republic; from then on the Grundgesetz applied to the whole of Germany.",
  "Wie viele Mitgliedstaaten hat die Europäische Union heute?":
    "How many member states does the European Union have today?",
  "27": "27",
  "31": "31",
  "50": "50",
  "27 — seit dem Austritt des Vereinigten Königreichs im Jahr 2020.":
    "27, since the United Kingdom left in 2020.",
  "Welche Währung galt in Deutschland vor dem Euro?":
    "Which currency was used in Germany before the euro?",
  "Der Schilling": "The schilling",
  "Die D-Mark": "The D-Mark",
  "Der Franken": "The franc",
  "Die Reichsmark": "The Reichsmark",
  "Die Deutsche Mark, eingeführt 1948 und 2002 vom Euro-Bargeld abgelöst.":
    "The Deutsche Mark, introduced in 1948 and replaced by euro cash in 2002.",
  "Was bedeutet Freizügigkeit in der EU?": "What does freedom of movement in the EU mean?",
  "Waren sind zollfrei": "Goods are free of customs duty",
  "EU-Bürger dürfen in jedem Mitgliedstaat leben und arbeiten":
    "EU citizens may live and work in any member state",
  "Man darf überall Auto fahren": "You may drive anywhere",
  "Es gibt keine Steuern zwischen den Ländern": "There are no taxes between the countries",
  "Personenfreizügigkeit: leben und arbeiten, wo man möchte — eine der Grundfreiheiten des Binnenmarktes.":
    "Free movement of people: living and working where you wish — one of the basic freedoms of the single market.",
  "Wie oft wird das Europäische Parlament gewählt?":
    "How often is the European Parliament elected?",
  "Alle fünf Jahre, direkt von den Bürgerinnen und Bürgern. Der Bundestag wird dagegen alle vier Jahre gewählt.":
    "Every five years, directly by the citizens. The Bundestag, by contrast, is elected every four years.",
  "Welche Organisation ist ein Verteidigungsbündnis?": "Which organisation is a defence alliance?",
  "Der Europarat": "The Council of Europe",
  "Die Vereinten Nationen": "The United Nations",
  "Die NATO ist das Verteidigungsbündnis. Die EU ist ein politischer und wirtschaftlicher Zusammenschluss, der Europarat kümmert sich um Menschenrechte.":
    "NATO is the defence alliance. The EU is a political and economic union, and the Council of Europe looks after human rights.",
  "Was bedeutet es, dass die Bundeswehr eine „Parlamentsarmee“ ist?":
    "What does it mean that the Bundeswehr is a \"Parlamentsarmee\", an army of parliament?",
  "Abgeordnete dienen als Soldaten": "Members of parliament serve as soldiers",
  "Über Auslandseinsätze entscheidet der Bundestag": "The Bundestag decides on deployments abroad",
  "Die Armee untersteht dem Bundespräsidenten": "The army answers to the Bundespräsident",
  "Soldaten dürfen nicht wählen": "Soldiers may not vote",
  "Kein Auslandseinsatz ohne Zustimmung des Bundestages — die Kontrolle liegt beim Parlament, nicht allein bei der Regierung.":
    "No deployment abroad without the Bundestag's consent — the control lies with parliament, not with the government alone.",
  "Wie heißt die Hauptstadt Deutschlands?": "What is the capital of Germany called?",
  "Bonn": "Bonn",
  "Hamburg": "Hamburg",
  "Berlin — seit 1990 wieder Hauptstadt, seit 1999 auch Sitz von Parlament und Regierung. Bonn war es bis dahin.":
    "Berlin — capital again since 1990, and seat of parliament and government since 1999. Bonn had been until then.",
  "Welche Stadt ist nach Berlin die zweitgrößte Deutschlands?":
    "Which is Germany's second largest city after Berlin?",
  "Köln": "Cologne",
  "Frankfurt am Main": "Frankfurt am Main",
  "Hamburg, gefolgt von München und Köln.": "Hamburg, followed by Munich and Cologne.",
  "An welche zwei Meere grenzt Deutschland?": "Which two seas does Germany border on?",
  "Nordsee und Ostsee": "The North Sea and the Baltic",
  "Nordsee und Mittelmeer": "The North Sea and the Mediterranean",
  "Ostsee und Schwarzes Meer": "The Baltic and the Black Sea",
  "Atlantik und Nordsee": "The Atlantic and the North Sea",
  "Im Nordwesten die Nordsee, im Nordosten die Ostsee.":
    "The North Sea to the north-west, the Baltic to the north-east.",
  "Welcher große deutsche Fluss fließt nach Osten ins Schwarze Meer?":
    "Which large German river flows east into the Black Sea?",
  "Die Weser": "The Weser",
  "Die Donau ist der einzige große Fluss Deutschlands, der nach Osten fließt. Rhein, Elbe und Weser münden in die Nordsee.":
    "The Danube is the only large German river that flows east. The Rhine, the Elbe and the Weser all reach the North Sea.",
  "Wie heißt das Wappentier der Bundesrepublik Deutschland?":
    "What is the heraldic animal of the Federal Republic of Germany?",
  "Der Löwe": "The lion",
  "Der Bundesadler": "The Bundesadler, the federal eagle",
  "Der Bär": "The bear",
  "Das Pferd": "The horse",
  "Der Bundesadler. Der Bär ist das Wappentier Berlins, nicht des Bundes.":
    "The Bundesadler. The bear is the heraldic animal of Berlin, not of the federation.",
  "Wie viele Menschen leben ungefähr in Deutschland?": "Roughly how many people live in Germany?",
  "Etwa 50 Millionen": "About 50 million",
  "Etwa 84 Millionen": "About 84 million",
  "Etwa 120 Millionen": "About 120 million",
  "Etwa 30 Millionen": "About 30 million",
  "Rund 84 Millionen — damit ist Deutschland der bevölkerungsreichste Staat der Europäischen Union.":
    "Around 84 million, which makes Germany the most populous state in the European Union.",
  "Welche zwei christlichen Kirchen sind in Deutschland am größten?":
    "Which two Christian churches are the largest in Germany?",
  "Die orthodoxe und die anglikanische": "The Orthodox and the Anglican",
  "Die katholische und die evangelische": "The Catholic and the Protestant",
  "Die evangelische und die orthodoxe": "The Protestant and the Orthodox",
  "Die katholische und die anglikanische": "The Catholic and the Anglican",
  "Die katholische und die evangelische Kirche. Etwa die Hälfte der Bevölkerung gehört heute gar keiner Religionsgemeinschaft an.":
    "The Catholic and the Protestant churches. About half the population today belongs to no religious community at all.",
  "Darf man in Deutschland aus der Kirche austreten?": "May you leave the church in Germany?",
  "Nein, die Mitgliedschaft ist lebenslang": "No, membership is for life",
  "Ja, jederzeit": "Yes, at any time",
  "Nur mit Zustimmung der Gemeinde": "Only with the parish's consent",
  "Nur einmal im Leben": "Only once in a lifetime",
  "Der Austritt ist jederzeit möglich; danach entfällt auch die Kirchensteuer. Religionsfreiheit schließt die Freiheit ein, keiner Religion anzugehören.":
    "You can leave at any time, and the church tax then stops. Freedom of religion includes the freedom to belong to none.",
  "Wie ist der Staat in Deutschland gegenüber Religionen eingestellt?":
    "What is the German state's attitude towards religions?",
  "Er bevorzugt die christlichen Kirchen": "It favours the Christian churches",
  "Er ist weltanschaulich neutral": "It is neutral in matters of belief",
  "Er lehnt Religion ab": "It rejects religion",
  "Er schreibt eine Staatsreligion vor": "It prescribes a state religion",
  "Weltanschauliche Neutralität: Der Staat hat keine eigene Religion und bevorzugt keine Gemeinschaft.":
    "Neutrality in matters of belief: the state has no religion of its own and favours no community.",
  "Wer zahlt Kirchensteuer?": "Who pays church tax?",
  "Alle Steuerzahler": "Every taxpayer",
  "Nur Mitglieder einer steuererhebenden Religionsgemeinschaft":
    "Only members of a religious community that levies it",
  "Nur Selbstständige": "Only the self-employed",
  "Niemand, das ist abgeschafft": "Nobody; it has been abolished",
  "Nur Mitglieder. Wer austritt oder keiner Gemeinschaft angehört, zahlt sie nicht.":
    "Only members. Anyone who leaves, or who belongs to no community, does not pay it.",
  "Was gilt für religiöse Gemeinschaften in Deutschland?":
    "What applies to religious communities in Germany?",
  "Sie dürfen eigene Gerichte mit verbindlichen Urteilen einrichten":
    "They may set up their own courts with binding judgments",
  "Sie müssen sich an die staatlichen Gesetze halten":
    "They have to abide by the laws of the state",
  "Sie stehen über dem staatlichen Recht": "They stand above the law of the state",
  "Sie brauchen eine Erlaubnis des Bundespräsidenten":
    "They need permission from the Bundespräsident",
  "Religionsausübung ist frei, aber das staatliche Recht gilt für alle. Parallele Rechtsprechung mit verbindlicher Wirkung gibt es nicht.":
    "Practising a religion is free, but the law of the state applies to everyone. There is no parallel justice with binding force.",
  "Welches Fach können Schüler wählen, die nicht am Religionsunterricht teilnehmen?":
    "Which subject can pupils choose if they do not take religious education?",
  "Ethik oder Philosophie": "Ethics or philosophy",
  "Eine zweite Fremdsprache": "A second foreign language",
  "Gar keins": "None at all",
  "Als Alternative wird meist Ethik oder Philosophie angeboten. Die Teilnahme am Religionsunterricht ist freiwillig.":
    "Ethics or philosophy is usually offered as the alternative. Taking religious education is voluntary.",
  "Ab welchem Alter darf man in Deutschland heiraten?": "From what age may you marry in Germany?",
  "Es gibt keine Altersgrenze": "There is no age limit",
  "Ab der Volljährigkeit mit 18. Ehen mit Minderjährigen werden in Deutschland nicht anerkannt.":
    "From the age of majority at 18. Marriages involving minors are not recognised in Germany.",
  "Wo wird in Deutschland rechtsgültig geheiratet?":
    "Where does a legally valid marriage take place in Germany?",
  "In der Kirche": "In church",
  "Beim Standesamt": "At the Standesamt, the registry office",
  "Beim Notar": "At a notary's",
  "Beim Familiengericht": "At the family court",
  "Nur die standesamtliche Eheschließung ist rechtsgültig. Eine religiöse Zeremonie kann hinzukommen, ersetzt sie aber nicht.":
    "Only the marriage at the Standesamt is legally valid. A religious ceremony can be added, but it does not replace it.",
  "Was gilt in Deutschland vor einer Scheidung in der Regel?":
    "What normally has to happen in Germany before a divorce?",
  "Eine Wartezeit von einem Monat": "A waiting period of one month",
  "Ein Trennungsjahr": "A year of living apart",
  "Die Zustimmung beider Familien": "The consent of both families",
  "Eine Genehmigung der Kirche": "Permission from the church",
  "Meist muss ein Trennungsjahr vergangen sein. Über die Scheidung entscheidet das Familiengericht.":
    "Usually a year of living apart must have passed. The family court decides on the divorce.",
  "Seit wann dürfen in Deutschland auch gleichgeschlechtliche Paare heiraten?":
    "Since when have same-sex couples been able to marry in Germany?",
  "Seit 2001": "Since 2001",
  "Seit 2017": "Since 2017",
  "Das ist nicht möglich": "It is not possible",
  "Seit 2017 steht die Ehe allen Paaren offen. Zuvor gab es seit 2001 die eingetragene Lebenspartnerschaft.":
    "Marriage has been open to all couples since 2017. Before that there was the registered civil partnership, from 2001.",
  "Welche Behörde hilft, wenn das Wohl eines Kindes gefährdet ist?":
    "Which authority helps when a child's welfare is at risk?",
  "Das Ordnungsamt": "The Ordnungsamt, the public order office",
  "Das Jugendamt": "The Jugendamt, the youth welfare office",
  "Das Standesamt": "The Standesamt, the registry office",
  "Das Einwohnermeldeamt": "The Einwohnermeldeamt, the residents' registration office",
  "Das Jugendamt unterstützt Familien und schützt Kinder vor Gewalt und Vernachlässigung.":
    "The Jugendamt supports families and protects children from violence and neglect.",
  "Eine Frau wird von ihrem Ehemann geschlagen. Was gilt in Deutschland?":
    "A woman is beaten by her husband. What applies in Germany?",
  "Das ist Privatsache der Familie": "That is a private matter for the family",
  "Das ist eine Straftat, und sie kann Hilfe und Schutz bekommen":
    "It is a criminal offence, and she can get help and protection",
  "Nur bei schweren Verletzungen greift der Staat ein":
    "The state steps in only if the injuries are serious",
  "Sie muss zuerst die Scheidung einreichen": "She has to file for divorce first",
  "Gewalt in der Ehe ist eine Straftat. Die Polizei kann den Täter der Wohnung verweisen; Frauenhäuser und das Hilfetelefon helfen sofort.":
    "Violence within a marriage is a criminal offence. The police can order the offender out of the home; women's refuges and the helpline give immediate help.",
  "Ab welchem Alter beginnt in Deutschland üblicherweise die Schulpflicht?":
    "At what age does compulsory schooling usually begin in Germany?",
  "Mit vier Jahren": "At four",
  "Mit sechs Jahren": "At six",
  "Mit acht Jahren": "At eight",
  "Mit zehn Jahren": "At ten",
  "In der Regel mit sechs Jahren, und sie dauert mindestens neun Schuljahre.":
    "As a rule at six, and it lasts at least nine school years.",
  "Wie lange dauert die Grundschule in den meisten Bundesländern?":
    "How long does primary school last in most states?",
  "Zwei Jahre": "Two years",
  "Meist vier Jahre; in Berlin und Brandenburg sind es sechs. Auch das ist Ländersache.":
    "Usually four years; in Berlin and Brandenburg it is six. That too is a matter for the states.",
  "Was ist BAföG?": "What is BAföG?",
  "Eine Prüfung am Ende der Schule": "An examination at the end of school",
  "Eine staatliche Unterstützung für Schüler und Studierende":
    "State support for pupils and students",
  "Ein Zuschuss für Auszubildende vom Betrieb": "A subsidy for apprentices from the firm",
  "Eine Gebühr für das Studium": "A fee for studying",
  "Staatliche Ausbildungsförderung für alle, deren Eltern die Ausbildung nicht finanzieren können.":
    "State support for education for everyone whose parents cannot pay for it.",
  "Wer nimmt am Ende einer dualen Ausbildung die Abschlussprüfung ab?":
    "Who sets the final examination at the end of a dual apprenticeship?",
  "Die Berufsschule allein": "The vocational school alone",
  "Die Industrie- und Handelskammer oder die Handwerkskammer":
    "The chamber of industry and commerce or the chamber of crafts",
  "Das Kultusministerium": "The state education ministry",
  "Der Ausbildungsbetrieb selbst": "The training firm itself",
  "Die Kammern prüfen — deshalb ist der Abschluss bundesweit vergleichbar und nicht vom einzelnen Betrieb abhängig.":
    "The chambers set the examination, which is why the qualification is comparable across the country and does not depend on the individual firm.",
  "Du hast im Ausland einen Beruf erlernt. Was kannst du in Deutschland tun?":
    "You trained for a job abroad. What can you do in Germany?",
  "Nichts, der Abschluss gilt hier nicht": "Nothing; the qualification does not count here",
  "Du kannst deinen Abschluss anerkennen lassen": "You can have your qualification recognised",
  "Du musst die Ausbildung komplett wiederholen": "You have to do the whole training again",
  "Du darfst nur als Hilfskraft arbeiten": "You may only work as an assistant",
  "Es gibt ein Anerkennungsverfahren. Gerade in Pflege, Handwerk und technischen Berufen ist es der Schlüssel zum Arbeitsmarkt.":
    "There is a recognition procedure. In care work, the trades and technical jobs especially, it is the key to the labour market.",
  "Ab wann haben Kinder in Deutschland einen Anspruch auf einen Kita-Platz?":
    "From when do children in Germany have a right to a nursery place?",
  "Ab der Geburt": "From birth",
  "Ab dem ersten Geburtstag": "From their first birthday",
  "Ab drei Jahren": "From the age of three",
  "Es gibt keinen Anspruch": "There is no such right",
  "Ab dem vollendeten ersten Lebensjahr besteht ein Rechtsanspruch auf einen Betreuungsplatz.":
    "From a child's first birthday there is a legal right to a childcare place.",
  "Wie viele Urlaubstage stehen bei einer Fünf-Tage-Woche mindestens zu?":
    "How many days of holiday are the minimum on a five-day week?",
  "10 Tage": "10 days",
  "20 Tage": "20 days",
  "30 Tage": "30 days",
  "Es gibt kein Minimum": "There is no minimum",
  "Das gesetzliche Minimum sind 20 Arbeitstage im Jahr. Viele Verträge und Tarifverträge geben mehr.":
    "The statutory minimum is 20 working days a year. Many contracts and collective agreements give more.",
  "In welcher Form muss eine Kündigung erfolgen?":
    "In what form does a notice of termination have to be given?",
  "Mündlich genügt": "Spoken is enough",
  "Schriftlich": "In writing",
  "Per E-Mail": "By email",
  "Per Telefonanruf": "By telephone call",
  "Nur schriftlich mit eigenhändiger Unterschrift. Eine mündliche Kündigung oder eine E-Mail ist unwirksam.":
    "Only in writing, signed by hand. A spoken notice or an email has no effect.",
  "Was ist Schwarzarbeit?": "What is Schwarzarbeit, undeclared work?",
  "Arbeit in der Nachtschicht": "Work on the night shift",
  "Arbeit ohne Anmeldung und ohne Sozialabgaben":
    "Work that is not registered and pays no social contributions",
  "Arbeit im Ausland": "Work abroad",
  "Ehrenamtliche Arbeit": "Voluntary work",
  "Sie ist strafbar — und wer so arbeitet, hat weder Kranken- noch Rentenversicherung noch Kündigungsschutz.":
    "It is a criminal offence, and anyone working that way has no health insurance, no pension insurance and no protection against dismissal.",
  "Was ist ein Tarifvertrag?": "What is a Tarifvertrag, a collective agreement?",
  "Ein Vertrag zwischen Arbeitnehmer und Arbeitgeber":
    "A contract between an employee and an employer",
  "Eine Vereinbarung zwischen Gewerkschaft und Arbeitgeberseite über Löhne und Arbeitsbedingungen":
    "An agreement between a union and the employers' side on pay and working conditions",
  "Der Vertrag über die Sozialversicherung": "The contract covering social insurance",
  "Ein Vertrag über Stromtarife": "A contract about electricity tariffs",
  "Gewerkschaften und Arbeitgeberverbände handeln ihn kollektiv aus. Der einzelne Arbeitsvertrag steht davon getrennt.":
    "Unions and employers' associations negotiate it collectively. The individual contract of employment stands apart from it.",
  "Darf ein Arbeitgeber jemandem kündigen, weil er sich an einem Streik beteiligt hat?":
    "May an employer dismiss someone for taking part in a strike?",
  "Nein, das Streikrecht ist geschützt": "No, the right to strike is protected",
  "Nur bei längeren Streiks": "Only for longer strikes",
  "Nur in kleinen Betrieben": "Only in small firms",
  "Wer sich an einem gewerkschaftlich getragenen Streik beteiligt, darf dafür nicht gekündigt werden.":
    "Anyone taking part in a strike called by a union may not be dismissed for it.",
  "Was bleibt vom Bruttolohn nach Abzug von Steuern und Sozialabgaben?":
    "What is left of the gross wage after tax and social contributions?",
  "Der Tariflohn": "The collectively agreed wage",
  "Der Nettolohn": "The net wage",
  "Der Mindestlohn": "The minimum wage",
  "Der Grundlohn": "The basic wage",
  "Das Netto ist der Betrag, der auf dem Konto ankommt. Brutto ist der Lohn vor allen Abzügen.":
    "The net figure is the amount that reaches the account. Gross is the wage before any deductions.",
  "Was gehört in Deutschland in die Biotonne?":
    "What goes into the Biotonne, the food and garden waste bin, in Germany?",
  "Verpackungen aus Plastik": "Plastic packaging",
  "Küchen- und Gartenabfälle": "Kitchen and garden waste",
  "Altpapier": "Waste paper",
  "Glasflaschen": "Glass bottles",
  "Mülltrennung ist Pflicht: Bioabfall, Papier, Verpackungen, Restmüll und Glas nach Farben getrennt.":
    "Separating rubbish is compulsory: food waste, paper, packaging, residual waste, and glass sorted by colour.",
  "Was ist Pfand?": "What is Pfand, a deposit?",
  "Eine Steuer auf Getränke": "A tax on drinks",
  "Ein Betrag, den man beim Kauf zahlt und bei Rückgabe der Flasche zurückbekommt":
    "An amount you pay when you buy and get back when you return the bottle",
  "Die Gebühr für die Mülltonne": "The charge for the rubbish bin",
  "Ein Rabatt beim Einkauf": "A discount when shopping",
  "Auf viele Flaschen und Dosen wird Pfand erhoben. Bei der Rückgabe im Laden bekommt man das Geld zurück.":
    "A deposit is charged on many bottles and cans. You get the money back when you return them to the shop.",
  "Darf ein Vermieter die Wohnung betreten, wann er möchte?":
    "May a landlord enter the flat whenever they like?",
  "Ja, ihm gehört die Wohnung": "Yes, they own the flat",
  "Nein, nur nach Ankündigung und mit einem berechtigten Grund":
    "No, only after giving notice and with a legitimate reason",
  "Ja, wenn er einen Schlüssel hat": "Yes, if they have a key",
  "Nur zusammen mit der Polizei": "Only together with the police",
  "Die Wohnung ist geschützt. Ohne Ankündigung und triftigen Grund darf auch der Eigentümer nicht hinein.":
    "The home is protected. Without notice and a good reason, even the owner may not go in.",
  "Wann musst du ein Ticket für Bus oder Bahn haben?":
    "When do you need a ticket for the bus or the train?",
  "Erst wenn kontrolliert wird": "Only when there is an inspection",
  "Vor dem Einsteigen": "Before boarding",
  "Am Ende der Fahrt": "At the end of the journey",
  "Nur zu Stoßzeiten": "Only at peak times",
  "Das gültige Ticket braucht man vor dem Einsteigen. Fahren ohne Fahrschein kostet ein erhöhtes Beförderungsentgelt.":
    "You need a valid ticket before you board. Travelling without one costs an increased fare.",
  "Welche Behörde ist für Aufenthaltstitel und Einbürgerung zuständig?":
    "Which authority handles residence permits and naturalisation?",
  "Die Ausländerbehörde": "The Ausländerbehörde, the immigration office",
  "Die Agentur für Arbeit": "The Agentur für Arbeit, the employment agency",
  "Die Ausländerbehörde. Das Bürgeramt macht die Meldung, das Finanzamt die Steuer, das Standesamt Heirat und Geburt.":
    "The Ausländerbehörde. The Bürgeramt handles registration, the Finanzamt tax, and the Standesamt marriage and birth.",
  "Was solltest du tun, bevor du einen Miet- oder Handyvertrag unterschreibst?":
    "What should you do before you sign a tenancy or mobile phone contract?",
  "Sofort unterschreiben, um das Angebot zu sichern": "Sign at once to secure the offer",
  "Ihn lesen und bei Unklarheiten nachfragen oder dich beraten lassen":
    "Read it and, if anything is unclear, ask or get advice",
  "Nur den Preis prüfen": "Check the price and nothing else",
  "Ihn von einem Nachbarn unterschreiben lassen": "Have a neighbour sign it",
  "Eine Unterschrift bindet. Die Verbraucherzentrale und Mietervereine beraten günstig, wenn etwas unklar ist.":
    "A signature binds you. The consumer advice centre and tenants' associations give cheap advice when something is unclear.",
  "Welche Nummer wählst du in Deutschland, wenn du die Polizei brauchst?":
    "Which number do you dial in Germany if you need the police?",
  "911": "911",
  "110 für die Polizei, 112 für Notarzt und Feuerwehr. Beide sind kostenlos.":
    "110 for the police, 112 for the ambulance and the fire brigade. Both are free.",
  "Wer ist in Deutschland krankenversichert?": "Who has health insurance in Germany?",
  "Nur Berufstätige": "Only people in work",
  "Alle Menschen — die Krankenversicherung ist Pflicht":
    "Everyone — health insurance is compulsory",
  "Nur wer sich freiwillig versichert": "Only those who insure themselves voluntarily",
  "Versicherungspflicht für alle: gesetzlich oder privat, aber niemand bleibt ohne Versicherung.":
    "Insurance is compulsory for everyone, statutory or private, but nobody is left uninsured.",
  "Welche Versicherung zahlt Schäden, die du anderen zufügst?":
    "Which insurance pays for damage you cause to others?",
  "Die Hausratversicherung": "Contents insurance",
  "Die Haftpflichtversicherung": "Personal liability insurance",
  "Die private Haftpflicht ist freiwillig, aber dringend zu empfehlen — sie deckt Schäden an fremdem Eigentum und an Personen.":
    "Private liability insurance is voluntary but strongly advisable: it covers damage to other people's property and injury to people.",
  "Welche Versicherung ist für jedes Auto gesetzlich vorgeschrieben?":
    "Which insurance is required by law for every car?",
  "Die Vollkaskoversicherung": "Fully comprehensive insurance",
  "Die Kfz-Haftpflichtversicherung": "Motor third-party liability insurance",
  "Die Rechtsschutzversicherung": "Legal expenses insurance",
  "Ohne Kfz-Haftpflicht darf kein Fahrzeug bewegt werden. Kasko ist dagegen freiwillig.":
    "No vehicle may be driven without third-party liability cover. Comprehensive cover, by contrast, is voluntary.",
  "An wen wendest du dich außerhalb der Sprechzeiten bei einem Problem, das kein Notfall ist?":
    "Who do you turn to outside surgery hours for something that is not an emergency?",
  "An die 110": "To 110",
  "An den ärztlichen Bereitschaftsdienst unter 116117":
    "To the out-of-hours medical service on 116117",
  "An das Gesundheitsamt": "To the public health office",
  "An die Krankenkasse": "To the health insurer",
  "116117 ist der ärztliche Bereitschaftsdienst. Die 112 bleibt echten Notfällen vorbehalten.":
    "116117 is the out-of-hours medical service. 112 stays reserved for real emergencies.",
  "Was musst du beim Arztbesuch dabeihaben?":
    "What do you have to bring to a doctor's appointment?",
  "Den Personalausweis": "Your identity card",
  "Die Gesundheitskarte der Krankenkasse": "The health insurance card",
  "Den Arbeitsvertrag": "Your contract of employment",
  "Die Steuernummer": "Your tax number",
  "Ohne Gesundheitskarte kann die Praxis die Behandlung nicht abrechnen — dann musst du unter Umständen selbst zahlen.":
    "Without the health insurance card the surgery cannot bill for the treatment, and you may have to pay yourself.",
  "An welchen Tagen ist in Deutschland Weihnachten gesetzlicher Feiertag?":
    "On which days is Christmas a public holiday in Germany?",
  "Am 24. und 25. Dezember": "On 24 and 25 December",
  "Am 25. und 26. Dezember": "On 25 and 26 December",
  "Nur am 24. Dezember": "Only on 24 December",
  "Vom 24. bis 31. Dezember": "From 24 to 31 December",
  "Der 25. und 26. Dezember sind gesetzliche Feiertage. Heiligabend am 24. ist ein normaler Arbeitstag, meist mit verkürzten Zeiten.":
    "25 and 26 December are public holidays. Christmas Eve on the 24th is an ordinary working day, usually with shortened hours.",
  "Wie finanziert sich der öffentlich-rechtliche Rundfunk in Deutschland?":
    "How is public service broadcasting funded in Germany?",
  "Aus Steuern": "Out of taxes",
  "Über den Rundfunkbeitrag der Haushalte": "Through the Rundfunkbeitrag paid by households",
  "Allein durch Werbung": "By advertising alone",
  "Durch Spenden": "By donations",
  "Jeder Haushalt zahlt den Rundfunkbeitrag. Diese Finanzierung soll ARD und ZDF unabhängig von Regierung und Werbekunden halten.":
    "Every household pays the Rundfunkbeitrag. That way of funding is meant to keep ARD and ZDF independent of government and advertisers.",
  "Welcher deutsche Dichter schrieb den „Faust“?": "Which German poet wrote \"Faust\"?",
  "Heinrich Heine": "Heinrich Heine",
  "Goethe. Schiller schrieb unter anderem „Wilhelm Tell“ und „Die Räuber“.":
    "Goethe. Schiller wrote \"William Tell\" and \"The Robbers\", among others.",
  "Wofür ist Johannes Gutenberg bekannt?": "What is Johannes Gutenberg known for?",
  "Für die Entdeckung der Radioaktivität": "For discovering radioactivity",
  "Für den Buchdruck mit beweglichen Lettern": "For printing with movable type",
  "Für den Bau des ersten Automobils": "For building the first motor car",
  "Für die Relativitätstheorie": "For the theory of relativity",
  "Gutenberg druckte im 15. Jahrhundert mit beweglichen Lettern. Carl Benz baute das Auto, Einstein entwickelte die Relativitätstheorie.":
    "Gutenberg printed with movable type in the fifteenth century. Carl Benz built the car, and Einstein worked out the theory of relativity.",
  "Was ist ein Ehrenamt?": "What is an Ehrenamt, a voluntary post?",
  "Ein besonders gut bezahltes Amt": "A particularly well paid post",
  "Eine freiwillige, unbezahlte Tätigkeit für die Allgemeinheit":
    "Voluntary, unpaid work for the common good",
  "Ein politisches Wahlamt": "An elected political office",
  "Ein Ehrentitel für Verdienste": "An honorary title for services rendered",
  "Millionen Menschen engagieren sich unbezahlt in Vereinen, bei der Feuerwehr oder in der Nachbarschaftshilfe.":
    "Millions of people give unpaid time to clubs, the fire brigade or helping their neighbours.",
  "In welcher Stadt findet das Oktoberfest statt?":
    "In which city does the Oktoberfest take place?",
  "In Köln": "In Cologne",
  "In München": "In Munich",
  "In Stuttgart": "In Stuttgart",
  "In Berlin": "In Berlin",
  "In München. Karneval wird dagegen vor allem im Rheinland gefeiert, etwa in Köln und Düsseldorf.":
    "In Munich. Carnival, by contrast, is celebrated above all in the Rhineland, in Cologne and Düsseldorf for instance.",
  "Für wen gelten die Grundrechte in Deutschland?": "Who do the basic rights apply to in Germany?",
  "Für alle Menschen in Deutschland, einige Rechte allerdings nur für Deutsche":
    "To everyone in Germany, though some rights only to Germans",
  "Nur für Erwachsene": "Only to adults",
  "Nur für Menschen mit einem Aufenthaltstitel": "Only to people with a residence permit",
  "Die Menschenwürde und die meisten Grundrechte gelten für jeden. Einige wenige — etwa das Wahlrecht zum Bundestag — sind an die deutsche Staatsangehörigkeit gebunden.":
    "Human dignity and most of the basic rights apply to everyone. A few — the right to vote in Bundestag elections, for instance — are tied to German nationality.",
  "Was bedeutet die Versammlungsfreiheit?": "What does freedom of assembly mean?",
  "Man darf sich überall aufhalten": "You may be anywhere you like",
  "Man darf sich friedlich und ohne Waffen versammeln, auch zu Demonstrationen":
    "You may assemble peacefully and unarmed, demonstrations included",
  "Man darf jederzeit Straßen blockieren": "You may block roads at any time",
  "Man darf nur mit Genehmigung der Polizei demonstrieren":
    "You may demonstrate only with the permission of the police",
  "Artikel 8 schützt friedliche Versammlungen. Unter freiem Himmel muss eine Demonstration angemeldet, aber nicht genehmigt werden.":
    "Article 8 protects peaceful assemblies. In the open air a demonstration has to be notified, but not permitted.",
  "Was schützt Artikel 13 des Grundgesetzes?": "What does Article 13 of the Grundgesetz protect?",
  "Das Eigentum": "Property",
  "Die Unverletzlichkeit der Wohnung": "The inviolability of the home",
  "Das Briefgeheimnis": "The privacy of correspondence",
  "Die Berufsfreiheit": "Freedom to choose an occupation",
  "Die Wohnung ist geschützt: Durchsuchungen brauchen in der Regel eine richterliche Anordnung.":
    "The home is protected: as a rule a search needs an order from a judge.",
  "Darf der Staat in Deutschland eine Zeitung verbieten, weil sie ihn kritisiert?":
    "May the state in Germany ban a newspaper for criticising it?",
  "Ja, bei scharfer Kritik": "Yes, if the criticism is sharp",
  "Nein, es gilt die Pressefreiheit und eine Zensur findet nicht statt":
    "No; freedom of the press applies and there is no censorship",
  "Nur mit Zustimmung des Bundeskanzlers": "Only with the Bundeskanzler's consent",
  "Artikel 5 verbietet die Zensur ausdrücklich. Kritik an der Regierung ist die Aufgabe freier Presse, nicht ihr Vergehen.":
    "Article 5 forbids censorship in so many words. Criticising the government is the job of a free press, not its offence.",
  "Wer darf in Deutschland ein Gesetz für verfassungswidrig erklären?":
    "Who in Germany may declare a law unconstitutional?",
  "Der Bundestag mit einfacher Mehrheit": "The Bundestag, by simple majority",
  "Nur das Bundesverfassungsgericht. Der Bundespräsident prüft beim Unterschreiben lediglich, ob ein Gesetz ordnungsgemäß zustande gekommen ist.":
    "Only the Bundesverfassungsgericht. When signing, the Bundespräsident checks no more than whether a law came about in the proper way.",
  "Was bedeutet es, dass die Grundrechte den Staat binden?":
    "What does it mean that the basic rights bind the state?",
  "Der Staat muss alle Bürger finanziell unterstützen":
    "The state has to support every citizen financially",
  "Gesetzgebung, Verwaltung und Gerichte müssen die Grundrechte beachten":
    "Legislation, administration and the courts all have to observe the basic rights",
  "Nur die Polizei muss sich daran halten": "Only the police have to keep to them",
  "Die Grundrechte gelten ausschließlich zwischen Privatpersonen":
    "The basic rights apply only between private individuals",
  "Artikel 1 Absatz 3: Die Grundrechte binden alle drei Gewalten unmittelbar. Sie sind kein Programmsatz, sondern geltendes Recht.":
    "Article 1 paragraph 3: the basic rights bind all three powers directly. They are not a statement of intent but law in force.",
  "Was gehört NICHT zu den Grundrechten?": "Which of these is NOT one of the basic rights?",
  "Die Glaubensfreiheit": "Freedom of belief",
  "Das Recht auf einen kostenlosen Führerschein": "The right to a free driving licence",
  "Die Freiheit der Person": "Liberty of the person",
  "Einen Anspruch auf einen kostenlosen Führerschein gibt es nicht. Glaube, Beruf und persönliche Freiheit sind dagegen Grundrechte.":
    "There is no right to a free driving licence. Belief, occupation and personal liberty, by contrast, are basic rights.",
  "Wie lange hast du Zeit für den Einbürgerungstest?":
    "How long do you have for the Einbürgerungstest?",
  "30 Minuten": "30 minutes",
  "60 Minuten": "60 minutes",
  "90 Minuten": "90 minutes",
  "Es gibt kein Zeitlimit": "There is no time limit",
  "60 Minuten für 33 Fragen — knapp zwei Minuten pro Frage, also genug Zeit zum Nachdenken.":
    "60 minutes for 33 questions — not quite two minutes each, so enough time to think.",
  "Wer kontrolliert in Deutschland die Regierung?":
    "Who holds the government to account in Germany?",
  "Das Parlament, die Gerichte, die Presse und die Wähler":
    "Parliament, the courts, the press and the voters",
  "Nur die Polizei": "Only the police",
  "Mehrere Instanzen zugleich: der Bundestag durch Anfragen und Ausschüsse, die Gerichte durch Urteile, die Presse durch Öffentlichkeit und die Wähler durch die nächste Wahl.":
    "Several at once: the Bundestag through questions and committees, the courts through judgments, the press through publicity and the voters through the next election.",
  "Was ist mit „Volkssouveränität“ gemeint?":
    "What is meant by \"Volkssouveränität\", the sovereignty of the people?",
  "Das Volk kann jederzeit Gesetze aufheben": "The people can repeal laws at any time",
  "Alle Staatsgewalt geht vom Volk aus": "All state authority derives from the people",
  "Das Volk verwaltet die Steuern selbst": "The people administer the taxes themselves",
  "Jeder darf selbst entscheiden, welche Gesetze für ihn gelten":
    "Everyone decides for themselves which laws apply to them",
  "Artikel 20: Die Macht kommt vom Volk und wird durch Wahlen und die drei Gewalten ausgeübt — nicht durch Einzelentscheidungen jedes Bürgers.":
    "Article 20: power comes from the people and is exercised through elections and the three powers — not through each citizen's own decisions.",
  "Was ist eine Diktatur?": "What is a dictatorship?",
  "Ein Staat mit vielen Parteien": "A state with many parties",
  "Ein Staat, in dem eine Person oder Gruppe ohne Kontrolle herrscht":
    "A state in which one person or group rules unchecked",
  "Ein Staat mit einem Königshaus": "A state with a royal house",
  "Ein Staat ohne Steuern": "A state without taxes",
  "Kennzeichen sind fehlende freie Wahlen, keine Gewaltenteilung, keine unabhängigen Gerichte und keine Meinungsfreiheit.":
    "The marks of one are no free elections, no separation of powers, no independent courts and no freedom of expression.",
  "Welcher Grundsatz macht Deutschland zu einem Rechtsstaat?":
    "Which principle makes Germany a Rechtsstaat?",
  "Staatliches Handeln ist an Gesetz und Recht gebunden und gerichtlich überprüfbar":
    "What the state does is bound by law and can be reviewed in court",
  "Gerichte entscheiden nach eigenem Ermessen": "The courts decide as they see fit",
  "Entscheidend ist die Überprüfbarkeit: Gegen jede staatliche Entscheidung kann man vor Gericht ziehen.":
    "What matters is that it can be reviewed: any decision the state makes can be taken to court.",
  "Was passiert, wenn eine Partei die freiheitliche demokratische Grundordnung beseitigen will?":
    "What happens if a party wants to do away with the free democratic order?",
  "Nichts, das ist von der Meinungsfreiheit gedeckt": "Nothing; freedom of expression covers it",
  "Das Bundesverfassungsgericht kann sie verbieten": "The Bundesverfassungsgericht can ban it",
  "Der Bundeskanzler löst sie auf": "The Bundeskanzler dissolves it",
  "Sie verliert automatisch ihre Zulassung": "It automatically loses its registration",
  "Ein Parteiverbot ist möglich, aber ausschließlich durch das Bundesverfassungsgericht — damit keine Regierung ihre Gegner ausschalten kann.":
    "Banning a party is possible, but only through the Bundesverfassungsgericht — so that no government can remove its opponents.",
  "Wer schreibt in Deutschland die Gesetze?": "Who writes the laws in Germany?",
  "Die Gerichte": "The courts",
  "Bundestag und Bundesrat": "The Bundestag and the Bundesrat",
  "Die Gesetzgebung liegt bei Bundestag und Bundesrat. Gerichte wenden Gesetze an, sie machen sie nicht.":
    "Legislation lies with the Bundestag and the Bundesrat. Courts apply laws; they do not make them.",
  "Was bedeutet „Republik“?": "What does \"republic\" mean?",
  "Das Staatsoberhaupt wird gewählt und regiert nicht auf Lebenszeit":
    "The head of state is elected and does not rule for life",
  "Es gibt mehrere Bundesländer": "There are several states",
  "Der Staat erhebt keine Steuern": "The state levies no taxes",
  "Die Kirche ist vom Staat getrennt": "Church and state are separate",
  "In einer Republik gibt es keinen Monarchen; das Staatsoberhaupt wird auf Zeit gewählt.":
    "In a republic there is no monarch; the head of state is elected for a fixed term.",
  "Warum ist die Unabhängigkeit der Gerichte für die Gewaltenteilung wichtig?":
    "Why does the separation of powers depend on the independence of the courts?",
  "Damit Urteile schneller gefällt werden": "So that judgments come faster",
  "Damit Gerichte auch gegen die Regierung entscheiden können":
    "So that courts can decide against the government as well",
  "Damit Richter mehr verdienen": "So that judges earn more",
  "Damit weniger Gesetze nötig sind": "So that fewer laws are needed",
  "Eine Justiz, die von der Regierung abhängt, kann sie nicht kontrollieren. Genau deshalb sind Richter nur dem Gesetz unterworfen.":
    "A judiciary that depends on the government cannot hold it to account. That is exactly why judges are subject to the law alone.",
  "Wo hat der Deutsche Bundestag seinen Sitz?": "Where does the German Bundestag sit?",
  "In Bonn": "In Bonn",
  "In Frankfurt am Main": "In Frankfurt am Main",
  "Im Reichstagsgebäude in Berlin. Bonn war bis 1999 Regierungssitz und ist heute Bundesstadt.":
    "In the Reichstag building in Berlin. Bonn was the seat of government until 1999 and is a federal city today.",
  "Was ist die Aufgabe der Opposition im Bundestag?":
    "What is the opposition's task in the Bundestag?",
  "Die Regierung zu unterstützen": "To support the government",
  "Die Regierung zu kontrollieren und Alternativen vorzuschlagen":
    "To hold the government to account and put forward alternatives",
  "Die Gesetze auszuführen": "To carry the laws out",
  "Die Wahlen zu organisieren": "To organise the elections",
  "Kontrolle und Alternative — deshalb hat die Opposition eigene Rechte, etwa beim Einsetzen von Untersuchungsausschüssen.":
    "Scrutiny and alternative — which is why the opposition has rights of its own, such as setting up committees of inquiry.",
  "Wer leitet die Sitzungen des Bundestages?": "Who chairs the sittings of the Bundestag?",
  "Der älteste Abgeordnete": "The oldest member",
  "Der Bundestagspräsident führt die Sitzungen und wahrt die Ordnung des Hauses. Protokollarisch steht er an zweiter Stelle im Staat.":
    "The president of the Bundestag chairs the sittings and keeps order in the house. In matters of protocol they rank second in the state.",
  "Wann muss der Bundesrat einem Gesetz zwingend zustimmen?":
    "When must the Bundesrat give its consent to a law?",
  "Bei jedem Gesetz": "For every law",
  "Bei Zustimmungsgesetzen, etwa wenn Interessen der Länder berührt sind":
    "For laws requiring consent, such as when the states' interests are touched",
  "Nur bei Verfassungsänderungen": "Only for changes to the constitution",
  "Nie, er kann nur Empfehlungen abgeben": "Never; it can only make recommendations",
  "Zustimmungsgesetze brauchen sein Ja. Bei Einspruchsgesetzen kann der Bundestag einen Einspruch überstimmen.":
    "Laws requiring consent need its yes. Where a law is only open to objection, the Bundestag can outvote that objection.",
  "Was ist der Vermittlungsausschuss?":
    "What is the Vermittlungsausschuss, the mediation committee?",
  "Ein Gericht für Streit zwischen Parteien": "A court for disputes between parties",
  "Ein gemeinsames Gremium von Bundestag und Bundesrat, das bei Uneinigkeit einen Kompromiss sucht":
    "A joint body of the Bundestag and the Bundesrat that looks for a compromise when they disagree",
  "Ein Ausschuss zur Vermittlung von Arbeitsplätzen": "A committee that finds people jobs",
  "Der Ausschuss, der den Kanzler vorschlägt": "The committee that proposes the chancellor",
  "Wenn sich Bundestag und Bundesrat über ein Gesetz nicht einig werden, sucht dieser Ausschuss einen gemeinsamen Vorschlag.":
    "When the Bundestag and the Bundesrat cannot agree on a law, this committee looks for a proposal both can take.",
  "Was bedeutet das freie Mandat eines Abgeordneten?": "What does a member's free mandate mean?",
  "Er muss immer so stimmen, wie seine Partei es beschließt":
    "They must always vote the way their party decides",
  "Er ist nur seinem Gewissen verpflichtet und an Weisungen nicht gebunden":
    "They answer to their conscience alone and are bound by no instructions",
  "Er darf beliebig oft fehlen": "They may be absent as often as they like",
  "Er braucht keine Wahl": "They need no election",
  "Artikel 38: Abgeordnete sind Vertreter des ganzen Volkes und an Aufträge nicht gebunden — auch nicht an die der eigenen Fraktion.":
    "Article 38: members represent the whole people and are bound by no instructions — not even by their own Fraktion's.",
  "Wie oft muss ein Gesetzentwurf im Bundestag beraten werden?":
    "How many times must a bill be debated in the Bundestag?",
  "Einmal": "Once",
  "In der Regel in drei Lesungen": "As a rule in three readings",
  "Fünfmal": "Five times",
  "So oft die Regierung es wünscht": "As often as the government wishes",
  "Drei Lesungen, dazwischen die Arbeit in den Fachausschüssen — damit ein Gesetz nicht im Vorbeigehen beschlossen wird.":
    "Three readings, with the work of the specialist committees in between, so that no law is passed in passing.",
  "Wer beschließt über die Einnahmen und Ausgaben des Bundes?":
    "Who decides the federation's income and spending?",
  "Der Bundesfinanzminister allein": "The federal finance minister alone",
  "Der Bundestag mit dem Haushaltsgesetz": "The Bundestag, through the budget act",
  "Die Bundesbank": "The Bundesbank",
  "Das Budgetrecht liegt beim Parlament. Die Regierung schlägt den Haushalt vor, beschließen muss ihn der Bundestag.":
    "The Budgetrecht lies with parliament. The government proposes the budget; the Bundestag has to pass it.",
  "Wo hat der Bundespräsident seinen Amtssitz?":
    "Where is the Bundespräsident's official residence?",
  "Im Kanzleramt": "In the chancellery",
  "Im Schloss Bellevue": "In Schloss Bellevue",
  "Im Reichstagsgebäude": "In the Reichstag building",
  "In der Villa Hammerschmidt in Bonn": "In the Villa Hammerschmidt in Bonn",
  "Schloss Bellevue in Berlin. Die Villa Hammerschmidt in Bonn ist der zweite Amtssitz.":
    "Schloss Bellevue in Berlin. The Villa Hammerschmidt in Bonn is the second official residence.",
  "Wer ernennt und entlässt die Bundesminister?":
    "Who appoints and dismisses the federal ministers?",
  "Der Bundespräsident auf Vorschlag des Bundeskanzlers":
    "The Bundespräsident, on the Bundeskanzler's proposal",
  "Die Partei des Kanzlers": "The chancellor's party",
  "Der Kanzler schlägt vor, der Bundespräsident vollzieht. Beides gehört zusammen und wird gern zu einem Schritt verkürzt.":
    "The chancellor proposes and the Bundespräsident carries it out. The two belong together and are often shortened into one step.",
  "Was ist das Ressortprinzip?": "What is the Ressortprinzip, the departmental principle?",
  "Jeder Minister leitet sein Ministerium eigenständig":
    "Each minister runs their ministry independently",
  "Der Kanzler entscheidet alles allein": "The chancellor decides everything alone",
  "Die Ministerien wechseln jedes Jahr": "The ministries change every year",
  "Jedes Bundesland bekommt ein Ministerium": "Every state gets a ministry",
  "Innerhalb der Richtlinien des Kanzlers führt jeder Minister sein Haus selbstständig und in eigener Verantwortung.":
    "Within the chancellor's guidelines each minister runs their own ministry independently and on their own responsibility.",
  "Was ist eine Koalition?": "What is a coalition?",
  "Ein Bündnis mehrerer Parteien, die gemeinsam regieren":
    "An alliance of several parties that govern together",
  "Ein Zusammenschluss von Bundesländern": "A union of states",
  "Ein Vertrag mit anderen Staaten": "A treaty with other countries",
  "Die Verbindung von Regierung und Gerichten": "The joining of government and courts",
  "Weil eine Partei selten allein die Mehrheit hat, schließen sich mehrere zusammen und einigen sich auf einen Koalitionsvertrag.":
    "Because one party rarely holds the majority alone, several join together and agree a coalition treaty.",
  "Welche Aufgabe hat der Bundespräsident bei einem neuen Gesetz?":
    "What is the Bundespräsident's part in a new law?",
  "Er schreibt den Gesetzentwurf": "They write the bill",
  "Er fertigt das Gesetz aus und prüft dabei, ob es verfassungsgemäß zustande gekommen ist":
    "They sign the law into force, checking as they do so that it came about in the proper constitutional way",
  "Er stimmt im Bundestag mit ab": "They vote in the Bundestag",
  "Er kann jedes Gesetz nach Belieben ablehnen": "They can reject any law at will",
  "Er unterschreibt und prüft dabei das ordnungsgemäße Zustandekommen — eine politische Bewertung steht ihm nicht zu.":
    "They sign, and in doing so check that it came about properly — a political judgment is not theirs to make.",
  "Wie nennt man die gemeinsame Sitzung von Kanzler und Ministern?":
    "What is the joint meeting of the chancellor and the ministers called?",
  "Kabinettssitzung": "A cabinet meeting",
  "Plenarsitzung": "A plenary sitting",
  "Bundesratssitzung": "A sitting of the Bundesrat",
  "Kanzler und Minister bilden das Kabinett; dort werden Gesetzentwürfe und Regierungsvorhaben beschlossen.":
    "The chancellor and the ministers make up the cabinet; that is where bills and government plans are agreed.",
  "Wer vertritt Deutschland völkerrechtlich nach außen?":
    "Who represents Germany abroad under international law?",
  "Der Außenminister allein": "The foreign minister alone",
  "Das Staatsoberhaupt vertritt Deutschland nach außen, etwa beim Empfang von Botschaftern. Die tägliche Außenpolitik macht die Regierung.":
    "The head of state represents Germany abroad, receiving ambassadors for instance. Day-to-day foreign policy is the government's work.",
  "Was gilt für die Amtszeit des Bundeskanzlers?":
    "What applies to the Bundeskanzler's term of office?",
  "Höchstens zwei Amtszeiten": "Two terms at most",
  "Es gibt keine Begrenzung der Amtszeiten": "There is no limit on the number of terms",
  "Höchstens acht Jahre": "Eight years at most",
  "Höchstens eine Amtszeit": "One term at most",
  "Anders als beim Bundespräsidenten gibt es keine Obergrenze — Helmut Kohl und Angela Merkel amtierten je sechzehn Jahre.":
    "Unlike the Bundespräsident, there is no upper limit — Helmut Kohl and Angela Merkel each held office for sixteen years.",
  "Was bekommst du vor einer Wahl per Post zugeschickt?":
    "What is sent to you by post before an election?",
  "Den Stimmzettel": "The ballot paper",
  "Die Wahlbenachrichtigung": "The polling card",
  "Eine Liste aller Kandidaten mit Adressen": "A list of all the candidates with their addresses",
  "Nichts": "Nothing",
  "Die Wahlbenachrichtigung nennt Wahllokal und Öffnungszeiten. Den Stimmzettel bekommst du erst im Wahllokal.":
    "The polling card names the polling station and its hours. You get the ballot paper only at the polling station.",
  "Was ist die Briefwahl?": "What is a postal vote?",
  "Eine Wahl, bei der man dem Kandidaten schreibt":
    "An election in which you write to the candidate",
  "Die Möglichkeit, vorab per Post zu wählen statt im Wahllokal":
    "The chance to vote in advance by post instead of at the polling station",
  "Eine Wahl nur für Auslandsdeutsche": "An election only for Germans living abroad",
  "Eine Wahl per E-Mail": "An election by email",
  "Wer am Wahltag verhindert ist, kann die Unterlagen vorher anfordern und per Post wählen. Ein Grund muss nicht angegeben werden.":
    "Anyone who cannot make it on polling day can ask for the papers beforehand and vote by post. No reason has to be given.",
  "Was ist ein Wahlkreis?": "What is a constituency?",
  "Ein Bundesland": "A state",
  "Ein regional abgegrenztes Gebiet, in dem ein Kandidat direkt gewählt wird":
    "A defined local area in which one candidate is elected directly",
  "Der Kreis der Wahlberechtigten einer Partei": "The circle of a party's eligible voters",
  "Ein Raum im Wahllokal": "A room in the polling station",
  "Mit der Erststimme wird in jedem Wahlkreis eine Person direkt gewählt.":
    "The Erststimme elects one person directly in each constituency.",
  "Was passiert mit den Zweitstimmen einer Partei, die unter fünf Prozent bleibt?":
    "What happens to the Zweitstimmen of a party that stays below five per cent?",
  "Sie werden auf die anderen Parteien verteilt und die Partei zieht nicht ein":
    "They go to the other parties and the party does not enter parliament",
  "Sie werden für die nächste Wahl aufgehoben": "They are kept for the next election",
  "Die Partei bekommt trotzdem Sitze": "The party gets seats anyway",
  "Die Wahl wird wiederholt": "The election is held again",
  "Die Partei bleibt draußen; die Sitze verteilen sich unter denen, die die Hürde geschafft haben. Ausnahme: mehrere direkt gewonnene Wahlkreise.":
    "The party stays out; the seats are shared among those that cleared the threshold. The exception is winning several constituencies outright.",
  "Wie finanzieren sich Parteien in Deutschland überwiegend?":
    "How are parties in Germany mostly funded?",
  "Ausschließlich durch den Staat": "By the state alone",
  "Durch Mitgliedsbeiträge, Spenden und staatliche Teilfinanzierung":
    "By membership fees, donations and partial funding from the state",
  "Ausschließlich durch Spenden von Unternehmen": "By company donations alone",
  "Durch Eintrittsgelder bei Veranstaltungen": "By charging admission to events",
  "Drei Quellen zusammen. Großspenden müssen veröffentlicht werden, damit Einfluss nachvollziehbar bleibt.":
    "Three sources together. Large donations have to be published, so that influence can be traced.",
  "Wer darf in Deutschland eine Partei gründen?": "Who may found a party in Germany?",
  "Nur der Bundestag": "Only the Bundestag",
  "Grundsätzlich jeder — die Parteigründung ist frei":
    "Anyone, in principle — founding a party is free",
  "Nur wer schon Abgeordneter ist": "Only someone who is already a member of parliament",
  "Nur mit Genehmigung des Bundespräsidenten": "Only with the Bundespräsident's permission",
  "Artikel 21: Die Gründung von Parteien ist frei. Verboten werden kann eine Partei nur vom Bundesverfassungsgericht.":
    "Article 21: parties may be founded freely. Only the Bundesverfassungsgericht can ban one.",
  "Was passiert mit deinem Stimmzettel, wenn du ihn falsch ausfüllst?":
    "What happens to your ballot paper if you fill it in wrongly?",
  "Er wird trotzdem gezählt": "It is counted anyway",
  "Er ist ungültig und zählt für keine Partei": "It is invalid and counts for no party",
  "Du darfst noch einmal wählen": "You may vote again",
  "Die Wahlhelfer korrigieren ihn": "The polling staff correct it",
  "Ein ungültiger Stimmzettel zählt für niemanden. Wer sich verschreibt, kann im Wahllokal aber einen neuen verlangen.":
    "An invalid ballot paper counts for nobody. Anyone who makes a mistake can ask for a new one at the polling station.",
  "Warum gibt es in Deutschland keine Volksabstimmungen auf Bundesebene über einzelne Gesetze?":
    "Why are there no national referendums on individual laws in Germany?",
  "Weil das Grundgesetz die Entscheidungen dem gewählten Parlament überträgt":
    "Because the Grundgesetz gives the decisions to the elected parliament",
  "Weil es zu teuer wäre": "Because it would be too expensive",
  "Weil die EU es verbietet": "Because the EU forbids it",
  "Weil es keine Wahllokale gibt": "Because there are no polling stations",
  "Das Grundgesetz sieht auf Bundesebene die repräsentative Demokratie vor. In den Ländern und Gemeinden gibt es dagegen Volks- und Bürgerentscheide.":
    "At federal level the Grundgesetz provides for representative democracy. In the states and municipalities, by contrast, there are referendums and local ballots.",
  "Wie heißt die Hauptstadt von Bayern?": "What is the capital of Bavaria?",
  "Nürnberg": "Nuremberg",
  "Augsburg": "Augsburg",
  "Regensburg": "Regensburg",
  "München. Nürnberg und Augsburg sind große bayerische Städte, aber nicht die Landeshauptstadt.":
    "Munich. Nuremberg and Augsburg are large Bavarian cities, but not the state capital.",
  "Welches Bundesland ist flächenmäßig das größte?": "Which state is the largest by area?",
  "Nordrhein-Westfalen": "North Rhine-Westphalia",
  "Bayern": "Bavaria",
  "Niedersachsen": "Lower Saxony",
  "Baden-Württemberg": "Baden-Württemberg",
  "Bayern ist das flächengrößte Land, Nordrhein-Westfalen das bevölkerungsreichste.":
    "Bavaria is the largest state by area, North Rhine-Westphalia the most populous.",
  "Wer wählt den Ministerpräsidenten eines Bundeslandes?":
    "Who elects the Ministerpräsident of a state?",
  "Die Bürger direkt": "The citizens, directly",
  "Der Landtag": "The Landtag",
  "Das Landesparlament wählt ihn — wie der Bundestag den Kanzler. Direkt gewählt wird er nirgends.":
    "The state parliament elects them, just as the Bundestag elects the chancellor. Nowhere are they elected directly.",
  "Was gilt, wenn Bundesrecht und Landesrecht sich widersprechen?":
    "What applies when federal law and state law contradict each other?",
  "Das Landesrecht gilt": "State law applies",
  "Bundesrecht bricht Landesrecht": "Federal law overrides state law",
  "Das ältere Gesetz gilt": "The older law applies",
  "Ein Gericht entscheidet jedes Mal neu": "A court decides afresh each time",
  "Artikel 31 des Grundgesetzes: Bundesrecht bricht Landesrecht.":
    "Article 31 of the Grundgesetz: federal law overrides state law.",
  "Welche fünf Länder werden als „neue Bundesländer“ bezeichnet?":
    "Which five states are called the \"neue Bundesländer\", the new states?",
  "Die fünf kleinsten Länder": "The five smallest states",
  "Die Länder, die 1990 auf dem Gebiet der DDR entstanden":
    "The states that came into being on the territory of the GDR in 1990",
  "Die Länder mit den jüngsten Landesverfassungen": "The states with the newest constitutions",
  "Die fünf Länder mit Küstenzugang": "The five states with a coastline",
  "Brandenburg, Mecklenburg-Vorpommern, Sachsen, Sachsen-Anhalt und Thüringen — 1990 wiedergegründet.":
    "Brandenburg, Mecklenburg-Vorpommern, Saxony, Saxony-Anhalt and Thuringia, refounded in 1990.",
  "Wer leitet die Verwaltung einer Stadt oder Gemeinde?":
    "Who runs the administration of a town or municipality?",
  "Der Ministerpräsident": "The Ministerpräsident",
  "Der Bürgermeister": "The mayor",
  "Der Landrat des Kreises": "The district administrator",
  "Der Innenminister": "The interior minister",
  "Der Bürgermeister, meist direkt von den Bürgern gewählt. Der Landrat steht dem Landkreis vor.":
    "The mayor, usually elected directly by the citizens. The Landrat heads the rural district.",
  "In welchem Bundesland liegt die Stadt Dresden?": "Which state is the city of Dresden in?",
  "Thüringen": "Thuringia",
  "Sachsen": "Saxony",
  "Brandenburg": "Brandenburg",
  "Sachsen-Anhalt": "Saxony-Anhalt",
  "Dresden ist die Landeshauptstadt von Sachsen. Erfurt gehört zu Thüringen, Magdeburg zu Sachsen-Anhalt.":
    "Dresden is the capital of Saxony. Erfurt belongs to Thuringia, Magdeburg to Saxony-Anhalt.",
  "Woher bekommen Gemeinden hauptsächlich ihr Geld?":
    "Where do municipalities mainly get their money?",
  "Ausschließlich aus Spenden": "From donations alone",
  "Aus eigenen Steuern, Gebühren und Zuweisungen von Land und Bund":
    "From their own taxes, from fees and from allocations by the state and the federation",
  "Nur aus der Einkommensteuer ihrer Einwohner": "Only from their residents' income tax",
  "Sie dürfen kein eigenes Geld einnehmen": "They may not raise money of their own",
  "Gewerbe- und Grundsteuer, Gebühren für Leistungen und Zuweisungen der höheren Ebenen — ein Mischsystem.":
    "Trade tax and land tax, fees for services and allocations from the higher levels — a mixed system.",
  "Was ist ein Schöffe?": "What is a Schöffe, a lay judge?",
  "Ein Anwalt der Staatsanwaltschaft": "A lawyer for the prosecution",
  "Ein ehrenamtlicher Richter ohne juristische Ausbildung":
    "A volunteer judge without legal training",
  "Ein Protokollführer bei Gericht": "A clerk who keeps the record in court",
  "Ein Gefängnisaufseher": "A prison officer",
  "Bürger wirken als Schöffen an Strafurteilen mit und haben in der Hauptverhandlung dasselbe Stimmrecht wie Berufsrichter.":
    "Citizens sit as Schöffen on criminal verdicts and have the same vote in the main hearing as professional judges.",
  "Welches Gericht ist für Streit über eine Rente zuständig?":
    "Which court deals with a dispute about a pension?",
  "Das Arbeitsgericht": "The labour court",
  "Das Sozialgericht": "The social court",
  "Das Finanzgericht": "The tax court",
  "Das Amtsgericht": "The local court",
  "Sozialgerichte entscheiden über Rente, Krankenversicherung und Bürgergeld.":
    "Social courts decide on pensions, health insurance and Bürgergeld.",
  "Was bedeutet „rechtskräftig“?": "What does \"rechtskräftig\", final and binding, mean?",
  "Das Urteil wurde verkündet": "The judgment has been pronounced",
  "Das Urteil ist endgültig und kann nicht mehr mit normalen Rechtsmitteln angefochten werden":
    "The judgment is final and can no longer be challenged by the ordinary remedies",
  "Der Angeklagte hat gestanden": "The defendant has confessed",
  "Das Urteil wurde von der Regierung bestätigt":
    "The judgment has been confirmed by the government",
  "Erst mit der Rechtskraft steht ein Urteil endgültig fest — bis dahin gilt die Unschuldsvermutung weiter.":
    "Only when it becomes final does a judgment stand for good — until then the presumption of innocence still holds.",
  "Ein Vermieter kündigt dir und du hältst das für unrechtmäßig. Was kannst du tun?":
    "A landlord gives you notice and you think it is unlawful. What can you do?",
  "Nichts, der Vermieter entscheidet": "Nothing; the landlord decides",
  "Der Kündigung widersprechen und notfalls vor dem Amtsgericht klagen":
    "Object to the notice and, if need be, go to the local court",
  "Die Wohnung sofort räumen": "Move out at once",
  "Die Polizei rufen": "Call the police",
  "Mietstreitigkeiten gehören vor die ordentlichen Gerichte, in erster Instanz meist das Amtsgericht. Mietervereine beraten vorab.":
    "Tenancy disputes belong before the ordinary courts, at first instance usually the local court. Tenants' associations advise beforehand.",
  "Was ist der Unterschied zwischen Zivilrecht und Strafrecht?":
    "What is the difference between civil law and criminal law?",
  "Zivilrecht gilt nur für Zivilisten": "Civil law applies only to civilians",
  "Zivilrecht regelt Streit zwischen Privaten, Strafrecht die Verfolgung von Straftaten durch den Staat":
    "Civil law settles disputes between private parties, criminal law the state's prosecution of offences",
  "Strafrecht gilt nur für Ausländer": "Criminal law applies only to foreigners",
  "Es gibt keinen Unterschied": "There is no difference",
  "Im Zivilprozess streiten zwei Parteien, im Strafverfahren klagt der Staat durch die Staatsanwaltschaft an.":
    "In a civil case two parties are in dispute; in a criminal case the state brings the charge through the public prosecutor.",
  "Wer ermittelt bei einer Straftat?": "Who investigates a criminal offence?",
  "Das Gericht": "The court",
  "Polizei und Staatsanwaltschaft": "The police and the public prosecutor's office",
  "Die Staatsanwaltschaft leitet das Ermittlungsverfahren, die Polizei führt es durch. Das Gericht kommt erst danach.":
    "The public prosecutor's office directs the investigation and the police carry it out. The court comes only afterwards.",
  "Was ist eine Berufung?": "What is an appeal?",
  "Der Beruf des Angeklagten": "The defendant's occupation",
  "Ein Rechtsmittel, mit dem ein Urteil von einem höheren Gericht überprüft wird":
    "A remedy by which a judgment is reviewed by a higher court",
  "Die Ernennung eines Richters": "The appointment of a judge",
  "Die Vorladung zum Gericht": "The summons to court",
  "Wer mit einem Urteil nicht einverstanden ist, kann es in der nächsten Instanz überprüfen lassen.":
    "Anyone who disagrees with a judgment can have it reviewed at the next instance.",
  "Was passiert, wenn jemand kein Geld für einen Anwalt hat?":
    "What happens if someone has no money for a lawyer?",
  "Er muss sich selbst verteidigen": "They have to defend themselves",
  "Er kann Beratungs- oder Prozesskostenhilfe beantragen":
    "They can apply for advice aid or legal aid",
  "Das Verfahren wird eingestellt": "The proceedings are dropped",
  "Er verliert automatisch": "They lose automatically",
  "Der Zugang zum Recht darf nicht am Einkommen scheitern — dafür gibt es Beratungshilfe, Prozesskostenhilfe und Pflichtverteidigung.":
    "Access to justice must not fail on income — hence advice aid, legal aid and the assigned defence lawyer.",
  "Wer zahlt die Beiträge zur gesetzlichen Rentenversicherung?":
    "Who pays the contributions to the statutory pension insurance?",
  "Nur der Arbeitnehmer": "The employee alone",
  "Arbeitnehmer und Arbeitgeber je zur Hälfte": "The employee and the employer, half each",
  "Nur der Arbeitgeber": "The employer alone",
  "Der Staat": "The state",
  "Wie bei Kranken-, Pflege- und Arbeitslosenversicherung teilen sich beide Seiten den Beitrag.":
    "As with health, long-term care and unemployment insurance, the two sides share the contribution.",
  "Was ist das Umlageverfahren in der Rentenversicherung?":
    "What is the pay-as-you-go system in the pension insurance?",
  "Jeder spart sein eigenes Geld an": "Everyone saves up their own money",
  "Die heutigen Beitragszahler finanzieren die heutigen Renten":
    "Today's contributors pay for today's pensions",
  "Der Staat legt das Geld an der Börse an": "The state invests the money on the stock market",
  "Die Renten kommen aus der Mehrwertsteuer": "The pensions come out of value added tax",
  "Ein Generationenvertrag: Wer heute arbeitet, zahlt die Renten von heute und erwirbt damit einen eigenen Anspruch für später.":
    "A contract between the generations: whoever works today pays today's pensions and earns a claim of their own for later.",
  "Wer hilft bei der Suche nach Arbeit und zahlt Arbeitslosengeld?":
    "Who helps with looking for work and pays Arbeitslosengeld?",
  "Das Jobcenter und die Agentur für Arbeit": "The job centre and the Agentur für Arbeit",
  "Die Agentur für Arbeit zahlt Arbeitslosengeld, das Jobcenter betreut Bürgergeld-Empfänger.":
    "The Agentur für Arbeit pays Arbeitslosengeld; the job centre looks after those on Bürgergeld.",
  "Wofür ist die Berufsgenossenschaft zuständig?":
    "What is the Berufsgenossenschaft responsible for?",
  "Für die Rente": "For pensions",
  "Für die gesetzliche Unfallversicherung bei Arbeitsunfällen und Berufskrankheiten":
    "For the statutory accident insurance covering accidents at work and occupational illness",
  "Für die Arbeitsvermittlung": "For finding people work",
  "Für Tarifverhandlungen": "For collective bargaining",
  "Die Berufsgenossenschaften sind die Träger der Unfallversicherung — bezahlt allein vom Arbeitgeber.":
    "The Berufsgenossenschaften carry the accident insurance, and the employer alone pays for it.",
  "Was ist das Ziel des Bürgergeldes?": "What is Bürgergeld for?",
  "Ein Zuschuss für Besserverdienende": "A subsidy for higher earners",
  "Die Grundsicherung des Lebensunterhalts für Erwerbsfähige ohne ausreichendes Einkommen":
    "Basic support for people able to work who have too little income",
  "Eine zusätzliche Rente": "An extra pension",
  "Ein Darlehen für Selbstständige": "A loan for the self-employed",
  "Es sichert das Existenzminimum und unterstützt zugleich den Weg zurück in Arbeit.":
    "It secures the minimum needed to live and at the same time supports the way back into work.",
  "Wie lange kann Elterngeld in der Grundvariante höchstens bezogen werden?":
    "How long can Elterngeld be drawn for at most in the basic form?",
  "3 Monate": "3 months",
  "14 Monate zwischen beiden Elternteilen": "14 months between the two parents",
  "24 Monate": "24 months",
  "36 Monate": "36 months",
  "Bis zu 14 Monate, wenn sich beide Elternteile die Zeit teilen; ein Elternteil allein kann höchstens 12 Monate beziehen.":
    "Up to 14 months if both parents share the time; one parent alone can draw it for at most 12.",
  "Was ist der Unterschied zwischen Brutto und Netto?":
    "What is the difference between gross and net?",
  "Brutto ist der Lohn vor Abzügen, Netto der Betrag nach Steuern und Sozialabgaben":
    "Gross is the wage before deductions, net the amount after tax and social contributions",
  "Netto ist der Lohn vor Abzügen": "Net is the wage before deductions",
  "Brutto gilt nur für Selbstständige": "Gross applies only to the self-employed",
  "Es ist dasselbe": "They are the same thing",
  "Vom Brutto gehen Lohnsteuer und Sozialabgaben ab; das Netto landet auf dem Konto.":
    "Wage tax and social contributions come off the gross; the net figure lands in the account.",
  "Was bedeutet Versicherungspflicht in der Krankenversicherung?":
    "What does compulsory health insurance mean?",
  "Jeder darf sich freiwillig versichern": "Anyone may insure themselves voluntarily",
  "Jede Person in Deutschland muss krankenversichert sein — gesetzlich oder privat":
    "Everyone in Germany has to have health insurance, statutory or private",
  "Nur Arbeitnehmer müssen versichert sein": "Only employees have to be insured",
  "Nur wer krank ist, muss sich versichern": "Only people who are ill have to insure themselves",
  "Seit 2009 gilt die allgemeine Versicherungspflicht. Niemand soll ohne Absicherung dastehen.":
    "Insurance has been compulsory for everyone since 2009. Nobody is to be left without cover.",
  "Wie hieß das Parlament im Deutschen Kaiserreich?":
    "What was the parliament of the German Empire called?",
  "Der Reichstag wurde gewählt, konnte die Regierung aber nicht stürzen — der Kanzler war dem Kaiser verantwortlich.":
    "The Reichstag was elected but could not bring the government down: the chancellor answered to the emperor.",
  "Wann begann der Erste Weltkrieg?": "When did the First World War begin?",
  "1919": "1919",
  "1914, und er endete 1918 mit der deutschen Niederlage.":
    "1914, and it ended in 1918 with the German defeat.",
  "Wer war der erste Reichspräsident der Weimarer Republik?":
    "Who was the first Reichspräsident of the Weimar Republic?",
  "Paul von Hindenburg": "Paul von Hindenburg",
  "Gustav Stresemann": "Gustav Stresemann",
  "Friedrich Ebert ab 1919. Hindenburg folgte 1925 und ernannte 1933 Hitler zum Reichskanzler.":
    "Friedrich Ebert, from 1919. Hindenburg followed in 1925 and made Hitler Reichskanzler in 1933.",
  "Welche Farben hatte die Flagge der Weimarer Republik?":
    "What colours did the flag of the Weimar Republic have?",
  "Schwarz-Weiß-Rot": "Black, white and red",
  "Schwarz-Rot-Gold": "Black, red and gold",
  "Schwarz-Rot-Weiß": "Black, red and white",
  "Blau-Weiß-Rot": "Blue, white and red",
  "Schwarz-Rot-Gold, wie heute — im Kaiserreich war es Schwarz-Weiß-Rot. Um die Farben wurde in Weimar erbittert gestritten.":
    "Black, red and gold, as today; under the empire it was black, white and red. The colours were fought over bitterly in Weimar.",
  "Was war der Reichstagsbrand von 1933 für die Nationalsozialisten?":
    "What was the Reichstag fire of 1933 for the National Socialists?",
  "Ein Grund, Grundrechte per Notverordnung außer Kraft zu setzen":
    "A reason to suspend basic rights by emergency decree",
  "Ein Anlass für Neuwahlen zum Kaiser": "An occasion for fresh elections for an emperor",
  "Der Beginn des Zweiten Weltkriegs": "The start of the Second World War",
  "Das Ende ihrer Herrschaft": "The end of their rule",
  "Unmittelbar danach wurden zentrale Grundrechte aufgehoben — ein entscheidender Schritt zur Diktatur.":
    "Immediately afterwards central basic rights were lifted — a decisive step towards dictatorship.",
  "Was geschah am 9. November 1918?": "What happened on 9 November 1918?",
  "Der Kaiser dankte ab und die Republik wurde ausgerufen":
    "The emperor abdicated and the republic was proclaimed",
  "Der Erste Weltkrieg begann": "The First World War began",
  "Die Weimarer Verfassung trat in Kraft": "The Weimar constitution came into force",
  "Das Ende der Monarchie. Der 9. November trägt in der deutschen Geschichte gleich mehrere schwere Daten.":
    "The end of the monarchy. In German history the 9th of November carries several heavy dates at once.",
  "Wie viele Jahre bestand die Weimarer Republik ungefähr?":
    "Roughly how many years did the Weimar Republic last?",
  "Etwa 5 Jahre": "About 5 years",
  "Etwa 14 Jahre": "About 14 years",
  "Etwa 30 Jahre": "About 30 years",
  "Etwa 50 Jahre": "About 50 years",
  "Von 1919 bis 1933, also rund vierzehn Jahre — die erste deutsche Demokratie.":
    "From 1919 to 1933, so about fourteen years — the first German democracy.",
  "Welche Rolle spielte Artikel 48 der Weimarer Verfassung?":
    "What part did Article 48 of the Weimar constitution play?",
  "Er sicherte das Frauenwahlrecht": "It secured votes for women",
  "Er erlaubte dem Reichspräsidenten, mit Notverordnungen am Parlament vorbei zu regieren":
    "It let the Reichspräsident govern past parliament by emergency decree",
  "Er regelte die Steuern": "It settled taxation",
  "Er verbot politische Parteien": "It banned political parties",
  "Das Notverordnungsrecht wurde ab 1930 zur Regel statt zur Ausnahme und höhlte das Parlament aus — deshalb kennt das Grundgesetz nichts Vergleichbares.":
    "From 1930 the emergency decree became the rule instead of the exception and hollowed parliament out — which is why the Grundgesetz has nothing like it.",
  "Wie viele Parteien waren im NS-Staat ab Sommer 1933 zugelassen?":
    "How many parties were permitted in the National Socialist state from the summer of 1933?",
  "Keine": "None",
  "Nur eine": "Only one",
  "Zwei": "Two",
  "Alle wie vorher": "All of them, as before",
  "Nur die NSDAP. Alle anderen wurden verboten oder lösten sich auf.":
    "Only the NSDAP. All the others were banned or dissolved themselves.",
  "Was bedeutet „Gleichschaltung“?":
    "What does \"Gleichschaltung\", bringing everything into line, mean?",
  "Die Angleichung der Löhne": "Levelling out wages",
  "Die Unterwerfung von Verwaltung, Verbänden und Medien unter die NSDAP":
    "Subjecting administration, associations and the media to the NSDAP",
  "Die Vereinheitlichung der Stromnetze": "Standardising the electricity grids",
  "Die Gleichstellung von Mann und Frau": "Equality between men and women",
  "Innerhalb weniger Monate wurde jede eigenständige Organisation entweder verboten oder auf Linie gebracht.":
    "Within a few months every independent organisation was either banned or brought into line.",
  "Was waren Konzentrationslager?": "What were concentration camps?",
  "Schulungszentren der Partei": "Training centres of the party",
  "Lager, in denen politische Gegner und verfolgte Gruppen eingesperrt, misshandelt und ermordet wurden":
    "Camps where political opponents and persecuted groups were imprisoned, ill-treated and murdered",
  "Ferienlager für Jugendliche": "Holiday camps for young people",
  "Kasernen der Wehrmacht": "Barracks of the Wehrmacht",
  "Schon 1933 eingerichtet, zunächst für politische Gegner. Später wurden sie Teil des Systems der Massenvernichtung.":
    "Set up as early as 1933, at first for political opponents. Later they became part of the machinery of mass murder.",
  "Wer war Sophie Scholl?": "Who was Sophie Scholl?",
  "Eine Ministerin der Weimarer Republik": "A minister in the Weimar Republic",
  "Eine Studentin der Widerstandsgruppe Weiße Rose, 1943 hingerichtet":
    "A student in the White Rose resistance group, executed in 1943",
  "Die erste Bundeskanzlerin": "The first woman to be Bundeskanzler",
  "Eine Widerstandskämpferin des 20. Juli 1944": "A member of the resistance of 20 July 1944",
  "Sie verteilte mit ihrem Bruder Hans in München Flugblätter gegen das Regime. Der 20. Juli war der militärische Widerstand um Stauffenberg.":
    "With her brother Hans she handed out leaflets against the regime in Munich. The 20th of July was the resistance in the military around Stauffenberg.",
  "Welches Land überfiel Deutschland am 1. September 1939?":
    "Which country did Germany invade on 1 September 1939?",
  "Frankreich": "France",
  "Polen": "Poland",
  "Die Sowjetunion": "The Soviet Union",
  "Österreich": "Austria",
  "Der Überfall auf Polen löste den Zweiten Weltkrieg aus. Der Angriff auf die Sowjetunion folgte 1941.":
    "The invasion of Poland set off the Second World War. The attack on the Soviet Union followed in 1941.",
  "Was ist am 8. Mai 1945 geschehen?": "What happened on 8 May 1945?",
  "Der Krieg in Europa endete mit der bedingungslosen Kapitulation":
    "The war in Europe ended with the unconditional surrender",
  "Die Bundesrepublik wurde gegründet": "The Federal Republic was founded",
  "Der Krieg begann": "The war began",
  "Das Kriegsende in Europa. Heute ist der 8. Mai ein Tag des Gedenkens und der Befreiung.":
    "The end of the war in Europe. Today the 8th of May is a day of remembrance and of liberation.",
  "Durften Menschen im NS-Staat frei ihre Meinung sagen?":
    "Could people say what they thought freely in the National Socialist state?",
  "Ja, uneingeschränkt": "Yes, without any limit",
  "Nein, Kritik konnte Verfolgung, Haft oder den Tod bedeuten":
    "No; criticism could mean persecution, imprisonment or death",
  "Ja, aber nur schriftlich": "Yes, but only in writing",
  "Nur Parteimitglieder durften kritisieren": "Only party members were allowed to criticise",
  "Presse und Rundfunk waren gleichgeschaltet, abweichende Meinungen wurden verfolgt.":
    "Press and broadcasting were brought into line, and dissenting opinions were persecuted.",
  "Warum ist das Ermächtigungsgesetz von 1933 so bedeutsam?":
    "Why does the Ermächtigungsgesetz of 1933 matter so much?",
  "Es führte die Todesstrafe ein": "It introduced the death penalty",
  "Es übertrug der Regierung die Gesetzgebung und beseitigte damit die Gewaltenteilung":
    "It handed legislation to the government and with it did away with the separation of powers",
  "Es verbot die Kirchen": "It banned the churches",
  "Es beendete den Ersten Weltkrieg": "It ended the First World War",
  "Von da an konnte die Regierung Gesetze ohne das Parlament erlassen — die entscheidende Weichenstellung zur Diktatur.":
    "From then on the government could pass laws without parliament — the decisive turn towards dictatorship.",
  "Was ist der Holocaust?": "What is the Holocaust?",
  "Eine Hungersnot im Ersten Weltkrieg": "A famine in the First World War",
  "Der staatlich organisierte Massenmord an den europäischen Juden":
    "The mass murder of the European Jews organised by the state",
  "Ein Luftangriff auf deutsche Städte": "An air raid on German cities",
  "Die Vertreibung nach 1945": "The expulsions after 1945",
  "Etwa sechs Millionen Juden wurden ermordet. Der hebräische Begriff dafür ist Schoah.":
    "About six million Jews were murdered. The Hebrew word for it is Shoah.",
  "Wo befand sich das größte nationalsozialistische Vernichtungslager?":
    "Where was the largest National Socialist extermination camp?",
  "Dachau": "Dachau",
  "Auschwitz": "Auschwitz",
  "Bergen-Belsen": "Bergen-Belsen",
  "Buchenwald": "Buchenwald",
  "Auschwitz im besetzten Polen. Dachau, Buchenwald und Bergen-Belsen waren Konzentrationslager auf deutschem Boden.":
    "Auschwitz, in occupied Poland. Dachau, Buchenwald and Bergen-Belsen were concentration camps on German soil.",
  "Was steht in Berlin als zentrales Mahnmal für die ermordeten Juden Europas?":
    "What stands in Berlin as the central memorial to the murdered Jews of Europe?",
  "Das Brandenburger Tor": "The Brandenburg Gate",
  "Das Denkmal für die ermordeten Juden Europas mit seinen Stelen":
    "The Memorial to the Murdered Jews of Europe, with its stelae",
  "Die Siegessäule": "The Victory Column",
  "Der Reichstag": "The Reichstag",
  "Das Stelenfeld nahe dem Brandenburger Tor, eröffnet 2005.":
    "The field of stelae near the Brandenburg Gate, opened in 2005.",
  "Was sind Stolpersteine?": "What are Stolpersteine, stumbling stones?",
  "Hindernisse auf Gehwegen": "Obstacles on the pavement",
  "Kleine Gedenktafeln im Boden vor den letzten frei gewählten Wohnorten von NS-Opfern":
    "Small memorial plaques set in the ground outside the last freely chosen homes of victims of National Socialism",
  "Grenzsteine zwischen Bundesländern": "Boundary stones between the states",
  "Steine aus zerstörten Synagogen": "Stones from destroyed synagogues",
  "Messingtafeln im Pflaster, die Namen und Schicksal einzelner Opfer nennen — inzwischen über 100.000 in ganz Europa.":
    "Brass plaques in the pavement giving the name and fate of individual victims — by now more than 100,000 across Europe.",
  "Welche Folge hat die NS-Vergangenheit für die deutsche Außenpolitik?":
    "What does the National Socialist past mean for German foreign policy?",
  "Deutschland hält sich aus allem heraus": "Germany keeps out of everything",
  "Eine besondere Verantwortung gegenüber Israel und für den Schutz von Menschenrechten":
    "A particular responsibility towards Israel and for the protection of human rights",
  "Deutschland darf keine Verträge schließen": "Germany may not conclude treaties",
  "Deutschland ist von der UNO ausgeschlossen": "Germany is excluded from the UN",
  "Aus der Geschichte folgt eine dauerhafte Verpflichtung — gegenüber Israel, gegenüber jüdischem Leben in Deutschland und für Menschenrechte allgemein.":
    "From that history follows a lasting obligation — towards Israel, towards Jewish life in Germany and for human rights in general.",
  "Was ist Antisemitismus?": "What is antisemitism?",
  "Ablehnung aller Religionen": "Rejection of all religions",
  "Feindschaft und Hass gegen Juden": "Hostility and hatred towards Jews",
  "Kritik an einer Regierung": "Criticism of a government",
  "Eine politische Partei": "A political party",
  "Judenfeindschaft in ihren verschiedenen Formen. In Deutschland wird sie strafrechtlich und gesellschaftlich entschieden bekämpft.":
    "Hostility to Jews in its various forms. In Germany it is fought firmly, in the criminal law and in society.",
  "Ist es in Deutschland erlaubt, Hakenkreuze öffentlich zu zeigen?":
    "Is it allowed in Germany to display swastikas in public?",
  "Ja, das ist Kunstfreiheit": "Yes, that is freedom of art",
  "Nein, das Verwenden von Kennzeichen verfassungswidriger Organisationen ist strafbar":
    "No; using the symbols of unconstitutional organisations is a criminal offence",
  "Ja, auf Kleidung": "Yes, on clothing",
  "Nur bei Demonstrationen": "Only at demonstrations",
  "Strafbar nach § 86a StGB. Ausnahmen gelten nur für Bildung, Kunst und Wissenschaft in eindeutig ablehnendem Zusammenhang.":
    "A criminal offence under section 86a of the criminal code. Exceptions apply only to education, art and scholarship in a clearly disapproving context.",
  "Was bedeutet „Erinnerungskultur“?":
    "What does \"Erinnerungskultur\", a culture of remembrance, mean?",
  "Das Sammeln alter Gegenstände": "Collecting old objects",
  "Der bewusste gesellschaftliche Umgang mit der eigenen Geschichte, besonders mit der NS-Zeit":
    "A society's deliberate way of dealing with its own history, above all with the National Socialist years",
  "Der Geschichtsunterricht an Universitäten": "The teaching of history at universities",
  "Das Feiern von Jahrestagen": "Celebrating anniversaries",
  "Gedenkstätten, Gedenktage, Unterricht und Forschung zusammen — die Vergangenheit wird nicht abgeschlossen, sondern wachgehalten.":
    "Memorials, days of remembrance, lessons and research together — the past is not closed off but kept awake.",
  "Welche Stadt war Hauptstadt der Bundesrepublik bis 1990?":
    "Which city was the capital of the Federal Republic until 1990?",
  "Bonn. Berlin war geteilt und wurde erst 1990 wieder Hauptstadt.":
    "Bonn. Berlin was divided and became the capital again only in 1990.",
  "Was war die Währungsreform von 1948 in den Westzonen?":
    "What was the currency reform of 1948 in the western zones?",
  "Die Einführung der D-Mark": "The introduction of the D-Mark",
  "Die Abschaffung des Bargelds": "The abolition of cash",
  "Die Einführung der Rentenmark": "The introduction of the Rentenmark",
  "Die D-Mark löste die Reichsmark ab. Die sowjetische Antwort darauf war die Berliner Blockade.":
    "The D-Mark replaced the Reichsmark. The Soviet answer to it was the Berlin blockade.",
  "Wie heißt das Wirtschaftsmodell der Bundesrepublik?":
    "What is the Federal Republic's economic model called?",
  "Planwirtschaft": "A planned economy",
  "Soziale Marktwirtschaft": "The social market economy",
  "Staatswirtschaft": "A state-run economy",
  "Tauschwirtschaft": "A barter economy",
  "Freier Wettbewerb mit sozialem Ausgleich — verbunden mit dem Namen Ludwig Erhard.":
    "Free competition with social balance — a model tied to the name of Ludwig Erhard.",
  "Aus welchen Zonen entstand die Bundesrepublik Deutschland?":
    "Which zones did the Federal Republic of Germany grow out of?",
  "Aus der sowjetischen Zone": "The Soviet zone",
  "Aus der amerikanischen, britischen und französischen Zone":
    "The American, British and French zones",
  "Aus allen vier Zonen": "All four zones",
  "Aus der amerikanischen Zone allein": "The American zone alone",
  "Die drei Westzonen wurden 1949 zur Bundesrepublik, die sowjetische Zone zur DDR.":
    "In 1949 the three western zones became the Federal Republic and the Soviet zone the GDR.",
  "Welche Bedeutung hatte das Anwerbeabkommen mit der Türkei von 1961?":
    "What did the 1961 recruitment agreement with Turkey mean?",
  "Es beendete den Krieg": "It ended the war",
  "Es holte Arbeitskräfte nach Westdeutschland, von denen viele blieben":
    "It brought workers to West Germany, many of whom stayed",
  "Es regelte den Handel mit Öl": "It settled the oil trade",
  "Es öffnete die Grenze zur DDR": "It opened the border to the GDR",
  "Aus angeworbenen Arbeitskräften wurden Nachbarn, Kollegen und Familien — ein prägender Teil der Einwanderungsgeschichte.":
    "Recruited workers became neighbours, colleagues and families — a defining part of the country's history of immigration.",
  "Was waren die „Trümmerfrauen“?": "Who were the \"Trümmerfrauen\", the rubble women?",
  "Frauen, die nach dem Krieg beim Aufräumen der zerstörten Städte halfen":
    "Women who helped clear the ruined cities after the war",
  "Eine Gewerkschaft": "A trade union",
  "Frauen, die in die Westzonen flohen": "Women who fled to the western zones",
  "Sie räumten Schutt und retteten Ziegel für den Wiederaufbau — ein Sinnbild für den Neuanfang nach 1945.":
    "They cleared rubble and saved bricks for the rebuilding — an image of the fresh start after 1945.",
  "Wie viele Besatzungszonen hatte Deutschland nach 1945?":
    "How many occupation zones did Germany have after 1945?",
  "Drei": "Three",
  "Vier": "Four",
  "Fünf": "Five",
  "Vier — USA, Großbritannien, Frankreich und Sowjetunion. Berlin war zusätzlich in vier Sektoren geteilt.":
    "Four — the United States, Britain, France and the Soviet Union. Berlin was divided into four sectors on top of that.",
  "Was bedeutet „Kalter Krieg“?": "What does \"Cold War\" mean?",
  "Ein Krieg im Winter": "A war in winter",
  "Die jahrzehntelange Konfrontation zwischen Ost und West ohne offenen Krieg zwischen den Blöcken":
    "The decades of confrontation between east and west without open war between the blocs",
  "Ein Krieg um Rohstoffe": "A war over raw materials",
  "Der Krieg um Berlin": "The war over Berlin",
  "Spannungen, Wettrüsten und Stellvertreterkonflikte — Deutschland lag genau an der Grenze zwischen beiden Blöcken.":
    "Tension, an arms race and proxy conflicts — Germany lay exactly on the line between the two blocs.",
  "Wofür steht die Abkürzung DDR?": "What does the abbreviation DDR stand for?",
  "Deutsches Demokratisches Reich": "Deutsches Demokratisches Reich, German democratic empire",
  "Deutscher Demokratischer Rat": "Deutscher Demokratischer Rat, German democratic council",
  "Deutsche Demokratische Regierung":
    "Deutsche Demokratische Regierung, German democratic government",
  "Deutsche Demokratische Republik — der Name behauptete eine Demokratie, die es nicht gab.":
    "Deutsche Demokratische Republik, the German Democratic Republic — a name that claimed a democracy which did not exist.",
  "Wie hieß die Jugendorganisation der DDR?": "What was the youth organisation of the GDR called?",
  "Junge Pioniere und FDJ": "The Junge Pioniere and the FDJ",
  "Bundesjugendring": "The Bundesjugendring",
  "Jungdemokraten": "The Jungdemokraten",
  "Pfadfinder": "The scouts",
  "Junge Pioniere für die Jüngeren, die Freie Deutsche Jugend für die Älteren — beide der SED unterstellt.":
    "The Junge Pioniere for the younger ones, the Freie Deutsche Jugend for the older — both answering to the SED.",
  "Was war die Nationale Volksarmee?": "What was the Nationale Volksarmee?",
  "Die Polizei der DDR": "The police of the GDR",
  "Der Geheimdienst": "The secret service",
  "Eine Jugendorganisation": "A youth organisation",
  "Die NVA war die Armee der DDR. Der Geheimdienst hieß Staatssicherheit.":
    "The NVA was the army of the GDR. The secret service was called the Staatssicherheit.",
  "Was bedeutete „Republikflucht“ in der DDR?": "What did \"Republikflucht\" mean in the GDR?",
  "Ein Urlaub im Ausland": "A holiday abroad",
  "Das Verlassen der DDR ohne Genehmigung — es war strafbar":
    "Leaving the GDR without permission, which was a criminal offence",
  "Der Umzug in eine andere Stadt": "Moving to another town",
  "Die Ausbürgerung von Künstlern": "Stripping artists of their citizenship",
  "Wer ohne Erlaubnis in den Westen ging, machte sich strafbar; an der Grenze wurde geschossen.":
    "Anyone who went west without permission committed an offence, and at the border they were shot at.",
  "Was war ein „Inoffizieller Mitarbeiter“ der Stasi?":
    "What was an \"Inoffizieller Mitarbeiter\", an unofficial collaborator, of the Stasi?",
  "Ein Angestellter ohne Vertrag": "An employee without a contract",
  "Eine Person, die heimlich Informationen über andere weitergab":
    "Someone who secretly passed on information about others",
  "Ein Grenzsoldat": "A border guard",
  "Ein Mitglied der Volkskammer": "A member of the Volkskammer",
  "Hunderttausende bespitzelten Nachbarn, Kollegen, Freunde und sogar die eigene Familie.":
    "Hundreds of thousands spied on neighbours, colleagues, friends and even their own families.",
  "Wie war die Wirtschaft der DDR organisiert?": "How was the economy of the GDR organised?",
  "Als freie Marktwirtschaft": "As a free market economy",
  "Als Planwirtschaft mit staatlichen Betrieben": "As a planned economy with state-owned firms",
  "Als soziale Marktwirtschaft": "As a social market economy",
  "Ohne jede Planung": "With no planning at all",
  "Der Staat gab Produktionsziele vor und besaß die Betriebe (VEB — Volkseigener Betrieb).":
    "The state set production targets and owned the firms (VEB — Volkseigener Betrieb, a people-owned enterprise).",
  "Konnten DDR-Bürger frei in den Westen reisen?":
    "Could citizens of the GDR travel freely to the west?",
  "Nein, das war für die meisten nicht möglich": "No; for most of them it was not possible",
  "Ja, einmal im Jahr": "Yes, once a year",
  "Nur mit einem Reisepass": "Only with a passport",
  "Reisen in den Westen waren streng beschränkt — genau deshalb wurde die Mauer gebaut.":
    "Travel to the west was tightly restricted — which is exactly why the Wall was built.",
  "Warum gab es in der DDR trotz Wahlen keine echte Auswahl?":
    "Why was there no real choice in the GDR despite the elections?",
  "Weil niemand wählen wollte": "Because nobody wanted to vote",
  "Weil nur eine Einheitsliste zur Abstimmung stand":
    "Because only a single list was put to the vote",
  "Weil es keine Wahllokale gab": "Because there were no polling stations",
  "Weil nur Parteimitglieder wählen durften": "Because only party members were allowed to vote",
  "Die Sitzverteilung stand vorher fest; man konnte der Liste zustimmen, aber nicht zwischen Alternativen wählen.":
    "The distribution of seats was settled in advance; you could approve the list, but not choose between alternatives.",
  "In welchem Jahr wurde Deutschland wiedervereinigt?": "In which year was Germany reunified?",
  "1991": "1991",
  "1993": "1993",
  "Am 3. Oktober 1990. Die Mauer fiel schon im November 1989.":
    "On 3 October 1990. The Wall had already come down in November 1989.",
  "Von welcher Kirche gingen die Leipziger Montagsdemonstrationen aus?":
    "Which church did the Leipzig Monday demonstrations start from?",
  "Vom Kölner Dom": "From Cologne Cathedral",
  "Von der Nikolaikirche": "From the Nikolaikirche",
  "Von der Frauenkirche": "From the Frauenkirche",
  "Von der Marienkirche": "From the Marienkirche",
  "Die Friedensgebete in der Leipziger Nikolaikirche waren der Ausgangspunkt der Montagsdemonstrationen.":
    "The peace prayers in the Nikolaikirche in Leipzig were the starting point of the Monday demonstrations.",
  "Welcher sowjetische Staatschef ermöglichte durch seine Reformpolitik den Wandel im Osten?":
    "Which Soviet leader made the change in the east possible through a policy of reform?",
  "Leonid Breschnew": "Leonid Brezhnev",
  "Michail Gorbatschow": "Mikhail Gorbachev",
  "Josef Stalin": "Joseph Stalin",
  "Boris Jelzin": "Boris Yeltsin",
  "Gorbatschows Glasnost und Perestroika machten den friedlichen Umbruch in Mittel- und Osteuropa möglich.":
    "Gorbachev's glasnost and perestroika made the peaceful change in central and eastern Europe possible.",
  "Wie wurde die DDR Teil der Bundesrepublik?":
    "How did the GDR become part of the Federal Republic?",
  "Durch eine neue gemeinsame Verfassung": "Through a new joint constitution",
  "Durch Beitritt der DDR zum Geltungsbereich des Grundgesetzes":
    "By the GDR joining the area in which the Grundgesetz applies",
  "Durch einen Beschluss der Vereinten Nationen": "Through a decision of the United Nations",
  "Durch eine Volksabstimmung im Westen": "Through a referendum in the west",
  "Der Beitrittsweg nach dem damaligen Artikel 23 — das Grundgesetz galt danach für ganz Deutschland.":
    "The route of accession under what was then Article 23 — after it the Grundgesetz applied to the whole of Germany.",
  "Welche Rolle spielte die Währungsunion vom 1. Juli 1990?":
    "What part did the currency union of 1 July 1990 play?",
  "Sie führte den Euro ein": "It introduced the euro",
  "Sie brachte die D-Mark in die DDR, noch vor der staatlichen Einheit":
    "It brought the D-Mark to the GDR, before the states were united",
  "Sie schaffte das Bargeld ab": "It abolished cash",
  "Sie war Teil des Zwei-plus-Vier-Vertrags": "It was part of the Two Plus Four Treaty",
  "Drei Monate vor der Vereinigung wurde die D-Mark auch im Osten gesetzliches Zahlungsmittel.":
    "Three months before unification the D-Mark became legal tender in the east too.",
  "Welche vier Mächte unterzeichneten mit beiden deutschen Staaten den Zwei-plus-Vier-Vertrag?":
    "Which four powers signed the Two Plus Four Treaty with the two German states?",
  "USA, Frankreich, Polen, Italien": "The United States, France, Poland, Italy",
  "USA, China, Frankreich, Sowjetunion": "The United States, China, France, the Soviet Union",
  "Dieselben vier Siegermächte von 1945 — damit war die Nachkriegsordnung förmlich abgeschlossen.":
    "The same four victorious powers of 1945 — with that the post-war order was formally closed.",
  "Wie wird der Umbruch von 1989 in der DDR genannt?":
    "What is the upheaval of 1989 in the GDR called?",
  "Bürgerkrieg": "A civil war",
  "Friedliche Revolution": "A peaceful revolution",
  "Putsch": "A coup",
  "Reformation": "A reformation",
  "Friedliche Revolution — sie kam ohne Gewalt der Demonstrierenden aus.":
    "The peaceful revolution — it came about without violence from those demonstrating.",
  "Was ist die Bedeutung des Brandenburger Tors für die deutsche Einheit?":
    "What does the Brandenburg Gate mean for German unity?",
  "Dort wurde die Verfassung unterschrieben": "The constitution was signed there",
  "Es stand direkt an der Mauer und wurde zum Symbol der Teilung und dann der Einheit":
    "It stood right at the Wall and became the symbol first of division and then of unity",
  "Dort tagt der Bundestag": "The Bundestag sits there",
  "Es ist das älteste Gebäude Berlins": "It is the oldest building in Berlin",
  "Jahrzehntelang unzugänglich im Grenzstreifen, heute das Bild schlechthin für das wiedervereinigte Deutschland.":
    "For decades out of reach in the border strip, today the image above all others of a reunified Germany.",
  "Welche Farbe hat die Flagge der Europäischen Union?":
    "What colour is the flag of the European Union?",
  "Blau mit zwölf goldenen Sternen im Kreis": "Blue, with twelve gold stars in a circle",
  "Grün mit weißem Kreuz": "Green, with a white cross",
  "Gold mit blauem Adler": "Gold, with a blue eagle",
  "Zwölf Sterne auf blauem Grund — die Zahl steht für Vollständigkeit, nicht für die Mitgliederzahl.":
    "Twelve stars on a blue ground — the number stands for completeness, not for the number of members.",
  "Wo hat das Europäische Parlament seinen Hauptsitz?":
    "Where does the European Parliament have its principal seat?",
  "Brüssel": "Brussels",
  "Straßburg": "Strasbourg",
  "Luxemburg": "Luxembourg",
  "Den Haag": "The Hague",
  "Straßburg ist der Sitz; viele Ausschüsse tagen in Brüssel, das Generalsekretariat sitzt in Luxemburg.":
    "Strasbourg is the seat; many committees meet in Brussels, and the secretariat general is in Luxembourg.",
  "Was ist der Schengen-Raum?": "What is the Schengen area?",
  "Ein Gebiet ohne Steuern": "An area without taxes",
  "Ein Gebiet, in dem an den Binnengrenzen normalerweise nicht kontrolliert wird":
    "An area where there are normally no checks at the internal borders",
  "Der Sitz der EU-Kommission": "The seat of the European Commission",
  "Die Zone der Euro-Länder": "The zone of the euro countries",
  "Reisen ohne Grenzkontrolle. Nicht dasselbe wie die Eurozone — die Mitgliederkreise überschneiden sich nur.":
    "Travel without border checks. Not the same as the eurozone — the two memberships only overlap.",
  "Welches Land verließ die EU im Jahr 2020?": "Which country left the EU in 2020?",
  "Norwegen": "Norway",
  "Das Vereinigte Königreich": "The United Kingdom",
  "Die Schweiz": "Switzerland",
  "Island": "Iceland",
  "Der Brexit. Norwegen, die Schweiz und Island waren nie Mitglied der EU.":
    "Brexit. Norway, Switzerland and Iceland were never members of the EU.",
  "Wofür ist der Europarat zuständig — im Unterschied zur EU?":
    "What is the Council of Europe responsible for, as against the EU?",
  "Für den Binnenmarkt": "For the single market",
  "Für Menschenrechte, Demokratie und Rechtsstaatlichkeit, mit deutlich mehr Mitgliedstaaten":
    "For human rights, democracy and the rule of law, with far more member states",
  "Für die gemeinsame Währung": "For the common currency",
  "Für die Verteidigung": "For defence",
  "Zum Europarat gehört auch der Europäische Gerichtshof für Menschenrechte. Er ist älter und größer als die EU.":
    "The European Court of Human Rights belongs to the Council of Europe too. It is older and larger than the EU.",
  "Was bedeutet die Unionsbürgerschaft?": "What does citizenship of the Union mean?",
  "Sie ersetzt die nationale Staatsangehörigkeit": "It replaces national citizenship",
  "Sie kommt zur nationalen Staatsangehörigkeit hinzu und bringt Rechte wie Freizügigkeit und das Kommunalwahlrecht":
    "It comes on top of national citizenship and brings rights such as free movement and the vote in local elections",
  "Sie gilt nur für Beamte der EU": "It applies only to officials of the EU",
  "Sie muss beantragt werden": "It has to be applied for",
  "Jeder Staatsangehörige eines Mitgliedstaates ist automatisch auch Unionsbürger.":
    "Every national of a member state is automatically a citizen of the Union as well.",
  "Seit wann ist die Bundesrepublik Mitglied der NATO?":
    "How long has the Federal Republic been a member of NATO?",
  "1955": "1955",
  "1955, im Zuge der Westbindung. 1949 wurde die Bundesrepublik gegründet, 1973 trat sie den UN bei.":
    "Since 1955, as part of tying the country to the west. The Federal Republic was founded in 1949 and joined the UN in 1973.",
  "Welche deutsche Institution überwacht heute nicht mehr die Geldpolitik des Euro?":
    "Which German institution no longer runs monetary policy for the euro?",
  "Die Deutsche Bundesbank — die Geldpolitik macht die Europäische Zentralbank":
    "The Deutsche Bundesbank — monetary policy is made by the European Central Bank",
  "Das Bundesfinanzministerium": "The federal finance ministry",
  "Der Bundesrechnungshof": "The federal court of audit",
  "Die Bundesanstalt für Finanzdienstleistungsaufsicht":
    "The federal financial supervisory authority",
  "Seit der Währungsunion entscheidet die EZB in Frankfurt über die Geldpolitik; die Bundesbank wirkt dort mit.":
    "Since the currency union the European Central Bank in Frankfurt has decided monetary policy; the Bundesbank takes part there.",
  "Welches Land grenzt NICHT an Deutschland?": "Which country does NOT border on Germany?",
  "Dänemark": "Denmark",
  "Italien": "Italy",
  "Belgien": "Belgium",
  "Italien hat keine gemeinsame Grenze mit Deutschland — dazwischen liegen Österreich und die Schweiz.":
    "Italy has no common border with Germany: Austria and Switzerland lie in between.",
  "Welcher Fluss fließt durch Köln?": "Which river flows through Cologne?",
  "Der Rhein. Die Elbe fließt durch Dresden und Hamburg, die Weser durch Bremen.":
    "The Rhine. The Elbe flows through Dresden and Hamburg, the Weser through Bremen.",
  "Wie heißt das höchste Mittelgebirge Norddeutschlands mit dem Brocken?":
    "What is the highest range in northern Germany, the one with the Brocken, called?",
  "Der Schwarzwald": "The Black Forest",
  "Der Harz": "The Harz",
  "Das Erzgebirge": "The Ore Mountains",
  "Der Thüringer Wald": "The Thuringian Forest",
  "Der Harz mit dem Brocken. Schwarzwald und Erzgebirge liegen im Süden beziehungsweise Osten.":
    "The Harz, with the Brocken. The Black Forest lies in the south and the Ore Mountains in the east.",
  "Was bedeuten die Farben Schwarz-Rot-Gold historisch?":
    "What do the colours black, red and gold mean historically?",
  "Die drei Besatzungsmächte": "The three occupying powers",
  "Sie stehen seit dem 19. Jahrhundert für Einheit und Freiheit":
    "Since the nineteenth century they have stood for unity and freedom",
  "Die drei größten Bundesländer": "The three largest states",
  "Die drei Staatsgewalten": "The three powers of state",
  "Aus der Freiheitsbewegung des 19. Jahrhunderts, übernommen von der Paulskirche 1848 und der Weimarer Republik.":
    "From the freedom movement of the nineteenth century, taken up by the Paulskirche in 1848 and by the Weimar Republic.",
  "Welche deutsche Stadt ist zugleich Bundesland und liegt an der Weser?":
    "Which German city is also a state and lies on the Weser?",
  "Bremen": "Bremen",
  "Kiel": "Kiel",
  "Bremen liegt an der Weser, Hamburg an der Elbe — beide sind Stadtstaaten.":
    "Bremen lies on the Weser and Hamburg on the Elbe; both are city states.",
  "Wer schrieb den Text der deutschen Nationalhymne?":
    "Who wrote the words of the German national anthem?",
  "August Heinrich Hoffmann von Fallersleben": "August Heinrich Hoffmann von Fallersleben",
  "Joseph Haydn": "Joseph Haydn",
  "Hoffmann von Fallersleben schrieb den Text 1841, die Melodie stammt von Joseph Haydn.":
    "Hoffmann von Fallersleben wrote the words in 1841; the tune is by Joseph Haydn.",
  "Welche Stadt ist die Hauptstadt von Nordrhein-Westfalen?":
    "Which city is the capital of North Rhine-Westphalia?",
  "Düsseldorf": "Düsseldorf",
  "Dortmund": "Dortmund",
  "Essen": "Essen",
  "Düsseldorf. Köln ist zwar größer, aber nicht die Landeshauptstadt.":
    "Düsseldorf. Cologne is larger, but it is not the state capital.",
  "Welcher See bildet ein Dreiländereck mit Österreich und der Schweiz?":
    "Which lake forms a three-country corner with Austria and Switzerland?",
  "Der Chiemsee": "The Chiemsee",
  "Der Bodensee": "Lake Constance",
  "Die Müritz": "The Müritz",
  "Der Starnberger See": "Lake Starnberg",
  "Der Bodensee. Die Müritz ist der größte See, der ganz in Deutschland liegt.":
    "Lake Constance. The Müritz is the largest lake that lies entirely in Germany.",
  "Muss man in Deutschland einer Religion angehören?":
    "Do you have to belong to a religion in Germany?",
  "Ja, man muss sich entscheiden": "Yes, you have to choose one",
  "Nein, niemand muss einer Religionsgemeinschaft angehören":
    "No; nobody has to belong to a religious community",
  "Ja, ab 18 Jahren": "Yes, from the age of 18",
  "Nur für die Eheschließung": "Only in order to marry",
  "Religionsfreiheit schließt die Freiheit ein, keiner Religion anzugehören — etwa die Hälfte der Bevölkerung gehört keiner an.":
    "Freedom of religion includes the freedom to belong to none — about half the population belongs to none.",
  "Wie viele Menschen muslimischen Glaubens leben ungefähr in Deutschland?":
    "Roughly how many Muslims live in Germany?",
  "Etwa 100.000": "About 100,000",
  "Etwa 5 Millionen": "About 5 million",
  "Etwa 20 Millionen": "About 20 million",
  "Etwa 500": "About 500",
  "Rund fünf Millionen — der Islam ist die größte nichtchristliche Religion in Deutschland.":
    "Around five million — Islam is the largest non-Christian religion in Germany.",
  "Was passiert, wenn man aus der Kirche austritt?": "What happens if you leave the church?",
  "Man muss eine Strafe zahlen": "You have to pay a penalty",
  "Man zahlt keine Kirchensteuer mehr und verliert Rechte innerhalb der Kirche":
    "You stop paying church tax and lose rights within the church",
  "Man verliert die Staatsangehörigkeit": "You lose your citizenship",
  "Nichts ändert sich": "Nothing changes",
  "Der Austritt wird beim Standesamt oder Amtsgericht erklärt; danach entfällt die Kirchensteuer.":
    "You declare it at the Standesamt or the local court; after that the church tax stops.",
  "Ein Vater will seine Tochter nicht am Schwimmunterricht teilnehmen lassen. Was gilt?":
    "A father does not want his daughter to take part in swimming lessons. What applies?",
  "Die Schulpflicht gilt auch für den Sportunterricht; die Schule sucht praktische Lösungen":
    "Compulsory schooling covers physical education too; the school looks for practical solutions",
  "Der Vater entscheidet allein": "The father decides alone",
  "Das Kind wird vom Unterricht befreit": "The child is excused the lessons",
  "Die Schule muss den Unterricht abschaffen": "The school has to drop the lessons",
  "Die Schulpflicht steht über privaten Vorbehalten. Schulen ermöglichen etwa geeignete Badekleidung, ein Fernbleiben aber nicht.":
    "Compulsory schooling stands above private reservations. Schools will allow suitable swimwear, for instance, but not staying away.",
  "Was bedeutet die weltanschauliche Neutralität des Staates?":
    "What does the state's neutrality in matters of belief mean?",
  "Der Staat verbietet Religion": "The state bans religion",
  "Der Staat bevorzugt oder benachteiligt keine Religion und hat selbst keine":
    "The state neither favours nor disadvantages any religion, and has none itself",
  "Der Staat bestimmt die Religion der Bürger": "The state decides the citizens' religion",
  "Es gibt keine Staatskirche. Der Staat arbeitet mit Religionsgemeinschaften zusammen, ohne sich mit einer zu identifizieren.":
    "There is no state church. The state works with religious communities without identifying itself with any of them.",
  "Welches Fest feiern Christen zu Ostern?": "What do Christians celebrate at Easter?",
  "Die Geburt Jesu": "The birth of Jesus",
  "Die Auferstehung Jesu": "The resurrection of Jesus",
  "Die Taufe Jesu": "The baptism of Jesus",
  "Das Ende des Fastenmonats": "The end of the month of fasting",
  "Ostern ist das Fest der Auferstehung. Die Geburt wird zu Weihnachten gefeiert.":
    "Easter is the feast of the resurrection. The birth is celebrated at Christmas.",
  "Darf man in Deutschland die Religion wechseln?": "May you change your religion in Germany?",
  "Ja, jeder darf frei entscheiden": "Yes, everyone is free to decide",
  "Der Wechsel des Glaubens und der Austritt sind ausdrücklich geschützt — auch gegen den Willen der Familie.":
    "Changing faith and leaving one are expressly protected — even against the family's wishes.",
  "Welche Rolle haben die Kirchen in der sozialen Arbeit in Deutschland?":
    "What part do the churches play in social work in Germany?",
  "Sie dürfen keine sozialen Einrichtungen betreiben": "They may not run social institutions",
  "Caritas und Diakonie gehören zu den größten Trägern von Kitas, Krankenhäusern und Pflegeheimen":
    "Caritas and Diakonie are among the largest providers of nurseries, hospitals and care homes",
  "Sie betreiben nur Kirchen": "They run churches and nothing else",
  "Sie sind für die Sozialversicherung zuständig": "They are responsible for the social insurance",
  "Die kirchlichen Wohlfahrtsverbände sind neben AWO, DRK und Paritätischem tragende Säulen der sozialen Infrastruktur.":
    "Alongside the AWO, the DRK and the Paritätischer, the church welfare associations are load-bearing pillars of the social infrastructure.",
  "Wer entscheidet in Deutschland, wen eine erwachsene Person heiratet?":
    "Who decides in Germany whom an adult marries?",
  "Die Eltern": "The parents",
  "Die Person selbst": "The person themselves",
  "Die Religionsgemeinschaft": "The religious community",
  "Jede volljährige Person entscheidet selbst. Zwangsheirat ist eine Straftat.":
    "Everyone of full age decides for themselves. Forced marriage is a criminal offence.",
  "Was ist das Sorgerecht?": "What is Sorgerecht, parental responsibility?",
  "Das Recht, für ein Kind zu sorgen und es zu vertreten":
    "The right to care for a child and to act for it",
  "Das Recht auf Unterhalt": "The right to maintenance",
  "Das Recht, die Wohnung zu behalten": "The right to keep the home",
  "Das Recht auf Elternzeit": "The right to parental leave",
  "Es umfasst Erziehung, Aufenthaltsbestimmung und die rechtliche Vertretung des Kindes — nach einer Trennung oft gemeinsam.":
    "It covers upbringing, deciding where the child lives and representing the child in law — after a separation often jointly.",
  "Wer muss nach einer Scheidung für die gemeinsamen Kinder Unterhalt zahlen?":
    "Who has to pay maintenance for the children after a divorce?",
  "In der Regel der Elternteil, bei dem die Kinder nicht überwiegend leben":
    "As a rule the parent the children do not mainly live with",
  "Immer der Vater": "Always the father",
  "Beide Eltern bleiben unterhaltspflichtig; wer betreut, leistet seinen Teil durch die Betreuung.":
    "Both parents remain liable for maintenance; the one who does the caring gives their share through that care.",
  "Was kann die Polizei bei häuslicher Gewalt tun?":
    "What can the police do about violence in the home?",
  "Nichts, das ist Privatsache": "Nothing; that is a private matter",
  "Den Gewalttätigen aus der Wohnung verweisen und ein Kontaktverbot veranlassen":
    "Order the violent person out of the home and arrange a ban on contact",
  "Nur ein Protokoll aufnehmen": "Only take a statement",
  "Beide Beteiligten mitnehmen": "Take both parties away",
  "Das Gewaltschutzgesetz erlaubt Wohnungsverweisung und Näherungsverbot — der Schutz geht vor dem Wohnrecht des Täters.":
    "The protection against violence act allows the offender to be put out of the home and kept away — protection comes before the offender's right to live there.",
  "Ab welchem Alter gilt ein Mensch in Deutschland als volljährig?":
    "At what age does a person come of age in Germany?",
  "Mit 16": "At 16",
  "Mit 18": "At 18",
  "Mit 21": "At 21",
  "Mit der Heirat": "On marrying",
  "Mit 18 — damit gelten volle Geschäftsfähigkeit, Wahlrecht zum Bundestag und Ehefähigkeit.":
    "At 18 — with it come full legal capacity, the vote in Bundestag elections and the capacity to marry.",
  "Was ist eine Patchwork-Familie?": "What is a blended family?",
  "Eine Familie mit vielen Kindern": "A family with many children",
  "Eine Familie, in der Partner mit Kindern aus früheren Beziehungen zusammenleben":
    "A family in which partners live together with children from earlier relationships",
  "Eine Familie ohne Kinder": "A family without children",
  "Eine Familie, die im Ausland lebt": "A family living abroad",
  "Eine von vielen anerkannten Familienformen neben Ehepaaren, Alleinerziehenden und gleichgeschlechtlichen Paaren.":
    "One of many recognised forms of family, alongside married couples, single parents and same-sex couples.",
  "Dürfen Eltern in Deutschland ihre Kinder schlagen?":
    "May parents in Germany hit their children?",
  "Ja, zur Erziehung": "Yes, as a means of upbringing",
  "Nein, Kinder haben ein Recht auf gewaltfreie Erziehung":
    "No; children have a right to an upbringing free of violence",
  "Nur leichte Strafen sind erlaubt": "Only mild punishment is allowed",
  "Nur bis zum 6. Lebensjahr": "Only up to the age of six",
  "Körperliche Bestrafung ist verboten und kann strafbar sein — seit 2000 steht das ausdrücklich im Gesetz.":
    "Corporal punishment is forbidden and can be a criminal offence — since 2000 that has been in the law in so many words.",
  "Was gilt für die Gleichberechtigung in der Ehe?": "What applies to equality within a marriage?",
  "Der Mann entscheidet über den Wohnort": "The husband decides where they live",
  "Beide Partner sind gleichberechtigt und entscheiden gemeinsam":
    "Both partners have equal rights and decide together",
  "Die Frau muss den Haushalt führen": "The wife has to run the household",
  "Der Hauptverdiener entscheidet": "The main earner decides",
  "Artikel 3 gilt auch in der Ehe. Aufgabenteilung ist Verhandlungssache, keine Vorschrift.":
    "Article 3 applies within a marriage too. Who does what is a matter to be settled between them, not a rule.",
  "Kostet der Besuch staatlicher Schulen in Deutschland Schulgeld?":
    "Is there a fee for attending state schools in Germany?",
  "Ja, monatlich": "Yes, monthly",
  "Nein, staatliche Schulen sind grundsätzlich kostenfrei":
    "No; state schools are free as a matter of principle",
  "Nur ab der Oberstufe": "Only from the sixth form",
  "Nur für Nichtdeutsche": "Only for non-Germans",
  "Der Unterricht ist kostenfrei. Für Ausflüge oder Material können kleine Beiträge anfallen.":
    "The teaching is free. Small contributions may be asked for trips or materials.",
  "Was ist ein Integrationskurs?": "What is an Integrationskurs, an integration course?",
  "Ein Sportkurs": "A sports course",
  "Ein Sprachkurs mit anschließendem Orientierungskurs zu Recht, Geschichte und Kultur":
    "A language course followed by an orientation course on law, history and culture",
  "Ein Kurs für Lehrer": "A course for teachers",
  "Eine Berufsausbildung": "A vocational training",
  "Er endet mit der Sprachprüfung und dem Test „Leben in Deutschland“ — demselben Katalog wie beim Einbürgerungstest.":
    "It ends with the language examination and the test \"Leben in Deutschland\" — the same catalogue as the Einbürgerungstest.",
  "Wer entscheidet über die Lehrpläne an Schulen?": "Who decides the curriculum in schools?",
  "Die Schulen allein": "The schools alone",
  "Die EU": "The EU",
  "Bildung ist Ländersache — deshalb unterscheiden sich Lehrpläne, Schulformen und Ferienzeiten.":
    "Education is a matter for the states, which is why curricula, types of school and holiday dates differ.",
  "Was ist die Fachhochschulreife?": "What is the Fachhochschulreife?",
  "Ein Abschluss, der zum Studium an einer Fachhochschule berechtigt":
    "A qualification that entitles you to study at a university of applied sciences",
  "Ein Abschluss nach der 9. Klasse": "A qualification after the ninth year",
  "Ein Zeugnis über einen Sprachkurs": "A certificate for a language course",
  "Sie öffnet den Weg an Fachhochschulen; das Abitur berechtigt zusätzlich zum Universitätsstudium.":
    "It opens the way to the universities of applied sciences; the Abitur entitles you to study at a university as well.",
  "Wer trägt bei einer dualen Ausbildung die Kosten der Berufsschule?":
    "Who bears the cost of the vocational school in a dual apprenticeship?",
  "Der Auszubildende": "The apprentice",
  "Das Bundesland als Schulträger": "The state, as the school's provider",
  "Der Ausbildungsbetrieb allein": "The training firm alone",
  "Die Berufsschule ist eine staatliche Schule und damit Ländersache. Der Betrieb zahlt die Ausbildungsvergütung.":
    "The vocational school is a state school and so a matter for the states. The firm pays the training wage.",
  "Was bietet eine Volkshochschule an?": "What does a Volkshochschule offer?",
  "Nur Universitätsstudiengänge": "University degree courses only",
  "Günstige Kurse für Erwachsene — Sprachen, Computer, Integrations- und Orientierungskurse":
    "Cheap courses for adults — languages, computing, integration and orientation courses",
  "Nur Sportkurse": "Sports courses only",
  "Ausschließlich Kurse für Jugendliche": "Courses for young people and nothing else",
  "Die VHS ist die verbreitetste Einrichtung der Erwachsenenbildung; dort wird auch der Test „Leben in Deutschland“ abgenommen.":
    "The VHS is the most widespread institution of adult education; the test \"Leben in Deutschland\" is sat there too.",
  "Wie lange dauert die Schulpflicht in Deutschland mindestens?":
    "How long does compulsory schooling last in Germany at the least?",
  "4 Jahre": "4 years",
  "9 Jahre": "9 years",
  "12 Jahre": "12 years",
  "13 Jahre": "13 years",
  "Mindestens neun Schuljahre, in einigen Ländern zehn — dazu kommt oft die Berufsschulpflicht.":
    "At least nine school years, in some states ten — and often compulsory vocational schooling on top.",
  "Wo lässt man einen im Ausland erworbenen Berufsabschluss anerkennen?":
    "Where do you have a qualification gained abroad recognised?",
  "Beim Einwohnermeldeamt": "At the residents' registration office",
  "Bei der zuständigen Stelle wie Kammer oder Landesbehörde, oft mit Beratung durch das IQ-Netzwerk":
    "At the responsible body, a chamber or a state authority, often with advice from the IQ network",
  "Beim Finanzamt": "At the Finanzamt, the tax office",
  "Bei der Krankenkasse": "At the health insurer",
  "Welche Stelle zuständig ist, hängt vom Beruf ab — Kammern für Handwerk und Industrie, Landesbehörden für reglementierte Berufe.":
    "Which body is responsible depends on the occupation — the chambers for the trades and industry, state authorities for regulated professions.",
  "Was ist eine Probezeit?": "What is a probationary period?",
  "Die ersten Wochen ohne Bezahlung": "The first weeks without pay",
  "Eine Anfangszeit, in der beide Seiten mit kürzerer Frist kündigen können":
    "An opening period in which either side can give notice at shorter notice",
  "Eine unbezahlte Einarbeitung": "An unpaid induction",
  "Die Zeit bis zur ersten Gehaltserhöhung": "The time until the first pay rise",
  "In der Probezeit — meist bis zu sechs Monate — gilt eine verkürzte Kündigungsfrist. Bezahlt wird ganz normal.":
    "During the probationary period, usually up to six months, a shortened notice period applies. Pay is entirely normal.",
  "Was ist eine Lohnsteuerbescheinigung?": "What is a Lohnsteuerbescheinigung?",
  "Die Rechnung des Arbeitgebers": "The employer's invoice",
  "Eine jährliche Übersicht über Lohn und abgeführte Steuern, wichtig für die Steuererklärung":
    "A yearly statement of pay and tax paid over, needed for the tax return",
  "Ein Antrag auf Arbeitslosengeld": "An application for Arbeitslosengeld",
  "Der Arbeitgeber stellt sie am Jahresende aus; sie ist die Grundlage der Einkommensteuererklärung.":
    "The employer issues it at the end of the year; it is the basis of the income tax return.",
  "Was regelt das Arbeitszeitgesetz unter anderem?":
    "What does the working time act settle, among other things?",
  "Die Höhe des Lohns": "The level of pay",
  "Höchstarbeitszeiten, Ruhepausen und die Ruhezeit zwischen zwei Arbeitstagen":
    "Maximum working hours, breaks and the rest between two working days",
  "Die Urlaubsziele": "Holiday destinations",
  "Die Kleidung am Arbeitsplatz": "What to wear at work",
  "In der Regel höchstens acht Stunden täglich, mit vorgeschriebenen Pausen und mindestens elf Stunden Ruhe bis zum nächsten Tag.":
    "As a rule no more than eight hours a day, with set breaks and at least eleven hours of rest before the next day.",
  "Was gilt für schwangere Arbeitnehmerinnen?": "What applies to pregnant employees?",
  "Sie können jederzeit gekündigt werden": "They can be dismissed at any time",
  "Es gilt ein besonderer Kündigungsschutz und der Mutterschutz":
    "Special protection against dismissal applies, and maternity protection",
  "Sie müssen sofort aufhören zu arbeiten": "They have to stop working at once",
  "Es gibt keine besonderen Regeln": "There are no special rules",
  "Der Mutterschutz umfasst Kündigungsschutz, Schutzfristen vor und nach der Geburt und Beschäftigungsverbote bei Gefährdung.":
    "Maternity protection covers protection against dismissal, protected periods before and after the birth, and bans on working where there is a risk.",
  "Was ist Kurzarbeit?": "What is Kurzarbeit, short-time working?",
  "Eine Teilzeitstelle": "A part-time post",
  "Vorübergehend verkürzte Arbeitszeit, bei der die Agentur für Arbeit einen Teil des Lohnausfalls ersetzt":
    "Temporarily shortened hours, with the Agentur für Arbeit making up part of the lost pay",
  "Arbeit auf Abruf": "Work on call",
  "Ein befristeter Vertrag": "A fixed-term contract",
  "Ein Instrument, um in Krisen Entlassungen zu vermeiden — in der Finanzkrise und in der Pandemie im großen Stil eingesetzt.":
    "A device for avoiding redundancies in a crisis — used on a large scale in the financial crisis and in the pandemic.",
  "Wer vertritt die Interessen der Arbeitnehmer bei Tarifverhandlungen?":
    "Who represents the employees' interests in collective bargaining?",
  "Der Betriebsrat": "The works council",
  "Die Gewerkschaft": "The trade union",
  "Tarifverträge handeln Gewerkschaften mit Arbeitgeberverbänden aus. Der Betriebsrat vertritt die Belegschaft im einzelnen Betrieb.":
    "Collective agreements are negotiated by unions with employers' associations. The works council represents the workforce in the individual firm.",
  "Was musst du tun, wenn du krank bist und nicht arbeiten kannst?":
    "What do you have to do if you are ill and cannot work?",
  "Nichts, der Arbeitgeber merkt es": "Nothing; the employer will notice",
  "Dich unverzüglich beim Arbeitgeber melden": "Tell the employer straight away",
  "Erst nach drei Tagen Bescheid geben": "Say something only after three days",
  "Nur die Krankenkasse informieren": "Tell only the health insurer",
  "Die Krankmeldung erfolgt sofort. Ab wann ein ärztliches Attest nötig ist, steht im Arbeitsvertrag oder Tarifvertrag.":
    "You report sick at once. When a doctor's certificate becomes necessary is set out in the contract of employment or the collective agreement.",
  "Was ist ein Minijob?": "What is a Minijob?",
  "Eine Beschäftigung mit geringem monatlichem Verdienst und besonderen Abgabenregeln":
    "A job with a low monthly wage and its own rules on contributions",
  "Ein Job für Jugendliche unter 16": "A job for young people under 16",
  "Eine unbezahlte Tätigkeit": "Unpaid work",
  "Ein Praktikum": "A work placement",
  "Geringfügige Beschäftigung bis zu einer Verdienstgrenze; der Arbeitgeber führt Pauschalabgaben ab, Kündigungsschutz und Urlaub gelten trotzdem.":
    "Marginal employment up to an earnings limit; the employer pays flat-rate contributions, and protection against dismissal and holiday still apply.",
  "Wohin gehören leere Glasflaschen ohne Pfand?":
    "Where do empty glass bottles without a deposit belong?",
  "In den Restmüll": "In the residual waste",
  "In den Altglascontainer, nach Farben getrennt": "In the bottle bank, sorted by colour",
  "In die Biotonne": "In the food waste bin",
  "In den Papiercontainer": "In the paper bank",
  "Weiß, grün und braun getrennt. Auf Pfandflaschen gibt es das Geld im Laden zurück.":
    "White, green and brown kept apart. On deposit bottles you get the money back in the shop.",
  "Was sind Nebenkosten bei einer Mietwohnung?": "What are the Nebenkosten on a rented flat?",
  "Die Miete selbst": "The rent itself",
  "Kosten für Heizung, Wasser, Müll und ähnliche Betriebskosten":
    "The cost of heating, water, refuse and similar running costs",
  "Die Kaution": "The deposit",
  "Die Maklergebühr": "The agent's fee",
  "Sie werden monatlich vorausgezahlt und einmal jährlich abgerechnet — mit Nachzahlung oder Guthaben.":
    "They are paid monthly in advance and settled once a year — with a further payment or a credit.",
  "Wo meldest du dich an, wenn du nach Deutschland ziehst?":
    "Where do you register when you move to Germany?",
  "Beim Einwohnermeldeamt oder Bürgeramt":
    "At the residents' registration office or the Bürgeramt",
  "Bei der Polizei": "At the police station",
  "Beim Arbeitgeber": "With your employer",
  "Die Anmeldung erfolgt innerhalb von zwei Wochen beim Bürgeramt der Gemeinde.":
    "You register within two weeks at the municipality's Bürgeramt.",
  "Was ist der Rundfunkbeitrag?": "What is the Rundfunkbeitrag?",
  "Eine freiwillige Spende": "A voluntary donation",
  "Ein Beitrag pro Wohnung zur Finanzierung des öffentlich-rechtlichen Rundfunks":
    "A charge per dwelling that funds public service broadcasting",
  "Eine Steuer auf Fernsehgeräte": "A tax on television sets",
  "Eine Gebühr für das Internet": "A fee for the internet",
  "Er wird je Wohnung erhoben, unabhängig davon, wie viele Geräte vorhanden sind. Bei geringem Einkommen ist Befreiung möglich.":
    "It is charged per dwelling, whatever number of sets there are. On a low income you can be exempted.",
  "Was passiert, wenn du beim Fahren ohne gültiges Ticket erwischt wirst?":
    "What happens if you are caught travelling without a valid ticket?",
  "Du zahlst ein erhöhtes Beförderungsentgelt; bei Wiederholung droht eine Anzeige":
    "You pay an increased fare, and if you do it again you may be reported",
  "Du wirst sofort festgenommen": "You are arrested on the spot",
  "Du bekommst eine Verwarnung": "You get a warning",
  "Beim ersten Mal ein Entgelt, bei wiederholtem Schwarzfahren kann es strafrechtlich verfolgt werden.":
    "A charge the first time; repeated fare-dodging can be prosecuted.",
  "Wann ist in Deutschland üblicherweise Mittagsruhe in Wohngebieten?":
    "When is the usual midday quiet time in residential areas in Germany?",
  "Es gibt keine": "There is none",
  "Vielerorts zwischen 13 und 15 Uhr, je nach örtlicher Regelung":
    "In many places between one and three in the afternoon, depending on local rules",
  "Zwischen 10 und 12 Uhr": "Between ten and twelve in the morning",
  "Den ganzen Nachmittag": "All afternoon",
  "Die Zeiten legen Gemeinden und Hausordnungen fest. Sonntags gilt meist ganztägig Ruhe.":
    "The times are set by municipalities and by the rules of the building. On Sundays quiet usually applies all day.",
  "Was brauchst du, um in Deutschland ein Bankkonto zu eröffnen?":
    "What do you need to open a bank account in Germany?",
  "Nur eine Telefonnummer": "Only a telephone number",
  "Einen Ausweis und meist eine Meldebescheinigung":
    "An identity document and usually proof of registration",
  "Einen Arbeitsvertrag": "A contract of employment",
  "Die deutsche Staatsangehörigkeit": "German citizenship",
  "Ein Basiskonto steht jedem zu, auch ohne festes Einkommen. Ausweis und Anschrift werden benötigt.":
    "A basic account is everyone's right, even without a regular income. An identity document and an address are needed.",
  "Wie lange ist ein ausländischer Führerschein aus einem Nicht-EU-Staat in Deutschland gültig?":
    "How long is a foreign driving licence from a non-EU country valid in Germany?",
  "In der Regel sechs Monate nach der Anmeldung, danach ist eine Umschreibung nötig":
    "As a rule six months after registering, after which it has to be exchanged",
  "Er gilt gar nicht": "It is not valid at all",
  "Nach sechs Monaten muss umgeschrieben werden; je nach Herkunftsland mit oder ohne Prüfung. EU-Führerscheine gelten weiter.":
    "After six months it has to be exchanged, with or without a test depending on the country it comes from. EU licences remain valid.",
  "Was ist eine Überweisung beim Arzt?": "What is an Überweisung at the doctor's?",
  "Eine Zahlung an die Praxis": "A payment to the surgery",
  "Ein Schreiben, mit dem der Hausarzt zu einem Facharzt schickt":
    "A note with which the family doctor sends you to a specialist",
  "Ein Rezept": "A prescription",
  "Die Krankmeldung": "The sick note",
  "Nicht zu verwechseln mit der Geldüberweisung — hier geht es um die Weiterleitung zur fachärztlichen Behandlung.":
    "Not to be confused with a bank transfer, which the same German word also means — here it is a referral for specialist treatment.",
  "Wer zahlt in der Regel Medikamente auf Rezept?":
    "Who normally pays for medicines on prescription?",
  "Der Patient allein": "The patient alone",
  "Die Krankenkasse, meist mit einer Zuzahlung des Patienten":
    "The health insurer, usually with a contribution from the patient",
  "Der Arbeitgeber": "The employer",
  "Die Kasse übernimmt den Großteil; es bleibt meist eine Zuzahlung, von der man sich bei geringem Einkommen befreien lassen kann.":
    "The insurer covers most of it; a contribution usually remains, and on a low income you can be exempted from it.",
  "Wozu dient eine Patientenverfügung?": "What is a living will for?",
  "Zur Anmeldung im Krankenhaus": "For registering at the hospital",
  "Um im Voraus festzulegen, welche Behandlungen man möchte, wenn man selbst nicht mehr entscheiden kann":
    "To set out in advance which treatments you want if you can no longer decide for yourself",
  "Zur Abrechnung mit der Krankenkasse": "For settling accounts with the health insurer",
  "Um einen Arzt zu wechseln": "For changing doctor",
  "Sie ist verbindlich und sollte schriftlich vorliegen. Ergänzend regelt eine Vorsorgevollmacht, wer für einen sprechen darf.":
    "It is binding and should be in writing. A power of attorney settles, on top of that, who may speak for you.",
  "Welche Nummer erreicht den ärztlichen Bereitschaftsdienst außerhalb der Sprechzeiten?":
    "Which number reaches the out-of-hours medical service?",
  "116117 für dringende, aber nicht lebensbedrohliche Fälle. Die 112 bleibt echten Notfällen vorbehalten, die 115 ist die Behördennummer.":
    "116117, for urgent cases that are not life-threatening. 112 stays reserved for real emergencies, and 115 is the number for public authorities.",
  "Was passiert, wenn du länger als sechs Wochen krank bist?":
    "What happens if you are ill for longer than six weeks?",
  "Du bekommst kein Geld mehr": "You get no more money",
  "Die Krankenkasse zahlt Krankengeld": "The health insurer pays sickness benefit",
  "Der Arbeitgeber zahlt unbegrenzt weiter": "The employer keeps paying without limit",
  "Du wirst automatisch gekündigt": "You are dismissed automatically",
  "Nach sechs Wochen Lohnfortzahlung übernimmt die Krankenkasse mit dem Krankengeld.":
    "After six weeks of continued pay the health insurer takes over with sickness benefit.",
  "Was ist eine Vorsorgeuntersuchung?": "What is a screening examination?",
  "Eine Untersuchung nach einem Unfall": "An examination after an accident",
  "Eine Untersuchung zur Früherkennung von Krankheiten, meist von der Kasse bezahlt":
    "An examination to catch illness early, usually paid for by the insurer",
  "Eine Untersuchung vor einer Operation": "An examination before an operation",
  "Eine Untersuchung beim Zahnarzt nach Schmerzen": "A visit to the dentist because of pain",
  "Früherkennung statt Behandlung — etwa Krebsvorsorge, Kinderuntersuchungen und der Gesundheits-Check-up.":
    "Catching things early instead of treating them — cancer screening, children's check-ups and the general health check.",
  "Muss man in Deutschland für den Notruf 112 bezahlen?":
    "Do you have to pay for the 112 emergency call in Germany?",
  "Ja, pro Anruf": "Yes, per call",
  "Nein, der Notruf ist kostenlos": "No; the emergency call is free",
  "Nur vom Handy": "Only from a mobile",
  "Nur nachts": "Only at night",
  "Der Anruf ist kostenlos und funktioniert von jedem Telefon, auch ohne Guthaben.":
    "The call is free and works from any telephone, even with no credit.",
  "Wofür ist eine private Haftpflichtversicherung wichtig?":
    "Why does private liability insurance matter?",
  "Für Schäden am eigenen Auto": "For damage to your own car",
  "Für Schäden, die man anderen zufügt — sie kann existenzsichernd sein":
    "For damage you cause to others — it can save you from ruin",
  "Für die eigene Gesundheit": "For your own health",
  "Für den Hausrat": "For the contents of your home",
  "Wer fahrlässig einen großen Schaden verursacht, haftet unbegrenzt mit seinem Vermögen. Deshalb gilt sie als wichtigste freiwillige Versicherung.":
    "Anyone who negligently causes serious damage is liable without limit, with everything they own. That is why it counts as the most important voluntary insurance.",
  "Wann ist der Tag der Deutschen Einheit?": "When is the Day of German Unity?",
  "Am 1. Mai": "On 1 May",
  "Am 3. Oktober": "On 3 October",
  "Am 9. November": "On 9 November",
  "Am 23. Mai": "On 23 May",
  "Der 3. Oktober, der Nationalfeiertag. Der 9. November ist der Tag des Mauerfalls, aber auch der Pogromnacht.":
    "3 October, the national holiday. The 9th of November is the day the Wall came down, but also the day of the pogrom night.",
  "Welcher Komponist schrieb die Melodie der „Ode an die Freude“, der Europahymne?":
    "Which composer wrote the tune of the \"Ode to Joy\", the European anthem?",
  "Johann Sebastian Bach": "Johann Sebastian Bach",
  "Ludwig van Beethoven": "Ludwig van Beethoven",
  "Wolfgang Amadeus Mozart": "Wolfgang Amadeus Mozart",
  "Richard Wagner": "Richard Wagner",
  "Aus Beethovens 9. Sinfonie. Der Text stammt von Friedrich Schiller.":
    "From Beethoven's ninth symphony. The words are by Friedrich Schiller.",
  "Was ist die Bundesliga?": "What is the Bundesliga?",
  "Eine politische Vereinigung": "A political association",
  "Die höchste deutsche Fußballliga": "The top German football league",
  "Ein Fernsehsender": "A television channel",
  "Ein Zusammenschluss der Bundesländer": "A union of the states",
  "Sie spielt von August bis Mai. Fußball ist die mit Abstand beliebteste Sportart in Deutschland.":
    "It runs from August to May. Football is by far the most popular sport in Germany.",
  "Wofür ist Konrad Zuse bekannt?": "What is Konrad Zuse known for?",
  "Für den Buchdruck": "For printing",
  "Für den Bau des ersten funktionsfähigen Computers": "For building the first working computer",
  "Für das Automobil": "For the motor car",
  "Zuse baute 1941 die Z3. Gutenberg steht für den Buchdruck, Einstein für die Physik, Benz für das Auto.":
    "Zuse built the Z3 in 1941. Gutenberg stands for printing, Einstein for physics, Benz for the car.",
  "Was ist ein eingetragener Verein (e. V.)?": "What is a registered association (e. V.)?",
  "Ein Unternehmen": "A company",
  "Ein Zusammenschluss von Menschen für einen gemeinsamen Zweck, ins Vereinsregister eingetragen":
    "A group of people joined for a common purpose, entered in the register of associations",
  "Eine Behörde": "A public authority",
  "Eine Partei": "A political party",
  "Sport, Musik, Feuerwehr, Naturschutz — Vereine sind für viele der einfachste Weg, Anschluss zu finden.":
    "Sport, music, the fire brigade, conservation — for many people an association is the easiest way to find their footing.",
  "Wann wird in Deutschland Karneval oder Fasching gefeiert?":
    "When is Karneval or Fasching celebrated in Germany?",
  "Im Sommer": "In summer",
  "Im Winter, vor der Fastenzeit": "In winter, before Lent",
  "Immer im Dezember": "Always in December",
  "Zu Ostern": "At Easter",
  "Höhepunkt sind die Tage vor Aschermittwoch, besonders im Rheinland und in Süddeutschland.":
    "The high point is the days before Ash Wednesday, above all in the Rhineland and in southern Germany.",
  "Wofür stehen die Buchstaben ARD und ZDF?": "What do the letters ARD and ZDF stand for?",
  "Für private Fernsehsender": "For private television channels",
  "Für den öffentlich-rechtlichen Rundfunk": "For public service broadcasting",
  "Für Zeitungen": "For newspapers",
  "Für Radiosender der Bundesländer": "For the states' radio stations",
  "Beide werden über den Rundfunkbeitrag finanziert, damit sie unabhängig von Staat und Werbekunden berichten können.":
    "Both are funded by the Rundfunkbeitrag, so that they can report independently of the state and of advertisers.",
  "Warum ist die Unabhängigkeit der Medien in einer Demokratie wichtig?":
    "Why does the independence of the media matter in a democracy?",
  "Damit die Regierung ihre Politik erklären kann":
    "So that the government can explain its policies",
  "Damit Machtausübung öffentlich überprüft und kritisiert werden kann":
    "So that the exercise of power can be examined and criticised in public",
  "Damit es mehr Unterhaltung gibt": "So that there is more entertainment",
  "Damit die Parteien gleich viel Sendezeit haben": "So that the parties get equal airtime",
  "Freie Medien sind eine Kontrollinstanz. Genau das unterschied sie von der gelenkten Presse im NS-Staat und in der DDR.":
    "Free media are a check on power. That is exactly what set them apart from the controlled press in the National Socialist state and in the GDR.",
};
