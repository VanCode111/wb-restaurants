import {SignupComponent} from './components/auth/signup/signup.component';
import {SigninComponent} from './components/auth/signin/signin.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {MainPageComponent} from "./components/main-page/main-page.component";

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
