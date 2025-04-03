import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => (
  <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col justify-between">
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">DiagAI™</h2>
      <nav className="space-y-4">
        <Link to="/FDARGenAI" className="block text-purple-600 font-semibold hover:text-purple-800">
          Back to Chat
        </Link>
        <Link to="/" className="block text-red-500 font-semibold hover:text-red-700">
          Logout
        </Link>
      </nav>
    </div>
  </div>
);

const HistoryEntry = ({ entry, onUsePrompt }) => (
  <div className="p-4 bg-gray-200 rounded-lg shadow mb-3 flex flex-col">
    <p><strong>Focus:</strong> {entry.focus}</p>
    <p><strong>Data:</strong> {entry.data}</p>
    <p><strong>Action:</strong> {entry.action}</p>
    <p><strong>Response:</strong> {entry.response}</p>
    <button
      onClick={() => onUsePrompt(entry)}
      className="mt-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
    >
      Use as Prompt
    </button>
  </div>
);

function GenHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("fdarHistory")) || []);
  }, []);

  const handleUsePrompt = (entry) => {
    localStorage.setItem("fdarPrompt", JSON.stringify(entry)); // Save entry for reuse
    navigate("/FDARGenAI"); // Redirect back to the AI generator
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-3/4 flex flex-col bg-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">📜 FDAR History</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col h-full">
          <div className="overflow-y-auto max-h-[60vh] pr-2">
            {history.length > 0 ? (
              history.map((entry, index) => (
                <HistoryEntry key={index} entry={entry} onUsePrompt={handleUsePrompt} />
              ))
            ) : (
              <p className="text-gray-600">No saved FDAR records.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenHistory;
