import { User } from '@angular/fire/auth';
import {
  RestaurantsService,
  Review,
} from './../../../services/restaurants.service';
import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  @Input() user: User;

  loading: boolean = false;
  reviews: Review[] = [];

  constructor(private restaurantsService: RestaurantsService) {}

  ngOnInit(): void {
    this.loading = true;
    const reviewsSubscription = this.restaurantsService
      .getReviews(undefined, this.user.uid)
      .subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          console.log(reviews);
          reviewsSubscription.unsubscribe();
        },
      });
  }
}
