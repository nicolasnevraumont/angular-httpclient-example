import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductViewComponent } from '@app/product-view/product-view.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'home/afteradd/:productId', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'product-view/:productId', component: ProductViewComponent},
  {
    path: 'product-add',
    component: ProductAddComponent,
    data: { title: 'Add Product' }
  },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
