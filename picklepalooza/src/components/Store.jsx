import React, { useState, useEffect } from "react";
import "../styles/Store.css";
import Item from "../utilities/Item";
import { Link } from "react-router-dom";
import { Oval } from 'react-loader-spinner';
function Store() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(999);
  const [weightRange, setWeightRange] = useState([0, Infinity]);
  const [selectedPickleType, setSelectedPickleType] = useState("");
  const [selectedPickleMethod, setSelectedPickleMethod] = useState("");
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState("");
  const [selectedCulturalVariety, setSelectedCulturalVariety] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://mernpickle-backend.onrender.com/product/list");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
        setFilteredProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }finally {
        
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const openFilterContainer = () => {
    setFilterVisible(true);
  };

  const closeFilterContainer = () => {
    setFilterVisible(false);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    filterProducts(searchTerm, [minPrice, maxPrice], weightRange, selectedPickleType, selectedPickleMethod, selectedSpiceLevel, selectedCulturalVariety);
  };

  const filterProducts = (term, priceRange, weightRange, pickleType, pickleMethod, spiceLevel, culturalVariety) => {
    let filteredProducts = products.filter((product) => product.name.toLowerCase().includes(term.toLowerCase()));
    
    filteredProducts = filteredProducts.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

    filteredProducts = filteredProducts.filter((product) => product.weight >= weightRange[0] && product.weight <= weightRange[1]);

    if (pickleType && pickleType !== "none") {
      filteredProducts = filteredProducts.filter((product) => product.pickleType === pickleType);
    }

    if (pickleMethod && pickleMethod !== "none") {
      filteredProducts = filteredProducts.filter((product) => product.pickleMethod === pickleMethod);
    }

    if (spiceLevel && spiceLevel !== "none") {
      filteredProducts = filteredProducts.filter((product) => product.spiceLevel === spiceLevel);
    }

    if (culturalVariety && culturalVariety !== "none") {
      filteredProducts = filteredProducts.filter((product) => product.culturalVarieties === culturalVariety);
    }

    setFilteredProducts(filteredProducts);
  };

  const handleMinPriceChange = (event) => {
    const value = Number(event.target.value);
    setMinPrice(value);
    filterProducts(searchTerm, [value, maxPrice], weightRange, selectedPickleType, selectedPickleMethod, selectedSpiceLevel, selectedCulturalVariety);
  
  };

  const handleWeightRangeChange = (event) => {
    const selectedOption = event.target.value;
    let newWeightRange = [0, Infinity];

    switch (selectedOption) {
      case "all":
        newWeightRange = [0, Infinity];
        break;
      case "under100g":
        newWeightRange = [0, 100];
        break;
      case "100to500g":
        newWeightRange = [100, 500];
        break;
      case "500gto1kg":
        newWeightRange = [500, 1000];
        break;
      default:
        break;
    }

    setWeightRange(newWeightRange);
    filterProducts(searchTerm, [minPrice, maxPrice], newWeightRange, selectedPickleType, selectedPickleMethod, selectedSpiceLevel, selectedCulturalVariety);
    closeFilterContainer();
  };

  const handlePickleTypeChange = (event) => {
    setSelectedPickleType(event.target.value);
    filterProducts(searchTerm, [minPrice, maxPrice], weightRange, event.target.value, selectedPickleMethod, selectedSpiceLevel, selectedCulturalVariety);
    closeFilterContainer();
  };

  const handlePickleMethodChange = (event) => {
    setSelectedPickleMethod(event.target.value);
    filterProducts(searchTerm, [minPrice, maxPrice], weightRange, selectedPickleType, event.target.value, selectedSpiceLevel, selectedCulturalVariety);
    closeFilterContainer();
  };

  const handleSpiceLevelChange = (event) => {
    setSelectedSpiceLevel(event.target.value);
    filterProducts(searchTerm, [minPrice, maxPrice], weightRange, selectedPickleType, selectedPickleMethod, event.target.value, selectedCulturalVariety);
    closeFilterContainer();
  };

  const handleCulturalVarietyChange = (event) => {
    setSelectedCulturalVariety(event.target.value);
    filterProducts(searchTerm, [minPrice, maxPrice], weightRange, selectedPickleType, selectedPickleMethod, selectedSpiceLevel, event.target.value);
    closeFilterContainer();
  };

  return (
    <div className="storecontainer">
      <div className="search-bar-store">
        <input className="search-input-store" type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
      </div>
      <div className="productstorecontainer">
        {filterVisible && <div className="overlay" onClick={closeFilterContainer}></div>}
        <div className={`filtercontainer ${filterVisible ? "visible" : ""}`}>
          <div className="titlefilter">
            <h1>Types of Pickle</h1>
          </div>
          <div className="productcategory">
            <select className="filtertxt" value={selectedPickleType} onChange={handlePickleTypeChange}>
              <option value="none">None</option>
              <option value="mango">Mango Pickle</option>
              <option value="lemon">Lemon Pickle</option>
              <option value="mixed_vegetable">Mixed Vegetable Pickle</option>
              <option value="chutney">Chutneys</option>
            </select>
          </div>
          <div className="titlefilter">
            <h1>Pickling Method</h1>
          </div>
          <div className="productcategory">
            <select className="filtertxt" value={selectedPickleMethod} onChange={handlePickleMethodChange}>
              <option value="none">None</option>
              <option value="fermented">Fermented Pickles</option>
              <option value="quick">Quick Pickles</option>
            </select>
          </div>
          <div className="titlefilter">
            <h1>Spice Level</h1>
          </div>
          <div className="productcategory">
            <select className="filtertxt" value={selectedSpiceLevel} onChange={handleSpiceLevelChange}>
              <option value="none">None</option>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="spicy">Spicy</option>
              <option value="extra_spicy">Extra Spicy</option>
            </select>
          </div>
          <div className="titlefilter">
            <h1>Cultural Varieties</h1>
          </div>
          <div className="productcategory">
            <select className="filtertxt" value={selectedCulturalVariety} onChange={handleCulturalVarietyChange}>
              <option value="none">None</option>
              <option value="korean_kimchi">Korean Kimchi</option>
              <option value="japanese_tsukemono">Japanese Tsukemono</option>
              <option value="indian_achar">Indian Achar</option>
              <option value="american_pickles">American Pickles</option>
            </select>
          </div>
          <div className="titlefilter">
            <h1>Price</h1>
          </div>
          <div className="productprice">
            <label className="filtertxt">
              Price:
              <input className="radioweight" type="range" min="0" max="999" step="1" value={minPrice} onChange={handleMinPriceChange} />
              <span>{minPrice}</span>
            </label>
          </div>
          <div>
            <div className="titlefilter">
              <h1>Weight</h1>
            </div>
            <div className="productweight">
            <select className="filtertxt" onChange={handleWeightRangeChange}>
              <option value="all">All Weights</option>
              <option value="under100g">Under 100g</option>
              <option value="100to500g">100g - 500g</option>
              <option value="500gto1kg">500g - 1kg</option>
            </select>
          </div>
          </div>
          <button className="close-button" onClick={closeFilterContainer}>
            &times;
          </button>
        </div>
        <button className="filter-button" onClick={openFilterContainer}>
          Filter
        </button>
        <div className="productscontainer">
        {loading ? (
            <div className="spinner-container">
              <Oval color="#00BFFF" height={80} width={80} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              No products found.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Link key={product._id} className="custom-link" to={`/product/${product._id}`}>
                <Item product={product} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Store;
