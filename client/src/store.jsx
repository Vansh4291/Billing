import { configureStore } from "@reduxjs/toolkit";
import billingReducer from "./pages/Redux/billingSlice";

export default configureStore({
  reducer: { 
    billing: billingReducer 
  },
});
