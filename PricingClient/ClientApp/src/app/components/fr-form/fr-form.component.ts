import { NgForm, Form, FormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
import { FrFormService, FrForm} from '../../services/freezerform.service';
import { Location } from "@angular/common";
import { NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService, Country, State } from '../../services/auth.service';
import { RegionService, Region } from '../../services/region.service';
import { KeywordService, Keyword } from '../../services/keyword.service';
import { MatSelect } from '@angular/material';
import { WorkflowService, Approval } from '../../services/workflow.service';
import { takeUntil } from 'rxjs/operators';
import { Globals } from '../../models/global.model';
import { LanguageService, Language } from '../../services/languageService';
import { FRLanguageService, FRLanguage } from '../../services/fr.languageService';

@Component({
  selector: 'frform',
  templateUrl: './fr-form.component.html',
  styleUrls: ['../css/form.component.css'],
  encapsulation: ViewEncapsulation.None
  //changeDetection: ChangeDetectionStrategy.Default providers: [UploadFileService]
})
export class FrFormComponent implements OnInit {
  resourceLoaded: boolean;
  countries: Country[];
  states: State[];
  model: any;
  appFormData: any;
  files: any[] | undefined;
  editable: boolean = false;
  submitted: boolean = true;
  wastouched: boolean = true;
  myName: string = "";
  frFormData: FrForm;
  //langData: any;
  fzid: string;
  paramid: any;
  accepted: Boolean = true;
  acceptedStr: string = "yes";
  isChecked: boolean = false;
  frmMsg: string = "";
  dateNow: Date = new Date();
  countryFld: string = "";
  stateFld: string = "";
  stateOtherFld: string = "";
  //All Regions
  allRegions: Observable<Region[]>;
  allRegionsString: string = "";
  allFreezerTypesArr: string[];
  frForm: NgForm;
  
  forms: Observable<Object> | undefined;
  master = 'Master';
  navigationSubscription: any;
  fileAPIURL: string = "";
  ///LANGUAGE
  frlangData: FRLanguage;
  langData: Language;
  selectedPageSize: number;
  selectedLanguage: string;
  selectedLanguageName: string;
  doLookup: Boolean = true;

  constructor(
    private globals: Globals,
    private zone: NgZone,
    private frFormService: FrFormService,
    private authService: AuthService,
    private regionService: RegionService,
    private keywordService: KeywordService,
    private workflowService: WorkflowService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private langDataService: LanguageService,
    private frlangDataService: FRLanguageService,
  )
  {
    this.frlangData = new FRLanguage();
    this.langData = new Language();
    this.selectedLanguage = localStorage.getItem('selectedLanguage');
    this.selectedLanguageName = localStorage.getItem('selectedLanguageName');

  }


  // WHEN THE PAGE INITIALLY LOADS... 
  ngOnInit() {
    this.resourceLoaded = false;
    this.editable = false;
    this.getAllCountries();
    this.getAllStates();
    this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.fzid = id;
        this.getAllRegions();
        this.getFreezerTypes();
        this.getFrForm(id);
        this.getFRLanguageValues();
        //GET GENERIC LANGUAGE VALUES
        this.getLanguageValues();
        //console.log("SSSSSSSSSSSs " + this.frlangData.AccountNumberReq);
       
      }
    );
  }

  /**GET FR_LANG VALUES if the session temp file are not present or different from selected*/
  private getFRLanguageValues() {
    this.doLookup = true;
    //First check sessionStorage
    if (sessionStorage.getItem('FRLang')) {
      this.frlangData = JSON.parse(sessionStorage.getItem('FRLang'));
      if (this.frlangData.Lang == this.selectedLanguage) {
        console.log("NO FR lang Lookup ");
        this.doLookup = false;
      } else {
        console.log("wrong language " + this.frlangData.Lang + " " + this.selectedLanguage);
      }
    }
    
    //DO LOOKUP IF doLookup is true
    if (this.doLookup) {
      this.frlangDataService.getLanguageByLangCode(this.selectedLanguage)
        .subscribe((data: any) => {
          this.frlangData = data;
          sessionStorage.setItem("FRLang", JSON.stringify(data));
          console.log("FRlang Lookup ");
        }
          ,
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

  /**GET LANG VALUES */
  private getLanguageValues() {
    //First check sessionStorage
    if (sessionStorage.getItem('Lang')) {
      this.langData = JSON.parse(sessionStorage.getItem('Lang'));
      console.log("NO lang Lookup from FR Form");
    } else {
      this.langDataService.getLanguageByLangCode(this.selectedLanguage)
        .subscribe((data: any) => {
          this.langData = data;
          sessionStorage.setItem("Lang", JSON.stringify(data));
          console.log("lang Lookup from FR Form");
        }
          ,
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









  /**GET CURRENT FORM */
  getFrForm(id:string) {
    //USE route.params.subscribe to detect parameter changes
    if (id == "new") {
      //CREATE NEW RECORD
      this.frFormData = new FrForm();
      this.frFormData.FormNumber = "FR-" + Date.now().toString();
      this.frFormData.Status = "New";
      this.resourceLoaded = true;
      this.editable = true;
    } else {
      //FETCH EXISTING RECORD
      this.frFormService.getFrForm(id)
        .subscribe((data: FrForm )=> {
          this.frFormData = data;
          this.resourceLoaded = true;
        },
        error => {
          this.frmMsg = error;
        },
          () => {
           // console.log("No errors");
          }
      )
    }
  }
  // GET APPROVERS for this Form
  //populate freezer form fields with approvers
  getApprovers($event) {
    var val: string = $event.value.toString().trim();
    this.workflowService.getApprovalFormByTerritoryAndType("non-specific","fr")
      .subscribe((data: Approval) => {
        this.appFormData = data;
        this.frFormData.NumApprovals = data.NumApprovals; 
        /**TRANSFER APPROVER DATA TO FREEZER FORM**/
        for (var i = 0; i < 11; i++) {
          //console.log(i); // "4", "5", "6"
          if (i < this.appFormData.NumApprovals) {
            this.frFormData["ApproverTitle" + i] = data["ApproverTitle" + i];
            //GET REGIONAL MANAGER'S NAME BASED ON - REGION
            if (data["ApproverTitle" + i] == "Region Manager") {
              //console.log("-------------> " + val)
              this.getRegionApprover(i, val);
            } else {
              this.frFormData["Approver" + i] = data["Approver" + i];
              this.frFormData["ApproverEmail" + i] = data["ApproverEmail" + i];
            }
          } else {
            this.frFormData["ApproverTitle" + i] = "";
            this.frFormData["Approver" + i] = "";
            this.frFormData["ApproverEmail" + i];
          }
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
  //GET REGION APPROVER
  getRegionApprover(x: number, selectedRegion: string) {

    this.workflowService.getRegionalMgr(selectedRegion)
      .subscribe((data: Region) => {
        /**TRANSFER APPROVER DATA TO FREEZER FORM**/
        this.frFormData["Approver" + x] = data.Approver;
        this.frFormData["ApproverEmail" + x] = data.ApproverEmail;
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

  //LOGIC TO DETERMINE IF THE EDIT BUTTON SHOULD BE DISABLED (this shows the user that they do or do NOT have this ability)
  disableEdit() {

    //GENERIC HANDLING OF FORM PREVIOUS TO STARTING WORKFLOW
    if (this.frFormData.Status == "New" || this.frFormData.Status == "Draft") {
      return false;
    }
    return true;
  }


  getFormMsg() {

    return this.frmMsg;
  }

  editForm() {
    this.editable = true;
  }
  //CANCEL CHANGES ALREAY MADE TO NEW OR EXISTING RECORDS
  cancelForm() {
    this.getFrForm(this.fzid);

    if (this.fzid != "new") {
      this.editable = false;
    }
  }
  /**
   * Converts check box values from "true / false" to "yes / no"
   */
  toggleCheckBox(input: HTMLInputElement, fldName: string) {
 
    if (input.checked === true) {
      this.frFormData[fldName] = "yes";

    }
    else {
      this.frFormData[fldName] = "no";
    }
  }

  //ACTION TIED TO SAME ADDRESS CHECK BOX
  toggleSameAddressCheckBox(input: HTMLInputElement, fldName: string) {
    if (input.checked === true) {
      //COPY REQUESTIONING HOSPITAL ADDRESS INFORMATION OVER TO SHIP TO
      this.frFormData.HospitalShip = this.frFormData.HospitalReq;
      this.frFormData.AccountNumberShip = this.frFormData.AccountNumberReq;
      this.frFormData.Address1Ship = this.frFormData.Address1Req;
      this.frFormData.Address2Ship = this.frFormData.Address2Req;
      this.frFormData.CityShip = this.frFormData.CityReq;
      this.frFormData.StateShip = this.frFormData.StateReq;
      this.frFormData.ZipShip = this.frFormData.ZipReq;
      this.frFormData.CountryShip = this.frFormData.CountryReq;
      this.frFormData[fldName] = "yes";
    }
    else {
      this.frFormData[fldName] = "no";
    }

  }


  //UPDATE OR ADD A FIELD Record


  //UPDATE EXISTING PRODUCT
  public updateForm(item: FrForm) {
    if (this.fzid == "new") {
      //ADD A PRODUCT
      this.frFormService.addFrForm(this.frFormData)
        .subscribe((data: any) => {
          this.zone.run(() => {
            console.log('force update the screen');
            location.reload();
          });
        }, error => console.log('Could not create the Freezer Form.'));

      this.router.navigate(['../home']);

    } else {
      //MODIFY A PRODUCT
     
      this.frFormService.updateFrForm(item)
        .subscribe(
          (data: any) => {
            this.editable = false;
          }, error => console.log('Could not update The Freeser Form.'));
    }
  }



  public getAllRegions() {
    this.regionService.getAllRegions().subscribe(
      (data: any) => {
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

  /**
 * GET FREEZER TYPES
 */
  getFreezerTypes() {
    var typeStr: string;
    this.keywordService.getKeywordByKeyword("freezer types")
      .subscribe((data: Keyword) => {
        this.allFreezerTypesArr = data.Value.toString().split(",");
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
  //FILTERABLE PICKLIST


  private setCountriesSearchCtrl() {

    // set initial selection
    this.countriesPicklistCtrl.setValue(this.countries[10]);

    // load the initial bank list
    this.filteredCountries.next(this.countries.slice());

    // listen for search field value changes
    this.countriesPicklistFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountries();
      });
  }


  private setStatesSearchCtrl() {

    // set initial selection
    this.statesPicklistCtrl.setValue(this.states[10]);

    // load the initial bank list
    this.filteredStates.next(this.states.slice());

    // listen for search field value changes
    this.statesPicklistFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStates();
      });
  }

  // control for the selected value 
  public countriesPicklistCtrl: FormControl = new FormControl();
  public statesPicklistCtrl: FormControl = new FormControl();

  // control for the MatSelect filter keyword 
  public countriesPicklistFilterCtrl: FormControl = new FormControl();
  public statesPicklistFilterCtrl: FormControl = new FormControl();

  // list of banks filtered by search keyword
  public filteredCountries: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);
  public filteredStates: ReplaySubject<State[]> = new ReplaySubject<State[]>(1);
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @ViewChild('singleSelect') singleSelect: MatSelect;

  private filterCountries() {
    if (!this.countries) {
      return;
    }
    // get the search keyword
    let search = this.countriesPicklistFilterCtrl.value;
    if (!search) {
      this.filteredCountries.next(this.countries.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCountries.next(
      this.countries.filter(o => o.CountryName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterStates() {
    if (!this.states) {
      return;
    }
    // get the search keyword
    let search = this.statesPicklistFilterCtrl.value;
    if (!search) {
      this.filteredStates.next(this.states.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredStates.next(
      this.states.filter(o => o.StateName.toLowerCase().indexOf(search) > -1)
    );
  }


  /**CHECK FOR DUPLICATES */
  public selectDuplicateCheck() {
    if (this.allRegionsString.includes(this.frFormData.Region)) {
      return false;
    }
    return true;
  }
 
  
  formTouched(formresult: boolean) {
 
  }
  //set timeout to fill out the form.  For Demo fill out in 5 minutes. 1000 = 1 second


  //GET LIST OF STATES

  public getAllStates() {
    this.authService.getAllStates()
      .subscribe(
        (data: any) => {
          this.states = data;
          this.setStatesSearchCtrl();
        }, error => console.log('could not get states.'));
  }


  //GET LIST OF COUNTRIES
  public getAllCountries() {
    this.authService.getAllCountries()
      .subscribe(
      (data: any) => {
         // console.log('got countries. '+ data);
        this.countries = data;
        this.setCountriesSearchCtrl();
        }, error => console.log('could not get countries.'));
  }

  //CHANGE STATE VALUE BASED ON COUNTRY SELECTED
  onChangeState(newValue: string, fld: string) {
    this.countryFld = "Country" + fld;
    this.stateFld = "State" + fld;
    this.stateOtherFld = "StateOther" + fld;

    this.frFormData[this.countryFld]= newValue;
    if (newValue == "US") {
      this.frFormData[this.stateFld] = "";
      this.frFormData[this.stateOtherFld] = "";
      if (fld == 'Req' && this.frFormData.SameHospAddr == 'yes') {
        this.frFormData.StateShip = "";
        this.frFormData.StateOtherShip = "";
      }
    } else {
      this.frFormData[this.stateFld] = "other";
      if (fld == 'Req' && this.frFormData.SameHospAddr == 'yes') {
        this.frFormData.StateShip= "other";
      }

    }
    if (fld == 'Req' && this.frFormData.SameHospAddr == 'yes') {
   
      this.frFormData.CountryShip = newValue;
    }
    //console.log("--------> "+newValue);
  }

  //SET SAME ADDRESS VALUE AS SOURCE FIELD
  onChangeSetSameAddrValue($event, targetFld) {
    if (this.frFormData.SameHospAddr == 'yes') {
      this.frFormData[targetFld] = $event;
    }

  }
}
