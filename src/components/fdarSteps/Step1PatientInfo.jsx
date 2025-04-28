const Step1PatientInfo = ({ patientName, setPatientName, diagnosisDate, setDiagnosisDate, diagnosisTime, setDiagnosisTime, assessedData, setAssessedData, onNext }) => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto p-12">
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
        Step 1: Patient Information
      </h2>

      <div className="space-y-8">
        {/* Patient Name */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-4 mt-2 text-lg focus:outline-none focus:ring-3 focus:ring-purple-600"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient's full name"
          />
        </div>

        {/* Date of Diagnosis */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Date of Diagnosis</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-4 mt-2 text-lg focus:outline-none focus:ring-3 focus:ring-purple-600"
            value={diagnosisDate}
            onChange={(e) => setDiagnosisDate(e.target.value)}
          />
        </div>

        {/* Time of Diagnosis */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Time of Diagnosis</label>
          <input
            type="time"
            className="w-full border border-gray-300 rounded-lg p-4 mt-2 text-lg focus:outline-none focus:ring-3 focus:ring-purple-600"
            value={diagnosisTime}
            onChange={(e) => setDiagnosisTime(e.target.value)}
          />
        </div>

        {/* Assessed Patient Data */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Assessed Patient Data</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-4 mt-2 text-lg focus:outline-none focus:ring-3 focus:ring-purple-600"
            rows="6"
            value={assessedData}
            onChange={(e) => setAssessedData(e.target.value)}
            placeholder="Enter patient's assessed data"
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={onNext} 
          className="bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-800 focus:outline-none focus:ring-3 focus:ring-purple-600"
        >
          Submit and Continue
        </button>
      </div>
    </div>
  );
};

export default Step1PatientInfo;
