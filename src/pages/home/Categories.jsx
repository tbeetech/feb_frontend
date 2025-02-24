import category1 from "../../assets/category-1.jpg"
import category2 from "../../assets/category-2.jpg"
import category3 from "../../assets/category-3.jpg"
import category4 from "../../assets/category-4.jpg"
import { Link } from "react-router-dom"

const Categories = () => {
  const categories = [
    {name: 'Accessories', path: 'accessories', image: category1},
    {name: 'Dress Collection', path: 'dress', image: category2},
    {name: 'Jewellery', path: 'jewerly', image: category3},
    {name: 'Perfumes', path: 'perfumes', image: category4},
  ]
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex overflow-x-auto space-x-4">
        {categories.map((category) => (
          <div key={category.name} className="flex-shrink-0 w-64">
            <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
              />
            </div>
            <Link 
              to={`/categories/${category.path}`}
              className="block text-center bg-white border-2 border-yellow-400 text-gray-900 px-6 py-2 rounded hover:bg-yellow-400 hover:text-white transition-all duration-300"
            >
              {category.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories