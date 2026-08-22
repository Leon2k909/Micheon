/**
 * A picture for the word being taught.
 *
 * Images sit beside the words: the card for Apfel shows an apple as well as
 * the text, in one consistent look so nothing sits out of place, and with as
 * much coverage as can be had.
 *
 * WHY EMOJI RATHER THAN AN IMAGE PACK. Micheon ships everything in the
 * installer and must work with no network, so thousands of downloaded
 * illustrations would be megabytes of assets, a licence to honour, and a
 * mixed bag of styles from many hands. The platform's own emoji font is one
 * designer's complete set (Segoe UI Emoji on the Windows desktops this app
 * is built for), already on the machine, weightless, infinitely scalable,
 * and coherent by construction. The map stores the character, so swapping in
 * an illustrated set later means changing how it is drawn, not this file.
 *
 * WHAT EARNS A PICTURE. A picture is here to carry meaning the text cannot,
 * so it earns its place only when it tells this word apart from its
 * neighbours. Concrete things qualify: animals, food, the body, weather,
 * clothes, tools, places, jobs, transport. Abstractions almost never do — a
 * speech bubble beside "describe", "mention", "explain" and "discuss" makes
 * four cards look identical while teaching nothing, and a picture that has
 * to be explained is worse than no picture at all, because the learner will
 * try to read meaning into it. Where the symbol is genuinely conventional
 * and specific — money, an alarm clock, a rising line for "increase" — it
 * stays. Roughly two thirds of the catalogue is abstract, and those cards
 * are meant to come back empty.
 *
 * Keys are the normalised English sense the learner is actually shown, and
 * are split by part of speech so "die Fliege" (fly, the insect) and
 * "fliegen" (to fly) can each get the right one.
 *
 * Kept to emoji through Unicode 14 wherever there was a choice, so the two
 * Windows machines this runs on both have the glyph rather than a blank box.
 */

/** Things, and anything not covered by a more specific map. */
const NOUNS: Record<string, string> = {
  // ── Animals ───────────────────────────────────────────────────────────
  dog: "🐕", cat: "🐈", puppy: "🐶", kitten: "🐱", horse: "🐎", pony: "🐴",
  foal: "🐴", cow: "🐄", ox: "🐂", bull: "🐂", calf: "🐄", pig: "🐖",
  piglet: "🐖", sheep: "🐑", lamb: "🐑", goat: "🐐", chicken: "🐔",
  hen: "🐔", rooster: "🐓", chick: "🐣", duck: "🦆", goose: "🦢",
  rabbit: "🐇", hare: "🐇", "guinea pig": "🐹",
  hamster: "🐹", mouse: "🐁", rat: "🐀", bird: "🐦", fish: "🐟",
  fox: "🦊", wolf: "🐺", bear: "🐻", "polar bear": "🐻‍❄️", deer: "🦌",
  stag: "🦌", "roe deer": "🦌", "wild boar": "🐗", hedgehog: "🦔",
  squirrel: "🐿️", badger: "🦡", beaver: "🦫", otter: "🦦", lynx: "🐆",
  mole: "🐁", bat: "🦇", elephant: "🐘", lion: "🦁", tiger: "🐅",
  giraffe: "🦒", monkey: "🐒", ape: "🦍", gorilla: "🦍",
  chimpanzee: "🐒", zebra: "🦓", rhinoceros: "🦏", hippopotamus: "🦛",
  kangaroo: "🦘", camel: "🐫", leopard: "🐆", cheetah: "🐆",
  crocodile: "🐊", alligator: "🐊", raccoon: "🦝", porcupine: "🦔",
  sloth: "🦥", panda: "🐼", koala: "🐨", llama: "🦙", bison: "🦬",
  eagle: "🦅", owl: "🦉", falcon: "🦅", hawk: "🦅", raven: "🐦",
  crow: "🐦", blackbird: "🐦", pigeon: "🕊️", dove: "🕊️",
  sparrow: "🐦", stork: "🐦", swan: "🦢", seagull: "🕊️",
  parrot: "🦜", peacock: "🦚", flamingo: "🦩", penguin: "🐧",
  dolphin: "🐬", whale: "🐋", shark: "🦈", octopus: "🐙", squid: "🦑",
  crab: "🦀", lobster: "🦞", mussel: "🦪", oyster: "🦪",
  seashell: "🐚", shell: "🐚", seal: "🦭", turtle: "🐢",
  tortoise: "🐢", lizard: "🦎", snake: "🐍", frog: "🐸", toad: "🐸",
  spider: "🕷️", "spider's web": "🕸️", bee: "🐝", wasp: "🐝",
  bumblebee: "🐝", ant: "🐜", fly: "🪰", mosquito: "🦟",
  butterfly: "🦋", moth: "🦋", beetle: "🪲", bug: "🐛",
  caterpillar: "🐛", ladybird: "🐞", ladybug: "🐞", dragonfly: "🦗",
  grasshopper: "🦗", cricket: "🦗", locust: "🦗", snail: "🐌",
  worm: "🪱", earthworm: "🪱", animal: "🐾", pet: "🐾", insect: "🐛",
  paw: "🐾", feather: "🪶", wing: "🪶", horn: "🐂", tail: "🐕",
  fur: "🧥", hive: "🐝", herd: "🐄", flock: "🐑",

  // ── Fruit, vegetables, food ───────────────────────────────────────────
  apple: "🍎", pear: "🍐", banana: "🍌", orange: "🍊", lemon: "🍋",
  strawberry: "🍓", raspberry: "🫐", blueberry: "🫐",
  blackberry: "🫐", currant: "🫐", berry: "🫐", cherry: "🍒",
  plum: "🍑", peach: "🍑", apricot: "🍑", grape: "🍇", melon: "🍈",
  watermelon: "🍉", pineapple: "🍍", mango: "🥭", kiwi: "🥝",
  pomegranate: "🍎", fig: "🍑", raisin: "🍇", nut: "🥜",
  walnut: "🌰", hazelnut: "🌰", peanut: "🥜", almond: "🌰",
  chestnut: "🌰", coconut: "🥥", avocado: "🥑", olive: "🫒",
  fruit: "🍎", potato: "🥔", tomato: "🍅", cucumber: "🥒",
  carrot: "🥕", onion: "🧅", garlic: "🧄", pepper: "🫑",
  courgette: "🥒", zucchini: "🥒", aubergine: "🍆", eggplant: "🍆",
  broccoli: "🥦", cauliflower: "🥦", "brussels sprouts": "🥬",
  spinach: "🥬", lettuce: "🥬", salad: "🥗", cabbage: "🥬",
  "red cabbage": "🥬", sauerkraut: "🥬", celery: "🥬", leek: "🥬",
  radish: "🥕", turnip: "🥕", beetroot: "🥕", pumpkin: "🎃",
  squash: "🎃", bean: "🫘", lentil: "🫘", asparagus: "🥬",
  artichoke: "🥬", fennel: "🥬", parsley: "🌿", chives: "🌿",
  basil: "🌿", thyme: "🌿", rosemary: "🌿", mint: "🌿", herb: "🌿",
  spice: "🌿", vegetable: "🥕", corn: "🌽", maize: "🌽",
  mushroom: "🍄", bread: "🍞", roll: "🥐", "bread roll": "🥐",
  toast: "🍞", crust: "🍞", butter: "🧈", cheese: "🧀", egg: "🥚",
  milk: "🥛", cream: "🥛", yoghurt: "🥛", yogurt: "🥛",
  honey: "🍯", jam: "🍓", sugar: "🍬", salt: "🧂", flour: "🌾",
  dough: "🥖", cake: "🍰", tart: "🍰", biscuit: "🍪", cookie: "🍪",
  chocolate: "🍫", sweet: "🍬", candy: "🍬", "ice cream": "🍦",
  pudding: "🍮", soup: "🍲", stew: "🍲", sauce: "🥣", rice: "🍚",
  pasta: "🍝", noodle: "🍜", dumpling: "🥟", pizza: "🍕",
  burger: "🍔", chips: "🍟", "french fries": "🍟", sausage: "🌭",
  bacon: "🥓", ham: "🍖", meat: "🥩", steak: "🥩", schnitzel: "🍖",
  chop: "🍖", roast: "🍖", mince: "🥩", poultry: "🍗",
  salmon: "🐟", trout: "🐟", tuna: "🐟", herring: "🐟", carp: "🐟",
  prawn: "🍤", shrimp: "🍤", oil: "🫒", vinegar: "🫙",
  mustard: "🌭", ketchup: "🍅", food: "🍽️", meal: "🍽️",
  dish: "🍽️", recipe: "📖", breakfast: "🥐", lunch: "🍽️",
  dinner: "🍽️", supper: "🍽️", snack: "🍿", popcorn: "🍿",
  sandwich: "🥪", pretzel: "🥨", croissant: "🥐", pancake: "🥞",
  waffle: "🧇", cinnamon: "🌿", vanilla: "🌿", portion: "🍽️",
  slice: "🍰", crumb: "🍞", taste: "👅", hunger: "🍽️",
  thirst: "🥤", appetite: "🍽️",

  // ── Drink ─────────────────────────────────────────────────────────────
  water: "💧", "mineral water": "💧", coffee: "☕", tea: "🍵",
  beer: "🍺", wine: "🍷", juice: "🧃", drink: "🥤",
  "soft drink": "🥤", lemonade: "🥤", cocktail: "🍸",
  champagne: "🍾", "sparkling wine": "🍾", whisky: "🥃",
  schnapps: "🥃", bottle: "🍾", glass: "🥛", cup: "☕", mug: "☕",
  teapot: "🫖", straw: "🥤", ice: "🧊", "ice cube": "🧊",

  // ── The body ──────────────────────────────────────────────────────────
  head: "🧠", hair: "💇", face: "😀", eye: "👁️", eyebrow: "👁️",
  eyelash: "👁️", ear: "👂", nose: "👃", mouth: "👄", lip: "👄",
  tooth: "🦷", tongue: "👅", chin: "😀", cheek: "😀", beard: "🧔",
  moustache: "🧔", forehead: "😀", neck: "🧣", throat: "🗣️",
  shoulder: "💪", arm: "💪", elbow: "💪", wrist: "⌚", hand: "✋",
  finger: "👆", thumb: "👍", fingernail: "💅", fist: "✊",
  chest: "🫁", breast: "🫁", back: "🦴", waist: "👖", hip: "🦴",
  leg: "🦵", thigh: "🦵", knee: "🦵", ankle: "🦶", foot: "🦶",
  heel: "🦶", toe: "🦶", skin: "🧴", bone: "🦴", muscle: "💪",
  heart: "❤️", brain: "🧠", lung: "🫁", liver: "🫀",
  kidney: "🫀", blood: "🩸", vein: "🩸", nerve: "🧠",
  spine: "🦴", skull: "💀", rib: "🦴", body: "🧍",
  skeleton: "💀", tear: "😢", sweat: "💦", breath: "💨",
  voice: "🗣️", height: "📏",

  // ── Family and people ─────────────────────────────────────────────────
  family: "👨‍👩‍👧", mother: "👩", father: "👨", mum: "👩", dad: "👨",
  parent: "👪", child: "🧒", baby: "👶", infant: "👶",
  toddler: "🧒", son: "👦", daughter: "👧", boy: "👦", girl: "👧",
  brother: "👦", sister: "👧", sibling: "🧒", twin: "👯",
  grandmother: "👵", grandfather: "👴", grandson: "👦",
  granddaughter: "👧", grandchild: "🧒", aunt: "👩", uncle: "👨",
  nephew: "👦", niece: "👧", cousin: "🧑", husband: "🤵",
  wife: "👰", man: "👨", woman: "👩", gentleman: "🤵",
  lady: "👩", person: "🧑", human: "🧑", people: "👥",
  friend: "🧑‍🤝‍🧑", neighbour: "🏘️", neighbor: "🏘️", couple: "💑",
  bride: "👰", groom: "🤵", widow: "🧕", orphan: "🧒",
  guest: "🧑", visitor: "🧑", participant: "🧑", citizen: "🧑",
  client: "🧑", customer: "🧑", teenager: "🧑", adult: "🧑",
  stranger: "🧑", team: "👥", crowd: "👥", group: "👥",
  population: "👥", society: "👥", public: "👥",
  "the public": "👥", audience: "👥", colleague: "🧑‍💼",
  staff: "👥", boss: "🧑‍💼",

  // ── Jobs ──────────────────────────────────────────────────────────────
  doctor: "👨‍⚕️", "doctor's practice": "🏥", dentist: "🦷",
  nurse: "👩‍⚕️", surgeon: "👨‍⚕️", midwife: "👩‍⚕️", vet: "🐕",
  pharmacist: "💊", teacher: "👩‍🏫", professor: "👨‍🏫", tutor: "👩‍🏫",
  judge: "👨‍⚖️", lawyer: "👨‍⚖️", "police officer": "👮",
  firefighter: "👨‍🚒", soldier: "🪖", pilot: "👨‍✈️",
  "flight attendant": "🧑‍✈️", captain: "⚓", sailor: "⚓",
  astronaut: "👨‍🚀", mechanic: "🔧", electrician: "💡",
  plumber: "🔧", carpenter: "🪚", bricklayer: "🧱", roofer: "🏠",
  painter: "🎨", engineer: "👷", architect: "📐", builder: "👷",
  baker: "🥖", cook: "👨‍🍳", chef: "👨‍🍳", waiter: "🧑‍🍳",
  butcher: "🥩", farmer: "👨‍🌾", fisherman: "🎣", gardener: "🌱",
  hairdresser: "💇", tailor: "🧵", watchmaker: "⌚",
  journalist: "📰", reporter: "📰", photographer: "📷",
  singer: "🎤", musician: "🎵", actor: "🎭", dancer: "💃",
  writer: "✍️", author: "✍️", poet: "📜", translator: "🌐",
  interpreter: "🗣️", librarian: "📚", cashier: "💰",
  scientist: "🔬", researcher: "🔬", inventor: "💡",
  postman: "📮", driver: "🚗", mayor: "🏛️", king: "👑",
  queen: "👸", prince: "🤴", princess: "👸", knight: "🛡️",
  police: "👮", thief: "🕵️", detective: "🕵️", guard: "🛡️",
  employer: "💼", employee: "🧑‍💼", apprentice: "🎓",
  applicant: "📄", job: "💼", profession: "💼", career: "💼",
  work: "💼", office: "🏢", "skilled worker": "🔧",

  // ── Nature and landscape ──────────────────────────────────────────────
  tree: "🌳", flower: "🌸", leaf: "🍃", branch: "🌿", twig: "🌿",
  trunk: "🪵", bark: "🪵", root: "🌱", wood: "🪵", log: "🪵",
  forest: "🌲", woods: "🌲", meadow: "🌾", grass: "🌱",
  lawn: "🌱", greenery: "🌿", oak: "🌳", beech: "🌳",
  birch: "🌳", fir: "🌲", spruce: "🌲", pine: "🌲",
  maple: "🍁", willow: "🌳", palm: "🌴", rose: "🌹",
  carnation: "🌸", daisy: "🌼", dandelion: "🌼", violet: "🌷",
  orchid: "🌺", tulip: "🌷", lily: "🌷", sunflower: "🌻",
  cactus: "🌵", fern: "🌿", moss: "🌿", ivy: "🌿",
  nettle: "🌿", thistle: "🌿", weed: "🌿", reed: "🌾",
  grain: "🌾", wheat: "🌾", rye: "🌾", oats: "🌾",
  barley: "🌾", hay: "🌾", seed: "🌱", bud: "🌷",
  blossom: "🌸", thorn: "🌹", stalk: "🌿", plant: "🪴",
  bouquet: "💐", mountain: "⛰️", hill: "⛰️", peak: "🏔️",
  valley: "🏞️", cliff: "⛰️", river: "🏞️", stream: "🏞️",
  brook: "🏞️", lake: "🏞️", pond: "🏞️", sea: "🌊",
  ocean: "🌊", wave: "🌊", tide: "🌊", beach: "🏖️",
  coast: "🏖️", shore: "🏖️", island: "🏝️", desert: "🏜️",
  jungle: "🌴", volcano: "🌋", waterfall: "🏞️",
  glacier: "🏔️", cave: "🕳️", hole: "🕳️", rock: "🪨",
  stone: "🪨", pebble: "🪨", sand: "🏖️", earth: "🌍",
  soil: "🌱", dust: "💨", sky: "☁️", cloud: "☁️",
  star: "⭐", planet: "🪐", moon: "🌙", sun: "☀️",
  rainbow: "🌈", shadow: "🌑", horizon: "🌅",
  sunrise: "🌅", sunset: "🌇", nature: "🌿",
  landscape: "🏞️", garden: "🌷", hedge: "🌿", field: "🌾",
  harvest: "🌾", countryside: "🏞️", air: "💨", fire: "🔥",
  flame: "🔥", ash: "🌑", smoke: "💨",

  // ── Weather, seasons, time ────────────────────────────────────────────
  rain: "🌧️", drizzle: "🌧️", snow: "❄️", snowflake: "❄️",
  snowman: "⛄", hail: "🌨️", storm: "⛈️",
  thunderstorm: "⛈️", thunder: "⛈️", lightning: "⚡",
  wind: "💨", breeze: "💨", fog: "🌫️", mist: "🌫️",
  frost: "🥶", dew: "💧", drop: "💧", puddle: "💧",
  heat: "🔥", weather: "🌦️", forecast: "🌦️", climate: "🌍",
  spring: "🌷", summer: "☀️", autumn: "🍂", fall: "🍂",
  winter: "❄️", season: "🗓️", temperature: "🌡️",
  thermometer: "🌡️", earthquake: "🌍", flood: "🌊",
  drought: "🏜️", time: "🕐", clock: "🕐", watch: "⌚",
  hour: "🕐", minute: "⏱️", "second of time": "⏱️",
  moment: "⏱️", day: "📅", night: "🌙", morning: "🌅",
  afternoon: "🌤️", evening: "🌆", midday: "🕛", noon: "🕛",
  midnight: "🕛", week: "📅", weekend: "📅", month: "🗓️",
  year: "📅", decade: "📅", date: "📅", calendar: "📅",
  birthday: "🎂", anniversary: "🎉", holiday: "🏖️",
  vacation: "🏖️", alarm: "⏰", "alarm clock": "⏰",
  timetable: "🗓️", schedule: "🗓️", deadline: "⏳",
  stopwatch: "⏱️", hourglass: "⏳", future: "🔮", // ── Home and household ────────────────────────────────────────────────
  house: "🏠", home: "🏠", flat: "🏢", apartment: "🏢",
  room: "🚪", kitchen: "🍳", bathroom: "🛁", bedroom: "🛏️",
  "living room": "🛋️", hall: "🚪", corridor: "🚪",
  garage: "🚗", cellar: "🪜", basement: "🪜", attic: "🪜",
  roof: "🏠", wall: "🧱", floor: "🪵", ceiling: "🏠",
  door: "🚪", gate: "🚪", window: "🪟", stairs: "🪜",
  step: "🪜", key: "🔑", lock: "🔒", doorbell: "🔔",
  bell: "🔔", fence: "🪵", chimney: "🏠", fireplace: "🔥",
  balcony: "🏡", terrace: "🏡", yard: "🏡", bed: "🛏️",
  pillow: "🛏️", blanket: "🛏️", duvet: "🛏️", sheet: "🛏️",
  mattress: "🛏️", cushion: "🛋️", sofa: "🛋️", couch: "🛋️",
  armchair: "🛋️", chair: "🪑", stool: "🪑", table: "🪑",
  desk: "🖥️", cupboard: "🗄️", wardrobe: "🚪", shelf: "📚",
  drawer: "🗄️", mirror: "🪞", lamp: "💡", light: "💡",
  "light bulb": "💡", candle: "🕯️", match: "🔥",
  lighter: "🔥", torch: "🔦", flashlight: "🔦",
  carpet: "🧶", rug: "🧶", curtain: "🪟", blind: "🪟",
  plug: "🔌", socket: "🔌", cable: "🔌", heater: "🔥",
  heating: "🔥", radiator: "🔥", tap: "🚿", shower: "🚿",
  bath: "🛁", sink: "🚿", drain: "🚿", broom: "🧹",
  bucket: "🪣", sponge: "🧽", soap: "🧼", towel: "🧻",
  toothbrush: "🪥", toothpaste: "🪥", shampoo: "🧴",
  razor: "🪒", comb: "💇", hairdryer: "💇", perfume: "🧴",
  makeup: "💄", lipstick: "💄", scissors: "✂️",
  needle: "🪡", thread: "🧵", button: "🔘", glue: "🧴",
  hammer: "🔨", nail: "🔨", screw: "🔩", screwdriver: "🪛",
  pliers: "🔧", spanner: "🔧", wrench: "🔧", saw: "🪚",
  drill: "🪛", axe: "🪓", ladder: "🪜", rope: "🪢",
  chain: "⛓️", hook: "🪝", paint: "🎨", brush: "🖌️",
  tile: "🧱", cement: "🧱", tool: "🔧", toolbox: "🧰",
  equipment: "🧰", machine: "⚙️", gear: "⚙️", bin: "🗑️",
  "rubbish bin": "🗑️", rubbish: "🗑️", waste: "🗑️",
  litter: "🗑️", vacuum: "🧹", iron: "🧺", laundry: "🧺",
  washing: "🧺", "washing machine": "🧺", fridge: "🧊",
  refrigerator: "🧊", freezer: "🧊", oven: "🔥",
  stove: "🍳", microwave: "🍽️", kettle: "🫖",
  toaster: "🍞", pan: "🍳", pot: "🍲", plate: "🍽️",
  bowl: "🥣", jug: "🫗", tray: "🍽️", knife: "🔪",
  fork: "🍴", spoon: "🥄", tablespoon: "🥄",
  teaspoon: "🥄", cutlery: "🍴", napkin: "🧻",
  tablecloth: "🍽️", grater: "🧀", corkscrew: "🍾",
  cork: "🍾", lid: "🍲", can: "🥫", tin: "🥫", jar: "🫙",
  box: "📦", crate: "📦", basket: "🧺", bag: "👜",
  sack: "🛍️", parcel: "📦", package: "📦",
  envelope: "✉️", stamp: "📮", letter: "✉️",
  postcard: "📮", newspaper: "📰", magazine: "📰",
  book: "📖", notebook: "📓", diary: "📓", pen: "🖊️",
  pencil: "✏️", eraser: "🧽", ruler: "📏",
  calculator: "🧮", paper: "📄", page: "📄",
  folder: "📁", stapler: "📎", "paper clip": "📎",
  chalk: "🖍️", bookmark: "🔖", note: "📝", list: "📝",
  sign: "🪧", label: "🏷️", "shopping list": "📝",

  // ── Clothes ───────────────────────────────────────────────────────────
  shirt: "👕", "t-shirt": "👕", blouse: "👚", jumper: "🧥",
  sweater: "🧥", pullover: "🧥", cardigan: "🧥",
  hoodie: "🧥", jacket: "🧥", coat: "🧥", suit: "🤵",
  tie: "👔", belt: "👖", trousers: "👖", jeans: "👖",
  shorts: "🩳", skirt: "👗", dress: "👗", gown: "👗",
  uniform: "👔", sock: "🧦", stocking: "🧦", tights: "🧦",
  underwear: "🩲", underpants: "🩲", bra: "👙",
  pyjamas: "🛏️", swimsuit: "👙", "swimming trunks": "🩳",
  bikini: "👙", shoe: "👟", trainer: "👟", boot: "🥾",
  sandal: "🩴", slipper: "🥿", hat: "🎩", cap: "🧢",
  beanie: "🧢", helmet: "⛑️", scarf: "🧣", glove: "🧤",
  mitten: "🧤", umbrella: "☂️", ring: "💍",
  necklace: "📿", bracelet: "📿", earring: "👂",
  jewellery: "💍", crown: "👑", glasses: "👓",
  sunglasses: "🕶️", handbag: "👜", backpack: "🎒",
  suitcase: "🧳", wallet: "👛", purse: "👛",
  clothes: "👕", clothing: "👕", outfit: "👗",
  costume: "🎭", wool: "🧶", cotton: "🧵", silk: "🧵",
  leather: "🧥", fabric: "🧵", cloth: "🧵", pocket: "👖",
  collar: "👔", sleeve: "👕", size: "📏", fashion: "👗",

  // ── Places and buildings ──────────────────────────────────────────────
  city: "🏙️", town: "🏘️", village: "🏘️", street: "🛣️",
  road: "🛣️", lane: "🛣️", alley: "🛣️", motorway: "🛣️",
  path: "🥾", square: "🏛️", church: "⛪", chapel: "⛪",
  cathedral: "⛪", temple: "🛕", mosque: "🕌", tower: "🗼",
  castle: "🏰", palace: "🏰", ruin: "🏚️", bridge: "🌉",
  tunnel: "🚇", monument: "🗿", statue: "🗿",
  fountain: "⛲", park: "🌳", playground: "🛝",
  cemetery: "🪦", grave: "🪦", school: "🏫",
  kindergarten: "🧸", nursery: "🧸", university: "🎓",
  college: "🎓", library: "📚", hospital: "🏥",
  clinic: "🏥", pharmacy: "💊", bank: "🏦",
  "post office": "📮", shop: "🏪", store: "🏪",
  supermarket: "🏪", market: "🏪", bakery: "🥖",
  restaurant: "🍽️", cafe: "☕", bar: "🍺", pub: "🍺",
  hotel: "🏨", hostel: "🛏️", museum: "🏛️",
  gallery: "🖼️", theatre: "🎭", theater: "🎭",
  cinema: "🎬", opera: "🎭", circus: "🎪",
  stadium: "🏟️", "swimming pool": "🏊", gym: "🏋️",
  prison: "🔒", factory: "🏭", warehouse: "📦",
  farm: "🚜", barn: "🚜", mill: "🌾", station: "🚉",
  "train station": "🚉", "bus stop": "🚌", airport: "✈️",
  harbour: "⚓", harbor: "⚓", port: "⚓",
  lighthouse: "🗼", "petrol station": "⛽",
  "car park": "🅿️", "traffic light": "🚦",
  crossroads: "🚦", junction: "🚦", pavement: "🚶",
  building: "🏢", skyscraper: "🏙️", toilet: "🚻",
  lift: "🛗", elevator: "🛗", escalator: "🛗",
  shed: "🏚️", greenhouse: "🌿", zoo: "🦁",
  aquarium: "🐠", "town hall": "🏛️", court: "⚖️",
  parliament: "🏛️", ministry: "🏛️", embassy: "🏛️",
  government: "🏛️", border: "🛂", country: "🗺️",
  region: "🗺️", capital: "🏙️", address: "📍",
  place: "📍", location: "📍",

  // ── Transport ─────────────────────────────────────────────────────────
  car: "🚗", bus: "🚌", coach: "🚌", tram: "🚊", train: "🚆",
  underground: "🚇", subway: "🚇", bicycle: "🚲", bike: "🚲",
  motorbike: "🏍️", motorcycle: "🏍️", scooter: "🛵",
  moped: "🛵", lorry: "🚚", truck: "🚚", van: "🚐",
  caravan: "🚐", trailer: "🚚", tractor: "🚜",
  excavator: "🚜", crane: "🏗️", ambulance: "🚑",
  "fire engine": "🚒", "police car": "🚓", taxi: "🚕",
  ferry: "⛴️", boat: "⛵", "sailing boat": "⛵",
  ship: "🚢", canoe: "🛶", raft: "🛶", helicopter: "🚁",
  aeroplane: "✈️", airplane: "✈️", plane: "✈️", jet: "✈️",
  rocket: "🚀", satellite: "🛰️", vehicle: "🚗",
  ticket: "🎫", journey: "🧳", trip: "🧳", travel: "🧳",
  tour: "🗺️", "guided tour": "🗺️", excursion: "🧳",
  luggage: "🧳", "steering wheel": "🛞", tyre: "🛞",
  tire: "🛞", wheel: "🛞", engine: "⚙️", motor: "⚙️",
  fuel: "⛽", petrol: "⛽", diesel: "⛽", brake: "🛞",
  seatbelt: "🔒", seat: "💺", map: "🗺️", compass: "🧭",
  route: "🗺️", traffic: "🚦", "traffic jam": "🚦",
  accident: "💥", distance: "📏", metre: "📏",
  kilometre: "📏", speed: "💨",

  // ── Sport, music, leisure ─────────────────────────────────────────────
  football: "⚽", soccer: "⚽", handball: "🤾",
  volleyball: "🏐", basketball: "🏀", tennis: "🎾",
  "table tennis": "🏓", badminton: "🏸", golf: "⛳",
  hockey: "🏒", boxing: "🥊", wrestling: "🤼",
  gymnastics: "🤸", athletics: "🏃", swimming: "🏊",
  diving: "🤿", surfing: "🏄", sailing: "⛵",
  rowing: "🚣", riding: "🏇", climbing: "🧗",
  hiking: "🥾", jogging: "🏃", running: "🏃",
  cycling: "🚴", skiing: "⛷️", snowboarding: "🏂",
  skating: "⛸️", fishing: "🎣", hunting: "🏹",
  camping: "🏕️", tent: "⛺", campfire: "🔥", goal: "🥅",
  goalkeeper: "🥅", medal: "🏅", trophy: "🏆",
  championship: "🏆", tournament: "🏆", race: "🏁",
  finish: "🏁", olympics: "🥇", sport: "⚽",
  training: "🏋️", game: "🎮", toy: "🧸", doll: "🪆",
  "teddy bear": "🧸", kite: "🪁", swing: "🛝", ball: "⚽",
  guitar: "🎸", piano: "🎹", violin: "🎻", trumpet: "🎺",
  drum: "🥁", saxophone: "🎷", choir: "🎵",
  orchestra: "🎻", band: "🎸", concert: "🎤",
  music: "🎵", song: "🎵", melody: "🎵", rhythm: "🥁",
  dance: "💃", party: "🎉", celebration: "🎉",
  festival: "🎪", present: "🎁", gift: "🎁",
  donation: "🎁", balloon: "🎈", firework: "🎆",
  christmas: "🎄", "christmas tree": "🎄", easter: "🐣",
  carnival: "🎭", camera: "📷", photo: "📷", film: "🎬",
  movie: "🎬", television: "📺", radio: "📻",
  news: "📰", poem: "📜", "fairy tale": "🧚",
  legend: "📜", story: "📖", applause: "👏",
  stage: "🎭", poster: "🖼️", picture: "🖼️",
  painting: "🎨", drawing: "✏️", art: "🎨",
  artist: "🎨", exhibition: "🖼️", culture: "🎭",
  "away game": "⚽", "home game": "⚽", "dance floor": "💃",
  "main course": "🍽️", "blood group": "🩸", "flower bed": "🌷",
  // ...a celebration
  "political party": "🗳️", "interested party": "🧑",
  // ...a film
  "managing director": "🧑‍💼",
  // ...a playing card
  "debit card": "💳", "prepaid card": "💳",
  "health insurance card": "💳", "identity card": "🪪", "donor card": "🪪",
  "library card": "📚", "key card": "🔑", "greetings card": "💌",
  "condolence card": "💌", "polling card": "🗳️", "red card": "🟥",
  "charging card": "🔌", "memory card": "💾",
  // ...somewhere to sleep
  "raised bed": "🌱", "cheat sheet": "📝", "dust sheet": "🎨",
  "character sheet": "📋", "balance sheet": "📊",
  // ...a road vehicle
  "number plate": "🚗", "licence plate": "🚗", "license plate": "🚗",
  "temporary plate": "🚗", "dining car": "🍽️", "couchette car": "🚆",
  "sleeper car": "🚆", "cycle path": "🚲", "career path": "💼",
  "brake cable": "🚲",
  // ...a bank, a tin, a tray
  "bottle bank": "♻️", "food bank": "🥫", "watering can": "💧",
  "jerry can": "⛽", "litter tray": "🐈", "waste glass": "♻️",
  "yellow bag": "♻️", "own capital": "💶", "borrowed capital": "💶",
  // ...a building or a room
  "city hall": "🏛️", "market hall": "🏪", "school hall": "🏫",
  "concert hall": "🎼", "ground floor": "🏢", "upper floor": "🏢",
  // ...something else entirely
  "bed border": "🌷", "red flag": "🚩", "star sign": "⭐",
  "bad luck": "😖", "clover leaf": "🍀", "starry sky": "🌌",
  "coffee bean": "☕", "small pot": "☕", "litre mug": "🍺",
  "baked goods": "🥐", "toilet paper": "🧻",
  "contact-lens solution": "🧴", "native speaker": "🗣️",
  "arbitration body": "⚖️", "contribution ceiling": "🧾",
  "noise log": "📝", "capital letter": "🔤", "basic step": "💃",
  "final ball": "💃", "shooting gallery": "🎯", "bald head": "👨‍🦲",
  "window box": "🪴", "user account": "👤", "nursery place": "🧸",
  "rain shower": "🌧️",
  // ...a park, a bag, a sheet of paper
  "multi-storey car park": "🅿️", "charging park": "🔌",
  "bin bag": "🗑️", "bin liner": "🗑️", "baking paper": "🍪",
  "wrapping paper": "🎁", "gym hall": "🏋️",
  "sim card": "📱", "pay-as-you-go card": "📱", "scratch card": "🎟️",
  "firework rocket": "🎆", "cling film": "🥡", "temple arm": "👓",
  puzzle: "🧩", card: "🃏", dice: "🎲", chess: "♟️",
  hobby: "🎨", fun: "🎉", joy: "😊",

  // ── Money, shopping, work ─────────────────────────────────────────────
  money: "💶", cash: "💶", coin: "🪙", banknote: "💶",
  bill: "🧾", receipt: "🧾", price: "🏷️",
  "price tag": "🏷️", discount: "🏷️", sale: "🏷️",
  "special offer": "🏷️", voucher: "🎟️", invoice: "🧾",
  account: "🏦", "bank account": "🏦",
  "credit card": "💳", salary: "💶", wage: "💶",
  pension: "💶", tax: "🧾", loan: "🏦", debt: "💸",
  budget: "📊", currency: "💱", "exchange rate": "💱",
  shopping: "🛒", trolley: "🛒", order: "📋",
  delivery: "📦", goods: "📦", brand: "🏷️",
  contract: "📄", meeting: "📅", appointment: "📅",
  computer: "💻", laptop: "💻", keyboard: "⌨️",
  screen: "🖥️", monitor: "🖥️", printer: "🖨️",
  phone: "📱", "mobile phone": "📱", telephone: "☎️",
  email: "📧", internet: "🌐", website: "🌐",
  "web page": "🌐", network: "🌐",
  "computer network": "🌐", password: "🔑", file: "📄",
  document: "📄", data: "💾", battery: "🔋",
  charger: "🔌", headphones: "🎧", speaker: "🔊",
  microphone: "🎤", robot: "🤖", technology: "⚙️",
  "data protection": "🔒", security: "🔒",
  protection: "🛡️", insurance: "🛡️",
  statistics: "📊", chart: "📊", graph: "📈",

  // ── Health ────────────────────────────────────────────────────────────
  medicine: "💊", tablet: "💊", pill: "💊",
  injection: "💉", vaccination: "💉", plaster: "🩹",
  bandage: "🩹", wound: "🩹", scar: "🩹", fever: "🤒",
  cold: "🤧", cough: "😷", sneeze: "🤧", headache: "🤕",
  "stomach ache": "🤢", "sore throat": "😷",
  toothache: "🦷", pain: "🤕", illness: "🤒",
  disease: "🦠", virus: "🦠", bacteria: "🦠",
  infection: "🦠", allergy: "🤧", wheelchair: "♿",
  crutch: "🩼", "first aid": "🚑", operation: "🏥",
  therapy: "🩺", "medical treatment": "🩺",
  "medical condition": "🤒", "blood pressure": "🩺",
  pulse: "💓", health: "💚", sleep: "😴", dream: "💭",
  rest: "😴", death: "💀", disability: "♿", stress: "😰",

  // ── School and learning ───────────────────────────────────────────────
  lesson: "📚", course: "📚", class: "📚", classes: "📚",
  seminar: "📚", homework: "📚", exam: "📝", test: "📝",
  examination: "📝", question: "❓", answer: "💬",
  mistake: "❌", error: "❌", grade: "📊",
  education: "🎓", "university studies": "🎓",
  "vocational training": "🎓", apprenticeship: "🎓",
  internship: "💼", degree: "🎓", certificate: "📜",
  diploma: "🎓", knowledge: "🧠", memory: "🧠",
  research: "🔬", science: "🔬", experiment: "🔬",
  mathematics: "🔢", biology: "🧬", chemistry: "🧪",
  physics: "⚛️", history: "📜", geography: "🗺️",
  language: "🗣️", "letter of the alphabet": "🔤", alphabet: "🔤", number: "🔢", "job application": "📄",

  // ── Abstractions with a genuinely specific symbol ─────────────────────
  idea: "💡", solution: "💡", warning: "⚠️", danger: "⚠️",
  risk: "⚠️", love: "❤️", luck: "🍀",
  peace: "☮️", war: "⚔️", weapon: "⚔️", sword: "⚔️",
  gun: "🔫", bomb: "💣", law: "⚖️", justice: "⚖️",
  freedom: "🕊️", secret: "🤫", thought: "💭",
  weight: "⚖️", energy: "⚡", electricity: "⚡",
  noise: "🔊", silence: "🤫", smell: "👃",
  touch: "✋", end: "⏹️",
  victory: "🏆", success: "🎉", prize: "🏆",
  winner: "🏆", fear: "😨", anger: "😠",
  surprise: "😲", laughter: "😄", smile: "🙂",
  environment: "🌍", world: "🌍", "fire brigade": "🚒",
  army: "🪖", flag: "🏳️",

  // ── Countries and nationalities ───────────────────────────────────────
  germany: "🇩🇪", german: "🇩🇪", "german person": "🇩🇪",
  austria: "🇦🇹", austrian: "🇦🇹", switzerland: "🇨🇭",
  swiss: "🇨🇭", france: "🇫🇷", french: "🇫🇷", italy: "🇮🇹",
  italian: "🇮🇹", spain: "🇪🇸", spanish: "🇪🇸",
  england: "🇬🇧", english: "🇬🇧", britain: "🇬🇧",
  british: "🇬🇧", america: "🇺🇸", american: "🇺🇸",
  poland: "🇵🇱", polish: "🇵🇱", netherlands: "🇳🇱",
  dutch: "🇳🇱", turkish: "🇹🇷",
  russia: "🇷🇺", russian: "🇷🇺", china: "🇨🇳",
  chinese: "🇨🇳", japan: "🇯🇵", japanese: "🇯🇵",
  norway: "🇳🇴", sweden: "🇸🇪", denmark: "🇩🇰", finland: "🇫🇮",
  iceland: "🇮🇸", ireland: "🇮🇪", scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  belgium: "🇧🇪", portugal: "🇵🇹", greece: "🇬🇷", greek: "🇬🇷",
  czechia: "🇨🇿", hungary: "🇭🇺", romania: "🇷🇴", bulgaria: "🇧🇬",
  croatia: "🇭🇷", serbia: "🇷🇸", ukraine: "🇺🇦", canada: "🇨🇦",
  mexico: "🇲🇽", brazil: "🇧🇷", argentina: "🇦🇷", chile: "🇨🇱",
  australia: "🇦🇺", "new zealand": "🇳🇿", egypt: "🇪🇬",
  morocco: "🇲🇦", nigeria: "🇳🇬", kenya: "🇰🇪", "south africa": "🇿🇦",
  india: "🇮🇳", korea: "🇰🇷", vietnam: "🇻🇳", thailand: "🇹🇭",
  indonesia: "🇮🇩", israel: "🇮🇱",
  "turkey bird": "🦃", "turkey country": "🇹🇷",

  // ── Kitchen and household, the second drawer down ─────────────────────
  saucer: "🍽️", colander: "🥢", sieve: "🥢", "rolling pin": "🥖",
  "tin opener": "🥫", "can opener": "🥫", "bottle opener": "🍾",
  ladle: "🥄", spatula: "🍳", "baking tray": "🍪",
  "aluminium foil": "🥡", dustpan: "🧹", "ironing board": "🧺",
  "washing line": "🧺", "clothes hanger": "🧥", "coat hanger": "🧥",
  washcloth: "🧽", flannel: "🧽", tissue: "🤧", handkerchief: "🤧",
  "door handle": "🚪", keyhole: "🔑", "smoke detector": "🚨",
  matchstick: "🔥", "extension cord": "🔌", "extension lead": "🔌",
  wire: "🔌", lawnmower: "🌱", rake: "🌿", spade: "⛏️",
  wheelbarrow: "🛒", "compost heap": "🌱", "pencil sharpener": "✏️",
  rubber: "🧽", "hole punch": "📎", highlighter: "🖍️",
  notepad: "📝", "ring binder": "📁", "file folder": "📁",
  photocopier: "🖨️", classroom: "🏫", screensaver: "🖥️",

  // ── Spices and store cupboard ─────────────────────────────────────────
  coriander: "🌿", cilantro: "🌿", caraway: "🌿", nutmeg: "🌿",
  dill: "🌿", oregano: "🌿", sage: "🌿", paprika: "🌿",
  yeast: "🍞", rusk: "🍞", margarine: "🧈", litre: "🥛",
  millilitre: "🥛", gram: "⚖️", kilogram: "⚖️",
  millimetre: "📏", centimetre: "📏",

  // ── Landscape, materials, shapes ──────────────────────────────────────
  "mountain range": "⛰️", swamp: "🏞️", marsh: "🏞️", bog: "🏞️",
  moor: "🏞️", mud: "🟫", "north pole": "🧊", mainland: "🗺️",
  darkness: "🌑", steel: "⛓️", copper: "🟠", silver: "🥈",
  bronze: "🥉", gold: "🥇", metal: "⛓️", cardboard: "📦",
  brick: "🧱", concrete: "🧱", porcelain: "🍽️", ceramics: "🏺",
  pottery: "🏺", granite: "🪨", gravel: "🪨", asphalt: "🛣️",
  tar: "⬛", plastic: "♻️", linen: "🧵", velvet: "🧵",
  triangle: "🔺", rectangle: "🔲", circle: "⭕", sphere: "⚪",
  cube: "🧊",

  // ── People, jobs, places ──────────────────────────────────────────────
  psychologist: "🧠", forester: "🌲", ranger: "🌲", sculptor: "🗿",
  accountant: "📊", bookkeeper: "📊", conductor: "🎼",
  director: "🎬", "film director": "🎬", widower: "🧑",
  godmother: "👩", godfather: "👨", "mother-in-law": "👩",
  "father-in-law": "👨", "daughter-in-law": "👧",
  "son-in-law": "👦", "brother-in-law": "👦",
  "sister-in-law": "👧", "great-grandmother": "👵",
  "great-grandfather": "👴", stepfather: "👨", stepmother: "👩",
  "half-brother": "👦", "half-sister": "👧", fiance: "💍",
  fiancee: "💍", sandpit: "🏖️", sandbox: "🏖️",
  "pedestrian zone": "🚶", "zebra crossing": "🚸",
  "high-rise": "🏙️", "tower block": "🏙️",
  "shopping centre": "🏬", mall: "🏬", bookshop: "📚",
  bookstore: "📚", launderette: "🧺", laundromat: "🧺",
  "dry cleaner's": "🧺", barracks: "🪖",
  "indoor swimming pool": "🏊",

  // ── Getting about ─────────────────────────────────────────────────────
  handlebars: "🚲", headlight: "💡", "fuel tank": "⛽",
  arrival: "🛬", departure: "🛫",

  // ── Health ────────────────────────────────────────────────────────────
  diarrhoea: "🤢", constipation: "🤢", vomiting: "🤮",
  vaccine: "💉", "x-ray image": "🏥",

  // ── Feelings — here the face is the meaning ───────────────────────────
  grief: "😢", mourning: "😢", wrath: "😡", hatred: "😡",
  hate: "😡", panic: "😱", pity: "🥺", sympathy: "🥺",
  boredom: "🥱", enthusiasm: "🤩", excitement: "🤩",
  contentment: "😌", loneliness: "😔", distrust: "🤨",
  cowardice: "😨", impatience: "😤", frustration: "😤",
  annoyance: "😤", relief: "😌", shame: "😳", pride: "😌",
  courage: "💪", hope: "🤞", curiosity: "👀",

  // ── Odds and ends with an exact symbol ────────────────────────────────
  loudspeaker: "🔊", "news broadcast": "📺", "small change": "🪙",
  savings: "🐖", watermark: "💧", lighting: "💡",
  illumination: "💡", brightness: "☀️", keycap: "⌨️",
  keystroke: "⌨️", accessories: "🎒", electronics: "🔌",
  acoustics: "🔊", millennium: "📅", eternity: "⏳",
  "the military": "🪖",
  europe: "🇪🇺", european: "🇪🇺",
};

/** Actions. Keyed without the leading "to". */
const VERBS: Record<string, string> = {
  // Moving
  go: "🚶", walk: "🚶", run: "🏃", jog: "🏃", swim: "🏊",
  dive: "🤿", fly: "✈️", drive: "🚗", ride: "🚴",
  cycle: "🚴", sail: "⛵", row: "🚣", climb: "🧗",
  jump: "🦘", crawl: "🐛", dance: "💃", stand: "🧍",
  "be standing": "🧍", sit: "🪑", "sit down": "🪑",
  "be sitting": "🪑", "be lying": "🛏️", "let go": "🤲",
  kneel: "🧎", "tell a lie": "🤥",
  rise: "📈", land: "🛬", "take off": "🛫",
  travel: "🧳", arrive: "🛬", leave: "🛫", enter: "🚪",
  "go out": "🚪", follow: "👣", escape: "🏃",
  hurry: "💨",

  // Hands
  grab: "✊", hold: "✋", carry: "📦",
  lift: "🏋️", push: "👐", pull: "🤛", press: "👇",
  throw: "🤾", catch: "🧤", touch: "✋", point: "👆",
  wave: "👋", greet: "👋", "say goodbye": "👋",
  knock: "✊", clap: "👏", cut: "✂️", tear: "📄",
  fold: "📄", tie: "🪢", knit: "🧶", sew: "🪡",
  dig: "⛏️", plant: "🌱", water: "💧", build: "🏗️",
  repair: "🔧", fix: "🔧", hammer: "🔨", drill: "🪛",
  saw: "🪚", paint: "🎨", draw: "✏️", write: "✍️",
  sign: "✍️", type: "⌨️", click: "🖱️", weigh: "⚖️",
  measure: "📏", // The senses and the head
  see: "👁️", look: "👀", "look at": "👀", watch: "👀",
  observe: "👀", notice: "👀", hear: "👂", listen: "👂",
  smell: "👃", taste: "👅", feel: "🫀", sleep: "😴",
  wake: "⏰", "wake up": "⏰", dream: "💭",
  think: "🤔", remember: "🧠", forget: "💨",
  learn: "📚", study: "📚", teach: "👩‍🏫", read: "📖",
  know: "🧠", understand: "💡", search: "🔍",
  "look for": "🔍", find: "🔍", discover: "🔍",
  choose: "☑️", decide: "☑️", compare: "⚖️",
  check: "✅", hope: "🤞", believe: "🙏", wish: "🌟",
  love: "❤️", like: "👍", hate: "👎", laugh: "😄",
  smile: "🙂", cry: "😢", worry: "😟", fear: "😨",
  enjoy: "😊", celebrate: "🎉", relax: "😌",
  suffer: "😣", die: "💀", "give birth to": "👶",
  live: "🏠", grow: "🌱",

  // Voice
  speak: "🗣️", talk: "🗣️", say: "🗣️", tell: "🗣️",
  shout: "📢", whisper: "🤫", sing: "🎤", call: "📞",
  ask: "❓", answer: "💬", "respond to": "💬",
  translate: "🌐", announce: "📢", advertise: "📢",
  warn: "⚠️", promise: "🤝", agree: "🤝",
  thank: "🙏", apologise: "🙏", invite: "✉️",

  // Home and food
  eat: "🍽️", drink: "🥤", cook: "🍳", bake: "🧁",
  fry: "🍳", boil: "🍲", serve: "🍽️", wash: "🧼",
  clean: "🧽", tidy: "🧹", "clear up": "🧹",
  iron: "🧺", dry: "🧺", brush: "🪥",
  "get dressed": "👕", shower: "🚿", bathe: "🛁",
  shave: "🪒", "go to bed": "🛏️", open: "🔓",
  close: "🔒", lock: "🔒", fill: "🫗", pour: "🫗",
  empty: "🪣", "switch on": "💡", "switch off": "🌑",
  burn: "🔥", freeze: "🧊", melt: "💧", cool: "🧊",
  heat: "🔥", light: "🕯️", "hang up": "🪝",

  // Money and getting things
  buy: "🛒", sell: "🏷️", pay: "💳", cost: "🏷️",
  earn: "💶", save: "🐖", spend: "💸", borrow: "🏦",
  lend: "🏦", owe: "💸", give: "🎁",
  "give away": "🎁", receive: "📥", send: "📤",
  "pass on": "📤", deliver: "📦", pack: "📦",
  load: "📦", collect: "🧺", gather: "🧺",
  fetch: "🤲", bring: "📦", order: "📋", book: "📅",
  rent: "🔑", own: "🔑", steal: "🕵️", lose: "❌",
  win: "🏆",

  // Numbers going up and down — the direction is the meaning
  increase: "📈", "gain weight": "📈", raise: "📈",
  double: "📈", decrease: "📉", reduce: "📉",
  lower: "📉", shrink: "📉",

  // Others where the symbol is exact
  download: "⬇️", upload: "⬆️", install: "💽",
  delete: "🗑️", "throw away": "🗑️", print: "🖨️",
  copy: "📋", photograph: "📷", record: "🎙️",
  play: "🎮", fight: "🥊", shoot: "🔫",
  protect: "🛡️", "look after": "🤲", help: "🤝",
  meet: "🤝", cooperate: "🤝", vote: "🗳️",
  forbid: "🚫", prevent: "🚫", avoid: "🚫",
  stop: "⏹️", wait: "⏳", finish: "🏁", hurt: "🤕",
  heal: "🩹", train: "🏋️", practise: "🎯",
  aim: "🎯", mix: "🥣",
  divide: "➗", add: "➕", subtract: "➖",
  fish: "🎣", hunt: "🏹", rain: "🌧️", snow: "❄️",
  shine: "☀️", blow: "💨", flow: "🌊",
  float: "🎈", ring: "🔔", explode: "💥",

  // At the stove
  grill: "🔥", barbecue: "🔥", "steam-cook": "🍲",
  "chop finely": "🔪", chop: "🔪", grate: "🧀", salt: "🧂",
  "add salt": "🧂", defrost: "🧊", thaw: "💧", "heat up": "🔥",
  "cool down": "🧊", marinate: "🥣", garnish: "🌿",
  "pour over": "🫗", "mix together": "🥣", "spread onto": "🧈",
  "sprinkle with": "🧂", knead: "🥖", stir: "🥄",

  // The shape of a day
  "get up": "⏰", "get changed": "👕", "have a bath": "🛁",
  "have breakfast": "🥐", vacuum: "🧹", hoover: "🧹",
  sweep: "🧹", milk: "🥛", "fill up with fuel": "⛽",
  park: "🅿️", "get out": "🚪", "get off": "🚪",
  "hurry up": "💨", "go for a walk": "🚶",

  // Weather does things too
  hail: "🌨️", thunder: "⛈️", "flash with lightning": "⚡",
  "be stormy": "⛈️", drizzle: "🌧️", evaporate: "💨",
  "cloud over": "☁️",

  // What the body does
  "pump iron": "🏋️", hop: "🦘", bounce: "🦘", sneak: "🤫", scream: "📢",
  yawn: "🥱", cough: "😷", sneeze: "🤧", tremble: "🥶",
  shiver: "🥶", hug: "🤗", embrace: "🤗", kiss: "😘",
  bite: "🦷", chew: "😋", swallow: "😮", stink: "🤢",
  splash: "💦", stare: "👀", blink: "👁️",
  "stay silent": "🤫", screw: "🪛",

  // Among other people
  comfort: "🤗", console: "🤗", encourage: "💪", contact: "📞",
  adopt: "👶", attack: "🥊", ignore: "🙈", bet: "🎲",
  compete: "🏁", dominate: "🏆", "pay out": "💶",
  "rent out": "🔑", "stand for election": "🗳️",
  sentence: "⚖️", convict: "⚖️", criticize: "👎",
  criticise: "👎", prefer: "👍", doubt: "🤔", risk: "⚠️",
  "look forward to": "😊", vow: "🤝",

  // On a screen
  post: "📮", "post online": "📱", debug: "🐛", launch: "🚀",
  "make progress": "📈",
  boost: "📈",
  destroy: "💥", break: "💥", crash: "💥",
};

/** Descriptions. Only where a picture pins the meaning down. */
const ADJECTIVES: Record<string, string> = {
  // Colours
  red: "🟥", blue: "🟦", green: "🟩", yellow: "🟨",
  orange: "🟧", purple: "🟪", brown: "🟫", black: "⬛",
  white: "⬜", pink: "🌸", golden: "🥇", silver: "🥈",
  colourful: "🌈", colorful: "🌈",

  // Nationality
  german: "🇩🇪", austrian: "🇦🇹", swiss: "🇨🇭",
  french: "🇫🇷", italian: "🇮🇹", spanish: "🇪🇸",
  english: "🇬🇧", british: "🇬🇧", american: "🇺🇸",
  polish: "🇵🇱", dutch: "🇳🇱", turkish: "🇹🇷",
  russian: "🇷🇺", chinese: "🇨🇳", japanese: "🇯🇵",
  european: "🇪🇺",

  // Physical state you can show
  hot: "🔥", cold: "🥶", warm: "☀️", cool: "🧊",
  frozen: "🧊", wet: "💧", dry: "🏜️", dirty: "🧽",
  clean: "✨", new: "✨", old: "👴", young: "🧒",
  fast: "💨", quick: "💨", slow: "🐌", loud: "🔊",
  quiet: "🤫", silent: "🤫", bright: "☀️",
  dark: "🌑", heavy: "🏋️", light: "🪶", long: "📏",
  short: "📏", round: "⚪", "round in shape": "⚪",
  sharp: "🔪", soft: "🧸", hard: "🪨", full: "🫗",
  empty: "🪣", broken: "💥", open: "🔓",
  closed: "🔒",

  // How someone is
  happy: "😀", glad: "😀", sad: "😢", angry: "😠",
  annoyed: "😤", annoying: "😤", tired: "😴",
  exhausted: "😩", hungry: "🍽️", thirsty: "🥤",
  ill: "🤒", sick: "🤒", healthy: "💚",
  injured: "🤕", pregnant: "🤰", drunk: "🍺",
  tipsy: "🍺", hammered: "🍺", sober: "🚱",
  strong: "💪", weak: "🫠", surprised: "😲",
  shocked: "😱", afraid: "😨", scared: "😨",
  nervous: "😰", proud: "😌", satisfied: "😌",
  relaxed: "😌", disappointed: "😞", jealous: "😒",
  embarrassed: "😳", embarrassing: "😳",
  confused: "😵", lazy: "🦥", clever: "🧠",
  intelligent: "🧠", friendly: "🙂", kind: "🙂",
  cute: "🥰", "in love": "❤️", lonely: "😔",
  bored: "🥱", boring: "🥱", excited: "🤩",
  awesome: "🤩", funny: "😄", famous: "⭐",
  excellent: "⭐", perfect: "💯", tasty: "😋",
  delicious: "😋", beautiful: "✨", pretty: "🌸",
  gorgeous: "✨", ugly: "🫣", rich: "💰",
  poor: "🪙", expensive: "💸", cheap: "🏷️",
  "free of charge": "🆓", "cost-free": "🆓",
  free: "🆓", dangerous: "⚠️", safe: "🔒",
  secret: "🤫", lucky: "🍀", male: "♂️",
  female: "♀️", half: "🌗", first: "🥇",
  second: "🥈", third: "🥉", last: "🏁",
  best: "🏆", correct: "✅", right: "✅",

  // Weather you can look out at
  sunny: "☀️", rainy: "🌧️", windy: "💨", foggy: "🌫️",
  misty: "🌫️", cloudy: "☁️", overcast: "☁️", summery: "☀️",
  wintry: "❄️", autumnal: "🍂",

  // At the table
  salty: "🧂", sweet: "🍬", sour: "🍋", bitter: "☕",
  spicy: "🌶️", crisp: "🥨", crunchy: "🥨", boiled: "🍲",
  fried: "🍳", greasy: "🧈", fatty: "🧈", "low-fat": "🥗",
  disgusting: "🤢", disgusted: "🤢",

  // How a thing looks
  thin: "📏", slim: "📏", striped: "🦓", "polka-dotted": "⚪", pale: "🤍", rusty: "🟫",
  wireless: "📶", wired: "🔌", magnetic: "🧲",
  mechanical: "⚙️", vertical: "↕️", horizontal: "↔️",
  square: "🔲", round_shape: "⭕",

  // How someone is, part two
  awake: "👀", asleep: "😴", dead: "💀", alive: "💚",
  naked: "🧍", sprained: "🤕", engaged: "💍", married: "💍",
  divorced: "💔", widowed: "🖤",
  "single-parent": "👩‍👧", shy: "😳", cheeky: "😜",
  polite: "🙇", dishonest: "🤥", conceited: "😏",
  greedy: "🤑", selfish: "🤳", stubborn: "🐐",
  thoughtful: "🤔", "patient with people": "😌", untidy: "🧹", unpunctual: "⏰",
  unreliable: "❌", "hard-working": "💪", diligent: "💪",
  humorous: "😄", charming: "😊", lively: "🤸",
  crazy: "🤪", mad: "🤪", stupid: "🤪", naive: "😇",
  alone: "🧍", overcrowded: "👥",
  unemployed: "💼", breathtaking: "😮", ridiculous: "😂",
  powerful: "💪", wealthy: "💰", irate: "😡",
  outraged: "😡", dissatisfied: "😒",

  // Nationality, part two
  greek: "🇬🇷", swedish: "🇸🇪", norwegian: "🇳🇴",
  danish: "🇩🇰", finnish: "🇫🇮", portuguese: "🇵🇹",
  irish: "🇮🇪", scottish: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", belgian: "🇧🇪",
  hungarian: "🇭🇺", czech: "🇨🇿", croatian: "🇭🇷",
  ukrainian: "🇺🇦", canadian: "🇨🇦", australian: "🇦🇺",
  brazilian: "🇧🇷", indian: "🇮🇳", korean: "🇰🇷",
  wrong: "❌", forbidden: "🚫",
};

/**
 * Words that stop a compound's last word from being its head: "cup of tea"
 * is a drink, not a plant.
 */
const JOINERS = new Set([
  "of", "in", "into", "with", "for", "to", "on", "at", "by", "from",
  "about", "against", "over", "under", "without", "and", "as",
]);

/**
 * Every form of a gloss worth looking up, most specific first.
 *
 * The parenthetical is the disambiguator on cards like "letter (of the
 * alphabet)" and "second (of time)", so it is tried before it is thrown
 * away — otherwise those two land on the envelope and the stopwatch of
 * their unrelated homographs.
 */
function candidates(english: string | undefined): string[] {
  const raw = String(english ?? "").toLowerCase();

  /** The card leads with its main sense; the rest are alternatives. */
  const firstSense = (value: string) =>
    value.split("/")[0].split(",")[0].split(" or ")[0];
  const tidy = (value: string) =>
    value
      .replace(/[^a-z\s'-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^(to|the|a|an)\s+/, "");

  const forms: string[] = [];
  const push = (value: string) => {
    if (value && !forms.includes(value)) forms.push(value);
  };
  // The parenthetical goes before the sense split, not after: "to catch (a
  // ball or animal)" must not be cut at its " or " into "catch (a ball".
  push(tidy(firstSense(raw.replace(/[()]/g, " "))));
  const plainForm = tidy(firstSense(raw.replace(/\([^)]*\)/g, " ")));
  push(plainForm);
  const plain = [plainForm].filter(Boolean);

  // "shoes" → shoe, "berries" → berry, "boxes" → box: glosses are sometimes
  // plural where the map is singular.
  const singular = (form: string) => {
    if (form.endsWith("ies")) return `${form.slice(0, -3)}y`;
    if (/(?:ses|ches|shes|xes)$/.test(form)) return form.slice(0, -2);
    if (form.endsWith("s") && !form.endsWith("ss")) return form.slice(0, -1);
    return "";
  };
  for (const form of [...forms]) {
    const one = singular(form);
    if (one) {
      push(one);
      if (form === plainForm) plain.push(one);
    }
  }

  // "brown bear" should still find the bear when only "polar bear" is named.
  // Only the plain gloss gets this: a parenthetical is there to narrow the
  // sense, so reading its last word as the word itself inverts its purpose —
  // "second vote (party)" is a ballot, not a celebration.
  for (const form of plain) {
    const words = form.split(" ");
    if (words.length < 2 || words.some((word) => JOINERS.has(word))) continue;
    push(words[words.length - 1]);
  }

  return forms;
}

/**
 * The picture for a word card, or null when none is honest.
 *
 * Matched on the primary English sense, because that is the meaning the card
 * actually teaches: "die Birne" glossed "pear" gets the pear, not the light
 * bulb its second sense would suggest. The part of speech picks the map, so
 * "die Fliege" gets the insect and "fliegen" gets the aeroplane. Nothing is
 * guessed beyond that, since a wrong picture teaches the wrong word.
 */
export function wordPicture(
  english: string | undefined,
  partOfSpeech?: string | undefined
): string | null {
  const pos = String(partOfSpeech ?? "").toLowerCase();
  const gloss = String(english ?? "").toLowerCase();

  // Function words consult no map at all. There is no picture of "already",
  // "rather" or "towards", and searching anyway finds the wrong one: "live
  // (broadcast)" is an adverb and was landing on the house of "to live".
  if (/\b(adverb|preposition|conjunction|connector|pronoun|numeral|interjection|article)\b/.test(pos)) {
    return null;
  }

  // "adverb" contains "verb", so this has to look at whole words. Cards
  // authored without a part of speech fall back to the shape of the gloss.
  const isVerb = /(^|\s)verb/.test(pos) || /^\s*to\s+\w/.test(gloss);
  const isAdjective = pos.includes("adject");

  // Each part of speech reads its own map and stops there. Letting adjectives
  // fall through to the nouns looked generous and was not: it gave "konkret" a
  // brick, "vorliegend" a wrapped gift, "einheitlich" a necktie and "flach" a
  // block of flats, because the noun sharing the English word is a different
  // word. Colours and nationalities are listed in both maps for this reason.
  const map = isVerb ? VERBS : isAdjective ? ADJECTIVES : NOUNS;

  for (const form of candidates(english)) {
    const found = map[form];
    if (found) return found;
  }
  return null;
}

/** Exposed for the coverage gate. */
export const WORD_PICTURE_COUNT =
  Object.keys(NOUNS).length +
  Object.keys(VERBS).length +
  Object.keys(ADJECTIVES).length;
