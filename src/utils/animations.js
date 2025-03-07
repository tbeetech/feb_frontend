export const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  exit: { opacity: 0, y: -20 }
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

export const springAnimation = {
  type: "spring",
  stiffness: 300,
  damping: 20
};

export const magneticEffect = (e, ref, strength = 0.3) => {
  const { width, height, left, top } = ref.current.getBoundingClientRect();
  const x = (e.clientX - left - width / 2) * strength;
  const y = (e.clientY - top - height / 2) * strength;
  return { x, y };
};
