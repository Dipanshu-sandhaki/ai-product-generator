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
  if (letters.length === 0) return false;
  const vowels = (letters.match(/[aeiouAEIOU]/g) || []).length;
  const ratio = vowels / letters.length;
  return ratio >= 0.1;
}

function hasConsonantCluster(str) {
  return /[^aeiou\s\d\W]{5,}/i.test(str);
}

function looksLikeGibberish(str) {
  const words = str.trim().split(/\s+/);
  const badWords = words.filter((w) => {
    if (w.length < 3) return true;
    const letters = w.replace(/[^a-zA-Z]/g, "");
    if (!letters) return false;
    const vowels = (letters.match(/[aeiouAEIOU]/g) || []).length;
    return vowels === 0;
  });
  return badWords.length === words.length;
}

function runCommonChecks(v, label) {
  if (!v) return `${label} is required.`;
  if (v.length < 3) return `${label} must be at least 3 characters.`;

  for (const re of BLACKLIST) {
    if (re.test(v)) return `${label} contains invalid content.`;
  }

  const lower = v.toLowerCase();
  for (const word of SUSPICIOUS_WORDS) {
    if (lower.includes(word))
      return `Please enter a real ${label.toLowerCase()}.`;
  }

  if (/^\d+$/.test(v)) return `${label} cannot be only numbers.`;
  if (/^[^a-zA-Z0-9]*$/.test(v))
    return `${label} must contain letters or numbers.`;

  if (looksLikeGibberish(v))
    return `${label} appears to be gibberish. Please enter a real value.`;
  if (!hasEnoughVowels(v))
    return `${label} doesn't look like a real word. Please be more specific.`;
  if (hasConsonantCluster(v))
    return `${label} contains an unrecognizable character sequence.`;

  return null;
}

export function validateProductName(value) {
  const v = value.trim();
  const base = runCommonChecks(v, "Product name");
  if (base) return base;
  if (v.length > 60) return "Product name must be under 60 characters.";
  if (!/^[a-zA-Z0-9][\w\s\-&.']{1,59}$/.test(v))
    return "Product name contains invalid characters.";
  return null;
}

export function validateCategory(value) {
  const v = value.trim();
  const base = runCommonChecks(v, "Category");
  if (base) return base;
  if (v.length > 40) return "Category must be under 40 characters.";
  if (!/^[a-zA-Z][\w\s\-&]{1,39}$/.test(v))
    return "Category contains invalid characters.";
  return null;
}

export function validateBoth(name, category) {
  return {
    nameError: validateProductName(name),
    categoryError: validateCategory(category),
  };
}
