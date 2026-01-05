# Sync Notification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 앞 단계 솔버가 재실행 완료되면, 뒤 단계 솔버들에 "동기화 필요" 알림을 Header 파이프라인에 표시

**Architecture:** SCMContext에 needsSync 상태 추가, SyncBadge 컴포넌트 생성, Header에서 배지와 연결선 스타일 변경

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React

---

## Task 1: SCMContext에 needsSync 상태 추가

**Files:**
- Modify: `src/context/SCMContext.tsx`

**Step 1: SCMContextType에 needsSync 추가**

```typescript
// interface SCMContextType에 추가
needsSync: Record<SolverStage, boolean>;
lastCompletedStage: SolverStage | null;
```

**Step 2: 상태 초기화**

```typescript
const [needsSync, setNeedsSync] = useState<Record<SolverStage, boolean>>({
  dp: false,
  mp: false,
  fp: false,
  tp: false,
});

const [lastCompletedStage, setLastCompletedStage] = useState<SolverStage | null>(null);
```

**Step 3: runSolver 함수 내 complete 처리 부분 수정**

솔버가 complete될 때 (streamLog 함수 내, `setSolverStatus(prev => ({ ...prev, [stage]: 'complete' }))` 근처):

```typescript
// 기존 complete 처리 후 추가
setLastCompletedStage(stage);

// 해당 stage 이후의 complete 상태인 stage들에 needsSync 설정
const stageIndex = stageOrder.indexOf(stage);
setNeedsSync(prev => {
  const updated = { ...prev, [stage]: false }; // 자신은 해제
  for (let i = stageIndex + 1; i < stageOrder.length; i++) {
    const nextStage = stageOrder[i];
    // 이미 complete인 stage만 sync 필요
    if (solverStatus[nextStage] === 'complete') {
      updated[nextStage] = true;
    }
  }
  return updated;
});
```

**Step 4: resetDemo에 needsSync 초기화 추가**

```typescript
setNeedsSync({ dp: false, mp: false, fp: false, tp: false });
setLastCompletedStage(null);
```

**Step 5: Provider value에 추가**

```typescript
value={{
  // ... 기존
  needsSync,
  lastCompletedStage,
}}
```

**Step 6: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 7: Commit**

```bash
git add src/context/SCMContext.tsx
git commit -m "feat: add needsSync state to SCMContext"
```

---

## Task 2: SyncBadge 컴포넌트 생성

**Files:**
- Create: `src/components/common/SyncBadge.tsx`

**Step 1: 컴포넌트 생성**

```typescript
// src/components/common/SyncBadge.tsx
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SolverStage } from '../../types';

const stageNames: Record<SolverStage, string> = {
  dp: 'DP',
  mp: 'MP',
  fp: 'FP',
  tp: 'TP',
};

interface SyncBadgeProps {
  triggerStage: SolverStage;
}

export default function SyncBadge({ triggerStage }: SyncBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="absolute -top-1 -right-1"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge */}
      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
        <RefreshCw size={10} className="text-white" />
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-orange-900/95 border border-orange-500 rounded-lg px-3 py-2 whitespace-nowrap">
              <p className="text-orange-100 text-xs">
                {stageNames[triggerStage]}가 재실행되어
              </p>
              <p className="text-orange-100 text-xs">
                동기화가 필요합니다
              </p>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-orange-900/95" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 3: Commit**

```bash
git add src/components/common/SyncBadge.tsx
git commit -m "feat: add SyncBadge component with tooltip"
```

---

## Task 3: Header에 SyncBadge 적용

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: Import 추가**

```typescript
import SyncBadge from '../common/SyncBadge';
```

**Step 2: useSCM에서 needsSync, lastCompletedStage 가져오기**

```typescript
const { solverStatus, solverOutputs, needsSync, lastCompletedStage } = useSCM();
```

**Step 3: 노드에 SyncBadge 추가**

NavLink 내부, motion.div 다음에:

```typescript
<NavLink to={`/${stage}`} className="flex flex-col items-center gap-1">
  <div className="relative">
    <motion.div
      className={getNodeClasses(stage)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {stage.toUpperCase()}
    </motion.div>
    {/* Sync Badge */}
    {needsSync[stage] && lastCompletedStage && (
      <SyncBadge triggerStage={lastCompletedStage} />
    )}
  </div>
  {/* ... 나머지 (label, badge count) */}
</NavLink>
```

**Step 4: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 5: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: add SyncBadge to Header pipeline nodes"
```

---

## Task 4: 연결선 스타일 변경

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: getConnectorStyle 함수 추가**

```typescript
const getConnectorStyle = (currentStage: SolverStage, nextStageIndex: number): string => {
  const nextStage = stageOrder[nextStageIndex];

  // 다음 stage가 sync 필요하면 점선
  if (needsSync[nextStage]) {
    return 'border-2 border-dashed border-orange-400 bg-transparent';
  }

  // 현재 stage가 complete면 실선
  if (solverStatus[currentStage] === 'complete') {
    return 'bg-nexprime-cyan';
  }

  return 'bg-nexprime-cyan/20';
};
```

**Step 2: 연결선 렌더링 수정**

기존 연결선 부분을:

```typescript
{/* Connector Line */}
{index < stageOrder.length - 1 && (
  <div className="w-12 h-0.5 mx-2 relative">
    {needsSync[stageOrder[index + 1]] ? (
      // Sync 필요: 주황 점선
      <div className="absolute inset-0 border-t-2 border-dashed border-orange-400" />
    ) : (
      <>
        <div className="absolute inset-0 bg-nexprime-cyan/20" />
        {solverStatus[stage] === 'complete' && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-nexprime-cyan origin-left"
          />
        )}
      </>
    )}
  </div>
)}
```

**Step 3: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: add dashed orange connector for sync-needed stages"
```

---

## Task 5: Final Verification

**Step 1: Build 확인**

Run: `npm run build`
Expected: 성공, 에러 없음

**Step 2: Lint 확인**

Run: `npm run lint`
Expected: 에러 없음 (warning은 허용)

**Step 3: Dev Server 테스트**

Run: `timeout 5 npm run dev`
Expected: 서버 시작 성공

**Step 4: 기능 체크리스트**
- [ ] DP 실행 완료 시 MP, FP, TP에 sync 배지 없음 (초기 상태)
- [ ] DP 재실행 완료 시 MP, FP, TP에 sync 배지 표시
- [ ] 배지 호버 시 툴팁 표시
- [ ] 연결선이 주황색 점선으로 변경
- [ ] MP 실행 완료 시 MP sync 배지 해제
- [ ] Reset Demo 시 모든 sync 배지 해제
