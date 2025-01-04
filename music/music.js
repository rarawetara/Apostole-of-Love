document.addEventListener('DOMContentLoaded', function() {
    const textBlocks = document.querySelectorAll('.text-block');
    
    textBlocks.forEach((block, index) => {
        // Находим соответствующее изображение
        const imageBlock = block.parentElement.querySelector('.image-block img');
        
        // Создаем контейнер для развернутого контента
        const expandedContent = document.createElement('div');
        expandedContent.className = 'expanded-content';
        
        // Создаем элемент для изображения
        const expandedImage = document.createElement('img');
        expandedImage.className = 'expanded-image';
        expandedImage.src = imageBlock.src;
        expandedImage.alt = imageBlock.alt;
        
        // Добавляем элементы в блок
        expandedContent.appendChild(expandedImage);
        block.appendChild(expandedContent);

        // Добавляем обработчик клика
        block.addEventListener('click', function() {
            block.classList.toggle('expanded');
        });
    });

    // Закрытие по клику вне блока
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.text-block')) {
            textBlocks.forEach(block => {
                block.classList.remove('expanded');
            });
        }
    });
});
