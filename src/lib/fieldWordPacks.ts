import type { Blueprint, VocabSeed } from "./types";

/**
 * Words chosen by asking the course what it does NOT teach.
 *
 * THE METHOD. Every earlier pack started from a source — a frequency bank, an
 * immersion export, a spreadsheet — and kept whatever of it was new. Those
 * sources are spent: the 2,502 commonest words are taught to the last one, and
 * the eight-thousand-row sheet had 502 words left in it, which parts 585-604
 * took. So this one starts from the other end. Thirty everyday fields were
 * probed with twenty ordinary words each against the BUILT catalogue, and the
 * fields that answered worst decide what gets written. Naturwissenschaft came
 * back at 35 per cent, the worst of the thirty: der Magnet, die Säure, das
 * Molekül and der Widerstand were all missing while the kitchen and the
 * bathroom were complete.
 *
 * WHY THAT FIELD IS WORTH TEACHING. It is not school physics for its own sake.
 * These are the words a doctor uses for a test result, a landlord for damp, a
 * news report for a heatwave, and every appliance manual ever printed.
 *
 * Checked against the built catalogue rather than the pack files, so a word
 * already taught under another spelling did not count as new — and against the
 * umlaut fold the progress id uses, which is why rosten and die Spule are not
 * here: they collide with rösten and die Spüle and could never become cards.
 *
 * Append-only after release, like every word pack: progress is global by lemma
 * and pack order is curriculum order.
 */
const focus = "The words behind everyday explanations: what things are made of, what makes them move, and how any of it is measured.";

const pack = (label: string, level: string, theme: string, description: string, seeds: VocabSeed[]): Blueprint => ({
  label,
  level,
  theme,
  description,
  focus,
  seeds,
  dialogues: [],
  phrases: [],
});

export const fieldWordPartBlueprints: Record<string, Blueprint> = {
  part605: pack("Part 605", "B1", "What makes things move", "Force, friction and the simple machines a manual assumes you know.", [
    { de: "die Reibung", lookup: "Reibung", fallbackEn: "friction", tip: "noun", article: "die" },
    { de: "die Dichte", lookup: "Dichte", fallbackEn: "density", tip: "noun", article: "die" },
    { de: "der Hebel", lookup: "Hebel", fallbackEn: "lever", tip: "noun", article: "der", use: "the bar you push, and the lever on a machine" },
    { de: "das Zahnrad", lookup: "Zahnrad", fallbackEn: "gear, cog", tip: "noun", article: "das" },
    { de: "der Kolben", lookup: "Kolben", fallbackEn: "piston", tip: "noun", article: "der", use: "in an engine; in a lab it is the round flask" },
    { de: "der Auftrieb", lookup: "Auftrieb", fallbackEn: "buoyancy, lift", tip: "noun", article: "der", use: "what holds a boat up and what a wing makes" },
    { de: "die Trägheit", lookup: "Trägheit", fallbackEn: "inertia", tip: "noun", article: "die", use: "in physics; of a person it means sluggishness" },
    { de: "die Umdrehung", lookup: "Umdrehung", fallbackEn: "revolution, turn", tip: "noun", article: "die", use: "one full turn: 3.000 Umdrehungen pro Minute" },
    { de: "der Wirkungsgrad", lookup: "Wirkungsgrad", fallbackEn: "efficiency", tip: "noun", article: "der", use: "of an engine or a boiler, given as a percentage" },
    { de: "das Vakuum", lookup: "Vakuum", fallbackEn: "vacuum", tip: "noun", article: "das" },
    { de: "die Schwingung", lookup: "Schwingung", fallbackEn: "vibration, oscillation", tip: "noun", article: "die" },
    { de: "die Frequenz", lookup: "Frequenz", fallbackEn: "frequency", tip: "noun", article: "die" },
    { de: "der Schall", lookup: "Schall", fallbackEn: "sound", tip: "noun", article: "der", use: "sound as a physical thing; der Klang is how it sounds" },
    { de: "das Echo", lookup: "Echo", fallbackEn: "echo", tip: "noun", article: "das" },
    { de: "die Brechung", lookup: "Brechung", fallbackEn: "refraction", tip: "noun", article: "die", use: "why a straw looks bent in a glass of water" },
    { de: "die Wärmeleitung", lookup: "Wärmeleitung", fallbackEn: "heat conduction", tip: "noun", article: "die" },
    { de: "der Schmelzpunkt", lookup: "Schmelzpunkt", fallbackEn: "melting point", tip: "noun", article: "der" },
    { de: "der Siedepunkt", lookup: "Siedepunkt", fallbackEn: "boiling point", tip: "noun", article: "der" },
  ]),
  part606: pack("Part 606", "B1", "Electricity in the house", "The words on a fuse box, on a charger and on the bill from an electrician.", [
    { de: "der Stromkreis", lookup: "Stromkreis", fallbackEn: "circuit", tip: "noun", article: "der" },
    { de: "die Stromstärke", lookup: "Stromstärke", fallbackEn: "current", tip: "noun", article: "die", use: "measured in amps; die Spannung is the voltage" },
    { de: "der Widerstand", lookup: "Widerstand", fallbackEn: "resistance", tip: "noun", article: "der", use: "electrical resistance, and resistance to anything else" },
    { de: "die Ladung", lookup: "Ladung", fallbackEn: "charge, load", tip: "noun", article: "die", use: "the charge in a battery, and the load on a lorry" },
    { de: "der Magnet", lookup: "Magnet", fallbackEn: "magnet", tip: "noun", article: "der" },
    { de: "das Magnetfeld", lookup: "Magnetfeld", fallbackEn: "magnetic field", tip: "noun", article: "das" },
    { de: "der Funke", lookup: "Funke", fallbackEn: "spark", tip: "noun", article: "der" },
  ]),
  part607: pack("Part 607", "B1", "What things are made of", "Acids, gases and metals, on a label and in a lesson.", [
    { de: "die Säure", lookup: "Säure", fallbackEn: "acid", tip: "noun", article: "die" },
    { de: "die Lauge", lookup: "Lauge", fallbackEn: "alkaline solution, lye", tip: "noun", article: "die", use: "the opposite of an acid, and the lye a pretzel is dipped in" },
    { de: "das Gemisch", lookup: "Gemisch", fallbackEn: "mixture", tip: "noun", article: "das" },
    { de: "das Molekül", lookup: "Molekül", fallbackEn: "molecule", tip: "noun", article: "das" },
    { de: "das Atom", lookup: "Atom", fallbackEn: "atom", tip: "noun", article: "das" },
    { de: "das Elektron", lookup: "Elektron", fallbackEn: "electron", tip: "noun", article: "das" },
    { de: "der Feststoff", lookup: "Feststoff", fallbackEn: "solid (state of matter)", tip: "noun", article: "der", use: "a solid as a state of matter" },
    { de: "die Flüssigkeit", lookup: "Flüssigkeit", fallbackEn: "fluid, liquid", tip: "noun", article: "die" },
    { de: "der Dampf", lookup: "Dampf", fallbackEn: "steam, vapour", tip: "noun", article: "der" },
    { de: "die Legierung", lookup: "Legierung", fallbackEn: "alloy", tip: "noun", article: "die" },
    { de: "das Blei", lookup: "Blei", fallbackEn: "lead", tip: "noun", article: "das", use: "the metal; bleifrei on a petrol pump means unleaded" },
    { de: "das Zink", lookup: "Zink", fallbackEn: "zinc", tip: "noun", article: "das" },
    { de: "das Messing", lookup: "Messing", fallbackEn: "brass", tip: "noun", article: "das" },
    { de: "der Schwefel", lookup: "Schwefel", fallbackEn: "sulphur", tip: "noun", article: "der" },
    { de: "der Kohlenstoff", lookup: "Kohlenstoff", fallbackEn: "carbon", tip: "noun", article: "der" },
    { de: "der Sauerstoff", lookup: "Sauerstoff", fallbackEn: "oxygen", tip: "noun", article: "der" },
    { de: "der Wasserstoff", lookup: "Wasserstoff", fallbackEn: "hydrogen", tip: "noun", article: "der" },
    { de: "der Stickstoff", lookup: "Stickstoff", fallbackEn: "nitrogen", tip: "noun", article: "der" },
    { de: "das Kohlendioxid", lookup: "Kohlendioxid", fallbackEn: "carbon dioxide", tip: "noun", article: "das" },
    { de: "die Faser", lookup: "Faser", fallbackEn: "fibre", tip: "noun", article: "die" },
    { de: "der Klebstoff", lookup: "Klebstoff", fallbackEn: "adhesive, glue", tip: "noun", article: "der" },
    { de: "das Lösungsmittel", lookup: "Lösungsmittel", fallbackEn: "solvent", tip: "noun", article: "das" },
    { de: "der Kristall", lookup: "Kristall", fallbackEn: "crystal", tip: "noun", article: "der" },
    { de: "das Gestein", lookup: "Gestein", fallbackEn: "rock", tip: "noun", article: "das", use: "rock as a material; der Stein is a single stone" },
    { de: "der Lehm", lookup: "Lehm", fallbackEn: "clay, loam", tip: "noun", article: "der", use: "the heavy soil, and what old walls are built of" },
    { de: "verdampfen", lookup: "verdampfen", fallbackEn: "to evaporate", tip: "verb", use: "to boil away; verdunsten is the slow kind at room temperature" },
    { de: "sieden", lookup: "sieden", fallbackEn: "to boil, to simmer", tip: "verb", use: "the technical word; kochen is what a kitchen says" },
    { de: "ätzen", lookup: "ätzen", fallbackEn: "to corrode, to etch", tip: "verb", use: "what an acid does to a surface" },
  ]),
  part608: pack("Part 608", "B1", "Bodies and living things", "The biology behind a test result and a nature programme.", [
    { de: "das Gewebe", lookup: "Gewebe", fallbackEn: "tissue", tip: "noun", article: "das", use: "body tissue, and woven fabric" },
    { de: "das Organ", lookup: "Organ", fallbackEn: "organ", tip: "noun", article: "das" },
    { de: "der Nerv", lookup: "Nerv", fallbackEn: "nerve", tip: "noun", article: "der", use: "Das geht mir auf die Nerven = that gets on my nerves" },
    { de: "das Skelett", lookup: "Skelett", fallbackEn: "skeleton", tip: "noun", article: "das" },
    { de: "das Gen", lookup: "Gen", fallbackEn: "gene", tip: "noun", article: "das" },
    { de: "die Vererbung", lookup: "Vererbung", fallbackEn: "heredity, inheritance", tip: "noun", article: "die", use: "of traits; das Erbe is what you inherit from a will" },
    { de: "die Gattung", lookup: "Gattung", fallbackEn: "genus, kind", tip: "noun", article: "die", use: "in biology, and a genre in art" },
    { de: "die Nahrungskette", lookup: "Nahrungskette", fallbackEn: "food chain", tip: "noun", article: "die" },
    { de: "die Fortpflanzung", lookup: "Fortpflanzung", fallbackEn: "reproduction", tip: "noun", article: "die" },
    { de: "der Keim", lookup: "Keim", fallbackEn: "germ, sprout", tip: "noun", article: "der", use: "the germ that makes you ill, and the shoot on a seed" },
    { de: "die Bakterie", lookup: "Bakterie", fallbackEn: "bacterium", tip: "noun", article: "die", use: "usually said in the plural: Bakterien" },
    { de: "die Alge", lookup: "Alge", fallbackEn: "alga", tip: "noun", article: "die", use: "usually said in the plural: Algen im Teich" },
    { de: "der Stängel", lookup: "Stängel", fallbackEn: "stem, stalk", tip: "noun", article: "der" },
    { de: "die Photosynthese", lookup: "Photosynthese", fallbackEn: "photosynthesis", tip: "noun", article: "die" },
  ]),
  part609: pack("Part 609", "B1", "Measuring and working it out", "The instruments, the shapes and the arithmetic a result is written in.", [
    { de: "die Skala", lookup: "Skala", fallbackEn: "scale", tip: "noun", article: "die", use: "the markings you read off; die Waage is what you weigh on" },
    { de: "das Thermometer", lookup: "Thermometer", fallbackEn: "thermometer", tip: "noun", article: "das" },
    { de: "der Messbecher", lookup: "Messbecher", fallbackEn: "measuring jug", tip: "noun", article: "der" },
    { de: "das Mikroskop", lookup: "Mikroskop", fallbackEn: "microscope", tip: "noun", article: "das" },
    { de: "das Fernrohr", lookup: "Fernrohr", fallbackEn: "spyglass", tip: "noun", article: "das", use: "the handheld kind; das Teleskop is the big one" },
    { de: "das Teleskop", lookup: "Teleskop", fallbackEn: "telescope", tip: "noun", article: "das" },
    { de: "das Reagenzglas", lookup: "Reagenzglas", fallbackEn: "test tube", tip: "noun", article: "das" },
    { de: "die Pipette", lookup: "Pipette", fallbackEn: "pipette, dropper", tip: "noun", article: "die" },
    { de: "die Auswertung", lookup: "Auswertung", fallbackEn: "analysis, evaluation", tip: "noun", article: "die", use: "what you do with the results once they are in" },
    { de: "die Formel", lookup: "Formel", fallbackEn: "formula", tip: "noun", article: "die" },
    { de: "die Gleichung", lookup: "Gleichung", fallbackEn: "equation", tip: "noun", article: "die" },
    { de: "die Konstante", lookup: "Konstante", fallbackEn: "constant (in maths)", tip: "noun", article: "die" },
    { de: "die Potenz", lookup: "Potenz", fallbackEn: "power, exponent", tip: "noun", article: "die", use: "zwei hoch drei is two to the power of three" },
    { de: "der Durchmesser", lookup: "Durchmesser", fallbackEn: "diameter", tip: "noun", article: "der" },
    { de: "der Radius", lookup: "Radius", fallbackEn: "radius", tip: "noun", article: "der" },
    { de: "der Kegel", lookup: "Kegel", fallbackEn: "cone", tip: "noun", article: "der", use: "the shape, and the pin you knock down at bowling" },
    { de: "die Pyramide", lookup: "Pyramide", fallbackEn: "pyramid", tip: "noun", article: "die" },
    { de: "die Symmetrie", lookup: "Symmetrie", fallbackEn: "symmetry", tip: "noun", article: "die" },
  ]),
  part610: pack("Part 610", "B2", "The earth and the sky", "What the weather report, the climate page and the space news are talking about.", [
    { de: "die Erosion", lookup: "Erosion", fallbackEn: "erosion", tip: "noun", article: "die" },
    { de: "der Krater", lookup: "Krater", fallbackEn: "crater", tip: "noun", article: "der" },
    { de: "die Ozonschicht", lookup: "Ozonschicht", fallbackEn: "ozone layer", tip: "noun", article: "die" },
    { de: "der Treibhauseffekt", lookup: "Treibhauseffekt", fallbackEn: "greenhouse effect", tip: "noun", article: "der" },
    { de: "die Erderwärmung", lookup: "Erderwärmung", fallbackEn: "global warming", tip: "noun", article: "die" },
    { de: "die Windstärke", lookup: "Windstärke", fallbackEn: "wind force", tip: "noun", article: "die", use: "given as a number on the Beaufort scale" },
    { de: "der Komet", lookup: "Komet", fallbackEn: "comet", tip: "noun", article: "der" },
    { de: "der Meteorit", lookup: "Meteorit", fallbackEn: "meteorite", tip: "noun", article: "der" },
    { de: "die Galaxie", lookup: "Galaxie", fallbackEn: "galaxy", tip: "noun", article: "die" },
    { de: "die Sonnenfinsternis", lookup: "Sonnenfinsternis", fallbackEn: "solar eclipse", tip: "noun", article: "die" },
    { de: "die Schwerelosigkeit", lookup: "Schwerelosigkeit", fallbackEn: "weightlessness", tip: "noun", article: "die" },
    { de: "die Raumfahrt", lookup: "Raumfahrt", fallbackEn: "space travel", tip: "noun", article: "die" },
    { de: "die Raumstation", lookup: "Raumstation", fallbackEn: "space station", tip: "noun", article: "die" },
  ]),
};
