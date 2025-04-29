const Step6FDARChart = ({ fdarData, handleNewPatientData, handleGenerateWithSameData }) => {

  const { nurse, patient = {}, fdar = [] } = fdarData;
  const { name, datetime } = patient;

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-8">
      <>
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Step 6: FDAR Chart</h2>

        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Nurse: {nurse}</p>
          <p className="text-lg font-semibold">Patient: {name}</p>
          <p className="text-lg font-semibold">Date & Time: {new Date(datetime).toLocaleString()}</p>
        </div>

        <table className="w-full border-collapse border mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 border text-lg">Focus</th>
              <th className="p-4 border text-lg">Data</th>
              <th className="p-4 border text-lg">Action</th>
              <th className="p-4 border text-lg">Response</th>
            </tr>
          </thead>
          <tbody>
            {fdar.map((entry, idx) => {
              const normalize = (field) =>
                Array.isArray(field) ? field : field ? [field] : [];

              const focus = normalize(entry.focus);
              const data = normalize(entry.data);
              const action = normalize(entry.action);
              const response = normalize(entry.response);

              const rowCount = Math.max(focus.length, data.length, action.length, response.length, 1);

              return Array.from({ length: rowCount }).map((_, subIdx) => (
                <tr key={`${idx}-${subIdx}`} className={subIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-4 border text-lg align-top">{focus[subIdx] || (subIdx === 0 ? "N/A" : "")}</td>
                  <td className="p-4 border text-lg align-top">{data[subIdx] || ""}</td>
                  <td className="p-4 border text-lg align-top">{action[subIdx] || ""}</td>
                  <td className="p-4 border text-lg align-top">{response[subIdx] || ""}</td>
                </tr>
              ));
            })}
          </tbody>

        </table>

        <div className="text-center space-x-6 mt-8">
          <button
            onClick={handleGenerateWithSameData}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-yellow-700"
          >
            Generate New FDAR (Same Patient)
          </button>
          <button
            onClick={handleNewPatientData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
          >
            Generate New FDAR (New Patient)
          </button>
        </div>

      </>
    </div>
  );
};

export default Step6FDARChart;
