import { updateAnchorPosition } from "./anchor.js";

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

        updateAnchorPosition(trigger, tooltip, "top", "tooltip");
        tooltip.style.bottom = "auto";
        tooltip.style.right = "auto";
        tooltip.style.removeProperty("translate");
        tooltip.style.setProperty("--tooltip-before-inset", "0");
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

    const titleObserver = new MutationObserver(() => {
        if (!tooltip) {
            return;
        }

        const tooltipInner = tooltip.querySelector(".tooltip-inner");
        if (tooltipInner) {
            tooltipInner.textContent = trigger.dataset.cTitle;
            updatePosition();
        }
    });
    titleObserver.observe(trigger, { attributes: true, attributeFilter: ["data-c-title"] });

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