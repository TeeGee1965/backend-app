import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from '../../../core/auth/auth.store';

export const MIN_PASSWORD_LENGTH = 6;

/** Form-level validator: `confirmPassword` must equal `password`. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword');
  if (!confirm) return null;
  const mismatch = !!confirm.value && confirm.value !== password;
  // Put the error on the confirm field so <mat-error> can show it there.
  const { passwordMismatch: _, ...others } = confirm.errors ?? {};
  confirm.setErrors(
    mismatch ? { ...others, passwordMismatch: true } : Object.keys(others).length ? others : null,
  );
  return null;
}

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslocoPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './register.html',
  styleUrl: '../auth-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  protected readonly store = inject(AuthStore);
  protected readonly minPasswordLength = MIN_PASSWORD_LENGTH;

  /** Bound from the `?returnUrl=` query param via withComponentInputBinding(). */
  readonly returnUrl = input<string>();

  protected readonly hidePassword = signal(true);

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    this.store.clearError();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.form.getRawValue();
    this.store.register({ data: { name: name.trim(), email, password }, returnUrl: this.returnUrl() });
  }
}
