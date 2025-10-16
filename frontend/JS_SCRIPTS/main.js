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
        });
    