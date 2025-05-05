import { useState } from "react";

const PromptModal = ({
  isOpen,
  onClose,
  patientName,
  patientID,
  setAssessedData,
  setFocus,
  setaimessage,
  setStep,
  apiUrl,
  GETGen,
  setPatientID
}) => {
  const [prompt, setPrompt] = useState("");

  const payload = {
    intent: "generate",
    selection: {
      section: "focus",
      items: []
    },
    prompt: "",
    amount: 5
  };

  // Query string with the payload
  const query = new URLSearchParams({
    payload: JSON.stringify(payload),
  }).toString();


  const handleConfirm = () => {
    setAssessedData(prompt);

    GETGen(`${apiUrl}/core/new/${patientID}`, (returndata) => {
      if(returndata.status === "ok"){
        GETGen(`${apiUrl}/core/generate/${patientID}?${query}`, (focusData) => {
          if (focusData.status === "okay") {
            setFocus(focusData.generatedselections.items);
            setaimessage(focusData.aimessage);
            setPatientID(returndata.ID);
            setStep(2);
            onClose(); // Close modal after success
          } else {
            console.error("Failed to get initial focus list:", focusData);
          }
        });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4">
          New Prompt for Same Patient
        </h2>
        <p className="text-lg mb-2">
          Patient: <span className="font-semibold">{patientName}</span>
        </p>
        <textarea
          rows="6"
          className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter new prompt or assessed data"
        />

        <div className="text-center mt-6">
          <button
            onClick={handleConfirm}
            className="bg-purple-700 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-800"
          >
            Confirm and Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
