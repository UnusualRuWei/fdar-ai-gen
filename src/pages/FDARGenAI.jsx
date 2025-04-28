import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Welcomeuser from "../components/fdarSteps/Welcomeuser";
import Step1PatientInfo from "../components/fdarSteps/Step1PatientInfo";
import Step2Focus from "../components/fdarSteps/Step2Focus";
import Step3Diagnosis from "../components/fdarSteps/Step3Diagnosis";
import Step4Interventions from "../components/fdarSteps/Step4Interventions";
import Step5ActionResponse from "../components/fdarSteps/Step5ActionResponse";
import Step6FDARChart from "../components/fdarSteps/Step6FDARChart";

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

  //Current FDAR Container and Step state
  const [step, setStep] = useState(0);
  const [fdarData, setFdarData] = useState({});
  //Set URL for Request
  const [apiUrl, setApiUrl] = useState("")
  //Related to Step 0 and user info
  const [currentUser, setUser] = useState("");
  const [aimessage, setaimessage] = useState("");

  //Related to Step 1
  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [diagnosisTime, setDiagnosisTime] = useState("");
  const [assessedData, setAssessedData] = useState("");
  //Related to Step 2
  const [focuses, setFocus] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState("");
  //Related to Step 3
  const [diagnoses, setDiagnoses] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  //Related to Step 4
  const [listOfActions, setListOfActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  //Related to Step 5
  const [responseListOutput, setResponseListOutput] = useState([]);
  const [recentFDARs, setRecentFDARs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedFDARs")) || [];
    if (Array.isArray(stored)) {
      setRecentFDARs(stored);
    }

    const currUser = JSON.parse(localStorage.getItem("user"));
    setUser(currUser.FName + " " + currUser.LName);

    //Procedure 1 on filling FDAR is to check connection
    const checkConnection = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.error("Ai Server is not responding");
        return;
      }

      try {
        // This line 'awaits' (waits for) the fetch promise to resolve
        const response = await fetch(`${apiUrl}/status`);

        if (!response.ok) {
          console.error("error");
          // ... log error ...
          return;
        }

        // This line 'awaits' (waits for) the JSON parsing promise to resolve
        const data = await response.json();

        // Update state based on the data - this triggers a UI update
        if (data.status === 'success') {
          fetch(`${apiUrl}/core/newFDAR`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((data) => setaimessage(data.message))
            .catch((error) => console.error("Error fetching welcome message:", error));
          setApiUrl(apiUrl);
        } else {
          console.error("no data");
        }

      } catch (error) {
        // Update state based on the error - this triggers a UI update
        setStatus('error');
        setMessage(`Failed to connect to server: ${error.message}`);
        // ... log error ...
      }
    };
    //End of Procedure 1
    // Call the async function defined above
    checkConnection();

  }, []);

  const handleDeleteFDAR = (index) => {
    const updated = [...recentFDARs];
    updated.splice(index, 1);
    setRecentFDARs(updated);
    localStorage.setItem("savedFDARs", JSON.stringify(updated));
  };

  //Regenerates List
  const regenerateList = (section, customInput, amount) => {
    if (!patientID) return;

    const payload = {
      intent: "generate",
      selection: {
        section: section, // Dynamically set the section (focus, diagnosis, action)
        items: [],
      },
      prompt: customInput ?? null, // Use customInput (could be customFocus, customDiagnosis, or customAction)
      amount: amount,
    };

    const query = new URLSearchParams({
      payload: JSON.stringify(payload),
    }).toString();

    GETGen(`${apiUrl}/core/generate/${patientID}?${query}`, (data) => {
      if (data.status === "okay") {
        // Update the corresponding state based on the section
        if (section === "focus") {
          setFocus(data.generatedSelections.items);
        } else if (section === "diagnosis") {
          setDiagnoses(data.generatedSelections.items);
        } else if (section === "action") {
          setListOfActions(data.generatedSelections.items);
        }
        setaimessage(data.AImessage); // Set AI message
      } else {
        console.error(`Failed to regenerate ${section} list:`, data);
      }
    });
  };

  const handleStep0to1 = () => setStep(1);

  // Generate Focus List and Set Patient
  const handleStep1to2 = () => {
    // Prepare the patient payload dynamically
    const patientpayload = {
      name: patientName,
      dateTime: `${diagnosisDate} ${diagnosisTime}`,
      diagnosis: assessedData,
    };

    // Query string with the payload
    const query = new URLSearchParams({
      payload: JSON.stringify(patientpayload),
    }).toString();

    // If the patient is new or no patientID exists
    if (!patientID) {
      // First API call: Create a new patient
      GETGen(`${apiUrl}/core/new?${query}`, (data) => {
        if (data.Status === "ok") {
          const newPatientID = data.ID;
          setPatientID(newPatientID);

          // Second call: Get the initial focus list for the new patient (NO payload)
          GETGen(`${apiUrl}/core/generate/${newPatientID}`, (focusData) => {
            if (focusData.status === "okay") {
              setFocus(focusData.generatedSelections.items);
              setaimessage(focusData.AImessage);
              setStep(2); // Move to the next step
            } else {
              console.error("Failed to get initial focus list:", focusData);
            }
          });
        } else {
          console.error("Failed to create patient:", data);
        }
      });
    } else {
      // If patientID exists (existing patient), fetch focus list using the existing patientID
      GETGen(`${apiUrl}/core/generate/${patientID}`, (focusData) => {
        if (focusData.status === "okay") {
          setFocus(focusData.generatedSelections.items);
          setaimessage(focusData.AImessage);
          setStep(2); // Move to the next step
        } else {
          console.error("Failed to get initial focus list:", focusData);
        }
      });
    }
    
    setStep(2);
  };


  //Handle Regenerate data with same patient


  // Generate Diagnoses and Set Focus
  const handleStep2to3 = () => {
    const setfocuspayload = {
      intent: "set",
      selection: {
        section: "focus",
        items: selectedFocus,
      },
      prompt: null,
      amount: 5,
    };

    const query = new URLSearchParams({
      payload: JSON.stringify(setfocuspayload),
    }).toString();

    // GETGen(`${apiUrl}/core/generate/${patientID}?${query.payload}`, (DiagData) => {
    //   if (DiagData.status === "okay") {
    //     setListOfDiagnosis(DiagData.generatedSelections.items);
    //     setaimessage(DiagData.AImessage);
    //     setStep(3);
    //   } else {
    //     console.error("Failed to get diagnosis list:", DiagData);
    //   }
    // });

    setStep(3);
  };

  // Generate Actions and Set Diagnosis
  const handleStep3to4 = () => {
    const setdiagpayload = {
      intent: "set",
      selection: {
        section: "data",
        items: diagnoses,
      },
      prompt: null,
      amount: 10,
    };

    const query = new URLSearchParams({
      payload: JSON.stringify(setdiagpayload),
    }).toString();

    // GETGen(`${apiUrl}/core/generate/${patientID}?${query.payload}`, (DiagData) => {
    //   if (DiagData.status === "okay") {
    //     setListOfActions(DiagData.generatedSelections.items);
    //     setaimessage(DiagData.AImessage);
    //     setStep(4);
    //   } else {
    //     console.error("Failed to get actions list:", DiagData);
    //   }
    // });
    setStep(4);
  };

  // Generate Responses, Output FDAR and Set Actions
  const handleStep4to5 = () => {
    // const combinedActions = [...selectedAction];
    // if (customAction.trim()) {
    //   combinedActions.push(customAction.trim());
    // }

    // const setactionpayload = {
    //   intent: "set",
    //   selection: {
    //     section: "action",
    //     items: combinedActions,
    //   },
    //   prompt: null,
    //   amount: 5,
    // };

    // const query = new URLSearchParams({
    //   payload: JSON.stringify(setactionpayload),
    // }).toString();

    // GETGen(`${apiUrl}/core/generate/${patientID}?${query.payload}`, (ResData) => {
    //   if (ResData.status === "okay") {
    //     setResponseListOutput(ResData.generatedSelections.items);
    //     setaimessage(ResData.AImessage);
    //     setStep(5);
    //   } else {
    //     console.error("Failed to get action list:", DiagData);
    //   }
    // });
    setStep(5);
  };

  // Output FDAR with complete details
  const handleStep5to6 = () => {

    const newEntry = {
      nurse: currentUser,
      patient: {
        name: patientName || "Unknown",
        datetime: `${diagnosisDate || "0000-00-00"}T${diagnosisTime || "00:00"}`,
      },
      focus: selectedFocus || "null",
      data: selectedDiagnosis || "null",
      action: selectedAction || [],
      response: responseListOutput || [],
    };

    // Set FDAR data to state
    setFdarData(newEntry);

    // Move to Step 5 directly
    setStep(6);
  };
  //For Save FDAR Button
  const finalizeAndSave = () => {

    GETGen(`${apiUrl}/core/final/${patientID}`, (finalData) => {
      if (finalData.Status === "ok") {
        console.log("FDAR finalized successfully:", finalData);
      } else {
        console.error("Failed to finalize FDAR:", finalData);
      }
    });

  }

  const handleSamePatientData = () => {
    finalizeAndSave
    setStep(1);

  }

  //Handle Regenerate data with new patient
  const handleNewPatientData = () => {


  }

  //Fetch All Record
  const fetchAllRecords = () => {

  }
  //

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
          {step === 0 && <Welcomeuser message={aimessage} handleWelcome={handleStep0to1} />}
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
              onNext={handleStep1to2}
            />
          )}
          {step === 2 && (
            <Step2Focus
              aimessage={aimessage}
              focuses={focuses}
              selectedFocus={selectedFocus}
              setSelectedFocus={setSelectedFocus}
              regenerateList={regenerateList}
              onNext={handleStep2to3}
            />
          )}
          {step === 3 && (
            <Step3Diagnosis
              aimessage={aimessage}
              diagnoses={diagnoses}
              selectedDiagnosis={selectedDiagnosis}
              setSelectedDiagnosis={setSelectedDiagnosis}
              regenerateList={regenerateList}
              onNext={handleStep3to4}
            />
          )}
          {step === 4 && (
            <Step4Interventions
              aimessage={aimessage}
              listOfActions={listOfActions}
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
              regenerateList={regenerateList}
              onNext={handleStep4to5}
            />
          )}
          {step === 5 && (
            <Step5ActionResponse
              responseListOutput={responseListOutput}
              onNext={handleStep5to6}
            />
          )}
          {step === 6 && (
            <Step6FDARChart
              fdarData={fdarData}  // Ensure this is the complete fdarData object
              existingFDAR={fdarData?.fdar && fdarData.fdar.length > 0}  // Check if there is any existing FDAR
              onSamePatient={fdarData?.patient?.name || "Unknown Patient"}  // Assuming patient has a name or fallback to "Unknown"
              onNewPatient={setStep}  // Set the next step for new patient
              onSaveFDAR={finalizeAndSave}  // Finalize and save logic
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FDARGenAI;
