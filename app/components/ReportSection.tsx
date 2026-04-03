import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';

function ReportSection() {
    const [reportType, setReportType] = useState('nmap');
    const [mockData, setMockData] = useState('{\n  "target": "192.168.1.1",\n  "scan_output": "Port 80/tcp open http\\nPort 443/tcp open ssl/https\\n..."\n}');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownloadReport = async () => {
        setIsLoading(true);
        try {
            const body = {
                report_type: reportType,
                data: JSON.parse(mockData)
            };

            const res = await fetch('http://localhost:8000/report/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cybertools_${reportType}_report.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert("Erreur lors de la génération du PDF");
            }
        } catch (e: any) {
            alert(`Erreur: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-200 border-b border-gray-700 pb-2">Génération de Rapports</h2>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type de Rapport</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                name="reportType"
                                value="nmap"
                                checked={reportType === 'nmap'}
                                onChange={(e) => setReportType(e.target.value)}
                            />
                            <span className="ml-2 text-gray-300">Scan Nmap</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-red-600 bg-gray-700 border-gray-600 focus:ring-red-500"
                                name="reportType"
                                value="metasploit"
                                checked={reportType === 'metasploit'}
                                onChange={(e) => setReportType(e.target.value)}
                            />
                            <span className="ml-2 text-gray-300">Audit Metasploit</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-green-600 bg-gray-700 border-gray-600 focus:ring-green-500"
                                name="reportType"
                                value="generic"
                                checked={reportType === 'generic'}
                                onChange={(e) => setReportType(e.target.value)}
                            />
                            <span className="ml-2 text-gray-300">Générique</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Données JSON (Simulation)</label>
                    <p className="text-xs text-gray-400 mb-2">Collez ici les données JSON brutes qui seront incluses dans le rapport.</p>
                    <textarea
                        rows={10}
                        value={mockData}
                        onChange={(e) => setMockData(e.target.value)}
                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md font-mono text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <button
                    onClick={handleDownloadReport}
                    disabled={isLoading}
                    className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-lg shadow-lg transition-colors flex items-center justify-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Download className="w-5 h-5" />
                    <span>{isLoading ? 'Génération...' : 'Télécharger le Rapport PDF'}</span>
                </button>
            </div>
        </div>
    );
}

export default ReportSection;
