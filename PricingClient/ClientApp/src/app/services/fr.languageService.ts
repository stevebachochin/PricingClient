import { Injectable, Inject } from "@angular/core";
import { Response, RequestOptions, Headers } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TagContentType } from "@angular/compiler";
import { Globals } from './../models/global.model';
import { AppConfig } from "./app.config";

@Injectable()
export class FRLanguageService {
  [x: string]: any;
  private baseUrl: string;
  private wastouched: boolean = true;
  selectedLanguage: string = "en";
  selectedLanguageName: string = "English";
  protected ApiUrl: string = AppConfig.settings.ConnectionStrings.apiServer;

  ///LANGUAGE OBJECT
  private lang: FRLanguage;
  private _languageData = new BehaviorSubject(this.lang);
  languageData = this._languageData.asObservable();
  changeLanguageData(NewLanguageData: FRLanguage) {
    this._languageData.next(NewLanguageData);
  }
  ///END LANGUAGE OBJECT

  formWasTouched(formresult: boolean) {
    return formresult;
  }

  constructor(
    private http: HttpClient,
    private globals: Globals,
  ) {
    if (localStorage.getItem('selectedLanguage') != null) {
      this.selectedLanguage = localStorage.getItem('selectedLanguage');
      this.selectedLanguageName = localStorage.getItem('selectedLanguageName');
    }
  }


  //ApiUrl: string = AppSettings.Current().ConnectionStrings["FileAPIURL"];
  /**
  * ApiUrl: string = 'http://uskenappdev01:8030/api/';
  * Example http://localhost:56264/api/FieldLangByCode/110
  * GET LANGUAGE BY LANGUAGE CODE
  */

  public getLanguageByLangCode(langCode: string) {
    //console.log("lang code " + langCode);
    return this.http.get(`${this.ApiUrl}api/frlangbyCode/${langCode}`);
  };


  /**  Get all FIELD FORM ASSURANCE LANGUAGE items  http://uskenappdev01:8010/api/fr_lang */
  public getAllLanguages(): Observable<FRLanguage[]> {
    return this.http
      .get<FRLanguage[]>(`${this.ApiUrl}api/fr_lang`);
   
  }


  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  //GET specific product from the list
  public getLanguage(formId: string) {
    //console.log('Get Lang Form : ' + formId);
    return this.http.get(`${this.ApiUrl}api/fr_lang/${formId}`);

  };

  //Updates an existing Language record
  public updateLanguageForm(newForm: FRLanguage) {
    //console.log("update Form");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    return this.http.put(`${this.ApiUrl}api/fr_lang/${newForm.lfzid}`, JSON.stringify(newForm), { headers: headers });
  };

  //CREATES A NEW Language RECORD
  public addForm(form: FRLanguage) {
    //console.log("add Form");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    console.log('added Form ');
    return this.http.post(`${this.ApiUrl}api/fr_lang/`, JSON.stringify(form), { headers: headers });

  };



  //removes an existing Product
  public removeItem(formId: number) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    //console.log("removeItem:" + formId);
    return this.http.delete(`${this.ApiUrl}api/fr_lang/${formId}`, { headers: headers });

  }




}

export class FormsSearchCriteria {
  sortColumn: string;
  sortDirection: string;
}

export class FRLanguage {
  public lfzid: number = 0;
  public FormTitle: string = "";
  public FormNumber: string = "";
  public Created: string = "";
  public CreatedBy: string = "";
  public Status: string = "";
  public Representative: string = "";
  public Region: string = "";
  public SectionReqHospital: string = "";
  public SectionShipHospital: string = "";
  public SectionApprovals: string = "";
  public SectionDetails: string = "";
  public HospitalReq: string = "";
  public AccountNumberReq: string = "";
  public CityReq: string = "";
  public StateReq: string = "";
  public ZipReq: string = "";
  public ContactName: string = "";
  public ContactPhone: string = "";
  public SameHospAddr: string = "";
  public HospitalShip: string = "";
  public AccountNumberShip: string = "";
  public CityShip: string = "";
  public StateShip: string = "";
  public ZipShip: string = "";
  public FreezerType: string = "";
  public FreezerTypeOther: string = "";
  public ReqArrivalDate: string = "";
  public PONumber: string = "";
  public Address1Req: string = "";
  public Address2Req: string = "";
  public SameAddress: string = "";
  public Address1Ship: string = "";
  public Address2Ship: string = "";
  public CountryReq: string = "";
  public CountryShip: string = "";
  public CountryOtherReq: string = "";
  public CountryOtherShip: string = "";
  public StateOtherReq: string = "";
  public StateOtherShip: string = "";
  public Approvers: string = "";
  public Signatures: string = "";
  public ApproverTitles: string = "";
  public ApproverDecisions: string = "";
  public LangName: string = "";
  public Lang: string = "";
}


