import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LanguageService, Language } from '../../services/languageService';
import { Globals } from '../../models/global.model';
import { Observable } from "rxjs";
//import { AuthApiResponse, AuthResponse } from '../../models/auth-api-response.model';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy{
 // isExpanded : boolean= false;
  appTitle : string= "CryoLife Field Assurance Forms";
  appLogo : string= "assets/images/CryoLifeLogo.png";
  currentURL: string;
  isCollapsed: boolean;
  langData: Language;
  selectedLanguage: string;
  selectedLanguageName: string;
  allLanguages: Observable<Language[]>;
  navigationSubscription: any;

  constructor(
    private router: Router,
    private langDataService: LanguageService,
    private globals: Globals,

  ) {
    router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        //console.log("current url", event.url); // event.url has current url
        this.currentURL = event.url;
      }
    });
    this.langData = new Language();
    this.selectedLanguage = globals.selectedLanguage;
    this.selectedLanguageName = globals.selectedLanguageName;


    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initializeData();
      }
    });
  }

  initializeData() {
    //GET LIST OF LANGUAGES FOR PICKLIST
    //this.resourceLoaded = true;
    this.langDataService.getAllLanguages().subscribe(
      (data: any) => {
        this.allLanguages = data;
        this.langDataService.checkLanguage(data);
        this.selectedLanguage = localStorage.getItem('selectedLanguage');
        this.selectedLanguageName = localStorage.getItem('selectedLanguageName');
        //GATHER LANGUAGE VALUES AND STORE AS AN OBJECT FOR THE ENTIRE APPLICATION TO USE.
        //First check sessionStorage
        if (sessionStorage.getItem('Lang')) {
          this.langData = JSON.parse(sessionStorage.getItem('Lang'));
          console.log("NO lang Lookup ");
        } else {
          this.langDataService.languageData.subscribe(value => this.langData = value);
          if (this.selectedLanguage != null) {
            this.langDataService.getLanguageByLangCode(this.selectedLanguage)
              .subscribe((data: any) => {
                this.langDataService.changeLanguageData(data);
              });
          }
        }

      }

    )
  }

  ngOnInit() {



  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  //private getLanguageValues() {

  //}
  /**

  Logout() {
    this.authData = new AuthResponse();
    localStorage.removeItem('userToken');
    this.authData.Authorized == 'no';
    this.authApiResponse.changeAuthResponse(this.authData);
    this.router.navigate(['/login']);
  }
  **/
}
