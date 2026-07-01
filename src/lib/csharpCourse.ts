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
[Broadcast]
public void PlayExplosionEffect(Vector3 position)
{
    // This runs on every client
    Particles.Create("explosion", position);
}

// Run on the server only
[Authority]
public void DealDamage(float amount)
{
    Health -= amount;  // server decides — clients can't cheat this
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
        { type: "cta", title: "You now have the full picture", sub: "C# foundations + the s&box layer on top. Time to build something for real." },
      ],
    },
  ],
};
