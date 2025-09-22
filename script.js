document.addEventListener('DOMContentLoaded', () => {
    // A: Custom Right-Click Context Menu
    const contextMenuTarget = document.getElementById('context-menu-target');
    const customContextMenu = document.getElementById('custom-context-menu');
    const menuItems = customContextMenu.querySelectorAll('li[role="menuitem"]');
    const cardContent = document.getElementById('card-content');
    const messageBox = document.getElementById('message-box');
    let activeItemIndex = -1;

    const showMessage = (text) => {
        messageBox.textContent = text;
        messageBox.classList.add('visible');
        setTimeout(() => {
            messageBox.classList.remove('visible');
        }, 2000);
    };

    // Function to position the context menu
    const positionContextMenu = (x, y) => {
        const menuWidth = customContextMenu.offsetWidth;
        const menuHeight = customContextMenu.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX = x;
        let newY = y;

        if (x + menuWidth > viewportWidth) {
            newX = viewportWidth - menuWidth - 10;
        }
        if (y + menuHeight > viewportHeight) {
            newY = viewportHeight - menuHeight - 10;
        }

        customContextMenu.style.left = `${newX}px`;
        customContextMenu.style.top = `${newY}px`;
    };

    // Show the custom context menu on right-click
    contextMenuTarget.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        customContextMenu.classList.add('active');
        positionContextMenu(e.clientX, e.clientY);
        menuItems[0].focus();
    });

    // Hide the context menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (
            !customContextMenu.contains(e.target) &&
            !contextMenuTarget.contains(e.target)
        ) {
            customContextMenu.classList.remove('active');
        }
    });

    // Keyboard navigation
    customContextMenu.addEventListener('keydown', (e) => {
        const len = menuItems.length;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            let nextIndex = Array.from(menuItems).indexOf(document.activeElement) + 1;
            if (nextIndex >= len) nextIndex = 0;
            menuItems[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            let prevIndex = Array.from(menuItems).indexOf(document.activeElement) - 1;
            if (prevIndex < 0) prevIndex = len - 1;
            menuItems[prevIndex].focus();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            document.activeElement.click();
            customContextMenu.classList.remove('active');
        } else if (e.key === 'Escape') {
            customContextMenu.classList.remove('active');
            contextMenuTarget.focus();
        }
    });

    // Handle menu item clicks
    menuItems.forEach((item) => {
        item.addEventListener('click', async () => {
            const action = item.getAttribute('data-action');
            const textContent = cardContent.textContent;

            try {
                switch (action) {
                    case 'copy':
                        await navigator.clipboard.writeText(textContent);
                        showMessage('Text copied to clipboard!');
                        break;
                    case 'cut':
                        await navigator.clipboard.writeText(textContent);
                        cardContent.textContent = '';
                        showMessage('Text cut to clipboard!');
                        break;
                    case 'paste':
                        const pastedText = await navigator.clipboard.readText();
                        cardContent.textContent += pastedText;
                        showMessage('Text pasted from clipboard!');
                        break;
                    case 'intro':
                        cardContent.textContent =
                            "This is a demonstration of a custom right-click context menu. It's built with HTML, CSS, and JavaScript to provide a unique and interactive experience. You can navigate this menu with both a mouse and your keyboard for full accessibility.";
                        showMessage('Introduction loaded!');
                        break;
                    case 'remove':
                        cardContent.textContent = '';
                        showMessage('Text removed!');
                        break;
                    default:
                        showMessage(`Action "${action}" is not implemented.`);
                }
            } catch (err) {
                showMessage('Failed to perform clipboard action.');
                console.error('Clipboard API error:', err);
            }

            customContextMenu.classList.remove('active');
        });
    });

    // B: Gesture Simulation (Particle Trail)
    const gestureBox = document.getElementById('gesture-box');
    let isDragging = false;

    gestureBox.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        gestureBox.classList.add('is-active');
        document.getElementById('gesture-prompt').classList.add('hidden');
    });

    // Create a particle effect on mousemove while dragging
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const boxRect = gestureBox.getBoundingClientRect();

        // Only create particles if the cursor is within the box
        if (
            e.clientX >= boxRect.left &&
            e.clientX <= boxRect.right &&
            e.clientY >= boxRect.top &&
            e.clientY <= boxRect.bottom
        ) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            if (e.altKey) {
                particle.classList.add('reverse');
            }

            // Position the particle relative to the gesture box
            const particleSize = 10 + Math.random() * 10;
            particle.style.width = particle.style.height = `${particleSize}px`;
            particle.style.left = `${e.clientX - boxRect.left}px`;
            particle.style.top = `${e.clientY - boxRect.top}px`;

            gestureBox.appendChild(particle);

            // Remove particle after animation ends
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        gestureBox.classList.remove('is-active');
    });
});

