import { Injectable, Inject } from "@angular/core";
import { Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from "./app.config";

@Injectable()
export class WorkflowService {
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

  //Gets the list of Approval Forms
  public getAllApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.ApiUrl}api/ApprovalsByTerritoryAndType`)

  }


  //GET specific Approval record from the list - by ID
  public getApprovalForm(formId: string) {
    console.log('Get Form : ' + formId);
    return this.http.get(`${this.ApiUrl}api/Approvals/${formId}`);

  };


  //GET specific Approval record based on Territory and form type
  //EXAMPLE - http://uskenappdev01:8040/api/Approvals/filter/non-specific/fr

  public getApprovalFormByTerritoryAndType(Territory: string,formType: string) {
    console.log(`Get Approval Form By Territory and Form Type  : ${Territory}/${formType}`);
    return this.http.get(`${this.ApiUrl}api/Approvals/filter/${Territory}/${formType}`);

  };
  /**GET REGIONAL MANAGER   */
  public getRegionalMgr(region: string) {
    console.log(`Get Region by Region Name  : ${region}`);
    return this.http.get(`${this.ApiUrl}api/Regions/filter/${region}`);

  };


  //FORM CRUD
  //Updates an existing Record
  public updateAppForm(newForm: Approval) {
    console.log("update Form");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    return this.http.put(`${this.ApiUrl}api/Approvals/${newForm.aid}`, JSON.stringify(newForm), { headers: headers });
  };
}


export class Approval {
  public aid: number = 0;
  public FormType: string = "";
  public NumApprovals: number = 0;
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
  public ApprovalSendTo: string = "";
  public ApprovalSendToEmail: string = "";
  public FormTypeName: string = "";
  public Territory: string = "";
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
}


export class FormNameType {
  public name: string;
  public type: string;
}






