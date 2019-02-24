import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { FrViewComponent } from "./components/fr-view/fr-view.component";
import { FrFormComponent } from "./components/fr-form/fr-form.component";
import { KeyFormComponent } from "./components/key-form/key-form.component";
import { KeyViewComponent } from "./components/key-view/key-view.component";
import { RegionFormComponent } from "./components/region-form/region-form.component";
import { RegionViewComponent } from "./components/region-view/region-view.component";
import { ApprovalsViewComponent } from "./components/approvals-view/approvals-view.component";
import { ApprovalsFormComponent } from "./components/approvals-form/approvals-form.component";

const routes: Routes = [
  {
    path: "",
    component: FrViewComponent
  },
  {
    path: "frview",
    component: FrViewComponent
  },
  {
    path: 'frform/:id',
    component: FrFormComponent,
  },
  {
    path: 'keyform/:id',
    component: KeyFormComponent,
  },
  {
    path: 'keyview',
    component: KeyViewComponent,
  },
  {
    path: 'regionform/:id',
    component: RegionFormComponent,
  },
  {
    path: 'regionview',
    component: RegionViewComponent,
  },
  {
    path: 'approvalsview',
    component: ApprovalsViewComponent,
  },
  {
    path: 'approvalsform/:id',
    component: ApprovalsFormComponent,
  },

  {
    path: '**',
    component: FrViewComponent,
    runGuardsAndResolvers: 'always',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
