import React, { useState } from "react";
import { createProduct } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const AddProduct = () => {
    const [product, setProduct] = useState({
        productName: "",
        description: "",
        productType: "",
        quantity: 0,
        unitPrice: 0,
    });
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(""); // Track errors
    const navigate = useNavigate();

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

   const handleSubmit = async (e) => {
       e.preventDefault();
       setError(""); // Reset error state
       setLoading(true); // Show loading state

       try {
           await createProduct(product);
           navigate("/"); // Redirect to product list after successful creation
       } catch (err) {
           if (err.response?.data?.details) {
               setError(err.response.data.details.join(", ")); // Show validation errors from backend
           } else {
               setError(err.response?.data?.errorMessage || "Failed to add product.");
           }
       }

       setLoading(false); // Hide loading state
   };

    return (
        <div className="container">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} className="form">
                {[
                    { label: "Product Name", name: "productName", type: "text" },
                    { label: "Description", name: "description", type: "text" },
                    { label: "Product Type", name: "productType", type: "text" },
                    { label: "Quantity", name: "quantity", type: "number" },
                    { label: "Unit Price", name: "unitPrice", type: "number" }
                ].map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                        <label htmlFor={name}>{label}</label>
                        <input id={name} type={type} name={name} value={product[name] || ""} onChange={handleChange} required />
                    </div>
                ))}

                {error && <p className="error">{error}</p>} {/* Display error */}
                <button className="add-btn" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;