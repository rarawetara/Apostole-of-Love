document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    // Если прелоадера нет на странице, прекращаем выполнение
    if (!preloader) return;
    
    const video = document.getElementById('preloader-video');
    const mainContent = document.querySelector('.main-content');
    
    // Проверяем, находимся ли мы на главной странице
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname.includes('index.html');
    
    // Проверяем, первый ли это визит
    const isFirstVisit = !sessionStorage.getItem('hasVisited');
    
    // Если это не главная страница или не первый визит, скрываем прелоадер
    if (!isHomePage || !isFirstVisit) {
        preloader.style.display = 'none';
        mainContent.style.display = 'block';
        return;
    }

    // Отмечаем, что пользователь уже посетил сайт
    sessionStorage.setItem('hasVisited', 'true');

    // Воспроизводим видео только на главной странице при первом визите
    preloader.style.display = 'block';
    mainContent.style.display = 'none';
    
    video.play().catch(function(error) {
        console.log("Ошибка воспроизведения видео:", error);
        // В случае ошибки сразу показываем контент
        preloader.style.display = 'none';
        mainContent.style.display = 'block';
    });

    // Когда видео закончится
    video.addEventListener('ended', function() {
        preloader.style.display = 'none';
        mainContent.style.display = 'block';
    });

    // Остальной код для навигации и языков
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

    // Функционал переключения языков
    const languageSelector = document.querySelector('.language-selector');
    const langOptions = document.querySelectorAll('.lang-options div');
    const currentLang = document.querySelector('.current-lang');
    
    // Устанавливаем английский как язык по умолчанию
    let currentLanguage = localStorage.getItem('language') || 'en';
    
    function updatePageContent(lang) {
        // Обновляем навигацию
        document.querySelectorAll('[data-translate]').forEach(element => {
            const section = element.getAttribute('data-section');
            const key = element.getAttribute('data-translate');
            if (translations[section] && translations[section][lang] && translations[section][lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[section][lang][key];
                } else {
                    element.innerHTML = translations[section][lang][key];
                }
            }
        });

        // Обновляем текст селектора языка
        currentLang.textContent = translations.nav[lang].language;
        
        // Сохраняем выбранный язык
        localStorage.setItem('language', lang);
        currentLanguage = lang;
    }
    
    // Обработчики кликов по опциям языка
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const newLang = option.getAttribute('data-lang');
            if (newLang && newLang !== currentLanguage) {
                updatePageContent(newLang);
            }
        });
    });
    
    // Применяем сохраненный язык при загрузке
    updatePageContent(currentLanguage);
});

// Добавляем обработчик мобильной навигации
document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.querySelector('.main-nav');
    const navList = mainNav.querySelector('ul');

    function toggleMobileNav(e) {
        if (window.innerWidth <= 768) { // Для мобильных устройств
            if (e.target.closest('.main-nav')) {
                navList.classList.toggle('active');
            } else {
                navList.classList.remove('active');
            }
        }
    }

    document.addEventListener('click', toggleMobileNav);
});

function initializeMobileNav() {
    const nav = document.querySelector('.main-nav');
    
    function toggleNav(e) {
        // Проверяем, что клик был на самой навигации, а не на ссылках
        if (e.target.closest('.main-nav') && !e.target.closest('.main-nav a')) {
            nav.classList.toggle('active');
        }
    }

    // Добавляем обработчики для клика и тача
    nav.addEventListener('click', toggleNav);
    nav.addEventListener('touchstart', toggleNav);

    // Закрываем меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav')) {
            nav.classList.remove('active');
        }
    });

    // Закрываем меню при клике на ссылку
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
}

// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileNav();
});

function initializeTextBlocks() {
    const textBlocks = document.querySelectorAll('.text-block');
    
    textBlocks.forEach(block => {
        // Добавляем кнопку закрытия
        const closeButton = document.createElement('button');
        closeButton.className = 'close-text-block';
        closeButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        block.appendChild(closeButton);
        closeButton.style.display = 'none';

        // Обработчик клика по блоку
        block.addEventListener('click', function(e) {
            if (!block.classList.contains('expanded')) {
                expandBlock(block);
            }
        });

        // Обработчик для кнопки закрытия
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            collapseBlock(block);
        });

        // Обработчик клавиши Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && block.classList.contains('expanded')) {
                collapseBlock(block);
            }
        });

        // Обработчик свайпа вниз для мобильных устройств
        let touchStartY = 0;
        block.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        });

        block.addEventListener('touchmove', function(e) {
            if (!block.classList.contains('expanded')) return;
            
            const touchEndY = e.touches[0].clientY;
            const diff = touchEndY - touchStartY;
            
            if (diff > 100) { // Свайп вниз более 100px
                collapseBlock(block);
            }
        });
    });
}

function expandBlock(block) {
    block.classList.add('expanded');
    block.querySelector('.close-text-block').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function collapseBlock(block) {
    block.classList.remove('expanded');
    block.querySelector('.close-text-block').style.display = 'none';
    document.body.style.overflow = '';
}
