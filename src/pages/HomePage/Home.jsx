import React from 'react';
import './Home.css';
import { Routes, Route,Navigate } from 'react-router-dom';
import Aside from "../../components/Aside/Aside"
import Loader from '../../components/Loader/Loader';
import About from '../../components/About/About';
import HomeContent from '../../components/HomeContent/HomeContent';
const Addimage =  React.lazy(()=>import('../../components/Addimage/Addimage')) ;
const Collection = React.lazy(()=>import('../../components/Collection/Collection')) ;
const Favorites = React.lazy(()=>import('../../components/Favorites/Favorites')) ;
const DisplayImage = React.lazy(()=>import('../../components/DisplayImage/DisplayImage')) ;
const DisplaySearch = React.lazy(()=>import('../../components/DisplaySearch/DisplaySearch')) ;
const Chats = React.lazy(()=>import('../Chats/Chats')) ;
const Signup = React.lazy(()=>import('../Signup/Signup')) ;

export default function Home() {

  const authUser = localStorage.getItem("auth-token")

  return (
    <div className='homepage'>
      <Aside />
      <div className='homeComponents'>
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/addimage" element={authUser ? <React.Suspense fallback={<Loader/>}><Addimage /></React.Suspense>  : <Navigate to="/signup"/>} />
          <Route path="/collections" element={authUser ? <React.Suspense fallback={<Loader/>}><Collection /></React.Suspense>: <Navigate to="/signup"/>}/>
          <Route path="/favorites" element={authUser ? <React.Suspense fallback={<Loader/>}><Favorites /></React.Suspense> : <Navigate to="/signup"/>} />
          <Route path="/displaysearch" element={authUser ? <React.Suspense fallback={<Loader/>}><DisplaySearch /></React.Suspense> : <Navigate to="/signup"/>} />
          <Route path="/about" element={<About />} />
          <Route path="/image/:imageId" element={authUser ? <React.Suspense fallback={<Loader/>}><DisplayImage /></React.Suspense> : <Navigate to="/signup"/>} />
          <Route path="/chats" element={authUser ? <React.Suspense fallback={<Loader/>}><Chats /></React.Suspense> : <Navigate to="/signup"/>} />
          <Route path="/signup" element={<React.Suspense fallback={<Loader/>}><Signup /></React.Suspense>}></Route>
          <Route path="*" element={<HomeContent/>}></Route>
        </Routes>
      </div>
    </div>
  );
}
