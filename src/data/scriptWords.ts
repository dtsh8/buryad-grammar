// Words for the spelling game on the Script page, as Poppe prints them with the script beside
// them (Grammar of Written Mongolian, 1974; checked against the scans). The English is his; the
// Russian is ours.
export interface ScriptWordEntry {
  latin: string;
  en: string;
  ru: string;
  page: number;
}

export const SCRIPT_WORDS: ScriptWordEntry[] = [
  { latin: 'nigen', en: 'one', ru: 'один', page: 21 },
  { latin: 'inaγ', en: 'friend', ru: 'друг', page: 21 },
  { latin: 'tende', en: 'there', ru: 'там', page: 21 },
  { latin: 'naran', en: 'sun', ru: 'солнце', page: 21 },
  { latin: 'öndür', en: 'high', ru: 'высокий', page: 21 },
  { latin: 'qalaγun', en: 'hot', ru: 'горячий', page: 21 },
  { latin: 'qaγan', en: 'khan, emperor', ru: 'хан, император', page: 21 },
  { latin: 'qaγalγ-a', en: 'gate', ru: 'ворота', page: 21 },
  { latin: 'γurban', en: 'three', ru: 'три', page: 22 },
  { latin: 'γaǰar', en: 'country', ru: 'страна, земля', page: 22 },
  { latin: 'čaγ', en: 'time', ru: 'время', page: 22 },
  { latin: 'baγ-a', en: 'little, small', ru: 'маленький', page: 22 },
  { latin: 'belge', en: 'sign', ru: 'знак', page: 22 },
  { latin: 'böke', en: 'wrestler', ru: 'борец', page: 22 },
  { latin: 'bi', en: 'I', ru: 'я', page: 22 },
  { latin: 'ebügen', en: 'old man', ru: 'старик', page: 22 },
  { latin: 'ǰirγalang', en: 'happiness', ru: 'счастье', page: 22 },
  { latin: 'sara', en: 'moon, month', ru: 'луна, месяц', page: 23 },
  { latin: 'usun', en: 'water', ru: 'вода', page: 23 },
  { latin: 'ulus', en: 'state', ru: 'государство', page: 23 },
  { latin: 'šidün', en: 'tooth', ru: 'зуб', page: 23 },
  { latin: 'tarbaγan', en: 'marmot', ru: 'тарбаган, сурок', page: 23 },
  { latin: 'baγatur', en: 'hero', ru: 'богатырь, герой', page: 23 },
  { latin: 'ende', en: 'here', ru: 'здесь', page: 23 },
  { latin: 'modun', en: 'tree', ru: 'дерево', page: 23 },
  { latin: 'miqan', en: 'flesh, meat', ru: 'мясо', page: 36 },
  { latin: 'šira', en: 'yellow', ru: 'жёлтый', page: 36 },
  { latin: 'nidün', en: 'eye', ru: 'глаз', page: 36 },
  { latin: 'čisun', en: 'blood', ru: 'кровь', page: 36 },
  { latin: 'edür', en: 'day', ru: 'день', page: 36 },
  { latin: 'aγula', en: 'mountain', ru: 'гора', page: 36 },
  { latin: 'egür', en: 'nest', ru: 'гнездо', page: 36 },
  { latin: 'bal', en: 'honey', ru: 'мёд', page: 36 },
  { latin: 'üniye', en: 'cow', ru: 'корова', page: 37 },
  { latin: 'morin', en: 'horse', ru: 'лошадь', page: 37 },
  { latin: 'kümün', en: 'person', ru: 'человек', page: 126 },
];
