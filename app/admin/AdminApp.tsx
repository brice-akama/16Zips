'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';


import { Admin, Resource } from "react-admin";
import customDataProvider from "../../lib/dataProvider"; // Go back two levels to access the lib folder



import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Import your custom layout

import ProductList from "./ProductList";
import { ProductEdit } from "./ProductEdit";
import { ProductCreate } from "./ProductCreate";
import CustomLogin from "./CustomLogin";
import { authProvider } from "./authProvider";
import CustomLayout from "./CustomLayout";
import { ProductShow } from "./ProductShow";
import BlogPostCreate from "./BlogPostCreate"; // Import the create page
import BlogPostList from "./BlogPostList"; // Blog posts
import BlogPostEdit from './BlogPostEdit';
import BlogPostShow from './BlogPostShow';
import ArticleIcon from '@mui/icons-material/Article'
import CategoryIcon from "@mui/icons-material/Category"; // or any icon you like
import CategoryList from "./CategoryList";
import CategoryEdit from "./CategoryEdit";
import CategoryCreate from "./CategoryCreate";
import CategoryShow from "./CategoryShow";
import ReviewShow from "./ReviewShow";
import ReviewCreate from "./ReviewCreate";
import ReviewEdit from "./ReviewEdit";
import ReviewList from "./ReviewList";
import RateReviewIcon from "@mui/icons-material/RateReview";
import OrderList from './OrderList';
import OrderShow from './OrderShow';
import SettingsEdit from './SettingsEdit';
import SettingsList from './SettingsList';
import SettingsCreate from './SettingsCreate';
import { UserList } from "./UserList";
import UserCartIcon from "@mui/icons-material/AccountCircle"; // or any icon you like
import SettingCartIcon from "@mui/icons-material/Settings"; // or any icon you like
import OrderIcon from "@mui/icons-material/ShoppingBasket"; // or any icon you like
import Dashboard from "./Dashboard";
import AnalyticsDashboard from "./AnalyticsDashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics"; // or any icon you like



const AdminPage = () => {
  

  

  return (
    <Admin  authProvider={authProvider} loginPage={CustomLogin}  dashboard={Dashboard} dataProvider={customDataProvider} layout={CustomLayout}>
      
      <Resource name="blog" list={BlogPostList} show={BlogPostShow} edit={BlogPostEdit} create={BlogPostCreate} icon={() => <ArticleIcon sx={{ color: "red" }} />} />
    
      <Resource 
        name="products" 
        list={ProductList} 
        edit={ProductEdit} 
        create={ProductCreate} 
        show={ProductShow}
        icon={() => <ShoppingCartIcon sx={{ color: "green" }} />} 
      />
   <Resource
    name="category"
    list={CategoryList}
    edit={CategoryEdit}
    create={CategoryCreate}
    show={CategoryShow}
    icon={() => <CategoryIcon sx={{ color: "teal" }} />}
  />

  
<Resource 
        name="review" 
        list={ReviewList} 
        edit={ReviewEdit} 
        create={ReviewCreate}  
        show={ReviewShow}
        icon={() => <RateReviewIcon sx={{ color: "purple" }} />} 
      />

      <Resource 
        name="orders" 
        list={OrderList} 
        show={OrderShow} 
        icon={() => <OrderIcon sx={{ color: "blue" }} />}
      />
      <Resource 
        name="settings" 
        list={SettingsList} 
        edit={SettingsEdit} 
        create={SettingsCreate} 
        icon={() => <SettingCartIcon sx={{ color: "blue" }} />}
      />

      <Resource 
        name="users" 
        list={UserList} 
        icon={() => <UserCartIcon sx={{ color: "orange" }} />}
        />
      <Resource
        name="analytics"
        list={AnalyticsDashboard}
        icon={() => <AnalyticsIcon sx={{ color: "green" }} />}
      />
       
    </Admin>
  );
};

export default AdminPage;