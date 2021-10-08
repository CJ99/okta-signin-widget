import * as OktaSignIn from '@okta/okta-signin-widget';

const getOktaSignIn = (config) => {
  return new OktaSignIn(config);
};

export default getOktaSignIn;
