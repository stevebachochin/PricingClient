import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route } from '@angular/router';
//import { FormLanguageService, FormLanguage } from './languageService';
//import { AuthApiResponse, AuthResponse } from '../models/auth-api-response.model';
import { AppConfig } from "./app.config";


@Injectable()
//export class AuthService implements CanActivate, CanActivateChild {
export class AuthService {
  langData: any;
  //IMPORTANT KEY FOR MAKING TOKEN AND DETERMINING ACCESS
  app: string = "Field Assurance";
  //authData: AuthResponse;
  protected ApiUrl: string = AppConfig.settings.ConnectionStrings.apiAuthServer;

  constructor(
    private http: HttpClient,
    private router: Router,
    // private langDataService: FormLanguageService,
    // private authApiResponse: AuthApiResponse,
  ) {
    //this.authData = new AuthResponse();
  }


  /***  Determine if Login Credentials are valid by contacting API **/

  public login(userName: string, password: string) {
    var reqData = `username=${userName}&password=${password}&grant_type=password&application=` + this.app;
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'Accept': 'application/json' })
    return this.http.post(`${this.ApiUrl}/token`, reqData,
      {
        headers: reqHeaders,
        responseType: 'json',
        observe: 'response'
      });
  }

  public decryptToken() {
    var reqHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') })
    return this.http.get(`${this.ApiUrl}api/token`, { headers: reqHeaders });
  }









  /**
Decrypts Token and inserts those values in
example data...
{
    "Authorized": "yes",
    "Message": "Authorized",
    "UserDisplayName": "Steve Bachochin",
    "LoggedOn": "10/1/2018 3:55:28 PM"
}
   **/


  /**

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // 1 - CHECK FOR TOKEN 
    if (localStorage.getItem('userToken') != null) {
      //TOKEN FOUND
      //1.1 - CHECK TOKEN EXPIRATION DATE -- this is where the token needs to be decrypted...via new API
      //DECRYPT TOKEN - IF NO 401 - UNAUTHORIZED ERROR TOKEN HAS NOT EXPIRED.
      //console.log("XXXXXXXXXXXXXXX ACTIVATE XXXXXXXXXXXXXXX");
      this.authData = new AuthResponse();
      this.decryptToken()
        .subscribe((data: any) => {
          //POPULATE AUTHDATA
          this.authData.Authorized = "yes";
          this.authData.Message = "Authorized";
          this.authData.UserDisplayName = data.UserDisplayName;
          this.authData.LoggedOn = data.LoggedOn;
          this.authData.Admin = data.Admin;
          this.authData.IT = data.IT;
          this.authData.Application = data.Application;
          this.authApiResponse.changeAuthResponse(this.authData);
          //CHECK TO SEE IF THIS TOKEN IS FOR THIS APPLICATION GROUP
          if (data.Application == "Field Assurance") {
            return true;
          } else {
            //TOKEN EXPIRED
            //REMOVE EXPIRED TOKEN
            localStorage.removeItem('userToken');
            //FORCE USER TO LOGIN
            this.router.navigate(['/login']);
            return false;
          }
        },
          error => {
            //TOKEN EXPIRED
            //REMOVE EXPIRED TOKEN
            localStorage.removeItem('userToken');
            //FORCE USER TO LOGIN
            this.router.navigate(['/login']);
            return false;
          }
        );
      return true;

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  ///IT ONLY

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.authData.IT === "yes") {
      //console.log("DSFDSFDSFDSF2222222");
      return true;
    }
    //this.router.navigate(['/']);
    // return false;
    return true;
  }


**/



  //GET specific record from the list
  public getAllStates() {
    return this.http.get(`${this.ApiUrl}api/States`);

  };

  public getAllCountries() {
    return this.http.get(`${this.ApiUrl}api/Countries`);

  };

}

export class Country {
  public cid: number = 0;
  Code: string;
  CountryName: string;
}

export class State {
  public sid: number = 0;
  Code: string;
  StateName: string;
}
