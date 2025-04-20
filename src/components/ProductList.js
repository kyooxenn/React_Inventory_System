import React, { useEffect, useState, useCallback } from "react";
import { getAllProducts, deleteProduct, getProduct } from "../api";
import { Link } from "react-router-dom";
import "../styles.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const allProducts = await getAllProducts();
                setProducts(allProducts);
                setFilteredProducts(allProducts);
            } catch (err) {
                setError("Failed to load products.");
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            if (!searchQuery.trim()) {
                setFilteredProducts(products);
            } else {
                const results = await getProduct(searchQuery);
                setFilteredProducts(results.length > 0 ? results : []);
            }
        } catch (err) {
            setError("No matching products found.");
            setFilteredProducts([]);
        }

        setLoading(false);
    }, [searchQuery, products]);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deleteProduct(id);
            const updatedProducts = await getAllProducts();
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
        } catch (err) {
            setError("Failed to delete product.");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>Inventory Management</h2>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search Products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn" onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
                <Link to="/add-product">
                    <button className="add-btn">Add Product</button>
                </Link>
            </div>

           {loading && (
               <div className="loading-container">
                   <div className="loading-spinner"></div>
                   <p>Loading...</p>
               </div>
           )}

            {error && <p className="error">{error}</p>}

            <table className="product-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
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

            {filteredProducts.length === 0 && searchQuery && (
                <>
                    <p>No matching products found.</p>
                    <button className="return-btn" onClick={() => {
                        setSearchQuery("");
                        setFilteredProducts(products); // Ensures all products are displayed again
                    }}>
                        Reset Search
                    </button>
                </>
            )}
        </div>
    );
};

export default ProductList;