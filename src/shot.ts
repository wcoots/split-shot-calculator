import { ShotSpecifications, ShotDictionary } from './types';

const shotDictionary: ShotDictionary = {
    '3SSG': { name: '3SSG', weightGrams: 4.8 },
    '2SSG': { name: '2SSG', weightGrams: 3.2 },
    LG: { name: 'LG', weightGrams: 3 },
    LSG: { name: 'LSG', weightGrams: 2 },
    SSG: { name: 'SSG', weightGrams: 1.6 },
    AAA: { name: 'AAA', weightGrams: 0.8 },
    AB: { name: 'AB', weightGrams: 0.6 },
    BB: { name: 'BB', weightGrams: 0.4 },
    1: { name: 'no1', weightGrams: 0.3 },
    3: { name: 'no3', weightGrams: 0.25 },
    4: { name: 'no4', weightGrams: 0.2 },
    5: { name: 'no5', weightGrams: 0.15 },
    6: { name: 'no6', weightGrams: 0.1 },
    8: { name: 'no8', weightGrams: 0.06 },
    9: { name: 'no9', weightGrams: 0.05 },
    10: { name: 'no10', weightGrams: 0.04 },
    11: { name: 'no11', weightGrams: 0.03 },
    12: { name: 'no12', weightGrams: 0.02 },
    13: { name: 'no13', weightGrams: 0.01 }
};

function calculateTotalShotWeight(shotPattern: ShotSpecifications[]) {
    return shotPattern.reduce((totalWeight, shot) => (totalWeight += shot.weightGrams), 0);
}

export function calculateShotPatterns({
    desiredWeightGrams,
    availableShotSizes,
    desiredShotCount
}: {
    desiredWeightGrams: number;
    availableShotSizes: (keyof typeof shotDictionary)[];
    desiredShotCount: number;
}) {
    const availableShot = Object.entries(shotDictionary)
        .reduce((availableShot: ShotSpecifications[], [size, value]) => {
            if (availableShotSizes.map((size) => size.toString()).includes(size)) {
                availableShot.push(value);
            }
            return availableShot;
        }, [])
        .sort((shotA, shotB) => shotA.weightGrams - shotB.weightGrams);

    if (!availableShot.length) {
        throw new Error('No available shot.');
    } else if (desiredShotCount <= 0) {
        throw new Error('Shot count must be greater than zero.');
    } else if (!Number.isInteger(desiredShotCount)) {
        throw new Error('Shot count must be an integer.');
    } else if (desiredWeightGrams <= 0) {
        throw new Error('Total shot weight must be greater than zero.');
    }

    const shotPatterns: {
        shotPattern: ShotSpecifications[];
        totalWeightGrams: number;
        offsetWeightGrams: number;
        variation: number;
    }[] = [];

    function generateCombinations(currentCombination: ShotSpecifications[], startingIndex: number) {
        if (currentCombination.length === desiredShotCount) {
            const totalWeightGrams = calculateTotalShotWeight(currentCombination);
            const offsetWeightGrams = Math.abs(desiredWeightGrams - totalWeightGrams);
            const variation = Array.from(new Set(currentCombination.map((c) => c.name))).length;
            shotPatterns.push({
                shotPattern: [...currentCombination],
                totalWeightGrams,
                offsetWeightGrams,
                variation
            });
            return;
        }

        for (let index = startingIndex; index < availableShot.length; index++) {
            currentCombination.push(availableShot[index]);
            generateCombinations(currentCombination, index);
            currentCombination.pop();
        }
    }

    generateCombinations([], 0);

    return shotPatterns
        .sort((shotPatternA, shotPatternB) => {
            return (
                shotPatternA.offsetWeightGrams - shotPatternB.offsetWeightGrams ||
                shotPatternB.variation - shotPatternA.variation
            );
        })
        .slice(0, 10);
}
