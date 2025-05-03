import React, { useState } from 'react';
import { LockKeyhole, FileText, ListChecks } from 'lucide-react';

// --- Section Cryptographie ---
function CryptoSection() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [cryptoAction, setCryptoAction] = useState('base64_encode');
  const [caesarShift, setCaesarShift] = useState(3);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputStyleFocusRing = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400";
  const textareaStyleFocusRing = "w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400";

  const handleTextCrypto = async () => {
    setIsLoading(true);
    setOutputText('Traitement...');
    try {
      const body: any = {
        action: cryptoAction,
        text: inputText
      };
      if (cryptoAction === 'caesar_encrypt' || cryptoAction === 'caesar_decrypt') {
        body.shift = caesarShift;
      }
      const response = await fetch('http://localhost:8000/crypto/action', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setOutputText(data.result || data.detail || "Erreur inconnue");
    } catch (error: any) {
      setOutputText(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setOutputText('');
    } else {
      setFile(null);
    }
    event.target.value = '';
  };

  const handleFileCrypto = async () => {
    if (!file) return;
    setIsLoading(true);
    setOutputText('Traitement du fichier...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:8000/crypto/file/base64-encode', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setOutputText(data.result || data.detail || "Erreur inconnue");
    } catch (error: any) {
      setOutputText(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const cryptoOptions = [
    { id: 'base64_encode', name: 'Base64 Encoder (Texte)' },
    { id: 'base64_decode', name: 'Base64 Decoder (Texte)' },
    { id: 'url_encode', name: 'URL Encoder (Texte)' },
    { id: 'url_decode', name: 'URL Decoder (Texte)' },
    { id: 'caesar_encrypt', name: 'Chiffre de César (Texte) - Chiffrer' },
    { id: 'caesar_decrypt', name: 'Chiffre de César (Texte) - Déchiffrer' },
    { id: 'rot13', name: 'ROT13 (Texte)' },
    { id: 'md5_hash', name: 'MD5 Hash (Texte)' },
    { id: 'sha1_hash', name: 'SHA-1 Hash (Texte)' },
    { id: 'sha256_hash', name: 'SHA-256 Hash (Texte)' },
    { id: 'sha512_hash', name: 'SHA-512 Hash (Texte)' },
    // Les suivants sont affichés mais non implémentés
    { id: 'aes_encrypt_file', name: 'AES Chiffrer Fichier (non dispo)' },
    { id: 'aes_decrypt_file', name: 'AES Déchiffrer Fichier (non dispo)' },
    { id: 'rsa_generate_keys', name: 'RSA Générer Clés (non dispo)' },
    { id: 'rsa_encrypt', name: 'RSA Chiffrer (non dispo)' },
    { id: 'rsa_decrypt', name: 'RSA Déchiffrer (non dispo)' },
    { id: 'pgp_sign', name: 'PGP Signer (non dispo)' },
    { id: 'pgp_verify', name: 'PGP Vérifier (non dispo)' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-green-400 border-b border-gray-700 pb-2">Cryptographie</h2>
      <div>
        <label htmlFor="cryptoAction" className="block text-sm font-medium text-gray-300 mb-1">Opération Cryptographique</label>
        <select
          id="cryptoAction"
          value={cryptoAction}
          onChange={(e) => setCryptoAction(e.target.value)}
          className={inputStyleFocusRing}
        >
          {cryptoOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>
      {(cryptoAction === 'caesar_encrypt' || cryptoAction === 'caesar_decrypt') && (
        <div>
          <label htmlFor="caesarShift" className="block text-sm font-medium text-gray-300 mb-1">Décalage César (1-25)</label>
          <input
            type="number"
            id="caesarShift"
            value={caesarShift}
            onChange={(e) => {
              let val = parseInt(e.target.value, 10);
              if (isNaN(val)) val = 1;
              val = Math.max(1, Math.min(25, val));
              setCaesarShift(val);
            }}
            className={inputStyleFocusRing}
            min="1"
            max="25"
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-300 mb-1">Texte d'Entrée</label>
          <textarea
            id="inputText"
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={textareaStyleFocusRing}
            placeholder="Entrez le texte ici..."
            disabled={isLoading}
          ></textarea>
        </div>
        <div>
          <label htmlFor="outputText" className="block text-sm font-medium text-gray-300 mb-1">Texte de Sortie</label>
          <textarea
            id="outputText"
            rows={8}
            readOnly
            value={outputText}
            className={`${textareaStyleFocusRing} bg-gray-800`}
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
            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
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

      {/* Section Fichier */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-xl font-medium text-gray-200 mb-3">Traitement de Fichier (Base64 uniquement)</h3>
        <div>
          <label htmlFor="fileInput" className="block text-sm font-medium text-gray-300 mb-1">Sélectionner un Fichier</label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>
        {file && (
          <p className="mt-2 text-sm text-gray-300">Fichier sélectionné: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)</p>
        )}
        <button
          onClick={handleFileCrypto}
          disabled={isLoading || !file}
          className="mt-4 px-4 py-2 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 flex items-center space-x-2"
        >
          <FileText className="h-5 w-5" />
          <span>{isLoading ? "Traitement en cours..." : "Encoder le Fichier en Base64"}</span>
        </button>
      </div>
    </div>
  );
}

export default CryptoSection;