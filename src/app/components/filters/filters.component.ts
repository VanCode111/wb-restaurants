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
      id: 1,
      label: 'По возрастанию рейтинга',
      sort: {
        sortBy: 'rating',
        order: 'asc'
      }
    },
    {
      id: 2,
      label: 'По убыванию рейтинга',
      sort: {
        sortBy: 'rating',
        order: 'desc'
      }
    },
    {
      id: 3,
      label: 'По возрастанию цены',
      sort: {
        order: 'asc',
        sortBy: 'averageCheck',
      }
    }, {
      id: 4,
      label: 'По убыванию цены',
      sort: {
        sortBy: 'averageCheck',
        order: 'desc'
      }
    }
  ]
  selectedSort: number | null = this.sortSelect[0].id;

  kitchens = ['Итальянская', 'Японская', 'Китайская', 'Русская', 'Международная', 'Европейская']
  cost = [
    {
      value: 1,
      label: '₽'
    }, {
      value: 2,
      label: '₽₽'
    }, {
      value: 3,
      label: '₽₽₽'
    },
    {
      value: 4,
      label: '₽₽₽₽'
    }, {
      value: 5,
      label: '₽₽₽₽₽'
    },
  ]

  filtersForm = new FormGroup({
    mainKitchen: new FormControl(),
    city: new FormControl(),
    cost: new FormControl()
  });

  constructor(private restaurantsService: RestaurantsService, private router: Router, private route: ActivatedRoute) {
  }

  sortRestaurants(e: any) {
    const sort = this.sortSelect.find((s) => s.id === +e.target.value)!.sort
    this.restaurantsService.setParams(sort)
    this.router.navigate([''], {queryParams: sort, queryParamsHandling: 'merge'})
  }

  filterRestaurants() {
    const filters = {
      mainKitchen: this.restaurantsService.checkNulls(this.filtersForm.get('mainKitchen')?.value),
      city: this.restaurantsService.checkNulls(this.filtersForm.get('city')?.value),
      cost: this.restaurantsService.checkNulls(this.filtersForm.get('cost')?.value)
    }
    this.router.navigate([''], {queryParams: filters, queryParamsHandling: 'merge'})
  }

  ngOnInit(): void {
    this.filtersForm.controls.city.setValue(this.route.snapshot.queryParamMap.get('city'))
    this.filtersForm.controls.mainKitchen.setValue(this.route.snapshot.queryParamMap.get('mainKitchen'))
    this.selectedSort = +!this.route.snapshot.queryParamMap.get('sortBy')
  }

  ngOnDestroy() {
  }
}
