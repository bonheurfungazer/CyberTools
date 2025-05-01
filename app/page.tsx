"use client";

import { useState } from 'react';
import HeaderComponent from './components/HeaderComponent';
import SidebarComponent from './components/SidebarComponent';
import FooterComponent from './components/FooterComponent';
import NmapSection from './components/NmapSection';
import MetasploitSection from './components/MetasploitSection';
import CryptoSection from './components/CryptoSection';
import SettingsSection from './components/SettingsSection';

function Home() {
  const [activeTab, setActiveTab] = useState('nmap');

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <div className="flex flex-1">
        <SidebarComponent activeTab={activeTab} changeTab={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === 'nmap' && <NmapSection />}
          {activeTab === 'metasploit' && <MetasploitSection />}
          {activeTab === 'crypto' && <CryptoSection />}
          {activeTab === 'settings' && <SettingsSection />}
        </main>
      </div>
      <FooterComponent />
    </div>
  );
}

export default Home;