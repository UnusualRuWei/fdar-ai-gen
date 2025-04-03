import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FDARGenAI() {
  const [messages, setMessages] = useState([{ text: "Hello, how can I assist you today?", sender: "ai" }]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const savedPrompt = JSON.parse(localStorage.getItem("fdarPrompt"));
    if (savedPrompt) {
      setInput(`${savedPrompt.focus}. ${savedPrompt.data}. ${savedPrompt.action}. ${savedPrompt.response}`);
      localStorage.removeItem("fdarPrompt"); // Clear it after use
    }
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }, { text: "Processing...", sender: "ai" }]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
      <div className="w-1/4 bg-white bg-opacity-50 shadow-lg p-6 flex flex-col justify-between backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">DiagAI™</h2>
        <nav className="space-y-4">
          <Link to="/history" className="block text-purple-600 font-semibold hover:text-purple-800">
            Recently Generated Results
          </Link>
          <Link to="/" className="block text-red-500 font-semibold hover:text-red-700">
            Logout
          </Link>
        </nav>
      </div>
      <div className="w-3/4 flex flex-col p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col h-full">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">DiagAI™ Chat</h2>
          <div className="flex-1 overflow-y-auto space-y-3 p-2 max-h-[70vh]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-purple-600 text-white self-end" : "bg-gray-300 text-black self-start"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button className="p-2 bg-purple-600 text-white rounded-lg" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FDARGenAI;
