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

  function GETGen(url, onSuccess) {
    fetch(`${url}`, {
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
  const [selectedFocus, setSelectedFocus] = useState([]);
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


    const checkConnection = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.error("Ai Server is not responding");
        return;
      }

      try {
        // This line 'awaits' (waits for) the fetch promise to resolve
        const response = await fetch(`${apiUrl}/stats`);

        const data = await response.json();

        if (data.status === 'okay') {
          setaimessage(data.message)
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
    fetchAllPatientRecords();
  }, []);

  const resetDataExceptName = () => {
    setPatientID("");
    setDiagnosisDate("");
    setDiagnosisTime("");
    setAssessedData("");

    // Step 2
    setFocus([]);
    setSelectedFocus([]);

    // Step 3
    setDiagnoses([]);
    setSelectedDiagnosis("");

    // Step 4
    setListOfActions([]);
    setSelectedAction("");

    // Step 5
    setResponseListOutput([]);
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
          setFocus(data.generatedselections.items);
        } else if (section === "diagnosis") {
          setDiagnoses(data.generatedselections.items);
        } else if (section === "action") {
          setListOfActions(data.generatedselections.items);
        }
        setaimessage(data.AImessage); // Set AI message
      } else {
        console.error(`Failed to regenerate ${section} list:`, data);
      }
    });
  };

  const handleStep0to1 = () => { setStep(1); fetchAllPatientRecords(); };

  // Generate Focus List and Set Patient
  const handleStep1to2 = () => {
    // Prepare the patient payload dynamically
    const patientpayload = {
      name: patientName,
      datetime: `${diagnosisDate} ${diagnosisTime}`,
      diagnosis: assessedData
    };

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
      payload: JSON.stringify(patientpayload),
    }).toString();

    const query1 = new URLSearchParams({
      payload: JSON.stringify(payload),
    }).toString();


    // If the patient is new or no patientID exists
    if (patientID === "") {
      // First API call: Create a new patient
      GETGen(`${apiUrl}/core/new?${query}`, (data) => {
        if (data.status === "okay") {
          setPatientID(data.id);
          console.log("data output: " + data.id);
          console.log("patientID output: " + patientID);
          GETGen(`${apiUrl}/core/generate/${data.id}?${query1}`, (focusData) => {
            if (focusData.status === "okay") {
              setFocus(focusData.generatedselections.items);
              setaimessage(focusData.aimessage);
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
          setFocus(focusData.generatedselections.items);
          setaimessage(focusData.aimessage);
          setStep(2); // Move to the next step
        } else {
          console.error("Failed to get initial focus list:", focusData);
        }
      });
    }
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
      prompt: "",
      amount: 5,
    };

    const payload = {
      intent: "generate",
      selection: {
        section: "data",
        items: [],
      },
      prompt: "",
      amount: 5,
    };

    const query = new URLSearchParams({
      payload: JSON.stringify(setfocuspayload),
    }).toString();

    const query1 = new URLSearchParams({
      payload: JSON.stringify(payload),
    }).toString();

    GETGen(`${apiUrl}/core/generate/${patientID}?${query}`, (DiagData) => {
      if (DiagData.status === "okay") {
        GETGen(`${apiUrl}/core/generate/${patientID}?${query1}`, (DiagData) => {
          if (DiagData.status === "okay") {
            setDiagnoses(DiagData.generatedselections.items);
            setaimessage(DiagData.aimessage);
            setStep(3);
          } else {
            console.error("Failed to get diagnosis list:", DiagData);
          }
        });
      } else {
        console.error("Failed to get diagnosis list:", DiagData);
      }
    });


  };

  // Generate Actions and Set Diagnosis
  const handleStep3to4 = () => {
    const setdiagpayload = {
      intent: "set",
      selection: {
        section: "data",
        items: selectedDiagnosis,
      },
      prompt: "",
      amount: 10,
    };

    const payload = {
      intent: "generate",
      selection: {
        section: "data",
        items: [],
      },
      prompt: "",
      amount: 10,
    };

    const query = new URLSearchParams({
      payload: JSON.stringify(setdiagpayload),
    }).toString();

    const query1 = new URLSearchParams({
      payload: JSON.stringify(payload),
    }).toString();

    GETGen(`${apiUrl}/core/generate/${patientID}?${query}`, (DiagData) => {
      if (DiagData.status === "okay") {
        GETGen(`${apiUrl}/core/generate/${patientID}?${query1}`, (DiagData) => {
          if (DiagData.status === "okay") {
            setListOfActions(DiagData.generatedselections.items);
            setaimessage(DiagData.aimessage);
            setStep(4);
          } else {
            console.error("Failed to get actions list:", DiagData);
          }
        });
      } else {
        console.error("Failed to get actions list:", DiagData);
      }
    });
  };

  // Generate Responses, Output FDAR and Set Actions
  const handleStep4to5 = () => {
    const combinedActions = [...selectedAction];

    const setactionpayload = {
      intent: "set",
      selection: {
        section: "action",
        items: combinedActions,
      },
      prompt: "",
      amount: 5,
    };

    const payload = {
      intent: "generate",
      selection: {
        section: "action",
        items: [],
      },
      prompt: "",
      amount: 5,
    };

    const query = new URLSearchParams({
      payload: JSON.stringify(setactionpayload),
    }).toString();

    const query1 = new URLSearchParams({
      payload: JSON.stringify(payload),
    }).toString();


    GETGen(`${apiUrl}/core/generate/${patientID}?${query}`, (ResData) => {
      if (ResData.status === "okay") {
        GETGen(`${apiUrl}/core/generate/${patientID}?${query1}`, (ResData) => {
          if (ResData.status === "okay") {
            setResponseListOutput(ResData.generatedselections.items);
            setaimessage(ResData.aimessage);
            finalizeAndSave();
            setStep(5);
          } else {
            console.error("Failed to get action list:", DiagData);
          }
        });
      } else {
        console.error("Failed to get action list:", DiagData);
      }
    });
  };

  // Output FDAR with complete details
  const handleStep5to6 = () => {


    const setrespayload = {
      intent: "set",
      selection: {
        section: "response",
        items: responseListOutput,
      },
      prompt: "",
      amount: 5
    };

    const query = new URLSearchParams({
      payload: JSON.stringify(setrespayload),
    }).toString();

    GETGen(`${apiUrl}/core/generate/${patientID}?${query}`, (ResData) => {

      fetchAllPatientFDARRecords(patientID);

      console.log(fdarData);
      // Move to Step 5 directly
      setStep(6);

    });
  }

  const finalizeAndSave = () => {

    GETGen(`${apiUrl}/core/final/${patientID}`, (finalData) => {
      if (finalData.status === "okay") {
        console.log("FDAR finalized successfully:", finalData);
      } else {
        console.error("Failed to finalize FDAR:", finalData);
      }
    });


  }
  //For Save FDAR Button
  //Error here part
  const handleSamePatientData = () => {
    resetDataExceptName();
    setStep(1);
  }

  //Error here part
  const handleNewPatientData = () => {
    resetDataExceptName();
    setPatientID("");
    setStep(1);
  };


  //Error here part
  const [patientHistory, setPatientHistory] = useState([]);
  const [patientRecords, setPatientRecords] = useState({});
  //Error here part

  // Fetch All Patient List (names and IDs)
  const fetchAllPatientRecords = () => {
    GETGen(`${apiUrl}/data/retrieve`, (response) => {

      setPatientHistory(response.patients);
      console.log(response);
    });
  };
  //fetching works
  // Fetch All FDAR Records for a Specific Patient
  const fetchAllPatientFDARRecords = (patientID) => {
    GETGen(`${apiUrl}/data/retrieve/${patientID}`, (finalData) => {

      const formattedPatientData = {
        nurse: currentUser, // or you can add a real nurse name if you have
        patient: {
          name: finalData.name || "Unnamed Patient",
          datetime: finalData.dateTime || new Date().toISOString(),
        },
        fdar: finalData.fdar || [],
      };
      setPatientRecords(formattedPatientData);  // Set it in correct format
      console.log("Formatted Data" + formattedPatientData);
      console.log("Patient Records " + patientRecords);

    });
  };



  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
      <div className="w-1/4 bg-white bg-opacity-50 shadow-lg p-6 flex flex-col justify-between backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {currentUser}</h2>

        <nav className="space-y-4 max-h-96 overflow-y-auto pr-2">
          <p className="block text-purple-600 font-semibold">Patient List</p>

          {patientHistory.length > 0 ? (
            patientHistory.map((patient, index) => (
              <div key={index} className="flex justify-between items-center">
                <button
                  onClick={() => {
                    fetchAllPatientFDARRecords(patient.ID);
                    setFdarData(patientRecords);
                    setStep(6);
                  }}
                  className="text-sm text-left text-gray-700 hover:text-purple-700 font-medium"
                >
                  {patient.name || "Unnamed Patient"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No patients found.</p>
          )}

          <Link to="/" className="block text-red-500 font-semibold hover:text-red-700 mt-4">
            Logout
          </Link>
        </nav>


      </div>
      <div className="w-3/4 flex flex-col p-4 max-h-screen overflow-y-auto">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col">
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
              fdarData={patientRecords}
              handleGenerateWithSameData={handleSamePatientData}
              handleNewPatientData={handleNewPatientData}
              resetDataExceptName={resetDataExceptName}
              setFocus={setFocus}
              setaimessage={setaimessage}
              setStep={setStep}
              setAssessedData={setAssessedData}
              apiUrl={apiUrl}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default FDARGenAI;
