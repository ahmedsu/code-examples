export interface userAuthDataInterface {
  username: string;
  password: string;
}

export interface userRegisterDataInterface {
  firstNameField: string;
  lastNameField: string;
  passwordField: string;
  emailField: string;
}

export interface userDataInterface {
  token: string;
  id: number;
  email: string;
  nicename: string;
  firstName: string;
  lastName: string;
  displayName: string;
}
