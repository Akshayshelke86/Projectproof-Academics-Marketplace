import React, { useEffect } from "react";
import ProjectCard from "../../components/ProjectCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects } from "../../services/projects/ProjectSlice";
import { BsSearch, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdBolt, MdSecurity, MdVerified, MdCode } from "react-icons/md";

const HomePage = () => {
  const projectList = useSelector((state) => state.project);
  const { loading, allProjects, error } = projectList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const featuredProjects = allProjects ? allProjects.filter(p => p.status === 'published').slice(0, 4) : [];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-[var(--bg-card)] rounded-[40px] p-10 lg:p-20 overflow-hidden border border-[var(--border-color)] shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[var(--primary-glow)]/10 text-[var(--primary-glow)] px-4 py-2 rounded-full text-sm font-bold mb-6 border border-[var(--primary-glow)]/20 animate-bounce">
            <MdBolt /> Blockchain-Verified Academic Integrity
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[var(--text-main)] leading-[1.1] mb-6">
            The Gold Standard for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-glow)] to-[var(--secondary-glow)] italic">Academic Projects</span>.
          </h1>
          <p className="text-xl text-[var(--text-dim)] mb-10 leading-relaxed">
            ProjectProof uses AST-based similarity detection and GitHub cross-referencing to ensure 100% project originality.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/marketplace" className="bg-[var(--text-main)] text-[var(--bg-deep)] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[var(--primary-glow)] hover:text-white transition shadow-xl flex items-center gap-2 group">
              Explore Marketplace <BsArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/submit-project" className="bg-transparent border-2 border-[var(--border-color)] text-[var(--text-main)] px-8 py-4 rounded-2xl font-bold text-lg hover:border-[var(--primary-glow)] transition">
              Submit My Project
            </Link>
          </div>
        </div>
        <MdBolt className="absolute -right-20 -bottom-20 text-[var(--text-dim)] opacity-5 text-[500px] -rotate-12 select-none pointer-events-none" />
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex items-start gap-4 p-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-green-500/10 p-3 rounded-2xl text-green-500"><MdVerified size={30} /></div>
          <div>
            <h3 className="font-bold text-[var(--text-main)] text-lg">Verified Similarity</h3>
            <p className="text-sm text-[var(--text-dim)]">Each project undergoes a 100% GitHub match check.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500"><MdCode size={30} /></div>
          <div>
            <h3 className="font-bold text-[var(--text-main)] text-lg">AST Comparison</h3>
            <p className="text-sm text-[var(--text-dim)]">Advanced code structure analysis beyond text matching.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-500"><MdSecurity size={30} /></div>
          <div>
            <h3 className="font-bold text-[var(--text-main)] text-lg">Hashed Certificates</h3>
            <p className="text-sm text-[var(--text-dim)]">Proof of originality hashed directly into project metadata.</p>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-main)]">Verified This Week</h2>
            <p className="text-[var(--text-dim)] mt-2">Recently approved high-originality submissions.</p>
          </div>
          <Link to="/marketplace" className="text-[var(--primary-glow)] font-bold hover:underline">View All Projects</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProjects?.length > 0 ? (
            featuredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                title={project.title}
                image={project.image}
                techStack={project.techStack}
                category={project.category}
                price={project.price}
              />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-[var(--text-dim)] italic">
              Loading verified projects...
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
