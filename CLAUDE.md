# Nexprime SCM POC Project Guide

## 1. Project Overview
- **Name:** Nexprime SCM Integrated Platform POC
- **Objective:** SCM 솔버 간의 유기적 데이터 흐름(DP -> MP -> FP -> TP)을 시각화하는 프론트엔드 프로토타입 구현.
- **Key Flow:** Demand Planning -> Master Planning -> Factory Planning -> Transportation Planning.

## 2. Tech Stack (Frontend Only)
- **Framework:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI, Lucide-react (Icons)
- **Charts/Viz:** Recharts, Framer Motion (Animations)
- **State Management:** React Hooks (useState, useContext)
- **Data Mocking:** `src/mocks/data.ts` (중앙 집중식 더미 데이터 관리)

## 3. Core Development Commands
- **Install:** `npm install`
- **Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## 4. Coding Standards & UI Rules
- **Brand Identity:** 'Nexprime SCM' 테마 적용. Dark Mode 베이스에 Cyan (#00FFFF) 및 Deep Blue 계열 사용.
- **Component Structure:** `src/components/` (공통 컴포넌트), `src/pages/` (단계별 화면).
- **Solver Dashboard Requirements:**
    - 상단: 솔버별 핵심 KPI 카드 (예: 예측 정확도, 서비스 레벨).
    - 중앙 좌측: 솔버 결과 시각화 위젯 (차트, 간트 차트, 지도 등).
    - **중앙 우측/하단: 'Live Solver Log' 컴포넌트 필수 포함.**
        - 터미널 스타일의 UI (Black background, Monospace font).
        - 타임스탬프, 로그 레벨(INFO, WARN, ERROR), 메시지 출력.
        - 솔버 구동 시 실제 계산이 일어나는 것처럼 보이도록 텍스트가 아래에서 위로 스트리밍되어야 함.
- **Interactions:** 'Run Solver' 버튼 클릭 시 로딩 애니메이션과 함께 로그 스트리밍이 시작되어야 함.

## 5. Domain Context (Log Content Example)
- **DP Log:** "AI Model Training... Iteration 5/10... Loss: 0.024", "Demand Sensing analysis completed."
- **MP Log:** "Balancing Supply and Demand...", "Resolving resource constraints for Plant A."
- **FP Log:** "Genetic Algorithm started...", "Initial population generated.", "Optimal sequence found at Generation 45."
- **TP Log:** "VRP Solver initializing...", "Route optimization in progress for 15 vehicles.", "Objective: Minimized distance 450km."