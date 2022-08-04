import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getStarsByRating } from './../../../../../utils/reviews';
import { RestaurantsService } from './../../../../../services/restaurants.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Review } from 'src/app/services/restaurants.service';
import { take } from 'rxjs';

@Component({
  selector: 'review-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  @Input() review: Review;
  @Output() changeMode: EventEmitter<boolean> = new EventEmitter<boolean>();
  stars: string[] = [];
  editReviewForm: FormGroup;

  constructor(private restaurantsService: RestaurantsService) {
    this._createForm();
  }

  private _createForm() {
    this.editReviewForm = new FormGroup({
      text: new FormControl('', [
        Validators.required,
        Validators.pattern(/[\S]/),
      ]),
      rating: new FormControl(0, [Validators.required]),
    });
  }

  onChangeMode() {
    this.changeMode.emit(false);
  }

  changeRating(rating: number) {
    this.rating?.patchValue(rating);
    this.stars = getStarsByRating(rating);
  }

  saveChanges(): void {
    if (!this.review.id) {
      return;
    }
    this.restaurantsService
      .editReview({
        id: this.review.id,
        text: this.text?.value.trim(),
        rating: this.rating?.value,
        createdAt: new Date(),
      })
      .subscribe({
        next: (review: Review) => {
          this.changeMode.emit(false);
          this.restaurantsService.setEditReview(review);
        },
      });
  }

  ngOnInit(): void {
    this.rating?.patchValue(this.review.rating);
    this.text?.patchValue(this.review.text);
    this.stars = getStarsByRating(this.review.rating);
  }

  get rating() {
    return this.editReviewForm.get('rating');
  }

  get text() {
    return this.editReviewForm.get('text');
  }
}
