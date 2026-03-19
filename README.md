# 🎸 기타 코드 사전

기타 코드 다이어그램과 스케일을 시각적으로 보여주는 순수 HTML/CSS/JS 웹 앱.

서버, 빌드 도구, 패키지 설치 없이 `index.html`을 브라우저에서 바로 열면 됩니다.

---

## 기능

### 코드 탭
- **264개 코드** — 12개 루트음 × 22가지 코드 타입 자동 생성
- 루트음 버튼(C~B)으로 필터링, 코드 선택 시 전체 지판에 구성음 표시
- 구성음 색상 구분: Root(주황) · 3rd(초록) · 5th(파랑) · 7th(보라) · 9th(노랑)

**지원 코드 타입 (22종)**

| 타입 | 이름 |
|------|------|
| Major | 장화음 |
| Minor | 단화음 |
| Dominant 7th | 속7화음 |
| Major 7th | 장7화음 |
| Minor 7th | 단7화음 |
| Minor Major 7th | 단장7화음 |
| Diminished | 감화음 |
| Diminished 7th | 감7화음 |
| Half Diminished (m7♭5) | 반감7화음 |
| Augmented | 증화음 |
| Augmented 7th (7♯5) | 증7화음 |
| sus2 / sus4 / 7sus4 | 서스펜디드 |
| add9 | 애드9 |
| 6th / Minor 6th | 6화음 |
| 9th / Major 9th / Minor 9th | 9화음 |
| 11th | 11화음 |
| Power Chord (5) | 파워코드 |

### 스케일 탭
- 루트음(12개) + 스케일 종류 선택
- 전체 지판(0~21프렛)에 스케일 위치 표시
- 루트음: 주황색 / 스케일음: 파란색
- 구성음 텍스트 표시

**지원 스케일 (4종)**

| 스케일 | 한글 |
|--------|------|
| Major | 장음계 |
| Natural Minor | 단음계 |
| Major Pentatonic | 메이저 펜타토닉 |
| Minor Pentatonic | 마이너 펜타토닉 |

### 즐겨찾기 탭
- ★ 버튼으로 코드 즐겨찾기 추가/제거
- localStorage에 자동 저장 (브라우저 재시작 후에도 유지)
- 탭 레이블에 즐겨찾기 개수 표시

---

## 실행 방법

```
index.html 파일을 브라우저에서 열기
```

별도 설치, 서버, 빌드 과정 없음.

---

## 파일 구조

```
guitar-chord/
├── index.html      # HTML 구조 및 탭 레이아웃
├── style.css       # 다크 우드 테마, CSS 변수, 반응형
├── scales.js       # MIDI 기반 음악 이론 엔진 (루트·스케일 계산)
├── chords.js       # 22가지 코드 타입 정의 + 264개 자동 생성
├── fretboard.js    # SVG 렌더링 엔진 (코드·스케일 공용)
└── script.js       # 앱 상태 관리, UI 이벤트, 즐겨찾기
```

### 스크립트 로딩 순서

```
scales.js → chords.js → fretboard.js → script.js
```

`chords.js`는 `scales.js`의 유틸 함수를 사용하므로 반드시 이후에 로드됩니다.

---

## 기술 스택

- **순수 HTML/CSS/JS** — 프레임워크, 라이브러리 없음
- **SVG** — 지판 다이어그램 렌더링
- **MIDI 번호** 기반 음악 이론 계산 (하드코딩 없이 코드·스케일 자동 생성)
- **localStorage** — 즐겨찾기 영속화
- **다크 우드 테마** — CSS 변수 기반, 반응형 (640px 브레이크포인트)

---

## 향후 계획

- 다중 보이싱 모달 (같은 코드의 여러 포지션)
- 추가 스케일 (Blues, Dorian 등 모드)
- 기타 튜닝 커스터마이징
- 코드 실시간 검색
