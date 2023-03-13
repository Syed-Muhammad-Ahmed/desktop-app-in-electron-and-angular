import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'electron-angular';
  valueEntered = false;
  age: Number = 0;

  myFunction = () => {
    this.valueEntered = true;
  };

  resetFunc = () => {
    this.valueEntered = false;
  };
}
