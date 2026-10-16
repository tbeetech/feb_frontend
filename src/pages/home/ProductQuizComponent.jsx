import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaRedo } from 'react-icons/fa';

const questions = [
  {
    id: 1,
    question: "What are you looking for today?",
    options: [
      { id: 'fashion', text: '👗 Crochet Fashion & Dresses' },
      { id: 'accessories', text: '👜 Handmade Bags & Accessories' },
      { id: 'custom', text: '✨ Custom Bespoke Commission' },
      { id: 'classes', text: '🧶 Beginner Crochet Classes & Kits' }
    ]
  },
  {
    id: 2,
    question: "Which aesthetic speaks to your spirit?",
    options: [
      { id: 'zen', text: 'Zen Minimalism & Clean Lines' },
      { id: 'boho', text: 'Warm Bohemian Earth Tones' },
      { id: 'resort', text: 'Sun-kissed Resort & Beach' },
      { id: 'classic', text: 'Timeless Heirloom Lace' }
    ]
  },
  {
    id: 3,
    question: "What is your main timeline or goal?",
    options: [
      { id: 'ready', text: 'Ready to wear right away' },
      { id: 'custom_fit', text: 'Tailored to my body measurements' },
      { id: 'learn', text: 'I want to learn how to crochet' },
      { id: 'gift', text: 'A thoughtful handmade gift' }
    ]
  }
];

// Maps quiz results to categories
const resultMap = {
  fashion: '/categories/fashion',
  accessories: '/categories/accessories',
  custom: '/categories/custom',
  classes: '/categories/classes'
};

const ProductQuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  const handleOptionSelect = (questionId, optionId) => {
    const updated = {
      ...answers,
      [questionId]: optionId
    };
    setAnswers(updated);
    
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
    const interest = answers[1];
    const goal = answers[3];
    
    if (goal === 'learn') return '/categories/classes';
    if (goal === 'custom_fit') return '/categories/custom';
    if (interest && resultMap[interest]) return resultMap[interest];
    
    return '/shop';
  };
  
  const navigateToResults = () => {
    const path = getRecommendation();
    navigate(path);
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-[#E5DACD] overflow-hidden">
      <div className="p-8">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-[#C49B76] font-semibold">
                  Step {currentQuestion + 1} of {questions.length}
                </span>
                <div className="flex gap-1.5">
                  {questions.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentQuestion 
                          ? 'w-6 bg-[#0F223D]' 
                          : index < currentQuestion 
                            ? 'w-3 bg-[#C49B76]' 
                            : 'w-3 bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-[#0F223D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {questions[currentQuestion].question}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {questions[currentQuestion].options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionSelect(questions[currentQuestion].id, option.id)}
                    className="p-4 rounded-xl border border-stone-200 text-left hover:border-[#0F223D] hover:bg-[#FAF8F5] focus:outline-none transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm font-medium text-stone-800 group-hover:text-[#0F223D]">
                      {option.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-6"
            >
              <div className="w-14 h-14 bg-[#E8C5A5]/30 text-[#0F223D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🧶
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#0F223D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                We Found Your Perfect Match
              </h3>
              <p className="text-stone-600 text-sm mb-6 max-w-md mx-auto">
                Based on your taste for artisanal slow fashion, we have handpicked items and workshops tailored for you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <motion.button
                  onClick={navigateToResults}
                  className="bg-[#0F223D] text-[#E8C5A5] py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1A365D] transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Explore Recommendation</span>
                  <FaArrowRight />
                </motion.button>
                <motion.button
                  onClick={resetQuiz}
                  className="bg-stone-100 text-stone-700 py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Retake Quiz</span>
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