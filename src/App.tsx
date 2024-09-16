import { FC } from 'react';
import UserTable from './components/UserTable';
import './App.scss';

const App: FC = () => {
  return (
    <div className="container">
      <h1>User Management</h1>
      <UserTable />
    </div>
  );
};

export default App;
