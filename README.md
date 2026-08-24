# BRADINGO 🎓

### A Surprise Graduation Experience for Bradie

> **8년 6개월의 대학생활을 마친 친구를 위해 만든
> 단 하나뿐인 인터랙티브 졸업 서프라이즈 웹페이지**

**Play:** [https://yazii4362.github.io/BRADINGO-2026/](https://yazii4362.github.io/BRADINGO-2026/)

BRADINGO는 **8년 6개월 동안 성실하게 학교생활을 해온 저의 친구 Bradie의 졸업을 축하하기 위해 제작한 개인적인 서프라이즈 웹 프로젝트**입니다.

Bradie는 실제로 **Duolingo 연속 학습 기록 1,000일을 돌파할 정도로 꾸준히 Duolingo를 사용해온 친구**입니다.

친구에게 익숙하면서도 재미있는 방식으로 졸업을 축하하고 싶어, **Duolingo의 학습 코스와 게임형 UX에서 아이디어를 얻어 Bradie의 대학생활을 하나의 `Graduation Quest`로 재구성**했습니다.

Figma Community의 오픈소스 디자인 리소스를 참고하고, 친구와 관련된 실제 에피소드, 사진, 밈, 졸업 축하 메시지와 직접 제작한 캐릭터 및 그래픽을 더해 BRADINGO만의 비주얼 시스템을 만들었습니다.

**7월 말부터 약 2주간 기획 → 디자인 → 개발을 진행했으며, 최종적으로 실제 웹페이지 형태로 구현하여 배포까지 완료했습니다.**

**친구가 직접 문제를 풀고 지난 추억을 따라가며 마지막 졸업 화면에 도착하는 과정을 게임처럼 몰입해 경험할 수 있도록 디자인했습니다.**

---

## Preview

<!-- 대표 썸네일 또는 OG 이미지 -->

<p align="center">
  <img src="./assets/images/readme/thumbnail.png" width="100%" alt="BRADINGO Preview" />
</p>

### UI Screens

<p align="center">
  <img src="./assets/images/readme/intro.png" width="23%" alt="Intro" />
  <img src="./assets/images/readme/course-map.png" width="23%" alt="Course Map" />
  <img src="./assets/images/readme/quiz.png" width="23%" alt="Quiz" />
  <img src="./assets/images/readme/ending.png" width="23%" alt="Ending" />
</p>

<p align="center">
  Intro · Course Map · Quiz · Ending
</p>

---

# Background

Bradie에게는 두 개의 긴 기록이 있습니다.

### 🎓 University Life

**8년 6개월**

긴 대학생활을 마무리하고 졸업을 맞이했습니다.

### 🔥 Duolingo Streak

**1,000+ Days**

매일 꾸준히 Duolingo를 사용하며 1,000일 이상의 연속 학습 기록을 이어왔습니다.

이 두 기록을 연결하면서 프로젝트의 콘셉트를 정했습니다.

> **“8년 6개월의 대학생활을 하나의 긴 학습 코스로 표현하면 어떨까?”**

Bradie가 익숙하게 사용해온 학습 서비스의 진행 방식을 졸업이라는 상황에 맞춰 다시 구성하고, 대학생활의 에피소드와 추억을 하나씩 경험하며 마지막 `Graduation` 단계까지 도착하도록 전체 흐름을 설계했습니다.

---

# Experience

BRADINGO의 메인 화면은 **Course Map**입니다.

사용자는 각 단계를 순서대로 경험하면서 Bradie의 대학생활을 따라갑니다.

```text
Intro
  ↓
Course Map
  ↓
학교생활 Quiz
  ↓
졸업 자격 심사
  ↓
우리의 추억
  ↓
친구들의 졸업 축하 메시지
  ↓
Graduation Ending
```

각 단계에는 Bradie와 친구들이 실제로 공유했던 이야기와 콘텐츠를 활용했습니다.

문제를 풀고, 사진을 보고, 친구들의 메시지를 확인하는 행동이 이어지면서 전체 대학생활을 하나의 작은 게임처럼 경험하도록 구성했습니다.

---

# Design Focus

## 01. Personalization

이 프로젝트에서 가장 중요하게 생각한 부분은 **Bradie라는 한 사람에게 얼마나 자연스럽게 맞춰진 경험을 만들 수 있는가**였습니다.

프로젝트 전반에 실제 Bradie의 대학생활에서 가져온 소재를 사용했습니다.

- 학교생활 에피소드
- 친구들만 이해할 수 있는 밈
- 실제 추억 사진
- 좋아했던 음식과 장소
- 친구들의 졸업 축하 메시지
- 대학생활 기간
- Duolingo 연속 학습 기록

콘텐츠와 인터랙션이 서로 연결되도록 구성해, 화면마다 Bradie와 관련된 이야기가 이어지도록 디자인했습니다.

---

## 02. Graduation as a Journey

졸업을 하나의 결과 화면으로 두기보다 **마지막 단계에 도착하는 과정 전체**를 경험으로 설계했습니다.

각 코스는 다음 세 가지 상태를 가집니다.

- Completed
- Active
- Locked

사용자가 현재 어느 단계에 있는지 확인할 수 있고, 하나의 과정을 마치면 다음 단계로 자연스럽게 이어집니다.

Course Map 자체가 Bradie의 대학생활을 표현하는 하나의 타임라인 역할을 하도록 구성했습니다.

---

## 03. Familiar UX

Bradie가 오랫동안 Duolingo를 사용해왔다는 점을 프로젝트의 UX에도 반영했습니다.

다음과 같은 모바일 학습 서비스의 익숙한 사용 방식을 참고했습니다.

- Course Map
- 단계별 Progress
- 선택형 Quiz
- 정답 / 오답 Feedback
- 완료 상태 표현
- 다음 단계 안내
- Button Press Motion
- Character Reaction

처음 접하는 화면에서도 사용법을 쉽게 이해하고 바로 진행할 수 있도록 인터랙션을 구성했습니다.

---

## 04. Character & Visual System

프로젝트 안에서 사용되는 캐릭터와 그래픽도 직접 구성했습니다.

Bradie를 표현한 캐릭터와 프로젝트 마스코트 **이루매**, 서울시립대학교 건물을 활용한 캠퍼스 일러스트, 학사모와 졸업복 등의 졸업 요소를 하나의 스타일로 맞췄습니다.

주요 비주얼 요소는 다음과 같습니다.

- Bradie Character
- 이루매 Mascot
- Graduation Character Variations
- Campus Illustration
- Course Node
- Favicon
- OG Thumbnail
- Ending Graphic
- Coffee Chat Graphic
- Character Motion Assets

학교 건물은 실제 서울시립대학교의 건물 형태와 높이, 외관 특징을 참고해 프로젝트의 그래픽 스타일로 재구성했습니다.

---

## 05. Mobile First

BRADINGO는 친구에게 링크를 전달하고 스마트폰에서 바로 실행하는 상황을 기준으로 제작했습니다.

**390px 모바일 화면을 기본 기준**으로 디자인하고, 데스크톱 환경에서는 모바일 화면의 집중도를 유지하도록 최대 너비를 제한했습니다.

모바일에서의 사용성을 위해 다음 부분을 고려했습니다.

- 한 손으로 누르기 쉬운 버튼 크기
- 짧은 화면 단위의 콘텐츠
- 명확한 시각적 위계
- 화면 이동 시 즉각적인 피드백
- 브라우저 새로고침 후 진행 상태 유지
- 이미지 저장 및 공유
- 모바일 Safe Area

---

## 06. Motion & Feedback

모션은 화면을 꾸미는 요소보다 **사용자의 행동에 반응하는 피드백**으로 활용했습니다.

주요 모션은 다음과 같습니다.

- 화면 전환
- 버튼 Press
- 활성 Course Node
- 다음 단계 등장
- Quiz 정답 / 오답
- Character Motion
- Ending Animation

캐릭터의 표정과 간단한 움직임도 화면 상태에 맞춰 사용할 수 있도록 여러 포즈와 애니메이션용 프레임을 제작했습니다.

---

# UI

## Intro

<p align="center">
  <img src="./assets/images/readme/intro.png" width="360" alt="BRADINGO Intro" />
</p>

첫 화면에서는 캠퍼스와 졸업 캐릭터를 중심으로 BRADINGO의 분위기를 보여줍니다.

서울시립대학교 건물과 Bradie, 이루매를 하나의 Hero Scene으로 구성해 사이트에 접속하는 순간 졸업 프로젝트라는 점을 바로 이해할 수 있도록 했습니다.

---

## Course Map

<p align="center">
  <img src="./assets/images/readme/course-map.png" width="360" alt="BRADINGO Course Map" />
</p>

Course Map은 전체 프로젝트의 중심 화면입니다.

각 단계를 하나의 노드로 구성하고 현재 진행 위치를 명확하게 보여줍니다.

```text
Completed → Active → Locked
```

사용자는 Course Map을 중심으로 각 콘텐츠에 들어갔다가 다시 돌아오며 졸업까지의 과정을 이어갑니다.

---

## Quiz

<p align="center">
  <img src="./assets/images/readme/quiz.png" width="360" alt="BRADINGO Quiz" />
</p>

Bradie의 학교생활과 관련된 실제 이야기를 Quiz 형태로 구성했습니다.

텍스트를 읽는 방식보다 직접 답을 고르는 행동을 통해 친구와 공유했던 에피소드를 다시 떠올릴 수 있도록 했습니다.

정답과 오답 결과에는 별도의 피드백을 제공하고 다음 행동을 바로 이해할 수 있도록 구성했습니다.

---

## Memories

<p align="center">
  <img src="./assets/images/readme/memories.png" width="360" alt="BRADINGO Memories" />
</p>

친구들과 함께한 사진과 대학생활의 기록을 모아 보여주는 콘텐츠입니다.

시간의 흐름과 에피소드가 자연스럽게 이어지도록 사진과 텍스트를 배치해 Bradie가 자신의 대학생활을 다시 돌아볼 수 있도록 구성했습니다.

---

## Graduation Messages

<p align="center">
  <img src="./assets/images/readme/messages.png" width="360" alt="BRADINGO Messages" />
</p>

함께 학교생활을 보낸 친구들의 졸업 축하 메시지를 프로젝트 안에 담았습니다.

앞선 과정을 경험한 뒤 친구들의 메시지를 만나도록 순서를 설계해 전체 프로젝트의 감정적인 흐름이 졸업으로 자연스럽게 이어지도록 했습니다.

---

## Ending

<p align="center">
  <img src="./assets/images/readme/ending.png" width="360" alt="BRADINGO Ending" />
</p>

마지막 단계에서는 전체 코스를 완료했다는 성취감과 졸업 축하의 분위기를 함께 전달하도록 디자인했습니다.

메인 화면과 시각적으로 다른 분위기를 적용해 마지막 단계라는 느낌을 강조하고, 완료 후에는 졸업 기념 이미지를 저장하거나 공유할 수 있도록 구성했습니다.

---

# Tech Stack

## Languages

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000)

- HTML5
- CSS3
- Vanilla JavaScript
- JavaScript ES Modules

## Interaction

- GSAP
- CSS Animation
- DOM Interaction

## Browser

- LocalStorage
- SessionStorage
- History API
- Web Share API
- Canvas / Blob API

## Deployment

- GitHub
- GitHub Pages

---

# Design & Development Tools

| Tool                 | Role                          |
| -------------------- | ----------------------------- |
| **Figma**            | UI 디자인, 컴포넌트 제작, 비주얼 시스템 설계   |
| **Figma Community**  | 오픈소스 디자인 리소스 및 UI 레퍼런스 탐색     |
| **Figma Design MCP** | Figma 디자인 정보를 개발 환경과 연결       |
| **Cursor**           | Frontend 구현, 디버깅, 코드 구조 개선    |
| **Claude Design**    | UI 방향 탐색, 디자인 아이디어 검토 및 시안 보조 |

---

# AI-assisted Workflow

약 2주의 제작 기간 동안 **기획 → 디자인 → 개발 → 배포**까지 전체 과정을 빠르게 반복하기 위해 AI 도구를 적극적으로 활용했습니다.

프로젝트의 기획 방향, UX Flow, 콘텐츠, 캐릭터 설정, 비주얼 방향과 최종 디자인 판단은 직접 진행하고, AI는 디자인 탐색과 구현 속도를 높이는 협업 도구로 사용했습니다.

### Planning

```text
Bradie의 특징과 추억 정리
        ↓
Graduation Quest Concept
        ↓
Information Architecture
        ↓
User Flow
```

### Design

```text
Reference Research
        ↓
Wireframe
        ↓
Visual Direction
        ↓
Character / Graphic
        ↓
UI Design
```

### Development

```text
Figma
   ↓
Figma Design MCP
   ↓
Cursor
   ↓
Frontend Implementation
   ↓
Interaction / Debugging
   ↓
Deploy
```

Cursor에서는 화면 구성, 상태 관리, 인터랙션, 반응형 처리와 디버깅을 반복하며 실제 웹 프로젝트로 구현했습니다.

Claude Design은 여러 UI 방향을 빠르게 비교하고 디자인 아이디어를 검토하는 과정에서 활용했습니다.

Figma Design MCP는 디자인과 개발 사이의 컨텍스트 전달을 돕는 용도로 사용했습니다.

---

# Key Features

- 🎓 Graduation Quest
- 🗺 Interactive Course Map
- 🧩 Personalized Quiz
- 📸 Memory Archive
- 💌 Graduation Messages
- 🧑‍🎓 Personalized Character
- 🐦 Original Mascot
- 💾 Progress Persistence
- 🎞 Micro Interaction
- 📱 Mobile-first Responsive Design
- 🖼 Graduation Image Save
- 📤 Mobile Share
- 🔗 OG Thumbnail & Favicon

---

# Project Schedule

**Production Period — 약 2주**

```text
7월 말
│
├─ Concept & Planning
├─ User Flow
├─ Visual Direction
├─ Character / Graphic Design
├─ UI Design
├─ Frontend Development
├─ Interaction
├─ Responsive QA
└─ Deploy
```

짧은 기간 동안 디자인과 개발을 분리된 단계로 진행하기보다, 실제 브라우저 결과를 확인하며 디자인과 구현을 반복해서 조정하는 방식으로 작업했습니다.

---

# What I Focused On

BRADINGO를 디자인하면서 가장 중요하게 생각한 질문은 다음과 같았습니다.

> **“Bradie에게 의미 있는 기억을 웹 인터랙션으로 어떻게 표현할 것인가?”**

이를 위해 다음 다섯 가지에 집중했습니다.

### 1. Bradie에게만 의미 있는 콘텐츠

실제 대학생활과 친구들의 이야기를 콘텐츠의 중심으로 사용했습니다.

### 2. 다음 단계에 대한 기대감

전체 내용을 한 화면에 보여주지 않고 단계별로 경험하도록 구성해 다음 콘텐츠에 대한 궁금증이 이어지도록 했습니다.

### 3. 기억을 행동으로 경험하는 방식

사진과 메시지를 보는 것과 함께 문제를 풀고 선택하는 행동을 넣어 사용자가 프로젝트에 직접 참여하도록 만들었습니다.

### 4. 하나의 세계처럼 연결되는 비주얼

Bradie 캐릭터, 이루매, 캠퍼스, Course Map, 졸업 그래픽을 같은 비주얼 시스템 안에서 사용할 수 있도록 디자인했습니다.

### 5. 마지막까지 이어지는 감정의 흐름

인트로에서 시작해 학교생활, 추억, 친구들의 메시지를 거쳐 졸업 엔딩에 도착하도록 콘텐츠의 순서를 설계했습니다.

---

# Result

BRADINGO는 **친구 한 명을 위해 약 2주 동안 기획, 디자인, 개발하여 실제로 배포한 개인적인 졸업 서프라이즈 프로젝트**입니다.

Bradie의 **8년 6개월 대학생활**과 **Duolingo 1,000일 이상의 연속 기록**을 프로젝트의 핵심 소재로 삼아, 그의 대학생활을 하나의 `Graduation Quest`로 표현했습니다.

친구가 직접 문제를 풀고 추억을 발견하며 마지막 졸업 화면까지 도착하는 과정 전체가 하나의 작은 디지털 졸업 이벤트가 되도록 제작했습니다.

---

## Note

BRADINGO는 친구 Bradie의 졸업을 축하하기 위해 제작한 **개인적인 비상업적 서프라이즈 프로젝트**입니다.

실제 친구들과의 추억과 개인적인 이야기를 기반으로 제작했으며, 공식 학교 프로젝트나 상용 서비스와 관련이 없습니다.

Duolingo의 공개적으로 관찰 가능한 학습 UX와 게임형 진행 방식에서 영감을 얻었으며, 프로젝트에 사용된 캐릭터, 그래픽, 콘텐츠와 구현 코드는 BRADINGO의 목적에 맞게 제작했습니다.
