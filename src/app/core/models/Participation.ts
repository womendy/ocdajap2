export interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

export interface CountryMedalAthleteCount {
  id:number;
  country: string;
  medalCount: number;
  athleteCount: number;
  participations: number
}
