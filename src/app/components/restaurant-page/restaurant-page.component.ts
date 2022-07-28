import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {ActivatedRoute} from "@angular/router";
import {ResponseFavorite, Restaurant, RestaurantsService} from "../../services/restaurants.service";
import {catchError, forkJoin, map, mergeMap, of, Subscription} from "rxjs";
import {user, User} from "@angular/fire/auth";
import {ToastrService} from 'ngx-toastr';
import {Review} from "../../services/restaurants.service";

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
  starArray: number[]
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

    // forkJoin(
    //   {
    //     auth: this.authService.currentUser$.pipe(catchError(error => of(error))),
    //     oneRestaurant: this.restaurantsService.getOneRestaurant(this.id).pipe(catchError(error => of(error))),
    //   }).pipe(
    //     map((response: any) => {
    //       this.currentUser = response.auth
    //       this.restaurant = response.oneRestaurant
    //       this.starArray = new Array(Math.floor(this.restaurant.rating))
    //       console.log("map after fork")
    //     }),
    //     mergeMap(() => {
    //       const reviews$ = this.restaurantsService.getReviews(this.restaurant.id)
    //       const favoriteRestaurant$ = this.restaurantsService.getFavoriteRestaurant(this.currentUser!.uid, this.restaurant.id)
    //       console.log("Mergemap after fork")
    //       return forkJoin([reviews$, favoriteRestaurant$])
    //     })
    // ).subscribe( result => {
    //   console.log("next")
    //   this.reviews = result[0]
    //   if(result[1].length){
    //     this.followButtonState = !!result[1]
    //     this.followId = result[1][0].id
    //   }
    //   this.loading = false;
    // })

    this.subscriptionRestaurants$ = this.restaurantsService.getOneRestaurant(this.id).subscribe((data) => {
        this.restaurant = data
        this.starArray = new Array(Math.floor(this.restaurant.rating))
        this.loading = false;
      }
    )
    this.subscriptionUser$ = this.authService.currentUser$.pipe(
      map((user: User | null) => this.currentUser = user),
      mergeMap(() => {
        return this.restaurantsService.getFavoriteRestaurant(this.currentUser!.uid, this.id)
      })
    ).subscribe((favorite: ResponseFavorite[]) => {
      console.log(favorite)
      if (favorite.length) {
        this.followButtonState = true
        this.followId = favorite[0].id
        this.followButtonText = "Удалить из раздела 'Хочу посетить'"
      }
    });

    this.subscriptionReviews$ = this.restaurantsService.getReviews(this.id).subscribe(array => {
      this.reviews = array
    })


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
      },
      error => {
        this.toastr.error('Не удалось добавить отзыв', "Неудача")
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
