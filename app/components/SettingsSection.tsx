import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

function SettingsSection() {
    const [settings, setSettings] = useState({
        theme: 'dark',
        defaultScanType: 'tcp_syn',
        autoSave: true,
        notifications: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/settings/')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setSettings(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            const res = await fetch('http://localhost:8000/settings/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setMessage('Paramètres sauvegardés !');
                // Optional: trigger a re-fetch or update global state
            } else {
                setMessage('Erreur lors de la sauvegarde.');
            }
        } catch (e) {
            setMessage('Erreur réseau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-400 border-b border-gray-700 pb-2">Paramètres</h2>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Thème de l'interface</label>
                        <select
                            name="theme"
                            value={settings.theme}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="dark">Sombre (Défaut)</option>
                            <option value="light">Clair</option>
                            <option value="hacker">Matrix Green</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Scan Nmap par défaut</label>
                        <select
                            name="defaultScanType"
                            value={settings.defaultScanType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="tcp_syn">Scan SYN (-sS)</option>
                            <option value="tcp_connect">Scan Connect (-sT)</option>
                            <option value="udp">Scan UDP (-sU)</option>
                            <option value="version">Détection Version (-sV)</option>
                            <option value="aggressive">Scan Agressif (-A)</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="autoSave"
                            name="autoSave"
                            checked={settings.autoSave}
                            onChange={handleChange}
                            className="h-5 w-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        />
                        <label htmlFor="autoSave" className="text-sm font-medium text-gray-300">Sauvegarde automatique des résultats</label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="notifications"
                            name="notifications"
                            checked={settings.notifications}
                            onChange={handleChange}
                            className="h-5 w-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        />
                        <label htmlFor="notifications" className="text-sm font-medium text-gray-300">Activer les notifications sonores</label>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-700 flex items-center justify-between">
                    <span className={`text-sm ${message.includes('Erreur') ? 'text-red-400' : 'text-green-400'}`}>{message}</span>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center space-x-2 transition-colors"
                    >
                        {isLoading ? <span className="animate-spin">⌛</span> : <Save className="h-5 w-5" />}
                        <span>Sauvegarder les préférences</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsSection;
