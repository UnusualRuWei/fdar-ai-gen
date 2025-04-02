import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function GenHistory() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("fdarHistory")) || [];
        setHistory(savedHistory);
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar (1/4 screen) */}
            <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">DiagAI™</h2>
                    <nav className="space-y-4">
                        <Link to="/FDARGenAI" className="block text-purple-600 font-semibold hover:text-purple-800">Back to Chat</Link>
                        <Link to="/" className="block text-red-500 font-semibold hover:text-red-700">Logout</Link>
                    </nav>
                </div>
            </div>

            {/* History Section (3/4 screen) */}
            <div className="w-3/4 flex flex-col bg-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-4">📜 FDAR History</h2>

                <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col h-full">
                    {history.length > 0 ? (
                        history.map((entry, index) => (
                            <div key={index} className="mb-2 p-3 bg-gray-200 rounded-lg shadow">
                                <p><strong>Focus:</strong> {entry.focus}</p>
                                <p><strong>Data:</strong> {entry.data}</p>
                                <p><strong>Action:</strong> {entry.action}</p>
                                <p><strong>Response:</strong> {entry.response}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No saved FDAR records.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GenHistory;
