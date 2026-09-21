import { forwardRef } from "react";

const IngredientsList = forwardRef(function IngredientsList(props, ref) {
  return (
    <section>
      <h2>Ingredients on hand:</h2>
      <ul className="ingredients-list" aria-live="polite">
        {props.IngredientsList}
      </ul>
      {props.Ingredients.length > 3 && (
        <div className="get-recipe-container" ref={ref}>
          <div>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button onClick={props.getRecipe} disabled={props.isLoading}>
            {props.isLoading ? "Thinking..." : "Get a recipe"}
          </button>
        </div>
      )}
    </section>
  );
});

export default IngredientsList;