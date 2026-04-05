import { Component } from '@angular/core';
import { HeroesComponent } from './heroes/heroes';
import { InputFormatDirective } from './input-format';

@Component({
  selector: 'app-root',
  imports: [HeroesComponent, InputFormatDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}