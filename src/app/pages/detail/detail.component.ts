import {Component, OnDestroy, OnInit} from '@angular/core';
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject, Subscription, take, takeUntil} from "rxjs";
import {Olympic} from "../../core/models/Olympic";
import {CountryYearMedals, Serie} from "../../core/models/CountryMedalsCount";
import {Color, NgxChartsModule, ScaleType} from "@swimlane/ngx-charts";
import {Location} from "@angular/common";
import {CountryMedalAthleteCount} from "../../core/models/Participation";
import {ViewSizeService} from "../../core/services/view-size.service";


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  public olympics$!: Observable<Olympic[]>;
  id !: number;
  idPays!: number;
  subscriptions: Subscription[] = [];

  countryName = '';
  countryMedalAthleteCount?: CountryMedalAthleteCount;
  view!: [number, number];
  countryData: Serie[] = [];
  countryDataStop$= new Subject<boolean>();
  seriesDataStop$= new Subject<boolean>();

  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b8cbe7', '#bfe0f1', '#9780a1', '#89a1db', '#793d52']
  };

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private location: Location,
    private viewSizeService: ViewSizeService,
    private router: Router
  ) {
    // this.view = [ innerWidth/1.8, innerHeight  ];
  }

  ngOnInit(): void {
    this.subscriptions.push(this.viewSizeService.getViewSize()
      .subscribe((viewSize) => (this.view = viewSize)));
    this.countryName = this.route.snapshot.params['name'];

    // Calcul nombre d'athlète pour le pays concerné
    this.olympicService.countryMedalAthleteCount$
      .pipe(takeUntil(this.countryDataStop$))
      .subscribe((countryMAC: CountryMedalAthleteCount[]) => {
        if (countryMAC?.length > 0) {
          this.countryMedalAthleteCount = countryMAC.find(cmac => cmac.country === this.countryName);
          if (!!!this.countryMedalAthleteCount) {
            this.router.navigate(['404'])
          }
        this.countryDataStop$.next(true)
        }
      })

    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$
      .pipe(takeUntil(this.seriesDataStop$))
      .subscribe((response) => {

        if (response?.length > 0)  {
          this.countryData.push(this.initSeries(response));
          this.seriesDataStop$.next(true)
        }
      })
  }


  private initSeries(olympics: Olympic[]): Serie {
    const countryYearMedals: CountryYearMedals[] = [];
    let olympic = olympics?.find(ol => ol.country === this.countryName);

    olympic?.participations.forEach(participation => {

      countryYearMedals.push({
        name: participation.year.toString(),
        value: participation.medalsCount
      })
    });
    return {name: olympic?.country, series: countryYearMedals}
  }

  // view is the variable used to change the chart size (Ex: view = [width, height])

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs: Subscription) => subs.unsubscribe());
  }
}

