import { LoginForm } from './LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8">Sign in to your account</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
