// 스케일 데이터
// 표준 튜닝 각 줄의 기준 MIDI 음 (0번 프렛)
// 6번줄(E2)=40, 5번줄(A2)=45, 4번줄(D3)=50, 3번줄(G3)=55, 2번줄(B3)=59, 1번줄(E4)=64
const OPEN_STRINGS = [40, 45, 50, 55, 59, 64]; // 인덱스 0 = 6번줄(가장 굵은)

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

// 플랫 표기가 자연스러운 루트음
const PREFER_FLAT = new Set(["F", "Bb", "Eb", "Ab", "Db", "Gb"]);

const SCALE_INTERVALS = {
  "Major":            { intervals: [0, 2, 4, 5, 7, 9, 11], label: "장음계" },
  "Natural Minor":    { intervals: [0, 2, 3, 5, 7, 8, 10], label: "단음계" },
  "Major Pentatonic": { intervals: [0, 2, 4, 7, 9],         label: "메이저 펜타토닉" },
  "Minor Pentatonic": { intervals: [0, 3, 5, 7, 10],        label: "마이너 펜타토닉" },
};

const ROOT_NOTES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

/**
 * 루트음 이름 → MIDI 반음 번호 (0=C, 1=C#, ...)
 */
function rootToMidi(root) {
  let idx = NOTE_NAMES.indexOf(root);
  if (idx === -1) idx = NOTE_NAMES_FLAT.indexOf(root);
  return idx;
}

/**
 * MIDI 반음 번호 → 음이름 (루트에 따라 #/b 결정)
 */
function midiToName(midi, root) {
  const pc = ((midi % 12) + 12) % 12;
  return PREFER_FLAT.has(root) ? NOTE_NAMES_FLAT[pc] : NOTE_NAMES[pc];
}

/**
 * 스케일 구성음 배열 반환
 * @param {string} root - 루트음 (예: "C", "F#")
 * @param {string} scaleName - 스케일 이름
 * @returns {string[]} 구성음 배열
 */
function getScaleNotes(root, scaleName) {
  const rootMidi = rootToMidi(root);
  const { intervals } = SCALE_INTERVALS[scaleName];
  return intervals.map(i => midiToName(rootMidi + i, root));
}

/**
 * 스케일에 해당하는 프렛보드 위치 계산
 * @param {string} root
 * @param {string} scaleName
 * @param {number} maxFret - 표시할 최대 프렛 (기본 21)
 * @returns {Array<{string: number, fret: number, note: string, isRoot: boolean}>}
 */
function getScaleFretPositions(root, scaleName, maxFret = 21) {
  const rootMidi = rootToMidi(root);
  const { intervals } = SCALE_INTERVALS[scaleName];
  const scaleSet = new Set(intervals.map(i => ((rootMidi + i) % 12 + 12) % 12));
  const rootPc = ((rootMidi % 12) + 12) % 12;

  const positions = [];
  for (let s = 0; s < 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      const midi = OPEN_STRINGS[s] + f;
      const pc = ((midi % 12) + 12) % 12;
      if (scaleSet.has(pc)) {
        positions.push({
          string: s,   // 0 = 6번줄(가장 굵은)
          fret: f,
          note: midiToName(midi, root),
          isRoot: pc === rootPc,
          colorIndex: 0,
        });
      }
    }
  }
  return positions;
}

/**
 * 코드 구성음의 전체 지판 위치 계산
 * @param {string[]} notes - 구성음 배열 (예: ["C","E","G"])
 * @param {number} maxFret
 * @returns {Array<{string, fret, note, colorIndex}>}
 *   colorIndex: 0=루트, 1=3rd, 2=5th, 3=7th
 */
function getChordFretPositions(notes, maxFret = 21) {
  // 각 음의 pitch class
  const notePcs = notes.map(n => {
    let idx = NOTE_NAMES.indexOf(n);
    if (idx === -1) idx = NOTE_NAMES_FLAT.indexOf(n);
    return ((idx % 12) + 12) % 12;
  });
  const pcToIndex = {};
  notePcs.forEach((pc, i) => { pcToIndex[pc] = i; });

  const root = notes[0];
  const positions = [];
  for (let s = 0; s < 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      const midi = OPEN_STRINGS[s] + f;
      const pc = ((midi % 12) + 12) % 12;
      if (pc in pcToIndex) {
        positions.push({
          string: s,
          fret: f,
          note: midiToName(midi, root),
          colorIndex: pcToIndex[pc],
        });
      }
    }
  }
  return positions;
}
