import { NgForm, Form, FormControl, ControlValueAccessor } from '@angular/forms';
import { NgZone, Component, OnInit, ChangeDetectionStrategy, ViewChild, HostListener, ViewEncapsulation, Input, PipeTransform, Pipe } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AuthService, Country, State } from '../../services/auth.service';
import { WorkflowService, Approval, FormNameType} from '../../services/workflow.service';
import { RegionService, Region } from '../../services/region.service';
import { KeywordService, Keyword } from '../../services/keyword.service';
import { MatSelect, VERSION } from '@angular/material';
import { take, takeUntil } from 'rxjs/operators';
import { ADNamesService, ADName } from '../../services/adnames.service';

@Component({
  selector: 'approvalsform',
  templateUrl: './approvals-form.component.html',
  styleUrls: ['../css/form.component.css'],
  encapsulation: ViewEncapsulation.None
  //changeDetection: ChangeDetectionStrategy.Default providers: [UploadFileService]
})
export class ApprovalsFormComponent implements OnInit {

  typeList: Array<FormNameType>=[];
  //typeList: Observable<FormNameType[]>;
  resourceLoaded: boolean;
  allFormTypesArr: string[];// = ["LN", "FR"];
  allTerritoriesArr: string[];
  allApproverTypesArr: string[];
  allFormNamesArr: string[];
  model: any;
  files: any[] | undefined;
  editable: boolean = false;
  submitted: boolean = true;
  wastouched: boolean = true;
  myName: string = "";
  //FORM DATA
  appFormData: any;
  appArrData: any[];
  langData: any;
  fzid: string;
  paramid: any;
  accepted: Boolean = true;
  acceptedStr: string = "yes";
  isChecked: boolean = false;
  selectedLanguage: string;
  selectedLanguageName: string;
  pdfFileName: string = "";
  frmMsg: string = "";
  dateNow: Date = new Date();
  countryFld: string = "";
  stateFld: string = "";
  stateOtherFld: string = "";
  //All Regions
  allRegions: Observable<Region[]>;
  allRegionsString: string = "";
  /////////@ViewChild('fieldForm')
  appForm: NgForm;
  appNumArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  aprFldArr: string[] = [];
  aprFldNamesArr: string[] = ["Approver","Copy"];
  forms: Observable<Object> | undefined;
  //allLanguages: Observable<FormLanguage[]>;
  //STORED VARIABLES FOR CHILD READONLY FORM
  //heroes = HEROES;
  master = 'Master';
  navigationSubscription: any;
  fileAPIURL: string = "";
  ///////
  private ADNames: ADName[];

  private approvers: string[];
  private emailAddresses: string[];
  private selectedUsers: string[];

  /**=[{
    "ADFullName": "Antonio Gonzalez",
    "ADEmailAddress": "Gonzalez.Antonio@cryolife.com"
  }]
  **/
  

  constructor(
    private zone: NgZone,
    private authService: AuthService,
    private regionService: RegionService,
    private workflowService: WorkflowService,
    private keywordService: KeywordService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private adNamesService: ADNamesService,
  ) {
  }

 
  // WHEN THE PAGE INITIALLY LOADS... 
  ngOnInit() {
    this.resourceLoaded = false;
    this.editable = false;
    this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.fzid = id;
        this.getApprovalForm(id);
        this.getFormTypes();
        this.getTerritories();
        this.getApproverTypes();
        this.getADNames();
      }
    );




  }

  /**
* GET AD Names
* @param id
*/
  getADNames() {


    //First check sessionStorage

    if (sessionStorage.getItem('ADNames')){
      this.ADNames = JSON.parse(sessionStorage.getItem('ADNames'));
      this.setApproversSearchCtrl();
      this.resourceLoaded = true;
      console.log("NOoooo AD Lookup ");
    } else {
      this.adNamesService.getAllADNames().subscribe((data: any) => {
        this.ADNames = data;
        //console.log(JSON.stringify(data));
        sessionStorage.setItem("ADNames", JSON.stringify(data));
        this.setApproversSearchCtrl();
        this.resourceLoaded = true;
        console.log("AD Lookup ");
      },
        error => {
          this.resourceLoaded = false;
          this.frmMsg = error;
        },
        () => {
          //NO ERRORS!!! console.log("No errors");
        }
      );
    }


  }

  /**SPLIT "COPYTO" FIELDS FOR PICKLIST(STRING TO ARRAY & and insert email address) */
  splitAprFrmFlds() {
    this.appArrData = new Array();

    

    for (var x = 0; x < 11; x++) {

      //LOOP THROUGH FIELD NAMES
      for (let aprFldName of this.aprFldNamesArr) {
        
      
        if (this.appFormData[aprFldName + x] != null && this.appFormData[aprFldName + x] != "" && this.appFormData[aprFldName + x] != "n/a") {
  
          var copyNameTmpArr: string[] = this.appFormData[aprFldName + x].split(",");
          var copyEmailTmpArr: string[] = this.appFormData[aprFldName + "Email" + x].split(",");
          var copyTmpArr = new Array();
          //assemble existing picklist values
          for (var i = 0; i < copyNameTmpArr.length; i++) {

            copyTmpArr.push(copyNameTmpArr[i] + "~" + copyEmailTmpArr[i]);
           // console.log("2--------->   " + copyTmpArr[i]); 
          }

          this.appArrData[aprFldName + "Arr" + x] = copyTmpArr;
          
        }
        
      }
    }
  }




  private setApproversSearchCtrl() {

    // set initial selection
    this.adNamesPicklistCtrl.setValue(this.ADNames[10]);
    this.adNamesPicklistMultiCtrl.setValue([this.ADNames[10], this.ADNames[11], this.ADNames[12]]);

    // load the initial bank list
    this.filteredADNames.next(this.ADNames.slice());
    this.filteredADNamesMulti.next(this.ADNames.slice());

    // listen for search field value changes
    this.adNamesPicklistFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterADNames();
      });
    this.adNamesPicklistMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterADNamesMulti();
      });
  
  }

  /** control for the selected bank */
  public adNamesPicklistCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public  adNamesPicklistFilterCtrl: FormControl = new FormControl();

  /** control for the selected bank - Multi-selection*/
  public adNamesPicklistMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword - Multi-selection*/
  public adNamesPicklistMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredADNames: ReplaySubject<ADName[]> = new ReplaySubject<ADName[]>(1);

  /** list of banks filtered by search keyword - Multi-selection*/
  public filteredADNamesMulti: ReplaySubject<ADName[]> = new ReplaySubject<ADName[]>(1);

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @ViewChild('singleSelect') singleSelect: MatSelect;
  @ViewChild('multiSelect') multiSelect: MatSelect;

  private filterADNames() {
    if (!this.ADNames) {
      return;
    }
    // get the search keyword
    let search = this.adNamesPicklistFilterCtrl.value;
    if (!search) {
      this.filteredADNames.next(this.ADNames.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredADNames.next(
      this.ADNames.filter(bank => bank.ADFullName.toLowerCase().indexOf(search) > -1)
    );
  }



  private filterADNamesMulti() {
    if (!this.ADNames) {
      return;
    }
    // get the search keyword
    let search = this.adNamesPicklistMultiFilterCtrl.value;
    if (!search) {
      this.filteredADNamesMulti.next(this.ADNames.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredADNamesMulti.next(
      this.ADNames.filter(bank => bank.ADFullName.toLowerCase().indexOf(search) > -1)
    );
  }

  /**
   * GET THE DISPLAY NAME OF THE FORM BASED ON THE FORM TYPE SELECTED IN $event
   */
  public formTypeSelectionChange($event): void {

    var typStr: string;
    var typ: string;
    
    for (typStr of this.allFormTypesArr) {
      typ = typStr.toString().split("|")[1];
      if ($event.value == typ) {
        this.appFormData.FormTypeName = typStr.toString().split("|")[0];
      }
    }
  }

  /**
   * CLEAR AND HIDE THE APPROVER FIELD IF "Region Manager" is selected $event
   */
  public approverTypeChange($event, idx: string): void {
    console.log(idx);

    var val: string = $event.value.toString().trim();
    //var fldname: string = "Approver" + idx;
    if ($event.value.toString().trim().toLowerCase() == "region manager") {
      this.appFormData["Approver" + idx] = "n/a";
      this.appFormData["ApproverEmail" + idx] = "n/a";
    }
  }





  /**
   * GET FORM TYPES
   */
  getFormTypes() {
    var typeStr: string;
    this.keywordService.getKeywordByKeyword("form types")
      .subscribe((data: Keyword) => {
        this.allFormTypesArr = data.Value.toString().split(",");

        for (typeStr of this.allFormTypesArr) {
          let typeObject = new FormNameType();
          typeObject.name = typeStr.toString().split("|")[0];
          typeObject.type = typeStr.toString().split("|")[1];
          this.typeList.push(typeObject);
        }
        this.resourceLoaded = true;
      },
        error => {
          this.resourceLoaded = false;
          this.frmMsg = error;
        },
        () => {
          //console.log("No errors");
        }
    );
  }

  /**
   * GET TERRITORIES
   * @param id
   */
  getTerritories() {
    this.keywordService.getKeywordByKeyword("territories")
      .subscribe((data: Keyword) => {
        this.allTerritoriesArr = data.Value.toString().split(",");
        this.resourceLoaded = true;
      },
        error => {
          this.resourceLoaded = false;
          this.frmMsg = error;
        },
        () => {
          //console.log("No errors");
        }
      );
  }


  /**
 * GET APPROVER TYPES
 * @param id
 */
  getApproverTypes() {
    this.keywordService.getKeywordByKeyword("approver types")
      .subscribe((data: Keyword) => {
        this.allApproverTypesArr = data.Value.toString().split(",");
        this.resourceLoaded = true;
      },
        error => {
          this.resourceLoaded = false;
          this.frmMsg = error;
        },
        () => {
          //console.log("No errors");
        }
      );
  }





  /**GET CURRENT FORM */
  getApprovalForm(id: string) {
    //USE route.params.subscribe to detect parameter changes
    if (id == "new") {
      //CREATE NEW RECORD
      this.appFormData = new Approval();
      this.resourceLoaded = true;
      this.editable = true;
    } else {
      //FETCH EXISTING RECORD
      this.workflowService.getApprovalForm(id)
        .subscribe((data: Approval) => {
          //APPROVAL FORM DATA
          this.appFormData = data;
          //FOR MULTI-VALUE FIELDS - SPLITS BACKEND RECORD COMMA DELIMITED STRINGS INTO AN ARRAY
          this.splitAprFrmFlds();
          this.resourceLoaded = true;
        },
          error => {
            this.frmMsg = error;
          },
          () => {
            //NO ERRORS!!console.log("No errors");
          }
        )
    }


  }

  //LOGIC TO DETERMINE IF THE EDIT BUTTON SHOULD BE DISABLED (this shows the user that they do or do NOT have this ability)
  disableEdit() {

    //GENERIC HANDLING OF FORM PREVIOUS TO STARTING WORKFLOW
    //if (this.appFormData.Status == "New" || this.appFormData.Status == "Draft") {
      return false;

  }


  getFormMsg() {

    return this.frmMsg;
  }

  editForm() {
    this.editable = true;
  }
  //CANCEL CHANGES ALREAY MADE TO NEW OR EXISTING RECORDS
  cancelForm() {
    this.getApprovalForm(this.fzid);

    if (this.fzid != "new") {
      this.editable = false;
    }
  }

  //UPDATE OR ADD A FIELD Record


  //UPDATE EXISTING PRODUCT
  public updateForm(item: Approval) {
    if (this.fzid == "new") {
      //ADD A PRODUCT
      this.workflowService.addFrForm(this.appFormData)
        .subscribe((data: any) => {
          this.zone.run(() => {
            console.log('force update the screen');
            location.reload();
          });
        }, error => console.log('Could not create the Approval Form.'));

      this.router.navigate(['../home']);

    } else {
      //MODIFY A PRODUCT
     
      this.workflowService.updateAppForm(item)
        .subscribe(
          (data: any) => {
            this.editable = false;
          }, error => console.log('Could not update The Approval Form.'));
    }
  }



  public getAllRegions() {
    this.regionService.getAllRegions().subscribe(
      (data: any) => {
        //console.log("--------------->"+data.length);
        this.allRegions = data;
        //GET ALL REGIONS AS A STRING
        this.implodeValues(data);

      })
  }

  //GET ALL REGIONS AS A STRING
  public implodeValues(objdata) {
    for (let entry of objdata) {
      this.allRegionsString = this.allRegionsString + entry.Region1;
    }
  }



  /**CHECK FOR DUPLICATES */
  public selectDuplicateCheck() {
    if (this.allRegionsString.includes(this.appFormData.Region)) {
      return false;
    }
    return true;
  }
  
  formTouched(formresult: boolean) {
 
  }
  /**
   * 
   * get approver's name, email address, and target file to write to.
   */
  public getPersonsEmailAddress(event, fldName, fldEmail) {
    this.appFormData[fldName] = event.source.value.ADFullName;
    this.appFormData[fldEmail] = event.source.value.ADEmailAddress;

  }

  /**
   * GET SELECTED LIST OF PEOPLE AND THEIR EMAIL ADDRESSES
   * @param event
   * @param fldName
   * @param fldEmail
   */
  public getPersonsEmailAddressMulti(event, fldName, fldEmail) {

    //console.log(event.source.value.toString());

    //create new arrays everytime this function is called
    this.approvers = new Array();
    this.emailAddresses = new Array();
    
    for (let entry of event.source.value) {
      this.selectedUsers = entry.split("~");
      this.approvers.push(this.selectedUsers[0]);
      this.emailAddresses.push(this.selectedUsers[1]);
    }
   this.appFormData[fldName] = this.approvers.toString();
   this.appFormData[fldEmail] = this.emailAddresses.toString();
  }


}
