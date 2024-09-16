import { User } from './User';

export type FiltersName = Pick<User, 'name' | 'username' | 'phone' | 'email'>;
