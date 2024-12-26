gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.image-container');

    containers.forEach(container => {
        const hoverImage = container.querySelector('.hover-image');
        
        // Начальное состояние
        gsap.set(hoverImage, {
            x: '100%',
            opacity: 0
        });

        // Создаем анимацию
        const animation = gsap.to(hoverImage, {
            x: '-50%',
            opacity: 1,
            duration: 0.3,
            paused: true,
            ease: "power2.out"
        });

        // Обработчики событий
        container.addEventListener('mouseenter', () => animation.play());
        container.addEventListener('mouseleave', () => animation.reverse());
    });
});
