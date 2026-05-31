import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FeedbackApiService } from '../../core/api/feedback-api.service';
import { AppFooterComponent } from '../../shared/layout/app-footer.component';
import { AppSiteToolbarComponent } from '../../shared/layout/app-site-toolbar.component';

@Component({
  selector: 'app-suggestion-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    AppSiteToolbarComponent,
    MatFormFieldModule,
    MatInputModule,
    AppFooterComponent,
  ],
  template: `
    <app-site-toolbar />

    <main class="page">
      <h1>Suggestions</h1>
      <p class="intro">Ideas for new features, more quiz topics, or game improvements? Tell us!</p>
      <p class="storage-note">
        Submissions are saved on the server in <code>backend/data/suggestions.csv</code>.
      </p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Your name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Email (optional)</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Your suggestion</mat-label>
          <textarea matInput rows="5" formControlName="suggestion"></textarea>
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Sending...' : 'Submit suggestion' }}
        </button>
      </form>

      @if (success()) {
        <p class="success">{{ success() }}</p>
      }
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </main>
    <app-footer />
  `,
  styles: `
    .page {
      max-width: 480px;
      margin: 0 auto;
      padding: 1.5rem;
      color: #ede7f6;
    }
    h1 {
      margin: 0 0 0.5rem;
    }
    .intro {
      opacity: 0.85;
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }
    .storage-note {
      opacity: 0.7;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
      line-height: 1.4;
    }
    .storage-note code {
      font-size: 0.8rem;
      background: #2a2540;
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
      color: #e1bee7;
    }
    .full {
      width: 100%;
    }
    button {
      width: 100%;
    }
    .success {
      color: #a5d6a7;
      margin-top: 1rem;
    }
    .error {
      color: #ffcdd2;
      margin-top: 1rem;
    }
  `,
})
export class SuggestionPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(FeedbackApiService);

  readonly loading = signal(false);
  readonly success = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: [''],
    suggestion: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.api.suggestion(v.name, v.email || null, v.suggestion).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.success.set(res.message);
        this.form.reset();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not send — is the API running on port 8000?');
      },
    });
  }
}
