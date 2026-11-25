import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSelect } from '../../shared/language-select/language-select';

/** Layout for the logged-out pages (login, register): language switch on top, page below. */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, LanguageSelect],
  template: `
    <header><app-language-select /></header>
    <main><router-outlet /></main>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }
    header {
      display: flex;
      justify-content: flex-end;
      padding: 8px 16px 0;
    }
    main {
      flex: 1;
      display: grid;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
