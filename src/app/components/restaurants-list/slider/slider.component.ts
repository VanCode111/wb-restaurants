import {Component, Input, OnInit, ViewChild} from '@angular/core';
import SwiperCore, {Navigation, Pagination, SwiperOptions} from "swiper";
import {image} from "../restaurants-list.component";
import {Restaurant} from "../../../services/restaurants.service";
import {SwiperComponent} from "swiper/angular";

SwiperCore.use([Pagination]);


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() restaurantsList: Restaurant[] | null = []
  @ViewChild('swiper', {static: false}) swiper: SwiperComponent;

  slideNext() {
    this.swiper.swiperRef.slideNext(300);
  }

  slidePrev() {
    this.swiper.swiperRef.slidePrev(300);
  }

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
