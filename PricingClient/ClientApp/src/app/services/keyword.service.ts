import { Injectable, Inject } from "@angular/core";
import { Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from "./app.config";

@Injectable()
export class KeywordService {
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

  //Gets the list of Keyword Forms
  public getAllKeywords(): Observable<Keyword[]> {
    const headers = new HttpHeaders().set("App", "Pricing");
    return this.http.post<Keyword[]>(`${this.ApiUrl}api/keywords`, null, { headers: headers })
  }

  private extractData(res: Response) {
  let body = res.json();
  return body;
}

  //GET specific record from the list
  public getKeyword(formId: string) {
  const headers = new HttpHeaders().set("App", "Pricing");
  return this.http.post(`${this.ApiUrl}api/keywords/${formId}`, null, { headers: headers })
  };

  //GET specific record from the list
  public getKeywordByKeyword(keyword: string) {
    const headers = new HttpHeaders().set("App", "Pricing");
    return this.http.post(`${this.ApiUrl}api/keywords/filter/${keyword}`, null, { headers: headers })
  };



  //Updates an existing  record
  public updateKeywordForm(newForm: Keyword) {
  console.log("update Form");
  const headers = new HttpHeaders()
    .set("Content-Type", "application/json; charset=utf-8");
  return this.http.put(`${this.ApiUrl}api/Keywords/${newForm.kid}`, JSON.stringify(newForm), { headers: headers });
};

  //CREATES A NEW Language RECORD
  public addForm(form: Keyword) {
  console.log("add Form");
  const headers = new HttpHeaders()
    .set("Content-Type", "application/json; charset=utf-8");
  console.log('added Form ');
  return this.http.post(`${this.ApiUrl}api/Keywords/`, JSON.stringify(form), { headers: headers });

};



  //removes an existing Product
  public removeItem(formId: number) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    console.log("removeItem:" + formId);
    return this.http.delete(`${this.ApiUrl}api/Keywords/${formId}`, { headers: headers });
  }
}




export class Keyword {
  public kid: number = 0;
  public Keyword1: string = "";
  public Value: string = "";
  public Description: string = "";

}






