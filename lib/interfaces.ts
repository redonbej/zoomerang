interface ActionButtonsProps {
    toggleSidePanel: () => void;
}

interface SidePanelTitleProps extends ActionButtonsProps {
    title: string;
}