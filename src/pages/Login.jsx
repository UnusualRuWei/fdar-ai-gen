import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/FDARGenAI"); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src="./src/components/Logo.png" alt="Logo" />
          <h2 className="text-xl font-bold mt-2 text-gray-800">DiagAI™</h2>
          <p className="text-gray-600 text-sm">Assistive AI FDAR Tool for Nursing Students.</p>
        </div>
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">Sign In</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring focus:ring-purple-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring focus:ring-purple-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 rounded-lg hover:from-purple-700 hover:to-pink-600"
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          <p>
            Don't have an account? <a href="#" className="text-purple-600 font-semibold">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
