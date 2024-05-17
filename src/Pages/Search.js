import axios from "axios";
import React, { useState, useEffect } from "react";
import { IoSearch, IoArrowBack } from "react-icons/io5";

import "./search.css";
import DisplayMedicine from "../Components/DisplayMedicine";

const Search = () => {
  const [medicineData, setMedicineData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayResults, setDisplayResults] = useState(false);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchText) {
        handleSearch();
      } else {
        setDisplayResults(false);
      }
    }, 1000); // Adjust the delay time as needed

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${searchText}&pharmacyIds=1,2,3`
      );
      const res = await response.json();
      setMedicineData(res.data.saltSuggestions);
      setLoading(false);
      setDisplayResults(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    setDisplayResults(false);
    setSearchText("");
  };

  return (
    <>
      <div className="container">
        <div className="search_container">
          {displayResults ? (
            <p className="search_icon" onClick={handleBack}>
              <IoArrowBack size={25} />
            </p>
          ) : (
            <p className="search_icon">
              <IoSearch size={25} />
            </p>
          )}
          <input
            type="text"
            placeholder="Type your medicine name here "
            className="input-box"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <p className="search-btn" onClick={handleSearch}>
            Search
          </p>
        </div>
      </div>
      <hr />
      {loading && <p className="text">Loading...</p>}
      {displayResults &&
        medicineData.length > 0 &&
        medicineData.map((data, index) => (
          <DisplayMedicine data={data} key={index} />
        ))}
      {!loading && searchText.length === 0 && (
        <p className="text">Find medicine with amazing discounts.</p>
      )}
    </>
  );
};

export default Search;
