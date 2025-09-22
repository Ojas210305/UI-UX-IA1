document.addEventListener('DOMContentLoaded', () => {
    // A: Custom Right-Click Context Menu
    const contextMenuTarget = document.getElementById('context-menu-target');
    const customContextMenu = document.getElementById('custom-context-menu');
    const menuItems = customContextMenu.querySelectorAll('li[role="menuitem"]');
    const cardContent = document.getElementById('card-content');
    const messageBox = document.getElementById('message-box');

    const showMessage = (text) => {
        messageBox.textContent = text;
        messageBox.classList.add('visible');
        setTimeout(() => {
            messageBox.classList.remove('visible');
        }, 2000);
    };

    const positionContextMenu = (x, y) => {
        const menuWidth = customContextMenu.offsetWidth;
        const menuHeight = customContextMenu.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX = x;
        let newY = y;

        if (x + menuWidth > viewportWidth) newX = viewportWidth - menuWidth - 10;
        if (y + menuHeight > viewportHeight) newY = viewportHeight - menuHeight - 10;

        customContextMenu.style.left = `${newX}px`;
        customContextMenu.style.top = `${newY}px`;
    };

    contextMenuTarget.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        customContextMenu.classList.add('active');
        positionContextMenu(e.clientX, e.clientY);
        menuItems[0].focus();
    });

    document.addEventListener('click', (e) => {
        if (!customContextMenu.contains(e.target) && !contextMenuTarget.contains(e.target)) {
            customContextMenu.classList.remove('active');
        }
    });

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

    menuItems.forEach(item => {
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

    // B: Gesture Simulation
    const gestureBox = document.getElementById('gesture-box');
    let isDragging = false;
    let startX = 0;
    const createRippleTimeout = 50;

    gestureBox.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        gestureBox.classList.add('cursor-grabbing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;

        if (Math.abs(deltaX) > 50 && e.timeStamp - (gestureBox.lastRippleTime || 0) > createRippleTimeout) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            if (e.altKey) ripple.classList.add('reverse');

            const boxRect = gestureBox.getBoundingClientRect();
            const rippleSize = 50;
            ripple.style.width = ripple.style.height = `${rippleSize}px`;
            ripple.style.left = `${e.clientX - boxRect.left - rippleSize / 2}px`;
            ripple.style.top = `${e.clientY - boxRect.top - rippleSize / 2}px`;

            gestureBox.appendChild(ripple);

            ripple.addEventListener('animationend', () => ripple.remove());

            gestureBox.lastRippleTime = e.timeStamp;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        gestureBox.classList.remove('cursor-grabbing');
    });
});
