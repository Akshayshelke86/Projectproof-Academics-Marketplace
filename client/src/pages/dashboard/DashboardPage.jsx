import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RecentOrders from '../../components/RecentOrders'
import RecentProjects from '../../components/RecentProjects'
import { MdVisibility, MdAttachMoney, MdShoppingBag, MdTrendingUp } from 'react-icons/md'
import { getProjectByUser } from '../../services/projects/ProjectUserSlice'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const projectUser = useSelector(state => state.projectUser)
  const { projects } = projectUser

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getProjectByUser(userInfo._id))
    }
  }, [dispatch, userInfo])

  const analytics = useMemo(() => {
    if (!projects) return { views: 0, value: 0, count: 0 };
    return projects.reduce((acc, curr) => ({
      views: acc.views + (curr.views || 0),
      value: acc.value + (curr.price || 0),
      count: acc.count + 1
    }), { views: 0, value: 0, count: 0 })
  }, [projects])

  return (
    <div className="space-y-8">
      <div>
        <h2 className='font-bold text-2xl text-[var(--text-main)]'>Dashboard Overview</h2>
        <p className='text-sm text-[var(--text-dim)]'>Welcome back, {userInfo?.name}</p>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <MdVisibility size={28} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-dim)] font-bold">Total Views</p>
            <h3 className="text-2xl font-black text-[var(--text-main)]">{analytics.views}</h3>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <MdAttachMoney size={28} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-dim)] font-bold">Portfolio Value</p>
            <h3 className="text-2xl font-black text-[var(--text-main)]">₹{analytics.value}</h3>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
            <MdShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-dim)] font-bold">Total Projects</p>
            <h3 className="text-2xl font-black text-[var(--text-main)]">{analytics.count}</h3>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
            <MdTrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-dim)] font-bold">Avg. Price</p>
            <h3 className="text-2xl font-black text-[var(--text-main)]">₹{analytics.count > 0 ? (analytics.value / analytics.count).toFixed(0) : 0}</h3>
          </div>
        </div>
      </div>

      <div>
        <RecentOrders />
        <RecentProjects />
      </div>
    </div>
  )
}

export default DashboardPage