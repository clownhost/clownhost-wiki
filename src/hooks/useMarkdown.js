import { useState, useCallback } from 'react';

export const useMarkdown = () => {
    const [loadedFiles, setLoadedFiles] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadMarkdown = useCallback(async (filename) => {
        if (loadedFiles.has(filename)) {
            return loadedFiles.get(filename);
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/content/${filename}`);

            if (!response.ok) {
                throw new Error(`Не удалось загрузить ${filename}: ${response.status}`);
            }

            const content = await response.text();

            setLoadedFiles(prev => new Map(prev).set(filename, content));

            setLoading(false);
            return content;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            console.error('Ошибка загрузки markdown:', err);
            return null;
        }
    }, [loadedFiles]);

    const preloadFiles = useCallback(async (filenames) => {
        const promises = filenames.map(filename => loadMarkdown(filename));
        await Promise.all(promises);
    }, [loadMarkdown]);

    const clearCache = useCallback(() => {
        setLoadedFiles(new Map());
    }, []);

    return {
        loadMarkdown,
        preloadFiles,
        clearCache,
        loading,
        error,
        cacheSize: loadedFiles.size
    };
}; 