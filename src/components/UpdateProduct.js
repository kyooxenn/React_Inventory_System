import React, { useState, useEffect } from "react";
import { getProductById, updateProduct, deleteProduct } from "../api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles.css";

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null); // Store one product, not an array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProductById(id); // Should return a single product object
                setProduct(data);
            } catch (err) {
                setError(err.response?.data?.message || "No matching product found.");
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await updateProduct(id, product);
            navigate("/"); // Redirect after updating
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update product.");
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        setError("");

        try {
            await deleteProduct(id);
            navigate("/"); // Redirect after deletion
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete product.");
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
                    {[
                        { label: "Product Name", name: "productName", type: "text" },
                        { label: "Description", name: "description", type: "text" },
                        { label: "Product Type", name: "productType", type: "text" },
                        { label: "Quantity", name: "quantity", type: "number" },
                        { label: "Price", name: "unitPrice", type: "number" },
                    ].map(({ label, name, type }) => (
                        <div className="form-group" key={name}>
                            <label htmlFor={name}>{label}</label>
                            <input
                                id={name}
                                type={type}
                                name={name}
                                value={product[name] || ""}
                                onChange={handleChange}
                                required
                            />
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