import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct, getProduct } from "../api";
import { Link } from "react-router-dom";
import "../styles.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [searchedProduct, setSearchedProduct] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const allProducts = await getAllProducts();
                setProducts(allProducts);
            } catch (err) {
                setError("Failed to load products.");
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setSearchedProduct(null);
        setError("");

        try {
            if (!searchId.trim()) {
                const allProducts = await getAllProducts();
                setProducts(allProducts);
                setError("");
            } else {
                const product = await getProduct(searchId);
                setSearchedProduct(product);
                setError("");
            }
        } catch (err) {
            setError("Product not found.");
            setSearchedProduct(null);
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);

        try {
            await deleteProduct(id);
            const updatedProducts = await getAllProducts(); // Refresh product list
            setProducts(updatedProducts);
            setSearchedProduct(null);
            setSearchId(""); // Reset search input
        } catch (err) {
            setError("Failed to delete product.");
        }

        setLoading(false);
    };

    return (
        <div className="container">
            <h2>Simple Inventory Management System</h2>

            {/* Search Box */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Enter Product Name"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <button className="search-btn" onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Loading & Error Messages */}
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}

            {/* Display Searched Product */}
            {searchedProduct ? (
                <div className="product-card">
                    <h3>{searchedProduct.productName}</h3>
                    <p><strong>Description:</strong> {searchedProduct.description}</p>
                    <p><strong>Type:</strong> {searchedProduct.productType}</p>
                    <p><strong>Quantity:</strong> {searchedProduct.quantity}</p>
                    <p><strong>Price:</strong> {searchedProduct.unitPrice} PHP</p>
                    <hr />
                    <div className="button-group">
                        <Link to={`/update-product/${searchedProduct.id}`}>
                            <button className="edit-btn">Edit</button>
                        </Link>
                        <button className="delete-btn" onClick={() => handleDelete(searchedProduct.id)} disabled={loading}>
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <Link to="/add-product">
                        <button className="add-btn">Add New Product</button>
                    </Link>

                    {/* Display Product List */}
                    {products.length > 0 ? (
                        <div className="product-list">
                            {products.map((product) => (
                                <div key={product.id} className="product-card">
                                    <h3>{product.productName}</h3>
                                    <p><strong>Description:</strong> {product.description}</p>
                                    <p><strong>Type:</strong> {product.productType}</p>
                                    <p><strong>Quantity:</strong> {product.quantity}</p>
                                    <p><strong>Price:</strong> {product.unitPrice} PHP</p>
                                    <hr />
                                    <div className="button-group">
                                        <Link to={`/update-product/${product.id}`}>
                                            <button className="edit-btn">Edit</button>
                                        </Link>
                                        <button className="delete-btn" onClick={() => handleDelete(product.id)} disabled={loading}>
                                            {loading ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No products available.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;