export interface CountryMedalsCount {
  country: string;
  medalsCount: number;
}

export interface CountryYearMedals {
  name: string;
  value: number;
}

export interface Serie {
  name?: string;
  series: CountryYearMedals[];
}
