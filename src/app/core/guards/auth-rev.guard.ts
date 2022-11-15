import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from 'src/app/core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthRevGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise<boolean>((resolve) => {
      this.authService.authState.subscribe((status) => {
        if (status.authenticated) {
          this.router.navigateByUrl('main');
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
