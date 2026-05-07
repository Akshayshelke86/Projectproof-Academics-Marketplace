import React, { useEffect } from "react";
import ProjectCard from "../../components/ProjectCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects } from "../../services/projects/ProjectSlice";
import { BsSearch, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdBolt, MdSecurity, MdVerified, MdCode, MdStars, MdCheckCircle } from "react-icons/md";

const HomePage = () => {
  const projectList = useSelector((state) => state.project);
  const { loading, allProjects, error } = projectList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const featuredProjects = allProjects ? allProjects.filter(p => p.status === 'published').slice(0, 4) : [];

  return (
    <div className="relative pb-24 space-y-32">
      {/* Background Mesh */}
      <div className="mesh-bg"></div>

      {/* Hero Section - Split Layout */}
      <section className="relative z-10 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-pink-500/10 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-full text-sm font-black tracking-widest uppercase border border-blue-200 dark:border-blue-800 shadow-sm animate-float-y">
            <MdStars className="text-yellow-500" size={22} /> Uncompromised Integrity
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-[var(--text-main)] leading-[1.1] tracking-[-0.03em]">
            Elevate Your <br />
            <span className="text-gradient-1">Academic</span> <br />
            <span className="text-gradient-2">Projects.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--text-dim)] font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            ProjectProof is the ultimate marketplace combining AST-based similarity detection with rigorous cross-referencing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link to="/marketplace" className="btn-colorful px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 w-full sm:w-auto hover:shadow-2xl">
              Explore Projects <BsArrowRight size={24} />
            </Link>
            <Link to="/submit-project" className="btn-outline-colorful px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 w-full sm:w-auto">
              Submit Yours
            </Link>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-[var(--text-dim)] font-semibold text-sm">
            <div className="flex items-center gap-2"><MdCheckCircle className="text-green-500" /> 100% Original</div>
            <div className="flex items-center gap-2"><MdCheckCircle className="text-green-500" /> Blockchain Verified</div>
          </div>
        </div>
        
        {/* Colorful Abstract Graphic for Right Side */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none aspect-square lg:aspect-auto h-[400px] lg:h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-secondary rounded-full blur-[120px] opacity-20 dark:opacity-40 animate-spin-slow"></div>
          <div className="relative w-full h-full border border-white/20 dark:border-white/5 rounded-[3rem] bg-white/50 dark:bg-black/20 backdrop-blur-3xl shadow-2xl overflow-hidden flex items-center justify-center p-8 animate-float-y" style={{animationDelay: '1s'}}>
            <div className="grid grid-cols-2 gap-4 w-full h-full opacity-80 mix-blend-multiply dark:mix-blend-screen">
              <div className="bg-gradient-1 rounded-3xl animate-float-x"></div>
              <div className="bg-gradient-2 rounded-3xl animate-float-y" style={{animationDelay: '0.5s'}}></div>
              <div className="bg-gradient-t from-yellow-400 to-orange-500 rounded-full animate-float-y" style={{animationDelay: '1.5s'}}></div>
              <div className="bg-gradient-t from-emerald-400 to-cyan-500 rounded-3xl animate-float-x" style={{animationDelay: '2s'}}></div>
            </div>
            {/* Overlay Glass element */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-[var(--border-color)] text-center w-3/4">
              <MdBolt size={60} className="mx-auto text-indigo-500 mb-4 animate-pulse" />
              <h3 className="font-black text-2xl mb-2 text-[var(--text-main)]">Verified Code</h3>
              <p className="text-[var(--text-dim)] font-medium">AST Plagiarism Check</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Clean Standard Cards */}
      <section className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-standard p-8 flex flex-col gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-1 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <MdVerified size={32} />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-main)] text-2xl mb-3">Verified Similarity</h3>
              <p className="text-lg text-[var(--text-dim)] leading-relaxed">Each project undergoes a rigorous GitHub match check for absolute originality and proper licensing guarantees.</p>
            </div>
          </div>
          <div className="card-standard p-8 flex flex-col gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-2 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <MdCode size={32} />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-main)] text-2xl mb-3">AST Comparison</h3>
              <p className="text-lg text-[var(--text-dim)] leading-relaxed">Deep code structure analysis that looks at logic and syntax tree variables, far beyond simple text matching.</p>
            </div>
          </div>
          <div className="card-standard p-8 flex flex-col gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <MdSecurity size={32} />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-main)] text-2xl mb-3">Hashed Certificates</h3>
              <p className="text-lg text-[var(--text-dim)] leading-relaxed">Cryptographic proof of originality hashed directly into project metadata ensuring verifiable digital ownership.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects - Vivid Showcase */}
      <section className="relative z-10 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[var(--border-color)] pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight">Trending Projects</h2>
            <p className="text-xl text-[var(--text-dim)] mt-3 font-medium">Recently approved top-tier creative works.</p>
          </div>
          <Link to="/marketplace" className="mt-6 md:mt-0 font-bold text-lg text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
            View Market <BsArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
             <div className="col-span-full py-20 flex justify-center">
               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
             </div>
          ) : featuredProjects?.length > 0 ? (
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
            <div className="col-span-full py-20 text-center text-[var(--text-dim)] font-medium text-xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)]">
              No verified projects found currently...
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
