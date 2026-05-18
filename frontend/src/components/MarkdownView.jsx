import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import Icon from "./Icon";

const getActiveTheme = () =>
  (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) || "light";

const parseYouTubeUrl = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return { videoId: u.pathname.slice(1) || null, playlistId: u.searchParams.get("list") };
    }
    if (u.hostname === "youtube.com" || u.hostname === "www.youtube.com" || u.hostname === "m.youtube.com") {
      const v = u.searchParams.get("v");
      const list = u.searchParams.get("list");
      if (v) return { videoId: v, playlistId: list };
      if (list) return { videoId: null, playlistId: list };
      const m = u.pathname.match(/\/embed\/([^/?]+)/);
      if (m) return { videoId: m[1], playlistId: list };
    }
  } catch (e) {
    return null;
  }
  return null;
};

const buildEmbedUrl = ({ videoId, playlistId }) => {
  const base = "https://www.youtube-nocookie.com/embed";
  if (videoId) {
    const q = playlistId ? `?list=${encodeURIComponent(playlistId)}` : "";
    return `${base}/${videoId}${q}`;
  }
  if (playlistId) {
    return `${base}/videoseries?list=${encodeURIComponent(playlistId)}`;
  }
  return null;
};

const buildThumbnail = ({ videoId }) =>
  videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

const YouTubeCard = ({ videoId, playlistId, title, originalUrl }) => {
  const [open, setOpen] = useState(false);
  const thumb = buildThumbnail({ videoId });
  const embedUrl = buildEmbedUrl({ videoId, playlistId });
  const label = playlistId && !videoId ? "Playlist" : "Vídeo";

  return (
    <>
      <button
        type="button"
        className="yt-card"
        onClick={() => setOpen(true)}
        aria-label={`Abrir player: ${title}`}
      >
        <div className="yt-card-thumb-wrap">
          {thumb ? (
            <img src={thumb} alt="" className="yt-card-thumb" loading="lazy" />
          ) : (
            <div className="yt-card-thumb yt-card-thumb-placeholder">
              <Icon name="play" size={36} />
            </div>
          )}
          <span className="yt-card-play">
            <Icon name="play" size={18} />
          </span>
        </div>
        <div className="yt-card-info">
          <span className="yt-card-badge">{label}</span>
          <span className="yt-card-title">{title}</span>
        </div>
      </button>

      {open && (
        <div
          className="modal-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-content modal-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setOpen(false)}
              aria-label="Fechar player"
            >
              <Icon name="close" size={18} />
            </button>
            <h3 className="modal-video-title">{title}</h3>
            <div className="yt-embed-wrap">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                  Abrir no YouTube
                </a>
              )}
            </div>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-modal-external"
            >
              Abrir no YouTube ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
};

const MarkdownView = ({ children }) => {
  const [theme, setTheme] = useState(getActiveTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getActiveTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const codeStyle = theme === "dark" ? oneDark : oneLight;

  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const yt = parseYouTubeUrl(href);
            if (yt && (yt.videoId || yt.playlistId)) {
              return (
                <YouTubeCard
                  videoId={yt.videoId}
                  playlistId={yt.playlistId}
                  title={String(children)}
                  originalUrl={href}
                />
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (inline || !match) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <SyntaxHighlighter
                language={match[1]}
                style={codeStyle}
                PreTag="pre"
                customStyle={{ background: "transparent" }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownView;
