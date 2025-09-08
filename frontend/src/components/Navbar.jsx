import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-semibold">Invoice Data Extractor</h1>
      <div>
        <Link className="mx-3 hover:text-blue-200" to="/">Home</Link>
        <Link className="mx-3 hover:text-blue-200" to="/about">About</Link>
        <Link className="mx-3 hover:text-blue-200" to="/invoices">Invoices</Link>
      </div>
    </nav>
  );
};

export default Navbar;