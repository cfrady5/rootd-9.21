
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex items-center justify-center text-white">
      <Helmet>
        <title>Payment Successful - Rootd Store</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center p-10 rounded-2xl glass-card-dark max-w-lg mx-auto"
      >
        <CheckCircle className="mx-auto h-24 w-24 text-green-400 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-300 mb-8">
          Thank you for your purchase. Your order is being processed and you will receive a confirmation email shortly.
        </p>
        <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 text-base">
          <Link to="/store">Continue Shopping</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
