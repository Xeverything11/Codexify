const offcanvasTriggers = document.querySelectorAll('[data-c-toggle="offcanvas"][data-c-target]');
const offcanvasStates = new Map();
const openOffcanvases = new Set();
const backdropStageDelays = [50, 125, 200, 275];
const backdropStageClasses = [
    "offcanvas-backdrop-stage-1",
    "offcanvas-backdrop-stage-2",
    "offcanvas-backdrop-stage-3",
    "offcanvas-backdrop-stage-4"
];

const updateBodyScrollLock = () => {
    document.body.classList.toggle("offcanvas-open", openOffcanvases.size > 0);
};

const setBackdropStage = (state, stage) => {
    state.offcanvas.classList.remove(...backdropStageClasses);
    if (stage > 0) {
        state.offcanvas.classList.add(backdropStageClasses[stage - 1]);
    }
    state.backdropStage = stage;
};

const clearBackdropTimers = (state) => {
    state.backdropTimers.forEach((timer) => clearTimeout(timer));
    state.backdropTimers.clear();
};

const scheduleBackdropStage = (state, stage, delay) => {
    const timer = window.setTimeout(() => {
        state.backdropTimers.delete(timer);
        if (state.offcanvas.open) {
            setBackdropStage(state, stage);
        }
    }, delay);
    state.backdropTimers.add(timer);
};

const animateBackdropOpen = (state) => {
    clearBackdropTimers(state);
    setBackdropStage(state, 0);
    if (getTransitionDuration(state.offcanvas) === 0) {
        setBackdropStage(state, backdropStageClasses.length);
        return;
    }

    backdropStageDelays.forEach((delay, index) => {
        scheduleBackdropStage(state, index + 1, delay);
    });
};

const animateBackdropClose = (state) => {
    clearBackdropTimers(state);
    const currentStage = state.backdropStage;
    if (currentStage === 0) {
        return;
    }

    const firstDelay = currentStage === backdropStageClasses.length ? 25 : 75;
    for (let stage = currentStage - 1; stage >= 0; stage--) {
        const delay = firstDelay + (currentStage - 1 - stage) * 75;
        scheduleBackdropStage(state, stage, delay);
    }
};

const getTransitionDuration = (element) => {
    const styles = getComputedStyle(element);
    const durations = styles.transitionDuration.split(",").map((duration) => parseFloat(duration) * (duration.trim().endsWith("ms") ? 1 : 1000));
    const delays = styles.transitionDelay.split(",").map((delay) => parseFloat(delay) * (delay.trim().endsWith("ms") ? 1 : 1000));

    return Math.max(...durations.map((duration, index) => duration + (delays[index % delays.length] ?? 0)), 0);
};

const getOffcanvasState = (offcanvas) => {
    if (offcanvasStates.has(offcanvas)) {
        return offcanvasStates.get(offcanvas);
    }

    const state = {
        offcanvas,
        backdropStage: 0,
        backdropTimers: new Set(),
        triggers: new Set(),
        closeTimeout: null,
        openFrame: null
    };
    offcanvasStates.set(offcanvas, state);

    offcanvas.addEventListener("close", () => {
        openOffcanvases.delete(offcanvas);
        updateBodyScrollLock();

        if (state.closeTimeout !== null) {
            clearTimeout(state.closeTimeout);
            state.closeTimeout = null;
        }
        if (state.openFrame !== null) {
            cancelAnimationFrame(state.openFrame);
            state.openFrame = null;
        }

        clearBackdropTimers(state);
        setBackdropStage(state, 0);
        offcanvas.classList.remove("offcanvas-hidden");
        state.triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    });

    offcanvas.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeOffcanvas(offcanvas, state);
    });

    offcanvas.addEventListener("submit", (event) => {
        if (event.target instanceof HTMLFormElement && event.target.method === "dialog") {
            event.preventDefault();
            closeOffcanvas(offcanvas, state);
        }
    });

    return state;
};

const openOffcanvas = (offcanvas, state) => {
    if (state.closeTimeout !== null) {
        clearTimeout(state.closeTimeout);
        state.closeTimeout = null;
        clearBackdropTimers(state);
        setBackdropStage(state, backdropStageClasses.length);
        offcanvas.classList.remove("offcanvas-hidden");
        state.triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
        return;
    }

    if (offcanvas.open) {
        return;
    }

    offcanvas.classList.add("offcanvas-hidden");
    offcanvas.showModal();
    animateBackdropOpen(state);
    openOffcanvases.add(offcanvas);
    updateBodyScrollLock();
    state.triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "true"));
    state.openFrame = requestAnimationFrame(() => {
        state.openFrame = null;
        if (offcanvas.open) {
            offcanvas.classList.remove("offcanvas-hidden");
        }
    });
};

const closeOffcanvas = (offcanvas, state) => {
    if (!offcanvas.open || state.closeTimeout !== null) {
        return;
    }

    if (state.openFrame !== null) {
        cancelAnimationFrame(state.openFrame);
        state.openFrame = null;
        clearBackdropTimers(state);
        setBackdropStage(state, 0);
        offcanvas.close();
        return;
    }

    offcanvas.classList.add("offcanvas-hidden");
    animateBackdropClose(state);
    state.triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    const transitionDuration = getTransitionDuration(offcanvas);
    if (transitionDuration === 0) {
        offcanvas.close();
        return;
    }

    state.closeTimeout = window.setTimeout(() => {
        state.closeTimeout = null;
        offcanvas.close();
    }, transitionDuration);
};

offcanvasTriggers.forEach((trigger) => {
    const targetSelector = trigger.dataset.cTarget;
    const offcanvas = document.querySelector(targetSelector);

    if (!(offcanvas instanceof HTMLDialogElement) || !offcanvas.classList.contains("offcanvas")) {
        throw new TypeError(`Offcanvas trigger target "${targetSelector}" must match a <dialog class="offcanvas">.`);
    }

    const state = getOffcanvasState(offcanvas);
    state.triggers.add(trigger);
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    if (offcanvas.id) {
        trigger.setAttribute("aria-controls", offcanvas.id);
    }

    trigger.addEventListener("click", () => openOffcanvas(offcanvas, state));
});

document.querySelectorAll('[data-c-dismiss="offcanvas"]').forEach((dismissButton) => {
    const offcanvas = dismissButton.closest("dialog.offcanvas");

    if (offcanvas instanceof HTMLDialogElement) {
        const state = getOffcanvasState(offcanvas);
        dismissButton.addEventListener("click", () => closeOffcanvas(offcanvas, state));
    }
});
