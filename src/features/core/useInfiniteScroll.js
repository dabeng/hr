import { useState, useEffect } from 'react';

const useInfiniteScroll = (container, callback) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {

      container.current.addEventListener('scroll', handleScroll);

    return () => container.current.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  function handleScroll() {console.log('!!!!!!!!!!scroll')
    if (container.current.scrollHeight - container.current.scrollTop > container.current.clientHeight || isFetching) return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;