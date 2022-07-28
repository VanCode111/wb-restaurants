import {
  Favorites,
  RestaurantsService,
} from './../../../services/restaurants.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  @Input() user: User;
  favorites: Favorites[];
  loading: boolean;

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.restaurantsService
      .getFavoriteRestaurants(this.user.uid)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((favorites) => {
        this.favorites = favorites;
      });
  }
}
