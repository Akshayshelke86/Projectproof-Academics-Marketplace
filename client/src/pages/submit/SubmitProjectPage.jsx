import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { MdBolt, MdCloudUpload, MdLink, MdCheckCircle, MdImage } from 'react-icons/md'

const SubmitProjectPage = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [techStack, setTechStack] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('0')
    const [githubRepoLink, setGithubRepoLink] = useState('')
    const [videoLink, setVideoLink] = useState('') // New
    const [demoLink, setDemoLink] = useState('') // New (Live Demo)
    const [zipFile, setZipFile] = useState('')
    const [image, setImage] = useState('')
    const [screenshots, setScreenshots] = useState([]) // New
    const [uploading, setUploading] = useState(false)
    const [imageUploading, setImageUploading] = useState(false)
    const [screenshotUploading, setScreenshotUploading] = useState(false) // New
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const editProjectId = queryParams.get('edit')

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        } else if (editProjectId) {
            const fetchProject = async () => {
                try {
                    setLoading(true)
                    const { data } = await axios.get(`/api/projects/${editProjectId}`)
                    setTitle(data.title)
                    setDescription(data.description)
                    setCategory(data.category)
                    setPrice(String(data.price))
                    setTechStack(data.techStack)
                    setGithubRepoLink(data.githubRepoLink || '')
                    setVideoLink(data.videoLink || '')
                    setDemoLink(data.demoLink || '')
                    setImage(data.image)
                    setZipFile(data.zipFilePath || '')
                    setScreenshots(data.screenshots || [])
                    setLoading(false)
                } catch (err) {
                    setError('Failed to fetch project details')
                    setLoading(false)
                }
            }
            fetchProject()
        }
    }, [userInfo, navigate, editProjectId])

    const [pendingSuggestion, setPendingSuggestion] = useState(null) // New State for Suggestions



    const extractTechStack = (content) => {
        const keywords = ['React', 'Node', 'Express', 'MongoDB', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'PHP', 'Laravel', 'Android', 'Flutter', 'TensorFlow', 'Keras', 'Machine Learning', 'AI', 'Blockchain', 'Solidity', 'MERN', 'Angular', 'Vue', 'Javascript', 'Typescript', 'C++'];
        const contentLower = content.toLowerCase();

        // Find keywords
        const found = keywords.filter(k => contentLower.includes(k.toLowerCase()));
        return found.length > 0 ? [...new Set(found)].join(', ') : 'General Coding';
    }

    const cleanDescription = (content) => {
        // Remove HTML tags
        let text = content.replace(/<\/?[^>]+(>|$)/g, "");
        // Remove Markdown Image links
        text = text.replace(/!\[.*?\]\(.*?\)/g, "");
        // Remove Markdown Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
        // Remove Hashtags
        text = text.replace(/#/g, "");
        return text.substring(0, 600).trim() + "...";
    }

    const analyzeGithub = async () => {
        if (!githubRepoLink.includes('github.com')) {
            alert('Please enter a valid GitHub URL first');
            return;
        }
        try {
            setLoading(true);
            const rawUrl = githubRepoLink.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/') + '/main/README.md';

            let readmeContent = '';
            try {
                const { data } = await axios.get(rawUrl);
                readmeContent = typeof data === 'string' ? data : JSON.stringify(data);
            } catch (err) {
                const rawUrlMaster = githubRepoLink.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/') + '/master/README.md';
                const { data } = await axios.get(rawUrlMaster);
                readmeContent = typeof data === 'string' ? data : JSON.stringify(data);
            }

            if (readmeContent) {
                const detectedStack = extractTechStack(readmeContent);
                const cleanedDesc = cleanDescription(readmeContent);

                setPendingSuggestion({
                    techStack: detectedStack,
                    description: cleanedDesc + "\n\n(Imported from GitHub)"
                });
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert("Could not fetch README from GitHub. Ensure the repo is public and has a README.md");
            setLoading(false);
        }
    }

    const applySuggestion = () => {
        if (pendingSuggestion) {
            if (pendingSuggestion.techStack) setTechStack(pendingSuggestion.techStack);
            if (pendingSuggestion.description) setDescription(pendingSuggestion.description);
            setPendingSuggestion(null);
        }
    }

    const uploadImageHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setImageUploading(true)
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            const { data } = await axios.post('/api/upload', formData, config)
            setImage(data)
            setImageUploading(false)
        } catch (error) {
            console.error(error)
            setImageUploading(false)
        }
    }

    const uploadScreenshotHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setScreenshotUploading(true)
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            const { data } = await axios.post('/api/upload', formData, config)
            setScreenshots([...screenshots, data])
            setScreenshotUploading(false)
        } catch (error) {
            console.error(error)
            setScreenshotUploading(false)
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!image) { setError('Please upload a project thumbnail image'); return }
        if (!videoLink) { setError('Demo Video Link is mandatory'); return }
        if (screenshots.length === 0) { setError('Please upload at least one screenshot'); return }

        setLoading(true)
        setError('')

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            }

            const projectData = {
                title, description, techStack, category, price,
                githubRepoLink, videoLink, demoLink, screenshots,
                zipFilePath: zipFile, image,
            }

            if (editProjectId) {
                await axios.put(`/api/projects/${editProjectId}`, projectData, config)
            } else {
                await axios.post('/api/projects', projectData, config)
            }

            setSuccess(true)
            setLoading(false)
            setTimeout(() => navigate('/dashboard'), 2000)
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message)
            setLoading(false)
        }
    }

    const [zipComplexity, setZipComplexity] = useState(null); // Stores file count, complexity score

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('zipFile', file)
        setUploading(true)
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            const { data } = await axios.post('/api/upload/project-file', formData, config)

            // Handle both legacy string path and new Object response
            if (typeof data === 'object' && data.path) {
                setZipFile(data.path);

                // Store Complexity Data
                if (data.fileCount !== undefined) {
                    setZipComplexity({
                        fileCount: data.fileCount,
                        score: data.complexityScore || 5
                    });
                }

                if (data.techStack || data.description) {
                    setPendingSuggestion({ techStack: data.techStack, description: data.description });
                }
            } else {
                setZipFile(data)
            }

            setUploading(false)
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }

    // ... (rest of functions) ...

    const estimatePrice = async () => {
        // Mock AI Logic based on Complexity
        let base = 500;
        let bonus = 0;
        let complexityMsg = "";

        // 1. Tech Stack Value
        const stack = techStack.toLowerCase();
        if (stack.includes('machine learning') || stack.includes('python') || stack.includes('ai')) bonus += 1200;
        else if (stack.includes('blockchain') || stack.includes('solidity')) bonus += 1500;
        else if (stack.includes('react') || stack.includes('node') || stack.includes('mern')) bonus += 800;
        else if (stack.includes('java') || stack.includes('spring')) bonus += 900;
        else bonus += 300;

        // 2. Complexity via ZIP Analysis (if available)
        if (zipComplexity) {
            const { fileCount, score } = zipComplexity;
            bonus += (score * 200); // e.g., Score 8 * 200 = +1600

            if (fileCount > 50) {
                complexityMsg = `High Complexity (${fileCount} files)`;
                base = 2000;
            } else if (fileCount > 20) {
                complexityMsg = `Medium Complexity (${fileCount} files)`;
                base = 1000;
            } else {
                complexityMsg = `Standard Project (${fileCount} files)`;
                base = 500;
            }
        } else {
            // Fallback: Description Length
            const wordCount = description.split(' ').length;
            if (wordCount > 100) bonus += 500;
            else if (wordCount > 50) bonus += 200;
            complexityMsg = "Based on Description Length";
        }

        let suggested = base + bonus;
        // Round to nearest 500
        suggested = Math.ceil(suggested / 100) * 100;

        // Simulate API delay
        const confirm = window.confirm(`🤖 AI Analysis Complete!\n\nMetrics:\n- Stack: ${techStack}\n- Complexity: ${complexityMsg}\n- Base Value: ₹${base}\n- Tech Bonus: ₹${bonus}\n\nSuggested Price: ₹${suggested}\n\nDo you want to apply this price?`);

        if (confirm) {
            setPrice(String(suggested));
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="bg-[var(--bg-card)] rounded-3xl shadow-xl overflow-hidden border border-[var(--border-color)]">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold">Submit Your Project</h1>
                        <p className="mt-2 text-blue-100 italic">ProjectProof Verification Protocol</p>
                    </div>
                    <MdBolt className="absolute -right-4 -bottom-4 text-white opacity-10 text-9xl rotate-12" />
                </div>

                {success ? (
                    <div className="p-20 text-center animate-pulse">
                        <MdCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-[var(--text-main)]">Submission Successful!</h2>
                        <p className="text-[var(--text-dim)] mt-4 text-lg">Your project has been saved. Please request Final Review from Dashboard.</p>
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className="p-8 lg:p-12 space-y-8">
                        {error && (
                            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 text-red-500 rounded-lg font-medium">
                                <p>Error: {error}</p>
                            </div>
                        )}

                        {/* ... Existing Inputs (Title, Thumbnail) ... */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider block">Project Title</label>
                                <input type="text" placeholder="e.g. AI-Powered E-commerce Platform" className="w-full px-4 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-deep)] text-[var(--text-main)] outline-none focus:border-[var(--primary-glow)] transition" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider block">Thumbnail Image</label>
                                <div className="relative group">
                                    <div className={`w-full h-14 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${image ? 'border-green-500/50 bg-green-500/10' : 'border-[var(--border-color)] bg-[var(--bg-deep)] group-hover:border-[var(--primary-glow)]'}`}>
                                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={uploadImageHandler} />
                                        {imageUploading ? <div className="animate-spin h-5 w-5 border-2 border-[var(--primary-glow)] border-t-transparent rounded-full"></div> : image ? <MdCheckCircle className="text-green-500" size={24} /> : <MdImage className="text-[var(--text-dim)]" size={24} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ... Category, Price ... */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider block">Category</label>
                                <select className="w-full px-4 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-deep)] text-[var(--text-main)] outline-none focus:border-[var(--primary-glow)]" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    <option value="">Select Category</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="Machine Learning">Machine Learning</option>
                                    <option value="Blockchain">Blockchain</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider block">Price (₹)</label>
                                <div className="flex gap-2">
                                    <input type="number" className="w-full px-4 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-deep)] text-[var(--text-main)] outline-none focus:border-[var(--primary-glow)]" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
                                    <button type="button" onClick={estimatePrice} className="bg-purple-600 text-white px-4 rounded-xl font-bold hover:bg-purple-700 transition flex items-center gap-2 whitespace-nowrap shadow-lg shadow-purple-500/30">
                                        ✨ Ask AI
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description & Tech Stack */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider block">Project Description</label>
                            <textarea rows="4" className="w-full px-4 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-deep)] text-[var(--text-main)] outline-none focus:border-[var(--primary-glow)]" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider block">Tech Stack</label>
                            <input type="text" className="w-full px-4 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-deep)] text-[var(--text-main)] outline-none focus:border-[var(--primary-glow)]" value={techStack} onChange={(e) => setTechStack(e.target.value)} required />
                        </div>

                        {/* NEW: Video & Screenshots Section */}
                        <div className="bg-[var(--bg-deep)] p-6 rounded-2xl border border-[var(--border-color)] space-y-6">
                            <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2"><MdBolt className="text-yellow-400" /> Proof of Work (Mandatory)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[var(--text-main)] block">Demo Video Link (YouTube / Drive) *</label>
                                    <input type="url" placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] outline-none focus:border-[var(--primary-glow)]" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[var(--text-main)] block">Live Demo URL (Optional)</label>
                                    <input type="url" placeholder="https://my-app.vercel.app" className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] outline-none focus:border-[var(--primary-glow)]" value={demoLink} onChange={(e) => setDemoLink(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--text-main)] block">Screenshots (Evidence)</label>
                                <div className="flex flex-wrap gap-4">
                                    {screenshots.map((s, i) => (
                                        <img key={i} src={s} alt="screenshot" className="w-20 h-20 object-cover rounded-lg border border-[var(--border-color)]" />
                                    ))}
                                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--border-color)] flex items-center justify-center cursor-pointer hover:border-[var(--primary-glow)] relative">
                                        {screenshotUploading ? <div className="animate-spin h-5 w-5 border-2 border-[var(--primary-glow)] border-t-transparent rounded-full"></div> : <span className="text-3xl text-[var(--text-dim)]">+</span>}
                                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={uploadScreenshotHandler} />
                                    </div>
                                </div>
                                <p className="text-xs text-[var(--text-dim)]">Upload at least 1 screenshot of running code.</p>
                            </div>
                        </div>

                        {pendingSuggestion && (
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl text-white shadow-xl flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><MdBolt className="text-yellow-300" /> AI Suggestion Available!</h3>

                                        <div className="bg-white/10 p-3 rounded-xl mb-2 backdrop-blur-sm border border-white/20">
                                            <p className="text-xs font-bold uppercase text-purple-200 mb-1">Detected Tech Stack</p>
                                            <p className="text-sm font-mono">{pendingSuggestion.techStack || 'N/A'}</p>
                                        </div>

                                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                                            <p className="text-xs font-bold uppercase text-purple-200 mb-1">Predicted Description</p>
                                            <p className="text-sm line-clamp-3 opacity-90">{pendingSuggestion.description || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 min-w-[140px]">
                                        <button onClick={applySuggestion} type="button" className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg text-sm">
                                            Use Suggestion
                                        </button>
                                        <button onClick={() => setPendingSuggestion(null)} type="button" className="text-white px-4 py-2 hover:bg-white/10 rounded-lg transition text-xs border border-white/30">
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ... Existing ... */}

                        {/* GitHub & ZIP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider block">GitHub Repo</label>
                                <div className="flex gap-2">
                                    <input type="url" placeholder="https://github.com/..." className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-deep)] text-[var(--text-main)] outline-none focus:border-[var(--primary-glow)]" value={githubRepoLink} onChange={(e) => setGithubRepoLink(e.target.value)} required />
                                    <button type="button" onClick={analyzeGithub} className="bg-gray-800 text-white px-4 rounded-lg hover:bg-black transition text-xs whitespace-nowrap">
                                        Analyze
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider block">Project ZIP</label>
                                <input type="file" className="w-full text-xs text-[var(--text-dim)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--primary-glow)] file:text-white hover:file:bg-blue-600" onChange={uploadFileHandler} />
                                {zipFile && <p className="text-xs text-green-500 font-bold mt-1">✓ ZIP Attached</p>}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-cyan-500/20 transform active:scale-95 transition-all text-lg">
                            {loading ? 'Submitting...' : 'Submit Project for Review'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default SubmitProjectPage
