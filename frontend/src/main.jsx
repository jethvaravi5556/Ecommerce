import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.jsx";
// import Context from "./context";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      {/* <Context.Provider value={{ fetchUserDetails }}> */}
        <RouterProvider router={router} />
      {/* </Context.Provider> */}
    </Provider>
  // </StrictMode>
);



