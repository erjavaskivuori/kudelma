import { Outlet } from 'react-router';
import Sidebar from '../components/sidebar/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--color-extra-dark)]">
      <aside className="w-72 shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 px-10">
        <Outlet />
      </main>
    </div>
  );
};


export default MainLayout;
