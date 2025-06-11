
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Calendar,
  Settings,
  Users,
  TrendingUp,
  Database,
  Wrench,
  TargetIcon,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      id: 'fleet-analytics',
      label: 'Fleet Analytics',
      icon: BarChart3,
      path: '/fleet-analytics',
    },
    {
      id: 'timeline',
      label: 'Timeline View',
      icon: Calendar,
      path: '/timeline',
    },
    {
      id: 'inventory',
      label: 'Vehicle Inventory',
      icon: Database,
      path: '/inventory',
    },
    {
      id: 'equipment',
      label: 'Equipment Management',
      icon: Wrench,
      path: '/equipment',
    },
    {
      id: 'forecasting',
      label: 'Forecasting Engine',
      icon: TargetIcon,
      path: '/forecasting',
    },
    {
      id: 'parameters',
      label: 'Cost Parameters',
      icon: Settings,
      path: '/parameters',
    },
    {
      id: 'forecast',
      label: 'Forecast Dashboard',
      icon: TrendingUp,
      path: '/forecast',
    },
    {
      id: 'executive',
      label: 'Executive View',
      icon: Users,
      path: '/executive',
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Fleet Capital Planning</h1>
        <p className="text-sm text-slate-600 mt-1">Vehicle Replacement Forecasting</p>
        
        {/* Back Button */}
        <Link to="/">
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full justify-start gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Homepage
          </Button>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.id} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isActive && "bg-blue-600 text-white hover:bg-blue-700"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
