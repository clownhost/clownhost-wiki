import { Search, Menu, X } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import styles from './Header.module.css';

const Header = ({ onSearch, onToggleSidebar, isSidebarOpen }) => {
    useHotkeys('ctrl+k', (e) => {
        e.preventDefault();
        onSearch();
    });

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button
                    className={styles.menuButton}
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className={styles.logo}>
                    <img src={process.env.PUBLIC_URL + '/chwikil.svg'} alt="ClownHost Wiki" className={styles.logoImage} />
                </div>
            </div>

            <div className={styles.center}>
                <button
                    className={styles.searchButton}
                    onClick={onSearch}
                >
                    <Search size={16} />
                    <span className={styles.searchText}>Поиск...</span>
                    <kbd className={styles.kbd}>⌘K</kbd>
                </button>

                <div className={styles.mobileLogo}>
                    <img src={process.env.PUBLIC_URL + '/chwikil.svg'} alt="ClownHost Wiki" className={styles.logoImage} />
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.status}>
                    <span className={styles.statusDot}></span>
                    Все системы работают
                </div>
                
                <button
                    className={styles.mobileSearchButton}
                    onClick={onSearch}
                    aria-label="Поиск"
                >
                    <Search size={18} />
                </button>
            </div>
        </header>
    );
};

export default Header; 