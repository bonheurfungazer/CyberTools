import React from 'react'; // Importer React si nécessaire (bien que ce composant soit simple)
import { Settings } from 'lucide-react'; // Importer l'icône Settings si elle était utilisée directement ici

// --- Nouvelle Section Paramètres ---
/**
 * Composant de la section Paramètres.
 * Affiche un espace réservé pour les futurs réglages de l'application.
 */
function SettingsSection() {
    return (
        <div className="space-y-6">
            {/* Titre de la section Paramètres */}
            <h2 className="text-3xl font-semibold text-gray-400 border-b border-gray-700 pb-2">Paramètres</h2>
            {/* Conteneur principal des réglages simulés */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                {/* Sous-titre pour les réglages de l'application */}
                <h3 className="text-xl font-medium text-gray-200 mb-3">Réglages de l'Application (Simulation)</h3>
                {/* Description de la section */}
                <p className="text-sm text-gray-400">
                    Cette section est un espace réservé pour les futurs paramètres de l'application, tels que :
                </p>
                {/* Liste des exemples de paramètres futurs */}
                <ul className="list-disc list-inside text-sm text-gray-400 mt-2 space-y-1">
                    <li>Configuration de l'interface utilisateur</li>
                    <li>Options de journalisation (logging)</li>
                    <li>Gestion des API Keys (si un backend réel était implémenté)</li>
                    <li>Thèmes ou personnalisation visuelle</li>
                    <li>... et d'autres réglages.</li>
                </ul>
                 {/* Note indiquant que les fonctionnalités ne sont pas implémentées */}
                 <p className="mt-4 text-sm text-gray-400 italic">
                    Actuellement, aucune fonctionnalité de paramètre réelle n'est implémentée dans cette démo.
                 </p>
            </div>
            {/* Vous pouvez ajouter d'autres sections de paramètres ici si le design l'exigeait */}
        </div>
    );
}

export default SettingsSection; // Exporter le composant par défaut
