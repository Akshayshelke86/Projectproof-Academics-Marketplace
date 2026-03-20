import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProjectCard from '../../components/ProjectCard'
import { getAllProjects } from '../../services/projects/ProjectSlice'
import { MdSearchOff, MdSearch, MdFilterList, MdSort } from "react-icons/md";

const MarketplacePage = () => {
    const dispatch = useDispatch()
    const projectList = useSelector(state => state.project)
    const { loading, error, allProjects } = projectList
    const projects = allProjects || []

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch(getAllProjects(''))
    }, [dispatch])

    // Filter projects locally
    const publishedProjects = projects.filter(p => p.status === 'published')

    // Advanced Filters State
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [maxPrice, setMaxPrice] = React.useState(10000);
    const [sortBy, setSortBy] = React.useState('newest');

    const categories = ['All', ...new Set(publishedProjects.map(p => p.category))];

    // Filter Logic
    const applyFilters = (projectList) => {
        let result = [...projectList];

        // Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Search Query (Title or Tech Stack)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(query) ||
                p.techStack?.toLowerCase().includes(query)
            );
        }

        // Max Price Filter
        if (maxPrice < 10000) {
            result = result.filter(p => p.price <= maxPrice);
        }

        // Sorting Logic
        if (sortBy === 'price_asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else { // 'newest'
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return result;
    };

    // For sectioning verified projects
    const rawMyProjects = projects.filter(p => userInfo && p.user === userInfo._id && (p.status === 'published' || p.status === 'approved' || p.status === 'unpublished'));
    const rawOthersProjects = publishedProjects.filter(p => !userInfo || p.user !== userInfo._id);

    const myVerifiedProjects = applyFilters(rawMyProjects);
    const othersVerifiedProjects = applyFilters(rawOthersProjects);

    const handleUnpublish = async (id) => {
        if (!window.confirm('Are you sure you want to unpublish this project? It will be hidden from the marketplace.')) return;

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            }
            // Temporarily set status to 'unpublished'
            await axios.put(`/api/projects/${id}`, { status: 'unpublished' }, config)
            alert('Project Unpublished Successfully')
            window.location.reload()
        } catch (error) {
            console.error(error);
            alert(error.response && error.response.data.message ? error.response.data.message : 'Update failed')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 border-b border-[var(--border-color)] pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight mb-2">Verified Marketplace</h1>
                        <p className="text-[var(--text-dim)] text-lg italic">The gold standard for academic project integrity.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-auto flex-1 max-w-md relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={24} />
                        <input
                            type="text"
                            placeholder="Search projects, React, Python..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)] transition"
                        />
                    </div>
                </div>

                {/* Advanced Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)]">
                    {/* Domain Filter */}
                    <div className="flex-1 overflow-x-auto flex gap-2 pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${selectedCategory === cat ? 'bg-[var(--primary-glow)] text-white shadow-lg' : 'text-[var(--text-dim)] hover:bg-[var(--bg-deep)] border border-[var(--border-color)]'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="w-px bg-[var(--border-color)] hidden md:block"></div>

                    {/* Right Side Filters: Price & Sort */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <MdFilterList className="text-[var(--text-dim)]" />
                            <label className="text-sm font-bold text-[var(--text-dim)]">Max Price: ₹{maxPrice >= 10000 ? '10000+' : maxPrice}</label>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="500"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-24 accent-[var(--primary-glow)]"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <MdSort className="text-[var(--text-dim)]" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[var(--bg-deep)] border border-[var(--border-color)] text-[var(--text-main)] text-sm font-bold rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-1 focus:ring-[var(--primary-glow)]"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-glow)]"></div>
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="space-y-20">
                    {/* SECTION 1: MY VERIFIED PROJECTS - For Sellers (Students) & Admins */}
                    {userInfo && (userInfo.role === 'student' || userInfo.isFreelancer || userInfo.isAdmin || userInfo.role === 'admin') && (
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-bold text-[var(--text-main)]">My Verified Projects</h2>
                                <div className="h-px flex-1 bg-[var(--border-color)]"></div>
                            </div>

                            {myVerifiedProjects?.length === 0 ? (
                                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="p-4 bg-[var(--bg-deep)] rounded-full">
                                        <MdSearchOff size={40} className="text-[var(--text-dim)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[var(--text-main)]">No Published Projects</h3>
                                        <p className="text-[var(--text-dim)] italic max-w-md mt-1">
                                            You haven't published any projects yet. Once your submissions are approved and verified, they will appear here.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {myVerifiedProjects?.map((project) => (
                                        <ProjectCard
                                            key={project._id}
                                            id={project._id}
                                            title={project.title}
                                            image={project.image}
                                            price={project.price}
                                            techStack={project.techStack}
                                            category={project.category}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION 2: OPEN MARKETPLACE */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-main)]">Global Marketplace</h2>
                            <div className="h-px flex-1 bg-[var(--border-color)]"></div>
                        </div>

                        {othersVerifiedProjects?.length === 0 ? (
                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
                                <div className="p-6 bg-[var(--bg-deep)] rounded-full animate-pulse">
                                    <MdSearchOff size={60} className="text-[var(--text-dim)]" />
                                </div>
                                <div className="max-w-lg">
                                    <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Marketplace is Empty</h3>
                                    <p className="text-[var(--text-dim)] text-lg">
                                        No verified projects are currently available for purchase. Be the first to list your high-quality academic project!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {othersVerifiedProjects?.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        id={project._id}
                                        title={project.title}
                                        image={project.image}
                                        price={project.price}
                                        techStack={project.techStack}
                                        category={project.category}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MarketplacePage
