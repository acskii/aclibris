// All things related to themes

// For ThemeContext
/* Type checking if a theme string value is valid */
export type ThemeType = 'default' | 'midnight' | 'espresso' | 'cyber' | 'nebula';

// For SettingsPage
/* Details to be viewed in the Settings page */
export const themes = [
    { id: 'default', name: 'Default', colors: 'from-cyan-500 via-sky-500 to-violet-500' },
    { id: 'midnight', name: 'Midnight', colors: 'from-slate-700 via-slate-800 to-slate-900' },
    { id: 'espresso', name: 'Espresso', colors: 'from-[#d6bc97] via-[#b89f81] to-[#a38d6d]' },
    { id: 'cyber', name: 'Cyber', colors: 'from-cyan-400 via-slate-600 to-slate-800' },
    { id: 'nebula', name: 'Nebula', colors: 'from-fuchsia-700 via-purple-800 to-indigo-950' },
];

/* Add styles and CSS in index.css as 'data-theme' */
/* For example:
 [data-theme='sepia'] {
  --card-bg: rgba(255, 255, 255, 0.1);
  --s1: #f59e0b;  
  --s2: #f97316;   
  --s3: #ef4444;
  --side-s3: #fca5a5;
 }
*/