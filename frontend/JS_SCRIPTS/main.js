window.addEventListener("load", () => {
    lucide.createIcons();

    const dropdownWrappers = document.querySelectorAll('.dropdown-wrapper');

    dropdownWrappers.forEach(wrapper => {
        const menu = wrapper.querySelector('.dropdown-menu');

        wrapper.addEventListener('mouseenter', () => {
            menu.classList.add('show');
        });

        wrapper.addEventListener('mouseleave', () => {
            menu.classList.remove('show');
        });
    });

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    const placeholder = document.getElementById('animatedPlaceholder');
    const input = document.getElementById('searchInput');

    const placeholders = [
        'Search elegant suits and formal wears...',
        'Find trendy traditional outfits...',
        'Discover new fashion collections...',
        'Explore styles for every season...'
    ];
    
    let i = 0;

    function changePlaceholder() {
        placeholder.classList.remove('animate');
        void placeholder.offsetWidth; // reflow to restart animation
        placeholder.classList.add('animate');
        placeholder.textContent = placeholders[i];
        i = (i + 1) % placeholders.length;
    }

    // Hide placeholder when user types
    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            placeholder.style.display = 'none';
        } else {
            placeholder.style.display = 'block';
        }
    });

    setInterval(changePlaceholder, 3000);
    changePlaceholder();
});