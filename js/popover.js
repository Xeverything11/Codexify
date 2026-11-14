import { updateAnchorPosition } from "./anchor.js";

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
        updateAnchorPosition(trigger, popover, "right", "popover");
    };

    const updatePopoverContent = (popover) => {
        const popoverInner = popover.querySelector(".popover-inner");
        const content = popover.querySelector(".popover-content");
        let title = popover.querySelector(".popover-title");

        if (trigger.dataset.cTitle) {
            if (!title) {
                title = document.createElement("div");
                title.className = "popover-title";
                title.id = `${popoverId}-title`;
                popoverInner.prepend(title);
            }
            title.textContent = trigger.dataset.cTitle;
            popover.setAttribute("aria-labelledby", title.id);
            popover.removeAttribute("aria-label");
        } else {
            title?.remove();
            popover.removeAttribute("aria-labelledby");
            popover.setAttribute("aria-label", "Popover");
        }

        content.textContent = trigger.dataset.cContent;
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
        const content = document.createElement("div");
        content.className = "popover-content";
        popoverInner.append(content);
        popover.append(popoverInner);
        updatePopoverContent(popover);
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

    const contentObserver = new MutationObserver(() => {
        if (!activePopover || activePopover.closing) {
            return;
        }

        updatePopoverContent(activePopover.popover);
        activePopover.updatePosition();
    });
    contentObserver.observe(trigger, {
        attributes: true,
        attributeFilter: ["data-c-title", "data-c-content"]
    });

    trigger.addEventListener("click", togglePopover);
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
});
