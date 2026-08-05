'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'underline' | 'pills' | 'vertical';
  className?: string;
}

const variants = {
  underline: {
    list: 'flex border-b border-neutral-200 gap-0',
    trigger: (active: boolean) =>
      `flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
        active ? 'border-gold-500 text-gold-600 bg-gold-50/50' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
      }`,
  },
  pills: {
    list: 'flex flex-wrap gap-2',
    trigger: (active: boolean) =>
      `px-5 py-2.5 text-sm font-medium rounded-md transition-colors ${
        active ? 'bg-gold-500 text-white shadow-warm-sm' : 'bg-white text-neutral-600 border border-neutral-200 hover:border-gold-400 hover:text-gold-600'
      }`,
  },
  vertical: {
    list: 'flex flex-col gap-1',
    trigger: (active: boolean) =>
      `w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
        active ? 'bg-gold-50 text-gold-600' : 'text-neutral-600 hover:bg-neutral-50'
      }`,
  },
};

export default function Tabs({ tabs, defaultTab, variant = 'underline', className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const style = variants[variant];

  return (
    <div className={className}>
      <div role="tablist" className={style.list}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={style.trigger(activeTab === tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tabs.map(tab => (
          <div key={tab.id} role="tabpanel" hidden={activeTab !== tab.id}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
