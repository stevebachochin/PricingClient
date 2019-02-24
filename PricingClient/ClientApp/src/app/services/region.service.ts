import { Injectable, Inject } from "@angular/core";
import { Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from "./app.config";

@Injectable()
export class RegionService {
  [x: string]: any;
  private baseUrl: string;
  private wastouched: boolean = true;
  protected ApiUrl: string = AppConfig.settings.ConnectionStrings.apiServer;
  //private products: any;

  formWasTouched(formresult: boolean) {
    return formresult;
  }

  constructor(private http: HttpClient) {

  }

  //Gets the list of Request Forms
  public getAllRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.ApiUrl}api/Regions`)

  }


  //GET specific record from the list
  public getRegion(formId: string) {
    console.log('Get Form : ' + formId);
    return this.http.get(`${this.ApiUrl}api/Regions/${formId}`);

  };



  //FORM CRUD
  //Updates an existing Record
  public updateRegionForm(newForm: Region) {
    console.log("update Form");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    return this.http.put(`${this.ApiUrl}api/Regions/${newForm.rid}`, JSON.stringify(newForm), { headers: headers });
  };

  //CREATES A NEW Region RECORD
  public addRegionForm(form: Region) {
    console.log('added Product : ' + JSON.stringify(form));
    const headers = new HttpHeaders()
      // .set("Content-Type", "application/json; charset=utf-8");
      .set("Content-Type", "application/json; charset=utf-8");
    return this.http.post(`${this.ApiUrl}api/Regions/`, JSON.stringify(form), { headers: headers });
  };

  //removes an existing Record
  public removeFrItem(formId: number) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    //console.log("removeItem:" + formId);
    return this.http.delete(`${this.ApiUrl}api/Regions/${formId}`, { headers: headers });

  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }
}





export class Region {
  public rid: number = 0;
  public Region1: string = "";
  public Approver: string = "";
  public ApproverEmail: string = "";

}






