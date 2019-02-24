import { Component, OnInit, ElementRef } from '@angular/core';
//import { FormLanguageService, FormLanguage } from '../../services/languageService';
import { WorkflowService, Approval } from '../../services/workflow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable} from 'rxjs';

@Component({
  selector: 'approvalsview',
  templateUrl: './approvals-view.component.html',
  styleUrls: ['../css/view.component.css']
})
export class ApprovalsViewComponent implements OnInit {

  resourceLoaded: boolean;
 // langData: FormLanguage;
  allApprovals: Observable<Approval[]>;

  displayedColumns = ['Territory', 'FormTypeName'];
  
  constructor(
    public router: Router,
    //private langDataService: FormLanguageService,
    private workflowService: WorkflowService,
  )
  {
   // this.langData = new FormLanguage();
  }

  ngOnInit() {

    this.resourceLoaded = false;
    //this.langDataService.languageData.subscribe(value => this.langData = value);
    this.workflowService.getAllApprovals().subscribe(
      (data: any) => {
        this.allApprovals = data;
        this.resourceLoaded = true;
      })
  }

  getAllKeywordByKey() {

  }
}  

