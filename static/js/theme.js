// Theme toggle functionality
(function() {
  const STORAGE_KEY = 'mymonad-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  // Get system preference
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  // Get stored preference or null
  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  // Get effective theme (stored > system)
  function getEffectiveTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  // Apply theme to document
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcon(theme);
  }

  // Update which icon is visible
  function updateToggleIcon(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    const sunIcon = toggle.querySelector('.icon-sun');
    const moonIcon = toggle.querySelector('.icon-moon');

    if (theme === DARK) {
      // In dark mode, show sun (to switch to light)
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      // In light mode, show moon (to switch to dark)
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }

  // Toggle theme
  function toggleTheme() {
    const current = getEffectiveTheme();
    const next = current === DARK ? LIGHT : DARK;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Initialize on page load
  function init() {
    // Apply theme immediately (before DOM ready to prevent flash)
    const theme = getEffectiveTheme();
    applyTheme(theme);

    // Set up toggle button when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      const toggle = document.querySelector('.theme-toggle');
      if (toggle) {
        toggle.addEventListener('click', toggleTheme);
        updateToggleIcon(getEffectiveTheme());
      }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Only apply system change if no stored preference
      if (!getStoredTheme()) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
  }

  init();
})();
