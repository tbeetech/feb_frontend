import React from 'react';
import { motion } from 'framer-motion';
import TrendingProductSlider from '../../components/TrendingProductSlider';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const TrendingProducts = () => {
    const { data: { products = [] } = {}, isLoading } = useFetchAllProductsQuery({
        limit: 12 // Increased limit for smoother sliding
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <section className="section__container bg-gradient-to-r from-gray-100/20 to-white">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-center mb-8"
            >
                <motion.h2 
                    variants={itemVariants}
                    className="section__header"
                >
                    Trending Products
                </motion.h2>
                <motion.p 
                    variants={itemVariants}
                    className="section__subheader"
                >
                    Discover our most sought-after fashion pieces and accessories
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <TrendingProductSlider products={products} />
            </motion.div>
        </section>
    );
};

export default TrendingProducts;
