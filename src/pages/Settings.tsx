import { useState, useEffect } from 'react';
import { Settings, Save, Book, Image, RotateCcw } from 'lucide-react';
import { Spinner } from '../components/common/spinner/Spinner';
import { ToggleSwitch } from '../components/common/toggle/ToggleSwitch';
import { TriangleAlert } from 'lucide-react';

interface SettingsState {
  can_save_recent: boolean;
  can_load_recent: boolean;
  thumbnail_on_upload: boolean;
}

const defaultSettings: SettingsState = {
    can_save_recent: true,
    can_load_recent: true,
    thumbnail_on_upload: true
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');

      const [saveRecent, loadRecent, thumbnail] = await Promise.all([
        // @ts-ignore
        window.db.settings.saveRecent(),
        // @ts-ignore
        window.db.settings.loadRecent(),
        // @ts-ignore
        window.db.settings.thumbnail()
      ]);

      setSettings({
        can_save_recent: saveRecent,
        can_load_recent: loadRecent,
        thumbnail_on_upload: thumbnail
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
    <div className="min-h-screen flex flex-col p-5">
      {/* Loading State */}
      {loading && (
        <div className="flex bg-indigo-400 p-3 rounded-lg flex-row items-center justify-center gap-2 z-30 my-10">
          <Spinner />
          <p className="text-violet-900 font-bold text-center text-md">
            Loading settings...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error !== '' && (
        <div className="bg-gradient-to-l from-orange-400 to-yellow-300 mb-6 rounded-xl" role="alert">
          <div className="flex p-4 items-center">
            <div className="shrink-0 text-red-500">
              <TriangleAlert size={30} />
            </div>
            <div className="ms-3">
              <p className="text-md text-red-400 font-bold">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success !== '' && (
        <div className="bg-gradient-to-l from-green-400 to-emerald-300 mb-6 rounded-xl" role="alert">
          <div className="flex p-4 items-center">
            <div className="shrink-0 text-green-600">
              <Save size={30} />
            </div>
            <div className="ms-3">
              <p className="text-md text-green-700 font-bold">
                {success}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 flex flex-col items-start">
        <h1 className="mb-2 flex gap-3 justify-start">
          <Settings size={40} />
          <span className="text-4xl font-bold text-white">Settings</span>
        </h1>
        <p>
          Manage your preferences
        </p>
      </div>

      {/* Settings Card */}
      <div className="min-w-full bg-gray-800/30 backdrop-blur-sm rounded-md border border-indigo-500/20 p-6 max-w-2xl">
        {/* Settings Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            Application Settings
          </h2>
          <div className="flex gap-2">
            <button
                className="flex flex-row items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-2 rounded-md font-bold text-sm cursor-pointer transition-colors duration-200"
                onClick={handleReset}
                disabled={saving}
            >
                <RotateCcw size={18} /> Reset to Default
            </button>
            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-1 rounded-md transition-colors flex items-center gap-2"
            >
                {saving ? (
                <>
                    <Spinner />
                    Saving...
                </>
                ) : (
                <>
                    <Save size={18} />
                    Save
                </>
                )}
            </button>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-6">
          {/* Save Recent Setting */}
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-md border border-gray-600/30">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-md">
                <Save className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Save Last Viewed Pages</h3>
                <p className="text-gray-400 text-sm">
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
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-md border border-gray-600/30">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-md">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Load Recent Book</h3>
                <p className="text-gray-400 text-sm">
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
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-md border border-gray-600/30">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-md">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Generate Thumbnails</h3>
                <p className="text-gray-400 text-sm">
                  Automatically create thumbnails when uploading new books
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
    </div>
  );
}