import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, map, Observable, Subscription, take, tap } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color, ScaleType } from "@swimlane/ngx-charts";
import { CountryMedalAthleteCount, Participation } from "../../core/models/Participation";
import { Olympic } from "../../core/models/Olympic";
import { CountryMedalsCount, CountryYearMedals } from "../../core/models/CountryMedalsCount";
import { Router } from "@angular/router";
import { ViewSizeService } from 'src/app/core/services/view-size.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  countryMedalAthleteCount$!: Observable<CountryMedalAthleteCount[]>;
  pieChartData!: CountryYearMedals[];
  customView: [number, number] = [400, 700];
  subscriptions: Subscription[] = [];
  numberOfJo = 0;
  view!: [number, number];

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b8cbe7', '#bfe0f1', '#9780a1', '#89a1db', '#793d52']
  };

  constructor(
    private olympicService: OlympicService,
    private viewSizeService: ViewSizeService,
    private router: Router) {
  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.viewSizeService.getViewSize()
        .subscribe((viewSize) => {
          this.view = viewSize
        }));

    this.olympics$ = this.olympicService.getOlympics();
    this.countryMedalAthleteCount$ = this.olympicService.countryMedalAthleteCount$;
    this.subscriptions.push(
      this.olympicService.countryMedalAthleteCount$.subscribe(
        countryMedalAthleteCount => {
            let chartData: CountryYearMedals[] = [];
            countryMedalAthleteCount.forEach(cmac => {
              chartData.push({
                name: cmac.country,
                value: cmac.medalCount
              })
            })
            this.pieChartData = chartData;
        }))
  }

  selectOneCountry(event: { name: string, value: number, label: string }) {
    let name = event.name;
    this.router.navigate([`country/${name}`]);

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs: Subscription) => subs.unsubscribe());
  }

}




