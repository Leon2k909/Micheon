/**
 * Every language the switcher lists.
 *
 * Six are taught — German, English, French, Polish, Spanish and Portuguese. The rest are here so the
 * picker answers the question people actually arrive with — "is my language in
 * here?" — instead of showing a handful of options and leaving them to guess.
 * Each one says Coming soon and cannot be selected, which is a straight answer
 * rather than an implied no.
 *
 * `search` holds the endonym and the common alternative spellings, so typing
 * "espanol", "nihongo" or "farsi" finds the right row. Written without
 * diacritics on purpose: search folds the query the same way.
 */
export type LanguageEntry = {
  /** Course id; must stay stable, progress and settings key off it. */
  id: string;
  /** Flag or script emoji shown in the row. */
  icon: string;
  name: string;
  /** Endonyms and alternative spellings, space separated and lower case. */
  search: string;
};

export const PLANNED_LANGUAGES: LanguageEntry[] = [
  { id: "italian", name: "Italian", icon: "🇮🇹", search: "it italiano italy italien" },
  { id: "dutch", name: "Dutch", icon: "🇳🇱", search: "nl nederlands holland netherlands flemish vlaams" },
  // Languages leave this list when they become courses you can start. Everything
  // here is drawn only behind "Show more", which is the wrong place for a
  // language you own — it is written out in courseRegistry.ts instead.
  { id: "ukrainian", name: "Ukrainian", icon: "🇺🇦", search: "uk ukrainska українська ukraine" },
  { id: "czech", name: "Czech", icon: "🇨🇿", search: "cs cestina čeština czechia bohemian" },
  { id: "slovak", name: "Slovak", icon: "🇸🇰", search: "sk slovencina slovenčina slovakia" },
  { id: "hungarian", name: "Hungarian", icon: "🇭🇺", search: "hu magyar hungary" },
  { id: "romanian", name: "Romanian", icon: "🇷🇴", search: "ro romana română romania moldovan" },
  { id: "bulgarian", name: "Bulgarian", icon: "🇧🇬", search: "bg balgarski български bulgaria" },
  { id: "greek", name: "Greek", icon: "🇬🇷", search: "el ellinika ελληνικά greece hellenic" },
  { id: "turkish", name: "Turkish", icon: "🇹🇷", search: "tr turkce türkçe turkey turkiye" },
  { id: "swedish", name: "Swedish", icon: "🇸🇪", search: "sv svenska sweden" },
  { id: "norwegian", name: "Norwegian", icon: "🇳🇴", search: "no norsk norway bokmal nynorsk" },
  { id: "danish", name: "Danish", icon: "🇩🇰", search: "da dansk denmark" },
  { id: "finnish", name: "Finnish", icon: "🇫🇮", search: "fi suomi finland" },
  { id: "icelandic", name: "Icelandic", icon: "🇮🇸", search: "is islenska íslenska iceland" },
  { id: "irish", name: "Irish", icon: "🇮🇪", search: "ga gaeilge gaelic ireland" },
  { id: "welsh", name: "Welsh", icon: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", search: "cy cymraeg wales" },
  { id: "scottish-gaelic", name: "Scottish Gaelic", icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", search: "gd gaidhlig gàidhlig scotland scots" },
  { id: "croatian", name: "Croatian", icon: "🇭🇷", search: "hr hrvatski croatia" },
  { id: "serbian", name: "Serbian", icon: "🇷🇸", search: "sr srpski српски serbia" },
  { id: "bosnian", name: "Bosnian", icon: "🇧🇦", search: "bs bosanski bosnia" },
  { id: "slovenian", name: "Slovenian", icon: "🇸🇮", search: "sl slovenscina slovenščina slovenia" },
  { id: "albanian", name: "Albanian", icon: "🇦🇱", search: "sq shqip albania kosovo" },
  { id: "macedonian", name: "Macedonian", icon: "🇲🇰", search: "mk makedonski македонски macedonia" },
  { id: "lithuanian", name: "Lithuanian", icon: "🇱🇹", search: "lt lietuviu lietuvių lithuania" },
  { id: "latvian", name: "Latvian", icon: "🇱🇻", search: "lv latviesu latviešu latvia" },
  { id: "estonian", name: "Estonian", icon: "🇪🇪", search: "et eesti estonia" },
  { id: "catalan", name: "Catalan", icon: "🇪🇸", search: "ca catala català catalonia barcelona valencian" },
  { id: "basque", name: "Basque", icon: "🇪🇸", search: "eu euskara basque country euskadi" },
  { id: "galician", name: "Galician", icon: "🇪🇸", search: "gl galego galicia" },
  { id: "maltese", name: "Maltese", icon: "🇲🇹", search: "mt malti malta" },
  { id: "arabic", name: "Arabic", icon: "🇸🇦", search: "ar arabiya العربية msa levantine egyptian gulf" },
  { id: "hebrew", name: "Hebrew", icon: "🇮🇱", search: "he ivrit עברית israel" },
  { id: "persian", name: "Persian", icon: "🇮🇷", search: "fa farsi فارسی iran dari tajik" },
  { id: "kurdish", name: "Kurdish", icon: "🇮🇶", search: "ku kurdi kurmanji sorani" },
  { id: "georgian", name: "Georgian", icon: "🇬🇪", search: "ka kartuli ქართული georgia" },
  { id: "armenian", name: "Armenian", icon: "🇦🇲", search: "hy hayeren հայերեն armenia" },
  { id: "kazakh", name: "Kazakh", icon: "🇰🇿", search: "kk qazaqsha kazakhstan" },
  { id: "uzbek", name: "Uzbek", icon: "🇺🇿", search: "uz uzbekcha uzbekistan" },
  { id: "azerbaijani", name: "Azerbaijani", icon: "🇦🇿", search: "az azerbaycan azeri azerbaijan" },
  { id: "hindi", name: "Hindi", icon: "🇮🇳", search: "hi hindi हिन्दी india" },
  { id: "urdu", name: "Urdu", icon: "🇵🇰", search: "ur urdu اردو pakistan" },
  { id: "bengali", name: "Bengali", icon: "🇧🇩", search: "bn bangla বাংলা bangladesh" },
  { id: "punjabi", name: "Punjabi", icon: "🇮🇳", search: "pa panjabi ਪੰਜਾਬੀ punjab" },
  { id: "gujarati", name: "Gujarati", icon: "🇮🇳", search: "gu gujarati ગુજરાતી" },
  { id: "marathi", name: "Marathi", icon: "🇮🇳", search: "mr marathi मराठी" },
  { id: "tamil", name: "Tamil", icon: "🇮🇳", search: "ta tamil தமிழ் sri lanka" },
  { id: "telugu", name: "Telugu", icon: "🇮🇳", search: "te telugu తెలుగు" },
  { id: "kannada", name: "Kannada", icon: "🇮🇳", search: "kn kannada ಕನ್ನಡ" },
  { id: "malayalam", name: "Malayalam", icon: "🇮🇳", search: "ml malayalam മലയാളം kerala" },
  { id: "nepali", name: "Nepali", icon: "🇳🇵", search: "ne nepali नेपाली nepal" },
  { id: "sinhala", name: "Sinhala", icon: "🇱🇰", search: "si sinhala සිංහල sri lanka" },
  { id: "thai", name: "Thai", icon: "🇹🇭", search: "th thai ไทย thailand" },
  { id: "vietnamese", name: "Vietnamese", icon: "🇻🇳", search: "vi tieng viet tiếng việt vietnam" },
  { id: "khmer", name: "Khmer", icon: "🇰🇭", search: "km khmer ខ្មែរ cambodia cambodian" },
  { id: "lao", name: "Lao", icon: "🇱🇦", search: "lo lao ລາວ laos" },
  { id: "burmese", name: "Burmese", icon: "🇲🇲", search: "my burmese myanmar bamar" },
  { id: "indonesian", name: "Indonesian", icon: "🇮🇩", search: "id bahasa indonesia" },
  { id: "malay", name: "Malay", icon: "🇲🇾", search: "ms bahasa melayu malaysia" },
  { id: "filipino", name: "Filipino", icon: "🇵🇭", search: "tl tagalog filipino philippines pilipino" },
  { id: "mandarin", name: "Mandarin Chinese", icon: "🇨🇳", search: "zh mandarin putonghua 普通话 中文 china chinese simplified" },
  { id: "cantonese", name: "Cantonese", icon: "🇭🇰", search: "yue cantonese 廣東話 粵語 hong kong chinese traditional" },
  { id: "japanese", name: "Japanese", icon: "🇯🇵", search: "ja nihongo 日本語 japan" },
  { id: "korean", name: "Korean", icon: "🇰🇷", search: "ko hangugeo 한국어 korea hangul" },
  { id: "swahili", name: "Swahili", icon: "🇰🇪", search: "sw kiswahili kenya tanzania" },
  { id: "amharic", name: "Amharic", icon: "🇪🇹", search: "am amharic አማርኛ ethiopia" },
  { id: "yoruba", name: "Yoruba", icon: "🇳🇬", search: "yo yoruba nigeria" },
  { id: "igbo", name: "Igbo", icon: "🇳🇬", search: "ig igbo nigeria" },
  { id: "hausa", name: "Hausa", icon: "🇳🇬", search: "ha hausa nigeria niger" },
  { id: "zulu", name: "Zulu", icon: "🇿🇦", search: "zu isizulu south africa" },
  { id: "xhosa", name: "Xhosa", icon: "🇿🇦", search: "xh isixhosa south africa" },
  { id: "afrikaans", name: "Afrikaans", icon: "🇿🇦", search: "af afrikaans south africa" },
  { id: "somali", name: "Somali", icon: "🇸🇴", search: "so soomaali somalia" },
  { id: "mongolian", name: "Mongolian", icon: "🇲🇳", search: "mn mongol монгол mongolia" },
  { id: "hawaiian", name: "Hawaiian", icon: "🇺🇸", search: "haw olelo hawaii" },
  { id: "maori", name: "Māori", icon: "🇳🇿", search: "mi te reo maori new zealand" },
  { id: "latin", name: "Latin", icon: "🏛️", search: "la latina latinum roman classics" },
  { id: "ancient-greek", name: "Ancient Greek", icon: "🏛️", search: "grc attic koine homeric classics" },
  { id: "esperanto", name: "Esperanto", icon: "🟩", search: "eo esperanto constructed" },
  { id: "sign-language", name: "British Sign Language", icon: "🤟", search: "bsl sign deaf signing" },
];
