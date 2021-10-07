/*!
 * Copyright (c) 2015-2017, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import Spinner from 'views/shared/Spinner';
import BaseLoginController from 'util/BaseLoginController';
import Util from 'util/Util';

export default BaseLoginController.extend({
  className: 'force-idp-discovery',

  View: Spinner,

  Model: {},

  initialize: function() {
    let options = this.options;
    const lastAuthResponse = options.appState.get('lastAuthResponse');
    const stateToken = lastAuthResponse && lastAuthResponse?.stateToken;

    const webfingerArgs = {
      resource: 'okta:acct:undefined',
      requestContext: stateToken,
    };

    const authClient = options.appState.settings.authClient;
    authClient
      .webfinger(webfingerArgs)
      .then(res => {
        if (res && res.links && res.links[0]) {
          if (res.links[0].properties['okta:idp:type'] !== 'OKTA' && res.links[0].href) {
            const redirectFn = res.links[0].href.includes('OKTA_INVALID_SESSION_REPOST%3Dtrue')
              ? Util.redirectWithFormGet.bind(Util)
              : this.settings.get('redirectUtilFn');
            //override redirectFn to only use Util.redirectWithFormGet if OKTA_INVALID_SESSION_REPOST is included
            //it will be encoded since it will be included in the encoded fromURI

            redirectFn(res.links[0].href);
          } else {
            options.appState.trigger('navigate', '');
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },

});
