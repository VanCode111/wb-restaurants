import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import * as qs from 'qs'
import {environment} from "../../environments/environment";

export interface RestaurantsApiResponse {
  data: Restaurant[]
  length: number
}

export interface Restaurant {
  id: string
  name: string
  image: string
  address: string
  time: {
    weekdays: string
    weekends: string
  }
  kitchens: string[]
  rating: number
  menuLink?: string
  averageCheck: number
  cost: number
  comments: string[]
  mainKitchen: string
}

export interface Review {
  createdAt: Date
  userId: string
  text: string
  rating: number
  restaurantId: string
}
export interface ResponseFavorite{
  userId: string
  restaurant: Restaurant
  id: number
}

@Injectable({
  providedIn: 'root'
})

export class RestaurantsService {
  filter = (prefix: string, value: string) => value || undefined

  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor(private http: HttpClient) {
  }

  showLoader() {
    this._loading.next(true);
  }

  hideLoader() {
    this._loading.next(false);
  }

  getRestaurants(params?: any): Observable<RestaurantsApiResponse> {
    params = {p: 1, l: 5, ...params}
    return this.http
      .get<RestaurantsApiResponse>(`${environment.apiUrl}/restaurants?${qs.stringify(params, {filter: this.filter})}`)
  }

  getOneRestaurant(id: string): Observable<Restaurant> {
    return this.http
      .get<Restaurant>(`${environment.apiUrl}/restaurants/${id}`)
  }

  checkNulls(value: any) {
    return value ? value : null
  }

  setFavoriteRestaurant(userId: string, restaurant: Restaurant): Observable<ResponseFavorite>{
    let requestBody = {
      userId: userId,
      restaurantId: restaurant.id,
      restaurant: restaurant
    }
    return this.http.post<ResponseFavorite>(`${environment.apiUrl}/favorites`, requestBody)
  }

  getFavoriteRestaurant(userId: string, restaurantId: string): Observable<ResponseFavorite[]>{
    const params = {
      userId: userId,
      restaurantId: restaurantId
    }
    return this.http.get<ResponseFavorite[]>(`${environment.apiUrl}/favorites`, {params})
  }

  deleteFavoriteRestaurant(id: number): Observable<ResponseFavorite>{
    return this.http.delete<ResponseFavorite>(`${environment.apiUrl}/favorites/${id}`)
  }

  addReviewOnServer(review: Review): Observable<Review>{
    const requestBody = {
      createdAt: review.createdAt,
      userId: review.userId,
      text: review.text,
      rating: review.rating,
      restaurantId: review.restaurantId
    }
    return this.http.post<Review>(`${environment.apiUrl}/comments`, requestBody)
  }

  getReviews(restaurantId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/comments?${restaurantId}`);
  }
}
