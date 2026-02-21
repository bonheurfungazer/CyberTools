import React, { useState } from 'react';
import { Globe, Bug, ShieldCheck } from 'lucide-react';

function WebScanSection() {
    const [activeTool, setActiveTool] = useState('headers');
    const [target, setTarget] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRunWebScan = async () => {
        if (!target) return;
        setIsLoading(true);
        setOutput('');

        let endpoint = '';
        if (activeTool === 'headers') endpoint = '/webscan/headers';
        else if (activeTool === 'vuln') endpoint = '/webscan/vuln';

        try {
            const res = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: target })
            });
            const data = await res.json();

            if (data.detail) {
                setOutput(`Erreur: ${data.detail}`);
            } else {
                setOutput(JSON.stringify(data, null, 2));
            }
        } catch (e: any) {
            setOutput(`Erreur réseau: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-orange-400 border-b border-gray-700 pb-2">Web Scanner</h2>

            {/* Tool Selection */}
            <div className="flex space-x-2 border-b border-gray-700 pb-4 overflow-x-auto">
                <button
                    onClick={() => setActiveTool('headers')}
                    className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors ${activeTool === 'headers' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    <span>HTTP Headers Scan</span>
                </button>
                <button
                    onClick={() => setActiveTool('vuln')}
                    className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors ${activeTool === 'vuln' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                    <Bug className="w-4 h-4" />
                    <span>Mock Vuln Scan</span>
                </button>
            </div>

            {/* Input Area */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        URL Cible
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="ex: https://example.com"
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                        />
                        <button
                            onClick={handleRunWebScan}
                            disabled={isLoading || !target}
                            className={`px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    className="w-full h-96 p-4 bg-black text-green-400 font-mono text-sm rounded-md border border-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Les résultats s'afficheront ici..."
                ></textarea>
            </div>
        </div>
    );
}

export default WebScanSection;
