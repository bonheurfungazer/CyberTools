import React, { useState } from 'react';
import { Search, Globe, MapPin, Database } from 'lucide-react';

function OsintSection() {
    const [activeTool, setActiveTool] = useState('whois');
    const [target, setTarget] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRunOsint = async () => {
        if (!target) return;
        setIsLoading(true);
        setOutput('');

        let endpoint = '';
        if (activeTool === 'whois') endpoint = '/osint/whois';
        else if (activeTool === 'dns') endpoint = '/osint/dns';
        else if (activeTool === 'ipgeo') endpoint = '/osint/ipgeo';

        try {
            const res = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target })
            });
            const data = await res.json();

            if (data.detail) {
                setOutput(`Erreur: ${data.detail}`);
            } else {
                setOutput(JSON.stringify(data.result, null, 2));
            }
        } catch (e: any) {
            setOutput(`Erreur réseau: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-purple-400 border-b border-gray-700 pb-2">OSINT / Reconnaissance</h2>

            {/* Tool Selection */}
            <div className="flex space-x-2 border-b border-gray-700 pb-4 overflow-x-auto">
                <button
                    onClick={() => setActiveTool('whois')}
                    className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors ${activeTool === 'whois' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                    <Search className="w-4 h-4" />
                    <span>Whois Lookup</span>
                </button>
                <button
                    onClick={() => setActiveTool('dns')}
                    className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors ${activeTool === 'dns' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                    <Database className="w-4 h-4" />
                    <span>DNS Records</span>
                </button>
                <button
                    onClick={() => setActiveTool('ipgeo')}
                    className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors ${activeTool === 'ipgeo' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                    <MapPin className="w-4 h-4" />
                    <span>IP Geolocation</span>
                </button>
            </div>

            {/* Input Area */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        {activeTool === 'ipgeo' ? 'Adresse IP Cible' : 'Nom de Domaine Cible'}
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder={activeTool === 'ipgeo' ? "ex: 8.8.8.8" : "ex: google.com"}
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                        />
                        <button
                            onClick={handleRunOsint}
                            disabled={isLoading || !target}
                            className={`px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Scan...' : 'Lancer'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Output Area */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Résultats</label>
                <textarea
                    readOnly
                    value={output}
                    className="w-full h-96 p-4 bg-black text-green-400 font-mono text-sm rounded-md border border-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Les résultats s'afficheront ici..."
                ></textarea>
            </div>
        </div>
    );
}

export default OsintSection;
