import { motion } from 'framer-motion';
import { ProductionScheduleItem } from '../../types';

interface GanttChartProps {
  data: ProductionScheduleItem[];
}

export default function GanttChart({ data }: GanttChartProps) {
  const lines = [...new Set(data.map(item => item.line))].sort();
  const timeSlots = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };

  const getPosition = (start: string, end: string) => {
    const startHour = parseTime(start);
    const endHour = parseTime(end);
    const dayStart = 6; // 06:00
    const dayEnd = 18; // 18:00
    const totalHours = dayEnd - dayStart;

    return {
      left: `${((startHour - dayStart) / totalHours) * 100}%`,
      width: `${((endHour - startHour) / totalHours) * 100}%`,
    };
  };

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4">
      <h3 className="text-white/80 font-medium mb-4">Production Schedule</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Time axis */}
          <div className="flex border-b border-nexprime-blue/30 pb-2 mb-4 pl-20">
            {timeSlots.map(time => (
              <div key={time} className="flex-1 text-xs text-white/40 text-center">
                {time}
              </div>
            ))}
          </div>

          {/* Gantt rows */}
          <div className="space-y-3">
            {lines.map(line => {
              const lineItems = data.filter(item => item.line === line);
              return (
                <div key={line} className="flex items-center">
                  <div className="w-20 text-sm text-white/60 shrink-0">{line}</div>
                  <div className="flex-1 relative h-8 bg-nexprime-darker rounded">
                    {lineItems.map((item, idx) => {
                      const pos = getPosition(item.start, item.end);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="absolute top-1 bottom-1 rounded cursor-pointer group"
                          style={{
                            left: pos.left,
                            width: pos.width,
                            backgroundColor: item.color,
                            transformOrigin: 'left',
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-nexprime-darker truncate px-1">
                            {item.product}
                          </div>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="bg-nexprime-darker border border-nexprime-blue/30 rounded px-2 py-1 text-xs whitespace-nowrap">
                              <div className="text-white">{item.product}</div>
                              <div className="text-white/60">{item.start} - {item.end}</div>
                              <div className="text-nexprime-cyan">Qty: {item.quantity}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
