import React from 'react';
import { Feather, ChevronRight, Check, BookOpen, Layers, Edit3, Compass } from 'lucide-react';
import { ModuleData, NotebookTab } from '../types';

interface HomeViewProps {
  curriculum: ModuleData[];
  activeModuleId: number;
  setActiveModuleId: (id: number) => void;
  onContinueSpiral: () => void;
  onOpenNotebookTab: (tab: NotebookTab) => void;
  completedEncounters: Record<string, boolean>;
  longWorkTitle: string;
  protagonistName: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  curriculum,
  activeModuleId,
  setActiveModuleId,
  onContinueSpiral,
  onOpenNotebookTab,
  completedEncounters,
  longWorkTitle,
  protagonistName,
}) => {
  const currentModule = curriculum.find((m) => m.id === activeModuleId) || curriculum[0];

  // Calculate completion percentage across all modules
  const totalEncounters = curriculum.length * 7; // 7 key sections per module
  const completedKeys = Object.keys(completedEncounters).filter((k) => completedEncounters[k]);
  const completedCount = completedKeys.length;

  return (
    <div id="home-view-container" className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center space-y-12 animate-fadeIn">
      {/* Title & Editorial Subtitle */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#EFECE6] border border-[#D9D1C5] rounded-full text-xs font-sans tracking-widest text-[#594A3C]">
          <Feather className="w-3.5 h-3.5" />
          <span>IMMERSIVE APPRENTICESHIP</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-[#2C2A29]">
          THE CREATIVE SPIRAL
        </h1>
        <p className="text-base md:text-lg text-[#736453] font-serif italic max-w-xl mx-auto">
          A 12-Week Immersive Apprenticeship in Craft Architecture & Sustained Writing
        </p>
      </div>

      {/* Current Module Highlight Card */}
      <div
        id="current-module-hero-card"
        className="bg-[#F2EFE9] border border-[#D9D1C5] p-6 md:p-8 rounded-lg max-w-2xl w-full space-y-6 text-left shadow-xs transition-all hover:border-[#8C7A6B]"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
              Current Focus • Week {currentModule.id} of 12
            </span>
            <h2 className="text-2xl font-serif text-[#3A3229] mt-1 font-normal">
              {currentModule.title}
            </h2>
            <p className="text-xs font-serif text-[#736453] italic mt-0.5">
              "{currentModule.subtitle}"
            </p>
          </div>

          <button
            id="continue-spiral-btn"
            onClick={onContinueSpiral}
            className="bg-[#3A3229] hover:bg-[#2C2A29] text-[#FAF8F5] px-5 py-2.5 rounded text-xs uppercase tracking-widest font-sans transition-all flex items-center justify-center space-x-2 shadow-xs shrink-0 self-start"
          >
            <span>Continue the Spiral</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="border-t border-[#E6E1D6] pt-4 space-y-1.5 font-sans">
          <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] font-semibold">
            Arrival Question
          </span>
          <p className="text-sm md:text-base font-serif italic text-[#594A3C] leading-relaxed">
            "{currentModule.arrivalQuestion}"
          </p>
        </div>

        <div className="border-t border-[#E6E1D6] pt-3 flex items-center justify-between text-[11px] text-[#8C7A6B] font-sans">
          <span>Core Principle: {currentModule.corePrinciple.slice(0, 75)}...</span>
          <span className="font-serif italic">Week {currentModule.id} active</span>
        </div>
      </div>

      {/* 12-Week Spiral Visual Timeline */}
      <div className="w-full max-w-2xl space-y-3">
        <div className="flex items-center justify-between text-xs font-sans text-[#8C7A6B] px-1">
          <span className="uppercase tracking-wider font-semibold">Curriculum Spiral Navigation</span>
          <span>{completedCount} total encounters completed</span>
        </div>

        <div
          id="spiral-weeks-strip"
          className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#E6E1D6] rounded-md overflow-x-auto gap-2"
        >
          {curriculum.map((m) => {
            const isCurrent = m.id === activeModuleId;
            const isCompleted = completedEncounters[`mod_${m.id}_done`];
            const hasActivity = Object.keys(completedEncounters).some(
              (k) => k.startsWith(`mod_${m.id}_`) && completedEncounters[k]
            );

            return (
              <button
                key={m.id}
                id={`spiral-week-btn-${m.id}`}
                onClick={() => {
                  setActiveModuleId(m.id);
                  onContinueSpiral();
                }}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex flex-col items-center justify-center text-xs font-sans transition-all relative shrink-0 ${
                  isCurrent
                    ? 'bg-[#3A3229] text-[#FAF8F5] ring-2 ring-offset-2 ring-[#8C7A6B] font-medium'
                    : isCompleted
                    ? 'bg-[#8C7A6B] text-[#FAF8F5]'
                    : hasActivity
                    ? 'bg-[#E2DDD5] text-[#3A3229] font-medium'
                    : 'bg-[#EFECE6] text-[#736453] hover:bg-[#E2DDD5]'
                }`}
                title={`Week ${m.id}: ${m.title}`}
              >
                <span>{m.id}</span>
                {isCompleted && (
                  <Check className="w-2.5 h-2.5 text-[#FAF8F5] absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Access Notebooks */}
      <div className="w-full max-w-2xl space-y-3">
        <div className="text-left text-xs font-sans text-[#8C7A6B] px-1">
          <span className="uppercase tracking-wider font-semibold">Writer's Working Archives</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {[
            { id: 'working', label: 'Working Notebook', desc: 'Fragments & images' },
            { id: 'shadow', label: 'Language Shadow', desc: 'Habits & rhythms' },
            { id: 'almostExplained', label: 'Things I Almost Explained', desc: 'Resisted commentary' },
            { id: 'taughtMe', label: 'Today The Writing Taught Me', desc: 'Daily realizations' },
          ].map((nb) => (
            <div
              key={nb.id}
              id={`quick-nb-${nb.id}`}
              onClick={() => onOpenNotebookTab(nb.id as NotebookTab)}
              className="bg-[#F7F4EE] border border-[#E6E1D6] p-4 rounded-md text-left hover:border-[#8C7A6B] cursor-pointer transition-all group shadow-2xs hover:bg-[#FAF8F5]"
              role="button"
              tabIndex={0}
            >
              <h3 className="text-xs font-sans uppercase tracking-wider text-[#594A3C] font-semibold group-hover:text-[#2C2A29]">
                {nb.label}
              </h3>
              <p className="text-[11px] text-[#8C7A6B] font-serif mt-1 line-clamp-1">
                {nb.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Creative Constellation Card */}
      <div
        id="creative-constellation-card"
        className="bg-[#FAF8F5] border border-[#D9D1C5] p-6 rounded-md text-left max-w-2xl w-full space-y-3 shadow-2xs"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-sans uppercase tracking-widest text-[#8C7A6B] font-semibold">
            Your Creative Constellation
          </h3>
          <span className="text-[11px] font-sans text-[#8C7A6B] italic">Customizable in settings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-sm font-serif">
          <div className="bg-[#F7F4EE] p-3 rounded border border-[#E6E1D6]">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#A69B8F] block">
              Long Work Project
            </span>
            <span className="text-[#3A3229] font-medium text-base">{longWorkTitle}</span>
          </div>

          <div className="bg-[#F7F4EE] p-3 rounded border border-[#E6E1D6]">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#A69B8F] block">
              Focal Protagonist
            </span>
            <span className="text-[#3A3229] font-medium text-base">{protagonistName}</span>
          </div>

          <div className="bg-[#F7F4EE] p-3 rounded border border-[#E6E1D6]">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#A69B8F] block">
              Lyric / Free Mode
            </span>
            <span className="text-[#3A3229] font-medium text-base">Unbound Observation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
