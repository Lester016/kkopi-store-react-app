import NavBar from '../shared/components/NavBar';
import AppRouter from './router';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-1 overflow-auto p-6">
        {/* <Outlet /> Renders child route here */}
        <AppRouter />
      </main>
    </div>
  );
};

export default App;
