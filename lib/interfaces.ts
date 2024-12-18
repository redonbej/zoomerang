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
