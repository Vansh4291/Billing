import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BillingUseState() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const navigate = useNavigate();

  // Fetch all items
  const fetchItems = async () => {
    const res = await axios.get(`http://localhost:3000/item/items`);
    if (res.data.success) {
      // Initialize qty = 0 for UI
      const updated = res.data.items.map((i) => ({ ...i, qty: 0 }));
      setItems(updated);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    const res = await axios.get(`http://localhost:3000/item/orders`);
    if (res.data.success) setOrders(res.data.orders);
  };

  useEffect(() => {
    fetchItems();
    fetchOrders();
  }, []);

  // Adjust quantity locally
  const handleQtyChange = (id, newQty) => {
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: Math.max(newQty, 0) } : i))
    );
  };

  // Confirm order
  const confirmOrder = async () => {
    const selectedItems = items.filter((i) => i.qty > 0);
    if (selectedItems.length === 0) return alert("No items selected!");
    const total = selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    const res = await axios.post(`http://localhost:3000/item/orders/add`, {
      customerName,
      items: selectedItems,
      totalAmount: total,
    });

    if (res.data.success) {
      alert("Order placed successfully!");
      fetchOrders();
      clearOrder(); // reset qtys
    }
  };

  // Clear current order (reset qtys)
  const clearOrder = () => {
    const reset = items.map((i) => ({ ...i, qty: 0 }));
    setCustomerName("");
    setItems(reset);
  };

  // Calculate total
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Billing System</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/invoice")}
        >
          View Orders
        </button>
      </div>

      <div className="mt-3 mb-3">
        <label className="form-label fw-bold">Customer Name:</label>
        <input
          type="text"
          className="form-control"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
        />
      </div>

      <table className="table table-bordered table-striped text-center mt-3">
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
            <th>Subtotal (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleQtyChange(item._id, item.qty - 1)}
                    disabled={item.qty === 0}
                  >
                    -
                  </button>{" "}
                  <span>{item.qty}</span>{" "}
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleQtyChange(item._id, item.qty + 1)}
                  >
                    +
                  </button>
                </td>
                <td>{item.price * item.qty}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No items found</td>
            </tr>
          )}
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

      <div className="d-flex gap-3">
        <button
          className="btn btn-success"
          onClick={confirmOrder}
          disabled={!customerName || total === 0}
        >
          Confirm Order
        </button>
        <button className="btn btn-danger" onClick={clearOrder}>
          Clear Order
        </button>
      </div>

      {/* ====== Offcanvas for Orders ====== */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="ordersPanel"
        aria-labelledby="ordersPanelLabel"
      >
        <div className="offcanvas-header">
          <h5 id="ordersPanelLabel">🧾 Previous Orders</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            orders.map((order, idx) => (
              <div key={idx} className="border rounded p-2 mb-3">
                <p>
                  <b>Customer:</b> {order.customerName}
                  <br />
                  <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
                </p>
                <table className="table table-sm text-center">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it, i) => (
                      <tr key={i}>
                        <td>{it.name}</td>
                        <td>{it.price}</td>
                        <td>{it.qty}</td>
                        <td>{it.price * it.qty}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3">
                        <b>Total</b>
                      </td>
                      <td>
                        <b>{order.totalAmount}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BillingUseState;
