import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllProjects } from '../../services/projects/ProjectSlice';
import MyProjectCard from '../../components/MyProjectCard';
import { getProjectByUser } from '../../services/projects/ProjectUserSlice';
import { MdPerson } from 'react-icons/md';

const ProjectsPage = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const projectList = useSelector((state) => state.projectUser);
  const { loading, error, projects } = projectList;
  const dispatch = useDispatch()

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getProjectByUser(userInfo._id))
    }
  }, [dispatch, userInfo])

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className='text-3xl font-black text-[var(--text-main)]'>Your Projects!</h2>
        {userInfo && (
          <Link to={`/profile/${userInfo._id}`} className="bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[var(--bg-deep)] transition">
            <MdPerson className="text-blue-500" /> View Public Portfolio
          </Link>
        )}
      </div>

      <div className='flex flex-wrap items-center justify-evenly gap-6 mt-6 '>
        {projects?.map(project =>
          <MyProjectCard key={project._id} id={project._id} title={project.title} image={project.image} techStack={project.techStack} category={project.category} price={project.price} />
        )}
      </div>
    </div>
  )
}

export default ProjectsPage