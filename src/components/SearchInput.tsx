import { FC } from 'react';

interface SearchInputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: FC<SearchInputProps> = ({
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      name={name}
      type="search"
      className="search__input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;
