import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import { useSCM } from '../../context/SCMContext';
import { SolverStage } from '../../types';
import { stageLabels } from '../../mocks/data';

export default function FloatingRunButton() {
  const location = useLocation();
  const { solverStatus, runSolver, canRunSolver } = useSCM();

  const currentStage = location.pathname.slice(1) as SolverStage;
  const status = solverStatus[currentStage];
  const canRun = canRunSolver(currentStage);

  const handleClick = () => {
    if (status === 'running' || !canRun) return;
    runSolver(currentStage);
  };

  const getButtonContent = () => {
    if (status === 'running') {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Running...</span>
        </>
      );
    }
    return (
      <>
        <Play className="w-5 h-5" />
        <span>Run {currentStage.toUpperCase()}</span>
      </>
    );
  };

  const getTooltip = (): string | null => {
    if (!canRun) {
      const stageIndex = ['dp', 'mp', 'fp', 'tp'].indexOf(currentStage);
      if (stageIndex > 0) {
        const prevStage = ['dp', 'mp', 'fp', 'tp'][stageIndex - 1] as SolverStage;
        return `Complete ${stageLabels[prevStage]} first`;
      }
    }
    return null;
  };

  const tooltip = getTooltip();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-nexprime-dark border border-nexprime-blue/30 rounded text-sm text-white/70 whitespace-nowrap"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        disabled={status === 'running' || !canRun}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full font-medium
          transition-all duration-300 shadow-lg
          ${status === 'running'
            ? 'bg-nexprime-cyan/50 text-nexprime-darker cursor-wait'
            : canRun
              ? 'bg-gradient-to-r from-nexprime-cyan to-nexprime-cyan-dim text-nexprime-darker hover:shadow-nexprime-cyan/30 hover:shadow-xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }
        `}
        whileHover={canRun && status !== 'running' ? { scale: 1.05 } : {}}
        whileTap={canRun && status !== 'running' ? { scale: 0.95 } : {}}
        animate={status === 'idle' && canRun ? {
          boxShadow: ['0 0 0 0 rgba(0,255,255,0.4)', '0 0 0 10px rgba(0,255,255,0)', '0 0 0 0 rgba(0,255,255,0.4)']
        } : {}}
        transition={status === 'idle' && canRun ? {
          boxShadow: { repeat: Infinity, duration: 2 }
        } : {}}
      >
        {getButtonContent()}
      </motion.button>
    </div>
  );
}
