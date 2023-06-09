export interface ShotSpecifications {
    name: string;
    weightGrams: number;
}

export type ShotDictionary = { [size: string]: ShotSpecifications };
