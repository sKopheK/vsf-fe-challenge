import { FC } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const App: FC = (): JSX.Element => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{"What's the Weather"}</title>
        </Helmet>
      </HelmetProvider>
      <>ahoj</>
    </>
  );
};

export default App;
