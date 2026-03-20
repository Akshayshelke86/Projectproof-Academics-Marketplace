import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { MdOutlineAdd, MdCheckCircle, MdAssignment, MdInfo, MdEdit } from 'react-icons/md'
import { getProjectByUser } from '../services/projects/ProjectUserSlice'
import axios from 'axios'

const RecentProjects = () => {
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const projectUser = useSelector(state => state.projectUser)
    const { projects, loading } = projectUser

    useEffect(() => {
        if (userInfo?._id) {
            dispatch(getProjectByUser(userInfo._id))
        }
    }, [dispatch, userInfo])

    const requestSubmission = async (id) => {
        if (window.confirm('Request final submission approval for this project?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
                await axios.put(`/api/projects/${id}/submit`, {}, config)
                alert('Submission Requested Succesfully!')
                dispatch(getProjectByUser(userInfo._id))
            } catch (error) {
                alert(error.response?.data?.message || 'Error requesting submission')
            }
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-700'
            case 'submission_requested': return 'bg-blue-100 text-blue-700'
            case 'reviewing': return 'bg-yellow-100 text-yellow-700'
            case 'approved': return 'bg-green-100 text-green-700'
            case 'published': return 'bg-purple-100 text-purple-700'
            default: return 'bg-gray-100'
        }
    }

    return (
        <div className='mt-10 bg-white border border-neutral-200 rounded-2xl shadow-sm p-8'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className='text-xl font-bold text-gray-800'>My Project Submissions</h2>
                    <p className='text-sm text-gray-500'>Manage your academic projects and verification status</p>
                </div>
                <Link to="/submit-project" className='flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition shadow-md'>
                    <MdOutlineAdd size={18} /> Add New
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {projects?.length === 0 && (
                        <div className="col-span-full py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                            <MdAssignment className="text-4xl text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-400">No projects submitted yet.</p>
                        </div>
                    )}

                    {projects?.map(project => (
                        <div key={project._id} className='bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:shadow-md transition group overflow-hidden'>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                                <p className="text-sm font-bold text-primary">₹{project.price}</p>
                            </div>

                            <Link to={`/detail/${project._id}`}>
                                <h3 className='font-bold text-gray-800 truncate mb-1 group-hover:text-primary transition'>{project.title}</h3>
                            </Link>
                            <p className='text-xs text-info mb-4 line-clamp-2'>{project.techStack}</p>

                            <div className="flex flex-col gap-2">
                                {project.status === 'draft' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            to={`/submit-project?edit=${project._id}`}
                                            className="bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-1"
                                        >
                                            <MdEdit size={14} /> Edit
                                        </Link>
                                        <button
                                            onClick={() => requestSubmission(project._id)}
                                            className="bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-1"
                                        >
                                            <MdCheckCircle size={14} /> Submit
                                        </button>
                                    </div>
                                )}

                                {project.status === 'reviewing' && (
                                    <div className="space-y-2">
                                        <div className="bg-yellow-50 text-yellow-600 text-[10px] p-2 rounded-lg flex items-start gap-2 border border-yellow-100">
                                            <MdInfo size={14} className="shrink-0" />
                                            <span>
                                                <b>Under Review:</b> Admin is checking your project.
                                                {project.adminComments && <><br /><b>Feedback:</b> {project.adminComments}</>}
                                            </span>
                                        </div>
                                        <Link
                                            to={`/submit-project?edit=${project._id}`}
                                            className="w-full bg-white border border-gray-300 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1"
                                        >
                                            <MdEdit size={14} /> Edit & Fix
                                        </Link>
                                    </div>
                                )}

                                {project.status === 'published' && (
                                    <div className="bg-green-50 text-green-700 text-[10px] p-3 rounded-xl flex flex-col gap-2 border border-green-100 animate-pulse">
                                        <div className="flex items-center gap-2 font-black uppercase">
                                            <MdCheckCircle size={16} />
                                            <span>Listed on Marketplace!</span>
                                        </div>
                                        <Link to="/marketplace" className="text-primary hover:underline font-bold">View Live Listing →</Link>
                                    </div>
                                )}

                                {project.diffReportPath && (
                                    <button className="w-full bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition">
                                        View Diff Report
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <Link to="/submit-project" className='flex flex-col items-center justify-center bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl p-6 group hover:bg-blue-50 transition'>
                        <div className="bg-white p-2 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition">
                            <MdOutlineAdd size={24} className='text-primary' />
                        </div>
                        <p className='text-sm text-primary font-bold'>Submit New Project</p>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default RecentProjects
