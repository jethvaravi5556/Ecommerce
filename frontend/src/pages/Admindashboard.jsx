import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SummaryApi from "../common";
import { FaRupeeSign, FaBox, FaUsers, FaShoppingBag } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";
import moment from "moment";

/* ─── Status pill ─── */
const StatusPill = ({ status }) => {
  const cfg = {
    Delivered: "bg-green-100 text-green-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Processing: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        cfg[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

/* ─── Stat card ─── */
const StatCard = ({ icon, label, value, bgColor = "bg-blue-50" }) => (
  <div
    className={`${bgColor} rounded-lg p-5 border border-blue-200 hover:shadow-md transition-shadow`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>

      {/* Icon Styling */}
      <div className="text-3xl text-blue-600 bg-white p-3 rounded-full shadow-sm">
        {icon}
      </div>
    </div>
  </div>
);

/* ─── Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border rounded shadow px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-gray-600">
          {p.name}:{" "}
          {p.name === "revenue" ? displayINRCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

/* ─── MAIN DASHBOARD ─── */
const AdminDashboard = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("revenue");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch(SummaryApi.allOrders.url, {
            method: SummaryApi.allOrders.method,
            credentials: "include",
          }),
          fetch(`${SummaryApi.AllUsers.url}?page=1&limit=1000`, {
            method: SummaryApi.AllUsers.method,
            credentials: "include",
          }),
          fetch(`${SummaryApi.allProduct.url}?page=1&limit=1000`, {
            method: SummaryApi.allProduct.method,
            credentials: "include",
          }),
        ]);

        const ordersJson = await ordersRes.json();
        const usersJson = await usersRes.json();
        const productsJson = await productsRes.json();

        const orders = ordersJson.success ? ordersJson.data || [] : [];
        const users = usersJson.success ? usersJson.data || [] : [];
        const products = productsJson.success ? productsJson.data || [] : [];

        const totalRevenue = orders.reduce(
          (s, o) => s + (o.totalAmount || 0),
          0,
        );

        const delivered = orders.filter(
          (o) => o.orderStatus === "Delivered",
        ).length;
        const confirmed = orders.filter(
          (o) => o.orderStatus === "Confirmed",
        ).length;
        const processing = orders.filter(
          (o) => o.orderStatus === "Processing",
        ).length;

        const monthMap = {};
        orders.forEach((o) => {
          const key = moment(o.createdAt).format("MMM");
          if (!monthMap[key])
            monthMap[key] = { month: key, revenue: 0, orders: 0 };
          monthMap[key].revenue += o.totalAmount || 0;
          monthMap[key].orders += 1;
        });

        const productSales = {};
        orders.forEach((order) => {
          (order.productDetails || []).forEach((product) => {
            const key = product.productId || product.name;
            if (!productSales[key])
              productSales[key] = {
                name: product.name,
                sales: 0,
                revenue: 0,
              };

            productSales[key].sales += product.quantity || 1;
            productSales[key].revenue +=
              (product.quantity || 1) * (product.unitPrice || 0);
          });
        });

        const topProducts = Object.values(productSales)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setData({
          totalRevenue,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalProducts: products.length,
          recentOrders,
          monthlyRevenue: Object.values(monthMap),
          orderStatus: [
            { name: "Delivered", value: delivered, color: "#16a34a" },
            { name: "Confirmed", value: confirmed, color: "#2563eb" },
            { name: "Processing", value: processing, color: "#ca8a04" },
          ],
          topProducts,
        });
      } catch {
        setData({
          totalRevenue: 0,
          totalOrders: 0,
          totalUsers: 0,
          totalProducts: 0,
          recentOrders: [],
          monthlyRevenue: [],
          orderStatus: [],
          topProducts: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  const d = data;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4">
      {/* Welcome Header */}
      {/* Header - Same as AllProducts */}
      <div className="bg-white py-3 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded shadow-sm">
        <h2 className="font-bold text-lg">Dashboard</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <p className="text-gray-600 text-sm">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"} 👋
          </p>

          <p className="text-gray-500 text-sm">
            {moment().format("dddd, MMMM Do YYYY")}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FaRupeeSign />}
          label="Total Revenue"
          value={displayINRCurrency(d.totalRevenue)}
          bgColor="bg-green-50"
        />

        <StatCard
          icon={<FaBox />}
          label="Total Orders"
          value={d.totalOrders.toLocaleString()}
          bgColor="bg-blue-50"
        />

        <StatCard
          icon={<FaUsers />}
          label="Total Users"
          value={d.totalUsers.toLocaleString()}
          bgColor="bg-purple-50"
        />

        <StatCard
          icon={<FaShoppingBag />}
          label="Total Products"
          value={d.totalProducts.toLocaleString()}
          bgColor="bg-orange-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-800">
              Performance Overview
            </h3>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              {["revenue", "orders"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === t
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t === "revenue" ? "Revenue" : "Orders"}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            {activeTab === "revenue" ? (
              <AreaChart data={d.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            ) : (
              <BarChart data={d.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-6">
            Order Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={d.orderStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {d.orderStatus.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2">
            {d.orderStatus.map((status) => (
              <div
                key={status.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-gray-700">{status.name}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {status.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-800">Recent Orders</h3>
            <button
              onClick={() => navigate("/admin-panel/all-orders")}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline transition-colors"
            >
              View all Orders →
            </button>
          </div>
          {d.recentOrders.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Customer
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.recentOrders.slice(0, 6).map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate("/admin-panel/all-orders")}
                      >
                        <td className="py-3 px-2 text-gray-900 font-medium">
                          {order.shippingAddress?.name || "N/A"}
                        </td>
                        <td className="py-3 px-2 text-gray-600 truncate max-w-[150px]">
                          {order.productDetails?.[0]?.name || "N/A"}
                        </td>
                        <td className="py-3 px-2 font-semibold text-gray-900">
                          {displayINRCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 px-2">
                          <StatusPill status={order.orderStatus} />
                        </td>
                        <td className="py-3 px-2 text-gray-500 text-xs">
                          {moment(order.createdAt).format("MMM DD, YYYY")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/admin-panel/all-orders")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  View All Orders
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent orders</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-6">
            Top Selling Products
          </h3>
          {d.topProducts.length > 0 ? (
            <div className="space-y-5">
              {d.topProducts.slice(0, 5).map((product, idx) => {
                const maxSales = Math.max(
                  ...d.topProducts.map((p) => p.sales),
                  1,
                );
                const percentage = (product.sales / maxSales) * 100;
                return (
                  <div
                    key={idx}
                    className="pb-4 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">
                          {idx + 1}.{" "}
                          <span className="line-clamp-2">{product.name}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.sales} sold
                        </p>
                      </div>
                      <p className="text-sm font-bold text-blue-600 shrink-0 text-right">
                        {displayINRCurrency(product.revenue)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No products sold yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
