/**
 * Russian for the Zycie w Polsce practice questions.
 *
 * The lesson cards are answered by ZYCIE_W_POLSCE_RU. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs. Until this table a lesson read in Russian and then asked its
 * questions in Polish.
 *
 * Keyed on the POLISH source text exactly as it appears in plQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, an l for
 * an ł or a straight quote for a typographic one, and the lookup misses in
 * silence. The question renders in Polish, the tap works, and nothing
 * anywhere reports it.
 *
 * WHAT STAYS POLISH follows ZYCIE_W_POLSCE_RU exactly, because a reader meets
 * the lesson and its questions one after the other and a word glossed two
 * ways between them teaches nothing. The line runs where Russian itself
 * draws it:
 *
 *   - an institution Russian has a name for gets that name — Сейм, Сенат,
 *     Конституционный трибунал, Государственный трибунал, гмина, повят,
 *     воеводство, староство;
 *   - the words a reader will only ever meet printed on a form, a card or a
 *     doorplate lead in Polish — PESEL, NIP, REGON, ZUS, NFZ, KRUS, KRS,
 *     CEIDG, Profil zaufany, wójt;
 *   - a song or a painting keeps its Polish title, with the meaning beside it
 *     where a reader needs to know what the words say.
 *
 * Ninety-six of the bank's strings are not here and that is correct: they are
 * years, bare numbers and short answers that ZYCIE_W_POLSCE_RU or another
 * Russian table already answers. Every Russian table is spread into one
 * object, so a key present in two of them would lose one silently — the later
 * spread would decide both. check-ru-bank-translation measures coverage
 * through translateCourseText, the lookup a reader's tap actually goes
 * through, so those count as answered and are not duplicated here.
 */
export const PL_QUESTION_BANK_RU: Record<string, string> = {
  "Co przedstawia godło Rzeczypospolitej Polskiej?": "Что изображено на гербе Республики Польша?",
  "Białego orła w złotej koronie na czerwonym tle": "Белого орла в золотой короне на красном фоне",
  "Czarnego orła na złotym tle": "Чёрного орла на золотом фоне",
  "Białego orła bez korony na niebieskim tle": "Белого орла без короны на синем фоне",
  "Złotego lwa na czerwonym tle": "Золотого льва на красном фоне",
  "Orzeł biały w złotej koronie, na czerwonym polu — opisuje go artykuł 28 Konstytucji.":
    "Белый орёл в золотой короне на красном поле — его описывает статья 28 Конституции.",
  "Kiedy obchodzi się Dzień Flagi Rzeczypospolitej Polskiej?":
    "Когда отмечается День флага Республики Польша?",
  "1 maja": "1 мая",
  "2 maja": "2 мая",
  "2 maja, między Świętem Pracy a Świętem Konstytucji 3 Maja.":
    "2 мая, между Днём труда и Днём Конституции 3 мая.",
  "W którym roku orzeł w godle odzyskał koronę?": "В каком году орёл на гербе вернул себе корону?",
  "W 1990 roku. W czasach PRL orzeł korony nie miał; 1918 to odzyskanie niepodległości, 1997 to Konstytucja.":
    "В 1990 году. Во времена ПНР у орла короны не было; 1918-й — это восстановление независимости, 1997-й — Конституция.",
  "Który akt prawny jest w Polsce najwyższy?": "Какой правовой акт в Польше стоит выше всех?",
  "Ustawa sejmowa": "Закон, принятый Сеймом",
  "Rozporządzenie ministra": "Постановление министра",
  "Uchwała rady gminy": "Решение совета гмины",
  "Konstytucja. Żadna ustawa ani rozporządzenie nie może być z nią sprzeczne.":
    "Конституция. Ни один закон и ни одно постановление не может ей противоречить.",
  "W jakim trybie przyjęto obowiązującą Konstytucję RP?":
    "В каком порядке была принята действующая Конституция Польши?",
  "Uchwalona przez Sejm i zatwierdzona w referendum": "Принята Сеймом и утверждена на референдуме",
  "Nadana przez Prezydenta": "Дарована президентом",
  "Uchwalona wyłącznie przez Senat": "Принята одним лишь Сенатом",
  "Przyjęta rozporządzeniem Rady Ministrów": "Принята постановлением Совета министров",
  "Zgromadzenie Narodowe ją uchwaliło, a obywatele potwierdzili w referendum w 1997 roku.":
    "Её приняло Национальное собрание, а граждане подтвердили её на референдуме в 1997 году.",
  "Jak nazywa się hymn państwowy Polski?": "Как называется государственный гимн Польши?",
  "Rota": "«Рота»",
  "Warszawianka": "«Варшавянка»",
  "Bogurodzica": "«Богуродзица»",
  "Mazurek Dąbrowskiego, z 1797 roku. Rota i Warszawianka to pieśni patriotyczne, ale nie hymn.":
    "«Мазурка Домбровского», 1797 год. «Рота» и «Варшавянка» — патриотические песни, но не гимн.",
  "Jakie kolory ma flaga Polski?": "Какие цвета у флага Польши?",
  "Biały i czerwony": "Белый и красный",
  "Czerwony i złoty": "Красный и золотой",
  "Biały i niebieski": "Белый и синий",
  "Czerwony i czarny": "Красный и чёрный",
  "Biel u góry, czerwień u dołu — barwy wzięte z orła i pola herbowego.":
    "Белый сверху, красный снизу — цвета взяты у орла и у поля герба.",
  "W którym artykule Konstytucji opisane są godło, barwy i hymn?":
    "В какой статье Конституции описаны герб, цвета и гимн?",
  "W artykule 1": "В статье 1",
  "W artykule 28": "В статье 28",
  "W artykule 30": "В статье 30",
  "W artykule 87": "В статье 87",
  "Artykuł 28 wymienia wszystkie trzy symbole i obejmuje je ochroną prawną.":
    "Статья 28 называет все три символа и берёт их под правовую охрану.",
  "W którym roku powstał Mazurek Dąbrowskiego?": "В каком году появилась «Мазурка Домбровского»?",
  "1791": "1791",
  "1797": "1797",
  "1830": "1830",
  "1797, we Włoszech, w Legionach Polskich — gdy państwa polskiego nie było na mapie.":
    "1797 год, в Италии, в Польских легионах — когда польского государства не было на карте.",
  "Kiedy oficjalnie ustalono biel i czerwień jako barwy narodowe?":
    "Когда белый и красный официально установили как национальные цвета?",
  "W 1791 roku": "В 1791 году",
  "W 1831 roku": "В 1831 году",
  "W 1918 roku": "В 1918 году",
  "W 1990 roku": "В 1990 году",
  "7 lutego 1831 roku, w czasie powstania listopadowego. Herb jest o wieki starszy niż same barwy.":
    "7 февраля 1831 года, во время Ноябрьского восстания. Герб на века старше самих цветов.",
  "Czym różni się flaga z godłem od zwykłej flagi państwowej?":
    "Чем флаг с гербом отличается от обычного государственного флага?",
  "Używają jej wyłącznie polskie statki i placówki dyplomatyczne":
    "Его поднимают только польские суда и дипломатические представительства",
  "Wywiesza się ją tylko 11 listopada": "Его вывешивают только 11 ноября",
  "Jest wersją historyczną, dziś nieużywaną": "Это историческая версия, сегодня не используется",
  "Różni się odcieniem czerwieni": "Отличается оттенком красного",
  "Wersja z godłem jest zastrzeżona dla statków i placówek za granicą — nie wywiesza się jej na balkonie.":
    "Версия с гербом закреплена за судами и представительствами за границей — на балконе её не вывешивают.",
  "Dlaczego orzeł w godle nosi koronę, choć Polska jest republiką?":
    "Почему орёл на гербе носит корону, хотя Польша — республика?",
  "Bo korona oznacza suwerenność państwa, a nie monarchię":
    "Потому что корона означает суверенитет государства, а не монархию",
  "Bo Polska formalnie pozostaje królestwem": "Потому что Польша формально остаётся королевством",
  "Bo tak zdecydował Sejm w 1997 roku": "Потому что так решил Сейм в 1997 году",
  "Bo korona odróżnia godło od herbu Warszawy":
    "Потому что корона отличает герб страны от герба Варшавы",
  "Korona jest znakiem niezawisłości państwa. Wróciła na głowę orła w 1990 roku, po okresie PRL.":
    "Корона — знак независимости государства. Она вернулась на голову орла в 1990 году, после эпохи ПНР.",
  "Kiedy obchodzi się Dzień Flagi?": "Когда отмечают День флага?",
  "2 maja — dzień między Świętem Pracy a Świętem Konstytucji 3 Maja.":
    "2 мая — день между Днём труда и Днём Конституции 3 мая.",
  "Jakie są pierwsze słowa polskiego hymnu?": "Какие первые слова у польского гимна?",
  "Boże, coś Polskę": "«Boże, coś Polskę» — «Боже, храни Польшу»",
  "Jeszcze Polska nie zginęła": "«Jeszcze Polska nie zginęła» — «Ещё Польша не погибла»",
  "Nie rzucim ziemi": "«Nie rzucim ziemi» — «Не бросим землю»",
  "Warszawo ma": "«Warszawo ma» — «Варшава моя»",
  "„Jeszcze Polska nie zginęła, kiedy my żyjemy” — zdanie napisane w czasie rozbiorów.":
    "«Jeszcze Polska nie zginęła, kiedy my żyjemy» — «Ещё Польша не погибла, пока мы живы», строка, написанная во время разделов.",
  "Jaką formą państwa jest Polska według Konstytucji?":
    "Какая форма государства у Польши по Конституции?",
  "Monarchią": "Монархия",
  "Republiką": "Республика",
  "Federacją": "Федерация",
  "Konfederacją": "Конфедерация",
  "Republiką — głowę państwa się wybiera na kadencję, a nie dziedziczy.":
    "Республика — главу государства избирают на срок, а не наследуют.",
  "Która konstytucja obowiązywała w PRL do 1997 roku?":
    "Какая конституция действовала в ПНР до 1997 года?",
  "Marcowa z 1921": "Мартовская 1921 года",
  "Kwietniowa z 1935": "Апрельская 1935 года",
  "Z 1952 roku": "1952 года",
  "Z 1989 roku": "1989 года",
  "Konstytucja PRL z 1952 roku, wielokrotnie zmieniana, obowiązywała do wejścia w życie obecnej.":
    "Конституция ПНР 1952 года, много раз изменявшаяся, действовала до вступления в силу нынешней.",
  "Ile miesięcy obowiązywała Konstytucja 3 maja?":
    "Сколько месяцев действовала Конституция 3 мая?",
  "Czternaście miesięcy": "Четырнадцать месяцев",
  "Pięć lat": "Пять лет",
  "Dwadzieścia lat": "Двадцать лет",
  "Do rozbiorów w 1795 roku": "До разделов в 1795 году",
  "Czternaście miesięcy. Sąsiedzi wkroczyli zbrojnie, a w 1793 roku doszło do drugiego rozbioru.":
    "Четырнадцать месяцев. Соседи вошли с оружием, а в 1793 году произошёл второй раздел.",
  "Która konstytucja wzmocniła pozycję prezydenta kosztem parlamentu?":
    "Какая конституция усилила положение президента за счёт парламента?",
  "Z 1997 roku": "1997 года",
  "Kwietniowa z 1935 roku, uchwalona pod koniec życia Piłsudskiego.":
    "Апрельская 1935 года, принятая в конце жизни Пилсудского.",
  "Kiedy przy zmianie Konstytucji można zażądać referendum?":
    "Когда при изменении Конституции можно потребовать референдум?",
  "Zawsze, przy każdej zmianie": "Всегда, при любом изменении",
  "Gdy zmiana dotyczy rozdziałów o ustroju, wolnościach albo o samej procedurze zmiany":
    "Когда изменение касается разделов о государственном строе, о свободах или о самой процедуре изменения",
  "Nigdy — Konstytucję zmienia wyłącznie parlament":
    "Никогда — Конституцию меняет только парламент",
  "Tylko gdy zażąda tego Prezydent": "Только если этого потребует президент",
  "Referendum zatwierdzające dotyczy rozdziałów I, II i XII — ustroju, wolności i trybu zmiany.":
    "Утверждающий референдум касается разделов I, II и XII — строя, свобод и порядка изменения.",
  "Co oznacza zasada, że organy władzy działają „na podstawie i w granicach prawa”?":
    "Что означает принцип, по которому органы власти действуют «на основании и в пределах права»?",
  "Że urząd może zrobić tylko to, na co pozwala mu przepis":
    "Что учреждение может сделать только то, что ему позволяет норма",
  "Że urząd może zrobić wszystko, czego przepis nie zakazuje":
    "Что учреждение может сделать всё, чего норма не запрещает",
  "Że przepisy obowiązują tylko obywateli": "Что нормы обязательны только для граждан",
  "Że decyzje urzędu są ostateczne": "Что решения учреждения окончательны",
  "Odwrotnie niż u obywatela: obywatelowi wolno wszystko, czego prawo nie zabrania, urzędowi tylko to, na co prawo zezwala.":
    "Здесь всё наоборот, чем у гражданина: гражданину можно всё, чего право не запрещает, а учреждению — только то, что право разрешает.",
  "Czy ustawa może być sprzeczna z Konstytucją?": "Может ли закон противоречить Конституции?",
  "Nie, Konstytucja jest najwyższym prawem": "Нет, Конституция — высший закон",
  "Tak, jeśli uchwali ją Sejm większością 2/3":
    "Да, если его примет Сейм большинством в две трети",
  "Tak, jeśli podpisze ją Prezydent": "Да, если его подпишет президент",
  "Tak, w stanie wyjątkowym": "Да, при чрезвычайном положении",
  "Nie. Sprzeczną z Konstytucją ustawę może uchylić Trybunał Konstytucyjny.":
    "Нет. Противоречащий Конституции закон может отменить Конституционный трибунал.",
  "Jak nazywa się zasada rozdzielenia władzy ustawodawczej, wykonawczej i sądowniczej?":
    "Как называется принцип разделения законодательной, исполнительной и судебной власти?",
  "Federalizm": "Федерализм",
  "Centralizm": "Централизм",
  "Subsydiarność": "Субсидиарность",
  "Podział i równowaga władz — jedna z podstawowych zasad ustrojowych.":
    "Разделение и равновесие властей — один из основных принципов государственного строя.",
  "Który organ uchwalił Konstytucję z 1997 roku?": "Какой орган принял Конституцию 1997 года?",
  "Zgromadzenie Narodowe, czyli Sejm i Senat obradujące wspólnie; obywatele potwierdzili ją w referendum.":
    "Национальное собрание, то есть Сейм и Сенат, заседающие совместно; граждане подтвердили её на референдуме.",
  "Co oznacza domniemanie niewinności?": "Что означает презумпция невиновности?",
  "Że oskarżony jest niewinny, dopóki sąd nie orzeknie prawomocnie":
    "Что обвиняемый невиновен, пока суд не вынесет окончательный приговор",
  "Że oskarżony musi udowodnić swoją niewinność":
    "Что обвиняемый должен доказать свою невиновность",
  "Że policja nie może nikogo zatrzymać": "Что полиция не может никого задержать",
  "Że wyrok można wydać tylko za zgodą oskarżonego":
    "Что приговор можно вынести только с согласия обвиняемого",
  "Ciężar dowodu spoczywa na oskarżycielu, nie na oskarżonym.":
    "Бремя доказывания лежит на обвинителе, а не на обвиняемом.",
  "Od którego roku życia przysługuje prawo głosowania?":
    "С какого возраста возникает право голоса?",
  "Od 16": "С 16",
  "Od 18": "С 18",
  "Od 21": "С 21",
  "Od 25": "С 25",
  "Od 18 lat. 21 lat trzeba mieć, żeby kandydować do Sejmu, 30 — do Senatu.":
    "С 18 лет. Чтобы баллотироваться в Сейм, нужен 21 год, в Сенат — 30.",
  "Co można zrobić, gdy naruszył wolność sam przepis, a nie wyrok?":
    "Что можно сделать, если свободу нарушила сама норма, а не приговор?",
  "Złożyć skargę konstytucyjną do Trybunału Konstytucyjnego":
    "Подать конституционную жалобу в Конституционный трибунал",
  "Wnieść apelację do sądu okręgowego": "Подать апелляцию в окружной суд",
  "Złożyć wniosek do wojewody": "Подать заявление воеводе",
  "Nic — przepisów nie da się zakwestionować": "Ничего — нормы оспорить нельзя",
  "Skarga konstytucyjna, po wyczerpaniu drogi sądowej; sporządza ją adwokat albo radca prawny.":
    "Конституционная жалоба, после того как исчерпан судебный путь; составляет её адвокат или юрисконсульт.",
  "Co gwarantuje europejskie rozporządzenie RODO?": "Что гарантирует европейский регламент RODO?",
  "Prawo do informacji o swoich danych, ich poprawienia i usunięcia":
    "Право знать о своих данных, исправить их и удалить",
  "Prawo do bezpłatnego internetu": "Право на бесплатный интернет",
  "Prawo do zasiłku dla bezrobotnych": "Право на пособие по безработице",
  "Prawo do pracy w każdym kraju świata": "Право работать в любой стране мира",
  "RODO obowiązuje od 2018 roku; nadzoruje je Prezes Urzędu Ochrony Danych Osobowych.":
    "RODO действует с 2018 года; надзор за ним ведёт председатель Управления по защите персональных данных.",
  "Kto stoi na straży praw dzieci?": "Кто стоит на страже прав детей?",
  "Rzecznik Praw Dziecka": "Уполномоченный по правам ребёнка",
  "Rzecznik Praw Obywatelskich": "Уполномоченный по правам человека",
  "Kurator oświaty": "Куратор образования",
  "Sąd rodzinny": "Суд по семейным делам",
  "Rzecznik Praw Dziecka działa osobno od Rzecznika Praw Obywatelskich.":
    "Уполномоченный по правам ребёнка работает отдельно от Уполномоченного по правам человека.",
  "Czego nigdy nie wolno naruszyć przy ograniczaniu wolności?":
    "Что никогда нельзя нарушать при ограничении свободы?",
  "Istoty danej wolności": "Существа самой этой свободы",
  "Terminu wejścia w życie ustawy": "Срока вступления закона в силу",
  "Zasady jawności obrad": "Принципа гласности заседаний",
  "Kompetencji wojewody": "Полномочий воеводы",
  "Ograniczenie musi być konieczne i wprowadzone ustawą, ale istoty wolności naruszyć nie może.":
    "Ограничение должно быть необходимым и введено законом, но существа свободы оно нарушить не может.",
  "Dlaczego nie można ukarać kogoś za czyn, który w chwili popełnienia nie był zabroniony?":
    "Почему нельзя наказать кого-то за поступок, который в момент совершения не был запрещён?",
  "Bo prawo karne nie działa wstecz": "Потому что уголовный закон не имеет обратной силы",
  "Bo przedawnienie następuje po roku": "Потому что срок давности истекает через год",
  "Bo zgody musiałby udzielić Sejm": "Потому что согласие должен был бы дать Сейм",
  "Bo taki czyn zawsze jest wykroczeniem, nie przestępstwem":
    "Потому что такой поступок всегда проступок, а не преступление",
  "Zasada lex retro non agit — prawo karne nie działa wstecz.":
    "Принцип lex retro non agit — уголовный закон обратной силы не имеет.",
  "Czy w Polsce obowiązuje cenzura prewencyjna?": "Действует ли в Польше предварительная цензура?",
  "Nie, jest zakazana przez Konstytucję": "Нет, она запрещена Конституцией",
  "Tak, sprawuje ją ministerstwo kultury": "Да, её осуществляет министерство культуры",
  "Tak, wobec prasy zagranicznej": "Да, в отношении иностранной прессы",
  "Tak, w czasie kampanii wyborczej": "Да, во время избирательной кампании",
  "Konstytucja zakazuje cenzury prewencyjnej i koncesjonowania prasy.":
    "Конституция запрещает предварительную цензуру и лицензирование прессы.",
  "Do jakiego wieku nauka w szkole publicznej jest bezpłatna i obowiązkowa?":
    "До какого возраста учёба в государственной школе бесплатна и обязательна?",
  "Do 15 lat": "До 15 лет",
  "Do 16 lat": "До 16 лет",
  "Do 18 lat": "До 18 лет",
  "Do ukończenia studiów": "До окончания вуза",
  "Do 18. roku życia. Studia dzienne na uczelniach publicznych też są bezpłatne, ale nieobowiązkowe.":
    "До 18 лет. Очная учёба в государственных вузах тоже бесплатна, но не обязательна.",
  "Kogo obowiązuje przestrzeganie prawa Rzeczypospolitej?":
    "Кто обязан соблюдать право Республики Польша?",
  "Każdego, kto znajduje się pod jej władzą, także cudzoziemca":
    "Каждый, кто находится под её властью, в том числе иностранец",
  "Wyłącznie obywateli polskich": "Только польские граждане",
  "Wyłącznie osoby pełnoletnie": "Только совершеннолетние",
  "Wyłącznie osoby zameldowane": "Только те, кто зарегистрирован по месту жительства",
  "Obowiązek dotyczy każdego na terytorium państwa, niezależnie od obywatelstwa.":
    "Обязанность касается каждого на территории государства, независимо от гражданства.",
  "Co może nałożyć podatek?": "Чем можно установить налог?",
  "Tylko ustawa": "Только законом",
  "Decyzja wojewody": "Решением воеводы",
  "Ciężary publiczne nakłada wyłącznie ustawa — to gwarancja konstytucyjna.":
    "Публичные повинности устанавливает только закон — это конституционная гарантия.",
  "Co przysługuje osobie, która ze względu na przekonania nie może pełnić służby wojskowej?":
    "На что имеет право человек, который по убеждениям не может нести военную службу?",
  "Służba zastępcza": "Альтернативная служба",
  "Zwolnienie bez żadnych obowiązków": "Освобождение без каких-либо обязанностей",
  "Kara grzywny": "Денежный штраф",
  "Utrata prawa głosu": "Потеря права голоса",
  "Konstytucja przewiduje skierowanie do służby zastępczej.":
    "Конституция предусматривает направление на альтернативную службу.",
  "W którym roku zawieszono w Polsce obowiązkową zasadniczą służbę wojskową?":
    "В каком году в Польше приостановили обязательную срочную военную службу?",
  "2009": "2009",
  "W 2009 roku. Obowiązek obrony ojczyzny pozostał w Konstytucji, ale poboru w czasie pokoju się nie prowadzi.":
    "В 2009 году. Обязанность защищать родину осталась в Конституции, но призыв в мирное время не проводится.",
  "Czy udział w wyborach jest w Polsce obowiązkowy?":
    "Обязательно ли в Польше участвовать в выборах?",
  "Nie, głosowanie jest prawem, nie obowiązkiem": "Нет, голосование — это право, а не обязанность",
  "Tak, za nieoddanie głosu grozi grzywna": "Да, за неявку грозит штраф",
  "Tak, dla osób powyżej 25 lat": "Да, для тех, кому больше 25 лет",
  "Tak, w wyborach prezydenckich": "Да, на президентских выборах",
  "Nie ma kary za nieoddanie głosu. Prawo wybierania przysługuje od 18. roku życia.":
    "Наказания за неявку нет. Право избирать возникает с 18 лет.",
  "Gdzie mogą głosować obywatele mieszkający za granicą?":
    "Где могут голосовать граждане, живущие за границей?",
  "W obwodach przy placówkach dyplomatycznych":
    "На участках при дипломатических представительствах",
  "Nigdzie — tracą prawo głosu": "Нигде — они теряют право голоса",
  "Wyłącznie korespondencyjnie do Sejmu": "Только по почте, и лишь в Сейм",
  "Wyłącznie po powrocie do kraju": "Только вернувшись в страну",
  "Przy ambasadach i konsulatach tworzy się obwody głosowania.":
    "При посольствах и консульствах создаются избирательные участки.",
  "Kto odpowiada za pogorszenie stanu środowiska?":
    "Кто отвечает за ухудшение состояния окружающей среды?",
  "Ten, kto je spowodował": "Тот, кто его вызвал",
  "Wyłącznie gmina": "Только гмина",
  "Wyłącznie Skarb Państwa": "Только государственная казна",
  "Nikt — to obowiązek moralny bez sankcji": "Никто — это моральный долг без санкций",
  "Konstytucja wprost wiąże odpowiedzialność ze sprawcą pogorszenia.":
    "Конституция прямо связывает ответственность с тем, кто вызвал ухудшение.",
  "Kto odpowiada za to, żeby dziecko wypełniało obowiązek nauki?":
    "Кто отвечает за то, чтобы ребёнок выполнял обязанность учиться?",
  "Rodzice albo opiekunowie": "Родители или опекуны",
  "Wyłącznie szkoła": "Только школа",
  "Wójt gminy": "Wójt гмины",
  "Kurator sądowy": "Судебный куратор",
  "Odpowiadają rodzice albo opiekunowie prawni; szkoła publiczna jest przy tym bezpłatna.":
    "Отвечают родители или законные опекуны; при этом государственная школа бесплатна.",
  "Na ile lat wybiera się Sejm i Senat?": "На сколько лет избирают Сейм и Сенат?",
  "Na 3 lata": "На 3 года",
  "Na 4 lata": "На 4 года",
  "Na 5 lat": "На 5 лет",
  "Na 6 lat": "На 6 лет",
  "Na 4 lata. Prezydenta wybiera się na 5 lat, samorząd również na 5.":
    "На 4 года. Президента избирают на 5 лет, органы самоуправления тоже на 5.",
  "Ile lat musi mieć kandydat na posła?": "Сколько лет должно быть кандидату в депутаты Сейма?",
  "30": "30",
  "21 lat. Senatorem można zostać po ukończeniu 30 lat.":
    "21 год. Сенатором можно стать после 30 лет.",
  "Ile dni ma Senat na zajęcie stanowiska wobec ustawy Sejmu?":
    "Сколько дней есть у Сената, чтобы высказаться о законе, принятом Сеймом?",
  "7 dni": "7 дней",
  "14 dni": "14 дней",
  "30 dni": "30 дней",
  "60 dni": "60 дней",
  "30 dni. Po bezskutecznym upływie terminu ustawę uznaje się za przyjętą.":
    "30 дней. Если срок истёк впустую, закон считается принятым.",
  "Ilu obywateli musi podpisać się pod obywatelskim projektem ustawy?":
    "Сколько граждан должно подписать гражданский законопроект?",
  "10 tysięcy": "10 тысяч",
  "50 tysięcy": "50 тысяч",
  "100 tysięcy": "100 тысяч",
  "500 tysięcy": "500 тысяч",
  "100 tysięcy — tyle samo, ile potrzeba do zgłoszenia kandydata na Prezydenta.":
    "100 тысяч — столько же, сколько нужно, чтобы выдвинуть кандидата в президенты.",
  "Jaki próg wyborczy obowiązuje pojedynczą partię w wyborach do Sejmu?":
    "Какой избирательный порог действует для отдельной партии на выборах в Сейм?",
  "3 procent": "3 процента",
  "5 procent": "5 процентов",
  "8 procent": "8 процентов",
  "Nie ma progu": "Порога нет",
  "5 procent dla partii, 8 dla koalicji. Mniejszości narodowe są z progu zwolnione.":
    "5 процентов для партии, 8 для коалиции. Национальные меньшинства от порога освобождены.",
  "Czym różni się sposób wyboru Sejmu od sposobu wyboru Senatu?":
    "Чем способ избрания Сейма отличается от способа избрания Сената?",
  "Sejm wybiera się proporcjonalnie z list, Senat większościowo w stu okręgach":
    "Сейм избирают пропорционально по спискам, Сенат — по мажоритарной системе в ста округах",
  "Sejm wybiera się większościowo, Senat proporcjonalnie":
    "Сейм избирают по мажоритарной системе, Сенат — пропорционально",
  "Oba wybiera się identycznie": "Оба избирают одинаково",
  "Senatorów wskazuje Prezydent": "Сенаторов назначает президент",
  "Do Sejmu głosuje się na listy i dzieli mandaty metodą d'Hondta; w Senacie w każdym okręgu wygrywa jeden kandydat.":
    "В Сейм голосуют за списки, а мандаты делят по методу д'Ондта; в Сенате в каждом округе побеждает один кандидат.",
  "Jaką większością Sejm odrzuca poprawki Senatu?":
    "Каким большинством Сейм отклоняет поправки Сената?",
  "Bezwzględną. Trzy piąte potrzebne są do odrzucenia weta Prezydenta.":
    "Абсолютным. Три пятых нужны, чтобы отклонить вето президента.",
  "Co to jest Zgromadzenie Narodowe?": "Что такое Национальное собрание?",
  "Sejm i Senat obradujące wspólnie": "Сейм и Сенат, заседающие совместно",
  "Zjazd przedstawicieli samorządów": "Съезд представителей органов самоуправления",
  "Posiedzenie Rady Ministrów z Prezydentem": "Заседание Совета министров с президентом",
  "Zebranie wszystkich sędziów Sądu Najwyższego": "Собрание всех судей Верховного суда",
  "Zbiera się rzadko: przysięga Prezydenta, uznanie go za trwale niezdolnego, postawienie przed Trybunałem Stanu.":
    "Собирается редко: присяга президента, признание его стойко неспособным исполнять обязанности, предание его Государственному трибуналу.",
  "Co chroni immunitet poselski?": "Что защищает депутатский иммунитет?",
  "Mandat, a nie osobę — izba może go uchylić": "Мандат, а не человека — палата может его снять",
  "Osobę dożywotnio": "Человека пожизненно",
  "Wyłącznie wypowiedzi na sali sejmowej": "Только выступления в зале Сейма",
  "Majątek posła przed egzekucją": "Имущество депутата от взыскания",
  "Bez zgody izby nie można pociągnąć posła do odpowiedzialności karnej, ale izba może immunitet uchylić.":
    "Без согласия палаты депутата нельзя привлечь к уголовной ответственности, но палата может снять иммунитет.",
  "Kto podpisuje ustawę na końcu drogi legislacyjnej?":
    "Кто подписывает закон в конце законодательного пути?",
  "Marszałek Sejmu": "Маршал Сейма",
  "Premier": "Премьер-министр",
  "Prezes Trybunału Konstytucyjnego": "Председатель Конституционного трибунала",
  "Prezydent — albo podpisuje, albo wetuje, albo kieruje ustawę do Trybunału Konstytucyjnego.":
    "Президент — он либо подписывает, либо накладывает вето, либо направляет закон в Конституционный трибунал.",
  "Ile lat musi mieć kandydat na Prezydenta?": "Сколько лет должно быть кандидату в президенты?",
  "35": "35",
  "40": "40",
  "35 lat i 100 tysięcy podpisów poparcia.": "35 лет и 100 тысяч подписей в поддержку.",
  "Ile kadencji może sprawować ta sama osoba jako Prezydent?":
    "Сколько сроков один и тот же человек может быть президентом?",
  "Jedną": "Один",
  "Bez ograniczeń": "Без ограничений",
  "Najwyżej dwie pięcioletnie kadencje.": "Самое большее два пятилетних срока.",
  "Ile dni ma Prezydent na podpisanie ustawy?":
    "Сколько дней есть у президента на подписание закона?",
  "21 dni": "21 день",
  "21 dni. W tym czasie może też zawetować ustawę albo skierować ją do Trybunału.":
    "21 день. За это время он может также наложить вето или направить закон в Трибунал.",
  "Kto zastępuje Prezydenta, gdy ten nie może sprawować urzędu?":
    "Кто замещает президента, когда тот не может исполнять обязанности?",
  "Marszałek Senatu": "Маршал Сената",
  "Prezes Sądu Najwyższego": "Председатель Верховного суда",
  "Marszałek Sejmu, a gdyby i on nie mógł — Marszałek Senatu. Tak było w kwietniu 2010 roku.":
    "Маршал Сейма, а если бы и он не мог — маршал Сената. Так было в апреле 2010 года.",
  "Co to jest kontrasygnata?": "Что такое контрасигнатура?",
  "Podpis Prezesa Rady Ministrów pod aktem Prezydenta":
    "Подпись председателя Совета министров под актом президента",
  "Drugie czytanie ustawy w Sejmie": "Второе чтение закона в Сейме",
  "Zgoda Senatu na powołanie ministra": "Согласие Сената на назначение министра",
  "Podpis Prezydenta pod uchwałą Sejmu": "Подпись президента под постановлением Сейма",
  "Premier bierze przez nią odpowiedzialność za akt przed Sejmem. Prerogatywy jej nie wymagają.":
    "Ею премьер берёт на себя ответственность за акт перед Сеймом. Прерогативы её не требуют.",
  "Która z tych czynności NIE wymaga kontrasygnaty premiera?":
    "Какое из этих действий НЕ требует контрасигнатуры премьера?",
  "Prawo łaski": "Право помилования",
  "Ratyfikacja umowy międzynarodowej": "Ратификация международного договора",
  "Powołanie ambasadora": "Назначение посла",
  "Wydanie rozporządzenia": "Издание постановления",
  "Prawo łaski jest prerogatywą — podobnie jak zarządzenie wyborów czy nadanie obywatelstwa.":
    "Право помилования — прерогатива, как и назначение выборов или предоставление гражданства.",
  "Co się dzieje, gdy w pierwszej turze nikt nie zdobędzie ponad połowy głosów?":
    "Что происходит, если в первом туре никто не наберёт больше половины голосов?",
  "Po dwóch tygodniach odbywa się druga tura między dwoma najlepszymi":
    "Через две недели проходит второй тур между двумя лучшими",
  "Wybiera Zgromadzenie Narodowe": "Выбирает Национальное собрание",
  "Wygrywa kandydat z największą liczbą głosów": "Побеждает кандидат с наибольшим числом голосов",
  "Wybory powtarza się w całości": "Выборы повторяют целиком",
  "Druga tura, dwa tygodnie później, między dwoma kandydatami z najlepszym wynikiem.":
    "Второй тур, через две недели, между двумя кандидатами с лучшим результатом.",
  "Gdzie mieści się siedziba Prezydenta Rzeczypospolitej?":
    "Где находится резиденция президента Республики Польша?",
  "Na Wawelu": "На Вавеле",
  "W Pałacu Prezydenckim w Warszawie": "В Президентском дворце в Варшаве",
  "W Belwederze w Krakowie": "В Бельведере в Кракове",
  "W Sejmie": "В Сейме",
  "Pałac Prezydencki przy Krakowskim Przedmieściu w Warszawie.":
    "Президентский дворец на улице Краковское Предместье в Варшаве.",
  "Kim jest Prezydent wobec Sił Zbrojnych?":
    "Кем является президент по отношению к вооружённым силам?",
  "Najwyższym zwierzchnikiem": "Верховным главнокомандующим",
  "Dowódcą operacyjnym": "Оперативным командующим",
  "Doradcą Ministra Obrony": "Советником министра обороны",
  "Nie ma z nimi związku": "Он с ними никак не связан",
  "Najwyższym zwierzchnikiem; w czasie pokoju sprawuje to zwierzchnictwo przez Ministra Obrony Narodowej.":
    "Верховным главнокомандующим; в мирное время он осуществляет это через министра национальной обороны.",
  "Jak inaczej nazywa się Prezes Rady Ministrów?":
    "Как иначе называется председатель Совета министров?",
  "Marszałek": "Маршал",
  "Kanclerz": "Канцлер",
  "Premier. Marszałek kieruje obradami Sejmu albo Senatu.":
    "Премьер. Маршал ведёт заседания Сейма или Сената.",
  "Kto desygnuje Prezesa Rady Ministrów?": "Кто выдвигает председателя Совета министров?",
  "Prezydent desygnuje, a Sejm udziela rządowi wotum zaufania.":
    "Президент выдвигает его, а Сейм выражает правительству вотум доверия.",
  "W ciągu ilu miesięcy parlament musi uchwalić budżet, żeby Prezydent nie mógł skrócić kadencji Sejmu?":
    "За сколько месяцев парламент должен принять бюджет, чтобы президент не мог сократить срок полномочий Сейма?",
  "Dwóch": "Двух",
  "Trzech": "Трёх",
  "Czterech": "Четырёх",
  "Sześciu": "Шести",
  "Czterech miesięcy od przedłożenia projektu.": "Четырёх месяцев с момента внесения проекта.",
  "Który organ bada wydatki państwa i podlega Sejmowi?":
    "Какой орган проверяет расходы государства и подчиняется Сейму?",
  "Ministerstwo Finansów": "Министерство финансов",
  "NIK podlega Sejmowi, nie rządowi — dlatego może kontrolować rząd.":
    "NIK подчиняется Сейму, а не правительству — поэтому он и может его проверять.",
  "Co określa podział działów administracji rządowej między ministrów?":
    "Чем определяется распределение отраслей правительственной администрации между министрами?",
  "Ustawa": "Закон",
  "Decyzja premiera": "Решение премьера",
  "Rozporządzenie Prezydenta": "Постановление президента",
  "Uchwała Sejmu": "Постановление Сейма",
  "Ustawa o działach administracji rządowej. Liczba ministerstw bywa różna, ale działy są ustawowe.":
    "Закон об отраслях правительственной администрации. Число министерств бывает разным, но отрасли установлены законом.",
  "Który organ sądzi najwyższych urzędników za naruszenie Konstytucji lub ustawy?":
    "Какой орган судит высших должностных лиц за нарушение Конституции или закона?",
  "Trybunał Stanu — za delikty konstytucyjne, a nie za zwykłe przestępstwa.":
    "Государственный трибунал — за конституционные деликты, а не за обычные преступления.",
  "Kto prowadzi bieżącą politykę wewnętrzną i zagraniczną państwa?":
    "Кто ведёт текущую внутреннюю и внешнюю политику государства?",
  "Rada Ministrów. Prezydent reprezentuje państwo i stoi na straży Konstytucji.":
    "Совет министров. Президент представляет государство и стоит на страже Конституции.",
  "Jakiej większości wymaga wotum zaufania dla rządu?":
    "Какого большинства требует вотум доверия правительству?",
  "Bezwzględnej większości głosów w obecności co najmniej połowy ustawowej liczby posłów.":
    "Абсолютного большинства голосов при присутствии не менее половины установленного законом числа депутатов.",
  "W którym sądzie zaczyna się większość spraw?": "В каком суде начинается большинство дел?",
  "W rejonowym": "В районном",
  "W okręgowym": "В окружном",
  "W apelacyjnym": "В апелляционном",
  "W Sądzie Najwyższym": "В Верховном суде",
  "W sądzie rejonowym; odwołania trafiają do okręgowego, dalej do apelacyjnego.":
    "В районном суде; жалобы идут в окружной, дальше в апелляционный.",
  "Który sąd rozpatruje skargę na decyzję urzędu?":
    "Какой суд рассматривает жалобу на решение учреждения?",
  "Wojewódzki sąd administracyjny": "Воеводский административный суд",
  "Sąd rejonowy": "Районный суд",
  "Sądy administracyjne mają własną drogę; kasację rozpatruje Naczelny Sąd Administracyjny.":
    "У административных судов свой путь; кассацию рассматривает Главный административный суд.",
  "Co oznacza dwuinstancyjność postępowania?": "Что означает двухинстанционность производства?",
  "Że od wyroku przysługuje odwołanie": "Что на приговор можно подать жалобу",
  "Że sprawę sądzi dwóch sędziów": "Что дело судят два судьи",
  "Że wyrok zapada po dwóch rozprawach": "Что приговор выносится после двух заседаний",
  "Że rozprawa jest jawna": "Что заседание открытое",
  "Każdą sprawę można poddać ocenie sądu wyższej instancji.":
    "Любое дело можно передать на оценку суда высшей инстанции.",
  "Kto prowadzi postępowanie przygotowawcze i oskarża przed sądem?":
    "Кто ведёт предварительное расследование и обвиняет в суде?",
  "Adwokat": "Адвокат",
  "Ławnik": "Народный заседатель",
  "Prokurator. Adwokat broni, komornik wykonuje orzeczenia.":
    "Прокурор. Адвокат защищает, судебный пристав исполняет решения.",
  "Czym zajmuje się Sąd Najwyższy?": "Чем занимается Верховный суд?",
  "Czuwa nad jednolitością orzecznictwa, nie sądzi spraw od początku":
    "Следит за единообразием судебной практики, а не судит дела с самого начала",
  "Rozpatruje wszystkie sprawy karne w kraju": "Рассматривает все уголовные дела в стране",
  "Bada zgodność ustaw z Konstytucją": "Проверяет соответствие законов Конституции",
  "Nadzoruje pracę urzędów wojewódzkich": "Надзирает за работой воеводских учреждений",
  "Rozpatruje kasacje i podejmuje uchwały wykładnicze; zgodnością ustaw z Konstytucją zajmuje się Trybunał.":
    "Он рассматривает кассации и принимает разъясняющие постановления; соответствием законов Конституции занимается Трибунал.",
  "Czemu podlegają sędziowie przy orzekaniu?": "Чему подчиняются судьи, когда выносят решение?",
  "Tylko Konstytucji i ustawom": "Только Конституции и законам",
  "Ministrowi Sprawiedliwości": "Министру юстиции",
  "Uchwałom Sejmu": "Постановлениям Сейма",
  "Wytycznym prokuratora": "Указаниям прокурора",
  "Sędziowie są niezawiśli i podlegają wyłącznie Konstytucji oraz ustawom.":
    "Судьи независимы и подчиняются только Конституции и законам.",
  "Kto może otrzymać obrońcę z urzędu?": "Кто может получить защитника по назначению?",
  "Osoba, której nie stać na adwokata": "Тот, кому адвокат не по средствам",
  "Każdy, kto o to poprosi": "Каждый, кто об этом попросит",
  "Tylko cudzoziemcy": "Только иностранцы",
  "Nikt — obrońcę trzeba opłacić": "Никто — защитника нужно оплатить",
  "Sąd wyznacza obrońcę z urzędu, gdy oskarżony nie ma środków na obronę.":
    "Суд назначает защитника, когда у обвиняемого нет средств на защиту.",
  "Kto wykonuje prawomocne orzeczenia sądu, gdy dłużnik ich nie wypełnia?":
    "Кто исполняет вступившие в силу решения суда, когда должник их не выполняет?",
  "Policja": "Полиция",
  "Komornik sądowy prowadzi egzekucję.": "Судебный пристав ведёт взыскание.",
  "Jak nazywa się podstawowa jednostka samorządu terytorialnego?":
    "Как называется основная единица территориального самоуправления?",
  "Sołectwo": "Солецтво",
  "Gmina odpowiada za wszystko, czego nie zastrzeżono dla innych szczebli.":
    "Гмина отвечает за всё, что не закреплено за другими уровнями.",
  "Kto kieruje gminą wiejską?": "Кто руководит сельской гминой?",
  "Wójt": "Wójt",
  "Burmistrz": "Бурмистр",
  "Starosta": "Староста",
  "Wójt na wsi, burmistrz w mieście, prezydent w większym mieście.":
    "Wójt в селе, бурмистр в городе, президент в большом городе.",
  "Kto stoi na czele powiatu?": "Кто стоит во главе повята?",
  "Starosta, wybierany przez radę powiatu.": "Староста, которого избирает совет повята.",
  "Który szczebel samorządu zarządza funduszami europejskimi w regionie?":
    "Какой уровень самоуправления распоряжается европейскими фондами в регионе?",
  "Samorząd województwa odpowiada za rozwój regionu i programy regionalne.":
    "Самоуправление воеводства отвечает за развитие региона и региональные программы.",
  "Co ile lat odbywają się wybory samorządowe?":
    "Раз в сколько лет проходят выборы в органы самоуправления?",
  "Co 3 lata": "Раз в 3 года",
  "Co 4 lata": "Раз в 4 года",
  "Co 5 lat": "Раз в 5 лет",
  "Co 6 lat": "Раз в 6 лет",
  "Co 5 lat — kadencję wydłużono z czterech lat w 2018 roku.":
    "Раз в 5 лет — срок продлили с четырёх лет в 2018 году.",
  "Skąd gmina bierze dochody własne?": "Откуда гмина берёт собственные доходы?",
  "Z podatku od nieruchomości i opłat lokalnych": "Из налога на недвижимость и местных сборов",
  "Wyłącznie z dotacji rządowych": "Только из правительственных дотаций",
  "Z podatku VAT": "Из налога VAT",
  "Ze składek zdrowotnych": "Из взносов на здравоохранение",
  "Do tego dochodzi udział w PIT i CIT oraz subwencje z budżetu państwa.":
    "К этому добавляется доля в PIT и CIT, а также субвенции из государственного бюджета.",
  "Jak nazywa się jednostka pomocnicza gminy na wsi?":
    "Как называется вспомогательная единица гмины в селе?",
  "Dzielnica": "Дзельница, городской район",
  "Osiedle": "Оседле, жилой посёлок",
  "Obwód": "Обвод",
  "Sołectwo, z sołtysem na czele. W mieście są dzielnice albo osiedla.":
    "Солецтво, во главе с солтысом. В городе это дзельницы или оседле.",
  "Jak mieszkańcy mogą odwołać wójta przed końcem kadencji?":
    "Как жители могут отозвать wójta до конца срока?",
  "W referendum lokalnym": "Местным референдумом",
  "Uchwałą wojewody": "Постановлением воеводы",
  "Decyzją premiera": "Решением премьера",
  "Nie da się tego zrobić": "Этого сделать нельзя",
  "Referendum lokalne może odwołać zarówno wójta, jak i radę.":
    "Местный референдум может отозвать и wójta, и совет.",
  "Który szczebel samorządu wydaje prawo jazdy i rejestruje pojazdy?":
    "Какой уровень самоуправления выдаёт водительские права и регистрирует машины?",
  "Starostwo powiatowe. Gmina zajmuje się szkołami podstawowymi i sprawami lokalnymi.":
    "Староство повята. Гмина занимается начальными школами и местными делами.",
  "Który władca przyjął chrzest w 966 roku?": "Какой правитель принял крещение в 966 году?",
  "Mieszko I": "Мешко I",
  "Bolesław Chrobry": "Болеслав Храбрый",
  "Kazimierz Wielki": "Казимир Великий",
  "Władysław Jagiełło": "Владислав Ягайло",
  "Mieszko I, książę Polan. Jego syn Bolesław Chrobry koronował się w 1025 roku.":
    "Мешко I, князь полян. Его сын Болеслав Храбрый короновался в 1025 году.",
  "Jak nazywała się pierwsza dynastia panująca w Polsce?":
    "Как называлась первая правящая династия в Польше?",
  "Piastowie": "Пясты",
  "Jagiellonowie": "Ягеллоны",
  "Wazowie": "Вазы",
  "Habsburgowie": "Габсбурги",
  "Piastowie, od Mieszka I do 1370 roku. Potem przyszli Jagiellonowie.":
    "Пясты, от Мешко I до 1370 года. Потом пришли Ягеллоны.",
  "Kto był pierwszym koronowanym królem Polski?": "Кто был первым коронованным королём Польши?",
  "Władysław Łokietek": "Владислав Локетек",
  "Bolesław Chrobry, w 1025 roku. Mieszko I był księciem, nie królem.":
    "Болеслав Храбрый, в 1025 году. Мешко I был князем, а не королём.",
  "O którym władcy mówi się, że „zastał Polskę drewnianą, a zostawił murowaną”?":
    "О каком правителе говорят, что он «застал Польшу деревянной, а оставил каменной»?",
  "O Bolesławie Chrobrym": "О Болеславе Храбром",
  "O Kazimierzu Wielkim": "О Казимире Великом",
  "O Władysławie Jagielle": "О Владиславе Ягайло",
  "O Janie III Sobieskim": "О Яне III Собеском",
  "O Kazimierzu Wielkim (1333–1370), ostatnim królu z dynastii Piastów.":
    "О Казимире Великом (1333–1370), последнем короле из династии Пястов.",
  "Co ustaliła unia lubelska z 1569 roku?": "Что установила Люблинская уния 1569 года?",
  "Powstanie Rzeczypospolitej Obojga Narodów": "Возникновение Речи Посполитой Обоих Народов",
  "Chrzest Litwy": "Крещение Литвы",
  "Rozejm z Krzyżakami": "Перемирие с крестоносцами",
  "Powrót stolicy do Gniezna": "Возвращение столицы в Гнезно",
  "Polska i Litwa utworzyły jedno państwo ze wspólnym sejmem i wspólnym królem.":
    "Польша и Литва создали одно государство с общим сеймом и общим королём.",
  "Co oznaczało liberum veto?": "Что означало liberum veto?",
  "Że jeden poseł mógł zerwać obrady sejmu": "Что один депутат мог сорвать заседание сейма",
  "Że król mógł odrzucić każdą ustawę": "Что король мог отклонить любой закон",
  "Że szlachta wybierała króla": "Что шляхта избирала короля",
  "Że mieszczanie mieli głos w sejmie": "Что мещане имели голос в сейме",
  "Sprzeciw jednego posła unieważniał obrady — z czasem sparaliżowało to państwo.":
    "Возражение одного депутата отменяло заседание — со временем это парализовало государство.",
  "Co wydarzyło się w 1385 roku w Krewie?": "Что произошло в 1385 году в Крево?",
  "Zawarto unię Polski z Litwą": "Была заключена уния Польши с Литвой",
  "Wybuchła wojna z Krzyżakami": "Началась война с крестоносцами",
  "Uchwalono pierwszą konstytucję": "Была принята первая конституция",
  "Przeniesiono stolicę do Warszawy": "Столицу перенесли в Варшаву",
  "Jagiełło przyjął chrzest, ożenił się z Jadwigą i został królem Polski.":
    "Ягайло принял крещение, женился на Ядвиге и стал королём Польши.",
  "Kto ogłosił teorię heliocentryczną w polskim złotym wieku?":
    "Кто провозгласил гелиоцентрическую теорию в польский золотой век?",
  "Mikołaj Kopernik": "Николай Коперник",
  "Jan Kochanowski": "Ян Кохановский",
  "Jan Długosz": "Ян Длугош",
  "Andrzej Frycz Modrzewski": "Анджей Фрыч Моджевский",
  "Mikołaj Kopernik. Kochanowski był poetą piszącym po polsku zamiast po łacinie.":
    "Николай Коперник. Кохановский был поэтом, писавшим по-польски, а не на латыни.",
  "Które miasto było pierwszą stolicą Polski?": "Какой город был первой столицей Польши?",
  "Gniezno": "Гнезно",
  "Gniezno; tam w 1000 roku doszło do zjazdu z cesarzem Ottonem III.":
    "Гнезно; там в 1000 году состоялся съезд с императором Оттоном III.",
  "Które państwa dokonały rozbiorów Polski?": "Какие государства произвели разделы Польши?",
  "Rosja, Prusy i Austria": "Россия, Пруссия и Австрия",
  "Rosja, Szwecja i Turcja": "Россия, Швеция и Турция",
  "Prusy, Francja i Austria": "Пруссия, Франция и Австрия",
  "Austria, Węgry i Rosja": "Австрия, Венгрия и Россия",
  "Trzy rozbiory w latach 1772, 1793 i 1795.": "Три раздела в 1772, 1793 и 1795 годах.",
  "W którym roku doszło do trzeciego rozbioru Polski?":
    "В каком году произошёл третий раздел Польши?",
  "1772": "1772",
  "1795": "1795",
  "1795 — po nim państwo polskie zniknęło z mapy na 123 lata.":
    "1795-й — после него польское государство исчезло с карты на 123 года.",
  "Kto poprowadził insurekcję z 1794 roku?": "Кто возглавил восстание 1794 года?",
  "Tadeusz Kościuszko": "Тадеуш Костюшко",
  "Romuald Traugutt": "Ромуальд Траугутт",
  "Jan Henryk Dąbrowski": "Ян Хенрик Домбровский",
  "Tadeusz Kościuszko. Po klęsce nastąpił trzeci rozbiór.":
    "Тадеуш Костюшко. После поражения последовал третий раздел.",
  "W którym roku wybuchło powstanie listopadowe?": "В каком году началось Ноябрьское восстание?",
  "1846": "1846",
  "1863": "1863",
  "1830, w Warszawie, przeciw Rosji. Styczniowe wybuchło w 1863.":
    "1830 год, в Варшаве, против России. Январское началось в 1863-м.",
  "Który zabór uzyskał w 1867 roku autonomię z polskimi szkołami i sejmem?":
    "Какая из захваченных частей получила в 1867 году автономию с польскими школами и сеймом?",
  "Rosyjski": "Российская",
  "Pruski": "Прусская",
  "Austriacki": "Австрийская",
  "Żaden": "Никакая",
  "Galicja w zaborze austriackim — uboga, ale z sejmem krajowym we Lwowie.":
    "Галиция в австрийской части — бедная, но со своим краевым сеймом во Львове.",
  "Na czym polegała praca organiczna?": "В чём состояла органическая работа?",
  "Na zakładaniu szkół, spółdzielni i czytelni zamiast zbrojnych zrywów":
    "В создании школ, кооперативов и читален вместо вооружённых выступлений",
  "Na przygotowaniach do kolejnego powstania": "В подготовке к следующему восстанию",
  "Na emigracji zarobkowej do Ameryki": "В трудовой эмиграции в Америку",
  "Na współpracy z władzami zaborczymi w administracji":
    "В сотрудничестве с властями захватчиков в администрации",
  "Kierunek przyjęty po klęsce 1863 roku: wzmacnianie społeczeństwa zamiast walki zbrojnej.":
    "Направление, принятое после поражения 1863 года: укреплять общество вместо вооружённой борьбы.",
  "Za co Maria Skłodowska-Curie otrzymała pierwszą Nagrodę Nobla w 1903 roku?":
    "За что Мария Склодовская-Кюри получила первую Нобелевскую премию в 1903 году?",
  "Za fizykę": "За физику",
  "Za chemię": "За химию",
  "Za literaturę": "За литературу",
  "Za medycynę": "За медицину",
  "Fizyka w 1903, chemia w 1911 — jako pierwsza osoba uhonorowana Noblem dwukrotnie.":
    "Физика в 1903-м, химия в 1911-м — она первая, кого отметили Нобелевской премией дважды.",
  "Który kompozytor jest najbardziej znanym Polakiem epoki romantyzmu?":
    "Какой композитор — самый известный поляк эпохи романтизма?",
  "Karol Szymanowski": "Кароль Шимановский",
  "Stanisław Moniuszko": "Станислав Монюшко",
  "Fryderyk Chopin. Jego imię nosi konkurs pianistyczny w Warszawie.":
    "Фридерик Шопен. Его имя носит фортепианный конкурс в Варшаве.",
  "Komu Rada Regencyjna przekazała władzę wojskową 11 listopada 1918 roku?":
    "Кому Регентский совет передал военную власть 11 ноября 1918 года?",
  "Józefowi Piłsudskiemu": "Юзефу Пилсудскому",
  "Romanowi Dmowskiemu": "Роману Дмовскому",
  "Ignacemu Paderewskiemu": "Игнацию Падеревскому",
  "Wincentemu Witosowi": "Винценту Витосу",
  "Józefowi Piłsudskiemu. Dzień ten jest dziś Narodowym Świętem Niepodległości.":
    "Юзефу Пилсудскому. Этот день сегодня — Национальный праздник независимости.",
  "Jak nazywa się reforma, która w 1924 roku wprowadziła złotego?":
    "Как называется реформа, которая в 1924 году ввела злотый?",
  "Reforma Grabskiego": "Реформа Грабского",
  "Plan Balcerowicza": "План Бальцеровича",
  "Reforma Wielopolskiego": "Реформа Велёпольского",
  "Plan Marshalla": "План Маршалла",
  "Reforma Władysława Grabskiego. Plan Balcerowicza to rok 1990.":
    "Реформа Владислава Грабского. План Бальцеровича — это 1990 год.",
  "Który port zbudowano od podstaw w dwudziestoleciu międzywojennym?":
    "Какой порт построили с нуля в межвоенное двадцатилетие?",
  "Gdynię": "Гдыню",
  "Szczecin": "Щецин",
  "Świnoujście": "Свиноуйсьце",
  "Gdynię, od 1926 roku — Gdańsk był wtedy Wolnym Miastem.":
    "Гдыню, с 1926 года — Гданьск был тогда Вольным городом.",
  "Jaka część mieszkańców II Rzeczypospolitej należała do mniejszości narodowych?":
    "Какая часть жителей Второй Речи Посполитой принадлежала к национальным меньшинствам?",
  "Około jedna dziesiąta": "Около одной десятой",
  "Około jedna trzecia": "Около одной трети",
  "Około połowa": "Около половины",
  "Prawie nikt": "Почти никто",
  "Około jednej trzeciej: Ukraińcy, Żydzi, Białorusini, Niemcy, Litwini. Dziś kraj jest jednolity narodowościowo.":
    "Около одной трети: украинцы, евреи, белорусы, немцы, литовцы. Сегодня страна однородна по национальному составу.",
  "Ile systemów prawnych odziedziczyła Polska po zaborcach w 1918 roku?":
    "Сколько правовых систем Польша унаследовала от захватчиков в 1918 году?",
  "Jeden": "Одну",
  "Dwa": "Две",
  "Sześć": "Шесть",
  "Trzy — po każdym z zaborców. Do tego różne koleje i cztery waluty w obiegu.":
    "Три — от каждого из захватчиков. К тому же разные железные дороги и четыре валюты в обращении.",
  "Jak nazywano okres rządów obozu piłsudczykowskiego po 1926 roku?":
    "Как называли период правления лагеря Пилсудского после 1926 года?",
  "Sanacja": "Санация",
  "Odwilż": "Оттепель",
  "Transformacja": "Трансформация",
  "Restauracja": "Реставрация",
  "Sanacja, czyli „uzdrowienie”. Rola parlamentu w tym czasie malała.":
    "Санация, то есть «оздоровление». Роль парламента в это время уменьшалась.",
  "W którym roku uchwalono konstytucję marcową?": "В каком году приняли Мартовскую конституцию?",
  "1921": "1921",
  "1926": "1926",
  "1935": "1935",
  "1921. Konstytucja kwietniowa to 1935 rok.": "1921-й. Апрельская конституция — это 1935 год.",
  "Od ostrzału którego miejsca rozpoczęła się II wojna światowa?":
    "С обстрела какого места началась Вторая мировая война?",
  "Westerplatte": "Вестерплатте",
  "Wawelu": "Вавеля",
  "Twierdzy Modlin": "Крепости Модлин",
  "Helu": "Хеля",
  "Westerplatte pod Gdańskiem, 1 września 1939 roku o świcie.":
    "Вестерплатте под Гданьском, 1 сентября 1939 года на рассвете.",
  "Które państwo zaatakowało Polskę 17 września 1939 roku?":
    "Какое государство напало на Польшу 17 сентября 1939 года?",
  "Związek Radziecki": "Советский Союз",
  "Węgry": "Венгрия",
  "Słowacja": "Словакия",
  "Rumunia": "Румыния",
  "ZSRR, wykonując tajny protokół paktu Ribbentrop–Mołotow.":
    "СССР, исполняя секретный протокол пакта Риббентропа — Молотова.",
  "Jak nazywała się największa podziemna armia okupowanej Europy?":
    "Как называлась самая большая подпольная армия оккупированной Европы?",
  "Armia Ludowa": "Армия Людова",
  "Legiony Polskie": "Польские легионы",
  "Bataliony Chłopskie": "Крестьянские батальоны",
  "Armia Krajowa, podległa rządowi w Londynie.":
    "Армия Крайова, подчинённая правительству в Лондоне.",
  "W którym roku wybuchło powstanie w getcie warszawskim?":
    "В каком году началось восстание в Варшавском гетто?",
  "1942": "1942",
  "1943": "1943",
  "Kwiecień 1943. Powstanie Warszawskie to sierpień 1944 — to dwa różne zrywy.":
    "Апрель 1943 года. Варшавское восстание — это август 1944-го; это два разных выступления.",
  "Ile dni trwało Powstanie Warszawskie?": "Сколько дней длилось Варшавское восстание?",
  "23 dni": "23 дня",
  "43 dni": "43 дня",
  "63 dni": "63 дня",
  "83 dni": "83 дня",
  "63 dni, od 1 sierpnia 1944. Po jego upadku miasto zostało celowo zburzone.":
    "63 дня, с 1 августа 1944 года. После его поражения город был намеренно разрушен.",
  "Co wydarzyło się w Katyniu wiosną 1940 roku?": "Что произошло в Катыни весной 1940 года?",
  "NKWD zamordowało blisko 22 tysiące polskich oficerów":
    "НКВД убило почти 22 тысячи польских офицеров",
  "Wybuchło powstanie przeciw Niemcom": "Началось восстание против немцев",
  "Podpisano rozejm z ZSRR": "Было подписано перемирие с СССР",
  "Utworzono getto": "Было создано гетто",
  "Zbrodnia katyńska — mord na oficerach, policjantach i urzędnikach, przez dekady zaprzeczany.":
    "Катынское преступление — убийство офицеров, полицейских и чиновников, десятилетиями отрицавшееся.",
  "Jak nazywała się organizacja niosąca w okupowanej Polsce pomoc Żydom?":
    "Как называлась организация, помогавшая евреям в оккупированной Польше?",
  "Żegota": "«Жегота»",
  "Żagiew": "«Жагев»",
  "Zośka": "«Зоська»",
  "Wachlarz": "«Вахляж»",
  "Rada Pomocy Żydom „Żegota”. Za pomoc groziła kara śmierci, także dla całej rodziny.":
    "Совет помощи евреям «Жегота». За помощь грозила смертная казнь, в том числе всей семье.",
  "Którą bitwę stoczyli w 1944 roku żołnierze generała Andersa we Włoszech?":
    "Какое сражение вели в 1944 году солдаты генерала Андерса в Италии?",
  "O Monte Cassino": "За Монте-Кассино",
  "Pod Lenino": "Под Ленино",
  "Pod Falaise": "Под Фалезом",
  "O Arnhem": "За Арнем",
  "Monte Cassino, po przejściu szlaku przez Bliski Wschód.":
    "Монте-Кассино, пройдя путь через Ближний Восток.",
  "Jaką część ludności straciła Polska w czasie II wojny światowej?":
    "Какую часть населения Польша потеряла во Второй мировой войне?",
  "Około jedną dwudziestą": "Около одной двадцатой части",
  "Około jedną dziesiątą": "Около одной десятой части",
  "Około jedną piątą": "Около одной пятой части",
  "Około połowę": "Около половины населения",
  "Około 6 milionów osób, blisko jedna piąta przedwojennej ludności.":
    "Около 6 миллионов человек, почти пятая часть довоенного населения.",
  "Jak nazywała się partia rządząca w PRL?": "Как называлась правящая партия в ПНР?",
  "PZPR": "PZPR",
  "PSL": "PSL",
  "AK": "AK",
  "NSZZ": "NSZZ",
  "Polska Zjednoczona Partia Robotnicza, jedyna partia sprawująca władzę.":
    "Польская объединённая рабочая партия, единственная партия у власти.",
  "W której stoczni wybuchł strajk, który doprowadził do powstania Solidarności?":
    "На какой верфи вспыхнула забастовка, из которой выросла «Солидарность»?",
  "W Gdańskiej": "На Гданьской",
  "W Szczecińskiej": "На Щецинской",
  "W Gdyńskiej": "На Гдыньской",
  "W Ustce": "В Устке",
  "Stocznia Gdańska, sierpień 1980. Strajki objęły też Szczecin i inne miasta.":
    "Гданьская верфь, август 1980 года. Забастовки охватили и Щецин, и другие города.",
  "Kto stanął na czele Solidarności w 1980 roku?":
    "Кто встал во главе «Солидарности» в 1980 году?",
  "Jacek Kuroń": "Яцек Куронь",
  "Bronisław Geremek": "Бронислав Геремек",
  "Lech Wałęsa, elektryk ze Stoczni Gdańskiej, późniejszy prezydent.":
    "Лех Валенса, электрик с Гданьской верфи, впоследствии президент.",
  "Kto wprowadził stan wojenny 13 grudnia 1981 roku?":
    "Кто ввёл военное положение 13 декабря 1981 года?",
  "Edward Gierek": "Эдвард Герек",
  "Władysław Gomułka": "Владислав Гомулка",
  "Stanisław Kania": "Станислав Каня",
  "Generał Wojciech Jaruzelski. Solidarność została zdelegalizowana, działacze internowani.":
    "Генерал Войцех Ярузельский. «Солидарность» объявили вне закона, активистов интернировали.",
  "W którym roku Karol Wojtyła został papieżem?":
    "В каком году Кароль Войтыла стал папой римским?",
  "1978": "1978",
  "1978. Jego pielgrzymka do Polski rok później miała ogromne znaczenie społeczne.":
    "1978 год. Его паломничество в Польшу годом позже имело огромное общественное значение.",
  "Jak nazywano nielegalny obieg książek i pism w PRL?":
    "Как называли нелегальное распространение книг и журналов в ПНР?",
  "Drugi obieg": "Второй оборот",
  "Czarna prasa": "Чёрная пресса",
  "Wolne słowo": "Свободное слово",
  "Podziemna poczta": "Подпольная почта",
  "Drugi obieg, zwany też samizdatem — druk i kolportaż poza cenzurą.":
    "Второй оборот, он же самиздат — печать и распространение в обход цензуры.",
  "Jaki organ powstał po strajkach w Radomiu i Ursusie w 1976 roku?":
    "Какой орган возник после забастовок в Радоме и Урсусе в 1976 году?",
  "Komitet Obrony Robotników": "Комитет защиты рабочих",
  "Polska Zjednoczona Partia Robotnicza": "Польская объединённая рабочая партия",
  "Rada Państwa": "Государственный совет",
  "KOR — inteligenci wspierający represjonowanych robotników; jeden z korzeni Solidarności.":
    "KOR — интеллигенты, поддерживавшие репрессированных рабочих; один из корней «Солидарности».",
  "Co oznaczały kartki w PRL?": "Что означали карточки в ПНР?",
  "Reglamentację towarów, na przykład mięsa i cukru":
    "Нормирование товаров, например мяса и сахара",
  "Bilety komunikacji miejskiej": "Билеты городского транспорта",
  "Zaproszenia na zebrania partyjne": "Приглашения на партийные собрания",
  "Legitymacje szkolne": "Школьные удостоверения",
  "System kartkowy przydzielał ograniczone ilości towarów w gospodarce niedoboru.":
    "Карточная система выдавала ограниченное количество товаров в экономике дефицита.",
  "Jak nazywały się rozmowy władzy z opozycją wiosną 1989 roku?":
    "Как назывались переговоры власти с оппозицией весной 1989 года?",
  "Porozumienia sierpniowe": "Августовские соглашения",
  "Konferencja w Poczdamie": "Потсдамская конференция",
  "Pakt gdański": "Гданьский пакт",
  "Okrągły Stół; ustalono na nim częściowo wolne wybory 4 czerwca.":
    "Круглый стол; на нём договорились о частично свободных выборах 4 июня.",
  "Kto został pierwszym niekomunistycznym premierem w bloku wschodnim?":
    "Кто стал первым некоммунистическим премьером в восточном блоке?",
  "Leszek Balcerowicz": "Лешек Бальцерович",
  "Jan Olszewski": "Ян Ольшевский",
  "Tadeusz Mazowiecki, we wrześniu 1989 roku.": "Тадеуш Мазовецкий, в сентябре 1989 года.",
  "Jak nazywał się program reform gospodarczych z 1990 roku?":
    "Как называлась программа экономических реформ 1990 года?",
  "Program Wilczka": "Программа Вильчека",
  "Plan Balcerowicza otworzył rynek; ceny wzrosły, ale zniknęły puste półki.":
    "План Бальцеровича открыл рынок; цены выросли, но пустые полки исчезли.",
  "Co zmieniła reforma administracyjna z 1999 roku?":
    "Что изменила административная реформа 1999 года?",
  "49 województw zastąpiono 16 i przywrócono powiaty":
    "49 воеводств заменили на 16 и вернули повяты",
  "Zniesiono gminy": "Упразднили гмины",
  "Wprowadzono podział na dzielnice": "Ввели деление на дзельницы",
  "Połączono województwa z powiatami": "Объединили воеводства с повятами",
  "Z 49 województw zrobiono 16, a powiaty wróciły jako środkowy szczebel.":
    "Из 49 воеводств сделали 16, а повяты вернулись как средний уровень.",
  "Ilu członków miało Zgromadzenie Narodowe wybrać na prezydenta w 1989 roku, zanim wprowadzono wybory powszechne?":
    "Сколько человек Национальное собрание должно было избрать президентом в 1989 году, до того как ввели всеобщие выборы?",
  "Prezydenta wybrało wtedy Zgromadzenie Narodowe, nie obywatele":
    "Президента тогда избрало Национальное собрание, а не граждане",
  "Prezydenta wybrali obywatele już w 1989 roku": "Президента граждане избрали уже в 1989 году",
  "Urzędu prezydenta wtedy nie było": "Должности президента тогда не было",
  "Prezydenta wskazał premier": "Президента назначил премьер",
  "W 1989 roku prezydenta wybrało Zgromadzenie Narodowe; pierwsze wybory powszechne odbyły się rok później.":
    "В 1989 году президента избрало Национальное собрание; первые всеобщие выборы прошли годом позже.",
  "Co wydarzyło się 10 kwietnia 2010 roku?": "Что произошло 10 апреля 2010 года?",
  "Katastrofa samolotu pod Smoleńskiem": "Авиакатастрофа под Смоленском",
  "Wejście do strefy Schengen": "Вступление в Шенгенскую зону",
  "Referendum europejskie": "Европейский референдум",
  "Powódź tysiąclecia": "Наводнение тысячелетия",
  "Zginęło 96 osób, w tym prezydent Lech Kaczyński. Delegacja leciała na obchody rocznicy zbrodni katyńskiej.":
    "Погибли 96 человек, в том числе президент Лех Качиньский. Делегация летела на годовщину катынского преступления.",
  "W którym roku odbyły się w Polsce pierwsze wolne wybory samorządowe?":
    "В каком году в Польше прошли первые свободные выборы в органы самоуправления?",
  "1990 — odrodziły się wtedy gminy jako samorząd.":
    "1990-й — тогда гмины возродились как самоуправление.",
  "Z iloma państwami graniczy Polska?": "Со сколькими государствами граничит Польша?",
  "Z pięcioma": "С пятью",
  "Z sześcioma": "С шестью",
  "Z siedmioma": "С семью",
  "Z ośmioma": "С восемью",
  "Siedem: Niemcy, Czechy, Słowacja, Ukraina, Białoruś, Litwa i Rosja.":
    "Семь: Германия, Чехия, Словакия, Украина, Беларусь, Литва и Россия.",
  "Nad którym morzem leży Polska?": "На каком море лежит Польша?",
  "Nad Bałtykiem": "На Балтийском",
  "Nad Morzem Północnym": "На Северном море",
  "Nad Adriatykiem": "На Адриатическом",
  "Nad Morzem Czarnym": "На Чёрном море",
  "Nad Morzem Bałtyckim, na północy kraju.": "На Балтийском море, на севере страны.",
  "Ile wynosi powierzchnia Polski?": "Какова площадь Польши?",
  "Około 213 tysięcy km²": "Около 213 тысяч км²",
  "Około 312 tysięcy km²": "Около 312 тысяч км²",
  "Około 412 tysięcy km²": "Около 412 тысяч км²",
  "Około 512 tysięcy km²": "Около 512 тысяч км²",
  "Około 312 700 km² — szóste miejsce w Unii Europejskiej.":
    "Около 312 700 км² — шестое место в Европейском союзе.",
  "Jak nazywa się kraina jezior na północnym wschodzie kraju?":
    "Как называется озёрный край на северо-востоке страны?",
  "Podlasie": "Подляшье",
  "Kaszuby": "Кашубы",
  "Kujawy": "Куявы",
  "Mazury; największe jezioro to Śniardwy.": "Мазуры; самое большое озеро — Снярдвы.",
  "Które zwierzę jest symbolem Puszczy Białowieskiej?":
    "Какое животное — символ Беловежской пущи?",
  "Żubr": "Зубр",
  "Ryś": "Рысь",
  "Niedźwiedź": "Медведь",
  "Bocian": "Аист",
  "Żubr. Puszcza Białowieska jest ostatnim fragmentem pierwotnej puszczy niżowej Europy.":
    "Зубр. Беловежская пуща — последний участок первобытного равнинного леса Европы.",
  "Jaki klimat panuje w Polsce?": "Какой климат в Польше?",
  "Umiarkowany przejściowy": "Умеренный переходный",
  "Śródziemnomorski": "Средиземноморский",
  "Kontynentalny suchy": "Континентальный сухой",
  "Oceaniczny wilgotny": "Океанический влажный",
  "Przejściowy między morskim a kontynentalnym — stąd zmienna pogoda i wyraźne cztery pory roku.":
    "Переходный между морским и континентальным — отсюда переменчивая погода и отчётливые четыре времени года.",
  "Ile parków narodowych jest w Polsce?": "Сколько в Польше национальных парков?",
  "23": "23",
  "23. Najwyżej położony to Tatrzański, nad morzem leży Słowiński z ruchomymi wydmami.":
    "23. Самый высокогорный — Татранский, у моря лежит Словинский с подвижными дюнами.",
  "W którym kierunku opada rzeźba terenu Polski?": "В каком направлении понижается рельеф Польши?",
  "Z południa na północ": "С юга на север",
  "Ze wschodu na zachód": "С востока на запад",
  "Z północy na południe": "С севера на юг",
  "Z zachodu na wschód": "С запада на восток",
  "Góry na południu, niziny i wybrzeże na północy — dlatego rzeki płyną na północ.":
    "Горы на юге, низменности и побережье на севере — поэтому реки текут на север.",
  "Ile metrów wysokości mają Rysy?": "Какой высоты Рысы?",
  "1602 m": "1602 м",
  "2499 m": "2499 м",
  "3000 m": "3000 м",
  "1725 m": "1725 м",
  "2499 m n.p.m. Śnieżka w Karkonoszach ma 1602 m.":
    "2499 м над уровнем моря. Снежка в Карконошах — 1602 м.",
  "Które miasto jest stolicą Polski?": "Какой город — столица Польши?",
  "Warszawa, od końca XVI wieku. Wcześniej stolicą był Kraków.":
    "Варшава, с конца XVI века. Раньше столицей был Краков.",
  "Ile mniej więcej osób mieszka w Polsce?": "Сколько примерно человек живёт в Польше?",
  "Około 18 milionów": "Около 18 миллионов",
  "Około 28 milionów": "Около 28 миллионов",
  "Około 37 milionów": "Около 37 миллионов",
  "Około 50 milionów": "Около 50 миллионов",
  "Około 37–38 milionów.": "Около 37–38 миллионов.",
  "Które miasto jest największym portem Polski?": "Какой город — самый большой порт Польши?",
  "Kołobrzeg": "Колобжег",
  "Gdańsk — także miasto porozumień sierpniowych i początku Solidarności.":
    "Гданьск — и город Августовских соглашений, и место, где началась «Солидарность».",
  "Nad którą rzeką leży Wrocław?": "На какой реке стоит Вроцлав?",
  "Nad Wisłą": "На Висле",
  "Nad Odrą": "На Одре",
  "Nad Wartą": "На Варте",
  "Nad Bugiem": "На Буге",
  "Nad Odrą. Poznań leży nad Wartą, Warszawa i Kraków nad Wisłą.":
    "На Одре. Познань стоит на Варте, Варшава и Краков — на Висле.",
  "Który obiekt w Polsce wpisano na listę UNESCO jako kopalnię czynną od średniowiecza?":
    "Какой объект в Польше внесли в список ЮНЕСКО как шахту, работающую со Средневековья?",
  "Wieliczkę": "Величку",
  "Zamość": "Замосць",
  "Malbork": "Мальборк",
  "Toruń": "Торунь",
  "Kopalnia soli w Wieliczce, z kaplicami wykutymi w solnej skale.":
    "Соляная шахта в Величке, с часовнями, вырубленными в соляной породе.",
  "Za co wpisano warszawską Starówkę na listę UNESCO?":
    "За что варшавский Старый город внесли в список ЮНЕСКО?",
  "Za powojenną odbudowę zniszczonego miasta":
    "За послевоенное восстановление разрушенного города",
  "Za zachowane oryginalne mury średniowieczne": "За сохранившиеся подлинные средневековые стены",
  "Za architekturę modernistyczną": "За модернистскую архитектуру",
  "Za układ urbanistyczny z XIX wieku": "За градостроительную планировку XIX века",
  "Właśnie za odbudowę — wyjątkowy przypadek na tej liście.":
    "Именно за восстановление — исключительный случай в этом списке.",
  "Które województwo ma siedziby władz w dwóch różnych miastach?":
    "У какого воеводства органы власти сидят в двух разных городах?",
  "Kujawsko-pomorskie": "Куявско-Поморское",
  "Mazowieckie": "Мазовецкое",
  "Małopolskie": "Малопольское",
  "Podlaskie": "Подляское",
  "Sejmik obraduje w Toruniu, a wojewoda urzęduje w Bydgoszczy. Podobnie dzieli się województwo lubuskie.":
    "Сеймик заседает в Торуни, а воевода сидит в Быдгоще. Так же разделено и Любушское воеводство.",
  "Jaki język ma w Polsce status języka regionalnego?":
    "Какой язык имеет в Польше статус регионального?",
  "Kaszubski": "Кашубский",
  "Śląski": "Силезский",
  "Łemkowski": "Лемковский",
  "Góralski": "Гуральский",
  "Kaszubski. Uznanych mniejszości narodowych jest dziewięć, etnicznych cztery.":
    "Кашубский. Признанных национальных меньшинств девять, этнических — четыре.",
  "Które miasto jest siedzibą Uniwersytetu Jagiellońskiego?":
    "В каком городе находится Ягеллонский университет?",
  "Lublin": "Люблин",
  "Kraków; uczelnia działa od 1364 roku.": "Краков; университет работает с 1364 года.",
  "Na ile groszy dzieli się złoty?": "На сколько грошей делится злотый?",
  "1000": "1000",
  "Na 100 groszy.": "На 100 грошей.",
  "Który bank emituje polski pieniądz?": "Какой банк выпускает польские деньги?",
  "Bank Gospodarstwa Krajowego": "Bank Gospodarstwa Krajowego",
  "Europejski Bank Centralny": "Европейский центральный банк",
  "PKO BP": "PKO BP",
  "Narodowy Bank Polski. EBC emituje euro, którego Polska nie przyjęła.":
    "Национальный банк Польши. ЕЦБ выпускает евро, которое Польша не приняла.",
  "Ile wynosi podstawowa stawka VAT?": "Какова базовая ставка VAT?",
  "19 procent": "19 процентов",
  "21 procent": "21 процент",
  "23 procent": "23 процента",
  "25 procent": "25 процентов",
  "23 procent. Na żywność, książki i niektóre usługi obowiązują stawki niższe.":
    "23 процента. На продукты, книги и некоторые услуги действуют пониженные ставки.",
  "Ile dni urlopu przysługuje pracownikowi ze stażem powyżej 10 lat?":
    "Сколько дней отпуска полагается работнику со стажем больше 10 лет?",
  "20 dni": "20 дней",
  "24 dni": "24 дня",
  "26 dni": "26 дней",
  "26 dni. Poniżej 10 lat stażu — 20 dni. Nauka wlicza się do stażu.":
    "26 дней. При стаже меньше 10 лет — 20 дней. Учёба засчитывается в стаж.",
  "Która instytucja pobiera składki emerytalne i rentowe?":
    "Какое учреждение собирает пенсионные взносы и взносы по нетрудоспособности?",
  "ZUS": "ZUS",
  "NBP": "NBP",
  "KRUS dla wszystkich": "KRUS для всех",
  "Zakład Ubezpieczeń Społecznych. NFZ finansuje leczenie, KRUS dotyczy rolników.":
    "Zakład Ubezpieczeń Społecznych, управление социального страхования. NFZ финансирует лечение, KRUS касается фермеров.",
  "W jakim wieku przechodzą na emeryturę kobiety i mężczyźni?":
    "В каком возрасте выходят на пенсию женщины и мужчины?",
  "Kobiety w wieku 60 lat, mężczyźni 65": "Женщины в 60 лет, мужчины в 65",
  "Wszyscy w wieku 65 lat": "Все в 65 лет",
  "Kobiety 62, mężczyźni 67": "Женщины в 62, мужчины в 67",
  "Wszyscy w wieku 67 lat": "Все в 67 лет",
  "60 i 65 lat. Wysokość emerytury zależy od sumy składek i przewidywanej długości życia.":
    "60 и 65 лет. Размер пенсии зависит от суммы взносов и от ожидаемой продолжительности жизни.",
  "Gdzie wpisuje się spółki, a nie jednoosobową działalność?":
    "Куда вносят компании, а не индивидуальную деятельность?",
  "Do KRS": "В KRS",
  "Do CEIDG": "В CEIDG",
  "Do ZUS": "В ZUS",
  "Do urzędu skarbowego": "В налоговую инспекцию",
  "Krajowy Rejestr Sądowy. CEIDG służy jednoosobowej działalności gospodarczej.":
    "Krajowy Rejestr Sądowy, государственный судебный реестр. CEIDG служит для индивидуальной предпринимательской деятельности.",
  "Ile godzin dziennie wynosi zasadniczo czas pracy?":
    "Сколько часов в день составляет обычное рабочее время?",
  "6 godzin": "6 часов",
  "7 godzin": "7 часов",
  "8 godzin": "8 часов",
  "10 godzin": "10 часов",
  "8 godzin dziennie i przeciętnie 40 tygodniowo w przyjętym okresie rozliczeniowym.":
    "8 часов в день и в среднем 40 в неделю за принятый расчётный период.",
  "Jaki numer identyfikacyjny jest potrzebny do rozliczeń podatkowych firmy?":
    "Какой идентификационный номер нужен для налоговых расчётов фирмы?",
  "NIP": "NIP",
  "REGON": "REGON",
  "IBAN": "IBAN",
  "NIP. PESEL identyfikuje osobę fizyczną, REGON jest numerem statystycznym.":
    "NIP. PESEL опознаёт физическое лицо, REGON — статистический номер.",
  "Ile państw wstąpiło do Unii Europejskiej razem z Polską w 2004 roku?":
    "Сколько государств вступило в Европейский союз вместе с Польшей в 2004 году?",
  "Cztery": "Четыре",
  "Dziewięć": "Девять",
  "Dwanaście": "Двенадцать",
  "Polska i dziewięć innych państw — największe rozszerzenie w historii Unii.":
    "Польша и ещё девять государств — самое большое расширение в истории Союза.",
  "Od kiedy Polska należy do strefy Schengen?": "С какого года Польша входит в Шенгенскую зону?",
  "Od 1999": "С 1999",
  "Od 2004": "С 2004",
  "Od 2007": "С 2007",
  "Od 2014": "С 2014",
  "Od 2007 roku — granice wewnętrzne przekracza się od tej pory bez kontroli.":
    "С 2007 года — внутренние границы с тех пор пересекают без контроля.",
  "Jak nazywa się współpraca regionalna Polski z Czechami, Słowacją i Węgrami?":
    "Как называется региональное сотрудничество Польши с Чехией, Словакией и Венгрией?",
  "Grupa Wyszehradzka": "Вышеградская группа",
  "Trójkąt Weimarski": "Веймарский треугольник",
  "Rada Nordycka": "Северный совет",
  "Inicjatywa Trójmorza": "Инициатива трёх морей",
  "Grupa Wyszehradzka. Trójkąt Weimarski to współpraca z Niemcami i Francją.":
    "Вышеградская группа. Веймарский треугольник — это сотрудничество с Германией и Францией.",
  "Co ile lat Polacy wybierają posłów do Parlamentu Europejskiego?":
    "Раз в сколько лет поляки избирают депутатов Европейского парламента?",
  "Co 7 lat": "Раз в 7 лет",
  "Co 5 lat, w wyborach bezpośrednich.": "Раз в 5 лет, на прямых выборах.",
  "Jaka część głosujących poparła wejście do Unii w referendum z 2003 roku?":
    "Какая часть голосовавших поддержала вступление в Союз на референдуме 2003 года?",
  "Ponad połowa": "Больше половины",
  "Ponad dwie trzecie": "Больше двух третей",
  "Ponad trzy czwarte": "Больше трёх четвертей",
  "Ponad dziewięć dziesiątych": "Больше девяти десятых",
  "Ponad trzy czwarte głosujących, przy frekwencji blisko 59 procent.":
    "Больше трёх четвертей голосовавших, при явке около 59 процентов.",
  "Dlaczego wschodnia granica Polski ma szczególne znaczenie?":
    "Почему восточная граница Польши имеет особое значение?",
  "Jest zarazem zewnętrzną granicą Unii Europejskiej i NATO":
    "Она одновременно внешняя граница Европейского союза и НАТО",
  "Jest najkrótszą granicą kraju": "Это самая короткая граница страны",
  "Nie jest strzeżona": "Она не охраняется",
  "Przebiega wyłącznie po rzekach": "Она проходит только по рекам",
  "Granica z Ukrainą, Białorusią i Rosją jest granicą zewnętrzną obu organizacji.":
    "Граница с Украиной, Беларусью и Россией — внешняя граница обеих организаций.",
  "Ile mniej więcej osób liczy Polonia na świecie?":
    "Сколько примерно человек насчитывает польская диаспора в мире?",
  "Około miliona": "Около миллиона",
  "Kilka milionów": "Несколько миллионов",
  "Kilkanaście do dwudziestu milionów": "От десяти с лишним до двадцати миллионов",
  "Ponad pięćdziesiąt milionów": "Больше пятидесяти миллионов",
  "Szacunki mówią o kilkunastu do dwudziestu milionów; największe skupiska są w USA, Niemczech i Wielkiej Brytanii.":
    "Оценки говорят о десяти с лишним до двадцати миллионов; крупнейшие сообщества — в США, Германии и Великобритании.",
  "Co stało się w Polsce po pełnoskalowej agresji Rosji na Ukrainę w 2022 roku?":
    "Что произошло в Польше после полномасштабной агрессии России против Украины в 2022 году?",
  "Przez kraj przeszły miliony uchodźców": "Миллионы беженцев прошли через страну",
  "Zamknięto granicę zachodnią": "Закрыли западную границу",
  "Wprowadzono stan wojenny": "Ввели военное положение",
  "Polska wystąpiła z NATO": "Польша вышла из НАТО",
  "Największy ruch ludności w tej części Europy od czasów II wojny światowej.":
    "Крупнейшее перемещение людей в этой части Европы со времён Второй мировой войны.",
  "Które wyznanie deklaruje w Polsce największa część mieszkańców?":
    "Какое вероисповедание называет большинство жителей Польши?",
  "Rzymskokatolickie": "Римско-католическое",
  "Prawosławne": "Православное",
  "Ewangelickie": "Евангелическое",
  "Żadne": "Никакое",
  "Rzymskokatolickie, choć udział praktykujących od lat maleje.":
    "Римско-католическое, хотя доля практикующих годами уменьшается.",
  "Jaka umowa reguluje stosunki państwa z Kościołem katolickim?":
    "Какой договор регулирует отношения государства с католической церковью?",
  "Konkordat": "Конкордат",
  "Ustawa wyznaniowa": "Закон о вероисповеданиях",
  "Konkordat ze Stolicą Apostolską z 1993 roku.": "Конкордат со Святым престолом 1993 года.",
  "W którym regionie mieszka najwięcej wyznawców prawosławia?":
    "В каком регионе живёт больше всего православных?",
  "Na Podlasiu": "В Подляшье",
  "Na Śląsku": "В Силезии",
  "Na Pomorzu": "В Поморье",
  "W Wielkopolsce": "В Великопольше",
  "Na Podlasiu, przy wschodniej granicy kraju.": "В Подляшье, у восточной границы страны.",
  "Kto decyduje, czy dziecko chodzi w szkole na religię?":
    "Кто решает, ходит ли ребёнок в школе на уроки религии?",
  "Rodzice albo pełnoletni uczeń": "Родители или совершеннолетний ученик",
  "Dyrektor szkoły": "Директор школы",
  "Proboszcz parafii": "Приходский настоятель",
  "Religia jest nieobowiązkowa; alternatywą jest etyka albo żadne z tych zajęć.":
    "Религия необязательна; вместо неё можно взять этику или не ходить ни на то, ни на другое.",
  "Gdzie stoją zabytkowe meczety Tatarów polskich?": "Где стоят старинные мечети польских татар?",
  "W Kruszynianach i Bohonikach": "В Крушинянах и Бохониках",
  "W Zakopanem i Nowym Targu": "В Закопане и Новы-Тарге",
  "W Gdańsku i Gdyni": "В Гданьске и Гдыне",
  "We Wrocławiu i Opolu": "Во Вроцлаве и Ополе",
  "Na Podlasiu; Tatarzy osiedli tam przed wiekami.":
    "В Подляшье; татары поселились там столетия назад.",
  "W którym regionie żyje najwięcej ewangelików?":
    "В каком регионе живёт больше всего евангеликов?",
  "Na Śląsku Cieszyńskim": "В Тешинской Силезии",
  "Na Mazurach": "В Мазурах",
  "Na Kaszubach": "В Кашубах",
  "W Małopolsce": "В Малопольше",
  "Na Śląsku Cieszyńskim, gdzie protestantyzm ma nieprzerwaną tradycję od reformacji.":
    "В Тешинской Силезии, где протестантизм имеет непрерывную традицию со времён Реформации.",
  "Czy Polska ma religię państwową?": "Есть ли в Польше государственная религия?",
  "Nie": "Нет",
  "Tak, katolicyzm": "Да, католицизм",
  "Tak, prawosławie": "Да, православие",
  "Tak, ale tylko formalnie": "Да, но только формально",
  "Nie. Państwo jest bezstronne w sprawach przekonań religijnych.":
    "Нет. Государство беспристрастно в вопросах религиозных убеждений.",
  "Które miasto jest siedzibą prymasa Polski?": "В каком городе находится примас Польши?",
  "Częstochowa": "Ченстохова",
  "Gniezno, pierwsza stolica i najstarsza metropolia w kraju.":
    "Гнезно, первая столица и старейшая митрополия в стране.",
  "Co upamiętnia 1 sierpnia?": "Что отмечают 1 августа?",
  "Powstanie Warszawskie z 1944 roku. O 17.00 w Warszawie wyją syreny.":
    "Варшавское восстание 1944 года. В 17.00 в Варшаве воют сирены.",
  "Który dzień jest w Polsce Świętem Wojska Polskiego?":
    "Какой день в Польше — праздник Войска Польского?",
  "15 sierpnia": "15 августа",
  "15 sierpnia, w rocznicę Bitwy Warszawskiej; tego samego dnia przypada Wniebowzięcie.":
    "15 августа, в годовщину Варшавской битвы; в тот же день приходится Успение.",
  "Ile potraw tradycyjnie podaje się na wigilijnym stole?":
    "Сколько блюд традиционно подают на сочельник?",
  "Trzynaście": "Тринадцать",
  "Dwanaście. Zwyczajowo zostawia się też jedno wolne miejsce przy stole.":
    "Двенадцать. По обычаю за столом оставляют и одно свободное место.",
  "Jak nazywa się zwyczaj polewania wodą w poniedziałek wielkanocny?":
    "Как называется обычай обливаться водой в пасхальный понедельник?",
  "Dożynki": "Дожинки, праздник урожая",
  "Ostatki": "Остатки, последние дни карнавала",
  "Śmigus-dyngus — zwyczaj starszy niż chrześcijaństwo w Polsce.":
    "Śmigus-dyngus — обычай старше, чем христианство в Польше.",
  "Co robi się w Polsce 1 listopada?": "Что делают в Польше 1 ноября?",
  "Odwiedza się groby bliskich i zapala znicze": "Навещают могилы близких и зажигают лампадки",
  "Świętuje się początek roku szkolnego": "Празднуют начало учебного года",
  "Obchodzi się rocznicę niepodległości": "Отмечают годовщину независимости",
  "Organizuje się dożynki": "Устраивают праздник урожая",
  "Wszystkich Świętych. Cmentarze świecą wtedy przez całą noc.":
    "День всех святых. Кладбища светятся тогда всю ночь.",
  "Kiedy obchodzi się andrzejki?": "Когда отмечают анджейки?",
  "29 listopada": "29 ноября",
  "6 grudnia": "6 декабря",
  "31 grudnia": "31 декабря",
  "2 lutego": "2 февраля",
  "Wieczór 29 listopada, z wróżbami z lanego wosku. 6 grudnia to mikołajki.":
    "Вечер 29 ноября, с гаданием на литом воске. 6 декабря — это микояйки, день святого Николая.",
  "Kiedy zaczyna się w Polsce rok szkolny?": "Когда в Польше начинается учебный год?",
  "1 września": "1 сентября",
  "15 września": "15 сентября",
  "1 października": "1 октября",
  "Po Wszystkich Świętych": "После Дня всех святых",
  "1 września; kończy się w drugiej połowie czerwca.":
    "1 сентября; заканчивается во второй половине июня.",
  "Które dwa dni grudnia są w Polsce wolne od pracy z okazji Bożego Narodzenia?":
    "Какие два декабрьских дня в Польше нерабочие по случаю Рождества?",
  "24 i 25 grudnia": "24 и 25 декабря",
  "25 i 26 grudnia": "25 и 26 декабря",
  "26 i 27 grudnia": "26 и 27 декабря",
  "24 i 31 grudnia": "24 и 31 декабря",
  "25 i 26 grudnia. Wigilia 24 grudnia jest dniem pracującym, choć zwykle skróconym.":
    "25 и 26 декабря. Сочельник 24 декабря — рабочий день, хотя обычно укороченный.",
  "Jakim egzaminem kończy się szkoła podstawowa?":
    "Каким экзаменом заканчивается начальная школа?",
  "Egzaminem ósmoklasisty": "Экзаменом восьмиклассника",
  "Maturą": "Матурой",
  "Egzaminem zawodowym": "Профессиональным экзаменом",
  "Testem kompetencji": "Тестом на компетенции",
  "Egzaminem ósmoklasisty. Matura kończy liceum albo technikum.":
    "Экзаменом восьмиклассника. Матура завершает лицей или техникум.",
  "Ile lat trwa liceum ogólnokształcące?": "Сколько лет длится общеобразовательный лицей?",
  "3 lata": "3 года",
  "Cztery lata. Technikum trwa pięć.": "Четыре года. Техникум длится пять.",
  "Czy studia dzienne na uczelniach publicznych są płatne?":
    "Платная ли очная учёба в государственных вузах?",
  "Nie, są bezpłatne": "Нет, она бесплатна",
  "Tak, dla wszystkich": "Да, для всех",
  "Tak, poza pierwszym rokiem": "Да, кроме первого курса",
  "Studia dzienne na uczelniach publicznych są bezpłatne; płatne bywają zaoczne i uczelnie prywatne.":
    "Очная учёба в государственных вузах бесплатна; платными бывают заочная форма и частные вузы.",
  "Która instytucja finansuje leczenie ze składek?":
    "Какое учреждение финансирует лечение из взносов?",
  "KRUS": "KRUS",
  "GUS": "GUS",
  "Narodowy Fundusz Zdrowia. ZUS zajmuje się emeryturami i rentami.":
    "Narodowy Fundusz Zdrowia, национальный фонд здоровья. ZUS занимается пенсиями и пособиями.",
  "Do kogo idzie się najpierw z problemem zdrowotnym?":
    "К кому идут в первую очередь с проблемой со здоровьем?",
  "Do lekarza rodzinnego": "К семейному врачу",
  "Bezpośrednio do specjalisty": "Сразу к специалисту",
  "Na izbę przyjęć": "В приёмный покой",
  "Do apteki": "В аптеку",
  "Lekarz podstawowej opieki zdrowotnej kieruje dalej do specjalisty.":
    "Врач первичной помощи направляет дальше к специалисту.",
  "Ile cyfr ma numer PESEL?": "Сколько цифр в номере PESEL?",
  "Dziesięć": "Десять",
  "Jedenaście": "Одиннадцать",
  "Jedenaście. Zawiera datę urodzenia, a przedostatnia cyfra oznacza płeć.":
    "Одиннадцать. В нём есть дата рождения, а предпоследняя цифра обозначает пол.",
  "Jak dziś wygląda recepta na lek?": "Как сегодня выглядит рецепт на лекарство?",
  "To e-recepta: kod z SMS-a albo z aplikacji":
    "Это электронный рецепт: код из SMS или из приложения",
  "Papierowy druk z pieczątką": "Бумажный бланк с печатью",
  "Wpis do książeczki zdrowia": "Запись в медицинской книжке",
  "Ustne polecenie lekarza": "Устное распоряжение врача",
  "E-recepta. Część leków jest refundowana, czyli tańsza dzięki dopłacie NFZ.":
    "Электронный рецепт. Часть лекарств возмещается, то есть обходится дешевле благодаря доплате NFZ.",
  "Która uczelnia w Polsce jest najstarsza?": "Какой вуз в Польше самый старый?",
  "Politechnika Warszawska": "Варшавская политехника",
  "Uniwersytet Jagielloński, założony w 1364 roku.":
    "Ягеллонский университет, основанный в 1364 году.",
  "Gdzie załatwia się większość spraw urzędowych mieszkańca?":
    "Где житель решает большинство своих официальных дел?",
  "W urzędzie gminy albo miasta": "В управлении гмины или города",
  "W sądzie rejonowym": "В районном суде",
  "W urzędzie skarbowym": "В налоговой инспекции",
  "W urzędzie gminy lub miasta, a coraz częściej przez internet.":
    "В управлении гмины или города, а всё чаще через интернет.",
  "Co pozwala potwierdzić tożsamość w urzędowych sprawach przez internet?":
    "Что позволяет подтвердить личность в официальных делах через интернет?",
  "Profil zaufany": "Profil zaufany, доверенный профиль",
  "Numer REGON": "Номер REGON",
  "Karta biblioteczna": "Библиотечный билет",
  "Adres e-mail": "Адрес электронной почты",
  "Profil zaufany, obok aplikacji mObywatel.":
    "Profil zaufany, а рядом с ним приложение mObywatel.",
  "Jak wygląda handel w niedziele?": "Как обстоит дело с торговлей по воскресеньям?",
  "Jest ograniczony ustawą, z wyjątkami": "Она ограничена законом, с исключениями",
  "Jest całkowicie zakazany": "Она полностью запрещена",
  "Odbywa się bez ograniczeń": "Она идёт без ограничений",
  "Zależy od decyzji wojewody": "Это зависит от решения воеводы",
  "Otwarte pozostają między innymi piekarnie, stacje paliw i sklepy prowadzone przez właściciela.":
    "Открытыми остаются, среди прочего, пекарни, заправки и магазины, где за прилавком сам владелец.",
  "Jak zwraca się do osoby starszej albo nieznajomej?":
    "Как обращаются к пожилому или незнакомому человеку?",
  "„Pan” albo „pani”": "«Pan» или «pani» — «господин» или «госпожа»",
  "Po imieniu": "По имени",
  "„Cześć”": "«Cześć» — «привет»",
  "„Ty”": "«Ty» — «ты»",
  "Formy „pan” i „pani” są w Polsce standardem wobec osób nieznajomych i starszych.":
    "Формы «pan» и «pani» в Польше — норма по отношению к незнакомым и пожилым.",
  "Który organ konstytucyjny czuwa nad rynkiem mediów?":
    "Какой конституционный орган следит за рынком СМИ?",
  "Krajowa Rada Radiofonii i Telewizji": "Государственный совет по радиовещанию и телевидению",
  "Ministerstwo Kultury": "Министерство культуры",
  "Urząd Ochrony Konkurencji i Konsumentów": "Управление защиты конкуренции и потребителей",
  "KRRiT, wymieniona wprost w Konstytucji.": "KRRiT, названный прямо в Конституции.",
  "Co ile lat odbywa się w Warszawie Konkurs Chopinowski?":
    "Раз в сколько лет проходит в Варшаве Конкурс имени Шопена?",
  "Co dwa lata": "Раз в два года",
  "Co trzy lata": "Раз в три года",
  "Co pięć lat": "Раз в пять лет",
  "Co dziesięć lat": "Раз в десять лет",
  "Co pięć lat — jeden z najstarszych konkursów pianistycznych na świecie.":
    "Раз в пять лет — один из старейших фортепианных конкурсов в мире.",
  "Które dyscypliny sportu są w Polsce najpopularniejsze?":
    "Какие виды спорта в Польше самые популярные?",
  "Piłka nożna i siatkówka": "Футбол и волейбол",
  "Krykiet i rugby": "Крикет и регби",
  "Baseball i hokej": "Бейсбол и хоккей",
  "Golf i tenis": "Гольф и теннис",
  "Piłka nożna i siatkówka; zimą kraj ogląda też skoki narciarskie.":
    "Футбол и волейбол; зимой страна смотрит ещё и прыжки с трамплина.",
  "Które danie jest tradycyjną potrawą polskiej kuchni?":
    "Какое блюдо традиционно для польской кухни?",
  "Pierogi": "Пероги",
  "Paella": "Паэлья",
  "Sushi": "Суши",
  "Gulasz węgierski": "Венгерский гуляш",
  "Pierogi, obok bigosu, żurku, rosołu i kotleta schabowego.":
    "Пероги, а рядом бигос, журек, бульон и свиная отбивная.",
  "Jak wygląda własność mieszkań w Polsce na tle Europy?":
    "Как выглядит собственность на жильё в Польше на фоне Европы?",
  "Udział własności jest jednym z najwyższych": "Доля собственного жилья — одна из самых высоких",
  "Prawie wszyscy wynajmują": "Почти все снимают",
  "Mieszkania należą do gmin": "Квартиры принадлежат гминам",
  "Własność jest zakazana": "Собственность запрещена",
  "Większość ludzi mieszka we własnym mieszkaniu albo domu.":
    "Большинство людей живёт в собственной квартире или доме.",
  "Który poeta jest jednym z najbardziej znanych twórców dwudziestolecia międzywojennego?":
    "Какой поэт — один из самых известных авторов межвоенного двадцатилетия?",
  "Julian Tuwim": "Юлиан Тувим",
  "Wisława Szymborska": "Вислава Шимборская",
  "Julian Tuwim. Mickiewicz to romantyzm, Kochanowski renesans, Szymborska druga połowa XX wieku.":
    "Юлиан Тувим. Мицкевич — это романтизм, Кохановский — Возрождение, Шимборская — вторая половина XX века.",
  "W którym roku powstało Polskie Radio?": "В каком году появилось Польское радио?",
  "1924": "1924",
  "1930": "1930",
  "1924 — jedna z instytucji budowanych w młodym państwie od podstaw.":
    "1924-й — одно из учреждений, которые в молодом государстве строили с нуля.",
  "Który konflikt zakończyła Bitwa Warszawska?": "Какой конфликт завершила Варшавская битва?",
  "Wojnę z Rosją bolszewicką": "Войну с большевистской Россией",
  "I wojnę światową": "Первую мировую войну",
  "Powstanie wielkopolskie": "Великопольское восстание",
  "Wojnę z Czechosłowacją": "Войну с Чехословакией",
  "Wojnę polsko-bolszewicką. Zatrzymała ofensywę zmierzającą na zachód Europy.":
    "Польско-большевистскую войну. Она остановила наступление, шедшее на запад Европы.",
  "Jaką część miejsc w Senacie zdobyła Solidarność w wyborach 4 czerwca 1989 roku?":
    "Какую часть мест в Сенате получила «Солидарность» на выборах 4 июня 1989 года?",
  "99 na 100": "99 из 100",
  "65 na 100": "65 из 100",
  "50 na 100": "50 из 100",
  "35 na 100": "35 из 100",
  "99 na 100. W Sejmie zdobyła wszystkie mandaty, o które wolno jej było się ubiegać.":
    "99 из 100. В Сейме она взяла все мандаты, за которые ей вообще позволили бороться.",
  "Kto był prezydentem Polski bezpośrednio po Lechu Wałęsie?":
    "Кто был президентом Польши сразу после Леха Валенсы?",
  "Lech Kaczyński": "Лех Качиньский",
  "Bronisław Komorowski": "Бронислав Коморовский",
  "Andrzej Duda": "Анджей Дуда",
  "Aleksander Kwaśniewski, przez dwie kadencje.": "Александр Квасьневский, два срока подряд.",
  "Jaka była największa zmiana gospodarcza początku lat dziewięćdziesiątych?":
    "Какая перемена в экономике была самой большой в начале девяностых?",
  "Przejście od gospodarki planowanej do rynkowej": "Переход от плановой экономики к рыночной",
  "Wprowadzenie euro": "Введение евро",
  "Nacjonalizacja przemysłu": "Национализация промышленности",
  "Wprowadzenie kartek na żywność": "Введение карточек на продукты",
  "Otwarcie rynku. Ceny wzrosły i wiele zakładów upadło, ale niedobory się skończyły.":
    "Открытие рынка. Цены выросли, многие предприятия закрылись, но дефицит кончился.",
  "Czy Konstytucja nakłada obowiązki także na osoby niebędące obywatelami?":
    "Возлагает ли Конституция обязанности и на тех, кто не является гражданином?",
  "Tak, obowiązek przestrzegania prawa dotyczy każdego":
    "Да, обязанность соблюдать право касается каждого",
  "Nie, wyłącznie na obywateli": "Нет, только на граждан",
  "Tylko na osoby pracujące": "Только на работающих",
  "Tylko na osoby zameldowane": "Только на зарегистрированных по месту жительства",
  "Przestrzeganie prawa obowiązuje każdego pod władzą Rzeczypospolitej; obrona ojczyzny — obywateli.":
    "Соблюдать право обязан каждый под властью Республики Польша; защищать родину — граждане.",
  "Czym jest wstępnie wypełnione zeznanie podatkowe?":
    "Что такое предварительно заполненная налоговая декларация?",
  "Rozliczeniem przygotowanym przez urząd, które wystarczy sprawdzić i zatwierdzić":
    "Расчёт, подготовленный учреждением, который достаточно проверить и утвердить",
  "Zeznaniem składanym przez pracodawcę zamiast pracownika":
    "Декларация, которую подаёт работодатель вместо работника",
  "Wnioskiem o zwolnienie z podatku": "Заявление об освобождении от налога",
  "Deklaracją składaną co miesiąc": "Декларация, подаваемая каждый месяц",
  "Urząd skarbowy udostępnia je przez internet; podatnik może je poprawić albo przyjąć.":
    "Налоговая инспекция выкладывает её в интернете; налогоплательщик может её исправить или принять.",
  "Kto wybiera ławników?": "Кто выбирает народных заседателей?",
  "Rady gmin": "Советы гмин",
  "Minister Sprawiedliwości": "Министр юстиции",
  "Rady gmin. Przy wyrokowaniu ławnik ma taki sam głos jak sędzia zawodowy.":
    "Советы гмин. При вынесении приговора у заседателя такой же голос, как у профессионального судьи.",
  "Czy Trybunał Konstytucyjny może zmienić wyrok w konkretnej sprawie?":
    "Может ли Конституционный трибунал изменить приговор по конкретному делу?",
  "Nie, przygląda się przepisowi, a nie rozstrzygnięciu":
    "Нет, он смотрит на норму, а не на решение по делу",
  "Tak, jest sądem najwyższej instancji": "Да, это суд высшей инстанции",
  "Tak, na wniosek prokuratora": "Да, по заявлению прокурора",
  "Tak, w sprawach karnych": "Да, по уголовным делам",
  "Trybunał bada zgodność przepisu z Konstytucją; wyroki zmieniają sądy wyższej instancji.":
    "Трибунал проверяет соответствие нормы Конституции; приговоры меняют суды высшей инстанции.",
  "Czym są interpelacje poselskie?": "Что такое депутатские запросы?",
  "Pisemnymi pytaniami posłów do członków rządu":
    "Письменные вопросы депутатов членам правительства",
  "Wnioskami o odwołanie rządu": "Заявления об отставке правительства",
  "Projektami ustaw": "Законопроекты",
  "Uchwałami Senatu": "Постановления Сената",
  "Narzędzie kontroli: poseł pyta, minister ma obowiązek odpowiedzieć.":
    "Инструмент контроля: депутат спрашивает, министр обязан ответить.",
  "Co się dzieje, gdy Sejm nie udzieli rządowi wotum zaufania w pierwszym kroku?":
    "Что происходит, если Сейм не даёт правительству вотум доверия с первого раза?",
  "Inicjatywę przejmuje Sejm, a Konstytucja przewiduje kolejne kroki":
    "Инициативу берёт Сейм, а Конституция предусматривает следующие шаги",
  "Rozpisuje się natychmiast nowe wybory": "Немедленно назначают новые выборы",
  "Rząd i tak obejmuje urząd": "Правительство всё равно вступает в должность",
  "Decyduje Senat": "Решает Сенат",
  "Konstytucja przewiduje trzy kolejne procedury, żeby państwo nie zostało bez rządu.":
    "Конституция предусматривает три процедуры подряд, чтобы государство не осталось без правительства.",
  "Co zapoczątkował robotniczy protest w Poznaniu w 1956 roku?":
    "Чему положил начало рабочий протест в Познани в 1956 году?",
  "Powstanie Solidarności": "Возникновению «Солидарности»",
  "Rozwiązanie PZPR": "Роспуску PZPR",
  "Protest stłumiono wojskiem, ale zapoczątkował okres politycznej odwilży.":
    "Протест подавили войсками, но он открыл период политической оттепели.",
  "Ilu członków liczyła Solidarność w szczytowym momencie?":
    "Сколько членов насчитывала «Солидарность» на пике?",
  "Około trzech milionów": "Около трёх миллионов",
  "Blisko dziesięciu milionów": "Почти десять миллионов",
  "Ponad dwadzieścia milionów": "Больше двадцати миллионов",
  "Blisko dziesięć milionów — w kraju liczącym wtedy około 36 milionów mieszkańców.":
    "Почти десять миллионов — в стране, где тогда жило около 36 миллионов человек.",
  "Co nastąpiło po klęsce powstania styczniowego w zaborze rosyjskim?":
    "Что последовало за поражением Январского восстания в российской части?",
  "Nasilona rusyfikacja, konfiskaty i zsyłki": "Усиленная русификация, конфискации и ссылки",
  "Przyznanie autonomii": "Предоставление автономии",
  "Zniesienie cenzury": "Отмена цензуры",
  "Powrót polskiego sejmu": "Возвращение польского сейма",
  "Represje objęły szkolnictwo, majątki i tysiące uczestników zesłanych na Sybir.":
    "Репрессии затронули школы, имущество и тысячи участников, сосланных в Сибирь.",
  "Który malarz utrwalał sceny z historii Polski w czasie zaborów?":
    "Какой художник запечатлел сцены из истории Польши во время разделов?",
  "Jan Matejko": "Ян Матейко",
  "Stanisław Wyspiański": "Станислав Выспяньский",
  "Jacek Malczewski": "Яцек Мальчевский",
  "Józef Chełmoński": "Юзеф Хелмоньский",
  "Jan Matejko, autor między innymi „Bitwy pod Grunwaldem” i „Konstytucji 3 Maja”.":
    "Ян Матейко, автор, среди прочего, «Грюнвальдской битвы» и «Конституции 3 мая».",
  "Jak nazywają się piesze wędrówki na Jasną Górę odbywające się latem?":
    "Как называются пешие походы на Ясную Гуру, которые проходят летом?",
  "Pielgrzymki": "Паломничества",
  "Procesje": "Процессии",
  "Odpusty": "Храмовые праздники",
  "Rekolekcje": "Духовные упражнения",
  "Sierpniowe pielgrzymki idą tam z całego kraju, niektóre po kilkanaście dni.":
    "Августовские паломничества идут туда со всей страны, некоторые больше полутора недель.",
  "Co jest alternatywą dla lekcji religii w szkole publicznej?":
    "Что можно взять вместо уроков религии в государственной школе?",
  "Etyka": "Этика",
  "Filozofia": "Философия",
  "Historia Kościoła": "История церкви",
  "Nic — udział jest obowiązkowy": "Ничего — участие обязательно",
  "Etyka albo rezygnacja z obu zajęć. Wybór należy do rodziców lub pełnoletniego ucznia.":
    "Этика или отказ от обоих предметов. Выбор за родителями или совершеннолетним учеником.",
  "Który trybunał czuwa nad stosowaniem prawa Unii Europejskiej?":
    "Какой суд следит за применением права Европейского союза?",
  "Trybunał Sprawiedliwości UE w Luksemburgu": "Суд Европейского союза в Люксембурге",
  "Międzynarodowy Trybunał Karny": "Международный уголовный суд",
  "Luksemburg zajmuje się prawem unijnym, Strasburg skargami na naruszenie praw człowieka.":
    "Люксембург занимается правом Союза, Страсбург — жалобами на нарушение прав человека.",
  "Czy Polska zobowiązała się kiedyś do przyjęcia euro?":
    "Обязывалась ли Польша когда-нибудь принять евро?",
  "Tak, w traktacie akcesyjnym, bez wyznaczonej daty":
    "Да, в договоре о вступлении, без назначенной даты",
  "Nie, uzyskała trwałe wyłączenie": "Нет, она получила постоянное исключение",
  "Tak, z terminem na rok 2010": "Да, со сроком на 2010 год",
  "Nie, kwestii tej nigdy nie poruszano": "Нет, этот вопрос никогда не поднимался",
  "Zobowiązanie istnieje, ale bez terminu; waluta pozostaje złotym.":
    "Обязательство есть, но без срока; валютой остаётся злотый.",
  "Ile tygodni trwają zwykle ferie zimowe?": "Сколько недель обычно длятся зимние каникулы?",
  "Jeden tydzień": "Одну неделю",
  "Dwa tygodnie": "Две недели",
  "Trzy tygodnie": "Три недели",
  "Miesiąc": "Месяц",
  "Dwa tygodnie, w różnych terminach zależnie od województwa.":
    "Две недели, в разные сроки в зависимости от воеводства.",
  "Które święto kościelne jest w Polsce dniem wolnym i wypada w czwartek?":
    "Какой церковный праздник в Польше нерабочий и приходится на четверг?",
  "Boże Ciało": "Праздник Тела Господня",
  "Wniebowzięcie": "Успение",
  "Trzech Króli": "Богоявление",
  "Boże Ciało zawsze wypada w czwartek; pozostałe mają stałe daty.":
    "Праздник Тела Господня всегда приходится на четверг; у остальных даты постоянные.",
  "Ile lat trwa technikum?": "Сколько лет длится техникум?",
  "Pięć lat. Liceum trwa cztery, szkoła branżowa krócej.":
    "Пять лет. Лицей длится четыре, отраслевая школа — меньше.",
  "Co oznacza, że lek jest refundowany?": "Что значит, что лекарство возмещается?",
  "Że NFZ dopłaca do jego ceny": "Что NFZ доплачивает к его цене",
  "Że jest wydawany bez recepty": "Что его выдают без рецепта",
  "Że można go zwrócić do apteki": "Что его можно вернуть в аптеку",
  "Że produkuje go państwo": "Что его производит государство",
  "Dopłata NFZ obniża cenę dla pacjenta.": "Доплата NFZ снижает цену для пациента.",
  "Kiedy wywiesza się flagę państwową?": "Когда вывешивают государственный флаг?",
  "W dni świąt państwowych i podczas uroczystości":
    "В дни государственных праздников и во время торжеств",
  "Codziennie na każdym domu": "Каждый день на каждом доме",
  "Wyłącznie w Warszawie": "Только в Варшаве",
  "Tylko podczas meczów reprezentacji": "Только во время матчей сборной",
  "Na budynkach urzędów i podczas uroczystości; mieszkańcy wywieszają ją zwyczajowo w święta.":
    "На зданиях учреждений и во время торжеств; жители по обычаю вывешивают его в праздники.",
  "Czym różni się pozycja obywatela od pozycji urzędu wobec prawa?":
    "Чем положение гражданина перед правом отличается от положения учреждения?",
  "Obywatelowi wolno wszystko, czego prawo nie zabrania; urzędowi tylko to, na co prawo zezwala":
    "Гражданину можно всё, чего право не запрещает; учреждению — только то, что право разрешает",
  "Obie są identyczne": "Они одинаковы",
  "Urzędowi wolno więcej niż obywatelowi": "Учреждению можно больше, чем гражданину",
  "Obywatel podlega tylko Konstytucji": "Гражданин подчиняется только Конституции",
  "Ta różnica jest istotą państwa prawa.": "В этом различии и состоит суть правового государства.",
  "Kto poza posłami i rządem ma inicjatywę ustawodawczą?":
    "У кого, кроме депутатов и правительства, есть право законодательной инициативы?",
  "Senat, Prezydent i grupa 100 tysięcy obywateli":
    "У Сената, президента и группы из 100 тысяч граждан",
  "Wyłącznie Prezydent": "Только у президента",
  "Wojewodowie": "У воевод",
  "Sądy powszechne": "У судов общей юрисдикции",
  "Projekt może złożyć także Senat, Prezydent albo grupa stu tysięcy obywateli.":
    "Проект может внести также Сенат, президент или группа из ста тысяч граждан.",
  "Która kraina historyczna leży wokół Poznania?":
    "Какая историческая земля лежит вокруг Познани?",
  "Wielkopolska": "Великопольша",
  "Małopolska": "Малопольша",
  "Mazowsze": "Мазовше",
  "Wielkopolska. Mazowsze leży wokół Warszawy, Małopolska wokół Krakowa.":
    "Великопольша. Мазовше лежит вокруг Варшавы, Малопольша — вокруг Кракова.",
  "Ile mniej więcej osób mieszka w Warszawie?": "Сколько примерно человек живёт в Варшаве?",
  "Około 800 tysięcy": "Около 800 тысяч",
  "Około 1,2 miliona": "Около 1,2 миллиона",
  "Około 1,8 miliona": "Около 1,8 миллиона",
  "Około 3 milionów": "Около 3 миллионов",
  "Około 1,8 miliona — największe miasto kraju.":
    "Около 1,8 миллиона — самый большой город страны.",
  "Kto ustala wysokość płacy minimalnej?": "Кто устанавливает размер минимальной зарплаты?",
  "Rada Ministrów w rozporządzeniu, co roku": "Совет министров постановлением, каждый год",
  "Każdy pracodawca osobno": "Каждый работодатель отдельно",
  "Sejm raz na kadencję": "Сейм раз за созыв",
  "Wojewoda dla swojego regionu": "Воевода для своего региона",
  "Ustalana corocznie i obowiązuje wszystkich pracowników w kraju.":
    "Её устанавливают ежегодно, и она обязательна для всех работников в стране.",
  "Czym jest budżet obywatelski?": "Что такое гражданский бюджет?",
  "Częścią budżetu gminy, o której przeznaczeniu decydują mieszkańcy":
    "Часть бюджета гмины, о назначении которой решают жители",
  "Budżetem państwa na cele socjalne": "Бюджет государства на социальные цели",
  "Funduszem unijnym": "Фонд Европейского союза",
  "Podatkiem lokalnym": "Местный налог",
  "Mieszkańcy zgłaszają projekty i głosują, na co pójdzie wydzielona kwota.":
    "Жители подают проекты и голосуют, на что пойдёт выделенная сумма.",
  "Przed kim Prezydent składa przysięgę?": "Перед кем президент приносит присягу?",
  "Przed Zgromadzeniem Narodowym": "Перед Национальным собранием",
  "Przed Sejmem": "Перед Сеймом",
  "Przed Sądem Najwyższym": "Перед Верховным судом",
  "Przed Radą Ministrów": "Перед Советом министров",
  "Przed Zgromadzeniem Narodowym, czyli połączonymi izbami parlamentu.":
    "Перед Национальным собранием, то есть перед объединёнными палатами парламента.",
  "Kto nadzoruje w Polsce ochronę danych osobowych?":
    "Кто надзирает в Польше за защитой персональных данных?",
  "Prezes Urzędu Ochrony Danych Osobowych":
    "Председатель Управления по защите персональных данных",
  "Minister Cyfryzacji": "Министр цифровизации",
  "Prezes UODO, na podstawie przepisów RODO obowiązujących od 2018 roku.":
    "Председатель UODO, на основании норм RODO, действующих с 2018 года.",
  "Jak nazywała się dynastia rządząca po Piastach?":
    "Как называлась династия, правившая после Пястов?",
  "Wettynowie": "Веттины",
  "Andegawenowie": "Анжуйцы",
  "Jagiellonowie, od unii z Litwą w 1385 roku.": "Ягеллоны, с унии с Литвой в 1385 году.",
  "Dokąd przeniósł się polski rząd po klęsce we wrześniu 1939 roku?":
    "Куда переехало польское правительство после поражения в сентябре 1939 года?",
  "Do Londynu": "В Лондон",
  "Do Paryża na stałe": "В Париж, насовсем",
  "Do Moskwy": "В Москву",
  "Do Sztokholmu": "В Стокгольм",
  "Najpierw do Francji, a po jej upadku do Londynu.":
    "Сначала во Францию, а после её падения — в Лондон.",
  "Kto prowadzi w Polsce koleje dalekobieżne?": "Кто в Польше водит поезда дальнего следования?",
  "PKP": "PKP",
  "PKS": "PKS",
  "LOT": "LOT",
  "ZTM": "ZTM",
  "Polskie Koleje Państwowe i spółki z nimi związane. PKS to autobusy, LOT to linie lotnicze.":
    "Польские государственные железные дороги и связанные с ними компании. PKS — это автобусы, LOT — авиалинии.",
  "Co grozi za publiczne znieważenie symboli państwowych?":
    "Что грозит за публичное оскорбление государственных символов?",
  "Odpowiedzialność karna — symbole są chronione prawem":
    "Уголовная ответственность — символы охраняются законом",
  "Nic, to kwestia obyczaju": "Ничего, это дело обычая",
  "Grzywna nakładana przez wojewodę": "Штраф, налагаемый воеводой",
  "Godło, barwy i hymn są objęte ochroną prawną; znieważenie ich jest przestępstwem.":
    "Герб, цвета и гимн находятся под правовой охраной; их оскорбление — преступление.",
  "Ile rozdziałów Konstytucji podlega zatwierdzeniu w referendum przy zmianie?":
    "Сколько разделов Конституции при изменении подлежат утверждению на референдуме?",
  "Wszystkie": "Все",
  "Rozdziały o ustroju, o wolnościach i o trybie zmiany Konstytucji.":
    "Разделы о государственном строе, о свободах и о порядке изменения Конституции.",
  "Czy państwo zapewnia prawo do nauki?": "Обеспечивает ли государство право на образование?",
  "Tak, nauka jest bezpłatna w szkołach publicznych":
    "Да, учёба в государственных школах бесплатна",
  "Nie, edukacja jest w pełni prywatna": "Нет, образование целиком частное",
  "Tylko dla obywateli polskich": "Только для польских граждан",
  "Tylko do 12. roku życia": "Только до 12 лет",
  "Konstytucja gwarantuje prawo do nauki, bezpłatnej w szkołach publicznych.":
    "Конституция гарантирует право на образование, бесплатное в государственных школах.",
  "Ile czasu ma sąd na decyzję o tymczasowym aresztowaniu po przekazaniu zatrzymanego?":
    "Сколько времени у суда на решение о заключении под стражу после передачи задержанного?",
  "24 godziny": "24 часа",
  "72 godziny": "72 часа",
  "Do 48 godzin na przekazanie sądowi i kolejne 24 na decyzję — razem najwyżej 72 godziny.":
    "До 48 часов на передачу суду и ещё 24 на решение — вместе не больше 72 часов.",
  "Co Konstytucja wymienia jako pierwszy obowiązek obywatela?":
    "Что Конституция называет первой обязанностью гражданина?",
  "Wierność Rzeczypospolitej i troskę o dobro wspólne":
    "Верность Республике Польша и заботу об общем благе",
  "Płacenie podatków": "Уплату налогов",
  "Służbę wojskową": "Военную службу",
  "Z tego ogólnego sformułowania wynikają pozostałe obowiązki.":
    "Из этой общей формулировки вытекают остальные обязанности.",
  "Które ugrupowania są zwolnione z progu wyborczego do Sejmu?":
    "Какие объединения освобождены от избирательного порога в Сейм?",
  "Komitety mniejszości narodowych": "Комитеты национальных меньшинств",
  "Partie rządzące": "Правящие партии",
  "Komitety obywatelskie": "Гражданские комитеты",
  "Nikt nie jest zwolniony": "Никто не освобождён",
  "Zwolnienie dotyczy komitetów mniejszości narodowych.":
    "Освобождение касается комитетов национальных меньшинств.",
  "Co się stanie, jeśli Prezydent skieruje ustawę do Trybunału Konstytucyjnego?":
    "Что будет, если президент направит закон в Конституционный трибунал?",
  "Nie może już jej zawetować": "Наложить вето он уже не сможет",
  "Może ją potem jeszcze zawetować": "Он сможет потом ещё и наложить вето",
  "Ustawa wchodzi w życie natychmiast": "Закон вступает в силу немедленно",
  "Sejm musi ją uchwalić ponownie": "Сейм должен принять его заново",
  "Wybór jest rozłączny: albo weto, albo droga do Trybunału.":
    "Выбор исключающий: либо вето, либо дорога в Трибунал.",
  "Kto wchodzi w skład Rady Ministrów?": "Кто входит в состав Совета министров?",
  "Premier i ministrowie": "Премьер и министры",
  "Premier i Prezydent": "Премьер и президент",
  "Posłowie i senatorowie": "Депутаты и сенаторы",
  "Prezes Rady Ministrów i ministrowie kierujący działami administracji.":
    "Председатель Совета министров и министры, ведающие отраслями администрации.",
  "Czy rozprawy sądowe są w Polsce jawne?": "Открыты ли судебные заседания в Польше?",
  "Tak, co do zasady, a wyrok ogłasza się publicznie":
    "Да, как правило, а приговор объявляют публично",
  "Nie, wszystkie są tajne": "Нет, все они закрытые",
  "Tylko w sprawach cywilnych": "Только по гражданским делам",
  "Tylko za zgodą stron": "Только с согласия сторон",
  "Jawność jest zasadą; wyjątki wymagają podstawy w ustawie.":
    "Открытость — правило; исключения требуют основания в законе.",
  "Ile szczebli ma polski samorząd terytorialny?":
    "Сколько уровней у польского территориального самоуправления?",
  "Gmina, powiat i województwo.": "Гмина, повят и воеводство.",
  "Co oznaczała wolna elekcja?": "Что означали вольные выборы короля?",
  "Że króla wybierała szlachta": "Что короля избирала шляхта",
  "Że tron dziedziczył najstarszy syn": "Что трон наследовал старший сын",
  "Że króla wskazywał papież": "Что короля назначал папа римский",
  "Że królem zostawał zwycięzca turnieju": "Что королём становился победитель турнира",
  "Króla wybierała szlachta; zniosła to dopiero Konstytucja 3 maja.":
    "Короля избирала шляхта; отменила это лишь Конституция 3 мая.",
  "W którym roku doszło do pierwszego rozbioru Polski?":
    "В каком году произошёл первый раздел Польши?",
  "1764": "1764",
  "1772. Drugi nastąpił w 1793, trzeci w 1795 roku.":
    "1772-й. Второй последовал в 1793-м, третий — в 1795 году.",
  "Jak nazywano powstania, które zdecydowały o przynależności Górnego Śląska?":
    "Как называли восстания, решившие принадлежность Верхней Силезии?",
  "Powstania śląskie": "Силезские восстания",
  "Powstanie warszawskie": "Варшавское восстание",
  "Powstanie krakowskie": "Краковское восстание",
  "Trzy powstania śląskie w latach 1919–1921, obok plebiscytu.":
    "Три силезских восстания в 1919–1921 годах, наряду с плебисцитом.",
  "Jak nazywał się największy niemiecki obóz koncentracyjny i zagłady na ziemiach polskich?":
    "Как назывался самый большой немецкий концентрационный лагерь и лагерь смерти на польских землях?",
  "Mauthausen": "Маутхаузен",
  "Auschwitz-Birkenau, dziś miejsce pamięci wpisane na listę UNESCO.":
    "Аушвиц-Биркенау, сегодня мемориал, внесённый в список ЮНЕСКО.",
  "Jak nazywały się porozumienia kończące strajk w Stoczni Gdańskiej?":
    "Как назывались соглашения, завершившие забастовку на Гданьской верфи?",
  "Umowa gdańska": "Гданьский договор",
  "Pakt o stabilizacji": "Пакт о стабилизации",
  "Porozumienia sierpniowe z 1980 roku; na ich podstawie powstała Solidarność.":
    "Августовские соглашения 1980 года; на их основе возникла «Солидарность».",
  "Jaką część miejsc w Sejmie w 1989 roku obsadzono w wolnych wyborach?":
    "Какую часть мест в Сейме в 1989 году заняли на свободных выборах?",
  "35 procent": "35 процентов",
  "50 procent": "50 процентов",
  "65 procent": "65 процентов",
  "100 procent": "100 процентов",
  "35 procent w Sejmie; Senat był wolny w całości.":
    "35 процентов в Сейме; Сенат был свободным целиком.",
  "Jak nazywa się największe jezioro w Polsce?": "Как называется самое большое озеро в Польше?",
  "Śniardwy": "Снярдвы",
  "Mamry": "Мамры",
  "Hańcza": "Ханьча",
  "Gopło": "Гопло",
  "Śniardwy na Mazurach. Hańcza jest najgłębsza, ale nie największa.":
    "Снярдвы в Мазурах. Ханьча самое глубокое, но не самое большое.",
  "Ile jest w Polsce uznanych mniejszości narodowych?":
    "Сколько в Польше признанных национальных меньшинств?",
  "Dziewięć mniejszości narodowych i cztery etniczne; językiem regionalnym jest kaszubski.":
    "Девять национальных меньшинств и четыре этнических; региональный язык — кашубский.",
  "Czym różni się umowa o pracę od umowy zlecenia?":
    "Чем трудовой договор отличается от договора поручения?",
  "Umowa o pracę daje urlop i ochronę przed zwolnieniem":
    "Трудовой договор даёт отпуск и защиту от увольнения",
  "Umowa zlecenia jest zawsze korzystniejsza": "Договор поручения всегда выгоднее",
  "Nie różnią się niczym": "Они ничем не отличаются",
  "Umowa o pracę nie wymaga składek": "Трудовой договор не требует взносов",
  "Z umowy o pracę wynikają urlop, ochrona stosunku pracy i pełne składki.":
    "Из трудового договора вытекают отпуск, защита трудовых отношений и полные взносы.",
  "Do której organizacji obronnej należy Polska od 1999 roku?":
    "К какой оборонной организации Польша принадлежит с 1999 года?",
  "Do NATO": "К НАТО",
  "Do Układu Warszawskiego": "К Организации Варшавского договора",
  "Do ONZ": "К ООН",
  "Do OBWE": "К ОБСЕ",
  "Do NATO, razem z Czechami i Węgrami. Układ Warszawski rozwiązano w 1991 roku.":
    "К НАТО, вместе с Чехией и Венгрией. Организацию Варшавского договора распустили в 1991 году.",
  "Który obraz znajduje się na Jasnej Górze?": "Какая икона находится на Ясной Гуре?",
  "Matki Boskiej Częstochowskiej": "Ченстоховской Божией Матери",
  "Matki Boskiej Ostrobramskiej": "Остробрамской Божией Матери",
  "Świętego Stanisława": "Святого Станислава",
  "Świętej Jadwigi": "Святой Ядвиги",
  "Obraz Matki Boskiej Częstochowskiej, cel największych pielgrzymek w kraju.":
    "Икона Ченстоховской Божией Матери, цель самых больших паломничеств в стране.",
  "Kiedy w Polsce jada się kolację wigilijną?": "Когда в Польше садятся за ужин в сочельник?",
  "24 grudnia, po pierwszej gwiazdce": "24 декабря, после первой звезды",
  "25 grudnia w południe": "25 декабря в полдень",
  "31 grudnia wieczorem": "31 декабря вечером",
  "6 stycznia": "6 января",
  "Wieczorem 24 grudnia, tradycyjnie po pojawieniu się pierwszej gwiazdy.":
    "Вечером 24 декабря, по традиции после появления первой звезды.",
  "Jaki egzamin otwiera drogę na studia?": "Какой экзамен открывает дорогу в вуз?",
  "Matura": "Матура",
  "Egzamin ósmoklasisty": "Экзамен восьмиклассника",
  "Egzamin zawodowy": "Профессиональный экзамен",
  "Test kompetencji": "Тест на компетенции",
  "Matura; jej wyniki decydują o przyjęciu na uczelnię.":
    "Матура; её результаты решают, примут ли в вуз.",
  "Skąd biorą się opłaty za wodę i ogrzewanie w bloku?":
    "Откуда берутся платежи за воду и отопление в многоквартирном доме?",
  "Zwykle rozlicza je wspólnota albo spółdzielnia, osobno od czynszu najmu":
    "Обычно их считает товарищество или кооператив, отдельно от арендной платы",
  "Zawsze są wliczone w czynsz najmu": "Они всегда включены в арендную плату",
  "Pobiera je gmina": "Их собирает гмина",
  "Płaci je wyłącznie właściciel mieszkania": "Их платит только собственник квартиры",
  "Przy najmie opłaty eksploatacyjne często idą osobno, do wspólnoty albo spółdzielni.":
    "При аренде эксплуатационные платежи часто идут отдельно, товариществу или кооперативу.",
};
