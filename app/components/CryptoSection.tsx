import React, { useState, useRef, useEffect } from 'react';
import { LockKeyhole, FileText, ListChecks } from 'lucide-react'; // Importer les icônes nécessaires

// --- Section Cryptographie ---
function CryptoSection() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [cryptoAction, setCryptoAction] = useState('base64_encode'); // ou 'base64_decode', 'caesar_encrypt', etc.
  const [caesarShift, setCaesarShift] = useState(3);
  const [file, setFile] = useState(null); // Pour la simulation de fichier
  const [isLoading, setIsLoading] = useState(false); // Ajout état de chargement

  // Classe CSS pour les inputs SANS outline/ring au focus
  const inputStyleNoFocusRing = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none text-gray-100 placeholder-gray-400";
  // Classe CSS pour les inputs AVEC outline/ring au focus
  const inputStyleFocusRing = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400";
  // Classe CSS pour les textareas
  const textareaStyleFocusRing = "w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400";


  // Simule une opération de cryptographie sur le texte
  const handleTextCrypto = async () => {
    setIsLoading(true);
    setOutputText('Traitement...');
    await new Promise(resolve => setTimeout(resolve, 50)); // Petit délai pour afficher "Traitement..."

    let result = '';
    try {
      switch (cryptoAction) {
        case 'base64_encode':
          result = btoa(unescape(encodeURIComponent(inputText))); // Gère UTF-8
          break;
        case 'base64_decode':
          result = decodeURIComponent(escape(atob(inputText))); // Gère UTF-8
          break;
        case 'url_encode':
          result = encodeURIComponent(inputText);
          break;
        case 'url_decode':
          result = decodeURIComponent(inputText);
          break;
        case 'caesar_encrypt':
          result = caesarCipher(inputText, caesarShift);
          break;
        case 'caesar_decrypt':
           result = caesarCipher(inputText, -caesarShift); // Déchiffre en décalant dans l'autre sens
          break;
        case 'rot13':
           result = caesarCipher(inputText, 13); // ROT13 est un César avec décalage 13
           break;
        // --- Hachage (Simulation avec Web Crypto API si disponible) ---
        case 'md5_hash': // MD5 n'est pas dans Web Crypto, simulation simple
           result = `Simulation MD5: ${inputText.substring(0,32)}`; // Très basique
           break;
        case 'sha1_hash':
        case 'sha256_hash':
        case 'sha512_hash':
            if (window.crypto && window.crypto.subtle) {
                const algo = cryptoAction === 'sha1_hash' ? 'SHA-1' : (cryptoAction === 'sha256_hash' ? 'SHA-256' : 'SHA-512');
                const hashBuffer = await crypto.subtle.digest(algo, new TextEncoder().encode(inputText));
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                result = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } else {
                result = `Simulation ${cryptoAction.split('_')[0].toUpperCase()}: Web Crypto API non disponible.`;
            }
            break;
        // --- Autres ---
        default:
          result = 'Action non implémentée (simulation).';
      }
      setOutputText(result);
    } catch (error) {
       setOutputText(`Erreur: ${error.message}. Assurez-vous que l'entrée est valide pour l'opération (ex: Base64 valide pour le décodage).`);
    } finally {
        setIsLoading(false);
    }
  };

  // Fonction simple pour le Chiffre de César (pour démo)
  const caesarCipher = (str, shift) => {
    const s = shift % 26; // Gère les décalages > 25 ou < 0
    return str.split('').map(char => {
      const code = char.charCodeAt(0);
      // Majuscules
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + s + 26) % 26) + 65); // Ajout + 26 pour gérer décalage négatif
      }
      // Minuscules
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + s + 26) % 26) + 97); // Ajout + 26 pour gérer décalage négatif
      }
      return char; // Ne modifie pas les autres caractères
    }).join('');
  };

  // Simule le traitement d'un fichier (ne fait rien de réel)
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setOutputText(`Fichier "${event.target.files[0].name}" sélectionné. La cryptographie de fichier n'est pas implémentée dans cette démo.`);
    } else {
      setFile(null);
      // Optionnel: vider outputText si aucun fichier n'est sélectionné
      // setOutputText('');
    }
     // Réinitialiser l'input file pour permettre de re-sélectionner le même fichier
     event.target.value = null;
  };


  // Options de cryptographie pour l'UI
  const cryptoOptions = [
    { id: 'base64_encode', name: 'Base64 Encoder (Texte)' },
    { id: 'base64_decode', name: 'Base64 Decoder (Texte)' },
    { id: 'url_encode', name: 'URL Encoder (Texte)' },
    { id: 'url_decode', name: 'URL Decoder (Texte)' },
    { id: 'caesar_encrypt', name: 'Chiffre de César (Texte) - Chiffrer' },
    { id: 'caesar_decrypt', name: 'Chiffre de César (Texte) - Déchiffrer' },
    { id: 'rot13', name: 'ROT13 (Texte)' },
    { id: 'md5_hash', name: 'MD5 Hash (Texte - Simulation)' }, // Non sécurisé, juste pour démo
    { id: 'sha1_hash', name: 'SHA-1 Hash (Texte - Web Crypto)' }, // Non recommandé pour sécu
    { id: 'sha256_hash', name: 'SHA-256 Hash (Texte - Web Crypto)' },
    { id: 'sha512_hash', name: 'SHA-512 Hash (Texte - Web Crypto)' }, // Ajouté
    { id: 'aes_encrypt_file', name: 'AES Chiffrer Fichier (Simulation)' }, // Non implémenté
    { id: 'aes_decrypt_file', name: 'AES Déchiffrer Fichier (Simulation)' }, // Non implémenté
    { id: 'rsa_generate_keys', name: 'RSA Générer Clés (Simulation)' }, // Ajouté
    { id: 'rsa_encrypt', name: 'RSA Chiffrer (Simulation)' },
    { id: 'rsa_decrypt', name: 'RSA Déchiffrer (Simulation)' },
    { id: 'pgp_sign', name: 'PGP Signer (Simulation)' },
    { id: 'pgp_verify', name: 'PGP Vérifier (Simulation)' }, // Ajouté
    // Ajouter d'autres pour atteindre 15+
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-green-400 border-b border-gray-700 pb-2">Cryptographie (Simulation)</h2>

      {/* Sélection de l'opération */}
      <div>
        <label htmlFor="cryptoAction" className="block text-sm font-medium text-gray-300 mb-1">Opération Cryptographique</label>
        <select
          id="cryptoAction"
          value={cryptoAction}
          onChange={(e) => setCryptoAction(e.target.value)}
          className={inputStyleFocusRing} // Style avec focus ring
        >
          {cryptoOptions.map(opt => (
             <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>

       {/* Options spécifiques (ex: décalage César) */}
       {(cryptoAction === 'caesar_encrypt' || cryptoAction === 'caesar_decrypt') && (
         <div>
           <label htmlFor="caesarShift" className="block text-sm font-medium text-gray-300 mb-1">Décalage César (1-25)</label>
           <input
             type="number"
             id="caesarShift"
             value={caesarShift}
             onChange={(e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = 1; // Défaut si non numérique
                val = Math.max(1, Math.min(25, val)); // Contraint entre 1 et 25
                setCaesarShift(val);
             }}
             className={inputStyleFocusRing} // Style avec focus ring
             min="1"
             max="25"
           />
         </div>
       )}


      {/* Section Texte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-300 mb-1">Texte d'Entrée</label>
          <textarea
            id="inputText"
            rows="8"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={textareaStyleFocusRing} // Style avec focus ring
            placeholder="Entrez le texte ici..."
            disabled={isLoading} // Désactiver pendant le traitement
          ></textarea>
        </div>
        <div>
          <label htmlFor="outputText" className="block text-sm font-medium text-gray-300 mb-1">Texte de Sortie</label>
          <textarea
            id="outputText"
            rows="8"
            readOnly
            value={outputText}
            className={`${textareaStyleFocusRing} bg-gray-800`} // Fond légèrement différent pour sortie
            placeholder="Le résultat apparaîtra ici..."
          ></textarea>
        </div>
      </div>
       <button
          onClick={handleTextCrypto}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 flex items-center space-x-2 ${
            isLoading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900' // Ajout styles focus
          }`}
        >
         {isLoading ? (
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <ListChecks className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Traitement...' : 'Traiter le Texte'}</span>
        </button>


      {/* Section Fichier (Simulation) */}
       <div className="mt-6 pt-6 border-t border-gray-700">
         <h3 className="text-xl font-medium text-gray-200 mb-3">Traitement de Fichier (Simulation)</h3>
         <p className="text-sm text-gray-400 mb-3">La cryptographie réelle des fichiers nécessite un backend sécurisé et n'est pas implémentée ici.</p>
         <div>
           <label htmlFor="fileInput" className="block text-sm font-medium text-gray-300 mb-1">Sélectionner un Fichier</label>
           <input
             type="file"
             id="fileInput"
             onChange={handleFileChange}
             className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900" // Ajout styles focus
            />
         </div>
         {file && (
            <p className="mt-2 text-sm text-gray-300">Fichier sélectionné: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)</p>
         )}
          {/* Bouton désactivé pour montrer que ce n'est pas fonctionnel */}
          <button
            disabled
            className="mt-4 px-4 py-2 rounded-md text-white font-semibold bg-gray-500 cursor-not-allowed flex items-center space-x-2"
          >
            <FileText className="h-5 w-5" />
            <span>Traiter le Fichier (Désactivé)</span>
          </button>
       </div>

    </div>
  );
}

export default CryptoSection; // Exporter le composant par défaut
