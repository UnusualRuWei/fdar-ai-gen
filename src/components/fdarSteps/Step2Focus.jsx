import { useState } from "react";

const Step2Focus = ({
  aimessage,
  focuses,
  selectedFocus,
  setSelectedFocus,
  onNext,
}) => {
  const [customFocus, setCustomFocus] = useState("");

  const isCustomFocusEmpty = customFocus.trim() === "";

  return (
    <>
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
        Step 2: Select or Input Focus for Observation
      </h2>

      {aimessage && (
        <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow-lg mb-8 text-center">
          <p className="font-semibold text-lg">AI Message:</p>
          <p className="text-lg">{aimessage}</p>
        </div>
      )}

      <div className="space-y-8 max-w-4xl mx-auto p-12 rounded-lg ">
        {/* List of Focus Items */}
        {focuses.length > 0 ? (
          focuses.map((focus, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <input
                type="radio"
                id={`focus-${idx}`}
                name="focus"
                value={focus}
                checked={selectedFocus === focus}
                onChange={() => setSelectedFocus(focus)}
                className="focus:ring-3 focus:ring-purple-600"
              />
              <label htmlFor={`focus-${idx}`} className="text-lg text-gray-800">
                {focus}
              </label>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg">No available focus options yet.</p>
        )}

        {/* Input field for custom focus */}
        {/* <div className="mt-6">
          <label className="block text-lg font-medium text-gray-700">Input Custom Focus for Regenerating Choices</label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg p-4 mt-3 text-lg focus:outline-none focus:ring-3 focus:ring-purple-600"
            value={customFocus}
            onChange={(e) => setCustomFocus(e.target.value)}
            placeholder="Enter custom focus here"
          />
        </div> */}

        {/* Buttons */}
        <div className="flex gap-8 mt-8 justify-center">
          {/* <button
            onClick={() => regenerateList("focus", customFocus, 5)}
            className={`px-8 py-4 rounded-lg text-white ${isCustomFocusEmpty
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            disabled={isCustomFocusEmpty}
          >
            Regenerate Focus List
          </button> */}
          <button
            onClick={onNext}
            className="bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-800 focus:outline-none focus:ring-3 focus:ring-purple-600"
          >
            Confirm and Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default Step2Focus;
