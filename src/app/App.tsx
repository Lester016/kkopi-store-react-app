import NavBar from '../shared/components/NavBar';
import { useAuthStore } from '../store/authStore';
import AppRouter from './router';

const App = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {user && <NavBar />}

      <main className="flex-1 overflow-auto p-6">
        <AppRouter />
      </main>
    </div>
  );
};

export default App;
