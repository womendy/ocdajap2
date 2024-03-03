export interface Participation {
id: number;
year: number;
city: string;
medalsCount: number;
athleteCount: number;
}

export interface CountryMedalAthleteCount {
  country: string;
  medalCount: number;
  athleteCount: number;
  participations : number
}
