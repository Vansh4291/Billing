import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InvoicePage() {
  const [orders, setOrders] = useState([]);

  const API = "http://localhost:3000/item";

  const fetchOrders = async () => {
    const res = await axios.get(`http://localhost:3000/item/orders`);
    if (res.data.success) setOrders(res.data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📄 All Invoices</h2>

      {orders.length === 0 ? (
        <p>No invoices found</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="card mb-4 shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Invoice #{idx + 1}</h5>
            </div>

            <div className="card-body">
              <p>
                <b>Customer:</b> {order.customerName} <br />
                <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
              </p>

              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Price (₹)</th>
                    <th>Qty</th>
                    <th>Subtotal (₹)</th>
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
                    <td colSpan="3"><b>Total</b></td>
                    <td><b>{order.totalAmount}</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
