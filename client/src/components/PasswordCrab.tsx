import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import crabImage from '@assets/generated_images/Red_pixel_crab_sweeping_documents_b0d5ab08.webp';

interface PasswordCrabProps {
  isPasswordFocused: boolean;
  passwordLength: number;
  passwordStrength: number;
  isVisible?: boolean;
}

export function PasswordCrab({ isPasswordFocused, passwordLength, passwordStrength, isVisible = true }: PasswordCrabProps) {
  const [crabExpression, setCrabExpression] = useState<'idle' | 'watching' | 'happy' | 'concerned'>('idle');
  const [showEyes, setShowEyes] = useState(true);

  useEffect(() => {
    if (!isPasswordFocused) {
      setCrabExpression('idle');
      return;
    }

    // Краб реагирует на ввод пароля
    if (passwordLength === 0) {
      setCrabExpression('watching');
    } else if (passwordStrength >= 80) {
      setCrabExpression('happy');
    } else if (passwordStrength >= 40) {
      setCrabExpression('watching');
    } else {
      setCrabExpression('concerned');
    }
  }, [isPasswordFocused, passwordLength, passwordStrength]);

  // Анимация моргания глаз
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowEyes(false);
      setTimeout(() => setShowEyes(true), 150);
    }, 2000 + Math.random() * 3000); // Случайное моргание каждые 2-5 секунд

    return () => clearInterval(blinkInterval);
  }, []);

  const getCrabMessage = () => {
    switch (crabExpression) {
      case 'watching':
        return passwordLength === 0 ? '👀 Ввожу пароль...' : '🦀 Хороший пароль!';
      case 'happy':
        return '✨ Отличный пароль!';
      case 'concerned':
        return '😟 Пароль слабоват...';
      default:
        return '';
    }
  };

  const getCrabColor = () => {
    switch (crabExpression) {
      case 'happy':
        return 'brightness-110 saturate-110';
      case 'concerned':
        return 'brightness-75 saturate-75';
      case 'watching':
        return 'brightness-105';
      default:
        return 'brightness-100';
    }
  };

  // Показываем крабика только когда поле в фокусе (интерактивный помощник)
  const shouldShowCrab = isVisible && isPasswordFocused;

  return (
    <AnimatePresence>
      {shouldShowCrab && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8, transition: { duration: 0 } }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
          data-testid="password-crab"
        >
        {/* Контейнер для крабика */}
        <div className="flex flex-col items-center space-y-2">
          {/* Крабик */}
          <motion.div
            animate={{
              scale: crabExpression === 'watching' ? [1, 1.05, 1] : 1,
              rotate: crabExpression === 'concerned' ? [-2, 2, -2, 2, 0] : 0,
            }}
            transition={{
              scale: { duration: 2, repeat: crabExpression === 'watching' ? Infinity : 0 },
              rotate: { duration: 0.5, ease: "easeInOut" }
            }}
            className="relative"
          >
            <img 
              src={crabImage} 
              alt="Красный краб следит за безопасностью пароля" 
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className={`w-16 h-16 object-contain transition-all duration-300 ${getCrabColor()}`}
            />
            
            {/* Анимированные глаза */}
            <AnimatePresence>
              {showEyes && isPasswordFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 left-1/2 transform -translate-x-1/2"
                >
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{
                        x: passwordLength > 0 ? [0, 2, -2, 0] : 0
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-1 h-1 bg-red-600 rounded-full"
                    />
                    <motion.div
                      animate={{
                        x: passwordLength > 0 ? [0, -2, 2, 0] : 0
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-1 h-1 bg-red-600 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Сообщение от крабика */}
          <AnimatePresence>
            {isPasswordFocused && getCrabMessage() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-1 shadow-sm"
              >
                <p className="text-xs text-muted-foreground text-center whitespace-nowrap">
                  {getCrabMessage()}
                </p>
                
                {/* Хвостик для речевого пузыря */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

          {/* Эффект частиц при отличном пароле */}
          <AnimatePresence>
            {crabExpression === 'happy' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      scale: 0, 
                      x: 0, 
                      y: 0, 
                      opacity: 1 
                    }}
                    animate={{ 
                      scale: [0, 1, 0], 
                      x: (Math.random() - 0.5) * 60,
                      y: (Math.random() - 0.5) * 60,
                      opacity: [1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-500 rounded-full"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}