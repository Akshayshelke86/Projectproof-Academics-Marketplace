import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProjectCard from "../../components/ProjectCard";
import { MdVerified, MdEmail, MdAccountBalanceWallet, MdTrendingUp, MdApps } from "react-icons/md";

const PublicProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                // Fetch User Details
                const { data: userData } = await axios.get(`/api/users/public/${id}`);
                setUser(userData);

                // Fetch User's Projects
                const { data: projectsData } = await axios.get(`/api/projects/user/${id}`);
                // Filter only published projects for public view
                setProjects(projectsData.filter(p => p.status === 'published'));

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-center py-20 text-red-500 font-bold">
            Profile not found or error loading data.
        </div>
    );

    const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* PROFILE HEADER */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-8 md:p-12 shadow-sm mb-12 relative overflow-hidden backdrop-blur-md">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-xl ring-8 ring-blue-50">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                            <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">{user.name}</h1>
                            {user.isAdmin && (
                                <span className="bg-blue-100 text-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-200">Verified Developer</span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[var(--text-dim)] font-medium mb-6">
                            <div className="flex items-center gap-2">
                                <MdEmail className="text-blue-500" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MdApps className="text-blue-500" />
                                <span>{projects.length} Published Projects</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-[var(--bg-deep)] px-6 py-3 rounded-2xl border border-[var(--border-color)]">
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Total Portfolio Views</p>
                                <p className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                                    <MdTrendingUp className="text-green-500" /> {totalViews.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-[var(--bg-deep)] px-6 py-3 rounded-2xl border border-[var(--border-color)]">
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Member Since</p>
                                <p className="text-xl font-black text-[var(--text-main)]">
                                    {new Date(user.createdAt).getFullYear()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
            </div>

            {/* PROJECTS SECTION */}
            <h2 className="text-2xl font-black text-[var(--text-main)] mb-8 flex items-center gap-2">
                <MdApps className="text-blue-500" /> Published Masterpieces
            </h2>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-[var(--bg-card)] rounded-[2rem] border border-dashed border-[var(--border-color)]">
                    <p className="text-[var(--text-dim)] font-bold italic">This developer hasn't published any projects yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {projects.map(project => (
                        <ProjectCard
                            key={project._id}
                            id={project._id}
                            title={project.title}
                            image={project.image}
                            category={project.category}
                            techStack={project.techStack}
                            price={project.price}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicProfilePage;
