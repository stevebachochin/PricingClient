import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FrViewComponent } from "./components/fr-view/fr-view.component";
import { FrFormComponent } from "./components/fr-form/fr-form.component";
import { LangFormComponent } from "./components/lang-form/lang-form.component";
import { LangListComponent } from "./components/lang-list/lang-list.component";
import { LangPickListComponent } from "./components/lang-picklist/lang-picklist.component";

import { ApprovalsFormComponent } from "./components/approvals-form/approvals-form.component";
import { Globals } from './models/global.model';
import { LanguageService } from './services/languageService';
import { FRLanguageService } from './services/fr.languageService';
/**

import { AclService } from './services/AclService';

import { AuthApiResponse } from './models/auth-api-response.model';
import { DialogBoxComponent } from './components/dialog-box/dialogbox.component';
**/
import { AppRoutingModule } from './app-routing.module';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
//import { MatSelectModule } from '@angular/material/select';

import {
  MatDialogModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatTableModule, MatButtonModule, MatCheckboxModule,
  MatProgressBarModule, MatNativeDateModule, MatFormFieldModule,
  MatIconModule, MatSelectModule, MatToolbarModule
} from "@angular/material";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { CollapseModule} from 'ngx-bootstrap/collapse';
/**
import { LoginComponent } from "./components/login/login.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { LangPickListComponent } from "./components/lang-picklist/lang-picklist.component";
import { LangFormComponent } from "./components/lang-form/lang-form.component";
import { AclFormComponent } from "./components/acl-form/acl-form.component";
import { LangListComponent } from "./components/lang-list/lang-list.component";
import { DeactivateService } from "./services/deactivateService";
**/
import { AuthService } from './services/auth.service';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './services/app.config';
import { FrFormService } from './services/freezerform.service';
import { ADNamesService } from './services/adnames.service';
import { KeywordService } from './services/keyword.service';
import { RegionService } from './services/region.service';
import { WorkflowService } from './services/workflow.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { KeyFormComponent } from "./components/key-form/key-form.component";
import { KeyViewComponent } from "./components/key-view/key-view.component";
import { RegionFormComponent } from "./components/region-form/region-form.component";
import { RegionViewComponent } from "./components/region-view/region-view.component";
import { ApprovalsViewComponent } from "./components/approvals-view/approvals-view.component";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    FrViewComponent,
    FrFormComponent,
    HomeComponent,
    KeyFormComponent,
    KeyViewComponent,
    RegionFormComponent,
    RegionViewComponent,
    ApprovalsViewComponent,
    ApprovalsFormComponent,
    LangFormComponent,
    LangListComponent,
    LangPickListComponent,
    /**
    LoginComponent,
    DialogBoxComponent,
    WelcomeComponent,
    LangPickListComponent,
    AclFormComponent,
    LangFormComponent,
    LangListComponent,
    **/
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatProgressBarModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    FrFormService,
    Globals,
    AuthService,
    KeywordService,
    RegionService,
    WorkflowService,
    ADNamesService,
    LanguageService,
    FRLanguageService,
    /**
    Globals,
    AuthApiResponse,
 
    AclService,
    DeactivateService,
    **/
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    }
  ],
  bootstrap: [AppComponent],
  //entryComponents: [DialogBoxComponent],
})
export class AppModule {
}
