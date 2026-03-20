import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ProjectCard from "../../components/ProjectCard";
import { MdBolt } from "react-icons/md";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get("/api/users/wishlist", config);
                setWishlist(data); // Expecting array of populated project objects
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchWishlist();
        }
    }, [userInfo]);

    if (loading) return <div className="p-8 text-center">Loading Wishlist...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MdBolt className="text-yellow-500" /> My Wishlist
            </h2>

            {wishlist.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p>Your wishlist is empty.</p>
                    <p className="text-sm">Go to Marketplace and add some projects!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((project) => (
                        // Ensure project object is valid
                        project && (
                            <ProjectCard
                                key={project._id}
                                id={project._id}
                                title={project.title}
                                image={project.image}
                                category={project.category}
                                techStack={project.techStack}
                                price={project.price}
                            />
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
