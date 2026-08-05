interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export default function Timeline({ events, className = '' }: TimelineProps) {
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {events.map((event, index) => (
        <div key={event.year} className="flex gap-8 mb-12 last:mb-0">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">{event.year.slice(2)}</span>
            </div>
            {index < events.length - 1 && <div className="w-0.5 flex-1 bg-neutral-200 mt-3" />}
          </div>
          <div className="pb-8">
            <p className="text-sm text-gold-600 font-semibold mb-1">{event.year}</p>
            <h3 className="text-lg font-display font-semibold text-neutral-800 mb-2">{event.title}</h3>
            <p className="text-sm text-neutral-500">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
