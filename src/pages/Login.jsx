import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Load stored user credentials
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setEmail(savedUser.email);
      setPassword(savedUser.password);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser && savedUser.email === email && savedUser.password === password) {
      navigate("/FDARGenAI");
    } else {
      alert("Invalid credentials. Please register first.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src="./src/components/Logo.png" alt="Logo" className="w-20" />
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring focus:ring-purple-300"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Don't have an account?{" "}
            <button
              className="text-purple-600 font-semibold hover:underline"
              onClick={() => setShowRegister(true)}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Register Modal */}
      {showRegister && <RegisterModal close={() => setShowRegister(false)} />}
    </div>
  );
}

function RegisterModal({ close }) {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerEmail && registerPassword) {
      localStorage.setItem(
        "user",
        JSON.stringify({ email: registerEmail, password: registerPassword })
      );
      alert("Registration successful! You can now log in.");
      close();
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src="./src/components/Logo.png" alt="Logo" className="w-20" />
          <h3 className="text-lg font-semibold text-gray-800">Create an Account</h3>
          <p className="text-gray-600 text-sm">Start using DiagAI™ today.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring focus:ring-purple-300"
              required
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring focus:ring-purple-300"
              required
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 rounded-lg hover:from-purple-700 hover:to-pink-600"
          >
            Register
          </button>
        </form>

        <button
          className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Login;
