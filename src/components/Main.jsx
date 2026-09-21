import { useState, useEffect, useRef } from "react";
import MyIngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import WelcomeModal from "./WelcomeModal";
import { getRecipeFromMistral } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const recipeSection = useRef(null);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("chefClaudeWelcomeSeen");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  function closeWelcome() {
    setShowWelcome(false);
    localStorage.setItem("chefClaudeWelcomeSeen", "true");
  }

  useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [recipe]);

  async function getRecipe() {
    setIsLoading(true);
    setError("");
    try {
      const recipeMarkdown = await getRecipeFromMistral(ingredients);
      setRecipe(recipeMarkdown);
    } catch (err) {
      setError("Failed to generate a recipe. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setRecipe("");
    setIngredients([]);
    setError("");
  }

  const ingredientsListItems = ingredients.map((ingredient) => (
    <li key={ingredient}>{ingredient}</li>
  ));

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    if (!newIngredient || newIngredient.trim() === "") return;
    const trimmed = newIngredient.trim();
    setIngredients((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
  }

  return (
    <main>
      {showWelcome && <WelcomeModal onClose={closeWelcome} />}

      <form action={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. oregano, chicken, rice..."
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button type="submit">Add ingredient</button>
      </form>

      {ingredients.length === 0 && !showWelcome && (
        <div className="empty-state">
          <div className="empty-emoji">🥘</div>
          <h2>Nothing cooking yet</h2>
          <p>
            Add your first ingredient above and let's see what Chef Claude
            can whip up for you!
          </p>
          <div className="empty-hints">
            <span className="hint-chip">🍅 tomato</span>
            <span className="hint-chip">🧄 garlic</span>
            <span className="hint-chip">🍗 chicken</span>
            <span className="hint-chip">🧀 cheese</span>
            <span className="hint-chip">🌿 basil</span>
          </div>
        </div>
      )}

      {ingredients.length > 0 && (
        <MyIngredientsList
          ref={recipeSection}
          IngredientsList={ingredientsListItems}
          Ingredients={ingredients}
          getRecipe={getRecipe}
          isLoading={isLoading}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      {recipe && <ClaudeRecipe recipe={recipe} onReset={reset} />}
    </main>
  );
}