# Sync Notification Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 앞 단계 솔버가 재실행 완료되면, 뒤 단계 솔버들에 "동기화 필요" 알림을 Header 파이프라인에 표시

**Architecture:** SCMContext에 needsSync 상태 추가, Header 파이프라인 노드에 배지와 연결선 스타일 변경

**Tech Stack:** React, TypeScript, Tailwind CSS (기존 스택 유지)

---

## 1. 동작 시나리오

**Sync 필요 발생:**
- DP가 이미 complete 상태에서 다시 실행 → complete 될 때
- MP, FP, TP에 sync 알림 표시

**Sync 해제:**
- MP가 실행되어 complete 되면 → MP의 sync 알림 해제
- FP, TP는 여전히 sync 알림 유지

---

## 2. 상태 관리

```typescript
// SCMContext에 추가
needsSync: Record<SolverStage, boolean>;
lastCompletedStage: SolverStage | null;

// 초기값
{ dp: false, mp: false, fp: false, tp: false }
```

### 로직

**솔버 complete 시:**
1. 해당 Stage 자신의 needsSync: false로 설정
2. 이후 Stage들 중 이미 complete인 것들을 needsSync: true로 설정
3. lastCompletedStage 업데이트

---

## 3. Header 시각화

### 노드 배지
- 아이콘: `RefreshCw` (lucide-react)
- 크기: 14px, `bg-orange-500` 배경
- 위치: 우측 상단

### 연결선
- 정상: 시안색 실선
- Sync 필요: 주황색 점선

### 커스텀 툴팁
- 호버 시 "{Stage}가 재실행되어 동기화가 필요합니다" 표시
- 스타일: `bg-orange-900/90`, `border-orange-500`

---

## 4. 컴포넌트 구조

```
src/components/common/SyncBadge.tsx    # 새로 생성
src/components/layout/Header.tsx       # 수정
src/context/SCMContext.tsx             # 수정
```
