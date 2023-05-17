import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {
  recipientEmail: string = 'ahmedshamoon12@gmail.com';

  subject: any;

  message: any;

  name: any;

  constructor() {}

  composeEmail() {
    const encodedRecipientEmail = encodeURIComponent(this.recipientEmail);
    const encodedSubject = encodeURIComponent(this.subject);
    const encodedMessage = encodeURIComponent(this.message);
    const encodedName = encodeURIComponent(this.name);

    const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodedRecipientEmail}&su=${encodedSubject}&body=${encodedMessage} + From: ${encodedName}`;

    window.open(gmailUrl, '_blank');
  }
}
