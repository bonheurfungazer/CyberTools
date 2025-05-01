import React, { useState, useRef, useEffect } from 'react';
import { ScanLine, ChevronDown, ChevronUp } from 'lucide-react';

// --- Section Nmap ---
function NmapSection() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('tcp_syn');
  const [customCommand, setCustomCommand] = useState(''); // Nouvel état pour la commande personnalisée
  const [useCustomCommand, setUseCustomCommand] = useState(false);
  // Nouvel état pour basculer
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Simule l'exécution d'un scan
  const handleScan = () => {
    if (!target && !useCustomCommand) { // Cible requise sauf si commande personnalisée utilisée
      setOutput('Erreur: Veuillez entrer une cible (IP ou domaine).');
      return;
    }
     if (useCustomCommand && !customCommand) { // Commande personnalisée requise si l'option est activée
        setOutput('Erreur: Veuillez entrer une commande Nmap personnalisée.');
        return;
     }

    setIsLoading(true);
    setOutput(''); // Effacer la sortie précédente

    const commandToSimulate = useCustomCommand
      ? `nmap ${customCommand} ${target || ''}`.trim() // Utilise la commande personnalisée + cible (si présente)
      : `nmap ${nmapScanTypes.find(s => s.id === scanType)?.command || ''} ${target}`; // Utilise le type de scan prédéfini

    setOutput(`Simulation de l'exécution de la commande : ${commandToSimulate}\n`);
    setOutput(prev => prev + `Starting Nmap 7.9X ( https://nmap.org ) at ${new Date().toISOString()}\n`);

    // *** ATTENTION: Ceci est une simulation. Pas d'appel réseau réel. ***
    setTimeout(() => {
      // Générer une sortie Nmap factice
      const fakeOutput = `
Nmap scan report for ${target || 'simulated.target.com'} (${target.match(/^[0-9.]+$/) ? target : 'XXX.XXX.XXX.XXX'})
Host is up (0.0XX s latency).
Not shown: 99X closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh     (Simulation)
80/tcp  open  http    (Simulation)
443/tcp open  https   (Simulation)
${Math.random() > 0.5 ? '135/tcp open  msrpc   (Simulation)\n' : ''}${Math.random() > 0.7 ? '445/tcp open  microsoft-ds (Simulation)\n' : ''}

Nmap done: 1 IP address (1 host up) scanned in ${ (Math.random() * 5 + 1).toFixed(2)} seconds
      `;
      setOutput(prev => prev + fakeOutput);
      setIsLoading(false);
    }, 2000); // Simule un délai
  };

  // Liste (non exhaustive) de types de scans Nmap pour l'UI avec descriptions et commandes simulées
  const nmapScanTypes = [
    { id: 'tcp_syn', name: 'Scan SYN (-sS)', description: 'Discret, rapide, scan par défaut (root)', command: '-sS' },
    { id: 'tcp_connect', name: 'Scan Connect (-sT)', description: 'Plus bruyant, utilise l\'appel système connect()', command: '-sT' },
    { id: 'udp', name: 'Scan UDP (-sU)', description: 'Scan des ports UDP ouverts', command: '-sU' },
    { id: 'fin', name: 'Scan FIN (-sF)', description: 'Discret, peut passer certains firewalls', command: '-sF' },
    { id: 'xmas', name: 'Scan Xmas (-sX)', description: 'Active les flags FIN, PSH, URG', command: '-sX' },
    { id: 'null', name: 'Scan Null (-sN)', description: 'Aucun flag activé', command: '-sN' },
    { id: 'ack', name: 'Scan ACK (-sA)', description: 'Détermine si les ports sont filtrés', command: '-sA' },
    { id: 'version', name: 'Détection Version (-sV)', description: 'Tente de déterminer le service et sa version', command: '-sV' },
    { id: 'os', name: 'Détection OS (-O)', description: 'Tente de déterminer le système d\'exploitation', command: '-O' },
    { id: 'aggressive', name: 'Scan Agressif (-A)', description: 'Active détection OS, version, script scan, et traceroute', command: '-A' },
    { id: 'ping', name: 'Ping Scan (-sn)', description: 'Découverte d\'hôtes sans scan de ports', command: '-sn' },
    { id: 'list', name: 'List Scan (-sL)', description: 'Liste les cibles sans les scanner', command: '-sL' },
    { id: 'rpc', name: 'RPC Scan (-sR)', description: 'Trouve les programmes RPC', command: '-sR' },
    { id: 'script_default', name: 'Scripts par défaut (--script default)', description: 'Exécute les scripts sûrs par défaut', command: '--script default' },
    { id: 'script_vuln', name: 'Scripts Vulnérabilités (--script vuln)', description: 'Vérifie les vulnérabilités connues', command: '--script vuln' },
    { id: 'fast', name: 'Scan Rapide (-F)', description: 'Scan moins de ports que le scan par défaut', command: '-F' },
    { id: 'top_ports', name: 'Top Ports (--top-ports <num>)', description: 'Scan les N ports les plus communs', command: '--top-ports 1000' }, // Simulation, pourrait nécessiter un input
    { id: 'port_range', name: 'Plage de Ports (-p <range>)', description: 'Scan une plage spécifique (ex: 1-100)', command: '-p 1-1024' }, // Simulation, pourrait nécessiter un input
    // ... continuer à ajouter pour atteindre 50+
  ];


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-blue-400 border-b border-gray-700 pb-2">Scan Nmap</h2>

      {/* Option de commande personnalisée */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="useCustomCommand"
          checked={useCustomCommand}
          onChange={(e) => setUseCustomCommand(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="useCustomCommand" className="text-sm font-medium text-gray-300">
          Utiliser une commande Nmap personnalisée (pour experts)
        </label>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Cible */}
        <div className={`${useCustomCommand ? 'md:col-span-3' : 'md:col-span-2'}`}> {/* Occupe plus de colonnes si commande personnalisée */}
          <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-1">
            Cible (IP ou Domaine) {useCustomCommand && '(Optionnel si inclus dans la commande personnalisée)'}
          </label>
          <input
            type="text"
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="ex: 192.168.1.1 ou example.com"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400" // Modifié: focus:ring-2
          />
        </div>

        {/* Bouton Scan */}
        <button
          onClick={handleScan}
          disabled={isLoading || (useCustomCommand && !customCommand)} // Désactivé si chargement ou commande personnalisée vide
          className={`w-full px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
            isLoading || (useCustomCommand && !customCommand)
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900' // Ajout styles focus
          }`}
        >
          {isLoading ? (
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <ScanLine className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Scan en cours...' : 'Lancer le Scan'}</span>
        </button>
      </div>

       {/* Sélection Type de Scan ou Commande Personnalisée */}
       {useCustomCommand ? (
           <div>
               <label htmlFor="customCommand" className="block text-sm font-medium text-gray-300 mb-1">
                   Commande Nmap personnalisée (sans "nmap")
               </label>
               <input
                   type="text"
                   id="customCommand"
                   value={customCommand}
                   onChange={(e) => setCustomCommand(e.target.value)}
                   placeholder="ex: -sV -p 1-1024 -A"
                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
               />
           </div>
       ) : (
           <div>
              <label htmlFor="scanType" className="block text-sm font-medium text-gray-300 mb-1">
                Type de Scan Nmap (Simulation)
              </label>
              <select
                id="scanType"
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100" // Modifié: focus:ring-2
              >
                {nmapScanTypes.map(scan => (
                  // Ajout de title pour tooltip au survol (optionnel mais utile)
                  <option key={scan.id} value={scan.id} title={scan.description}>
                    {scan.name} - {scan.description} {/* Affiche nom et description */}
                  </option>
                ))}
              </select>
            </div>
       )}


      {/* Zone de Sortie */}
      <div>
        <label htmlFor="output" className="block text-sm font-medium text-gray-300 mb-1">
          Résultat (Simulation)
        </label>
        <textarea
          id="output"
          rows="15"
          readOnly
          value={output}
          className="w-full p-3 bg-black text-green-400 font-mono text-sm border border-gray-700 rounded-md whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500" // Ajout focus style
          placeholder="Les résultats du scan (simulés) apparaîtront ici..."
        ></textarea>
      </div>
    </div>
  );
}

export default NmapSection;
