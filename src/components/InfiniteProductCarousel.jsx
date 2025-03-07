<div className="relative overflow-hidden">
    <motion.div
        animate={{
            x: [-100, -(products.length * 300)],
        }}
        transition={{
            x: {
                repeat: Infinity,
                duration: 30,
                ease: "linear",
            },
        }}
        className="flex gap-4"
    >
        {[...products, ...products].map((product, index) => (
            <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -10 }}
                className="w-72 flex-shrink-0"
            >
                // ...product card content...
            </motion.div>
        ))}
    </motion.div>
</div>
