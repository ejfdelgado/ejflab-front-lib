import { Injectable, EventEmitter } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  getIdToken,
} from '@angular/fire/auth';
import { LoginData } from '../interfaces/login-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  evento: EventEmitter<User | null>;
  promesa: Promise<User | null> = Promise.resolve(null);

  constructor(private auth: Auth) {
    this.evento = new EventEmitter<User | null>();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.promesa = Promise.resolve(user);
        getIdToken(user)
          .then((token) => {
            this.setCookie('yo', token, 1);
          })
          .catch(() => {
            this.setCookie('yo', '', 0);
          });
        this.evento.emit(user);
      } else {
        this.promesa = Promise.resolve(null);
        this.setCookie('yo', '', 0);
        this.evento.emit(null);
      }
    });
  }

  getLoginEvent() {
    return this.evento;
  }

  setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  async getIdToken() {
    let user = await this.getCurrentUser();
    if (user != null) {
      return getIdToken(user);
    } else {
      return null;
    }
  }

  getCurrentUser() {
    return this.promesa;
  }

  login({ email, password }: LoginData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register({ email, password }: LoginData) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout() {
    await signOut(this.auth);
    this.promesa = Promise.resolve(null);
  }
}
