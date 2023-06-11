import { useState, useEffect, ChangeEvent } from 'react';
import './index.css';
import { shotDictionary, calculateCombinationCount, calculateShotPatterns } from './shot';
import type { ShotDictionary, ShotPattern } from './types';

function Inputs({
    returnShotPatterns
}: {
    returnShotPatterns: (response: ShotPattern[] | null) => void;
}) {
    const savedSettingsString = localStorage.getItem('settings');
    const savedSettings = savedSettingsString
        ? (JSON.parse(savedSettingsString) as {
              desiredShotCount: string;
              desiredWeightGrams: string;
              shotSelection: ShotDictionary;
          })
        : null;

    // DESIRED SHOT COUNT
    const [desiredShotCount, setDesiredShotCount] = useState(
        savedSettings?.desiredShotCount ?? '4'
    );

    function handleDesiredShotCountChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value === '' || /^[1-9]$/.test(value)) {
            setDesiredShotCount(value);
        }
    }

    // DESIRED SHOT WEIGHT
    const [desiredWeightGrams, setDesiredWeightGrams] = useState(
        savedSettings?.desiredWeightGrams ?? '1.5'
    );

    function handleDesiredWeightGramsChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value === '' || /^(9(\.\d{1,2})?|[0-8](\.\d{1,2})?|[0-9]\.)$/.test(value)) {
            setDesiredWeightGrams(value);
        }
    }

    // SHOT SELECTION
    const [shotSelectionMenuVisible, setShotSelectionMenuVisible] = useState(false);
    const [shotSelection, setShotSelection] = useState(
        savedSettings?.shotSelection ?? shotDictionary
    );

    function onClickShotSelectionRadio(key: keyof typeof shotDictionary) {
        const clonedShotSelection = { ...shotSelection };
        clonedShotSelection[key].selected = !clonedShotSelection[key].selected;
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
                            checked={value.selected}
                            onChange={() => null}
                            onClick={() => onClickShotSelectionRadio(key)}
                        />
                    </div>
                </div>
            );
        });

        return radioRows;
    }

    // STORE SETTINGS
    useEffect(
        () =>
            localStorage.setItem(
                'settings',
                JSON.stringify({ desiredShotCount, desiredWeightGrams, shotSelection })
            ),
        [desiredShotCount, desiredWeightGrams, shotSelection]
    );

    // HANDLE SUBMIT
    const [predictedCombinationCount, setPredictedCombinationCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit() {
        const availableShotSizes = Object.entries(shotSelection)
            .filter(([, shot]) => shot.selected)
            .map(([name]) => name);

        try {
            returnShotPatterns(null);
            setPredictedCombinationCount(
                calculateCombinationCount(availableShotSizes.length, +desiredShotCount)
            );
            setIsLoading(true);
            setErrorMessage(null);

            await new Promise((resolve) => setTimeout(resolve, 0));

            const shotPatterns = calculateShotPatterns({
                availableShotSizes,
                desiredShotCount: +desiredShotCount,
                desiredWeightGrams: +desiredWeightGrams
            });

            returnShotPatterns(shotPatterns);
            setIsLoading(false);
        } catch (error) {
            returnShotPatterns(null);
            setPredictedCombinationCount(null);
            setIsLoading(false);
            setErrorMessage((error as Error).message);
        }
    }

    return (
        <div className="flex-container">
            <div className="flex-item">
                <label className="label-margin">Shot count:</label>
                <input
                    inputMode="numeric"
                    value={desiredShotCount}
                    onChange={handleDesiredShotCountChange}
                    className="input-numeric"
                />
                <input
                    className="slider"
                    type="range"
                    value={desiredShotCount}
                    onChange={handleDesiredShotCountChange}
                    min="1"
                    max="9"
                />
            </div>
            <div className="flex-item">
                <label className="label-margin">Shot weight (g):</label>
                <input
                    inputMode="numeric"
                    value={desiredWeightGrams}
                    onChange={handleDesiredWeightGramsChange}
                    className="input-numeric"
                />
                <input
                    className="slider"
                    type="range"
                    value={desiredWeightGrams}
                    onChange={handleDesiredWeightGramsChange}
                    min="0"
                    max="9.99"
                    step="0.25"
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
            <div className="flex-item">
                <button className="button" onClick={handleSubmit}>
                    Generate shot patterns
                </button>
                {errorMessage ? <div className="error-text">{errorMessage}</div> : null}
                {isLoading && predictedCombinationCount ? (
                    <div className="combination-count-text">
                        Calculating {predictedCombinationCount.toLocaleString()} combinations...
                    </div>
                ) : null}
                {!isLoading && predictedCombinationCount ? (
                    <div className="combination-count-text">
                        Calculated {predictedCombinationCount.toLocaleString()} combinations.
                    </div>
                ) : null}
            </div>

            <div className="loader-container">{isLoading ? <div className="loader" /> : null}</div>
        </div>
    );
}

export default Inputs;
