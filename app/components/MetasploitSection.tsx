import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint, Terminal, ChevronDown, ChevronUp } from 'lucide-react'; // Importer les icônes nécessaires

// --- Section Metasploit ---
function MetasploitSection() {
   // État pour simuler des options
  const [moduleType, setModuleType] = useState('exploit'); // exploit, auxiliary, payload, etc.
  const [selectedModule, setSelectedModule] = useState('');
  const [targetHost, setTargetHost] = useState('');
  const [targetPort, setTargetPort] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false); // Nouvel état pour afficher le terminal simulé
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false); // Nouvel état pour afficher les options avancées
  const [terminalInput, setTerminalInput] = useState(''); // Entrée de l'utilisateur dans le terminal
  const [terminalHistory, setTerminalHistory] = useState([]); // Historique des commandes et sorties
  const terminalOutputRef = useRef(null); // Référence pour faire défiler la sortie du terminal

   // Classe CSS pour les inputs SANS outline/ring au focus
   const inputStyleNoFocusRing = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none text-gray-100 placeholder-gray-400";

   // Effet pour faire défiler la sortie du terminal vers le bas
   useEffect(() => {
       if (terminalOutputRef.current) {
           terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
       }
   }, [terminalHistory]); // Dépendance à l'historique du terminal

    // Simule l'exécution d'un module
  const handleRunModule = () => {
    if (!selectedModule || !targetHost) {
      setOutput('Erreur: Veuillez sélectionner un module et entrer une cible.');
      return;
    }
     setIsLoading(true);
     // Modifié: N'affiche plus la commande 'use'
     setOutput(`[*] Simulation de l'exécution du module ${moduleType}/${selectedModule} sur ${targetHost}...\n`);
     // *** ATTENTION: Ceci est une simulation. Pas d'exécution réelle. ***
     setTimeout(() => {
        const fakeOutput = `
msf6 ${moduleType}(${selectedModule}) > set RHOSTS ${targetHost}
RHOSTS => ${targetHost}
${targetPort ? `msf6 ${moduleType}(${selectedModule}) > set RPORT ${targetPort}\nRPORT => ${targetPort}\n` : ''}
msf6 ${moduleType}(${selectedModule}) > run

[*] Running module against ${targetHost}...
[+] Simulation: Module execution completed successfully. (This is fake output)
[*] Scanned 1 of 1 hosts (${targetHost})
        `;
        setOutput(prev => prev + fakeOutput);
        setIsLoading(false);
     }, 2500);
  };

  // Simule l'exécution d'une commande dans le terminal
  const handleTerminalCommand = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault(); // Empêcher le saut de ligne par défaut
          const command = terminalInput.trim();
          if (!command) return;

          setTerminalHistory(prev => [...prev, { type: 'command', text: `msf6 > ${command}` }]);
          setTerminalInput(''); // Effacer l'entrée

          // Simulation des réponses du terminal
          let simulatedResponse = '';
          const lowerCommand = command.toLowerCase();

          if (lowerCommand === 'help') {
              simulatedResponse = `
Core Commands
=============

    Command       Description
    --------      -----------
    ?             Help menu
    help          Help menu
    exit          Exit the console
    ...           (Simulation of other commands)
              `;
          } else if (lowerCommand.startsWith('show options')) {
              simulatedResponse = `
Module options (simulated/generic):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   RHOSTS                    yes       Target host(s)
   RPORT                     yes       Target port(s)
   ...      (Simulation of other options)
              `;
          } else if (lowerCommand.startsWith('set ')) {
              const parts = command.split(' ');
              if (parts.length >= 3) {
                  const option = parts[1];
                  const value = parts.slice(2).join(' ');
                  simulatedResponse = `${option} => ${value}\n`;
              } else {
                  simulatedResponse = "Usage: set <option> <value>\n";
              }
          } else if (lowerCommand === 'run' || lowerCommand === 'exploit') {
               simulatedResponse = `
[*] Simulating module execution...
[+] Simulation: Module finished.
               `;
          }
           else if (lowerCommand === 'clear' || lowerCommand === 'cls') {
               setTerminalHistory([]); // Efface l'historique
               return; // Ne pas ajouter de réponse simulée après l'effacement
           }
           else {
              simulatedResponse = `Unknown command: ${command}\nType 'help' for a list of commands (simulation).\n`;
          }

          setTimeout(() => {
              setTerminalHistory(prev => [...prev, { type: 'output', text: simulatedResponse }]);
          }, 500); // Petit délai pour simuler le traitement
      }
  };


  // Liste factice de modules pour l'UI (pourrait être très longue)
  const metasploitModules = {
    exploit: [
      'windows/smb/ms17_010_eternalblue',
      'multi/handler',
      'unix/ftp/vsftpd_234_backdoor',
      'windows/http/apache_mod_cgi_bash_env_exec',
      'linux/http/elasticsearch_dynamic_script',
      'windows/rdp/cve_2019_0708_bluekeep_rdp',
      // Add more simulated exploit modules to reach 100+ total modules
      ...Array.from({ length: 50 }).map((_, i) => `exploit/simulated/module_${i + 1}`),
    ],
    auxiliary: [
        'scanner/ssh/ssh_login',
        'scanner/http/dir_scanner',
        'scanner/smb/smb_version',
        'scanner/snmp/snmp_enum',
        'server/capture/ftp',
        'scanner/rdp/rdp_scanner',
         // Add more simulated auxiliary modules
        ...Array.from({ length: 20 }).map((_, i) => `auxiliary/simulated/scanner_${i + 1}`),
        ...Array.from({ length: 20 }).map((_, i) => `auxiliary/simulated/server_${i + 1}`),
        ...Array.from({ length: 10 }).map((_, i) => `auxiliary/simulated/admin_${i + 1}`),
    ],
    payload: [
        'windows/meterpreter/reverse_tcp',
        'linux/x86/meterpreter/reverse_tcp',
        'cmd/unix/reverse_bash',
        'php/meterpreter/reverse_tcp',
        'python/meterpreter/reverse_tcp',
        'java/meterpreter/reverse_tcp',
         // Add more simulated payload modules
        ...Array.from({ length: 50 }).map((_, i) => `payload/simulated/generic_${i + 1}`),
    ],
    post: [ // Ajout de quelques modules post-exploitation
        'windows/gather/checkvm',
        'multi/recon/local_exploit_suggester',
        'linux/gather/enum_configs',
         // Add more simulated post modules
        ...Array.from({ length: 30 }).map((_, i) => `post/simulated/windows_${i + 1}`),
        ...Array.from({ length: 30 }).map((_, i) => `post/simulated/linux_${i + 1}`),
    ],
    encoder: [ // Ajout de quelques encodeurs
        'x86/shikata_ga_nai',
        'cmd/powershell_base64',
         // Add more simulated encoder modules
        ...Array.from({ length: 10 }).map((_, i) => `encoder/simulated/x86_${i + 1}`),
    ],
     nop: [ // Add simulated NOP modules
        ...Array.from({ length: 10 }).map((_, i) => `nop/simulated/x86_${i + 1}`),
     ]
  };

  // Flatten all modules for a single list representation if needed, or keep structured
  const allModulesCount = Object.values(metasploitModules).reduce((count, modules) => count + modules.length, 0);


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-red-400 border-b border-gray-700 pb-2">Metasploit (Simulation)</h2>

      {/* Section de Configuration du Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration du Module */}
        <div className="space-y-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
           <h3 className="text-xl font-medium text-gray-200 mb-3">Configuration Rapide (Simulation)</h3>
           <div>
              <label htmlFor="moduleType" className="block text-sm font-medium text-gray-300 mb-1">Type de Module</label>
              <select
                id="moduleType"
                value={moduleType}
                onChange={(e) => { setModuleType(e.target.value); setSelectedModule(''); }}
                className={inputStyleNoFocusRing} // Utilise la classe sans ring
              >
                {Object.keys(metasploitModules).map(type => (
                     <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option> // Capitalize first letter
                ))}
              </select>
           </div>
           <div>
              <label htmlFor="selectedModule" className="block text-sm font-medium text-gray-300 mb-1">Module Spécifique (Simulation)</label>
              <select
                id="selectedModule"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className={inputStyleNoFocusRing} // Utilise la classe sans ring
               >
                 <option value="">-- Sélectionner un module --</option>
                 {(metasploitModules[moduleType] || []).map(mod => (
                    <option key={mod} value={mod}>{mod}</option>
                 ))}
              </select>
           </div>
            <div>
              <label htmlFor="targetHost" className="block text-sm font-medium text-gray-300 mb-1">Hôte Cible (RHOSTS)</label>
              <input
                type="text"
                id="targetHost"
                value={targetHost}
                onChange={e => setTargetHost(e.target.value)}
                placeholder="ex: 192.168.1.100"
                className={inputStyleNoFocusRing} // Utilise la classe sans ring
              />
           </div>
           <div>
              <label htmlFor="targetPort" className="block text-sm font-medium text-gray-300 mb-1">Port Cible (RPORT) (Optionnel)</label>
              <input
                type="number"
                id="targetPort"
                value={targetPort}
                onChange={e => setTargetPort(e.target.value)}
                placeholder="ex: 445"
                className={inputStyleNoFocusRing} // Utilise la classe sans ring
              />
           </div>
            <button
              onClick={handleRunModule}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                isLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800' // Ajout styles focus pour le bouton
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Fingerprint className="h-5 w-5" />
              )}
              <span>{isLoading ? 'Exécution...' : 'Exécuter Module (Simulé)'}</span>
            </button>
        </div>

        {/* Console de Sortie (pour l'exécution rapide) */}
        <div className="space-y-4">
           <h3 className="text-xl font-medium text-gray-200 mb-3">Console de Sortie Rapide (Simulation)</h3>
           <textarea
              id="msfOutput"
              rows="18" // Ajusté pour mieux s'adapter
              readOnly
              value={output}
              className="w-full p-3 bg-black text-cyan-400 font-mono text-sm border border-gray-700 rounded-md whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-red-500" // Ajout focus style
              placeholder="La sortie de Metasploit (simulée) apparaîtra ici..."
           ></textarea>
        </div>
      </div>

       {/* Bouton pour afficher/masquer les options avancées */}
       <div className="mt-6 pt-6 border-t border-gray-700">
           <button
               onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
               className={`mb-4 px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 flex items-center space-x-2 ${
                 showAdvancedOptions
                   ? 'bg-gray-600 hover:bg-gray-700'
                   : 'bg-red-600 hover:bg-red-700'
               } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
           >
               {showAdvancedOptions ? (
                   <ChevronUp className="h-5 w-5" />
               ) : (
                   <ChevronDown className="h-5 w-5" />
               )}
               <span>{showAdvancedOptions ? 'Masquer les Options Avancées (Simulation)' : 'Afficher les Options Avancées (Simulation)'}</span>
           </button>

           {/* Représentation des 100+ options et sous-options - Masquée/Affichable */}
           {showAdvancedOptions && (
               <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                   <h4 className="text-lg font-medium text-gray-300 mb-2">Options et Fonctionnalités Avancées (Simulation)</h4>
                   <p className="text-sm text-gray-400 mb-3">
                       Cette section représente l'étendue des options et sous-options disponibles dans Metasploit (plus de 100 options/modules et leurs paramètres).
                       L'implémentation complète de toutes ces fonctionnalités dépasse le cadre de cette démo front-end.
                   </p>
                   {/* Simulation visuelle de quelques options/sous-options */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Techniques d'Évasion (Simulation)</label>
                           <select className={`${inputStyleNoFocusRing}`}>
                               <option>-- Sélectionner une technique --</option>
                               {Array.from({ length: 10 }).map((_, i) => (
                                   <option key={`evasion_${i}`}>Technique d'évasion simulée {i + 1}</option>
                               ))}
                           </select>
                       </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Options de Proxy (Simulation)</label>
                           <input type="text" placeholder="ex: socks4:127.0.0.1:9050" className={inputStyleNoFocusRing} />
                       </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Options de Threads (Simulation)</label>
                           <input type="number" placeholder="ex: 10" className={inputStyleNoFocusRing} />
                       </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Options de Cible Avancées (Simulation)</label>
                           <input type="text" placeholder="ex: file:/path/to/targets.txt" className={inputStyleNoFocusRing} />
                       </div>
                       {/* Ajouter d'autres éléments pour simuler la richesse des options */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={`advanced_option_${i}`}>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Option Avancée Simulée {i + 1}</label>
                                <input type="text" placeholder={`Valeur pour l'option ${i + 1}`} className={inputStyleNoFocusRing} />
                            </div>
                        ))}
                   </div>
                    <p className="mt-4 text-sm text-gray-400">
                        Total de modules simulés (Exploits, Auxiliaires, Payloads, Post, Encodeurs, Nops) : {allModulesCount}
                    </p>
               </div>
           )}
       </div>


       {/* Terminal Simulé - Positionné en bas */}
       <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-semibold text-red-400 mb-3">Terminal Metasploit (Simulation pour Experts)</h3>
            <p className="text-sm text-gray-400 mb-3">
                Utilisez ce terminal simulé pour pratiquer les commandes de base de Metasploit. Les commandes réelles ne sont pas exécutées.
            </p>
             {/* Bouton pour afficher/masquer le terminal simulé */}
            <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`mb-4 px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 flex items-center space-x-2 ${
                  showTerminal
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
              >
                <Terminal className="h-5 w-5" />
                <span>{showTerminal ? 'Masquer le Terminal Expert (Simulé)' : 'Afficher le Terminal Expert (Simulé)'}</span> {/* Texte mis à jour */}
            </button>

           {showTerminal && (
              <div className="bg-black text-cyan-400 font-mono text-sm rounded-md border border-gray-700 p-3 space-y-2">
                  <div className="h-64 overflow-y-auto whitespace-pre-wrap" ref={terminalOutputRef}>
                      {/* Afficher l'historique des commandes et sorties */}
                      {terminalHistory.map((item, index) => (
                          <div key={index} className={item.type === 'command' ? 'text-gray-300' : 'text-cyan-400'}>
                              {item.text}
                          </div>
                      ))}
                  </div>
                  <div className="flex items-center">
                      <span className="text-gray-300 mr-2">msf6 &gt;</span>
                      <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyPress={handleTerminalCommand}
                          className="flex-1 bg-transparent border-none outline-none text-cyan-400"
                          autoFocus // Met le focus sur l'input quand le terminal apparaît
                      />
                  </div>
              </div>
           )}
       </div>

    </div>
  );
}

export default MetasploitSection; // Exporter le composant par défaut
