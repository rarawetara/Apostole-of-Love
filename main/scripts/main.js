document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    // Если прелоадера нет на странице, прекращаем выполнение
    if (!preloader) return;
    
    const video = document.getElementById('preloader-video');
    const mainContent = document.querySelector('.main-content');
    
    // Проверяем, находимся ли мы на главной странице
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname.includes('index.html');
    
    // Если это не главная страница, скрываем прелоадер
    if (!isHomePage) {
        preloader.style.display = 'none';
        mainContent.style.display = 'block';
        return;
    }

    // Воспроизводим видео только на главной странице
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
