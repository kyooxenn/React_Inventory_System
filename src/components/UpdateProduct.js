import React, { useState, useEffect } from "react";
import { getProduct, updateProduct, deleteProduct } from "../api"; // Import deleteProduct
import { useParams, useNavigate } from "react-router-dom";
import "../styles.css";

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        productName: "",
        description: "",
        productType: "",
        quantity: 0,
        unitPrice: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProduct(id);
                setProduct(data);
            } catch {
                setError("Product not found.");
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProduct(id, product);
            navigate("/"); // Redirect after updating
        } catch {
            setError("Failed to update product.");
        }
        setLoading(false);
    };

    // Function to handle deletion and redirect
    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteProduct(id);
            navigate("/"); // Redirect to product list after deletion
        } catch {
            setError("Failed to delete product.");
        }
        setLoading(false);
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="container">
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit} className="form">
                {[
                    { label: "Product Name", name: "productName", type: "text" },
                    { label: "Description", name: "description", type: "text" },
                    { label: "Product Type", name: "productType", type: "text" },
                    { label: "Quantity", name: "quantity", type: "number" },
                    { label: "Price", name: "unitPrice", type: "number" }
                ].map(({ label, name, type }) => (
                    <div className="form-group" key={name}>
                        <label htmlFor={name}>{label}</label>
                        <input id={name} type={type} name={name} value={product[name] || ""} onChange={handleChange} required />
                    </div>
                ))}

                <div className="button-group">
                    <button type="submit" className="edit-btn" disabled={loading}>Update Product</button>
                    <button type="button" className="delete-btn" onClick={handleDelete} disabled={loading}>Delete Product</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;