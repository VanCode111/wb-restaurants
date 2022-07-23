import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  sortSelect = [
    {
      label: 'По возрастанию цены',
      type: 'averageCheck',
      value: 'acs'
    }, {
      label: 'По убыванию цены',
      type: 'averageCheck',
      value: 'desc'
    },
    {
      label: 'По возрастанию рейтинга',
      type: 'rating',
      value: 'asc'
    }, {
      label: 'По убыванию цены',
      type: 'rating',
      value: 'desc'
    },
  ]

  constructor() {
  }

  ngOnInit(): void {
  }

}
