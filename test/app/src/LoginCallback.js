import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { OktaAuth } from '@okta/okta-auth-js';
import { AppContext } from './App';

export default function LoginCallback() {
  const history = useHistory();
  const { setTokens, setCode } = useContext(AppContext);

  useEffect(() => {
    // auto-detect responseMode (when responseType is code)
    var responseMode;
    if (window.location.search.indexOf('code') >= 0) {
      responseMode = 'query';
    } else if (window.location.hash.indexOf('code') >= 0) {
      responseMode = 'fragment';
    }

    const authClient = new OktaAuth({
      issuer: `${process.env.WIDGET_TEST_SERVER}/oauth2/default`,
      redirectUri: 'http://localhost:3000/done',
      pkce: false,
      responseMode: responseMode
    });

    if (authClient.token.isLoginRedirect()) {
      authClient.token.parseFromUrl()
        .then(function(res) {
          setTokens(res.tokens);
          setCode(res.code);
        })
        .catch(function(err) {
          console.log(err);
        })
        .finally(() => history.push('/'));
    }
  }, []);

  return null;
}
