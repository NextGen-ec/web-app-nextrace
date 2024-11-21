// import QRScanner from './components/QRScanner';
import Scanner from './components/Scanner';
import './index.css';

function App() {
  return (
    <div className="container flex flex-col items-center mx-auto px-12 md:px-0 mt-8 max-w-xl">
     
        {/* logo-nextrack.png */}
        <img src="/logo_nextrack.webp" alt="Logo Nextrack" className="w-48 aspect-auto" />
        
        {/* <QRScanner /> */}
        <Scanner/>
    </div>
  );
}

export default App;