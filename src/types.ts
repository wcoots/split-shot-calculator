export interface ShotSpecifications {
    name: string;
    weightGrams: number;
    defaultSelected: boolean;
}

export type ShotDictionary = { [size: string]: ShotSpecifications };
