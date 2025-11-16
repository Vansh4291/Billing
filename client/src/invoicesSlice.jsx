import { createSlice } from "@reduxjs/toolkit";
import api from "./api";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    fetchStart(state) { state.loading = true; state.error = null; },
    fetchSuccess(state, action) { state.loading = false; state.items = action.payload; },
    fetchFailure(state, action) { state.loading = false; state.error = action.payload; },
    addSuccess(state, action) { state.items.unshift(action.payload); },
    updateSuccess(state, action) {
      const i = state.items.findIndex((x) => x._id === action.payload._id);
      if (i !== -1) state.items[i] = action.payload;
    },
    deleteSuccess(state, action) { state.items = state.items.filter((x) => x._id !== action.payload); },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, addSuccess, updateSuccess, deleteSuccess } = invoicesSlice.actions;

export default invoicesSlice.reducer;

// Manual thunk action creators (no createAsyncThunk required)
export const fetchInvoices = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await api.get("/invoices");
    dispatch(fetchSuccess(res.data));
  } catch (err) {
    dispatch(fetchFailure(err.message || String(err)));
  }
};

export const addInvoice = (invoice) => async (dispatch) => {
  try {
    const res = await api.post("/invoices", invoice);
    dispatch(addSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(fetchFailure(err.message || String(err)));
    throw err;
  }
};

export const updateInvoice = ({ id, invoice }) => async (dispatch) => {
  try {
    const res = await api.put(`/invoices/${id}`, invoice);
    dispatch(updateSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(fetchFailure(err.message || String(err)));
    throw err;
  }
};

export const deleteInvoice = (id) => async (dispatch) => {
  try {
    await api.delete(`/invoices/${id}`);
    dispatch(deleteSuccess(id));
    return id;
  } catch (err) {
    dispatch(fetchFailure(err.message || String(err)));
    throw err;
  }
};
