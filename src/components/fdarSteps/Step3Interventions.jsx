const Step3Interventions = ({
    aimessage,
    listOfActions,
    selectedAction,
    setSelectedAction,
    customAction,
    setCustomAction,
    regenerateActionList,
    handleActionConfirm
  }) => {
    const isCustomActionEmpty = !customAction || customAction.trim() === "";
  
    return (
      <>
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Step 3: Select or Input Nursing Intervention
        </h2>
  
        {aimessage && (
          <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow mb-4 text-center">
            <p className="font-semibold">AI Message:</p>
            <p>{aimessage}</p>
          </div>
        )}
  
        <div className="space-y-3 max-w-xl mx-auto">
          {listOfActions.map((action, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                id={`action-${idx}`}
                name="action"
                value={action}
                checked={selectedAction === action}
                onChange={() => setSelectedAction(action)}
              />
              <label htmlFor={`action-${idx}`}>{action}</label>
            </div>
          ))}
  
          <div className="mt-4">
            <label className="block text-sm font-medium">
              Input specific observations to focus on (for regenerating suggestions)
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
              onClick={regenerateActionList}
              className={`px-4 py-2 rounded text-white ${isCustomActionEmpty
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              disabled={isCustomActionEmpty}
            >
              Regenerate List
            </button>
            <button
              onClick={handleActionConfirm}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              disabled={!selectedAction && !customAction}
            >
              Confirm and Continue
            </button>
          </div>
        </div>
      </>
    );
  };
  
  export default Step3Interventions;
  