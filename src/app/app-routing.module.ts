import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  // {
  //   path: "admin",
  //   loadChildren: () =>
  //     import("./admin/admin.module").then((m) => m.AdminModule),
  //   canActivate: [AuthguardGuard],
  // },
  // {
  //   path: "admin/login",
  //   component: LoginComponent,
  //   data: {
  //     title: "Login",
  //   },
  // },

  // by default, it will load client routes with base layout
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
