// All things related to themes

// For ThemeContext
/* Type checking if a theme string value is valid */
export type ThemeType = 'default' | 'midnight' | 'garden' | 'sepia';

// For SettingsPage
/* Details to be viewed in the Settings page */
export const themes = [
    { id: 'default', name: 'Default', colors: 'from-cyan-500 via-sky-500 to-violet-500' },
    { id: 'garden', name: 'Garden', colors: 'from-emerald-500 via-teal-500 to-lime-500' },
    { id: 'sepia', name: 'Supernova', colors: 'from-amber-500 via-orange-500 to-red-500' },
    { id: 'midnight', name: 'Midnight', colors: 'from-blue-500 via-indigo-500 to-indigo-700' },
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