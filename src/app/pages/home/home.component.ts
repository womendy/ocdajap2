import {Component, OnInit,OnDestroy} from '@angular/core';
import {filter, from, map, Observable, of, subscribeOn, Subscription} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from '../../core/models/Olympic';
import {Color, ScaleType} from "@swimlane/ngx-charts";
import {Participation} from "../../core/models/Participation";
import {CountryMedalsCount} from "../../core/models/CountryMedalsCount";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  single: CountryMedalsCount[] | any ;
  single2: CountryMedalsCount[] | any ;
  public olympics$!: Observable<Olympic[]>;
  pieChartData: any;

  legendTitle = 'Medals per Country';
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  subscription: Subscription = new Subscription;
  legendPosition: string = 'below';
  totalcountryMedalCounts: CountryMedalsCount[] = [];



  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b8cbe7', '#bfe0f1', '#9780a1', '#89a1db', '#793d52']
  };


  constructor(private olympicService: OlympicService, private route: Router) {
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
          let numberOfJo = 0;
          response.forEach((olympic: Olympic) => {
            name = olympic.country;

           value = olympic.participations.reduce((numberOfMedals, countryParticipation: Participation) => numberOfMedals + countryParticipation.medalsCount, 0)


            countryMedalCounts.push({
              country: name,
              medalsCount: value

            })
            // numberOfJo.({
            //   country: name,
            //   medalsCount: value
            //
            // })
          //  this.numberOfJo.add(olympic.)

            console.log(olympic)
          })
          this.pieChartData = countryMedalCounts.map(({country, medalsCount}) =>({ name:country, value:medalsCount }));
          console.log(this.pieChartData)
          return countryMedalCounts

        }))

  }

  getCountryMedalCount() {

    this.subscription= this.buildCountryMedalsCount()
      .subscribe((countryMedalCounts: CountryMedalsCount[]) => {
        }
      )
    }

  getOlympicByCountry(event: any){
    let id =event.extra.id;
    this.route.navigateByUrl('/country/id)');

}

  protected readonly length = length;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}




