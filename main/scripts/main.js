document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const navList = document.querySelector('.main-nav ul');
    
    // Если мы на главной странице (index.html или /)
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        navList.classList.add('all-active');
    } else {
        // Для остальных страниц подсвечиваем только соответствующий пункт меню
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (currentPage === linkPage) {
                const text = link.textContent;
                link.innerHTML = `<span class="active-page">${text}</span>`;
            }
        });
    }
});
