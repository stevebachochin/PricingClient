import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Location } from "@angular/common";
import { NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FrFormService, FrForm } from '../../services/freezerform.service';
import { LanguageService, Language } from '../../services/languageService';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { MatSort, MatPaginator, PageEvent } from '@angular/material';
import { Globals } from '../../models/global.model';

@Component({
    selector: 'frview',
    templateUrl: './fr-view.component.html',
    styleUrls: ['../css/view.component.css']
})
export class FrViewComponent implements OnInit, OnDestroy {
  resourceLoaded: boolean;
  formSelector: any;
  forms: any;
  showEditor = true;
  myName: string = "";
  vwMsg: string = "";
  langData: Language;
  querySearchName: string;
  querySearch: string;
  selectedPageSize: number;
  private selectedPageIndex: number;
  private selectedSortDirection: string;
  private selectedSortActive: string;
  selectedLanguage: string;
  selectedLanguageName: string;
  navigationSubscription: any;

  //ANGULAR MATERIAL
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() totalCount: number;

  @Output() onPageSwitch = new EventEmitter();
  frFormDataSource = new BehaviorSubject<FrForm[]>([]);

  displayedColumns = ['CreatedBy', 'HospitalReq', 'Created', 'Status', 'Completed', 'FormNumber'];

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    public router: Router,
    private zone: NgZone,
    private frFormService: FrFormService,
    private location: Location,
    private langDataService: LanguageService,
    )
  {
    this.langData = new Language();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initializeData();
      }
    });
  }

  initializeData() {
    // Set default values and re-fetch any data you need.
    this.resourceLoaded = false;
    this.querySearchName = this.globals.querySearchName;
    this.querySearch = this.globals.querySearch;
    //STORE PAGE SIZE, PAGING, SORT, AND SEARCH AS GLOBAL VALUES
    this.selectedPageSize = this.globals.selectedPageSize;
    this.selectedPageIndex = this.globals.selectedPageIndex;
    this.selectedSortDirection = this.globals.selectedSortDirection;
    this.selectedSortActive = this.globals.selectedSortActive;

    if (this.selectedPageSize == null) { this.selectedPageSize = 5 }
    if (this.selectedPageIndex == null) { this.selectedPageIndex = 1 }
    if (this.selectedSortDirection == null) { this.selectedSortDirection = "desc" }
    if (this.selectedSortActive == null) { this.selectedSortActive = "Created" }

    this.getForms(this.selectedPageIndex, this.selectedPageSize, this.selectedSortDirection, this.selectedSortActive, this.querySearchName, this.querySearch);
    this.getLanguage();
  }

  ngOnInit() {
    /**
    this.resourceLoaded = false;
    this.querySearchName = this.globals.querySearchName;
    this.querySearch = this.globals.querySearch;
    //STORE PAGE SIZE, PAGING, SORT, AND SEARCH AS GLOBAL VALUES
    this.selectedPageSize = this.globals.selectedPageSize;
    this.selectedPageIndex = this.globals.selectedPageIndex;
    this.selectedSortDirection = this.globals.selectedSortDirection;
    this.selectedSortActive = this.globals.selectedSortActive;

    if (this.selectedPageSize == null) { this.selectedPageSize = 5 }
    if (this.selectedPageIndex == null) { this.selectedPageIndex = 1 }
    if (this.selectedSortDirection == null) { this.selectedSortDirection = "desc" }
    if (this.selectedSortActive == null) { this.selectedSortActive = "Created" }

    this.getForms(this.selectedPageIndex, this.selectedPageSize, this.selectedSortDirection, this.selectedSortActive, this.querySearchName, this.querySearch);
    this.getLanguage();
    **/
  }

  getLanguage() {
    this.selectedLanguage = localStorage.getItem('selectedLanguage');
    this.selectedLanguageName = localStorage.getItem('selectedLanguageName');
    //GATHER LANGUAGE VALUES AND STORE AS AN OBJECT FOR THE ENTIRE APPLICATION TO USE.
    //First check sessionStorage
    if (sessionStorage.getItem('Lang')) {
      this.langData = JSON.parse(sessionStorage.getItem('Lang'));
      console.log("NOoooo lang Lookup ");
    } else {

      this.langDataService.languageData.subscribe(value => this.langData = value);
      if (this.langData != null) {
        this.langDataService.getLanguageByLangCode(this.selectedLanguage)
          .subscribe((data: any) => {
            this.langDataService.changeLanguageData(data);
          });
      }
    }
  }

  //  GET ALL FREEZER RECORDS
  getAllFrForms(){
    this.frFormService.getAllFrForms()
      .subscribe(
      (data: any) => {
         // this.frFormDataSource.next(data.body);
        this.frFormDataSource = data;
        },
      error => {
        this.vwMsg = error;
      },
      () => {
        //console.log("No errors");
        //this.resourceLoaded = true;
      }
      );
  }

  ngAfterViewInit() {
     
    this.sort.sortChange.subscribe(
      () => {
        this.paginator.pageIndex = 0;
        this.selectedPageIndex = 1;
        this.selectedSortDirection = this.sort.direction;
        this.selectedSortActive = this.sort.active;
        this.globals.selectedSortDirection = this.sort.direction;
        this.globals.selectedSortActive = this.sort.active;

        this.getForms(this.selectedPageIndex, this.selectedPageSize, this.selectedSortDirection, this.selectedSortActive, this.querySearchName, this.querySearch);
        console.log("SortChange --> " + this.sort.active + "~" + this.sort.direction);
        
      }

    );
  }

  //SEARCH LOGIC
  getForms(pageNumber: number, pageSize: number, sortOrder: string, columnName: string, querySearchName: string, querySearch: string) {

    this.frFormService.findFrForms(pageNumber, pageSize, sortOrder, columnName, querySearchName, querySearch)
      .subscribe(
        (data: any) => {
          //this.dataSource.next(data.body);
          this.frFormDataSource.next(data.body);
          this.totalCount = JSON.parse(data.headers.get('Paging-Headers')).totalCount;
          this.resourceLoaded = true;
          //console.log("GOT DATA" + this.totalCount + "~" + this.selectedPageSize);
        },
      error => {
        this.vwMsg = error;
      },
      () => {
        //console.log("No errors");
        //this.resourceLoaded = true;
      }
      );
  }

  //SELECT A RECORD
  onRowClicked(row) {
  console.log('Row clicked: ', row.fzid);
  this.router.navigate(['/frform/' + row.fzid]);
  }

  //PAGING
  public paging(event: PageEvent) {
    //this.paginator.pageSize = event.pageSize
    this.selectedPageIndex = event.pageIndex + 1;
    this.globals.selectedPageIndex = this.selectedPageIndex;
    this.selectedPageSize = event.pageSize;
    this.globals.selectedPageSize = event.pageSize;
    //console.log('PAGE INDEX EVENT--------Index-------->' + this.selectedPageIndex + "_size_" + this.globals.selectedPageSize);
    this.getForms(this.selectedPageIndex, this.selectedPageSize, this.selectedSortDirection, this.selectedSortActive, this.querySearchName, this.querySearch);
  }
  // SEARCH BUTTON ACTION
  public searchForms(querySearchName, querySearch) {
    if (querySearchName != null && querySearch != null) {
      //console.log("X"+this.querySearchName + '--------------------------->' + this.querySearch+"X");
      this.querySearchName = querySearchName;
      this.querySearch = querySearch;
      this.globals.querySearchName = querySearchName;
      this.globals.querySearch = querySearch;
      this.paginator.pageIndex = 0;
      this.selectedPageIndex = 1;
      this.globals.selectedPageIndex = this.selectedPageIndex;
    }
    this.getForms(this.selectedPageIndex, this.selectedPageSize, this.selectedSortDirection, this.selectedSortActive, querySearchName, querySearch);

  }
  //RESET PAGING, SORTING, AND QUERY SEARCHES - NOT PAGE SIZE
  public clearSearch() {
    this.querySearchName = "CreatedBy";
    this.querySearch = "";
    this.globals.querySearchName = "";
    this.globals.querySearch = "";

    this.paginator.pageIndex = 0;
    this.selectedPageIndex = 1;
    this.globals.selectedPageIndex = this.selectedPageIndex;

    this.selectedSortDirection = "desc";
    this.selectedSortActive = "Created";
    this.globals.selectedSortDirection = "desc";
    this.globals.selectedSortActive ="Created";
    this.getForms(1, this.selectedPageSize, this.selectedSortDirection, this.selectedSortActive, this.querySearchName, this.querySearch);
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

