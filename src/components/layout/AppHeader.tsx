'use client';

import { useTheme } from 'next-themes';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useBMSStore } from '@/hooks/useBMSStore';
import { useShallow } from 'zustand/react/shallow';
import { formatTimeAgo } from '@/utils/calculations';
import { useEffect, useState } from 'react';

interface AppHeaderProps {
  showNotifications?: boolean;
}

export function AppHeader({ showNotifications = true }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { connectionStatus, lastUpdated, activeAlerts } = useBMSStore(
    useShallow((state) => ({
      connectionStatus: state.connectionStatus,
      lastUpdated: state.lastUpdated,
      activeAlerts: state.activeAlerts,
    }))
  );
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimer = setInterval(() => {
      if (lastUpdated) {
        setTimeAgo(formatTimeAgo(lastUpdated));
      }
    }, 1000);
    return () => clearInterval(updateTimer);
  }, [lastUpdated]);

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Breadcrumb / Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <div
              className={cn(
                'w-2 h-2 rounded-full animate-pulse',
                connectionStatus.isConnected
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              )}
            />
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              Battery Monitor
            </span>
          </div>
          
          {/* Last Updated */}
          {lastUpdated && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Updated {timeAgo}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          {showNotifications && activeAlerts.length > 0 && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                {activeAlerts.length}
              </Badge>
            </Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
