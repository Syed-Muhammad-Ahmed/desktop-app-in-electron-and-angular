import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'electron-angular';
  age: Number = 0;

  constructor() {}
  myFunction = () => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `Your Age Is ${this.age}`,
      showConfirmButton: false,
      timer: 1500,
    });
  };
}
