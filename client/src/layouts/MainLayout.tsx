import { Outlet } from 'react-router';
import TopBar from '../components/topbar/Topbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-extra-dark)]">
      <TopBar />
      <main className="mx-auto px-10 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
