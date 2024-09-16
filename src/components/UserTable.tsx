import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchUsers,
  setFilter,
  resetFilters,
} from '../store/features/usersSlice';
import SearchInput from './SearchInput';
import { typedObjectKeys } from '../utils/typedObjectKeys';
import { SortType } from '../types/SortType';
import { User } from '../types/User';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { SortOrder } from '../types/SortOrders';
import { Status } from '../types/Status';

const UserTable: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, filters, status } = useSelector(
    (state: RootState) => state.users
  );

  const [sortField, setSortField] = useState<SortType | null>(SortType.Name);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const name = e.target.getAttribute('name') as string;
    dispatch(setFilter({ [name]: value }));
  };

  const handleSort = (field: SortType) => {
    const order =
      sortField === field && sortOrder === SortOrder.ASC
        ? SortOrder.DESC
        : SortOrder.ASC;
    setSortField(field);
    setSortOrder(order);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    const user1 = String(a[sortField]).toLowerCase();
    const user2 = String(b[sortField]).toLowerCase();
    if (user1 < user2) return sortOrder === SortOrder.ASC ? -1 : 1;
    if (user1 > user2) return sortOrder === SortOrder.ASC ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    return typedObjectKeys(filters).every((filter) => {
      const filterValue = filters[filter].toLowerCase();
      return user[filter].toLowerCase().includes(filterValue);
    });
  });

  const getSortIcon = (field: keyof User) => {
    if (sortField !== field) return <FaSort />;
    if (sortOrder === SortOrder.ASC) return <FaSortUp />;
    return <FaSortDown />;
  };

  return (
    <section className="table__wrapper">
      <div className="filters">
        <h3 className="filters__title">Filters</h3>
        <div className="filters__wrapper">
          <div className="filters__list">
            <SearchInput
              name="name"
              placeholder="Name"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <SearchInput
              name="username"
              placeholder="Username"
              value={filters.username}
              onChange={handleFilterChange}
            />
            <SearchInput
              name="email"
              placeholder="Email"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <SearchInput
              name="phone"
              placeholder="Phone"
              value={filters.phone}
              onChange={handleFilterChange}
            />
          </div>
          <button
            className="filters__reset"
            onClick={() => dispatch(resetFilters())}
          >
            Reset filters
          </button>
        </div>
      </div>

      {status === Status.Loading && <div className="loader"></div>}

      {status === Status.Succeeded && (
        <table className="table">
          <thead className="table__header">
            <tr className="table__row">
              <th scope="col" className="table__head">
                Name
                <span onClick={() => handleSort(SortType.Name)}>
                  {getSortIcon('name')}
                </span>
              </th>
              <th scope="col" className="table__head">
                Username
                <span onClick={() => handleSort(SortType.UserName)}>
                  {getSortIcon('username')}
                </span>
              </th>
              <th scope="col" className="table__head">
                Email
                <span onClick={() => handleSort(SortType.Email)}>
                  {getSortIcon('email')}
                </span>
              </th>
              <th scope="col" className="table__head">
                Phone
                <span onClick={() => handleSort(SortType.Phone)}>
                  {getSortIcon('phone')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="table__list">
            {filteredUsers.length === 0 ? (
              <tr className="table__item">
                <td className="table__empty">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="table__item">
                  <td data-label="Name">{user.name}</td>
                  <td data-label="User Name">{user.username}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Phone">{user.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default UserTable;
