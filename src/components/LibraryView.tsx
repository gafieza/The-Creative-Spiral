import React, { useState } from 'react';
import { Search, BookOpen, Bookmark, Filter } from 'lucide-react';
import { ReadingBook } from '../types';

interface LibraryViewProps {
  books: ReadingBook[];
}

export const LibraryView: React.FC<LibraryViewProps> = ({ books }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(books.map((b) => b.category)))];

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.focus.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="library-view-container" className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-[#E6E1D6] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-sans font-semibold">
          Persistent Library
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-light text-[#2C2A29]">
          The Apprenticeship Reading Library
        </h2>
        <p className="text-sm md:text-base text-[#736453] font-serif italic">
          Foundational craft texts and masterworks organized by technical, aesthetic, and emotional mastery.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-72 font-sans text-xs">
          <Search className="w-3.5 h-3.5 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search author, title, focus..."
            className="w-full bg-white border border-[#D9D1C5] pl-8 pr-3 py-2 rounded focus:outline-none focus:border-[#594A3C] text-[#2C2A29]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 font-sans text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`category-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded transition-colors text-[11px] ${
                selectedCategory === cat
                  ? 'bg-[#3A3229] text-[#FAF8F5] font-medium'
                  : 'bg-[#EFECE6] text-[#736453] hover:bg-[#E2DDD5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div id="library-books-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBooks.map((book, idx) => (
          <article
            key={idx}
            className="bg-white border border-[#E6E1D6] p-6 rounded-md space-y-4 shadow-2xs hover:border-[#8C7A6B] transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase tracking-widest font-sans font-semibold text-[#8C7A6B] bg-[#F7F4EE] px-2.5 py-1 rounded">
                {book.category}
              </span>
              <Bookmark className="w-4 h-4 text-[#C2B7A8]" />
            </div>

            <div>
              <h3 className="text-xl font-serif text-[#3A3229] font-medium">
                {book.title}
              </h3>
              <p className="text-xs font-sans text-[#736453] italic mt-0.5">
                by {book.author}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F2EFE9] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] font-sans font-semibold block">
                Craft Focus & Teaching
              </span>
              <p className="text-xs font-serif text-[#594A3C] leading-relaxed">
                {book.focus}
              </p>
            </div>
          </article>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 border border-dashed border-[#D9D1C5] rounded-md font-serif text-[#8C7A6B]">
          No books found matching your query.
        </div>
      )}
    </div>
  );
};
