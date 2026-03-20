import {
  MdOutlineLibraryBooks,
  MdOutlineDashboard,
  MdOutlineListAlt,
  MdOutlineWallet,
  MdOutlineHome,
  MdFavorite
} from "react-icons/md";

export const sidebarConstant = [
  {
    path: "/",
    name: "Home",
    icon: MdOutlineHome
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: MdOutlineDashboard
  },
  {
    path: "/orders",
    name: "Orders",
    icon: MdOutlineListAlt
  },
  {
    path: "/projects",
    name: "Projects",
    icon: MdOutlineLibraryBooks
  },
  {
    path: "/marketplace",
    name: "Marketplace",
    icon: MdOutlineLibraryBooks // Reusing for now
  },
  {
    path: "/submit-project",
    name: "Submit Project",
    icon: MdOutlineListAlt // Placeholder, maybe plus icon?
  },
  {
    path: "/wallet",
    name: "My Wallet",
    icon: MdOutlineWallet
  },
  {
    path: "/wishlist",
    name: "My Wishlist",
    icon: MdFavorite
  },
];
