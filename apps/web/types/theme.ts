export type ThemeConfig = {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;

    borderRadius: | "none" | "sm" | "md" | "lg" | "full";

    backgroundImage?: string;
    logoUrl?: string;
};