const overflowingNavs = document.querySelectorAll(".nav-overflow > .nav");

overflowingNavs.forEach((nav) => {
    const container = nav.parentElement;
    if (!container) {
        return;
    }

    const createScrollButton = (edge, label) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `btn btn-quiet btn-icon nav-overflow-button nav-overflow-${edge}`;
        button.setAttribute("aria-label", label);

        const iconElement = document.createElement("i");
        iconElement.className = `icon nav-overflow-icon nav-overflow-icon-${edge}`;
        iconElement.setAttribute("aria-hidden", "true");
        button.append(iconElement);
        button.addEventListener("click", () => {
            const direction = getComputedStyle(nav).direction === "rtl" ? -1 : 1;
            nav.scrollBy({
                left: edge === "start" ? -direction * nav.clientWidth : direction * nav.clientWidth,
                behavior: "smooth"
            });
        });

        return button;
    };

    const startButton = createScrollButton("start", "Scroll navigation to start");
    const endButton = createScrollButton("end", "Scroll navigation to end");
    container.append(startButton, endButton);

    const updateButtons = () => {
        const maxScroll = nav.scrollWidth - nav.clientWidth;
        const direction = getComputedStyle(nav).direction;
        const scrollPosition = direction === "rtl" ? -nav.scrollLeft : nav.scrollLeft;
        const hasOverflow = maxScroll > 1;

        startButton.classList.toggle("d-none", !hasOverflow || scrollPosition <= 1);
        endButton.classList.toggle("d-none", !hasOverflow || scrollPosition >= maxScroll - 1);
    };

    nav.addEventListener("scroll", updateButtons, { passive: true });
    const resizeObserver = new ResizeObserver(updateButtons);
    resizeObserver.observe(container);
    resizeObserver.observe(nav);
    updateButtons();
});
