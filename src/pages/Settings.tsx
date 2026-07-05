import { useState, useEffect } from 'react';
import { Settings, Save, Book, Image, RotateCcw } from 'lucide-react';
import { Spinner } from '../components/common/spinner/Spinner';
import { ToggleSwitch } from '../components/common/toggle/ToggleSwitch';
import { TriangleAlert } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../themes';
import SocialLayout from '../layouts/SocialLayout';

interface SettingsState {
  can_save_recent: boolean;
  can_load_recent: boolean;
  thumbnail_on_upload: boolean;
  theme: string;
}

const defaultSettings: SettingsState = {
    can_save_recent: true,
    can_load_recent: true,
    thumbnail_on_upload: true,
    theme: 'default'
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');

      const [saveRecent, loadRecent, thumbnail, theme] = await Promise.all([
        // @ts-ignore
        window.db.settings.saveRecent(),
        // @ts-ignore
        window.db.settings.loadRecent(),
        // @ts-ignore
        window.db.settings.thumbnail(),
        // @ts-ignore
        window.db.settings.theme()
      ]);

      setSettings({
        can_save_recent: saveRecent,
        can_load_recent: loadRecent,
        thumbnail_on_upload: thumbnail,
        theme: theme
      });

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggle = async (key: keyof SettingsState, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Update each setting individually
      await Promise.all([
        // @ts-ignore
        window.db.settings.updateBoolean('can_save_recent', settings.can_save_recent),
        // @ts-ignore
        window.db.settings.updateBoolean('can_load_recent', settings.can_load_recent),
        // @ts-ignore
        window.db.settings.updateBoolean('thumbnail_on_upload', settings.thumbnail_on_upload)
      ]);

      setSuccess('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {    
    setSettings(defaultSettings);
    await handleSave();
  };

  return (
    <SocialLayout>
      {/* Loading State */}
      {loading && (
        <div className="flex bg-app-card backdrop-blur-md border border-white/20 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 my-10 shadow-xl">
          <Spinner />
          <p className="text-white font-bold text-center text-md">
            Loading settings...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error !== '' && (
        <div className="bg-gradient-to-l from-orange-500 to-yellow-400 mb-6 rounded-xl shadow-lg border border-white/20" role="alert">
          <div className="flex p-4 items-center">
            <div className="shrink-0 text-white">
              <TriangleAlert size={30} />
            </div>
            <div className="ms-3">
              <p className="text-md text-white font-bold">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success !== '' && (
        <div className="bg-gradient-to-l from-green-500 to-emerald-400 mb-6 rounded-xl shadow-lg border border-white/20" role="alert">
          <div className="flex p-4 items-center">
            <div className="shrink-0 text-white">
              <Save size={30} />
            </div>
            <div className="ms-3">
              <p className="text-md text-white font-bold">
                {success}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 flex flex-col items-start">
        <h1 className="mb-2 flex gap-3 justify-start drop-shadow-md">
          <Settings size={40} className="text-white" />
          <span className="text-4xl font-bold text-white">Settings</span>
        </h1>
        <p className="text-white/80 font-medium">
          Manage your preferences
        </p>
      </div>

      {/* Action Bar (Save/Reset) */}
      <div className="bg-app-card flex justify-between items-center backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white drop-shadow-sm">
          Save Settings?
        </h2>
        <div className="flex gap-3">
          <button
              className="flex flex-row items-center justify-center gap-2 bg-red-500/80 hover:bg-red-600 p-2 px-4 rounded-lg font-bold text-sm cursor-pointer transition-all duration-200 text-white border border-white/10 shadow-md"
              onClick={handleReset}
              disabled={saving}
          >
            <RotateCcw size={18} /> Reset to Default
          </button>
          <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500/80 cursor-pointer hover:bg-green-600 disabled:bg-green-800 text-white px-5 py-2 rounded-lg font-bold transition-all border border-white/10 shadow-md flex items-center gap-2"
          >
            {saving ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Theme Card */}
      <div className="bg-app-card backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6 drop-shadow-sm">
            Interface Theme
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`group relative overflow-hidden rounded-2xl border-4 transition-all duration-300 ${
                  theme === t.id ? 'border-white scale-105 shadow-2xl z-10' : 'border-white/5 opacity-70 hover:opacity-100 hover:scale-102'
                }`}
              >
                {/* Mini UI Layout Preview */}
                <div className={`h-32 w-full bg-gradient-to-br ${t.colors} flex`}>
                  {/* Fake Sidebar */}
                  <div className="w-1/4 h-full bg-white/10 backdrop-blur-sm border-r border-white/10" />
                  {/* Fake Content Area */}
                  <div className="flex-1 p-3 flex flex-col gap-2">
                    <div className="h-2 w-1/2 bg-white/40 rounded" />
                    <div className="flex gap-2">
                        <div className="h-10 w-8 bg-white/20 rounded shadow-sm border border-white/10" />
                        <div className="h-10 w-8 bg-white/20 rounded shadow-sm border border-white/10" />
                    </div>
                  </div>
                </div>
                
                {/* Label with Icon */}
                <div className={`absolute bottom-0 w-full backdrop-blur-md py-2 flex items-center justify-center gap-2 font-bold text-white text-[10px] tracking-widest ${theme === t.id ? 'bg-white/30' : 'bg-black/40'}`}>
                  {t.name.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </div>

      {/* Application Settings List Card */}
      <div className="bg-app-card backdrop-blur-md rounded-xl border border-white/20 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-8 drop-shadow-sm">
          Application Preferences
        </h2>

        <div className="space-y-4">
          {/* Save Recent Setting */}
          <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-5">
              <div className="bg-gradient-to-br from-stop-1 to-stop-2 p-3 rounded-xl shadow-lg border border-white/20">
                <Save className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Save Last Viewed Pages</h3>
                <p className="text-app-secondary/60 text-sm">
                  Save the last page visited in every book viewed.
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.can_save_recent}
              onChange={(enabled) => handleToggle('can_save_recent', enabled)}
            />
          </div>

          {/* Load Recent Setting */}
          <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-5">
              <div className="bg-gradient-to-br from-stop-2 to-stop-3 p-3 rounded-xl shadow-lg border border-white/20">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Load Recent Book</h3>
                <p className="text-app-secondary/60 text-sm">
                  Show last viewed book in home page.
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.can_load_recent}
              onChange={(enabled) => handleToggle('can_load_recent', enabled)}
            />
          </div>

          {/* Thumbnail Setting */}
          <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-5">
              <div className="bg-gradient-to-br from-side-3 to-stop-3 p-3 rounded-xl shadow-lg border border-white/20">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Generate Thumbnails</h3>
                <p className="text-app-secondary/60 text-sm">
                  Automatically create thumbnails when uploading new books.
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.thumbnail_on_upload}
              onChange={(enabled) => handleToggle('thumbnail_on_upload', enabled)}
            />
          </div>
        </div>
      </div>
    </SocialLayout>
  );
}