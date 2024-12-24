import { ReactNode } from "react";

export interface ActionButtonsProps {
  toggleSidePanel: () => void;
}

export interface SidePanelTitleProps extends ActionButtonsProps {
  title: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  handleLogOut: () => void;
  logIn: (userData: User) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
}

export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
}