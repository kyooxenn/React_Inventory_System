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

    const navigate = useNavigate();

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createProduct(product);
        navigate("/"); // Redirect to product list
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto" }}>
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="productName">Product Name</label>
                    <input id="productName" type="text" name="productName" value={product.productName} onChange={handleChange} required />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="description">Description</label>
                    <input id="description" type="text" name="description" value={product.description} onChange={handleChange} required />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="productType">Product Type</label>
                    <input id="productType" type="text" name="productType" value={product.productType} onChange={handleChange} required />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="quantity">Quantity</label>
                    <input id="quantity" type="number" name="quantity" value={product.quantity} onChange={handleChange} required />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="unitPrice">Unit Price</label>
                    <input id="unitPrice" type="number" name="unitPrice" value={product.unitPrice} onChange={handleChange} required />
                </div>

                <button className="add-btn" type="submit">Save Product</button>
            </form>
        </div>
    );
};

export default AddProduct;