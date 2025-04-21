import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Welcomeuser from "../components/fdarSteps/Welcomeuser";
import Step1PatientInfo from "../components/fdarSteps/Step1PatientInfo";
import Step2Diagnosis from "../components/fdarSteps/Step2Diagnosis";
import Step3Interventions from "../components/fdarSteps/Step3Interventions";
import Step4ActionResponse from "../components/fdarSteps/Step4ActionResponse";
import Step5FDARChart from "../components/fdarSteps/Step5FDARChart";

function FDARGenAI() {
  function buildQueryString(payload) {
    return new URLSearchParams({
      section: payload.section,
      data: payload.data,
      purpose: payload.purpose,
    }).toString();
  }

  function GETGen(url, query, onSuccess) {
    fetch(`${url}?${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from API:", data);
        if (onSuccess) onSuccess(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const [currentUser, setUser] = useState("");
  const [aimessage, setaimessage] = useState("");
  const [step, setStep] = useState(0);
  const [fdarData, setFdarData] = useState({});

  const [patientName, setPatientName] = useState("");
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [diagnosisTime, setDiagnosisTime] = useState("");
  const [assessedData, setAssessedData] = useState("");

  const [diagnoses, setDiagnoses] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  const [customDiagnosis, setCustomDiagnosis] = useState("");

  const [listOfActions, setListOfActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [customAction, setCustomAction] = useState("");

  const [mainfocus, setFocus] = useState("");

  const [responseListOutput, setResponseListOutput] = useState([]);
  const [recentFDARs, setRecentFDARs] = useState([]);

  // Fetch welcome message once
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedFDARs")) || [];
    if (Array.isArray(stored)) {
      setRecentFDARs(stored);
    }
    const currUser = JSON.parse(localStorage.getItem("user"));
    setUser(currUser.FName + " " + currUser.LName);
    fetch(`http://localhost:5000/core/newFDAR`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setaimessage(data.message))
      .catch((error) => console.error("Error fetching welcome message:", error));
  }, []);

  const handleDeleteFDAR = (index) => {
    const updated = [...recentFDARs];
    updated.splice(index, 1);
    setRecentFDARs(updated);
    localStorage.setItem("savedFDARs", JSON.stringify(updated));
  };

  const handleWelcomeStart = () => setStep(1);

  const handleNextStep = () => {
    const payload = {
      section: null,
      data: null,
      purpose: `The patient's name is ${patientName}. Time: ${diagnosisDate} ${diagnosisTime}. ${assessedData}`,
    };
    const query = buildQueryString(payload);
    GETGen("http://localhost:5000/core/generate", query, (data) => {
      if (Array.isArray(data.data)) setDiagnoses(data.data);
      setaimessage(data.message);
      setStep(2);
    });
    setFdarData(payload);
  };

  const handleDiagnosisSelection = () => {
    const payload = { section: "action", data: selectedDiagnosis || customDiagnosis, purpose: null };
    const query = buildQueryString(payload);
    GETGen("http://localhost:5000/core/generate", query, (data) => {
      if (Array.isArray(data.action)) setListOfActions(data.action);
      setaimessage(data.message);
      setStep(3);
    });
  };

  const regenerateDiagnosisList = () => {
    const payload = { section: "data", data: null, purpose: `Regenerate based on: ${customDiagnosis}` };
    const query = buildQueryString(payload);
    GETGen("http://localhost:5000/core/generate", query, (data) => {
      if (Array.isArray(data.data)) setDiagnoses(data.data);
      setaimessage(data.message);
    });
  };

  const handleActionConfirm = () => {
    const combinedActions = [...selectedAction];
    if (customAction.trim()) {
      combinedActions.push(customAction.trim());
    }
  
    const payload = { section: "response", data: combinedActions, purpose: null };
    console.log(payload);
  
    const query = buildQueryString(payload);
    GETGen("http://localhost:5000/core/generate", query, (data) => {
      if (Array.isArray(data.response)) setResponseListOutput(data.response);
      setaimessage(data.message);
      setFocus(data.focus);
      setStep(4);
    });
  };
  
  const regenerateActionList = () => {
    const payload = { section: "action", data: null, purpose: `Regenerate actions based on: ${customAction}` };
    const query = buildQueryString(payload);
    GETGen("http://localhost:5000/core/generate", query, (data) => {
      if (Array.isArray(data.action)) setListOfActions(data.action);
      setaimessage(data.message);
    });
  };

  const handleContinueToFDARView = () => {
    const newEntry = {
      nurse: currentUser,
      patient: {
        name: patientName || "Unknown",
        datetime: `${diagnosisDate || "0000-00-00"}T${diagnosisTime || "00:00"}`,
      },
      focus: mainfocus || "N/A",
      data: assessedData +". " + selectedDiagnosis ? [selectedDiagnosis] : (diagnoses || []),
      action: selectedAction ? [selectedAction] : (listOfActions || []),
      response: responseListOutput || [],
    };

    // Set FDAR data to state
    setFdarData(newEntry);

    // Move to Step 5 directly
    setStep(5);
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
      <div className="w-1/4 bg-white bg-opacity-50 shadow-lg p-6 flex flex-col justify-between backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {currentUser}</h2>

        <nav className="space-y-4">
          <p className="block text-purple-600 font-semibold">Recently Generated Results</p>

          {recentFDARs.length > 0 ? (
            recentFDARs.map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setFdarData(entry);
                    setStep(5);
                  }}
                  className="text-sm text-left text-gray-700 hover:text-purple-700 font-medium"
                >
                  {entry?.patient?.name || "Unnamed"} ({new Date(entry?.patient?.datetime || "").toLocaleDateString("en-US")})
                </button>
                <button
                  onClick={() => {
                    const updated = recentFDARs.filter((_, i) => i !== index);
                    setRecentFDARs(updated);
                    localStorage.setItem("savedFDARs", JSON.stringify(updated));
                  }}
                  className="text-red-500 font-bold ml-2"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No entries yet.</p>
          )}

          <Link to="/" className="block text-red-500 font-semibold hover:text-red-700 mt-4">
            Logout
          </Link>
        </nav>

      </div>
      <div className="w-3/4 flex flex-col p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col h-full">
          {step === 0 && <Welcomeuser message={aimessage} handleWelcome={handleWelcomeStart} />}
          {step === 1 && (
            <Step1PatientInfo
              patientName={patientName}
              setPatientName={setPatientName}
              diagnosisDate={diagnosisDate}
              setDiagnosisDate={setDiagnosisDate}
              diagnosisTime={diagnosisTime}
              setDiagnosisTime={setDiagnosisTime}
              assessedData={assessedData}
              setAssessedData={setAssessedData}
              onNext={handleNextStep}
            />
          )}
          {step === 2 && (
            <Step2Diagnosis
              aimessage={aimessage}
              diagnoses={diagnoses}
              selectedDiagnosis={selectedDiagnosis}
              setSelectedDiagnosis={setSelectedDiagnosis}
              customDiagnosis={customDiagnosis}
              setCustomDiagnosis={setCustomDiagnosis}
              regenerateDiagnosisList={regenerateDiagnosisList}
              handleDiagnosisSelection={handleDiagnosisSelection}
            />
          )}
          {step === 3 && (
            <Step3Interventions
              aimessage={aimessage}
              listOfActions={listOfActions}
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
              customAction={customAction}
              setCustomAction={setCustomAction}
              regenerateActionList={regenerateActionList}
              handleActionConfirm={handleActionConfirm}
            />
          )}
          {step === 4 && (
            <Step4ActionResponse
              responseListOutput={responseListOutput}
              handleContinueToFDARView={handleContinueToFDARView}
            />
          )}
          {step === 5 && <Step5FDARChart fdarData={fdarData} />}
        </div>
      </div>
    </div>
  );
}

export default FDARGenAI;
