<AnimatePresence>
    {isOpen && (
        <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <motion.div 
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="perspective-1000">
                        <motion.div
                            animate={{ rotateY: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <img src={product.image} alt="" className="w-full" />
                        </motion.div>
                    </div>
                    // ...product details...
                </div>
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>
