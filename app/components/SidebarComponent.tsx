"use client";

import {
    LayoutDashboard,
    ScanLine,
    Fingerprint,
    LockKeyhole,
    Globe,
    Search,
    FileSearch,
    KeyRound,
    FileText,
    Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  changeTab: (tab: string) => void;
}

function SidebarComponent({ activeTab, changeTab }: SidebarProps) {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'osint', label: 'OSINT / Recon', icon: Search },
    { id: 'nmap', label: 'Scan Nmap', icon: ScanLine },
    { id: 'metasploit', label: 'Metasploit', icon: Fingerprint },
    { id: 'webscan', label: 'Web Scanner', icon: Globe },
    { id: 'pcap', label: 'Pcap Analysis', icon: FileSearch },
    { id: 'crack', label: 'Password Cracking', icon: KeyRound },
    { id: 'crypto', label: 'Cryptographie', icon: LockKeyhole },
    { id: 'report', label: 'Rapports', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-800 p-4 space-y-4 border-r border-gray-700 flex-shrink-0 overflow-y-auto">
      <nav className="flex flex-col space-y-2">
        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => changeTab(id)}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 w-full text-left ${
              activeTab === id
                ? 'bg-blue-600 text-white shadow-md'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default SidebarComponent;