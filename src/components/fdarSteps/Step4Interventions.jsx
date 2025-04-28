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
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
        Step 4: Select or Input Nursing Intervention
      </h2>

      {aimessage && (
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow mb-4 text-center">
          <p className="font-semibold">AI Message:</p>
          <p>{aimessage}</p>
        </div>
      )}

      <div className="space-y-3 max-w-xl mx-auto">
        {/* List of Nursing Interventions */}
        {listOfActions.length > 0 ? (
          listOfActions.map((action, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`action-${idx}`}
                name="action"
                value={action}
                checked={selectedAction.includes(action)}
                onChange={() => handleCheckboxChange(action)}
              />
              <label htmlFor={`action-${idx}`}>{action}</label>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No available intervention options yet.</p>
        )}

        {/* Input field for custom action */}
        <div className="mt-4">
          <label className="block text-sm font-medium">
            Input Custom Intervention for Regenerating Choices
          </label>
          <input
            type="text"
            required
            className="w-full border rounded p-2"
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => regenerateActionList("action", customAction, 5)}
            className={`px-4 py-2 rounded text-white ${isCustomActionEmpty
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            disabled={isCustomActionEmpty}
          >
            Regenerate Intervention List
          </button>
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Confirm and Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default Step4Interventions;
