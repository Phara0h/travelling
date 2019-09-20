// Import the LitElement base class and html helper function
import { LitElement, html, css } from "./node_modules/lit-element/lit-element.js";
import "./node_modules/@material/mwc-textfield/mwc-textfield.js";
import { Button } from "./node_modules/@material/mwc-button/mwc-button.js";
import { TextField } from "./node_modules/@material/mwc-textfield/mwc-textfield.js";
import "./node_modules/@material/mwc-icon/mwc-icon-font.js";
import { Snackbar } from "./node_modules/@material/mwc-snackbar/mwc-snackbar.js";

class TravButton extends Button {
  static get styles() {
    return css`
            ${super.styles}
            button {
                height: 56px !important;
                font-size: 16px !important;
                font-style: bold;
            }
        `;
  }

}

customElements.define('trav-button', TravButton);

class TravSnack extends Snackbar {
  static get styles() {
    return css`
            ${super.styles}
            .mdc-snackbar__label {
              color: var(--toast-text-color, rgba(255, 255, 255, 0.87));
              white-space: pre-line;
            }
        `;
  }

}

customElements.define('trav-snack', TravSnack);

class TravText extends TextField {
  static get styles() {
    return css`
            ${super.styles}
            .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
              color: var(--travelling--field-text-color);
            }
            .mdc-text-field-helper-line {
              white-space: pre-line;
            }
            .mdc-text-field--invalid + .mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg {
              display: block;
            }
            .mdc-text-field-helper-text {
              display: none;
            }
        `;
  }

}

customElements.define('trav-text', TravText); // Extend the LitElement base class

class Login extends LitElement {
  static get styles() {
    return css`
            :host {
                background: var(--travelling-background);

                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;

                flex: 1;
                display: flex;
                flex-direction: row;
                justify-content: center;

            }



            .form-header h1 {
                padding: 4px 0;
                color: var(--travelling-primary-color);
                font-size: 24px;
                font-weight: 700;
                text-transform: uppercase;
                text-align: center;
            }
            .container {
                display: flex;
                flex-direction: column;
                max-width: 500px;
                justify-content: center;
                flex: 1;
                color: rgba(0, 0, 0, 0.6);
                font-family: 'Roboto', sans-serif;
                font-size: 14px;
                line-height: 1.6em;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            .container form {
                background: var(--travelling-trinary-color);
                border-radius: 8px;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
                margin: 15px;
                padding: 25px;
                max-width: 500px;
            }
            .logo-container {
                align-self: center;
            }
            img {
                height: 150px;
                margin: 25px;
            }
            trav-button {
                margin-bottom: 10px;
                --mdc-theme-primary: var(--travelling-primary-color);
                --mdc-theme-on-primary: var(--travelling--button-text-color);
            }

            trav-text {
                margin: 10px 0;
                --mdc-theme-primary: var(--travelling-primary-color);

                display: block;
            }

            .subButtons {
                color: var(--travelling-primary-color);
                font-size: 12px;
                text-decoration: none;
                cursor: pointer;
            }

            /* .logo{
          padding: 20px 40px;
          margin: 5px;
          background-color: whitesmoke;
          font-size: 36px;
          letter-spacing: 2px;
          font-variant: small-caps;
          font-family: 'Roboto', 'Noto', Tahoma, Helvetica, Arial, Sans-Serif;
          text-transform: uppercase;
          text-shadow: #4c4c4c 3px 3px 5px;
          background: #424242;
          color: #131313;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        } */
            .login-fields {
                margin-top: 35px;
                margin-bottom: 15px;
            }
            #success {
                --toast-text-color: #4caf50 !important;
                text-transform: capitalize;
                text-align: center;
            }
            #error {
                --toast-text-color: #f44336 !important;
                text-transform: capitalize;
                text-align: center;
            }
            .options {
                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;
            }

            form {
              opacity: 0.9;
            }
        `;
  }

  render() {
    return html`

            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" ></link>
            <div class="container" on-keydown="enterHit">
                <img src="/travelling/assets/logo" ></img>

                <form>
                    <div class="logo-container">
                        <div class="form-header">
                            <h1 style="display: ${this.isLogin ? 'block' : 'none'};">Log in to your account</h1>
                            <h1 style="display: ${this.isRegister ? 'block' : 'none'};">Create account</h1>
                            <h1 style="display: ${this.isForgotPassword ? 'block' : 'none'};">Reset password</h1>
                            <div style="display: ${this.isOauth ? 'block' : 'none'};">
                            <h1 >Authorization</h1>
                              <p>Hello ${this._user.username}, Do you give authorization to <b>${this.oauthClient}</b> for your account details?</p>
                            </div>

                            <div style="display: ${!this.isOauth && this.isLogout ? 'block' : 'none'};">

                              <h3 style="text-align: center;">Hello ${this._user.username}!</h3>
                            </div>

                        </div>
                    </div>
                    <div class="login-fields" style="display: ${!this.isLogout ? 'block' : 'none'};">
                        <trav-text autofocus required outlined iconTrailing="account_circle" id="username" label="Username" autofocus style="display: ${this.isRegister || this.isLogin ? 'flex' : 'none'};"></trav-text>
                        <trav-text autofocus required outlined iconTrailing="lock" id="password" name="password" type="password" validationMessage="${this.passwordHelper}" pattern="${this.passwordRegex}" label="Password" style="display: ${this.isRegister || this.isLogin ? 'block' : 'none'};"></trav-text>
                        <trav-text autofocus required id="email" outlined iconTrailing="email" type="email" label="Email" style="display: ${this.isRegister || this.isForgotPassword ? 'flex' : 'none'};"></trav-text>
                    </div>
                    <div class="options">
                    <span class="subButtons" style="display: ${!this.isRegister && !this.isLogout ? 'flex' : 'none'};" @click="${this.showRegistration}">Create an account</span>
                    <span class="subButtons" style="display: ${!this.isLogin && !this.isLogout ? 'flex' : 'none'};" @click="${this.showLogin}">Log in to account</span>
                    <span class="subButtons" style="display: ${!this.isForgotPassword && !this.isLogout ? 'flex' : 'none'};" @click="${this.showForgotPassword}">Forgot your password?</span>
                    </div>

                    <trav-button raised @click="${this.login}" style="display: ${this.isLogin ? 'flex' : 'none'};">Log in</trav-button>
                    <trav-button id="register" raised @click="${this.registerAccount}" on-click="registerAccount" style="display: ${this.isRegister ? 'flex' : 'none'};">Register</trav-button>
                    <trav-button raised @click="${this.resetPassword}" style="display: ${this.isForgotPassword ? 'flex' : 'none'};">Reset Password</trav-button>
                    <trav-button raised  formaction="${window.location.href}" formMethod="post" style="display: ${this.isOauth ? 'flex' : 'none'};">Authorize</trav-button>
                    <trav-button raised @click="${this.logout}" style="display: ${this.isLogout ? 'flex' : 'none'};">Logout</trav-button>
                </form>
                <trav-snack id="error"
                      labelText="${this.errorMsg}">
                </trav-snack>

                <trav-snack id="success"
                      labelText="${this.successMsg}">
                </trav-snack>

            </div>
        `;
  }

  constructor() {
    super();
    this.passwordRegex = "";
    this.errorMsg = "";
    this.successMsg = "";
    this.isRegister = false;
    this.isForgotPassword = false;
    this.isLogin = true;
    this.isLogout = false;
    this.isOauth = false;
    this._user = {};
    this.getPasswordRegex();
    this.checkLoggedIn();
    var urlParams = new URLSearchParams(window.location.search);
    this.oauthClient = urlParams.get('client_id');
    this.groupRequest = urlParams.get('group_request');
  }

  static get properties() {
    return {
      passwordRegex: {
        type: String
      },
      _username: {
        type: String,
        hashChanged: () => true
      },
      _password: {
        type: String
      },
      isRegister: {
        type: Boolean
      },
      isForgotPassword: {
        type: Boolean
      },
      isLogin: {
        type: Boolean
      }
    };
  }

  async checkLoggedIn() {
    var res = await fetch(new Request('/travelling/api/v1/user/me', {
      method: 'GET'
    }));

    if (res.status === 200) {
      this._user = await res.json();
      this.isLogin = false;
      this.isLogout = true;

      if (window.location.href.indexOf('/travelling/api/v1/auth/oauth/authorize') > -1) {
        this.isOauth = true;
      }
    } else {
      this.shadowRoot.getElementById('username').formElement.focus();
    }
  }

  async getPasswordRegex() {
    var res = await fetch(new Request('/travelling/api/v1/config/password', {
      method: 'GET'
    }));
    var options = await res.json();
    this.passwordRegex = (options.consecutive ? '' : '(?!.*(.)\\1{1})') + '(?=(.*[\\d]){' + options.number + ',})(?=(.*[a-z]){' + options.lowercase + ',})(?=(.*[A-Z]){' + options.uppercase + ',})(?=(.*[@#$%!]){' + options.special + ',})(?:[\\da-zA-Z@#$%!\^\&\*\\(\\)]){' + options.minchar + ',' + options.maxchar + '}';
    this.passwordHelper = `
                            Minimum of ${options.minchar} characters
                            Maximum of ${options.maxchar} characters
                            Minimum of ${options.number} numbers
                            Minimum of ${options.lowercase} lowercase characters
                            Minimum of ${options.uppercase} uppercase characters
                            Minimum of ${options.special} special characters
                            ${options.consecutive ? '' : 'No consecutive characters'}
                            `;
  }

  showRegistration() {
    this.isRegister = true;
    this.isForgotPassword = false;
    this.isLogin = false;
    setTimeout(() => this.shadowRoot.getElementById('username').formElement.focus(), 100);
  }

  showLogin() {
    this.isRegister = false;
    this.isForgotPassword = false;
    this.isLogin = true;
    this.isLogout = false;
    setTimeout(() => this.shadowRoot.getElementById('username').formElement.focus(), 100);
  }

  showForgotPassword() {
    this.isRegister = false;
    this.isForgotPassword = true;
    this.isLogin = false;
    setTimeout(() => this.shadowRoot.getElementById('email').formElement.focus(), 100);
  }

  showAuthorization() {
    this.isRegister = false;
    this.isForgotPassword = false;
    this.isLogin = false;
    this.isLogout = true;
    this.isOauth = true;
  }

  async login() {
    this._username = this.shadowRoot.getElementById('username');
    this._password = this.shadowRoot.getElementById('password');

    if (this._username.validity.valid && this._password.validity.valid) {
      var res = await fetch(new Request('http://127.0.0.1:6969/travelling/api/v1/auth/login', {
        method: 'PUT',
        body: JSON.stringify({
          username: this._username.value,
          password: this._password.value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }));

      if (res.status === 200) {
        this.checkLoggedIn();
        this.showSuccess("Successfully logged in.");
      } else {
        this._password.value = "!";

        this._password.reportValidity();

        this._password.value = "";

        this._password.formElement.focus();

        var body = await res.json();
        this.showError(body.msg);
      }
    }

    if (!this._username.validity.valid) {
      this._username.formElement.focus();

      this.showError("Invaild user");
    }

    if (!this._password.validity.valid) {
      this._password.formElement.focus();
    }
  }

  async logout() {
    await fetch(new Request('/travelling/api/v1/auth/logout', {
      method: 'GET'
    }));
    this.showLogin();
    this.showSuccess("Successfully logged out.");
  }

  async registerAccount(e) {
    this._username = this.shadowRoot.getElementById('username');
    this._password = this.shadowRoot.getElementById('password');
    this._email = this.shadowRoot.getElementById('email');

    if (this._username.validity.valid && this._password.validity.valid && this._email.validity.valid) {
      this.shadowRoot.getElementById('register').disabled = true;
      var user = {
        username: this._username.value,
        password: this._password.value,
        email: this._email.value
      };

      if (this.groupRequest) {
        user.group_request = this.groupRequest;
      }

      var res = await fetch(new Request('http://127.0.0.1:6969/travelling/api/v1/auth/register', {
        method: 'post',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
      }));

      if (res.status === 200) {
        this.showLogin();
        this.showSuccess("Account created, please log in.");
        this._email.value = "";
        this._password.value = "";
        setTimeout(() => this.shadowRoot.getElementById('password').formElement.focus(), 100);
      } else {
        this._password.value = "!";

        this._password.reportValidity();

        this._password.value = "";

        this._password.formElement.focus();

        var body = await res.json();
        this.showError(body.msg);
      }

      this.shadowRoot.getElementById('register').disabled = false;
    }

    if (!this._username.validity.valid) {
      this._username.formElement.focus();
    }

    if (!this._password.validity.valid) {
      this._password.formElement.focus();
    }

    if (!this._email.validity.valid) {
      this._email.formElement.focus();
    }
  }

  showError(msg) {
    var err = this.shadowRoot.getElementById('error');
    err.labelText = msg;
    console.log(err.labelText);
    err.open();
  }

  showSuccess(msg) {
    var success = this.shadowRoot.getElementById('success');
    this.successMsg = msg;
    success.open();
  }

  resetPassword() {}

} // Register the new element with the browser.


customElements.define('trav-login', Login);