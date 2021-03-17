const texts = {
  showMore: 'Se alle',
  showLess: 'Vis færre',
};

export const PAGINATED_NUMBER_OF_ITEMS = 50;

export const onTogglePaginationClick = (
  numberOfItemsPerPage: number,
  setNumberOfItemsPerPage: (n: number) => void,
  numberOfItemsTotal: number
) => {
  if (numberOfItemsPerPage === numberOfItemsTotal) {
    setNumberOfItemsPerPage(PAGINATED_NUMBER_OF_ITEMS);
  } else {
    setNumberOfItemsPerPage(numberOfItemsTotal);
  }
};

export const getTogglePaginationText = (
  numberOfItemsPerPage: number,
  numberOfItemsTotal: number
) => {
  return numberOfItemsPerPage === numberOfItemsTotal
    ? texts.showLess
    : texts.showMore;
};
