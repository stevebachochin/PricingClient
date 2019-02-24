import { Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import { LanguageService, Language } from '../../services/languageService';
import { Globals } from '../../models/global.model';
import { Location } from "@angular/common";
import { NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
//import { MatProgressBarModule } from '@angular/material/progress-bar';
//import { AuthApiResponse } from '../../models/auth-api-response.model';




@Component({
  selector: 'langpicklist',
  templateUrl: './lang-picklist.component.html',
  styleUrls: ['../css/form.component.css'],
  //changeDetection: ChangeDetectionStrategy.Default providers: [UploadFileService]
})
export class LangPickListComponent implements OnInit, OnDestroy{
  //browserLang: string;
  resourceLoaded: boolean;
  model: any;
  langData: any;
  selectedLanguage: string;
  selectedLanguageName: string;
  
  forms: Observable<Object> | undefined;
  allLanguages: Observable<Language[]>;
  navigationSubscription: any;
  fileAPIURL: string = "";

  constructor(
    private zone: NgZone,
    private langDataService: LanguageService,
    private globals: Globals,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    /**below is used for set up an empty form and empty form labels**/
    this.langData = new Language();
    this.selectedLanguage = localStorage.getItem('selectedLanguage');
    this.selectedLanguageName = localStorage.getItem('selectedLanguageName');

    // subscribe to the router events - storing the subscription so
    // we can unsubscribe later. 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initializeData();
      }
    });
  }

  initializeData() {
    console.log("___________________________________");
    this.langDataService.languageData.subscribe(value => this.langData = value);
    this.resourceLoaded = false;

    this.langDataService.getAllLanguages().subscribe(
      (data: any) => {
        this.allLanguages = data;
        //console.log('DDSFDSDFD' + this.langData);
        this.langDataService.checkLanguage(data);
        this.selectedLanguage = localStorage.getItem('selectedLanguage');
        this.selectedLanguageName = localStorage.getItem('selectedLanguageName');
        this.globals.selectedLanguageName = this.selectedLanguageName;
        this.globals.selectedLanguage = this.selectedLanguage;
        //GATHER LANGUAGE VALUES AND STORE AS AN OBJECT FOR THE ENTIRE APPLICATION TO USE.
      }

    )

  }

  // WHEN THE PAGE INITIALLY LOADS... 
  ngOnInit() {

  }
 
  /**
   * SELECT NEW LANGUAGE
   * @param langcode
   * @param langname
   */
  public changeLanguage(langcode, langname) {
    this.selectedLanguage = langcode;
    this.selectedLanguageName = langname;
    this.globals.selectedLanguageName = this.selectedLanguageName;
    this.globals.selectedLanguage = this.selectedLanguage;
    console.log(this.selectedLanguageName + ' language applied');
    localStorage.setItem('selectedLanguageName', this.selectedLanguageName);
    localStorage.setItem('selectedLanguage', this.selectedLanguage);
    //GET NEW LANGUAGE VALUES
    this.getLanguageValues("new");
  }


  private getLanguageValues(action: string) {
    this.langDataService.languageData.subscribe(value => this.langData = value);
    if (this.langData == null || action == "new") {

      //console.log("lang data null or action == new");
      this.langDataService.getLanguageByLangCode(this.selectedLanguage)
        .subscribe((data: any) => {
          console.log("----------------------------->  ");
          this.langDataService.changeLanguageData(data);
          console.log("No defaults found .... Loading NEWly selected language data " + this.langData.Lang1);
          this.router.navigate(['/' + this.langData.Lang1]);
          this.resourceLoaded = false;
        });
    } else {
     // console.log("default language pack used - object already loaded");
      this.resourceLoaded = false;
    }
   }

  getInnerHTMLValue() {
    if (this.langData != null) {
      return this.sanitizer.bypassSecurityTrustHtml(this.langData.WelcomeMsg);
    }
  }


  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
/**
export class InviteComponent implements OnInit, OnDestroy {
  // ... your class variables here
  navigationSubscription;
  constructor(
    // … your declarations here
    private router: Router,
  ) {
    // subscribe to the router events - storing the subscription so
    // we can unsubscribe later. 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }
  initialiseInvites() {
    // Set default values and re-fetch any data you need.
  }
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }



}
**/
