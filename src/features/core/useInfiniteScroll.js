import { useEffect } from 'react';

import {debounce} from './utils';

const useInfiniteScroll = (ref, handler) => {
  useEffect(() => {
    const handleScroll = () => {
      const container = ref.current;
      /* TODO: 这里的container.scrollHeight === 0在原始设计中是不必要的，因为按道理说，scrollHeight为0的时候，是不会触发
       * scroll事件的，但调试的时候确实发现这样怪异情况发生，所以暂时补充这句判断
       */
      if (container.scrollHeight !== 0 && container.scrollHeight - container.scrollTop - 20 < container.clientHeight) {
        handler();
      }
      
    }

    if (ref && ref.current) {
      ref.current.addEventListener('scroll', debounce(handleScroll, 1000));

      return () => {
        ref.current.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

};

export default useInfiniteScroll;