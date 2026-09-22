import React from 'react';
import { X, Sparkles, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  longWorkTitle: string;
  setLongWorkTitle: (val: string) => void;
  protagonistName: string;
  setProtagonistName: (val: string) => void;
  onResetProgress?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  longWorkTitle,
  setLongWorkTitle,
  protagonistName,
  setProtagonistName,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="settings-modal-card"
        className="bg-[#FAF8F5] border border-[#D9D1C5] p-6 md:p-8 max-w-md w-full rounded-md shadow-2xl font-sans space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-[#E6E1D6] pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#8C7A6B]" />
            <h3 className="text-lg font-serif font-medium text-[#3A3229]">
              Creative Constellation
            </h3>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="text-[#8C7A6B] hover:text-[#2C2A29] p-1 rounded hover:bg-[#EFECE6] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-longwork-title"
              className="block text-xs uppercase tracking-wider text-[#8C7A6B] font-semibold mb-1"
            >
              Long Work Project Title
            </label>
            <input
              id="settings-longwork-title"
              type="text"
              value={longWorkTitle}
              onChange={(e) => setLongWorkTitle(e.target.value)}
              className="w-full bg-white border border-[#D9D1C5] px-3 py-2 text-sm font-serif text-[#2C2A29] rounded focus:outline-none focus:border-[#594A3C]"
              placeholder="e.g. Call of the Tides"
            />
            <p className="text-[11px] text-[#A69B8F] mt-1 font-serif">
              The title of your current sustained novel, collection, or long-form prose.
            </p>
          </div>

          <div>
            <label
              htmlFor="settings-protagonist-name"
              className="block text-xs uppercase tracking-wider text-[#8C7A6B] font-semibold mb-1"
            >
              Protagonist / Focal Figure
            </label>
            <input
              id="settings-protagonist-name"
              type="text"
              value={protagonistName}
              onChange={(e) => setProtagonistName(e.target.value)}
              className="w-full bg-white border border-[#D9D1C5] px-3 py-2 text-sm font-serif text-[#2C2A29] rounded focus:outline-none focus:border-[#594A3C]"
              placeholder="e.g. Samaara"
            />
            <p className="text-[11px] text-[#A69B8F] mt-1 font-serif">
              The primary conscious lens through which your narrative friction unfolds.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E6E1D6] flex items-center justify-between">
          {onResetProgress ? (
            <button
              id="reset-progress-btn"
              type="button"
              onClick={() => {
                if (window.confirm('Clear all completed encounter checkmarks? Notebooks will be kept.')) {
                  onResetProgress();
                }
              }}
              className="text-[11px] text-[#8C7A6B] hover:text-[#B33A3A] flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset checkmarks</span>
            </button>
          ) : <div />}

          <button
            id="save-constellation-btn"
            onClick={onClose}
            className="bg-[#3A3229] text-[#FAF8F5] px-5 py-2 text-xs uppercase tracking-widest rounded hover:bg-[#2C2A29] transition-colors"
          >
            Save Constellation
          </button>
        </div>
      </div>
    </div>
  );
};
