import { useEffect, useState } from "react";
import axios from "axios";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/invoices");
        setInvoices(res.data);
      } catch (err) {
        console.error("Failed to fetch invoices", err);
        setError("Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatInvoiceData = (invoice) => {
    if (!invoice) return "No data available.";

    let formattedData = "";
    for (const key in invoice) {
      if (invoice.hasOwnProperty(key)) {
        formattedData += `${key}: ${JSON.stringify(invoice[key], null, 2).replace(/^"|"$/g, '')}\n`;
      }
    }
    return formattedData;
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Extracted Invoices</h2>
      {invoices.length === 0 ? (
        <p className="text-gray-500 text-center">No invoices yet</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {invoices.map((invoice, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <strong className="block mb-2">Invoice {index + 1}:</strong>
              <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap overflow-x-auto">
                {formatInvoiceData(invoice)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;