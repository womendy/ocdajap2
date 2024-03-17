import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanMatchFn,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import {OlympicService} from "../services/olympic.service";


@Injectable({
  providedIn: 'root'
})
export class CountryNameGuard implements CanActivateChild {

  constructor(private olympicService: OlympicService, private router: Router) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const countryname = next.params['countryname'];
    if (this.olympicService.isValidCountryName(countryname)) {
      return true;
    } else {
      // Redirect to not-found or any other page
      this.router.navigate(['/notFound']);
      return false;
    }
  }
}

