import { useState } from "react";
import { Link } from "react-router-dom";

function FDARGenAI() {
    const [messages, setMessages] = useState([
        { text: "Hello, how can I assist you today?", sender: "ai" },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage = { text: input, sender: "user" };
        setMessages([...messages, newMessage, { text: "Processing...", sender: "ai" }]);
        setInput("");

        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg) => (msg.text === "Processing..." ? { text: "Here’s my response!", sender: "ai" } : msg))
            );
        }, 1500);
    };

    const handleSaveToHistory = () => {
        const fdarEntry = {
            focus: "Patient experiencing chest pain",
            data: "Reports sharp pain in the left chest, 8/10 in intensity. Sweating and shortness of breath present.",
            action: "Assisted in deep breathing exercises. Administered prescribed nitroglycerin. Monitored vital signs.",
            response: "Pain reduced to 4/10 after intervention. Patient reports feeling more at ease. Further monitoring advised.",
        };

        // Get existing history from localStorage
        const existingHistory = JSON.parse(localStorage.getItem("fdarHistory")) || [];
        const updatedHistory = [...existingHistory, fdarEntry];

        // Save updated history to localStorage
        localStorage.setItem("fdarHistory", JSON.stringify(updatedHistory));
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar (1/4 screen) */}
            <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">DiagAI™</h2>
                    <nav className="space-y-4">
                        <Link to="/history" className="block text-purple-600 font-semibold hover:text-purple-800">Recently Generated Results</Link>
                        <Link to="/" className="block text-red-500 font-semibold hover:text-red-700">Logout</Link>
                    </nav>
                </div>
            </div>

            {/* Chat Section (3/4 screen) */}
            <div className="w-3/4 flex flex-col bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 p-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col h-full">
                    <h2 className="text-xl font-bold text-gray-800 text-center mb-4">DiagAI™ Chat</h2>

                    {/* Chat Display */}
                    <div className="flex-1 overflow-y-auto space-y-3 p-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`p-3 max-w-xs rounded-lg 
                                        ${msg.sender === "user"
                                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white text-right"
                                            : "bg-gray-300 text-black"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Field */}
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-purple-300"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600"
                            onClick={handleSend}
                        >
                            Send
                        </button>
                    </div>

                    {/* Static FDAR Output Section */}
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Sample FDAR Output</h3>
                        <p><strong>Focus:</strong> Patient experiencing chest pain</p>
                        <p><strong>Data:</strong> Reports sharp pain in the left chest, 8/10 in intensity. Sweating and shortness of breath present.</p>
                        <p><strong>Action:</strong> Assisted in deep breathing exercises. Administered prescribed nitroglycerin. Monitored vital signs.</p>
                        <p><strong>Response:</strong> Pain reduced to 4/10 after intervention. Patient reports feeling more at ease. Further monitoring advised.</p>

                        {/* Save to History Button */}
                        <button
                            className="mt-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            onClick={handleSaveToHistory}
                        >
                            Save to History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FDARGenAI;
