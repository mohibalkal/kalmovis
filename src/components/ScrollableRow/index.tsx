import React, { useRef } from 'react';
import styles from './style.module.scss';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import MovieCardSmall from '../MovieCardSmall';
import Skeleton from 'react-loading-skeleton';

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface ScrollableRowProps {
  title: string;
  items: any[];
  loading?: boolean;
  mediaType?: string;
}

const ScrollableRow: React.FC<ScrollableRowProps> = ({ 
  title, 
  items = [], 
  loading = false,
  mediaType = 'movie'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.ScrollableRow}>
      <h2>{title}</h2>
      <div className={styles.content}>
        <button 
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <MdChevronLeft size={24} />
        </button>
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {loading ? (
            Array(10).fill(0).map((_, index) => (
              <div key={index} className={styles.loading}>
                <Skeleton height="100%" />
              </div>
            ))
          ) : (
            items.map((item) => (
              <MovieCardSmall
                key={item.id}
                data={item}
                media_type={mediaType}
              />
            ))
          )}
        </div>
        <button 
          className={`${styles.navButton} ${styles.right}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <MdChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ScrollableRow; 