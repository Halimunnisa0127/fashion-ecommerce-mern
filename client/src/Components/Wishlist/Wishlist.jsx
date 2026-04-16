import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../features/products/wishlistSlice';
import { IoHeartSharp } from "react-icons/io5";
import { addToCart } from '../../features/products/cartSlice';
import { useNavigate } from "react-router-dom";


const Wishlist = () => {
  const wishlist = useSelector(state => state.wishlist);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/"); // /about route ki navigate avuthundi
  };
  if (wishlist.length === 0) {
    return <div className="flex flex-col items-center justify-center text-center py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
        No items in wishlist <span className="text-red-500">💔</span>
      </h1>

      <img
        src="https://img.freepik.com/premium-vector/wishlist-concept-gift-shopping-list-tiny-people-writing-down-wishes-personal-favourites-list_501813-874.jpg"
        alt="Empty wishlist"
        className="w-72 md:w-[500px] mx-auto mt-4 drop-shadow-sm"
      />

      <button
        type="button"
        onClick={handleClick}
        className=" px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-xl shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition"
      >
        ➕ Add Items to Wishlist
      </button>
    </div>
  }

  return (
    <div className="wishlist p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 m">
      {wishlist.map(item => (
        <div
          key={item.id}
          className="product-card border border-black-200 rounded-lg shadow-sm dark:border-gray-700 relative p-4"
        >
          <img
            className="product-image rounded-t-lg w-60 h-60 mx-auto mt-4"
            src={item.image}
            alt={item.name}
          />

          <div className="  text-black">
            <p className="mb-2 text-2xl font-bold tracking-tight">
              {item?.brand}
            </p>
            <h5 className="mb-3 font-normal">
              {item?.name}
            </h5>
            {item?.price && (
              <p className="mb-3 font-normal ">
                <span className="line-through  mr-2">
                  ₹{item.originalPrice}
                </span>
                <span className="font-bold">
                  ₹{item.price}
                </span>
              </p>
            )}

          </div>
          <div className="product-rating mt-2">
            <span className="rating text-green-800 font-semibold">
              {item.rating} &#9733;
            </span>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              dispatch(addToCart({ ...item, quantity: 1 })); // cart lo add
              dispatch(removeFromWishlist(item.id));          // wishlist nunchi remove
            }}
          >
            Add to Cart
          </button>

          {/* Remove button */}
          <button
            onClick={() => dispatch(removeFromWishlist(item.id))}
            className="absolute top-2 right-2 text-red-500"
          >
            <IoHeartSharp />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
