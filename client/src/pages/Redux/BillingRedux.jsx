import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setItems,
  setOrders,
  updateQty,
  setCustomerName,
  clearOrder
} from "./billingSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BillingRedux() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, orders, customerName } = useSelector((state) => state.billing);

  // Fetch items
  const fetchItems = async () => {
    const res = await axios.get("http://localhost:3000/item/items");
    if (res.data.success) {
      dispatch(setItems(res.data.items));
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:3000/item/orders");
    if (res.data.success) {
      dispatch(setOrders(res.data.orders));
    }
  };

  useEffect(() => {
    fetchItems();
    fetchOrders();
  }, []);

  // Confirm Order
  const confirmOrder = async () => {
    const selected = items.filter((i) => i.qty > 0);
    if (selected.length === 0) return alert("No items selected!");

    const total = selected.reduce((sum, i) => sum + i.price * i.qty, 0);

    const res = await axios.post("http://localhost:3000/item/orders/add", {
      customerName,
      items: selected,
      totalAmount: total
    });

    if (res.data.success) {
      alert("Order placed!");
      fetchOrders();
      dispatch(clearOrder());
    }
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>🧾 Billing System (Redux)</h2>

        <button className="btn btn-primary" onClick={() => navigate("/invoice")}>
          View Orders
        </button>
      </div>

      <div className="mt-3 mb-3">
        <label className="form-label fw-bold">Customer Name:</label>
        <input
          type="text"
          className="form-control"
          value={customerName}
          onChange={(e) => dispatch(setCustomerName(e.target.value))}
          placeholder="Enter customer name"
        />
      </div>

      <table className="table table-bordered table-striped text-center mt-3">
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() =>
                    dispatch(updateQty({ id: item._id, qty: item.qty - 1 }))
                  }
                  disabled={item.qty === 0}
                >
                  -
                </button>{" "}
                <span>{item.qty}</span>{" "}
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() =>
                    dispatch(updateQty({ id: item._id, qty: item.qty + 1 }))
                  }
                >
                  +
                </button>
              </td>
              <td>{item.qty * item.price}</td>
            </tr>
          ))}

          <tr>
            <td colSpan="3">
              <b>Total</b>
            </td>
            <td>
              <b>{total}</b>
            </td>
          </tr>
        </tbody>
      </table>

      <button
        className="btn btn-success"
        onClick={confirmOrder}
        disabled={!customerName || total === 0}
      >
        Confirm Order
      </button>

      <button className="btn btn-danger ms-3" onClick={() => dispatch(clearOrder())}>
        Clear Order
      </button>
    </div>
  );
}

export default BillingRedux;
