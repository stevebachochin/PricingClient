import { Component, OnInit, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import { RegionService, Region } from '../../services/region.service';
import { Globals } from '../../models/global.model';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm, FormControl } from '@angular/forms';
import { ADNamesService, ADName } from '../../services/adnames.service';
import { MatSelect } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'regionform',
  templateUrl: './region-form.component.html',
  styleUrls: ['../css/form.component.css']
  //changeDetection: ChangeDetectionStrategy.Default providers: [UploadFileService]
})
export class RegionFormComponent implements OnInit {
  //@ViewChild('fieldForm')
  fieldForm: NgForm;
  editable: boolean = false;
  wastouched: boolean = true;
  formData: Region;
  //langData: FormLanguage;
  resourceLoaded: boolean = false;
  langid: string;
  rid: string;
  paramid: any;
  displayKeywordValues: string;
  editableKeywordValues: string;
  tempEditableKeywordValues: string;
  selectedLanguage: string;
  selectedLanguageName: string;
  frmMsg: string = "";
  private ADNames: ADName[];
  forms: Observable<Object> | undefined;

  constructor(
    private regionService: RegionService,
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private adNamesService: ADNamesService,
  ) {
    /**below is used for set up an empty form and empty form labels**/
    this.formData = new Region();
  }


  // WHEN THE PAGE INITIALLY LOADS... 
  ngOnInit() {
    this.editable = false;

    this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.getRegionFormData(id);
        this.getADNames();
      }
    );
  }

  //UPDATE OR ADD A NEW Record
  
  public updateForm(record: Region) {
      //MODIFY A PRODUCT ONLY
     // console.log("----->   "+this.fieldForm.submitted);

    this.regionService.updateRegionForm(record)
        .subscribe(
          (data: any) => {
            this.editable = false;
            //this.frmMsg = this.langData.FormUpdated;
          }, error => console.log('Could not update the language record.')
        );
       
  }

  /**GET AD NAMES */

  /*** GET AD Names*/
  getADNames() {


    //First check sessionStorage

    if (sessionStorage.getItem('ADNames')) {
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
          console.log("No errors");
        }
      );
    }


  }


  private setApproversSearchCtrl() {

    // set initial selection
    this.adNamesPicklistCtrl.setValue(this.ADNames[10]);

    // load the initial bank list
    this.filteredADNames.next(this.ADNames.slice());

    // listen for search field value changes
    this.adNamesPicklistFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterADNames();
      });

  }

  /** control for the selected bank */
  public adNamesPicklistCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public adNamesPicklistFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredADNames: ReplaySubject<ADName[]> = new ReplaySubject<ADName[]>(1);

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @ViewChild('singleSelect') singleSelect: MatSelect;

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


  //END GET AD NAMES

  canDeactivate(): Observable<boolean> | boolean {
  return this.fieldForm.submitted || !this.fieldForm.dirty;
  }

  
  formTouched(formresult: boolean) {
 
  }

  getFormMsg() {
    //if (this.langData != null) {
      return this.sanitizer.bypassSecurityTrustHtml(this.frmMsg);
      
   // }
  }
  /**EDIT THE FORM */
  editForm() {
    this.editable = true;
  }

  //CANCEL CHANGES ALREAY MADE TO NEW OR EXISTING RECORDS
  cancelForm() {
    this.getRegionFormData(this.rid);
    
    if (this.rid != "new") {
      this.editable = false;
    }
  }


  //GET THE FORM DATA
  getRegionFormData(rid: string): void {
    this.rid = rid;
    //NEW FORM
    if (rid == "new") {
      //clears any previous values
      this.formData = new Region();
      this.editable = true;
      this.resourceLoaded = true;
    } else {
      this.regionService.getRegion(rid)
        .subscribe((data : Region) => {
          this.formData = data;
          this.resourceLoaded = true;
        }, error => {
          console.log('Error retriving data from region record');
        }
      );
    }
  }


  /** get approver's name, email address, and target file to write to.*/
  public getPersonsEmailAddress(event, fldName, fldEmail) {
  this.formData[fldName] = event.source.value.ADFullName;
  this.formData[fldEmail] = event.source.value.ADEmailAddress;
}
}
