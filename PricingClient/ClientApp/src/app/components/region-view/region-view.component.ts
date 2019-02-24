import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
//import { FormLanguageService, FormLanguage } from '../../services/languageService';
import { RegionService, Region } from '../../services/region.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { ADNamesService, ADName } from '../../services/adnames.service';
import { MatSelect } from '@angular/material';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'regionview',
  templateUrl: './region-view.component.html',
  styleUrls: ['../css/view.component.css']
})
export class RegionViewComponent implements OnInit {

  resourceLoaded: boolean;
  private ADNames: ADName[];
  allRegions: Observable<Region[]>;
  frmMsg: string = "";
  displayedColumns = ['Region1', 'Approver'];
  
  constructor(
    public router: Router,
    private adNamesService: ADNamesService,
    private regionService: RegionService,
  )
  {

  }

  ngOnInit() {

    this.resourceLoaded = false;
    //this.langDataService.languageData.subscribe(value => this.langData = value);
    this.regionService.getAllRegions().subscribe(
      (data: any) => {
        this.allRegions = data;
        this.resourceLoaded = true;
      })
  }

  //AD PICKLIST

  /**
* GET AD Names
* @param id
*/
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



}  

