import React from 'react';
import { ShieldCheck } from 'lucide-react'; // Importer l'icône ShieldCheck

/**
 * Composant d'en-tête pour l'application CyberTools.
 * Affiche le logo et le titre de l'application.
 */
function HeaderComponent() {
  return (
    // En-tête de l'application avec styles Tailwind CSS
    <header className="bg-gray-800 shadow-lg p-4 flex items-center justify-between">
      {/* Conteneur pour le logo et le titre */}
      <div className="flex items-center space-x-3">
        {/* Icône ShieldCheck */}
        <ShieldCheck className="text-blue-500 h-8 w-8" />
        {/* Titre de l'application */}
        <h1 className="text-2xl font-bold text-white">CyberTools</h1>
      </div>
      {/* Espace réservé pour d'autres éléments d'en-tête si nécessaire (ex: boutons utilisateur) */}
      {/* Potentiellement ajouter des boutons ou infos utilisateur ici */}
    </header>
  );
}

export default HeaderComponent; // Exporter le composant par défaut
