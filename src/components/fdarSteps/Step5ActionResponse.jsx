const Step5ActionResponse = ({
    responseListOutput,
    onNext
  }) => {
    return (
      <>
        <div className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Step 5: Output Response</h2>
          <div className="p-6 bg-gray-100 rounded-lg border text-gray-800">
            <strong className="text-lg">AI Response:</strong>
            {responseListOutput.map((resp, idx) => (
              <div key={idx} className="flex items-center gap-4 mt-4">
                <label htmlFor={`resp-${idx}`} className="text-lg">{resp}</label>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={onNext}
              className="bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-800 focus:outline-none focus:ring-3 focus:ring-purple-600"
            >
              Continue to FDAR Chart
            </button>
          </div>
        </div>
      </>
    );
  };
  
  export default Step5ActionResponse;
  