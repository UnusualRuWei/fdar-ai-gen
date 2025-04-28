import { useState } from "react";

const Step3Diagnosis = ({
  aimessage,
  diagnoses,
  selectedDiagnosis,
  setSelectedDiagnosis,
  regenerateDiagnosisList,
  onNext,
}) => {

  const [customDiagnosis, setCustomDiagnosis] = useState("");
  const isCustomDiagnosisEmpty = customDiagnosis.trim() === "";

  return (
    <>
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
        Step 3: Select or Input Nursing Diagnosis
      </h2>

      {aimessage && (
        <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow mb-8 text-center">
          <p className="font-semibold">AI Message:</p>
          <p>{aimessage}</p>
        </div>
      )}

      <div className="space-y-6 max-w-3xl mx-auto">
        {/* List of Diagnoses */}
        {diagnoses.length > 0 ? (
          diagnoses.map((diag, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <input
                type="radio"
                id={`diag-${idx}`}
                name="diagnosis"
                value={diag}
                checked={selectedDiagnosis === diag}
                onChange={() => setSelectedDiagnosis(diag)}
                className="h-5 w-5"
              />
              <label htmlFor={`diag-${idx}`} className="text-lg">{diag}</label>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No available Diagnoses options yet.</p>
        )}

        {/* Input field for custom diagnosis */}
        <div className="mt-6">
          <label className="block text-lg font-medium text-gray-700">
            Input Custom Diagnosis for Regenerating Choices
          </label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg p-4 mt-2 text-lg focus:outline-none focus:ring-3 focus:ring-purple-600"
            value={customDiagnosis}
            onChange={(e) => setCustomDiagnosis(e.target.value)}
          />
        </div>

        <div className="flex gap-6 mt-6">
          <button
            onClick={() => regenerateDiagnosisList("diagnosis", customDiagnosis, 5)}
            className={`px-6 py-3 rounded-lg text-white ${isCustomDiagnosisEmpty
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            disabled={isCustomDiagnosisEmpty}
          >
            Regenerate Diagnosis List
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

export default Step3Diagnosis;
