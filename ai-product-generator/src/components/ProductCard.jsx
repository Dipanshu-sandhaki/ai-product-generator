import { useState } from "react";

const CopyIcon = () => (
  <svg
    className="copy-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="copy-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ProductCard = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    const tags = data.tags.map((t) => `#${t}`).join(" ");
    const full = `${data.title}\n\n${data.description}\n\n${tags}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="product-card">
      <div className="product-meta">
        <span className="product-label">AI Generated</span>
        <button
          className={`copy-btn${copied ? " copied" : ""}`}
          onClick={handleCopyAll}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy all"}
        </button>
      </div>

      <div className="product-body">
        <h2 className="product-title">{data.title}</h2>
        <div className="product-desc-wrap">
          <p className="product-desc">{data.description}</p>
        </div>
      </div>

      <div className="product-footer">
        <div className="tags">
          {data.tags.map((tag, i) => (
            <span key={i} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
