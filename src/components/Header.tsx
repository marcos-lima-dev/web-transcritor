"use client";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isSavedDark = localStorage.getItem('theme') === 'dark';
    if (isSavedDark || (!('theme' in localStorage) && isSystemDark)) {
      setIsDark(true); document.documentElement.classList.add('dark');
    } else {
      setIsDark(false); document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); setIsDark(false);
    } else {
      document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); setIsDark(true);
    }
  };

  return (
    // TOKEN: bg-surface-card/90 e border-border-subtle
    <header className="sticky top-0 z-20 flex items-center bg-surface-card/90 backdrop-blur-md px-5 py-4 border-b border-border-subtle transition-colors duration-300">
      <h2 className="text-txt-primary text-xl font-bold leading-tight tracking-tight flex-1">
        Audio Scribe
      </h2>
      <button 
        onClick={toggleTheme}
        className="flex items-center justify-center rounded-full p-2.5 text-txt-secondary hover:bg-surface-highlight transition-all active:scale-95"
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-500 fill-amber-500" /> : <Moon className="w-5 h-5 text-txt-secondary fill-current" />}
      </button>
    </header>
  );
}