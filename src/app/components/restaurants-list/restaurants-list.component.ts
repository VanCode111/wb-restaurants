import {Component, OnDestroy, OnInit} from '@angular/core';
import {Restaurant, RestaurantsService} from "../../services/restaurants.service";
import {BehaviorSubject, catchError, Subscription, switchMap} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";

export type image = {
  src: string,
  alt: string
}

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent implements OnInit, OnDestroy {
  restaurants: Restaurant[] = []
  length = 0
  isEmpty = false
  restaurants$: Subscription | null = null
  params$: Subscription | null = null
  loading$ = this.restaurantsService.loading$
  error = ''
  type: string = 'list'
  imagesList = new BehaviorSubject<image[]>([])
  imagesList$ = this.imagesList.asObservable()


  constructor(private restaurantsService: RestaurantsService, private router: Router, private route: ActivatedRoute) {
  }

  page(e: PageEvent) {
    this.router.navigate([''],
      {
        queryParams: {p: (e.pageIndex + 1) || null},
        queryParamsHandling: 'merge'
      })
  }

  changeType(type: string) {
    this.type = type
  }

  ngOnInit(): void {
    this.params$ = this.route.queryParams
      .pipe(switchMap(params => this.restaurantsService.getRestaurants(params)
        .pipe(catchError((err) => {
          this.error = err.message
          throw new Error(err)
        }))
      ))
      .subscribe(({data, length}) => {
        this.restaurants = data
        this.length = length > 1 ? Math.ceil(length / 6) : 1
        this.isEmpty = length < 1
        this.imagesList.next(data.map(({image, name}) => ({src: image, alt: name})))
      })
  }


  ngOnDestroy() {
    this.params$?.unsubscribe()
    this.restaurants$?.unsubscribe()
  }
}
