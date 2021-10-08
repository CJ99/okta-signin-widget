const getOktaSignIn = (config) => {
  return new window.OktaSignIn(config);
}

export default getOktaSignIn;
