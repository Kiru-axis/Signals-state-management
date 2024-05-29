import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-main-header',
  standalone: true,
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
  imports: [RouterLink],
})
export class MainHeaderComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout$.next('');
  }
}
