import React, { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface InfiniteScrollComponentProps<T> {
  fetchMoreData: () => Promise<T[]>;
  hasMore: boolean;
  renderItem: (item: T) => ReactNode;
  initialData: T[];
}

function InfiniteScrollComponent<T>({
  fetchMoreData,
  hasMore,
  renderItem,
  initialData,
}: InfiniteScrollComponentProps<T>): JSX.Element {
  return (
    <InfiniteScroll
      dataLength={initialData.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      {initialData.map((item: T, index: number) => (
        <React.Fragment key={index}>
          {renderItem(item)}
        </React.Fragment>
      ))}
    </InfiniteScroll>
  );
}

export default InfiniteScrollComponent;