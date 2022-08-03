import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute} from "@angular/router";
import {ResponseFavorite, Restaurant, RestaurantsService} from "../../services/restaurants.service";
import {map, mergeMap, Subscription} from "rxjs";
import {User} from "@angular/fire/auth";
import {ToastrService} from 'ngx-toastr';
import {Review} from "../../services/restaurants.service";
import {getStarsByRating} from "../../utils/reviews";

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.scss']
})
export class RestaurantPageComponent implements OnInit, OnDestroy {
  subscriptionRestaurants$: Subscription | null = null
  subscriptionUser$: Subscription | null = null
  subscriptionSetFavorite$: Subscription | null = null
  subscriptionDeleteFavorite$: Subscription | null = null
  subscriptionAddReviews$: Subscription | null = null
  subscriptionReviews$: Subscription | null = null
  subscriptionFavoriteRestaurant$: Subscription | null = null
  forkQuery$: Subscription | null = null
  restaurant: Restaurant
  starArray: string[]
  panelOpenState = false
  loading: boolean
  id: string
  currentUser: User | null = null;
  followButtonState: boolean = false
  followButtonText: string
  followId: number
  reviewRate: number
  reviewText: string = ""
  reviews: Review[]
  rates = [
    {value: '1'},
    {value: '1.5'},
    {value: '2'},
    {value: '2.5'},
    {value: '3'},
    {value: '3.5'},
    {value: '4'},
    {value: '4.5'},
    {value: '5'},
  ]
  mapLink: string;
  stateReviewButton: boolean = true
  reviewRatingMap: Map<string | undefined, string[]> = new Map()
  existUserReview: boolean = false
  idUserReview: string
  dateReview: Date

  constructor(private authService: AuthService,
              private activateRoute: ActivatedRoute,
              private restaurantsService: RestaurantsService,
              private toastr: ToastrService) {
    this.loading = false;
    this.id = activateRoute.snapshot.params['id']
    this.followButtonText = "Добавить в 'Хочу посетить'"
  }

  ngOnInit(): void {

    this.loading = true;

    this.subscriptionRestaurants$ = this.restaurantsService.getOneRestaurant(this.id).subscribe((data) => {
        this.restaurant = data
        // this.starArray = new Array(Math.floor(this.restaurant.rating))
        this.starArray = getStarsByRating(this.restaurant.rating);
        this.mapLink = `https://yandex.ru/maps/?text=${this.restaurant.address}`
        this.loading = false;
      }
    )
    this.subscriptionUser$ = this.authService.currentUser$.pipe(
      map((user: User | null) => this.currentUser = user),
      mergeMap(() => {
        return this.restaurantsService.getFavoriteRestaurant(this.currentUser!.uid, this.id)
      })
    ).subscribe((favorite: ResponseFavorite[]) => {
      let isRestaurantId = false
      favorite.forEach(entity => {
        isRestaurantId = entity.restaurantId == this.id.toString()
        if (isRestaurantId)
          return
      })
      if (favorite.length && isRestaurantId) {
        this.followButtonState = true
        this.followId = favorite[0].id
        this.followButtonText = "Удалить из раздела 'Хочу посетить'"
      }
    });

    this.subscriptionReviews$ = this.restaurantsService.getReviews(this.id).subscribe(array => {
        this.reviews = array
        if (this.reviews) {
          this.reviews.forEach(element => {
            this.reviewRatingMap.set(<string>element.id, getStarsByRating(element.rating))
            if (element.userId == this.currentUser?.uid) {
              this.existUserReview = true
              this.reviewText = element.text
              this.reviewRate = element.rating
              this.idUserReview = <string>element.id
              this.dateReview = element.createdAt
            }

          })
        }

        console.log(this.reviews)
      }
    )


  }

  addFollowRestaurant(): void {
    if (!this.currentUser) {
      this.toastr.error('Для добавления ресторана в раздел "Хочу посетить" необходимо войти в систему',
        'Неавторизованный пользователь');
      return
    }
    if (!this.followButtonState) {
      this.subscriptionSetFavorite$ = this.restaurantsService.setFavoriteRestaurant(this.currentUser.uid, this.restaurant).subscribe(
        (value: ResponseFavorite) => {
          this.followButtonState = true
          this.toastr.success('Ресторан успешно добавлен в раздел "Хочу посетить"', "Успех")
          this.followButtonText = "Удалить из раздела 'Хочу посетить'"
          this.followId = value.id
        },
        err => {
          this.toastr.error('Не удалось добавить ресторан в "Хочу посетить"', "Неудача")
        }
      )
    } else {
      this.subscriptionDeleteFavorite$ = this.restaurantsService.deleteFavoriteRestaurant(this.followId).subscribe(
        () => {
          this.followButtonState = false
          this.toastr.success('Ресторан успешно удалён из "Хочу посетить"', "Успех")
          this.followButtonText = "Добавить в 'Хочу посетить'"
        },
        err => {
          this.toastr.error('Не удалось удалить ресторан из "Хочу посетить"', "Неудача")
        }
      )
    }
  }


  addReview(): void {

    if (!this.reviewRate || !this.reviewText) {
      this.toastr.warning('Заполните все поля', "Предупреждение")
      return
    }
    this.stateReviewButton = false;
    const review: Review = {
      rating: this.reviewRate,
      restaurantId: this.restaurant.id,
      text: this.reviewText,
      userId: this.currentUser!.uid.toString(),
      createdAt: new Date(),
      userName: this.currentUser!.displayName,
      restaurantName: this.restaurant.name
    }

    this.subscriptionAddReviews$ = this.restaurantsService.addReviewOnServer(review).subscribe(() => {
        this.toastr.success('Отзыв успешно добавлен', "Успех")
        this.reviewRate = 0
        this.reviewText = ""
        this.stateReviewButton = true
      },
      error => {
        this.toastr.error('Не удалось добавить отзыв', "Неудача")
      })
  }

  changeReview() {
    if (!this.reviewRate || !this.reviewText) {
      this.toastr.warning('Заполните все поля', "Предупреждение")
      return
    }
    this.stateReviewButton = false;
    const changeReview = {
      text: this.reviewText,
      id: this.idUserReview,
      rating: this.reviewRate,
      createdAt: this.dateReview,
    }

    this.subscriptionAddReviews$ = this.restaurantsService.editReview(changeReview).subscribe(() => {
        this.toastr.success('Отзыв успешно обновлён', "Успех")
        this.stateReviewButton = true
      },
      error => {
        this.toastr.error('Не удалось обновить отзыв', "Неудача")
      })
  }


  deleteReview() {
    this.stateReviewButton = false;

    this.subscriptionAddReviews$ = this.restaurantsService.deleteReview(this.idUserReview).subscribe(() => {
        this.toastr.success('Отзыв успешно удалён', "Успех")
        this.reviewRate = 0
        this.reviewText = ""
        this.stateReviewButton = true
      },
      error => {
        this.toastr.error('Не удалось удалить отзыв', "Неудача")
      })
  }


  ngOnDestroy(): void {
    this.subscriptionRestaurants$?.unsubscribe()
    this.subscriptionUser$?.unsubscribe();
    this.subscriptionSetFavorite$?.unsubscribe()
    this.subscriptionDeleteFavorite$?.unsubscribe()
    this.subscriptionAddReviews$?.unsubscribe()
    this.forkQuery$?.unsubscribe()
    this.subscriptionReviews$?.unsubscribe()
    this.subscriptionFavoriteRestaurant$?.unsubscribe()
  }
}
