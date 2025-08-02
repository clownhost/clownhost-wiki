import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react';
import { useWikiWithRouter } from '../../hooks/useWiki';
import clsx from 'clsx';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onPageSelect }) => {
  const { pages, currentPage, setCurrentPage } = useWikiWithRouter();

  const [expandedCategories, setExpandedCategories] = useState(() => {
    return currentPage ? new Set([currentPage.category]) : new Set();
  });

  useEffect(() => {
    if (currentPage) {
      setExpandedCategories(prev => new Set([...prev, currentPage.category]));
    }
  }, [currentPage]);

  const categories = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handlePageSelect = (page) => {
    setCurrentPage(page);
    onPageSelect?.();
  };

  return (
    <aside className={clsx(styles.sidebar, !isOpen && styles.closed)}>
      <div className={styles.sidebarContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>Документация</h2>
        </div>

        <nav className={styles.nav}>
          {Object.entries(categories).map(([category, categoryPages]) => {
            const isExpanded = expandedCategories.has(category);

            return (
              <div key={category} className={styles.category}>
                <button
                  className={styles.categoryButton}
                  onClick={() => toggleCategory(category)}
                >
                  <div className={styles.categoryIcon}>
                    {isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />}
                  </div>
                  <span className={styles.categoryName}>{category}</span>
                  <div className={styles.chevron}>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className={styles.pages}>
                    {categoryPages.map((page) => (
                      <button
                        key={page.id}
                        className={clsx(
                          styles.pageButton,
                          currentPage?.id === page.id && styles.active
                        )}
                        onClick={() => handlePageSelect(page)}
                      >
                        <FileText size={16} />
                        <span className={styles.pageName}>{page.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.footerText}>
            <span onClick={() => window.open('https://github.com/clownhost/clownhost-wiki', '_blank')} className={styles.footerItem}>
              Создано ClownHost Wiki
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 