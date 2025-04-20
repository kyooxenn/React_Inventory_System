import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import UpdateProduct from "./components/UpdateProduct";
import VideoBackground from "./components/VideoBackground";

function App() {
    return (
        <Router>
            {/* Video Background placed here so it's always visible */}
            <VideoBackground />

            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/update-product/:id" element={<UpdateProduct />} />
            </Routes>
        </Router>
    );
}

export default App;