import { CartContextProvider } from "../context/cartContext";
import { UserContextProvider } from "../context/userContext";
import CheckAuth from "../context/checkAuth";
import { QueryClient, QueryClientProvider } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";

export default function MyApp({ Component, ...pageProps }) {
  const client = new QueryClient();
  return (
    <UserContextProvider>
      <CheckAuth>
        <QueryClientProvider client={client}>
          <CartContextProvider>
            <Component {...pageProps} />
            <ToastContainer
              position='top-center'
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </CartContextProvider>
        </QueryClientProvider>
      </CheckAuth>
    </UserContextProvider>
  );
}
