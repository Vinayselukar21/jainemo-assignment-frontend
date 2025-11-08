import { NavLink } from '@/components/NavLink';
import { ChevronLeft, FileText, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}


export const Sidebar = ({ showSidebar, setShowSidebar }: SidebarProps) => {
  const isMobile = useIsMobile()
  return (
    <div className={`${isMobile ? 'fixed' : ''} top-16 z-40 h-[calc(100vh-4rem)] ${showSidebar ? 'w-80' : isMobile ? 'w-0' : 'w-20'} z-40 border-r border-muted bg-background transition-smooth overflow-y-auto`}>
      <nav className="p-4 space-y-6">
        {!isMobile && <div className="space-y-2">
          <Button variant='outline' onClick={() => setShowSidebar(!showSidebar)}>{showSidebar ? <ChevronLeft /> : <Menu />}</Button>
        </div>}
        {showSidebar && <div className="space-y-2">
          <NavLink
            to="/"
            end
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
            activeClassName="bg-muted text-primary font-medium"
          >
            <FileText className="h-5 w-5" />
            <span>DSA Sheet</span>
          </NavLink>
        </div>}
      </nav>
    </div>
  );
};
