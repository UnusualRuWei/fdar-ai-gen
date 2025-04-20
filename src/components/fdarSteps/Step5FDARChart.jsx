
const Step5FDARChart = ({ fdarData }) => {
  const { patient, focus, data = [], action = [], response = [] } = fdarData;

  const rowCount = Math.max(data.length, action.length, response.length, 1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p className="font-semibold">Nurse: {nurse?.currentUser}</p>
        <p className="font-semibold">Patient: {patient?.name}</p>
        <p className="font-semibold">Date & Time: {new Date(patient?.datetime).toLocaleString()}</p>
      </div>

      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Step 5: FDAR Chart</h2>

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
          {Array.from({ length: rowCount }).map((_, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="p-2 border align-top">
                {idx === 0 ? focus : ""}
              </td>
              <td className="p-2 border align-top">
                {data[idx] || ""}
              </td>
              <td className="p-2 border align-top">
                {action[idx] || ""}
              </td>
              <td className="p-2 border align-top">
                {response[idx] || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Save FDAR (To be implemented)
        </button>
      </div>
    </div>
  );
};

export default Step5FDARChart;
