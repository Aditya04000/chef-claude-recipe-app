import { useState } from "react";

export default function WelcomeModal({ onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      emoji: "👨‍🍳",
      title: "Welcome to Chef Claude!",
      description:
        "Your personal AI chef that turns whatever's in your kitchen into a delicious recipe — in seconds.",
      cta: "Show me how →",
    },
    {
      emoji: "🥕",
      title: "Step 1: Add your ingredients",
      description:
        "Type any ingredient you have on hand and click 'Add ingredient'. Add at least 4 to unlock the recipe magic.",
      cta: "Got it, next →",
    },
    {
      emoji: "✨",
      title: "Step 2: Get a recipe",
      description:
        "Once you've added 4 or more ingredients, tap 'Get a recipe' and our AI will cook up a custom dish just for you.",
      cta: "Let's cook! 🔥",
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  function handleNext() {
    if (isLast) {
      onClose();
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="welcome-overlay" onClick={onClose}>
      <div
        className="welcome-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="welcome-close"
          onClick={onClose}
          aria-label="Close welcome"
        >
          ×
        </button>

        <div className="welcome-emoji">{current.emoji}</div>

        <h2 className="welcome-title">{current.title}</h2>
        <p className="welcome-description">{current.description}</p>

        <div className="welcome-dots">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`welcome-dot ${i === step ? "active" : ""}`}
            />
          ))}
        </div>

        <button className="welcome-btn" onClick={handleNext}>
          {current.cta}
        </button>

        {!isLast && (
          <button className="welcome-skip" onClick={onClose}>
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
}