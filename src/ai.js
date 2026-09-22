import { InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.`;

const DISH_SYSTEM_PROMPT = `You are an expert chef. The user will ask for a specific dish. If they have provided ingredients, try to use as many of them as possible in the recipe. If they haven't provided ingredients, give them a classic, well-loved version of that dish. Format your response in markdown with a title, a short intro, an ingredients list, and numbered steps.`;

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  try {
    const hf = new InferenceClient(import.meta.env.VITE_HF_API_KEY);

    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Error generating recipe:", err);
    throw new Error(`Failed to generate recipe: ${err.message}`);
  }
}

export async function getRecipeForDish(dishName, ingredientsArr = []) {
  const hasIngredients = ingredientsArr.length > 0;
  const ingredientsString = ingredientsArr.join(", ");

  const userPrompt = hasIngredients
    ? `Make me a ${dishName}. I have these ingredients on hand: ${ingredientsString}. Use as many of them as possible.`
    : `Make me a ${dishName}. Give me a classic, delicious version of it.`;

  try {
    const hf = new InferenceClient(import.meta.env.VITE_HF_API_KEY);

    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: DISH_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1024,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Error generating dish recipe:", err);
    throw new Error(`Failed to generate recipe: ${err.message}`);
  }
}