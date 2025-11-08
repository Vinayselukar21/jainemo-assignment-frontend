import { Moon, Sun, LogOut, User, Menu, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
interface HeaderProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header = ({ showSidebar, setShowSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-header-border bg-header backdrop-blur supports-[backdrop-filter]:bg-header/95 transition-smooth">
      <div className="flex h-16 items-center justify-between px-3 md:px-6 gap-2">

        <div className="flex items-center gap-2">
          {isMobile && <div className="space-y-2">
            <Button variant='outline' onClick={() => setShowSidebar(!showSidebar)}>{showSidebar ? <ChevronLeft /> : <Menu />}</Button>
          </div>}
          <h1 className="md:text-xl font-bold text-foreground">Jainemo Assignment</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 hover:bg-accent transition-smooth"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-smooth"
          >
            <LogOut className="h-4 w-4" />
            {isMobile ? '' : 'Logout'}
          </Button>
        </div>
      </div>
    </header>
  );
};
