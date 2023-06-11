export interface ShotSpecifications {
    name: string;
    weightGrams: number;
    selected: boolean;
}

export type ShotDictionary = { [size: string]: ShotSpecifications };

export interface ShotPattern {
    shotPattern: string[];
    totalWeightGrams: number;
    offsetWeightGrams: number;
    variation: number;
}
