const Step5FDARChart = ({ fdarData, existingFDAR, handleGenerateWithSameData }) => {
  const { nurse, patient, fdar = [] } = fdarData || {};

  const isFDARGenerated = fdar.length > 0;

  const handleSaveFDAR = () => {
    const savedFDARs = JSON.parse(localStorage.getItem("savedFDARs")) || [];
    const newEntry = {
      nurse,
      patient: {
        name: patient?.name || "Unknown",
        datetime: patient?.datetime || "0000-00-00T00:00",
      },
      fdar: fdar || [],
    };
    const updatedFDARs = [...savedFDARs, newEntry];
    localStorage.setItem("savedFDARs", JSON.stringify(updatedFDARs));
    alert("FDAR form saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {!isFDARGenerated ? (
        <div className="text-center text-gray-500 text-lg py-20">
          No FDAR generated yet. Please go back and complete the steps.
        </div>
      ) : (
        <>
          {/* Header Info */}
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Step 5: FDAR Chart</h2>

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <p className="font-semibold">Nurse: {nurse}</p>
            <p className="font-semibold">Patient: {patient?.name}</p>
            <p className="font-semibold">Date & Time: {new Date(patient?.datetime).toLocaleString()}</p>
          </div>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Focus</th>
                <th className="p-2 border">Data</th>
                <th className="p-2 border">Action</th>
                <th className="p-2 border">Response</th>
              </tr>
            </thead>
            <tbody>
              {fdar.map((entry, idx) => {
                const { focus = [], data = [], action = [], response = [] } = entry;
                const rowCount = Math.max(focus.length, data.length, action.length, response.length, 1);

                return Array.from({ length: rowCount }).map((_, subIdx) => (
                  <tr key={`${idx}-${subIdx}`} className={subIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-2 border align-top">{focus[subIdx] || (subIdx === 0 ? "N/A" : "")}</td>
                    <td className="p-2 border align-top">{data[subIdx] || ""}</td>
                    <td className="p-2 border align-top">{action[subIdx] || ""}</td>
                    <td className="p-2 border align-top">{response[subIdx] || ""}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>

          <div className="text-center space-x-4 mt-6">
            <button
              onClick={handleGenerateWithSameData}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Generate New FDAR (Same Patient)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Generate New FDAR (New Patient)
            </button>
            <button
              onClick={handleSaveFDAR}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save FDAR
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Step5FDARChart;
