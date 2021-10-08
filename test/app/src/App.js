import React, { 
  useState, 
  useEffect, 
  useCallback,
  createContext, 
} from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import Actions from './Actions';
import LoginCallback from './LoginCallback';

export const AppContext = createContext(null);

function App() {
  const [config, setConfig] = useState(null);
  const [configStr, setConfigStr] = useState('');
  const [tokens, setTokens] = useState(null);
  const [code, setCode] = useState(null);
  const [cspErrors, setCspErrors] = useState([]);
  const [oidcError, setOidcError] = useState(null);

  const handleCsp = useCallback(err => {
    setCspErrors([...cspErrors, err]);
  });

  useEffect(() => {
    document.addEventListener('securitypolicyviolation', handleCsp);
    return () => document.removeEventListener('securitypolicyviolation', handleCsp);
  }, []);

  const handleConfigChange = (e) => {
    const newConfigStr = e.target.value;
    setConfigStr(newConfigStr);
    try {
      const parsedConfig = JSON.parse(newConfigStr);
      setConfig(parsedConfig);
    } catch (e) {
      // do nothing, only render preview when config is ready as JSON format
    }
  };

  return (
    <AppContext.Provider value={{ 
      config, 
      setTokens, 
      setOidcError,
      setCode
    }}>
      <h2>Sign-In-Widget test pages</h2>

      <div id="config-container">
        <h3>Config</h3>
        <h4>Editor (JSON format)</h4>
        <textarea 
          id="config-editor" 
          value={configStr}
          onChange={handleConfigChange}
        />
        { config && (
          <>
            <h4>Config Preview</h4>
            <pre id="widget-config-preview">
              { JSON.stringify(config, null ,2)}
            </pre>
          </>
        )}
      </div>

      <div id="actions-container">
        <Actions />
      </div>

      { tokens && (
        <pre id="tokens-container">
          {JSON.stringify(tokens, null, 2)}
        </pre>
      )}

      { code && <div id="code-container">{code}</div> }

      <div id="csp-errors-container">
        {cspErrors.map(err => (
          <>{err.blockedURI + ' blocked due to CSP rule ' + err.violatedDirective + ' from ' + err.originalPolicy}</>
        ))}
      </div>

      { oidcError && <div id="oidc-error-container">{ JSON.stringify(oidcError)}</div> }

      <div id="okta-login-container"></div>
      
      <Switch>
        <Route path="/done" component={LoginCallback} />
      </Switch>
    </AppContext.Provider>
    
  );
}

export default App;
