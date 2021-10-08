import React, { useRef, useContext } from 'react';
import getOktaSignIn from './getOktaSignIn';
import { AppContext } from './App';

export default function WidgetUIActions() {
  const oktaSignInRef = useRef(null);
  const { config, setTokens, setOidcError } = useContext(AppContext);

  const hide = () => {
    oktaSignInRef.current.hide();
  };

  const show = () => {
    oktaSignInRef.current.show();
  };

  const remove = () => {
    oktaSignInRef.current.remove();
    oktaSignInRef.current = null;
  };

  const start = async () => {
    const oktaSignIn = await getOktaSignIn(config);
    oktaSignIn.on('afterError', function() {
      var errorBox = document.getElementsByClassName('okta-form-infobox-error infobox infobox-error')[0];
      // Update text in errorBox
      errorBox.children[1].innerText = 'Custom Error!';
    });
    oktaSignIn.renderEl({
      el: '#okta-login-container'
    }, function(res) {
      if (res.status === 'SUCCESS') {
        res.session.setCookieAndRedirect(config.baseUrl + '/app/UserHome');
      }
    });

    oktaSignInRef.current = oktaSignIn;
  };

  const startWithShowSignInToGetTokens = async () => {
    const oktaSignIn = await getOktaSignIn(config);
    oktaSignIn.showSignInToGetTokens().then(tokens => {
      setTokens(tokens);
      oktaSignIn.remove();
    });

    oktaSignInRef.current = oktaSignIn;
  };

  const startWithShowSignInAndRedirect = async () => {
    const oktaSignIn = await getOktaSignIn(config);
    oktaSignIn.showSignInAndRedirect();

    oktaSignInRef.current = oktaSignIn;
  };

  const startWithRenderEl = async () => {
    const oktaSignIn = await getOktaSignIn(config);
    oktaSignIn.renderEl(
      { el: '#okta-login-container' },
      function(res) {
        if (res.status !== 'SUCCESS') {
          return;
        }
        setTokens(res.tokens);
        oktaSignIn.remove();
      },
      function(err) {
        setOidcError(err);
      }
    );
    oktaSignIn.on('afterError', (context, error) => {
      console.log(context, error);
    });
  };

  const triggerCspFail = () => {
    try {
      /* eslint-disable-next-line no-eval */
      eval('var cspTrigger = true;');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      <h3>Widget UI Actions</h3>
      <button name="start" onClick={start}>Start</button>
      <button name="hide" onClick={hide}>Hide</button>
      <button name="show" onClick={show}>Show</button>
      <button name="remove" onClick={remove}>Remove</button>
      <button 
        name="showSignInAndRedirect" 
        onClick={startWithShowSignInAndRedirect}
      >
        Start Widget with showSignInAndRedirect
      </button>
      <button 
        name="showSignInToGetTokens" 
        onClick={startWithShowSignInToGetTokens}
      >
        Start Widget with showSignInToGetTokens
      </button>
      <button 
        name="renderEl" 
        onClick={startWithRenderEl}
      >
        Start Widget with RenderEl
      </button>
      <button 
        name="fail-csp" 
        onClick={triggerCspFail}
      >
        Trigger CSP Fail
      </button>
    </>
  );
}
