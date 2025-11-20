import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
// import OrdersList from "../components/OrdersList";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Orders Dashboard</h1>
      {/* <OrdersList orders={orders} /> */}
    </div>
  );
};

export default Dashboard;
