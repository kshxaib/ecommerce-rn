import { useState, useEffect } from "react";
import { customerApi } from "../lib/api";
import { formatDate } from "../lib/utils";
import axiosInstance from "../lib/axios";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifSending, setNotifSending] = useState(false);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const data = await customerApi.getAll();
        setCustomers(data.customers || []);
      } catch (error) {
        console.error("Failed to fetch customers", error);
        alert("Failed to fetch customers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Send broadcast notification
  const sendNotification = async () => {
    if (!notifTitle || !notifBody) {
      alert("Please enter both title and message");
      return;
    }

    try {
      setNotifSending(true);
      await axiosInstance.post("/admin/notification", {
        title: notifTitle,
        body: notifBody,
      });
      alert("Notification sent successfully!");
      setNotifTitle("");
      setNotifBody("");
    } catch (err) {
      console.error(err);
      alert("Failed to send notification");
    } finally {
      setNotifSending(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-base-content/70 mt-1">
          {customers.length} {customers.length === 1 ? "customer" : "customers"} registered
        </p>
      </div>

      {/* BROADCAST NOTIFICATION */}
      <div className="card bg-base-100 shadow-md p-4 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Broadcast Notification</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Title"
            value={notifTitle}
            onChange={(e) => setNotifTitle(e.target.value)}
            className="input input-bordered w-full md:w-1/4"
          />
          <input
            type="text"
            placeholder="Message"
            value={notifBody}
            onChange={(e) => setNotifBody(e.target.value)}
            className="input input-bordered w-full md:w-1/2"
          />
          <button
            onClick={sendNotification}
            disabled={notifSending}
            className={`btn btn-primary ${notifSending ? "loading" : ""}`}
          >
            Send
          </button>
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No customers yet</p>
              <p className="text-sm">Customers will appear here once they sign up</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Addresses</th>
                    <th>Wishlist</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full">
                            <img src={customer.imageUrl} alt={customer.name} />
                          </div>
                        </div>
                        <div className="font-semibold">{customer.name}</div>
                      </td>
                      <td>{customer.email}</td>
                      <td>
                        <div className="badge badge-ghost">
                          {customer.addresses?.length || 0} address(es)
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-ghost">
                          {customer.wishlist?.length || 0} item(s)
                        </div>
                      </td>
                      <td>
                        <span className="text-sm opacity-60">
                          {formatDate(customer.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
