
import React from 'react';
import { Helmet } from 'react-helmet';
import ProductsList from '@/components/ProductsList';

const StorePage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white">
      <Helmet>
        <title>Store - Rootd</title>
        <meta name="description" content="Browse our exclusive collection of products." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Our Collection
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Discover exclusive gear and apparel.
          </p>
        </div>
        <ProductsList />
      </div>
    </div>
  );
};

export default StorePage;
