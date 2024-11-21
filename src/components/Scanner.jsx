import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { apiClient } from "../utils/apiClient";
import Verification from "./Verification";
const { VITE_ROUTE_PRODUCTS } = import.meta.env

const QRCodeScanner = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [result, setResult] = useState('');
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
const [isVerifying, setIsVerifying] = useState(false);
const [productData, setProductData] = useState({})

const handleFinishVerification = () => {
    setIsVerifying(false);
    setProductData({});
    setResult("");
}

  useEffect(() => {
    // Obtener lista de dispositivos de video al montar el componente
    const fetchVideoDevices = async () => {
      try {
        const videoInputDevices = await codeReader.current.listVideoInputDevices();
        setDevices(videoInputDevices);
        if (videoInputDevices.length > 0) {
          setSelectedDeviceId(videoInputDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error al obtener dispositivos de video:', error);
      }
    };

    fetchVideoDevices();

    // Cleanup al desmontar
    return () => {
      codeReader.current.reset();
    };
  }, []);

  const startScan = () => {
    if (selectedDeviceId && videoRef.current) {
      codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log(result);
            setResult(result.getText());
          }
          if (error && !(error instanceof NotFoundException)) {
            console.error(error);
          }
        }
      );
    }
  };

  const resetScan = () => {
    codeReader.current.reset();
    setResult('');
    console.log('Reset.');
  };

  const handleVerification = async productCode => {
    console.log('productCode', productCode);
    setIsVerifying(true);
    try {
    const verification = await apiClient.get(
        `${VITE_ROUTE_PRODUCTS}/${productCode}`,
        );

        if (Object.keys(verification?.data?.data).length === 0) {
            handleFinishVerification();
            throw new Error("Product not found");
        }

        setProductData(verification?.data?.data);
        setIsVerifying(false);
    } catch (error) {
        console.error(error);
        setIsVerifying(false);
    }};
    const hasProductData = Object.keys(productData).length > 0;

  return (
    <div className="" style={{ paddingTop: '2em' }}>
      <h1 className="font-bold text-xl">Escanea el código QR</h1> 
      <p>Sistema de identificación, marcación, autenticación, rastreo y trazabilidad fiscal de bebidas alcohólicas, cervezas, y cigarrillos.</p>
      {!hasProductData && (
        <>
        
  <div>
        <button className='btnDefault' onClick={startScan}>Empezar</button>
        <button className='btnOutline' onClick={resetScan}>Reanudar</button>
      </div>

      <div>
        <video
          ref={videoRef}
          width="300"
          height="200"
          style={{ border: '1px solid gray' }}
        ></video>
      </div>

      {devices.length > 1 && (
        <div>
          <label className='font-medium' htmlFor="sourceSelect">Cambiar fuente de video</label>
          <select
            id="sourceSelect"
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            style={{ maxWidth: '400px' }}
          >
            {devices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label || `Device ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className='my-2'>Resultado:</div>

<form className="max-w-md mx-auto" onSubmit={ (e) => { e.preventDefault(); handleVerification(result) } } >   
    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Texto escaneado" required value={result} onChange={(e) => setResult(e.target.value)} />
        <button type="submit" disabled={isVerifying} className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Verificar</button>
    </div>
</form>
        </>
      )}
      
            {hasProductData && (
              <>
                <Verification productData={productData} />
                {/* return botons */}
                <div className="fixed bottom-0 right-0 p-2">
                <button onClick={handleFinishVerification} type="button" className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                <svg fill="#000000" className='w-6 h-6' viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <title>return</title>
                <path d="M0 21.984q0.032-0.8 0.608-1.376l4-4q0.448-0.48 1.056-0.576t1.12 0.128 0.864 0.736 0.352 1.12v1.984h18.016q0.8 0 1.408-0.576t0.576-1.408v-8q0-0.832-0.576-1.408t-1.408-0.608h-16q-0.736 0-1.248-0.416t-0.64-0.992 0-1.152 0.64-1.024 1.248-0.416h16q2.464 0 4.224 1.76t1.76 4.256v8q0 2.496-1.76 4.224t-4.224 1.76h-18.016v2.016q0 0.64-0.352 1.152t-0.896 0.704-1.12 0.096-1.024-0.544l-4-4q-0.64-0.608-0.608-1.44z"></path>
                </svg>
                <span className="sr-only">Icon description</span>
                </button>
                </div>
              </>
        )}
        </div>
            
  );
};

export default QRCodeScanner;
