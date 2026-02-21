import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';

function SiemSection() {
    const [logs, setLogs] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [status, setStatus] = useState<any>(null);

    const fetchData = async () => {
        try {
            const logsRes = await fetch('http://localhost:8000/siem/logs');
            const logsData = await logsRes.json();
            setLogs(logsData.slice(0, 20)); // Show last 20 logs

            const alertsRes = await fetch('http://localhost:8000/siem/alerts');
            const alertsData = await alertsRes.json();
            setAlerts(alertsData);

            const statusRes = await fetch('http://localhost:8000/siem/status');
            const statusData = await statusRes.json();
            setStatus(statusData);
        } catch (e) {
            console.error("SIEM fetch error:", e);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const simulateAttack = async () => {
        // Feed a fake brute force log
        const log = `192.168.1.66 - - [${new Date().toISOString()}] "POST /login HTTP/1.1" 401 500`;
        await fetch(`http://localhost:8000/siem/feed?log_line=${encodeURIComponent(log)}`, { method: 'POST' });
        fetchData();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <h2 className="text-3xl font-semibold text-blue-400">SIEM Dashboard</h2>
                <div className="flex space-x-4">
                     <div className="flex items-center space-x-2 text-gray-300">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Status: {status?.status || "Connecting..."}</span>
                    </div>
                    <button
                        onClick={simulateAttack}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                    >
                        Simuler Attaque
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alerts Panel */}
                <div className="lg:col-span-1 bg-gray-800 rounded-lg border border-red-900 overflow-hidden">
                    <div className="bg-red-900/30 p-3 border-b border-red-900 flex justify-between items-center">
                        <h3 className="font-medium text-red-200 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" /> Alertes de Sécurité
                        </h3>
                        <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{alerts.length}</span>
                    </div>
                    <div className="p-0 h-96 overflow-y-auto">
                        {alerts.length === 0 ? (
                            <div className="p-4 text-gray-500 text-sm text-center">Aucune alerte récente.</div>
                        ) : (
                            alerts.map((alert, idx) => (
                                <div key={idx} className="p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-red-400 text-sm">{alert.title}</span>
                                        <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-xs text-gray-300 mt-1">Source: {alert.source}</div>
                                    <div className="text-xs text-gray-400 mt-1">{alert.description}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Logs Stream */}
                <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="bg-gray-700/50 p-3 border-b border-gray-700">
                        <h3 className="font-medium text-gray-200 flex items-center">
                            <Shield className="w-4 h-4 mr-2" /> Flux de Logs (Temps Réel)
                        </h3>
                    </div>
                    <div className="p-0 h-96 overflow-y-auto bg-black font-mono text-xs">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900 text-gray-400 sticky top-0">
                                <tr>
                                    <th className="p-2 w-24">Heure</th>
                                    <th className="p-2 w-24">Type</th>
                                    <th className="p-2 w-32">Source IP</th>
                                    <th className="p-2">Événement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, idx) => (
                                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900/50 text-gray-300">
                                        <td className="p-2 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                        <td className="p-2 text-blue-400">{log.type}</td>
                                        <td className="p-2 text-yellow-400">{log.ip}</td>
                                        <td className="p-2 truncate max-w-xs" title={log.raw}>{log.event}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiemSection;
