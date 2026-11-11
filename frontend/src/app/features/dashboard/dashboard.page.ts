import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UiButton } from '../../shared/ui-button';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, UiButton, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage {}
