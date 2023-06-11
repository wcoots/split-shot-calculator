import type { ShotSpecifications, ShotDictionary, ShotPattern } from './types';

export const shotDictionary: ShotDictionary = {
    '3SSG': { name: '3SSG', weightGrams: 4.8, selected: false },
    '2SSG': { name: '2SSG', weightGrams: 3.2, selected: false },
    LG: { name: 'LG', weightGrams: 3, selected: false },
    LSG: { name: 'LSG', weightGrams: 2, selected: false },
    SSG: { name: 'SSG', weightGrams: 1.6, selected: true },
    AAA: { name: 'AAA', weightGrams: 0.8, selected: true },
    AB: { name: 'AB', weightGrams: 0.6, selected: false },
    BB: { name: 'BB', weightGrams: 0.4, selected: true },
    1: { name: 'no1', weightGrams: 0.3, selected: true },
    3: { name: 'no3', weightGrams: 0.25, selected: true },
    4: { name: 'no4', weightGrams: 0.2, selected: true },
    5: { name: 'no5', weightGrams: 0.15, selected: false },
    6: { name: 'no6', weightGrams: 0.1, selected: true },
    8: { name: 'no8', weightGrams: 0.06, selected: true },
    9: { name: 'no9', weightGrams: 0.05, selected: false },
    10: { name: 'no10', weightGrams: 0.04, selected: false },
    11: { name: 'no11', weightGrams: 0.03, selected: false },
    12: { name: 'no12', weightGrams: 0.02, selected: false },
    13: { name: 'no13', weightGrams: 0.01, selected: false }
};

function calculateTotalShotWeight(shotPattern: ShotSpecifications[]) {
    return +shotPattern
        .reduce((totalWeight, shot) => (totalWeight += shot.weightGrams), 0)
        .toFixed(2);
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

    const shotPatterns: ShotPattern[] = [];

    function generateCombinations(currentCombination: ShotSpecifications[], startingIndex: number) {
        if (currentCombination.length === desiredShotCount) {
            const totalWeightGrams = calculateTotalShotWeight(currentCombination);
            const offsetWeightGrams = +(totalWeightGrams - desiredWeightGrams).toFixed(2);
            const variation = Array.from(new Set(currentCombination.map((c) => c.name))).length;
            shotPatterns.push({
                shotPattern: currentCombination.map((shot) => shot.name),
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
                Math.abs(shotPatternA.offsetWeightGrams) -
                    Math.abs(shotPatternB.offsetWeightGrams) ||
                shotPatternB.variation - shotPatternA.variation
            );
        })
        .slice(0, 10);
}

export function calculateCombinationCount(
    availableShotSizeCount: number,
    desiredShotCount: number
): number {
    if (availableShotSizeCount === 0) {
        throw new Error('No available shot.');
    } else if (desiredShotCount === 0) {
        throw new Error('Shot count must be greater than zero.');
    }

    function factorial(num: number): number {
        if (num === 0) return 1;
        return num * factorial(num - 1);
    }

    const numerator = factorial(availableShotSizeCount + desiredShotCount - 1);
    const denominator = factorial(desiredShotCount) * factorial(availableShotSizeCount - 1);
    return numerator / denominator;
}
