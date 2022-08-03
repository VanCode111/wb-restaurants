import {Component, Input, OnInit} from '@angular/core';
import SwiperCore, {Pagination, SwiperOptions} from "swiper";
import {Restaurant} from "../../../services/restaurants.service";

SwiperCore.use([Pagination]);


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() restaurantsList: Restaurant[] | null = []

  config: SwiperOptions = {
    pagination: true,
    centeredSlides: true,
    slidesPerView: 1,
  };

  constructor() {
  }

  onSwiper(swiper: any) {
    console.log(swiper);
  }


  ngOnInit(): void {
  }

}
