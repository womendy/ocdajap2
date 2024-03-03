export interface CountryMedalsCount {
  name: string;
  value: number;
}

export interface CountryYearMedals {
  name: string;
  value: number;
}

export interface Serie {
  name?: string;
  series: CountryYearMedals[];
}
