import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { MdEdit, MdImage } from "react-icons/md";

const MyProjectCard = ({ title, image, category, techStack, price, id }) => {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false);
  const techStackString = techStack || ""
  const techStackArray = techStackString ? techStackString.split(",") : []


  return (
    <div className="glow-card rounded-2xl p-4 flex flex-col h-full bg-[var(--bg-card)] max-w-sm w-full group overflow-hidden">
      <div className="relative w-full h-40 mb-4 overflow-hidden rounded-xl bg-[var(--bg-deep)] flex items-center justify-center">
        {!image || imgError ? (
          <div className="flex flex-col items-center justify-center text-[var(--text-dim)]">
            <MdImage size={40} className="mb-2 opacity-30" />
            <span className="text-[10px] font-medium uppercase tracking-widest opacity-50">No Cover</span>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
            {category}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-extrabold text-[var(--text-main)] mb-2 line-clamp-1 group-hover:text-[var(--primary-glow)] transition-colors" title={title}>
        {title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {techStackArray.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--primary-glow)]/10 text-[var(--primary-glow)] border border-[var(--primary-glow)]/20">
            {tag.trim()}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border-color)]/50">
        <div>
          <p className="text-[10px] text-[var(--text-dim)] uppercase font-black tracking-tighter">Earnings Value</p>
          <p className="text-xl font-black text-[var(--text-main)]">₹{price}</p>
        </div>
        <button
          onClick={() => navigate(`/detail/${id}`)}
          className="flex items-center gap-2 bg-[var(--bg-deep)] border border-[var(--border-color)] text-[var(--text-main)] text-sm px-4 py-2.5 rounded-xl font-bold hover:bg-[var(--primary-glow)] hover:text-white hover:border-transparent transition-all shadow-sm"
        >
          <MdEdit size={16} />
          Edit
        </button>
      </div>
    </div>
  );
};

export default MyProjectCard;
