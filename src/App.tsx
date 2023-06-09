import './index.css';

import { Header } from './header';
import { Inputs } from './inputs';

function App() {
    return (
        <div className="container">
            {Header()}
            {Inputs()}
        </div>
    );
}

export default App;
