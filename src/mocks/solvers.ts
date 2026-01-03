// src/mocks/solvers.ts
import { SolverOption, SolverStage } from '../types';

export const solverOptions: Record<SolverStage, SolverOption[]> = {
  dp: [
    { id: 'prophet', name: 'Prophet', description: 'Facebook 시계열 예측' },
    { id: 'arima', name: 'ARIMA', description: '자기회귀 이동평균 모델' },
    { id: 'xgboost', name: 'XGBoost', description: '그래디언트 부스팅 회귀' },
    { id: 'lstm', name: 'LSTM', description: '장단기 메모리 신경망' },
    { id: 'holt-winters', name: 'Holt-Winters', description: '지수 평활법' },
  ],
  mp: [
    { id: 'nexprime-response', name: 'Nexprime SCM Response', description: 'Nexprime 수요 대응 최적화' },
    { id: 'nexprime-sequencer', name: 'Nexprime SCM Sequencer', description: 'Nexprime 순서 최적화' },
    { id: 'linear-programming', name: 'Linear Programming', description: '선형 계획법' },
    { id: 'genetic-algorithm', name: 'Genetic Algorithm', description: '유전 알고리즘' },
    { id: 'milp', name: 'MILP', description: '혼합정수 선형계획법' },
    { id: 'constraint-programming', name: 'Constraint Programming', description: '제약 프로그래밍' },
  ],
  fp: [
    { id: 'neh', name: 'NEH Heuristic', description: 'Nawaz-Enscore-Ham 휴리스틱' },
    { id: 'genetic-algorithm', name: 'Genetic Algorithm', description: '유전 알고리즘' },
    { id: 'tabu-search', name: 'Tabu Search', description: '타부 탐색' },
    { id: 'ant-colony', name: 'Ant Colony', description: '개미 군집 최적화' },
    { id: 'simulated-annealing', name: 'Simulated Annealing', description: '담금질 기법' },
  ],
  tp: [
    { id: 'clarke-wright', name: 'Clarke-Wright', description: '절약 알고리즘' },
    { id: 'nearest-neighbor', name: 'Nearest Neighbor', description: '최근접 이웃 알고리즘' },
    { id: '2-opt', name: '2-opt', description: '2-opt 개선 알고리즘' },
    { id: 'genetic-algorithm', name: 'Genetic Algorithm', description: '유전 알고리즘' },
    { id: 'simulated-annealing', name: 'Simulated Annealing', description: '담금질 기법' },
  ],
};

export const defaultSolvers: Record<SolverStage, string> = {
  dp: 'prophet',
  mp: 'nexprime-response',
  fp: 'genetic-algorithm',
  tp: 'clarke-wright',
};
