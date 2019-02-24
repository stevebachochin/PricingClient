import { Component, OnInit, ElementRef } from '@angular/core';
//import { FormLanguageService, FormLanguage } from '../../services/languageService';
import { KeywordService, Keyword } from '../../services/keyword.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable} from 'rxjs';

@Component({
  selector: 'keylist',
  templateUrl: './key-view.component.html',
  styleUrls: ['../css/view.component.css']
})
export class KeyViewComponent implements OnInit {

  resourceLoaded: boolean;
 // langData: FormLanguage;
  allKeywords: Observable<Keyword[]>;

  displayedColumns = ['Keyword1', 'Description'];
  
  constructor(
    public router: Router,
    //private langDataService: FormLanguageService,
    private keywordService: KeywordService,
  )
  {
   // this.langData = new FormLanguage();
  }

  ngOnInit() {

    this.resourceLoaded = false;
    //this.langDataService.languageData.subscribe(value => this.langData = value);
    this.keywordService.getAllKeywords().subscribe(
      (data: any) => {
        this.allKeywords = data;
        this.resourceLoaded = true;
      })
  }

  getAllKeywordByKey() {

  }
}  

