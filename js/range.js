const ranges = document.querySelectorAll(".form-range");

ranges.forEach((range) => {
    const updateRange = () => {
        const min = Number.parseFloat(range.min);
        const max = Number.parseFloat(range.max);

        range.style.setProperty("--form-range-min", Number.isFinite(min) ? min : 0);
        range.style.setProperty("--form-range-max", Number.isFinite(max) ? max : 100);
        range.style.setProperty("--form-range-value", range.value);
        range.style.setProperty("--form-range-stop", "calc((var(--form-range-value) - var(--form-range-min)) / (var(--form-range-max) - var(--form-range-min)) * 100%)");
    };

    range.addEventListener("input", updateRange);
    range.addEventListener("change", updateRange);
    updateRange();
});
