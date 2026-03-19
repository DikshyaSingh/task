import { Upload, FileText, X, ClipboardPaste, ArrowRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const UploadZone = ({ onUpload, onClear }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');

  const handleFile = useCallback((file) => {
    if (!file || !file.name.endsWith('.txt')) {
      alert('Please upload a .txt file.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpload(e.target.result);
    };
    reader.readAsText(file);
  }, [onUpload]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handlePasteProcess = () => {
    if (!pastedText.trim()) return;
    onUpload(pastedText);
    setFileName('Pasted Content');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-xl mb-4 w-fit mx-auto backdrop-blur-sm">
        <button 
          onClick={() => setActiveTab('upload')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === 'upload' ? "bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          <Upload size={16} /> Upload File
        </button>
        <button 
          onClick={() => setActiveTab('paste')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === 'paste' ? "bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          <ClipboardPaste size={16} /> Paste Chat
        </button>
      </div>

      <div className="glass-card p-1 min-h-[300px] flex flex-col">
        {activeTab === 'upload' ? (
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={onDrop}
            className={cn(
              "flex-1 relative group border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer m-4",
              isDragActive ? "border-blue-500 bg-blue-50/10 dark:bg-blue-900/10 scale-[1.01]" : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
            )}
          >
            <input 
              type="file" 
              accept=".txt" 
              onChange={onChange} 
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {!fileName ? (
              <>
                <div className={cn(
                  "w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 transition-transform duration-500",
                  isDragActive ? "scale-110 rotate-3" : "group-hover:scale-110"
                )}>
                  <Upload className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-1">Upload WhatsApp Export</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Drag and drop your .txt file here</p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <FileText className="text-green-600 dark:text-green-400" size={28} />
                </div>
                <h3 className="text-lg font-semibold truncate max-w-xs">{fileName}</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName('');
                    onClear();
                  }}
                  className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <X size={16} /> Remove selection
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-6 space-y-4">
            <div className="flex-1 relative">
              <textarea 
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your WhatsApp chat content here...&#10;Example:&#10;12/03/24, 10:30 am - Rahul: Hello"
                className="w-full h-full min-h-[250px] p-4 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none font-mono text-sm leading-relaxed"
              />
              <div className="absolute top-4 right-4 text-neutral-400 pointer-events-none">
                 <ClipboardPaste size={20} />
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                {pastedText.split('\n').filter(l => l.trim()).length} lines detected
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setPastedText(''); setFileName(''); onClear(); }}
                  className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-red-500 transition-colors"
                >
                  Clear Content
                </button>
                <button 
                  onClick={handlePasteProcess}
                  disabled={!pastedText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm"
                >
                  Process Paste <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
