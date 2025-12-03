import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        
        const localTheme = localStorage.getItem('appTheme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (localTheme) {
            return localTheme;
        } else if (prefersDark) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        document.body.className = `theme-${theme}`; 

        localStorage.setItem('appTheme', theme);
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};