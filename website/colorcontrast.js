const contrastShades = [
    "10", "20", "50", "100", "200", "300", "400", "500",
    "600", "700", "800", "900", "950", "980", "990"
];
const contrastHues = ["red", "orange", "yellow", "lime", "green", "teal", "blue", "purple", "pink", "brown", "gray"];
const contrastMatrix = document.querySelector("#contrast-matrix");

if (contrastMatrix) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
        throw new Error("Unable to create a canvas context for contrast calculations.");
    }

    const colorCache = new Map();
    const contrastLevels = [
        { threshold: 7, name: "blue" },
        { threshold: 4.5, name: "green" },
        { threshold: 3, name: "yellow" },
        { threshold: 0, name: "red" }
    ];

    function getColor(hue, shade) {
        const key = `${hue}-${shade}`;
        if (colorCache.has(key)) {
            return colorCache.get(key);
        }

        const colorValue = getComputedStyle(document.documentElement)
            .getPropertyValue(`--color-${key}`).trim();
        if (!colorValue) {
            throw new Error(`Missing color token --color-${key}.`);
        }

        context.clearRect(0, 0, 1, 1);
        context.fillStyle = colorValue;
        context.fillRect(0, 0, 1, 1);
        const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
        const color = [red, green, blue].map((channel) => {
            const normalized = channel / 255;
            return normalized <= 0.04045
                ? normalized / 12.92
                : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        colorCache.set(key, color);
        return color;
    }

    function getLuminance(color) {
        return color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;
    }

    function getRatio(foreground, background) {
        const foregroundLuminance = getLuminance(foreground);
        const backgroundLuminance = getLuminance(background);
        const lighter = Math.max(foregroundLuminance, backgroundLuminance);
        const darker = Math.min(foregroundLuminance, backgroundLuminance);
        return (lighter + 0.05) / (darker + 0.05);
    }

    function getCSSColor(hue, shade) {
        if (hue === "white" || hue === "black") {
            return `var(--color-${hue})`;
        }
        return `var(--color-${hue}-${shade})`;
    }

    function createHeaderCell(label, hue, shade) {
        const cell = document.createElement("th");
        cell.scope = "col";
        cell.textContent = label;
        cell.style.backgroundColor = getCSSColor(hue, shade);
        cell.style.color = Number(shade) > 500 || hue === "black"
            ? "var(--color-white)"
            : "var(--color-black)";
        return cell;
    }

    function renderMatrix(selectedHue) {
        const table = document.createElement("table");
        table.className = "table contrast-matrix";

        const caption = document.createElement("caption");
        caption.textContent = "How contrast ratios differ by foreground colors against background colors?";
        table.append(caption);

        const columnColors = [
            { label: "White", hue: "white", shade: "white", value: [1, 1, 1] },
            ...contrastShades.map((shade) => ({
                label: shade,
                hue: selectedHue,
                shade,
                value: getColor(selectedHue, shade)
            })),
            { label: "Black", hue: "black", shade: "black", value: [0, 0, 0] }
        ];
        const rowColors = [
            { label: "White", hue: "white", shade: "white", value: [1, 1, 1], level: 0 },
            ...contrastShades.map((shade) => ({
                label: shade,
                hue: selectedHue,
                shade,
                value: getColor(selectedHue, shade),
                level: Number(shade)
            })),
            { label: "Black", hue: "black", shade: "black", value: [0, 0, 0], level: 1000 }
        ];

        const headingRow = table.createTHead().insertRow();
        const hueHeading = document.createElement("th");
        hueHeading.scope = "col";
        const label = document.createElement("label");
        label.htmlFor = "contrast-hue";
        label.textContent = "";
        const select = document.createElement("select");
        select.id = "contrast-hue";
        select.className = "contrast-hue-select";
        select.setAttribute("aria-label", "Choose color hue");
        contrastHues.forEach((hue) => {
            const option = document.createElement("option");
            option.value = hue;
            option.textContent = hue[0].toUpperCase() + hue.slice(1);
            option.selected = hue === selectedHue;
            select.append(option);
        });
        select.addEventListener("change", () => renderMatrix(select.value));
        label.append(select);
        hueHeading.append(label);
        headingRow.append(hueHeading);

        columnColors.forEach((color) => {
            headingRow.append(createHeaderCell(color.label, color.hue, color.shade));
        });

        const body = table.createTBody();
        rowColors.forEach((foreground) => {
            const row = body.insertRow();
            const rowHeader = document.createElement("th");
            rowHeader.scope = "row";
            rowHeader.textContent = foreground.label;
            rowHeader.style.backgroundColor = getCSSColor(foreground.hue, foreground.shade);
            rowHeader.style.color = foreground.level > 500
                ? "var(--color-white)"
                : "var(--color-black)";
            row.append(rowHeader);

            columnColors.forEach((background) => {
                const cell = row.insertCell();
                const ratio = getRatio(foreground.value, background.value);
                const level = contrastLevels.find((item) => ratio >= item.threshold);
                const darkBackground = Number(background.shade) > 500 || background.shade === "black";
                const ringShade = darkBackground ? "600" : "600";

                cell.className = "contrast-cell";
                cell.textContent = `${ratio.toFixed(2)}:1`;
                cell.setAttribute(
                    "aria-label",
                    `${foreground.label} foreground on ${background.label} background: ${ratio.toFixed(2)} to 1`
                );
                cell.style.backgroundColor = getCSSColor(background.hue, background.shade);
                cell.style.color = getCSSColor(foreground.hue, foreground.shade);
                cell.style.setProperty(
                    "--contrast-status-color",
                    getCSSColor(level.name, ringShade)
                );
                cell.style.setProperty(
                    "--contrast-hover-color",
                    darkBackground ? "var(--color-white)" : "var(--color-black)"
                );
                row.append(cell);
            });
        });

        contrastMatrix.replaceChildren(table);
    }

    renderMatrix("red");
}