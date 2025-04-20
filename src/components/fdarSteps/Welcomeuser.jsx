const WelcomeUser = ({ message, handleWelcome }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {message || "Welcome! Click below to get started."}
        </h2>
        <button
          onClick={handleWelcome}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>
    );
  };
  
  export default WelcomeUser;
  