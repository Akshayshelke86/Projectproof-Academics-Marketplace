import React from 'react'
import { MdFavorite } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="w-full py-8 px-10 text-center border-t border-[var(--border-color)] mt-auto bg-[var(--bg-card)] backdrop-blur-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[var(--text-dim)]">
                <div className="flex flex-col md:flex-row gap-4 items-center order-2 md:order-1">
                    <p className="font-semibold">
                        &copy; {new Date().getFullYear()} <span className="text-[var(--text-main)] font-bold">ProjectProof</span> Marketplace.
                    </p>
                    <div className="flex gap-4 text-xs">
                        <Link to="/legal/terms-and-conditions" className="hover:text-[var(--primary-glow)] hover:underline transition">Terms</Link>
                        <Link to="/legal/privacy-policy" className="hover:text-[var(--primary-glow)] hover:underline transition">Privacy</Link>
                        <Link to="/legal/refund-policy" className="hover:text-[var(--primary-glow)] hover:underline transition">Refunds</Link>
                        <Link to="/legal/contact-us" className="hover:text-[var(--primary-glow)] hover:underline transition">Contact</Link>
                    </div>
                </div>
                <p className="flex items-center gap-1 order-1 md:order-2">
                    Designed & Developed by <span className="text-[var(--primary-glow)] font-bold">Akshay Shelke</span> <MdFavorite className="text-red-500 animate-pulse" />
                </p>
            </div>
        </footer>
    )
}

export default Footer
