window.addEventListener("load", () => {
    lucide.createIcons();

    // Desktop dropdown functionality
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

    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const closeSidebar = document.querySelector('.close-sidebar');

    function openSidebar() {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebarFunc() {
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (mobileSidebar.classList.contains('active')) {
                closeSidebarFunc();
            } else {
                openSidebar();
            }
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunc);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebarFunc);
    }

    // Mobile dropdown toggles
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const dropdown = item.nextElementSibling;
            if (dropdown && dropdown.classList.contains('mobile-dropdown')) {
                item.classList.toggle('expanded');
                dropdown.classList.toggle('expanded');
            }
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

    // === IMAGE SLIDER ===
    const slider = document.querySelector('.imageSlider');
    const sliderTrack = document.querySelector('.slider-track');
    
    if (slider && sliderTrack) {
        const originalImages = Array.from(sliderTrack.querySelectorAll('.imageCarousel'));
        
        // Clone images 4x for truly seamless infinite loop
        for (let i = 0; i < 3; i++) {
            originalImages.forEach(img => {
                const clone = img.cloneNode(true);
                sliderTrack.appendChild(clone);
            });
        }
        
        function updateImageClasses() {
            const allImages = Array.from(sliderTrack.querySelectorAll('.imageCarousel'));
            const sliderRect = slider.getBoundingClientRect();
            const sliderCenter = sliderRect.left + sliderRect.width / 2;
            
            let closestIndex = 0;
            let minDistance = Infinity;
            
            // Find the image closest to center
            allImages.forEach((img, index) => {
                const imgRect = img.getBoundingClientRect();
                const imgCenter = imgRect.left + imgRect.width / 2;
                const distanceFromCenter = Math.abs(imgCenter - sliderCenter);
                
                if (distanceFromCenter < minDistance) {
                    minDistance = distanceFromCenter;
                    closestIndex = index;
                }
            });
            
            // Apply classes based on distance from center image
            allImages.forEach((img, index) => {
                img.classList.remove('active', 'prev', 'next', 'gen1', 'gen2', 'gen3');
                
                const distance = index - closestIndex;
                const absDistance = Math.abs(distance);
                
                if (absDistance === 0) {
                    img.classList.add('active');
                } else if (absDistance === 1) {
                    img.classList.add(distance < 0 ? 'prev' : 'next');
                } else if (absDistance === 2) {
                    img.classList.add('gen1');
                } else if (absDistance === 3) {
                    img.classList.add('gen2');
                } else {
                    img.classList.add('gen3');
                }
            });
        }
        
        // Update classes every 100ms for smooth transitions
        setInterval(updateImageClasses, 100);
        updateImageClasses();
    }

    // === TABS FUNCTIONALITY ===
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get the tab data attribute
            const tabType = tab.getAttribute('data-tab');
            console.log('Active tab:', tabType);
            // You can add logic here to show/hide different content based on the tab
        });
    });
});