const tooltipTriggers = document.querySelectorAll('[data-c-toggle="tooltip"][data-c-title]');
let tooltipCount = 0;

tooltipTriggers.forEach((trigger) => {
    const tooltipId = `codexify-tooltip-${++tooltipCount}`;
    let isHovered = false;
    let isFocused = false;
    let tooltip = null;
    let showFrame = null;
    let hideTimeout = null;

    const updatePosition = () => {
        if (!tooltip) {
            return;
        }

        const triggerRect = trigger.getBoundingClientRect();
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const viewportPadding = 8;
        const gap = 8;
        const requestedPlacement = trigger.dataset.cPlacement;
        const placement = ["top", "bottom", "left", "right"].includes(requestedPlacement)
            ? requestedPlacement
            : "top";
        const tooltipOrigin = {
            top: "bottom",
            bottom: "top",
            left: "right",
            right: "left"
        }[placement];
        let left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        let top = triggerRect.top - tooltipHeight - gap;

        if (placement === "bottom") {
            top = triggerRect.bottom + gap;
        } else if (placement === "left") {
            left = triggerRect.left - tooltipWidth - gap;
            top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        } else if (placement === "right") {
            left = triggerRect.right + gap;
            top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        }

        left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipWidth - viewportPadding));
        top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tooltipHeight - viewportPadding));
        tooltip.style.top = `${top}px`;
        tooltip.style.bottom = "auto";
        tooltip.style.left = `${left}px`;
        tooltip.style.right = "auto";
        tooltip.style.removeProperty("translate");
        tooltip.style.setProperty("--tooltip-before-inset", "0");
        tooltip.classList.remove("tooltip-anchor-top", "tooltip-anchor-bottom", "tooltip-anchor-left", "tooltip-anchor-right");
        tooltip.classList.add(`tooltip-anchor-${tooltipOrigin}`);
    };

    const show = () => {
        const isNewTooltip = !tooltip;
        if (hideTimeout !== null) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        if (isNewTooltip) {
            tooltip = document.createElement("div");
            tooltip.className = "tooltip tooltip-hidden";
            tooltip.id = tooltipId;
            tooltip.setAttribute("role", "tooltip");
            const tooltipInner = document.createElement("div");
            tooltipInner.className = "tooltip-inner";
            tooltipInner.textContent = trigger.dataset.cTitle;
            tooltip.append(tooltipInner);
            (trigger.closest("dialog[open]") ?? document.body).append(tooltip);
        } else {
            tooltip.classList.remove("tooltip-hidden");
        }

        updatePosition();
        const describedBy = trigger.getAttribute("aria-describedby")?.split(/\s+/).filter(Boolean) ?? [];
        if (!describedBy.includes(tooltipId)) {
            trigger.setAttribute("aria-describedby", [...describedBy, tooltipId].join(" "));
        }

        if (isNewTooltip) {
            const currentTooltip = tooltip;
            showFrame = requestAnimationFrame(() => {
                showFrame = null;
                if (tooltip === currentTooltip && (isHovered || isFocused)) {
                    currentTooltip.classList.remove("tooltip-hidden");
                }
            });
        }

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
    };

    const hide = () => {
        if (isHovered || isFocused) {
            return;
        }

        if (!tooltip) {
            return;
        }

        if (showFrame !== null) {
            cancelAnimationFrame(showFrame);
            showFrame = null;
        }
        if (hideTimeout !== null) {
            clearTimeout(hideTimeout);
        }
        const currentTooltip = tooltip;
        currentTooltip.classList.add("tooltip-hidden");
        const describedBy = trigger.getAttribute("aria-describedby")?.split(/\s+/).filter(Boolean) ?? [];
        const remainingDescriptions = describedBy.filter((id) => id !== tooltipId);
        if (remainingDescriptions.length) {
            trigger.setAttribute("aria-describedby", remainingDescriptions.join(" "));
        } else {
            trigger.removeAttribute("aria-describedby");
        }

        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
        hideTimeout = window.setTimeout(() => {
            if (tooltip === currentTooltip && !isHovered && !isFocused) {
                currentTooltip.remove();
                tooltip = null;
            }
            hideTimeout = null;
        }, 150);
    };

    trigger.addEventListener("mouseenter", () => {
        isHovered = true;
        show();
    });
    trigger.addEventListener("mouseleave", () => {
        isHovered = false;
        hide();
    });
    trigger.addEventListener("focus", () => {
        isFocused = true;
        show();
    });
    trigger.addEventListener("blur", () => {
        isFocused = false;
        hide();
    });
});