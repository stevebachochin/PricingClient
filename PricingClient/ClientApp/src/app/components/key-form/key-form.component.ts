import { Component, OnInit, ChangeDetectionStrategy, ViewChild} from '@angular/core';
//import { FormLanguageService, FormLanguage } from '../../services/languageService';
import { KeywordService, Keyword } from '../../services/keyword.service';
import { Globals } from '../../models/global.model';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'langform',
  templateUrl: './key-form.component.html',
  styleUrls: ['../css/form.component.css']
  //changeDetection: ChangeDetectionStrategy.Default providers: [UploadFileService]
})
export class KeyFormComponent implements OnInit {
  @ViewChild('fieldForm')
  fieldForm: NgForm;
  editable: boolean = false;
  wastouched: boolean = true;
  formData: Keyword;
  //langData: FormLanguage;
  resourceLoaded: boolean = false;
  langid: string;
  kid: string;
  paramid: any;
  displayKeywordValues: string;
  editableKeywordValues: string;
  tempEditableKeywordValues: string;
  selectedLanguage: string;
  selectedLanguageName: string;
  frmMsg: string = "";
  
  forms: Observable<Object> | undefined;
 // allLanguages: Observable<FormLanguage[]>;


  constructor(
 //   private zone: NgZone,
 //   private langDataService: FormLanguageService,
    private keywordService: KeywordService,
    private globals: Globals,
  //  private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
   // private deactivateGuard: DeactivateService,
  ) {
    /**below is used for set up an empty form and empty form labels**/
    this.formData = new Keyword();
    //this.langData = new FormLanguage();
    //this.selectedLanguage = globals.selectedLanguage;
    //this.selectedLanguageName = globals.selectedLanguageName;
  }


  // WHEN THE PAGE INITIALLY LOADS... 
  ngOnInit() {
    //this.langDataService.languageData.subscribe(value => this.langData = value);
    //this.formData = new Keyword();

    this.editable = false;

    this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.getKeywordFormData(id);
        //console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDd"+params);
      }
    );
  }

  //UPDATE OR ADD A NEW Record
  
  public updateForm(record: Keyword) {
      //MODIFY A PRODUCT ONLY
     // console.log("----->   "+this.fieldForm.submitted);
    this.tempEditableKeywordValues = this.editableKeywordValues;
    this.formData.Value = this.tempEditableKeywordValues.replace(/\n/g, ",");
    this.displayKeywordValues = this.formData.Value;
    //CONVERT TO READABLE EDITABLE FORMATES
    this.displayKeywordValues = this.displayKeywordValues.replace(/,/g, "<br />");

    this.keywordService.updateKeywordForm(record)
        .subscribe(
          (data: any) => {
            this.editable = false;
            //this.frmMsg = this.langData.FormUpdated;
          }, error => console.log('Could not update the language record.')
        );
       
  }

  canDeactivate(): Observable<boolean> | boolean {

  //console.log('----------- >    ' + this.fieldForm.dirty);
  return this.fieldForm.submitted || !this.fieldForm.dirty;
  }

  
  formTouched(formresult: boolean) {
 
  }

  getFormMsg() {
    //if (this.langData != null) {
      //console.log("DDDDDDDDDDDDDDDDDDD123");
      return this.sanitizer.bypassSecurityTrustHtml(this.frmMsg);
      
   // }
  }
  /**EDIT THE FORM */
  editForm() {
    this.editable = true;
  }

  //CANCEL CHANGES ALREAY MADE TO NEW OR EXISTING RECORDS
  cancelForm() {
    this.getKeywordFormData(this.kid);
    
    if (this.kid != "new") {
      this.editable = false;
    }
  }


  //GET THE FORM DATA
  getKeywordFormData(kid: string): void {
    this.kid = kid;
    //NEW FORM
    if (kid == "new") {
      //clears any previous values
      this.formData = new Keyword();
      this.editable = true;
      this.resourceLoaded = true;
      // console.log('New Product - this id = ' + this.id);
    } else {
      //this.dataService.getProduct(langid)
      this.keywordService.getKeyword(kid)
        .subscribe((data : Keyword) => {
          this.formData = data;
          //this.tempValue = "R1234R";
          this.displayKeywordValues = data.Value;
          this.editableKeywordValues = data.Value;
          //CONVERT TO READABLE EDITABLE FORMATES
          this.displayKeywordValues = this.displayKeywordValues.replace(/,/g, "<br />");
          this.editableKeywordValues = this.editableKeywordValues.replace(/,/g, "\n");
          this.resourceLoaded = true;
        }, error => {
          console.log('Error retriving data from key record');
          //this.frmMsg = this.langData.FormError + "<br /><br />Form processing error.";

        }
      );
    }
  }
}
