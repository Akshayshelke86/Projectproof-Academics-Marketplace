import sendEmail from "../utils/sendEmail.js";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";

// @desc Create new order
// @route POST /api/orders
// @access Private

export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    affiliateCode,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user._id,
      paymentResult: { id: "mock_" + Date.now(), status: "success", email_Address: req.user.email },
      isPaid: true,
      paidAt: Date.now()
    });

    let affiliateUser = null;
    if (affiliateCode) {
      affiliateUser = await User.findOne({ referralCode: affiliateCode });
      if (affiliateUser) {
        order.affiliateUser = affiliateUser._id;
      }
    }

    const createdOrder = await order.save()

    // --- WALLET PAYOUT LOGIC ---
    // Distribute earnings to sellers
    for (const item of orderItems) {
      // item.project is the Project ID
      const project = await Project.findById(item.project);
      if (project && project.user) {
        // Find Seller
        const seller = await User.findById(project.user);
        if (seller) {
          const amount = item.price;
          let platformFee = amount * 0.10; // 10% Commission by default
          let sellerInfo = amount - platformFee;
          let affiliateEarnings = 0;

          // If Affiliate exists, give them 10% from the Seller's share
          if (affiliateUser) {
            affiliateEarnings = amount * 0.10;
            sellerInfo = sellerInfo - affiliateEarnings; // Seller gets 80%

            // Credit Affiliate Wallet
            affiliateUser.walletBalance = (affiliateUser.walletBalance || 0) + affiliateEarnings;
            affiliateUser.totalEarnings = (affiliateUser.totalEarnings || 0) + affiliateEarnings;
            await affiliateUser.save();
            console.log(`[WALLET] Credited ₹${affiliateEarnings} to Affiliate ${affiliateUser.name}`);
          }

          // Credit Seller Wallet
          seller.walletBalance = (seller.walletBalance || 0) + sellerInfo;
          seller.totalEarnings = (seller.totalEarnings || 0) + sellerInfo;
          await seller.save();

          console.log(`[WALLET] Credited ₹${sellerInfo} to Seller ${seller.name} (Project: ${project.title})`);
        }
      }
    }
    // ---------------------------

    // --- EMAIL NOTIFICATION LOGIC ---
    try {
      // 1. Email to Buyer
      const buyerHtml = `
            <h2>Thank you for your purchase, ${req.user.name}!</h2>
            <p>Your order for <b>${orderItems[0].name}</b> has been confirmed.</p>
            <p>Amount Paid: ₹${totalPrice}</p>
            <br>
            <h3>Download Your Project:</h3>
            <p>Please visit your <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/orders">Order History</a> to download the source code.</p>
            <br>
            <p>Happy Coding!</p>
            <p>Team ProjectProof</p>
        `;
      await sendEmail({ to: req.user.email, subject: "Order Confirmation - ProjectProof", html: buyerHtml });

      // 2. Email to Seller(s)
      for (const item of orderItems) {
        const project = await Project.findById(item.project);
        if (project) {
          const seller = await User.findById(project.user);
          if (seller) {
            const sellerHtml = `
                        <h2>Cha-Ching! You made a sale! 💰</h2>
                        <p>Your project <b>${project.title}</b> was just purchased by ${req.user.name}.</p>
                        <p>Earnings Credited: ₹${(item.price * 0.9).toFixed(2)} (after 10% platform fee)</p>
                        <br>
                        <p>Keep up the great work!</p>
                        <p>Team ProjectProof</p>
                    `;
            await sendEmail({ to: seller.email, subject: `New Sale Alert: ${project.title}`, html: sellerHtml });
          }
        }
      }
    } catch (emailError) {
      console.error("Email Notification Error:", emailError);
      // Don't block the response even if email fails
    }
    // -------------------------------

    res.status(201).json(createdOrder)
  }
});

// @desc Get order details
// @route GET /api/orders/:id
// @access Private

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", 'name email')
  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error("Order Not Found!!")
  }
});

// @desc   Get logged in user orders
// @route  GET /api/orders/myorders
// @access Private

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
});




