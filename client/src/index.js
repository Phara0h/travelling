import { LitElement, html, css } from 'lit-element';
import '@material/mwc-textfield';
import { addHasRemoveClass } from '@material/mwc-base/form-element';
import '@material/mwc-icon/mwc-icon-font.js';
import { Button } from '@material/mwc-button';
import { TextField } from '@material/mwc-textfield';
import { Snackbar } from '@material/mwc-snackbar';
import { ripple } from '@material/mwc-ripple/ripple-directive.js';
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined.js';
// Extend the LitElement base class

//sorry about this code regrets are had and would of written it in vue.js
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

      trav-form-button {
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

      .login-fields {
        margin-top: 35px;
        margin-bottom: 15px;
      }

      #success {
        --toast-text-color: #4caf50 !important;
        text-align: center;
      }
      #error {
        --toast-text-color: #f44336 !important;
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
            <div class="container" @keyup="${this._onKeyUp}">
                <img src="/travelling/assets/logo" ></img>
                <form id="form1">
                    <div class="logo-container">
                        <div class="form-header">
                            <h1 style="display: ${this.isLogin ? 'block' : 'none'};">Log in to your account</h1>
                            <h1 style="display: ${this.isRegister ? 'block' : 'none'};">Create account</h1>
                            <h1 style="display: ${this.isForgotPassword ? 'block' : 'none'};">Forgot Password</h1>
                            <h1 style="display: ${this.isNewPassword ? 'block' : 'none'};">Set A New Password</h1>
                            <div style="display: ${this.isOauth ? 'block' : 'none'};">
                            <h1 >Authorization</h1>
                              <p>Hello ${this._user.username}, Do you give authorization to <b>${
      this.oauthClient
    }</b> for your account details?</p>
                            </div>

                            <div style="display: ${!this.isOauth && this.isLogout ? 'block' : 'none'};">

                              <h3 style="text-align: center;">Hello ${this._user.username}!</h3>
                            </div>

                        </div>
                    </div>
                    <div class="login-fields" style="display: ${!this.isLogout ? 'block' : 'none'};">
                        <trav-text autocomplete="username" autofocus required outlined iconTrailing="account_circle" id="username" label="${
                          this.isLogin
                            ? this.options.translation.username + ' / ' + this.options.translation.email
                            : this.options.translation.username
                        }" style="display: ${
      (!this.isNewPassword && this.isRegister) || this.isLogin ? 'flex' : 'none'
    };"></trav-text>
                        <trav-text  autocomplete="current-password" autofocus required outlined iconTrailing="lock" id="password" type="password" validationMessage="${
                          this.passwordHelper
                        }" label="${this.options.translation.password}" style="display: ${
      this.isRegister || this.isNewPassword || this.isLogin ? 'block' : 'none'
    };"></trav-text>
                        <trav-text autocomplete="email" autofocus required id="email" outlined iconTrailing="email" type="email" label="${
                          this.options.translation.email
                        }" style="display: ${
      (!this.isNewPassword && this.isRegister) || this.isForgotPassword ? 'flex' : 'none'
    };"></trav-text>
                    </div>
                    <div class="options">
                      <span class="subButtons" style="display: ${
                        !this.isRegister && !this.isLogout && !this.isNewPassword ? 'flex' : 'none'
                      };" @click="${this.showRegistration}">Create an account</span>
                      <span class="subButtons" style="display: ${
                        !this.isLogin && !this.isLogout && !this.isNewPassword ? 'flex' : 'none'
                      };" @click="${this.showLogin}">Log in to account</span>
                      <span class="subButtons" style="display: ${
                        !this.isForgotPassword && !this.isLogout ? 'flex' : 'none'
                      };" @click="${this.showForgotPassword}">Forgot your password?</span>
                    </div>

                    <trav-button id="login" raised @click="${this.login}" style="display: ${
      this.isLogin ? 'flex' : 'none'
    };">Log in</trav-button>
                    <trav-button id="register" raised @click="${this.registerAccount}" style="display: ${
      this.isRegister ? 'flex' : 'none'
    };">Register</trav-button>
                    <trav-button id="resetpassword" raised @click="${this.resetPassword}" style="display: ${
      this.isForgotPassword ? 'flex' : 'none'
    };">Reset Password</trav-button>
                    <trav-button id="savepassword" raised @click="${this.savePassword}" style="display: ${
      this.isNewPassword ? 'flex' : 'none'
    };">Save Password</trav-button>
                    <trav-form-button type="submit"  formaction="${
                      window.location.href
                    }" formMethod="post" raised  style="display: ${this.isOauth ? 'flex' : 'none'};">Authorize</trav-form-button>
                    <trav-button raised @click="${this.logout}" style="display: ${
      this.isLogout ? 'flex' : 'none'
    };">Logout</trav-button>

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
    this.passwordRegex = '';
    this.errorMsg = '';
    this.successMsg = '';
    this.isRegister = false;
    this.isForgotPassword = false;
    this.isNewPassword = false;
    this.isLogin = false;
    this.isLogout = false;
    this.isOauth = false;
    this._user = {};
    this.options = {
      translation: {
        username: 'Username',
        password: 'Password',
        email: 'Email'
      }
    };

    this.getPasswordRegex();

    var urlParams = new URLSearchParams(window.location.search);

    this.oauthClient = urlParams.get('client_id');
    this.groupRequest = urlParams.get('group_request');
    this.resetToken = urlParams.get('tert');
    this.checkLoggedIn();
    // var tmsg = urlParams.get('toast');
    // if(tmsg) {
    //   this.showSuccess(tmsg);
    // }
  }

  static get properties() {
    return {
      passwordRegex: { type: String },
      _username: { type: String },
      _password: { type: String },
      _email: { type: String },
      resetToken: { type: String },
      successMsg: { type: String },
      isRegister: { type: Boolean },
      isForgotPassword: { type: Boolean },
      isNewPassword: { type: Boolean },
      isLogin: { type: Boolean },
      isLoggout: { type: Boolean },
      isOauth: { type: Boolean },
      options: { type: Object },
      _user: { type: Object }
    };
  }
  async checkLoggedIn() {
    this._username = this.shadowRoot.getElementById('username');
    this._password = this.shadowRoot.getElementById('password');
    this._email = this.shadowRoot.getElementById('email');

    var ops = await fetch(new Request(window.location.origin + '/travelling/api/v1/config/portal/webclient', { method: 'GET' }));

    this.options = await ops.json();

    if (this.resetToken) {
      this.showNewPassword();
      return;
    }

    var res = await fetch(new Request(window.location.origin + '/travelling/api/v1/user/me', { method: 'GET' }));

    if (res.status === 200) {
      this._user = await res.json();

      if (window.location.href.indexOf('/travelling/api/v1/auth/oauth/authorize') > -1) {
        this.showAuthorization();
      } else {
        this.showLogout();
      }
    } else {
      this.showLogin();
    }

    var urlParams = new URLSearchParams(window.location.search);
    var tmsg = urlParams.get('toast');

    if (tmsg) {
      this.showSuccess(tmsg);
      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname;

      window.history.pushState({ path: newurl }, '', newurl);
    }
  }

  async getPasswordRegex() {
    var res = await fetch(new Request(window.location.origin + '/travelling/api/v1/config/password', { method: 'GET' }));

    var options = await res.json();

    this.passwordRegex =
      (options.consecutive ? '' : '(?!.*(.)\\1{1})') +
      '(?=(.*[\\d]){' +
      options.number +
      ',})(?=(.*[a-z]){' +
      options.lowercase +
      ',})(?=(.*[A-Z]){' +
      options.uppercase +
      ',})(?=(.*[@#$%!]){' +
      options.special +
      ',})(?:[\\da-zA-Z@#$%!^&*\\(\\)]){' +
      options.minchar +
      ',' +
      options.maxchar +
      '}';

    this.passwordHelper = `
                        Minimum of ${options.minchar} characters
                        Maximum of ${options.maxchar} characters
                        Minimum of ${options.number} numbers
                        Minimum of ${options.lowercase} lowercase characters
                        Minimum of ${options.uppercase} uppercase characters
                        Minimum of ${options.special} special characters
                        ${options.consecutive ? '' : 'No consecutive characters'}
                        `;
    this.shadowRoot.getElementById('password').pattern = this.passwordRegex;
  }
  showRegistration() {
    this.isNewPassword = false;
    this.isRegister = true;
    this.isForgotPassword = false;
    this.isLogin = false;
    this.isLogout = false;
    this.isOauth = false;
    setTimeout(() => this.shadowRoot.getElementById('username').formElement.focus(), 100);
  }

  showLogin() {
    this.isNewPassword = false;
    this.isRegister = false;
    this.isForgotPassword = false;
    this.isLogin = true;
    this.isLogout = false;
    this.isOauth = false;
    setTimeout(() => this.shadowRoot.getElementById('username').formElement.focus(), 100);
  }
  showForgotPassword() {
    this.isNewPassword = false;
    this.isRegister = false;
    this.isForgotPassword = true;
    this.isLogin = false;
    this.isLogout = false;
    this.isOauth = false;
    setTimeout(() => this.shadowRoot.getElementById('email').formElement.focus(), 100);
  }

  showNewPassword() {
    this.isNewPassword = true;
    this.isRegister = false;
    this.isForgotPassword = false;
    this.isLogin = false;
    this.isLogout = false;
    this.isOauth = false;
    setTimeout(() => this.shadowRoot.getElementById('password').formElement.focus(), 100);
  }

  showAuthorization() {
    this.isNewPassword = false;
    this.isRegister = false;
    this.isForgotPassword = false;
    this.isLogin = false;
    this.isLogout = true;
    this.isOauth = true;
  }
  showLogout() {
    this.isNewPassword = false;
    this.isRegister = false;
    this.isForgotPassword = false;
    this.isLogin = false;
    this.isLogout = true;
    this.isOauth = false;
  }
  async login() {
    this._username = this.shadowRoot.getElementById('username');
    this._password = this.shadowRoot.getElementById('password');
    this._email = this.shadowRoot.getElementById('email');

    this._username.reportValidity();
    this._password.reportValidity();

    if (this._username.validity.valid && this._password.validity.valid) {
      this.shadowRoot.getElementById('login').disabled = true;
      var loginPayload = {
        password: this._password.value
      };

      loginPayload[this._username.value.indexOf('@') > -1 ? 'email' : 'username'] = this._username.value;

      var res = await fetch(
        new Request(window.location.origin + '/travelling/api/v1/auth/login', {
          method: 'PUT',
          body: JSON.stringify(loginPayload),
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        })
      );

      if (res.status === 200) {
        // this.resetFields();
        // this.checkLoggedIn();
        // this.showSuccess('Successfully logged in.');
        window.location = window.location.href;
      } else {
        this._password.formElement.focus();
        this._password.getLabelAdapterMethods().shakeLabel(true);

        var body = await res.json();

        this.showError(body.msg);
      }
    }

    if (!this._username.validity.valid) {
      this._username.formElement.focus();
      this._username.invalidate();
      this.showError('Invalid ' + this.options.translation.username);
    }

    if (!this._password.validity.valid) {
      this._password.formElement.focus();
      this._password.invalidate();
      this.showError('Invalid ' + this.options.translation.password);
    }

    this.shadowRoot.getElementById('login').disabled = false;
  }
  async logout() {
    await fetch(new Request(window.location.origin + '/travelling/api/v1/auth/logout', { method: 'GET' }));
    window.location = window.location.href;
    // this.checkLoggedIn();
    // this.showSuccess('Successfully logged out.');
  }

  async registerAccount(e) {
    this._username = this.shadowRoot.getElementById('username');
    this._password = this.shadowRoot.getElementById('password');
    this._email = this.shadowRoot.getElementById('email');
    this._username.reportValidity();
    this._email.reportValidity();
    this._password.reportValidity();

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

      var res = await fetch(
        new Request(window.location.origin + '/travelling/api/v1/auth/register', {
          method: 'post',
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      if (res.status === 200) {
        this.showLogin();
        this.showSuccess('Account created, please log in.');
        this._email.value = '';
        this._password.value = '';
        setTimeout(() => this.shadowRoot.getElementById('password').formElement.focus(), 100);
      } else {
        this._password.formElement.focus();
        this._password.getLabelAdapterMethods().shakeLabel(true);

        var body = await res.json();

        this.showError(body.msg);
      }

      this.shadowRoot.getElementById('register').disabled = false;
    }

    if (!this._username.validity.valid) {
      this._username.formElement.focus();
      this._username.invalidate();
      this.showError('Invalid ' + this.options.translation.username);
    }

    if (!this._password.validity.valid) {
      this._password.formElement.focus();
      this._password.invalidate();
      this.showError('Invalid ' + this.options.translation.password);
    }

    if (!this._email.validity.valid) {
      this._email.formElement.focus();
      this._email.invalidate();
      this.showError('Invalid ' + this.options.translation.email);
    }
  }

  resetFields() {
    this._email.value = '';
    this._password.value = '';
    this._username.value = '';
  }

  async resetPassword() {
    this._email = this.shadowRoot.getElementById('email');

    if (this._email.validity.valid) {
      this.shadowRoot.getElementById('resetpassword').disabled = true;

      var res = await fetch(
        new Request('/travelling/api/v1/auth/password/forgot', {
          method: 'put',
          body: JSON.stringify({ email: this._email.value }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      if (res.status === 200) {
        this.showLogin();
        this.showSuccess(
          "Thanks! If there's an account associated with this email, we'll send the password reset instructions immediately."
        );
        this._email.value = '';
      } else {
        this._email.getLabelAdapterMethods().shakeLabel(true);
        var body = await res.json();

        this.showError(body.msg);
      }

      this.shadowRoot.getElementById('resetpassword').disabled = false;
    }

    if (!this._email.validity.valid) {
      this._email.formElement.focus();
      this._email.invalidate();
      this.showError('Invalid ' + this.options.translation.email);
    }
  }

  async savePassword() {
    this._password = this.shadowRoot.getElementById('password');
    this._password.reportValidity();

    if (this._password.validity.valid) {
      this.shadowRoot.getElementById('savepassword').disabled = true;

      var res = await fetch(
        new Request('/travelling/api/v1/auth/password/reset?token=' + this.resetToken, {
          method: 'put',
          body: JSON.stringify({ password: this._password.value }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      if (res.status === 200) {
        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname;

        window.history.pushState({ path: newurl }, '', newurl);
        this.showLogin();
        this.showSuccess('Your password was reset! Please now log in.');
        this.password.value = '';
      } else {
        this._password.formElement.focus();
        this._password.getLabelAdapterMethods().shakeLabel(true);
        var body = await res.json();

        this.showError(body.msg);
      }

      this.shadowRoot.getElementById('resetpassword').disabled = false;
    }

    if (!this._password.validity.valid) {
      this._password.formElement.focus();
      this._password.invalidate();
      this.showError('Invalid ' + this.options.translation.password);
    }
  }

  _onKeyUp(event) {
    // If Enter key pressed, fire 'enter-pressed'
    if (event.keyCode != 13) {
      return;
    }
    // event.preventDefault();

    if (this.isRegister) {
      this.registerAccount();
      return;
    }

    if (this.isLogin) {
      this.login();
      return;
    }

    if (this.isForgotPassword) {
      this.resetPassword();
      return;
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

    console.log(msg);
    this.successMsg = msg;
    success.open();
  }
}

// Register the new element with the browser.
customElements.define('trav-login', Login);

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

class TravFormButton extends TravButton {
  static get properties() {
    return {
      formAction: { reflectToAttribute: true, noAccessor: true },
      formMethod: { reflectToAttribute: true, noAccessor: true }
    };
  }
  render() {
    const classes = {
      'mdc-button--raised': this.raised,
      'mdc-button--unelevated': this.unelevated,
      'mdc-button--outlined': this.outlined,
      'mdc-button--dense': this.dense
    };
    const mdcButtonIcon = html`<span class="material-icons mdc-button__icon">${this.icon}</span>`;

    return html`
      <form style="display: flex;flex: 1;">
        <button
          id="button_${this.label}"
          type="submit"
          formaction="${this.formAction}"
          formmethod="${this.formMethod}"
          .ripple="${ripple({ unbounded: false })}"
          class="mdc-button ${classMap(classes)}"
          ?disabled="${this.disabled}"
          aria-label="${this.label || this.icon}"
        >
          ${this.icon && !this.trailingIcon ? mdcButtonIcon : ''}
          <span class="mdc-button__label">${this.label}</span>
          ${this.icon && this.trailingIcon ? mdcButtonIcon : ''}
          <slot></slot>
        </button>
      </form>
    `;
  }
}

customElements.define('trav-form-button', TravFormButton);

class TravSnack extends Snackbar {
  static get styles() {
    return css`
      ${super.styles}
      .mdc-snackbar__label {
        color: var(--toast-text-color, rgba(255, 255, 255, 0.87));
        white-space: pre-line;
      }
      .mdc-snackbar__surface {
        background-color: var(--travelling-trinary-color, rgba(51, 51, 51, 0.87)) !important;
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
        /* opacity: 1; */
      }
    `;
  }
  static get properties() {
    return {
      autocomplete: { type: String, reflect: true }
    };
  }
  renderInput() {
    //const maxOrUndef = this.maxLength === -1 ? 'maxlength="-1"' : 'maxlength="'+this.maxLength+'"';
    const maxOrUndef = this.maxLength === -1 ? undefined : this.maxLength;

    return html` <input
      id="input_${this.type}"
      class="mdc-text-field__input"
      type="${this.type}"
      .value="${this.value}"
      .autocomplete="${ifDefined(this.autocomplete ? this.autocomplete : undefined)}"
      ?disabled="${this.disabled}"
      placeholder="${ifDefined(this.placeholder)}"
      ?required="${this.required}"
      maxlength="${ifDefined(maxOrUndef)}"
      pattern="${ifDefined(this.pattern ? this.pattern : undefined)}"
      min="${ifDefined(this.min === '' ? undefined : Number(this.min))}"
      max="${ifDefined(this.max === '' ? undefined : Number(this.max))}"
      step="${ifDefined(this.step === null ? undefined : this.step)}"
      @input="${this.handleInputChange}"
      @blur="${this.onInputBlur}"
    />`;
  }

  getRootAdapterMethods() {
    return Object.assign(
      {
        registerTextFieldInteractionHandler: (evtType, handler) => this.addEventListener(evtType, handler),
        deregisterTextFieldInteractionHandler: (evtType, handler) => this.removeEventListener(evtType, handler),
        registerValidationAttributeChangeHandler: (handler) => {
          const getAttributesList = (mutationsList) => {
            return mutationsList.map((mutation) => mutation.attributeName).filter((attributeName) => attributeName);
          };

          const observer = new MutationObserver((mutationsList) =>
            handler(getAttributesList(mutationsList).filter((e) => e != 'pattern'))
          );
          const config = {
            attributes: true
          };

          observer.observe(this.formElement, config);
          return observer;
        },
        deregisterValidationAttributeChangeHandler: (observer) => observer.disconnect()
      },
      addHasRemoveClass(this.mdcRoot)
    );
  }

  async invalidate() {
    this.isUiValid = false;
    this.mdcFoundation.setValid(false);
    this.getLabelAdapterMethods().shakeLabel(true);
  }
}

customElements.define('trav-text', TravText);
