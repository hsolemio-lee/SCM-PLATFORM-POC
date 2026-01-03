// src/components/dashboard/ActivityTimeline.tsx
import { Play, Check, Loader2 } from 'lucide-react';
import { useSCM } from '../../context/SCMContext';
import { ActivityEvent, SolverStage } from '../../types';

const stageNames: Record<SolverStage, string> = {
  dp: 'DP',
  mp: 'MP',
  fp: 'FP',
  tp: 'TP',
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 10) return '방금 전';
  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  return `${Math.floor(diffMin / 60)}시간 전`;
}

function getEventIcon(event: ActivityEvent, isLatestStart: boolean) {
  if (event.type === 'complete') {
    return <Check size={14} className="text-green-400" />;
  }
  if (isLatestStart) {
    return <Loader2 size={14} className="text-nexprime-cyan animate-spin" />;
  }
  return <Play size={14} className="text-nexprime-cyan" />;
}

export default function ActivityTimeline() {
  const { activityLog, solverStatus } = useSCM();

  // 최근 5개만 표시
  const recentEvents = activityLog.slice(0, 5);

  // 현재 실행 중인 stage 확인
  const runningStage = Object.entries(solverStatus).find(
    ([, status]) => status === 'running'
  )?.[0] as SolverStage | undefined;

  if (recentEvents.length === 0) {
    return (
      <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-3">
        <h4 className="text-white/70 text-sm font-medium mb-2">Recent Activity</h4>
        <p className="text-white/30 text-xs">아직 활동이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-3">
      <h4 className="text-white/70 text-sm font-medium mb-3">Recent Activity</h4>
      <div className="space-y-3">
        {recentEvents.map((event, index) => {
          const isLatestStart = event.type === 'start' &&
            event.stage === runningStage &&
            index === 0;

          return (
            <div key={event.id} className="flex items-start gap-2">
              <div className="mt-0.5">
                {getEventIcon(event, isLatestStart)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${
                  event.type === 'complete' ? 'text-green-400' : 'text-nexprime-cyan'
                }`}>
                  {stageNames[event.stage]} {event.type === 'start' ? '시작' : '완료'}
                </p>
                <p className="text-white/30 text-xs">
                  {getRelativeTime(event.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
