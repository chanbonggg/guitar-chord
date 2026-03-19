# 기타 코드 사전 — 프로젝트 계획

## 목표
기타 6줄 기준으로 코드 구성음과 스케일(음계) 위치를 시각적으로 보여주는 웹 앱.
서버 없이 브라우저에서 바로 열 수 있는 순수 HTML/CSS/JS.

---

## 기능 범위

### 코드 탭
- 코드 다이어그램 (SVG, 세로형 프렛보드)
  - 줄 두께 차등 (1번줄 얇게 ~ 6번줄 굵게)
  - 넛(nut) / 바레코드 baseFret 표시
  - X(뮤트) / O(개방현) 상단 마커
  - 손가락 번호 표시
- 코드명 + 구성음 (예: C = C · E · G)
- 카테고리 필터: Major / Minor / 7th / maj7
- 실시간 검색

### 스케일 탭
- 루트음 선택 (C ~ B, 12개)
- 스케일 종류: Major / Natural Minor / Major Pentatonic / Minor Pentatonic
- 전체 프렛보드 (가로형, 0~12프렛)
  - 프렛 인레이 마커 (3, 5, 7, 9 단일 / 12 이중)
  - 루트음: 주황색 점, 스케일음: 파란색 점
  - 음이름 점 위에 표시
- 구성음 텍스트 표시

---

## 파일 구조

```
E:/guitar-chord/
├── index.html      # HTML 골격, 탭 구조
├── style.css       # 다크 테마 스타일
├── chords.js       # 코드 데이터 (name, category, notes, frets, fingers)
├── scales.js       # 스케일 인터벌 데이터 + 프렛 위치 계산 함수
├── fretboard.js    # SVG 렌더링 (코드 다이어그램 / 스케일 프렛보드)
├── script.js       # 앱 로직 (탭, 검색, 필터, 렌더)
└── plan.md         # 이 파일
```

---

## 현재 코드 데이터 (chords.js)

| 카테고리 | 코드 |
|----------|------|
| major    | C D E F G A B |
| minor    | Am Bm Cm Dm Em Fm Gm |
| seventh  | C7 D7 E7 F7 G7 A7 B7 |
| maj7     | Cmaj7 Dmaj7 Emaj7 Fmaj7 Gmaj7 Amaj7 |

---

## 향후 추가 예정
- [ ] 더 많은 코드 (sus2, sus4, dim, aug, add9 등)
- [ ] 코드 클릭 시 상세 모달 (포지션별 보이싱 여러 개)
- [ ] 스케일 추가 (블루스, 도리안 등 모드)
- [ ] 기타 튜닝 변경 옵션
- [ ] 즐겨찾기 기능

---

## 실행 방법
`index.html`을 브라우저에서 바로 열기 (로컬 서버 불필요)
