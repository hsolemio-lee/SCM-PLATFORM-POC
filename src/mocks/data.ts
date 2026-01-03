import { SolverOutputs } from '../types';

export const mockSolverOutputs: SolverOutputs = {
  dp: {
    forecasts: [
      { month: 'Jan', product: 'SKU-001', forecast: 1200, actual: 1150, confidence: 0.92 },
      { month: 'Feb', product: 'SKU-001', forecast: 1350, actual: 1380, confidence: 0.89 },
      { month: 'Mar', product: 'SKU-001', forecast: 1500, actual: 1420, confidence: 0.91 },
      { month: 'Apr', product: 'SKU-001', forecast: 1400, actual: 1450, confidence: 0.88 },
      { month: 'May', product: 'SKU-001', forecast: 1600, actual: 1580, confidence: 0.93 },
      { month: 'Jun', product: 'SKU-001', forecast: 1750, actual: 1700, confidence: 0.90 },
      { month: 'Jul', product: 'SKU-001', forecast: 1800, actual: 1850, confidence: 0.87 },
      { month: 'Aug', product: 'SKU-001', forecast: 1650, actual: 1620, confidence: 0.91 },
      { month: 'Sep', product: 'SKU-001', forecast: 1550, actual: 1500, confidence: 0.89 },
      { month: 'Oct', product: 'SKU-001', forecast: 1700, actual: 1680, confidence: 0.92 },
      { month: 'Nov', product: 'SKU-001', forecast: 1900, actual: 1950, confidence: 0.88 },
      { month: 'Dec', product: 'SKU-001', forecast: 2100, actual: 2050, confidence: 0.90 },
    ],
    kpis: { accuracy: 94.2, coverage: 100, mape: 5.8 },
  },
  mp: {
    plans: [
      { plant: 'Plant A', supply: 5000, demand: 4800, gap: 200, utilization: 0.96 },
      { plant: 'Plant B', supply: 3500, demand: 3800, gap: -300, utilization: 1.08 },
      { plant: 'Plant C', supply: 4200, demand: 4000, gap: 200, utilization: 0.95 },
      { plant: 'Plant D', supply: 2800, demand: 2600, gap: 200, utilization: 0.93 },
    ],
    kpis: { serviceLevel: 98.1, inventoryTurns: 12.4, fillRate: 97.5 },
  },
  fp: {
    schedule: [
      { id: '1', line: 'Line 1', product: 'SKU-001', start: '06:00', end: '10:30', quantity: 500, color: '#00FFFF' },
      { id: '2', line: 'Line 1', product: 'SKU-002', start: '11:00', end: '14:00', quantity: 300, color: '#0088AA' },
      { id: '3', line: 'Line 1', product: 'SKU-003', start: '14:30', end: '18:00', quantity: 400, color: '#1e3a5f' },
      { id: '4', line: 'Line 2', product: 'SKU-002', start: '06:00', end: '09:30', quantity: 350, color: '#0088AA' },
      { id: '5', line: 'Line 2', product: 'SKU-001', start: '10:00', end: '15:00', quantity: 600, color: '#00FFFF' },
      { id: '6', line: 'Line 2', product: 'SKU-004', start: '15:30', end: '18:00', quantity: 250, color: '#4FFFFF' },
      { id: '7', line: 'Line 3', product: 'SKU-003', start: '06:00', end: '12:00', quantity: 700, color: '#1e3a5f' },
      { id: '8', line: 'Line 3', product: 'SKU-001', start: '12:30', end: '18:00', quantity: 650, color: '#00FFFF' },
    ],
    kpis: { oee: 87.3, setupTime: 45, throughput: 2400 },
  },
  tp: {
    routes: [
      {
        vehicle: 'V01',
        stops: ['Warehouse', 'Customer A', 'Customer B', 'Customer C'],
        distance: 124,
        load: 0.85,
        coordinates: [
          { lat: 37.5665, lng: 126.9780 },
          { lat: 37.5100, lng: 127.0300 },
          { lat: 37.4800, lng: 127.0500 },
          { lat: 37.4500, lng: 127.1000 },
        ],
      },
      {
        vehicle: 'V02',
        stops: ['Warehouse', 'Customer D', 'Customer E'],
        distance: 98,
        load: 0.72,
        coordinates: [
          { lat: 37.5665, lng: 126.9780 },
          { lat: 37.5900, lng: 126.9200 },
          { lat: 37.6200, lng: 126.8800 },
        ],
      },
      {
        vehicle: 'V03',
        stops: ['Warehouse', 'Customer F', 'Customer G', 'Customer H', 'Customer I'],
        distance: 156,
        load: 0.91,
        coordinates: [
          { lat: 37.5665, lng: 126.9780 },
          { lat: 37.5400, lng: 126.9500 },
          { lat: 37.5200, lng: 126.9000 },
          { lat: 37.4900, lng: 126.8500 },
          { lat: 37.4600, lng: 126.8200 },
        ],
      },
    ],
    kpis: { totalDistance: 450, vehicleUtilization: 89, onTimeDelivery: 96.2 },
  },
};

export const stageLabels: Record<string, string> = {
  dp: 'Demand Planning',
  mp: 'Master Planning',
  fp: 'Factory Planning',
  tp: 'Transport Planning',
};

export const stageOrder: ('dp' | 'mp' | 'fp' | 'tp')[] = ['dp', 'mp', 'fp', 'tp'];
