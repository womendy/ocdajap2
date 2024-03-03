import { Component, OnInit, HostListener } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { ViewSizeService } from './core/services/view-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private olympicService: OlympicService,
    private viewSizeService: ViewSizeService) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
    @HostListener('window:resize', ['$event'])
    onWindowResize() {
      if (window) {
        this.viewSizeService.setViewSize(window.innerWidth);
      }
    }
  }

