import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { SolverStage, SolverStatus, LogEntry, SolverOutputs } from '../types';
import { mockSolverOutputs, stageOrder } from '../mocks/data';
import { defaultSolvers } from '../mocks/solvers';
import { solverLogMessages } from '../mocks/logs';

interface SCMContextType {
  solverStatus: Record<SolverStage, SolverStatus>;
  solverOutputs: SolverOutputs;
  logs: Record<SolverStage, LogEntry[]>;
  runSolver: (stage: SolverStage) => void;
  canRunSolver: (stage: SolverStage) => boolean;
  resetDemo: () => void;
  expandedLog: SolverStage | null;
  setExpandedLog: (stage: SolverStage | null) => void;
  selectedSolver: Record<SolverStage, string>;
  setSelectedSolver: (stage: SolverStage, solverId: string) => void;
  runAllSolvers: () => void;
  isRunningAll: boolean;
}

const SCMContext = createContext<SCMContextType | null>(null);

export function useSCM() {
  const context = useContext(SCMContext);
  if (!context) {
    throw new Error('useSCM must be used within SCMProvider');
  }
  return context;
}

interface SCMProviderProps {
  children: ReactNode;
}

export function SCMProvider({ children }: SCMProviderProps) {
  const [solverStatus, setSolverStatus] = useState<Record<SolverStage, SolverStatus>>({
    dp: 'complete',
    mp: 'complete',
    fp: 'complete',
    tp: 'complete',
  });

  const [solverOutputs] = useState<SolverOutputs>(mockSolverOutputs);

  const [logs, setLogs] = useState<Record<SolverStage, LogEntry[]>>({
    dp: [],
    mp: [],
    fp: [],
    tp: [],
  });

  const [expandedLog, setExpandedLog] = useState<SolverStage | null>(null);

  const [selectedSolver, setSelectedSolverState] = useState<Record<SolverStage, string>>(defaultSolvers);

  const [isRunningAll, setIsRunningAll] = useState(false);

  const setSelectedSolver = useCallback((stage: SolverStage, solverId: string) => {
    setSelectedSolverState(prev => ({ ...prev, [stage]: solverId }));
  }, []);

  const runningRef = useRef<Record<SolverStage, boolean>>({
    dp: false,
    mp: false,
    fp: false,
    tp: false,
  });

  const canRunSolver = useCallback((stage: SolverStage): boolean => {
    const stageIndex = stageOrder.indexOf(stage);
    if (stageIndex === 0) return true;
    const previousStage = stageOrder[stageIndex - 1];
    return solverStatus[previousStage] === 'complete';
  }, [solverStatus]);

  const runSolver = useCallback((stage: SolverStage) => {
    if (!canRunSolver(stage) || runningRef.current[stage]) return;

    runningRef.current[stage] = true;

    // Clear previous logs and set running
    setLogs(prev => ({ ...prev, [stage]: [] }));
    setSolverStatus(prev => ({ ...prev, [stage]: 'running' }));
    setExpandedLog(stage);

    const messages = solverLogMessages[stage][selectedSolver[stage]] || [];
    let index = 0;

    const streamLog = () => {
      if (index >= messages.length) {
        setSolverStatus(prev => ({ ...prev, [stage]: 'complete' }));
        runningRef.current[stage] = false;
        return;
      }

      const message = messages[index];
      const level = message.includes('[WARN]') ? 'WARN' : message.includes('[ERROR]') ? 'ERROR' : 'INFO';
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];

      const entry: LogEntry = {
        id: `${stage}-${index}-${Date.now()}`,
        timestamp,
        level,
        message: message.replace(/\[(INFO|WARN|ERROR)\]\s*/, ''),
      };

      setLogs(prev => ({
        ...prev,
        [stage]: [...prev[stage], entry],
      }));

      index++;
      const delay = 200 + Math.random() * 600; // 200-800ms
      setTimeout(streamLog, delay);
    };

    streamLog();
  }, [canRunSolver, selectedSolver]);

  const resetDemo = useCallback(() => {
    Object.keys(runningRef.current).forEach(key => {
      runningRef.current[key as SolverStage] = false;
    });
    setSolverStatus({
      dp: 'complete',
      mp: 'complete',
      fp: 'complete',
      tp: 'complete',
    });
    setLogs({ dp: [], mp: [], fp: [], tp: [] });
    setExpandedLog(null);
  }, []);

  const runAllSolvers = useCallback(() => {
    if (isRunningAll) return;

    setIsRunningAll(true);

    const stages: SolverStage[] = ['dp', 'mp', 'fp', 'tp'];
    let currentIndex = 0;

    const runNextStage = () => {
      if (currentIndex >= stages.length) {
        setIsRunningAll(false);
        return;
      }

      const stage = stages[currentIndex];

      // Set up completion listener
      const checkCompletion = setInterval(() => {
        if (!runningRef.current[stage]) {
          clearInterval(checkCompletion);
          currentIndex++;
          setTimeout(runNextStage, 500); // Small delay before next
        }
      }, 100);

      runSolver(stage);
    };

    runNextStage();
  }, [isRunningAll, runSolver]);

  return (
    <SCMContext.Provider
      value={{
        solverStatus,
        solverOutputs,
        logs,
        runSolver,
        canRunSolver,
        resetDemo,
        expandedLog,
        setExpandedLog,
        selectedSolver,
        setSelectedSolver,
        runAllSolvers,
        isRunningAll,
      }}
    >
      {children}
    </SCMContext.Provider>
  );
}
