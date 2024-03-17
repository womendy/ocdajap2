import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable, Subscription, take} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {Color, DataItem, id, ScaleType} from "@swimlane/ngx-charts";
import { CountryMedalAthleteCount } from "../../core/models/Participation";
import { Olympic } from "../../core/models/Olympic";
import { CountryYearMedals } from "../../core/models/CountryMedalsCount";
import { Router } from "@angular/router";
import {ViewSizeService} from "../../core/services/view-size.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit ,OnDestroy{
  public olympics$!: Observable<Olympic[]>;
  allOlympics:Olympic[]=[];
  countryMedalAthleteCount$!: Observable<CountryMedalAthleteCount[]>;
  pieChartData!: CountryYearMedals[];
  subscriptions: Subscription[] = [];
  numberOfJo = 0;
  view!: [number, number];

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b8cbe7', '#bfe0f1', '#9780a1', '#89a1db', '#793d52']
  };

  validCountryNames: string[]=[];
  private countryId=0 ;

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

             this.countryId=cmac.id


            chartData.push({
              name: cmac.country,
              value: cmac.medalCount
            })



            this.numberOfJo = cmac.participations})
          this.pieChartData = chartData;

        }))


  }


  selectOneCountry(event: CountryMedalAthleteCount): void {
    //const olympicId = this.findOlympicId(event.na   extra: {
    //             id: dt.id,me.toString());
    let id= event.id;

    let name =event.country;
 //  let id= this.findOlympicId(ide)
    this.router.navigateByUrl(`/country/${id}`);
  //  this.router.navigateByUrl(`country/${olympicId}`);

    // if (this.olympicService.loadInitialData()) {
    //   console.log(event.label);
    //   this.router.navigate([`${name}`]);
    //   console.log(name);
    //   console.log(this.olympicService.isValidCountryName(event.name));
    // }else {
    //   this.router.navigate([`notFound`]);
    //   console.log(name);
    //   console.log(this.olympicService.isValidCountryName(event.name));
    //   console.log(name);
    // }
  }

  findOlympicId(){

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs: Subscription) => subs.unsubscribe());
  }

}
