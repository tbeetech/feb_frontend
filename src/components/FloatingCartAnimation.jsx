import { motion, AnimatePresence } from 'framer-motion';

export const FloatingCartAnimation = ({ product, targetRef }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{
                    scale: 0.5,
                    opacity: 0,
                    x: targetRef.current?.getBoundingClientRect().left || 0,
                    y: targetRef.current?.getBoundingClientRect().top || 0
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed z-50"
            >
                <img src={product.image} alt="" className="w-16 h-16 rounded" />
            </motion.div>
        </AnimatePresence>
    );
};
