import { ReactNode, useEffect, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile()
  const [showSidebar, setShowSidebar] = useState(false)
  useEffect(() => {
    if (!isMobile) {
      setShowSidebar(true)
    }
  }, [isMobile])
  return (
    <main className="bg-background">
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <div className="p-6 transition-smooth w-full">
          {children}
        </div>
      </div>
    </main>
  );
};
