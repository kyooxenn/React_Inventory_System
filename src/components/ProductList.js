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
        getAllProducts()
            .then(setProducts)
            .catch(() => setError("Failed to load products."));
    }, []);

    const handleSearch = () => {
        setLoading(true);
        setSearchedProduct(null);
        setError("");

        setTimeout(async () => {
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
            } catch {
                setError("Product not found.");
                setSearchedProduct(null);
            }

            setLoading(false);
        }, 1000);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        await deleteProduct(id);
        const updatedProducts = await getAllProducts(); // Fetch updated product list
        setProducts(updatedProducts); // Refresh the product list
        setSearchedProduct(null); // Clear the searched product after deletion
        setSearchId(""); // Reset search input to ensure list appears
        setLoading(false);
    };

    return (
        <div>
            <h2>Product List</h2>

            {/* Search Box */}
            <div>
                <input
                    type="text"
                    placeholder="Enter Product ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>

            {/* Show loading effect */}
            {loading && <p>Loading...</p>}

            {/* Show error message when product is not found */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Display Only the Searched Product If Found */}
            {searchedProduct ? (
                <div>
                    <h3>Product Details</h3>
                    <p><strong>Name:</strong> {searchedProduct.productName}</p>
                    <p><strong>Description:</strong> {searchedProduct.description}</p>
                    <p><strong>Type:</strong> {searchedProduct.productType}</p>
                    <p><strong>Quantity:</strong> {searchedProduct.quantity}</p>
                    <p><strong>Price:</strong> ${searchedProduct.unitPrice}</p>
                    <hr />
                     {/* Edit and Delete Buttons */}
                     <Link to={`/update-product/${searchedProduct.id}`}>
                         <button className="edit-btn">Edit</button>
                     </Link>
                     <button className="delete-btn" onClick={() => handleDelete(searchedProduct.id)}>Delete</button>
                </div>
            ) : (
                <>
                    <Link to="/add-product">
                        <button className="add-btn">Add New Product</button>
                    </Link>

                    {/* Show Product List Only If No Search Result */}
                    {products.length > 0 ? (
                        <ul>
                            {products.map((product) => (
                                <li key={product.id}>
                                    <strong>{product.productName}</strong> <br />
                                    Description: {product.description} <br />
                                    Product Type: {product.productType} <br />
                                    Quantity: {product.quantity} <br />
                                    Price: {product.unitPrice}PHP <br />

                                   {/* Edit and Delete Buttons */}
                                   <Link to={`/update-product/${product.id}`}>
                                       <button className="edit-btn">Edit</button>
                                   </Link>
                                   <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No products available.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;