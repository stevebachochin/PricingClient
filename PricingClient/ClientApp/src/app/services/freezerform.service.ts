import { Injectable, Inject } from "@angular/core";
import { Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from "./app.config";

@Injectable()
export class FrFormService {
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

  //ApiUrl: string = 'http://uskenappdev01:8040/api/FR_Form';
 // ApiUrl: string = 'http://uskenappdev01:8040/';

  //Gets the list of Request Forms
  public getAllFrForms(): Observable<FrForm[]> {
    return this.http.get<FrForm[]>(`${this.ApiUrl}api/FR_Form`)
  }
  /** FREEZER FORM VIEW
   * 
   * @param pageNumber
   * @param pageSize
   * @param sortOrder
   * @param columnName
   * @param querySearch      SEARCH TEXT
   * @param querySearchName  WHAT FIELD IS THE SEARCH ON
   */
  public findFrForms(pageNumber: number, pageSize: number, sortOrder: string, columnName: string, querySearchName: string, querySearch: string): Observable<any> {
    if (querySearchName != null && querySearch != null && querySearchName != "" && querySearch != "") {
      let httpParams = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('sortOrder', sortOrder.toString())
        .set('columnName', columnName.toString())
        .set('querySearchName', querySearchName.toString())
        .set('querySearch', querySearch.toString())
      return this.http.get<any>(`${this.ApiUrl}api/FR_Form`, {
        params: httpParams,
        observe: 'response',
        responseType: 'json'
      }
      )
    } else {

      let httpParams = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('sortOrder', sortOrder.toString())
        .set('columnName', columnName.toString())
      return this.http.get<any>(`${this.ApiUrl}api/FR_Form`, {
        params: httpParams,
        observe: 'response',
        responseType: 'json'
      }
      )
    }

  }


  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  //GET specific record from the list
  public getFrForm(formId: string) {
    console.log('Get Form : ' + formId);
    return this.http.get(`${this.ApiUrl}api/FR_Form/${formId}`);

  };



  //FORM CRUD
  //Updates an existing Record
  public updateFrForm(newForm: FrForm) {
    console.log("update Form");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    return this.http.put(`${this.ApiUrl}api/FR_Form/${newForm.fzid}`, JSON.stringify(newForm), { headers: headers });
  };

  //CREATES A NEW FIELD RECORD
  public addFrForm(form: FrForm) {
    console.log('added Product : ' + JSON.stringify(form));
    const headers = new HttpHeaders()
     // .set("Content-Type", "application/json; charset=utf-8");
      .set("Content-Type", "application/json; charset=utf-8");
    return this.http.post(`${this.ApiUrl}api/FR_Form/`, JSON.stringify(form), { headers: headers });
  };

  //removes an existing Record
  public removeFrItem(formId: number) {
    const headers = new HttpHeaders()
     .set("Content-Type", "application/json; charset=utf-8");
    console.log("removeItem:" + formId);
    return this.http.delete(`${this.ApiUrl}api/FR_Form/${formId}`, { headers: headers });

  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

}

export class FrFormsSearchCriteria {
  sortColumn: string;
  sortDirection: string;
}

export class FrForm {
  public fzid: number = 0;
  public FormType: string = "";
  public Created: Date | undefined;
  public CreatedBy: string = "";
  public Status: string = "";
  public StatusNumber: number = 0;
  public Representative: string = "";
  public Region: string = "";
  public HospitalReq: string = "";
  public AccountNumberReq: string = "";
  public CityReq: string = "";
  public StateReq: string = "";
  public StateOtherReq: string = "";
  public ZipReq: string = "";
  public ContactName: string = "";
  public ContactPhone: string = "";
  public SameHospAddr: string = "";
  public HospitalShip: string = "";
  public AccountNumberShip: string = "";
  public CityShip: string = "";
  public StateShip: string = "";
  public StateOtherShip: string = "";
  public ZipShip: string = "";
  public FreezerType: string = "";
  public FreezerTypeOther: string = "";
  public ReqArrivalDate: Date | undefined;
  public PONumber: string = "";
  public Readers: string = "";
  public Completed: string = "";
  public FormNumber: string = "";
  public Address1Req: string = "";
  public Address2Req: string = "";
  public Address1Ship: string = "";
  public Address2Ship: string = "";
  public CountryReq: string = "";
  public CountryShip: string = "";
  public Approver0: string = "";
  public Approver1: string = "";
  public Approver2: string = "";
  public Approver3: string = "";
  public Approver4: string = "";
  public Approver5: string = "";
  public Approver6: string = "";
  public Approver7: string = "";
  public Approver8: string = "";
  public Approver9: string = "";
  public Approver10: string = "";
  public ApproverTitle0: string = "";
  public ApproverTitle1: string = "";
  public ApproverTitle2: string = "";
  public ApproverTitle3: string = "";
  public ApproverTitle4: string = "";
  public ApproverTitle5: string = "";
  public ApproverTitle6: string = "";
  public ApproverTitle7: string = "";
  public ApproverTitle8: string = "";
  public ApproverTitle9: string = "";
  public ApproverTitle10: string = "";
  public Copy0: string = "";
  public Copy1: string = "";
  public Copy2: string = "";
  public Copy3: string = "";
  public Copy4: string = "";
  public Copy5: string = "";
  public Copy6: string = "";
  public Copy7: string = "";
  public Copy8: string = "";
  public Copy9: string = "";
  public Copy10: string = "";
  public ApproverSignature0: string = "";
  public ApproverSignature1: string = "";
  public ApproverSignature2: string = "";
  public ApproverSignature3: string = "";
  public ApproverSignature4: string = "";
  public ApproverSignature5: string = "";
  public ApproverSignature6: string = "";
  public ApproverSignature7: string = "";
  public ApproverSignature8: string = "";
  public ApproverSignature9: string = "";
  public ApproverSignature10: string = "";
  public ApproverDate0: string = "";
  public ApproverDate1: string = "";
  public ApproverDate2: string = "";
  public ApproverDate3: string = "";
  public ApproverDate4: string = "";
  public ApproverDate5: string = "";
  public ApproverDate6: string = "";
  public ApproverDate7: string = "";
  public ApproverDate8: string = "";
  public ApproverDate9: string = "";
  public ApproverDate10: string = "";
  public ApprovalSendTo: string = "";
  public ApprovalSendToEmail: string = "";
  public ApproverEmail0: string = "";
  public ApproverEmail1: string = "";
  public ApproverEmail2: string = "";
  public ApproverEmail3: string = "";
  public ApproverEmail4: string = "";
  public ApproverEmail5: string = "";
  public ApproverEmail6: string = "";
  public ApproverEmail7: string = "";
  public ApproverEmail8: string = "";
  public ApproverEmail9: string = "";
  public ApproverEmail10: string = "";
  public CopyEmail0: string = "";
  public CopyEmail1: string = "";
  public CopyEmail2: string = "";
  public CopyEmail3: string = "";
  public CopyEmail4: string = "";
  public CopyEmail5: string = "";
  public CopyEmail6: string = "";
  public CopyEmail7: string = "";
  public CopyEmail8: string = "";
  public CopyEmail9: string = "";
  public CopyEmail10: string = "";
  public NumApprovals: number = 0;
}






