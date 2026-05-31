import { Component, input } from '@angular/core';

import { AppFooterComponent } from './app-footer.component';
import { AppSiteToolbarComponent } from './app-site-toolbar.component';

@Component({
  selector: 'app-doc-page-shell',
  standalone: true,
  imports: [AppSiteToolbarComponent, AppFooterComponent],
  template: `
    <app-site-toolbar />

    <main class="doc-main">
      @if (title()) {
        <h1>{{ title() }}</h1>
      }
      @if (subtitle()) {
        <p class="subtitle">{{ subtitle() }}</p>
      }
      <ng-content />
    </main>
    <app-footer />
  `,
  styles: `
    .doc-main {
      max-width: 820px;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 2rem;
      color: #ede7f6;
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.75rem;
      color: #fff;
    }
    .subtitle {
      margin: 0 0 1.75rem;
      line-height: 1.55;
      color: #d1c4e9;
      font-size: 1.05rem;
    }
  `,
})
export class DocPageShellComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
}
