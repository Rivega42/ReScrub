import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Компонент для автоматической прокрутки к верху страницы при навигации
 * Отслеживает изменения маршрута и прокручивает страницу к началу
 */
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Прокручиваем к верху страницы при смене маршрута
    window.scrollTo(0, 0);
  }, [location]);

  return null; // Компонент ничего не рендерит
}