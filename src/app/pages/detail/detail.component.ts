import {Component, OnInit} from '@angular/core';
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {Olympic} from "../../core/models/Olympic";
import {CountryYearMedals, Serie} from "../../core/models/CountryMedalsCount";
import {Color, NgxChartsModule, ScaleType} from "@swimlane/ngx-charts";
import {Location} from "@angular/common";
import {Participation} from "../../core/models/Participation";

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  id !: number;
  idPays!: number;
  countryName = '';
  numberOfAthletes: number=0;



  countryData: Serie[] = [];
  view : [number,number];

  // options
  //legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  //[xScaleMin]:
    // yAxisLabel: string = 'Médailles';
 // timeline: boolean = true;


  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b8cbe7', '#bfe0f1', '#9780a1', '#89a1db', '#793d52']
  };
  private olympico: any;


  constructor(
    private olympicService: OlympicService,
    //private router: Router,
    private route: ActivatedRoute,
    private location:Location,


  ) {
    this.view = [innerWidth / 1.6, 400];
  }

  ngOnInit(): void {
    this.countryName = this.route.snapshot.params['name'];
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((response) => {
      if (response) {
        this.countryData.push(this.initSeries(response));
        console.log('countrydata', this.countryData)
        let data = response.map(res => [res.country, res.participations]);

        console.log(data);
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

    console.log('countryYearMedals', countryYearMedals);
    return {name: olympic?.country, series: countryYearMedals}
  }
  // view is the variable used to change the chart size (Ex: view = [width, height])

  onResize({$event}: { $event: any }) {
    this.view = [$event?.target.innerWidth / 1.35, 400];
  }



  goBack(): void {
    this.location.back();
  }
}

