import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject, take} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {CountryMedalAthleteCount, Participation} from '../models/Participation';
import {Olympic} from '../models/Olympic';
import {id} from "@swimlane/ngx-charts";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  private _countryMedalAthleteCount$ = new BehaviorSubject<CountryMedalAthleteCount[]>([]);
  private validCountryNames: string[] = [];
  public countryNameId = new Map();

  constructor(private http: HttpClient) {
  }


  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.buildCountryMedalsAthletesCount(value);
        this.olympics$.next(value)
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  /**
   * Validation du nom de pays pour la redirection vers les pages par pays
   * @param name
   */

  // isValidCountryName(name: string): boolean {
  //   return this.validCountryNames.includes(name.toLowerCase());
  // }
  /**
   * Construction des données pour chaque pays
   * @param olympics
   */
  public buildCountryMedalsAthletesCount(olympics: Olympic[]): void {
    // let countryMedalCounts: CountryMedalsCount[] = [];
    let countryMedalAthleteCount: CountryMedalAthleteCount[] = [];

    let id: number=0;
    let country: string;
    let medalsCount = 0;
    let athletesCount = 0;

    olympics.forEach((olympic: Olympic) => {
      id = olympic.id;
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
        id:id,
        country: country,
        medalCount: medalsCount,
        athleteCount: athletesCount,
        participations: olympic.participations.length
      });
      this.validCountryNames.push(country);


      this.countryNameId.forEach((country,id,countryNameId) =>
        countryNameId.set(id,country)
      )
    })
    // Stoker le calcul du nombre de médailles et d'athlètes par pays
    this.pushCountryMedalAthleteCount$(countryMedalAthleteCount);
  }

  public isValidCountryName(name: string): boolean {
    this.olympics$
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          response.forEach((olympic: Olympic) => {
            let country = olympic.country;
            this.validCountryNames.push(country);
          })
        }
      })
return this.validCountryNames.includes(name.toLowerCase());

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
