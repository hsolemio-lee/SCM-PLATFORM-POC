export type SolverStage = 'dp' | 'mp' | 'fp' | 'tp';
export type SolverStatus = 'idle' | 'running' | 'complete';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export interface DemandForecast {
  month: string;
  product: string;
  forecast: number;
  actual: number;
  confidence: number;
}

export interface MasterPlanItem {
  plant: string;
  supply: number;
  demand: number;
  gap: number;
  utilization: number;
}

export interface ProductionScheduleItem {
  id: string;
  line: string;
  product: string;
  start: string;
  end: string;
  quantity: number;
  color: string;
}

export interface TransportRoute {
  vehicle: string;
  stops: string[];
  distance: number;
  load: number;
  coordinates: { lat: number; lng: number }[];
}

export interface SolverKPIs {
  dp: { accuracy: number; coverage: number; mape: number };
  mp: { serviceLevel: number; inventoryTurns: number; fillRate: number };
  fp: { oee: number; setupTime: number; throughput: number };
  tp: { totalDistance: number; vehicleUtilization: number; onTimeDelivery: number };
}

export interface SolverOutputs {
  dp: { forecasts: DemandForecast[]; kpis: SolverKPIs['dp'] };
  mp: { plans: MasterPlanItem[]; kpis: SolverKPIs['mp'] };
  fp: { schedule: ProductionScheduleItem[]; kpis: SolverKPIs['fp'] };
  tp: { routes: TransportRoute[]; kpis: SolverKPIs['tp'] };
}

export interface SolverOption {
  id: string;
  name: string;
  description: string;
}

export interface StageTableData {
  input: Record<string, unknown>[];
  output: Record<string, unknown>[];
  inputColumns: { key: string; label: string }[];
  outputColumns: { key: string; label: string }[];
}

export interface ActivityEvent {
  id: string;
  stage: SolverStage;
  type: 'start' | 'complete';
  timestamp: Date;
}
