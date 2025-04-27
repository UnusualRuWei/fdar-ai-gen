const Step2Focus = ({
    aimessage,
    focuses,
    selectedFocus,
    setSelectedFocus,
    customFocus,
    setCustomFocus,
    regenerateList, 
    handleFocusSelection
}) => {
    const isCustomFocusEmpty = customFocus.trim() === "";

    return (
        <>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                Step 2: Select or Input Focus for Observation
            </h2>

            {aimessage && (
                <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow mb-4 text-center">
                    <p className="font-semibold">AI Message:</p>
                    <p>{aimessage}</p>
                </div>
            )}

            <div className="space-y-3 max-w-xl mx-auto">
                {/* List of Focus Items */}
                {focuses.length > 0 ? (
                    focuses.map((focus, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="radio"
                                id={`focus-${idx}`}
                                name="focus"
                                value={focus}
                                checked={selectedFocus === focus}
                                onChange={() => setSelectedFocus(focus)}
                            />
                            <label htmlFor={`focus-${idx}`}>{focus}</label>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No available focus options yet.</p>
                )}

                {/* Input field for custom focus */}
                <div className="mt-4">
                    <label className="block text-sm font-medium">Input Custom Focus for Regenerating Choices</label>
                    <input
                        type="text"
                        required
                        className="w-full border rounded p-2"
                        value={customFocus}
                        onChange={(e) => setCustomFocus(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => regenerateList("focus", customFocus, 5)} // Use the generalized regenerate function
                        className={`px-4 py-2 rounded text-white ${
                            isCustomFocusEmpty
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                        disabled={isCustomFocusEmpty}
                    >
                        Regenerate Focus List
                    </button>
                    <button
                        onClick={handleFocusSelection}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        disabled={!selectedFocus && !customFocus}
                    >
                        Confirm and Continue
                    </button>
                </div>
            </div>
        </>
    );
};

export default Step2Focus;
