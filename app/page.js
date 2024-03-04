"use client"
import React, { useState, useEffect } from 'react';
import { DatePicker, Form } from 'antd';
import moment from 'moment';

const SearchPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['Holiday Villa', 'Rental Villa', 'Villas for Sale']);
  const [subCategories, setSubCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    dateRange: [],
    maxGuests: '',
  });
  const [noMatch, setNoMatch] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/getdata?${queryParams.toString()}`);
      const data = await response.json();
      setPosts(data);
      setNoMatch(data.length === 0);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setNoMatch(true);
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

  const handleFilterChange = (field, value) => {
    if (field === 'startDate' || field === 'endDate') {
      const isValidDate = value instanceof Date && !isNaN(value.getTime());

      if (!isValidDate) {
        value = null;
      }
    }

    setFilters({ ...filters, [field]: value });

    if (field === 'category') {
      fetchSubCategories(value);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      dateRange: [],
      maxGuests: '',
    });
    setSubCategories([]);
    setNoMatch(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center gap-4">
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
            <DatePicker.RangePicker
              format="MMM Do, YYYY"
              value={filters.dateRange}
              separator="-"
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              allowClear={false}
              className="border p-2 border-orange-400 rounded-lg w-48 h-12"
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
        {noMatch && <p className="text-red-500 mt-4">No matches found.</p>}
      </div>
      {posts.length > 0 && (
        <ul className="mt-8">
          {posts.map((post) => (
            <li key={post._id} className="mb-4 p-4 border rounded">
              name: {post.propertyName} - category: {post.category} - subCategory:{' '}
              {post.subCategory} - maxGuests: {post.maxGuests}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;

