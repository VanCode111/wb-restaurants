import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User, UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private AuthService: AuthService) {}

  ngOnInit(): void {
    this.AuthService.currentUser$.subscribe((user: User | null) => {
      console.log('current', user);
      this.currentUser = user;
    });
  }

  logout(): void {
    this.AuthService.logout();
  }
}
