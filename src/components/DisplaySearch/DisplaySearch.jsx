import React, { useContext, useEffect, useState } from 'react';
import "./DisplaySearch.css";
import ImageCard from '../ImageCard/ImageCard';
import search_icon from '../../components/assets/search.png'
import shopContext from '../../Context/ShopContext';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader'

export default function DisplaySearch() {

  const { formatDate, all_images, HOST,imageData } = useContext(shopContext); // Getting functions from context api

  const [searchData, setSearchData] = useState([]);    // To manage search data
  const [searchValue, setSearchValue] = useState(''); // To handle onChange
  const [loading,setLoading] = useState(false)
  
  const handleSearchClick = async () => {
    if (!searchValue || isNaN(Date.parse(searchValue))) {           // Checks if input is string then show error
      toast.error("Please enter a valid date in the format yyyy-mm-dd");
      return;
    }
    try {
      setLoading(true)
      let response = await fetch(`${HOST}/api/image/searchbydate/${searchValue}`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token")
        }
      });
      let data = await response.json();  
      setSearchData(data);                                      // Set data to searchData state
      setLoading(false)

    } catch (error) {
      console.error("Internal Server Error");
    }
  };
  
  const handleOnChange = (e) => {                                 // To handle input field
    setSearchValue(e.target.value);
  };

  useEffect(() => { 
    if(imageData){
      all_images();
    }                       
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    handleSearchClick();
  };

  return (
    <div className="DisplaySearch_container">
      {/* serach bar */}
      <form onSubmit={handleSubmit}>
        <div className='searchBar'>
          <input className="input input-bordered rounded-full mr-2" required onChange={handleOnChange} value={searchValue} type="search" placeholder="yyyy-mm-dd" aria-label="Search"/>
          <button className="p-2  searchButton rounded-full   " type="submit" ><img src={search_icon} className='w-8 h-10  ' alt="" /></button>
        </div>
      </form>

      {/* search API mapped here to get search result */}
        {loading? <Loader/> : <div className='searches'>
         { searchData.length===0 && <p style={{fontSize:"20px"}}>Search image here</p>}   {/*if no data then show  */}
         { !Array.isArray(searchData) && <p style={{fontSize:"20px"}}>No images found</p>}   {/*if no data then show  */}
            {Array.isArray(searchData) && searchData.map((data)=>{              
              return <ImageCard key={data.id} id={data._id} favorite={data.favorite} date={formatDate(data.date)} source={data.image} />
            })}
        </div>}

    </div>
  );
}
