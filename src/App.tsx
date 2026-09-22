import React, { useState, useEffect } from 'react';
import { CURRICULUM } from './data/curriculum';
import { READING_LIBRARY } from './data/library';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ModuleView } from './components/ModuleView';
import { LibraryView } from './components/LibraryView';
import { NotebooksView } from './components/NotebooksView';
import { SettingsModal } from './components/SettingsModal';
import { DistractionFreeEditor } from './components/DistractionFreeEditor';
import { 
  MainView, ModuleTab, NotebookTab, NotebooksState, 
  AllSelfReviews, CraftAreaReview 
} from './types';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<ModuleTab>('arrival');
  const [activeNotebookTab, setActiveNotebookTab] = useState<NotebookTab>('working');

  // Customization Settings
  const [longWorkTitle, setLongWorkTitle] = useState<string>(() => {
    try {
      return localStorage.getItem('cs_longwork_title') || "Call of the Tides";
    } catch {
      return "Call of the Tides";
    }
  });

  const [protagonistName, setProtagonistName] = useState<string>(() => {
    try {
      return localStorage.getItem('cs_protagonist_name') || "Samaara";
    } catch {
      return "Samaara";
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Persistence: Completed Encounters
  const [completedEncounters, setCompletedEncounters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('cs_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persistence: Notebooks
  const [notebooks, setNotebooks] = useState<NotebooksState>(() => {
    try {
      const saved = localStorage.getItem('cs_notebooks');
      return saved
        ? JSON.parse(saved)
        : { working: '', shadow: '', almostExplained: '', taughtMe: '' };
    } catch {
      return { working: '', shadow: '', almostExplained: '', taughtMe: '' };
    }
  });

  // Persistence: End-of-week Self Reviews
  const [selfReviews, setSelfReviews] = useState<AllSelfReviews>(() => {
    try {
      const saved = localStorage.getItem('cs_reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Distraction-Free Sanctuary Mode
  const [isDistractionFree, setIsDistractionFree] = useState<boolean>(false);
  const [distractionText, setDistractionText] = useState<string>('');
  const [distractionTitle, setDistractionTitle] = useState<string>('Writing Sanctuary');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cs_completed', JSON.stringify(completedEncounters));
    } catch (e) {
      console.error(e);
    }
  }, [completedEncounters]);

  useEffect(() => {
    try {
      localStorage.setItem('cs_notebooks', JSON.stringify(notebooks));
    } catch (e) {
      console.error(e);
    }
  }, [notebooks]);

  useEffect(() => {
    try {
      localStorage.setItem('cs_reviews', JSON.stringify(selfReviews));
    } catch (e) {
      console.error(e);
    }
  }, [selfReviews]);

  useEffect(() => {
    try {
      localStorage.setItem('cs_longwork_title', longWorkTitle);
    } catch (e) {
      console.error(e);
    }
  }, [longWorkTitle]);

  useEffect(() => {
    try {
      localStorage.setItem('cs_protagonist_name', protagonistName);
    } catch (e) {
      console.error(e);
    }
  }, [protagonistName]);

  // Handlers
  const toggleComplete = (key: string) => {
    setCompletedEncounters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleUpdateNotebook = (field: NotebookTab, val: string) => {
    setNotebooks((prev) => ({ ...prev, [field]: val }));
  };

  const handleUpdateSelfReview = (
    moduleId: number,
    area: string,
    review: CraftAreaReview
  ) => {
    setSelfReviews((prev) => {
      const modulePrev = prev[moduleId] || {};
      return {
        ...prev,
        [moduleId]: {
          ...modulePrev,
          [area]: review,
        },
      };
    });
  };

  const handleOpenDistractionFree = (text: string, title: string) => {
    setDistractionText(text);
    setDistractionTitle(title);
    setIsDistractionFree(true);
  };

  const handleSaveDistractionText = (text: string) => {
    handleUpdateNotebook('working', text);
  };

  const handleResetProgress = () => {
    setCompletedEncounters({});
  };

  const completedCount = Object.keys(completedEncounters).filter(
    (k) => completedEncounters[k]
  ).length;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C2A29] font-serif selection:bg-[#E8E2D5] selection:text-[#1A1817] flex flex-col relative">
      {/* Top Editorial Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        completedCount={completedCount}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomeView
            curriculum={CURRICULUM}
            activeModuleId={activeModuleId}
            setActiveModuleId={setActiveModuleId}
            onContinueSpiral={() => setCurrentView('module')}
            onOpenNotebookTab={(tab) => {
              setActiveNotebookTab(tab);
              setCurrentView('notebooks');
            }}
            completedEncounters={completedEncounters}
            longWorkTitle={longWorkTitle}
            protagonistName={protagonistName}
          />
        )}

        {currentView === 'module' && (
          <ModuleView
            curriculum={CURRICULUM}
            activeModuleId={activeModuleId}
            setActiveModuleId={setActiveModuleId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            longWorkTitle={longWorkTitle}
            protagonistName={protagonistName}
            completedEncounters={completedEncounters}
            toggleComplete={toggleComplete}
            notebooks={notebooks}
            onUpdateNotebook={handleUpdateNotebook}
            selfReviews={selfReviews}
            onUpdateSelfReview={handleUpdateSelfReview}
            onOpenDistractionFree={handleOpenDistractionFree}
          />
        )}

        {currentView === 'library' && (
          <LibraryView books={READING_LIBRARY} />
        )}

        {currentView === 'notebooks' && (
          <NotebooksView
            notebooks={notebooks}
            activeNotebookTab={activeNotebookTab}
            setActiveNotebookTab={setActiveNotebookTab}
            onUpdateNotebook={handleUpdateNotebook}
            onOpenDistractionFree={handleOpenDistractionFree}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        longWorkTitle={longWorkTitle}
        setLongWorkTitle={setLongWorkTitle}
        protagonistName={protagonistName}
        setProtagonistName={setProtagonistName}
        onResetProgress={handleResetProgress}
      />

      {/* Distraction-Free Full-Screen Sanctuary */}
      <DistractionFreeEditor
        isOpen={isDistractionFree}
        onClose={() => setIsDistractionFree(false)}
        initialText={distractionText}
        onSave={handleSaveDistractionText}
        title={distractionTitle}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-[#E6E1D6] py-6 px-8 text-center text-xs text-[#8C7A6B] font-serif bg-[#F7F4EE] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>The Creative Spiral • A 12-Week Immersive Apprenticeship in Writing</p>
        <p className="text-[11px] font-sans text-[#A69B8F]">
          Active: Week {activeModuleId} • {longWorkTitle}
        </p>
      </footer>
    </div>
  );
}
