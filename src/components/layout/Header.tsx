import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useSCM } from '../../context/SCMContext';
import { stageOrder, stageLabels } from '../../mocks/data';
import { SolverStage } from '../../types';
import SyncBadge from '../common/SyncBadge';

export default function Header() {
  const { solverStatus, solverOutputs, needsSync, lastCompletedStage } = useSCM();
  const location = useLocation();

  const getBadgeCount = (stage: SolverStage): number => {
    switch (stage) {
      case 'dp':
        return solverOutputs.dp.forecasts.length;
      case 'mp':
        return solverOutputs.mp.plans.length;
      case 'fp':
        return solverOutputs.fp.schedule.length;
      case 'tp':
        return solverOutputs.tp.routes.length;
      default:
        return 0;
    }
  };

  const getNodeClasses = (stage: SolverStage): string => {
    const status = solverStatus[stage];
    const isActive = location.pathname === `/${stage}`;

    const base = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 cursor-pointer';

    if (status === 'running') {
      return `${base} bg-nexprime-cyan text-nexprime-darker animate-pulse`;
    }
    if (status === 'complete') {
      return `${base} bg-nexprime-cyan text-nexprime-darker`;
    }
    if (isActive) {
      return `${base} border-2 border-nexprime-cyan text-nexprime-cyan`;
    }
    return `${base} border-2 border-nexprime-cyan/30 text-nexprime-cyan/50`;
  };

  return (
    <header className="bg-nexprime-dark border-b border-nexprime-blue/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Dashboard Link */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className={`
              p-2 rounded-lg transition-colors
              ${location.pathname === '/'
                ? 'bg-nexprime-cyan/20 text-nexprime-cyan'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }
            `}>
              <Home size={20} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-nexprime-cyan font-bold text-xl tracking-wider group-hover:text-nexprime-cyan/80 transition-colors">
                NEXPRIME
              </span>
              <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                SCM
              </span>
            </div>
          </NavLink>

          {/* Pipeline Navigation */}
          <nav className="flex items-center gap-2">
            {stageOrder.map((stage, index) => (
              <div key={stage} className="flex items-center">
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
                  <span className="text-xs text-white/40">
                    {stageLabels[stage].split(' ')[0]}
                  </span>
                  {solverStatus[stage] === 'complete' && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-nexprime-cyan font-mono"
                    >
                      [{getBadgeCount(stage)}]
                    </motion.span>
                  )}
                </NavLink>

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
              </div>
            ))}
          </nav>

          {/* Reset Button */}
          <button
            onClick={() => window.location.reload()}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </header>
  );
}
