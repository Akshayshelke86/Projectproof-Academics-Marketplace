import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { MdImage, MdFavorite, MdFavoriteBorder } from "react-icons/md";
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
    <div className="glow-card rounded-2xl p-4 flex flex-col h-full bg-[var(--bg-card)] cursor-pointer group" onClick={() => navigate(`/detail/${id}`)}>
      <div className="relative w-full h-40 mb-4 overflow-hidden rounded-xl bg-[var(--bg-deep)] flex items-center justify-center">
        {!image || imgError ? (
          <div className="flex flex-col items-center justify-center text-[var(--text-dim)]">
            <MdImage size={40} className="mb-2 opacity-50" />
            <span className="text-xs font-mono">No Preview</span>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-wider">{category}</span>
          </div>
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={toggleWishlistHandler}
          className="absolute top-2 left-2 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white transition-colors shadow-lg group/heart"
        >
          {isWishlisted ? (
            <MdFavorite className="text-red-500" size={20} />
          ) : (
            <MdFavoriteBorder className="text-white group-hover/heart:text-red-500" size={20} />
          )}
        </button>
      </div>

      <h3 className="text-lg font-bold text-[var(--text-main)] mb-1 leading-tight line-clamp-1" title={title}>
        {title}
      </h3>

      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        {techStackArray.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="text-[10px] font-medium px-2 py-1 rounded-md bg-[var(--primary-glow)]/10 text-[var(--primary-glow)] border border-[var(--primary-glow)]/20">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
        <div>
          <p className="text-xs text-[var(--text-dim)] uppercase font-semibold">Price</p>
          <p className="text-xl font-bold text-[var(--text-main)]">₹{price}</p>
        </div>
        <button
          onClick={() => navigate(`/detail/${id}`)}
          className="bg-[var(--text-main)] text-[var(--bg-deep)] text-sm px-4 py-2 rounded-xl font-bold hover:bg-[var(--primary-glow)] hover:text-white transition-all shadow-lg hover:shadow-[var(--primary-glow)]/30"
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
