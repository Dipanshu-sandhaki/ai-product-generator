export const generateProductDetails = async (name, category) => {
  const res = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, category })
  });

  if (!res.ok) throw new Error("API failed");

  return res.json();
};