const POPULAR_DISHES = [
  { emoji: "🍝", name: "Pasta" },
  { emoji: "🍕", name: "Pizza" },
  { emoji: "🍛", name: "Curry" },
  { emoji: "🥗", name: "Salad" },
  { emoji: "🍜", name: "Noodle Soup" },
  { emoji: "🍳", name: "Omelette" },
  { emoji: "🥘", name: "Stir-fry" },
  { emoji: "🍲", name: "Stew" },
  { emoji: "🌮", name: "Tacos" },
  { emoji: "🍚", name: "Biryani" },
  { emoji: "🥞", name: "Pancakes" },
  { emoji: "🍔", name: "Burger" },
  { emoji: "🥙", name: "Wrap" },
  { emoji: "🍰", name: "Cake" },
];

export default function DishSidebar({
  isOpen,
  onToggle,
  onPickDish,
  onClearHistory,
  isLoading,
  activeDish,
  recentDishes = [],
}) {
  const filteredPopular = POPULAR_DISHES.filter(
    (d) =>
      !recentDishes.some(
        (r) => r.name.toLowerCase() === d.name.toLowerCase()
      )
  );

  return (
    <>
      {/* Floating tab — only visible when panel is CLOSED */}
      {!isOpen && (
        <button
          type="button"
          className="dish-tab"
          onClick={onToggle}
          aria-label="Open dish panel"
        >
          <span className="dish-tab-icon">🍽️</span>
          <span className="dish-tab-label">Dishes</span>
        </button>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="dish-backdrop" onClick={onToggle} aria-hidden="true" />
      )}

      {/* Slide-in panel */}
      <aside
        className={`dish-sidebar ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        {/* Close button INSIDE the panel */}
        <button
          type="button"
          className="dish-close"
          onClick={onToggle}
          aria-label="Close dish panel"
        >
          ✕
        </button>

        <div className="dish-sidebar-header">
          <span className="dish-sidebar-dot" />
          <h3>Make a specific dish</h3>
        </div>
        <p className="dish-sidebar-sub">
          Tap a dish — we'll cook it with your ingredients, or a classic
          version if your list is empty.
        </p>

        {recentDishes.length > 0 && (
          <div className="dish-section">
            <div className="dish-section-title">
              <span className="dish-section-dot recent" />
              Recently cooked
              <button
                type="button"
                className="dish-clear"
                onClick={onClearHistory}
              >
                clear
              </button>
            </div>
            <div className="dish-list">
              {recentDishes.map((dish) => {
                const isActive = activeDish === dish.name;
                return (
                  <button
                    key={`recent-${dish.name}`}
                    type="button"
                    className={`dish-btn recent ${isActive ? "active" : ""}`}
                    onClick={() => onPickDish(dish.name)}
                    disabled={isLoading}
                  >
                    <span className="dish-emoji">{dish.emoji}</span>
                    <span className="dish-name">{dish.name}</span>
                    {isActive && isLoading ? (
                      <span className="dish-spinner" />
                    ) : (
                      <span className="dish-arrow">→</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="dish-section">
          <div className="dish-section-title">
            <span className="dish-section-dot" />
            Popular dishes
          </div>
          <div className="dish-list">
            {filteredPopular.map((dish) => {
              const isActive = activeDish === dish.name;
              return (
                <button
                  key={dish.name}
                  type="button"
                  className={`dish-btn ${isActive ? "active" : ""}`}
                  onClick={() => onPickDish(dish.name)}
                  disabled={isLoading}
                >
                  <span className="dish-emoji">{dish.emoji}</span>
                  <span className="dish-name">{dish.name}</span>
                  {isActive && isLoading ? (
                    <span className="dish-spinner" />
                  ) : (
                    <span className="dish-arrow">→</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}

export { POPULAR_DISHES };