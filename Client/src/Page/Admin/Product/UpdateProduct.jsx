import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Axios/AxiosInstance";
import { toast } from "react-toastify";

/* ---------- Reusable Inputs (match ManageProduct style) ---------- */
const baseInputCls =
  "mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-60 disabled:cursor-not-allowed";

const LabeledInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  required,
  min,
  step,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      min={min}
      step={step}
      className={baseInputCls}
    />
  </div>
);

const LabeledTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  rows = 4,
  required,
}) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      rows={rows}
      className={baseInputCls + " resize-y"}
    />
  </div>
);

/* ---------- Confirmation Modal ---------- */
const ConfirmModal = ({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirming = false,
  confirmBtnClass = "bg-rose-600 hover:bg-rose-700",
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      const btn = dialogRef.current.querySelector("button");
      btn && btn.focus();
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        ref={dialogRef}
        className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${confirmBtnClass}`}
          >
            {confirming ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const abortRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPercentage: "",
    stockQuantity: "",
    category: "",
    brand: "",
    thumbnail: null,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const [fetching, setFetching] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const parseProduct = (raw) => {
    const p = raw?.product || raw?.data || raw;
    if (!p || typeof p !== "object") return null;
    return {
      form: {
        title: p.title || "",
        description: p.description || "",
        price: p.price ?? "",
        discountPercentage: p.discountPercentage ?? "",
        stockQuantity: p.stockQuantity ?? "",
        category: p.category?._id || p.category?.name || p.category || "",
        brand: p.brand?._id || p.brand?.name || p.brand || "",
        thumbnail: null,
      },
      preview: p.thumbnail?.url || "",
      isDeleted: !!p.isDeleted,
    };
  };

  /* ------------ Fetch product ------------ */
  const fetchProduct = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    try {
      setFetching(true);
      setError("");
      const resp = await axiosInstance.get(`/products/${id}`, {
        signal: abortRef.current.signal,
      });
      const parsed = parseProduct(resp.data);
      if (!parsed) {
        setError("Invalid product response format");
      } else {
        setFormData(parsed.form);
        setPreviewImage(parsed.preview);
        setIsDeleted(parsed.isDeleted);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      console.error("Fetch product error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load product details"
      );
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchProduct]);

  /* ------------ Handlers ------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((p) => ({ ...p, thumbnail: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  /* ------------ Update ------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discountPercentage", formData.discountPercentage);
      data.append("stockQuantity", formData.stockQuantity);
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

      await axiosInstance.patch(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!");
      await fetchProduct();
    } catch (err) {
      console.error("Update error:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to update product"
      );
    } finally {
      setUpdating(false);
    }
  };

  /* ------------ Delete ------------ */
  const confirmDelete = () => setShowDeleteModal(true);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/products/${id}`);
      setIsDeleted(true);
      toast.warn("Product soft deleted.");
      setShowDeleteModal(false);
      setTimeout(() => navigate("/showallproduct"), 1000);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete product"
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ------------ Restore ------------ */
  const confirmRestore = () => setShowRestoreModal(true);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await axiosInstance.patch(`/products/undelete/${id}`);
      setIsDeleted(false);
      toast.success("Product restored.");
      setShowRestoreModal(false);
      await fetchProduct();
    } catch (err) {
      console.error("Restore error:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to restore product"
      );
    } finally {
      setRestoring(false);
    }
  };

  const disableForm = updating || isDeleted;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg relative">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Edit Product
          {formData.title && (
            <span className="block text-base font-medium text-indigo-600 mt-1">
              {formData.title}
            </span>
          )}
        </h2>

        {/* Status Badges */}
        <div className="flex justify-center mb-6">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isDeleted
                ? "bg-rose-100 text-rose-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isDeleted ? "Deleted" : "Active"}
          </span>
          {fetching && (
            <span className="ml-3 text-xs text-gray-500 animate-pulse">
              Loading...
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-6 text-center">
            {error}
          </p>
        )}

        {isDeleted && (
          <p className="text-rose-700 bg-rose-50 p-3 rounded-lg mb-6 text-center">
            This product is soft deleted. Restore it to edit.
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <LabeledInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product title"
            disabled={disableForm}
            required
          />
          <LabeledInput
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            disabled={disableForm}
            required
            min="0"
            step="0.01"
          />
          <LabeledTextarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description..."
            disabled={disableForm}
            required
          />
          <LabeledInput
            label="Discount %"
            name="discountPercentage"
            type="number"
            value={formData.discountPercentage}
            onChange={handleChange}
            placeholder="0"
            disabled={disableForm}
            min="0"
            step="0.01"
          />
          <LabeledInput
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="0"
            disabled={disableForm}
            min="0"
          />
          <LabeledInput
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category id or name"
            disabled={disableForm}
            required
          />
          <LabeledInput
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand id or name"
            disabled={disableForm}
            required
          />

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Thumbnail
            </label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-44 h-44 object-cover rounded-lg border shadow-sm"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={disableForm}
              className="mt-3 w-full p-3 border border-gray-300 rounded-lg disabled:opacity-60"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 p-3 text-sm font-semibold rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Back
            </button>
            {!isDeleted && (
              <button
                type="button"
                disabled={deleting || updating}
                onClick={confirmDelete}
                className="flex-1 p-3 text-sm font-semibold rounded-lg text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
            {isDeleted && (
              <button
                type="button"
                disabled={restoring}
                onClick={confirmRestore}
                className="flex-1 p-3 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                {restoring ? "Restoring..." : "Restore"}
              </button>
            )}
            <button
              type="submit"
              disabled={updating || isDeleted}
              className="flex-1 p-3 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Product"
        message="Are you sure you want to soft delete this product? You can restore it later."
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirming={deleting}
      />
      <ConfirmModal
        open={showRestoreModal}
        title="Restore Product"
        message="Do you want to restore this product so it becomes active again?"
        confirmText="Restore"
        onConfirm={handleRestore}
        onCancel={() => setShowRestoreModal(false)}
        confirming={restoring}
        confirmBtnClass="bg-emerald-600 hover:bg-emerald-700"
      />
    </div>
  );
};

export default UpdateProduct;
