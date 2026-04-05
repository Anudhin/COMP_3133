import { Component } from '@angular/core';

@Component({
  selector: 'students',
  template: `
    <h2>{{ getTitle() }}</h2>
    <p>{{ getCurrentDate() }}</p>
  `,
  standalone: false
})
export class StudentsComponent {
  title = "My List of Students";

  getTitle() {
    return this.title;
  }

  getCurrentDate() {
    return new Date();
  }
}