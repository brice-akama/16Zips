import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, Phone, MapPin, Menu, X, ChevronDown } from 'lucide-react';

import { FaHeart, FaUser } from 'react-icons/fa';
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";




const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { openCart, cartCount, totalPrice } = useCart();  // cart logic
const { wishlist } = useWishlist();         // wishlist logic
const [showMainHeader, setShowMainHeader] = useState(true);
const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownResults, setDropdownResults] = useState<{ products: any[]; blogs: any[] }>({
    products: [],
    blogs: [],
  });
const searchRef = useRef<HTMLDivElement>(null);
const mobileSearchRef = useRef<HTMLDivElement>(null);




  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

// Toggle function
const toggleCategory = (name: string) => {
  setOpenCategories(prev => ({
    ...prev,
    [name]: !prev[name],
  }));
};



  /**
   * 🔍 Live search while typing
   */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDropdownResults({ products: [], blogs: [] });
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?search=${encodeURIComponent(searchQuery.trim())}`);
        const { products, blogs } = await res.json();
        setDropdownResults({ products, blogs });
      } catch (error) {
        console.error("Dropdown search error:", error);
        setDropdownResults({ products: [], blogs: [] });
      }
    };

    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  /**
   * 🔎 Manual search (Enter key or button click)
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

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
      // check static routes
      const matchedPath = knownPaths.find((path) =>
        path.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

      if (matchedPath) {
        router.push(matchedPath);
      } else {
        const res = await fetch(`/api/search?search=${encodeURIComponent(searchQuery.trim())}`);
        const { products, blogs } = await res.json();

        if (products.length === 1 && blogs.length === 0) {
          router.push(`/products/${products[0].slug}`);
        } else if (products.length > 1 || blogs.length > 0) {
          router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        } else {
          toast.error("No matching results found.");
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSearchQuery("");
      setDropdownResults({ products: [], blogs: [] });
    }
  };




  const topNavItems = [
{ name: 'How To Order', href: '/how-to-order' },
  { name: 'Track Order', href: '/track-order' },
  { name: 'Refund Policy', href: '/refund-policy' },
  ];

  const productCategories = [
  { name: 'HOME', href: '/' },
  { name: 'SHOP', href: '/shop' },
  { name: 'ABOUT US', href: '/about-us' },
  { name: 'BLOG', href: '/blog' },
  { name: 'REVIEWS', href: '/reviews' },
  { 
    name: 'SUPPORT', 
    href: '/support', 
    subLinks: [
      { name: 'FAQS', href: '/support/faqs' },
      { name: 'Contact Us', href: '/support/contact-us' }
    ]
  },
];


  const cannabisCategories = [
  {
    name: "Flowers",
    subMenu: ["Hybrid", "Sativa", "Indica"]
  },
  {
    name: "Seeds",
    subMenu: ["Autoflower Seeds", "Feminized Seeds", "Regular Seeds"]
  },
  {
    name: "Pre Rolls",
    subMenu: ["Hybrid Pre Rolls", "Sativa Pre Rolls", "Indica Pre Rolls"]
  },
  {
    name: "Vapes",
    subMenu: ["Disposables Vapes", "Vape Cartridges", "Vape Pods"]
  },
  {
    name: "Capsules",
    subMenu: ["CBD Capsules", "THC Capsules"]
  },
  {
    name: "Edibles",
    subMenu: ["Edibles Gummies", "Chocolates Edibles"]
  },
  {
    name: "Concentrates",
    subMenu: ["Moon Rock", "Live Resin", "Distillate", "Budder", "Crumble"]
  },
  {
    name: "Shrooms",
    subMenu: ["Dried Mushrooms", "Chocolate Bars", "Gummies"]
  }
];

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node)
    ) {
      setIsMobileMenuOpen(false); // close mobile menu
      setOpenCategories({}); // close all open categories
    }

    // Only close dropdown if click is outside both desktop and mobile search areas
    const clickedInsideDesktopSearch = searchRef.current && searchRef.current.contains(event.target as Node);
    const clickedInsideMobileSearch = mobileSearchRef.current && mobileSearchRef.current.contains(event.target as Node);

    if (!clickedInsideDesktopSearch && !clickedInsideMobileSearch) {
      setDropdownResults({ products: [], blogs: [] }); // close search dropdown
    }
  }

  

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [mobileMenuRef]);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowMainHeader(false); // hide logo/search/top bar
    } else {
      setShowMainHeader(true); // show them back
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);



  return (
    <header className=" fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
      
     {/* Mobile Top Bar */}
  {showMainHeader && (
    <div className="lg:hidden bg-red-700 text-white py-2 text-center font-medium text-sm">
      Premium Cannabis Products – Safe, Fast & Discreet
    </div>
  )}


      {/* Desktop Top Navigation Bar - Hidden on mobile */}
    {/* Desktop Top Navigation Bar */}
  {showMainHeader && (
    <div className="hidden lg:block bg-red-700 text-white py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center text-sm">
          <div className="font-medium">
            Premium Cannabis Products – Safe, Fast & Discreet
          </div>
          <div className="flex items-center space-x-6">
            {topNavItems.map((item, index) => (
              <Link key={index} href={item.href} className="hover:text-red-200 transition-colors font-medium">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Mobile Header - Simple layout for phones */}
     <div className="lg:hidden bg-white shadow-sm ">


        <div className="flex items-center justify-between px-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-red-700"
          >
            <Menu size={20} />
            <span className="font-medium text-sm">MENU</span>
          </button>

          <div className="flex items-center h-20">
  <Link href="/">
    <Image
      src="/assets/nel.png"
      alt="logo"
      width={100}
      height={20}
      className="object-contain"
    />
  </Link>
</div>


          {/* Mobile Cart and Search */}
          <div className="flex items-center space-x-3">
            <button className="relative" onClick={openCart}>
  <ShoppingCart size={20} className="text-gray-700" />
  <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
    {cartCount}
  </span>
</button>

            <button
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Main Header Section - Hidden on mobile */}

      {showMainHeader && (
      <div className="hidden lg:block bg-white">

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* Desktop Logo Section */}
            <div className="flex items-center">
              <Link href="/">
  <Image
    src="/assets/nel.png"
    alt="logo"
    width={120} // adjust width
    height={4} // adjust height
    className="object-contain bg-transparent"
  />
</Link>

              
            </div>

            {/* Desktop Search Bar Section - Increased width */}
            <div  ref={searchRef} className="relative flex-1 max-w-2xl mx-8 ">
              <div className="relative flex">
                <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      placeholder="Search for products"
      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
    />
    
                <select className="px-4 py-3 border-t border-b border-gray-300 bg-gray-50 text-gray-700 focus:outline-none text-sm min-w-[160px] ">
  <option value="">SELECT CATEGORY</option>
  {cannabisCategories.map((category) =>
    category.subMenu.map((subItem, idx) => (
      <option key={`${category.name}-${idx}`} value={subItem.toLowerCase().replace(/\s/g, '-')}>
        {subItem}
      </option>
    ))
  )}
</select>

                <button
                 onClick={handleSearch}
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-r-md transition-colors">
                  <Search size={20} />
                </button>
              </div>
              {/* Dropdown Results */}
              {dropdownResults.products.length > 0 || dropdownResults.blogs.length > 0 ? (
                <div className="absolute bg-white border border-gray-300 mt-1 w-full max-w-2xl shadow-lg z-50">
                  {/* Clear button (X icon) */}
    {searchQuery && (
      <button
        onClick={() => {
          setSearchQuery("");
          setDropdownResults({ products: [], blogs: [] });
        }}
        className="absolute right-2 mt-2  text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    )}

                  {dropdownResults.products.length > 0 && (
                    <div className="p-4 border-b border-gray-200">
                      
                      <h4 className="font-semibold mb-2">Products</h4>
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {dropdownResults.products.map((product, index) => (
                          <li key={`${product.slug}-${index}`}>
                            <Link
                              href={`/products/${product.slug}`}
                              className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded"
                              onClick={() => {
                                setSearchQuery("");
                                setDropdownResults({ products: [], blogs: [] });
                              }}
                            >
                              
                              {product.mainImage ? (
      <Image
        src={product.mainImage}
        alt={product.name}
        width={40}
        height={40}
        className="object-cover rounded"
      />
    ) : null} {/* don't render Image if src is empty */}
    <span>{product.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dropdownResults.blogs.length > 0 && (
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">Blogs</h4>
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {dropdownResults.blogs.map((blog, index) => (
                          <li key={`blog-${blog.slug}-${index}`}>
                            <Link
                              href={`/blog/${blog.slug}`}
                              className="hover:bg-gray-50 p-2 rounded block text-sm font-medium"
                              onClick={() => {
                                setSearchQuery("");
                                setDropdownResults({ products: [], blogs: [] });
                              }}
                            >
                              {blog.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
            </div>

                  )}
                </div>
              ) : null}

            </div>
          {/* Desktop Cart and Price Section */}
<div className="flex items-center space-x-4">
{/* Cart */}
  <div className="flex items-center space-x-3">
    <button className="relative" onClick={openCart}>
      <ShoppingCart size={24} className="text-gray-700 cursor-pointer hover:text-red-700" />
      {/* Always show badge */}
      <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
        {cartCount}
      </span>
    </button>
    <span className="text-sm font-medium">
      ${totalPrice.toFixed(2)}
    </span>
  </div>

  {/* Wishlist */}
{/* Wishlist */}
<Link
  href="/wishlist"
  className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 transition-colors"
>
  <FaHeart className="text-xl text-gray-700 hover:text-red-700 transition-colors" />
  {/* Always show badge */}
  <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
    {wishlist.length}
  </span>
</Link>

  {/* Profile */}
  <Link
    href="/profile"
    className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors"
  >
    <FaUser className="text-xl text-gray-700 hover:text-red-700 transition-colors" />
  </Link>
</div>

          </div>
        </div>
      </div>
       )}

      {/* Desktop Product Categories Navigation - Hidden on mobile */}
      <nav className="hidden lg:block bg-white border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            
            {/* Browse by Cannabis Category Dropdown */}
{/* Browse by Cannabis Category Dropdown */}
<div
  className="relative"
  onMouseEnter={() => setActiveDropdown('cannabis')}
  onMouseLeave={() => setActiveDropdown(null)}
>
  <button
    className="bg-red-700 hover:bg-red-800 text-white px-6 py-4 flex items-center space-x-2 transition-colors"
  >
    <Menu size={18} />
    <span className="font-medium">ALL CATEGORY</span>
    <ChevronDown size={16} />
  </button>

  {activeDropdown === 'cannabis' && (
    <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-200 z-50 w-64">
      <div className="py-2">
        {cannabisCategories.map((category, index) => (
          <div key={index} className="group relative">
            <div
              className={`block px-4 py-2.5 text-gray-700 font-medium ${
                index < cannabisCategories.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              {category.name}
            </div>

            {category.subMenu && category.subMenu.length > 0 && (
              <div className="absolute top-0 left-full ml-0 hidden group-hover:block bg-white shadow-lg border border-gray-200 w-56">
                {category.subMenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={`/shop?category=${subItem.toLowerCase().replace(/\s/g, '-')}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                  >
                    {subItem}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )}
</div>


            {/* Desktop Product Categories */}
            <div className="flex items-center ml-0">
  {productCategories.map((category, index) => (
    <div key={index} className="relative group">
      {category.subLinks ? (
        <>
          <button className="px-6 py-4 text-gray-700 hover:text-red-700 hover:bg-gray-50 font-medium transition-colors flex items-center space-x-1">
            <span>{category.name}</span>
            <ChevronDown size={14} />
          </button>
          <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg border border-gray-200 w-44 z-50">
            {category.subLinks.map((sub, subIndex) => (
              <Link
                key={subIndex}
                href={sub.href}
                className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <Link
          href={category.href}
          className="px-6 py-4 text-gray-700 hover:text-red-700 hover:bg-gray-50 font-medium transition-colors"
        >
          {category.name}
        </Link>
      )}
    </div>
  ))}
</div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
  <div
  
  className="lg:hidden fixed inset-0 z-50  bg-opacity-50">

          <div 
          ref={mobileMenuRef}
          className="bg-white w-80 h-full overflow-y-auto">
            
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-4 bg-red-700 text-white">
              <h2 className="text-lg font-bold">MENU</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-red-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              
              {/* Mobile Search */}
{/* Mobile Search */}
<div className="mb-6 relative" ref={mobileSearchRef}>
  <div className="flex">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      placeholder="Search products..."
      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
    />
    <button
      onClick={handleSearch}
      className="bg-red-700 text-white px-4 py-2 rounded-r-md"
    >
      <Search size={18} />
    </button>
  </div>

  {/* ✅ Dropdown placed OUTSIDE the flex, but inside the relative container */}
  {(dropdownResults.products.length > 0 || dropdownResults.blogs.length > 0) && (
    <div className="absolute bg-white border border-gray-300 mt-1 w-full shadow-lg z-50 max-h-64 overflow-y-auto">
      {dropdownResults.products.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold mb-2">Products</h4>
          <ul className="space-y-2">
            {dropdownResults.products.map((product, index) => (
              <li key={`${product.slug}-${index}`}>
                <Link
                  href={`/products/${product.slug}`}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded"
                  onClick={() => {
                    setSearchQuery("");
                    setDropdownResults({ products: [], blogs: [] });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {product.mainImage ? (
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                  ) : null}
                  <span>{product.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {dropdownResults.blogs.length > 0 && (
        <div className="p-4">
          <h4 className="font-semibold mb-2">Blogs</h4>
          <ul className="space-y-2">
            {dropdownResults.blogs.map((blog, index) => (
              <li key={`blog-${blog.slug}-${index}`}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="hover:bg-gray-50 p-2 rounded block text-sm font-medium"
                  onClick={() => {
                    setSearchQuery("");
                    setDropdownResults({ products: [], blogs: [] });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )}
</div>

              
              {/* Mobile Product Categories */}
             <div className="border-b border-gray-200 pb-4 mb-4">
  <h3 className="font-semibold text-gray-800 mb-3">Products</h3>
  {cannabisCategories.map((category, idx) => (
    <div key={idx} 
      className={`py-2 ${idx < cannabisCategories.length - 1 ? 'border-b border-gray-200' : ''}`}
    >
      {/* Parent Category with toggle */}
      <button
        onClick={() => toggleCategory(category.name)}
        className="w-full flex justify-between items-center px-2 py-1 text-gray-700 font-medium hover:text-red-700 focus:outline-none"
      >
        <span>{category.name}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            openCategories[category.name] ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Submenu - only visible if open */}
      {/* Submenu - only visible if open */}
{openCategories[category.name] && (
  <div className="pl-4 mt-2">
    {category.subMenu.map((subItem, subIdx) => (
      <div
        key={subIdx}
        className={`py-1.5 ${subIdx < category.subMenu.length - 1 ? 'border-b border-gray-100' : ''}`}
      >
        <Link
          href={`/shop?category=${subItem.toLowerCase().replace(/\s/g, '-')}`}
          className="block px-2 text-gray-600 hover:text-red-700 font-medium"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {subItem}
        </Link>
      </div>
    ))}
  </div>
)}
    </div>
  ))}
</div>

{/* Main Site Navigation */}
<div className="border-b border-gray-200 pb-4 mb-4">
  <h3 className="font-semibold text-gray-800 mb-3">Navigation</h3>
  {productCategories.map((item, idx) => (
    <div
      key={idx}
      className={`py-1.5 ${idx < productCategories.length - 1 ? 'border-b border-gray-100' : ''}`}
    >
      {item.subLinks ? (
        <div>
          <button
            onClick={() => toggleCategory(item.name)}
            className="w-full flex justify-between items-center px-2 text-gray-700 font-medium hover:text-red-700"
          >
            <span>{item.name}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                openCategories[item.name] ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {openCategories[item.name] && (
            <div className="pl-4 mt-2 space-y-1">
              {item.subLinks.map((sub, subIdx) => (
                <Link
                  key={subIdx}
                  href={sub.href}
                  className="block py-1 px-2 text-gray-600 hover:text-red-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={item.href}
          className="block px-2 text-gray-700 font-medium hover:text-red-700"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.name}
        </Link>
      )}
    </div>
  ))}
</div>


              {/* Login / Register Section */}
<div className="border-b border-gray-200 pb-4 mb-4">
  <Link
    href="/profile"
    className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:text-red-700 font-medium"
    onClick={() => setIsMobileMenuOpen(false)}
  >
    <FaUser className="text-lg" />
    <span>Login / Register</span>
  </Link>
</div>
              
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


