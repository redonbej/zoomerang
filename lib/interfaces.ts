import { ReactNode } from "react";

export interface ActionButtonsProps {
    toggleSidePanel: () => void;
}

export interface SidePanelTitleProps extends ActionButtonsProps {
    title: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    handleLogOut: () => void;
    logIn: () => void;
}

export interface AuthProviderProps {
    children: ReactNode;
}
