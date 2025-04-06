import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaRedo } from 'react-icons/fa';

const questions = [
  {
    id: 1,
    question: "What's your primary interest?",
    options: [
      { id: 'fragrance', text: 'Fragrances' },
      { id: 'accessories', text: 'Accessories' },
      { id: 'clothing', text: 'Clothing' },
      { id: 'shoes', text: 'Shoes' }
    ]
  },
  {
    id: 2,
    question: "What's your preferred price range?",
    options: [
      { id: 'budget', text: 'Budget-friendly' },
      { id: 'mid', text: 'Mid-range' },
      { id: 'premium', text: 'Premium' },
      { id: 'luxury', text: 'Luxury' }
    ]
  },
  {
    id: 3,
    question: "What's your preferred style?",
    options: [
      { id: 'casual', text: 'Casual' },
      { id: 'formal', text: 'Formal' },
      { id: 'trendy', text: 'Trendy' },
      { id: 'classic', text: 'Classic' }
    ]
  }
];

// Maps quiz results to category paths
const resultMap = {
  fragrance: {
    path: '/categories/fragrance',
    casual: '/categories/fragrance/mist',
    formal: '/categories/fragrance/designer-niche',
    trendy: '/categories/fragrance/arabian',
    classic: '/categories/fragrance/designer-niche'
  },
  accessories: {
    path: '/categories/accessories',
    casual: '/categories/accessories/sunglasses',
    formal: '/categories/accessories/wrist-watches',
    trendy: '/categories/accessories/earrings',
    classic: '/categories/accessories/pearls'
  },
  clothing: {
    path: '/categories/clothes',
    casual: '/shop?filter=casual',
    formal: '/categories/corporate/office-wear',
    trendy: '/categories/dress/party',
    classic: '/categories/dress/casual'
  },
  shoes: {
    path: '/categories/shoes',
    casual: '/categories/shoes/sneakers',
    formal: '/categories/shoes/heels',
    trendy: '/categories/shoes/heels',
    classic: '/categories/shoes/flats'
  }
};

const ProductQuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  const handleOptionSelect = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
    
    // If last question, show results, otherwise go to next question
    if (currentQuestion >= questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };
  
  const getRecommendation = () => {
    const category = answers[1];
    const style = answers[3];
    
    if (category && style && resultMap[category]) {
      return resultMap[category][style] || resultMap[category].path;
    }
    
    return '/shop';
  };
  
  const navigateToResults = () => {
    const path = getRecommendation();
    navigate(path);
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-900">
                  Question {currentQuestion + 1} of {questions.length}
                </h3>
                <div className="flex gap-1">
                  {questions.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentQuestion 
                          ? 'bg-black' 
                          : index < currentQuestion 
                            ? 'bg-gray-400' 
                            : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900">
                {questions[currentQuestion].question}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionSelect(questions[currentQuestion].id, option.id)}
                    className="p-6 border-2 border-gray-200 rounded-lg text-center hover:border-black focus:outline-none transition-colors duration-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg font-medium">{option.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <h2 className="text-2xl font-bold mb-4">Perfect! We've found your matches</h2>
              <p className="text-gray-600 mb-8">
                Based on your preferences, we've curated a selection of products just for you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  onClick={navigateToResults}
                  className="bg-black text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View Recommendations</span>
                  <FaArrowRight />
                </motion.button>
                <motion.button
                  onClick={resetQuiz}
                  className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Start Over</span>
                  <FaRedo />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductQuizComponent; 