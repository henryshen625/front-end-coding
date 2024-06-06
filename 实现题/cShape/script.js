const blocks = document.querySelectorAll('.block');
    let clickedCount = 0;

    blocks.forEach(block => {
        block.addEventListener('click', () => {
            if (block.style.backgroundColor === 'green') {
                block.style.backgroundColor = 'white';
                clickedCount--;
            } else {
                block.style.backgroundColor = 'green';
                clickedCount++;
            }

            if (clickedCount === blocks.length) {
                blocks.forEach(b => b.style.backgroundColor = 'white');
                clickedCount = 0;
            }
        });
    });