
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

interface DashboardLayoutProps {
  children: ReactNode;
  userName: string;
  lastUpdated: string;
  dataQualityScore: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExport: () => void;
  onLogout: () => void;
}

const DashboardLayout = ({
  children,
  userName,
  lastUpdated,
  dataQualityScore,
  activeTab,
  onTabChange,
  onExport,
  onLogout,
}: DashboardLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="flex-1 flex flex-col">
        <TopBar 
          userName={userName}
          lastUpdated={lastUpdated}
          dataQualityScore={dataQualityScore}
          onExport={onExport}
          onLogout={onLogout}
        />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Back Button for all dashboard pages */}
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
