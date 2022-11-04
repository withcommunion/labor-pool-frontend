import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { Provider } from 'react-redux';

import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';
import store from '@/reduxStore';
// import Navbar from '@/shared_components/navigation/navbar';
import NavContainer from '@/shared_components/navigation/navContainer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <Provider store={store}>
        <NavContainer />
        <Component {...pageProps} />
      </Provider>
    </Authenticator.Provider>
  );
}

export default App;
