import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestaurantsService} from "../../services/restaurants.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  constructor(private restaurantsService: RestaurantsService, private router: Router) {
  }

  search(e: any) {
    this.router.navigate([''],
      {
        queryParams: {search: this.restaurantsService.checkNulls(e.target.value)},
        queryParamsHandling: ''
      })
  }


  ngOnInit(): void {
  }

  ngOnDestroy() {
  }
}
