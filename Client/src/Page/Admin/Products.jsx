import React from "react";
import { Link } from "react-router-dom";

const Products = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Product
        </Link>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">#</th>
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((product, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">
                <img src="https://via.placeholder.com/50" alt="product" />
              </td>
              <td className="p-2">Sample Product {index + 1}</td>
              <td className="p-2">$49.99</td>
              <td className="p-2">
                <Link to={`/admin/products/edit/${index}`} className="text-blue-600 mr-2">
                  Edit
                </Link>
                <button className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
