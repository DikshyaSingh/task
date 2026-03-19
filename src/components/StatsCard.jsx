import { MessageSquare, Users, Tag, Link } from 'lucide-react';

export const StatsCard = ({ icon: Icon, label, value, color, delay }) => (
  <div 
    className={`glass-card p-6 flex items-center gap-4 transition-all hover:scale-105 active:scale-95 cursor-default group duration-500 animate-in fade-in slide-in-from-top fill-mode-forwards`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`p-4 rounded-2xl ${color} flex items-center justify-center transition-transform group-hover:rotate-12`}>
      <Icon size={24} className="brightness-110" />
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-bold tracking-tight">{value}</span>
      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 opacity-80">{label}</span>
    </div>
  </div>
);

export const DashboardStats = ({ data }) => {
  const stats = [
    { 
      label: 'Total Messages', 
      value: data.length, 
      icon: MessageSquare, 
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
      delay: 0
    },
    { 
      label: 'Active Participants', 
      value: new Set(data.map(m => m.sender)).size, 
      icon: Users, 
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
      delay: 100
    },
    { 
      label: 'Categorized Tasks', 
      value: data.filter(m => m.category !== 'other').length, 
      icon: Tag, 
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
      delay: 200
    },
    { 
      label: 'Deliverables Found', 
      value: data.reduce((acc, m) => acc + m.links.length, 0), 
      icon: Link, 
      color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
      delay: 300
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
      {stats.map((stat, idx) => (
        <StatsCard key={idx} {...stat} />
      ))}
    </div>
  );
};
