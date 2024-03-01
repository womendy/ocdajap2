export interface Participation {
id: number;
year: number;
city: string;
medalsCount: number;
athleteCount: number;
}

export interface CountryAthleteMedalsCount {
  country: string;
  medalsCount: number;
  athleteCount: number;
}
