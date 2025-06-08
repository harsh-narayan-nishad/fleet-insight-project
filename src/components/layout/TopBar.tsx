
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, Download, LogOut, Settings, User } from 'lucide-react';

interface TopBarProps {
  userName: string;
  lastUpdated: string;
  dataQualityScore: number;
  onExport: () => void;
  onLogout: () => void;
}

const TopBar = ({ userName, lastUpdated, dataQualityScore, onExport, onLogout }: TopBarProps) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Title */}
        <div>
          <h1 className="text-xl font-bold text-slate-800">Fleet Analytics Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time fleet insights and forecasting</p>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4">
          {/* Status Badges */}
          <Badge variant="outline" className="text-green-700 border-green-300">
            Updated: {lastUpdated}
          </Badge>
          
          <Badge className={
            dataQualityScore >= 90 
              ? "bg-green-100 text-green-800" 
              : dataQualityScore >= 75
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }>
            Data Quality: {dataQualityScore}%
          </Badge>

          {/* Export Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
            className="border-slate-200 hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">Fleet Manager</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
