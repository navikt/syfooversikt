import * as React from 'react';
import { ReactElement } from 'react';

const SearchIcon = ({ className }: { className: string }): ReactElement => {
  return (
    <svg
      className={className}
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
    >
      <path d="M9,0 C13.963,0 18,4.037 18,9 C18,11.111 17.264,13.053 16.041,14.588 L16.041,14.588 L23.709,22.295 C24.098,22.686 24.098,23.318 23.705,23.709 C23.312,24.1 22.68,24.098 22.291,23.705 L22.291,23.705 L14.633,16.008 C13.09,17.25 11.131,18 9,18 C4.037,18 0,13.963 0,9 C0,4.037 4.037,0 9,0 Z M9,2 C5.139,2 2,5.139 2,9 C2,12.859 5.139,16 9,16 C12.859,16 16,12.859 16,9 C16,5.139 12.859,2 9,2 Z" />
    </svg>
  );
};

export default SearchIcon;
