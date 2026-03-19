// SVG 렌더링 모듈

// 코드톤 색상: 0=루트(주황), 1=3rd(초록), 2=5th(파랑), 3=7th(보라)
const TONE_COLORS = [
  { fill: "#f5a623", stroke: "#c47d0a", text: "#1a1a1a" }, // 루트
  { fill: "#4caf50", stroke: "#2e7d32", text: "#fff" },    // 3rd / 2nd / 4th
  { fill: "#4a9eff", stroke: "#1565c0", text: "#fff" },    // 5th
  { fill: "#ce93d8", stroke: "#7b1fa2", text: "#1a1a1a" }, // 7th / 6th
  { fill: "#ffca28", stroke: "#f59f00", text: "#1a1a1a" }, // 9th / 11th (텐션)
  { fill: "#ef5350", stroke: "#c62828", text: "#fff" },    // 11th (6음째)
];

// 프렛 인레이 위치
const FRET_MARKERS = {
  3: 1, 5: 1, 7: 1, 9: 1,
  12: 2, 15: 1, 17: 1, 19: 1, 21: 2,
};

/**
 * 전체 프렛보드 SVG 생성 (코드 & 스케일 공용)
 * @param {Array} positions - [{string, fret, note, colorIndex, isRoot}]
 * @param {number} maxFret
 * @param {boolean} multiColor - true면 colorIndex 기준 색상, false면 isRoot로만 구분
 */
function renderFretboard(positions, maxFret = 21, multiColor = false) {
  const NUM_STRINGS = 6;
  const cellW = 46;
  const cellH = 30;
  const padLeft = 30;
  const padTop = 14;
  const padBottom = 28;
  const nutW = 7;

  const boardW = cellW * maxFret + nutW;
  const boardH = cellH * (NUM_STRINGS - 1);
  const svgW = padLeft + boardW + 12;
  const svgH = padTop + boardH + padBottom;

  const stringWidths = [2.4, 2.0, 1.6, 1.3, 1.0, 0.8]; // 0=6번줄 굵
  const STRING_NAMES = ["E", "A", "D", "G", "B", "e"];

  const fretCx = (fret) =>
    fret === 0
      ? padLeft + nutW / 2
      : padLeft + nutW + (fret - 0.5) * cellW;
  const fretLineX = (fret) => padLeft + nutW + fret * cellW;
  const sy = (s) => padTop + s * cellH;

  let svg = `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">`;

  // 배경
  svg += `<rect x="${padLeft}" y="${padTop}" width="${boardW}" height="${boardH}" fill="#1e1a14" rx="4"/>`;

  // 넛
  svg += `<rect x="${padLeft}" y="${padTop}" width="${nutW}" height="${boardH}" fill="#d4a843"/>`;

  // 프렛 선
  for (let f = 1; f <= maxFret; f++) {
    const x = fretLineX(f);
    svg += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${padTop + boardH}" stroke="#3a3530" stroke-width="1"/>`;
  }

  // 프렛 인레이 마커
  for (const [fret, count] of Object.entries(FRET_MARKERS)) {
    const f = parseInt(fret);
    if (f > maxFret) continue;
    const x = padLeft + nutW + (f - 0.5) * cellW;
    const midY = padTop + boardH / 2;
    if (count === 1) {
      svg += `<circle cx="${x}" cy="${midY}" r="4" fill="#3a3530"/>`;
    } else {
      const gap = cellH * 0.85;
      svg += `<circle cx="${x}" cy="${midY - gap / 2}" r="4" fill="#3a3530"/>`;
      svg += `<circle cx="${x}" cy="${midY + gap / 2}" r="4" fill="#3a3530"/>`;
    }
  }

  // 줄 선
  for (let s = 0; s < NUM_STRINGS; s++) {
    const y = sy(s);
    svg += `<line x1="${padLeft + nutW}" y1="${y}" x2="${padLeft + boardW}" y2="${y}" stroke="#8a8070" stroke-width="${stringWidths[s]}"/>`;
  }

  // 줄 이름
  for (let s = 0; s < NUM_STRINGS; s++) {
    svg += `<text x="${padLeft - 7}" y="${sy(s) + 4}" text-anchor="end" font-size="11" fill="#777" font-family="monospace">${STRING_NAMES[s]}</text>`;
  }

  // 프렛 번호
  for (let f = 0; f <= maxFret; f++) {
    const x = fretCx(f);
    svg += `<text x="${x}" y="${padTop + boardH + 18}" text-anchor="middle" font-size="10" fill="#555">${f}</text>`;
  }

  // 음 점
  for (const pos of positions) {
    const x = fretCx(pos.fret);
    const y = sy(pos.string);

    let color;
    if (multiColor) {
      color = TONE_COLORS[pos.colorIndex] || TONE_COLORS[0];
    } else {
      // 스케일 모드: 루트=주황, 나머지=파랑
      color = pos.isRoot ? TONE_COLORS[0] : TONE_COLORS[2];
    }

    svg += `<circle cx="${x}" cy="${y}" r="11" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.5"/>`;
    svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="9" fill="${color.text}" font-weight="bold">${pos.note}</text>`;
  }

  svg += `</svg>`;
  return svg;
}

// 하위 호환용 래퍼 (스케일 탭)
function renderScaleFretboard(positions, maxFret = 21) {
  return renderFretboard(positions, maxFret, false);
}
