import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthguardGuard implements CanActivate {
  constructor(public router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.isLoggedIn) {
      this.router.navigate(["/admin/login"]);
      return false;
    } else {
      return true;
    }
  }

  get isLoggedIn(): boolean {
    let userObj: any = localStorage.getItem("commercioPublicDetails");
    const user = JSON.parse(userObj);
    return user !== null ? true : false;
  }
}
