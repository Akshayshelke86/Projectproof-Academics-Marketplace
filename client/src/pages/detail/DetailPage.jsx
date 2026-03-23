import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../../services/projects/ProjectDetailSlice";
import { MdBolt, MdVerified, MdFlag, MdShare, MdStar, MdStarBorder } from "react-icons/md";
import { FaWhatsapp, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import toast from "react-hot-toast";

import axios from "axios";
import { MdPlayCircle, MdCollections } from "react-icons/md";

const DetailPage = () => {
  const tags = ["React", "Three.js", "3D"];
  const { id } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const projectDetail = useSelector((state) => state.projectDetail);
  const { projectInfo, loading, error } = projectDetail;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(getProjectById(id));

    // Capture Affiliate Code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam) {
      localStorage.setItem('affiliateCode', refParam);
    }
  }, [id, dispatch]);

  // Mock Payment State
  const [showMockModal, setShowMockModal] = React.useState(false);
  const [mockOrderData, setMockOrderData] = React.useState(null);

  // Review State
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);

  const shareUrl = window.location.href;
  const shareText = `Check out this amazing project: ${projectInfo?.title} on ProjectProof!`;

  const checkoutHandler = async () => {
    if (!userInfo) {
      navigate('/login?redirect=/detail/' + id);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      // 1. Create Order on Backend
      const { data: orderData } = await axios.post(
        '/api/payment/create-order',
        { amount: projectInfo.price },
        config
      )

      // If Mock Order (starts with order_mock_)
      if (orderData.id.startsWith('order_mock_')) {
        setMockOrderData(orderData);
        setShowMockModal(true);
        return;
      }

      // 2. Open Razorpay Checkout (Real)
      const { data: sdkKey } = await axios.get('/api/config/razorpay');

      const options = {
        key: sdkKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ProjectProof",
        description: `Purchase ${projectInfo.title}`,
        order_id: orderData.id,
        handler: async function (response) {
          verifyPaymentHandler(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      let msg = err.response?.data?.message || err.message;
      if (msg.toLowerCase().includes('card') || msg.toLowerCase().includes('international')) {
        msg += "\n\n💡 TIP: For Test Mode, try using 'Netbanking' -> 'HDFC Bank' -> 'Success' instead of Card.";
      }
      toast.error(msg);
    }
  }

  const verifyPaymentHandler = async (orderId, paymentId, signature) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      // 1. Verify Payment Signature
      const { data: verifyData } = await axios.post(
        '/api/payment/verify',
        {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          order_id: id
        },
        config
      )

      const affiliateCode = localStorage.getItem('affiliateCode');

      const orderPayload = {
        orderItems: [{
          name: projectInfo.title,
          image: projectInfo.image,
          price: projectInfo.price,
          project: projectInfo._id
        }],
        paymentMethod: "Razorpay",
        itemsPrice: projectInfo.price,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: projectInfo.price,
        paymentResult: verifyData.paymentResult,
        affiliateCode: affiliateCode // Pass to backend
      };

      await axios.post('/api/orders', orderPayload, config);

      if (affiliateCode) {
        localStorage.removeItem('affiliateCode'); // Clear it after use
      }

      toast.success("Payment Successful! Order Placed.");
      navigate('/orders');
    } catch (err) {
      console.error(err);
      toast.error("Order Creation Failed: " + (err.response?.data?.message || err.message));
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please login to submit a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      setSubmittingReview(true);
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`/api/projects/${id}/reviews`, { rating, comment }, config);
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment('');
      dispatch(getProjectById(id)); // Refresh project data
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(projectInfo?.videoLink);

  const MockPaymentModal = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative animate-bounce-in">
        <h3 className="text-xl font-black mb-4 flex items-center justify-center gap-2">
          <MdBolt className="text-blue-500" /> Secure Checkout
        </h3>
        <p className="text-gray-500 text-sm mb-6">Test Environment (No Real Money Deducted)</p>

        <div className="bg-gray-100 p-4 rounded-xl mb-6">
          <p className="text-sm font-bold text-gray-700">Amount to Pay</p>
          <p className="text-3xl font-black text-blue-600">₹{projectInfo.price}</p>
        </div>

        {/* QR Code Placeholder */}
        <div className="mb-6 flex justify-center">
          <div className="w-32 h-32 bg-white border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center">
            <span className="text-xs font-bold text-blue-300">SCAN QR</span>
          </div>
        </div>

        <button
          onClick={() => {
            setShowMockModal(false);
            verifyPaymentHandler(mockOrderData.id, "pay_mock_" + Date.now(), "mock_signature");
          }}
          className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 transition-transform active:scale-95"
        >
          Simulate Success Payment
        </button>
        <button
          onClick={() => setShowMockModal(false)}
          className="mt-3 text-sm text-gray-400 font-bold hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {projectInfo && (
        <Helmet>
          <title>{projectInfo.title} | ProjectProof</title>
          <meta name="description" content={projectInfo.description?.substring(0, 160)} />
          <meta property="og:title" content={projectInfo.title} />
          <meta property="og:description" content={projectInfo.description?.substring(0, 160)} />
          <meta property="og:image" content={projectInfo.image} />
          <meta property="og:url" content={shareUrl} />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
      )}
      <h2 className="truncate text-3xl font-bold mb-8">
        {projectInfo.title}
      </h2>
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="mb-6 w-full">
          <img
            src={projectInfo.image}
            alt="project"
            className="w-full rounded-md"
          />
        </div>
        <div className="w-full">
          <p>
            Category: <span className="font-semibold">{projectInfo.category}</span>
          </p>
          <p className=" mt-3">
            Ratings: <span className="font-semibold">{projectInfo.rating}/5.0</span>
          </p>
          <div className="flex  items-center mt-4 gap-2">
            <p>Tech Stack:</p>
            {projectInfo?.techStack?.split(',')?.map((tag) => (
              <p className=" bg-blue-100 px-2 rounded-md">{tag}</p>
            ))}
          </div>

          {/* ProjectProof Verification Badge */}
          <div className="flex items-center mt-4 gap-4">
            {projectInfo.status === 'published' && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-400">Verified Project</span>
            )}
            {projectInfo.originalityScore > 0 && (
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-purple-400">Originality: {projectInfo.originalityScore}%</span>
            )}
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-gray-400">Status: {projectInfo.status || 'Draft'}</span>
          </div>

          <div className="flex items-center justify-between  gap-20 mt-4 bg-blue-50 p-4 rounded-md">
            <div>
              <p>
                Price: <span className="font-semibold ">₹{projectInfo.price}</span>
              </p>
            </div>
            <div className="flex gap-3">
              {projectInfo.demoLink && (
                <a
                  href={projectInfo.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 shadow-md flex items-center gap-1"
                >
                  <MdBolt /> Live Demo
                </a>
              )}
              <button
                onClick={checkoutHandler}
                className="bg-primary text-white px-6 py-2 rounded-md font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 shadow-md"
              >
                Buy Project
              </button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="mt-6">
            <p className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1"><MdShare /> Share this project (Earn 10% via Affiliate!)</p>
            <div className="flex gap-3">
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noreferrer" className="bg-green-500 p-2 rounded-full text-white hover:bg-green-600 transition">
                <FaWhatsapp size={20} />
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="bg-blue-400 p-2 rounded-full text-white hover:bg-blue-500 transition">
                <FaTwitter size={20} />
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="bg-blue-700 p-2 rounded-full text-white hover:bg-blue-800 transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Report Project Section */}
          {userInfo && userInfo._id !== projectInfo.user?._id && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={async () => {
                  const reason = window.prompt("Why are you reporting this project? (Options: Code not working, Fake Project, Virus/Malware)");
                  if (reason) {
                    try {
                      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                      await axios.post(`/api/projects/${id}/report`, { reason }, config);
                      toast.success("Project reported successfully. Admins will review it.");
                    } catch (err) {
                      toast.error("Error reporting project");
                    }
                  }
                }}
                className="text-red-400 text-xs font-bold flex items-center gap-1 hover:text-red-600 transition"
              >
                <MdFlag /> Report Project
              </button>
            </div>
          )}

          {/* Verification Details - Restricted Section */}
          {(userInfo?.isAdmin || userInfo?.role === 'admin' || userInfo?.role === 'guide' || (userInfo?._id === projectInfo.user?._id)) && (
            <div className="mt-8 p-6 bg-white border-2 border-dashed border-gray-100 rounded-2xl">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MdVerified className="text-primary" /> Security & Originality Report
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Originality Score:</span>
                  <span className={`font-black ${projectInfo.originalityScore > 70 ? 'text-green-600' : 'text-red-500'}`}>{projectInfo.originalityScore}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Hashed Fingerprint:</span>
                  <span className="text-[10px] font-mono bg-gray-100 p-1 rounded truncate max-w-[200px]">{projectInfo.watermarkHash || 'N/A'}</span>
                </div>
                {projectInfo.adminComments && (
                  <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 border border-gray-100 italic">
                    <b>Reviewer Feedback:</b> {projectInfo.adminComments}
                  </div>
                )}
                {projectInfo.diffReportPath && (
                  <a
                    href={`/api/projects/report/${projectInfo._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center bg-gray-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-black transition"
                  >
                    Download Full Diff Analysis (PDF)
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {projectInfo.videoLink && (
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MdPlayCircle className="text-red-500" /> Project Demo Video
          </h3>
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Project Demo"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-6 text-center">
                <MdPlayCircle size={60} className="mb-4 opacity-50" />
                <p className="mb-4 font-medium">Video Link: <a href={projectInfo.videoLink} target="_blank" rel="noreferrer" className="underline text-blue-400">{projectInfo.videoLink}</a></p>
                <p className="text-sm opacity-60 italic">Please click the link above if the video does not embed automatically.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {projectInfo.screenshots && projectInfo.screenshots.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MdCollections className="text-blue-500" /> Project Screenshots
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectInfo.screenshots.map((s, i) => (
              <a key={i} href={s} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-2xl border border-gray-100 shadow-lg transition-all hover:-translate-y-2">
                <img src={s} alt={`Screenshot ${i + 1}`} className="w-full h-48 object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-sm">View Full Image</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <hr className="my-10 border-gray-100" />
      <div>
        <h3 className="text-xl font-bold mb-4">Project Description:</h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{projectInfo.description}</p>
      </div>
      <hr className="my-5" />
      <div>
        <h3 className=" font-semibold mb-2">Features:</h3>
        <ul>
          {projectInfo?.features?.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-1">
              <MdBolt />
              <li>{feature}</li>
            </div>
          ))}
        </ul>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* Ratings and Reviews Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><MdStar className="text-yellow-400" /> Reviews & Ratings</h3>

        {/* Review Form */}
        {userInfo ? (
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
            <h4 className="font-bold text-lg mb-4">Write a Customer Review</h4>
            <form onSubmit={submitReviewHandler}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="focus:outline-none"
                      onClick={() => setRating(star)}
                    >
                      {star <= rating ? (
                        <MdStar size={30} className="text-yellow-400" />
                      ) : (
                        <MdStarBorder size={30} className="text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded-xl mb-8 border border-blue-100 text-blue-800">
            Please <Link to={`/login?redirect=/detail/${id}`} className="font-bold underline">login</Link> to write a review.
          </div>
        )}

        {/* Reviews List */}
        <div>
          {projectInfo?.reviews?.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review this project!</p>
          ) : (
            <div className="space-y-4">
              {projectInfo?.reviews?.map((review) => (
                <div key={review._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{review.name}</span>
                    <span className="text-xs text-gray-400">{review.createdAt?.substring(0, 10)}</span>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      i < review.rating ? <MdStar key={i} className="text-yellow-400" /> : <MdStarBorder key={i} className="text-gray-300" />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showMockModal && <MockPaymentModal />}
    </div >
  );
};

export default DetailPage;
