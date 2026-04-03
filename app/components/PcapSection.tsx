import React, { useState } from 'react';
import { FileSearch, Upload } from 'lucide-react';

function PcapSection() {
    const [file, setFile] = useState<File | null>(null);
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyzePcap = async () => {
        if (!file) return;
        setIsLoading(true);
        setOutput('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:8000/pcap/analyze', {
                method: 'POST',
                body: formData
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
            <h2 className="text-3xl font-semibold text-blue-400 border-b border-gray-700 pb-2">Analyse Pcap</h2>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Cliquez pour upload</span> ou glissez-déposez</p>
                            <p className="text-xs text-gray-500">Fichiers .PCAP uniquement</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pcap,.cap" />
                    </label>
                </div>

                {file && (
                    <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                        <span className="text-gray-200 text-sm truncate">{file.name}</span>
                        <button
                            onClick={handleAnalyzePcap}
                            disabled={isLoading}
                            className={`px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Analyse...' : 'Analyser'}
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Rapport d'Analyse</label>
                <textarea
                    readOnly
                    value={output}
                    className="w-full h-96 p-4 bg-black text-green-400 font-mono text-sm rounded-md border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Les résultats de l'analyse Pcap apparaîtront ici..."
                ></textarea>
            </div>
        </div>
    );
}

export default PcapSection;
