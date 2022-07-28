import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import {
  AngularFireAuthGuard,
  canActivate,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  { path: 'restaurants', component: MainPageComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(() => redirectUnauthorizedTo(['signin'])),
  },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'restaurant/:id', component: RestaurantPageComponent },
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  { path: '**', redirectTo: 'restaurants' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
