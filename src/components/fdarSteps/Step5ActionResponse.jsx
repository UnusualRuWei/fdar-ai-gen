

const Step4ActionResponse = ({
    responseListOutput,
    onNext
}) => {
    return (
        <>
            <div className="space-y-4 max-w-xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Step 4: Output Response</h2>
                <div className="p-4 bg-gray-100 rounded border text-gray-800">
                    <strong>AI Response:</strong>
                    {responseListOutput.map((resp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <p
                                id={`diag-${idx}`}
                                name="diagnosis"
                            />
                            <label htmlFor={`resp-${idx}`}>{resp}</label>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <button
                        onClick={onNext}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                        Continue to FDAR Chart
                    </button>
                </div>
            </div>
        </>
    )
}

export default Step4ActionResponse;