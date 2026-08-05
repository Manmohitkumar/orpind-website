'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export default function Accordion({ items, allowMultiple = false, defaultOpen = [], className = '' }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    setOpenIds(prev =>
      allowMultiple
        ? prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        : prev.includes(id) ? [] : [id]
    );
  };

  return (
    <div className={`divide-y divide-beige-200 ${className}`}>
      {items.map(item => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between py-5 text-left"
            >
              <span className="heading-4 text-green-800">{item.title}</span>
              <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
              <div className="text-body">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
