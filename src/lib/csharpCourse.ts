import type { Course } from "@/lib/courses";

export const csharpCourse: Course = {
  id: "csharp",
  kind: "programming",
  name: "C# for s&box",
  tagline: "Learn C# from Python, then build games in s&box.",
  icon: "C#",
  available: true,
  lessons: [
    {
      id: "vars",
      title: "Variables & types",
      section: "C# basics",
      badge: "lesson 1",
      blocks: [
        { type: "p",
          text: "In Python you write `x = 42` and Python figures out the rest. C# requires you to declare what kind of thing a variable holds — and once declared, that type never changes.",
          textJs: "In JavaScript you write `let x = 42` and the variable can later hold anything. C# requires you to declare what kind of thing a variable holds — and once declared, that type never changes.",
          textNew: "A variable is a named box that stores a value. In C# you declare what kind of thing the box holds — a number, some text, a true/false — and once declared, that type never changes." },
        { type: "callout", variant: "python",
          text: "From Python: Python is dynamically typed — variables can hold anything. C# is statically typed — every variable has one fixed type decided at compile time. The upside: the compiler catches type errors before your game ever runs.",
          textJs: "From JavaScript: JS is dynamically typed — variables can hold anything (and TypeScript types are erased at runtime). C# is statically typed for real — every variable has one fixed type enforced at compile time. The upside: the compiler catches type errors before your game ever runs.",
          textNew: "Why types? Every value in C# has a fixed type the compiler knows about. That sounds strict, but it means a whole category of bugs gets caught before your game ever runs." },
        { type: "h3", text: "Declaring variables" },
        { type: "p", text: "The pattern is always: type name = value;" },
        { type: "code", code: `int age = 25;
string name = "Leon";
bool isLoggedIn = true;
double price = 9.99;` },
        { type: "p", text: "`int` — whole numbers. Use for counts, indexes, scores. `double` / `float` — decimals. Use `float` in s&box for positions and speeds (it's what the engine uses). `decimal` — very precise decimals. Use for money only. `string` — text in double quotes. Immutable. `bool` — `true` or `false` only." },
        { type: "h3", text: "var — let the compiler figure it out" },
        { type: "code", code: `var score = 100;      // int — compiler sees 100
var name = "Leon";   // string — compiler sees "..."
var speed = 5.0f;    // float — the f suffix makes it a float not double` },
        { type: "callout", variant: "why", text: "The f suffix: Writing `5.0` gives you a `double`. Writing `5.0f` gives you a `float`. S&box uses `float` everywhere for 3D maths, so you'll write `f` a lot." },
        { type: "quiz", q: "You write `var x = 3.14f;` — what type is x, and can you later assign `x = \"hello\"`?", options: [
          { text: "x is dynamic — you can assign anything to it", correct: false },
          { text: "x is a float — assigning a string would be a compiler error", correct: true },
          { text: "x has no type until you use it", correct: false },
          { text: "x is a double because of the decimal point", correct: false },
        ], explanation: "Static typing pays off in s&box: When you're working with positions (Vector3), rotations, speeds — all floats — the compiler will tell you immediately if you try to assign the wrong type. No runtime surprises mid-game." },
      ],
    },
    {
      id: "null",
      title: "Null & safety",
      section: "C# basics",
      badge: "lesson 2",
      blocks: [
        { type: "p", text: "`null` means \"no value\" — not zero, not empty string, but the complete absence of anything. It's one of the most important concepts to understand because null-related crashes are extremely common." },
        { type: "callout", variant: "analogy", text: "Think of a variable as an envelope. Null means the envelope exists but there's nothing inside. If you try to read what's inside an empty envelope, C# crashes — that's a NullReferenceException." },
        { type: "code", code: `string? username = null;  // ? means "this might be null"
int? score = null;          // nullable int

// ?? — use a fallback if null
string display = username ?? "Anonymous";

// ?. — only call the method if not null
int? len = username?.Length;  // null if username is null, otherwise the length

// Classic null check
if (username != null) {
    Console.WriteLine(username.Length);  // safe here
}` },
        { type: "callout", variant: "sbox", text: "S&box uses null constantly. When you reference other components or GameObjects on a class, they might not be set yet. You'll use `?.Length`, `?? defaultValue`, and null checks everywhere. S&box also has its own `.IsValid()` check for GameObjects (covered later) because a destroyed object isn't exactly null — it's invalid." },
        { type: "quiz", q: "What does `player?.Health` do if player is null?", options: [
          { text: "Crashes with a NullReferenceException", correct: false },
          { text: "Returns null safely — it only accesses Health if player isn't null", correct: true },
          { text: "Returns 0", correct: false },
          { text: "Won't compile", correct: false },
        ], explanation: "In a game, objects get destroyed constantly. A reference to an enemy might become null mid-frame if they die. The `?.` operator is your safety net for this." },
      ],
    },
    {
      id: "control",
      title: "Control flow",
      section: "C# basics",
      badge: "lesson 3",
      blocks: [
        { type: "p",
          text: "Same idea as Python — make decisions, repeat things. C# uses curly braces `{}` instead of indentation, and conditions need parentheses `()`.",
          textJs: "Almost identical to JavaScript — same curly braces `{}`, same parentheses `()` around conditions. Your muscle memory mostly transfers.",
          textNew: "Control flow is how a program makes decisions and repeats work. C# wraps each branch in curly braces `{}` and each condition in parentheses `()`." },
        { type: "twocol", left: { lang: "Python", code: `if score >= 90:
    print("A")
elif score >= 70:
    print("B")
else:
    print("C")` }, leftJs: { lang: "JavaScript", code: `if (score >= 90) {
    console.log("A");
} else if (score >= 70) {
    console.log("B");
} else {
    console.log("C");
}` }, right: { lang: "C#", code: `if (score >= 90) {
    Log.Info("A");
} else if (score >= 70) {
    Log.Info("B");
} else {
    Log.Info("C");
}` } },
        { type: "callout", variant: "sbox", text: "In s&box use `Log.Info()` instead of `Console.WriteLine()` — it prints to the s&box developer console (F1 key in game). `Console.WriteLine` still works but output goes somewhere less useful." },
        { type: "h3", text: "Switch expression" },
        { type: "code", code: `string grade = score switch {
    >= 90 => "A",
    >= 70 => "B",
    >= 50 => "C",
    _      => "Fail"  // _ = default case
};` },
        { type: "h3", text: "Loops" },
        { type: "twocol", left: { lang: "Python", code: `for name in names:
    print(name)` }, leftJs: { lang: "JavaScript", code: `for (const name of names) {
    console.log(name);
}` }, right: { lang: "C#", code: `foreach (var name in names) {
    Log.Info(name);
}` } },
        { type: "quiz", q: "In s&box, what should you use instead of `Console.WriteLine()` to print debug messages?", options: [
          { text: "print()", correct: false },
          { text: "Debug.Log()", correct: false },
          { text: "Log.Info()", correct: true },
          { text: "Console.Log()", correct: false },
        ], explanation: "S&box has its own logging system. `Log.Info()` writes to the in-game dev console. `Log.Warning()` and `Log.Error()` exist too and show up highlighted." },
      ],
    },
    {
      id: "methods",
      title: "Methods",
      section: "C# basics",
      badge: "lesson 4",
      blocks: [
        { type: "p", text: "Methods are reusable named blocks of code. In C# you declare what type goes in and what type comes out — the compiler enforces this." },
        { type: "twocol", left: { lang: "Python", code: `def add(a, b):
    return a + b` }, leftJs: { lang: "JavaScript", code: `function add(a, b) {
    return a + b;
}` }, right: { lang: "C#", code: `int Add(int a, int b) {
    return a + b;
}` } },
        { type: "h3", text: "Expression body shorthand" },
        { type: "code", code: `// Long form
float Speed(float distance, float time) {
    return distance / time;
}
// Shorthand — same result
float Speed(float distance, float time) => distance / time;` },
        { type: "h3", text: "void — nothing returned" },
        { type: "code", code: `// void = this does work but gives nothing back
void TakeDamage(float amount) {
    Health -= amount;
    if (Health <= 0) Die();
}` },
        { type: "callout", variant: "sbox", text: "In s&box, the engine calls methods for you — you never write `Main()` or call `OnUpdate()` yourself. You just define them and the engine runs them at the right time. This is the biggest mental shift from normal C#." },
        { type: "quiz", q: "What does a method signature of `float GetSpeed(float dist, float time)` tell you?", options: [
          { text: "Nothing — you need to read the body", correct: false },
          { text: "It takes two floats and returns a float — you know how to use it without reading the body", correct: true },
          { text: "It returns two values", correct: false },
          { text: "The method is optional", correct: false },
        ], explanation: "Explicit return types mean you can understand any method just from its signature. In a big s&box project with hundreds of methods, this is invaluable." },
      ],
    },
    {
      id: "lists",
      title: "Lists",
      section: "Collections",
      badge: "lesson 5",
      blocks: [
        { type: "p",
          text: "Like Python lists, but you declare what type the list holds using angle brackets.",
          textJs: "Like JavaScript arrays, but you declare what type the list holds using angle brackets.",
          textNew: "A List is an ordered collection that grows as you add items. You declare what type it holds using angle brackets." },
        { type: "twocol", left: { lang: "Python", code: `enemies = []
enemies.append(goblin)
count = len(enemies)` }, leftJs: { lang: "JavaScript", code: `const enemies = [];
enemies.push(goblin);
const count = enemies.length;` }, right: { lang: "C#", code: `var enemies = new List<Enemy>();
enemies.Add(goblin);
int count = enemies.Count;` } },
        { type: "code", code: `var scores = new List<int> { 90, 85, 72 };
scores.Add(95);
scores.Remove(85);
bool has = scores.Contains(72);
int first = scores[0];
int last  = scores[^1];   // ^ = from the end` },
        { type: "callout", variant: "sbox", text: "S&box usage: You'll use lists constantly — lists of players, of spawned enemies, of picked-up items. You can also do `Scene.GetAllComponents<Enemy>()` which returns all Enemy components in the scene as an enumerable you can iterate or LINQ query." },
        { type: "quiz", q: "What does `List<string>` do that a plain `List` wouldn't?", options: [
          { text: "Makes the list alphabetically sorted", correct: false },
          { text: "Tells the compiler only strings are allowed — type mismatches get caught at compile time", correct: true },
          { text: "Makes the list fixed size", correct: false },
          { text: "There is no plain List in C#", correct: false },
        ], explanation: "In game dev this is huge — a `List<Player>` can only hold Player objects. The compiler stops you from accidentally adding an Enemy to your player list." },
      ],
    },
    {
      id: "dicts",
      title: "Dictionaries",
      section: "Collections",
      badge: "lesson 6",
      blocks: [
        { type: "p",
          text: "Key-value lookup — identical concept to Python dicts, just with explicit types for both key and value.",
          textJs: "Key-value lookup — like a JS object or `Map`, just with explicit types for both key and value.",
          textNew: "A Dictionary stores key → value pairs, so you can look up a value instantly by its key — like finding a player's score by their name." },
        { type: "twocol", left: { lang: "Python", code: `scores = {"Alice": 100}
scores["Bob"] = 85
val = scores.get("Carol", 0)` }, leftJs: { lang: "JavaScript", code: `const scores = { Alice: 100 };
scores["Bob"] = 85;
const val = scores["Carol"] ?? 0;` }, right: { lang: "C#", code: `var scores = new Dictionary<string, int>();
scores["Alice"] = 100;
scores["Bob"] = 85;
scores.TryGetValue("Carol", out int v);` } },
        { type: "code", code: `// Never do this if key might not exist — throws an exception
int s = scores["Carol"];  // 💥 KeyNotFoundException

// Safe way
if (scores.TryGetValue("Carol", out int carolScore)) {
    Log.Info($"Carol has {carolScore} points");
}` },
        { type: "callout", variant: "sbox", text: "S&box usage: Dictionaries are great for mapping player connections to player data — e.g. `Dictionary<Connection, PlayerData>` where you look up a player's stats by their network connection." },
        { type: "quiz", q: "Why use `TryGetValue` instead of `dict[key]`?", options: [
          { text: "TryGetValue is faster", correct: false },
          { text: "dict[key] throws an exception if the key doesn't exist — TryGetValue returns false safely", correct: true },
          { text: "dict[key] only works with int keys", correct: false },
          { text: "No difference", correct: false },
        ], explanation: "In a game, a player might disconnect mid-match. If you try to access their data with `dict[connection]` after they've been removed, it crashes the entire game server." },
      ],
    },
    {
      id: "linq",
      title: "LINQ",
      section: "Collections",
      badge: "lesson 7",
      blocks: [
        { type: "p",
          text: "LINQ lets you filter, transform and query collections in readable chained code. Python equivalent: list comprehensions and `filter()`/`map()`.",
          textJs: "LINQ lets you filter, transform and query collections in readable chained code. JavaScript equivalent: `filter()`, `map()` and `reduce()` on arrays — LINQ will feel very familiar.",
          textNew: "LINQ lets you filter, transform and query collections in readable chained code — one of C#'s best features. Read each step like a sentence: \"keep the ones where…\", \"take the name of each…\"." },
        { type: "twocol", left: { lang: "Python", code: `alive = [e for e in enemies
         if e.health > 0]
names = [e.name for e in alive]
total = sum(e.health for e in alive)` }, leftJs: { lang: "JavaScript", code: `const alive = enemies
  .filter(e => e.health > 0);
const names = alive
  .map(e => e.name);
const total = alive.reduce(
  (sum, e) => sum + e.health, 0);` }, right: { lang: "C#", code: `var alive = enemies
  .Where(e => e.Health > 0);
var names = alive
  .Select(e => e.Name);
float total = alive.Sum(e => e.Health);` } },
        { type: "code", code: `// The n => expression is a lambda — "given n, do this"
// Read Where(e => e.Health > 0) as: "keep enemies where health > 0"

// Chaining — top 3 closest enemies to player
var targets = enemies
    .Where(e => e.IsAlive)
    .OrderBy(e => Vector3.DistanceBetween(e.WorldPosition, player.WorldPosition))
    .Take(3)
    .ToList();` },
        { type: "callout", variant: "sbox", text: "S&box LINQ example: `Scene.GetAllComponents<Enemy>().Where(e => e.IsAlive).OrderBy(e => e.WorldPosition.Distance(WorldPosition)).FirstOrDefault()` — find the nearest living enemy in one line. This is real code you'll write." },
        { type: "quiz", q: "What does the lambda `e => e.Health > 0` mean inside `.Where()`?", options: [
          { text: "Set e's health to 0", correct: false },
          { text: "For each item e in the collection, keep it only if its Health is greater than 0", correct: true },
          { text: "Find the first item with health above 0", correct: false },
          { text: "Count all items with health above 0", correct: false },
        ], explanation: "Lambdas are mini functions written inline. `e =>` means \"given e\" and the right side is what you do with it. LINQ + lambdas together are one of C#'s most powerful features." },
      ],
    },
    {
      id: "classes",
      title: "Classes",
      section: "OOP",
      badge: "lesson 8",
      blocks: [
        { type: "p", text: "A class is a blueprint — it defines what data (properties) and behaviour (methods) something has. Objects are instances created from that blueprint." },
        { type: "callout", variant: "analogy", text: "A class is like a cookie cutter. The cutter (class) defines the shape. Each cookie you make (object) is a separate instance — same shape, its own data." },
        { type: "code", code: `public class Player
{
    // Properties — the data this object holds
    public string Name { get; set; }
    public float Health { get; private set; } = 100f;

    // Constructor — runs when you write new Player(...)
    public Player(string name) {
        Name = name;
    }

    // Methods — behaviour
    public void TakeDamage(float amount) {
        Health = Math.Max(0, Health - amount);
    }

    public bool IsAlive => Health > 0;
}

// Using it
var p = new Player("Leon");
p.TakeDamage(30f);
Log.Info($"{p.Name} alive: {p.IsAlive}");` },
        { type: "callout", variant: "sbox", text: "In s&box, your game logic classes inherit from `Component` — not standalone classes. But you'll still write plain classes like the one above for data structures (player stats, item definitions, game config). The OOP you learn here is directly applied in your components." },
        { type: "quiz", q: "Why is Health marked `private set` instead of fully public?", options: [
          { text: "It makes Health faster to access", correct: false },
          { text: "Outside code can read Health but only this class can change it — all damage must go through TakeDamage, which enforces rules like not going below 0", correct: true },
          { text: "private set makes the property read-only forever", correct: false },
          { text: "The compiler requires it for float properties", correct: false },
        ], explanation: "Encapsulation in games: if Health were fully public, any code could write `player.Health = -9999`. By controlling access through methods, you guarantee the game state stays valid — health never goes below 0, death logic always fires correctly." },
      ],
    },
    {
      id: "inherit",
      title: "Inheritance",
      section: "OOP",
      badge: "lesson 9",
      blocks: [
        { type: "p", text: "Inheritance lets one class build on another — getting all its existing stuff for free, then changing or adding what it needs." },
        { type: "code", code: `public class Enemy
{
    public float Health { get; protected set; } = 100f;
    public virtual void Attack() => Log.Info("Generic attack");
}

public class Zombie : Enemy       // Zombie inherits from Enemy
{
    public override void Attack() => Log.Info("Zombie bites!");
}

public class Sniper : Enemy
{
    public float Range { get; set; } = 500f;  // extra property
    public override void Attack() => Log.Info($"Sniper shoots at {Range}m");
}

// Polymorphism — loop over all enemies without caring about exact type
List<Enemy> enemies = [ new Zombie(), new Sniper() ];
foreach (var e in enemies) e.Attack(); // calls the right version for each` },
        { type: "callout", variant: "sbox", text: "In s&box, you already use inheritance constantly — your components inherit from `Component`, which is why they get `OnUpdate()`, `GameObject`, `Transform` etc. for free. Understanding inheritance makes the whole engine model click." },
        { type: "quiz", q: "If `Zombie` inherits from `Enemy`, and Enemy has a `Health` property — does Zombie have Health?", options: [
          { text: "No — Zombie needs to define its own Health", correct: false },
          { text: "Yes — Zombie inherits everything from Enemy automatically", correct: true },
          { text: "Only if Health is marked public", correct: false },
          { text: "Only if you use the base keyword", correct: false },
        ], explanation: "This is the core benefit of inheritance — shared behaviour is written once in the parent. Adding a new enemy type means you only write what's different, not all the shared code again." },
      ],
    },
    {
      id: "interfaces",
      title: "Interfaces",
      section: "OOP",
      badge: "lesson 10",
      blocks: [
        { type: "p", text: "An interface is a contract — \"any class that implements me must have these methods.\" No code inside, just the guarantee." },
        { type: "code", code: `public interface IDamageable
{
    float Health { get; }
    void TakeDamage(float amount);
}

public class Player : IDamageable  { /* must implement Health + TakeDamage */ }
public class Barrel : IDamageable  { /* barrels can be damaged too */ }
public class Vehicle : IDamageable { /* vehicles too */ }

// One method handles any damageable thing
void ApplyExplosion(IDamageable target, float damage) {
    target.TakeDamage(damage);
}` },
        { type: "callout", variant: "sbox", text: "S&box uses interfaces throughout its API. For example `IScenePhysicsEvents` lets components respond to physics collisions, and `IGameObjectNetworkEvents` for network events. You'll implement interfaces to hook into engine systems without needing to know how they work internally." },
        { type: "quiz", q: "What's the advantage of coding `ApplyExplosion(IDamageable target)` instead of `ApplyExplosion(Player target)`?", options: [
          { text: "IDamageable is faster", correct: false },
          { text: "The method works on any damageable thing — players, barrels, vehicles — without needing separate versions for each", correct: true },
          { text: "It avoids needing to write TakeDamage on each class", correct: false },
          { text: "Interfaces are required for multiplayer", correct: false },
        ], explanation: "This is the real power of interfaces in games — write explosion, fire, or fall damage logic once, and it works on everything damageable. Add a new destructible object and it automatically works with all existing damage systems." },
      ],
    },
    {
      id: "sbox-intro",
      title: "How s&box works",
      section: "s&box",
      badge: "s&box",
      blocks: [
        { type: "p", text: "Now that you know C#, here's how s&box uses it. The whole engine is built around three concepts:" },
        { type: "cards", items: [
          { h4: "Scene", p: "The entire playable world — all objects, lights, and gameplay elements. Saved as a `.scene` file." },
          { h4: "GameObject", p: "An object in the world. Has a position, rotation, scale. On its own it does nothing — it needs components." },
          { h4: "Component", p: "A C# class attached to a GameObject. This is where all your game logic lives." },
        ] },
        { type: "callout", variant: "analogy", text: "Think of it like this: a GameObject is an actor on stage (just a position and a name). Components are the costume, the script, and the movement instructions you give them. One actor can wear many costumes at once." },
        { type: "p", text: "This is the same model used by Unity and Godot — if you've heard of those, it's identical in concept." },
        { type: "h3", text: "Project structure" },
        { type: "code", code: `code/        → your C# scripts and components
content/     → scenes, prefabs, maps
materials/   → shaders and materials
models/      → 3D assets
sounds/      → audio files` },
        { type: "p", text: "Everything in these folders is automatically tracked. When you save a C# file, s&box hot reloads it in milliseconds — you don't need to restart the game to see changes. This is one of the best things about s&box." },
        { type: "callout", variant: "sbox", text: "Hot reload is your superpower. Change a movement speed value in code, save the file, and the game updates live. This loop — change → save → see — is how you'll spend most of your time in s&box." },
      ],
    },
    {
      id: "sbox-component",
      title: "Your first component",
      section: "s&box",
      badge: "s&box",
      blocks: [
        { type: "p", text: "A component is a C# class that inherits from `Component`. That's all it takes. Here's the simplest possible one:" },
        { type: "code", code: `using Sandbox;

public sealed class Rotator : Component
{
    protected override void OnUpdate()
    {
        // Rotate around the up axis every frame
        Transform.Rotation *= Rotation.FromYaw( 90f * Time.Delta );
    }
}` },
        { type: "p", text: "Break this down line by line:" },
        { type: "p", text: "`using Sandbox;` — imports the s&box namespace so you can use engine types like `Component`, `Vector3`, `Rotation`." },
        { type: "p", text: "`public sealed class Rotator : Component` — defines a class called Rotator that inherits from Component. `sealed` means nothing can inherit from Rotator (s&box recommends this for components)." },
        { type: "p", text: "`protected override void OnUpdate()` — overrides the engine's OnUpdate method. The engine calls this every single frame automatically. You don't call it yourself." },
        { type: "p", text: "`Transform.Rotation` — the rotation of this component's GameObject in the world." },
        { type: "p", text: "`Time.Delta` — how many seconds passed since the last frame (usually something like 0.016). Multiplying by this makes movement frame-rate independent — fast computers and slow computers rotate at the same speed." },
        { type: "callout", variant: "sbox", text: "To use this: right-click in the asset browser → Create → C# Script → name it `Rotator.cs`. Then in the scene, select a GameObject, click Add Component in the inspector, and find Rotator. Press Play — it rotates." },
        { type: "quiz", q: "Why do we multiply movement by `Time.Delta`?", options: [
          { text: "To make movement faster", correct: false },
          { text: "It's required by the compiler", correct: false },
          { text: "So movement speed is consistent regardless of frame rate — 60fps and 30fps players move at the same speed", correct: true },
          { text: "Time.Delta pauses the game between frames", correct: false },
        ], explanation: "Without Time.Delta, a player on a 120fps machine moves twice as fast as one on 60fps. Multiplying by Time.Delta converts \"per frame\" into \"per second\" — predictable and fair." },
      ],
    },
    {
      id: "sbox-lifecycle",
      title: "Lifecycle methods",
      section: "s&box",
      badge: "s&box",
      blocks: [
        { type: "p", text: "S&box calls certain methods on your component at specific moments. You override the ones you need — ignore the rest." },
        { type: "cards", items: [
          { h4: "OnAwake()", p: "Called once when the component is first created. Before the scene is fully running. Use for very early setup." },
          { h4: "OnStart()", p: "Called once just before the first Update. Scene is ready. Use this for most initialisation — finding other components, setting starting values." },
          { h4: "OnUpdate()", p: "Called every frame. Main game logic — input, animations, checks. Keep this fast." },
          { h4: "OnFixedUpdate()", p: "Called at a fixed physics rate (not every frame). Use for movement and physics — more stable than OnUpdate for rigidbodies." },
          { h4: "OnDestroy()", p: "Called when the component or its GameObject is destroyed. Clean up references, stop sounds, unsubscribe events." },
          { h4: "OnEnabled / OnDisabled", p: "Called when the component is toggled on or off. Good for pausing logic without destroying the object." },
        ] },
        { type: "code", code: `public sealed class EnemyAI : Component
{
    private Player _target;

    protected override void OnStart()
    {
        // Find the player once at startup
        _target = Scene.GetAllComponents<Player>().FirstOrDefault();
        Log.Info($"Enemy targeting: {_target?.Name}");
    }

    protected override void OnUpdate()
    {
        // Every frame — move toward target if they exist
        if (_target == null) return;
        var dir = (_target.WorldPosition - WorldPosition).Normal;
        WorldPosition += dir * 50f * Time.Delta;
    }

    protected override void OnDestroy()
    {
        Log.Info("Enemy destroyed");
    }
}` },
        { type: "callout", variant: "why", text: "Rule of thumb: find other components in `OnStart()` not `OnAwake()` — other objects may not exist yet during Awake. Do per-frame logic in `OnUpdate()`. Do physics in `OnFixedUpdate()`." },
        { type: "quiz", q: "You want to find all enemies in the scene when your game manager starts up. Which lifecycle method should you do this in?", options: [
          { text: "OnAwake — it runs first", correct: false },
          { text: "OnStart — the scene is fully loaded and all objects exist", correct: true },
          { text: "OnUpdate — run it every frame to keep the list fresh", correct: false },
          { text: "OnFixedUpdate — for reliability", correct: false },
        ], explanation: "OnAwake fires before everything is ready — other objects may not have their own Awake done yet. OnStart fires after the scene is fully set up, so you can safely look up other objects." },
      ],
    },
    {
      id: "sbox-props",
      title: "Properties & the editor",
      section: "s&box",
      badge: "s&box",
      blocks: [
        { type: "p", text: "One of s&box's best features: put `[Property]` above any field on your component and it appears as a slider/field in the inspector. You can tweak values live without touching code." },
        { type: "code", code: `public sealed class PatrolEnemy : Component
{
    [Property] public float MoveSpeed { get; set; } = 100f;
    [Property] public float DetectRange { get; set; } = 300f;
    [Property] public Color GizmoColor { get; set; } = Color.Red;

    // You can also reference other components or GameObjects
    [Property] public GameObject PatrolTarget { get; set; }

    // [RequireComponent] — automatically grabs a sibling component
    [RequireComponent] ModelRenderer _renderer;

    protected override void OnUpdate()
    {
        if (PatrolTarget == null) return;
        var dir = (PatrolTarget.WorldPosition - WorldPosition).Normal;
        WorldPosition += dir * MoveSpeed * Time.Delta;
    }
}` },
        { type: "p", text: "`[Property]` — shows the field in the inspector. You can drag sliders, type values, or drag-drop GameObjects/Components from the scene." },
        { type: "p", text: "`[RequireComponent]` — automatically finds or creates the named component on the same GameObject. No manual `GetComponent` needed." },
        { type: "h3", text: "Other useful attributes" },
        { type: "code", code: `[Property, Range(0f, 100f)]  // shows as a slider with min/max
public float Volume { get; set; } = 50f;

[Property, Title("Enemy Health")]  // custom label in inspector
public float MaxHealth { get; set; } = 100f;

[Hide]  // public but hidden from inspector
public float InternalTimer { get; set; }` },
        { type: "callout", variant: "sbox", text: "Workflow tip: expose all your tunable values as `[Property]`. Speed, health, range, damage — everything. Then in the editor you tweak and test live without recompiling. This is how game designers iterate quickly." },
        { type: "quiz", q: "What does putting `[Property]` above a field on your component do?", options: [
          { text: "Makes the field public", correct: false },
          { text: "Syncs the field over the network", correct: false },
          { text: "Makes it appear in the s&box inspector so you can edit it live in the editor", correct: true },
          { text: "Prevents the field from being changed at runtime", correct: false },
        ], explanation: "This is one of the most-used features in s&box. Keep hardcoded values out of your code — expose everything tunable as a Property and adjust in the editor. Your code stays clean, your iteration stays fast." },
      ],
    },
    {
      id: "sbox-input",
      title: "Input & movement",
      section: "s&box",
      badge: "s&box",
      blocks: [
        { type: "p", text: "S&box has a clean input system using named actions (like \"Attack1\", \"Jump\", \"Forward\") rather than raw key codes. This means your code isn't tied to specific keys — players can rebind them." },
        { type: "code", code: `protected override void OnUpdate()
{
    // Pressed — true only on the frame the key is pressed (use for fire, jump)
    if (Input.Pressed("Attack1"))
        Fire();

    // Down — true every frame while held (use for movement, aim)
    if (Input.Down("Forward"))
        WorldPosition += WorldRotation.Forward * Speed * Time.Delta;

    // Released — true only on the frame the key is released
    if (Input.Released("Attack1"))
        StopFiring();

    // Mouse look — how much mouse moved this frame
    var mouseDelta = Input.MouseDelta;
    // x = horizontal (yaw), y = vertical (pitch)
}` },
        { type: "h3", text: "Basic movement component" },
        { type: "code", code: `public sealed class SimpleMove : Component
{
    [Property] public float Speed { get; set; } = 200f;

    protected override void OnUpdate()
    {
        var wish = Vector3.Zero;

        if (Input.Down("Forward"))  wish += Vector3.Forward;
        if (Input.Down("Backward")) wish += Vector3.Backward;
        if (Input.Down("Left"))     wish += Vector3.Left;
        if (Input.Down("Right"))    wish += Vector3.Right;

        // Normalize so diagonal isn't faster than straight
        if (wish.Length > 0)
            wish = wish.Normal;

        WorldPosition += wish * Speed * Time.Delta;
    }
}` },
        { type: "callout", variant: "why", text: "Vector3 is a struct holding x, y, z coordinates. `Vector3.Forward` is (0, 1, 0) in s&box's coordinate space. `.Normal` makes the vector length exactly 1 so speed is consistent in all directions." },
        { type: "quiz", q: "What's the difference between `Input.Pressed(\"Jump\")` and `Input.Down(\"Jump\")`?", options: [
          { text: "They're identical", correct: false },
          { text: "Pressed is true only on the single frame the key is pressed. Down is true every frame while held.", correct: true },
          { text: "Pressed works for keyboard, Down works for mouse", correct: false },
          { text: "Down only works in OnFixedUpdate", correct: false },
        ], explanation: "Jump uses Pressed — you want one jump per keypress, not jumping 60 times per second while held. Movement uses Down — you want to keep moving while the key is held." },
      ],
    },
    {
      id: "sbox-objects",
      title: "GameObjects & the scene",
      section: "s&box",
      badge: "s&box",
      blocks: [
        { type: "p", text: "From inside a component you have direct access to your GameObject and the whole scene." },
        { type: "code", code: `// From inside any component:
GameObject          // the object this component is attached to
Transform           // position/rotation/scale (relative to parent)
WorldPosition       // position in world space
WorldRotation       // rotation in world space
Scene               // the current scene

// Get another component on the same GameObject
var rb = GetComponent<Rigidbody>();

// Get a component from a child object
var gun = GetComponentInChildren<GunComponent>();

// Find all components of a type in the whole scene
var allEnemies = Scene.GetAllComponents<Enemy>();

// Destroy this object
GameObject.Destroy();

// Spawn a prefab at a position
var bullet = BulletPrefab.Clone(WorldPosition);` },
        { type: "h3", text: "IsValid() — the s&box null check" },
        { type: "code", code: `// In s&box, destroyed objects aren't null — they're "invalid"
// Always use .IsValid() instead of != null for GameObjects/Components
if (enemy.IsValid()) {
    enemy.TakeDamage(10f);
}

// Or the extension shorthand
enemy?.TakeDamage(10f);  // still useful but IsValid() is more reliable` },
        { type: "callout", variant: "warn", text: "Don't just use `!= null` for GameObjects in s&box. A destroyed GameObject is not null — it's an invalid object. Calling methods on it throws errors. Use `obj.IsValid()` to be safe." },
        { type: "quiz", q: "Inside a component, how do you get access to the Rigidbody component on the same GameObject?", options: [
          { text: "new Rigidbody()", correct: false },
          { text: "Scene.GetAllComponents<Rigidbody>()", correct: false },
          { text: "GetComponent<Rigidbody>()", correct: true },
          { text: "Rigidbody.Find()", correct: false },
        ], explanation: "`GetComponent<T>()` looks at the same GameObject this component is on. It's the standard way to access sibling components. Use `[RequireComponent]` as a property attribute if you always need it — that's even cleaner." },
      ],
    },
    {
      id: "sbox-network",
      title: "Networking basics",
      section: "s&box",
      badge: "s&box",
      blocks: [
        { type: "p", text: "S&box is built multiplayer-first. The key rule: the server is the authority. Never trust clients with important gameplay decisions." },
        { type: "h3", text: "[Sync] — automatic property sync" },
        { type: "code", code: `public sealed class HealthComponent : Component
{
    // [Sync] — this value is automatically sent to all clients
    [Sync] public float Health { get; set; } = 100f;

    // Detect when it changes
    [Sync, Change(nameof(OnHealthChanged))]
    public float Shield { get; set; } = 50f;

    void OnHealthChanged(float oldVal, float newVal) {
        Log.Info($"Health changed {oldVal} → {newVal}");
        // Update UI, play sound, etc.
    }
}` },
        { type: "h3", text: "NetworkSpawn & RPCs" },
        { type: "code", code: `// Spawn an object so all clients see it
GameObject.NetworkSpawn();

// RPC — run a method on all clients from the server
[Rpc.Broadcast]
public void PlayExplosionEffect(Vector3 position)
{
    // This runs on every client
    Sound.Play("explosion", position);
}

// Run on the host only
[Rpc.Host]
public void DealDamage(float amount)
{
    Health -= amount;  // the host decides — clients can't cheat this
}` },
        { type: "callout", variant: "why", text: "The golden rule: game state changes (health, position, score) happen on the server. Visual effects (explosions, sounds) can happen on clients. `[Sync]` keeps data in sync. RPCs trigger events across the network." },
        { type: "quiz", q: "A player takes damage. Where should the health reduction actually happen?", options: [
          { text: "On the client whose player was hit — for responsiveness", correct: false },
          { text: "On the server — clients can't be trusted to report their own damage honestly", correct: true },
          { text: "On all clients simultaneously with [Sync]", correct: false },
          { text: "It doesn't matter in s&box", correct: false },
        ], explanation: "If clients control their own health, a cheater can just never reduce it. Server authority means the server decides what happens — clients only see the result. This is fundamental to any multiplayer game." },
      ],
    },
    {
      id: "sbox-limits",
      title: "API limits & gotchas",
      section: "s&box",
      badge: "s&box",
      blocks: [
        { type: "p", text: "S&box runs user code in a sandboxed environment for security. This means certain normal C# things are blocked or work differently." },
        { type: "h3", text: "Blocked .NET APIs" },
        { type: "callout", variant: "warn", text: "You cannot use these in s&box: `System.IO.File` — no direct file access. Use s&box's own `FileSystem` API instead. `System.IO.Directory` — same reason. `System.Diagnostics.Process` — can't launch external processes. `System.Net.Http.HttpClient` directly — use s&box's `Http` class instead. `System.Threading.Thread` — use `async/await` or s&box's task system. `System.Reflection` — limited access only." },
        { type: "h3", text: "The s&box alternatives" },
        { type: "code", code: `// Instead of System.IO.File — use FileSystem
string text = await FileSystem.Data.ReadAllTextAsync("save.json");
await FileSystem.Data.WriteAllTextAsync("save.json", saveData);

// Instead of HttpClient directly — use Http
var response = await Http.RequestAsync("https://api.example.com/scores");
string json = await response.Content.ReadAsStringAsync();

// Instead of Console.WriteLine — use Log
Log.Info("message");
Log.Warning("something might be wrong");
Log.Error("something broke");` },
        { type: "h3", text: "Other things to watch out for" },
        { type: "code", code: `// Don't use != null for GameObjects — use IsValid()
if (enemy.IsValid()) { ... }       // ✓ correct
if (enemy != null) { ... }         // ✗ might still crash

// Don't cache GetComponent results in OnAwake — other components may not exist
// Do it in OnStart instead

// float not double for 3D math
float speed = 100f;   // ✓ s&box uses float throughout
double speed = 100;   // ✗ will cause type mismatch errors

// Time.Delta not Time.deltaTime (that's Unity)
WorldPosition += dir * Speed * Time.Delta;   // ✓ s&box
transform.position += dir * Speed * Time.deltaTime; // ✗ Unity syntax` },
        { type: "callout", variant: "sbox", text: "If you Google C# game dev and find Unity tutorials — most of the C# logic is identical, but watch out for Unity-specific things: `transform` (lowercase) vs `Transform`, `Time.deltaTime` vs `Time.Delta`, `Debug.Log` vs `Log.Info`, and `GetComponent` syntax is slightly different. The concepts are the same, the API names differ." },
        { type: "quiz", q: "You want to save a player's score to a file in s&box. Which API do you use?", options: [
          { text: "System.IO.File.WriteAllText()", correct: false },
          { text: "FileSystem.Data.WriteAllTextAsync()", correct: true },
          { text: "File.Save()", correct: false },
          { text: "You can't save files in s&box at all", correct: false },
        ], explanation: "S&box provides its own file system API that works within the sandbox security model. It gives you safe file access to designated folders without allowing code to access arbitrary locations on the player's machine." },
      ],
    },
    {
      id: "sbox-physics",
      title: "Physics & traces",
      section: "s&box in practice",
      badge: "practice 1",
      blocks: [
        { type: "p", text: "Until now you've moved objects by writing to `WorldPosition` every frame. Physics flips that: add a `Rigidbody` component and the engine owns the motion — gravity, bounces, stacking, knockback all come free. The other half of this lesson is traces: firing an invisible ray through the world and asking \"what's over there?\" Between the two you can build shooting, jumping, pickups, lasers, and pressure plates." },
        { type: "h3", text: "Rigidbody: push, don't teleport" },
        { type: "code", code: `public sealed class PhysicsCrate : Component
{
    [RequireComponent] public Rigidbody Body { get; set; }
    [Property] public float Thrust { get; set; } = 3000f;

    protected override void OnFixedUpdate()
    {
        if (Input.Down("Forward"))
            Body.ApplyForce(WorldRotation.Forward * Thrust);   // continuous push
        if (Input.Pressed("Jump"))
            Body.ApplyImpulse(Vector3.Up * 40000f);            // instant kick
        if (Body.Velocity.Length > 1500f)
            Body.Velocity = Body.Velocity.Normal * 1500f;      // hard speed cap
    }
}` },
        { type: "callout", variant: "why", text: "Three ways to move a rigidbody, three use cases. `ApplyForce` accelerates gradually over time — thrusters, wind, conveyor belts. `ApplyImpulse` changes velocity instantly — jumps, explosions, bullet knockback. Setting `Velocity` directly gives total control but stomps whatever physics was doing — good for speed caps and dashes. Forces belong in `OnFixedUpdate` because physics steps at a fixed rate; apply them in `OnUpdate` and their strength varies with frame rate." },
        { type: "callout", variant: "warn", text: "Coming from Unity tutorials: there's no `AddForce(dir, ForceMode.Impulse)` here — s&box splits it into separate `ApplyForce` and `ApplyImpulse` methods. And don't write to `WorldPosition` every frame on an object with a Rigidbody — you're fighting the physics solver and it will jitter or tunnel through walls. Teleporting once (a respawn) is fine; steering by position is not." },
        { type: "h3", text: "Traces: asking the world questions" },
        { type: "code", code: `// Build the trace with chained modifiers, then fire it with Run()
var start = WorldPosition;
var end   = start + WorldRotation.Forward * 1000f;

var tr = Scene.Trace
    .Ray(start, end)                        // straight line (FromTo works too)
    .WithoutTags("debris")                  // skip anything tagged debris
    .IgnoreGameObjectHierarchy(GameObject)  // never hit yourself or your children
    .Run();                                 // returns a SceneTraceResult

if (tr.Hit)
    Log.Info($"Hit {tr.GameObject.Name}, {tr.Distance:F0} units away");` },
        { type: "cards", items: [
          { h4: "Hit", p: "True if the trace struck something before reaching its end point. Check this first, always." },
          { h4: "EndPosition", p: "Where the trace stopped — the impact point, or the full ray length if nothing was hit. Spawn impact effects here." },
          { h4: "Normal", p: "The direction the hit surface faces. Use it to orient bullet decals, bounce projectiles, or push away from walls." },
          { h4: "GameObject / Collider", p: "What you hit. `tr.GameObject.GetComponent<T>()` is how a ray becomes gameplay — damage, interaction, highlighting." },
          { h4: "Distance / Fraction", p: "How far the trace travelled, absolute or as 0–1 of its full length. Great for damage falloff." },
          { h4: "Surface", p: "The physical material that was hit — pick footstep sounds and impact particles per surface (metal ping vs dirt thud)." },
        ] },
        { type: "code", code: `public sealed class HitscanGun : Component
{
    [Property] public float Damage { get; set; } = 25f;

    protected override void OnUpdate()
    {
        if (!Input.Pressed("Attack1")) return;

        var cam = Scene.Camera;   // the scene's active camera
        var tr = Scene.Trace
            .Ray(cam.WorldPosition, cam.WorldPosition + cam.WorldRotation.Forward * 5000f)
            .UseHitboxes()                          // hit character hitboxes, not just colliders
            .IgnoreGameObjectHierarchy(GameObject)
            .Run();

        if (!tr.Hit) return;
        tr.GameObject.GetComponent<HealthComponent>()?.TakeDamage(Damage);
        tr.Body?.ApplyImpulseAt(tr.EndPosition, cam.WorldRotation.Forward * 20000f);  // kick props around
    }
}` },
        { type: "code", code: `// Ground check — a short, fat ray straight down from the feet
var tr = Scene.Trace
    .Ray(WorldPosition, WorldPosition + Vector3.Down * 8f)
    .Radius(6f)                             // thick ray won't slip through gaps
    .IgnoreGameObjectHierarchy(GameObject)
    .Run();

bool grounded = tr.Hit;
if (grounded && Input.Pressed("Jump"))
    Body.ApplyImpulse(Vector3.Up * 30000f); // no double-jumping off thin air` },
        { type: "callout", variant: "sbox", text: "When a trace \"isn't hitting\", draw it. Every component has `DebugOverlay` — call `DebugOverlay.Trace(tr, 5f)` and s&box draws the ray in-world for 5 seconds, with the hit point and surface normal in red. Nine times out of ten you'll see the trace starting inside your own collider or pointing somewhere you didn't expect." },
        { type: "quiz", q: "Your gun's trace keeps hitting the player who fired it. What's the cleanest fix?", options: [
          { text: "Start the trace 100 units in front of the player", correct: false },
          { text: "Add `.IgnoreGameObjectHierarchy(GameObject)` to the trace — it skips the shooter and all its children", correct: true },
          { text: "Put the player on an Ignore Raycast layer", correct: false },
          { text: "Call `.Run(ignoreSelf: true)`", correct: false },
        ], explanation: "Starting the trace further forward is a classic hack that breaks point-blank shots. Layers are a Unity concept — s&box filters traces with tags and ignore methods. `IgnoreGameObjectHierarchy` covers the whole shooter, including child objects like the weapon model — exactly what you want for first-person guns." },
        { type: "h3", text: "Collisions & triggers" },
        { type: "p", text: "Colliders tell you about contact in two ways. Solid colliders report hits through `Component.ICollisionListener` — implement it and you get `OnCollisionStart(Collision collision)` (plus `OnCollisionUpdate` and `OnCollisionStop`), with `collision.Other.GameObject` telling you what you touched. Tick `IsTrigger` on a collider instead and it stops being solid: objects pass through, and it reports enter/exit events — perfect for pickups, damage zones, and checkpoints. One gotcha: traces ignore trigger colliders unless you add `.HitTriggers()` to the trace." },
        { type: "code", code: `// Needs a Collider on the same GameObject with IsTrigger ticked in the inspector
public sealed class LavaPit : Component, Component.ITriggerListener
{
    public void OnTriggerEnter(GameObject other)
    {
        other.GetComponent<HealthComponent>()?.TakeDamage(50f);
        Log.Info($"{other.Name} fell in the lava");
    }

    public void OnTriggerExit(GameObject other)
    {
        Log.Info($"{other.Name} climbed out");
    }
}` },
        { type: "quiz", q: "You built a health pickup: BoxCollider with IsTrigger ticked, and your component has a method `void OnTriggerEnter(GameObject other)`. The player walks through and nothing happens. Most likely cause?", options: [
          { text: "The trigger object also needs a Rigidbody", correct: false },
          { text: "The component must declare `: Component, Component.ITriggerListener` — s&box calls interface methods, not methods it finds by name", correct: true },
          { text: "OnTriggerEnter only works inside OnFixedUpdate", correct: false },
          { text: "You need to call base.OnTriggerEnter() first", correct: false },
        ], explanation: "Unlike engines that discover magic method names at runtime, s&box only delivers trigger events to components that implement `Component.ITriggerListener`. Your method compiled fine — it just was never wired up. Same pattern for solid contacts: implement `Component.ICollisionListener` to receive `OnCollisionStart`. Interfaces make the contract explicit, which is exactly what lesson 10 promised." },
      ],
    },
    {
      id: "sbox-spawn",
      title: "Spawning & prefabs",
      section: "s&box in practice",
      badge: "practice 2",
      blocks: [
        { type: "p", text: "A prefab is a GameObject saved to a file — the object, its components, its children, all its tuned `[Property]` values. Build your enemy once, save it as `enemy.prefab`, then stamp out a hundred copies from code. Every spawner, gun, and loot drop you'll ever write is built on this." },
        { type: "callout", variant: "sbox", text: "Making one: build the GameObject in your scene, right-click it in the hierarchy and choose Convert to Prefab. The scene copy becomes an instance linked to the file — edit the prefab file and every instance in every scene updates. That's the point: fix the enemy's health once, it's fixed everywhere." },
        { type: "h3", text: "Referencing and cloning a prefab" },
        { type: "code", code: `public sealed class Gun : Component
{
    // Shows as a slot in the inspector — drag your .prefab file onto it
    [Property] public GameObject BulletPrefab { get; set; }

    void Fire()
    {
        // Clone = create a live copy in the scene, right now
        var bullet = BulletPrefab.Clone( WorldPosition, WorldRotation );
    }
}` },
        { type: "cards", items: [
          { h4: "Clone()", p: "Copy at the world origin. You almost always want a position — use an overload." },
          { h4: "Clone(position) / Clone(position, rotation)", p: "The two you'll use constantly. Spawn at a point, optionally facing a direction. A scale overload exists too: Clone(position, rotation, scale)." },
          { h4: "Clone(transform, parent, startEnabled, name)", p: "Full control — parent it under another object, spawn it disabled to configure before it activates, give it a name." },
          { h4: "GameObject.Clone(\"prefabs/enemy.prefab\")", p: "Static version — loads the prefab by path, no [Property] slot needed. Handy when the prefab is chosen at runtime, like a random loot table." },
        ] },
        { type: "callout", variant: "warn", text: "Unity habit to unlearn: there is no `Instantiate()` in s&box — cloning is always `Clone()`, and it works on any GameObject, not just prefabs. Also note a clone stays linked to its prefab file; call `bullet.BreakFromPrefab()` if you want it to become a plain, unlinked object." },
        { type: "h3", text: "Building objects from raw code" },
        { type: "code", code: `// No prefab needed for simple things — assemble in code
var marker = new GameObject( "WaypointMarker" );
marker.WorldPosition = hitPosition;

// AddComponent<T>() creates the component and returns it
var renderer = marker.AddComponent<ModelRenderer>();
renderer.Model = Model.Load( "models/dev/box.vmdl" );
renderer.Tint = Color.Green;` },
        { type: "p", text: "`new GameObject(\"name\")` gives you an empty object in the active scene. `AddComponent<T>()` bolts on behaviour — it's the code version of the inspector's Add Component button. Prefabs are still better for anything with more than a couple of components: designers can tweak them without touching code." },
        { type: "h3", text: "Destroying — and destroying later" },
        { type: "p", text: "`GameObject.Destroy()` doesn't vaporise the object mid-line. It queues the removal, and the object actually disappears at the start of the next frame. That's deliberate — other code might still be touching it this frame. And since a destroyed object is never `null` in C# — references to it live on — you check `IsValid()` instead: it turns false once the object is actually gone. During the pending frame itself the object still counts as valid; `IsDestroyed` is the flag that flips true the instant you call `Destroy()`. (`DestroyImmediate()` exists but skips that safety window — avoid it unless you know why you need it.)" },
        { type: "code", code: `public sealed class RocketLauncher : Component
{
    [Property] public GameObject RocketPrefab { get; set; }
    [Property] public GameObject Muzzle { get; set; }  // empty child at the barrel tip
    [Property] public float Speed { get; set; } = 900f;

    protected override void OnUpdate()
    {
        if ( !Input.Pressed( "Attack1" ) ) return;

        var rocket = RocketPrefab.Clone( Muzzle.WorldPosition, Muzzle.WorldRotation );
        rocket.GetComponent<Rigidbody>().Velocity = Muzzle.WorldRotation.Forward * Speed;

        // Clean up after 3s — unless something already destroyed it
        Invoke( 3f, () => { if ( rocket.IsValid() ) rocket.Destroy(); } );
    }
}` },
        { type: "h3", text: "A complete timed enemy spawner" },
        { type: "code", code: `public sealed class EnemySpawner : Component
{
    [Property] public GameObject EnemyPrefab { get; set; }
    [Property] public float Interval { get; set; } = 4f;
    [Property] public int MaxAlive { get; set; } = 8;

    private readonly List<GameObject> _alive = new();
    private TimeUntil _nextSpawn = 0f;   // 0 = ready immediately

    protected override void OnUpdate()
    {
        // Forget enemies that died — destroyed objects fail IsValid()
        _alive.RemoveAll( e => !e.IsValid() );

        if ( !_nextSpawn || _alive.Count >= MaxAlive ) return;

        var offset = Vector3.Random.WithZ( 0 ).Normal * 200f;
        _alive.Add( EnemyPrefab.Clone( WorldPosition + offset ) );
        _nextSpawn = Interval;  // countdown restarts
    }
}` },
        { type: "callout", variant: "why", text: "Two patterns here carry to every spawner you'll write. `TimeUntil` is a countdown you set with a float and read as a bool — no manual timer maths. And the `RemoveAll(e => !e.IsValid())` sweep is how you track spawned things safely: when an enemy dies elsewhere (player kills it, it falls out of the map), your list finds out through `IsValid()`, never through a stale reference that crashes you." },
        { type: "quiz", q: "You call `enemy.Destroy()` and, two lines later in the same frame, run `Scene.GetAllComponents<Enemy>()`. Does the destroyed enemy still show up?", options: [
          { text: "No — Destroy() removes it from the scene instantly", correct: false },
          { text: "Yes — Destroy() queues removal for the start of the next frame, so same-frame code can still see it", correct: true },
          { text: "It throws an exception because the object no longer exists", correct: false },
          { text: "Only if the enemy was spawned from a prefab", correct: false },
        ], explanation: "This one-frame grace period causes real bugs: a turret picks a target the same frame it died, then shoots a corpse. Within that frame, `IsDestroyed` is already true — filter on that if you must react instantly. Anything held across frames should be checked with `IsValid()` before use — it goes false once the object is actually gone, and it's the s&box equivalent of a null check for scene objects." },
        { type: "quiz", q: "Coming from a Unity tutorial, you type `Instantiate(EnemyPrefab, pos, rot)`. What's the s&box equivalent?", options: [
          { text: "Instantiate(EnemyPrefab, pos, rot) — it works the same", correct: false },
          { text: "new GameObject(EnemyPrefab)", correct: false },
          { text: "EnemyPrefab.Clone(pos, rot)", correct: true },
          { text: "Scene.Spawn(EnemyPrefab, pos, rot)", correct: false },
        ], explanation: "In s&box, cloning is one universal verb: `Clone()` copies prefabs and live GameObjects alike, with overloads for position, rotation, scale, and parent. `new GameObject()` only makes an empty object — it doesn't know anything about your prefab." },
      ],
    },
    {
      id: "sbox-ui",
      title: "UI with Razor panels",
      section: "s&box in practice",
      badge: "practice 3",
      blocks: [
        { type: "p", text: "Every HUD you've seen in an s&box game — health bars, ammo counters, kill feeds, pause menus — is a `.razor` file: HTML-like markup on top, a C# `@code` block underneath, and an SCSS file sitting next to it for styling. One file per UI piece, and it hot reloads on save like the rest of your code." },
        { type: "h3", text: "The smallest possible panel" },
        { type: "code", code: `@using Sandbox;
@using Sandbox.UI;
@inherits PanelComponent

<root>
    <div class="title">@Message</div>
</root>

@code
{
    [Property] public string Message { get; set; } = "Hello HUD";

    // Rebuild the markup whenever Message changes
    protected override int BuildHash() => System.HashCode.Combine( Message );
}` },
        { type: "p", text: "Line by line: `@inherits PanelComponent` makes this a real component — you add it to a GameObject, `[Property]` shows up in the inspector, and lifecycle methods like `OnUpdate()` still work. The markup lives inside `<root>`, and `@` drops you into C#: `@Message` prints the property, and `@if` / `@foreach` work too — loop over a `List<Entry>` to render a kill feed. The file name becomes the class name: `MyHud.razor` compiles to a `MyHud` class." },
        { type: "callout", variant: "sbox", text: "Getting it on screen: add a `ScreenPanel` component to a GameObject — the invisible full-screen surface UI draws to — then add your Razor component to that same GameObject. One ScreenPanel can host your whole HUD. For UI floating in the 3D world (name tags over players, prompts on doors), use `WorldPanel` instead. To create a panel fast: when you create a new component, pick the \"New Razor Panel Component\" template — s&box generates the `.razor` starter file for you; drop a matching `.razor.scss` next to it for styles." },
        { type: "quiz", q: "You add your new PauseMenu Razor component to a GameObject and press Play — nothing appears, no errors. Most likely cause?", options: [
          { text: "You forgot to add a Canvas object to the scene", correct: false },
          { text: "There's no ScreenPanel component — a PanelComponent needs one on its GameObject to draw to", correct: true },
          { text: "You need to call Panel.Render() from OnUpdate()", correct: false },
          { text: "Razor panels only render in multiplayer sessions", correct: false },
        ], explanation: "Canvas is Unity; s&box's equivalent surface is the ScreenPanel component. A typical game has one GameObject called \"UI\" holding a ScreenPanel plus all your HUD panel components. You never call render methods yourself — the engine draws any PanelComponent that has a surface." },
        { type: "h3", text: "BuildHash — when your panel re-renders" },
        { type: "p", text: "Here's the part that trips everyone up: the markup is not re-evaluated every frame. s&box calls your `BuildHash()` override and compares the result to last frame's — the panel only rebuilds when the hash changes. So combine every value your markup displays into the hash with `System.HashCode.Combine(...)`. For one-off, event-driven updates — a chat message arrived, an item got picked up — call `StateHasChanged()` to force a rebuild instead." },
        { type: "callout", variant: "warn", text: "The lazy hack is `BuildHash() => HashCode.Combine( Time.Now )` — the hash changes every frame, so the panel rebuilds every frame. Facepunch's own sample HUD does this with a comment telling you not to copy it: rebuilding the element tree 60+ times a second burns CPU your game needs. Hash the actual values you display." },
        { type: "h3", text: "A health bar bound to game data" },
        { type: "code", code: `@using Sandbox;
@inherits PanelComponent

<root>
    <div class="bar">
        <div class="fill" style="width: @(Percent)%"></div>
    </div>
    <div class="label">@(Percent.FloorToInt()) HP</div>
</root>

@code
{
    // Drag the player's HealthComponent onto this in the inspector
    [Property] public HealthComponent Target { get; set; }

    float Percent => Target.IsValid() ? Target.Health : 0f;  // max health is 100

    protected override int BuildHash() => System.HashCode.Combine( Percent );
}` },
        { type: "code", code: `// HealthHud.razor.scss — same name as the .razor file, applied automatically
HealthHud {
    position: absolute;
    left: 50px; bottom: 50px;
    flex-direction: column;

    .bar {
        width: 300px; height: 24px;
        background-color: #0006;   // hex with alpha — 6 = ~40% opaque
        border-radius: 4px;
    }
    .fill {
        height: 100%;
        background-color: #4caf50;
        transition: width 0.2s ease-out;  // damage ticks animate smoothly
    }
    .label { color: white; font-size: 16px; margin-top: 4px; }
}` },
        { type: "p", text: "The `.razor.scss` companion needs no linking — s&box picks it up by name, and style edits hot reload instantly. The top-level selector is your class name (`HealthHud`), with normal SCSS nesting inside. Layout is flexbox: `flex-direction`, `justify-content`, `align-items` and `gap` are your main tools. One gotcha for the next section: panels ignore the mouse by default — give anything clickable `pointer-events: all` in its style." },
        { type: "h3", text: "Handling clicks" },
        { type: "code", code: `<root>
    <button onclick=@Respawn>Respawn</button>

    @* Need to pass an argument? Use a lambda *@
    <button onclick=@( () => BuySlot( 2 ) )>Buy slot 2</button>
</root>

@code
{
    void Respawn()
    {
        Log.Info( "Respawning..." );
        // move the player, reset Target.Health, close the menu...
    }

    void BuySlot( int slot ) => Log.Info( $"Bought slot {slot}" );
}` },
        { type: "quiz", q: "Your health bar renders once, but the fill never moves even though `Target.Health` keeps changing. Most likely bug?", options: [
          { text: "UI reads must happen in OnFixedUpdate, not in markup", correct: false },
          { text: "The width style needs !important to override the SCSS file", correct: false },
          { text: "BuildHash() doesn't include the health value, so s&box never sees a reason to rebuild the panel", correct: true },
          { text: "Panels are static after first render — you must destroy and re-create it", correct: false },
        ], explanation: "Razor rendering is hash-driven: no hash change, no rebuild. Every value your markup reads belongs in `HashCode.Combine(...)` — health, ammo, score, all of it. It's the number one \"my HUD is frozen\" bug in s&box, and the fix is one line. For event-style updates, `StateHasChanged()` does the same job on demand." },
      ],
    },
    {
      id: "sbox-sound",
      title: "Sound & effects",
      section: "s&box in practice",
      badge: "practice 4",
      blocks: [
        { type: "p", text: "A hit that lands silently feels broken — even if the damage code is perfect. Sound and particles are how the player *feels* your game logic working. In this lesson you'll create SoundEvent assets, play them from code (stationary and following objects), build a particle burst in the scene system, and wire both into a bullet impact." },
        { type: "h3", text: "SoundEvent assets" },
        { type: "p", text: "Most sounds in s&box are `SoundEvent` assets — `.sound` files that bundle one or more audio clips with playback settings. Create one in the editor's Asset Browser (right-click → new Sound Event), then add your `.wav` files to its Sounds list. Key settings: `Volume` and `Pitch` (each can be a min–max range, rolled fresh on every play), `Selection Mode` (pick a random clip from the list), `Distance` (max audible range), and a `Falloff` curve." },
        { type: "callout", variant: "sbox", text: "Variation is free polish: give a footstep SoundEvent 3-4 clips, set Pitch to a range like 0.9-1.1, and Selection Mode to Random. The same event now never sounds identical twice — no code needed. And tick the UI flag on menu/HUD sounds: it plays them flat 2D with no distance attenuation." },
        { type: "code", code: `public sealed class Breakable : Component
{
    // Drag a .sound asset onto this in the inspector
    [Property] public SoundEvent BreakSound { get; set; }

    public void Smash()
    {
        // 3D one-shot at this object's position
        Sound.Play( BreakSound, WorldPosition );

        // Careful: no position = plays at world origin (0,0,0)
        Sound.Play( BreakSound );

        // Same thing by asset path — looked up by name
        Sound.Play( "sounds/impacts/glass_break.sound", WorldPosition );
    }
}` },
        { type: "h3", text: "Sounds that follow and change" },
        { type: "p", text: "`Sound.Play` is fire-and-forget: the sound stays where it started. For anything that moves — an engine, footsteps, a rocket in flight — use `GameObject.PlaySound`, which glues the sound to the object's position every frame. Every play call returns a `SoundHandle` you can keep and tweak live." },
        { type: "code", code: `// Follows this GameObject every frame — engines, footsteps, voices
SoundHandle engine = GameObject.PlaySound( EngineLoop );

engine.Volume = 0.8f;          // multiplier — 1.0 = as authored
engine.Pitch  = 1.2f;          // 2.0 = one octave up — rev it with speed

engine.Stop( 1.5f );           // fade out over 1.5 seconds
GameObject.StopAllSounds();    // stop everything following this object` },
        { type: "cards", items: [
          { h4: "SoundPointComponent", p: "Plays a sound at a fixed point in the world. Auto-play, looping, randomized repeat interval. Ambient hums, radios, dripping pipes — zero code." },
          { h4: "SoundBoxComponent", p: "Like SoundPointComponent, but the source position is constrained to a box region. Perfect for a river or wind along a whole cliff edge." },
          { h4: "SoundscapeTrigger", p: "Blends in an ambient soundscape when the listener enters the trigger. Walk into a cave, the cave sounds fade up." },
          { h4: "AudioListener", p: "Moves the listening point off the camera — e.g. onto the player's head in a third-person game so distances sound right." },
        ] },
        { type: "quiz", q: "You give a car a looping engine sound and it drives across the map. Which approach keeps the audio on the car?", options: [
          { text: "Sound.Play(EngineLoop, WorldPosition) — the position parameter tracks the object", correct: false },
          { text: "GameObject.PlaySound(EngineLoop) — the sound follows the GameObject every frame", correct: true },
          { text: "Add an AudioSource component to the car", correct: false },
          { text: "Call Sound.Play(EngineLoop, WorldPosition) again every frame in OnUpdate", correct: false },
        ], explanation: "Sound.Play with a position is a snapshot — the car drives away and leaves its own engine noise behind. GameObject.PlaySound sets the handle's Parent and FollowParent for you. (AudioSource is Unity — s&box's closest editor equivalent is SoundPointComponent.) Re-playing every frame would stack hundreds of overlapping sounds." },
        { type: "h3", text: "Particle effects in the scene system" },
        { type: "p", text: "s&box's particle system is built from ordinary components — no separate particle editor required. It simulates on the CPU (heavily multithreaded) and is fully programmable: you can even call `ParticleEffect.Emit` yourself to spawn particles one by one. A working effect is three components on one GameObject:" },
        { type: "cards", items: [
          { h4: "ParticleEffect", p: "The base. Holds the particle list and ticks it. Set max particles, particle lifetime, and optional forces and world collision here." },
          { h4: "An emitter", p: "Spawns the particles: ParticleSphereEmitter, ParticleBoxEmitter, ParticleConeEmitter and friends. Key knobs: Rate (per second), Initial Burst (all at once), Loop, and DestroyOnEnd." },
          { h4: "A renderer", p: "Makes them visible. ParticleSpriteRenderer draws camera-facing sprites (the usual choice); ParticleModelRenderer, ParticleLightRenderer and ParticleTrailRenderer exist too." },
        ] },
        { type: "callout", variant: "warn", text: "Older tutorials — and the `Particles.Create(\"explosion\", position)` line you saw in the networking lesson — use the legacy Source 2 particle API (`.vpcf` files). That's not how the current scene system works: build effects from `ParticleEffect` components in a prefab and `Clone()` it. Same era-check for RPCs: the current attribute is `[Rpc.Broadcast]`, not plain `[Broadcast]`. In multiplayer, put the Clone + Sound.Play inside an `[Rpc.Broadcast]` method so every client sees and hears the impact." },
        { type: "h3", text: "Putting it together: impact where a trace hits" },
        { type: "callout", variant: "sbox", text: "Build the impact prefab first: new GameObject → add ParticleEffect + ParticleSpriteRenderer + ParticleConeEmitter. On the emitter: Loop off, Rate 0, Initial Burst ~20, DestroyOnEnd on — the object deletes itself the moment the burst finishes. Save as a prefab and drag it onto the component's ImpactPrefab slot. Because the cone points along the object's forward axis, spawning it rotated to the surface normal makes sparks fly out of the wall." },
        { type: "code", code: `public sealed class HitscanGun : Component
{
    [Property] public SoundEvent ImpactSound { get; set; }
    [Property] public GameObject ImpactPrefab { get; set; }  // the burst prefab

    public void Fire( Vector3 start, Vector3 dir )
    {
        var tr = Scene.Trace.Ray( start, start + dir * 4096f )
                      .IgnoreGameObject( GameObject )   // don't shoot yourself
                      .Run();
        if ( !tr.Hit ) return;
        // Spawn the burst facing out of the surface, sound at the same spot
        ImpactPrefab.Clone( tr.EndPosition, Rotation.LookAt( tr.Normal ) );
        Sound.Play( ImpactSound, tr.EndPosition );
    }
}` },
        { type: "quiz", q: "Your impact prefab's emitter has Loop enabled and DestroyOnEnd off. What happens after a minute of shooting?", options: [
          { text: "Nothing — Loop only affects the editor preview", correct: false },
          { text: "Every clone keeps emitting forever and the GameObjects pile up — the scene leaks objects and frame rate sinks", correct: true },
          { text: "The engine automatically stops emitters after 10 seconds", correct: false },
          { text: "Clone() fails because looping prefabs can't be instantiated", correct: false },
        ], explanation: "Fire-and-forget effects must end and clean up after themselves. Loop off means the emitter runs once (your Initial Burst); DestroyOnEnd deletes the whole GameObject when it finishes. Forget either and every shot permanently adds an object to the scene — the classic slow-leak bug that only shows up in long playtests." },
      ],
    },
    {
      id: "sbox-anim",
      title: "Animation & characters",
      section: "s&box in practice",
      badge: "practice 5",
      blocks: [
        { type: "p", text: "A crate uses `ModelRenderer`. A character that walks, aims and jumps uses `SkinnedModelRenderer` — a renderer for models with a skeleton. On top of the skeleton sits an animgraph: a state machine that decides which animations play and how they blend, driven by parameters your code sets every frame. You never play \"walk.fbx\" directly — you tell the graph how fast you're moving, and it picks and blends the right clips." },
        { type: "cards", items: [
          { h4: "SkinnedModelRenderer", p: "Renders a skeletal model and runs its animgraph. Exposes `Set()` and `GetBool()`/`GetFloat()` to write and read graph parameters. Every animation call ends up here." },
          { h4: "Animgraph", p: "A node-based state machine asset built in the editor. It owns the blending logic — your code only feeds it parameters like speed, grounded, holdtype." },
          { h4: "CitizenAnimationHelper", p: "A component that wraps the citizen's animgraph parameters in friendly methods — `WithVelocity`, `IsGrounded`, `HoldType` — so you don't memorise parameter names." },
        ] },
        { type: "h3", text: "The citizen character" },
        { type: "p", text: "Facepunch ships a fully rigged character with the engine: the citizen, at `models/citizen/citizen.vmdl`. Its animgraph already handles walk/run blending, jumping, swimming, sitting, crouching and weapon poses — which makes it the perfect body for prototypes, NPCs and player characters. For players, the built-in `PlayerController` component even has an Animator feature that drives any citizen-compatible animgraph automatically. You write animation code yourself when you build NPCs, custom controllers, or anything the defaults don't cover." },
        { type: "callout", variant: "sbox", text: "Fast path: on a `PlayerController`, the Animator tab has a Create Body Renderer button — it spawns a \"Body\" child with a `SkinnedModelRenderer` and the citizen model, fully wired. And because `CitizenAnimationHelper` executes in the editor, you can drag its `DuckLevel` slider or switch `HoldType` in the inspector and watch the pose change live, without pressing Play." },
        { type: "h3", text: "Drive locomotion with CitizenAnimationHelper" },
        { type: "p", text: "Add a `CitizenAnimationHelper` (namespace `Sandbox.Citizen`) to your character, point its `Target` property at the `SkinnedModelRenderer`, then feed it state every frame. It converts world-space velocity into the model-space blend values the graph expects:" },
        { type: "code", code: `// _anim is a CitizenAnimationHelper — Target points at your renderer

_anim.WithVelocity( velocity );          // walk/run blend matches real speed
_anim.WithWishVelocity( wishVelocity );  // intent — arms reach mid-air
_anim.IsGrounded = isOnGround;           // false = falling pose, keep it updated
_anim.WithLook( eyeDirection );          // eyes, head and body turn to face a direction
_anim.DuckLevel = 0.7f;                  // 0 = standing, 1 = fully crouched
_anim.TriggerJump();                     // call once, at the moment of the jump` },
        { type: "cards", items: [
          { h4: "HoldType", p: "`_anim.HoldType = CitizenAnimationHelper.HoldTypes.Rifle;` — poses the upper body for what's held: None, Pistol, Rifle, Shotgun, HoldItem, Punch, Swing, RPG, Physgun." },
          { h4: "Handedness", p: "Which hand holds the item — `Hand.Right`, `Hand.Left` or `Hand.Both`. Only some holdtypes support it, like Pistol and HoldItem." },
          { h4: "TriggerDeploy()", p: "Plays the weapon draw animation once. Call it when the player switches weapons." },
          { h4: "IsWeaponLowered", p: "Relaxes the aim pose. Set it true when the player hasn't fired for a while — cheap, instant polish." },
        ] },
        { type: "quiz", q: "You call `_anim.WithVelocity( new Vector3( 200, 0, 0 ) )` every frame. What does the citizen do?", options: [
          { text: "Moves forward at 200 units per second", correct: false },
          { text: "Plays a run animation blended for 200 units/sec — but stays exactly where it is", correct: true },
          { text: "Teleports 200 units forward, then animates the transition", correct: false },
          { text: "Nothing, until you also call Play(\"run\")", correct: false },
        ], explanation: "Animation and movement are decoupled. Your movement code (or the PlayerController) moves the GameObject; the helper only feeds parameters to the animgraph so the body matches. That split is why the same animation code works for a player, an AI-driven NPC, or a networked proxy — whatever moves the character, the legs follow." },
        { type: "h3", text: "Animgraph parameters, directly" },
        { type: "code", code: `var renderer = GetComponent<SkinnedModelRenderer>();

renderer.Set( "b_grounded", true );  // b_ prefix = bool parameter
renderer.Set( "move_x", 120f );      // floats drive locomotion blending
renderer.Set( "holdtype", 2 );       // ints select states — 2 is Rifle
renderer.Set( "b_jump", true );      // one-shot: the graph consumes and resets it

bool airborne = !renderer.GetBool( "b_grounded" );  // read a parameter back` },
        { type: "callout", variant: "warn", text: "Unity muscle memory will betray you here. There is no `Animator` component and no `animator.SetTrigger(\"Jump\")` — you call `Set()` on the `SkinnedModelRenderer` itself, and it's `Set(\"b_jump\", true)` not SetBool/SetTrigger. Also, older s&box tutorials use a `FootShuffle` property on the helper — that's obsolete now; the current name is `MoveRotationSpeed`, which shuffles the feet when the character turns in place." },
        { type: "h3", text: "Wire it up: a patrolling NPC" },
        { type: "p", text: "Here's the full pattern — one component that owns movement and mirrors it into animation. Set it up as: a GameObject with your logic + `CitizenAnimationHelper`, a child with a `SkinnedModelRenderer` using the citizen model, and the helper's `Target` pointing at that renderer. This is worth typing out yourself:" },
        { type: "code", code: `using Sandbox.Citizen;

public sealed class PatrolNpc : Component
{
    [Property] public GameObject Waypoint { get; set; }
    [Property] public float Speed { get; set; } = 90f;
    [RequireComponent] CitizenAnimationHelper _anim { get; set; }

    protected override void OnUpdate()
    {
        if ( !Waypoint.IsValid() ) return;

        // Movement code owns the position...
        var dir = (Waypoint.WorldPosition - WorldPosition).WithZ( 0 ).Normal;
        WorldPosition += dir * Speed * Time.Delta;

        // ...animation mirrors it
        _anim.WithVelocity( dir * Speed );      // legs match the real speed
        _anim.WithWishVelocity( dir * Speed );  // body leans into the intent
        _anim.WithLook( dir );                  // face where we're walking
        _anim.IsGrounded = true;                // feet planted — no falling pose
    }
}` },
        { type: "quiz", q: "Which line fires the citizen's jump animation at the animgraph level?", options: [
          { text: "renderer.SetTrigger( \"Jump\" )", correct: false },
          { text: "renderer.Play( \"jump\" )", correct: false },
          { text: "renderer.Set( \"b_jump\", true )", correct: true },
          { text: "renderer.Set( \"jump\", 1f )", correct: false },
        ], explanation: "Bool parameters use the `b_` prefix, and `b_jump` is a one-shot the graph consumes and resets. The helper's `TriggerJump()` is literally this one line. Knowing the raw `Set()` API matters beyond the citizen — when you build an animgraph for your own monster or vehicle driver, the exact same calls drive it." },
      ],
    },
    {
      id: "sbox-camera",
      title: "Cameras",
      section: "s&box in practice",
      badge: "practice 6",
      blocks: [
        { type: "p", text: "The camera is just a component — a `CameraComponent` sitting on a GameObject in your scene. Nothing owns it, nothing moves it for you. Whoever writes the code that positions it each frame decides whether your game is an FPS, a top-down shooter, or a side-scroller. From any component, `Scene.Camera` gives you the active one." },
        { type: "code", code: `// From inside any component — grab the active camera
var cam = Scene.Camera;

cam.FieldOfView = 90f;                    // degrees, wider = more visible
cam.WorldPosition = new Vector3( 0, 0, 64 );
cam.WorldRotation = Rotation.LookAt( Vector3.Forward );

// A scene can hold several CameraComponents.
// Scene.Camera picks ones flagged IsMainCamera first, then lowest Priority.` },
        { type: "callout", variant: "sbox", text: "The built-in `PlayerController` component ships with camera controls — a Camera feature toggle in the inspector with `ThirdPerson`, `CameraOffset`, and an input action to switch views. Great for prototyping. This lesson is for when you turn that off (untick \"Camera\" on the component) and drive `Scene.Camera` yourself — which every game eventually does." },
        { type: "h3", text: "First person: accumulate eye angles" },
        { type: "p", text: "The pattern: keep an `Angles` field (pitch, yaw, roll). Every frame, add `Input.AnalogLook` to it — that's this frame's look delta, already merged from mouse movement and controller sticks with the player's sensitivity and invert settings applied. Clamp pitch so the player can't backflip their neck, zero the roll, convert to a `Rotation`, and put the camera at eye height." },
        { type: "code", code: `private Angles _eyeAngles;

protected override void OnUpdate()
{
    // AnalogLook = this frame's look delta (mouse AND controller stick)
    _eyeAngles += Input.AnalogLook;
    _eyeAngles.roll = 0f;                                    // no head tilt
    _eyeAngles.pitch = _eyeAngles.pitch.Clamp( -89f, 89f );  // no neck-snapping

    var cam = Scene.Camera;
    cam.WorldPosition = WorldPosition + Vector3.Up * 64f;    // eye height
    cam.WorldRotation = _eyeAngles.ToRotation();
}` },
        { type: "callout", variant: "warn", text: "Two classic mistakes here. First: do NOT multiply look input by `Time.Delta` — `Input.AnalogLook` is already a per-frame delta (\"how far the mouse moved since last frame\"). Scaling it again makes aim speed change with frame rate, which feels awful. Second: older tutorials read `Input.MouseDelta` and apply sensitivity by hand — that still exists, but `Input.AnalogLook` is the idiomatic way now because it handles mouse, sticks, sensitivity, and invert preferences for free." },
        { type: "h3", text: "Third person: orbit, then trace back" },
        { type: "code", code: `// Same _eyeAngles accumulation as first person, then:
var eye = WorldPosition + Vector3.Up * 64f;
var rot = _eyeAngles.ToRotation();
var wanted = eye - rot.Forward * 200f;   // 200 units behind the player

// Sphere-trace from the eye to the wanted spot — stop early at walls
var tr = Scene.Trace.FromTo( eye, wanted )
    .IgnoreGameObjectHierarchy( GameObject.Root )  // don't hit yourself
    .Radius( 8f )                                  // a thick ray, not a thin line
    .Run();

Scene.Camera.WorldPosition = tr.EndPosition;
Scene.Camera.WorldRotation = rot;` },
        { type: "callout", variant: "why", text: "Why trace at all? Back the camera up 200 units and the player will immediately stand against a wall — without the trace, the camera ends up inside or behind it, showing the void. Tracing from the eye to the wanted position and stopping at the first hit pulls the camera in front of the wall instead. The `.Radius(8f)` makes it a sphere trace: a thin ray can stop with the camera touching the wall, and the near clip plane still pokes through. This is exactly how s&box's own PlayerController does it — the engine source even lerps `tr.Distance` over a few frames so the zoom feels smooth instead of snappy." },
        { type: "h3", text: "Juice: FOV kicks and screen shake" },
        { type: "code", code: `private float _trauma;   // 0..1 — bump it when things explode

protected override void OnPreRender()
{
    var cam = Scene.Camera;

    // FOV kick: lerp toward a target, never snap
    var target = Input.Down( "Run" ) ? 85f : 70f;
    cam.FieldOfView = cam.FieldOfView.LerpTo( target, Time.Delta * 8f );

    // Shake: random offset scaled by trauma², decaying every frame
    _trauma = (_trauma - Time.Delta * 1.5f).Clamp( 0f, 1f );
    cam.WorldPosition += Random.Shared.VectorInSphere( 6f ) * _trauma * _trauma;
}` },
        { type: "callout", variant: "warn", text: "To trigger that shake from a networked event — a grenade every client should feel — you'd call a method marked `[Rpc.Broadcast]`. The networking lesson showed `[Broadcast]`, but the SDK renamed the RPC attributes: it's `[Rpc.Broadcast]` now, alongside `[Rpc.Owner]` and `[Rpc.Host]`. The old name won't compile in current s&box." },
        { type: "cards", items: [
          { h4: "Scene.Camera", p: "The active CameraComponent. If several exist, ones with `IsMainCamera` win, then lowest `Priority`. Returns null if the scene has no camera — add one via the Camera object template." },
          { h4: "OnPreRender()", p: "Lifecycle hook that runs right before the frame is drawn — after every OnUpdate. Position cameras here so they never lag one frame behind the thing they follow." },
          { h4: "FieldOfView", p: "In degrees, default 60. For player comfort, respect their settings: `cam.FieldOfView = Preferences.FieldOfView` uses the value from the s&box options menu." },
          { h4: "Scene.Trace", p: "`Scene.Trace.FromTo(a, b).Radius(r).Run()` — the collision query behind wall-safe cameras. Check `tr.Hit`, `tr.Distance`, `tr.EndPosition`, and `tr.StartedSolid`." },
        ] },
        { type: "quiz", q: "Your first-person camera turns fast at 144fps but sluggishly at 30fps. What's the likely bug?", options: [
          { text: "You forgot to multiply Input.AnalogLook by Time.Delta", correct: false },
          { text: "You multiplied Input.AnalogLook by Time.Delta — it's already a per-frame delta, so scaling it makes turn speed depend on frame rate", correct: true },
          { text: "You should read input in OnFixedUpdate instead", correct: false },
          { text: "FieldOfView needs to be lower at high frame rates", correct: false },
        ], explanation: "Time.Delta converts per-second speeds into per-frame amounts — but mouse input is already \"distance moved this frame\". Continuous speeds (movement, rotation over time) get Time.Delta; per-frame deltas (AnalogLook, MouseDelta) never do. Getting this wrong is the number one reason aim \"feels off\" in student projects." },
        { type: "quiz", q: "Your third-person camera shows the inside of walls when the player backs into a corner. What's the standard fix?", options: [
          { text: "Increase the camera's ZNear so walls clip out of view", correct: false },
          { text: "Tag walls so the camera doesn't render them", correct: false },
          { text: "Sphere-trace from the player's eye to the wanted camera spot and place the camera at tr.EndPosition", correct: true },
          { text: "Parent the camera to the player so it moves through walls with them", correct: false },
        ], explanation: "The trace treats the camera boom like a physical arm that walls can push in. Every polished third-person game does this — it's why the camera in those games zooms toward the character's shoulder in tight spaces. Use a radius on the trace so the near clip plane can't peek through, and lerp the distance so the zoom is smooth." },
      ],
    },
    {
      id: "sbox-mp",
      title: "Multiplayer in practice",
      section: "s&box in practice",
      badge: "practice 7",
      blocks: [
        { type: "p", text: "The Networking basics lesson gave you `[Sync]` and the server-authority rule. This lesson is the machinery that turns those into a playable game. The core mental model: every networked GameObject exists on every connected machine, but exactly one connection owns it. The owner simulates it; everyone else holds a proxy that the network updates. Get that straight and multiplayer stops being mysterious." },
        { type: "h3", text: "IsProxy — only simulate what you own" },
        { type: "p", text: "Your player prefab's movement component runs on every machine — including on the copies of everyone else's characters. The first line of any owned-object logic asks one question: is this copy mine?" },
        { type: "code", code: `public sealed class PlayerMovement : Component
{
    [Property] public float Speed { get; set; } = 250f;

    protected override void OnUpdate()
    {
        // On everyone else's machine this object is a proxy —
        // the network moves it. Never simulate it twice.
        if ( IsProxy ) return;

        // Only the owning player's machine gets past this line
        var wish = Input.AnalogMove.Normal * Speed;
        WorldPosition += wish * Time.Delta;
    }
}` },
        { type: "callout", variant: "warn", text: "Forget the `IsProxy` guard and every machine applies its own input to every player — characters jitter, snap back, or fly at double speed as local simulation fights incoming network updates. When a networked object misbehaves, check for a missing guard first. It's the single most common multiplayer bug in s&box." },
        { type: "h3", text: "Ownership can move" },
        { type: "p", text: "Ownership isn't fixed at spawn. A crate should be simulated by whoever is carrying it, a car by its driver — physics feels instant when the machine using an object is also the one simulating it. Each networked object has an `OwnerTransfer` rule that controls who may change its owner, set with `Network.SetOwnerTransfer(...)` or in the object's network settings." },
        { type: "code", code: `// Player picks up a crate — their machine simulates it from now on
crate.Network.TakeOwnership();

// Dropped — back to host control, owned by no-one
crate.Network.DropOwnership();

// Host hands the race car to a specific player's connection
car.Network.AssignOwnership( channel );

// Lock a player pawn so nobody can steal it
pawn.Network.SetOwnerTransfer( OwnerTransfer.Fixed );` },
        { type: "cards", items: [
          { h4: "OwnerTransfer.Takeover", p: "Anyone can call TakeOwnership() at any time. Right for shared props — crates, balls, anything grabbable." },
          { h4: "OwnerTransfer.Fixed", p: "Only the host can change the owner. Right for player characters — nobody should be able to steal your pawn." },
          { h4: "OwnerTransfer.Request", p: "Clients ask, the host decides. TakeOwnership() becomes a request the host can refuse — right for contested objects like a vehicle seat." },
        ] },
        { type: "h3", text: "RPCs — pick the right audience" },
        { type: "code", code: `[Rpc.Broadcast]   // runs on every machine — cosmetic one-shot events
public void ShowExplosion( Vector3 pos ) => Sound.Play( "explosion", pos );

[Rpc.Host]        // runs only on the host — authoritative decisions
public void RequestRespawn()
{
    // Rpc.Caller is the connection that sent this RPC
    Respawn( Rpc.Caller );
}

[Rpc.Owner]       // runs only on the machine that owns this object
public void ShowHitMarker() => Hud.FlashHitMarker();` },
        { type: "callout", variant: "warn", text: "Older tutorials and code snippets use `[Broadcast]` and `[Authority]`. The SDK renamed these: the current attributes are `[Rpc.Broadcast]`, `[Rpc.Host]` (covering the old `[Authority]` role), and `[Rpc.Owner]`. If the compiler says the attribute doesn't exist, you're reading outdated code." },
        { type: "quiz", q: "You land a shot on another player. The host confirms the hit, and you want a hitmarker to flash only on the shooter's screen. Which RPC does the host call on the shooter's player object?", options: [
          { text: "[Rpc.Broadcast] — everyone should be told about the hit", correct: false },
          { text: "[Rpc.Owner] — it runs only on the machine that owns that player object", correct: true },
          { text: "A [Sync] bool ShowHitmarker set to true", correct: false },
          { text: "[Rpc.Host] — hit confirmation is authoritative", correct: false },
        ], explanation: "Match the RPC to its audience: Broadcast is for effects everyone sees, Host is for clients asking the authority to do something, Owner is for private feedback like hitmarkers and damage numbers. And use RPCs, not [Sync], for one-shot events — [Sync] is for persistent state, and a synced bool would flash on every screen and need resetting." },
        { type: "h3", text: "The game manager — lobby in, players spawned" },
        { type: "code", code: `public sealed class GameManager : Component, Component.INetworkListener
{
    [Property] public GameObject PlayerPrefab { get; set; }

    protected override async Task OnLoad()
    {
        // Host a lobby unless we launched by joining someone else's game
        if ( !Scene.IsEditor && !Networking.IsActive )
            Networking.CreateLobby( new LobbyConfig { MaxPlayers = 8 } );
    }

    // Host-only: fires each time a client has fully loaded into the game
    public void OnActive( Connection channel )
    {
        var player = PlayerPrefab.Clone( WorldPosition );
        player.NetworkSpawn( channel );  // exists everywhere, owned by them
    }
}` },
        { type: "callout", variant: "sbox", text: "This whole loop ships built-in: add the Network Helper component (Add Component → Networking) to a scene object, drag in a player prefab, and it creates the lobby and spawns one pawn per connection at a random `SpawnPoint`. Start with it, replace it with your own manager when you need teams or round logic. `Component.INetworkListener` has more hooks too: `OnConnected`/`OnDisconnected` for join and leave, `OnBecameHost` for when the old host quits and you inherit the game, and `AcceptConnection` to turn away banned players before they load in." },
        { type: "quiz", q: "In the GameManager above, where does `OnActive` run, and what does `player.NetworkSpawn( channel )` actually do?", options: [
          { text: "It runs on the joining client, and spawns the player only on their machine", correct: false },
          { text: "It runs on every machine, and each one spawns its own copy of the prefab", correct: false },
          { text: "It runs on the host; NetworkSpawn creates the object on every connected machine and makes channel its owner", correct: true },
          { text: "It runs on a dedicated server process; clients must Clone the prefab themselves", correct: false },
        ], explanation: "The host spawns exactly once and the network replicates the object to everyone — if each machine cloned its own copy you'd get eight balls per match instead of one. Passing the connection sets the owner, which is what makes IsProxy false on that player's machine so their input drives the pawn. Spawn on the host, own on the client: that's the whole pattern." },
      ],
    },
    {
      id: "sbox-ship",
      title: "Ship your game",
      section: "s&box in practice",
      badge: "practice 8",
      blocks: [
        { type: "p", text: "You can write C#, build components, read input, and network state. The last skill is the one most developers never practice: actually shipping. In s&box, publishing is built into the editor — your game goes live on sbox.game where anyone can click it and play, no installers, no store approval queue." },
        { type: "h3", text: "Publishing to sbox.game" },
        { type: "p", text: "Click your project's name (the title button with your logo, top-left of the editor) and choose `Publish..`. A wizard walks you through it: confirm your Title, Ident and Organisation, it compiles your code and uploads your assets, you write a short revision note, and hit Publish New Revision. Before you do — check Project Settings and make sure your startup scene is set to the scene players should actually land in (a menu scene or straight into gameplay). The same menu also has `Export..` for standalone Steam builds, but sbox.game is where you start." },
        { type: "callout", variant: "sbox", text: "Your game's identity is `org.package` — like `facepunch.ss1`. Create an organisation on the sbox.game website first (the wizard links you there); a brand-new org may need an editor restart before it appears in the dropdown. Idents can't contain spaces or special characters, and the combined `orgname.packageident` is the permanent, unique ID for your game — pick it like you'd pick a username." },
        { type: "p", text: "After publishing, your game gets its own page on sbox.game. Click View and Edit on Web to add a description, screenshots and video — that page is your store listing, so treat it like one. Until you flip it to public, only members of your organisation can access it, which makes a private publish a great playtest channel. Updating is just publishing again: the wizard asks for a change title and detail, and players automatically get the newest revision next time they play." },
        { type: "quiz", q: "You publish `blaster` under your organisation `sophie`. What identifies your game on sbox.game?", options: [
          { text: "com.sophie.blaster — a reverse-domain bundle ID", correct: false },
          { text: "sophie.blaster — org ident dot package ident, and it's permanent", correct: true },
          { text: "A random GUID that Steam assigns at upload time", correct: false },
          { text: "sophie.blaster, but you can rename the ident freely in Project Settings later", correct: false },
        ], explanation: "The `org.package` ident is the unique persistent identifier for your package — leaderboard APIs, map loading, and cloud asset references all use it (e.g. `facepunch.ss1`). Because everything keys off it, it isn't meant to change, so choose it carefully before your first publish." },
        { type: "h3", text: "Test multiplayer before you ship" },
        { type: "p", text: "Never ship a multiplayer game you've only played alone. In the editor, click the network status icon in the header bar and choose Join via new instance — a second copy of the game launches and joins your running session, so you can watch both screens. Hot reload still works: save a C# file and the change mirrors to every connected client, including that second instance. You can also open an instance manually and type `connect local` in the console, or `reconnect` after a code change that needs a fresh join." },
        { type: "callout", variant: "warn", text: "API rename: older tutorials show `[Broadcast]` and `[Authority]` — the current SDK uses `[Rpc.Broadcast]`, `[Rpc.Owner]` (runs only for the object's owner) and `[Rpc.Host]` (runs only on the host). To restrict who may *call* an RPC, pass flags like `NetFlags.HostOnly`. The old attribute names won't compile on today's SDK — update them before you publish." },
        { type: "code", code: `// Current SDK RPC syntax — Rpc.* attributes
[Rpc.Broadcast]
public void PlayWinEffects( Vector3 position )
{
    // Runs on every connected client
    Sound.Play( "victory", position );
}

[Rpc.Broadcast( NetFlags.HostOnly )]  // only the host may call this
public void AnnounceWinner( string name )
{
    Log.Info( $"{name} wins the round!" );
}` },
        { type: "h3", text: "Performance quick wins" },
        { type: "p", text: "`OnUpdate` runs every frame for every component — at 60fps, one careless line runs 3,600 times a minute. The two classic killers: scanning the scene per frame (`Scene.GetAllComponents<T>()` walks everything), and allocating per frame (`new List`, LINQ chains ending in `.ToList()`, string concatenation) which piles up garbage the runtime must pause to collect. The fix is always the same: do expensive lookups once in `OnStart`, cache the result, and keep per-frame work cheap." },
        { type: "code", code: `public sealed class WaveManager : Component
{
    private List<Enemy> _enemies;

    protected override void OnStart()
    {
        // Scan the scene ONCE and cache — never do this in OnUpdate
        _enemies = Scene.GetAllComponents<Enemy>().ToList();
    }

    protected override void OnUpdate()
    {
        // Cheap per-frame upkeep only — no scene scans, no new lists
        _enemies.RemoveAll( e => !e.IsValid() );
    }
}` },
        { type: "quiz", q: "Your game runs smooth with 5 enemies but chugs with 200. Which habit is the most likely culprit?", options: [
          { text: "Caching component references in OnStart instead of finding them fresh", correct: false },
          { text: "Calling Scene.GetAllComponents<Enemy>() inside OnUpdate — a full scene scan every single frame", correct: true },
          { text: "Using [Property] on too many fields", correct: false },
          { text: "Doing physics movement in OnFixedUpdate instead of OnUpdate", correct: false },
        ], explanation: "Per-frame cost scales with object count, so problems hide at small scale and explode at large scale. Caching in OnStart and physics in OnFixedUpdate are the *correct* habits. Before shipping, profile with a realistic worst case — a full server and a full wave — not the two-object test scene you developed in." },
        { type: "h3", text: "Where to go next" },
        { type: "cards", items: [
          { h4: "Official docs", p: "sbox.game/dev/doc goes deeper on everything here and beyond — shaders, dedicated servers, custom assets, editor tooling. The API reference on sbox.game documents every class and method in the SDK." },
          { h4: "Read real code", p: "Facepunch's GitHub is a goldmine: `sbox-hc1` is a complete multiplayer shooter, `sbox-scenestaging` demos engine features scene by scene, and `sbox-public` is the engine source itself — open under MIT." },
          { h4: "Community", p: "The s&box Discord and the forums on sbox.game are where developers share problems and prefabs. When something breaks after an update, the release notes on sbox.game usually explain the API change." },
          { h4: "Just build", p: "Pick something tiny — a one-room arena, a score-attack minigame — and publish it privately this week. One shipped small game teaches more than ten unfinished big ones." },
        ] },
        { type: "cta", title: "Course complete — you're a game developer now", sub: "C# from the ground up, components, input, networking, and a publish button you know how to press. The next game on the sbox.game front page could be yours." },
      ],
    },
  ],
};
