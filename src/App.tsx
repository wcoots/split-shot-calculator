import { useState } from 'react';
import './index.css';

import Header from './header';
import Inputs from './inputs';
import Patterns from './patterns';
import { ShotPattern } from './types';

function App() {
    const [shotPatterns, setShotPatterns] = useState<ShotPattern[] | null>(null);

    // Function to handle the response and update the state
    const handleResponse = (response: ShotPattern[] | null) => {
        setShotPatterns(response);
    };

    return (
        <div className="container">
            <Header />
            <Inputs returnShotPatterns={handleResponse} />
            <Patterns shotPatterns={shotPatterns} />
        </div>
    );
}

export default App;
