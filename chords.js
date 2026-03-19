// 코드 데이터
// scales.js 이후에 로드됨 (rootToMidi, midiToName, ROOT_NOTES 사용)

/**
 * 코드 타입 정의
 * suffix   : 코드 이름에 붙는 접미사
 * label    : 한글 설명
 * intervals: 루트로부터의 반음 간격
 * degrees  : 각 음의 화성 기능 이름
 */
const CHORD_TYPES = {
  "major":  { suffix: "",       label: "Major",              intervals: [0, 4, 7],           degrees: ["R", "3", "5"] },
  "minor":  { suffix: "m",      label: "Minor",              intervals: [0, 3, 7],           degrees: ["R", "♭3", "5"] },
  "dom7":   { suffix: "7",      label: "Dominant 7th",       intervals: [0, 4, 7, 10],       degrees: ["R", "3", "5", "♭7"] },
  "maj7":   { suffix: "maj7",   label: "Major 7th",          intervals: [0, 4, 7, 11],       degrees: ["R", "3", "5", "△7"] },
  "m7":     { suffix: "m7",     label: "Minor 7th",          intervals: [0, 3, 7, 10],       degrees: ["R", "♭3", "5", "♭7"] },
  "mMaj7":  { suffix: "mMaj7",  label: "Minor Major 7th",    intervals: [0, 3, 7, 11],       degrees: ["R", "♭3", "5", "△7"] },
  "dim":    { suffix: "dim",    label: "Diminished",         intervals: [0, 3, 6],           degrees: ["R", "♭3", "♭5"] },
  "dim7":   { suffix: "dim7",   label: "Diminished 7th",     intervals: [0, 3, 6, 9],        degrees: ["R", "♭3", "♭5", "♭♭7"] },
  "m7b5":   { suffix: "m7♭5",   label: "Half Diminished",    intervals: [0, 3, 6, 10],       degrees: ["R", "♭3", "♭5", "♭7"] },
  "aug":    { suffix: "aug",    label: "Augmented",          intervals: [0, 4, 8],           degrees: ["R", "3", "♯5"] },
  "aug7":   { suffix: "7♯5",    label: "Augmented 7th",      intervals: [0, 4, 8, 10],       degrees: ["R", "3", "♯5", "♭7"] },
  "sus2":   { suffix: "sus2",   label: "Suspended 2nd",      intervals: [0, 2, 7],           degrees: ["R", "2", "5"] },
  "sus4":   { suffix: "sus4",   label: "Suspended 4th",      intervals: [0, 5, 7],           degrees: ["R", "4", "5"] },
  "7sus4":  { suffix: "7sus4",  label: "7th Sus4",           intervals: [0, 5, 7, 10],       degrees: ["R", "4", "5", "♭7"] },
  "add9":   { suffix: "add9",   label: "Add 9th",            intervals: [0, 4, 7, 14],       degrees: ["R", "3", "5", "9"] },
  "6":      { suffix: "6",      label: "6th",                intervals: [0, 4, 7, 9],        degrees: ["R", "3", "5", "6"] },
  "m6":     { suffix: "m6",     label: "Minor 6th",          intervals: [0, 3, 7, 9],        degrees: ["R", "♭3", "5", "6"] },
  "9":      { suffix: "9",      label: "9th",                intervals: [0, 4, 7, 10, 14],   degrees: ["R", "3", "5", "♭7", "9"] },
  "maj9":   { suffix: "maj9",   label: "Major 9th",          intervals: [0, 4, 7, 11, 14],   degrees: ["R", "3", "5", "△7", "9"] },
  "m9":     { suffix: "m9",     label: "Minor 9th",          intervals: [0, 3, 7, 10, 14],   degrees: ["R", "♭3", "5", "♭7", "9"] },
  "11":     { suffix: "11",     label: "11th",               intervals: [0, 4, 7, 10, 14, 17], degrees: ["R", "3", "5", "♭7", "9", "11"] },
  "5":      { suffix: "5",      label: "Power Chord",        intervals: [0, 7],              degrees: ["R", "5"] },
};

// 12 루트 × 22 타입 = 264개 코드 자동 생성
const CHORDS = [];
for (const root of ROOT_NOTES) {
  const rootMidi = rootToMidi(root);
  for (const [typeKey, typeDef] of Object.entries(CHORD_TYPES)) {
    CHORDS.push({
      name: root + typeDef.suffix,
      category: typeKey,
      notes: typeDef.intervals.map(i => midiToName(rootMidi + i, root)),
      degrees: typeDef.degrees,
    });
  }
}
