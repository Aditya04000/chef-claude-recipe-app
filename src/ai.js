// src/ai.js

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";

function getApiKey() {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "Missing Groq API key. Add VITE_GROQ_API_KEY to Vercel (Settings → Environment Variables) and redeploy."
    );
  }
  return key;
}

async function callGroq(prompt) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Groq API error:", response.status, errText);
    throw new Error(`Groq API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Generate a recipe from a list of ingredients.
 */
export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  const prompt = `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page. Please respond with only the recipe, no extra text before or after.

Ingredients I have: ${ingredientsString}`;

  return callGroq(prompt);
}

/**
 * Generate a recipe for a specific dish, optionally using the user's ingredients.
 */
export async function getRecipeForDish(dishName, ingredientsArr = []) {
  const ingredientsString =
    ingredientsArr.length > 0
      ? `I have these ingredients: ${ingredientsArr.join(", ")}. `
      : "";

  const prompt = `You are a professional chef. ${ingredientsString}Please provide a detailed, delicious recipe for ${dishName}. Try to incorporate the ingredients I have where it makes sense, but you can add other common ingredients as needed. Format your response in markdown (use headings, lists, etc.). Respond with only the recipe, no extra text before or after.`;

  return callGroq(prompt);
}