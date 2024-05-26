import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public auth: AngularFireAuth,
  ) { }

  async registerUser(email: string, password: string) {
    return await this.auth.createUserWithEmailAndPassword(email.trim(), password.trim());
  }

  async loginUser(email: string, password: string) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async resetPassword(email: string) {
    return await this.auth.sendPasswordResetEmail(email);
  }

  async signOut() {
    return await this.auth.signOut();
  }

  async getProfile() {
    return await this.auth.currentUser;
  }
}
