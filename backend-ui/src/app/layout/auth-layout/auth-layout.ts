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
    // Three rows: language bar | page | empty row as tall as the language bar.
    // The equal top and bottom rows put the card in the true middle of the viewport,
    // while the language bar still never overlaps the card on small screens.
    :host {
      --bar-height: 56px;
      display: grid;
      grid-template-rows: var(--bar-height) 1fr var(--bar-height);
      min-height: 100%;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 16px;
    }
    // Flex column (not grid): the empty <router-outlet> element then takes no space,
    // and the routed page is centered vertically.
    main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
