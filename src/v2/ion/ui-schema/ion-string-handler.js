/*!
 * Copyright (c) 2020, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

/* eslint max-depth: [2, 3] */
/* eslint complexity: [2, 20] */
import { loc } from 'okta';
import { HINTS } from '../RemediationConstants';
import CountryUtil from '../../../util/CountryUtil';
import TimeZone from '../../view-builder/utils/TimeZone';

const ionOptionsToUiOptions = (options) => {
  const result = {};
  options.forEach(({ value, label }) => {
    result[value] = label;
  });
  return result;
};

const getPasswordUiSchema = (settings) => ({
  type: 'password',
  params: {
    showPasswordToggle: settings.get('showPasswordToggle'),
  },
});

const getCaptchaUiSchema = () => {
  return {
    type: 'captcha',
  };
};

const countryUISchema = {
  type: 'select',
  options: CountryUtil.getCountryCode(),
  wide: true,
  value: 'US',
};

const timezoneUISchema = {
  type: 'select',
  options: TimeZone,
  wide: true
};

const shouldRenderAsRadio = (name) => name.indexOf('methodType') >= 0 || name.indexOf('channel') >= 0;

const createUiSchemaForString = (ionFormField, remediationForm, transformedResp, createUISchema, settings) => {
  const uiSchema = {
    type: 'text'
  };

  // e.g. { name: 'password', secret: true }
  if (ionFormField.secret === true) {
    Object.assign(uiSchema, getPasswordUiSchema(settings));
  }

  if (ionFormField.hint === HINTS.CAPTCHA) {
    Object.assign(uiSchema, getCaptchaUiSchema());
  }

  if(ionFormField.name === 'userProfile.countryCode'){
    Object.assign(uiSchema, countryUISchema);
  }

  if(ionFormField.name === 'userProfile.timezone'){
    Object.assign(uiSchema, timezoneUISchema);
  }

  if (Array.isArray(ionFormField.options) && ionFormField.options[0] && ionFormField.options[0].value) {
    if (shouldRenderAsRadio(ionFormField.name)) {
      // e.g. { name: 'methodType', options: [ {label: 'sms'} ], type: 'string' | null }
      uiSchema.type = 'radio';
      // set the default value to the first value..
      ionFormField.value = ionFormField.options[0].value;
    } else {
      // default to select (dropdown). no particular reason (certainly can default to radio.)
      // e.g. { name: 'questionKey', options: [], type: 'string' | null }
      uiSchema.type = 'select';
      uiSchema.wide = true;
      uiSchema.options = ionOptionsToUiOptions(ionFormField.options);
    }
  }

  // set optional label for text boxes
  if(ionFormField.required === false && uiSchema.type === 'text') {
    uiSchema.sublabel = loc('oie.form.field.optional', 'login');
  }

  return uiSchema;
};

export default createUiSchemaForString;
