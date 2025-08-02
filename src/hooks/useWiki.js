import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { wikiMetadata } from '../data/wikiData';
import { useMarkdown } from './useMarkdown';

const WikiContext = createContext();

export const WikiProvider = ({ children }) => {
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { loadMarkdown, preloadFiles, loading, error } = useMarkdown();

    useEffect(() => {
        const loadAllPages = async () => {
            const pagesWithContent = await Promise.all(
                wikiMetadata.map(async (metadata) => {
                    const content = await loadMarkdown(metadata.filename);
                    return {
                        ...metadata,
                        content: content || `# Ошибка загрузки\n\nНе удалось загрузить содержимое страницы "${metadata.title}".`
                    };
                })
            );
            setPages(pagesWithContent);
        };

        loadAllPages();
    }, [loadMarkdown]);

    useEffect(() => {
        const filenames = wikiMetadata.map(meta => meta.filename);
        preloadFiles(filenames);
    }, [preloadFiles]);

    const findPageBySlug = useCallback((slug) => {
        return pages.find(page => page.slug === slug);
    }, [pages]);

    const searchPages = useCallback((term) => {
        if (!term) return pages;
        const lowercaseTerm = term.toLowerCase();
        return pages.filter(page =>
            page.title.toLowerCase().includes(lowercaseTerm) ||
            page.content.toLowerCase().includes(lowercaseTerm) ||
            page.category.toLowerCase().includes(lowercaseTerm) ||
            page.description?.toLowerCase().includes(lowercaseTerm)
        );
    }, [pages]);

    const reloadPage = useCallback(async (slug) => {
        const metadata = wikiMetadata.find(meta => meta.slug === slug);
        if (metadata) {
            const content = await loadMarkdown(metadata.filename);
            if (content) {
                const updatedPage = { ...metadata, content };
                setPages(prev => prev.map(page =>
                    page.slug === slug ? updatedPage : page
                ));
                if (currentPage?.slug === slug) {
                    setCurrentPage(updatedPage);
                }
            }
        }
    }, [loadMarkdown, currentPage]);

    const value = {
        pages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        findPageBySlug,
        searchPages,
        reloadPage,
        loading,
        error
    };

    return (
        <WikiContext.Provider value={value}>
            {children}
        </WikiContext.Provider>
    );
};

export const useWiki = () => {
    const context = useContext(WikiContext);
    if (!context) {
        throw new Error('useWiki must be used within a WikiProvider');
    }
    return context;
};

export const useWikiWithRouter = () => {
    const context = useContext(WikiContext);
    const navigate = useNavigate();
    const { slug } = useParams();

    if (!context) {
        throw new Error('useWikiWithRouter must be used within a WikiProvider');
    }

    const { pages, findPageBySlug, setCurrentPage: setContextCurrentPage } = context;

    useEffect(() => {
        if (slug && pages.length > 0) {
            const page = findPageBySlug(slug);
            if (page && (!context.currentPage || context.currentPage.slug !== slug)) {
                setContextCurrentPage(page);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, pages.length]);

    const setCurrentPage = useCallback((page) => {
        if (!page) return;
        navigate(`/page/${page.slug}`);
    }, [navigate]);

    return {
        ...context,
        setCurrentPage
    };
}; 