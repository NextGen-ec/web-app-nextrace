import  { useState } from "react";
import WebcamCapture from "./WebcamCapture";
import jsQR from 'jsqr';
import { apiClient } from "../utils/apiClient";
import Verification from "./Verification";
const { VITE_ROUTE_PRODUCTS } = import.meta.env
console.log('VITE_ROUTE_PRODUCTS', VITE_ROUTE_PRODUCTS);


const QRScanner = () => {
const [qrCode, setQrCode] = useState("");
const [isVerifying, setIsVerifying] = useState(false);
const [productData, setProductData] = useState({})

const handleFinishVerification = () => {
    setIsVerifying(false);
    setProductData({});
    setQrCode("");
}

const handleScan = (imageSrc) => {
    if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert"});
            if (code) {
                setQrCode(code?.data);
                console.log("code: ", code);
            }
        }
    } 
    }


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

        console.log('qrCode', qrCode);
        const hasProductData = Object.keys(productData).length > 0;

return (
    <div>
        {!hasProductData && (<WebcamCapture onScan={handleScan} />)}
        {!hasProductData && (
             <div className="my-4">
             <input value={qrCode} onChange={(e) => setQrCode(e.target.value)}  type="text" id="cfs" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123ABC" required />
         </div>
        )}
        {isVerifying && (
            
            <div role="status">
                <svg aria-hidden="true" className="mx-auto my-4 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>

        )}
        {!hasProductData && (
            <div className="text-center">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-blue-400 disabled:hover:bg-blue-400" disabled={!qrCode} onClick={() => handleVerification(qrCode)}>Verify</button>
            </div>
        )}
        {hasProductData && (
            <Verification productData={productData} />
        )}
        {/* Boton para regresar a la camara */}
        {!hasProductData || qrCode && (
            <div className="flex justify-end ">
                <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => handleFinishVerification()}>Back</button>
            </div>
        )}

    </div>
);
};

export default QRScanner;