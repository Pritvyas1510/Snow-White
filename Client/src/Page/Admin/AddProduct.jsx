import React from "react";

const ProductForm = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add / Edit Product</h1>
      <form className="space-y-4">
        <input type="text" placeholder="Product Name" className="w-full p-2 border rounded" />
        <input type="number" placeholder="Price" className="w-full p-2 border rounded" />
        <textarea placeholder="Description" className="w-full p-2 border rounded" rows="4" />
        <input type="file" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
