import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import { FirebaseService } from '../../utils/firebase.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';

  password: string = '';

  loading: boolean = false;

  allClients: any;
  constructor(
    private route: Router,
    private fireAuth: AngularFireAuth,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    localStorage.removeItem('commercioPublicDetails');
    const email = document.getElementById('email');
    if (email) {
      email.onkeypress = (e: any) => {
        console.log(e.code);

        e.code === 'Enter' || 'NumpadEnter' ? this.login() : '';
      };
    }

    const password = document.getElementById('pass');
    if (password) {
      password.onkeypress = (e: any) => {
        e.code === 'Enter' || 'NumpadEnter' ? this.login() : '';
      };
    }

    this.firebaseService
      .getAllData('ourClients')
      .then((res: any) => {
        // sort wrt timestamp
        res.sort((a: any, b: any) => b?.timestamp - a?.timestamp);

        this.allClients = res;
        console.log('aaa', this.allClients);
      })
      .catch((err: any) => {
        console.log('Error while getting clients data', err);
      });
  }

  /**
   *log in function using SignInwithemail function
   */
  login = () => {
    this.loading = true;
    this.fireAuth
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.loading = false;
        localStorage.setItem(
          'commercioPublicDetails',
          JSON.stringify({ adminEmail: this.email })
        );
        this.route.navigate(['admin']);
      })
      .catch(() => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Invalid Email / Password!`,
        });
      });
  };
}
