import NavBar from '../shared/components/NavBar';
import AppRouter from './router';
import { useAuthStore } from './store';

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
