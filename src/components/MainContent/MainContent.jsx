import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Calendar, User, Clock, ExternalLink, Check } from 'lucide-react';
import { useWikiWithRouter } from '../../hooks/useWiki';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './MainContent.module.css';

const MainContent = ({ isSidebarOpen }) => {
  const { currentPage } = useWikiWithRouter();
  const [copiedStates, setCopiedStates] = useState({});
  const mainRef = useRef(null);

  useEffect(() => {
    if (currentPage && mainRef.current) {
      setTimeout(() => {
        if (mainRef.current) {
          mainRef.current.scrollTo(0, 0);
        }
      }, 0);
    }
  }, [currentPage]);

  const handleCopyCode = async (code, index) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        if (navigator.userAgent.match(/ipad|iphone/i)) {
          const range = document.createRange();
          range.selectNodeContents(textArea);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textArea.setSelectionRange(0, 999999);
        }

        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedStates(prev => ({ ...prev, [index]: true }));

      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
      setCopiedStates(prev => ({ ...prev, [index]: 'error' }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    }
  };

  const customComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');

      if (!inline && match) {
        const codeText = String(children).replace(/\n$/, '');
        const codeIndex = `${match[1]}-${codeText.slice(0, 20)}`;
        const copyState = copiedStates[codeIndex];

        return (
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLanguage}>{match[1]}</span>
              <button
                className={clsx(
                  styles.copyButton,
                  copyState === true && styles.copied,
                  copyState === 'error' && styles.error
                )}
                onClick={() => handleCopyCode(codeText, codeIndex)}
                disabled={copyState === true || copyState === 'error'}
              >
                {copyState === true ? (
                  <>
                    <Check size={14} />
                    <span>Скопировано!</span>
                  </>
                ) : copyState === 'error' ? (
                  <span>Ошибка</span>
                ) : (
                  'Копировать'
                )}
              </button>
            </div>
            <SyntaxHighlighter
              style={oneLight}
              language={match[1]}
              PreTag="div"
              className={styles.syntaxHighlighter}
              {...props}
            >
              {codeText}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code className={styles.inlineCode} {...props}>
          {children}
        </code>
      );
    },

    img({ src, alt, ...props }) {
      return (
        <span className={styles.imageWrapper}>
          <img
            src={src}
            alt={alt}
            className={styles.image}
            loading="lazy"
            {...props}
          />
          {alt && <span className={styles.imageCaption}>{alt}</span>}
        </span>
      );
    },

    table({ children, ...props }) {
      return (
        <div className={styles.tableWrapper}>
          <table className={styles.table} {...props}>
            {children}
          </table>
        </div>
      );
    },

    blockquote({ children, ...props }) {
      return (
        <blockquote className={styles.blockquote} {...props}>
          {children}
        </blockquote>
      );
    },

    a({ href, children, ...props }) {
      const isExternal = href?.startsWith('http');

      return (
        <a
          href={href}
          className={clsx(styles.link, isExternal && styles.externalLink)}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
          {isExternal && <ExternalLink size={14} />}
        </a>
      );
    }
  };

  if (!currentPage) {
    return (
      <main className={clsx(styles.main, !isSidebarOpen && styles.fullWidth)}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h2 className={styles.emptyTitle}>Выберите страницу</h2>
          <p className={styles.emptyDescription}>
            Выберите страницу из боковой панели или воспользуйтесь поиском
          </p>
        </div>
      </main>
    );
  }

  return (
    <main ref={mainRef} className={clsx(styles.main, !isSidebarOpen && styles.fullWidth)}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{currentPage.title}</h1>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar size={16} />
              <span>{currentPage.lastModified}</span>
            </div>
            <div className={styles.metaItem}>
              <User size={16} />
              <span>{currentPage.author}</span>
            </div>
            <div className={styles.metaItem}>
              <Clock size={16} />
              <span>~{Math.ceil(currentPage.content.length / 1000)} мин чтения</span>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={customComponents}
          >
            {currentPage.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
};

export default MainContent; 