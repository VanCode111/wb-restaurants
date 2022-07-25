import {Component, OnInit} from '@angular/core';
import {RestaurantsService} from "../../services/restaurants.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  sortSelect = [
    {
      label: 'По убыванию рейтинга',
      field: 'rating',
      value: 'desc'
    },
    {
      label: 'По возрастанию рейтинга',
      field: 'rating',
      value: 'asc'
    },
    {
      label: 'По возрастанию цены',
      field: 'averageCheck',
      value: 'asc'
    }, {
      label: 'По убыванию цены',
      field: 'averageCheck',
      value: 'desc'
    }
  ]
  selectedSort = this.sortSelect[0].value;

  kitchens = ['Итальянская', 'Японская', 'Китайская']

  filtersForm = new FormGroup({
    mainKitchen: new FormControl(),
    city: new FormControl(),
  });

  constructor(private restaurantsService: RestaurantsService, private router: Router) {
  }

  sortRestaurants(e: any) {
    const obj = e.target.value.split('-')
    const sort = {
      sortBy: this.restaurantsService.checkNulls(obj[0]),
      order: this.restaurantsService.checkNulls(obj[1]),
    }
    this.router.navigate([''], {queryParams: sort, queryParamsHandling: 'merge'})
  }

  filterRestaurants() {
    const filters = {
      mainKitchen: this.restaurantsService.checkNulls(this.filtersForm.get('mainKitchen')?.value),
      city: this.restaurantsService.checkNulls(this.filtersForm.get('city')?.value)
    }
    this.router.navigate([''], {queryParams: filters, queryParamsHandling: 'merge'})
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }
}
