import {Component, OnInit, OnDestroy} from '@angular/core';
import {filter, map, Observable, Subscription} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Color, ScaleType} from "@swimlane/ngx-charts";
import {Participation} from "../../core/models/Participation";
import {Olympic} from "../../core/models/Olympic";
import {CountryMedalsCount, CountryYearMedals} from "../../core/models/CountryMedalsCount";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  pieChartData: CountryYearMedals[] = [];
  customView: [number, number] = [400, 700];
  subscriptions: Subscription[] = [];
  numberOfJo = 0;
  view: [number, number];

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b8cbe7', '#bfe0f1', '#9780a1', '#89a1db', '#793d52']
  };

  constructor(private olympicService: OlympicService) {
    this.view = [innerWidth / 1.3, 600];

  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.getCountryMedalCount();
  }


  buildCountryMedalsCount(): Observable<CountryMedalsCount[]> {
    let countryMedalCounts: CountryMedalsCount[] = [];
    return this.olympicService.getOlympics()
      .pipe(
        filter(response => response),
        map((response: Olympic[]) => {
          let name: string;
          let value = 0;

          response.forEach((olympic: Olympic) => {

            this.numberOfJo = olympic.participations.length
            name = olympic.country;
            value = olympic.participations.reduce((numberOfMedals:number, countryParticipation: Participation) => numberOfMedals + countryParticipation.medalsCount, 0)
            countryMedalCounts.push({
              country: name,
              medalsCount: value
            })
          })
          this.pieChartData = countryMedalCounts
            .map(({country, medalsCount}) => ({
              name: country, value: medalsCount
            }));

          return countryMedalCounts
        }))
  }


  getCountryMedalCount() {
    this.subscriptions.push(this.buildCountryMedalsCount()
      .subscribe((countryMedalCounts: CountryMedalsCount[]) => {
        }
      ))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs: Subscription) => subs.unsubscribe());
    ""
  }

}




