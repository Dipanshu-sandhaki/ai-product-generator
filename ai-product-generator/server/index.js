import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Shared validation

const BLACKLIST = [
  /\b(drop|delete|truncate|select|insert|update|exec|script|alert|hack|exploit|inject|xss|sql|rm\s+-rf|system|eval|fetch|import|require|process|window|document)\b/i,
  /<[^>]*>/,
  /[{}[\]\\|`~^@#$%*+=]/,
  /(.)\1{3,}/,
];

const SUSPICIOUS_WORDS = [
  "ignore",
  "forget",
  "pretend",
  "act as",
  "jailbreak",
  "bypass",
  "sudo",
  "admin",
  "root",
  "null",
  "undefined",
  "test123",
  "asdf",
  "qwerty",
  "lorem",
  "foo",
  "bar",
  "baz",
  "blah",
  "yolo",
];

function hasEnoughVowels(str) {
  const letters = str.replace(/[^a-zA-Z]/g, "");
  if (!letters.length) return false;
  const ratio = (letters.match(/[aeiouAEIOU]/g) || []).length / letters.length;
  return ratio >= 0.1;
}

function hasConsonantCluster(str) {
  return /[^aeiou\s\d\W]{5,}/i.test(str);
}

function looksLikeGibberish(str) {
  const words = str.trim().split(/\s+/);
  const bad = words.filter((w) => {
    if (w.length < 3) return true;
    const letters = w.replace(/[^a-zA-Z]/g, "");
    return letters && (letters.match(/[aeiouAEIOU]/g) || []).length === 0;
  });
  return bad.length === words.length;
}

function validateField(value, label, maxLen, pattern) {
  const v = String(value || "").trim();

  if (!v) return `${label} is required.`;
  if (v.length < 3) return `${label} must be at least 3 characters.`;
  if (v.length > maxLen) return `${label} must be under ${maxLen} characters.`;
  if (pattern && !pattern.test(v))
    return `${label} contains invalid characters.`;

  for (const re of BLACKLIST) {
    if (re.test(v)) return `${label} contains invalid content.`;
  }

  const lower = v.toLowerCase();
  for (const word of SUSPICIOUS_WORDS) {
    if (lower.includes(word))
      return `Please enter a real ${label.toLowerCase()}.`;
  }

  if (/^\d+$/.test(v)) return `${label} cannot be only numbers.`;
  if (looksLikeGibberish(v)) return `${label} appears to be gibberish.`;
  if (!hasEnoughVowels(v)) return `${label} doesn't look like a real word.`;
  if (hasConsonantCluster(v))
    return `${label} contains an unrecognizable sequence.`;

  return null;
}

// Validation middleware

function validateInput(req, res, next) {
  const { name, category } = req.body;

  const nameError = validateField(
    name,
    "Product name",
    60,
    /^[a-zA-Z0-9][\w\s\-&.']{1,59}$/,
  );
  const categoryError = validateField(
    category,
    "Category",
    40,
    /^[a-zA-Z][\w\s\-&]{1,39}$/,
  );

  if (nameError || categoryError) {
    return res.status(400).json({ error: nameError || categoryError });
  }

  next();
}

// Routes

app.get("/", (req, res) => res.send("Server running"));

app.post("/generate", validateInput, async (req, res) => {
  const { name, category } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You ONLY return valid JSON. No explanation.",
          },
          {
            role: "user",
            content: `You are an AI product copywriter.

Generate a COMPLETE product response in JSON format ONLY.

Rules:
- description MUST be 3-6 lines long (minimum 30 words)
- description should explain features, benefits, and use-case
- DO NOT repeat category as description
- tags should be 5-10 relevant keywords

Return STRICT JSON:
{
  "title": "",
  "description": "",
  "tags": []
}

Product Name: ${name}
Category: ${category}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AI Product Generator",
        },
      },
    );

    const text = response.data.choices[0].message.content;

    let parsed;
    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      parsed = JSON.parse(text.slice(jsonStart, jsonEnd));
    } catch {
      parsed = {};
    }

    const finalData = {
      title: parsed.title || name,
      description:
        parsed.description &&
        parsed.description.length > 20 &&
        parsed.description !== category
          ? parsed.description
          : `The ${name} is a premium ${category} product designed to deliver excellent performance, smart features, and a seamless user experience. Ideal for modern users seeking reliability and efficiency.`,
      tags:
        Array.isArray(parsed.tags) && parsed.tags.length > 0
          ? parsed.tags
          : [category, "smart", "modern"],
    };

    res.json(finalData);
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: "AI failed",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
