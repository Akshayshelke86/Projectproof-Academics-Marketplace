import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { MdCheckCircle, MdCancel, MdSearch, MdDescription, MdHistory, MdCloudUpload } from 'react-icons/md'
import toast from 'react-hot-toast'

const ProjectReviewPage = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [checkingId, setCheckingId] = useState(null)
    const [activeTab, setActiveTab] = useState('pending') // pending, approved, rejected, published

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const fetchQueue = async () => {
        if (!userInfo || !userInfo.token) return
        try {
            setLoading(true)
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            }

            let statusQuery = '';
            if (activeTab === 'pending') {
                statusQuery = 'status=submission_requested&status=reviewing';
            } else {
                statusQuery = `status=${activeTab}`;
            }

            const { data } = await axios.get(`/api/projects?${statusQuery}`, config)
            setProjects(data)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userInfo) {
            fetchQueue()
        }
    }, [userInfo, activeTab])

    const runOriginalityCheck = async (id) => {
        setCheckingId(id)
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            }
            await axios.post(`/api/projects/${id}/check`, {}, config)
            toast.success('Originality Check Completed!')
            fetchQueue()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check failed')
        } finally {
            setCheckingId(null)
        }
    }

    const downloadReport = async (id, title) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob'
            }
            const { data } = await axios.get(`/api/projects/report/${id}`, config)
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_${title.replace(/\s+/g, '_')}.txt`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Download failed: Not authorized or file not found')
        }
    }

    const [processingId, setProcessingId] = useState(null) // { id, status }

    const handleDecision = async (id, status) => {
        const comments = window.prompt(`Enter feedback for status: ${status}`)
        if (comments === null) return

        try {
            setProcessingId({ id, status })
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            }
            await axios.put(`/api/projects/${id}/decision`, { status, comments }, config)
            toast.success(`Project ${status} successfully!`)
            fetchQueue()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed')
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-blue-100">
                    <MdHistory className="text-3xl text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Review Queue</h1>
                    <p className="text-gray-500">ProjectProof Verification Hub (Admin/Guide Only)</p>
                </div>
            </div>

            {/* STATUS FILTER TABS */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm mb-8 w-fit">
                {['pending', 'approved', 'rejected', 'published'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center p-20 animate-pulse">
                    <div className="h-4 w-64 bg-gray-100 rounded-full"></div>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-white border rounded-3xl border-gray-100">
                    <h3 className="text-xl text-gray-400">Review queue is empty!</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {projects.map(project => (
                        <div key={project._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${project.status === 'submission_requested' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-gray-50 p-3 rounded-2xl">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Student</p>
                                            <p className="text-xs font-bold text-gray-700">{project.user?.name || 'Unknown'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-2xl">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Tech Stack</p>
                                            <p className="text-xs font-bold text-gray-700">{project.techStack}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-2xl border-l-4 border-primary">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Score</p>
                                            <p className={`text-sm font-black ${project.originalityScore > 70 ? 'text-green-600' : 'text-red-500'}`}>
                                                {project.originalityScore || 'TBD'}%
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-2xl">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Price</p>
                                            <p className="text-sm font-bold text-gray-800">₹{project.price}</p>
                                        </div>
                                    </div>

                                    {project.githubRepoLink && (
                                        <a href={project.githubRepoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-1 hover:underline">
                                            <MdSearch /> GitHub Repository
                                        </a>
                                    )}
                                    {project.zipFilePath && (
                                        <a href={project.zipFilePath} download target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-indigo-600 font-medium mb-1 hover:underline">
                                            <MdCloudUpload /> Download Source Code (ZIP)
                                        </a>
                                    )}
                                    {project.videoLink && (
                                        <a href={project.videoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-red-600 font-medium mb-4 hover:underline">
                                            <MdDescription /> Watch Demo Video
                                        </a>
                                    )}

                                    {/* Proof Screenshots */}
                                    {project.screenshots && project.screenshots.length > 0 && (
                                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                            {project.screenshots.map((s, i) => (
                                                <a key={i} href={s} target="_blank" rel="noreferrer">
                                                    <img src={s} alt="proof" className="w-16 h-16 rounded-lg object-cover border border-gray-200 hover:scale-105 transition" />
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Health Check Summary */}
                                    {project.healthCheckReport && (
                                        <div className="bg-gray-50 p-3 rounded-lg text-[10px] text-gray-600 border border-gray-200 mb-4 font-mono">
                                            <p><b>Health Summary:</b> {project.healthCheckReport.isRunReady ? 'Run-Ready' : 'Issues Found'}</p>
                                            <p>Files: {project.healthCheckReport.fileCount} | Missing: {project.healthCheckReport.missingFiles?.length || 0}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <button
                                        disabled={checkingId === project._id}
                                        onClick={() => runOriginalityCheck(project._id)}
                                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                    >
                                        {checkingId === project._id ? 'Scanning...' : 'Run Similarity Scan'}
                                    </button>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDecision(project._id, 'approved')}
                                            disabled={!!processingId}
                                            className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                                        >
                                            {processingId?.id === project._id && processingId?.status === 'approved' ? '...' : <><MdCheckCircle /> Approve</>}
                                        </button>
                                        <button
                                            onClick={() => handleDecision(project._id, 'rejected')}
                                            disabled={!!processingId}
                                            className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                                        >
                                            {processingId?.id === project._id && processingId?.status === 'rejected' ? '...' : <><MdCancel /> Reject</>}
                                        </button>
                                    </div>

                                    {project.diffReportPath && (
                                        <button
                                            onClick={() => downloadReport(project._id, project.title)}
                                            className="w-full bg-white border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm"
                                        >
                                            <MdDescription /> Download Diff Report
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDecision(project._id, 'published')}
                                        disabled={project.status !== 'approved' || !!processingId}
                                        className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition disabled:opacity-30 flex items-center justify-center gap-2 text-sm ${project.status === 'published' ? 'hidden' : ''}`}
                                    >
                                        {processingId?.id === project._id && processingId?.status === 'published' ? 'Publishing...' : <><MdCheckCircle /> Publish for Sale</>}
                                    </button>

                                    {project.status === 'published' && (
                                        <button
                                            onClick={() => handleDecision(project._id, 'unpublished')}
                                            disabled={!!processingId}
                                            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-30 flex items-center justify-center gap-2 text-sm"
                                        >
                                            {processingId?.id === project._id && processingId?.status === 'unpublished' ? 'Processing...' : <><MdCancel /> Unpublish (Admin)</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProjectReviewPage
