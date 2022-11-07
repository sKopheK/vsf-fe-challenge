import { FC } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { APP_TITLE } from './App.constants';
import AppContextProvider from './App.context';
import Layout from './Layout';

const App: FC = (): JSX.Element => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{APP_TITLE}</title>
        </Helmet>
      </HelmetProvider>
      <AppContextProvider>
        <Layout />
      </AppContextProvider>
    </>
  );
};

export default App;
