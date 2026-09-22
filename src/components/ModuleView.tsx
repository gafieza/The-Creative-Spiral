import React, { useState } from 'react';
import { 
  Check, ChevronRight, BookOpen, Clock, Maximize2, Feather, 
  Sparkles, Layers, Eye, EyeOff, RefreshCw, Bookmark 
} from 'lucide-react';
import { 
  ModuleData, ModuleTab, NotebooksState, NotebookTab, 
  AllSelfReviews, ReviewStatus, CraftAreaReview 
} from '../types';

interface ModuleViewProps {
  curriculum: ModuleData[];
  activeModuleId: number;
  setActiveModuleId: (id: number) => void;
  activeTab: ModuleTab;
  setActiveTab: (tab: ModuleTab) => void;
  longWorkTitle: string;
  protagonistName: string;
  completedEncounters: Record<string, boolean>;
  toggleComplete: (key: string) => void;
  notebooks: NotebooksState;
  onUpdateNotebook: (field: NotebookTab, val: string) => void;
  selfReviews: AllSelfReviews;
  onUpdateSelfReview: (moduleId: number, area: string, review: CraftAreaReview) => void;
  onOpenDistractionFree: (text: string, title: string) => void;
}

const CRAFT_AREAS = [
  'Voice',
  'Precision',
  'Character',
  'Scene',
  'Image',
  'Dialogue',
  'Mystery',
  'Rhythm',
];

export const ModuleView: React.FC<ModuleViewProps> = ({
  curriculum,
  activeModuleId,
  setActiveModuleId,
  activeTab,
  setActiveTab,
  longWorkTitle,
  protagonistName,
  completedEncounters,
  toggleComplete,
  notebooks,
  onUpdateNotebook,
  selfReviews,
  onUpdateSelfReview,
  onOpenDistractionFree,
}) => {
  const activeModule = curriculum.find((m) => m.id === activeModuleId) || curriculum[0];

  // Interactive Close Reading states
  const [revealedCraftNote, setRevealedCraftNote] = useState<boolean>(false);
  const [revealedRevision, setRevealedRevision] = useState<boolean>(false);

  // Local scratchpad for labs
  const [labText, setLabText] = useState<string>('');

  const currentEncounterKey = `mod_${activeModuleId}_${activeTab}`;
  const isCurrentEncounterComplete = Boolean(completedEncounters[currentEncounterKey]);

  return (
    <div id="module-workspace-container" className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
      {/* Left Collapsible Navigation Sidebar */}
      <aside
        id="module-sidebar"
        className="w-full md:w-72 border-r border-[#E6E1D6] bg-[#F7F4EE] p-5 md:p-6 font-sans space-y-6 shrink-0"
      >
        {/* Module Selector Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="module-select-dropdown"
            className="text-[10px] uppercase tracking-widest text-[#8C7A6B] font-semibold block"
          >
            Curriculum Spiral
          </label>
          <select
            id="module-select-dropdown"
            value={activeModuleId}
            onChange={(e) => setActiveModuleId(Number(e.target.value))}
            className="w-full bg-[#FAF8F5] border border-[#D9D1C5] px-3 py-2 text-xs font-serif text-[#2C2A29] rounded focus:outline-none focus:border-[#594A3C]"
          >
            {curriculum.map((m) => (
              <option key={m.id} value={m.id}>
                Week {m.id}: {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Section Navigation Tabs */}
        <nav className="space-y-1">
          {[
            { id: 'arrival', label: '1. Arrival' },
            { id: 'learn', label: '2. Learn' },
            { id: 'read', label: '3. Read Like a Writer' },
            { id: 'closeReading', label: '4. Close Reading Lab' },
            { id: 'writingLab', label: '5. Writing Lab' },
            { id: 'longWork', label: `6. ${longWorkTitle} Lab` },
            { id: 'poetryLab', label: '7. Poetry Lab' },
            { id: 'return', label: '8. Reflection / Return' },
          ].map((tab) => {
            const tabKey = `mod_${activeModuleId}_${tab.id}`;
            const isDone = completedEncounters[tabKey];
            return (
              <button
                key={tab.id}
                id={`module-tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id as ModuleTab)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-[#3A3229] text-[#FAF8F5] font-medium'
                    : 'text-[#594A3C] hover:bg-[#EFECE6]'
                }`}
              >
                <span className="truncate pr-2">{tab.label}</span>
                {isDone && <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Completion Toggle for Current Section */}
        <div className="pt-4 border-t border-[#E6E1D6] space-y-3">
          <button
            id="toggle-encounter-complete-btn"
            onClick={() => toggleComplete(currentEncounterKey)}
            className={`w-full py-2 px-3 rounded text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 ${
              isCurrentEncounterComplete
                ? 'bg-[#8C7A6B] text-white'
                : 'border border-[#8C7A6B] text-[#594A3C] hover:bg-[#EFECE6]'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>
              {isCurrentEncounterComplete ? 'Encounter Completed' : 'Mark Encounter Done'}
            </span>
          </button>

          {/* Quick Week Done Marker */}
          <button
            id="toggle-week-complete-btn"
            onClick={() => toggleComplete(`mod_${activeModuleId}_done`)}
            className="w-full text-[10px] uppercase tracking-wider text-[#8C7A6B] hover:text-[#2C2A29] text-center block pt-1"
          >
            {completedEncounters[`mod_${activeModuleId}_done`]
              ? '✓ Week marked complete'
              : 'Mark entire week complete'}
          </button>
        </div>
      </aside>

      {/* Right Main Workspace */}
      <section
        id="module-main-content"
        className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#FBF9F5] max-w-4xl"
      >
        {/* TAB 1: ARRIVAL */}
        {activeTab === 'arrival' && (
          <div id="section-arrival" className="space-y-8 animate-fadeIn max-w-2xl mx-auto text-center py-8">
            <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
              Week {activeModule.id} • Arrival
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#2C2A29]">
              {activeModule.title}
            </h2>
            <p className="text-lg text-[#736453] font-serif italic">
              "{activeModule.subtitle}"
            </p>

            {/* Core Principle Box */}
            <div className="bg-[#F2EFE9] border border-[#D9D1C5] p-6 rounded-md text-left space-y-2 font-sans shadow-2xs">
              <span className="text-[10px] uppercase tracking-wider text-[#594A3C] font-semibold block">
                Core Principle
              </span>
              <p className="text-sm font-serif text-[#3A3229] leading-relaxed">
                {activeModule.corePrinciple}
              </p>
            </div>

            {/* Arrival Question Box */}
            <div className="bg-white border border-[#E6E1D6] p-6 rounded-md text-left space-y-2 font-sans shadow-2xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] font-semibold block">
                Arrival Inquiry
              </span>
              <p className="text-base font-serif italic text-[#3A3229] leading-relaxed">
                "{activeModule.arrivalQuestion}"
              </p>
            </div>

            {/* Settling Ritual */}
            <div className="border border-[#D9D1C5] p-6 rounded-md bg-[#FAF8F5] text-left space-y-3 font-sans">
              <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] font-semibold block">
                Settling Ritual (2 Minutes)
              </span>
              <ul className="text-xs text-[#594A3C] space-y-2 font-serif list-disc pl-4 leading-relaxed">
                <li>Look away from the screen toward a distant surface or window.</li>
                <li>Notice three physical textures in your immediate room without naming their utility.</li>
                <li>Complete this sentence inwardly: "I arrive at the desk carrying..."</li>
              </ul>
            </div>

            <button
              id="arrival-begin-lesson-btn"
              onClick={() => setActiveTab('learn')}
              className="bg-[#3A3229] hover:bg-[#2C2A29] text-[#FAF8F5] px-6 py-3 rounded text-xs uppercase tracking-widest font-sans transition-colors inline-flex items-center space-x-2"
            >
              <span>Begin Craft Lesson</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 2: LEARN */}
        {activeTab === 'learn' && (
          <div id="section-learn" className="space-y-10 animate-fadeIn max-w-3xl mx-auto">
            <div className="border-b border-[#E6E1D6] pb-5">
              <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
                Module Teaching
              </span>
              <h2 className="text-3xl font-serif font-light text-[#2C2A29] mt-1">
                Week {activeModule.id}: {activeModule.title}
              </h2>
            </div>

            {activeModule.learnChapters.map((ch, idx) => (
              <article
                key={idx}
                className="space-y-6 bg-white border border-[#E6E1D6] p-6 md:p-8 rounded-md shadow-2xs"
              >
                <h3 className="text-xl font-serif font-medium text-[#3A3229] border-b border-[#F2EFE9] pb-3">
                  {idx + 1}. {ch.title}
                </h3>

                <div className="space-y-4 font-serif text-sm text-[#3A3229] leading-relaxed">
                  <div>
                    <strong className="font-sans text-[10px] uppercase tracking-wider text-[#8C7A6B] block mb-1">
                      Definition
                    </strong>
                    <p>{ch.definition}</p>
                  </div>

                  <div>
                    <strong className="font-sans text-[10px] uppercase tracking-wider text-[#8C7A6B] block mb-1">
                      Why This Principle Matters
                    </strong>
                    <p>{ch.whyItMatters}</p>
                  </div>

                  {/* Execution Levels */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-[#F2EFE9] font-sans text-xs">
                    <div className="bg-[#FAF8F5] p-3 rounded border border-[#EFECE6] space-y-1">
                      <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px]">
                        Weak Execution
                      </span>
                      <p className="font-serif text-[#594A3C] text-[13px]">{ch.weakExecution}</p>
                    </div>

                    <div className="bg-[#FAF8F5] p-3 rounded border border-[#EFECE6] space-y-1">
                      <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px]">
                        Developing Execution
                      </span>
                      <p className="font-serif text-[#594A3C] text-[13px]">{ch.developingExecution}</p>
                    </div>

                    <div className="bg-[#F2EFE9] p-3 rounded border border-[#D9D1C5] space-y-1">
                      <span className="font-semibold text-[#3A3229] uppercase tracking-wider block text-[10px]">
                        Mature Execution
                      </span>
                      <p className="font-serif text-[#2C2A29] text-[13px]">{ch.matureExecution}</p>
                    </div>
                  </div>

                  {/* Before and After Comparison */}
                  <div className="bg-[#F7F4EE] p-4 rounded-md border border-[#E6E1D6] space-y-2.5 font-sans">
                    <span className="text-[10px] uppercase tracking-widest text-[#8C7A6B] font-semibold">
                      Before & After Craft Diagnosis
                    </span>
                    <div className="space-y-2 text-xs font-serif">
                      <div className="p-2 bg-white/60 rounded border border-[#E6E1D6]">
                        <span className="font-sans text-[10px] text-[#A69B8F] uppercase block font-semibold">
                          Before (Weak / Explanatory):
                        </span>
                        <p className="italic text-[#594A3C]">"{ch.beforeAndAfter.before}"</p>
                      </div>

                      <div className="p-2 bg-white rounded border border-[#D9D1C5]">
                        <span className="font-sans text-[10px] text-[#594A3C] uppercase block font-semibold">
                          After (Rigorous / Witnessed):
                        </span>
                        <p className="font-medium text-[#2C2A29]">"{ch.beforeAndAfter.after}"</p>
                      </div>

                      <p className="text-[11px] text-[#8C7A6B] italic pt-1 border-t border-[#E6E1D6]">
                        {ch.beforeAndAfter.note}
                      </p>
                    </div>
                  </div>

                  {/* Misconception and For Your Writing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-sans text-xs">
                    <div className="bg-[#FAF8F5] p-3.5 rounded border border-[#EFECE6] space-y-1">
                      <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px]">
                        Common Misconception
                      </span>
                      <p className="font-serif text-[#594A3C] text-[13px]">{ch.commonMisconceptions}</p>
                    </div>

                    <div className="bg-[#FAF8F5] p-3.5 rounded border border-[#EFECE6] space-y-1">
                      <span className="font-semibold text-[#3A3229] uppercase tracking-wider block text-[10px]">
                        Direct Craft Instruction
                      </span>
                      <p className="font-serif text-[#2C2A29] text-[13px]">{ch.forYourWriting}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div className="text-center pt-4">
              <button
                id="learn-next-step-btn"
                onClick={() => setActiveTab('read')}
                className="bg-[#3A3229] hover:bg-[#2C2A29] text-[#FAF8F5] px-6 py-2.5 rounded text-xs uppercase tracking-widest font-sans transition-colors inline-flex items-center space-x-2"
              >
                <span>Proceed to Reading Companion</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: READ LIKE A WRITER */}
        {activeTab === 'read' && (
          <div id="section-read" className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="border-b border-[#E6E1D6] pb-5">
              <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
                Reading Companion
              </span>
              <h2 className="text-3xl font-serif font-light text-[#2C2A29] mt-1">
                Read Like a Writer
              </h2>
              <p className="text-xs font-serif text-[#736453] italic mt-1">
                Stealing architecture from the masters through diagnostic close observation.
              </p>
            </div>

            {activeModule.readLikeAWriter.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E6E1D6] p-6 md:p-8 rounded-md space-y-5 shadow-2xs"
              >
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7A6B] font-semibold">
                    Master Writer: {item.writer}
                  </span>
                  <h3 className="text-2xl font-serif text-[#3A3229] font-medium">{item.title}</h3>
                  <p className="text-xs text-[#736453] font-serif italic mt-1">
                    {item.recommendation}
                  </p>
                </div>

                <div className="bg-[#F7F4EE] p-4 rounded-md font-sans text-xs space-y-1">
                  <span className="font-semibold text-[#594A3C] uppercase tracking-wider text-[10px]">
                    Craft Element to Study:
                  </span>
                  <p className="font-serif text-[#3A3229] text-sm">{item.craftElement}</p>
                </div>

                <div className="space-y-2 font-sans">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] font-semibold block">
                    Guiding Diagnostic Questions
                  </span>
                  <ul className="space-y-1.5 font-serif text-sm text-[#3A3229] list-disc pl-4 leading-relaxed">
                    {item.guidingQuestions.map((q, qIdx) => (
                      <li key={qIdx}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#E6E1D6]">
                  <label
                    htmlFor={`reading-notes-${idx}`}
                    className="text-[10px] font-sans uppercase tracking-wider text-[#594A3C] font-semibold block"
                  >
                    Your Reading Observations (Stored in Working Notebook)
                  </label>
                  <textarea
                    id={`reading-notes-${idx}`}
                    rows={3}
                    className="w-full bg-[#FAF8F5] border border-[#D9D1C5] p-3 text-xs md:text-sm font-serif rounded focus:outline-none focus:border-[#594A3C]"
                    placeholder="What did I notice? What did it do to my breath?"
                    value={notebooks.working}
                    onChange={(e) => onUpdateNotebook('working', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CLOSE READING LAB */}
        {activeTab === 'closeReading' && (
          <div id="section-close-reading" className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="border-b border-[#E6E1D6] pb-5">
              <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
                Interactive Lab
              </span>
              <h2 className="text-3xl font-serif font-light text-[#2C2A29] mt-1">
                Close Reading Lab
              </h2>
            </div>

            <div className="bg-white border border-[#E6E1D6] p-6 md:p-8 rounded-md space-y-6 shadow-2xs font-serif">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A6B] font-semibold block mb-2">
                  Original Course Craft Sample
                </span>
                <p className="text-lg md:text-xl text-[#2C2A29] leading-relaxed italic bg-[#FAF8F5] p-6 rounded border-l-2 border-[#594A3C]">
                  "{activeModule.closeReadingOriginal.text}"
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 font-sans text-xs">
                <button
                  id="toggle-craft-note-btn"
                  onClick={() => setRevealedCraftNote(!revealedCraftNote)}
                  className="bg-[#EFECE6] hover:bg-[#E2DDD5] text-[#3A3229] px-4 py-2 rounded transition-colors flex items-center space-x-1.5"
                >
                  {revealedCraftNote ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{revealedCraftNote ? 'Hide Craft Note' : 'Reveal Craft Note'}</span>
                </button>

                <button
                  id="toggle-revision-compare-btn"
                  onClick={() => setRevealedRevision(!revealedRevision)}
                  className="bg-[#EFECE6] hover:bg-[#E2DDD5] text-[#3A3229] px-4 py-2 rounded transition-colors flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{revealedRevision ? 'Hide Revision Comparison' : 'Compare with Weak Version'}</span>
                </button>
              </div>

              {revealedCraftNote && (
                <div className="bg-[#F7F4EE] border border-[#E6E1D6] p-5 rounded-md space-y-2 font-sans animate-fadeIn">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#594A3C] font-semibold">
                    Craft Note & Analysis
                  </h4>
                  <p className="text-sm font-serif text-[#3A3229] leading-relaxed">
                    {activeModule.closeReadingOriginal.craftNote}
                  </p>
                </div>
              )}

              {revealedRevision && (
                <div className="bg-[#F2EFE9] border border-[#D9D1C5] p-5 rounded-md space-y-2 font-sans animate-fadeIn">
                  <h4 className="text-[10px] uppercase tracking-wider text-[#594A3C] font-semibold">
                    Revision Diagnostic Comparison
                  </h4>
                  <p className="text-sm font-serif text-[#3A3229] leading-relaxed">
                    {activeModule.closeReadingOriginal.revisionComparison}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: WRITING LAB */}
        {activeTab === 'writingLab' && (
          <div id="section-writing-lab" className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="border-b border-[#E6E1D6] pb-5 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
                  Practice & Exploration
                </span>
                <h2 className="text-3xl font-serif font-light text-[#2C2A29] mt-1">
                  Writing Lab
                </h2>
              </div>

              <button
                id="enter-lab-focus-btn"
                onClick={() =>
                  onOpenDistractionFree(notebooks.working, `Writing Lab: Week ${activeModule.id}`)
                }
                className="text-xs font-sans uppercase tracking-wider text-[#594A3C] hover:text-[#2C2A29] border border-[#D9D1C5] px-3.5 py-1.5 rounded bg-[#FAF8F5] flex items-center space-x-1.5 self-start"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Distraction-Free Sanctuary</span>
              </button>
            </div>

            {[
              { level: 'ENTER (10-15 mins)', data: activeModule.writingLab.enter },
              { level: 'DESCEND (20-40 mins)', data: activeModule.writingLab.descend },
              { level: 'DEEP WORK (Substantial Assignment)', data: activeModule.writingLab.deepWork },
            ].map((lab, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E6E1D6] p-6 md:p-8 rounded-md space-y-4 shadow-2xs"
              >
                <div className="flex justify-between items-center font-sans">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7A6B] font-semibold">
                    {lab.level}
                  </span>
                  <span className="text-xs text-[#8C7A6B] font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{lab.data.time}</span>
                  </span>
                </div>

                <h3 className="text-xl font-serif text-[#3A3229] font-medium">{lab.data.title}</h3>
                <p className="text-sm font-serif text-[#594A3C] bg-[#FAF8F5] p-4 rounded border border-[#EFECE6] leading-relaxed">
                  {lab.data.prompt}
                </p>

                <textarea
                  id={`writing-lab-input-${idx}`}
                  rows={4}
                  className="w-full bg-[#FAF8F5] border border-[#D9D1C5] p-4 text-sm font-serif rounded focus:outline-none focus:border-[#594A3C] leading-relaxed"
                  placeholder="Begin drafting here... (Saves automatically to Working Notebook)"
                  value={notebooks.working}
                  onChange={(e) => onUpdateNotebook('working', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: LONG WORK LAB */}
        {activeTab === 'longWork' && (
          <div id="section-long-work" className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="border-b border-[#E6E1D6] pb-5">
              <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
                Sustained Fiction Project
              </span>
              <h2 className="text-3xl font-serif font-light text-[#2C2A29] mt-1">
                {longWorkTitle} Lab
              </h2>
              <p className="text-xs font-serif text-[#736453] italic mt-1">
                Focal Figure: <span className="font-semibold text-[#594A3C]">{protagonistName}</span>
              </p>
            </div>

            <div className="bg-white border border-[#E6E1D6] p-6 md:p-8 rounded-md space-y-6 shadow-2xs">
              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A6B] font-semibold block">
                  Week {activeModule.id} Sustained Project Application
                </span>
                <p className="text-base font-serif text-[#3A3229] leading-relaxed bg-[#FAF8F5] p-4 rounded border border-[#E6E1D6]">
                  {activeModule.longWorkPrompt}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E6E1D6]">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="longwork-textarea"
                    className="text-[10px] font-sans uppercase tracking-wider text-[#594A3C] font-semibold"
                  >
                    Drafting Space ({longWorkTitle})
                  </label>
                  <button
                    onClick={() =>
                      onOpenDistractionFree(notebooks.working, `${longWorkTitle} - Week ${activeModule.id}`)
                    }
                    className="text-[11px] font-sans text-[#8C7A6B] hover:text-[#2C2A29] flex items-center space-x-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Focus View</span>
                  </button>
                </div>
                <textarea
                  id="longwork-textarea"
                  rows={10}
                  className="w-full bg-[#FAF8F5] border border-[#D9D1C5] p-4 text-sm font-serif rounded focus:outline-none focus:border-[#594A3C] leading-relaxed"
                  placeholder={`Write your ${longWorkTitle} exploration or revision here...`}
                  value={notebooks.working}
                  onChange={(e) => onUpdateNotebook('working', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: POETRY LAB */}
        {activeTab === 'poetryLab' && (
          <div id="section-poetry-lab" className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="border-b border-[#E6E1D6] pb-5">
              <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
                Lyric & Fragment Practice
              </span>
              <h2 className="text-3xl font-serif font-light text-[#2C2A29] mt-1">
                Poetry Lab
              </h2>
            </div>

            <div className="bg-white border border-[#E6E1D6] p-6 md:p-8 rounded-md space-y-6 shadow-2xs">
              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A6B] font-semibold block">
                  Poetic Prompt
                </span>
                <p className="text-base font-serif text-[#3A3229] leading-relaxed bg-[#FAF8F5] p-4 rounded border border-[#E6E1D6]">
                  {activeModule.poetryPrompt}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E6E1D6]">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="poetry-textarea"
                    className="text-[10px] font-sans uppercase tracking-wider text-[#594A3C] font-semibold"
                  >
                    Poetry / Lyric Drafting Space (Stored in Language Shadow)
                  </label>
                  <button
                    onClick={() =>
                      onOpenDistractionFree(notebooks.shadow, `Poetry Lab - Week ${activeModule.id}`)
                    }
                    className="text-[11px] font-sans text-[#8C7A6B] hover:text-[#2C2A29] flex items-center space-x-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Focus View</span>
                  </button>
                </div>
                <textarea
                  id="poetry-textarea"
                  rows={8}
                  className="w-full bg-[#FAF8F5] border border-[#D9D1C5] p-4 text-sm font-serif rounded focus:outline-none focus:border-[#594A3C] leading-relaxed"
                  placeholder="Draft your poem or lyric fragment here..."
                  value={notebooks.shadow}
                  onChange={(e) => onUpdateNotebook('shadow', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: REFLECTION / RETURN */}
        {activeTab === 'return' && (
          <div id="section-reflection" className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="border-b border-[#E6E1D6] pb-5">
              <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
                Closure & Integration
              </span>
              <h2 className="text-3xl font-serif font-light text-[#2C2A29] mt-1">
                Reflection / Return
              </h2>
            </div>

            {/* Major Reflective Question */}
            <div className="bg-white border border-[#E6E1D6] p-6 md:p-8 rounded-md space-y-4 shadow-2xs">
              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A6B] font-semibold block">
                Major Reflective Question
              </span>
              <p className="text-lg md:text-xl font-serif italic text-[#3A3229] leading-relaxed bg-[#FAF8F5] p-4 rounded border border-[#E6E1D6]">
                "{activeModule.reflectionQuestion}"
              </p>
              <textarea
                id="reflection-textarea"
                rows={4}
                className="w-full bg-[#FAF8F5] border border-[#D9D1C5] p-4 text-sm font-serif rounded focus:outline-none focus:border-[#594A3C] leading-relaxed"
                placeholder="Reflect here... (Stored in Things I Almost Explained archive)"
                value={notebooks.almostExplained}
                onChange={(e) => onUpdateNotebook('almostExplained', e.target.value)}
              />
            </div>

            {/* End-of-Week Craft Diagnostic Review */}
            <div className="bg-[#FAF8F5] border border-[#D9D1C5] p-6 md:p-8 rounded-md space-y-6 shadow-2xs font-sans">
              <div>
                <h3 className="text-lg font-serif font-medium text-[#3A3229]">
                  End-of-Week Craft Diagnostic Review
                </h3>
                <p className="text-xs text-[#8C7A6B] mt-1">
                  Qualitative assessment across 8 foundational craft areas (no numerical gamification).
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E6E1D6]">
                {CRAFT_AREAS.map((area) => {
                  const currentAreaReview =
                    selfReviews[activeModuleId]?.[area] || { status: 'ALIVE', note: '' };

                  return (
                    <div
                      key={area}
                      className="bg-white border border-[#E6E1D6] p-4 rounded-md space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#594A3C]">
                          {area}
                        </span>

                        <div className="flex space-x-1.5 text-[10px]">
                          {(['ALIVE', 'DEVELOPING', 'NEEDS ATTENTION'] as ReviewStatus[]).map((st) => (
                            <button
                              key={st}
                              id={`craft-status-${area.toLowerCase()}-${st.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={() =>
                                onUpdateSelfReview(activeModuleId, area, {
                                  ...currentAreaReview,
                                  status: st,
                                })
                              }
                              className={`px-2.5 py-1 rounded transition-colors text-[10px] font-sans ${
                                currentAreaReview.status === st
                                  ? 'bg-[#3A3229] text-[#FAF8F5] font-medium'
                                  : 'bg-[#EFECE6] text-[#736453] hover:bg-[#E2DDD5]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        id={`craft-note-${area.toLowerCase()}`}
                        type="text"
                        placeholder={`Diagnostic note on ${area}...`}
                        value={currentAreaReview.note}
                        onChange={(e) =>
                          onUpdateSelfReview(activeModuleId, area, {
                            ...currentAreaReview,
                            note: e.target.value,
                          })
                        }
                        className="w-full bg-[#FAF8F5] border border-[#D9D1C5] px-3 py-1.5 text-xs font-serif rounded focus:outline-none focus:border-[#594A3C]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
