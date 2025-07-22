export type paging = {
  size: number;
  total_page: number;
  current_page: number;
};

export type pagingResponse<T> = {
  data: T[];
  paging: paging;
};
