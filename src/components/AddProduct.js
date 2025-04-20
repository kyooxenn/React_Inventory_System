import React, { useState } from "react";
import { createProduct } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const productTypes = ["Electronics", "Furniture", "Clothing", "Food", "Books"]; // Predefined product types

const AddProduct = () => {
    const [product, setProduct] = useState({
        productName: "",
        productType: "",
        description: "",
        quantity: "",
        unitPrice: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            await createProduct(product);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Failed to add product.");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} className="form">
                {/* Product Name */}
                <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input id="productName" type="text" name="productName" value={product.productName} onChange={handleChange} required />
                </div>

                {/* Product Type (Dropdown) */}
                <div className="form-group">
                    <label htmlFor="productType">Product Type</label>
                    <select id="productType" name="productType" value={product.productType} onChange={handleChange} required>
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
                  { label: "Unit Price", name: "unitPrice", type: "number" }]
                .map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                        <label htmlFor={name}>{label}</label>
                        <input id={name} type={type} name={name} value={product[name] || ""} onChange={handleChange} required />
                    </div>
                ))}

                {error && <p className="error">{error}</p>}

                <div className="button-group">
                    <button className="add-btn" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Product"}
                    </button>
                    <button className="return-btn" type="button" onClick={() => navigate("/")}>
                        Return to List
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;