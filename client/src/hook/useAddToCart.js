import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../features/products/cartSlice';

export const useAddToCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = async (productId, quantity) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to add items to your cart.");
            navigate("/login");
            return false;
        }

        try {
            await dispatch(
                addToCart({
                    productId: productId,
                    quantity: quantity,
                })
            ).unwrap();

            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
            return true;
        } catch (err) {
            console.error("Add failed:", err);
            return false;
        }
    };

    return { handleAddToCart, addedToCart };
};