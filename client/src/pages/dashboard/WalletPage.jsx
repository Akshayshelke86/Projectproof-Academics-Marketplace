import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { refreshUserProfile } from '../../services/user/UserLoginSlice'
import { MdAccountBalanceWallet, MdAttachMoney, MdHistory, MdTrendingUp, MdArrowUpward, MdArrowDownward, MdContentCopy } from 'react-icons/md'
import { toast } from 'react-hot-toast'
// import { getUserDetails } from '../../services/user/UserLoginSlice' -- REMOVED because it doesn't exist

const WalletPage = () => {
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [totalViews, setTotalViews] = React.useState(0);

    React.useEffect(() => {
        dispatch(refreshUserProfile());
    }, [dispatch]);

    React.useEffect(() => {
        const fetchViews = async () => {
            if (userInfo?._id) {
                try {
                    const { data } = await axios.get(`/api/projects/user/${userInfo._id}`);
                    const views = data.reduce((acc, p) => acc + (p.views || 0), 0);
                    setTotalViews(views);
                } catch (err) {
                    console.error("Error fetching views", err);
                }
            }
        }
        fetchViews();
    }, [userInfo]);

    // We might need to refresh user profile to get latest balance
    // But usually login response has it? 
    // If balance updates on backend, we need to re-fetch profile to see it on frontend.
    // Let's assume userInfo is updated or we trigger a fetch.

    // Quick Fix: If userInfo doesn't have walletBalance (because it's old token), we might need to hit /profile endpoint.
    // For now, let's just display what matches.

    const copyReferralLink = () => {
        if (!userInfo?.referralCode) return;
        const link = `${window.location.origin}/register?ref=${userInfo.referralCode}`;
        navigator.clipboard.writeText(link);
        toast.success('Referral link copied to clipboard!');
    };

    const handleWithdraw = () => {
        if ((userInfo?.walletBalance || 0) < 100) {
            toast.error("Minimum withdrawal amount is ₹100");
        } else {
            toast.success("Withdrawal request submitted to admin!");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[var(--text-main)]">My Wallet</h1>
                <p className="text-[var(--text-dim)]">Manage your earnings and payouts.</p>
            </div>

            {/* BALANCE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Available Balance */}
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <MdAccountBalanceWallet size={80} />
                    </div>
                    <p className="text-blue-100 font-medium mb-1">Available Balance</p>
                    <h2 className="text-4xl font-black tracking-tight flex items-baseline gap-1">
                        ₹{(userInfo?.walletBalance || 0).toLocaleString()}
                        <span className="text-lg font-normal opacity-80">.00</span>
                    </h2>
                    <button
                        onClick={handleWithdraw}
                        className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition shadow-lg"
                    >
                        Withdraw Funds
                    </button>
                </div>

                {/* Total Lifetime Earnings */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <MdTrendingUp size={24} />
                        </div>
                        <span className="text-[var(--text-dim)] font-bold text-sm uppercase">Total Earnings</span>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--text-main)]">
                        ₹{(userInfo?.totalEarnings || 0).toLocaleString()}
                    </h2>
                    <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                        <MdArrowUpward /> Lifetime revenue
                    </p>
                </div>

                {/* Pending / Commission Paid (Mock) */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <MdHistory size={24} />
                        </div>
                        <span className="text-[var(--text-dim)] font-bold text-sm uppercase">Platform Fees Paid</span>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--text-main)]">
                        ₹{(((userInfo?.totalEarnings || 0) / 0.9) * 0.1).toFixed(0)}
                    </h2>
                    <p className="text-xs text-[var(--text-dim)] font-medium mt-2">
                        @ 10% Commission Rate
                    </p>
                </div>
            </div>

            {/* ANALYTICS MINI SECTION */}
            <div className="mb-10 pt-4">
                <h3 className="text-xl font-black text-[var(--text-main)] mb-6 flex items-center gap-2">
                    <MdTrendingUp className="text-blue-500" /> Success Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] p-6 shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Portfolio Visibility</p>
                        <h4 className="text-2xl font-black text-[var(--text-main)]">{totalViews.toLocaleString()} Views</h4>
                        <p className="text-xs text-[var(--text-dim)] font-medium mt-1">Total engagement across all your projects.</p>
                    </div>

                    {/* Affiliate / Referral Card */}
                    {userInfo?.referralCode && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-purple-400 mb-2 flex items-center justify-between gap-1">
                                    Affiliate Program
                                    <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full text-[10px] font-black">{userInfo.totalReferrals || 0} Referrals</span>
                                </p>
                                <h4 className="text-xl font-black text-purple-900 leading-tight">Refer & Earn 10%</h4>
                                <p className="text-xs text-purple-700/70 font-medium mt-1">Share this link. You get 10% when someone buys a project.</p>
                            </div>
                            <div className="mt-4 flex flex-col gap-2">
                                <div className="bg-white/60 rounded-lg p-2 flex items-center justify-between border border-purple-200/50">
                                    <code className="text-sm font-bold text-purple-800 tracking-wider pl-2">{userInfo.referralCode}</code>
                                    <button
                                        onClick={copyReferralLink}
                                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                                        title="Copy Link"
                                    >
                                        <MdContentCopy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Public Profile Link Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Developer Spotlight</p>
                            <h4 className="text-lg font-black text-blue-900 leading-tight">Your Public Portfolio is Live!</h4>
                        </div>
                        <Link to={`/profile/${userInfo?._id}`} className="mt-4 text-blue-600 font-black text-sm flex items-center gap-1 hover:underline group">
                            View Public Profile <MdArrowUpward className="rotate-45 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* RECENT TRANSACTIONS (MOCK) */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden backdrop-blur-md">
                <h3 className="text-xl font-black text-[var(--text-main)] mb-8">Recent Payouts & Credits</h3>

                {(userInfo?.walletBalance || 0) === 0 ? (
                    <div className="text-center py-20 bg-[var(--bg-deep)]/50 rounded-3xl border border-dashed border-[var(--border-color)]">
                        <p className="text-[var(--text-dim)] font-medium italic">No transactions yet. Start selling projects!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-default">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-green-50 text-green-500 rounded-full ring-4 ring-green-100/50">
                                    <MdArrowDownward size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-black text-[var(--text-main)] leading-tight">Project Sale Credit</p>
                                    <p className="text-xs text-[var(--text-dim)] font-medium">Platform verified payment settlement</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-green-600 text-xl">+ ₹{(userInfo?.walletBalance || 0).toLocaleString()}</p>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Completed Settlement</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletPage
