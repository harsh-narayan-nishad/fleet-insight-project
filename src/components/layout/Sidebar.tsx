
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  TrendingUp, 
  Truck, 
  FileText, 
  Settings, 
  ChevronLeft,
  LayoutDashboard,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'fleet-analytics', label: 'Overview', icon: Home },
  { id: 'executive', label: 'Executive', icon: LayoutDashboard },
  { id: 'forecast', label: 'Forecasts', icon: TrendingUp },
  { id: 'inventory', label: 'Vehicles', icon: Truck },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'parameters', label: 'Settings', icon: Settings },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">Fleet Insight</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left transition-all duration-200",
                  isCollapsed ? "px-2" : "px-3",
                  isActive && "bg-teal-50 text-teal-700 border-r-2 border-teal-600",
                  !isActive && "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            Fleet Management v2.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
