import { useState } from "react";

const Step4Interventions = ({
  aimessage,
  listOfActions,
  selectedAction,
  setSelectedAction,
  regenerateActionList,
  onNext,
}) => {

  const [customAction, setCustomAction] = useState("");
  const isCustomActionEmpty = customAction.trim() === "";

  const handleCheckboxChange = (action) => {
    if (selectedAction.includes(action)) {
      setSelectedAction(selectedAction.filter((a) => a !== action));
    } else {
      setSelectedAction([...selectedAction, action]);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
        Step 4: Select or Input Nursing Intervention
      </h2>

      {aimessage && (
        <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow mb-8 text-center">
          <p className="font-semibold">AI Message:</p>
          <p>{aimessage}</p>
        </div>
      )}

      <div className="space-y-6 max-w-3xl mx-auto">
        {/* List of Nursing Interventions */}
        {listOfActions.length > 0 ? (
          listOfActions.map((action, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <input
                type="checkbox"
                id={`action-${idx}`}
                name="action"
                value={action}
                checked={selectedAction.includes(action)}
                onChange={() => handleCheckboxChange(action)}
                className="h-5 w-5"
              />
              <label htmlFor={`action-${idx}`} className="text-lg">{action}</label>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No available intervention options yet.</p>
        )}

        {/* Input field for custom action */}
        <div className="mt-6">
          <label className="block text-lg font-medium text-gray-700">
            Input Custom Intervention for Regenerating Choices
          </label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg p-4 mt-2 text-lg focus:outline-none focus:ring-3 focus:ring-purple-600"
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
          />
        </div>

        <div className="flex gap-6 mt-6">
          <button
            onClick={() => regenerateActionList("action", customAction, 5)}
            className={`px-6 py-3 rounded-lg text-white ${isCustomActionEmpty
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            disabled={isCustomActionEmpty}
          >
            Regenerate Intervention List
          </button>
          <button
            onClick={onNext}
            className="bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-800 focus:outline-none focus:ring-3 focus:ring-purple-600"
          >
            Confirm and Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default Step4Interventions;
