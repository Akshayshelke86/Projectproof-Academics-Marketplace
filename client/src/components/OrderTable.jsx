import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyOrders } from "../services/order/OrderListSlice";
import { MdOutlineImageNotSupported } from "react-icons/md";

import axios from 'axios';
import { MdDownload, MdLock } from "react-icons/md";

const OrderTable = () => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { orders, loading, error } = orderList || {};
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);

  const downloadHandler = async (projectId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`/api/projects/${projectId}`, config);

      if (data.zipFilePath) {
        // Create a temporary link to force download
        const link = document.createElement('a');
        link.href = data.zipFilePath;
        link.setAttribute('download', `Project_${projectId}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Download link not found for this project.");
      }
    } catch (err) {
      alert("Failed to get download link: " + (err.response && err.response.data.message ? err.response.data.message : err.message));
    }
  }

  if (loading) return <p>Loading Orders...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!orders || orders.length === 0) return <p className="mt-8 text-gray-500">No orders found. Buy some projects!</p>;

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full mt-8 text-sm text-left align-middle">
        <thead className="bg-gray-50 text-gray-600 uppercase font-medium">
          <tr>
            <th className="py-3 px-4">Project</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              {/* Image */}
              <td className="py-4 px-4">
                {order.orderItems[0]?.image ? (
                  <img src={order.orderItems[0].image} alt={order.orderItems[0].name} className="w-16 h-10 object-cover rounded shadow-sm" />
                ) : (
                  <MdOutlineImageNotSupported size={24} className="text-gray-400" />
                )}
              </td>

              {/* Title */}
              <td className="py-4 px-4 font-semibold text-gray-700">
                {order.orderItems[0]?.name || 'Unknown Project'}
              </td>

              {/* Price */}
              <td className="py-4 px-4 font-bold text-[var(--primary)]">
                ₹{order.totalPrice}
              </td>

              {/* Date */}
              <td className="py-4 px-4 text-gray-500">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </td>

              {/* Status - Paid/Not Paid */}
              <td className="py-4 px-4">
                {order.isPaid ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">Payment Success</span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">Pending</span>
                )}
              </td>

              {/* Actions - Download */}
              <td className="py-4 px-4">
                {order.isPaid ? (
                  <button
                    onClick={() => downloadHandler(order.orderItems[0].project)}
                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-600 transition"
                  >
                    <MdDownload size={16} /> Download
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs flex items-center gap-1"><MdLock /> Locked</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
