import  { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const QRCodeScanner = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [result, setResult] = useState('');
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    // Obtener lista de dispositivos de video al montar el componente
    const fetchVideoDevices = async () => {
      try {
        const videoInputDevices = await codeReader.current.listVideoInputDevices().then(
          
        )
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
          if (error && !(error instanceof ZXing.NotFoundException)) {
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

  return (
    <div className="container" style={{ paddingTop: '2em' }}>
      <h1 className="title">Scan 1D/2D Code from Video Camera</h1>

      <div>
        <button onClick={startScan}>Start</button>
        <button onClick={resetScan}>Reset</button>
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
          <label htmlFor="sourceSelect">Change video source:</label>
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

      <label>Result:</label>
      <pre>
        <code>{result}</code>
      </pre>
    </div>
  );
};

export default QRCodeScanner;
