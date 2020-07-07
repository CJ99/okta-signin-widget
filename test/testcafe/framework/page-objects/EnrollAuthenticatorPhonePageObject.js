import BasePageObject from './BasePageObject';

const SMS_RADIO_SELECTOR = 'input[value="sms"]';
const VOICE_RADIO_SELECTOR = 'input[value="voice"]';
const PHONE_NUMBER_SELECTOR = '.phone-authenticator-enroll__phone';
const PHONE_NUMBER_EXTENSION_SELECTOR = '.phone-authenticator-enroll__phone-ext';
const phoneFieldName = 'authenticator\\.phoneNumber';
const RESEND_VIEW_SELECTOR = '.phone-authenticator-enroll--warning';
export default class EnrollAuthenticatorPhonePageObject extends BasePageObject {

  constructor (t) {
    super (t);
  }

  clickRadio (type = "voice") {
    return ( type === "voice" )
      ? this.form.clickElement(VOICE_RADIO_SELECTOR)
      : this.form.clickElement(SMS_RADIO_SELECTOR);
  }

  extensionIsHidden () {
    return this.form.getElement(PHONE_NUMBER_EXTENSION_SELECTOR).hasClass('hide');
  }

  getElement (selector) {
    return this.form.getElement(selector);
  }

  hasPhoneNumberError () {
    return this.form.hasTextBoxError(phoneFieldName);
  }

  clickSaveButton () {
    return this.form.clickSaveButton();
  }

  waitForError () {
    return this.form.waitForErrorBox();
  }

  fillPhoneNumber (value) {
    return this.form.setTextBoxValue(phoneFieldName, value);
  }

  phoneNumberFieldIsSmall () {
    return this.form.getElement(PHONE_NUMBER_SELECTOR)
      .hasClass('phone-authenticator-enroll__phone--small');
  }

  clickNextButton() {
    return this.form.clickSaveButton();
  }

  verifyFactor(name, value) {
    return this.form.setTextBoxValue(name, value);
  }

  waitForErrorBox() {
    return this.form.waitForErrorBox();
  }

  getInvalidOTPError() {
    return this.form.getErrorBoxText();
  }

  resendEmailView() {
    return this.form.getElement(RESEND_VIEW_SELECTOR);
  }

}
