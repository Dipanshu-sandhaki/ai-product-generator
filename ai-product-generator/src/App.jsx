import { useState } from "react";
import Form from "./components/Form";
import ProductCard from "./components/ProductCard";
import Loader from "./components/Loader";
import { generateProductDetails } from "./services/aiService";
import "./styles/app.css";

const RefreshIcon = () => (
  <svg
    className="refresh-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.36-3.36L23 10M1 14l5.13 4.36A9 9 0 0020.49 15" />
  </svg>
);

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async (name, category) => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const result = await generateProductDetails(name, category);
      setData(result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError("");
    setLoading(false);
  };

  return (
    <div className="app-wrapper">
      <header className="hero">
        <div className="hero-chip">
          <span className="hero-chip-dot" />
          AI Powered
        </div>
        <h1>
          Product <em>Generator</em>
        </h1>
        <p>
          Turn a product name and category into a compelling title, description,
          and tags — instantly.
        </p>
      </header>

      <div className="form-section">
        {(data || error) && (
          <button className="refresh-btn" onClick={handleReset} title="Refresh">
            <RefreshIcon />
            Refresh
          </button>
        )}

        <Form
          onGenerate={handleGenerate}
          loading={loading}
          hasResult={!!data}
          resetTrigger={data === null && !loading}
        />
      </div>

      {loading && <Loader />}
      {error && <p className="error-banner">{error}</p>}
      {data && <ProductCard data={data} />}
    </div>
  );
}

export default App;
