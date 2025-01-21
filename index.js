// document.addEventListener('DOMContentLoaded', function() {
//     const preloader = document.querySelector('.preloader');
//     // Если прелоадера нет на странице, прекращаем выполнение
//     if (!preloader) return;
    
//     const video = document.getElementById('preloader-video');
//     const mainContent = document.querySelector('.main-content');
    
//     // Проверяем, находимся ли мы на главной странице
//     const isHomePage = window.location.pathname === '/' || 
//                       window.location.pathname === '/index.html';
    
//     // Если это не главная страница, скрываем прелоадер
//     if (!isHomePage) {
//         preloader.style.display = 'none';
//         mainContent.style.display = 'block';
//         return;
//     }

//     // Воспроизводим видео только на главной странице
//     video.play().catch(function(error) {
//         console.log("Ошибка воспроизведения видео:", error);
//         // В случае ошибки сразу показываем контент
//         preloader.style.display = 'none';
//         mainContent.style.display = 'block';
//     });

//     // Когда видео закончится
//     video.addEventListener('ended', function() {
//         preloader.style.display = 'none';
//         mainContent.style.display = 'block';
//     });
// });
