import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestaurantsService} from "../../services/restaurants.service";
import {Subscription} from "rxjs";

export interface Restaurant {
  id: string
  name: string
  image: string
  address: string
  time: {
    weekdays: string
    weekends: string
  }
  kitchens: string[]
  rating: number
  menuLink?: string
  averageCheck: number
  cost: number
  comments: string[]
}

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent implements OnInit, OnDestroy {

  restaurants: Restaurant[] = []
  restaurants$: Subscription | null = null
  restaurantsInit$: Subscription | null = null
  isLoading = true

  constructor(private restaurantsService: RestaurantsService) {
  }

  ngOnInit(): void {
    this.restaurantsInit$ = this.restaurantsService.getAllRestaurants()
      .subscribe((data) => this.restaurantsService.rests.next(data))

    this.restaurants$ = this.restaurantsService.rests.subscribe((data: any) => {
      this.restaurants = data
      this.isLoading = false
    })
  }

  ngOnDestroy() {
    this.restaurants$?.unsubscribe()
    this.restaurantsInit$?.unsubscribe()
  }
}
