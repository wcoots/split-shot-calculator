import { useState, ChangeEvent } from 'react';
import './index.css';
import { shotDictionary, calculateShotPatterns } from './shot';

function App() {
    const [shotSelection, setShotSelection] = useState(shotDictionary);

    const handleChange = (key: keyof typeof shotDictionary) => {
        const clonedShotSelection = { ...shotSelection };
        clonedShotSelection[key].defaultSelected = !clonedShotSelection[key].defaultSelected;
        setShotSelection(clonedShotSelection);
    };

    const [desiredShotCount, setDesiredShotCount] = useState<string>('4');
    const [desiredWeightGrams, setDesiredWeightGrams] = useState<string>('1.5');

    const handleDesiredShotCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^[1-9][0-9]*$/.test(value)) {
            setDesiredShotCount(value);
        }
    };

    const handleDesiredWeightGramsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d+$/.test(value)) {
            setDesiredWeightGrams(value);
        }
    };

    const [response, setResponse] = useState('');

    const handleButtonClick = () => {
        setResponse('');

        const availableShotSizes = Object.entries(shotSelection)
            .filter(([, shot]) => shot.defaultSelected)
            .map(([name]) => name);

        const functionResponse = calculateShotPatterns({
            availableShotSizes,
            desiredShotCount: +desiredShotCount,
            desiredWeightGrams: +desiredWeightGrams
        });

        setResponse(JSON.stringify(functionResponse));
    };

    return (
        <div className="container">
            <div className="header">
                <b>Split-shot calculator</b>
                <a
                    href="https://github.com/wcoots/split-shot-calculator"
                    target="_blank"
                    rel="noreferrer">
                    <img src="github.svg" alt="GitHub" />
                </a>
            </div>

            <label>
                Desired shot count:
                <input
                    type="number"
                    value={desiredShotCount}
                    onChange={handleDesiredShotCountChange}
                />
            </label>
            <br />
            <label>
                Desired total shot weight (g):
                <input
                    type="number"
                    value={desiredWeightGrams}
                    onChange={handleDesiredWeightGramsChange}
                />
            </label>

            <div>
                {Object.entries(shotSelection)
                    .sort(([, shotA], [, shotB]) => shotB.weightGrams - shotA.weightGrams)
                    .map(([key, value]) => (
                        <div key={key}>
                            <input
                                type="radio"
                                id={key}
                                name={`shot-${key}`}
                                checked={value.defaultSelected}
                                onChange={() => null}
                                onClick={() => handleChange(key)}
                            />
                            <label htmlFor={key}>{value.name}</label>
                        </div>
                    ))}
            </div>

            <div>
                <button onClick={handleButtonClick}>Click Me</button>
                <div>{response}</div>
            </div>
        </div>
    );
}

export default App;
