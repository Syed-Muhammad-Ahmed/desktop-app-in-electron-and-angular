import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private route: Router, private fireAuth: AngularFireAuth) {}

  /**
   * logout function
   */
  logout = () => {
    this.fireAuth
      .signOut()
      .then(() => {
        localStorage.removeItem('commercioPublicDetails');
        this.route.navigate(['/admin/login']);
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Error while signing out!`,
        });
      });
  };
}
