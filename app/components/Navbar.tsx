"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaUser, FaBars, FaTimes, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { useWishlist } from "../context/WishlistContext";


type MenuItem = {
  name: string;
  link: string;
  subLinks?: (string | { name: string; subMenu?: string[] })[];
  customDropdownType?: "category" | "default";
};



const Navbar = () => {
  const { translate } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [translatedMenuItems, setTranslatedMenuItems] = useState<MenuItem[]>([]);
  const { openCart } = useCart();
  const { cartCount } = useCart();  // Get openCart function from context
  const { wishlist } = useWishlist();
  const router = useRouter();
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [expandedCategoryIndex, setExpandedCategoryIndex] = useState<number | null>(null);

  
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);






  // State for translations
  const [translatedTexts, setTranslatedTexts] = useState({
    login: '',
    specialOffer: '',
    aquaBite: '',
    shopNow: ''
  });

  const handleItemClick = () => {
    setIsSidebarOpen(false); // Close sidebar when a menu item is clicked
    setActiveDropdown(null);
  setActiveSubmenu(null);
  };

  const handleDropdownToggle = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };
   
  // Ensure this is defined at the top or inside the component where it's being used
const toSlug = (text: string): string => {
  const baseSlug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  // Add dash prefix only to specific ones
  const exceptions = ['vape pods', 'vape cartridges'];
  if (exceptions.includes(text.toLowerCase().trim())) {
    return `-${baseSlug}`;
  }

  return baseSlug;
};







const handleCategoryClick = (index: number) => {
  setExpandedCategoryIndex(prev => (prev === index ? null : index));
};


  useEffect(() => {
    const translateMenuItems = async () => {
      const items: MenuItem[] = [
        {
          name: await translate("ALL CATEGORY"),
          link: "/shop",
          customDropdownType: "category", // 👈 custom flag to identify special behavior
          subLinks: [
            { name: await translate("Flowers"), subMenu: [await translate("Hybrid"), await translate("Sativa"), await translate("Indica")] },
            { name: await translate("Seeds"), subMenu: [await translate("Autoflower Seeds"), await translate("Feminized Seeds"),await  translate("Regular Seeds")] },
            { name: await translate("Pre Rolls"), subMenu: [await translate("Hybrid Pre Rolls"), await translate("Sativa Pre Rolls"), await translate("Indica Pre Rolls")] },

            { name: await translate("Vapes"), subMenu: [await translate("Disposables  Vapes"), await translate("  Vape Cartridges"),  await translate(" Vape Pods")] },
           
            { name: await translate("Capsules"), subMenu: [await translate("CBD Capsules"), await translate("THC Capsules")] },
            
            { 
              name: await translate("Edibles"), 
              subMenu: [
                await translate("Edibles Gummies"), 
                await translate("Chocolates Edibles"),
                
                
              ] 
            },
            
            {
              name: await translate("Concentrates"),
              subMenu: [
                
                await translate("Moon Rock"),
                await translate("Live Resin"),
              
                await translate("Distillate"),
                
                await translate("Budder"),
                
                await translate("Crumble"),
                
              ]
            },
            {
              name: await translate("Shrooms"),
              subMenu: [
                
                await translate("Dried Mushrooms"),
                await translate("Chocolate Bars"),
                await translate("Gummies"),
                
                
              ]
            },
            
          
          ],

        },
        { name: await translate("ABOUT US"), link: "/about-us" },
        { name: await translate("SHOP"), link: "/shop" },
        { name: await translate("BLOG"), link: "/blog" },

        { name: await translate("SUPPORT"), link: "/support", subLinks: [await translate("FAQS"), await translate("Contact Us"),] },


      ];
      setTranslatedMenuItems(items);
    };

    // Translations for AquaBite, Login, and Special Offer
    const translateTexts = async () => {
      const aquaBite = await translate("16Zips");
      const login = await translate("Login");
      const shopNow = await translate("Shop Now");
      const specialOffer = await translate("Special Offer: Get 20% Off on All Orders! Limited Time Only.");

      setTranslatedTexts({ aquaBite, login, specialOffer, shopNow });
    };

    translateMenuItems();
    translateTexts(); // Call the function to translate texts
  }, [translate]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    // Define a list of known paths to handle directly
    const knownPaths = [
      "/privacy-policy",
      "/terms",
      "/support",
      "/about-us", 
      "/refund-policy",
      "/shipping-info",
      "/faqs",
       "/contact-us",
    ];

    try {
      // Check if the search query partially matches any known path
      const matchedPath = knownPaths.find((path) =>
        path.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

      if (matchedPath) {
        router.push(matchedPath); // Redirect to the matched path
        setSearchQuery(''); // Clear the search input after redirect

        return;
      }

      // Proceed with the search functionality for products or categories
      const res = await fetch(`/api/search?search=${encodeURIComponent(searchQuery.trim())}`);
      const { redirectTo } = await res.json();

      if (redirectTo) {
        router.push(redirectTo); // Redirect to the URL returned by the backend
        setSearchQuery(''); // Clear the search input after redirect

      } else {
        toast.error("No matching results found.");
        setSearchQuery(''); // Clear the search input after no results

      }
    } catch (error) {
      console.error("Error during search:", error);
      toast.error("Something went wrong. Please try again.");
      setSearchQuery(''); // Clear the search input after error

    }
  };
  





  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDropdownEnter = (index: number) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);  // Clear any existing timeout
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 350);  // Set delay (in ms) before the dropdown disappears
    setHoverTimeout(timeout);
  };

  

type Mode = "top" | "categoryList" | "supportList" | { subIndex: number };
const [mode, setMode] = useState<Mode>("top");

// Handlers
const openSupportList = () => setMode("supportList");
const goBack = () => {
  if (mode === "categoryList" || mode === "supportList") setMode("top");
  else setMode("categoryList");
};


  return (
    <div className="w-full fixed top-0 z-20 left-0">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Moving Text Bar */}
      <div className="absolute top-0 left-0 w-full bg-gray-100 h-10 overflow-hidden flex items-center justify-center">
        <p className="text-black text-sm font-semibold animate-marquee flex items-center gap-2">
          🎉 {translatedTexts.specialOffer}
          <Link href="/shop" className="text-blue-600 font-bold underline hover:text-blue-800 transition">
            {translatedTexts.shopNow} →
          </Link>
        </p>
      </div>

      {/* Secondary Navbar */}
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center h-20 mt-8">


        <div className="flex items-center space-x-4">
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-lg">
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
          <Link href="/" className="text-5xl font-bold hidden md:block mt-2">
            {translatedTexts.aquaBite}
          </Link>
          <Link href="/" className="md:hidden block w-full text-4xl font-bold text-center">
            {translatedTexts.aquaBite}
          </Link>
        </div>

        {/* Search Bar (Centered on Medium and Larger Devices) */}
        <div className="flex items-center w-1/2 bg-gray-50 rounded-full shadow-inner px-6 py-3 mx-auto mt-3 hidden md:flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-grow bg-transparent outline-none text-gray-800 text-lg"
          />
          <button onClick={handleSearch} className="flex-shrink-0 ml-3">
            <FaSearch className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="flex items-center space-x-2 ">
          <Link href="/wishlist" className="relative">
            <FaHeart className="text-2xl cursor-pointer text-black hover:text-red-700 mt-3" />

            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full mt-3">
              {wishlist.length}
            </span>

          </Link>
          <Link href="/profile">
            <FaUser className="text-2xl cursor-pointer hidden md:block mt-3" />
          </Link>
          {/* Shopping Cart Icon with Cart Count */}
          <div className="relative">
            <FaShoppingCart
              className="cursor-pointer hover:text-gray-400 text-2xl mt-3"
              onClick={openCart} // Open the cart drawer
            />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full mt-3">
              {cartCount}
            </span>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      {!isMobile && (
        <div className="bg-white shadow-md py-3 px-6">
          <div className="flex justify-start space-x-6 relative">
            {translatedMenuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(index)}  // Show dropdown
                onMouseLeave={handleDropdownLeave}  // Delay hiding the dropdown
              >
                <div
                  className="cursor-pointer uppercase mt-2 flex items-center gap-1 rounded-md transition"
                  onClick={() => item.subLinks && handleDropdownToggle(index)} // for click toggle
                >
                  <Link href={item.link}>{item.name}</Link>
                  {item.subLinks && (
                    activeDropdown === index ? (
                      <ChevronUp className="w-4 h-4 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mt-0.5" />
                    )
                  )}
                </div>


                {item.subLinks && activeDropdown === index && (
  <div className="absolute left-0 top-full mt-3 bg-white border border-gray-200 shadow-lg py-2 w-52 z-10">
    {Array.isArray(item.subLinks) && item.subLinks.map((sub, subIndex) => {
      const isSubWithMenu = typeof sub === "object" && Array.isArray(sub.subMenu);
      const label = typeof sub === "string" ? sub : sub.name;
      const submenu = isSubWithMenu ? sub.subMenu : [];

      return (
        <div key={subIndex} className="group relative">
          <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            {!isSubWithMenu ? (
              <Link
                href={`${item.link}/${toSlug(label)}`}
                passHref
                className="block w-full"
              >
                {label}
              </Link>
            ) : (
              <span>{label}</span>
            )}
            {isSubWithMenu && <span className="ml-2">&gt;</span>}
          </div>

          {isSubWithMenu && submenu && (
            <div className="absolute top-0 left-full bg-white border border-gray-200 shadow-lg w-44 ml-1 hidden group-hover:block z-20">
              {submenu.map((subItem, i) => (
                <Link
                  key={i}
                  href={`/shop?category=${toSlug(subItem)}`}
                  passHref
                  className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                >
                  {subItem}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}


                

              </div>
            ))}

            
          </div>
        </div>
      )}

      {/* Sidebar for mobile */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 z-30 bg-opacity-50">
          <div className="fixed inset-0 z-40 bg-white w-64">
            <div className="flex justify-end p-4">
              <button onClick={() => setIsSidebarOpen(false)}>
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="flex flex-col space-y-4 p-4">
              <div className="relative w-full mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full py-2 pl-4 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                />
                <button
                  onClick={() => {
                    handleSearch();  // Call search function
                    setIsSidebarOpen(false); // Close sidebar
                  }}
                  className="absolute right-0 top-0 h-full bg-gray-500 w-12 flex items-center justify-center rounded-r-md"
                >
                  <FaSearch className="text-white text-lg" />
                </button>

              </div>

             {/* === TOP LEVEL MENU === */}
{mode === "top" && (
  <div className="divide-y divide-gray-200">
    {translatedMenuItems.map((item, idx) => {
      const commonClasses = "w-full text-lg text-left py-3 px-2";

      // All Category
      if (item.customDropdownType === "category") {
        return (
          <button
            key={idx}
            onClick={() => setMode("categoryList")}
            className={`${commonClasses} flex justify-between items-center border-b border-gray-200`}
          >
            {item.name} <ChevronRight />
          </button>
        );
      }

      // Support
      if (item.link === "/support") {
        return (
          <button
            key={idx}
            onClick={() => setMode("supportList")}
            className={`${commonClasses} flex justify-between items-center border-b border-gray-200`}
          >
            {item.name} <ChevronRight />
          </button>
        );
      }

      // Plain links: About, Shop, Blog
      return (
        <Link
          key={idx}
          href={item.link}
          onClick={handleItemClick}
          className={`${commonClasses} block border-b border-gray-200`}
        >
          {item.name}
        </Link>
      );
    })}
  </div>
)}

{/* === SUPPORT SUB‑LINKS === */}
{mode === "supportList" && (
  <div className="p-4 bg-white h-full">
    <button
      onClick={goBack}
      className="mb-4 flex items-center gap-2 text-lg"
    >
      <FaTimes /> Back
    </button>
    <div className="divide-y divide-gray-200">
      {translatedMenuItems
        .find((it) => it.link === "/support")!
        .subLinks!.filter((s): s is string => typeof s === "string")
        .map((s, i) => (
          <Link
            key={i}
            href={`/support/${toSlug(s)}`}
            onClick={handleItemClick}
            className="block ml-4 py-2 border-b border-gray-200 hover:text-black"
          >
            {s}
          </Link>
        ))}
    </div>
  </div>
)}

{/* === MAIN CATEGORIES LIST === */}
{mode === "categoryList" && (
  <div className="p-4 bg-white h-full">
    <button
      onClick={goBack}
      className="mb-4 flex items-center gap-2 text-lg"
    >
      <FaTimes /> Back
    </button>
    <div className="divide-y divide-gray-200">
      {translatedMenuItems
        .find((it) => it.customDropdownType === "category")
        ?.subLinks?.map((cat: any, i: number) => (
          <button
            key={i}
            onClick={() => setMode({ subIndex: i })}
            className="flex justify-between items-center w-full py-2 px-2 text-lg border-b border-gray-200"
          >
            {cat.name} <ChevronRight />
          </button>
        ))}
    </div>
  </div>
)}

{/* === CATEGORY SUBMENU === */}
{typeof mode === "object" && (
  <div className="p-4 bg-white h-full">
    <button
      onClick={goBack}
      className="mb-4 flex items-center gap-2 text-lg"
    >
      <FaTimes /> Back
    </button>
    {(() => {
      const cat = (translatedMenuItems.find(
        (it) => it.customDropdownType === "category"
      )!.subLinks! as { name: string; subMenu: string[] }[])[
        mode.subIndex
      ];
      return (
        <>
          <h3 className="font-bold mb-2">{cat.name}</h3>
          <ul className="divide-y divide-gray-200">
            {cat.subMenu.map((sub, j) => (
              <li key={j} className="py-2">
                <Link
                  href={`/shop?category=${toSlug(sub)}`}
                  onClick={handleItemClick}
                  className="block"
                >
                  {sub}
                </Link>
              </li>
            ))}
          </ul>
        </>
      );
    })()}
  </div>
)}

<Link
  onClick={() => setIsSidebarOpen(false)}
  href="/profile"
  className="ml-3 text-lg  !text-black hover:!text-red-800"
>
  {translatedTexts.login}
</Link>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;