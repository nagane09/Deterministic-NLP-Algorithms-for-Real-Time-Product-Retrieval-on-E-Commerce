import React, { useEffect, useState } from "react";
import { getAllPayments } from "../../api/payments";
import { CreditCard, CheckCircle2, Clock, User, ArrowUpRight } from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getAllPayments();
        // Backend returns: res.status(200).json(payments)
        setPayments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Payment load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-400 font-bold">Fetching transaction logs...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
          <CreditCard className="text-orange-500" size={32} /> Transaction Logs
        </h1>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold text-sm border border-orange-100">
          Total Transactions: {payments.length}
        </div>
      </div>

      <div className="grid gap-4">
        {payments.length > 0 ? (
          payments.map((pay) => (
            <div key={pay._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-orange-200 transition-all">
              
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${pay.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-lg text-gray-800">₹{pay.amount}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${pay.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {pay.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-1">TXN: {pay.transactionId}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <User size={14} className="text-gray-400" /> {pay.userId?.name || "Unknown User"}
                </p>
                <p className="text-xs text-gray-400 italic">{pay.userId?.email}</p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Method: {pay.method}</p>
                <p className="text-xs text-gray-500 flex items-center justify-end gap-1 mt-1">
                  <Clock size={12} /> {new Date(pay.createdAt).toLocaleString()}
                </p>
              </div>

              <button className="bg-gray-50 p-3 rounded-2xl text-gray-400 hover:bg-orange-500 hover:text-white transition-all">
                <ArrowUpRight size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 text-center rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 italic">No payment records found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;