import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';



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


  ngOnInit(): void {
    this.loading = true;
    const subscription = this.AuthService.currentUser.subscribe(() => {
      this.loading = false;
      subscription.unsubscribe();
    });
  }
}
