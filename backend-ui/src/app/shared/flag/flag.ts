import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Small flag drawn as inline SVG from horizontal stripes.
 * (Flag emoji don't render on Windows – it shows "DE"/"NL" letters instead.)
 * Decorative: the surrounding element provides the accessible name.
 */
@Component({
  selector: 'app-flag',
  template: `
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      @for (stripe of stripes(); track $index) {
        <rect x="0" [attr.y]="$index * stripeHeight()" width="30" [attr.height]="stripeHeight()" [attr.fill]="stripe" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }
    svg {
      width: 24px;
      height: 16px;
      border-radius: 2px;
      // Thin outline so white stripes stay visible on light backgrounds
      outline: 1px solid color-mix(in srgb, var(--mat-sys-on-surface) 20%, transparent);
      outline-offset: -1px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Flag {
  /** Stripe colours, top to bottom. */
  readonly stripes = input.required<readonly string[]>();
  protected readonly stripeHeight = computed(() => 20 / this.stripes().length);
}
