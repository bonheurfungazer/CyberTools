import React, { useState } from 'react';
import { BrainCircuit, Cpu } from 'lucide-react';

function AiSection() {
    const [logParams, setLogParams] = useState({
        request_length: 120,
        response_code: 200,
        duration_ms: 50,
        is_admin_page: 0
    });
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/ai/analyze-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logParams)
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            console.error("AI Analysis error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTrain = async () => {
        try {
            const res = await fetch('http://localhost:8000/ai/train', { method: 'POST' });
            if (res.ok) alert("Modèle réentraîné avec succès !");
        } catch (e) {
            alert("Erreur entraînement");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-purple-400 border-b border-gray-700 pb-2">Threat Intelligence (AI)</h2>
            <div className="flex justify-between">
                <p className="text-gray-400 text-sm">Ce module utilise IsolationForest (Machine Learning) pour détecter les anomalies dans les logs web simulés.</p>
                <button onClick={handleTrain} className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded text-xs">
                    Réentraîner Modèle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md space-y-4">
                    <h3 className="text-lg font-medium text-purple-200 flex items-center">
                        <Cpu className="w-5 h-5 mr-2" /> Paramètres du Log (Simulation)
                    </h3>

                    <div>
                        <label className="text-sm text-gray-400">Taille Requête (Bytes)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                            value={logParams.request_length}
                            onChange={(e) => setLogParams({...logParams, request_length: parseInt(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Code Réponse HTTP</label>
                        <select
                            className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                            value={logParams.response_code}
                            onChange={(e) => setLogParams({...logParams, response_code: parseInt(e.target.value)})}
                        >
                            <option value="200">200 OK</option>
                            <option value="301">301 Redirect</option>
                            <option value="403">403 Forbidden</option>
                            <option value="404">404 Not Found</option>
                            <option value="500">500 Server Error</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Durée (ms)</label>
                        <input
                            type="range"
                            min="10"
                            max="5000"
                            className="w-full mt-1"
                            value={logParams.duration_ms}
                            onChange={(e) => setLogParams({...logParams, duration_ms: parseInt(e.target.value)})}
                        />
                        <span className="text-xs text-right block text-gray-500">{logParams.duration_ms} ms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={logParams.is_admin_page === 1}
                            onChange={(e) => setLogParams({...logParams, is_admin_page: e.target.checked ? 1 : 0})}
                            className="w-4 h-4 bg-gray-700"
                        />
                        <label className="text-sm text-gray-400">Cible Page Admin (/admin)</label>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold"
                    >
                        {isLoading ? "Analyse..." : "Analyser avec l'IA"}
                    </button>
                </div>

                {/* Result Panel */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md flex flex-col justify-center items-center">
                    {!result ? (
                        <div className="text-gray-500 text-center">
                            <BrainCircuit className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>Lancez une analyse pour voir le score d'anomalie.</p>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <h3 className="text-xl font-medium text-gray-200">Résultat de l'Analyse</h3>

                            <div className={`text-4xl font-bold ${result.is_anomaly ? 'text-red-500' : 'text-green-500'}`}>
                                {result.prediction.toUpperCase()}
                            </div>

                            <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden relative">
                                {/* Visual bar representing score. Normal scores usually > 0, Anomalies < 0 */}
                                {/* Normalize -0.5 to 0.5 range roughly to 0-100% for bar */}
                                <div
                                    className={`h-full transition-all duration-500 ${result.is_anomaly ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min(100, Math.max(0, (result.anomaly_score + 0.3) * 100))}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-400">Score d'Anomalie : {result.anomaly_score.toFixed(4)}</p>

                            {result.is_anomaly && (
                                <div className="bg-red-900/20 border border-red-800 p-3 rounded text-red-300 text-sm">
                                    ⚠️ Comportement suspect détecté par le modèle.
                                    <br/>Cette requête dévie significativement du trafic normal.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AiSection;
