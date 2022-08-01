import {Component, EventEmitter, OnInit, Output} from '@angular/core';

type layoutType = 'list' | 'grid' | 'slider'

@Component({
  selector: 'app-grid-toggle',
  templateUrl: './grid-toggle.component.html',
  styleUrls: ['./grid-toggle.component.scss']
})
export class GridToggleComponent implements OnInit {
  type: layoutType = 'list'
  @Output() typeEvent = new EventEmitter<layoutType>();

  changeType(type: layoutType) {
    this.type = type
    this.typeEvent.emit(this.type)
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
