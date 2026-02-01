import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-light">
      {/* Sidebar - 25% on desktop */}
      <div className="hidden md:block md:w-1/5 bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content - 75% on desktop, 100% on mobile */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar - Handled in Sidebar component */}
    </div>
  );
}
