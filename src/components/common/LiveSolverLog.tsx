import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { LogEntry, SolverStage, SolverStatus } from '../../types';

interface LiveSolverLogProps {
  stage: SolverStage;
  logs: LogEntry[];
  status: SolverStatus;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function LiveSolverLog({ stage, logs, status, isExpanded, onToggle }: LiveSolverLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: LogEntry['level']): string => {
    switch (level) {
      case 'INFO':
        return 'text-nexprime-cyan';
      case 'WARN':
        return 'text-amber-400';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-nexprime-darker hover:bg-nexprime-dark/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-nexprime-cyan" />
          <span className="text-white/80 font-medium">Live Solver Log</span>
          {status === 'running' && (
            <span className="flex items-center gap-1 text-xs text-nexprime-cyan">
              <span className="w-2 h-2 bg-nexprime-cyan rounded-full animate-pulse" />
              Running
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-white/40" />
        ) : (
          <ChevronUp className="w-5 h-5 text-white/40" />
        )}
      </button>

      {/* Log Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              ref={scrollRef}
              className="bg-black/80 p-4 font-mono text-sm max-h-64 overflow-y-auto"
            >
              {logs.length === 0 ? (
                <div className="text-white/30 text-center py-8">
                  Click "Run {stage.toUpperCase()}" to start solver...
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex gap-2"
                    >
                      <span className="text-white/30 shrink-0">{entry.timestamp}</span>
                      <span className={`shrink-0 ${getLevelColor(entry.level)}`}>
                        [{entry.level}]
                      </span>
                      <span className="text-white/90">{entry.message}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Cursor blink when running */}
              {status === 'running' && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-white/30">{'>'}</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-4 bg-nexprime-cyan"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
