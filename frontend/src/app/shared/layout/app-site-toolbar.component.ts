import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-site-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, RouterLinkActive],
  template: `
    <mat-toolbar class="toolbar">
      <a routerLink="/" class="brand">Memory Words</a>
      <span class="spacer"></span>
      <a mat-button routerLink="/about" routerLinkActive="active">About</a>
      <a mat-button routerLink="/roadmap" routerLinkActive="active">Roadmap</a>
      <a mat-button routerLink="/contact" routerLinkActive="active">Contact</a>
      <a mat-button routerLink="/suggestion" routerLinkActive="active">Suggestions</a>
      <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        Game
      </a>
      <ng-content />
    </mat-toolbar>
  `,
  styles: `
    .toolbar {
      background: #311b92;
      color: #fff;
    }
    .brand {
      color: #fff;
      text-decoration: none;
      font-weight: 600;
    }
    .spacer {
      flex: 1;
    }
    a.active {
      background: rgba(255, 255, 255, 0.12);
      border-radius: 4px;
    }
    :host ::ng-deep .toolbar-actions {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
  `,
})
export class AppSiteToolbarComponent {}
