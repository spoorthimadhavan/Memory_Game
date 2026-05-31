import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FeedbackApiService } from '../../core/api/feedback-api.service';
import { AppFooterComponent } from '../../shared/layout/app-footer.component';
import { AppSiteToolbarComponent } from '../../shared/layout/app-site-toolbar.component';

@Component({
  selector: 'app-contact-page',
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
      <h1>Contact</h1>
      <p class="intro">
        Questions about the project, collaboration, or interviews? Send a message. Submissions are
        saved on the server in <code>backend/data/contact_messages.csv</code>.
      </p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Your name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Message</mat-label>
          <textarea matInput rows="5" formControlName="message"></textarea>
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Sending...' : 'Send message' }}
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
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    .intro code {
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
export class ContactPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(FeedbackApiService);

  readonly loading = signal(false);
  readonly success = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.api.contact(v.name, v.email, v.message).subscribe({
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
