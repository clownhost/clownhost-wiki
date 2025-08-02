import { useState, useEffect, useRef } from 'react';
import { Search, FileText, X, Clock, Zap } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useWikiWithRouter } from '../../hooks/useWiki';
import clsx from 'clsx';
import styles from './SearchModal.module.css';

const SearchModal = ({ isOpen, onClose }) => {
    const { pages, setCurrentPage, searchPages } = useWikiWithRouter();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState([]);
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    const results = query.length > 0 ? searchPages(query) : [];

    useHotkeys('escape', () => {
        if (isOpen) {
            onClose();
        }
    }, { enabled: isOpen });

    useHotkeys('ArrowDown', (e) => {
        e.preventDefault();
        setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
        );
    }, { enabled: isOpen && results.length > 0 });

    useHotkeys('ArrowUp', (e) => {
        e.preventDefault();
        setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
        );
    }, { enabled: isOpen && results.length > 0 });

    useHotkeys('Enter', () => {
        if (results[selectedIndex]) {
            handleSelectPage(results[selectedIndex]);
        }
    }, { enabled: isOpen && results.length > 0 });

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleSelectPage = (page) => {
        setCurrentPage(page);

        const newRecentSearches = [
            page.title,
            ...recentSearches.filter(s => s !== page.title)
        ].slice(0, 5);
        setRecentSearches(newRecentSearches);

        onClose();
    };

    const getHighlightedText = (text, query) => {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className={styles.highlight}>{part}</mark>
            ) : part
        );
    };

    const getPreviewText = (content, query) => {
        if (!query) return content.substring(0, 120) + '...';

        const index = content.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return content.substring(0, 120) + '...';

        const start = Math.max(0, index - 60);
        const end = Math.min(content.length, index + query.length + 60);
        const preview = content.substring(start, end);

        return (start > 0 ? '...' : '') + preview + (end < content.length ? '...' : '');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <div className={styles.header}>
                    <div className={styles.searchContainer}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Поиск в документации..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <button onClick={onClose} className={styles.closeButton}>
                            <X size={20} className={styles.closeIcon} />
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {query.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.suggestions}>
                                <h3 className={styles.sectionTitle}>
                                    <Zap size={16} className={styles.sectionIcon} />
                                    Быстрый доступ
                                </h3>
                                <div className={styles.suggestionsList}>
                                    {pages.slice(0, 6).map((page) => (
                                        <button
                                            key={page.id}
                                            className={styles.suggestionItem}
                                            onClick={() => handleSelectPage(page)}
                                        >
                                            <FileText size={16} className={styles.suggestionIcon} />
                                            <div className={styles.suggestionContent}>
                                                <div className={styles.suggestionTitle}>{page.title}</div>
                                                <div className={styles.suggestionCategory}>{page.category}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {recentSearches.length > 0 && (
                                <div className={styles.recent}>
                                    <h3 className={styles.sectionTitle}>
                                        <Clock size={16} className={styles.sectionIcon} />
                                        Недавние
                                    </h3>
                                    <div className={styles.recentList}>
                                        {recentSearches.map((search, index) => (
                                            <div key={index} className={styles.recentItem}>
                                                {search}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.results}>
                            {results.length > 0 ? (
                                <>
                                    <div className={styles.resultsHeader}>
                                        Найдено {results.length} результат{results.length === 1 ? '' : results.length < 5 ? 'а' : 'ов'}
                                    </div>
                                    <div className={styles.resultsList}>
                                        {results.map((page, index) => (
                                            <button
                                                key={page.id}
                                                className={clsx(
                                                    styles.resultItem,
                                                    index === selectedIndex && styles.selected
                                                )}
                                                onClick={() => handleSelectPage(page)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                            >
                                                <div className={styles.resultIcon}>
                                                    <FileText size={16} className={styles.resultFileIcon} />
                                                </div>
                                                <div className={styles.resultContent}>
                                                    <div className={styles.resultTitle}>
                                                        {getHighlightedText(page.title, query)}
                                                    </div>
                                                    <div className={styles.resultPreview}>
                                                        {getHighlightedText(getPreviewText(page.content, query), query)}
                                                    </div>
                                                    <div className={styles.resultMeta}>
                                                        <span className={styles.resultCategory}>{page.category}</span>
                                                        <span className={styles.resultDate}>{page.lastModified}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className={styles.noResults}>
                                    <div className={styles.noResultsIcon}>🔍</div>
                                    <div className={styles.noResultsTitle}>Ничего не найдено</div>
                                    <div className={styles.noResultsText}>
                                        Попробуйте изменить поисковый запрос
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal; 