import React, { useState, useEffect } from "react";
import { getProductById, updateProduct, deleteProduct } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles.css";

const productTypeMapping = {
    1: "Electronics",
    2: "Furniture",
    3: "Clothing",
    4: "Food",
    5: "Books",
};

const productTypes = Object.values(productTypeMapping); // Extract type names

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProductById(id);
                // Convert productType from number to its name before storing
                data.productType = productTypeMapping[data.productType] || data.productType;
                setProduct(data);
            } catch (err) {
                setError("No matching product found.");
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const validateFields = () => {
        if (!product.productName.trim()) return "Product name is required.";
        if (!productTypes.includes(product.productType)) return "Please select a valid product type.";
        if (!product.description.trim()) return "Description is required.";
        if (isNaN(product.quantity) || product.quantity <= 0) return "Quantity must be a positive number.";
        if (isNaN(product.unitPrice) || product.unitPrice <= 0) return "Unit price must be a positive number.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const validationError = validateFields();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            await updateProduct(id, product);
            navigate("/");
        } catch (err) {
            setError("Failed to update product.");
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteProduct(id);
            navigate("/");
        } catch (err) {
            setError("Failed to delete product.");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>Update Product</h2>
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}

            {product ? (
                <form onSubmit={handleSubmit} className="form">
                    {/* Product Name */}
                    <div className="form-group">
                        <label htmlFor="productName">Product Name</label>
                        <input id="productName" type="text" name="productName" value={product.productName} onChange={handleChange} required />
                    </div>

                    {/* Product Type Dropdown */}
                    <div className="form-group">
                        <label htmlFor="productType">Product Type</label>
                        <select id="productType" name="productType" value={product.productType || ""} onChange={handleChange} required>
                            <option value="">Select Product Type</option>
                            {productTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Remaining Fields */}
                    {[{ label: "Description", name: "description", type: "text" },
                      { label: "Quantity", name: "quantity", type: "number" },
                      { label: "Price", name: "unitPrice", type: "number" }]
                    .map(({ label, name, type }) => (
                        <div className="form-group" key={name}>
                            <label htmlFor={name}>{label}</label>
                            <input id={name} type={type} name={name} value={product[name] || ""} onChange={handleChange} required />
                        </div>
                    ))}

                    <div className="button-group">
                        <button type="submit" className="edit-btn" disabled={loading}>
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                        <button type="button" className="delete-btn" onClick={handleDelete} disabled={loading}>
                            {loading ? "Deleting..." : "Delete Product"}
                        </button>
                        <button className="return-btn" onClick={() => navigate("/")}>
                            Return to List
                        </button>
                    </div>
                </form>
            ) : (
                <p>No matching product found.</p>
            )}
        </div>
    );
};

export default UpdateProduct;