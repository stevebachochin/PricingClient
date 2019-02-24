import { Injectable, Inject } from "@angular/core";
import { Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from "./app.config";

@Injectable()
export class ADNamesService {
  [x: string]: any;
  //protected ApiUrl: string = AppConfig.settings.ConnectionStrings.apiServer;
  protected ApiUrl: string = AppConfig.settings.ConnectionStrings.apiAuthServer;
  //private products: any;

  formWasTouched(formresult: boolean) {
    return formresult;
  }

  constructor(private http: HttpClient) {

  }

  public getAllADNames(): Observable<ADName[]> {
    const headers = new HttpHeaders().set("App", "CryoLife App");
    return this.http.post<ADName[]>(`${this.ApiUrl}api/users`, null, { headers: headers })
  }
  /**
  //Gets the list of Keyword Forms
  public getAllADNames(): Observable<ADName[]> {
    const headers = new HttpHeaders().set("App", "CryoLife App");
    return this.http.post<ADName[]>(`${this.ApiUrl}api/users`, null, { headers: headers })
  }
  **/
  private extractData(res: Response) {
  let body = res.json();
  return body;
}
}




//export class ADName {
export class ADName {
  public ADFullName: string = "";
  public ADEmailAddress: string = "";
}






