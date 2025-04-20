const Step1PatientInfo = ({ patientName, setPatientName, diagnosisDate, setDiagnosisDate, diagnosisTime, setDiagnosisTime, assessedData, setAssessedData, onNext }) => {
    return (
      <>
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Step 1: Patient Information</h2>
        <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium">Patient Name</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Date of Diagnosis</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2"
                    value={diagnosisDate}
                    onChange={(e) => setDiagnosisDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Time of Diagnosis</label>
                  <input
                    type="time"
                    className="w-full border rounded p-2"
                    value={diagnosisTime}
                    onChange={(e) => setDiagnosisTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Assessed Patient Data</label>
                  <textarea
                    className="w-full border rounded p-2"
                    rows="4"
                    value={assessedData}
                    onChange={(e) => setAssessedData(e.target.value)}
                  ></textarea>
                </div>
                
              </div>

          <button onClick={onNext} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Submit and Continue
          </button>

      </>
    );
  };
  
  export default Step1PatientInfo;
  