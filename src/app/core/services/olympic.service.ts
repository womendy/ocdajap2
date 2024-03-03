import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable, BehaviorSubject, partition } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { CountryMedalAthleteCount, Participation } from '../models/Participation';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);
  private _countryMedalAthleteCount$ = new BehaviorSubject<CountryMedalAthleteCount[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => {
        this.buildCountryMedalsAthletesCount(value);
        this.olympics$.next(value)
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

/**
 * Construction des données pour chaque pays
 * @param olympics 
 */
  private buildCountryMedalsAthletesCount(olympics: Olympic[]): void {
    // let countryMedalCounts: CountryMedalsCount[] = [];
    let countryMedalAthleteCount: CountryMedalAthleteCount[] = [];

    let country: string;
    let medalsCount = 0;
    let athletesCount = 0;

    olympics.forEach((olympic: Olympic) => {
      country = olympic.country;
      // Compter le nombre de médailles pour un pays
      medalsCount = olympic.participations
        .reduce((numberOfMedals: number, countryParticipation: Participation) =>
          numberOfMedals + countryParticipation.medalsCount, 0);
      // Compter le nombre d'athlète pour un pays
      athletesCount = olympic.participations
        .reduce((numberOfAthletes: number, countryParticipation: Participation) =>
          numberOfAthletes + countryParticipation.athleteCount, 0);

      countryMedalAthleteCount.push({
        country: country,
        medalCount: medalsCount,
        athleteCount: athletesCount,
        participations: olympic.participations.length
      });
    })
    // Stoker le calcul du nombre de médailles et d'athlètes par pays
    this.pushCountryMedalAthleteCount$(countryMedalAthleteCount);
  }


  public get countryMedalAthleteCount$(): Observable<CountryMedalAthleteCount[]> {
    return this._countryMedalAthleteCount$ as Observable<CountryMedalAthleteCount[]>
  }

  public pushCountryMedalAthleteCount$(countryMedalAthleteCount$: CountryMedalAthleteCount[]): void {
    this._countryMedalAthleteCount$.next(countryMedalAthleteCount$)
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
