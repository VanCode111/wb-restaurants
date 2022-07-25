import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestaurantsService} from "../../services/restaurants.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchedRestaurants$: Subscription | null = null
  params$: Subscription | null = null

  constructor(private restaurantsService: RestaurantsService, private router: Router, private route: ActivatedRoute) {
  }

  search(e: any) {
    this.router.navigate([''],
      {
        queryParams: {search: this.restaurantsService.checkNulls(e.target.value)},
        queryParamsHandling: ''
      })
  }


  ngOnInit(): void {
    // this.params$ = this.route.queryParams
    //   .subscribe(data => {
    //     this.searchedRestaurants$ = this.restaurantsService.searchRestaurants(data['search'])
    //       .subscribe((data) => this.restaurantsService.data.next(data))
    //   })
  }

  ngOnDestroy() {
    this.searchedRestaurants$?.unsubscribe()
    this.params$?.unsubscribe()
  }
}
