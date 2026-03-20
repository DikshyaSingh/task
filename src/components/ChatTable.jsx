import { Search, Download, Filter, MessageSquare, User, Tag, ExternalLink } from 'lucide-react';
import { useState, useMemo } from 'react';
import { CATEGORY_MESSAGES } from '../lib/constants';
import { exportToCSV } from '../lib/export';

const CategoryBadge = ({ category }) => {
  const settings = CATEGORY_MESSAGES[category] || CATEGORY_MESSAGES.other;
  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border ${settings.textColor} ${settings.bgColor} ${settings.borderColor}`}>
      {settings.label}
    </span>
  );
};

export const ChatTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [personFilter, setPersonFilter] = useState('all');

  const uniquePeople = useMemo(() => {
    return Array.from(new Set(data.map(m => m.sender))).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sender.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchPerson = personFilter === 'all' || item.sender === personFilter;
      return matchSearch && matchCategory && matchPerson;
    });
  }, [data, searchTerm, categoryFilter, personFilter]);

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
      {/* Search and Filters */}
      <div className="glass-card p-6 flex flex-wrap gap-4 items-end mb-8 shadow-2xl relative z-10 border-t-4 border-blue-600">
        <div className="flex-1 min-w-[280px]">
          <label className="block text-sm font-semibold mb-1.5 uppercase opacity-60 flex items-center gap-2">
            <Search size={14} className="text-blue-500" /> Search Logs
          </label>
          <input 
            type="text" 
            placeholder="Search tasks, senders, keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl outline-none text-sm"
          />
        </div>

        <div className="w-full md:w-56">
          <label className="block text-sm font-semibold mb-1.5 uppercase opacity-60 flex items-center gap-2">
            <Tag size={14} className="text-purple-500" /> Filter Category
          </label>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl outline-none text-sm appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_MESSAGES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-56">
          <label className="block text-sm font-semibold mb-1.5 uppercase opacity-60 flex items-center gap-2">
            <User size={14} className="text-green-500" /> Filter Person
          </label>
          <select 
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl outline-none text-sm appearance-none cursor-pointer"
          >
            <option value="all">All Participants</option>
            {uniquePeople.map(person => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => exportToCSV(filteredData)}
          className="bg-neutral-900 dark:bg-blue-600 hover:bg-neutral-800 dark:hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl active:scale-95 transition-all text-sm mb-[2px]"
        >
          <Download size={18} /> EXPORT CSV
        </button>
      </div>

      {/* Table - Optimized for spreadsheet look */}
      <div className="glass-card shadow-2xl border-none overflow-hidden rounded-2xl">
        <div className="max-h-[700px] overflow-auto custom-scrollbar bg-white dark:bg-neutral-950">
          <table className="w-full border-collapse min-w-[1000px] text-sm">
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#1e3a5f] text-white">
                <th className="px-6 py-5 text-left font-bold uppercase tracking-wider border-r border-[#2c4e7a] w-32 shrink-0">Date</th>
                <th className="px-6 py-5 text-left font-bold uppercase tracking-wider border-r border-[#2c4e7a]">Task Description</th>
                <th className="px-6 py-5 text-center font-bold uppercase tracking-wider border-r border-[#2c4e7a] w-56">Category</th>
                <th className="px-6 py-5 text-left font-bold uppercase tracking-wider border-r border-[#2c4e7a] w-48">Person Involved</th>
                <th className="px-6 py-5 text-left font-bold uppercase tracking-wider w-64">Deliverable / Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredData.map((item, idx) => {
                const categoryStyle = CATEGORY_MESSAGES[item.category] || CATEGORY_MESSAGES.other;
                return (
                  <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors group">
                    <td className="px-6 py-5 text-neutral-600 dark:text-neutral-400 font-mono whitespace-nowrap border-r dark:border-neutral-800">
                      {item.date}
                    </td>
                    <td className="px-6 py-5 border-r dark:border-neutral-800 font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-900 dark:text-white leading-relaxed">
                          {item.message}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-5 border-r dark:border-neutral-800 text-center ${categoryStyle.bgColor}`}>
                       <CategoryBadge category={item.category} />
                    </td>
                    <td className="px-6 py-5 border-r dark:border-neutral-800 whitespace-nowrap">
                      <span className="font-semibold">{item.sender}</span>
                    </td>
                    <td className="px-6 py-5">
                      {item.links.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {item.links.map((link, lIdx) => (
                            <a 
                              key={lIdx} 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1.5 transition-colors group/link overflow-hidden"
                            >
                              <ExternalLink size={14} className="shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                              <span className="truncate border-b border-transparent group-hover/link:border-blue-400">{link}</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-300 dark:text-neutral-700 italic">No Links Found</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center text-neutral-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                        <MessageSquare size={32} className="opacity-20" />
                      </div>
                      <p className="text-lg font-medium italic">The logs are quiet... try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
