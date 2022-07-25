import {Component, OnDestroy, OnInit} from '@angular/core';
import {Restaurant, RestaurantsService} from "../../services/restaurants.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent implements OnInit, OnDestroy {
  restaurants: Restaurant[] = []
  length = 0
  restaurants$: Subscription | null = null
  params$: Subscription | null = null
  loading$ = this.restaurantsService.loading$
  error = ''

  constructor(private restaurantsService: RestaurantsService, private router: Router, private route: ActivatedRoute) {
  }

  page(e: PageEvent) {
    this.router.navigate([''],
      {
        queryParams: {p: this.restaurantsService.checkNulls(e.pageIndex + 1), limit: 5},
        queryParamsHandling: 'merge'
      })
  }

  ngOnInit(): void {
    this.params$ = this.route.queryParams
      .subscribe(data => {
        this.restaurants$ = this.restaurantsService.getRestaurants(data)
          .subscribe(({data, length}) => {
              this.restaurants = data
              this.length = length > 0 ? Math.round(length / 5) : 1
            }
          )
      })
  }

  ngOnDestroy() {
    this.restaurants$?.unsubscribe()
    this.restaurants$?.unsubscribe()
  }
}
