import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/home/HomePage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import { useAppDispatch } from './hooks/useAppStore';
import { refresh } from './services/user/userSlice';
import NotificationModal from './components/notifications/NotificationModal';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(refresh());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <NotificationModal />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
