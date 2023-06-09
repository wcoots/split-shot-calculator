import { useState, ChangeEvent } from 'react';
import './index.css';
import { shotDictionary, calculateShotPatterns } from './shot';

export function Inputs() {
    // DESIRED SHOT COUNT
    const [desiredShotCount, setDesiredShotCount] = useState('4');

    function handleDesiredShotCountChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value === '' || /^[1-9]$/.test(value)) {
            setDesiredShotCount(value);
        }
    }

    // DESIRED SHOT WEIGHT
    const [desiredWeightGrams, setDesiredWeightGrams] = useState('1.5');

    function handleDesiredWeightGramsChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d+$/.test(value)) {
            setDesiredWeightGrams(value);
        }
    }

    // SHOT SELECYION
    const [shotSelectionMenuVisible, setShotSelectionMenuVisible] = useState(false);
    const [shotSelection, setShotSelection] = useState(shotDictionary);

    function onClickShotSelectionRadio(key: keyof typeof shotDictionary) {
        const clonedShotSelection = { ...shotSelection };
        clonedShotSelection[key].defaultSelected = !clonedShotSelection[key].defaultSelected;
        setShotSelection(clonedShotSelection);
    }

    function renderRadioInputs() {
        const sortedShotSelection = Object.entries(shotSelection).sort(
            ([, shotA], [, shotB]) => shotB.weightGrams - shotA.weightGrams
        );

        const radioRows: JSX.Element[] = [];

        sortedShotSelection.forEach(([key, value], index) => {
            radioRows.push(
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '28px' // Adjust the margin value as per your preference
                    }}>
                    <label htmlFor={key}>{value.name}</label>
                    <div style={{ flexBasis: '25%' }}>
                        <input
                            type="radio"
                            id={key}
                            name={`shot-${key}`}
                            checked={value.defaultSelected}
                            onChange={() => null}
                            onClick={() => onClickShotSelectionRadio(key)}
                        />
                    </div>
                </div>
            );
        });

        return radioRows;
    }

    // SUBMIT
    const [response, setResponse] = useState('');

    function handleSubmit() {
        setResponse('');

        const availableShotSizes = Object.entries(shotSelection)
            .filter(([, shot]) => shot.defaultSelected)
            .map(([name]) => name);

        const functionResponse = calculateShotPatterns({
            availableShotSizes,
            desiredShotCount: +desiredShotCount,
            desiredWeightGrams: +desiredWeightGrams
        });

        console.log('done!');

        setResponse(JSON.stringify(functionResponse));
    }

    return (
        <div className="flex-container">
            <div className="flex-item">
                <label className="label-margin">Desired shot count:</label>
                <input
                    inputMode="numeric"
                    value={desiredShotCount}
                    onChange={handleDesiredShotCountChange}
                    className="input-numeric"
                />
            </div>
            <div className="flex-item">
                <label className="label-margin">Desired total shot weight (g):</label>
                <input
                    inputMode="numeric"
                    value={desiredWeightGrams}
                    onChange={handleDesiredWeightGramsChange}
                    className="input-numeric"
                />
            </div>
            <div className="flex-container">
                <button
                    className="button"
                    onClick={() => setShotSelectionMenuVisible(!shotSelectionMenuVisible)}>
                    {shotSelectionMenuVisible ? 'Close tackle box' : 'Open tackle box'}
                </button>
            </div>
            {shotSelectionMenuVisible && <div className="flex-wrap">{renderRadioInputs()}</div>}
            <div className="generate-button-container">
                <button onClick={handleSubmit}>Generate shot patterns</button>
            </div>
        </div>
    );
}
