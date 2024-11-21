import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { apiClient } from "../utils/apiClient";
import Verification from './Verification';
const { VITE_ROUTE_PRODUCTS } = import.meta.env

const QRCodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [productData, setProductData] = useState({})

  const videoRef = useRef(null);
  const [reader] = useState(new BrowserMultiFormatReader());

  const handleFinishVerification = () => {
    setScanning(false);
    setProductData({});
    setScanResult(null);
}

  const videoRefCurrent = videoRef.current
  useEffect(() => {
    // Iniciar el escaneo cuando el componente se monta
    const startScan = async () => {
      try {
        // Iniciar la cámara
        const videoTrack = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRefCurrent) {
          videoRefCurrent.srcObject = videoTrack;
        }

        // Comenzar el proceso de escaneo
        const result = await reader.decodeFromVideoDevice(null, videoRefCurrent, (result, error) => {
          if (result) {
            setScanResult(result.getText()); // Almacena el resultado del escaneo
            setScanning(false); // Detener el escaneo después de leer un código
            videoTrack.getTracks().forEach(track => track.stop()); // Detener la cámara
          } else  {
            console.error(error);
          }
        });
        console.log('result', result);

        setScanning(true); // Indicar que el escaneo está activo
      } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        setScanning(false);
      }
    };

    startScan();

    // Limpiar el escaneo cuando el componente se desmonta
    return () => {
      if (videoRefCurrent && videoRefCurrent.srcObject) {
        const tracks = videoRefCurrent.srcObject.getTracks();
        tracks.forEach(track => track.stop()); // Detener la cámara al desmontar
      }
    };
  }, [reader, videoRefCurrent]);

  const handleVerification = async productCode => {
    console.log('productCode', productCode);
    setScanning(true);
    try {
    const verification = await apiClient.get(
        `${VITE_ROUTE_PRODUCTS}/${productCode}`,
        );

        if (Object.keys(verification?.data?.data).length === 0) {
            handleFinishVerification();
            throw new Error("Product not found");
        }

        setProductData(verification?.data?.data);
        setScanning(false);
    } catch (error) {
        console.error(error);
        setScanning(false);
    }};

    console.log('scanResult', scanResult);
    const hasProductData = Object.keys(productData).length > 0;

  return (
    <div>
      {!hasProductData && (
        <>
        <video ref={videoRef} style={{ width: '100%', maxWidth: '400px', marginBottom: '20px' }} autoPlay></video> 
        {scanning && <p>Escaneando... Por favor, acerque el código a la cámara.</p>}
        {scanResult && (
          <div>
            <h3>Resultado del escaneo:</h3>
            <div className="my-4">
               <input value={scanResult} onChange={(e) => setScanResult(e.target.value)}  type="text" id="cfs" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123ABC" required />
           </div>
           <div className="text-center">
                  <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-blue-400 disabled:hover:bg-blue-400" disabled={!scanResult} onClick={() => handleVerification(scanResult)}>Verify</button>
              </div>
            {/* <p>{scanResult}</p> */}
          </div>
        )}
        </>
        )}
      {hasProductData && (
      <Verification productData={productData} />
  )}
           <div className="flex justify-end ">
                  <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => handleFinishVerification()}>Back</button>
              </div>
    </div>
  );
};

export default QRCodeScanner;
