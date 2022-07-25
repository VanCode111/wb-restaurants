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

  checkNulls(value: any) {
    return value ? value : null
  }
}
