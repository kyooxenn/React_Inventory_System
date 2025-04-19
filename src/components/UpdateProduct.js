import React, { useState, useEffect } from "react";
import { getProduct, updateProduct, deleteProduct } from "../api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles.css";

const UpdateProduct = () => {
    const location = useLocation();
    const { productName } = location.state || {}; // Get product name from React Router state
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // Updated: Store multiple products
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(""); // Track error messages

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProduct(productName); // Updated: Now receiving a list
                setProducts(data);
            } catch (err) {
                setError(err.response?.data?.message || "No matching products found.");
            }
            setLoading(false);
        };

        fetchProducts();
    }, [id]);

    const handleChange = (e, index) => {
        const updatedProducts = [...products];
        updatedProducts[index] = {
            ...updatedProducts[index],
            [e.target.name]: e.target.value,
        };
        setProducts(updatedProducts);
    };

    const handleSubmit = async (e, product) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await updateProduct(product.id, product);
            navigate("/"); // Redirect after updating
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update product.");
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        setError("");

        try {
            await deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id)); // Remove deleted product from state
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

            {products.length > 0 ? (
                products.map((product, index) => (
                    <form key={product.id} onSubmit={(e) => handleSubmit(e, product)} className="form">
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
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                        ))}

                        <div className="button-group">
                            <button type="submit" className="edit-btn" disabled={loading}>
                                {loading ? "Updating..." : "Update Product"}
                            </button>
                            <button type="button" className="delete-btn" onClick={() => handleDelete(product.id)} disabled={loading}>
                                {loading ? "Deleting..." : "Delete Product"}
                            </button>
                            <button className="return-btn" onClick={() => navigate("/")}>
                                Return to List
                            </button>
                        </div>
                    </form>
                ))
            ) : (
                <p>No matching products found.</p>
            )}
        </div>
    );
};

export default UpdateProduct;