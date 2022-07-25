import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute} from "@angular/router";
import {Restaurant, RestaurantsService} from "../../services/restaurants.service";
import {Subscription} from "rxjs";
import {User} from "@angular/fire/auth";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.scss']
})
export class RestaurantPageComponent implements OnInit, OnDestroy {
  restaurants$: Subscription | null = null
  restaurant: Restaurant
  starArray: number[]
  panelOpenState = false
  loading: boolean
  id: string
  currentUser: User | null = null;

  constructor(private authService: AuthService,
              private activateRoute: ActivatedRoute,
              private restaurantsService: RestaurantsService,
              private toastr: ToastrService) {
    this.loading = false;
    this.id = activateRoute.snapshot.params['id']
  }

  ngOnInit(): void {
    this.loading = true;

    const subscriptionUser = this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      subscriptionUser.unsubscribe();

    });

    this.restaurants$ = this.restaurantsService.getOneRestaurant(this.id).subscribe((data) => {
        this.restaurant = data
        this.starArray = new Array(Math.floor(this.restaurant.rating))
        this.loading = false;
      }
    )
  }

   checkUser(): void {
    if (!this.currentUser) {
      this.toastr.error('Для добавления ресторана в раздел "Хочу посетить" необходимо войти в систему',
        'Неавторизованный пользователь');
      return
    }
    this.restaurantsService.setFavoriteRestaurant(this.currentUser.uid, this.restaurant.id)
  }

  ngOnDestroy(): void {
    this.restaurants$?.unsubscribe()
  }
}
