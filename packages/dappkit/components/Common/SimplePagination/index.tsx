import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Pagination from 'rc-pagination';
import { cn } from "@/dappkit/lib/utils"

interface SimplePaginationProps {
  className?: string;
  total: number;
  limit: number;
  page: number;
  onPageChange: (currentPage: number) => void;
}

const itemRender = (current, type, element) => {
  if (type === 'prev') {
    return (
      <div className="simple-pagination__prev" >
        <ChevronLeftIcon className='text-gray-600 dark:text-gray-200' />
      </div>
    );
  }
  if (type === 'next') {
    return (
      <div className='simple-pagination__next ml-2'>
        <ChevronRightIcon className='text-gray-600 dark:text-gray-200' />
      </div>
    );
  }
  return element;
};

const SimplePagination = ({ className, total, limit, page, onPageChange }: SimplePaginationProps) => {
  return (
    <div
      className={cn("simple-pagination", className)}
    >
      {total > limit && (
        <Pagination
          simple
          total={total}
          pageSize={limit}
          current={page}
          itemRender={itemRender}
          onChange={(currentPage) => {
            if (currentPage) {
              onPageChange?.(currentPage);
            }
          }}
        />
      )}
    </div>
  );
};

export default SimplePagination;
