import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'wb-restaurants';
  loading;

  constructor(private AuthService: AuthService) {
    this.loading = false;
  }

  tiles: Tile[] = [
    { text: 'Поисковая штука', cols: 2, rows: 1, color: 'lightblue' },
    { text: 'Фильтрики', cols: 1, rows: 1, color: 'lightgreen' },
    { text: 'Результаты поиска', cols: 1, rows: 1, color: 'lightpink' },
  ];

  ngOnInit(): void {
    this.loading = true;
    const subscription = this.AuthService.currentUser.subscribe(() => {
      this.loading = false;
      subscription.unsubscribe();
    });
  }
}
