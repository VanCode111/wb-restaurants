import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {RestaurantsService} from "./restaurants.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private restaurantsService: RestaurantsService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.restaurantsService.showLoader()
    return next.handle(request).pipe(
      finalize(() => this.restaurantsService.hideLoader())
    )
  }
}
