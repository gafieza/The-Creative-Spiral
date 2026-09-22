import React, { useState } from 'react';
import { Copy, Download, Check, Sparkles, Maximize2, Trash2 } from 'lucide-react';
import { NotebooksState, NotebookTab } from '../types';

interface NotebooksViewProps {
  notebooks: NotebooksState;
  activeNotebookTab: NotebookTab;
  setActiveNotebookTab: (tab: NotebookTab) => void;
  onUpdateNotebook: (field: NotebookTab, val: string) => void;
  onOpenDistractionFree: (text: string, title: string) => void;
}

export const NotebooksView: React.FC<NotebooksViewProps> = ({
  notebooks,
  activeNotebookTab,
  setActiveNotebookTab,
  onUpdateNotebook,
  onOpenDistractionFree,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const notebookMeta: Record<
    NotebookTab,
    { label: string; description: string; placeholder: string }
  > = {
    working: {
      label: 'Working Notebook',
      description: 'Raw fragments, sensory observations, physical textures, and unfiltered drafts.',
      placeholder: 'Record the uncurated world: what did the light hit, what did the metal smell like, what was in the palm...',
    },
    shadow: {
      label: 'Language Shadow',
      description: 'Recurring words, unconscious syntax habits, stylistic crutches, and rhythm patterns.',
      placeholder: 'Track your crutches: which adjectives recur, where do you rely on summary rather than scene...',
    },
    almostExplained: {
      label: 'Things I Almost Explained',
      description: 'Where you were tempted to explain emotion or meaning, but chose restraint instead.',
      placeholder: 'Note the moments where you wanted to tell the reader what it meant, and the physical fact you gave them instead...',
    },
    taughtMe: {
      label: 'Today The Writing Taught Me',
      description: 'Chronicle of epiphanies, technical breakdowns, and what the page demanded of you today.',
      placeholder: 'What truth about the story or your voice was revealed during today\'s hours at the desk...',
    },
  };

  const currentContent = notebooks[activeNotebookTab] || '';
  const wordCount = currentContent.trim()
    ? currentContent.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = currentContent.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeNotebookTab}-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm(`Clear the entire ${notebookMeta[activeNotebookTab].label}? This cannot be undone.`)) {
      onUpdateNotebook(activeNotebookTab, '');
    }
  };

  return (
    <div id="notebooks-view-container" className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-8 animate-fadeIn w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-[#E6E1D6] pb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
            Persistent Archives
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#2C2A29]">
            Writer's Working Notebooks
          </h2>
          <p className="text-xs md:text-sm text-[#736453] font-serif italic mt-1">
            {notebookMeta[activeNotebookTab].description}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans text-[#8C7A6B]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Auto-saved locally</span>
        </div>
      </div>

      {/* Tabs */}
      <div id="notebook-tabs-bar" className="flex flex-wrap gap-2 border-b border-[#E6E1D6] pb-4 font-sans text-xs">
        {(['working', 'shadow', 'almostExplained', 'taughtMe'] as NotebookTab[]).map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveNotebookTab(tab)}
            className={`px-4 py-2 rounded transition-colors text-xs ${
              activeNotebookTab === tab
                ? 'bg-[#3A3229] text-[#FAF8F5] font-medium'
                : 'bg-[#EFECE6] text-[#736453] hover:bg-[#E2DDD5]'
            }`}
          >
            {notebookMeta[tab].label}
          </button>
        ))}
      </div>

      {/* Editor Container */}
      <div className="bg-white border border-[#D9D1C5] rounded-md shadow-xs flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-[#FAF8F5] border-b border-[#E6E1D6] px-4 py-2.5 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center space-x-4 text-[#8C7A6B]">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="copy-notebook-btn"
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-[#EFECE6] text-[#594A3C] transition-colors flex items-center space-x-1"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              id="export-notebook-btn"
              onClick={handleExport}
              className="p-1.5 rounded hover:bg-[#EFECE6] text-[#594A3C] transition-colors flex items-center space-x-1"
              title="Download as text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px]">Export</span>
            </button>

            <button
              id="fullscreen-notebook-btn"
              onClick={() =>
                onOpenDistractionFree(currentContent, notebookMeta[activeNotebookTab].label)
              }
              className="p-1.5 rounded hover:bg-[#EFECE6] text-[#594A3C] transition-colors flex items-center space-x-1"
              title="Open in Distraction-Free writing mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Focus Mode</span>
            </button>

            {currentContent.length > 0 && (
              <button
                id="clear-notebook-btn"
                onClick={handleClear}
                className="p-1.5 rounded hover:bg-[#FBEBEB] text-[#8C7A6B] hover:text-[#B33A3A] transition-colors ml-2"
                title="Clear notebook content"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          id={`notebook-textarea-${activeNotebookTab}`}
          rows={16}
          className="w-full flex-1 p-6 text-base font-serif text-[#2C2A29] focus:outline-none resize-none leading-relaxed placeholder:italic placeholder:text-[#A69B8F]"
          placeholder={notebookMeta[activeNotebookTab].placeholder}
          value={currentContent}
          onChange={(e) => onUpdateNotebook(activeNotebookTab, e.target.value)}
        />
      </div>
    </div>
  );
};
