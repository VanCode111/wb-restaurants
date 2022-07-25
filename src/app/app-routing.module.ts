import { SignupComponent } from './components/auth/signup/signup.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RestaurantPageComponent} from "./components/restaurant-page/restaurant-page.component";
import {MainPageComponent} from "./components/main-page/main-page.component";

const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: "full"},
  // {path: 'restaurants', component: RestaurantsComponent},
  // {path: 'profile', component: ProfileComponent}
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'restaurant/:id', component: RestaurantPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
