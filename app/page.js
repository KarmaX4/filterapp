"use client"
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['Holiday Villa', 'Rental Villa', 'Villas for Sale']);
  const [subCategories, setSubCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    startDate: null,
    endDate: null,
    maxGuests: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [filters]); 

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/getdata?${getQueryParams(filters)}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    
    }
  };

  const fetchSubCategories = (selectedCategory) => {
    const fakeSubCategories = {
      'Holiday Villa': ['Townhouse', 'Condo', 'Flat'],
      'Rental Villa': ['Townhouse', 'Condo', 'Flat'],
      'Villas for Sale': ['Townhouse', 'Condo', 'Flat'],
    };

    setSubCategories(fakeSubCategories[selectedCategory] || []);
  };

  const filterPosts = () => {
    const filteredPosts = posts.filter((post) => {
      return (
        (!filters.category || post.category === filters.category) &&
        (!filters.subCategory || post.subCategory === filters.subCategory) &&
        (!filters.startDate || (post.startDate >= filters.startDate && post.startDate <= filters.endDate)) &&
        (!filters.maxGuests || post.maxGuests <= filters.maxGuests)
      );
    });

    setPosts(filteredPosts);
  };

  const handleFilterChange = (field, value) => {
    if (field === 'startDate' || field === 'endDate') {
      // Check if the selected date is valid
      const isValidDate = value instanceof Date && !isNaN(value.getTime());

      if (!isValidDate) {
        // Handle invalid date input (e.g., clear the date)
        value = null;
      }
    }

    setFilters({ ...filters, [field]: value });

    if (field === 'category') {
      fetchSubCategories(value);
    }

    // Trigger post filtering on each filter change
    filterPosts();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      startDate: null,
      endDate: null,
      maxGuests: '',
    });
    setSubCategories([]);
    fetchPosts();
  };

  const getQueryParams = (params) => {
    return Object.keys(params)
      .filter((key) => params[key] !== '')
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  };

  return (
    <div className="container mx-auto p-4">
      <div className='flex flex-col justify-center items-center'>
        <div className='flex justify-center gap-4'>
          <select
            className="border p-2 border-orange-400 rounded-lg w-48 h-12"
            onChange={(e) => handleFilterChange('category', e.target.value)}
            value={filters.category}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="border p-2 border-orange-400 rounded-lg w-48 h-12"
            onChange={(e) => handleFilterChange('subCategory', e.target.value)}
            value={filters.subCategory}
          >
            <option value="">All Subcategories</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
          <div className="w-48">
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              startDate={filters.startDate}
              endDate={filters.endDate}
              selectsRange
              isClearable
              placeholderText="Start Date - End Date"
              className="border p-2 border-orange-400 rounded-lg w-full h-12"
            />
          </div>
          <input
            type="number"
            placeholder="Max Guests"
            value={filters.maxGuests}
            onChange={(e) => handleFilterChange('maxGuests', e.target.value)}
            className="border p-2 border-orange-400 rounded-lg w-48 h-12"
          />
        </div>
        <button
          className="bg-orange-500 w-20 text-white w-36 px-4 py-2 rounded-md mt-4 hover:bg-gray-700"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>
      <ul className="mt-8">
        {posts.map((post) => (
          <li key={post._id} className="mb-4 p-4 border rounded">
            {post.propertyName} - {post.category} - {post.subCategory}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
