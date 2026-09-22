import React, { useState, useEffect } from 'react';
import { X, Clock, Download, Check, Moon, Sun, BookOpen } from 'lucide-react';

interface DistractionFreeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  onSave: (text: string) => void;
  title?: string;
}

export const DistractionFreeEditor: React.FC<DistractionFreeEditorProps> = ({
  isOpen,
  onClose,
  initialText,
  onSave,
  title = "Distraction-Free Writing Sanctuary",
}) => {
  const [text, setText] = useState<string>(initialText);
  const [theme, setTheme] = useState<'parchment' | 'linen' | 'night'>('parchment');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  useEffect(() => {
    setText(initialText);
  }, [initialText, isOpen]);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isOpen) return null;

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleExport = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `the-creative-spiral-draft-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleManualSave = () => {
    onSave(text);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const themeClasses = {
    parchment: 'bg-[#FBF9F5] text-[#2C2A29] selection:bg-[#E8E2D5]',
    linen: 'bg-[#FAF8F5] text-[#1A1817] selection:bg-[#D9D1C5]',
    night: 'bg-[#181615] text-[#E0DAD0] selection:bg-[#3E3834]',
  };

  const headerBorder = {
    parchment: 'border-[#E6E1D6]',
    linen: 'border-[#E0D9CC]',
    night: 'border-[#2E2A27]',
  };

  return (
    <div
      id="distraction-free-sanctuary"
      className={`fixed inset-0 z-50 flex flex-col p-6 md:p-14 font-serif transition-colors duration-200 ${themeClasses[theme]}`}
    >
      {/* Top Controls */}
      <div
        className={`flex items-center justify-between pb-4 border-b ${headerBorder[theme]} font-sans text-xs`}
      >
        <div className="flex items-center space-x-3">
          <BookOpen className="w-4 h-4 text-[#8C7A6B]" />
          <span className="uppercase tracking-widest text-[#8C7A6B] font-medium hidden sm:inline">
            {title}
          </span>
          {savedBanner && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Saved</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Timer */}
          <div className="flex items-center space-x-2 border border-[#8C7A6B]/30 px-2.5 py-1 rounded">
            <Clock className="w-3.5 h-3.5 text-[#8C7A6B]" />
            <span className="font-mono text-xs">{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-[10px] uppercase font-semibold text-[#8C7A6B] hover:text-[#594A3C] transition-colors"
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
          </div>

          {/* Theme toggles */}
          <div className="flex items-center space-x-1 border border-[#8C7A6B]/30 rounded p-0.5">
            <button
              onClick={() => setTheme('parchment')}
              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                theme === 'parchment' ? 'bg-[#594A3C] text-white' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Parchment
            </button>
            <button
              onClick={() => setTheme('linen')}
              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                theme === 'linen' ? 'bg-[#594A3C] text-white' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Linen
            </button>
            <button
              onClick={() => setTheme('night')}
              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                theme === 'night' ? 'bg-[#594A3C] text-white' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Ink
            </button>
          </div>

          {/* Download Text */}
          <button
            id="sanctuary-export-btn"
            onClick={handleExport}
            className="p-1.5 rounded border border-[#8C7A6B]/30 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Download draft as plain text"
            aria-label="Export draft"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Save & Exit */}
          <button
            id="sanctuary-exit-btn"
            onClick={() => {
              onSave(text);
              onClose();
            }}
            className="bg-[#3A3229] hover:bg-[#2C2A29] text-[#FAF8F5] px-4 py-1.5 rounded text-xs uppercase tracking-widest transition-colors flex items-center space-x-1"
          >
            <span>Exit & Save</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 max-w-3xl w-full mx-auto py-8 flex flex-col">
        <textarea
          id="sanctuary-textarea"
          autoFocus
          className="w-full flex-1 bg-transparent border-none text-lg md:text-2xl font-serif leading-relaxed md:leading-loose focus:outline-none resize-none placeholder:italic placeholder:opacity-40"
          placeholder="Let perception proceed meaning. Write without hurry..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onSave(e.target.value);
          }}
        />
      </div>

      {/* Footer statistics */}
      <div
        className={`pt-4 border-t ${headerBorder[theme]} max-w-3xl w-full mx-auto flex items-center justify-between text-xs font-sans opacity-70`}
      >
        <div className="flex items-center space-x-4">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>
        <div>
          <span>Auto-saved to Working Notebook</span>
        </div>
      </div>
    </div>
  );
};
