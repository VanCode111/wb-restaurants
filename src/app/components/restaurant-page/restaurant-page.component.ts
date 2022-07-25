import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {ActivatedRoute} from "@angular/router";
import {Restaurant, RestaurantsService} from "../../services/restaurants.service";
import {Subscription} from "rxjs";

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

  constructor(private AuthService: AuthService,
              private activateRoute: ActivatedRoute,
              private restaurantsService: RestaurantsService) {
    this.loading = false;
    this.id=activateRoute.snapshot.params['id']
  }

  ngOnInit(): void {
    this.loading = true;
    const subscription = this.AuthService.currentUser.subscribe(() => {
      this.loading = false;
      subscription.unsubscribe();
    });

    this.restaurants$ = this.restaurantsService.getOneRestaurant(this.id).subscribe((data) => {
        this.restaurant = data
        this.starArray = new Array(Math.floor(this.restaurant.rating))
      }
    )
  }



  ngOnDestroy():void {
    this.restaurants$?.unsubscribe()
  }
}
