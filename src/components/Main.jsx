import { useState, useEffect, useRef, useMemo } from "react";
import MyIngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import WelcomeModal from "./WelcomeModal";
import DishSidebar, { POPULAR_DISHES } from "./DishSidebar";
import { getRecipeFromMistral, getRecipeForDish } from "../ai";

const ALL_INGREDIENTS = [
  { emoji: "🍅", name: "tomato" },
  { emoji: "🧄", name: "garlic" },
  { emoji: "🍗", name: "chicken" },
  { emoji: "🧀", name: "cheese" },
  { emoji: "🌿", name: "basil" },
  { emoji: "🥕", name: "carrot" },
  { emoji: "🧅", name: "onion" },
  { emoji: "🥔", name: "potato" },
  { emoji: "🥬", name: "spinach" },
  { emoji: "🍄", name: "mushroom" },
  { emoji: "🫑", name: "bell pepper" },
  { emoji: "🥦", name: "broccoli" },
  { emoji: "🌽", name: "corn" },
  { emoji: "🥒", name: "cucumber" },
  { emoji: "🍋", name: "lemon" },
  { emoji: "🥚", name: "egg" },
  { emoji: "🍚", name: "rice" },
  { emoji: "🍝", name: "pasta" },
];

const RECENT_ING_KEY = "chefClaudeRecentIngredients";
const RECENT_DISH_KEY = "chefClaudeRecentDishes";
const MAX_RECENT = 5;
const MAX_RECENT_DISHES = 5;
const SUGGESTION_COUNT = 6;

function pickRandom(arr, count) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function getEmojiForDish(name) {
  const found = POPULAR_DISHES.find(
    (d) => d.name.toLowerCase() === name.toLowerCase()
  );
  return found ? found.emoji : "🍽️";
}

export default function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [recentIngredients, setRecentIngredients] = useState([]);
  const [recentDishes, setRecentDishes] = useState([]);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [activeDish, setActiveDish] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const recipeSection = useRef(null);

  // Load everything from localStorage on mount
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("chefClaudeWelcomeSeen");
    if (!hasSeenWelcome) setShowWelcome(true);

    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_ING_KEY) || "[]");
      if (Array.isArray(stored)) setRecentIngredients(stored);
    } catch {
      /* ignore */
    }

    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_DISH_KEY) || "[]");
      if (Array.isArray(stored)) setRecentDishes(stored);
    } catch {
      /* ignore */
    }
  }, []);

  function closeWelcome() {
    setShowWelcome(false);
    localStorage.setItem("chefClaudeWelcomeSeen", "true");
  }

  // Persist recent ingredients
  useEffect(() => {
    if (ingredients.length === 0) return;
    setRecentIngredients((prev) => {
      const merged = [...ingredients, ...prev];
      const unique = Array.from(new Set(merged.map((s) => s.toLowerCase())));
      const trimmed = unique.slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_ING_KEY, JSON.stringify(trimmed));
      return trimmed;
    });
  }, [ingredients]);

  // Scroll to recipe when it appears
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
    setActiveDish(null);
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

  async function handlePickDish(dishName) {
    // Close sidebar immediately so user returns to the main lobby
    setSidebarOpen(false);

    setIsLoading(true);
    setError("");
    setActiveDish(dishName);

    // Save to recent dishes immediately
    setRecentDishes((prev) => {
      const filtered = prev.filter(
        (d) => d.name.toLowerCase() !== dishName.toLowerCase()
      );
      const updated = [
        { name: dishName, emoji: getEmojiForDish(dishName) },
        ...filtered,
      ].slice(0, MAX_RECENT_DISHES);
      localStorage.setItem(RECENT_DISH_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      const recipeMarkdown = await getRecipeForDish(dishName, ingredients);
      setRecipe(recipeMarkdown);
    } catch (err) {
      setError(`Failed to generate a ${dishName} recipe. Please try again.`);
      console.error(err);
      setActiveDish(null);
    } finally {
      setIsLoading(false);
    }
  }

  function clearRecentDishes() {
    setRecentDishes([]);
    localStorage.removeItem(RECENT_DISH_KEY);
  }

  function reset() {
    setRecipe("");
    setIngredients([]);
    setError("");
    setActiveDish(null);
  }

  function addByName(rawName) {
    const trimmed = rawName.trim();
    if (!trimmed) return;
    setIngredients((prev) =>
      prev.some((i) => i.toLowerCase() === trimmed.toLowerCase())
        ? prev
        : [...prev, trimmed]
    );
  }

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    if (!newIngredient) return;
    addByName(newIngredient);
  }

  function clearRecentIngredients() {
    setRecentIngredients([]);
    localStorage.removeItem(RECENT_ING_KEY);
  }

  function shuffleSuggestions() {
    setShuffleSeed((s) => s + 1);
  }

  const ingredientsListItems = ingredients.map((ingredient) => (
    <li key={ingredient}>{ingredient}</li>
  ));

  const shownSuggestions = useMemo(() => {
    const pool = ALL_INGREDIENTS.filter(
      (s) =>
        !ingredients.some((i) => i.toLowerCase() === s.name.toLowerCase())
    );
    return pickRandom(pool, SUGGESTION_COUNT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleSeed, ingredients.length]);

  const availableRecentIngredients = recentIngredients.filter(
    (name) => !ingredients.some((i) => i.toLowerCase() === name.toLowerCase())
  );

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

      {ingredients.length === 0 && !showWelcome && !isLoading && (
        <div className="empty-state">
          <div className="empty-emoji">🥘</div>
          <h2>Nothing cooking yet</h2>
          <p>
            Tap any ingredient below — or pick a dish from the side panel to
            get started.
          </p>
        </div>
      )}

      {shownSuggestions.length > 0 && !isLoading && (
        <section className="suggestions-block">
          <h3 className="suggestions-title">
            <span className="suggestions-dot" />
            Try these
            <button
              type="button"
              className="shuffle-btn"
              onClick={shuffleSuggestions}
              aria-label="Shuffle suggestions"
            >
              🎲 shuffle
            </button>
          </h3>
          <div className="chips-row">
            {shownSuggestions.map((s) => (
              <button
                key={s.name}
                type="button"
                className="hint-chip clickable"
                onClick={() => addByName(s.name)}
              >
                <span className="chip-emoji">{s.emoji}</span>
                {s.name}
                <span className="chip-plus">+</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {availableRecentIngredients.length > 0 && !isLoading && (
        <section className="suggestions-block">
          <h3 className="suggestions-title">
            <span className="suggestions-dot recent" />
            Recently used
            <button
              type="button"
              className="clear-recent"
              onClick={clearRecentIngredients}
              aria-label="Clear recent ingredients"
            >
              clear
            </button>
          </h3>
          <div className="chips-row">
            {availableRecentIngredients.map((name) => (
              <button
                key={name}
                type="button"
                className="hint-chip clickable recent-chip"
                onClick={() => addByName(name)}
              >
                {name}
                <span className="chip-plus">+</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {ingredients.length > 0 && !isLoading && !activeDish && (
        <MyIngredientsList
          ref={recipeSection}
          IngredientsList={ingredientsListItems}
          Ingredients={ingredients}
          getRecipe={getRecipe}
          isLoading={isLoading}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      {/* Cooking loader — shown while a specific dish is being generated */}
      {isLoading && activeDish && (
        <div className="cooking-loader">
          <div className="cooking-emoji">👨‍🍳</div>
          <p>
            Whipping up your <strong>{activeDish}</strong>...
          </p>
          <div className="cooking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {recipe && !isLoading && (
        <ClaudeRecipe recipe={recipe} onReset={reset} />
      )}

      {/* Floating sidebar (tab + panel) */}
      <DishSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onPickDish={handlePickDish}
        onClearHistory={clearRecentDishes}
        isLoading={isLoading}
        activeDish={activeDish}
        recentDishes={recentDishes}
      />
    </main>
  );
}