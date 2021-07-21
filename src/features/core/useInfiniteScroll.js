import { useState, useEffect } from 'react';

import {debounce} from './utils';

const useInfiniteScroll = (containerRef) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    function handleScroll() {
      if (container.scrollHeight - container.scrollTop > container.clientHeight || isFetching) return;
      setIsFetching(true);
    }

    if (container) {
      container.addEventListener('scroll', debounce(handleScroll, 1000));
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    }
  }, [containerRef, isFetching]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;