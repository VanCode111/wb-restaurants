import {Component, OnInit} from '@angular/core';
import {RestaurantsService} from "../../services/restaurants.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchedRestaurants$: Subscription | null = null

  constructor(private restaurantsService: RestaurantsService) {
  }

  search(e: any) {
    const start = e.target.value
    const end = e.target.value + '\uf8ff'
    this.searchedRestaurants$ = this.restaurantsService.fireQuery(start, end)
      .subscribe(data => this.restaurantsService.rests.next(data))
  }


  ngOnInit(): void {
    this.searchedRestaurants$?.unsubscribe()
  }

}
