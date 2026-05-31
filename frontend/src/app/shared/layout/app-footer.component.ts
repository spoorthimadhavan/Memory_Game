import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <nav>
        <a routerLink="/">Game</a>
        <a routerLink="/about">About</a>
        <a routerLink="/roadmap">Next version</a>
        <a routerLink="/contact">Contact</a>
        <a routerLink="/suggestion">Suggestions</a>
      </nav>
      <p class="credit">Made by <strong>Spoorthi Satish Madhavan</strong></p>
    </footer>
  `,
  styles: `
    .site-footer {
      text-align: center;
      padding: 1.5rem 1rem 2rem;
      color: #b39ddb;
      border-top: 1px solid #2a2540;
      margin-top: 2rem;
    }
    nav {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      margin-bottom: 0.75rem;
    }
    nav a {
      color: #ce93d8;
      text-decoration: none;
      font-size: 0.95rem;
    }
    nav a:hover {
      color: #fff;
      text-decoration: underline;
    }
    .credit {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    .credit strong {
      color: #e1bee7;
    }
  `,
})
export class AppFooterComponent {}
