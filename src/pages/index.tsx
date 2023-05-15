import PFBForm, {PFBFormValues} from '../components/PFBForm';
import fetch from 'isomorphic-unfetch';
import {useState} from "react";
const port = process.env.NEXT_PUBLIC_PROXY_PORT || 3090;

const Home: React.FC = () => {
  const [response, setResponse] = useState<string | { [key: string]: any } | null>(null);
  const [showFullTxHash, setShowFullTxHash] = useState(false);
  const [isLoading, setIsLoading] = useState(false);




  const isValidNamespaceId = (namespaceId: string): boolean => {
    // Check if the input is a hex-encoded string and has 16 characters (8 bytes)
    return /^([0-9a-fA-F]{2}){8}$/.test(namespaceId);
  };
  const isValidData = (data: string): boolean => {
    // Check if the input has a length up to 100 bytes

    //if empty string, return false
    if(data.length==0){
        return false;
    }

    return data.length <= 100;
  };
  const toHexEncoded = (data: string): string => {
    return Buffer.from(data).toString("hex");
  };


  const handleSubmit = async (values: PFBFormValues) => {
    const { submitUrl,...rest} = values;
    // Validate the namespace ID
    if (!isValidNamespaceId(values.namespace_id)) {
      setResponse("Error: Invalid Namespace ID. It should be an 8-byte hex-encoded string.");
      return;
    }
    // Validate the data
    if (!isValidData(values.data)) {
      setResponse(
          "Error: Invalid data. It should have a length up to 100 bytes. And not empty string."
      );
      return;
    }
    const hexEncodedData = toHexEncoded(values.data);
    setIsLoading(true);

    try {
      let url=process.env.NEXT_PUBLIC_PROXY_URL +":"+port+"/submit_pfb";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'submitUrl':submitUrl
        },
        body: JSON.stringify({ ...rest, data: hexEncodedData }),
      });

      if (response.ok) {
        const data = await response.json();
        // Extract the desired fields from the response data
        const extractedData :any= {
          status: 'success',
          txhash: data.txhash,
          height: data.height,
          namespace_ids: data.logs[0].events[0].attributes[1].value,
          blob_sizes: data.logs[0].events[0].attributes[0].value,
          original_namespace_id: values.namespace_id,
          original_data: values.data
        };
        // Update the response state with the extracted data
        setResponse(extractedData);

      } else {
        // Handle failed response and show an error
        console.error('Failed:', response);
        setResponse(`Error: ${response.statusText}`);
      }

    } catch (error) {
      // Handle network error and show an error
      if (error instanceof Error) {
        console.error('Network Error, Please try again:', error);
        setResponse(`Error: ${error.message}`);
      } else {
        console.error('An unknown error occurred:', error);
        setResponse(`An unknown error occurred`);
      }

    }
    setIsLoading(false);
  };

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="w-full max-w-lg bg-white shadow-lg p-10 rounded-lg">
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-semibold mr-2">Celestia Pay For Blob</h1>
            <img src="celestia-logo.png" alt="Celestia Logo" style={{ width: '120px', height: '60px' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">Powered by Silent Validator</p>
          <PFBForm onSubmit={handleSubmit} isLoading={isLoading} />

          {
            response && typeof response === 'string'
                ? <div className="w-full max-w-lg mt-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md flex items-center">
                  <svg className="h-5 w-5 mr-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-12a10 10 0 100 20 10 10 0 000-20zm.707 4.293a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L10 6.414l2.293 2.293a1 1 0 001.414-1.414l-3-3zM9 11a1 1 0 012 0v4a1 1 0 11-2 0v-4z" clip-rule="evenodd" />
                  </svg>
                  {response}
                </div>
                : null
          }
          {
              response && typeof response === 'object' && (
                  <div className="w-full max-w-lg mt-5 bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-2xl mb-2 text-green-600">Status: {response.status}</div>
                      <button
                          onClick={() => setShowFullTxHash(!showFullTxHash)}
                          className="text-blue-500 hover:text-blue-700"
                      >
                        {showFullTxHash ? 'Hide TxHash' : 'Show TxHash'}
                      </button>
                    </div>
                    <div className="font-medium text-lg mb-2">
                      TxHash:{" "}
                      {showFullTxHash
                          ? <a href={`https://testnet.mintscan.io/celestia-incentivized-testnet/txs/${response.txhash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{response.txhash}</a>
                          : <a href={`https://testnet.mintscan.io/celestia-incentivized-testnet/txs/${response.txhash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{response.txhash.substring(0, 10) + "..." + response.txhash.substring(response.txhash.length - 10)}</a>}
                    </div>

                    <div className="font-medium text-lg mb-2">Height: {response.height}</div>
                    <div className="font-medium text-lg mb-2">
                      Namespace ID: {response.original_namespace_id}
                    </div>
                    <div className="font-medium text-lg">Data: {response.original_data}</div>
                    <div className="font-medium text-lg mb-2">Namespace IDs: {response.namespace_ids}</div>
                    <div className="font-medium text-lg">Blob Sizes: {response.blob_sizes}</div>
                  </div>
              )
          }
        </div>
      </div>
  );
};

export default Home;