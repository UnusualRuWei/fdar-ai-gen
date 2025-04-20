const Step2Diagnosis = ({
  aimessage,
  diagnoses,
  selectedDiagnosis,
  setSelectedDiagnosis,
  customDiagnosis,
  setCustomDiagnosis,
  regenerateDiagnosisList,
  handleDiagnosisSelection
}) => {
  const isCustomDiagnosisEmpty = customDiagnosis.trim() === "";

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
        Step 2: Select or Input Nursing Diagnosis
      </h2>
  
      {aimessage && (
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow mb-4 text-center">
          <p className="font-semibold">AI Message:</p>
          <p>{aimessage}</p>
        </div>
      )}
  
      <div className="space-y-3 max-w-xl mx-auto">
        {diagnoses.map((diag, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="radio"
              id={`diag-${idx}`}
              name="diagnosis"
              value={diag}
              checked={selectedDiagnosis === diag}
              onChange={() => setSelectedDiagnosis(diag)}
            />
            <label htmlFor={`diag-${idx}`}>{diag}</label>
          </div>
        ))}
  
        <div className="mt-4">
          <label className="block text-sm font-medium">Input on what to observation to focus (For Regenerating New Choices)</label>
          <input
            type="text"
            required
            className="w-full border rounded p-2"
            value={customDiagnosis}
            onChange={(e) => setCustomDiagnosis(e.target.value) }
          />
        </div>
  
        <div className="flex gap-4 mt-4">
          <button
            onClick={regenerateDiagnosisList}
            className={`px-4 py-2 rounded text-white ${
              isCustomDiagnosisEmpty
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            disabled={isCustomDiagnosisEmpty}
          >
            Regenerate List
          </button>
          <button
            onClick={handleDiagnosisSelection}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            disabled={!selectedDiagnosis && !customDiagnosis}
          >
            Confirm and Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default Step2Diagnosis;
