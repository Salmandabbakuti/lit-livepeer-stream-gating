import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import { ToastContainer } from 'react-toastify';
import Layout from '../components/Layout';
import 'react-toastify/dist/ReactToastify.css';


const client = createReactClient({
  provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_API_KEY }),
});

const livepeerTheme = {
  colors: {
    accent: 'rgb(0, 145, 255)',
    containerBorderColor: 'rgba(0, 145, 255, 0.9)',
  },
  fonts: {
    display: 'Inter',
  },
};
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {

  return (
    <LivepeerConfig
      client={client}
      theme={livepeerTheme}
    >
      <Layout>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Component {...pageProps} />
      </Layout>

    </LivepeerConfig >
  );
}

export default MyApp;
