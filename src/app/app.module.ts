import { SearchComponent } from './components/search/search.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { RestaurantsListComponent } from './components/restaurants-list/restaurants-list.component';
import { RestaurantItemComponent } from './components/restaurants-list/restaurant-item/restaurant-item.component';
import { MatCardModule } from '@angular/material/card';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MainPageComponent } from './components/main-page/main-page.component';
import { FiltersComponent } from './components/filters/filters.component';
import { HeaderComponent } from './components/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './services/api.interceptor';
import { CostPipe } from './components/restaurants-list/restaurant-item/cost.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './components/profile/profile.component';
import { FavoritesComponent } from './components/profile/favorites/favorites.component';
import { ReviewComponent } from './components/profile/reviews/review/review.component';
import { ReviewsComponent } from './components/profile/reviews/reviews.component';
import { EditComponent } from './components/profile/reviews/review/edit/edit.component';
import { DefaultComponent } from './components/profile/reviews/review/default/default.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantsListComponent,
    RestaurantItemComponent,
    SigninComponent,
    SignupComponent,
    RestaurantItemComponent,
    RestaurantPageComponent,
    SearchComponent,
    MainPageComponent,
    FiltersComponent,
    HeaderComponent,
    CostPipe,
    HeaderComponent,

    ProfileComponent,
    FavoritesComponent,
    ReviewComponent,
    ReviewsComponent,
    EditComponent,
    DefaultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatGridListModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
