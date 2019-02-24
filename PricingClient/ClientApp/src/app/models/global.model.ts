import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class Globals {
  selectedLanguage: string = '';
  selectedLanguageName: string = '';
  selectedPageSize: number = 5;
  selectedPageIndex: number = 0;
  selectedSortDirection: string = "desc";
  selectedSortActive: string = "Created";
  querySearchName: string = "CreatedBy";
  querySearch: string = "";

  constructor() { }

}
