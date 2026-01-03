// src/components/common/DataTabs.tsx
interface DataTabsProps {
  activeTab: 'input' | 'output';
  onTabChange: (tab: 'input' | 'output') => void;
}

export default function DataTabs({ activeTab, onTabChange }: DataTabsProps) {
  return (
    <div className="flex gap-1 bg-nexprime-darker rounded-lg p-1">
      <button
        onClick={() => onTabChange('input')}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${activeTab === 'input'
            ? 'bg-nexprime-blue/30 text-nexprime-cyan'
            : 'text-white/60 hover:text-white hover:bg-nexprime-blue/10'
          }
        `}
      >
        Input
      </button>
      <button
        onClick={() => onTabChange('output')}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${activeTab === 'output'
            ? 'bg-nexprime-blue/30 text-nexprime-cyan'
            : 'text-white/60 hover:text-white hover:bg-nexprime-blue/10'
          }
        `}
      >
        Output
      </button>
    </div>
  );
}
