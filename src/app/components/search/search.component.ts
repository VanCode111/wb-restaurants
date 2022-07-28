import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestaurantsService} from "../../services/restaurants.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  value: string | null = ''

  constructor(private restaurantsService: RestaurantsService, private router: Router, private route: ActivatedRoute) {
  }

  search(e: any) {
    this.restaurantsService.setParams({search: this.restaurantsService.checkNulls(e.target.value)})
    this.router.navigate([''],
      {
        queryParams: {search: this.restaurantsService.checkNulls(e.target.value)},
        queryParamsHandling: ''
      })
  }


  ngOnInit(): void {
    this.value = this.route.snapshot.queryParamMap.get('search')
  }

  ngOnDestroy() {

  }
}
