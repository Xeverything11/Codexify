const popoverTriggers = document.querySelectorAll('[data-c-toggle="popover"][data-c-content]');
let popoverCount = 0;

popoverTriggers.forEach((trigger) => {
    const popoverId = `codexify-popover-${++popoverCount}`;
    let activePopover = null;

    const closeActivePopover = () => {
        if (!activePopover || activePopover.closing) {
            return;
        }

        const closingPopover = activePopover;
        closingPopover.closing = true;
        if (closingPopover.showFrame !== null) {
            cancelAnimationFrame(closingPopover.showFrame);
            closingPopover.showFrame = null;
        }

        closingPopover.popover.classList.add("popover-hidden");
        trigger.setAttribute("aria-expanded", "false");
        trigger.removeAttribute("aria-controls");
        window.removeEventListener("resize", closingPopover.updatePosition);
        window.removeEventListener("scroll", closingPopover.updatePosition, true);
        closingPopover.hideTimeout = window.setTimeout(() => {
            closingPopover.popover.remove();
            if (activePopover === closingPopover) {
                activePopover = null;
            }
        }, 150);
    };

    const updatePosition = (popover) => {
        const triggerRect = trigger.getBoundingClientRect();
        const popoverWidth = popover.offsetWidth;
        const popoverHeight = popover.offsetHeight;
        const viewportPadding = 8;
        const gap = 8;
        const requestedPlacement = trigger.dataset.cPlacement;
        const placement = ["top", "bottom", "left", "right"].includes(requestedPlacement)
            ? requestedPlacement
            : "right";
        const popoverOrigin = {
            top: "bottom",
            bottom: "top",
            left: "right",
            right: "left"
        }[placement];
        let left = triggerRect.left + (triggerRect.width - popoverWidth) / 2;
        let top = triggerRect.top - popoverHeight - gap;

        if (placement === "bottom") {
            top = triggerRect.bottom + gap;
        } else if (placement === "left") {
            left = triggerRect.left - popoverWidth - gap;
            top = triggerRect.top + (triggerRect.height - popoverHeight) / 2;
        } else if (placement === "right") {
            left = triggerRect.right + gap;
            top = triggerRect.top + (triggerRect.height - popoverHeight) / 2;
        }

        left = Math.max(viewportPadding, Math.min(left, window.innerWidth - popoverWidth - viewportPadding));
        top = Math.max(viewportPadding, Math.min(top, window.innerHeight - popoverHeight - viewportPadding));
        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
        popover.classList.remove("popover-anchor-top", "popover-anchor-bottom", "popover-anchor-left", "popover-anchor-right");
        popover.classList.add(`popover-anchor-${popoverOrigin}`);
    };

    const togglePopover = () => {
        if (activePopover?.trigger === trigger) {
            if (activePopover.closing) {
                clearTimeout(activePopover.hideTimeout);
                activePopover.hideTimeout = null;
                activePopover.closing = false;
                activePopover.popover.classList.remove("popover-hidden");
                trigger.setAttribute("aria-controls", popoverId);
                trigger.setAttribute("aria-expanded", "true");
                window.addEventListener("resize", activePopover.updatePosition);
                window.addEventListener("scroll", activePopover.updatePosition, true);
                activePopover.updatePosition();
                return;
            }

            closeActivePopover();
            return;
        }

        const popover = document.createElement("div");
        popover.className = "popover popover-hidden";
        popover.id = popoverId;
        popover.setAttribute("role", "dialog");

        const popoverInner = document.createElement("div");
        popoverInner.className = "popover-inner";
        if (trigger.dataset.cTitle) {
            const title = document.createElement("div");
            title.className = "popover-title";
            title.id = `${popoverId}-title`;
            title.textContent = trigger.dataset.cTitle;
            popover.setAttribute("aria-labelledby", title.id);
            popoverInner.append(title);
        } else {
            popover.setAttribute("aria-label", "Popover");
        }

        const content = document.createElement("div");
        content.className = "popover-content";
        content.textContent = trigger.dataset.cContent;
        popoverInner.append(content);
        popover.append(popoverInner);
        (trigger.closest("dialog[open]") ?? document.body).append(popover);
        trigger.setAttribute("aria-controls", popoverId);
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-expanded", "true");

        const position = () => updatePosition(popover);
        activePopover = { trigger, popover, updatePosition: position, showFrame: null, hideTimeout: null, closing: false };
        position();
        window.addEventListener("resize", position);
        window.addEventListener("scroll", position, true);
        const openingPopover = activePopover;
        openingPopover.showFrame = requestAnimationFrame(() => {
            openingPopover.showFrame = null;
            if (activePopover === openingPopover && !openingPopover.closing) {
                popover.classList.remove("popover-hidden");
            }
        });
    };

    trigger.addEventListener("click", togglePopover);
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
});
