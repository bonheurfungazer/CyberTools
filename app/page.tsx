"use client";

import { useState } from 'react';
import HeaderComponent from './components/HeaderComponent';
import SidebarComponent from './components/SidebarComponent';
import FooterComponent from './components/FooterComponent';
import DashboardSection from './components/DashboardSection';
import OsintSection from './components/OsintSection';
import NmapSection from './components/NmapSection';
import MetasploitSection from './components/MetasploitSection';
import WebScanSection from './components/WebScanSection';
import PcapSection from './components/PcapSection';
import PasswordCrackSection from './components/PasswordCrackSection';
import CryptoSection from './components/CryptoSection';
import ReportSection from './components/ReportSection';
import SettingsSection from './components/SettingsSection';

function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <div className="flex flex-1">
        <SidebarComponent activeTab={activeTab} changeTab={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && <DashboardSection />}
          {activeTab === 'osint' && <OsintSection />}
          {activeTab === 'nmap' && <NmapSection />}
          {activeTab === 'metasploit' && <MetasploitSection />}
          {activeTab === 'webscan' && <WebScanSection />}
          {activeTab === 'pcap' && <PcapSection />}
          {activeTab === 'crack' && <PasswordCrackSection />}
          {activeTab === 'crypto' && <CryptoSection />}
          {activeTab === 'report' && <ReportSection />}
          {activeTab === 'settings' && <SettingsSection />}
        </main>
      </div>
      <FooterComponent />
    </div>
  );
}

export default Home;