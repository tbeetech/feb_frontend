<motion.div
    initial={{ height: 0 }}
    animate={{ height: 'auto' }}
    exit={{ height: 0 }}
    className="overflow-hidden"
>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {sizes.map((size, index) => (
            <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 border rounded-lg cursor-pointer ${
                    selectedSize === size ? 'border-primary' : 'border-gray-200'
                }`}
            >
                <h3 className="text-lg font-semibold">{size}</h3>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-gray-600"
                >
                    <p>Bust: {measurements[size].bust}cm</p>
                    <p>Waist: {measurements[size].waist}cm</p>
                    <p>Hip: {measurements[size].hip}cm</p>
                </motion.div>
            </motion.div>
        ))}
    </div>
</motion.div>
