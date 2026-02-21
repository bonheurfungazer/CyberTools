import React, { useState } from 'react';
import { LockKeyhole, FileText, ListChecks, Key } from 'lucide-react';

function CryptoSection() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [cryptoAction, setCryptoAction] = useState('base64_encode');
  const [caesarShift, setCaesarShift] = useState(3);
  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [rsaPrivateKey, setRsaPrivateKey] = useState('');

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileAction, setFileAction] = useState('base64_encode');
  const [aesKey, setAesKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputStyleFocusRing = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400";
  const textareaStyleFocusRing = "w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400";

  const cryptoOptions = [
    { id: 'base64_encode', name: 'Base64 Encoder' },
    { id: 'base64_decode', name: 'Base64 Decoder' },
    { id: 'url_encode', name: 'URL Encoder' },
    { id: 'url_decode', name: 'URL Decoder' },
    { id: 'caesar_encrypt', name: 'Chiffre de César - Chiffrer' },
    { id: 'caesar_decrypt', name: 'Chiffre de César - Déchiffrer' },
    { id: 'rot13', name: 'ROT13' },
    { id: 'md5_hash', name: 'MD5 Hash' },
    { id: 'sha1_hash', name: 'SHA-1 Hash' },
    { id: 'sha256_hash', name: 'SHA-256 Hash' },
    { id: 'sha512_hash', name: 'SHA-512 Hash' },
    { id: 'rsa_generate_keys', name: 'RSA - Générer Clés' },
    { id: 'rsa_encrypt', name: 'RSA - Chiffrer (avec Clé Publique)' },
    { id: 'rsa_decrypt', name: 'RSA - Déchiffrer (avec Clé Privée)' },
  ];

  const fileOptions = [
      { id: 'base64_encode', name: 'Encoder en Base64' },
      { id: 'aes_encrypt', name: 'AES Chiffrer (Fichier)' },
      { id: 'aes_decrypt', name: 'AES Déchiffrer (Fichier)' },
  ];

  const handleTextCrypto = async () => {
    setIsLoading(true);
    setOutputText('Traitement...');

    try {
      if (cryptoAction === 'rsa_generate_keys') {
          const response = await fetch('http://localhost:8000/crypto/rsa/generate-keys', { method: 'POST' });
          const data = await response.json();
          setRsaPrivateKey(data.private_key);
          setRsaPublicKey(data.public_key);
          setOutputText("Clés générées avec succès ! Voir les champs ci-dessous.");
          setIsLoading(false);
          return;
      }

      if (cryptoAction === 'rsa_encrypt') {
          if (!rsaPublicKey) throw new Error("Clé publique requise");
          const response = await fetch('http://localhost:8000/crypto/rsa/encrypt', {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: inputText, public_key: rsaPublicKey })
          });
          const data = await response.json();
          if (data.detail) throw new Error(data.detail);
          setOutputText(data.result);
          setIsLoading(false);
          return;
      }

      if (cryptoAction === 'rsa_decrypt') {
          if (!rsaPrivateKey) throw new Error("Clé privée requise");
          const response = await fetch('http://localhost:8000/crypto/rsa/decrypt', {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ encrypted_text: inputText, private_key: rsaPrivateKey })
          });
          const data = await response.json();
          if (data.detail) throw new Error(data.detail);
          setOutputText(data.result);
          setIsLoading(false);
          return;
      }

      // Default actions
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
    } else {
      setFile(null);
    }
    event.target.value = '';
  };

  const downloadFile = (base64Data: string, fileName: string) => {
      const link = document.createElement("a");
      link.href = `data:application/octet-stream;base64,${base64Data}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleFileCrypto = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
        const formData = new FormData();
        formData.append('file', file);

        let url = '';
        if (fileAction === 'base64_encode') url = 'http://localhost:8000/crypto/file/base64-encode';
        else if (fileAction === 'aes_encrypt') {
            url = 'http://localhost:8000/crypto/file/aes-encrypt';
            if (aesKey) formData.append('key', aesKey);
        }
        else if (fileAction === 'aes_decrypt') {
            url = 'http://localhost:8000/crypto/file/aes-decrypt';
            formData.append('key', aesKey);
        }

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (data.detail) throw new Error(data.detail);

        if (fileAction === 'aes_encrypt') {
            if (data.key) setAesKey(data.key);
            downloadFile(data.result, file.name + ".enc");
            setOutputText(`Fichier chiffré téléchargé. Clé utilisée: ${data.key}`);
        } else if (fileAction === 'aes_decrypt') {
            downloadFile(data.result, file.name.replace('.enc', '') || 'decrypted_file');
            setOutputText("Fichier déchiffré téléchargé.");
        } else {
            setOutputText(data.result);
        }

    } catch (error: any) {
      setOutputText(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-green-400 border-b border-gray-700 pb-2">Cryptographie</h2>

      {/* Section Texte / RSA */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-xl font-medium text-gray-200">Opérations Texte & Clés</h3>

        <div>
            <label htmlFor="cryptoAction" className="block text-sm font-medium text-gray-300 mb-1">Opération</label>
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

        {/* Champs spécifiques RSA */}
        {(cryptoAction.startsWith('rsa')) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900 p-3 rounded-md">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Clé Publique (PEM)</label>
                    <textarea
                        value={rsaPublicKey}
                        onChange={(e) => setRsaPublicKey(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-green-300 h-24"
                        placeholder="-----BEGIN PUBLIC KEY..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Clé Privée (PEM)</label>
                    <textarea
                        value={rsaPrivateKey}
                        onChange={(e) => setRsaPrivateKey(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-red-300 h-24"
                        placeholder="-----BEGIN PRIVATE KEY..."
                    />
                </div>
            </div>
        )}

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
            <label htmlFor="inputText" className="block text-sm font-medium text-gray-300 mb-1">Entrée</label>
            <textarea
                id="inputText"
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={textareaStyleFocusRing}
                placeholder="Entrez le texte ici..."
                disabled={isLoading}
            ></textarea>
            </div>
            <div>
            <label htmlFor="outputText" className="block text-sm font-medium text-gray-300 mb-1">Sortie</label>
            <textarea
                id="outputText"
                rows={5}
                readOnly
                value={outputText}
                className={`${textareaStyleFocusRing} bg-gray-900`}
                placeholder="Le résultat apparaîtra ici..."
            ></textarea>
            </div>
        </div>

        <button
            onClick={handleTextCrypto}
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
            isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
        >
            {isLoading ? <span className="animate-spin">⌛</span> : <ListChecks className="h-5 w-5" />}
            <span>Exécuter</span>
        </button>
      </div>

      {/* Section Fichier */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-xl font-medium text-gray-200">Opérations Fichier</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Action Fichier</label>
                <select
                    value={fileAction}
                    onChange={(e) => setFileAction(e.target.value)}
                    className={inputStyleFocusRing}
                >
                    {fileOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
            </div>
            <div>
                 <label htmlFor="fileInput" className="block text-sm font-medium text-gray-300 mb-1">Fichier</label>
                 <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
            </div>
        </div>

        {fileAction.startsWith('aes') && (
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Clé AES (Laisser vide pour générer en mode Chiffrer)</label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={aesKey}
                        onChange={(e) => setAesKey(e.target.value)}
                        placeholder="Clé secrète..."
                        className={inputStyleFocusRing}
                    />
                    <button onClick={() => setAesKey('')} className="bg-gray-600 px-3 rounded hover:bg-gray-500 text-xs">Clear</button>
                </div>
            </div>
        )}

        {file && (
          <p className="text-sm text-gray-300">Fichier: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)</p>
        )}

        <button
          onClick={handleFileCrypto}
          disabled={isLoading || !file}
          className={`w-full px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
            isLoading || !file
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>{isLoading ? "Traitement..." : "Traiter le Fichier"}</span>
        </button>
      </div>
    </div>
  );
}

export default CryptoSection;