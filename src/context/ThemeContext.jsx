import { createContext, useEffect, useLayoutEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const ThemeContext = createContext();

function ThemeContextProvider({ children }) {
    const [cookies, setCookie] = useCookies(['theme']);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        setCookie('theme', theme, { expires: new Date(Date.now() + 1000 * 60 * 60 * 6) });
    }, [theme]);

    useLayoutEffect(() => {
        if (cookies.theme) {
            setTheme(cookies.theme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeContext, ThemeContextProvider };