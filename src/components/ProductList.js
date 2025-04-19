import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct, getProduct } from "../api";
import { Link } from "react-router-dom";
import "../styles.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [searchedProducts, setSearchedProducts] = useState([]); // Holds multiple search results
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchInitiated, setSearchInitiated] = useState(false); // Tracks whether search has been performed

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const allProducts = await getAllProducts();
                if (allProducts.length > 0) {
                    setProducts(allProducts);
                } else {
                    setProducts([]); // Ensures no products are displayed when empty
                }
            } catch (err) {
                setError("Failed to load products.");
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setSearchInitiated(true); // Mark that search has started
        setSearchedProducts([]);
        setError("");

        try {
            if (!searchId.trim()) {
                // When search input is empty, return all products
                const allProducts = await getAllProducts();
                setSearchedProducts(allProducts);
            } else {
                const products = await getProduct(searchId); // Now returning a list
                setSearchedProducts(products.length > 0 ? products : []);
            }
        } catch (err) {
            setError("No matching products found.");
            setSearchedProducts([]);
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);

        try {
            await deleteProduct(id);
            const updatedProducts = await getAllProducts();
            if (updatedProducts.length > 0) {
                setProducts(updatedProducts);
            } else {
                setProducts([]);
            }
            setSearchedProducts([]);
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
                   {/* Restore Add Button */}
                {!searchInitiated && (
                    <Link to="/add-product">
                        <button className="add-btn">Add New Product</button>
                    </Link>
                )}
            </div>

            {/* Loading & Error Messages */}
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}

            {/* Product Table Display */}
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(searchInitiated ? searchedProducts : products).map((product) => (
                        <tr key={product.id}>
                            <td>{product.productName}</td>
                            <td>{product.description}</td>
                            <td>{product.productType}</td>
                            <td>{product.quantity}</td>
                            <td>{product.unitPrice} PHP</td>
                            <td>
                                <Link to={`/update-product/${product.id}`} state={{ productName: product.productName }}>
                                    <button className="edit-btn">Edit</button>
                                </Link>
                                <button className="delete-btn" onClick={() => handleDelete(product.id)} disabled={loading}>
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Return to List Button */}
            {searchInitiated && searchedProducts.length === 0 && (
                <>
                    <p>No matching products found.</p>
                    <button className="return-btn" onClick={() => {
                        setSearchInitiated(false);
                        setSearchId("");
                    }}>Return to List</button>
                </>
            )}
        </div>
    );
};

export default ProductList;