import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { MdImage, MdFavorite, MdFavoriteBorder, MdStar } from "react-icons/md";
import axios from "axios"; // Direct axios for quick toggle
import { useSelector } from "react-redux";

const ProjectCard = ({ title, image, category, techStack, price, id }) => {
  const navigate = useNavigate()
  const techStackString = techStack || ""
  const techStackArray = techStackString ? techStackString.split(",") : []
  const [imgError, setImgError] = useState(false);

  // Wishlist Logic
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  // Ideally checking if id is in userInfo.wishlist. For now, local toggle visual.
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlistHandler = async (e) => {
    e.stopPropagation();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    setIsWishlisted(!isWishlisted);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`/api/users/wishlist/${id}`, {}, config);
    } catch (error) {
      console.error("Wishlist toggle error", error);
    }
  };

  return (
    <div className="card-standard p-4 flex flex-col h-full bg-[var(--bg-card)] cursor-pointer group" onClick={() => navigate(`/detail/${id}`)}>
      <div className="relative w-full h-48 mb-5 overflow-hidden rounded-[1rem] bg-[var(--bg-deep)] flex items-center justify-center">
        {!image || imgError ? (
          <div className="flex flex-col items-center justify-center text-[var(--text-dim)]">
            <MdImage size={40} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">No Preview</span>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgError(true)}
          />
        )}
        
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <div className="bg-white dark:bg-black px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-[var(--text-main)] tracking-wide">
            {category}
          </div>
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={toggleWishlistHandler}
          className="absolute top-3 left-3 p-2.5 rounded-full bg-white dark:bg-black hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors shadow-sm group/heart z-10"
        >
          {isWishlisted ? (
            <MdFavorite className="text-pink-500" size={18} />
          ) : (
            <MdFavoriteBorder className="text-gray-400 group-hover/heart:text-pink-500" size={18} />
          )}
        </button>
      </div>

      <div className="flex flex-col flex-grow px-2">
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-3 leading-tight line-clamp-2 h-11" title={title}>
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-6 mt-1">
          {techStackArray.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[var(--bg-deep)] text-[var(--text-dim)] border border-[var(--border-color)]">
              {tag}
            </span>
          ))}
          {techStackArray.length > 3 && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[var(--bg-deep)] text-[var(--text-dim)] border border-[var(--border-color)]">
              +{techStackArray.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5 border-t border-[var(--border-color)]">
          <div>
            <p className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-wider mb-0.5">Price</p>
            <p className="text-xl font-black text-[var(--text-main)]">
              ₹{price}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/detail/${id}`); }}
            className="btn-outline-colorful text-sm px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
