
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Download, User } from 'lucide-react';
import FleetAnalyticsDashboard from '@/components/FleetAnalyticsDashboard';

interface DashboardProps {
  currentUser: string;
  lastUpdated: string;
  dataQualityScore: number;
  onExport: () => void;
  onLogout: () => void;
}

const Dashboard = ({ currentUser, lastUpdated, dataQualityScore, onExport, onLogout }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">10-Year Vehicle Capital Plan</h1>
            <p className="text-sm text-gray-600">Fleet Replacement Management Dashboard (2025-2035)</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
            <Button variant="outline" onClick={onExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export Plan
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {currentUser}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <FleetAnalyticsDashboard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
