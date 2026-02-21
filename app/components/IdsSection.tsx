import React, { useState, useEffect } from 'react';
import { Radar, Play, Square, AlertOctagon, Ban } from 'lucide-react';

function IdsSection() {
    const [isRunning, setIsRunning] = useState(false);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [blocklist, setBlocklist] = useState<string[]>([]);
    const [interfaceName, setInterfaceName] = useState('eth0');

    const fetchState = async () => {
        try {
            const alertsRes = await fetch('http://localhost:8000/ids/alerts');
            setAlerts(await alertsRes.json());
            const blockRes = await fetch('http://localhost:8000/ids/blocklist');
            setBlocklist(await blockRes.json());
        } catch (e) {
            console.error("IDS Fetch error:", e);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchState, 2000);
        return () => clearInterval(interval);
    }, []);

    const toggleIds = async () => {
        try {
            if (isRunning) {
                await fetch('http://localhost:8000/ids/stop', { method: 'POST' });
                setIsRunning(false);
            } else {
                await fetch(`http://localhost:8000/ids/start?interface=${interfaceName}`, { method: 'POST' });
                setIsRunning(true);
            }
        } catch (e) {
            alert("Erreur de communication avec l'IDS");
        }
    };

    const handleUnblock = async (ip: string) => {
        await fetch(`http://localhost:8000/ids/unblock?ip=${ip}`, { method: 'POST' });
        fetchState();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-green-400 border-b border-gray-700 pb-2">IDS / IPS Monitor</h2>

            <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <input
                    type="text"
                    value={interfaceName}
                    onChange={(e) => setInterfaceName(e.target.value)}
                    placeholder="Interface (ex: eth0)"
                    className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-40"
                />
                <button
                    onClick={toggleIds}
                    className={`flex items-center space-x-2 px-6 py-2 rounded font-bold text-white transition-colors ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isRunning ? 'Arrêter IDS' : 'Démarrer IDS'}</span>
                </button>
                <span className={`text-sm font-medium ${isRunning ? 'text-green-400 animate-pulse' : 'text-gray-500'}`}>
                    {isRunning ? "● Surveillance Active" : "○ Inactif"}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Alerts Panel */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden h-96 flex flex-col">
                    <div className="bg-gray-700/50 p-3 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="font-medium text-gray-200 flex items-center">
                            <AlertOctagon className="w-4 h-4 mr-2 text-yellow-500" /> Détections d'Intrusion
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        {alerts.length === 0 ? (
                            <div className="p-4 text-gray-500 text-center text-sm">Aucune menace détectée.</div>
                        ) : (
                            alerts.map((alert, idx) => (
                                <div key={idx} className="p-3 border-b border-gray-700 hover:bg-gray-700/50">
                                    <div className="flex justify-between">
                                        <span className={`text-sm font-bold ${alert.severity === 'High' ? 'text-red-500' : 'text-yellow-400'}`}>{alert.title}</span>
                                        <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-xs text-gray-300 mt-1">Source: {alert.source}</div>
                                    <div className="text-xs text-gray-400 font-mono mt-1">{alert.description}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Blocklist Panel (IPS) */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden h-96 flex flex-col">
                     <div className="bg-gray-700/50 p-3 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="font-medium text-gray-200 flex items-center">
                            <Ban className="w-4 h-4 mr-2 text-red-500" /> IPs Bloquées (IPS)
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        {blocklist.length === 0 ? (
                            <div className="p-4 text-gray-500 text-center text-sm">Aucune IP bloquée.</div>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead>
                                    <tr className="border-b border-gray-700 bg-gray-900">
                                        <th className="p-3">Adresse IP</th>
                                        <th className="p-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blocklist.map((ip, idx) => (
                                        <tr key={idx} className="border-b border-gray-700">
                                            <td className="p-3 font-mono text-red-400">{ip}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => handleUnblock(ip)}
                                                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors"
                                                >
                                                    Débloquer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IdsSection;
