import QRScanner from './components/QRScanner';
import './index.css';

function App() {
  return (
    <div className="container flex flex-col items-center mx-auto">
     
        {/* logo-nextrack.png */}
        <img src="/logo-nextrack.png" alt="Logo Nextrack" className="aspect-auto" />
        <QRScanner />
     
    </div>
  );
}

export default App;