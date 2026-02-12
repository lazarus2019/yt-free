import { useState, useCallback, useRef, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useDebounce, useClickOutside } from '@/hooks';
import { useSearchSuggestions } from '../hooks/useSearch';
import { cn } from '@/utils';

export function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const { data: suggestions = [] } = useSearchSuggestions(debouncedQuery);
  
  const containerRef = useClickOutside<HTMLDivElement>(() => {
    setShowSuggestions(false);
  });

  // Update query when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery !== null && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    },
    [query, navigate]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
      setShowSuggestions(false);
    },
    [navigate]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-zinc-400">
            <Search size={20} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search songs, videos, artists..."
            className={cn(
              'w-full bg-zinc-800/80 border border-zinc-700 rounded-full',
              'pl-12 pr-12 py-3 text-white placeholder-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
              'transition-all duration-200'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              <Search size={16} className="text-zinc-500 flex-shrink-0" />
              <span className="truncate">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
