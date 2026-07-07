function ThemeToggle({
  darkMode,
  toggleTheme,
}) {
  return (
    <button onClick={toggleTheme}>
      {darkMode
        ? "☀️ Light Mode"
        : "🌙 Dark Mode"}
    </button>
  );
}

export default ThemeToggle;