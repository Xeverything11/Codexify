export const updateAnchorPosition = (trigger, element, defaultPlacement, classPrefix) => {
    const triggerRect = trigger.getBoundingClientRect();
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const viewportPadding = 8;
    const gap = 8;
    const requestedPlacement = trigger.dataset.cPlacement;
    const requestedPlacementIsValid = ["top", "bottom", "left", "right"].includes(requestedPlacement);
    const requestedDirection = requestedPlacementIsValid ? requestedPlacement : defaultPlacement;
    const isRtl = getComputedStyle(trigger).direction === "rtl";
    const placement = isRtl
        ? { left: "right", right: "left" }[requestedDirection] ?? requestedDirection
        : requestedDirection;
    const anchorOrigin = {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left"
    }[placement];
    let left = triggerRect.left + (triggerRect.width - elementWidth) / 2;
    let top = triggerRect.top - elementHeight - gap;

    if (placement === "bottom") {
        top = triggerRect.bottom + gap;
    } else if (placement === "left") {
        left = triggerRect.left - elementWidth - gap;
        top = triggerRect.top + (triggerRect.height - elementHeight) / 2;
    } else if (placement === "right") {
        left = triggerRect.right + gap;
        top = triggerRect.top + (triggerRect.height - elementHeight) / 2;
    }

    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - elementWidth - viewportPadding));
    top = Math.max(viewportPadding, Math.min(top, window.innerHeight - elementHeight - viewportPadding));
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.classList.remove(
        `${classPrefix}-anchor-top`,
        `${classPrefix}-anchor-bottom`,
        `${classPrefix}-anchor-left`,
        `${classPrefix}-anchor-right`
    );
    element.classList.add(`${classPrefix}-anchor-${anchorOrigin}`);
};
