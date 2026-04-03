import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Cpu } from 'lucide-react';

function PasswordCrackSection() {
    const [activeTool, setActiveTool] = useState('strength');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRunCrack = async () => {
        if (!input) return;
        setIsLoading(true);
        setOutput('');

        let endpoint = '';
        let body = {};
        if (activeTool === 'strength') {
            endpoint = '/crack/strength';
            body = { password: input };
        } else if (activeTool === 'brute') {
            endpoint = '/crack/brute';
            body = { hash: input, wordlist: 'rockyou.txt' };
        }

        try {
            const res = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
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
            <h2 className="text-3xl font-semibold text-red-500 border-b border-gray-700 pb-2">Cassage de Mot de Passe</h2>

            {/* Tool Selection */}
            <div className="flex space-x-2 border-b border-gray-700 pb-4 overflow-x-auto">
                <button
                    onClick={() => setActiveTool('strength')}
                    className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors ${activeTool === 'strength' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Testeur de Force</span>
                </button>
                <button
                    onClick={() => setActiveTool('brute')}
                    className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors ${activeTool === 'brute' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                    <Cpu className="w-4 h-4" />
                    <span>Simulateur Brute Force</span>
                </button>
            </div>

            {/* Input Area */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        {activeTool === 'strength' ? 'Mot de passe à tester' : 'Hash MD5/SHA1 à casser'}
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type={activeTool === 'strength' ? "password" : "text"}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={activeTool === 'strength' ? "Votre mot de passe..." : "ex: 5f4dcc3b5aa765d61d8327deb882cf99"}
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-500"
                        />
                        <button
                            onClick={handleRunCrack}
                            disabled={isLoading || !input}
                            className={`px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Traitement...' : 'Lancer'}
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
                    className="w-full h-96 p-4 bg-black text-green-400 font-mono text-sm rounded-md border border-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Les résultats s'afficheront ici..."
                ></textarea>
            </div>
        </div>
    );
}

export default PasswordCrackSection;
