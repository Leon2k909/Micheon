/**
 * The C# course, in German.
 *
 * Keyed on the course's own English strings exactly as they appear in
 * csharpCourse.ts, so a key that goes missing degrades to the English line
 * rather than to a blank lesson. See courseTranslation.ts for why a
 * programming course follows the interface language while a language course
 * does not.
 *
 * What is deliberately NOT translated:
 *  - anything inside backticks. `Log.Info()`, `float`, `List<string>` and
 *    `TryGetValue` are what the reader has to type; a translated identifier
 *    would be a lesson teaching code the compiler rejects.
 *  - the names of languages and engines — C#, Python, JavaScript, s&box, LINQ.
 *  - the vocabulary German developers actually use in German. "String",
 *    "Property", "Interface" and "Event" are left alone where translating
 *    them ("Zeichenkette", "Eigenschaft") would teach a word nobody says at
 *    work and would not match the API the reader is about to read.
 * Klasse, Methode, Variable, Schleife, Vererbung and Ausnahme go the other
 * way: those ARE the German words, and leaving them in English would read as
 * laziness rather than as shop talk.
 */
export const CSHARP_COURSE_DE: Record<string, string> = {
  // ── course ────────────────────────────────────────────────────────────────
  "C# for s&box": "C# für s&box",
  "Learn C# from Python, then build games in s&box.":
    "Lerne C# ausgehend von Python und baue dann Spiele in s&box.",
  "Learn C# from JavaScript, then build games in s&box.":
    "Lerne C# ausgehend von JavaScript und baue dann Spiele in s&box.",
  "Learn C# from scratch, then build games in s&box.":
    "Lerne C# von Grund auf und baue dann Spiele in s&box.",

  // ── Variables & types ─────────────────────────────────────────────────────
  "Variables & types": "Variablen & Typen",
  "In Python you write `x = 42` and Python figures out the rest. C# requires you to declare what kind of thing a variable holds — and once declared, that type never changes.":
    "In Python schreibst du `x = 42` und Python macht den Rest. C# verlangt, dass du angibst, was für eine Sorte Wert eine Variable hält — und einmal angegeben, ändert sich dieser Typ nie mehr.",
  "In JavaScript you write `let x = 42` and the variable can later hold anything. C# requires you to declare what kind of thing a variable holds — and once declared, that type never changes.":
    "In JavaScript schreibst du `let x = 42` und die Variable kann später alles Mögliche halten. C# verlangt, dass du angibst, was für eine Sorte Wert eine Variable hält — und einmal angegeben, ändert sich dieser Typ nie mehr.",
  "A variable is a named box that stores a value. In C# you declare what kind of thing the box holds — a number, some text, a true/false — and once declared, that type never changes.":
    "Eine Variable ist eine benannte Schachtel, die einen Wert aufbewahrt. In C# gibst du an, was die Schachtel hält — eine Zahl, etwas Text, ein Wahr/Falsch — und einmal angegeben, ändert sich dieser Typ nie mehr.",
  "From Python: Python is dynamically typed — variables can hold anything. C# is statically typed — every variable has one fixed type decided at compile time. The upside: the compiler catches type errors before your game ever runs.":
    "Aus Python: Python ist dynamisch typisiert — Variablen können alles halten. C# ist statisch typisiert — jede Variable hat genau einen festen Typ, der beim Kompilieren feststeht. Der Vorteil: Der Compiler findet Typfehler, bevor dein Spiel überhaupt läuft.",
  "From JavaScript: JS is dynamically typed — variables can hold anything (and TypeScript types are erased at runtime). C# is statically typed for real — every variable has one fixed type enforced at compile time. The upside: the compiler catches type errors before your game ever runs.":
    "Aus JavaScript: JS ist dynamisch typisiert — Variablen können alles halten (und TypeScript-Typen verschwinden zur Laufzeit). C# ist wirklich statisch typisiert — jede Variable hat genau einen festen Typ, der beim Kompilieren durchgesetzt wird. Der Vorteil: Der Compiler findet Typfehler, bevor dein Spiel überhaupt läuft.",
  "Why types? Every value in C# has a fixed type the compiler knows about. That sounds strict, but it means a whole category of bugs gets caught before your game ever runs.":
    "Wozu Typen? Jeder Wert in C# hat einen festen Typ, den der Compiler kennt. Das klingt streng, bedeutet aber, dass eine ganze Sorte von Fehlern auffliegt, bevor dein Spiel überhaupt läuft.",
  "Declaring variables": "Variablen deklarieren",
  "The pattern is always: type name = value;": "Das Muster ist immer: Typ Name = Wert;",
  "`int` — whole numbers. Use for counts, indexes, scores. `double` / `float` — decimals. Use `float` in s&box for positions and speeds (it's what the engine uses). `decimal` — very precise decimals. Use for money only. `string` — text in double quotes. Immutable. `bool` — `true` or `false` only.":
    "`int` — ganze Zahlen. Für Anzahlen, Indizes, Punktestände. `double` / `float` — Kommazahlen. In s&box nimmst du `float` für Positionen und Geschwindigkeiten (damit rechnet die Engine). `decimal` — sehr genaue Kommazahlen. Nur für Geld. `string` — Text in doppelten Anführungszeichen. Unveränderlich. `bool` — nur `true` oder `false`.",
  "var — let the compiler figure it out": "var — den Compiler entscheiden lassen",
  "The f suffix: Writing `5.0` gives you a `double`. Writing `5.0f` gives you a `float`. S&box uses `float` everywhere for 3D maths, so you'll write `f` a lot.":
    "Das Suffix f: `5.0` ergibt einen `double`. `5.0f` ergibt einen `float`. S&box rechnet in 3D überall mit `float`, du wirst das `f` also oft schreiben.",
  "You write `var x = 3.14f;` — what type is x, and can you later assign `x = \"hello\"`?":
    "Du schreibst `var x = 3.14f;` — welchen Typ hat x, und kannst du später `x = \"hello\"` zuweisen?",
  "x is dynamic — you can assign anything to it": "x ist dynamisch — du kannst ihm alles zuweisen",
  "x is a float — assigning a string would be a compiler error":
    "x ist ein float — einen String zuzuweisen wäre ein Compilerfehler",
  "x has no type until you use it": "x hat keinen Typ, bis du es benutzt",
  "x is a double because of the decimal point": "x ist ein double wegen des Kommas",
  "Static typing pays off in s&box: When you're working with positions (Vector3), rotations, speeds — all floats — the compiler will tell you immediately if you try to assign the wrong type. No runtime surprises mid-game.":
    "Statische Typisierung zahlt sich in s&box aus: Wenn du mit Positionen (Vector3), Rotationen und Geschwindigkeiten arbeitest — alles floats —, sagt dir der Compiler sofort Bescheid, wenn du den falschen Typ zuweist. Keine Überraschungen mitten im Spiel.",

  // ── Null & safety ─────────────────────────────────────────────────────────
  "Null & safety": "Null & Sicherheit",
  "`null` means \"no value\" — not zero, not empty string, but the complete absence of anything. It's one of the most important concepts to understand because null-related crashes are extremely common.":
    "`null` bedeutet „kein Wert“ — nicht null als Zahl, nicht leerer String, sondern das vollständige Fehlen von allem. Das ist eines der wichtigsten Konzepte überhaupt, denn Abstürze wegen null sind ausgesprochen häufig.",
  "Think of a variable as an envelope. Null means the envelope exists but there's nothing inside. If you try to read what's inside an empty envelope, C# crashes — that's a NullReferenceException.":
    "Stell dir eine Variable als Briefumschlag vor. Null heißt: Der Umschlag ist da, aber es ist nichts drin. Wenn du lesen willst, was in einem leeren Umschlag steht, stürzt C# ab — das ist eine NullReferenceException.",
  "S&box uses null constantly. When you reference other components or GameObjects on a class, they might not be set yet. You'll use `?.Length`, `?? defaultValue`, and null checks everywhere. S&box also has its own `.IsValid()` check for GameObjects (covered later) because a destroyed object isn't exactly null — it's invalid.":
    "S&box arbeitet ständig mit null. Wenn eine Klasse andere Komponenten oder GameObjects referenziert, sind die vielleicht noch nicht gesetzt. Du wirst überall `?.Length`, `?? defaultValue` und Null-Prüfungen verwenden. S&box hat für GameObjects außerdem eine eigene Prüfung `.IsValid()` (kommt später), denn ein zerstörtes Objekt ist nicht genau null — es ist ungültig.",
  "What does `player?.Health` do if player is null?": "Was macht `player?.Health`, wenn player null ist?",
  "Crashes with a NullReferenceException": "Stürzt mit einer NullReferenceException ab",
  "Returns null safely — it only accesses Health if player isn't null":
    "Gibt gefahrlos null zurück — auf Health wird nur zugegriffen, wenn player nicht null ist",
  "Returns 0": "Gibt 0 zurück",
  "Won't compile": "Lässt sich nicht kompilieren",
  "In a game, objects get destroyed constantly. A reference to an enemy might become null mid-frame if they die. The `?.` operator is your safety net for this.":
    "In einem Spiel werden ständig Objekte zerstört. Die Referenz auf einen Gegner kann mitten im Frame null werden, wenn er stirbt. Der Operator `?.` ist dein Netz dafür.",

  // ── Control flow ──────────────────────────────────────────────────────────
  "Control flow": "Steuerung des Programmablaufs",
  "Same idea as Python — make decisions, repeat things. C# uses curly braces `{}` instead of indentation, and conditions need parentheses `()`.":
    "Dieselbe Idee wie in Python — entscheiden und wiederholen. C# benutzt geschweifte Klammern `{}` statt Einrückung, und Bedingungen brauchen runde Klammern `()`.",
  "Almost identical to JavaScript — same curly braces `{}`, same parentheses `()` around conditions. Your muscle memory mostly transfers.":
    "Fast identisch zu JavaScript — dieselben geschweiften Klammern `{}`, dieselben runden Klammern `()` um die Bedingung. Dein Muskelgedächtnis kommt größtenteils mit.",
  "Control flow is how a program makes decisions and repeats work. C# wraps each branch in curly braces `{}` and each condition in parentheses `()`.":
    "Über den Programmablauf entscheidet ein Programm, was es tut und was es wiederholt. C# fasst jeden Zweig in geschweifte Klammern `{}` und jede Bedingung in runde Klammern `()`.",
  "In s&box use `Log.Info()` instead of `Console.WriteLine()` — it prints to the s&box developer console (F1 key in game). `Console.WriteLine` still works but output goes somewhere less useful.":
    "Nimm in s&box `Log.Info()` statt `Console.WriteLine()` — das schreibt in die Entwicklerkonsole von s&box (Taste F1 im Spiel). `Console.WriteLine` funktioniert zwar weiterhin, die Ausgabe landet aber an einer weniger nützlichen Stelle.",
  "Switch expression": "Switch-Ausdruck",
  "Loops": "Schleifen",
  "In s&box, what should you use instead of `Console.WriteLine()` to print debug messages?":
    "Was solltest du in s&box statt `Console.WriteLine()` für Debug-Ausgaben verwenden?",
  "S&box has its own logging system. `Log.Info()` writes to the in-game dev console. `Log.Warning()` and `Log.Error()` exist too and show up highlighted.":
    "S&box hat ein eigenes Logging-System. `Log.Info()` schreibt in die Entwicklerkonsole im Spiel. `Log.Warning()` und `Log.Error()` gibt es auch, die werden hervorgehoben angezeigt.",

  // ── Methods ───────────────────────────────────────────────────────────────
  "Methods": "Methoden",
  "Methods are reusable named blocks of code. In C# you declare what type goes in and what type comes out — the compiler enforces this.":
    "Methoden sind benannte Codeblöcke, die du wiederverwendest. In C# gibst du an, welcher Typ hineingeht und welcher herauskommt — der Compiler setzt das durch.",
  "Expression body shorthand": "Kurzform mit Ausdruckskörper",
  "void — nothing returned": "void — nichts wird zurückgegeben",
  "In s&box, the engine calls methods for you — you never write `Main()` or call `OnUpdate()` yourself. You just define them and the engine runs them at the right time. This is the biggest mental shift from normal C#.":
    "In s&box ruft die Engine deine Methoden auf — du schreibst nie `Main()` und rufst `OnUpdate()` nie selbst auf. Du definierst sie nur, und die Engine führt sie zum richtigen Zeitpunkt aus. Das ist die größte Umstellung gegenüber normalem C#.",
  "What does a method signature of `float GetSpeed(float dist, float time)` tell you?":
    "Was sagt dir die Signatur `float GetSpeed(float dist, float time)`?",
  "Nothing — you need to read the body": "Nichts — du musst den Rumpf lesen",
  "It takes two floats and returns a float — you know how to use it without reading the body":
    "Sie nimmt zwei floats und gibt einen float zurück — du weißt, wie du sie benutzt, ohne den Rumpf zu lesen",
  "It returns two values": "Sie gibt zwei Werte zurück",
  "The method is optional": "Die Methode ist optional",
  "Explicit return types mean you can understand any method just from its signature. In a big s&box project with hundreds of methods, this is invaluable.":
    "Ausdrückliche Rückgabetypen bedeuten, dass du jede Methode allein an ihrer Signatur verstehst. In einem großen s&box-Projekt mit Hunderten Methoden ist das Gold wert.",

  // ── Lists ─────────────────────────────────────────────────────────────────
  "Lists": "Listen",
  "Like Python lists, but you declare what type the list holds using angle brackets.":
    "Wie Listen in Python, nur dass du mit spitzen Klammern angibst, was die Liste hält.",
  "Like JavaScript arrays, but you declare what type the list holds using angle brackets.":
    "Wie Arrays in JavaScript, nur dass du mit spitzen Klammern angibst, was die Liste hält.",
  "A List is an ordered collection that grows as you add items. You declare what type it holds using angle brackets.":
    "Eine List ist eine geordnete Sammlung, die mitwächst, während du Einträge hinzufügst. Mit spitzen Klammern gibst du an, was sie hält.",
  "S&box usage: You'll use lists constantly — lists of players, of spawned enemies, of picked-up items. You can also do `Scene.GetAllComponents<Enemy>()` which returns all Enemy components in the scene as an enumerable you can iterate or LINQ query.":
    "In s&box: Du wirst ständig Listen benutzen — Listen von Spielern, von erzeugten Gegnern, von eingesammelten Gegenständen. Es gibt außerdem `Scene.GetAllComponents<Enemy>()`, das alle Enemy-Komponenten der Szene als Enumerable liefert, das du durchlaufen oder mit LINQ abfragen kannst.",
  "What does `List<string>` do that a plain `List` wouldn't?":
    "Was leistet `List<string>`, was ein bloßes `List` nicht leisten würde?",
  "Makes the list alphabetically sorted": "Sortiert die Liste alphabetisch",
  "Tells the compiler only strings are allowed — type mismatches get caught at compile time":
    "Sagt dem Compiler, dass nur Strings erlaubt sind — unpassende Typen fliegen beim Kompilieren auf",
  "Makes the list fixed size": "Gibt der Liste eine feste Größe",
  "There is no plain List in C#": "Ein bloßes List gibt es in C# nicht",
  "In game dev this is huge — a `List<Player>` can only hold Player objects. The compiler stops you from accidentally adding an Enemy to your player list.":
    "In der Spieleentwicklung ist das enorm — eine `List<Player>` kann nur Player-Objekte halten. Der Compiler hindert dich daran, versehentlich einen Enemy in deine Spielerliste zu legen.",

  // ── Dictionaries ──────────────────────────────────────────────────────────
  "Dictionaries": "Dictionaries",
  "Key-value lookup — identical concept to Python dicts, just with explicit types for both key and value.":
    "Nachschlagen über Schlüssel und Wert — dasselbe Konzept wie dicts in Python, nur mit ausdrücklichen Typen für Schlüssel und Wert.",
  "Key-value lookup — like a JS object or `Map`, just with explicit types for both key and value.":
    "Nachschlagen über Schlüssel und Wert — wie ein Objekt oder `Map` in JS, nur mit ausdrücklichen Typen für Schlüssel und Wert.",
  "A Dictionary stores key → value pairs, so you can look up a value instantly by its key — like finding a player's score by their name.":
    "Ein Dictionary speichert Paare aus Schlüssel → Wert, sodass du einen Wert sofort über seinen Schlüssel findest — etwa den Punktestand eines Spielers über seinen Namen.",
  "S&box usage: Dictionaries are great for mapping player connections to player data — e.g. `Dictionary<Connection, PlayerData>` where you look up a player's stats by their network connection.":
    "In s&box: Dictionaries eignen sich hervorragend, um Verbindungen von Spielern auf ihre Daten abzubilden — etwa `Dictionary<Connection, PlayerData>`, wo du die Werte eines Spielers über seine Netzwerkverbindung nachschlägst.",
  "Why use `TryGetValue` instead of `dict[key]`?": "Warum `TryGetValue` statt `dict[key]` benutzen?",
  "TryGetValue is faster": "TryGetValue ist schneller",
  "dict[key] throws an exception if the key doesn't exist — TryGetValue returns false safely":
    "dict[key] wirft eine Ausnahme, wenn es den Schlüssel nicht gibt — TryGetValue gibt gefahrlos false zurück",
  "dict[key] only works with int keys": "dict[key] funktioniert nur mit int-Schlüsseln",
  "No difference": "Kein Unterschied",
  "In a game, a player might disconnect mid-match. If you try to access their data with `dict[connection]` after they've been removed, it crashes the entire game server.":
    "In einem Spiel kann ein Spieler mitten in der Runde die Verbindung verlieren. Greifst du danach mit `dict[connection]` auf seine Daten zu, reißt das den ganzen Spielserver mit.",

  // ── LINQ ──────────────────────────────────────────────────────────────────
  "LINQ": "LINQ",
  "LINQ lets you filter, transform and query collections in readable chained code. Python equivalent: list comprehensions and `filter()`/`map()`.":
    "Mit LINQ filterst, veränderst und durchsuchst du Sammlungen in lesbaren Ketten. Das Gegenstück in Python: List Comprehensions und `filter()`/`map()`.",
  "LINQ lets you filter, transform and query collections in readable chained code. JavaScript equivalent: `filter()`, `map()` and `reduce()` on arrays — LINQ will feel very familiar.":
    "Mit LINQ filterst, veränderst und durchsuchst du Sammlungen in lesbaren Ketten. Das Gegenstück in JavaScript: `filter()`, `map()` und `reduce()` auf Arrays — LINQ wird dir sehr vertraut vorkommen.",
  "LINQ lets you filter, transform and query collections in readable chained code — one of C#'s best features. Read each step like a sentence: \"keep the ones where…\", \"take the name of each…\".":
    "Mit LINQ filterst, veränderst und durchsuchst du Sammlungen in lesbaren Ketten — eine der besten Seiten von C#. Lies jeden Schritt wie einen Satz: „behalte die, bei denen …“, „nimm von jedem den Namen …“.",
  "S&box LINQ example: `Scene.GetAllComponents<Enemy>().Where(e => e.IsAlive).OrderBy(e => e.WorldPosition.Distance(WorldPosition)).FirstOrDefault()` — find the nearest living enemy in one line. This is real code you'll write.":
    "LINQ in s&box: `Scene.GetAllComponents<Enemy>().Where(e => e.IsAlive).OrderBy(e => e.WorldPosition.Distance(WorldPosition)).FirstOrDefault()` — den nächsten lebenden Gegner in einer Zeile finden. Genau solchen Code wirst du schreiben.",
  "What does the lambda `e => e.Health > 0` mean inside `.Where()`?":
    "Was bedeutet das Lambda `e => e.Health > 0` innerhalb von `.Where()`?",
  "Set e's health to 0": "Setze die Health von e auf 0",
  "For each item e in the collection, keep it only if its Health is greater than 0":
    "Behalte jeden Eintrag e der Sammlung nur dann, wenn seine Health größer als 0 ist",
  "Find the first item with health above 0": "Finde den ersten Eintrag mit Health über 0",
  "Count all items with health above 0": "Zähle alle Einträge mit Health über 0",
  "Lambdas are mini functions written inline. `e =>` means \"given e\" and the right side is what you do with it. LINQ + lambdas together are one of C#'s most powerful features.":
    "Lambdas sind Minifunktionen, die du direkt an Ort und Stelle schreibst. `e =>` heißt „gegeben e“, und rechts steht, was damit passiert. LINQ und Lambdas zusammen sind eine der stärksten Seiten von C#.",

  // ── Classes ───────────────────────────────────────────────────────────────
  "Classes": "Klassen",
  "A class is a blueprint — it defines what data (properties) and behaviour (methods) something has. Objects are instances created from that blueprint.":
    "Eine Klasse ist ein Bauplan — sie legt fest, welche Daten (Properties) und welches Verhalten (Methoden) etwas hat. Objekte sind Exemplare, die nach diesem Bauplan entstehen.",
  "A class is like a cookie cutter. The cutter (class) defines the shape. Each cookie you make (object) is a separate instance — same shape, its own data.":
    "Eine Klasse ist wie eine Ausstechform. Die Form (Klasse) gibt die Gestalt vor. Jeder Keks, den du ausstichst (Objekt), ist ein eigenes Exemplar — gleiche Gestalt, eigene Daten.",
  "In s&box, your game logic classes inherit from `Component` — not standalone classes. But you'll still write plain classes like the one above for data structures (player stats, item definitions, game config). The OOP you learn here is directly applied in your components.":
    "In s&box erben deine Spiellogik-Klassen von `Component` — es sind keine alleinstehenden Klassen. Für Datenstrukturen (Spielerwerte, Gegenstandsdefinitionen, Spieleinstellungen) schreibst du trotzdem einfache Klassen wie oben. Die Objektorientierung, die du hier lernst, wendest du direkt in deinen Komponenten an.",
  "Why is Health marked `private set` instead of fully public?":
    "Warum ist Health mit `private set` versehen und nicht komplett öffentlich?",
  "It makes Health faster to access": "Der Zugriff auf Health wird dadurch schneller",
  "Outside code can read Health but only this class can change it — all damage must go through TakeDamage, which enforces rules like not going below 0":
    "Code von außen darf Health lesen, ändern darf es nur diese Klasse — jeder Schaden muss durch TakeDamage, und das setzt Regeln durch, etwa dass der Wert nicht unter 0 fällt",
  "private set makes the property read-only forever": "private set macht die Property für immer schreibgeschützt",
  "The compiler requires it for float properties": "Der Compiler verlangt das bei float-Properties",
  "Encapsulation in games: if Health were fully public, any code could write `player.Health = -9999`. By controlling access through methods, you guarantee the game state stays valid — health never goes below 0, death logic always fires correctly.":
    "Kapselung im Spiel: Wäre Health komplett öffentlich, könnte beliebiger Code `player.Health = -9999` schreiben. Indem du den Zugriff über Methoden führst, bleibt der Spielzustand garantiert gültig — Health fällt nie unter 0, und die Todeslogik greift immer richtig.",

  // ── Inheritance ───────────────────────────────────────────────────────────
  "Inheritance": "Vererbung",
  "Inheritance lets one class build on another — getting all its existing stuff for free, then changing or adding what it needs.":
    "Vererbung lässt eine Klasse auf einer anderen aufbauen — sie bekommt alles Vorhandene geschenkt und ändert oder ergänzt dann, was sie braucht.",
  "In s&box, you already use inheritance constantly — your components inherit from `Component`, which is why they get `OnUpdate()`, `GameObject`, `Transform` etc. for free. Understanding inheritance makes the whole engine model click.":
    "In s&box benutzt du Vererbung längst ständig — deine Komponenten erben von `Component`, und genau deshalb bekommen sie `OnUpdate()`, `GameObject`, `Transform` und so weiter geschenkt. Wer Vererbung verstanden hat, bei dem fällt das ganze Engine-Modell an seinen Platz.",
  "If `Zombie` inherits from `Enemy`, and Enemy has a `Health` property — does Zombie have Health?":
    "Wenn `Zombie` von `Enemy` erbt und Enemy eine Property `Health` hat — hat Zombie dann Health?",
  "No — Zombie needs to define its own Health": "Nein — Zombie muss sein eigenes Health definieren",
  "Yes — Zombie inherits everything from Enemy automatically":
    "Ja — Zombie erbt automatisch alles von Enemy",
  "Only if Health is marked public": "Nur wenn Health als public gekennzeichnet ist",
  "Only if you use the base keyword": "Nur wenn du das Schlüsselwort base benutzt",
  "This is the core benefit of inheritance — shared behaviour is written once in the parent. Adding a new enemy type means you only write what's different, not all the shared code again.":
    "Das ist der eigentliche Gewinn der Vererbung — gemeinsames Verhalten steht einmal in der Elternklasse. Für einen neuen Gegnertyp schreibst du nur noch das Abweichende und nicht den ganzen geteilten Code erneut.",

  // ── Interfaces ────────────────────────────────────────────────────────────
  "Interfaces": "Interfaces",
  "An interface is a contract — \"any class that implements me must have these methods.\" No code inside, just the guarantee.":
    "Ein Interface ist ein Vertrag — „jede Klasse, die mich implementiert, muss diese Methoden haben“. Kein Code darin, nur die Zusage.",
  "S&box uses interfaces throughout its API. For example `IScenePhysicsEvents` lets components respond to physics collisions, and `IGameObjectNetworkEvents` for network events. You'll implement interfaces to hook into engine systems without needing to know how they work internally.":
    "S&box benutzt Interfaces in seiner ganzen API. `IScenePhysicsEvents` lässt Komponenten zum Beispiel auf Zusammenstöße in der Physik reagieren, `IGameObjectNetworkEvents` auf Netzwerkereignisse. Du implementierst Interfaces, um dich in Systeme der Engine einzuklinken, ohne wissen zu müssen, wie sie innen arbeiten.",
  "What's the advantage of coding `ApplyExplosion(IDamageable target)` instead of `ApplyExplosion(Player target)`?":
    "Was ist der Vorteil von `ApplyExplosion(IDamageable target)` gegenüber `ApplyExplosion(Player target)`?",
  "IDamageable is faster": "IDamageable ist schneller",
  "The method works on any damageable thing — players, barrels, vehicles — without needing separate versions for each":
    "Die Methode funktioniert für alles Beschädigbare — Spieler, Fässer, Fahrzeuge — ohne für jedes eine eigene Fassung zu brauchen",
  "It avoids needing to write TakeDamage on each class":
    "Man muss TakeDamage nicht in jeder Klasse schreiben",
  "Interfaces are required for multiplayer": "Interfaces sind für den Mehrspielermodus vorgeschrieben",
  "This is the real power of interfaces in games — write explosion, fire, or fall damage logic once, and it works on everything damageable. Add a new destructible object and it automatically works with all existing damage systems.":
    "Darin liegt die eigentliche Stärke von Interfaces im Spiel — du schreibst die Logik für Explosions-, Feuer- oder Fallschaden einmal, und sie greift bei allem Beschädigbaren. Kommt ein neues zerstörbares Objekt dazu, arbeitet es sofort mit allen vorhandenen Schadenssystemen zusammen.",

  // ── How s&box works ───────────────────────────────────────────────────────
  "How s&box works": "Wie s&box funktioniert",
  "Now that you know C#, here's how s&box uses it. The whole engine is built around three concepts:":
    "Jetzt, wo du C# kannst, hier, wie s&box es einsetzt. Die ganze Engine ruht auf drei Begriffen:",
  "Scene": "Scene",
  "The entire playable world — all objects, lights, and gameplay elements. Saved as a `.scene` file.":
    "Die gesamte spielbare Welt — alle Objekte, Lichter und Spielelemente. Wird als `.scene`-Datei gespeichert.",
  "GameObject": "GameObject",
  "An object in the world. Has a position, rotation, scale. On its own it does nothing — it needs components.":
    "Ein Objekt in der Welt. Hat Position, Rotation und Größe. Allein tut es nichts — es braucht Komponenten.",
  "Component": "Component",
  "A C# class attached to a GameObject. This is where all your game logic lives.":
    "Eine C#-Klasse, die an einem GameObject hängt. Hier lebt deine gesamte Spiellogik.",
  "Think of it like this: a GameObject is an actor on stage (just a position and a name). Components are the costume, the script, and the movement instructions you give them. One actor can wear many costumes at once.":
    "Stell es dir so vor: Ein GameObject ist ein Darsteller auf der Bühne (nur eine Position und ein Name). Die Komponenten sind das Kostüm, der Text und die Anweisungen, wie er sich bewegen soll. Ein Darsteller kann mehrere Kostüme gleichzeitig tragen.",
  "This is the same model used by Unity and Godot — if you've heard of those, it's identical in concept.":
    "Unity und Godot benutzen dasselbe Modell — falls du die kennst, ist das Konzept identisch.",
  "Project structure": "Aufbau eines Projekts",
  "Everything in these folders is automatically tracked. When you save a C# file, s&box hot reloads it in milliseconds — you don't need to restart the game to see changes. This is one of the best things about s&box.":
    "Alles in diesen Ordnern wird automatisch verfolgt. Wenn du eine C#-Datei speicherst, lädt s&box sie in Millisekunden neu — du musst das Spiel nicht neu starten, um die Änderung zu sehen. Das ist eine der besten Seiten von s&box.",
  "Hot reload is your superpower. Change a movement speed value in code, save the file, and the game updates live. This loop — change → save → see — is how you'll spend most of your time in s&box.":
    "Hot Reload ist deine Superkraft. Ändere im Code einen Wert für die Bewegungsgeschwindigkeit, speichere die Datei, und das Spiel übernimmt es live. In dieser Schleife — ändern → speichern → sehen — wirst du die meiste Zeit in s&box verbringen.",

  // ── Your first component ──────────────────────────────────────────────────
  "Your first component": "Deine erste Komponente",
  "A component is a C# class that inherits from `Component`. That's all it takes. Here's the simplest possible one:":
    "Eine Komponente ist eine C#-Klasse, die von `Component` erbt. Mehr braucht es nicht. Hier die einfachste, die es gibt:",
  "Break this down line by line:": "Zeile für Zeile aufgeschlüsselt:",
  "`using Sandbox;` — imports the s&box namespace so you can use engine types like `Component`, `Vector3`, `Rotation`.":
    "`using Sandbox;` — bindet den Namespace von s&box ein, damit du Engine-Typen wie `Component`, `Vector3` und `Rotation` benutzen kannst.",
  "`public sealed class Rotator : Component` — defines a class called Rotator that inherits from Component. `sealed` means nothing can inherit from Rotator (s&box recommends this for components).":
    "`public sealed class Rotator : Component` — definiert eine Klasse namens Rotator, die von Component erbt. `sealed` heißt, dass nichts von Rotator erben kann (s&box empfiehlt das für Komponenten).",
  "`protected override void OnUpdate()` — overrides the engine's OnUpdate method. The engine calls this every single frame automatically. You don't call it yourself.":
    "`protected override void OnUpdate()` — überschreibt die Methode OnUpdate der Engine. Die Engine ruft sie automatisch in jedem einzelnen Frame auf. Du rufst sie nicht selbst auf.",
  "`Transform.Rotation` — the rotation of this component's GameObject in the world.":
    "`Transform.Rotation` — die Rotation des GameObjects dieser Komponente in der Welt.",
  "`Time.Delta` — how many seconds passed since the last frame (usually something like 0.016). Multiplying by this makes movement frame-rate independent — fast computers and slow computers rotate at the same speed.":
    "`Time.Delta` — wie viele Sekunden seit dem letzten Frame vergangen sind (meist um die 0,016). Wer damit multipliziert, macht Bewegung unabhängig von der Bildrate — schnelle und langsame Rechner drehen gleich schnell.",
  "To use this: right-click in the asset browser → Create → C# Script → name it `Rotator.cs`. Then in the scene, select a GameObject, click Add Component in the inspector, and find Rotator. Press Play — it rotates.":
    "So benutzt du das: im Asset-Browser rechtsklicken → Create → C# Script → `Rotator.cs` nennen. Dann in der Szene ein GameObject auswählen, im Inspector auf Add Component klicken und Rotator suchen. Play drücken — es dreht sich.",
  "Why do we multiply movement by `Time.Delta`?": "Warum multiplizieren wir Bewegung mit `Time.Delta`?",
  "To make movement faster": "Damit die Bewegung schneller wird",
  "It's required by the compiler": "Der Compiler verlangt es",
  "So movement speed is consistent regardless of frame rate — 60fps and 30fps players move at the same speed":
    "Damit das Tempo unabhängig von der Bildrate gleich bleibt — bei 60 fps und bei 30 fps bewegen sich Spieler gleich schnell",
  "Time.Delta pauses the game between frames": "Time.Delta hält das Spiel zwischen den Frames an",
  "Without Time.Delta, a player on a 120fps machine moves twice as fast as one on 60fps. Multiplying by Time.Delta converts \"per frame\" into \"per second\" — predictable and fair.":
    "Ohne Time.Delta bewegt sich ein Spieler auf einem 120-fps-Rechner doppelt so schnell wie einer auf 60 fps. Die Multiplikation mit Time.Delta macht aus „pro Frame“ ein „pro Sekunde“ — vorhersehbar und fair.",

  // ── Lifecycle methods ─────────────────────────────────────────────────────
  "Lifecycle methods": "Methoden im Lebenszyklus",
  "S&box calls certain methods on your component at specific moments. You override the ones you need — ignore the rest.":
    "S&box ruft bestimmte Methoden deiner Komponente zu bestimmten Zeitpunkten auf. Du überschreibst die, die du brauchst — den Rest lässt du liegen.",
  "OnAwake()": "OnAwake()",
  "Called once when the component is first created. Before the scene is fully running. Use for very early setup.":
    "Wird einmal aufgerufen, wenn die Komponente entsteht. Noch bevor die Szene vollständig läuft. Für ganz frühe Vorbereitungen.",
  "OnStart()": "OnStart()",
  "Called once just before the first Update. Scene is ready. Use this for most initialisation — finding other components, setting starting values.":
    "Wird einmal kurz vor dem ersten Update aufgerufen. Die Szene steht. Hier gehört der Großteil der Einrichtung hin — andere Komponenten suchen, Startwerte setzen.",
  "OnUpdate()": "OnUpdate()",
  "Called every frame. Main game logic — input, animations, checks. Keep this fast.":
    "Wird in jedem Frame aufgerufen. Die eigentliche Spiellogik — Eingaben, Animationen, Prüfungen. Halte das schnell.",
  "OnFixedUpdate()": "OnFixedUpdate()",
  "Called at a fixed physics rate (not every frame). Use for movement and physics — more stable than OnUpdate for rigidbodies.":
    "Wird in einem festen Physiktakt aufgerufen (nicht in jedem Frame). Für Bewegung und Physik — bei Rigidbodies stabiler als OnUpdate.",
  "OnDestroy()": "OnDestroy()",
  "Called when the component or its GameObject is destroyed. Clean up references, stop sounds, unsubscribe events.":
    "Wird aufgerufen, wenn die Komponente oder ihr GameObject zerstört wird. Referenzen aufräumen, Geräusche stoppen, Events abbestellen.",
  "OnEnabled / OnDisabled": "OnEnabled / OnDisabled",
  "Called when the component is toggled on or off. Good for pausing logic without destroying the object.":
    "Wird aufgerufen, wenn die Komponente ein- oder ausgeschaltet wird. Gut, um Logik anzuhalten, ohne das Objekt zu zerstören.",
  "Rule of thumb: find other components in `OnStart()` not `OnAwake()` — other objects may not exist yet during Awake. Do per-frame logic in `OnUpdate()`. Do physics in `OnFixedUpdate()`.":
    "Faustregel: Andere Komponenten suchst du in `OnStart()`, nicht in `OnAwake()` — während Awake gibt es andere Objekte womöglich noch gar nicht. Logik pro Frame gehört in `OnUpdate()`, Physik in `OnFixedUpdate()`.",
  "You want to find all enemies in the scene when your game manager starts up. Which lifecycle method should you do this in?":
    "Du willst beim Start deines Game Managers alle Gegner in der Szene finden. In welcher Lebenszyklus-Methode machst du das?",
  "OnAwake — it runs first": "OnAwake — das läuft zuerst",
  "OnStart — the scene is fully loaded and all objects exist":
    "OnStart — die Szene ist vollständig geladen und alle Objekte sind da",
  "OnUpdate — run it every frame to keep the list fresh":
    "OnUpdate — in jedem Frame ausführen, damit die Liste aktuell bleibt",
  "OnFixedUpdate — for reliability": "OnFixedUpdate — der Verlässlichkeit wegen",
  "OnAwake fires before everything is ready — other objects may not have their own Awake done yet. OnStart fires after the scene is fully set up, so you can safely look up other objects.":
    "OnAwake feuert, bevor alles bereit ist — andere Objekte haben ihr eigenes Awake vielleicht noch nicht hinter sich. OnStart feuert, wenn die Szene vollständig steht, du kannst dort also gefahrlos andere Objekte nachschlagen.",

  // ── Properties & the editor ───────────────────────────────────────────────
  "Properties & the editor": "Properties & der Editor",
  "One of s&box's best features: put `[Property]` above any field on your component and it appears as a slider/field in the inspector. You can tweak values live without touching code.":
    "Eine der besten Seiten von s&box: Schreib `[Property]` über ein beliebiges Feld deiner Komponente, und es taucht als Regler oder Eingabefeld im Inspector auf. Du kannst Werte live verstellen, ohne den Code anzufassen.",
  "`[Property]` — shows the field in the inspector. You can drag sliders, type values, or drag-drop GameObjects/Components from the scene.":
    "`[Property]` — zeigt das Feld im Inspector. Du kannst Regler ziehen, Werte eintippen oder GameObjects und Komponenten aus der Szene hineinziehen.",
  "`[RequireComponent]` — automatically finds or creates the named component on the same GameObject. No manual `GetComponent` needed.":
    "`[RequireComponent]` — findet oder erzeugt die genannte Komponente automatisch am selben GameObject. Ein `GetComponent` von Hand entfällt.",
  "Other useful attributes": "Weitere nützliche Attribute",
  "Workflow tip: expose all your tunable values as `[Property]`. Speed, health, range, damage — everything. Then in the editor you tweak and test live without recompiling. This is how game designers iterate quickly.":
    "Tipp für den Arbeitsablauf: Mach alle Werte, an denen du drehen willst, als `[Property]` sichtbar. Tempo, Health, Reichweite, Schaden — alles. Dann stellst du im Editor live ein und probierst aus, ohne neu zu kompilieren. So kommen Spieledesigner schnell voran.",
  "What does putting `[Property]` above a field on your component do?":
    "Was bewirkt ein `[Property]` über einem Feld deiner Komponente?",
  "Makes the field public": "Macht das Feld öffentlich",
  "Syncs the field over the network": "Gleicht das Feld über das Netzwerk ab",
  "Makes it appear in the s&box inspector so you can edit it live in the editor":
    "Lässt es im Inspector von s&box auftauchen, sodass du es live im Editor bearbeiten kannst",
  "Prevents the field from being changed at runtime":
    "Verhindert, dass das Feld zur Laufzeit geändert wird",
  "This is one of the most-used features in s&box. Keep hardcoded values out of your code — expose everything tunable as a Property and adjust in the editor. Your code stays clean, your iteration stays fast.":
    "Das gehört zu dem, was in s&box am meisten benutzt wird. Halte fest eingetippte Werte aus deinem Code heraus — mach alles Einstellbare als Property sichtbar und stell es im Editor ein. Dein Code bleibt sauber und du kommst schnell voran.",

  // ── Input & movement ──────────────────────────────────────────────────────
  "Input & movement": "Eingabe & Bewegung",
  "S&box has a clean input system using named actions (like \"Attack1\", \"Jump\", \"Forward\") rather than raw key codes. This means your code isn't tied to specific keys — players can rebind them.":
    "S&box hat ein aufgeräumtes Eingabesystem mit benannten Aktionen (etwa „Attack1“, „Jump“, „Forward“) statt roher Tastencodes. Dadurch hängt dein Code nicht an bestimmten Tasten — Spieler können sie neu belegen.",
  "Basic movement component": "Eine einfache Komponente für Bewegung",
  "Vector3 is a struct holding x, y, z coordinates. `Vector3.Forward` is (0, 1, 0) in s&box's coordinate space. `.Normal` makes the vector length exactly 1 so speed is consistent in all directions.":
    "Vector3 ist ein Struct mit den Koordinaten x, y und z. `Vector3.Forward` ist im Koordinatensystem von s&box (0, 1, 0). `.Normal` bringt den Vektor auf die Länge genau 1, damit das Tempo in alle Richtungen gleich bleibt.",
  "What's the difference between `Input.Pressed(\"Jump\")` and `Input.Down(\"Jump\")`?":
    "Was ist der Unterschied zwischen `Input.Pressed(\"Jump\")` und `Input.Down(\"Jump\")`?",
  "They're identical": "Sie sind identisch",
  "Pressed is true only on the single frame the key is pressed. Down is true every frame while held.":
    "Pressed ist nur in dem einen Frame wahr, in dem die Taste gedrückt wird. Down ist in jedem Frame wahr, solange sie gehalten wird.",
  "Pressed works for keyboard, Down works for mouse":
    "Pressed gilt für die Tastatur, Down für die Maus",
  "Down only works in OnFixedUpdate": "Down funktioniert nur in OnFixedUpdate",
  "Jump uses Pressed — you want one jump per keypress, not jumping 60 times per second while held. Movement uses Down — you want to keep moving while the key is held.":
    "Springen nimmt Pressed — du willst einen Sprung pro Tastendruck und nicht sechzig Sprünge pro Sekunde, solange gehalten wird. Bewegung nimmt Down — du willst weiterlaufen, solange die Taste gehalten wird.",

  // ── GameObjects & the scene ───────────────────────────────────────────────
  "GameObjects & the scene": "GameObjects & die Szene",
  "From inside a component you have direct access to your GameObject and the whole scene.":
    "Aus einer Komponente heraus hast du direkten Zugriff auf dein GameObject und auf die ganze Szene.",
  "IsValid() — the s&box null check": "IsValid() — die Null-Prüfung von s&box",
  "Don't just use `!= null` for GameObjects in s&box. A destroyed GameObject is not null — it's an invalid object. Calling methods on it throws errors. Use `obj.IsValid()` to be safe.":
    "Nimm für GameObjects in s&box nicht einfach `!= null`. Ein zerstörtes GameObject ist nicht null — es ist ein ungültiges Objekt. Methoden darauf aufzurufen wirft Fehler. Nimm `obj.IsValid()`, dann bist du auf der sicheren Seite.",
  "Inside a component, how do you get access to the Rigidbody component on the same GameObject?":
    "Wie kommst du aus einer Komponente heraus an die Rigidbody-Komponente am selben GameObject?",
  "`GetComponent<T>()` looks at the same GameObject this component is on. It's the standard way to access sibling components. Use `[RequireComponent]` as a property attribute if you always need it — that's even cleaner.":
    "`GetComponent<T>()` schaut am selben GameObject nach, an dem diese Komponente hängt. Das ist der übliche Weg zu Geschwisterkomponenten. Brauchst du sie immer, nimm `[RequireComponent]` als Attribut — das ist noch sauberer.",

  // ── Networking basics ─────────────────────────────────────────────────────
  "Networking basics": "Grundlagen der Vernetzung",
  "S&box is built multiplayer-first. The key rule: the server is the authority. Never trust clients with important gameplay decisions.":
    "S&box ist von Anfang an auf Mehrspieler ausgelegt. Die wichtigste Regel: Der Server hat das Sagen. Überlass Clients nie wichtige Entscheidungen über den Spielverlauf.",
  "[Sync] — automatic property sync": "[Sync] — Properties automatisch abgleichen",
  "NetworkSpawn & RPCs": "NetworkSpawn & RPCs",
  "The golden rule: game state changes (health, position, score) happen on the server. Visual effects (explosions, sounds) can happen on clients. `[Sync]` keeps data in sync. RPCs trigger events across the network.":
    "Die goldene Regel: Änderungen am Spielzustand (Health, Position, Punkte) passieren auf dem Server. Sichtbare Effekte (Explosionen, Geräusche) dürfen auf den Clients passieren. `[Sync]` hält Daten im Gleichstand. RPCs lösen Ereignisse über das Netzwerk aus.",
  "A player takes damage. Where should the health reduction actually happen?":
    "Ein Spieler nimmt Schaden. Wo sollte die Health tatsächlich verringert werden?",
  "On the client whose player was hit — for responsiveness":
    "Auf dem Client des getroffenen Spielers — damit es sich direkt anfühlt",
  "On the server — clients can't be trusted to report their own damage honestly":
    "Auf dem Server — man kann sich nicht darauf verlassen, dass Clients ihren eigenen Schaden ehrlich melden",
  "On all clients simultaneously with [Sync]": "Gleichzeitig auf allen Clients mit [Sync]",
  "It doesn't matter in s&box": "In s&box spielt das keine Rolle",
  "If clients control their own health, a cheater can just never reduce it. Server authority means the server decides what happens — clients only see the result. This is fundamental to any multiplayer game.":
    "Verwalten Clients ihre eigene Health, dann verringert ein Betrüger sie einfach nie. Hoheit beim Server heißt: Der Server entscheidet, was passiert — die Clients sehen nur das Ergebnis. Das ist die Grundlage jedes Mehrspielerspiels.",

  // ── API limits & gotchas ──────────────────────────────────────────────────
  "API limits & gotchas": "Grenzen der API & Fallstricke",
  "S&box runs user code in a sandboxed environment for security. This means certain normal C# things are blocked or work differently.":
    "S&box führt fremden Code aus Sicherheitsgründen in einer abgeschotteten Umgebung aus. Deshalb ist manches, was in C# normal ist, gesperrt oder funktioniert anders.",
  "Blocked .NET APIs": "Gesperrte .NET-APIs",
  "You cannot use these in s&box: `System.IO.File` — no direct file access. Use s&box's own `FileSystem` API instead. `System.IO.Directory` — same reason. `System.Diagnostics.Process` — can't launch external processes. `System.Net.Http.HttpClient` directly — use s&box's `Http` class instead. `System.Threading.Thread` — use `async/await` or s&box's task system. `System.Reflection` — limited access only.":
    "Diese kannst du in s&box nicht benutzen: `System.IO.File` — kein direkter Dateizugriff, nimm stattdessen die `FileSystem`-API von s&box. `System.IO.Directory` — aus demselben Grund. `System.Diagnostics.Process` — externe Programme lassen sich nicht starten. `System.Net.Http.HttpClient` direkt — nimm stattdessen die Klasse `Http` von s&box. `System.Threading.Thread` — nimm `async/await` oder das Task-System von s&box. `System.Reflection` — nur eingeschränkt zugänglich.",
  "The s&box alternatives": "Die Alternativen in s&box",
  "Other things to watch out for": "Worauf du sonst noch achten solltest",
  "If you Google C# game dev and find Unity tutorials — most of the C# logic is identical, but watch out for Unity-specific things: `transform` (lowercase) vs `Transform`, `Time.deltaTime` vs `Time.Delta`, `Debug.Log` vs `Log.Info`, and `GetComponent` syntax is slightly different. The concepts are the same, the API names differ.":
    "Wenn du nach C# in der Spieleentwicklung suchst und auf Unity-Anleitungen stößt — der Großteil der C#-Logik ist identisch, aber pass auf, was Unity-eigen ist: `transform` (klein) statt `Transform`, `Time.deltaTime` statt `Time.Delta`, `Debug.Log` statt `Log.Info`, und die Schreibweise von `GetComponent` weicht leicht ab. Die Konzepte sind dieselben, nur die Namen in der API unterscheiden sich.",
  "You want to save a player's score to a file in s&box. Which API do you use?":
    "Du willst in s&box den Punktestand eines Spielers in eine Datei schreiben. Welche API nimmst du?",
  "You can't save files in s&box at all": "In s&box kann man überhaupt keine Dateien speichern",
  "S&box provides its own file system API that works within the sandbox security model. It gives you safe file access to designated folders without allowing code to access arbitrary locations on the player's machine.":
    "S&box bringt eine eigene Dateisystem-API mit, die zum abgeschotteten Sicherheitsmodell passt. Sie gibt dir gefahrlosen Zugriff auf dafür vorgesehene Ordner, ohne dass Code an beliebige Stellen auf dem Rechner des Spielers kommt.",

  // ── Physics & traces ──────────────────────────────────────────────────────
  "Physics & traces": "Physik & Traces",
  "Until now you've moved objects by writing to `WorldPosition` every frame. Physics flips that: add a `Rigidbody` component and the engine owns the motion — gravity, bounces, stacking, knockback all come free. The other half of this lesson is traces: firing an invisible ray through the world and asking \"what's over there?\" Between the two you can build shooting, jumping, pickups, lasers, and pressure plates.":
    "Bisher hast du Objekte bewegt, indem du in jedem Frame auf `WorldPosition` geschrieben hast. Die Physik dreht das um: Häng eine `Rigidbody`-Komponente an, und die Engine übernimmt die Bewegung — Schwerkraft, Abprallen, Stapeln und Rückstoß gibt es dann geschenkt. Die andere Hälfte dieser Lektion sind Traces: Du schickst einen unsichtbaren Strahl durch die Welt und fragst „was ist da drüben?“. Aus beidem zusammen baust du Schießen, Springen, Aufsammeln, Laser und Druckplatten.",
  "Rigidbody: push, don't teleport": "Rigidbody: schieben, nicht versetzen",
  "Three ways to move a rigidbody, three use cases. `ApplyForce` accelerates gradually over time — thrusters, wind, conveyor belts. `ApplyImpulse` changes velocity instantly — jumps, explosions, bullet knockback. Setting `Velocity` directly gives total control but stomps whatever physics was doing — good for speed caps and dashes. Forces belong in `OnFixedUpdate` because physics steps at a fixed rate; apply them in `OnUpdate` and their strength varies with frame rate.":
    "Drei Wege, einen Rigidbody zu bewegen, drei Einsatzzwecke. `ApplyForce` beschleunigt allmählich über die Zeit — Triebwerke, Wind, Förderbänder. `ApplyImpulse` ändert die Geschwindigkeit auf einen Schlag — Sprünge, Explosionen, Rückstoß von Geschossen. `Velocity` direkt zu setzen gibt dir volle Kontrolle, überfährt aber alles, was die Physik gerade tat — gut für Tempogrenzen und Sprints. Kräfte gehören in `OnFixedUpdate`, weil die Physik in einem festen Takt rechnet; wendest du sie in `OnUpdate` an, schwankt ihre Stärke mit der Bildrate.",
  "Coming from Unity tutorials: there's no `AddForce(dir, ForceMode.Impulse)` here — s&box splits it into separate `ApplyForce` and `ApplyImpulse` methods. And don't write to `WorldPosition` every frame on an object with a Rigidbody — you're fighting the physics solver and it will jitter or tunnel through walls. Teleporting once (a respawn) is fine; steering by position is not.":
    "Aus Unity-Anleitungen: Ein `AddForce(dir, ForceMode.Impulse)` gibt es hier nicht — s&box teilt das in die getrennten Methoden `ApplyForce` und `ApplyImpulse` auf. Und schreib bei einem Objekt mit Rigidbody nicht in jedem Frame auf `WorldPosition` — damit kämpfst du gegen den Physiklöser, und es zittert oder rutscht durch Wände. Einmal versetzen (ein Respawn) ist in Ordnung, über die Position zu steuern nicht.",
  "Traces: asking the world questions": "Traces: der Welt Fragen stellen",
  "Hit": "Hit",
  "True if the trace struck something before reaching its end point. Check this first, always.":
    "Wahr, wenn der Trace etwas getroffen hat, bevor er sein Ende erreichte. Prüfe das immer zuerst.",
  "EndPosition": "EndPosition",
  "Where the trace stopped — the impact point, or the full ray length if nothing was hit. Spawn impact effects here.":
    "Wo der Trace endete — der Einschlagpunkt, oder die volle Strahllänge, wenn nichts getroffen wurde. Hier erzeugst du die Einschlageffekte.",
  "Normal": "Normal",
  "The direction the hit surface faces. Use it to orient bullet decals, bounce projectiles, or push away from walls.":
    "Die Richtung, in die die getroffene Fläche zeigt. Damit richtest du Einschusslöcher aus, lässt Geschosse abprallen oder schiebst von Wänden weg.",
  "GameObject / Collider": "GameObject / Collider",
  "What you hit. `tr.GameObject.GetComponent<T>()` is how a ray becomes gameplay — damage, interaction, highlighting.":
    "Was du getroffen hast. Über `tr.GameObject.GetComponent<T>()` wird aus einem Strahl echtes Spielgeschehen — Schaden, Interaktion, Hervorhebung.",
  "Distance / Fraction": "Distance / Fraction",
  "How far the trace travelled, absolute or as 0–1 of its full length. Great for damage falloff.":
    "Wie weit der Trace gekommen ist, absolut oder als 0–1 seiner vollen Länge. Bestens für nachlassenden Schaden mit der Entfernung.",
  "Surface": "Surface",
  "The physical material that was hit — pick footstep sounds and impact particles per surface (metal ping vs dirt thud).":
    "Das getroffene physikalische Material — damit wählst du Schrittgeräusche und Einschlagpartikel je Oberfläche (Klirren auf Metall statt dumpfem Schlag auf Erde).",
  "When a trace \"isn't hitting\", draw it. Every component has `DebugOverlay` — call `DebugOverlay.Trace(tr, 5f)` and s&box draws the ray in-world for 5 seconds, with the hit point and surface normal in red. Nine times out of ten you'll see the trace starting inside your own collider or pointing somewhere you didn't expect.":
    "Wenn ein Trace „nicht trifft“, zeichne ihn. Jede Komponente hat `DebugOverlay` — ruf `DebugOverlay.Trace(tr, 5f)` auf, und s&box zeichnet den Strahl fünf Sekunden lang in der Welt, mit Trefferpunkt und Flächennormale in Rot. In neun von zehn Fällen siehst du dann, dass der Trace in deinem eigenen Collider beginnt oder ganz woanders hinzeigt als gedacht.",
  "Your gun's trace keeps hitting the player who fired it. What's the cleanest fix?":
    "Der Trace deiner Waffe trifft ständig den Spieler, der geschossen hat. Was ist die sauberste Lösung?",
  "Start the trace 100 units in front of the player":
    "Den Trace 100 Einheiten vor dem Spieler beginnen lassen",
  "Add `.IgnoreGameObjectHierarchy(GameObject)` to the trace — it skips the shooter and all its children":
    "Dem Trace `.IgnoreGameObjectHierarchy(GameObject)` mitgeben — das übergeht den Schützen und alle seine Kindobjekte",
  "Put the player on an Ignore Raycast layer":
    "Den Spieler auf einen Layer „Ignore Raycast“ legen",
  "Call `.Run(ignoreSelf: true)`": "`.Run(ignoreSelf: true)` aufrufen",
  "Starting the trace further forward is a classic hack that breaks point-blank shots. Layers are a Unity concept — s&box filters traces with tags and ignore methods. `IgnoreGameObjectHierarchy` covers the whole shooter, including child objects like the weapon model — exactly what you want for first-person guns.":
    "Den Trace weiter vorn beginnen zu lassen ist der klassische Pfusch, der Schüsse aus nächster Nähe kaputtmacht. Layer sind ein Unity-Konzept — s&box filtert Traces über Tags und Ignore-Methoden. `IgnoreGameObjectHierarchy` erfasst den ganzen Schützen samt Kindobjekten wie dem Waffenmodell — genau das, was du bei Waffen aus der Ich-Perspektive willst.",
  "Collisions & triggers": "Zusammenstöße & Trigger",
  "Colliders tell you about contact in two ways. Solid colliders report hits through `Component.ICollisionListener` — implement it and you get `OnCollisionStart(Collision collision)` (plus `OnCollisionUpdate` and `OnCollisionStop`), with `collision.Other.GameObject` telling you what you touched. Tick `IsTrigger` on a collider instead and it stops being solid: objects pass through, and it reports enter/exit events — perfect for pickups, damage zones, and checkpoints. One gotcha: traces ignore trigger colliders unless you add `.HitTriggers()` to the trace.":
    "Collider melden Berührung auf zwei Arten. Feste Collider melden Treffer über `Component.ICollisionListener` — implementiere es, und du bekommst `OnCollisionStart(Collision collision)` (dazu `OnCollisionUpdate` und `OnCollisionStop`), wobei `collision.Other.GameObject` dir sagt, was du berührt hast. Setzt du stattdessen bei einem Collider `IsTrigger`, ist er nicht mehr fest: Objekte gehen hindurch, und er meldet Ereignisse beim Betreten und Verlassen — ideal für Aufsammelbares, Schadenszonen und Kontrollpunkte. Ein Fallstrick: Traces übergehen Trigger-Collider, solange du dem Trace kein `.HitTriggers()` mitgibst.",
  "You built a health pickup: BoxCollider with IsTrigger ticked, and your component has a method `void OnTriggerEnter(GameObject other)`. The player walks through and nothing happens. Most likely cause?":
    "Du hast ein Health-Pickup gebaut: BoxCollider mit gesetztem IsTrigger, und deine Komponente hat eine Methode `void OnTriggerEnter(GameObject other)`. Der Spieler läuft hindurch und nichts passiert. Was ist die wahrscheinlichste Ursache?",
  "The trigger object also needs a Rigidbody": "Das Trigger-Objekt braucht zusätzlich einen Rigidbody",
  "The component must declare `: Component, Component.ITriggerListener` — s&box calls interface methods, not methods it finds by name":
    "Die Komponente muss `: Component, Component.ITriggerListener` angeben — s&box ruft Methoden von Interfaces auf, nicht Methoden, die es am Namen erkennt",
  "OnTriggerEnter only works inside OnFixedUpdate":
    "OnTriggerEnter funktioniert nur innerhalb von OnFixedUpdate",
  "You need to call base.OnTriggerEnter() first": "Du musst zuerst base.OnTriggerEnter() aufrufen",
  "Unlike engines that discover magic method names at runtime, s&box only delivers trigger events to components that implement `Component.ITriggerListener`. Your method compiled fine — it just was never wired up. Same pattern for solid contacts: implement `Component.ICollisionListener` to receive `OnCollisionStart`. Interfaces make the contract explicit, which is exactly what lesson 10 promised.":
    "Anders als Engines, die zur Laufzeit nach magischen Methodennamen suchen, liefert s&box Trigger-Ereignisse nur an Komponenten aus, die `Component.ITriggerListener` implementieren. Deine Methode ließ sich einwandfrei kompilieren — sie war nur nie angeschlossen. Bei festen Berührungen dasselbe Muster: Implementiere `Component.ICollisionListener`, um `OnCollisionStart` zu bekommen. Interfaces schreiben den Vertrag ausdrücklich hin — genau das, was Lektion 10 versprochen hat.",

  // ── Spawning & prefabs ────────────────────────────────────────────────────
  "Spawning & prefabs": "Erzeugen & Prefabs",
  "A prefab is a GameObject saved to a file — the object, its components, its children, all its tuned `[Property]` values. Build your enemy once, save it as `enemy.prefab`, then stamp out a hundred copies from code. Every spawner, gun, and loot drop you'll ever write is built on this.":
    "Ein Prefab ist ein GameObject, das in einer Datei liegt — das Objekt, seine Komponenten, seine Kindobjekte und alle eingestellten `[Property]`-Werte. Bau deinen Gegner einmal, speichere ihn als `enemy.prefab` und stanze dann per Code hundert Kopien aus. Jeder Spawner, jede Waffe und jeder Beuteabwurf, den du je schreibst, baut darauf auf.",
  "Making one: build the GameObject in your scene, right-click it in the hierarchy and choose Convert to Prefab. The scene copy becomes an instance linked to the file — edit the prefab file and every instance in every scene updates. That's the point: fix the enemy's health once, it's fixed everywhere.":
    "So machst du eines: Bau das GameObject in deiner Szene, klick es in der Hierarchie mit rechts an und wähle Convert to Prefab. Die Kopie in der Szene wird zu einem Exemplar, das mit der Datei verbunden ist — bearbeite die Prefab-Datei, und jedes Exemplar in jeder Szene zieht nach. Genau darum geht es: Du korrigierst die Health des Gegners einmal und sie ist überall korrigiert.",
  "Referencing and cloning a prefab": "Ein Prefab referenzieren und klonen",
  "Clone()": "Clone()",
  "Copy at the world origin. You almost always want a position — use an overload.":
    "Kopie im Ursprung der Welt. Fast immer willst du eine Position — nimm eine Überladung.",
  "Clone(position) / Clone(position, rotation)": "Clone(position) / Clone(position, rotation)",
  "The two you'll use constantly. Spawn at a point, optionally facing a direction. A scale overload exists too: Clone(position, rotation, scale).":
    "Die beiden, die du ständig benutzen wirst. An einem Punkt erzeugen, wahlweise in eine Richtung gedreht. Es gibt auch eine Überladung mit Größe: Clone(position, rotation, scale).",
  "Clone(transform, parent, startEnabled, name)": "Clone(transform, parent, startEnabled, name)",
  "Full control — parent it under another object, spawn it disabled to configure before it activates, give it a name.":
    "Volle Kontrolle — unter ein anderes Objekt hängen, ausgeschaltet erzeugen, um es vor dem Aktivieren einzurichten, und benennen.",
  "GameObject.Clone(\"prefabs/enemy.prefab\")": "GameObject.Clone(\"prefabs/enemy.prefab\")",
  "Static version — loads the prefab by path, no [Property] slot needed. Handy when the prefab is chosen at runtime, like a random loot table.":
    "Die statische Fassung — lädt das Prefab über den Pfad, ganz ohne [Property]-Feld. Praktisch, wenn das Prefab erst zur Laufzeit feststeht, etwa bei einer zufälligen Beutetabelle.",
  "Unity habit to unlearn: there is no `Instantiate()` in s&box — cloning is always `Clone()`, and it works on any GameObject, not just prefabs. Also note a clone stays linked to its prefab file; call `bullet.BreakFromPrefab()` if you want it to become a plain, unlinked object.":
    "Unity-Gewohnheit zum Ablegen: Ein `Instantiate()` gibt es in s&box nicht — geklont wird immer mit `Clone()`, und das geht mit jedem GameObject, nicht nur mit Prefabs. Beachte außerdem: Ein Klon bleibt mit seiner Prefab-Datei verbunden; ruf `bullet.BreakFromPrefab()` auf, wenn er ein schlichtes, unverbundenes Objekt werden soll.",
  "Building objects from raw code": "Objekte direkt im Code bauen",
  "`new GameObject(\"name\")` gives you an empty object in the active scene. `AddComponent<T>()` bolts on behaviour — it's the code version of the inspector's Add Component button. Prefabs are still better for anything with more than a couple of components: designers can tweak them without touching code.":
    "`new GameObject(\"name\")` gibt dir ein leeres Objekt in der aktiven Szene. `AddComponent<T>()` schraubt Verhalten daran — es ist die Code-Fassung des Knopfes Add Component im Inspector. Für alles mit mehr als ein paar Komponenten sind Prefabs trotzdem besser: Designer können daran drehen, ohne Code anzufassen.",
  "Destroying — and destroying later": "Zerstören — und später zerstören",
  "`GameObject.Destroy()` doesn't vaporise the object mid-line. It queues the removal, and the object actually disappears at the start of the next frame. That's deliberate — other code might still be touching it this frame. And since a destroyed object is never `null` in C# — references to it live on — you check `IsValid()` instead: it turns false once the object is actually gone. During the pending frame itself the object still counts as valid; `IsDestroyed` is the flag that flips true the instant you call `Destroy()`. (`DestroyImmediate()` exists but skips that safety window — avoid it unless you know why you need it.)":
    "`GameObject.Destroy()` löst das Objekt nicht mitten in der Zeile auf. Es stellt die Entfernung in die Warteschlange, und verschwunden ist das Objekt erst zu Beginn des nächsten Frames. Das ist Absicht — anderer Code fasst es in diesem Frame vielleicht noch an. Und weil ein zerstörtes Objekt in C# nie `null` ist — Referenzen darauf leben weiter —, prüfst du stattdessen `IsValid()`: Das wird falsch, sobald das Objekt wirklich weg ist. Im wartenden Frame selbst gilt das Objekt noch als gültig; `IsDestroyed` ist die Markierung, die in dem Moment wahr wird, in dem du `Destroy()` aufrufst. (`DestroyImmediate()` gibt es auch, überspringt aber genau dieses Schutzfenster — Finger weg, solange du nicht weißt, warum du es brauchst.)",
  "A complete timed enemy spawner": "Ein vollständiger Gegner-Spawner mit Zeittakt",
  "Two patterns here carry to every spawner you'll write. `TimeUntil` is a countdown you set with a float and read as a bool — no manual timer maths. And the `RemoveAll(e => !e.IsValid())` sweep is how you track spawned things safely: when an enemy dies elsewhere (player kills it, it falls out of the map), your list finds out through `IsValid()`, never through a stale reference that crashes you.":
    "Zwei Muster von hier tragen dich durch jeden Spawner, den du je schreibst. `TimeUntil` ist ein Countdown, den du mit einem float setzt und als bool ausliest — kein Rechnen mit Zeitzählern von Hand. Und der Durchgang `RemoveAll(e => !e.IsValid())` ist die sichere Art, Erzeugtes im Blick zu behalten: Stirbt ein Gegner anderswo (der Spieler erlegt ihn, er fällt aus der Karte), erfährt es deine Liste über `IsValid()` und nie über eine veraltete Referenz, die dich abstürzen lässt.",
  "You call `enemy.Destroy()` and, two lines later in the same frame, run `Scene.GetAllComponents<Enemy>()`. Does the destroyed enemy still show up?":
    "Du rufst `enemy.Destroy()` auf und führst zwei Zeilen später im selben Frame `Scene.GetAllComponents<Enemy>()` aus. Taucht der zerstörte Gegner noch auf?",
  "No — Destroy() removes it from the scene instantly":
    "Nein — Destroy() nimmt ihn sofort aus der Szene",
  "Yes — Destroy() queues removal for the start of the next frame, so same-frame code can still see it":
    "Ja — Destroy() stellt die Entfernung für den Beginn des nächsten Frames in die Warteschlange, im selben Frame sieht ihn Code also noch",
  "It throws an exception because the object no longer exists":
    "Es wirft eine Ausnahme, weil es das Objekt nicht mehr gibt",
  "Only if the enemy was spawned from a prefab":
    "Nur wenn der Gegner aus einem Prefab erzeugt wurde",
  "This one-frame grace period causes real bugs: a turret picks a target the same frame it died, then shoots a corpse. Within that frame, `IsDestroyed` is already true — filter on that if you must react instantly. Anything held across frames should be checked with `IsValid()` before use — it goes false once the object is actually gone, and it's the s&box equivalent of a null check for scene objects.":
    "Diese Schonfrist von einem Frame verursacht echte Fehler: Ein Geschützturm sucht sich im selben Frame ein Ziel, in dem es gestorben ist, und schießt dann auf eine Leiche. Innerhalb dieses Frames ist `IsDestroyed` bereits wahr — filtere darauf, wenn du sofort reagieren musst. Alles, was du über Frames hinweg festhältst, prüfst du vor dem Benutzen mit `IsValid()` — das wird falsch, sobald das Objekt wirklich weg ist, und es ist bei Szenenobjekten das s&box-Gegenstück zur Null-Prüfung.",
  "Coming from a Unity tutorial, you type `Instantiate(EnemyPrefab, pos, rot)`. What's the s&box equivalent?":
    "Aus einer Unity-Anleitung tippst du `Instantiate(EnemyPrefab, pos, rot)`. Was ist das Gegenstück in s&box?",
  "Instantiate(EnemyPrefab, pos, rot) — it works the same":
    "Instantiate(EnemyPrefab, pos, rot) — das funktioniert genauso",
  "In s&box, cloning is one universal verb: `Clone()` copies prefabs and live GameObjects alike, with overloads for position, rotation, scale, and parent. `new GameObject()` only makes an empty object — it doesn't know anything about your prefab.":
    "In s&box gibt es fürs Klonen ein einziges Wort: `Clone()` kopiert Prefabs und lebende GameObjects gleichermaßen, mit Überladungen für Position, Rotation, Größe und Elternobjekt. `new GameObject()` erzeugt nur ein leeres Objekt — von deinem Prefab weiß es nichts.",

  // ── UI with Razor panels ──────────────────────────────────────────────────
  "UI with Razor panels": "Oberflächen mit Razor-Panels",
  "Every HUD you've seen in an s&box game — health bars, ammo counters, kill feeds, pause menus — is a `.razor` file: HTML-like markup on top, a C# `@code` block underneath, and an SCSS file sitting next to it for styling. One file per UI piece, and it hot reloads on save like the rest of your code.":
    "Jedes HUD, das du in einem s&box-Spiel gesehen hast — Lebensbalken, Munitionsanzeigen, Abschusslisten, Pausenmenüs —, ist eine `.razor`-Datei: oben HTML-ähnliches Markup, darunter ein C#-Block `@code`, und daneben liegt eine SCSS-Datei fürs Aussehen. Eine Datei je Teil der Oberfläche, und beim Speichern wird sie wie dein übriger Code neu geladen.",
  "The smallest possible panel": "Das kleinstmögliche Panel",
  "Line by line: `@inherits PanelComponent` makes this a real component — you add it to a GameObject, `[Property]` shows up in the inspector, and lifecycle methods like `OnUpdate()` still work. The markup lives inside `<root>`, and `@` drops you into C#: `@Message` prints the property, and `@if` / `@foreach` work too — loop over a `List<Entry>` to render a kill feed. The file name becomes the class name: `MyHud.razor` compiles to a `MyHud` class.":
    "Zeile für Zeile: `@inherits PanelComponent` macht daraus eine echte Komponente — du hängst sie an ein GameObject, `[Property]` erscheint im Inspector, und Lebenszyklus-Methoden wie `OnUpdate()` funktionieren weiterhin. Das Markup steht in `<root>`, und `@` bringt dich nach C#: `@Message` gibt die Property aus, `@if` und `@foreach` gehen ebenfalls — lauf über eine `List<Entry>`, um eine Abschussliste zu zeichnen. Der Dateiname wird zum Klassennamen: `MyHud.razor` kompiliert zu einer Klasse `MyHud`.",
  "Getting it on screen: add a `ScreenPanel` component to a GameObject — the invisible full-screen surface UI draws to — then add your Razor component to that same GameObject. One ScreenPanel can host your whole HUD. For UI floating in the 3D world (name tags over players, prompts on doors), use `WorldPanel` instead. To create a panel fast: when you create a new component, pick the \"New Razor Panel Component\" template — s&box generates the `.razor` starter file for you; drop a matching `.razor.scss` next to it for styles.":
    "So kommt es auf den Bildschirm: Häng eine `ScreenPanel`-Komponente an ein GameObject — das ist die unsichtbare bildschirmfüllende Fläche, auf die Oberflächen zeichnen — und häng deine Razor-Komponente an dasselbe GameObject. Ein einziges ScreenPanel kann dein ganzes HUD tragen. Für Oberflächen, die in der 3D-Welt schweben (Namensschilder über Spielern, Hinweise an Türen), nimmst du stattdessen `WorldPanel`. Schnell ein Panel anlegen: Wähl beim Erstellen einer neuen Komponente die Vorlage „New Razor Panel Component“ — s&box legt dir die `.razor`-Startdatei an; leg für die Gestaltung eine passende `.razor.scss` daneben.",
  "You add your new PauseMenu Razor component to a GameObject and press Play — nothing appears, no errors. Most likely cause?":
    "Du hängst deine neue Razor-Komponente PauseMenu an ein GameObject und drückst Play — es erscheint nichts, und es gibt keine Fehler. Was ist die wahrscheinlichste Ursache?",
  "You forgot to add a Canvas object to the scene":
    "Du hast vergessen, ein Canvas-Objekt in die Szene zu legen",
  "There's no ScreenPanel component — a PanelComponent needs one on its GameObject to draw to":
    "Es fehlt eine ScreenPanel-Komponente — eine PanelComponent braucht an ihrem GameObject eine, auf die sie zeichnen kann",
  "You need to call Panel.Render() from OnUpdate()":
    "Du musst Panel.Render() aus OnUpdate() heraus aufrufen",
  "Razor panels only render in multiplayer sessions":
    "Razor-Panels zeichnen nur in Mehrspielersitzungen",
  "Canvas is Unity; s&box's equivalent surface is the ScreenPanel component. A typical game has one GameObject called \"UI\" holding a ScreenPanel plus all your HUD panel components. You never call render methods yourself — the engine draws any PanelComponent that has a surface.":
    "Canvas ist Unity; die entsprechende Fläche in s&box ist die Komponente ScreenPanel. Ein typisches Spiel hat ein GameObject namens „UI“, das ein ScreenPanel und alle deine HUD-Komponenten trägt. Zeichenmethoden rufst du nie selbst auf — die Engine zeichnet jede PanelComponent, die eine Fläche hat.",
  "BuildHash — when your panel re-renders": "BuildHash — wann dein Panel neu gezeichnet wird",
  "Here's the part that trips everyone up: the markup is not re-evaluated every frame. s&box calls your `BuildHash()` override and compares the result to last frame's — the panel only rebuilds when the hash changes. So combine every value your markup displays into the hash with `System.HashCode.Combine(...)`. For one-off, event-driven updates — a chat message arrived, an item got picked up — call `StateHasChanged()` to force a rebuild instead.":
    "Und hier stolpern alle: Das Markup wird nicht in jedem Frame neu ausgewertet. S&box ruft dein überschriebenes `BuildHash()` auf und vergleicht das Ergebnis mit dem des letzten Frames — neu gebaut wird das Panel nur, wenn sich der Hash ändert. Nimm also jeden Wert, den dein Markup anzeigt, mit `System.HashCode.Combine(...)` in den Hash auf. Für einzelne, von Ereignissen ausgelöste Aktualisierungen — eine Chatnachricht ist da, ein Gegenstand wurde aufgesammelt — rufst du stattdessen `StateHasChanged()` auf und erzwingst den Neuaufbau.",
  "The lazy hack is `BuildHash() => HashCode.Combine( Time.Now )` — the hash changes every frame, so the panel rebuilds every frame. Facepunch's own sample HUD does this with a comment telling you not to copy it: rebuilding the element tree 60+ times a second burns CPU your game needs. Hash the actual values you display.":
    "Der bequeme Pfusch ist `BuildHash() => HashCode.Combine( Time.Now )` — der Hash ändert sich in jedem Frame, also wird das Panel in jedem Frame neu gebaut. Facepunchs eigenes Beispiel-HUD macht genau das, mit einem Kommentar daneben, der dir sagt, dass du es nicht nachmachen sollst: Den Elementbaum mehr als sechzigmal pro Sekunde neu zu bauen verbrennt Rechenzeit, die dein Spiel braucht. Nimm die Werte in den Hash, die du tatsächlich anzeigst.",
  "A health bar bound to game data": "Ein Lebensbalken, der an Spieldaten hängt",
  "The `.razor.scss` companion needs no linking — s&box picks it up by name, and style edits hot reload instantly. The top-level selector is your class name (`HealthHud`), with normal SCSS nesting inside. Layout is flexbox: `flex-direction`, `justify-content`, `align-items` and `gap` are your main tools. One gotcha for the next section: panels ignore the mouse by default — give anything clickable `pointer-events: all` in its style.":
    "Die begleitende `.razor.scss` musst du nirgends eintragen — s&box findet sie über den Namen, und Änderungen am Stil werden sofort neu geladen. Der oberste Selektor ist dein Klassenname (`HealthHud`), darin ganz normale SCSS-Verschachtelung. Das Layout ist Flexbox: `flex-direction`, `justify-content`, `align-items` und `gap` sind deine Hauptwerkzeuge. Ein Fallstrick für den nächsten Abschnitt: Panels übergehen die Maus von Haus aus — gib allem Anklickbaren `pointer-events: all` in seinem Stil.",
  "Handling clicks": "Klicks verarbeiten",
  "Your health bar renders once, but the fill never moves even though `Target.Health` keeps changing. Most likely bug?":
    "Dein Lebensbalken wird einmal gezeichnet, aber die Füllung bewegt sich nie, obwohl sich `Target.Health` laufend ändert. Was ist der wahrscheinlichste Fehler?",
  "UI reads must happen in OnFixedUpdate, not in markup":
    "Die Oberfläche muss in OnFixedUpdate lesen, nicht im Markup",
  "The width style needs !important to override the SCSS file":
    "Die Breitenangabe braucht !important, um die SCSS-Datei zu überschreiben",
  "BuildHash() doesn't include the health value, so s&box never sees a reason to rebuild the panel":
    "BuildHash() enthält den Health-Wert nicht, also sieht s&box nie einen Grund, das Panel neu zu bauen",
  "Panels are static after first render — you must destroy and re-create it":
    "Panels stehen nach dem ersten Zeichnen fest — du musst es zerstören und neu anlegen",
  "Razor rendering is hash-driven: no hash change, no rebuild. Every value your markup reads belongs in `HashCode.Combine(...)` — health, ammo, score, all of it. It's the number one \"my HUD is frozen\" bug in s&box, and the fix is one line. For event-style updates, `StateHasChanged()` does the same job on demand.":
    "Razor zeichnet nach Hash: kein anderer Hash, kein Neuaufbau. Jeder Wert, den dein Markup liest, gehört in `HashCode.Combine(...)` — Health, Munition, Punkte, alles. Das ist in s&box der häufigste Fehler der Sorte „mein HUD ist eingefroren“, und die Lösung ist eine Zeile. Für Aktualisierungen per Ereignis erledigt `StateHasChanged()` dasselbe auf Zuruf.",

  // ── Sound & effects ───────────────────────────────────────────────────────
  "Sound & effects": "Klang & Effekte",
  "A hit that lands silently feels broken — even if the damage code is perfect. Sound and particles are how the player *feels* your game logic working. In this lesson you'll create SoundEvent assets, play them from code (stationary and following objects), build a particle burst in the scene system, and wire both into a bullet impact.":
    "Ein Treffer, der lautlos ankommt, fühlt sich kaputt an — auch wenn der Schadenscode makellos ist. Über Klang und Partikel *spürt* der Spieler, dass deine Spiellogik arbeitet. In dieser Lektion legst du SoundEvent-Assets an, spielst sie aus dem Code ab (ortsfest und Objekten folgend), baust einen Partikelstoß im Szenensystem und verdrahtest beides zu einem Geschosseinschlag.",
  "SoundEvent assets": "SoundEvent-Assets",
  "Most sounds in s&box are `SoundEvent` assets — `.sound` files that bundle one or more audio clips with playback settings. Create one in the editor's Asset Browser (right-click → new Sound Event), then add your `.wav` files to its Sounds list. Key settings: `Volume` and `Pitch` (each can be a min–max range, rolled fresh on every play), `Selection Mode` (pick a random clip from the list), `Distance` (max audible range), and a `Falloff` curve.":
    "Die meisten Geräusche in s&box sind `SoundEvent`-Assets — `.sound`-Dateien, die einen oder mehrere Audioschnipsel samt Abspieleinstellungen bündeln. Leg eines im Asset-Browser des Editors an (rechtsklicken → new Sound Event) und füg deine `.wav`-Dateien in seine Liste Sounds ein. Die wichtigsten Einstellungen: `Volume` und `Pitch` (beide dürfen eine Spanne von min bis max sein, die bei jedem Abspielen neu ausgewürfelt wird), `Selection Mode` (einen zufälligen Schnipsel aus der Liste nehmen), `Distance` (die maximale Hörweite) und eine `Falloff`-Kurve.",
  "Variation is free polish: give a footstep SoundEvent 3-4 clips, set Pitch to a range like 0.9-1.1, and Selection Mode to Random. The same event now never sounds identical twice — no code needed. And tick the UI flag on menu/HUD sounds: it plays them flat 2D with no distance attenuation.":
    "Abwechslung ist Feinschliff zum Nulltarif: Gib einem SoundEvent für Schritte drei bis vier Schnipsel, setz Pitch auf eine Spanne wie 0,9 bis 1,1 und Selection Mode auf Random. Dasselbe Ereignis klingt jetzt nie zweimal gleich — ganz ohne Code. Und setz bei Geräuschen für Menü und HUD die Markierung UI: Dann werden sie flach in 2D abgespielt, ohne dass die Entfernung sie leiser macht.",
  "Sounds that follow and change": "Geräusche, die mitgehen und sich ändern",
  "`Sound.Play` is fire-and-forget: the sound stays where it started. For anything that moves — an engine, footsteps, a rocket in flight — use `GameObject.PlaySound`, which glues the sound to the object's position every frame. Every play call returns a `SoundHandle` you can keep and tweak live.":
    "`Sound.Play` ist abschicken und vergessen: Das Geräusch bleibt, wo es begonnen hat. Für alles Bewegte — einen Motor, Schritte, eine fliegende Rakete — nimm `GameObject.PlaySound`; das klebt das Geräusch in jedem Frame an die Position des Objekts. Jeder Aufruf liefert ein `SoundHandle` zurück, das du behalten und live verstellen kannst.",
  "SoundPointComponent": "SoundPointComponent",
  "Plays a sound at a fixed point in the world. Auto-play, looping, randomized repeat interval. Ambient hums, radios, dripping pipes — zero code.":
    "Spielt ein Geräusch an einem festen Punkt der Welt. Von selbst startend, in Schleife, mit zufälligem Wiederholungsabstand. Hintergrundbrummen, Radios, tropfende Rohre — ohne eine Zeile Code.",
  "SoundBoxComponent": "SoundBoxComponent",
  "Like SoundPointComponent, but the source position is constrained to a box region. Perfect for a river or wind along a whole cliff edge.":
    "Wie SoundPointComponent, nur dass die Quelle auf einen quaderförmigen Bereich beschränkt ist. Ideal für einen Fluss oder für Wind entlang einer ganzen Klippe.",
  "SoundscapeTrigger": "SoundscapeTrigger",
  "Blends in an ambient soundscape when the listener enters the trigger. Walk into a cave, the cave sounds fade up.":
    "Blendet eine Klangkulisse ein, sobald der Zuhörer den Trigger betritt. Du gehst in eine Höhle, und die Höhlengeräusche kommen auf.",
  "AudioListener": "AudioListener",
  "Moves the listening point off the camera — e.g. onto the player's head in a third-person game so distances sound right.":
    "Verschiebt den Hörpunkt weg von der Kamera — etwa auf den Kopf des Spielers in einem Spiel aus der Verfolgerperspektive, damit Entfernungen richtig klingen.",
  "You give a car a looping engine sound and it drives across the map. Which approach keeps the audio on the car?":
    "Du gibst einem Auto ein Motorgeräusch in Schleife, und es fährt über die Karte. Womit bleibt der Klang beim Auto?",
  "Sound.Play(EngineLoop, WorldPosition) — the position parameter tracks the object":
    "Sound.Play(EngineLoop, WorldPosition) — der Positionsparameter folgt dem Objekt",
  "GameObject.PlaySound(EngineLoop) — the sound follows the GameObject every frame":
    "GameObject.PlaySound(EngineLoop) — das Geräusch folgt dem GameObject in jedem Frame",
  "Add an AudioSource component to the car": "Dem Auto eine AudioSource-Komponente geben",
  "Call Sound.Play(EngineLoop, WorldPosition) again every frame in OnUpdate":
    "In OnUpdate in jedem Frame erneut Sound.Play(EngineLoop, WorldPosition) aufrufen",
  "Sound.Play with a position is a snapshot — the car drives away and leaves its own engine noise behind. GameObject.PlaySound sets the handle's Parent and FollowParent for you. (AudioSource is Unity — s&box's closest editor equivalent is SoundPointComponent.) Re-playing every frame would stack hundreds of overlapping sounds.":
    "Sound.Play mit einer Position ist eine Momentaufnahme — das Auto fährt davon und lässt sein eigenes Motorgeräusch zurück. GameObject.PlaySound setzt dir Parent und FollowParent des Handles. (AudioSource ist Unity — am nächsten kommt im Editor von s&box die SoundPointComponent.) In jedem Frame neu abzuspielen würde Hunderte Geräusche übereinanderstapeln.",
  "Particle effects in the scene system": "Partikeleffekte im Szenensystem",
  "s&box's particle system is built from ordinary components — no separate particle editor required. It simulates on the CPU (heavily multithreaded) and is fully programmable: you can even call `ParticleEffect.Emit` yourself to spawn particles one by one. A working effect is three components on one GameObject:":
    "Das Partikelsystem von s&box besteht aus ganz gewöhnlichen Komponenten — einen eigenen Partikeleditor braucht es nicht. Es rechnet auf der CPU (stark parallelisiert) und ist vollständig programmierbar: Du kannst sogar selbst `ParticleEffect.Emit` aufrufen und Partikel einzeln erzeugen. Ein funktionierender Effekt sind drei Komponenten an einem GameObject:",
  "ParticleEffect": "ParticleEffect",
  "The base. Holds the particle list and ticks it. Set max particles, particle lifetime, and optional forces and world collision here.":
    "Die Grundlage. Hält die Partikelliste und lässt sie laufen. Hier stellst du die Höchstzahl an Partikeln, ihre Lebensdauer und wahlweise Kräfte und Kollision mit der Welt ein.",
  "An emitter": "Ein Emitter",
  "Spawns the particles: ParticleSphereEmitter, ParticleBoxEmitter, ParticleConeEmitter and friends. Key knobs: Rate (per second), Initial Burst (all at once), Loop, and DestroyOnEnd.":
    "Erzeugt die Partikel: ParticleSphereEmitter, ParticleBoxEmitter, ParticleConeEmitter und Verwandte. Die wichtigsten Stellschrauben: Rate (pro Sekunde), Initial Burst (alle auf einmal), Loop und DestroyOnEnd.",
  "A renderer": "Ein Renderer",
  "Makes them visible. ParticleSpriteRenderer draws camera-facing sprites (the usual choice); ParticleModelRenderer, ParticleLightRenderer and ParticleTrailRenderer exist too.":
    "Macht sie sichtbar. ParticleSpriteRenderer zeichnet Sprites, die zur Kamera zeigen (die übliche Wahl); ParticleModelRenderer, ParticleLightRenderer und ParticleTrailRenderer gibt es auch.",
  "Older tutorials — and the `Particles.Create(\"explosion\", position)` line you saw in the networking lesson — use the legacy Source 2 particle API (`.vpcf` files). That's not how the current scene system works: build effects from `ParticleEffect` components in a prefab and `Clone()` it. Same era-check for RPCs: the current attribute is `[Rpc.Broadcast]`, not plain `[Broadcast]`. In multiplayer, put the Clone + Sound.Play inside an `[Rpc.Broadcast]` method so every client sees and hears the impact.":
    "Ältere Anleitungen — und die Zeile `Particles.Create(\"explosion\", position)` aus der Lektion zur Vernetzung — benutzen die alte Partikel-API von Source 2 (`.vpcf`-Dateien). So arbeitet das heutige Szenensystem nicht: Bau Effekte aus `ParticleEffect`-Komponenten in einem Prefab und mach ein `Clone()` davon. Dieselbe Zeitprüfung gilt für RPCs: Das aktuelle Attribut heißt `[Rpc.Broadcast]`, nicht bloß `[Broadcast]`. Im Mehrspieler steckst du Clone und Sound.Play in eine Methode mit `[Rpc.Broadcast]`, damit jeder Client den Einschlag sieht und hört.",
  "Putting it together: impact where a trace hits":
    "Alles zusammen: der Einschlag dort, wo ein Trace trifft",
  "Build the impact prefab first: new GameObject → add ParticleEffect + ParticleSpriteRenderer + ParticleConeEmitter. On the emitter: Loop off, Rate 0, Initial Burst ~20, DestroyOnEnd on — the object deletes itself the moment the burst finishes. Save as a prefab and drag it onto the component's ImpactPrefab slot. Because the cone points along the object's forward axis, spawning it rotated to the surface normal makes sparks fly out of the wall.":
    "Bau zuerst das Einschlag-Prefab: neues GameObject → ParticleEffect + ParticleSpriteRenderer + ParticleConeEmitter hinzufügen. Am Emitter: Loop aus, Rate 0, Initial Burst etwa 20, DestroyOnEnd an — das Objekt löscht sich selbst, sobald der Stoß vorbei ist. Als Prefab speichern und in das Feld ImpactPrefab der Komponente ziehen. Weil der Kegel entlang der Vorwärtsachse des Objekts zeigt, sprühen die Funken aus der Wand, wenn du ihn zur Flächennormale gedreht erzeugst.",
  "Your impact prefab's emitter has Loop enabled and DestroyOnEnd off. What happens after a minute of shooting?":
    "Beim Emitter deines Einschlag-Prefabs ist Loop an und DestroyOnEnd aus. Was passiert nach einer Minute Schießen?",
  "Nothing — Loop only affects the editor preview":
    "Nichts — Loop wirkt sich nur auf die Vorschau im Editor aus",
  "Every clone keeps emitting forever and the GameObjects pile up — the scene leaks objects and frame rate sinks":
    "Jeder Klon sendet endlos weiter Partikel aus und die GameObjects häufen sich — die Szene verliert Objekte und die Bildrate sackt ab",
  "The engine automatically stops emitters after 10 seconds":
    "Die Engine hält Emitter nach 10 Sekunden von selbst an",
  "Clone() fails because looping prefabs can't be instantiated":
    "Clone() schlägt fehl, weil sich Prefabs in Schleife nicht erzeugen lassen",
  "Fire-and-forget effects must end and clean up after themselves. Loop off means the emitter runs once (your Initial Burst); DestroyOnEnd deletes the whole GameObject when it finishes. Forget either and every shot permanently adds an object to the scene — the classic slow-leak bug that only shows up in long playtests.":
    "Effekte nach dem Muster abschicken und vergessen müssen enden und hinter sich aufräumen. Loop aus heißt, der Emitter läuft einmal (dein Initial Burst); DestroyOnEnd löscht danach das ganze GameObject. Vergisst du eines von beiden, legt jeder Schuss dauerhaft ein Objekt in die Szene — der klassische schleichende Fehler, der erst in langen Spieltests auffällt.",

  // ── Animation & characters ────────────────────────────────────────────────
  "Animation & characters": "Animation & Figuren",
  "A crate uses `ModelRenderer`. A character that walks, aims and jumps uses `SkinnedModelRenderer` — a renderer for models with a skeleton. On top of the skeleton sits an animgraph: a state machine that decides which animations play and how they blend, driven by parameters your code sets every frame. You never play \"walk.fbx\" directly — you tell the graph how fast you're moving, and it picks and blends the right clips.":
    "Eine Kiste nimmt `ModelRenderer`. Eine Figur, die läuft, zielt und springt, nimmt `SkinnedModelRenderer` — einen Renderer für Modelle mit Skelett. Über dem Skelett sitzt ein Animgraph: ein Zustandsautomat, der entscheidet, welche Animationen laufen und wie sie ineinander übergehen, gesteuert von Parametern, die dein Code in jedem Frame setzt. Du spielst nie direkt „walk.fbx“ ab — du sagst dem Graphen, wie schnell du dich bewegst, und er wählt und mischt die passenden Schnipsel.",
  "SkinnedModelRenderer": "SkinnedModelRenderer",
  "Renders a skeletal model and runs its animgraph. Exposes `Set()` and `GetBool()`/`GetFloat()` to write and read graph parameters. Every animation call ends up here.":
    "Zeichnet ein Modell mit Skelett und lässt seinen Animgraph laufen. Bietet `Set()` sowie `GetBool()`/`GetFloat()`, um Parameter des Graphen zu schreiben und zu lesen. Jeder Animationsaufruf landet hier.",
  "Animgraph": "Animgraph",
  "A node-based state machine asset built in the editor. It owns the blending logic — your code only feeds it parameters like speed, grounded, holdtype.":
    "Ein Zustandsautomat aus Knoten, den du im Editor als Asset baust. Ihm gehört die Mischlogik — dein Code reicht nur Parameter hinein wie Tempo, Bodenkontakt und Haltung.",
  "CitizenAnimationHelper": "CitizenAnimationHelper",
  "A component that wraps the citizen's animgraph parameters in friendly methods — `WithVelocity`, `IsGrounded`, `HoldType` — so you don't memorise parameter names.":
    "Eine Komponente, die die Animgraph-Parameter des Citizen in bequeme Methoden verpackt — `WithVelocity`, `IsGrounded`, `HoldType` —, damit du dir keine Parameternamen merken musst.",
  "The citizen character": "Die Figur Citizen",
  "Facepunch ships a fully rigged character with the engine: the citizen, at `models/citizen/citizen.vmdl`. Its animgraph already handles walk/run blending, jumping, swimming, sitting, crouching and weapon poses — which makes it the perfect body for prototypes, NPCs and player characters. For players, the built-in `PlayerController` component even has an Animator feature that drives any citizen-compatible animgraph automatically. You write animation code yourself when you build NPCs, custom controllers, or anything the defaults don't cover.":
    "Facepunch liefert mit der Engine eine fertig aufgebaute Figur mit: den Citizen unter `models/citizen/citizen.vmdl`. Sein Animgraph beherrscht bereits den Übergang zwischen Gehen und Laufen, Springen, Schwimmen, Sitzen, Ducken und Waffenhaltungen — damit ist er der ideale Körper für Prototypen, NPCs und Spielfiguren. Für Spieler hat die mitgelieferte Komponente `PlayerController` sogar eine Animator-Funktion, die jeden Citizen-tauglichen Animgraph von selbst ansteuert. Animationscode schreibst du dann selbst, wenn du NPCs, eigene Steuerungen oder sonst etwas baust, das die Voreinstellungen nicht abdecken.",
  "Fast path: on a `PlayerController`, the Animator tab has a Create Body Renderer button — it spawns a \"Body\" child with a `SkinnedModelRenderer` and the citizen model, fully wired. And because `CitizenAnimationHelper` executes in the editor, you can drag its `DuckLevel` slider or switch `HoldType` in the inspector and watch the pose change live, without pressing Play.":
    "Der schnelle Weg: Beim `PlayerController` gibt es im Reiter Animator einen Knopf Create Body Renderer — der legt ein Kindobjekt „Body“ mit `SkinnedModelRenderer` und Citizen-Modell an, fertig verdrahtet. Und weil `CitizenAnimationHelper` schon im Editor läuft, kannst du seinen Regler `DuckLevel` ziehen oder `HoldType` im Inspector umschalten und der Haltung live beim Wechseln zusehen, ohne Play zu drücken.",
  "Drive locomotion with CitizenAnimationHelper":
    "Fortbewegung mit CitizenAnimationHelper ansteuern",
  "Add a `CitizenAnimationHelper` (namespace `Sandbox.Citizen`) to your character, point its `Target` property at the `SkinnedModelRenderer`, then feed it state every frame. It converts world-space velocity into the model-space blend values the graph expects:":
    "Häng deiner Figur einen `CitizenAnimationHelper` an (Namespace `Sandbox.Citizen`), richte seine Property `Target` auf den `SkinnedModelRenderer` und füttere ihn dann in jedem Frame mit dem Zustand. Er rechnet die Geschwindigkeit im Weltraum in die Mischwerte im Modellraum um, die der Graph erwartet:",
  "HoldType": "HoldType",
  "`_anim.HoldType = CitizenAnimationHelper.HoldTypes.Rifle;` — poses the upper body for what's held: None, Pistol, Rifle, Shotgun, HoldItem, Punch, Swing, RPG, Physgun.":
    "`_anim.HoldType = CitizenAnimationHelper.HoldTypes.Rifle;` — stellt den Oberkörper auf das ein, was gehalten wird: None, Pistol, Rifle, Shotgun, HoldItem, Punch, Swing, RPG, Physgun.",
  "Handedness": "Handedness",
  "Which hand holds the item — `Hand.Right`, `Hand.Left` or `Hand.Both`. Only some holdtypes support it, like Pistol and HoldItem.":
    "Welche Hand den Gegenstand hält — `Hand.Right`, `Hand.Left` oder `Hand.Both`. Nur manche Haltungen unterstützen das, etwa Pistol und HoldItem.",
  "TriggerDeploy()": "TriggerDeploy()",
  "Plays the weapon draw animation once. Call it when the player switches weapons.":
    "Spielt die Animation zum Ziehen der Waffe einmal ab. Ruf sie auf, wenn der Spieler die Waffe wechselt.",
  "IsWeaponLowered": "IsWeaponLowered",
  "Relaxes the aim pose. Set it true when the player hasn't fired for a while — cheap, instant polish.":
    "Entspannt die Zielhaltung. Setz es auf wahr, wenn der Spieler eine Weile nicht geschossen hat — billiger Feinschliff, der sofort wirkt.",
  "You call `_anim.WithVelocity( new Vector3( 200, 0, 0 ) )` every frame. What does the citizen do?":
    "Du rufst in jedem Frame `_anim.WithVelocity( new Vector3( 200, 0, 0 ) )` auf. Was macht der Citizen?",
  "Moves forward at 200 units per second": "Bewegt sich mit 200 Einheiten pro Sekunde vorwärts",
  "Plays a run animation blended for 200 units/sec — but stays exactly where it is":
    "Spielt eine Laufanimation, gemischt für 200 Einheiten pro Sekunde — bleibt aber genau da, wo er ist",
  "Teleports 200 units forward, then animates the transition":
    "Versetzt sich 200 Einheiten nach vorn und animiert dann den Übergang",
  "Nothing, until you also call Play(\"run\")": "Nichts, solange du nicht auch Play(\"run\") aufrufst",
  "Animation and movement are decoupled. Your movement code (or the PlayerController) moves the GameObject; the helper only feeds parameters to the animgraph so the body matches. That split is why the same animation code works for a player, an AI-driven NPC, or a networked proxy — whatever moves the character, the legs follow.":
    "Animation und Bewegung hängen nicht aneinander. Dein Bewegungscode (oder der PlayerController) bewegt das GameObject; der Helper reicht nur Parameter an den Animgraph, damit der Körper dazu passt. Wegen dieser Trennung funktioniert derselbe Animationscode für einen Spieler, für einen von der KI gesteuerten NPC und für einen Stellvertreter im Netzwerk — was auch immer die Figur bewegt, die Beine gehen mit.",
  "Animgraph parameters, directly": "Animgraph-Parameter, direkt",
  "Unity muscle memory will betray you here. There is no `Animator` component and no `animator.SetTrigger(\"Jump\")` — you call `Set()` on the `SkinnedModelRenderer` itself, and it's `Set(\"b_jump\", true)` not SetBool/SetTrigger. Also, older s&box tutorials use a `FootShuffle` property on the helper — that's obsolete now; the current name is `MoveRotationSpeed`, which shuffles the feet when the character turns in place.":
    "Das Muskelgedächtnis aus Unity führt dich hier in die Irre. Eine `Animator`-Komponente gibt es nicht und ein `animator.SetTrigger(\"Jump\")` auch nicht — du rufst `Set()` direkt auf dem `SkinnedModelRenderer` auf, und zwar `Set(\"b_jump\", true)` statt SetBool oder SetTrigger. Ältere s&box-Anleitungen benutzen außerdem eine Property `FootShuffle` am Helper — die ist überholt; heute heißt sie `MoveRotationSpeed` und lässt die Füße trippeln, wenn sich die Figur auf der Stelle dreht.",
  "Wire it up: a patrolling NPC": "Alles verdrahten: ein patrouillierender NPC",
  "Here's the full pattern — one component that owns movement and mirrors it into animation. Set it up as: a GameObject with your logic + `CitizenAnimationHelper`, a child with a `SkinnedModelRenderer` using the citizen model, and the helper's `Target` pointing at that renderer. This is worth typing out yourself:":
    "Hier das vollständige Muster — eine Komponente, der die Bewegung gehört und die sie in die Animation spiegelt. Bau es so auf: ein GameObject mit deiner Logik und `CitizenAnimationHelper`, ein Kindobjekt mit einem `SkinnedModelRenderer` samt Citizen-Modell, und das `Target` des Helpers zeigt auf diesen Renderer. Das lohnt sich abzutippen:",
  "Which line fires the citizen's jump animation at the animgraph level?":
    "Welche Zeile löst die Sprunganimation des Citizen auf Ebene des Animgraphen aus?",
  "Bool parameters use the `b_` prefix, and `b_jump` is a one-shot the graph consumes and resets. The helper's `TriggerJump()` is literally this one line. Knowing the raw `Set()` API matters beyond the citizen — when you build an animgraph for your own monster or vehicle driver, the exact same calls drive it.":
    "Bool-Parameter tragen das Präfix `b_`, und `b_jump` ist ein einmaliger Auslöser, den der Graph verbraucht und zurücksetzt. Das `TriggerJump()` des Helpers ist buchstäblich diese eine Zeile. Die nackte `Set()`-API zu kennen zahlt sich über den Citizen hinaus aus — wenn du einen Animgraph für dein eigenes Monster oder einen Fahrzeugführer baust, steuern ihn genau dieselben Aufrufe.",

  // ── Cameras ───────────────────────────────────────────────────────────────
  "Cameras": "Kameras",
  "The camera is just a component — a `CameraComponent` sitting on a GameObject in your scene. Nothing owns it, nothing moves it for you. Whoever writes the code that positions it each frame decides whether your game is an FPS, a top-down shooter, or a side-scroller. From any component, `Scene.Camera` gives you the active one.":
    "Die Kamera ist bloß eine Komponente — eine `CameraComponent`, die an einem GameObject in deiner Szene hängt. Niemandem gehört sie, niemand bewegt sie für dich. Wer den Code schreibt, der sie in jedem Frame setzt, entscheidet, ob dein Spiel ein Ego-Shooter, ein Shooter von oben oder ein Seitenscroller ist. Aus jeder Komponente heraus gibt dir `Scene.Camera` die aktive.",
  "The built-in `PlayerController` component ships with camera controls — a Camera feature toggle in the inspector with `ThirdPerson`, `CameraOffset`, and an input action to switch views. Great for prototyping. This lesson is for when you turn that off (untick \"Camera\" on the component) and drive `Scene.Camera` yourself — which every game eventually does.":
    "Die mitgelieferte Komponente `PlayerController` bringt eine Kamerasteuerung mit — im Inspector einen Schalter Camera mit `ThirdPerson`, `CameraOffset` und einer Eingabeaktion zum Umschalten der Ansicht. Für Prototypen bestens. Diese Lektion ist für den Moment, in dem du das ausschaltest (den Haken bei „Camera“ an der Komponente entfernst) und `Scene.Camera` selbst steuerst — und dahin kommt jedes Spiel irgendwann.",
  "First person: accumulate eye angles": "Ich-Perspektive: Blickwinkel aufsummieren",
  "The pattern: keep an `Angles` field (pitch, yaw, roll). Every frame, add `Input.AnalogLook` to it — that's this frame's look delta, already merged from mouse movement and controller sticks with the player's sensitivity and invert settings applied. Clamp pitch so the player can't backflip their neck, zero the roll, convert to a `Rotation`, and put the camera at eye height.":
    "Das Muster: Halte ein Feld `Angles` (Nicken, Gieren, Rollen). Addiere in jedem Frame `Input.AnalogLook` darauf — das ist die Blickänderung dieses Frames, bereits aus Mausbewegung und Controller-Sticks zusammengeführt, mit der Empfindlichkeit und den Umkehr-Einstellungen des Spielers. Begrenze das Nicken, damit sich der Spieler nicht das Genick überschlägt, setz das Rollen auf null, wandle in eine `Rotation` um und setz die Kamera auf Augenhöhe.",
  "Two classic mistakes here. First: do NOT multiply look input by `Time.Delta` — `Input.AnalogLook` is already a per-frame delta (\"how far the mouse moved since last frame\"). Scaling it again makes aim speed change with frame rate, which feels awful. Second: older tutorials read `Input.MouseDelta` and apply sensitivity by hand — that still exists, but `Input.AnalogLook` is the idiomatic way now because it handles mouse, sticks, sensitivity, and invert preferences for free.":
    "Hier lauern zwei klassische Fehler. Erstens: Multipliziere die Blickeingabe NICHT mit `Time.Delta` — `Input.AnalogLook` ist bereits eine Änderung pro Frame („wie weit sich die Maus seit dem letzten Frame bewegt hat“). Sie noch einmal zu skalieren lässt die Zielgeschwindigkeit mit der Bildrate schwanken, und das fühlt sich scheußlich an. Zweitens: Ältere Anleitungen lesen `Input.MouseDelta` und rechnen die Empfindlichkeit von Hand ein — das gibt es weiterhin, aber `Input.AnalogLook` ist heute der übliche Weg, weil es Maus, Sticks, Empfindlichkeit und Umkehr-Einstellungen von selbst berücksichtigt.",
  "Third person: orbit, then trace back": "Verfolgerperspektive: umkreisen, dann zurücktracen",
  "Why trace at all? Back the camera up 200 units and the player will immediately stand against a wall — without the trace, the camera ends up inside or behind it, showing the void. Tracing from the eye to the wanted position and stopping at the first hit pulls the camera in front of the wall instead. The `.Radius(8f)` makes it a sphere trace: a thin ray can stop with the camera touching the wall, and the near clip plane still pokes through. This is exactly how s&box's own PlayerController does it — the engine source even lerps `tr.Distance` over a few frames so the zoom feels smooth instead of snappy.":
    "Wozu überhaupt tracen? Setz die Kamera 200 Einheiten zurück, und der Spieler steht sofort an einer Wand — ohne Trace landet die Kamera darin oder dahinter und zeigt die Leere. Von den Augen zur gewünschten Position zu tracen und beim ersten Treffer anzuhalten zieht die Kamera stattdessen vor die Wand. Das `.Radius(8f)` macht daraus einen Kugel-Trace: Ein dünner Strahl kann so enden, dass die Kamera die Wand berührt, und die nahe Schnittebene ragt trotzdem hindurch. Genau so macht es der PlayerController von s&box selbst — der Quelltext der Engine lässt `tr.Distance` sogar über ein paar Frames gleiten, damit der Zoom weich wirkt statt ruckartig.",
  "Juice: FOV kicks and screen shake": "Würze: Sichtfeld-Stöße und Bildschirmwackeln",
  "To trigger that shake from a networked event — a grenade every client should feel — you'd call a method marked `[Rpc.Broadcast]`. The networking lesson showed `[Broadcast]`, but the SDK renamed the RPC attributes: it's `[Rpc.Broadcast]` now, alongside `[Rpc.Owner]` and `[Rpc.Host]`. The old name won't compile in current s&box.":
    "Um dieses Wackeln aus einem Netzwerkereignis heraus auszulösen — eine Granate, die jeder Client spüren soll —, rufst du eine Methode mit `[Rpc.Broadcast]` auf. Die Lektion zur Vernetzung zeigte `[Broadcast]`, aber das SDK hat die RPC-Attribute umbenannt: Heute heißt es `[Rpc.Broadcast]`, daneben `[Rpc.Owner]` und `[Rpc.Host]`. Der alte Name lässt sich im heutigen s&box nicht mehr kompilieren.",
  "Scene.Camera": "Scene.Camera",
  "The active CameraComponent. If several exist, ones with `IsMainCamera` win, then lowest `Priority`. Returns null if the scene has no camera — add one via the Camera object template.":
    "Die aktive CameraComponent. Gibt es mehrere, gewinnen die mit `IsMainCamera`, danach die mit der niedrigsten `Priority`. Gibt null zurück, wenn die Szene keine Kamera hat — leg über die Objektvorlage Camera eine an.",
  "OnPreRender()": "OnPreRender()",
  "Lifecycle hook that runs right before the frame is drawn — after every OnUpdate. Position cameras here so they never lag one frame behind the thing they follow.":
    "Der Haken im Lebenszyklus, der unmittelbar vor dem Zeichnen des Frames läuft — nach allen OnUpdate. Setz Kameras hier, dann hinken sie dem, was sie verfolgen, nie einen Frame hinterher.",
  "FieldOfView": "FieldOfView",
  "In degrees, default 60. For player comfort, respect their settings: `cam.FieldOfView = Preferences.FieldOfView` uses the value from the s&box options menu.":
    "In Grad, voreingestellt 60. Nimm dem Spieler zuliebe seine Einstellung: `cam.FieldOfView = Preferences.FieldOfView` benutzt den Wert aus dem Optionsmenü von s&box.",
  "Scene.Trace": "Scene.Trace",
  "`Scene.Trace.FromTo(a, b).Radius(r).Run()` — the collision query behind wall-safe cameras. Check `tr.Hit`, `tr.Distance`, `tr.EndPosition`, and `tr.StartedSolid`.":
    "`Scene.Trace.FromTo(a, b).Radius(r).Run()` — die Kollisionsabfrage hinter wandsicheren Kameras. Prüf `tr.Hit`, `tr.Distance`, `tr.EndPosition` und `tr.StartedSolid`.",
  "Your first-person camera turns fast at 144fps but sluggishly at 30fps. What's the likely bug?":
    "Deine Kamera in der Ich-Perspektive dreht bei 144 fps schnell, bei 30 fps aber zäh. Was ist wahrscheinlich der Fehler?",
  "You forgot to multiply Input.AnalogLook by Time.Delta":
    "Du hast vergessen, Input.AnalogLook mit Time.Delta zu multiplizieren",
  "You multiplied Input.AnalogLook by Time.Delta — it's already a per-frame delta, so scaling it makes turn speed depend on frame rate":
    "Du hast Input.AnalogLook mit Time.Delta multipliziert — es ist bereits eine Änderung pro Frame, und es noch einmal zu skalieren macht die Drehgeschwindigkeit von der Bildrate abhängig",
  "You should read input in OnFixedUpdate instead":
    "Du solltest die Eingabe stattdessen in OnFixedUpdate lesen",
  "FieldOfView needs to be lower at high frame rates":
    "FieldOfView muss bei hohen Bildraten niedriger sein",
  "Time.Delta converts per-second speeds into per-frame amounts — but mouse input is already \"distance moved this frame\". Continuous speeds (movement, rotation over time) get Time.Delta; per-frame deltas (AnalogLook, MouseDelta) never do. Getting this wrong is the number one reason aim \"feels off\" in student projects.":
    "Time.Delta rechnet Geschwindigkeiten pro Sekunde in Beträge pro Frame um — die Mauseingabe ist aber schon „die in diesem Frame zurückgelegte Strecke“. Fortlaufende Geschwindigkeiten (Bewegung, Drehung über die Zeit) bekommen Time.Delta; Änderungen pro Frame (AnalogLook, MouseDelta) nie. Das zu verwechseln ist der häufigste Grund, warum sich das Zielen in Übungsprojekten „falsch anfühlt“.",
  "Your third-person camera shows the inside of walls when the player backs into a corner. What's the standard fix?":
    "Deine Kamera in der Verfolgerperspektive zeigt das Innere von Wänden, wenn der Spieler rückwärts in eine Ecke geht. Was ist die übliche Lösung?",
  "Increase the camera's ZNear so walls clip out of view":
    "Das ZNear der Kamera erhöhen, damit Wände aus dem Bild geschnitten werden",
  "Tag walls so the camera doesn't render them":
    "Wände mit Tags versehen, damit die Kamera sie nicht zeichnet",
  "Sphere-trace from the player's eye to the wanted camera spot and place the camera at tr.EndPosition":
    "Mit einem Kugel-Trace von den Augen des Spielers zur gewünschten Kameraposition tracen und die Kamera auf tr.EndPosition setzen",
  "Parent the camera to the player so it moves through walls with them":
    "Die Kamera an den Spieler hängen, damit sie mit ihm durch Wände geht",
  "The trace treats the camera boom like a physical arm that walls can push in. Every polished third-person game does this — it's why the camera in those games zooms toward the character's shoulder in tight spaces. Use a radius on the trace so the near clip plane can't peek through, and lerp the distance so the zoom is smooth.":
    "Der Trace behandelt den Kameraarm wie einen echten Ausleger, den Wände einschieben können. Jedes ausgefeilte Spiel in der Verfolgerperspektive macht das — deshalb rückt die Kamera dort in engen Stellen an die Schulter der Figur heran. Gib dem Trace einen Radius, damit die nahe Schnittebene nicht hindurchlugt, und lass die Entfernung gleiten, damit der Zoom weich wirkt.",

  // ── Multiplayer in practice ───────────────────────────────────────────────
  "Multiplayer in practice": "Mehrspieler in der Praxis",
  "The Networking basics lesson gave you `[Sync]` and the server-authority rule. This lesson is the machinery that turns those into a playable game. The core mental model: every networked GameObject exists on every connected machine, but exactly one connection owns it. The owner simulates it; everyone else holds a proxy that the network updates. Get that straight and multiplayer stops being mysterious.":
    "Die Lektion zu den Grundlagen der Vernetzung hat dir `[Sync]` und die Regel von der Hoheit des Servers gegeben. Diese Lektion ist die Mechanik, die daraus ein spielbares Spiel macht. Das entscheidende Bild: Jedes vernetzte GameObject existiert auf jedem verbundenen Rechner, aber genau eine Verbindung besitzt es. Der Besitzer simuliert es; alle anderen halten einen Stellvertreter, den das Netzwerk aktualisiert. Wer das verstanden hat, dem ist am Mehrspieler nichts mehr rätselhaft.",
  "IsProxy — only simulate what you own": "IsProxy — nur simulieren, was dir gehört",
  "Your player prefab's movement component runs on every machine — including on the copies of everyone else's characters. The first line of any owned-object logic asks one question: is this copy mine?":
    "Die Bewegungskomponente deines Spieler-Prefabs läuft auf jedem Rechner — auch auf den Kopien der Figuren aller anderen. Die erste Zeile jeder Logik für ein besessenes Objekt stellt eine einzige Frage: Gehört diese Kopie mir?",
  "Forget the `IsProxy` guard and every machine applies its own input to every player — characters jitter, snap back, or fly at double speed as local simulation fights incoming network updates. When a networked object misbehaves, check for a missing guard first. It's the single most common multiplayer bug in s&box.":
    "Vergiss die Absicherung mit `IsProxy`, und jeder Rechner wendet seine eigene Eingabe auf jeden Spieler an — Figuren zittern, springen zurück oder fliegen doppelt so schnell, weil die lokale Simulation gegen die eintreffenden Netzwerkdaten kämpft. Wenn ein vernetztes Objekt sich seltsam benimmt, such zuerst nach einer fehlenden Absicherung. Das ist in s&box der mit Abstand häufigste Fehler im Mehrspieler.",
  "Ownership can move": "Besitz kann wechseln",
  "Ownership isn't fixed at spawn. A crate should be simulated by whoever is carrying it, a car by its driver — physics feels instant when the machine using an object is also the one simulating it. Each networked object has an `OwnerTransfer` rule that controls who may change its owner, set with `Network.SetOwnerTransfer(...)` or in the object's network settings.":
    "Der Besitz steht nicht schon beim Erzeugen fest. Eine Kiste sollte der simulieren, der sie trägt, ein Auto sein Fahrer — Physik fühlt sich unmittelbar an, wenn der Rechner, der ein Objekt benutzt, es auch simuliert. Jedes vernetzte Objekt hat eine Regel `OwnerTransfer`, die bestimmt, wer seinen Besitzer ändern darf; du setzt sie mit `Network.SetOwnerTransfer(...)` oder in den Netzwerkeinstellungen des Objekts.",
  "OwnerTransfer.Takeover": "OwnerTransfer.Takeover",
  "Anyone can call TakeOwnership() at any time. Right for shared props — crates, balls, anything grabbable.":
    "Jeder darf jederzeit TakeOwnership() aufrufen. Richtig für gemeinsam benutzte Requisiten — Kisten, Bälle, alles Greifbare.",
  "OwnerTransfer.Fixed": "OwnerTransfer.Fixed",
  "Only the host can change the owner. Right for player characters — nobody should be able to steal your pawn.":
    "Nur der Host darf den Besitzer ändern. Richtig für Spielfiguren — niemand soll dir deine Figur wegnehmen können.",
  "OwnerTransfer.Request": "OwnerTransfer.Request",
  "Clients ask, the host decides. TakeOwnership() becomes a request the host can refuse — right for contested objects like a vehicle seat.":
    "Die Clients fragen, der Host entscheidet. TakeOwnership() wird zur Bitte, die der Host abschlagen kann — richtig für umkämpfte Objekte wie einen Fahrzeugsitz.",
  "RPCs — pick the right audience": "RPCs — den richtigen Empfängerkreis wählen",
  "Older tutorials and code snippets use `[Broadcast]` and `[Authority]`. The SDK renamed these: the current attributes are `[Rpc.Broadcast]`, `[Rpc.Host]` (covering the old `[Authority]` role), and `[Rpc.Owner]`. If the compiler says the attribute doesn't exist, you're reading outdated code.":
    "Ältere Anleitungen und Codeschnipsel benutzen `[Broadcast]` und `[Authority]`. Das SDK hat sie umbenannt: Heute heißen die Attribute `[Rpc.Broadcast]`, `[Rpc.Host]` (das übernimmt die alte Rolle von `[Authority]`) und `[Rpc.Owner]`. Sagt der Compiler, es gebe das Attribut nicht, liest du veralteten Code.",
  "You land a shot on another player. The host confirms the hit, and you want a hitmarker to flash only on the shooter's screen. Which RPC does the host call on the shooter's player object?":
    "Du triffst einen anderen Spieler. Der Host bestätigt den Treffer, und du willst, dass eine Treffermarkierung nur auf dem Bildschirm des Schützen aufblitzt. Welches RPC ruft der Host auf dem Spielerobjekt des Schützen auf?",
  "[Rpc.Broadcast] — everyone should be told about the hit":
    "[Rpc.Broadcast] — alle sollen vom Treffer erfahren",
  "[Rpc.Owner] — it runs only on the machine that owns that player object":
    "[Rpc.Owner] — das läuft nur auf dem Rechner, dem dieses Spielerobjekt gehört",
  "A [Sync] bool ShowHitmarker set to true": "Ein [Sync]-bool ShowHitmarker, auf wahr gesetzt",
  "[Rpc.Host] — hit confirmation is authoritative":
    "[Rpc.Host] — die Trefferbestätigung kommt von der maßgeblichen Stelle",
  "Match the RPC to its audience: Broadcast is for effects everyone sees, Host is for clients asking the authority to do something, Owner is for private feedback like hitmarkers and damage numbers. And use RPCs, not [Sync], for one-shot events — [Sync] is for persistent state, and a synced bool would flash on every screen and need resetting.":
    "Wähl das RPC nach seinem Empfängerkreis: Broadcast ist für Effekte, die alle sehen, Host ist dafür, dass Clients die maßgebliche Stelle um etwas bitten, Owner ist für private Rückmeldungen wie Treffermarkierungen und Schadenszahlen. Und nimm für einmalige Ereignisse RPCs statt `[Sync]` — `[Sync]` ist für bleibenden Zustand, und ein abgeglichenes bool würde auf jedem Bildschirm aufblitzen und müsste zurückgesetzt werden.",
  "The game manager — lobby in, players spawned": "Der Game Manager — Lobby rein, Spieler erzeugt",
  "This whole loop ships built-in: add the Network Helper component (Add Component → Networking) to a scene object, drag in a player prefab, and it creates the lobby and spawns one pawn per connection at a random `SpawnPoint`. Start with it, replace it with your own manager when you need teams or round logic. `Component.INetworkListener` has more hooks too: `OnConnected`/`OnDisconnected` for join and leave, `OnBecameHost` for when the old host quits and you inherit the game, and `AcceptConnection` to turn away banned players before they load in.":
    "Diese ganze Schleife ist bereits eingebaut: Häng einem Objekt der Szene die Komponente Network Helper an (Add Component → Networking), zieh ein Spieler-Prefab hinein, und sie legt die Lobby an und erzeugt je Verbindung eine Figur an einem zufälligen `SpawnPoint`. Fang damit an und ersetze sie durch deinen eigenen Manager, sobald du Mannschaften oder Rundenlogik brauchst. `Component.INetworkListener` hat noch mehr Haken: `OnConnected`/`OnDisconnected` fürs Betreten und Verlassen, `OnBecameHost` für den Fall, dass der bisherige Host aufhört und du das Spiel erbst, und `AcceptConnection`, um gesperrte Spieler abzuweisen, bevor sie überhaupt laden.",
  "In the GameManager above, where does `OnActive` run, and what does `player.NetworkSpawn( channel )` actually do?":
    "Wo läuft im GameManager oben `OnActive`, und was macht `player.NetworkSpawn( channel )` tatsächlich?",
  "It runs on the joining client, and spawns the player only on their machine":
    "Es läuft auf dem beitretenden Client und erzeugt den Spieler nur auf dessen Rechner",
  "It runs on every machine, and each one spawns its own copy of the prefab":
    "Es läuft auf jedem Rechner, und jeder erzeugt seine eigene Kopie des Prefabs",
  "It runs on the host; NetworkSpawn creates the object on every connected machine and makes channel its owner":
    "Es läuft auf dem Host; NetworkSpawn legt das Objekt auf jedem verbundenen Rechner an und macht channel zu seinem Besitzer",
  "It runs on a dedicated server process; clients must Clone the prefab themselves":
    "Es läuft in einem eigenen Serverprozess; die Clients müssen das Prefab selbst klonen",
  "The host spawns exactly once and the network replicates the object to everyone — if each machine cloned its own copy you'd get eight balls per match instead of one. Passing the connection sets the owner, which is what makes IsProxy false on that player's machine so their input drives the pawn. Spawn on the host, own on the client: that's the whole pattern.":
    "Der Host erzeugt genau einmal, und das Netzwerk trägt das Objekt zu allen — würde jeder Rechner seine eigene Kopie klonen, hättest du acht Bälle je Partie statt einem. Die Verbindung mitzugeben setzt den Besitzer, und genau das macht IsProxy auf dem Rechner dieses Spielers falsch, sodass seine Eingabe die Figur steuert. Auf dem Host erzeugen, auf dem Client besitzen: Das ist das ganze Muster.",

  // ── Ship your game ────────────────────────────────────────────────────────
  "Ship your game": "Bring dein Spiel heraus",
  "You can write C#, build components, read input, and network state. The last skill is the one most developers never practice: actually shipping. In s&box, publishing is built into the editor — your game goes live on sbox.game where anyone can click it and play, no installers, no store approval queue.":
    "Du kannst C# schreiben, Komponenten bauen, Eingaben lesen und Zustand über das Netz verteilen. Die letzte Fertigkeit ist die, die die meisten Entwickler nie üben: es tatsächlich herausbringen. In s&box steckt das Veröffentlichen im Editor — dein Spiel geht auf sbox.game live, wo es jeder anklicken und spielen kann, ohne Installation und ohne Warteschlange bei einer Ladenprüfung.",
  "Publishing to sbox.game": "Auf sbox.game veröffentlichen",
  "Click your project's name (the title button with your logo, top-left of the editor) and choose `Publish..`. A wizard walks you through it: confirm your Title, Ident and Organisation, it compiles your code and uploads your assets, you write a short revision note, and hit Publish New Revision. Before you do — check Project Settings and make sure your startup scene is set to the scene players should actually land in (a menu scene or straight into gameplay). The same menu also has `Export..` for standalone Steam builds, but sbox.game is where you start.":
    "Klick auf den Namen deines Projekts (den Titelknopf mit deinem Logo, links oben im Editor) und wähl `Publish..`. Ein Assistent führt dich hindurch: Title, Ident und Organisation bestätigen, er kompiliert deinen Code und lädt deine Assets hoch, du schreibst eine kurze Notiz zur Fassung und drückst Publish New Revision. Vorher: Schau in die Project Settings und stell sicher, dass als Startszene die Szene eingetragen ist, in der Spieler tatsächlich landen sollen (eine Menüszene oder direkt das Spiel). Im selben Menü gibt es auch `Export..` für eigenständige Steam-Fassungen, aber angefangen wird auf sbox.game.",
  "Your game's identity is `org.package` — like `facepunch.ss1`. Create an organisation on the sbox.game website first (the wizard links you there); a brand-new org may need an editor restart before it appears in the dropdown. Idents can't contain spaces or special characters, and the combined `orgname.packageident` is the permanent, unique ID for your game — pick it like you'd pick a username.":
    "Die Kennung deines Spiels ist `org.package` — etwa `facepunch.ss1`. Leg zuerst auf der Website sbox.game eine Organisation an (der Assistent verlinkt dich dorthin); bei einer brandneuen Organisation muss der Editor womöglich einmal neu starten, bevor sie in der Auswahlliste auftaucht. Idents dürfen keine Leerzeichen und keine Sonderzeichen enthalten, und das zusammengesetzte `orgname.packageident` ist die dauerhafte, eindeutige Kennung deines Spiels — wähl sie wie einen Benutzernamen.",
  "After publishing, your game gets its own page on sbox.game. Click View and Edit on Web to add a description, screenshots and video — that page is your store listing, so treat it like one. Until you flip it to public, only members of your organisation can access it, which makes a private publish a great playtest channel. Updating is just publishing again: the wizard asks for a change title and detail, and players automatically get the newest revision next time they play.":
    "Nach dem Veröffentlichen bekommt dein Spiel eine eigene Seite auf sbox.game. Klick auf View and Edit on Web, um Beschreibung, Bildschirmfotos und Video zu ergänzen — diese Seite ist dein Ladeneintrag, also behandle sie auch so. Solange du sie nicht öffentlich schaltest, kommen nur Mitglieder deiner Organisation heran, und damit ist eine private Veröffentlichung ein hervorragender Weg für Spieltests. Aktualisieren heißt schlicht: noch einmal veröffentlichen. Der Assistent fragt nach Titel und Einzelheiten der Änderung, und die Spieler bekommen beim nächsten Spielen von selbst die neueste Fassung.",
  "You publish `blaster` under your organisation `sophie`. What identifies your game on sbox.game?":
    "Du veröffentlichst `blaster` unter deiner Organisation `sophie`. Was kennzeichnet dein Spiel auf sbox.game?",
  "com.sophie.blaster — a reverse-domain bundle ID":
    "com.sophie.blaster — eine Bundle-ID in umgedrehter Domainschreibweise",
  "sophie.blaster — org ident dot package ident, and it's permanent":
    "sophie.blaster — Ident der Organisation, Punkt, Ident des Pakets, und das bleibt so",
  "A random GUID that Steam assigns at upload time":
    "Eine zufällige GUID, die Steam beim Hochladen vergibt",
  "sophie.blaster, but you can rename the ident freely in Project Settings later":
    "sophie.blaster, aber du kannst den Ident später in den Project Settings beliebig umbenennen",
  "The `org.package` ident is the unique persistent identifier for your package — leaderboard APIs, map loading, and cloud asset references all use it (e.g. `facepunch.ss1`). Because everything keys off it, it isn't meant to change, so choose it carefully before your first publish.":
    "Der Ident `org.package` ist die eindeutige, bleibende Kennung deines Pakets — die APIs für Bestenlisten, das Laden von Karten und Verweise auf Assets in der Cloud benutzen sie alle (etwa `facepunch.ss1`). Weil sich alles daran hängt, ist sie nicht zum Ändern gedacht; wähl sie also vor der ersten Veröffentlichung mit Bedacht.",
  "Test multiplayer before you ship": "Teste den Mehrspieler, bevor du herausbringst",
  "Never ship a multiplayer game you've only played alone. In the editor, click the network status icon in the header bar and choose Join via new instance — a second copy of the game launches and joins your running session, so you can watch both screens. Hot reload still works: save a C# file and the change mirrors to every connected client, including that second instance. You can also open an instance manually and type `connect local` in the console, or `reconnect` after a code change that needs a fresh join.":
    "Bring nie ein Mehrspielerspiel heraus, das du nur allein gespielt hast. Klick im Editor in der Kopfleiste auf das Symbol für den Netzwerkstatus und wähl Join via new instance — eine zweite Ausgabe des Spiels startet und tritt deiner laufenden Sitzung bei, sodass du beide Bildschirme im Blick hast. Hot Reload funktioniert weiterhin: Speichere eine C#-Datei, und die Änderung überträgt sich auf jeden verbundenen Client, auch auf diese zweite Ausgabe. Du kannst auch von Hand eine Ausgabe öffnen und in der Konsole `connect local` eintippen, oder `reconnect` nach einer Codeänderung, die einen frischen Beitritt braucht.",
  "API rename: older tutorials show `[Broadcast]` and `[Authority]` — the current SDK uses `[Rpc.Broadcast]`, `[Rpc.Owner]` (runs only for the object's owner) and `[Rpc.Host]` (runs only on the host). To restrict who may *call* an RPC, pass flags like `NetFlags.HostOnly`. The old attribute names won't compile on today's SDK — update them before you publish.":
    "Umbenannte API: Ältere Anleitungen zeigen `[Broadcast]` und `[Authority]` — das heutige SDK benutzt `[Rpc.Broadcast]`, `[Rpc.Owner]` (läuft nur beim Besitzer des Objekts) und `[Rpc.Host]` (läuft nur auf dem Host). Um einzuschränken, wer ein RPC *aufrufen* darf, gibst du Flags wie `NetFlags.HostOnly` mit. Die alten Attributnamen lassen sich mit dem heutigen SDK nicht kompilieren — bring sie in Ordnung, bevor du veröffentlichst.",
  "Performance quick wins": "Schnelle Gewinne bei der Leistung",
  "`OnUpdate` runs every frame for every component — at 60fps, one careless line runs 3,600 times a minute. The two classic killers: scanning the scene per frame (`Scene.GetAllComponents<T>()` walks everything), and allocating per frame (`new List`, LINQ chains ending in `.ToList()`, string concatenation) which piles up garbage the runtime must pause to collect. The fix is always the same: do expensive lookups once in `OnStart`, cache the result, and keep per-frame work cheap.":
    "`OnUpdate` läuft in jedem Frame für jede Komponente — bei 60 fps läuft eine unbedachte Zeile 3.600-mal pro Minute. Die zwei klassischen Übeltäter: die Szene je Frame durchsuchen (`Scene.GetAllComponents<T>()` läuft über alles) und je Frame Speicher anfordern (`new List`, LINQ-Ketten, die auf `.ToList()` enden, Strings aneinanderhängen), wodurch sich Abfall häuft, für dessen Beseitigung die Laufzeitumgebung anhalten muss. Die Lösung ist immer dieselbe: teure Suchen einmal in `OnStart` erledigen, das Ergebnis behalten und die Arbeit je Frame billig halten.",
  "Your game runs smooth with 5 enemies but chugs with 200. Which habit is the most likely culprit?":
    "Dein Spiel läuft mit 5 Gegnern flüssig, stockt aber bei 200. Welche Angewohnheit ist am ehesten schuld?",
  "Caching component references in OnStart instead of finding them fresh":
    "Referenzen auf Komponenten in OnStart behalten, statt sie neu zu suchen",
  "Calling Scene.GetAllComponents<Enemy>() inside OnUpdate — a full scene scan every single frame":
    "Scene.GetAllComponents<Enemy>() in OnUpdate aufrufen — ein vollständiger Durchgang durch die Szene in jedem einzelnen Frame",
  "Using [Property] on too many fields": "[Property] an zu vielen Feldern benutzen",
  "Doing physics movement in OnFixedUpdate instead of OnUpdate":
    "Physikbewegung in OnFixedUpdate statt in OnUpdate machen",
  "Per-frame cost scales with object count, so problems hide at small scale and explode at large scale. Caching in OnStart and physics in OnFixedUpdate are the *correct* habits. Before shipping, profile with a realistic worst case — a full server and a full wave — not the two-object test scene you developed in.":
    "Die Kosten je Frame wachsen mit der Zahl der Objekte, deshalb verstecken sich Probleme im Kleinen und brechen im Großen los. In OnStart zu behalten und Physik in OnFixedUpdate zu machen sind die *richtigen* Angewohnheiten. Miss vor dem Herausbringen mit einem realistischen schlimmsten Fall — voller Server, volle Welle — und nicht mit der Testszene aus zwei Objekten, in der du entwickelt hast.",
  "Where to go next": "Wie es weitergeht",
  "Official docs": "Die offizielle Dokumentation",
  "sbox.game/dev/doc goes deeper on everything here and beyond — shaders, dedicated servers, custom assets, editor tooling. The API reference on sbox.game documents every class and method in the SDK.":
    "sbox.game/dev/doc geht bei allem hier und darüber hinaus in die Tiefe — Shader, eigene Server, eigene Assets, Werkzeuge für den Editor. Die API-Referenz auf sbox.game beschreibt jede Klasse und jede Methode des SDK.",
  "Read real code": "Lies echten Code",
  "Facepunch's GitHub is a goldmine: `sbox-hc1` is a complete multiplayer shooter, `sbox-scenestaging` demos engine features scene by scene, and `sbox-public` is the engine source itself — open under MIT.":
    "Das GitHub von Facepunch ist eine Fundgrube: `sbox-hc1` ist ein vollständiger Mehrspieler-Shooter, `sbox-scenestaging` führt Szene für Szene Funktionen der Engine vor, und `sbox-public` ist der Quelltext der Engine selbst — offen unter MIT.",
  "Community": "Die Gemeinschaft",
  "The s&box Discord and the forums on sbox.game are where developers share problems and prefabs. When something breaks after an update, the release notes on sbox.game usually explain the API change.":
    "Im Discord von s&box und in den Foren auf sbox.game teilen Entwickler ihre Probleme und ihre Prefabs. Wenn nach einer Aktualisierung etwas kaputtgeht, erklären die Versionshinweise auf sbox.game meist, was sich an der API geändert hat.",
  "Just build": "Bau einfach",
  "Pick something tiny — a one-room arena, a score-attack minigame — and publish it privately this week. One shipped small game teaches more than ten unfinished big ones.":
    "Nimm dir etwas ganz Kleines vor — eine Arena aus einem Raum, ein Minispiel um Punkte — und veröffentliche es diese Woche im privaten Kreis. Ein herausgebrachtes kleines Spiel lehrt dich mehr als zehn unfertige große.",
  "Course complete — you're a game developer now":
    "Kurs geschafft — du bist jetzt Spieleentwickler",
  "C# from the ground up, components, input, networking, and a publish button you know how to press. The next game on the sbox.game front page could be yours.":
    "C# von Grund auf, Komponenten, Eingaben, Vernetzung und ein Knopf zum Veröffentlichen, von dem du weißt, wie man ihn drückt. Das nächste Spiel auf der Startseite von sbox.game könnte deins sein.",

  // ── section headings ──────────────────────────────────────────────────────
  "C# basics": "C#-Grundlagen",
  "Collections": "Sammlungen",
  "OOP": "Objektorientierung",
  "s&box": "s&box",
  "s&box in practice": "s&box in der Praxis",
};
