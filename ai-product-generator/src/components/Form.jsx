import { useState, useEffect } from "react";
import { validateProductName, validateCategory } from "../utils/validate";

const FloatingInput = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  onBlur,
}) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div
      className={[
        "float-wrap",
        lifted ? "lifted" : "",
        focused ? "focused" : "",
        error ? "has-error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        placeholder={lifted ? placeholder : ""}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        autoComplete="off"
      />
      <span className="float-line" />
      {error && <p className="field-error">⚠ {error}</p>}
    </div>
  );
};

const Form = ({ onGenerate, loading, hasResult, resetTrigger }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({ name: null, category: null });

  useEffect(() => {
    if (resetTrigger) {
      setName("");
      setCategory("");
      setErrors({ name: null, category: null });
    }
  }, [resetTrigger]);

  const validate = () => {
    const nameErr = validateProductName(name);
    const catErr = validateCategory(category);
    setErrors({ name: nameErr, category: catErr });
    return !nameErr && !catErr;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onGenerate(name.trim(), category.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="form-card" noValidate>
      <FloatingInput
        id="name"
        label="Product Name"
        placeholder="Smart Fitness Watch Pro X"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) {
            setErrors((p) => ({
              ...p,
              name: validateProductName(e.target.value),
            }));
          }
        }}
        onBlur={() =>
          setErrors((p) => ({
            ...p,
            name: validateProductName(name),
          }))
        }
        error={errors.name}
      />

      <FloatingInput
        id="category"
        label="Category"
        placeholder="Wearable Technology"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          if (errors.category) {
            setErrors((p) => ({
              ...p,
              category: validateCategory(e.target.value),
            }));
          }
        }}
        onBlur={() =>
          setErrors((p) => ({
            ...p,
            category: validateCategory(category),
          }))
        }
        error={errors.category}
      />

      {hasResult ? (
        <button
          type="submit"
          className={`regen-btn${loading ? " spinning" : ""}`}
          disabled={loading}
        >
          <svg
            className="regen-icon"
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
          {loading ? "Regenerating…" : "Regenerate"}
        </button>
      ) : (
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Generating…" : "Generate Details →"}
        </button>
      )}
    </form>
  );
};

export default Form;
