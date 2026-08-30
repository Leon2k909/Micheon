/**
 * Polish for the German country-studies course cards and headings.
 *
 * Keyed on the GERMAN source text exactly as it appears in
 * lebenInDeutschlandCourse.ts. A missing key is not an error — the card simply
 * shows no translation and says so, which is why this can be filled in over
 * time rather than all at once. check-de-translations fails on a key that
 * matches nothing in the course, because a typo there is silent otherwise.
 *
 * Names of institutions, laws and offices stay in German on purpose:
 * "Grundgesetz", "Bundestag", "Bundesrat", "Bundeskanzler", "Ewigkeitsklausel".
 * The test is sat in German and asks for those exact words — translating them
 * would teach the wrong answer. What gets translated is the explanation around
 * them, and a German term is glossed the first time it carries weight.
 */
export const LEBEN_IN_DEUTSCHLAND_PL: Record<string, string> = {
  "Politik, Geschichte und Gesellschaft — wie das Land funktioniert.":
    "Polityka, historia i społeczeństwo — jak działa ten kraj.",

  // ── Grundgesetz and basic rights ────────────────────────────────────────
  "Grundgesetz und Grundrechte": "Grundgesetz i prawa podstawowe",
  "Warum diese Lektion zuerst: Ein großer Teil der Fragen prüft nicht Wissen über Deutschland, sondern über die Werte, auf denen es aufgebaut ist. Die stehen alle im Grundgesetz — und zwar gleich am Anfang.":
    "Dlaczego ta lekcja jest pierwsza: duża część pytań sprawdza nie wiedzę o Niemczech, lecz wartości, na których kraj jest zbudowany. Wszystkie znajdują się w Grundgesetz — i to zaraz na początku.",
  "Das Grundgesetz": "Grundgesetz",
  "Die Verfassung der Bundesrepublik heißt **Grundgesetz**. Sie trat am **23. Mai 1949** in Kraft. Der Name war als Provisorium gedacht: Solange Deutschland geteilt war, wollte man sich das Wort „Verfassung“ für die Wiedervereinigung aufheben. Seit 1990 gilt das Grundgesetz für ganz Deutschland und ist die Verfassung geblieben.":
    "Konstytucja Republiki Federalnej nazywa się **Grundgesetz** (ustawa zasadnicza). Weszła w życie **23 maja 1949** roku. Nazwa miała być tymczasowa: dopóki Niemcy były podzielone, słowo „konstytucja” chciano zachować na czas zjednoczenia. Od 1990 roku Grundgesetz obowiązuje w całych Niemczech i pozostał konstytucją.",
  "Artikel 1: die Menschenwürde": "Artykuł 1: godność człowieka",
  "Der erste Satz des Grundgesetzes lautet: **„Die Würde des Menschen ist unantastbar.“** Er steht bewusst an erster Stelle — als Antwort auf den Nationalsozialismus, der genau das bestritten hatte.":
    "Pierwsze zdanie Grundgesetz brzmi: **„Die Würde des Menschen ist unantastbar” — godność człowieka jest nienaruszalna.** Stoi na pierwszym miejscu świadomie — jako odpowiedź na narodowy socjalizm, który właśnie temu zaprzeczał.",
  "Artikel 1 und der Kern der Grundrechte können nicht abgeschafft werden, auch nicht durch eine Mehrheit im Parlament. Das nennt man die **Ewigkeitsklausel** (Artikel 79 Absatz 3). Genau danach wird gefragt.":
    "Artykułu 1 i rdzenia praw podstawowych nie można znieść, nawet większością w parlamencie. Nazywa się to **Ewigkeitsklausel** — klauzulą wieczystą (artykuł 79 ustęp 3). Właśnie o to test pyta.",
  "Die wichtigsten Grundrechte": "Najważniejsze prawa podstawowe",
  "Menschenwürde (Art. 1)": "Godność człowieka (art. 1)",
  "Unantastbar. Grundlage für alles Weitere.": "Nienaruszalna. Podstawa wszystkiego pozostałego.",
  "Freie Entfaltung (Art. 2)": "Swobodny rozwój osobowości (art. 2)",
  "Jeder darf leben, wie er möchte, solange er nicht die Rechte anderer verletzt.":
    "Każdy może żyć, jak chce, dopóki nie narusza praw innych.",
  "Gleichheit (Art. 3)": "Równość (art. 3)",
  "Alle Menschen sind vor dem Gesetz gleich. Niemand darf wegen Geschlecht, Herkunft, Sprache, Glauben oder Behinderung benachteiligt werden.":
    "Wszyscy są równi wobec prawa. Nikogo nie wolno dyskryminować ze względu na płeć, pochodzenie, język, wyznanie czy niepełnosprawność.",
  "Glaubensfreiheit (Art. 4)": "Wolność wyznania (art. 4)",
  "Jeder darf glauben, was er will — oder nichts glauben.":
    "Każdy może wierzyć, w co chce — albo nie wierzyć w nic.",
  "Meinungsfreiheit (Art. 5)": "Wolność słowa (art. 5)",
  "Meinung äußern, Presse, Rundfunk, Kunst und Wissenschaft sind frei. Eine Zensur findet nicht statt.":
    "Wyrażanie opinii, prasa, radio i telewizja, sztuka i nauka są wolne. Cenzury nie ma.",
  "Versammlungsfreiheit (Art. 8)": "Wolność zgromadzeń (art. 8)",
  "Sich friedlich und ohne Waffen versammeln — auch zu Demonstrationen.":
    "Gromadzenie się pokojowo i bez broni — także na demonstracjach.",
  "Wo Freiheit endet": "Gdzie kończy się wolność",
  "Meinungsfreiheit ist nicht grenzenlos. **Volksverhetzung**, **Beleidigung** und das **Leugnen des Holocaust** sind Straftaten. Auch die Kunstfreiheit hebt Strafgesetze nicht auf.":
    "Wolność słowa nie jest nieograniczona. **Volksverhetzung** (nawoływanie do nienawiści), **zniewaga** i **zaprzeczanie Holokaustowi** są przestępstwami. Także wolność sztuki nie uchyla prawa karnego.",
  "Das musst du wissen": "To musisz wiedzieć",
  "Wichtige Namen": "Ważne nazwiska i nazwy",
  "In dieser Lektion geht es um Prinzipien, nicht um Personen — die kommen ab Kapitel 2.":
    "Ta lekcja dotyczy zasad, a nie osób — te pojawią się od rozdziału 2.",
  "Wichtige Zahlen": "Ważne liczby",
  "33 Fragen · 60 Minuten · 17 zum Bestehen · 30 bundesweit + 3 zum Bundesland. Grundgesetz seit 23. Mai 1949. Artikel 1 Menschenwürde, Artikel 3 Gleichheit, Artikel 5 Meinungsfreiheit.":
    "33 pytania · 60 minut · 17 do zaliczenia · 30 ogólnokrajowych + 3 o kraju związkowym. Grundgesetz od 23 maja 1949 roku. Artykuł 1 godność człowieka, artykuł 3 równość, artykuł 5 wolność słowa.",
  "Wichtige Begriffe": "Ważne pojęcia",
  "Grundgesetz · Grundrechte · Menschenwürde · Ewigkeitsklausel · Zensurverbot · Volksverhetzung.":
    "Grundgesetz · prawa podstawowe · godność człowieka · Ewigkeitsklausel · zakaz cenzury · Volksverhetzung.",
  "In einem Satz: Das Grundgesetz beginnt mit der Menschenwürde, und dieser Anfang lässt sich nicht wegstimmen — das ist die Lehre aus 1933 bis 1945, in Verfassungsform.":
    "W jednym zdaniu: Grundgesetz zaczyna się od godności człowieka, a tego początku nie da się przegłosować — to nauka z lat 1933–1945 zapisana w konstytucji.",
  "Jetzt beantworte diese Fragen": "Teraz odpowiedz na te pytania",

  // ── Democracy and the rule of law ───────────────────────────────────────
  "Demokratie und Rechtsstaat": "Demokracja i państwo prawa",
  "Artikel 20 des Grundgesetzes fasst in einem Satz zusammen, was für ein Staat Deutschland ist: **„Die Bundesrepublik Deutschland ist ein demokratischer und sozialer Bundesstaat.“** Dazu kommt der Rechtsstaat. Diese vier Begriffe werden immer wieder abgefragt.":
    "Artykuł 20 Grundgesetz streszcza w jednym zdaniu, jakim państwem są Niemcy: **„Die Bundesrepublik Deutschland ist ein demokratischer und sozialer Bundesstaat” — demokratycznym i socjalnym państwem federalnym.** Do tego dochodzi państwo prawa. O te cztery pojęcia pyta się raz po raz.",
  "Die fünf Staatsprinzipien": "Pięć zasad ustrojowych",
  "Demokratie": "Demokracja",
  "Alle Staatsgewalt geht vom Volke aus. Gewählt wird in freien, gleichen und geheimen Wahlen.":
    "Wszelka władza państwowa pochodzi od narodu. Wybiera się w wyborach wolnych, równych i tajnych.",
  "Rechtsstaat": "Państwo prawa",
  "Auch der Staat ist an Recht und Gesetz gebunden. Gegen jede Entscheidung des Staates kann man vor Gericht ziehen.":
    "Także państwo jest związane prawem. Od każdej decyzji państwa można odwołać się do sądu.",
  "Sozialstaat": "Państwo socjalne",
  "Wer in Not gerät, wird aufgefangen — durch Sozialversicherungen und staatliche Leistungen.":
    "Kto znajdzie się w potrzebie, zostaje objęty wsparciem — przez ubezpieczenia społeczne i świadczenia państwowe.",
  "Bundesstaat": "Państwo federalne",
  "Deutschland besteht aus 16 Bundesländern, die eigene Aufgaben und eigene Parlamente haben.":
    "Niemcy składają się z 16 krajów związkowych, które mają własne zadania i własne parlamenty.",
  "Republik": "Republika",
  "Das Staatsoberhaupt wird gewählt, es gibt keinen König und keinen Kaiser.":
    "Głowę państwa się wybiera, nie ma króla ani cesarza.",
  "Gewaltenteilung": "Podział władzy",
  "Die Staatsgewalt ist auf drei Bereiche verteilt, damit niemand allein bestimmen kann. Das ist die Antwort auf die Diktatur, in der alle Gewalt in einer Hand lag.":
    "Władza państwowa jest rozdzielona na trzy obszary, aby nikt nie decydował sam. To odpowiedź na dyktaturę, w której cała władza spoczywała w jednym ręku.",
  "Legislative": "Legislatywa",
  "Die gesetzgebende Gewalt: Bundestag und Bundesrat beschließen die Gesetze.":
    "Władza ustawodawcza: Bundestag i Bundesrat uchwalają ustawy.",
  "Exekutive": "Egzekutywa",
  "Die vollziehende Gewalt: Regierung, Ministerien, Behörden und Polizei führen die Gesetze aus.":
    "Władza wykonawcza: rząd, ministerstwa, urzędy i policja wykonują ustawy.",
  "Judikative": "Judykatywa",
  "Die rechtsprechende Gewalt: unabhängige Gerichte entscheiden, was im Einzelfall gilt.":
    "Władza sądownicza: niezawisłe sądy rozstrzygają, co obowiązuje w konkretnej sprawie.",
  "Beliebte Verwechslung: Der Bundestag gehört zur Legislative, die Bundesregierung zur Exekutive. Der Bundeskanzler sitzt zwar im Bundestag, leitet aber die Regierung — also die Exekutive.":
    "Częsta pomyłka: Bundestag należy do legislatywy, Bundesregierung do egzekutywy. Bundeskanzler wprawdzie zasiada w Bundestagu, ale kieruje rządem — czyli egzekutywą.",
  "Wehrhafte Demokratie": "Demokracja zdolna do obrony",
  "Deutschland lässt es nicht zu, dass die Demokratie mit demokratischen Mitteln abgeschafft wird. Parteien, die die freiheitliche demokratische Grundordnung beseitigen wollen, können vom **Bundesverfassungsgericht** verboten werden. Nur dieses Gericht darf das — keine Regierung, kein Ministerium.":
    "Niemcy nie dopuszczają, by demokrację zniesiono środkami demokratycznymi. Partie, które chcą usunąć wolnościowy demokratyczny porządek ustrojowy, może zdelegalizować **Bundesverfassungsgericht**. Tylko ten sąd ma do tego prawo — żaden rząd ani ministerstwo.",
  "Bundesverfassungsgericht in Karlsruhe — das einzige Gericht, das Parteien verbieten und Gesetze für verfassungswidrig erklären kann.":
    "Bundesverfassungsgericht w Karlsruhe — jedyny sąd, który może delegalizować partie i uznawać ustawy za niezgodne z konstytucją.",
  "Artikel 20 Grundgesetz · 3 Gewalten · 16 Bundesländer · 5 Staatsprinzipien.":
    "Artykuł 20 Grundgesetz · 3 władze · 16 krajów związkowych · 5 zasad ustrojowych.",
  "Volkssouveränität · Gewaltenteilung · Legislative · Exekutive · Judikative · wehrhafte Demokratie · freiheitliche demokratische Grundordnung.":
    "Suwerenność narodu · podział władzy · legislatywa · egzekutywa · judykatywa · demokracja zdolna do obrony · wolnościowy demokratyczny porządek ustrojowy.",
  "In einem Satz: Drei getrennte Gewalten, und ein Gericht, das notfalls auch die Politik stoppt — die Demokratie schützt sich vor sich selbst.":
    "W jednym zdaniu: trzy rozdzielone władze i sąd, który w razie potrzeby zatrzyma także polityków — demokracja chroni się przed samą sobą.",

  // ── Bundestag and how a law is made ─────────────────────────────────────
  "Bundestag und Gesetzgebung": "Bundestag i stanowienie prawa",
  "Der **Bundestag** ist das Parlament des Bundes und das einzige Verfassungsorgan, das direkt vom Volk gewählt wird. Er beschließt Gesetze, wählt den Bundeskanzler, beschließt den Haushalt und kontrolliert die Regierung.":
    "**Bundestag** to parlament federalny i jedyny organ konstytucyjny wybierany bezpośrednio przez naród. Uchwala ustawy, wybiera Bundeskanzlera, przyjmuje budżet i kontroluje rząd.",
  "Die vier Aufgaben": "Cztery zadania",
  "Gesetze": "Ustawy",
  "Der Bundestag berät und beschließt die Bundesgesetze.":
    "Bundestag debatuje nad ustawami federalnymi i je uchwala.",
  "Kanzlerwahl": "Wybór kanclerza",
  "Er wählt den Bundeskanzler oder die Bundeskanzlerin — auf Vorschlag des Bundespräsidenten.":
    "Wybiera Bundeskanzlera lub Bundeskanzlerin — na wniosek Bundespräsidenta.",
  "Haushalt": "Budżet",
  "Er entscheidet, wofür der Bund Geld ausgibt. Das nennt man das Budgetrecht.":
    "Decyduje, na co federacja wydaje pieniądze. Nazywa się to prawem budżetowym.",
  "Kontrolle": "Kontrola",
  "Er kontrolliert Regierung und Verwaltung, etwa durch Anfragen und Untersuchungsausschüsse.":
    "Kontroluje rząd i administrację, na przykład przez zapytania i komisje śledcze.",
  "Der Bundestag wird **auf vier Jahre** gewählt. Diese Zahl wird gern mit der Amtszeit des Bundespräsidenten (fünf Jahre) verwechselt.":
    "Bundestag wybiera się **na cztery lata**. Tę liczbę chętnie myli się z kadencją Bundespräsidenta (pięć lat).",
  "Wie ein Gesetz entsteht": "Jak powstaje ustawa",
  "Ein Gesetzentwurf kommt aus der **Bundesregierung**, aus dem **Bundestag** selbst oder aus dem **Bundesrat**. Danach läuft er einen festen Weg:":
    "Projekt ustawy pochodzi od **Bundesregierung**, od samego **Bundestagu** albo od **Bundesratu**. Potem przechodzi ustaloną drogę:",
  "1. Drei Lesungen": "1. Trzy czytania",
  "Der Bundestag berät den Entwurf dreimal; dazwischen arbeiten die Fachausschüsse daran.":
    "Bundestag rozpatruje projekt trzykrotnie; pomiędzy czytaniami pracują nad nim komisje branżowe.",
  "2. Bundesrat": "2. Bundesrat",
  "Bei Zustimmungsgesetzen muss der Bundesrat zustimmen, bei Einspruchsgesetzen kann er widersprechen.":
    "Przy ustawach wymagających zgody Bundesrat musi ją wyrazić, przy ustawach sprzeciwu może zgłosić sprzeciw.",
  "3. Unterschrift": "3. Podpis",
  "Der Bundespräsident fertigt das Gesetz aus. Er prüft dabei, ob es verfassungsgemäß zustande gekommen ist.":
    "Bundespräsident podpisuje ustawę. Sprawdza przy tym, czy powstała zgodnie z konstytucją.",
  "4. Verkündung": "4. Ogłoszenie",
  "Erst mit der Veröffentlichung im Bundesgesetzblatt gilt das Gesetz.":
    "Ustawa obowiązuje dopiero po ogłoszeniu w Bundesgesetzblatt.",
  "Der Bundesrat": "Bundesrat",
  "Im **Bundesrat** sitzen Vertreter der **16 Landesregierungen** — nicht gewählte Abgeordnete, sondern Ministerpräsidenten und Landesminister. Jedes Land hat je nach Einwohnerzahl **drei bis sechs Stimmen**, und ein Land muss seine Stimmen einheitlich abgeben. So reden die Länder bei der Bundesgesetzgebung mit.":
    "W **Bundesracie** zasiadają przedstawiciele **16 rządów krajowych** — nie wybrani posłowie, lecz premierzy krajów i ministrowie krajowi. Każdy kraj ma zależnie od liczby mieszkańców **od trzech do sześciu głosów** i musi oddać je jednolicie. W ten sposób kraje współdecydują o ustawodawstwie federalnym.",
  "Bundestag (Reichstagsgebäude, Berlin) · Bundesrat · Bundesgesetzblatt · Bundestagspräsident.":
    "Bundestag (Reichstagsgebäude, Berlin) · Bundesrat · Bundesgesetzblatt · przewodniczący Bundestagu.",
  "4 Jahre Wahlperiode · 3 Lesungen · 16 Länder im Bundesrat · 3 bis 6 Stimmen je Land.":
    "4 lata kadencji · 3 czytania · 16 krajów w Bundesracie · od 3 do 6 głosów na kraj.",
  "Budgetrecht · Zustimmungsgesetz · Einspruchsgesetz · Ausfertigung · Untersuchungsausschuss · Fraktion.":
    "Prawo budżetowe · Zustimmungsgesetz · Einspruchsgesetz · podpisanie ustawy · komisja śledcza · klub poselski.",
  "In einem Satz: Der Bundestag beschließt, der Bundesrat lässt die Länder mitreden, der Bundespräsident unterschreibt — erst dann steht ein Gesetz.":
    "W jednym zdaniu: Bundestag uchwala, Bundesrat daje krajom głos, Bundespräsident podpisuje — dopiero wtedy ustawa istnieje.",

  // ── Government and president ────────────────────────────────────────────
  "Bundesregierung und Bundespräsident": "Bundesregierung i Bundespräsident",
  "Die Regierungsgeschäfte führt der **Bundeskanzler**, das Land nach außen vertritt der **Bundespräsident**. Wer welche Aufgabe hat, ist eine der häufigsten Prüfungsfragen.":
    "Sprawami rządu kieruje **Bundeskanzler**, kraj na zewnątrz reprezentuje **Bundespräsident**. Kto ma które zadanie, to jedno z najczęstszych pytań egzaminacyjnych.",
  "Der Bundeskanzler": "Bundeskanzler",
  "Gewählt vom Bundestag": "Wybierany przez Bundestag",
  "Auf Vorschlag des Bundespräsidenten, ohne Aussprache. Das Volk wählt den Kanzler nicht direkt.":
    "Na wniosek Bundespräsidenta, bez debaty. Naród nie wybiera kanclerza bezpośrednio.",
  "Richtlinienkompetenz": "Richtlinienkompetenz",
  "Der Kanzler bestimmt die Grundlinien der Politik. Innerhalb dieser Linien führt jeder Minister sein Ressort eigenständig.":
    "Kanclerz wyznacza główne kierunki polityki. W ich ramach każdy minister prowadzi swój resort samodzielnie.",
  "Wählt die Minister": "Wybiera ministrów",
  "Der Kanzler schlägt die Bundesminister vor; der Bundespräsident ernennt sie.":
    "Kanclerz proponuje ministrów federalnych; Bundespräsident ich powołuje.",
  "Regierungschef": "Szef rządu",
  "Kanzler und Minister zusammen bilden die Bundesregierung, auch Kabinett genannt.":
    "Kanclerz i ministrowie tworzą razem Bundesregierung, nazywaną też gabinetem.",
  "Das konstruktive Misstrauensvotum": "Konstruktywne wotum nieufności",
  "Der Bundestag kann den Kanzler nur abwählen, indem er **gleichzeitig einen Nachfolger wählt**. Ohne Mehrheit für einen Nachfolger bleibt der Kanzler im Amt.":
    "Bundestag może odwołać kanclerza wyłącznie, **wybierając jednocześnie następcę**. Bez większości dla następcy kanclerz pozostaje na urzędzie.",
  "Warum so kompliziert: In der Weimarer Republik konnten sich Gegner von links und rechts zusammentun, um jede Regierung zu stürzen, ohne sich auf eine neue einigen zu müssen. Das Grundgesetz macht Stürzen ohne Alternative unmöglich.":
    "Dlaczego tak zawile: w Republice Weimarskiej przeciwnicy z lewa i z prawa mogli się połączyć, by obalić każdy rząd, nie musząc uzgodnić nowego. Grundgesetz uniemożliwia obalenie bez alternatywy.",
  "Der Bundespräsident": "Bundespräsident",
  "Staatsoberhaupt": "Głowa państwa",
  "Er vertritt Deutschland nach außen und ist überparteilich.":
    "Reprezentuje Niemcy na zewnątrz i stoi ponad partiami.",
  "Gewählt von der Bundesversammlung": "Wybierany przez Bundesversammlung",
  "Nicht vom Volk. Die Bundesversammlung besteht zur Hälfte aus Bundestagsabgeordneten und zur Hälfte aus Vertretern der Länder.":
    "Nie przez naród. Bundesversammlung składa się w połowie z posłów Bundestagu, a w połowie z przedstawicieli krajów związkowych.",
  "Fünf Jahre": "Pięć lat",
  "Eine einmalige Wiederwahl ist möglich, also höchstens zehn Jahre.":
    "Możliwa jest jedna reelekcja, czyli najwyżej dziesięć lat.",
  "Unterschreibt Gesetze": "Podpisuje ustawy",
  "Er fertigt Gesetze aus, ernennt Minister und Richter und schlägt den Kanzler zur Wahl vor.":
    "Podpisuje ustawy, powołuje ministrów i sędziów oraz zgłasza kandydata na kanclerza.",
  "Der Bundespräsident **regiert nicht**. Er hat keine Richtlinienkompetenz und führt keine Ministerien. Wer sich merkt „Kanzler regiert, Präsident repräsentiert“, beantwortet die meisten dieser Fragen richtig.":
    "Bundespräsident **nie rządzi**. Nie ma Richtlinienkompetenz i nie kieruje ministerstwami. Kto zapamięta „kanclerz rządzi, prezydent reprezentuje”, odpowie poprawnie na większość tych pytań.",
  "Bundeskanzler · Bundespräsident · Bundesversammlung · Kabinett · Bundeskanzleramt · Schloss Bellevue.":
    "Bundeskanzler · Bundespräsident · Bundesversammlung · gabinet · Bundeskanzleramt · Schloss Bellevue.",
  "Bundespräsident: 5 Jahre, einmal wiederwählbar, also maximal 10. Kanzler: keine Amtszeitbegrenzung.":
    "Bundespräsident: 5 lat, jedna reelekcja, czyli najwyżej 10. Kanclerz: bez ograniczenia kadencji.",
  "Richtlinienkompetenz · konstruktives Misstrauensvotum · Ressortprinzip · Ausfertigung · überparteilich.":
    "Richtlinienkompetenz · konstruktywne wotum nieufności · zasada resortowa · podpisanie ustawy · ponadpartyjność.",
  "In einem Satz: Der Kanzler bestimmt die Politik und ist nur mit einem Nachfolger abwählbar; der Präsident steht über den Parteien und unterschreibt.":
    "W jednym zdaniu: kanclerz wyznacza politykę i można go odwołać tylko wraz z wyborem następcy; prezydent stoi ponad partiami i podpisuje.",

  // ── Elections and parties ───────────────────────────────────────────────
  "Wahlen und Parteien": "Wybory i partie",
  "„Alle Staatsgewalt geht vom Volke aus“ — praktisch heißt das: durch Wahlen. Wie in Deutschland gewählt wird, ist ein Prüfungsthema mit festen Vokabeln.":
    "„Alle Staatsgewalt geht vom Volke aus” — wszelka władza pochodzi od narodu, a w praktyce znaczy to: przez wybory. Sposób głosowania w Niemczech to temat egzaminacyjny ze stałym słownictwem.",
  "Die fünf Wahlgrundsätze": "Pięć zasad wyborczych",
  "Allgemein": "Powszechne",
  "Alle Staatsbürger ab 18 dürfen wählen, unabhängig von Einkommen, Geschlecht oder Bildung.":
    "Głosować mogą wszyscy obywatele od 18. roku życia, niezależnie od dochodu, płci czy wykształcenia.",
  "Unmittelbar": "Bezpośrednie",
  "Die Stimmen gehen direkt an die Kandidaten, nicht über Wahlmänner.":
    "Głosy trafiają wprost do kandydatów, bez elektorów.",
  "Frei": "Wolne",
  "Niemand darf zur Wahl oder zu einer bestimmten Stimme gezwungen werden.":
    "Nikogo nie wolno zmuszać do głosowania ani do oddania określonego głosu.",
  "Gleich": "Równe",
  "Jede Stimme zählt gleich viel.": "Każdy głos waży tyle samo.",
  "Geheim": "Tajne",
  "Niemand darf sehen, was du wählst. Deshalb die Wahlkabine.":
    "Nikt nie może zobaczyć, na kogo głosujesz. Stąd kabina do głosowania.",
  "Merke die Reihenfolge **allgemein, unmittelbar, frei, gleich, geheim** — sie steht so in Artikel 38 des Grundgesetzes und wird oft im Wortlaut abgefragt.":
    "Zapamiętaj kolejność **allgemein, unmittelbar, frei, gleich, geheim** — tak brzmi artykuł 38 Grundgesetz i często pyta się o nią dosłownie.",
  "Erststimme und Zweitstimme": "Erststimme i Zweitstimme",
  "Bei der Bundestagswahl hat man **zwei Stimmen**. Die **Erststimme** wählt eine Person aus dem eigenen Wahlkreis. Die **Zweitstimme** wählt eine Partei — und sie entscheidet darüber, wie stark eine Partei im Bundestag wird. Deshalb ist die Zweitstimme die wichtigere.":
    "W wyborach do Bundestagu ma się **dwa głosy**. **Erststimme** wybiera osobę z własnego okręgu. **Zweitstimme** wybiera partię — i to on decyduje, jak silna będzie partia w Bundestagu. Dlatego Zweitstimme jest ważniejszy.",
  "Die Fünf-Prozent-Hürde": "Próg pięcioprocentowy",
  "In den Bundestag zieht nur ein, wer mindestens **fünf Prozent** der Zweitstimmen erreicht (oder mehrere Wahlkreise direkt gewinnt). Das soll verhindern, dass sehr viele Kleinstparteien das Parlament unregierbar machen — auch das eine Lehre aus der Weimarer Republik.":
    "Do Bundestagu wchodzi tylko ten, kto uzyska co najmniej **pięć procent** głosów Zweitstimme (albo wygra bezpośrednio w kilku okręgach). Ma to zapobiec sytuacji, w której mnóstwo małych partii czyni parlament niezdolnym do rządzenia — to również nauka z Republiki Weimarskiej.",
  "Wer darf wählen?": "Kto może głosować?",
  "Bundestagswahl": "Wybory do Bundestagu",
  "Deutsche Staatsangehörige ab 18 Jahren.": "Obywatele niemieccy od 18. roku życia.",
  "Kommunalwahl": "Wybory samorządowe",
  "In vielen Ländern dürfen auch EU-Bürger mitwählen, die dort wohnen.":
    "W wielu krajach związkowych mogą głosować także mieszkający tam obywatele UE.",
  "Europawahl": "Wybory europejskie",
  "EU-Bürger wählen dort, wo sie leben — auch ohne deutschen Pass.":
    "Obywatele UE głosują tam, gdzie mieszkają — także bez niemieckiego paszportu.",
  "Nach der Einbürgerung": "Po nadaniu obywatelstwa",
  "Mit der deutschen Staatsangehörigkeit kommt das volle Wahlrecht bei allen Wahlen.":
    "Wraz z obywatelstwem niemieckim przychodzi pełne prawo wyborcze we wszystkich wyborach.",
  "Bundeswahlleiter · Wahlkreis · Wahlkabine · Wahlbenachrichtigung.":
    "Bundeswahlleiter · okręg wyborczy · kabina do głosowania · zawiadomienie o wyborach.",
  "Wahlrecht ab 18 · 2 Stimmen · 5-Prozent-Hürde · alle 4 Jahre.":
    "Prawo wyborcze od 18 lat · 2 głosy · próg 5 procent · co 4 lata.",
  "allgemein, unmittelbar, frei, gleich, geheim · Erststimme · Zweitstimme · Koalition · Opposition · Fraktion.":
    "allgemein, unmittelbar, frei, gleich, geheim · Erststimme · Zweitstimme · koalicja · opozycja · klub poselski.",
  "In einem Satz: Zwei Stimmen, fünf Grundsätze, fünf Prozent — und die Zweitstimme entscheidet über die Machtverhältnisse.":
    "W jednym zdaniu: dwa głosy, pięć zasad, pięć procent — a o układzie sił decyduje Zweitstimme.",

  // ── Federalism ──────────────────────────────────────────────────────────
  "Föderalismus und Bundesländer": "Federalizm i kraje związkowe",
  "Deutschland ist ein **Bundesstaat**: Es gibt eine Ebene für das ganze Land — den Bund — und **16 Bundesländer**, die eigene Regierungen, eigene Parlamente und eigene Zuständigkeiten haben. Wer wofür zuständig ist, wird regelmäßig gefragt.":
    "Niemcy są **państwem federalnym**: istnieje szczebel ogólnokrajowy — federacja — oraz **16 krajów związkowych** z własnymi rządami, parlamentami i kompetencjami. O to, kto za co odpowiada, pyta się regularnie.",
  "Wer macht was?": "Kto czym się zajmuje?",
  "Aufgaben des Bundes": "Zadania federacji",
  "Außenpolitik · Verteidigung und Bundeswehr · Staatsangehörigkeit · Währung · Bundesautobahnen · Luftverkehr · Post und Telekommunikation.":
    "Polityka zagraniczna · obrona i Bundeswehra · obywatelstwo · waluta · autostrady federalne · lotnictwo · poczta i telekomunikacja.",
  "Aufgaben der Länder": "Zadania krajów związkowych",
  "Schulen und Hochschulen · Polizei · Kultur · Rundfunk · Kommunalrecht · Bauordnung. Deshalb sieht Schule in Bayern anders aus als in Hamburg.":
    "Szkoły i uczelnie · policja · kultura · media publiczne · prawo samorządowe · prawo budowlane. Dlatego szkoła w Bawarii wygląda inaczej niż w Hamburgu.",
  "**Bildung ist Ländersache** — das ist eine der meistgestellten Fragen überhaupt. Auch die **Polizei** ist grundsätzlich Ländersache; nur die Bundespolizei ist Sache des Bundes.":
    "**Edukacja jest sprawą krajów związkowych** — to jedno z najczęściej zadawanych pytań w ogóle. Również **policja** należy co do zasady do krajów; tylko Bundespolizei podlega federacji.",
  "Die 16 Bundesländer": "Szesnaście krajów związkowych",
  "Dreizehn Flächenländer und drei **Stadtstaaten**: Berlin, Hamburg und Bremen. Jedes Land hat eine Landesregierung mit einem **Ministerpräsidenten** an der Spitze — in den Stadtstaaten heißt er **Regierender Bürgermeister** (Berlin), **Erster Bürgermeister** (Hamburg) oder **Bürgermeister und Präsident des Senats** (Bremen).":
    "Trzynaście krajów terytorialnych i trzy **miasta-kraje**: Berlin, Hamburg i Brema. Każdy kraj ma rząd krajowy z **Ministerpräsidentem** na czele — w miastach-krajach nosi on tytuł **Regierender Bürgermeister** (Berlin), **Erster Bürgermeister** (Hamburg) lub **Bürgermeister und Präsident des Senats** (Brema).",
  "Landtag": "Landtag",
  "Das Parlament eines Bundeslandes. In Bayern heißt es Landtag, in Bremen und Hamburg Bürgerschaft, in Berlin Abgeordnetenhaus.":
    "Parlament kraju związkowego. W Bawarii nazywa się Landtag, w Bremie i Hamburgu Bürgerschaft, w Berlinie Abgeordnetenhaus.",
  "Landesverfassung": "Konstytucja krajowa",
  "Jedes Land hat eine eigene Verfassung. Sie darf dem Grundgesetz nicht widersprechen.":
    "Każdy kraj ma własną konstytucję. Nie może ona być sprzeczna z Grundgesetz.",
  "Gemeinden": "Gminy",
  "Unterhalb der Länder gibt es Städte, Gemeinden und Landkreise mit eigener Selbstverwaltung — Kita, Müll, Bebauungspläne, Bürgerbüro.":
    "Poniżej krajów są miasta, gminy i powiaty z własnym samorządem — przedszkola, odpady, plany zabudowy, biuro obsługi mieszkańców.",
  "Warum überhaupt Föderalismus?": "Po co w ogóle federalizm?",
  "Macht wird nicht nur auf drei Gewalten verteilt, sondern zusätzlich auf zwei Ebenen. Das erschwert es, den Staat von einer Stelle aus zu übernehmen — und regionale Unterschiede bleiben erhalten. Historisch knüpft es an die vielen deutschen Einzelstaaten vor 1871 an.":
    "Władzę dzieli się nie tylko na trzy gałęzie, ale dodatkowo na dwa szczeble. Utrudnia to przejęcie państwa z jednego miejsca — a różnice regionalne zostają zachowane. Historycznie nawiązuje to do wielu państewek niemieckich sprzed 1871 roku.",
  "Ministerpräsident · Landtag · Bürgerschaft (Hamburg, Bremen) · Abgeordnetenhaus (Berlin) · Landkreis · Gemeinderat.":
    "Ministerpräsident · Landtag · Bürgerschaft (Hamburg, Brema) · Abgeordnetenhaus (Berlin) · powiat · rada gminy.",
  "16 Bundesländer · 13 Flächenländer · 3 Stadtstaaten · 3 Fragen zum eigenen Bundesland im Test.":
    "16 krajów związkowych · 13 krajów terytorialnych · 3 miasta-kraje · 3 pytania o własny kraj w teście.",
  "Föderalismus · Bundesstaat · Ländersache · kommunale Selbstverwaltung · Landesverfassung.":
    "Federalizm · państwo federalne · sprawa krajów związkowych · samorząd gminny · konstytucja krajowa.",
  "In einem Satz: Der Bund macht Außenpolitik und Geld, die Länder machen Schule und Polizei, die Gemeinden machen den Alltag vor der Haustür.":
    "W jednym zdaniu: federacja zajmuje się polityką zagraniczną i pieniędzmi, kraje szkołą i policją, a gminy codziennością tuż za progiem.",

  // ── Courts ──────────────────────────────────────────────────────────────
  "Rechtssystem und Gerichte": "System prawny i sądy",
  "Im Rechtsstaat ist auch der Staat an das Gesetz gebunden, und **jeder** kann gegen staatliche Entscheidungen klagen. Die Gerichte sind unabhängig: Richter sind nur dem Gesetz unterworfen, niemand darf ihnen sagen, wie sie zu entscheiden haben.":
    "W państwie prawa również państwo jest związane ustawą, a **każdy** może zaskarżyć decyzje państwowe. Sądy są niezawisłe: sędziowie podlegają wyłącznie ustawie, nikt nie może im mówić, jak mają orzekać.",
  "Die fünf Gerichtszweige": "Pięć pionów sądownictwa",
  "Ordentliche Gerichte": "Sądy powszechne",
  "Strafsachen und Streit zwischen Privatpersonen: Amtsgericht, Landgericht, Oberlandesgericht, Bundesgerichtshof.":
    "Sprawy karne i spory między osobami prywatnymi: Amtsgericht, Landgericht, Oberlandesgericht, Bundesgerichtshof.",
  "Arbeitsgerichte": "Sądy pracy",
  "Streit zwischen Arbeitgeber und Arbeitnehmer, etwa bei Kündigungen.":
    "Spory między pracodawcą a pracownikiem, na przykład o wypowiedzenie.",
  "Verwaltungsgerichte": "Sądy administracyjne",
  "Bürger gegen Behörde — Aufenthaltstitel, Baugenehmigung, Bescheide.":
    "Obywatel przeciw urzędowi — tytuł pobytowy, pozwolenie na budowę, decyzje.",
  "Sozialgerichte": "Sądy socjalne",
  "Rente, Krankenversicherung, Bürgergeld.": "Emerytura, ubezpieczenie zdrowotne, Bürgergeld.",
  "Finanzgerichte": "Sądy finansowe",
  "Streit mit dem Finanzamt über Steuern.": "Spory z urzędem skarbowym o podatki.",
  "Das Bundesverfassungsgericht": "Bundesverfassungsgericht",
  "In **Karlsruhe** sitzt das höchste Gericht für Verfassungsfragen. Es kann Gesetze für **verfassungswidrig** erklären, auch wenn Bundestag und Bundesrat sie beschlossen haben. Jede Person kann **Verfassungsbeschwerde** erheben, wenn sie sich in ihren Grundrechten verletzt sieht — nachdem sie den normalen Rechtsweg ausgeschöpft hat.":
    "W **Karlsruhe** mieści się najwyższy sąd do spraw konstytucyjnych. Może uznać ustawy za **niezgodne z konstytucją**, nawet jeśli uchwaliły je Bundestag i Bundesrat. Każdy może wnieść **Verfassungsbeschwerde** — skargę konstytucyjną — jeśli uważa, że naruszono jego prawa podstawowe, po wyczerpaniu zwykłej drogi sądowej.",
  "Grundsätze im Strafverfahren": "Zasady postępowania karnego",
  "Unschuldsvermutung": "Domniemanie niewinności",
  "Bis zur rechtskräftigen Verurteilung gilt jeder als unschuldig.":
    "Do prawomocnego skazania każdy uchodzi za niewinnego.",
  "Recht auf Verteidigung": "Prawo do obrony",
  "Jeder Angeklagte darf einen Anwalt haben; wer ihn nicht bezahlen kann, bekommt Hilfe.":
    "Każdy oskarżony może mieć adwokata; kto nie może za niego zapłacić, otrzyma pomoc.",
  "Keine Strafe ohne Gesetz": "Nie ma kary bez ustawy",
  "Bestraft werden kann nur, was zur Tatzeit bereits strafbar war.":
    "Karać można tylko za to, co w chwili czynu było już zabronione.",
  "Nicht zweimal": "Nie dwa razy",
  "Für dieselbe Tat wird niemand zweimal bestraft.":
    "Za ten sam czyn nikogo nie karze się dwukrotnie.",
  "Häufige Falle: **Niemand darf sich selbst Recht verschaffen.** Auch wer sicher im Recht ist, holt sich sein Geld nicht selbst zurück, sondern geht zum Gericht. Selbstjustiz ist strafbar.":
    "Częsta pułapka: **nikomu nie wolno wymierzać sprawiedliwości samemu.** Nawet kto ma z pewnością rację, nie odbiera sobie pieniędzy sam, lecz idzie do sądu. Samosąd jest karalny.",
  "Bundesverfassungsgericht (Karlsruhe) · Bundesgerichtshof · Amtsgericht · Staatsanwaltschaft · Schöffen.":
    "Bundesverfassungsgericht (Karlsruhe) · Bundesgerichtshof · Amtsgericht · prokuratura · ławnicy.",
  "5 Gerichtszweige · Karlsruhe als Sitz des Verfassungsgerichts.":
    "5 pionów sądownictwa · Karlsruhe jako siedziba sądu konstytucyjnego.",
  "Unabhängigkeit der Richter · Unschuldsvermutung · Verfassungsbeschwerde · Rechtsweg · Selbstjustiz · rechtskräftig.":
    "Niezawisłość sędziów · domniemanie niewinności · Verfassungsbeschwerde · droga sądowa · samosąd · prawomocny.",
  "In einem Satz: Fünf Gerichtszweige für fünf Arten von Streit, ein Verfassungsgericht über allen — und niemand nimmt das Recht in die eigene Hand.":
    "W jednym zdaniu: pięć pionów sądownictwa dla pięciu rodzajów sporów, sąd konstytucyjny ponad wszystkimi — i nikt nie bierze prawa we własne ręce.",

  // ── The welfare state ───────────────────────────────────────────────────
  "Sozialstaat und Sozialversicherung": "Państwo socjalne i ubezpieczenia społeczne",
  "Deutschland ist ein **Sozialstaat**: Krankheit, Alter, Arbeitslosigkeit oder Pflegebedürftigkeit sollen niemanden ins Bodenlose fallen lassen. Getragen wird das vor allem von den **fünf Sozialversicherungen**.":
    "Niemcy są **państwem socjalnym**: choroba, starość, bezrobocie czy potrzeba opieki nie mają pozwolić nikomu spaść w przepaść. Opiera się to przede wszystkim na **pięciu ubezpieczeniach społecznych**.",
  "Die fünf Säulen": "Pięć filarów",
  "Krankenversicherung": "Ubezpieczenie zdrowotne",
  "Zahlt Arzt, Krankenhaus und Medikamente. Für alle Pflicht — gesetzlich oder privat.":
    "Pokrywa lekarza, szpital i leki. Obowiązkowe dla wszystkich — ustawowe lub prywatne.",
  "Rentenversicherung": "Ubezpieczenie emerytalne",
  "Zahlt die Rente im Alter sowie Renten bei Erwerbsminderung und für Hinterbliebene.":
    "Wypłaca emeryturę na starość oraz renty z tytułu niezdolności do pracy i renty rodzinne.",
  "Arbeitslosenversicherung": "Ubezpieczenie na wypadek bezrobocia",
  "Zahlt Arbeitslosengeld und finanziert Weiterbildung und Vermittlung.":
    "Wypłaca zasiłek dla bezrobotnych oraz finansuje szkolenia i pośrednictwo pracy.",
  "Pflegeversicherung": "Ubezpieczenie pielęgnacyjne",
  "Hilft, wenn jemand dauerhaft auf Pflege angewiesen ist. Seit 1995 die jüngste Säule.":
    "Pomaga, gdy ktoś trwale wymaga opieki. Od 1995 roku najmłodszy filar.",
  "Unfallversicherung": "Ubezpieczenie wypadkowe",
  "Bei Arbeitsunfällen und Berufskrankheiten. Sie zahlt allein der Arbeitgeber.":
    "Przy wypadkach przy pracy i chorobach zawodowych. Opłaca je wyłącznie pracodawca.",
  "Vier der fünf Versicherungen zahlen Arbeitgeber und Arbeitnehmer **je zur Hälfte**. Die Ausnahme ist die **Unfallversicherung**: Sie trägt der Arbeitgeber allein. Danach wird gern gefragt.":
    "Cztery z pięciu ubezpieczeń pracodawca i pracownik opłacają **po połowie**. Wyjątkiem jest **ubezpieczenie wypadkowe**: ponosi je sam pracodawca. O to chętnie się pyta.",
  "Das Solidarprinzip": "Zasada solidarności",
  "Die Beiträge richten sich nach dem **Einkommen**, die Leistungen nach dem **Bedarf**. Wer viel verdient, zahlt mehr ein, bekommt bei Krankheit aber nicht mehr Behandlung. Gesunde tragen Kranke, Junge tragen Alte — und umgekehrt, wenn sich das Leben dreht.":
    "Składki zależą od **dochodu**, świadczenia od **potrzeby**. Kto zarabia dużo, wpłaca więcej, ale w chorobie nie dostaje więcej leczenia. Zdrowi utrzymują chorych, młodzi starszych — i odwrotnie, gdy życie się odwróci.",
  "Weitere Hilfen": "Inne świadczenia",
  "Bürgergeld": "Bürgergeld",
  "Grundsicherung für Erwerbsfähige ohne ausreichendes Einkommen.":
    "Podstawowe zabezpieczenie dla zdolnych do pracy bez wystarczającego dochodu.",
  "Kindergeld": "Kindergeld",
  "Monatlich für jedes Kind, unabhängig vom Einkommen der Eltern.":
    "Co miesiąc na każde dziecko, niezależnie od dochodu rodziców.",
  "Elterngeld": "Elterngeld",
  "Ersetzt einen Teil des Einkommens, wenn Eltern nach der Geburt zu Hause bleiben.":
    "Zastępuje część dochodu, gdy rodzice zostają po porodzie w domu.",
  "Wohngeld": "Wohngeld",
  "Zuschuss zur Miete für Haushalte mit geringem Einkommen.":
    "Dopłata do czynszu dla gospodarstw o niskich dochodach.",
  "Krankenkasse · Deutsche Rentenversicherung · Bundesagentur für Arbeit · Jobcenter · Berufsgenossenschaft.":
    "Krankenkasse · Deutsche Rentenversicherung · Bundesagentur für Arbeit · Jobcenter · Berufsgenossenschaft.",
  "5 Sozialversicherungen · Pflegeversicherung seit 1995 · Beiträge je zur Hälfte, außer bei der Unfallversicherung.":
    "5 ubezpieczeń społecznych · ubezpieczenie pielęgnacyjne od 1995 roku · składki po połowie, z wyjątkiem ubezpieczenia wypadkowego.",
  "Solidarprinzip · Sozialversicherung · Bürgergeld · Kindergeld · Elterngeld · Sozialabgaben · Bruttolohn und Nettolohn.":
    "Zasada solidarności · ubezpieczenie społeczne · Bürgergeld · Kindergeld · Elterngeld · składki społeczne · płaca brutto i netto.",
  "In einem Satz: Fünf Versicherungen, nach Einkommen bezahlt und nach Bedarf ausgezahlt — das ist der Sozialstaat im Alltag.":
    "W jednym zdaniu: pięć ubezpieczeń, opłacanych według dochodu i wypłacanych według potrzeby — tak wygląda państwo socjalne na co dzień.",

  // ── Empire and Weimar ───────────────────────────────────────────────────
  "Kaiserreich und Weimarer Republik": "Cesarstwo i Republika Weimarska",
  "Deutschland als Nationalstaat ist jünger als Frankreich oder England. Bis **1871** bestand es aus vielen Einzelstaaten. Was danach kam — Kaiserreich, erste Demokratie, deren Scheitern — erklärt, warum das Grundgesetz so gebaut ist, wie es gebaut ist.":
    "Niemcy jako państwo narodowe są młodsze niż Francja czy Anglia. Do **1871** roku składały się z wielu osobnych państw. To, co nastąpiło potem — cesarstwo, pierwsza demokracja i jej upadek — tłumaczy, dlaczego Grundgesetz jest zbudowany właśnie tak.",
  "1871: die Reichsgründung": "1871: powstanie Rzeszy",
  "Nach dem Krieg gegen Frankreich schlossen sich die deutschen Staaten zum **Deutschen Kaiserreich** zusammen. Der preußische König wurde deutscher Kaiser, **Otto von Bismarck** der erste Reichskanzler. Es gab ein gewähltes Parlament, den Reichstag, aber die Regierung war ihm nicht verantwortlich — der Kanzler diente dem Kaiser.":
    "Po wojnie z Francją państwa niemieckie połączyły się w **Cesarstwo Niemieckie**. Król pruski został cesarzem niemieckim, a **Otto von Bismarck** pierwszym kanclerzem Rzeszy. Istniał wybierany parlament, Reichstag, ale rząd nie był przed nim odpowiedzialny — kanclerz służył cesarzowi.",
  "Bismarck führte in den 1880er Jahren die ersten Sozialversicherungen der Welt ein — Kranken-, Unfall- und Rentenversicherung. Der deutsche Sozialstaat ist damit älter als die deutsche Demokratie.":
    "W latach 80. XIX wieku Bismarck wprowadził pierwsze na świecie ubezpieczenia społeczne — zdrowotne, wypadkowe i emerytalne. Niemieckie państwo socjalne jest zatem starsze niż niemiecka demokracja.",
  "1914–1918: der Erste Weltkrieg": "1914–1918: pierwsza wojna światowa",
  "Der Krieg endete mit der Niederlage Deutschlands. Am **9. November 1918** dankte der Kaiser ab, die Republik wurde ausgerufen. Der **Versailler Vertrag** von 1919 verpflichtete Deutschland zu hohen Reparationen und Gebietsabtretungen — und belastete die junge Demokratie von Anfang an.":
    "Wojna zakończyła się klęską Niemiec. **9 listopada 1918** roku cesarz abdykował i proklamowano republikę. **Traktat wersalski** z 1919 roku zobowiązał Niemcy do wysokich reparacji i oddania terytoriów — i obciążył młodą demokrację od samego początku.",
  "Die Weimarer Republik 1919–1933": "Republika Weimarska 1919–1933",
  "Die erste Demokratie": "Pierwsza demokracja",
  "Die Verfassung wurde 1919 in Weimar beschlossen — daher der Name. Zum ersten Mal durften auch **Frauen wählen**.":
    "Konstytucję uchwalono w 1919 roku w Weimarze — stąd nazwa. Po raz pierwszy głosować mogły także **kobiety**.",
  "Krisen ohne Pause": "Kryzysy bez przerwy",
  "Hyperinflation 1923, dann die Weltwirtschaftskrise ab 1929 mit Millionen Arbeitslosen.":
    "Hiperinflacja w 1923 roku, potem od 1929 roku wielki kryzys z milionami bezrobotnych.",
  "Zersplittertes Parlament": "Rozdrobniony parlament",
  "Viele kleine Parteien, ständig wechselnde Regierungen, keine stabilen Mehrheiten.":
    "Wiele małych partii, ciągle zmieniające się rządy, brak stabilnych większości.",
  "Feinde in der Mitte": "Wrogowie w środku",
  "Extreme von links und rechts lehnten die Demokratie offen ab und stürzten Regierungen, ohne eine neue zu bilden.":
    "Skrajności z lewa i z prawa otwarcie odrzucały demokrację i obalały rządy, nie tworząc nowych.",
  "Aus genau diesen Schwächen zog das Grundgesetz seine Konsequenzen: **Fünf-Prozent-Hürde** gegen die Zersplitterung, **konstruktives Misstrauensvotum** gegen das Stürzen ohne Alternative, **Ewigkeitsklausel** und **Parteiverbot** gegen die Feinde der Demokratie.":
    "Właśnie z tych słabości Grundgesetz wyciągnął wnioski: **próg pięcioprocentowy** przeciw rozdrobnieniu, **konstruktywne wotum nieufności** przeciw obalaniu bez alternatywy, **Ewigkeitsklausel** i **delegalizacja partii** przeciw wrogom demokracji.",
  "Otto von Bismarck · Kaiser Wilhelm II. · Friedrich Ebert (erster Reichspräsident) · Weimarer Verfassung · Versailler Vertrag.":
    "Otto von Bismarck · cesarz Wilhelm II · Friedrich Ebert (pierwszy prezydent Rzeszy) · konstytucja weimarska · traktat wersalski.",
  "1871 Reichsgründung · 1914–1918 Erster Weltkrieg · 9. November 1918 Ausrufung der Republik · 1919 Weimarer Verfassung und Frauenwahlrecht · 1923 Hyperinflation · 1929 Weltwirtschaftskrise.":
    "1871 powstanie Rzeszy · 1914–1918 pierwsza wojna światowa · 9 listopada 1918 proklamowanie republiki · 1919 konstytucja weimarska i prawo wyborcze kobiet · 1923 hiperinflacja · 1929 wielki kryzys.",
  "Kaiserreich · Reichstag · Republik · Reparationen · Hyperinflation · Präsidialkabinett.":
    "Cesarstwo · Reichstag · republika · reparacje · hiperinflacja · gabinet prezydencki.",
  "In einem Satz: Die erste deutsche Demokratie hatte keine Mehrheit hinter sich, die sie verteidigt hätte — und das Grundgesetz ist die Antwort auf jede einzelne dieser Schwachstellen.":
    "W jednym zdaniu: pierwsza niemiecka demokracja nie miała za sobą większości, która by jej broniła — a Grundgesetz jest odpowiedzią na każdą z tych słabości z osobna.",

  // ── National Socialism ──────────────────────────────────────────────────
  "Nationalsozialismus 1933–1945": "Narodowy socjalizm 1933–1945",
  "Am **30. Januar 1933** wurde Adolf Hitler zum Reichskanzler ernannt. Innerhalb weniger Monate war aus der Demokratie eine Diktatur geworden. Wie schnell das ging, gehört zum Pflichtwissen.":
    "**30 stycznia 1933** roku Adolf Hitler został mianowany kanclerzem Rzeszy. W ciągu kilku miesięcy demokracja zmieniła się w dyktaturę. To, jak szybko to poszło, należy do wiedzy obowiązkowej.",
  "Die Machtübernahme Schritt für Schritt": "Przejęcie władzy krok po kroku",
  "30. Januar 1933": "30 stycznia 1933",
  "Hitler wird Reichskanzler — ernannt, nicht durch eine absolute Mehrheit ins Amt gewählt.":
    "Hitler zostaje kanclerzem Rzeszy — mianowany, a nie wybrany bezwzględną większością.",
  "Februar 1933": "Luty 1933",
  "Nach dem Reichstagsbrand werden Grundrechte per Notverordnung außer Kraft gesetzt.":
    "Po pożarze Reichstagu prawa podstawowe zostają zawieszone rozporządzeniem nadzwyczajnym.",
  "März 1933": "Marzec 1933",
  "Das **Ermächtigungsgesetz** erlaubt der Regierung, Gesetze ohne das Parlament zu erlassen. Die Gewaltenteilung ist damit beseitigt.":
    "**Ermächtigungsgesetz** pozwala rządowi wydawać ustawy bez parlamentu. Podział władzy zostaje tym samym zniesiony.",
  "Sommer 1933": "Lato 1933",
  "Alle Parteien außer der NSDAP werden verboten oder lösen sich auf. Gewerkschaften werden zerschlagen.":
    "Wszystkie partie poza NSDAP zostają zdelegalizowane lub rozwiązują się. Związki zawodowe zostają rozbite.",
  "Der Unterschied zur Demokratie in einem Punkt: **eine Partei, keine freien Wahlen, keine unabhängigen Gerichte, keine Meinungsfreiheit.** Wer diese vier Merkmale kennt, erkennt jede Diktaturfrage im Test.":
    "Różnica wobec demokracji w jednym punkcie: **jedna partia, brak wolnych wyborów, brak niezawisłych sądów, brak wolności słowa.** Kto zna te cztery cechy, rozpozna w teście każde pytanie o dyktaturę.",
  "Verfolgung von Anfang an": "Prześladowania od początku",
  "Politische Gegner kamen in **Konzentrationslager**, die schon 1933 eingerichtet wurden. Die **Nürnberger Gesetze** von 1935 nahmen jüdischen Deutschen die Bürgerrechte. In der **Pogromnacht vom 9. November 1938** wurden Synagogen angezündet, Geschäfte zerstört und Menschen ermordet.":
    "Przeciwników politycznych osadzano w **obozach koncentracyjnych**, tworzonych już w 1933 roku. **Ustawy norymberskie** z 1935 roku odebrały niemieckim Żydom prawa obywatelskie. W **noc pogromu 9 listopada 1938** roku podpalano synagogi, niszczono sklepy i mordowano ludzi.",
  "Der Zweite Weltkrieg": "Druga wojna światowa",
  "Am **1. September 1939** überfiel Deutschland Polen; damit begann der Zweite Weltkrieg. Er endete in Europa mit der bedingungslosen Kapitulation am **8. Mai 1945**. Der Krieg kostete weltweit über 50 Millionen Menschen das Leben und ging von Deutschland aus.":
    "**1 września 1939** roku Niemcy napadły na Polskę; tak zaczęła się druga wojna światowa. W Europie zakończyła się bezwarunkową kapitulacją **8 maja 1945** roku. Wojna kosztowała życie ponad 50 milionów ludzi na świecie i wyszła z Niemiec.",
  "Widerstand": "Ruch oporu",
  "Es gab Menschen, die sich wehrten: die Geschwister **Sophie und Hans Scholl** von der Weißen Rose, verhaftet und hingerichtet 1943; **Claus Schenk Graf von Stauffenberg**, dessen Attentat am **20. Juli 1944** scheiterte; Menschen, die Verfolgte versteckten. Sie waren eine Minderheit — aber sie werden geehrt.":
    "Byli ludzie, którzy stawiali opór: rodzeństwo **Sophie i Hans Scholl** z Białej Róży, aresztowani i straceni w 1943 roku; **Claus Schenk Graf von Stauffenberg**, którego zamach **20 lipca 1944** roku się nie powiódł; ludzie ukrywający prześladowanych. Byli mniejszością — ale są czczeni.",
  "Adolf Hitler · NSDAP · Sophie und Hans Scholl (Weiße Rose) · Claus Schenk Graf von Stauffenberg.":
    "Adolf Hitler · NSDAP · Sophie i Hans Scholl (Biała Róża) · Claus Schenk Graf von Stauffenberg.",
  "30. Januar 1933 Machtübernahme · März 1933 Ermächtigungsgesetz · 1935 Nürnberger Gesetze · 9. November 1938 Pogromnacht · 1. September 1939 Kriegsbeginn · 20. Juli 1944 Attentat · 8. Mai 1945 Kapitulation.":
    "30 stycznia 1933 przejęcie władzy · marzec 1933 Ermächtigungsgesetz · 1935 ustawy norymberskie · 9 listopada 1938 noc pogromu · 1 września 1939 wybuch wojny · 20 lipca 1944 zamach · 8 maja 1945 kapitulacja.",
  "Diktatur · Ermächtigungsgesetz · Einparteienstaat · Konzentrationslager · Gleichschaltung · Widerstand.":
    "Dyktatura · Ermächtigungsgesetz · państwo jednopartyjne · obóz koncentracyjny · Gleichschaltung · ruch oporu.",
  "In einem Satz: In weniger als einem halben Jahr wurde eine Demokratie mit ihren eigenen Mitteln abgeschafft — deshalb ist die heutige Demokratie wehrhaft.":
    "W jednym zdaniu: w niecałe pół roku demokrację zniesiono jej własnymi środkami — dlatego dzisiejsza demokracja potrafi się bronić.",

  // ── The Holocaust and responsibility ────────────────────────────────────
  "Holocaust und Verantwortung": "Holokaust i odpowiedzialność",
  "Der **Holocaust** — der Massenmord an den europäischen Juden — ist der Kern dessen, was der Test unter „Verantwortung“ prüft. Nicht als Detailwissen, sondern als Verständnis dafür, warum Deutschland heute so handelt, wie es handelt.":
    "**Holokaust** — masowy mord na europejskich Żydach — jest sednem tego, co test sprawdza pod hasłem „odpowiedzialność”. Nie jako wiedza szczegółowa, lecz jako zrozumienie, dlaczego Niemcy postępują dziś tak, jak postępują.",
  "Was geschah": "Co się wydarzyło",
  "Der Nationalsozialismus ermordete etwa **sechs Millionen Juden**. Ermordet wurden außerdem Sinti und Roma, Menschen mit Behinderung, politische Gegner, Homosexuelle, Kriegsgefangene und Zwangsarbeiter. Der Mord war staatlich organisiert und industriell betrieben — in Vernichtungslagern wie **Auschwitz**.":
    "Narodowy socjalizm zamordował około **sześciu milionów Żydów**. Zamordowano ponadto Sinti i Romów, osoby z niepełnosprawnościami, przeciwników politycznych, osoby homoseksualne, jeńców wojennych i robotników przymusowych. Mord był organizowany przez państwo i prowadzony na skalę przemysłową — w obozach zagłady takich jak **Auschwitz**.",
  "Das **Leugnen des Holocaust** ist in Deutschland eine **Straftat**. Es fällt nicht unter die Meinungsfreiheit. Diese Frage kommt im Test regelmäßig vor.":
    "**Zaprzeczanie Holokaustowi** jest w Niemczech **przestępstwem**. Nie mieści się w wolności słowa. To pytanie pojawia się w teście regularnie.",
  "Wie Deutschland damit umgeht": "Jak Niemcy się z tym mierzą",
  "Erinnern": "Pamięć",
  "Der **27. Januar** — der Tag der Befreiung von Auschwitz 1945 — ist Gedenktag für die Opfer des Nationalsozialismus.":
    "**27 stycznia** — dzień wyzwolenia Auschwitz w 1945 roku — jest dniem pamięci o ofiarach narodowego socjalizmu.",
  "Gedenkstätten": "Miejsca pamięci",
  "Ehemalige Lager wie Dachau, Buchenwald und Bergen-Belsen sind Gedenkstätten. In Berlin steht das Denkmal für die ermordeten Juden Europas.":
    "Dawne obozy, jak Dachau, Buchenwald i Bergen-Belsen, są miejscami pamięci. W Berlinie stoi Pomnik Pomordowanych Żydów Europy.",
  "Entschädigung": "Odszkodowania",
  "Deutschland zahlt seit Jahrzehnten Entschädigungen an Überlebende und deren Nachkommen.":
    "Niemcy od dziesięcioleci wypłacają odszkodowania ocalałym i ich potomkom.",
  "Israel": "Izrael",
  "Aus dieser Geschichte folgt eine besondere Verantwortung Deutschlands gegenüber Israel und gegenüber jüdischem Leben in Deutschland.":
    "Z tej historii wynika szczególna odpowiedzialność Niemiec wobec Izraela i wobec życia żydowskiego w Niemczech.",
  "Die Nürnberger Prozesse": "Procesy norymberskie",
  "1945 und 1946 stellten die Alliierten führende Nationalsozialisten in **Nürnberg** vor Gericht. Zum ersten Mal wurden Staatsführer persönlich für Kriegsverbrechen und Verbrechen gegen die Menschlichkeit zur Verantwortung gezogen — die Grundlage des heutigen Völkerstrafrechts.":
    "W 1945 i 1946 roku alianci postawili czołowych narodowych socjalistów przed sądem w **Norymberdze**. Po raz pierwszy przywódców państwa pociągnięto osobiście do odpowiedzialności za zbrodnie wojenne i zbrodnie przeciw ludzkości — to podstawa dzisiejszego międzynarodowego prawa karnego.",
  "Was daraus für heute folgt": "Co z tego wynika dzisiaj",
  "Antisemitismus, Rassismus und die Verharmlosung des Nationalsozialismus haben in Deutschland keinen Platz — rechtlich nicht und gesellschaftlich nicht. Das Zeigen von NS-Symbolen ist verboten, ebenso die Volksverhetzung.":
    "Antysemityzm, rasizm i umniejszanie narodowego socjalizmu nie mają w Niemczech miejsca — ani prawnie, ani społecznie. Pokazywanie symboli nazistowskich jest zakazane, podobnie jak Volksverhetzung.",
  "Auschwitz · Nürnberger Prozesse · Anne Frank · Denkmal für die ermordeten Juden Europas · Yad Vashem.":
    "Auschwitz · procesy norymberskie · Anne Frank · Pomnik Pomordowanych Żydów Europy · Yad Vashem.",
  "Etwa 6 Millionen ermordete Juden · 27. Januar Gedenktag · 1945/46 Nürnberger Prozesse.":
    "Około 6 milionów zamordowanych Żydów · 27 stycznia dzień pamięci · 1945/46 procesy norymberskie.",
  "Holocaust · Schoah · Antisemitismus · Volksverhetzung · Verbrechen gegen die Menschlichkeit · Erinnerungskultur.":
    "Holokaust · Szoa · antysemityzm · Volksverhetzung · zbrodnie przeciw ludzkości · kultura pamięci.",
  "In einem Satz: Deutschland leugnet diesen Teil seiner Geschichte nicht, sondern hat ihn zur Grundlage seiner Gegenwart gemacht — im Recht, im Gedenken und in der Außenpolitik.":
    "W jednym zdaniu: Niemcy nie zaprzeczają tej części swojej historii, lecz uczyniły z niej fundament teraźniejszości — w prawie, w pamięci i w polityce zagranicznej.",

  // ── Post-war and division ───────────────────────────────────────────────
  "Nachkriegszeit und Teilung": "Okres powojenny i podział",
  "1945 war Deutschland zerstört, besetzt und ohne eigene Regierung. Vier Jahre später standen zwei deutsche Staaten — und die Teilung hielt vierzig Jahre.":
    "W 1945 roku Niemcy były zniszczone, okupowane i bez własnego rządu. Cztery lata później istniały dwa państwa niemieckie — a podział utrzymał się czterdzieści lat.",
  "Die vier Besatzungszonen": "Cztery strefy okupacyjne",
  "Die Siegermächte teilten Deutschland unter sich auf: **USA**, **Großbritannien**, **Frankreich** und die **Sowjetunion**. Berlin wurde ebenfalls in vier Sektoren geteilt, obwohl die Stadt mitten in der sowjetischen Zone lag.":
    "Mocarstwa zwycięskie podzieliły Niemcy między siebie: **USA**, **Wielka Brytania**, **Francja** i **Związek Radziecki**. Berlin również podzielono na cztery sektory, choć miasto leżało pośrodku strefy radzieckiej.",
  "Entnazifizierung": "Denazyfikacja",
  "Nationalsozialisten wurden aus Ämtern entfernt, NS-Organisationen verboten.":
    "Narodowych socjalistów usuwano z urzędów, organizacje nazistowskie zdelegalizowano.",
  "Flucht und Vertreibung": "Ucieczka i wypędzenia",
  "Millionen Deutsche kamen aus den ehemaligen Ostgebieten in den Westen und Osten.":
    "Miliony Niemców przybyły z dawnych ziem wschodnich na zachód i wschód kraju.",
  "Trümmerfrauen": "Trümmerfrauen",
  "Frauen räumten die zerstörten Städte auf — ein Bild, das für den Neuanfang steht.":
    "Kobiety uprzątały zniszczone miasta — obraz, który symbolizuje nowy początek.",
  "Marshallplan": "Plan Marshalla",
  "Ab 1948 halfen die USA dem Westen mit Krediten und Waren beim Wiederaufbau.":
    "Od 1948 roku USA wspierały zachód kredytami i towarami przy odbudowie.",
  "Die Berliner Blockade": "Blokada Berlina",
  "1948 sperrte die Sowjetunion alle Land- und Wasserwege nach West-Berlin. Fast ein Jahr lang versorgten die Westalliierten die Stadt aus der Luft — die **Luftbrücke**. Die Flugzeuge, die im Minutentakt landeten, nannten die Berliner **Rosinenbomber**.":
    "W 1948 roku Związek Radziecki zamknął wszystkie drogi lądowe i wodne do Berlina Zachodniego. Przez niemal rok zachodni alianci zaopatrywali miasto z powietrza — to **most powietrzny**. Samoloty lądujące co minutę berlińczycy nazywali **Rosinenbomber**.",
  "1949: zwei Staaten": "1949: dwa państwa",
  "Bundesrepublik Deutschland": "Republika Federalna Niemiec",
  "Aus den drei Westzonen. Grundgesetz am **23. Mai 1949**. Hauptstadt Bonn. Erster Bundeskanzler: **Konrad Adenauer**. Marktwirtschaft, Westbindung, freie Wahlen.":
    "Z trzech stref zachodnich. Grundgesetz **23 maja 1949** roku. Stolica Bonn. Pierwszy kanclerz: **Konrad Adenauer**. Gospodarka rynkowa, związek z Zachodem, wolne wybory.",
  "Deutsche Demokratische Republik": "Niemiecka Republika Demokratyczna",
  "Aus der sowjetischen Zone, gegründet am **7. Oktober 1949**. Hauptstadt Ost-Berlin. Einparteienherrschaft der SED, Planwirtschaft, Bindung an die Sowjetunion.":
    "Ze strefy radzieckiej, utworzona **7 października 1949** roku. Stolica Berlin Wschodni. Jednopartyjne rządy SED, gospodarka planowa, związek ze Związkiem Radzieckim.",
  "Zwei Daten aus demselben Jahr, die gern vertauscht werden: **23. Mai 1949** Grundgesetz und Bundesrepublik, **7. Oktober 1949** Gründung der DDR.":
    "Dwie daty z tego samego roku, chętnie mylone: **23 maja 1949** Grundgesetz i Republika Federalna, **7 października 1949** powstanie NRD.",
  "Wirtschaftswunder und Gastarbeiter": "Cud gospodarczy i Gastarbeiter",
  "Der Westen erlebte in den 1950er Jahren einen raschen Aufschwung, das **Wirtschaftswunder**. Weil Arbeitskräfte fehlten, wurden ab 1955 Menschen aus Italien, Spanien, Griechenland, der Türkei und weiteren Ländern angeworben — die **Gastarbeiter**. Viele blieben; ihre Familien gehören seit Generationen zu Deutschland.":
    "Zachód przeżył w latach 50. gwałtowny rozkwit, **cud gospodarczy**. Ponieważ brakowało rąk do pracy, od 1955 roku sprowadzano ludzi z Włoch, Hiszpanii, Grecji, Turcji i innych krajów — **Gastarbeiter**. Wielu zostało; ich rodziny od pokoleń należą do Niemiec.",
  "Konrad Adenauer · Ludwig Erhard · SED · Luftbrücke · Rosinenbomber · Marshallplan.":
    "Konrad Adenauer · Ludwig Erhard · SED · most powietrzny · Rosinenbomber · plan Marshalla.",
  "1945 Kriegsende und vier Zonen · 1948/49 Berliner Blockade · 23. Mai 1949 Bundesrepublik · 7. Oktober 1949 DDR · ab 1955 Anwerbung von Gastarbeitern.":
    "1945 koniec wojny i cztery strefy · 1948/49 blokada Berlina · 23 maja 1949 Republika Federalna · 7 października 1949 NRD · od 1955 werbunek Gastarbeiterów.",
  "Besatzungszone · Entnazifizierung · Luftbrücke · Wirtschaftswunder · Soziale Marktwirtschaft · Planwirtschaft · Kalter Krieg.":
    "Strefa okupacyjna · denazyfikacja · most powietrzny · cud gospodarczy · społeczna gospodarka rynkowa · gospodarka planowa · zimna wojna.",
  "In einem Satz: Aus vier Besatzungszonen wurden zwei Staaten mit entgegengesetzten Systemen — und Berlin lag als geteilte Stadt mitten im Osten.":
    "W jednym zdaniu: z czterech stref okupacyjnych powstały dwa państwa o przeciwstawnych ustrojach — a Berlin leżał jako podzielone miasto pośrodku wschodu.",

  // ── Life in the GDR ─────────────────────────────────────────────────────
  "Leben in der DDR": "Życie w NRD",
  "Die DDR nannte sich demokratisch, war es aber nicht. Woran man das erkennt, ist eine typische Testfrage — und zugleich eine gute Wiederholung dessen, was Demokratie ausmacht.":
    "NRD nazywała się demokratyczną, ale nią nie była. Po czym to poznać, to typowe pytanie testowe — a zarazem dobra powtórka tego, czym jest demokracja.",
  "Warum die DDR keine Demokratie war": "Dlaczego NRD nie była demokracją",
  "Eine Partei bestimmte": "Decydowała jedna partia",
  "Die **SED** hatte den Führungsanspruch. Andere Parteien existierten nur als Beiwerk ohne echte Macht.":
    "**SED** rościła sobie prawo do kierowania państwem. Inne partie istniały tylko jako dodatek, bez realnej władzy.",
  "Keine freien Wahlen": "Brak wolnych wyborów",
  "Es gab eine Einheitsliste. Man konnte zustimmen, aber nicht zwischen Alternativen wählen.":
    "Istniała jedna wspólna lista. Można było ją poprzeć, ale nie wybierać między alternatywami.",
  "Keine Meinungsfreiheit": "Brak wolności słowa",
  "Presse und Rundfunk waren staatlich gelenkt. Kritik konnte Beruf, Studienplatz oder Freiheit kosten.":
    "Prasa i media były sterowane przez państwo. Krytyka mogła kosztować pracę, miejsce na studiach albo wolność.",
  "Keine Reisefreiheit": "Brak swobody podróżowania",
  "In den Westen zu reisen war für die meisten Bürger nicht möglich.":
    "Podróż na Zachód była dla większości obywateli niemożliwa.",
  "Die Staatssicherheit": "Służba bezpieczeństwa",
  "Das Ministerium für Staatssicherheit — die **Stasi** — überwachte die eigene Bevölkerung mit Hunderttausenden hauptamtlichen und inoffiziellen Mitarbeitern. Sie las Post, hörte Telefone ab und führte Akten über Millionen Menschen. Diese Akten sind heute einsehbar: Wer will, kann beantragen, die eigene Akte zu lesen.":
    "Ministerstwo Bezpieczeństwa Państwowego — **Stasi** — inwigilowało własnych obywateli przy pomocy setek tysięcy etatowych i nieoficjalnych współpracowników. Czytało listy, podsłuchiwało telefony i prowadziło akta milionów ludzi. Akta te są dziś dostępne: kto chce, może wystąpić o wgląd do własnych.",
  "Die Mauer": "Mur",
  "Weil immer mehr Menschen die DDR verließen, wurde am **13. August 1961** die **Berliner Mauer** gebaut und die innerdeutsche Grenze abgeriegelt. An der Grenze galt der Schießbefehl; bei Fluchtversuchen starben Hunderte Menschen.":
    "Ponieważ NRD opuszczało coraz więcej ludzi, **13 sierpnia 1961** roku zbudowano **mur berliński** i zamknięto granicę wewnątrzniemiecką. Na granicy obowiązywał rozkaz strzelania; przy próbach ucieczki zginęły setki osób.",
  "Die Mauer sollte nicht Feinde draußen halten, sondern die eigene Bevölkerung drinnen. Genau das unterscheidet sie von einer normalen Staatsgrenze.":
    "Mur nie miał zatrzymywać wrogów na zewnątrz, lecz własnych obywateli wewnątrz. Właśnie to odróżnia go od zwykłej granicy państwowej.",
  "Der Aufstand vom 17. Juni 1953": "Powstanie 17 czerwca 1953",
  "Arbeiter in Ost-Berlin und vielen anderen Städten streikten gegen höhere Arbeitsnormen; daraus wurde ein Aufstand gegen die Regierung. Sowjetische Panzer schlugen ihn nieder. In der Bundesrepublik war der 17. Juni bis 1990 der Nationalfeiertag.":
    "Robotnicy w Berlinie Wschodnim i wielu innych miastach strajkowali przeciw podniesionym normom pracy; przerodziło się to w powstanie przeciw rządowi. Stłumiły je radzieckie czołgi. W Republice Federalnej 17 czerwca był do 1990 roku świętem narodowym.",
  "SED · Stasi (Ministerium für Staatssicherheit) · Walter Ulbricht · Erich Honecker · Volkskammer.":
    "SED · Stasi (Ministerstwo Bezpieczeństwa Państwowego) · Walter Ulbricht · Erich Honecker · Volkskammer.",
  "7. Oktober 1949 Gründung · 17. Juni 1953 Aufstand · 13. August 1961 Mauerbau · 9. November 1989 Mauerfall.":
    "7 października 1949 powstanie państwa · 17 czerwca 1953 powstanie robotnicze · 13 sierpnia 1961 budowa muru · 9 listopada 1989 upadek muru.",
  "Einparteienstaat · Planwirtschaft · Einheitsliste · Stasi-Akte · Republikflucht · Schießbefehl.":
    "Państwo jednopartyjne · gospodarka planowa · jedna wspólna lista · akta Stasi · Republikflucht · rozkaz strzelania.",
  "In einem Satz: Eine Partei, gelenkte Wahlen, überwachte Bürger und eine Mauer, die niemanden hinausließ — das ist das Gegenbild zu allem, was in Kapitel 1 steht.":
    "W jednym zdaniu: jedna partia, sterowane wybory, inwigilowani obywatele i mur, który nikogo nie wypuszczał — to przeciwieństwo wszystkiego, co stoi w rozdziale 1.",

  // ── The fall of the Wall and reunification ──────────────────────────────
  "Mauerfall und Wiedervereinigung": "Upadek muru i zjednoczenie",
  "1989 endete die Teilung — nicht durch Krieg, sondern weil Menschen auf die Straße gingen. Diese Ereignisse und ihre Daten gehören zum sichersten Prüfungswissen überhaupt.":
    "W 1989 roku podział się skończył — nie przez wojnę, lecz dlatego, że ludzie wyszli na ulice. Te wydarzenia i ich daty należą do najpewniejszej wiedzy egzaminacyjnej.",
  "Die Friedliche Revolution": "Pokojowa rewolucja",
  "Montagsdemonstrationen": "Demonstracje poniedziałkowe",
  "In **Leipzig** und anderen Städten demonstrierten immer mehr Menschen — friedlich, mit dem Ruf **„Wir sind das Volk“**.":
    "W **Lipsku** i innych miastach demonstrowało coraz więcej ludzi — pokojowo, z okrzykiem **„Wir sind das Volk” — my jesteśmy narodem**.",
  "Ausreisewelle": "Fala wyjazdów",
  "Über Ungarn und die Prager Botschaft verließen Tausende die DDR, als die Nachbarländer ihre Grenzen öffneten.":
    "Przez Węgry i ambasadę w Pradze tysiące osób opuściły NRD, gdy kraje sąsiednie otworzyły granice.",
  "9. November 1989": "9 listopada 1989",
  "Nach einer verwirrenden Pressekonferenz strömten Menschen an die Grenzübergänge. Die **Mauer wurde geöffnet** — ohne einen einzigen Schuss.":
    "Po chaotycznej konferencji prasowej ludzie ruszyli tłumnie do przejść granicznych. **Mur został otwarty** — bez jednego wystrzału.",
  "März 1990": "Marzec 1990",
  "Die ersten **freien Wahlen** in der Geschichte der DDR.":
    "Pierwsze **wolne wybory** w historii NRD.",
  "„Wir sind das Volk“ ist wörtlich Artikel 20 des Grundgesetzes: Alle Staatsgewalt geht vom Volke aus. Die Demonstranten beriefen sich auf ein Prinzip, das ihr Staat nur behauptete.":
    "„Wir sind das Volk” to dosłownie artykuł 20 Grundgesetz: wszelka władza pochodzi od narodu. Demonstranci powołali się na zasadę, którą ich państwo tylko deklarowało.",
  "3. Oktober 1990: die Einheit": "3 października 1990: zjednoczenie",
  "Die DDR trat der Bundesrepublik bei. Aus zwei Staaten wurde einer, aus den **fünf neuen Ländern** — Brandenburg, Mecklenburg-Vorpommern, Sachsen, Sachsen-Anhalt und Thüringen — plus dem wiedervereinigten Berlin wurden die heutigen 16 Bundesländer. Der **3. Oktober** ist seitdem der **Tag der Deutschen Einheit**, der Nationalfeiertag.":
    "NRD przystąpiła do Republiki Federalnej. Z dwóch państw powstało jedno, a z **pięciu nowych krajów** — Brandenburgii, Meklemburgii-Pomorza Przedniego, Saksonii, Saksonii-Anhaltu i Turyngii — oraz zjednoczonego Berlina powstało dzisiejszych 16 krajów związkowych. **3 października** jest odtąd **Dniem Jedności Niemiec**, świętem narodowym.",
  "Nicht verwechseln: Die **Mauer fiel am 9. November 1989**, die **Wiedervereinigung war am 3. Oktober 1990**. Gefeiert wird der 3. Oktober — der 9. November ist auch das Datum der Pogromnacht 1938 und taugt deshalb nicht als Freudentag.":
    "Nie mylić: **mur upadł 9 listopada 1989** roku, **zjednoczenie nastąpiło 3 października 1990** roku. Świętuje się 3 października — 9 listopada to również data nocy pogromu z 1938 roku i dlatego nie nadaje się na dzień radości.",
  "Der Zwei-plus-Vier-Vertrag": "Traktat dwa plus cztery",
  "Die beiden deutschen Staaten und die vier Siegermächte einigten sich 1990 darauf, dass Deutschland die volle Souveränität erhält. Die heutigen Grenzen wurden völkerrechtlich bestätigt. Berlin wurde wieder Hauptstadt; Regierung und Parlament zogen 1999 dorthin.":
    "Oba państwa niemieckie i cztery mocarstwa zwycięskie uzgodniły w 1990 roku, że Niemcy uzyskają pełną suwerenność. Dzisiejsze granice potwierdzono prawnomiędzynarodowo. Berlin ponownie został stolicą; rząd i parlament przeniosły się tam w 1999 roku.",
  "Helmut Kohl · Michail Gorbatschow · Leipziger Montagsdemonstrationen · Nikolaikirche · Zwei-plus-Vier-Vertrag.":
    "Helmut Kohl · Michaił Gorbaczow · lipskie demonstracje poniedziałkowe · Nikolaikirche · traktat dwa plus cztery.",
  "9. November 1989 Mauerfall · März 1990 freie Volkskammerwahl · 3. Oktober 1990 Einheit · 5 neue Bundesländer · 1999 Umzug nach Berlin.":
    "9 listopada 1989 upadek muru · marzec 1990 wolne wybory do Volkskammer · 3 października 1990 zjednoczenie · 5 nowych krajów związkowych · 1999 przeprowadzka do Berlina.",
  "Friedliche Revolution · „Wir sind das Volk“ · Tag der Deutschen Einheit · neue Bundesländer · Souveränität.":
    "Pokojowa rewolucja · „Wir sind das Volk” · Dzień Jedności Niemiec · nowe kraje związkowe · suwerenność.",
  "In einem Satz: Eine Diktatur endete durch friedliche Demonstrationen — und der Nationalfeiertag erinnert nicht an einen Sieg, sondern an eine Vereinigung.":
    "W jednym zdaniu: dyktatura skończyła się przez pokojowe demonstracje — a święto narodowe przypomina nie o zwycięstwie, lecz o zjednoczeniu.",

  // ── Germany in Europe and the world ─────────────────────────────────────
  "Deutschland in Europa und der Welt": "Niemcy w Europie i na świecie",
  "Deutschland ist Teil der **Europäischen Union** — und das ist keine Nebensache, sondern eine direkte Folge der eigenen Geschichte: Wer wirtschaftlich verflochten ist, führt keine Kriege mehr gegeneinander.":
    "Niemcy są częścią **Unii Europejskiej** — i nie jest to sprawa uboczna, lecz bezpośredni skutek własnej historii: kto jest gospodarczo powiązany, ten nie prowadzi już wojen z sąsiadem.",
  "Die Europäische Union": "Unia Europejska",
  "Gründungsidee": "Idea założycielska",
  "Nach dem Zweiten Weltkrieg schlossen sich europäische Staaten zusammen, um Frieden durch Zusammenarbeit zu sichern. Deutschland war von Anfang an dabei.":
    "Po drugiej wojnie światowej państwa europejskie połączyły się, by zapewnić pokój przez współpracę. Niemcy były przy tym od początku.",
  "27 Mitgliedstaaten": "27 państw członkowskich",
  "So viele sind es seit dem Austritt des Vereinigten Königreichs 2020.":
    "Tyle jest ich od wyjścia Wielkiej Brytanii w 2020 roku.",
  "Der Euro": "Euro",
  "Seit **2002** ist der Euro das Bargeld in Deutschland; er löste die D-Mark ab. Nicht alle EU-Staaten haben den Euro.":
    "Od **2002** roku euro jest w Niemczech gotówką; zastąpiło markę. Nie wszystkie państwa UE mają euro.",
  "Alle fünf Jahre wählen die Bürger das **Europäische Parlament** direkt.":
    "Co pięć lat obywatele wybierają bezpośrednio **Parlament Europejski**.",
  "Was die EU im Alltag bedeutet": "Co UE znaczy na co dzień",
  "**Freizügigkeit**: EU-Bürger dürfen in jedem Mitgliedstaat leben und arbeiten. **Offene Grenzen** im Schengen-Raum: Reisen ohne Passkontrolle. **Eine Währung** in weiten Teilen. **Gemeinsame Regeln** für Verbraucherschutz, Produktsicherheit und Datenschutz.":
    "**Swoboda przemieszczania się**: obywatele UE mogą mieszkać i pracować w każdym państwie członkowskim. **Otwarte granice** w strefie Schengen: podróż bez kontroli paszportowej. **Wspólna waluta** na dużym obszarze. **Wspólne przepisy** o ochronie konsumentów, bezpieczeństwie produktów i ochronie danych.",
  "Nicht verwechseln: **Europäische Union** (politischer und wirtschaftlicher Zusammenschluss), **Europarat** (Menschenrechte, viel größer) und **NATO** (Verteidigungsbündnis). Deutschland ist in allen dreien, sie sind aber verschiedene Dinge.":
    "Nie mylić: **Unia Europejska** (związek polityczny i gospodarczy), **Rada Europy** (prawa człowieka, znacznie większa) i **NATO** (sojusz obronny). Niemcy należą do wszystkich trzech, ale to różne rzeczy.",
  "Deutschland international": "Niemcy na arenie międzynarodowej",
  "Vereinte Nationen": "Organizacja Narodów Zjednoczonych",
  "Deutschland ist seit 1973 Mitglied und einer der größten Beitragszahler.":
    "Niemcy są członkiem od 1973 roku i jednym z największych płatników składek.",
  "NATO": "NATO",
  "Die Bundesrepublik trat 1955 bei. Die Bundeswehr ist eine Parlamentsarmee: Über Auslandseinsätze entscheidet der Bundestag.":
    "Republika Federalna przystąpiła w 1955 roku. Bundeswehra jest armią parlamentarną: o misjach zagranicznych decyduje Bundestag.",
  "Entwicklungszusammenarbeit": "Współpraca rozwojowa",
  "Deutschland unterstützt ärmere Länder finanziell und mit Projekten.":
    "Niemcy wspierają uboższe kraje finansowo i przez projekty.",
  "Nachbarn": "Sąsiedzi",
  "Deutschland grenzt an **neun** Staaten — mehr als jedes andere EU-Land.":
    "Niemcy graniczą z **dziewięcioma** państwami — więcej niż którykolwiek inny kraj UE.",
  "Europäische Union · Europäisches Parlament · Europarat · NATO · Vereinte Nationen · Schengen-Raum.":
    "Unia Europejska · Parlament Europejski · Rada Europy · NATO · Organizacja Narodów Zjednoczonych · strefa Schengen.",
  "27 EU-Mitgliedstaaten · Euro-Bargeld seit 2002 · Europawahl alle 5 Jahre · 9 Nachbarländer · NATO-Beitritt 1955 · UN-Mitglied seit 1973.":
    "27 państw członkowskich UE · gotówka euro od 2002 roku · wybory europejskie co 5 lat · 9 krajów sąsiednich · wejście do NATO w 1955 roku · członek ONZ od 1973 roku.",
  "Freizügigkeit · Binnenmarkt · Schengen · Parlamentsarmee · Europäische Integration.":
    "Swoboda przemieszczania się · rynek wewnętrzny · Schengen · armia parlamentarna · integracja europejska.",
  "In einem Satz: Deutschland hat sich nach 1945 bewusst eingebunden statt abgegrenzt — die EU ist Friedenspolitik mit wirtschaftlichen Mitteln.":
    "W jednym zdaniu: po 1945 roku Niemcy świadomie się związały, zamiast odgradzać — UE to polityka pokoju prowadzona środkami gospodarczymi.",

  // ── Geography, cities and symbols ───────────────────────────────────────
  "Geografie, Städte und Symbole": "Geografia, miasta i symbole",
  "Wo Deutschland liegt, wie groß es ist und woran man es erkennt — Landkarte und Staatssymbole liefern eine Reihe sicherer Punkte im Test.":
    "Gdzie leżą Niemcy, jak są duże i po czym je poznać — mapa i symbole państwowe dają w teście szereg pewnych punktów.",
  "Die Eckdaten": "Podstawowe dane",
  "Lage": "Położenie",
  "In der Mitte Europas, mit **neun Nachbarländern**. Im Norden grenzt es an Nord- und Ostsee.":
    "W środku Europy, z **dziewięcioma sąsiadami**. Na północy graniczą z Morzem Północnym i Bałtykiem.",
  "Einwohner": "Ludność",
  "Rund **84 Millionen** — der bevölkerungsreichste Staat der EU.":
    "Około **84 milionów** — najludniejsze państwo UE.",
  "Hauptstadt": "Stolica",
  "**Berlin**, zugleich die größte Stadt mit etwa 3,8 Millionen Einwohnern.":
    "**Berlin**, zarazem największe miasto, liczące około 3,8 miliona mieszkańców.",
  "Größte Städte": "Największe miasta",
  "Nach Berlin folgen **Hamburg**, **München**, **Köln** und **Frankfurt am Main**.":
    "Po Berlinie następują **Hamburg**, **Monachium**, **Kolonia** i **Frankfurt nad Menem**.",
  "Landschaft von Nord nach Süd": "Krajobraz z północy na południe",
  "Im Norden das flache **Norddeutsche Tiefland**, in der Mitte die **Mittelgebirge** wie Harz, Schwarzwald und Erzgebirge, im Süden das Alpenvorland und die **Alpen**. Der höchste Berg ist die **Zugspitze** mit 2.962 Metern in Bayern.":
    "Na północy płaska **Nizina Północnoniemiecka**, w środku **średniogórza** jak Harz, Schwarzwald i Rudawy, na południu Przedgórze Alpejskie i **Alpy**. Najwyższą górą jest **Zugspitze**, 2962 m, w Bawarii.",
  "Der Rhein": "Ren",
  "Der bekannteste Fluss, wichtige Wasserstraße von der Schweiz bis in die Niederlande.":
    "Najbardziej znana rzeka, ważna droga wodna od Szwajcarii po Holandię.",
  "Die Elbe": "Łaba",
  "Fließt von Tschechien über Dresden und Hamburg in die Nordsee.":
    "Płynie z Czech przez Drezno i Hamburg do Morza Północnego.",
  "Die Donau": "Dunaj",
  "Der einzige große Fluss, der nach Osten fließt — bis ins Schwarze Meer.":
    "Jedyna wielka rzeka płynąca na wschód — aż do Morza Czarnego.",
  "Bodensee": "Jezioro Bodeńskie",
  "Der größte See, im Dreiländereck mit Österreich und der Schweiz.":
    "Największe jezioro, na styku granic z Austrią i Szwajcarią.",
  "Die Staatssymbole": "Symbole państwowe",
  "Die **Flagge** ist **schwarz-rot-gold**, in dieser Reihenfolge von oben nach unten. Die Farben stehen seit dem 19. Jahrhundert für Einheit und Freiheit. Das Wappentier ist der **Bundesadler**.":
    "**Flaga** jest **czarno-czerwono-złota**, w tej kolejności od góry do dołu. Barwy od XIX wieku oznaczają jedność i wolność. Godłem jest **Bundesadler**, orzeł federalny.",
  "Die Farbe heißt **Gold**, nicht Gelb — und die Reihenfolge ist von oben nach unten schwarz, rot, gold. Beide Details werden abgefragt.":
    "Barwa nazywa się **złota**, nie żółta — a kolejność od góry to czarna, czerwona, złota. O oba szczegóły się pyta.",
  "Die Nationalhymne": "Hymn państwowy",
  "Gesungen wird die **dritte Strophe** des Liedes der Deutschen von Hoffmann von Fallersleben, die mit **„Einigkeit und Recht und Freiheit“** beginnt. Nur diese Strophe ist Nationalhymne; die erste wird nicht gesungen.":
    "Śpiewa się **trzecią zwrotkę** Lied der Deutschen Hoffmanna von Fallersleben, zaczynającą się od **„Einigkeit und Recht und Freiheit”** — jedność, prawo i wolność. Tylko ta zwrotka jest hymnem; pierwszej się nie śpiewa.",
  "Berlin · Hamburg · München · Köln · Zugspitze · Rhein · Elbe · Donau · Bodensee · Bundesadler.":
    "Berlin · Hamburg · Monachium · Kolonia · Zugspitze · Ren · Łaba · Dunaj · Jezioro Bodeńskie · Bundesadler.",
  "Rund 84 Millionen Einwohner · 16 Bundesländer · 9 Nachbarländer · Zugspitze 2.962 m · 3. Strophe als Hymne.":
    "Około 84 milionów mieszkańców · 16 krajów związkowych · 9 krajów sąsiednich · Zugspitze 2962 m · trzecia zwrotka jako hymn.",
  "schwarz-rot-gold · Bundesadler · Norddeutsches Tiefland · Mittelgebirge · Alpenvorland.":
    "Czarno-czerwono-złota · Bundesadler · Nizina Północnoniemiecka · średniogórza · Przedgórze Alpejskie.",
  "In einem Satz: Flach im Norden, hoch im Süden, schwarz-rot-gold auf der Flagge und die dritte Strophe in der Hymne.":
    "W jednym zdaniu: płasko na północy, wysoko na południu, czarno-czerwono-złota flaga i trzecia zwrotka w hymnie.",

  // ── Religion ────────────────────────────────────────────────────────────
  "Religion und Weltanschauung": "Religia i światopogląd",
  "In Deutschland herrscht **Religionsfreiheit**: Jeder darf glauben, was er möchte, die Religion wechseln oder gar keiner Gemeinschaft angehören. Das steht in Artikel 4 des Grundgesetzes.":
    "W Niemczech obowiązuje **wolność wyznania**: każdy może wierzyć, w co chce, zmienić religię albo nie należeć do żadnej wspólnoty. Stanowi o tym artykuł 4 Grundgesetz.",
  "Was Religionsfreiheit bedeutet": "Co oznacza wolność wyznania",
  "Frei glauben": "Wolność wierzenia",
  "Jede Religion darf ausgeübt werden, solange dabei keine Gesetze gebrochen werden.":
    "Każdą religię można praktykować, dopóki nie łamie się przy tym prawa.",
  "Frei nicht glauben": "Wolność niewierzenia",
  "Niemand muss einer Religion angehören. Auch der Austritt ist jederzeit möglich.":
    "Nikt nie musi należeć do żadnej religii. Wystąpienie jest możliwe w każdej chwili.",
  "Kein Zwang": "Żadnego przymusu",
  "Niemand darf zu einem Glauben gedrängt werden — auch nicht in der eigenen Familie.":
    "Nikogo nie wolno nakłaniać do wiary — także we własnej rodzinie.",
  "Keine Staatsreligion": "Brak religii państwowej",
  "Der Staat ist weltanschaulich neutral und bevorzugt keine Gemeinschaft.":
    "Państwo jest światopoglądowo neutralne i nie faworyzuje żadnej wspólnoty.",
  "Religionsfreiheit hebt keine Gesetze auf. Wenn religiöse Vorstellungen und staatliches Recht in Konflikt geraten — etwa bei Zwangsheirat, Gewalt in der Familie oder der Schulpflicht — gilt das **staatliche Recht**. Danach wird im Test gezielt gefragt.":
    "Wolność wyznania nie uchyla prawa. Gdy wyobrażenia religijne i prawo państwowe wchodzą w konflikt — na przykład przy małżeństwie przymusowym, przemocy w rodzinie czy obowiązku szkolnym — obowiązuje **prawo państwowe**. Test pyta o to celowo.",
  "Religionen in Deutschland": "Religie w Niemczech",
  "Die größten Gruppen sind die **katholische** und die **evangelische** Kirche. Etwa die Hälfte der Bevölkerung gehört heute keiner Religionsgemeinschaft an. Der **Islam** ist die größte nichtchristliche Religion; daneben gibt es jüdische Gemeinden, Buddhisten, Hindus und viele weitere.":
    "Największe grupy to Kościół **katolicki** i **ewangelicki**. Około połowa ludności nie należy dziś do żadnej wspólnoty wyznaniowej. **Islam** jest największą religią niechrześcijańską; obok tego są gminy żydowskie, buddyści, hinduiści i wiele innych.",
  "Religion im Alltag": "Religia na co dzień",
  "Kirchensteuer": "Podatek kościelny",
  "Mitglieder der Kirchen zahlen sie über das Finanzamt. Wer austritt, zahlt sie nicht mehr.":
    "Członkowie kościołów płacą go przez urząd skarbowy. Kto wystąpi, przestaje go płacić.",
  "Religionsunterricht": "Lekcje religii",
  "An staatlichen Schulen ein reguläres Fach. Man kann sich abmelden und stattdessen Ethik belegen.":
    "W szkołach państwowych zwykły przedmiot. Można się wypisać i wybrać zamiast tego etykę.",
  "Feiertage": "Święta",
  "Viele gesetzliche Feiertage sind christlichen Ursprungs — sie gelten für alle, unabhängig vom Glauben.":
    "Wiele ustawowych dni wolnych ma rodowód chrześcijański — obowiązują wszystkich, niezależnie od wiary.",
  "Kopftuch und Symbole": "Chusta i symbole",
  "Religiöse Kleidung ist im Alltag grundsätzlich erlaubt. Für bestimmte Staatsämter gibt es Sonderregeln.":
    "Strój religijny jest na co dzień co do zasady dozwolony. Dla niektórych urzędów państwowych obowiązują szczególne przepisy.",
  "Artikel 4 Grundgesetz · katholische und evangelische Kirche · Zentralrat der Juden · Ethikunterricht.":
    "Artykuł 4 Grundgesetz · Kościół katolicki i ewangelicki · Zentralrat der Juden · lekcje etyki.",
  "Rund die Hälfte ohne Religionszugehörigkeit · zwei große christliche Kirchen · Islam als größte nichtchristliche Religion.":
    "Około połowy bez przynależności wyznaniowej · dwa duże kościoły chrześcijańskie · islam jako największa religia niechrześcijańska.",
  "Religionsfreiheit · weltanschauliche Neutralität · Kirchensteuer · Kirchenaustritt · Toleranz.":
    "Wolność wyznania · neutralność światopoglądowa · podatek kościelny · wystąpienie z kościoła · tolerancja.",
  "In einem Satz: Glauben ist frei, Nichtglauben auch — aber kein Glaube steht über dem Gesetz.":
    "W jednym zdaniu: wiara jest wolna, niewiara również — ale żadna wiara nie stoi ponad prawem.",

  // ── Family and living together ──────────────────────────────────────────
  "Familie und Zusammenleben": "Rodzina i życie razem",
  "Wie Menschen in Deutschland zusammenleben, ist rechtlich klar geregelt — und diese Regeln gehören zu den wichtigsten Testinhalten überhaupt, weil sie den Alltag jedes Einzelnen berühren.":
    "To, jak ludzie w Niemczech żyją razem, jest prawnie jasno uregulowane — a te zasady należą do najważniejszych treści testu, bo dotykają codzienności każdego.",
  "Gleichberechtigung": "Równouprawnienie",
  "**Männer und Frauen sind gleichberechtigt** (Artikel 3 Grundgesetz). Das gilt im Beruf, im Recht und in der Familie. Eine Frau entscheidet selbst über ihre Arbeit, ihr Geld, ihre Kleidung und ihre Beziehungen — dafür braucht sie niemandes Erlaubnis.":
    "**Mężczyźni i kobiety są równouprawnieni** (artykuł 3 Grundgesetz). Dotyczy to pracy, prawa i rodziny. Kobieta sama decyduje o swojej pracy, pieniądzach, ubraniu i relacjach — nie potrzebuje na to niczyjego pozwolenia.",
  "**Gewalt in der Familie ist eine Straftat** — auch zwischen Eheleuten, auch gegenüber Kindern. Die Polizei kann den Gewalttätigen aus der Wohnung weisen. Die Frauenhäuser und das Hilfetelefon helfen rund um die Uhr und vertraulich.":
    "**Przemoc w rodzinie jest przestępstwem** — także między małżonkami, także wobec dzieci. Policja może usunąć sprawcę z mieszkania. Schroniska dla kobiet i telefon zaufania pomagają całą dobę i poufnie.",
  "Ehe und Partnerschaft": "Małżeństwo i związek partnerski",
  "Freiwillig": "Dobrowolnie",
  "Niemand darf zur Ehe gezwungen werden. **Zwangsheirat ist strafbar.**":
    "Nikogo nie wolno zmuszać do małżeństwa. **Małżeństwo przymusowe jest karalne.**",
  "Ab 18": "Od 18 lat",
  "Heiraten darf man mit der Volljährigkeit. Kinderehen werden in Deutschland nicht anerkannt.":
    "Zawrzeć małżeństwo można po osiągnięciu pełnoletności. Małżeństw dzieci Niemcy nie uznają.",
  "Nur eine Ehe": "Tylko jedno małżeństwo",
  "Mehrehe ist verboten. Wer verheiratet ist, kann nicht zusätzlich heiraten.":
    "Wielożeństwo jest zakazane. Kto jest w związku małżeńskim, nie może zawrzeć kolejnego.",
  "Gleichgeschlechtlich": "Pary jednopłciowe",
  "Seit **2017** dürfen auch gleichgeschlechtliche Paare heiraten.":
    "Od **2017** roku mogą zawierać małżeństwa także pary jednopłciowe.",
  "Scheidung": "Rozwód",
  "Eine Ehe kann geschieden werden; in der Regel nach einem **Trennungsjahr**. Über die Scheidung entscheidet ein **Familiengericht**. Geregelt werden dabei auch Unterhalt und das Sorgerecht für gemeinsame Kinder.":
    "Małżeństwo można rozwiązać; z reguły po **roku separacji**. O rozwodzie orzeka **Familiengericht**, sąd rodzinny. Ustala się przy tym także alimenty i władzę rodzicielską nad wspólnymi dziećmi.",
  "Kinder und Eltern": "Dzieci i rodzice",
  "Elternrecht und -pflicht": "Prawo i obowiązek rodziców",
  "Eltern erziehen ihre Kinder — der Staat greift nur ein, wenn das Kindeswohl gefährdet ist.":
    "Rodzice wychowują swoje dzieci — państwo wkracza tylko wtedy, gdy zagrożone jest dobro dziecka.",
  "Gewaltfreie Erziehung": "Wychowanie bez przemocy",
  "Kinder haben ein **Recht auf gewaltfreie Erziehung**. Körperliche Strafen sind verboten.":
    "Dzieci mają **prawo do wychowania bez przemocy**. Kary cielesne są zakazane.",
  "Schulpflicht": "Obowiązek szkolny",
  "Kinder müssen zur Schule gehen. Das gilt für Mädchen genauso wie für Jungen.":
    "Dzieci muszą chodzić do szkoły. Dotyczy to dziewcząt tak samo jak chłopców.",
  "Jugendamt": "Jugendamt",
  "Es hilft Familien in schwierigen Lagen und schützt Kinder vor Vernachlässigung und Gewalt.":
    "Pomaga rodzinom w trudnych sytuacjach i chroni dzieci przed zaniedbaniem i przemocą.",
  "Vielfalt der Lebensformen": "Różnorodność form życia",
  "Familie ist heute vielfältig: Ehepaare mit Kindern, Alleinerziehende, unverheiratete Paare, Patchwork-Familien, gleichgeschlechtliche Paare. Alle diese Formen sind gesellschaftlich anerkannt.":
    "Rodzina jest dziś różnorodna: małżeństwa z dziećmi, osoby samotnie wychowujące, pary niebędące w związku małżeńskim, rodziny patchworkowe, pary jednopłciowe. Wszystkie te formy są społecznie uznawane.",
  "Standesamt · Familiengericht · Jugendamt · Frauenhaus · Hilfetelefon Gewalt gegen Frauen.":
    "Standesamt · Familiengericht · Jugendamt · schronisko dla kobiet · telefon zaufania w sprawie przemocy wobec kobiet.",
  "Heiraten ab 18 · Trennungsjahr vor der Scheidung · gleichgeschlechtliche Ehe seit 2017 · Artikel 3 Gleichberechtigung.":
    "Małżeństwo od 18 lat · rok separacji przed rozwodem · małżeństwa jednopłciowe od 2017 roku · artykuł 3 równouprawnienie.",
  "Gleichberechtigung · Zwangsheirat · gewaltfreie Erziehung · Sorgerecht · Unterhalt · Kindeswohl.":
    "Równouprawnienie · małżeństwo przymusowe · wychowanie bez przemocy · władza rodzicielska · alimenty · dobro dziecka.",
  "In einem Satz: Zusammenleben ist frei gestaltbar, aber Zwang und Gewalt sind es nie — und das gilt innerhalb der Familie genau wie außerhalb.":
    "W jednym zdaniu: życie razem można kształtować swobodnie, ale przymus i przemoc nigdy — i dotyczy to rodziny tak samo jak świata poza nią.",

  // ── Education and training ──────────────────────────────────────────────
  "Bildung und Ausbildung": "Edukacja i kształcenie zawodowe",
  "Bildung ist **Ländersache** — deshalb unterscheiden sich Schulformen, Lehrpläne und Ferien von Bundesland zu Bundesland. Gemeinsam ist allen die **Schulpflicht**.":
    "Edukacja jest **sprawą krajów związkowych** — dlatego typy szkół, programy i ferie różnią się między krajami. Wspólny wszystkim jest **obowiązek szkolny**.",
  "Die Schulpflicht": "Obowiązek szkolny",
  "Alle Kinder müssen zur Schule gehen, in der Regel ab dem sechsten Lebensjahr und für mindestens neun Jahre. Sie gilt für **Mädchen und Jungen gleichermaßen** — auch für den Sport- und Schwimmunterricht. Eltern können sie nicht durch Unterricht zu Hause ersetzen.":
    "Wszystkie dzieci muszą chodzić do szkoły, z reguły od szóstego roku życia i przez co najmniej dziewięć lat. Obowiązek dotyczy **dziewcząt i chłopców tak samo** — również lekcji wychowania fizycznego i pływania. Rodzice nie mogą go zastąpić nauczaniem domowym.",
  "Häufige Testfrage: Ein Vater will seine Tochter nicht am Schwimmunterricht teilnehmen lassen. Die Schulpflicht gilt trotzdem — die Schule sucht nach praktischen Lösungen, aber das Kind bleibt nicht einfach weg.":
    "Częste pytanie testowe: ojciec nie chce, by córka uczestniczyła w lekcjach pływania. Obowiązek szkolny i tak obowiązuje — szkoła szuka praktycznych rozwiązań, ale dziecko po prostu nie zostaje w domu.",
  "Der Weg durch das Schulsystem": "Droga przez system szkolny",
  "Kita": "Kita",
  "Kein Zwang, aber ein Rechtsanspruch ab dem ersten Geburtstag. Gut für die Sprache.":
    "Bez przymusu, ale z roszczeniem prawnym od pierwszych urodzin. Dobre dla języka.",
  "Grundschule": "Szkoła podstawowa",
  "Meist vier Jahre, in einigen Ländern sechs.":
    "Zwykle cztery lata, w niektórych krajach sześć.",
  "Weiterführende Schule": "Szkoła ponadpodstawowa",
  "Hauptschule, Realschule, Gymnasium oder Gesamtschule — je nach Land unterschiedlich benannt.":
    "Hauptschule, Realschule, Gymnasium lub Gesamtschule — nazwy różnią się zależnie od kraju.",
  "Abschlüsse": "Świadectwa",
  "Hauptschulabschluss, Mittlere Reife oder **Abitur**. Das Abitur berechtigt zum Studium.":
    "Hauptschulabschluss, Mittlere Reife albo **Abitur**. Abitur uprawnia do studiów.",
  "Die duale Ausbildung": "Kształcenie dualne",
  "Eine deutsche Besonderheit: Die Berufsausbildung findet an **zwei Orten gleichzeitig** statt — im **Betrieb** und in der **Berufsschule**. Sie dauert meist zwei bis dreieinhalb Jahre, und die Auszubildenden bekommen von Anfang an eine Vergütung. Am Ende steht eine Prüfung vor der Industrie- und Handelskammer oder der Handwerkskammer.":
    "Niemiecka specjalność: nauka zawodu odbywa się **jednocześnie w dwóch miejscach** — w **zakładzie pracy** i w **szkole zawodowej**. Trwa zwykle od dwóch do trzech i pół roku, a uczniowie od początku otrzymują wynagrodzenie. Na końcu jest egzamin przed izbą przemysłowo-handlową lub rzemieślniczą.",
  "Studium und Weiterbildung": "Studia i dokształcanie",
  "Universität": "Uniwersytet",
  "Wissenschaftlich ausgerichtet, mit Promotionsrecht.":
    "O profilu naukowym, z prawem do nadawania doktoratów.",
  "Fachhochschule": "Fachhochschule",
  "Praxisnäher, oft mit Pflichtpraktika in Unternehmen.":
    "Bliższa praktyce, często z obowiązkowymi praktykami w firmach.",
  "BAföG": "BAföG",
  "Staatliche Unterstützung für Studierende und Schüler, deren Eltern das Studium nicht finanzieren können.":
    "Państwowe wsparcie dla studentów i uczniów, których rodzice nie mogą sfinansować nauki.",
  "Volkshochschule": "Volkshochschule",
  "Günstige Kurse für alle — Sprachen, Computer, Integrationskurse, auch der Test „Leben in Deutschland“.":
    "Tanie kursy dla wszystkich — języki, komputery, kursy integracyjne, także test „Leben in Deutschland”.",
  "Abschlüsse aus dem Ausland": "Dyplomy z zagranicy",
  "Wer im Ausland einen Beruf gelernt hat, kann seinen Abschluss **anerkennen** lassen. Für viele Berufe — etwa in der Pflege oder im Handwerk — ist das der Schlüssel zum Arbeitsmarkt. Beratungsstellen helfen beim Verfahren.":
    "Kto zdobył zawód za granicą, może uzyskać **uznanie** swojego dyplomu. Dla wielu zawodów — na przykład w opiece czy rzemiośle — to klucz do rynku pracy. W procedurze pomagają punkty doradcze.",
  "Grundschule · Gymnasium · Berufsschule · Industrie- und Handelskammer · Handwerkskammer · Volkshochschule · BAföG.":
    "Grundschule · Gymnasium · Berufsschule · izba przemysłowo-handlowa · izba rzemieślnicza · Volkshochschule · BAföG.",
  "Schulpflicht ab 6 Jahren, mindestens 9 Jahre · duale Ausbildung 2 bis 3,5 Jahre · Kita-Anspruch ab 1 Jahr.":
    "Obowiązek szkolny od 6 lat, co najmniej 9 lat · kształcenie dualne od 2 do 3,5 roku · prawo do Kita od 1. roku życia.",
  "Ländersache · Schulpflicht · duale Ausbildung · Abitur · Mittlere Reife · Anerkennung ausländischer Abschlüsse.":
    "Sprawa krajów związkowych · obowiązek szkolny · kształcenie dualne · Abitur · Mittlere Reife · uznawanie zagranicznych dyplomów.",
  "In einem Satz: Schule ist Pflicht und Ländersache, und die duale Ausbildung verbindet Betrieb und Berufsschule — ein Modell, um das Deutschland beneidet wird.":
    "W jednym zdaniu: szkoła jest obowiązkiem i sprawą krajów związkowych, a kształcenie dualne łączy zakład pracy ze szkołą zawodową — model, którego Niemcom się zazdrości.",

  // ── Work ────────────────────────────────────────────────────────────────
  "Arbeit und Beruf": "Praca i zawód",
  "Das deutsche Arbeitsrecht schützt Beschäftigte — und wer seine Rechte kennt, gerät seltener in Schwierigkeiten. Im Test geht es um die Grundzüge: Vertrag, Kündigung, Mitbestimmung, Lohn.":
    "Niemieckie prawo pracy chroni zatrudnionych — a kto zna swoje prawa, rzadziej wpada w kłopoty. W teście chodzi o podstawy: umowa, wypowiedzenie, współdecydowanie, płaca.",
  "Der Arbeitsvertrag": "Umowa o pracę",
  "Er regelt Aufgaben, Arbeitszeit, Lohn und Urlaub. **Lass dir den Vertrag immer schriftlich geben** und unterschreibe nichts, was du nicht verstanden hast. Schwarzarbeit — Arbeit ohne Anmeldung und ohne Sozialabgaben — ist strafbar und lässt dich ohne jeden Schutz zurück.":
    "Reguluje zadania, czas pracy, wynagrodzenie i urlop. **Zawsze żądaj umowy na piśmie** i nie podpisuj niczego, czego nie rozumiesz. Praca na czarno — bez zgłoszenia i bez składek — jest karalna i zostawia cię bez jakiejkolwiek ochrony.",
  "Deine wichtigsten Rechte": "Twoje najważniejsze prawa",
  "Mindestlohn": "Płaca minimalna",
  "Es gibt einen gesetzlichen Mindestlohn pro Stunde, der regelmäßig angepasst wird. Weniger darf niemand zahlen.":
    "Istnieje ustawowa płaca minimalna za godzinę, regularnie waloryzowana. Nikomu nie wolno płacić mniej.",
  "Urlaub": "Urlop",
  "Mindestens **20 Tage** im Jahr bei einer Fünf-Tage-Woche. Viele Verträge geben mehr.":
    "Co najmniej **20 dni** w roku przy pięciodniowym tygodniu pracy. Wiele umów daje więcej.",
  "Lohnfortzahlung": "Wynagrodzenie w czasie choroby",
  "Bei Krankheit zahlt der Arbeitgeber bis zu **sechs Wochen** weiter. Danach übernimmt die Krankenkasse.":
    "W chorobie pracodawca płaci dalej do **sześciu tygodni**. Potem przejmuje to kasa chorych.",
  "Kündigungsschutz": "Ochrona przed zwolnieniem",
  "Kündigungen brauchen einen Grund und müssen **schriftlich** erfolgen. Fristen sind einzuhalten.":
    "Wypowiedzenie wymaga powodu i musi mieć formę **pisemną**. Terminów należy dochować.",
  "Wer sich gegen eine Kündigung wehren will, hat nur **drei Wochen** Zeit, um beim Arbeitsgericht Klage zu erheben. Diese Frist ist kurz und wird oft verpasst.":
    "Kto chce zakwestionować wypowiedzenie, ma tylko **trzy tygodnie** na wniesienie pozwu do sądu pracy. Termin jest krótki i często się go przegapia.",
  "Mitbestimmung": "Współdecydowanie",
  "Betriebsrat": "Rada zakładowa",
  "Von der Belegschaft gewählt. Er redet bei Arbeitszeiten, Einstellungen und Kündigungen mit.":
    "Wybierana przez załogę. Ma głos w sprawach czasu pracy, zatrudnienia i zwolnień.",
  "Gewerkschaften": "Związki zawodowe",
  "Sie vertreten Arbeitnehmer und handeln **Tarifverträge** über Löhne und Arbeitszeiten aus.":
    "Reprezentują pracowników i negocjują **układy zbiorowe** dotyczące płac i czasu pracy.",
  "Streikrecht": "Prawo do strajku",
  "Streiks sind erlaubt, wenn eine Gewerkschaft dazu aufruft. Niemand darf deswegen gekündigt werden.":
    "Strajki są dozwolone, gdy wzywa do nich związek zawodowy. Nikogo nie wolno z tego powodu zwolnić.",
  "Arbeitgeberverbände": "Związki pracodawców",
  "Sie sind die Gegenseite in den Tarifverhandlungen.":
    "Są drugą stroną w negocjacjach układów zbiorowych.",
  "Vom Brutto zum Netto": "Od brutto do netto",
  "Vom **Bruttolohn** gehen **Lohnsteuer** und **Sozialabgaben** ab; was übrig bleibt, ist das **Netto** auf dem Konto. Die Steuerklasse hängt von der Lebenssituation ab. Einmal im Jahr kann man eine **Steuererklärung** abgeben — häufig gibt es Geld zurück.":
    "Od **płacy brutto** odchodzą **podatek od wynagrodzenia** i **składki społeczne**; to, co zostaje, to **netto** na koncie. Klasa podatkowa zależy od sytuacji życiowej. Raz w roku można złożyć **zeznanie podatkowe** — często dostaje się zwrot.",
  "Betriebsrat · Gewerkschaft · Arbeitsgericht · Agentur für Arbeit · Finanzamt · Tarifvertrag.":
    "Rada zakładowa · związek zawodowy · sąd pracy · Agentur für Arbeit · urząd skarbowy · układ zbiorowy.",
  "Mindestens 20 Urlaubstage · 6 Wochen Lohnfortzahlung · 3 Wochen Frist für die Kündigungsschutzklage.":
    "Co najmniej 20 dni urlopu · 6 tygodni wynagrodzenia w chorobie · 3 tygodnie na pozew przeciw wypowiedzeniu.",
  "Arbeitsvertrag · Mindestlohn · Kündigungsschutz · Schwarzarbeit · brutto und netto · Steuerklasse · Streikrecht.":
    "Umowa o pracę · płaca minimalna · ochrona przed zwolnieniem · praca na czarno · brutto i netto · klasa podatkowa · prawo do strajku.",
  "In einem Satz: Vertrag schriftlich, Kündigung schriftlich, drei Wochen zum Klagen — und ohne Anmeldung gibt es keinen Schutz.":
    "W jednym zdaniu: umowa na piśmie, wypowiedzenie na piśmie, trzy tygodnie na pozew — a bez zgłoszenia nie ma żadnej ochrony.",

  // ── Housing and everyday life ───────────────────────────────────────────
  "Wohnen und Alltag": "Mieszkanie i codzienność",
  "Der deutsche Alltag hat geschriebene und ungeschriebene Regeln. Die geschriebenen kommen im Test vor; die ungeschriebenen ersparen Ärger mit den Nachbarn.":
    "Niemiecka codzienność ma reguły pisane i niepisane. Pisane pojawiają się w teście; niepisane oszczędzają kłopotów z sąsiadami.",
  "Die Wohnung": "Mieszkanie",
  "Mietvertrag": "Umowa najmu",
  "Schriftlich. Er regelt Miete, Nebenkosten, Kündigungsfristen und was in der Wohnung erlaubt ist.":
    "Na piśmie. Reguluje czynsz, opłaty dodatkowe, terminy wypowiedzenia i to, co w mieszkaniu wolno.",
  "Kaution": "Kaucja",
  "Höchstens **drei Monatsmieten**. Du bekommst sie zurück, wenn die Wohnung ordentlich übergeben wird.":
    "Najwyżej **trzy miesięczne czynsze**. Dostajesz ją z powrotem, jeśli mieszkanie zostanie prawidłowo przekazane.",
  "Nebenkosten": "Opłaty dodatkowe",
  "Heizung, Wasser, Müll. Einmal im Jahr wird abgerechnet — mit Nachzahlung oder Guthaben.":
    "Ogrzewanie, woda, odpady. Raz w roku następuje rozliczenie — z dopłatą albo nadpłatą.",
  "Mieterschutz": "Ochrona najemcy",
  "Der Vermieter darf nicht einfach kündigen und nicht ohne Ankündigung die Wohnung betreten.":
    "Wynajmujący nie może po prostu wypowiedzieć umowy ani wejść do mieszkania bez zapowiedzi.",
  "Innerhalb von zwei Wochen nach dem Umzug musst du dich beim **Einwohnermeldeamt anmelden**. Diese **Meldepflicht** ist eine typische Testfrage — und wer sie versäumt, riskiert ein Bußgeld.":
    "W ciągu dwóch tygodni od przeprowadzki musisz się **zameldować w Einwohnermeldeamt**. Ten **obowiązek meldunkowy** to typowe pytanie testowe — kto go zaniedba, ryzykuje grzywnę.",
  "Ruhe und Rücksicht": "Cisza i wzgląd na innych",
  "Zwischen **22 und 6 Uhr** gilt **Nachtruhe**, ebenso meist mittags und den ganzen **Sonntag**. Laute Musik, Bohren oder Waschmaschinen sind dann tabu. **Mülltrennung** ist Pflicht: Papier, Verpackungen, Bioabfall, Restmüll und Glas nach Farben. Auf Flaschen liegt oft **Pfand**, das man im Laden zurückbekommt.":
    "Między **22 a 6** obowiązuje **cisza nocna**, zwykle także w porze obiadowej i przez całą **niedzielę**. Głośna muzyka, wiercenie czy pralka są wtedy wykluczone. **Segregacja odpadów** jest obowiązkowa: papier, opakowania, bioodpady, odpady zmieszane i szkło według kolorów. Na butelkach jest często **kaucja**, którą odbiera się w sklepie.",
  "Behörden und Papiere": "Urzędy i dokumenty",
  "Bürgeramt": "Bürgeramt",
  "An- und Ummeldung, Ausweis, Führungszeugnis.":
    "Zameldowanie i przemeldowanie, dowód, zaświadczenie o niekaralności.",
  "Ausländerbehörde": "Ausländerbehörde",
  "Aufenthaltstitel, Verlängerungen, Einbürgerung.":
    "Tytuł pobytowy, przedłużenia, nadanie obywatelstwa.",
  "Finanzamt": "Urząd skarbowy",
  "Steuer-Identifikationsnummer und Steuererklärung.":
    "Numer identyfikacji podatkowej i zeznanie podatkowe.",
  "Termine": "Terminy",
  "Fast überall nötig und oft Wochen im Voraus zu buchen. Pünktlichkeit wird erwartet.":
    "Potrzebne niemal wszędzie i często rezerwowane z wielotygodniowym wyprzedzeniem. Oczekuje się punktualności.",
  "Unterwegs": "W drodze",
  "Im Nahverkehr braucht man **vor dem Einsteigen** ein gültiges Ticket; Kontrollen sind unangekündigt und Schwarzfahren kostet. Fahrräder gehören auf den Radweg, nicht auf den Gehweg. Wer Auto fährt, braucht einen in Deutschland gültigen **Führerschein** — ausländische Führerscheine müssen je nach Herkunftsland nach einer Frist umgeschrieben werden.":
    "W komunikacji miejskiej ważny bilet trzeba mieć **przed wejściem**; kontrole są niezapowiedziane, a jazda bez biletu kosztuje. Rowery jeżdżą po ścieżce rowerowej, nie po chodniku. Kto prowadzi auto, potrzebuje **prawa jazdy** ważnego w Niemczech — zagraniczne trzeba, zależnie od kraju pochodzenia, wymienić po upływie terminu.",
  "Einwohnermeldeamt · Bürgeramt · Ausländerbehörde · Mieterverein · Verbraucherzentrale.":
    "Einwohnermeldeamt · Bürgeramt · Ausländerbehörde · stowarzyszenie najemców · centrum konsumenckie.",
  "Anmeldung innerhalb von 2 Wochen · Kaution höchstens 3 Monatsmieten · Nachtruhe 22 bis 6 Uhr.":
    "Zameldowanie w ciągu 2 tygodni · kaucja najwyżej 3 czynsze · cisza nocna od 22 do 6.",
  "Meldepflicht · Kaution · Nebenkosten · Nachtruhe · Mülltrennung · Pfand · Kündigungsfrist.":
    "Obowiązek meldunkowy · kaucja · opłaty dodatkowe · cisza nocna · segregacja odpadów · kaucja za butelki · termin wypowiedzenia.",
  "In einem Satz: Anmelden, Müll trennen, nach 22 Uhr leise sein und Termine einhalten — damit ist der deutsche Alltag zur Hälfte gelernt.":
    "W jednym zdaniu: zameldować się, segregować odpady, po 22 być cicho i dotrzymywać terminów — tym samym niemiecka codzienność jest w połowie opanowana.",

  // ── Health and insurance ────────────────────────────────────────────────
  "Gesundheit und Versicherungen": "Zdrowie i ubezpieczenia",
  "In Deutschland ist die **Krankenversicherung Pflicht** — für alle. Wie das System funktioniert und wohin man im Notfall geht, gehört zum Alltagswissen, das der Test abfragt.":
    "W Niemczech **ubezpieczenie zdrowotne jest obowiązkowe** — dla wszystkich. Jak działa system i dokąd iść w nagłym wypadku, należy do wiedzy codziennej, o którą pyta test.",
  "Gesetzlich oder privat": "Ustawowe czy prywatne",
  "Gesetzliche Krankenversicherung": "Ustawowe ubezpieczenie zdrowotne",
  "Für die meisten Beschäftigten Pflicht. Der Beitrag richtet sich nach dem Einkommen. **Kinder und Ehepartner ohne eigenes Einkommen sind kostenlos mitversichert** — die Familienversicherung.":
    "Obowiązkowe dla większości zatrudnionych. Składka zależy od dochodu. **Dzieci i małżonek bez własnego dochodu są ubezpieczeni bezpłatnie** — to Familienversicherung.",
  "Private Krankenversicherung": "Prywatne ubezpieczenie zdrowotne",
  "Möglich für Selbstständige, Beamte und Gutverdiener. Der Beitrag richtet sich nach Alter und Gesundheitszustand, nicht nach dem Einkommen. Jede Person zahlt einzeln.":
    "Możliwe dla samozatrudnionych, urzędników i dobrze zarabiających. Składka zależy od wieku i stanu zdrowia, a nie od dochodu. Każda osoba płaci osobno.",
  "Die **Familienversicherung** ist eine beliebte Prüfungsfrage: In der gesetzlichen Kasse sind Kinder und nicht erwerbstätige Ehepartner beitragsfrei mitversichert. In der privaten gilt das nicht.":
    "**Familienversicherung** to ulubione pytanie egzaminacyjne: w kasie ustawowej dzieci i niepracujący małżonek są ubezpieczeni bez składki. W prywatnej to nie obowiązuje.",
  "Zum Arzt gehen": "Wizyta u lekarza",
  "Hausarzt": "Lekarz rodzinny",
  "Die erste Anlaufstelle bei Beschwerden. Er überweist bei Bedarf zum Facharzt.":
    "Pierwszy adres przy dolegliwościach. W razie potrzeby wystawia skierowanie do specjalisty.",
  "Gesundheitskarte": "Karta ubezpieczenia zdrowotnego",
  "Bei jedem Besuch vorzeigen. Ohne sie musst du unter Umständen selbst zahlen.":
    "Okazuj przy każdej wizycie. Bez niej możesz musieć zapłacić sam.",
  "Krankschreibung": "Zwolnienie lekarskie",
  "Wer krank ist, meldet sich sofort beim Arbeitgeber. Ab wann ein Attest nötig ist, steht im Arbeitsvertrag.":
    "Kto jest chory, zgłasza to pracodawcy natychmiast. Od kiedy potrzebne jest zaświadczenie, mówi umowa o pracę.",
  "Schweigepflicht": "Tajemnica lekarska",
  "Ärzte dürfen nichts weitergeben — auch nicht an den Arbeitgeber. Der erfährt nur, dass du krank bist, nicht warum.":
    "Lekarzom nie wolno niczego przekazywać — także pracodawcy. Ten dowiaduje się tylko, że jesteś chory, a nie dlaczego.",
  "Notfälle": "Nagłe wypadki",
  "Die **112** ist die Nummer für Notarzt und Feuerwehr, die **110** für die Polizei. Beide sind kostenlos und funktionieren von jedem Telefon. Außerhalb der Sprechzeiten hilft der **ärztliche Bereitschaftsdienst unter 116117**; in die Notaufnahme gehört man bei echten Notfällen.":
    "**112** to numer pogotowia i straży pożarnej, **110** policji. Oba są bezpłatne i działają z każdego telefonu. Poza godzinami przyjęć pomaga **lekarski dyżur pod numerem 116117**; na izbę przyjęć idzie się przy prawdziwych nagłych wypadkach.",
  "**112 Feuerwehr und Notarzt, 110 Polizei.** Diese beiden Nummern gehören zum Pflichtwissen — und wer sie ohne Not wählt, macht sich strafbar.":
    "**112 straż pożarna i pogotowie, 110 policja.** Te dwa numery należą do wiedzy obowiązkowej — a kto dzwoni bez potrzeby, popełnia wykroczenie.",
  "Weitere wichtige Versicherungen": "Inne ważne ubezpieczenia",
  "Haftpflicht": "OC w życiu prywatnym",
  "Zahlt Schäden, die du anderen zufügst. Freiwillig, aber dringend zu empfehlen.":
    "Pokrywa szkody, które wyrządzisz innym. Dobrowolne, ale zdecydowanie zalecane.",
  "Hausrat": "Ubezpieczenie mienia",
  "Für Schäden am eigenen Besitz durch Feuer, Wasser oder Einbruch.":
    "Na szkody we własnym mieniu wskutek pożaru, wody lub włamania.",
  "Kfz-Haftpflicht": "OC komunikacyjne",
  "Für jedes Auto **gesetzlich vorgeschrieben**. Ohne sie darf kein Fahrzeug fahren.":
    "Dla każdego auta **wymagane ustawowo**. Bez niego żaden pojazd nie może jeździć.",
  "Berufsunfähigkeit": "Ubezpieczenie od niezdolności do pracy",
  "Sichert das Einkommen, wenn man den Beruf aus gesundheitlichen Gründen nicht mehr ausüben kann.":
    "Zabezpiecza dochód, gdy ze względów zdrowotnych nie można już wykonywać zawodu.",
  "Krankenkasse · Gesundheitskarte · Hausarzt · Notaufnahme · ärztlicher Bereitschaftsdienst.":
    "Kasa chorych · karta ubezpieczenia · lekarz rodzinny · izba przyjęć · lekarski dyżur.",
  "**112** Notarzt und Feuerwehr · **110** Polizei · **116117** Bereitschaftsdienst · 6 Wochen Lohnfortzahlung.":
    "**112** pogotowie i straż pożarna · **110** policja · **116117** dyżur lekarski · 6 tygodni wynagrodzenia w chorobie.",
  "Versicherungspflicht · Familienversicherung · Überweisung · Schweigepflicht · Haftpflicht · Kfz-Haftpflicht.":
    "Obowiązek ubezpieczenia · Familienversicherung · skierowanie · tajemnica lekarska · OC prywatne · OC komunikacyjne.",
  "In einem Satz: Versichert ist jeder, der Hausarzt ist die erste Tür, und 112 ist die Nummer, die man nie vergessen darf.":
    "W jednym zdaniu: ubezpieczony jest każdy, lekarz rodzinny to pierwsze drzwi, a 112 to numer, którego nie wolno zapomnieć.",

  // ── Culture, festivals and media ────────────────────────────────────────
  "Kultur, Feste und Medien": "Kultura, święta i media",
  "Zum Schluss das, was Deutschland im Alltag ausmacht: die Feste im Jahreslauf, die Namen, die jeder kennt, und die Rolle der freien Presse.":
    "Na koniec to, co tworzy niemiecką codzienność: święta w ciągu roku, nazwiska, które zna każdy, i rola wolnej prasy.",
  "Feiertage im Jahreslauf": "Święta w ciągu roku",
  "Ostern": "Wielkanoc",
  "Christliches Fest im Frühjahr. Karfreitag und Ostermontag sind bundesweit frei.":
    "Święto chrześcijańskie na wiosnę. Wielki Piątek i Poniedziałek Wielkanocny są wolne w całym kraju.",
  "1. Mai": "1 maja",
  "**Tag der Arbeit** — Feiertag mit Gewerkschaftskundgebungen.":
    "**Święto Pracy** — dzień wolny z manifestacjami związków zawodowych.",
  "3. Oktober": "3 października",
  "**Tag der Deutschen Einheit**, der Nationalfeiertag.":
    "**Dzień Jedności Niemiec**, święto narodowe.",
  "Weihnachten": "Boże Narodzenie",
  "24. Dezember Heiligabend, 25. und 26. Dezember gesetzliche Feiertage. Davor die Adventszeit mit Weihnachtsmärkten.":
    "24 grudnia Wigilia, 25 i 26 grudnia ustawowe dni wolne. Wcześniej adwent z jarmarkami bożonarodzeniowymi.",
  "Regional kommen weitere hinzu: **Karneval oder Fasching** vor allem im Rheinland und in Bayern, das **Oktoberfest** in München, **Schützenfeste** im Norden, das **Erntedankfest** im Herbst. Welche Feiertage gelten, entscheidet auch hier das Bundesland.":
    "Regionalnie dochodzą kolejne: **karnawał zwany Karneval lub Fasching** przede wszystkim w Nadrenii i Bawarii, **Oktoberfest** w Monachium, **Schützenfeste** na północy, **dożynki** jesienią. O tym, które dni są wolne, i tu decyduje kraj związkowy.",
  "Namen, die man kennt": "Nazwiska, które się zna",
  "Musik und Literatur": "Muzyka i literatura",
  "**Johann Sebastian Bach** und **Ludwig van Beethoven** in der Musik. **Johann Wolfgang von Goethe** und **Friedrich Schiller** in der Literatur; die **Brüder Grimm** sammelten die Märchen.":
    "**Johann Sebastian Bach** i **Ludwig van Beethoven** w muzyce. **Johann Wolfgang von Goethe** i **Friedrich Schiller** w literaturze; **bracia Grimm** zebrali baśnie.",
  "Wissenschaft und Technik": "Nauka i technika",
  "**Albert Einstein** in der Physik, **Johannes Gutenberg** mit dem Buchdruck, **Konrad Zuse** mit dem ersten Computer, **Carl Benz** mit dem Automobil.":
    "**Albert Einstein** w fizyce, **Johannes Gutenberg** z drukiem, **Konrad Zuse** z pierwszym komputerem, **Carl Benz** z automobilem.",
  "Freie Medien": "Wolne media",
  "**Pressefreiheit** steht in Artikel 5 des Grundgesetzes: Medien dürfen die Regierung kritisieren, und **eine Zensur findet nicht statt**. Der **öffentlich-rechtliche Rundfunk** — ARD, ZDF und die Landesrundfunkanstalten — wird über den **Rundfunkbeitrag** jedes Haushalts finanziert, damit er von Staat und Werbekunden unabhängig bleibt.":
    "**Wolność prasy** stoi w artykule 5 Grundgesetz: media mogą krytykować rząd, a **cenzury nie ma**. **Media publiczne** — ARD, ZDF i rozgłośnie krajowe — finansuje **Rundfunkbeitrag**, opłata każdego gospodarstwa domowego, aby pozostały niezależne od państwa i reklamodawców.",
  "Die Frage kommt in vielen Varianten: Darf eine Zeitung die Regierung kritisieren? **Ja.** In der Demokratie ist das ihre Aufgabe — genau darin unterscheidet sie sich von der DDR-Presse und der Gleichschaltung ab 1933.":
    "Pytanie wraca w wielu wariantach: czy gazeta może krytykować rząd? **Tak.** W demokracji to jej zadanie — właśnie tym różni się od prasy NRD i od Gleichschaltung po 1933 roku.",
  "Vereine und Ehrenamt": "Stowarzyszenia i wolontariat",
  "Deutschland ist ein Land der **Vereine**: Sport, Musik, Feuerwehr, Naturschutz, Nachbarschaftshilfe. Millionen Menschen engagieren sich **ehrenamtlich**, also unbezahlt. Für Zugezogene ist der Verein oft der einfachste Weg, Menschen kennenzulernen — und Deutsch zu üben.":
    "Niemcy są krajem **stowarzyszeń**: sport, muzyka, straż pożarna, ochrona przyrody, pomoc sąsiedzka. Miliony ludzi działają **społecznie**, czyli bez wynagrodzenia. Dla przyjezdnych stowarzyszenie to często najprostsza droga, by poznać ludzi — i poćwiczyć niemiecki.",
  "Sport": "Sport",
  "**Fußball** ist die beliebteste Sportart; die Bundesliga spielt von August bis Mai, und die Nationalmannschaft wurde viermal Weltmeister — zuletzt **2014**. Populär sind außerdem Handball, Wintersport und Motorsport.":
    "**Piłka nożna** jest najpopularniejszym sportem; Bundesliga gra od sierpnia do maja, a reprezentacja czterokrotnie zdobyła mistrzostwo świata — ostatnio w **2014** roku. Popularne są też piłka ręczna, sporty zimowe i motorsport.",
  "Goethe · Schiller · Brüder Grimm · Bach · Beethoven · Einstein · Gutenberg · ARD und ZDF.":
    "Goethe · Schiller · bracia Grimm · Bach · Beethoven · Einstein · Gutenberg · ARD i ZDF.",
  "1. Mai Tag der Arbeit · 3. Oktober Nationalfeiertag · 25. und 26. Dezember Weihnachten · Fußball-Weltmeister zuletzt 2014.":
    "1 maja Święto Pracy · 3 października święto narodowe · 25 i 26 grudnia Boże Narodzenie · mistrzostwo świata w piłce nożnej ostatnio w 2014 roku.",
  "Pressefreiheit · Zensurverbot · öffentlich-rechtlicher Rundfunk · Rundfunkbeitrag · Ehrenamt · Verein · Karneval.":
    "Wolność prasy · zakaz cenzury · media publiczne · Rundfunkbeitrag · wolontariat · stowarzyszenie · karnawał.",
  "In einem Satz: Feste sind regional, Medien sind frei, und wer Anschluss sucht, findet ihn im Verein.":
    "W jednym zdaniu: święta są regionalne, media wolne, a kto szuka kontaktu, znajdzie go w stowarzyszeniu.",

  // ── Chapter headings ────────────────────────────────────────────────────
  "Politik in der Demokratie": "Polityka w demokracji",
  "Geschichte und Verantwortung": "Historia i odpowiedzialność",
  "Mensch und Gesellschaft": "Człowiek i społeczeństwo",
};
