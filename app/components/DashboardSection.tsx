import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react';

function DashboardSection() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:8000/dashboard/stats');
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 3000); // Refresh every 3s
        return () => clearInterval(interval);
    }, []);

    if (isLoading && !stats) return <div className="text-gray-400">Chargement du tableau de bord...</div>;

    if (!stats) return <div className="text-red-400">Erreur de chargement des statistiques.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-blue-400 border-b border-gray-700 pb-2">Tableau de Bord</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CPU Card */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Processeur (CPU)</h3>
                        <Cpu className="text-blue-500 h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.cpu}%</div>
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.cpu}%` }}></div>
                    </div>
                </div>

                {/* RAM Card */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Mémoire (RAM)</h3>
                        <Activity className="text-green-500 h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.ram.percent}%</div>
                    <div className="text-xs text-gray-500 mt-1">{stats.ram.used_gb} GB / {stats.ram.total_gb} GB</div>
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.ram.percent}%` }}></div>
                    </div>
                </div>

                {/* Disk Card */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Disque Principal</h3>
                        <HardDrive className="text-yellow-500 h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.disk}%</div>
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                        <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.disk}%` }}></div>
                    </div>
                </div>

                {/* Network Card */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Réseau (Total)</h3>
                        <Wifi className="text-purple-500 h-5 w-5" />
                    </div>
                    <div className="text-sm text-gray-300">
                        <div className="flex justify-between">
                            <span>Envoyé:</span>
                            <span className="font-bold text-white">{stats.network.sent_mb} MB</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Reçu:</span>
                            <span className="font-bold text-white">{stats.network.recv_mb} MB</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions or Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-medium text-gray-200 mb-4">Activité Récente</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Système démarré avec succès.</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Scan Nmap prêt à l'emploi.</span>
                        </li>
                         <li className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>Metasploit (Mock) initialisé.</span>
                        </li>
                    </ul>
                </div>

                 <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-medium text-gray-200 mb-4">Modules Disponibles</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-700 rounded text-center text-sm font-medium text-gray-300">Nmap Scanner</div>
                        <div className="p-3 bg-gray-700 rounded text-center text-sm font-medium text-gray-300">Metasploit Framework</div>
                        <div className="p-3 bg-gray-700 rounded text-center text-sm font-medium text-gray-300">OSINT Tools</div>
                        <div className="p-3 bg-gray-700 rounded text-center text-sm font-medium text-gray-300">Web Vulnerability Scanner</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardSection;
