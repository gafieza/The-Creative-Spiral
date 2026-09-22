import React from 'react';
import { Compass, Sliders } from 'lucide-react';
import { MainView } from '../types';

interface HeaderProps {
  currentView: MainView;
  setCurrentView: (view: MainView) => void;
  onOpenSettings: () => void;
  completedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenSettings,
  completedCount,
}) => {
  return (
    <header
      id="app-header"
      className="border-b border-[#E6E1D6] bg-[#F7F4EE]/90 backdrop-blur-sm sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
    >
      <div
        id="header-brand-button"
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => setCurrentView('home')}
        role="button"
        tabIndex={0}
        aria-label="Return to Home"
      >
        <div className="w-8 h-8 rounded-full border border-[#8C7A6B] flex items-center justify-center text-[#594A3C] group-hover:bg-[#EFECE6] transition-colors">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-xs font-sans tracking-widest uppercase text-[#594A3C] font-semibold">
            The Creative Spiral
          </h1>
          <p className="text-[11px] text-[#8C7A6B] italic font-serif">
            A 12-Week Immersive Apprenticeship in Writing
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-xs font-sans">
        <button
          id="nav-btn-home"
          onClick={() => setCurrentView('home')}
          className={`py-1 hover:text-[#2C2A29] transition-colors ${
            currentView === 'home'
              ? 'text-[#2C2A29] font-medium border-b-2 border-[#594A3C]'
              : 'text-[#8C7A6B]'
          }`}
        >
          Home
        </button>

        <button
          id="nav-btn-library"
          onClick={() => setCurrentView('library')}
          className={`py-1 hover:text-[#2C2A29] transition-colors ${
            currentView === 'library'
              ? 'text-[#2C2A29] font-medium border-b-2 border-[#594A3C]'
              : 'text-[#8C7A6B]'
          }`}
        >
          Reading Library
        </button>

        <button
          id="nav-btn-notebooks"
          onClick={() => setCurrentView('notebooks')}
          className={`py-1 hover:text-[#2C2A29] transition-colors ${
            currentView === 'notebooks'
              ? 'text-[#2C2A29] font-medium border-b-2 border-[#594A3C]'
              : 'text-[#8C7A6B]'
          }`}
        >
          Writer's Notebooks
        </button>

        <div className="hidden sm:flex items-center text-[11px] text-[#8C7A6B] border-l border-[#E6E1D6] pl-4">
          <span className="font-serif italic mr-1.5">Encounters:</span>
          <span className="font-medium text-[#594A3C]">{completedCount} completed</span>
        </div>

        <button
          id="nav-btn-settings"
          onClick={onOpenSettings}
          className="text-[#8C7A6B] hover:text-[#2C2A29] transition-colors p-1.5 rounded hover:bg-[#EFECE6]"
          title="Creative Constellation Settings"
          aria-label="Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
