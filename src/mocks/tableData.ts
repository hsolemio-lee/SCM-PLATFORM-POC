import { StageTableData, SolverStage } from '../types';

// Helper constants
const PRODUCTS = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005'];
const PLANTS = ['Plant A', 'Plant B', 'Plant C', 'Plant D'];
const LINES = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
const VEHICLES = ['V01', 'V02', 'V03', 'V04', 'V05'];
const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
const CHANNELS = ['Online', 'Retail', 'Wholesale', 'Direct'];
const CUSTOMERS = Array.from({ length: 30 }, (_, i) => `Customer ${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ''}`);

// Helper functions
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number, decimals: number = 2): number =>
  Number((Math.random() * (max - min) + min).toFixed(decimals));

const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const formatTime = (hours: number, minutes: number): string =>
  `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

const generateId = (prefix: string, index: number): string =>
  `${prefix}-${String(index).padStart(4, '0')}`;

// DP (Demand Planning) Data Generators
const generateDPInput = (count: number): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];
  const baseDate = new Date('2024-01-01');

  for (let i = 0; i < count; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + Math.floor(i / 5));

    data.push({
      id: generateId('HS', i + 1),
      date: formatDate(date),
      product: PRODUCTS[i % PRODUCTS.length],
      sales: randomInt(50, 500),
      region: randomChoice(REGIONS),
      channel: randomChoice(CHANNELS),
      unitPrice: randomFloat(10, 100),
      quantity: randomInt(10, 200),
    });
  }
  return data;
};

const generateDPOutput = (count: number): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = ['2024', '2025'];

  let index = 0;
  for (const year of years) {
    for (const month of months) {
      for (const product of PRODUCTS) {
        if (index >= count) break;
        const forecast = randomInt(800, 2500);
        const variance = randomFloat(0.05, 0.15);
        const lowerBound = Math.round(forecast * (1 - variance));
        const upperBound = Math.round(forecast * (1 + variance));

        data.push({
          id: generateId('FC', index + 1),
          month: `${month} ${year}`,
          product,
          forecast,
          lowerBound,
          upperBound,
          confidence: randomFloat(0.82, 0.98),
          trend: randomChoice(['Up', 'Down', 'Stable']),
          seasonality: randomFloat(-0.2, 0.3),
        });
        index++;
      }
      if (index >= count) break;
    }
    if (index >= count) break;
  }
  return data;
};

// MP (Master Planning) Data Generators
const generateMPInput = (count: number): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];
  const weeks = Array.from({ length: 52 }, (_, i) => `W${String(i + 1).padStart(2, '0')}`);

  let index = 0;
  for (const week of weeks) {
    for (const plant of PLANTS) {
      for (const product of PRODUCTS) {
        if (index >= count) break;
        const capacity = randomInt(800, 1500);
        const demand = randomInt(500, 1400);

        data.push({
          id: generateId('MP', index + 1),
          plant,
          product,
          week,
          demand,
          capacity,
          inventory: randomInt(100, 500),
          safetyStock: randomInt(50, 150),
          leadTime: randomInt(1, 7),
          unitCost: randomFloat(15, 80),
        });
        index++;
      }
      if (index >= count) break;
    }
    if (index >= count) break;
  }
  return data;
};

const generateMPOutput = (count: number): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];
  const weeks = Array.from({ length: 52 }, (_, i) => `W${String(i + 1).padStart(2, '0')}`);

  let index = 0;
  for (const week of weeks) {
    for (const plant of PLANTS) {
      for (const product of PRODUCTS) {
        if (index >= count) break;
        const supply = randomInt(600, 1400);
        const demand = randomInt(500, 1300);
        const gap = supply - demand;
        const utilization = randomFloat(0.7, 1.05);

        data.push({
          id: generateId('PL', index + 1),
          plant,
          product,
          week,
          supply,
          demand,
          gap,
          utilization,
          status: gap >= 0 ? 'Balanced' : 'Shortage',
          priority: randomChoice(['High', 'Medium', 'Low']),
          adjustedQty: gap < 0 ? randomInt(50, Math.abs(gap)) : 0,
        });
        index++;
      }
      if (index >= count) break;
    }
    if (index >= count) break;
  }
  return data;
};

// FP (Factory Planning) Data Generators
const generateFPInput = (count: number): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];
  const baseDate = new Date('2024-06-01');

  for (let i = 0; i < count; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + randomInt(1, 30));

    data.push({
      orderId: generateId('ORD', i + 1),
      line: randomChoice(LINES),
      product: randomChoice(PRODUCTS),
      quantity: randomInt(100, 800),
      dueDate: formatDate(dueDate),
      priority: randomChoice(['Critical', 'High', 'Medium', 'Low']),
      setupTime: randomInt(15, 90),
      processingTime: randomInt(60, 480),
      customer: randomChoice(CUSTOMERS),
      batchSize: randomInt(50, 200),
    });
  }
  return data;
};

const generateFPOutput = (count: number): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];
  const baseDate = new Date('2024-06-01');

  for (let i = 0; i < count; i++) {
    const scheduleDate = new Date(baseDate);
    scheduleDate.setDate(scheduleDate.getDate() + Math.floor(i / 8));

    const startHour = 6 + (i % 4) * 3;
    const duration = randomInt(2, 5);
    const endHour = startHour + duration;
    const startMinutes = randomChoice([0, 15, 30, 45]);
    const endMinutes = randomChoice([0, 15, 30, 45]);

    data.push({
      scheduleId: generateId('SCH', i + 1),
      orderId: generateId('ORD', randomInt(1, 150)),
      line: LINES[Math.floor(i / 30) % LINES.length],
      product: PRODUCTS[i % PRODUCTS.length],
      startTime: `${formatDate(scheduleDate)} ${formatTime(startHour, startMinutes)}`,
      endTime: `${formatDate(scheduleDate)} ${formatTime(Math.min(endHour, 22), endMinutes)}`,
      quantity: randomInt(100, 600),
      status: randomChoice(['Scheduled', 'In Progress', 'Completed', 'Pending']),
      efficiency: randomFloat(0.75, 0.98),
      setupComplete: randomChoice([true, false]),
      operator: `OP-${randomInt(1, 20).toString().padStart(2, '0')}`,
    });
  }
  return data;
};

// TP (Transport Planning) Data Generators
const generateTPInput = (count: number): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];
  const addresses = [
    'Seoul, Gangnam District',
    'Seoul, Mapo District',
    'Incheon, Namdong District',
    'Busan, Haeundae District',
    'Daegu, Suseong District',
    'Gwangju, Seo District',
    'Daejeon, Yuseong District',
    'Suwon, Yeongtong District',
    'Seongnam, Bundang District',
    'Goyang, Ilsan District',
  ];

  for (let i = 0; i < count; i++) {
    const startHour = randomInt(8, 18);
    const endHour = startHour + randomInt(2, 6);

    data.push({
      orderId: generateId('SHP', i + 1),
      customer: CUSTOMERS[i % CUSTOMERS.length],
      address: randomChoice(addresses),
      weight: randomFloat(10, 500, 1),
      volume: randomFloat(0.1, 5.0, 2),
      timeWindowStart: formatTime(startHour, 0),
      timeWindowEnd: formatTime(Math.min(endHour, 23), 0),
      priority: randomChoice(['Express', 'Standard', 'Economy']),
      fragile: randomChoice([true, false]),
      temperatureControlled: randomChoice([true, false]),
      value: randomFloat(100, 5000),
    });
  }
  return data;
};

const generateTPOutput = (count: number): Record<string, unknown>[] => {
  const data: Record<string, unknown>[] = [];
  const baseDate = new Date('2024-06-01');

  for (let i = 0; i < count; i++) {
    const routeDate = new Date(baseDate);
    routeDate.setDate(routeDate.getDate() + Math.floor(i / 25));
    const vehicleIndex = Math.floor(i / 25) % VEHICLES.length;
    const stopNumber = (i % 25) + 1;
    const arrivalHour = 8 + Math.floor(stopNumber * 0.4);
    const arrivalMinutes = randomChoice([0, 15, 30, 45]);

    data.push({
      routeId: generateId('RT', Math.floor(i / 25) + 1),
      vehicle: VEHICLES[vehicleIndex],
      stopNumber,
      customer: CUSTOMERS[i % CUSTOMERS.length],
      orderId: generateId('SHP', randomInt(1, 150)),
      arrivalTime: `${formatDate(routeDate)} ${formatTime(arrivalHour, arrivalMinutes)}`,
      departureTime: `${formatDate(routeDate)} ${formatTime(arrivalHour, arrivalMinutes + 15)}`,
      distance: randomFloat(5, 50, 1),
      cumulativeDistance: randomFloat(stopNumber * 10, stopNumber * 30, 1),
      load: randomFloat(0.3, 0.95),
      status: randomChoice(['Pending', 'In Transit', 'Delivered', 'Delayed']),
      eta: randomChoice(['On Time', 'Early', 'Late']),
    });
  }
  return data;
};

// Column Definitions
const dpInputColumns = [
  { key: 'id', label: 'ID' },
  { key: 'date', label: 'Date' },
  { key: 'product', label: 'Product' },
  { key: 'sales', label: 'Sales ($)' },
  { key: 'region', label: 'Region' },
  { key: 'channel', label: 'Channel' },
  { key: 'unitPrice', label: 'Unit Price ($)' },
  { key: 'quantity', label: 'Quantity' },
];

const dpOutputColumns = [
  { key: 'id', label: 'ID' },
  { key: 'month', label: 'Month' },
  { key: 'product', label: 'Product' },
  { key: 'forecast', label: 'Forecast' },
  { key: 'lowerBound', label: 'Lower Bound' },
  { key: 'upperBound', label: 'Upper Bound' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'trend', label: 'Trend' },
  { key: 'seasonality', label: 'Seasonality' },
];

const mpInputColumns = [
  { key: 'id', label: 'ID' },
  { key: 'plant', label: 'Plant' },
  { key: 'product', label: 'Product' },
  { key: 'week', label: 'Week' },
  { key: 'demand', label: 'Demand' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'safetyStock', label: 'Safety Stock' },
  { key: 'leadTime', label: 'Lead Time (days)' },
  { key: 'unitCost', label: 'Unit Cost ($)' },
];

const mpOutputColumns = [
  { key: 'id', label: 'ID' },
  { key: 'plant', label: 'Plant' },
  { key: 'product', label: 'Product' },
  { key: 'week', label: 'Week' },
  { key: 'supply', label: 'Supply' },
  { key: 'demand', label: 'Demand' },
  { key: 'gap', label: 'Gap' },
  { key: 'utilization', label: 'Utilization' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'adjustedQty', label: 'Adjusted Qty' },
];

const fpInputColumns = [
  { key: 'orderId', label: 'Order ID' },
  { key: 'line', label: 'Line' },
  { key: 'product', label: 'Product' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'priority', label: 'Priority' },
  { key: 'setupTime', label: 'Setup Time (min)' },
  { key: 'processingTime', label: 'Processing Time (min)' },
  { key: 'customer', label: 'Customer' },
  { key: 'batchSize', label: 'Batch Size' },
];

const fpOutputColumns = [
  { key: 'scheduleId', label: 'Schedule ID' },
  { key: 'orderId', label: 'Order ID' },
  { key: 'line', label: 'Line' },
  { key: 'product', label: 'Product' },
  { key: 'startTime', label: 'Start Time' },
  { key: 'endTime', label: 'End Time' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'status', label: 'Status' },
  { key: 'efficiency', label: 'Efficiency' },
  { key: 'setupComplete', label: 'Setup Complete' },
  { key: 'operator', label: 'Operator' },
];

const tpInputColumns = [
  { key: 'orderId', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'address', label: 'Address' },
  { key: 'weight', label: 'Weight (kg)' },
  { key: 'volume', label: 'Volume (m3)' },
  { key: 'timeWindowStart', label: 'Time Window Start' },
  { key: 'timeWindowEnd', label: 'Time Window End' },
  { key: 'priority', label: 'Priority' },
  { key: 'fragile', label: 'Fragile' },
  { key: 'temperatureControlled', label: 'Temp. Controlled' },
  { key: 'value', label: 'Value ($)' },
];

const tpOutputColumns = [
  { key: 'routeId', label: 'Route ID' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'stopNumber', label: 'Stop #' },
  { key: 'customer', label: 'Customer' },
  { key: 'orderId', label: 'Order ID' },
  { key: 'arrivalTime', label: 'Arrival Time' },
  { key: 'departureTime', label: 'Departure Time' },
  { key: 'distance', label: 'Distance (km)' },
  { key: 'cumulativeDistance', label: 'Total Distance (km)' },
  { key: 'load', label: 'Load %' },
  { key: 'status', label: 'Status' },
  { key: 'eta', label: 'ETA Status' },
];

// Generate 120 rows for each table
const ROW_COUNT = 120;

export const stageTableData: Record<SolverStage, StageTableData> = {
  dp: {
    input: generateDPInput(ROW_COUNT),
    output: generateDPOutput(ROW_COUNT),
    inputColumns: dpInputColumns,
    outputColumns: dpOutputColumns,
  },
  mp: {
    input: generateMPInput(ROW_COUNT),
    output: generateMPOutput(ROW_COUNT),
    inputColumns: mpInputColumns,
    outputColumns: mpOutputColumns,
  },
  fp: {
    input: generateFPInput(ROW_COUNT),
    output: generateFPOutput(ROW_COUNT),
    inputColumns: fpInputColumns,
    outputColumns: fpOutputColumns,
  },
  tp: {
    input: generateTPInput(ROW_COUNT),
    output: generateTPOutput(ROW_COUNT),
    inputColumns: tpInputColumns,
    outputColumns: tpOutputColumns,
  },
};
