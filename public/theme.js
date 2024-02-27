document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeStyle = document.getElementById('theme-style');
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    updateTheme(currentTheme);
    updateThemeToggleSymbol(currentTheme); // Set initial theme toggle button symbol

    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        if (currentTheme === 'light') {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light';
        }
        updateTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
        window.location.reload();
    });

    function updateTheme(theme) {
        themeStyle.href = `${theme}-theme.css`;
        document.documentElement.setAttribute('data-theme', theme);
    }

    function updateThemeToggleSymbol(theme) {
        themeToggle.innerHTML = `<span class="material-symbols-outlined">${theme === 'light' ? 'dark_mode' : 'light_mode'}</span>`;
    }
});
