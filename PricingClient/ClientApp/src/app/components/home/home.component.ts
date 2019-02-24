import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
//import { FormLanguageService, FormLanguage } from '../../services/languageService';
import { NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';




@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['../css/view.component.css'],
  //changeDetection: ChangeDetectionStrategy.Default providers: [UploadFileService]
})
export class HomeComponent implements OnInit {
  //browserLang: string;
  resourceLoaded: boolean;
 // model: any;
  langData: any;
  navigationSubscription: any;

  constructor(
    private zone: NgZone,
   // private langDataService: FormLanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    /**below is used for set up an empty form and empty form labels**/
    //this.langData = new FormLanguage();
  }


  // WHEN THE PAGE INITIALLY LOADS... 
  ngOnInit() {
    //GET LIST OF LANGUAGES FOR PICKLIST
    this.resourceLoaded = false;
    /**
    this.langDataService.languageData.subscribe(value =>
    {
      this.langData = value;
      if (value != undefined) {
        this.resourceLoaded = true;
      } 
    }
    );
    **/
  }
 
  getInnerHTMLValue() {
    if (this.langData != null) {
      return this.sanitizer.bypassSecurityTrustHtml(this.langData.WelcomeMsg);
    }
  }

}
