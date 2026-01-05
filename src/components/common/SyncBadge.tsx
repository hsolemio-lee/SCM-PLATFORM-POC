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
