import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';

function App() {
    // Code Snippet to make console.log visible only if sl set to true in Local Storage
    const showLogs = localStorage.getItem('sl') ?? false;

    if (!showLogs) {
        const fn = () => {};

        ['log'].forEach((method) => {
            console[method] = fn;
        });
    }

    return (
        <Router>
            <div className='h-screen bg-slate-200 text-slate-800'>
                <Layout />
            </div>
        </Router>
    );
}

export default App;
