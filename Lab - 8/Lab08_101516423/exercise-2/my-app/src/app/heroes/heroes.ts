import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HEROES } from '../mock-heroes';
import { RemoveSpacesPipe } from '../remove-spaces-pipe';


@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, RemoveSpacesPipe],
  templateUrl: './heroes.html',
  styleUrl: './heroes.css'
})
export class HeroesComponent {
  heroes = HEROES;
}