document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.querySelector(".preloader");
    const video = document.getElementById("preloader-video");
    const mainContent = document.querySelector(".main-content");

    if (!preloader || !mainContent) {
        console.warn("Preloader или main-content не найдены!");
        return;
    }

    // Определяем, что это главная страница
    const isHomePage =
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/index.html");

    // Проверяем поддержку видео на устройстве
    const isVideoSupported = video && video.canPlayType &&
        (video.canPlayType('video/mp4') !== '' || video.canPlayType('video/webm') !== '');

    // Если не главная страница или видео не поддерживается, сразу показываем контент
    if (!isHomePage || !isVideoSupported) {
        hidePreloader();
        return;
    }

    let isFirstVisit = false;
    let canUseSessionStorage = true;

    try {
        if (!sessionStorage.getItem("hasVisited")) {
            isFirstVisit = true;
            sessionStorage.setItem("hasVisited", "true");
        }
    } catch (e) {
        console.warn("SessionStorage недоступен!", e);
        canUseSessionStorage = false;
    }

    let isBackNavigation = false;
    if (performance && typeof performance.getEntriesByType === "function") {
        const navigationEntries = performance.getEntriesByType("navigation");
        isBackNavigation = navigationEntries.length > 0 && navigationEntries[0].type === "back_forward";
    } else {
        console.warn("Performance navigation not supported; skipping back detection");
    }

    if (!isFirstVisit || isBackNavigation) {
        hidePreloader();
        return;
    }

    // Показываем прелоадер
    preloader.style.display = "flex";
    mainContent.style.visibility = "hidden";
    mainContent.style.opacity = "0";
    mainContent.style.transition = "opacity 0.3s ease-out";

    // Оптимизация для мобильных устройств
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";

    // Уменьшаем таймаут для мобильных устройств
    const timeoutDuration = 5000;

    const preloaderTimeout = setTimeout(() => {
        if (preloader && preloader.style.display !== "none") {
            console.warn("Таймер: Прелоадер скрылся принудительно.");
            hidePreloader();
        }
    }, timeoutDuration);

    video.play()
        .then(() => console.log("Видео успешно запустилось"))
        .catch((error) => {
            console.error("Ошибка воспроизведения видео:", error);
            clearTimeout(preloaderTimeout);
            hidePreloader();
        });

    video.addEventListener("ended", () => {
        clearTimeout(preloaderTimeout);
        hidePreloader();
    });

    function hidePreloader() {
        preloader.remove();
        mainContent.style.visibility = "visible";
        requestAnimationFrame(() => {
            mainContent.style.opacity = "1";
        });
        initPage();
    }

    function initPage() {
        initNavigation();
        initLanguageSwitcher();
        initMobileNav();
        initTextBlocks();

        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                console.log("Выполняем менее важные инициализации...");
                // Можно добавить доп. код для неважных задач
            });
        }
    }

    function initNavigation() {
        const currentPage = window.location.pathname.split("/").pop();
        const navList = document.querySelector(".main-nav ul");

        if (navList) {
            if (currentPage === "index.html" || currentPage === "" || currentPage === "/") {
                navList.classList.add("all-active");
            } else {
                document.querySelectorAll(".main-nav a").forEach((link) => {
                    if (link.getAttribute("href")?.endsWith(currentPage)) {
                        link.innerHTML = `<span class="active-page">${link.textContent}</span>`;
                    }
                });
            }
        }
    }

    function initLanguageSwitcher() {
        const langOptions = document.querySelectorAll(".lang-options div");
        const currentLang = document.querySelector(".current-lang");
        let currentLanguage = localStorage.getItem("language") || "en";

        function updatePageContent(lang) {
            document.querySelectorAll("[data-translate]").forEach((element) => {
                const key = element.getAttribute("data-translate");
                if (translations?.[lang]?.[key]) {
                    if (["INPUT", "TEXTAREA"].includes(element.tagName)) {
                        element.placeholder = translations[lang][key];
                    } else {
                        element.innerHTML = translations[lang][key];
                    }
                }
            });

            if (currentLang && translations?.[lang]) {
                currentLang.textContent = translations[lang].language;
            }

            localStorage.setItem("language", lang);
            currentLanguage = lang;
        }

        langOptions.forEach((option) => {
            option.addEventListener("click", () => {
                const newLang = option.getAttribute("data-lang");
                if (newLang && newLang !== currentLanguage) {
                    updatePageContent(newLang);
                }
            });
        });

        updatePageContent(currentLanguage);
    }

    function initMobileNav() {
        const mainNav = document.querySelector(".main-nav");
        const navListMobile = mainNav?.querySelector("ul");

        if (mainNav && navListMobile) {
            let resizeTimeout;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (window.innerWidth > 768) {
                        navListMobile.classList.remove("active");
                        mainNav.classList.remove("active");
                    }
                }, 250);
            };

            window.addEventListener("resize", handleResize);

            function initializeMobileNav() {
                mainNav.addEventListener("click", (e) => {
                    if (!e.target.closest("a")) {
                        mainNav.classList.toggle("active");
                    }
                });

                document.addEventListener("click", (e) => {
                    if (!e.target.closest(".main-nav")) {
                        mainNav.classList.remove("active");
                    }
                });

                mainNav.querySelectorAll("a").forEach((link) => {
                    link.addEventListener("click", () => {
                        mainNav.classList.remove("active");
                    });
                });
            }

            initializeMobileNav();
        }
    }

    function initTextBlocks() {
        document.querySelectorAll(".text-block").forEach((block) => {
            const closeButton = document.createElement("button");
            closeButton.className = "close-text-block";
            closeButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
            block.appendChild(closeButton);
            closeButton.style.display = "none";

            block.addEventListener("click", () => {
                if (!block.classList.contains("expanded")) expandBlock(block);
            });

            closeButton.addEventListener("click", (e) => {
                e.stopPropagation();
                collapseBlock(block);
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && block.classList.contains("expanded")) {
                    collapseBlock(block);
                }
            });
        });
    }
});