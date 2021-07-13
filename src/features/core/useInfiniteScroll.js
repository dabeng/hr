import { useState, useEffect } from 'react';

import {debounce} from './utils';

const useInfiniteScroll = (container, callback) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {

      container.current.addEventListener('scroll', debounce(handleScroll, 1000));

    return () => container.current.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  function handleScroll() {
    if (container.current.scrollHeight - container.current.scrollTop > container.current.clientHeight || isFetching) return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;