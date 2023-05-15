import React, { useState, FormEvent } from "react";

export interface PFBFormValues {
    namespace_id: string;
    data: string;
    gas_limit: number;
    fee: number;
    submitUrl: string;
}

interface PFBFormProps {
    onSubmit: (values: PFBFormValues) => void;
    isLoading: boolean;
}

function generateRandHexEncodedNamespaceID() {
    let nID = new Uint8Array(8);
    window.crypto.getRandomValues(nID);
    let hexID = Array.from(nID).map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hexID;
}

const PFBForm: React.FC<PFBFormProps> = ({ onSubmit , isLoading }) => {
    const [namespace_id, setNamespaceId] = useState("");
    const [data, setData] = useState("");
    const [gas_limit, setGasLimit] = useState(80000);
    const [fee, setFee] = useState(200);
    const [submitUrl, setSubmitUrl] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ namespace_id, data, gas_limit, fee, submitUrl });
    };

    return (
        <div className={`relative ${isLoading ? "opacity-50" : ""}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Namespace ID */}
                <div className="mb-4">
                    <label
                        htmlFor="namespace_id"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Namespace ID:
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="namespace_id"
                            value={namespace_id}
                            onChange={(e) => setNamespaceId(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder={"8 random bytes hex-encoded string"}
                        />
                        <button
                            type="button"
                            onClick={() => setNamespaceId(generateRandHexEncodedNamespaceID())}
                            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {/* Data */}
            <div className="mb-4">
                <label
                    htmlFor="data"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Data:
                </label>
                <input
                    type="text"
                    id="data"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Any message,we will hex encode it for you"
                />
            </div>

            {/* Gas Limit */}
            <div className="mb-4">
                <label
                    htmlFor="gas_limit"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Gas Limit:
                </label>
                <input
                    type="number"
                    id="gas_limit"
                    value={gas_limit}
                    onChange={(e) => setGasLimit(Number(e.target.value))}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* Fee */}
            <div className="mb-4">
                <label
                    htmlFor="fee"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Fee:
                </label>
                <input
                    type="number"
                    id="fee"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            {/* Submit URL Input */}
            <div className="mb-4">
                <label htmlFor="submitUrl" className="block text-gray-700 text-sm font-bold mb-2">
                    Node URL (optional):
                </label>
                <input
                    type="text"
                    id="submitUrl"
                    value={submitUrl}
                    onChange={(e) => setSubmitUrl(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="http://localhost:26659/submit_pfb"
                />
            </div>

                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className={`w-full p-2 text-white font-semibold ${
                            isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
                        } rounded`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center space-x-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-l-4 border-blue-200 border-solid"></div>
                                <span className="text-blue-200">Loading...</span>
                            </div>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
        </form>
            {isLoading && (
                <div className="absolute inset-0 bg-white opacity-50"></div>
            )}
        </div>
    );
};

export default PFBForm;
