import { useState } from 'react';
import { Layout, MessageSquareCode, Github, Sparkles } from 'lucide-react';
import { parseWhatsAppChat } from './lib/parser';
import { UploadZone } from './components/UploadZone';
import { ChatTable } from './components/ChatTable';
import { DashboardStats } from './components/StatsCard';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleUpload = (content) => {
    const parsedData = parseWhatsAppChat(content);
    setMessages(parsedData);
    setIsLoaded(true);
  };

  const clearData = () => {
    setMessages([]);
    setIsLoaded(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-500 overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-500">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 group">
          <div className="p-2.5 bg-blue-600 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-blue-500/30">
            <MessageSquareCode className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400">
              WhatsApp Chat to Work Log
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold opacity-70">Client-Side Only • Privacy First</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a 
            href="#" 
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <Github size={18} />
            Star on GitHub
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full" />

        <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold mb-6 ring-1 ring-blue-600/20">
              <Sparkles size={14} /> NEW: AUTOMATIC WORK LOG GENERATOR
           </div>
           <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Convert Chats to <span className="text-blue-600">Actionable Data</span></h2>
           <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
             A secure, local, and fully offline tool to transform exported WhatsApp chats into structured work logs with categorized tasks and extracted links.
           </p>
        </div>

        <UploadZone onUpload={handleUpload} onClear={clearData} />

        {isLoaded && (
          <div className="space-y-4">
            <DashboardStats data={messages} />
            <ChatTable data={messages} />
          </div>
        )}

        {!isLoaded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 opacity-50">
             {[
               { title: 'Privacy First', text: 'No files are uploaded to any server. Everything happens in your browser.' },
               { title: 'Smart Detection', text: 'Automatically categorizes messages based on design, content, and revisions keywords.' },
               { title: 'Clean Export', text: 'Download your processed work log as a CSV for easy sharing and tracking.' },
             ].map((feature, i) => (
               <div key={i} className="glass-card p-6 border dark:border-neutral-800 text-center space-y-3">
                 <h4 className="font-bold text-lg">{feature.title}</h4>
                 <p className="text-sm text-neutral-500">{feature.text}</p>
               </div>
             ))}
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 border-t dark:border-neutral-800 text-center opacity-70">
        <p className="text-sm text-neutral-400">
          Build with React, Tailwind CSS, and Browser FileReader API. 
        </p>
        <p className="text-xs mt-2 text-neutral-500">© 2026 WhatsApp Work Log Converter • Fully Offline Application</p>
      </footer>
    </div>
  );
}

export default App;
