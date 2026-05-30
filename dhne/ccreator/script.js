const fields = [
    {
        id: "name",
        label: "Name",
        type: "text",
        default: "Example Liz"
    },
    {
        id: "starting_coins",
        label: "Starting Coins",
        type: "number",
        default: 1
    },
    {
        id: "turns",
        label: "Turns",
        type: "number",
        default: 3
    },
    {
        id: "busts",
        label: "Busts",
        type: "number",
        default: 4
    },
	{
		id: "power_type",
		label: "Power Type",
		type: "select",
		default: "turn_over",
		options: [
			{
				value: "turn_over",
				label: "Nudge Up (Liz)"
			},
			{
				value: "bust_shield",
				label: "Shield (Wizard)"
			},
			{
				value: "nudge_skip",
				label: "Nudge Skip (King Fetus)"
			},
			{
				value: "ghost_clone",
				label: "Ghost Clone (Shirin)"
			},
			{
				value: "flip",
				label: "Flip (Guy)"
			},
			{
				value: "smite",
				label: "Smite (Anais)"
			}
		]
	},
    {
        id: "power_limit",
        label: "Power Limit",
        type: "number",
        default: 1
    },
    {
        id: "power_cost",
        label: "Power Cost",
        type: "number",
        default: 1
    },
    {
        id: "dice_limit",
        label: "Dice Limit",
        type: "number",
        default: 6
    }
];

const dialogueGroups = [
    {
        title: "Starting Dialogue",
        id: "setup",
        fields: [
            {
                id: "line1",
                label: "Line 1",
				default: "Hey, my love"
            },
            {
                id: "line2_easy",
                label: "Line 2 (Shallows)",
				default: "Remember, 7 levels and you're out of here!"
            },
            {
                id: "line2_normal",
                label: "Line 2 (Lands Adrift)",
				default: "Remember, 10 levels and you're out of here!"
            }
        ]
    },
    {
        title: "Bust Dialogue",
        id: "gameover",
        fields: [
            {
                id: "line1",
                label: "Line 1",
				default: "Ah well"
            },
            {
                id: "line2",
                label: "Line 2",
				default: "You'll get it next time!"
            }
        ]
    }
];

const sideTypes = [
    "none",
    "bust",
	"bonus",
	"mult",
	"debust",
	"pig",
	"negative",
	"power",
	"stuck",
	"money",
	"cracked"
];

window.addEventListener("DOMContentLoaded", () => {
    generateFields();
	generateDialogueFields();

    for (let i = 0; i < 5; i++) {
        addDie();
    }
});

function generateFields() {
    const container = document.getElementById("fields");

    fields.forEach(field => {
        const wrapper = document.createElement("div");
        wrapper.className = "field";

        const label = document.createElement("label");
        label.textContent = field.label;

        let input;

        if (field.type === "select") {
            input = document.createElement("select");

            field.options.forEach(optionData => {
                const option =
                    document.createElement("option");

                option.value = optionData.value;
                option.textContent = optionData.label;

                if (optionData.value === field.default) {
                    option.selected = true;
                }

                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = field.type;
            input.value = field.default;
        }

        input.id = field.id;

        wrapper.appendChild(label);
        wrapper.appendChild(input);

        container.appendChild(wrapper);
    });
}

function generateDialogueFields() {
    const container =
        document.getElementById("dialogueFields");

    dialogueGroups.forEach(group => {

        const groupDiv =
            document.createElement("div");

        groupDiv.className =
            "dialogue-group";

        const title =
            document.createElement("h3");

        title.textContent =
            group.title;

        groupDiv.appendChild(title);

        group.fields.forEach(field => {

            const wrapper =
                document.createElement("div");

            wrapper.className = "field";

            const label =
                document.createElement("label");

            label.textContent =
                field.label;

            const input =
                document.createElement("input");

            input.type = "text";

            input.value = field.default;
            input.id =
                `${group.id}_${field.id}`;

            wrapper.appendChild(label);
            wrapper.appendChild(input);

            groupDiv.appendChild(wrapper);
        });

        container.appendChild(groupDiv);
    });
}

function createSideDropdown(defaultValue) {
    const select = document.createElement("select");

    sideTypes.forEach(type => {
        const option = document.createElement("option");

        option.value = type;
        option.textContent = type;

        if (type === defaultValue) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    return select;
}

function addDie() {
    const container = document.getElementById("diceContainer");

    const card = document.createElement("div");
    card.className = "dice-card";

    const modeLabel = document.createElement("label");
    modeLabel.textContent = "Die Type";

    const modeSelect = document.createElement("select");
	modeSelect.className = "die-mode";

    ["normal", "custom"].forEach(type => {
        const option = document.createElement("option");

        option.value = type;
        option.textContent = type;

        modeSelect.appendChild(option);
    });

    modeLabel.appendChild(modeSelect);

    const sidesContainer = document.createElement("div");
    sidesContainer.className = "custom-sides";
    sidesContainer.style.display = "none";

    for (let side = 1; side <= 6; side++) {
        const wrapper = document.createElement("div");

        const label = document.createElement("label");
        label.textContent = `Side ${side}`;

        const dropdown = createSideDropdown(
            side === 1 ? "bust" : "none"
        );

        dropdown.className = "side-select";

        label.appendChild(dropdown);
        wrapper.appendChild(label);

        sidesContainer.appendChild(wrapper);
    }

    modeSelect.addEventListener("change", () => {
        sidesContainer.style.display =
            modeSelect.value === "custom"
                ? "block"
                : "none";
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-btn";
    removeButton.textContent = "×";

    removeButton.onclick = () => card.remove();

    card.appendChild(modeLabel);
    card.appendChild(sidesContainer);
    card.appendChild(removeButton);

    container.appendChild(card);
}

function sanitizeFilename(name) {
    return name
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .replace(/\s+/g, "_");
}

function buildDiceData() {
    const dice = [];

    document.querySelectorAll(".dice-card")
        .forEach(card => {

			const mode =
				card.querySelector(".die-mode").value;

            if (mode === "normal") {
                dice.push({
                    side_effects: [
                        "bust",
                        "none",
                        "none",
                        "none",
                        "none",
                        "none",
                        "none",
                        "none"
                    ]
                });

                return;
            }

            const sideEffects = [];

            card.querySelectorAll(".side-select")
                .forEach(select => {
                    sideEffects.push(select.value);
                });

            sideEffects.push("none");
            sideEffects.push("none");

            dice.push({
                side_effects: sideEffects
            });
        });

    return dice;
}

function escapeLuaString(text) {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
}

function downloadLua() {
    const values = {};

    fields.forEach(field => {
        values[field.id] =
            document.getElementById(field.id).value;
    });

    const dice = buildDiceData();
	const dialogues = {};

	dialogueGroups.forEach(group => {

		dialogues[group.id] = {};

		group.fields.forEach(field => {

			dialogues[group.id][field.id] =
				document.getElementById(
					`${group.id}_${field.id}`
				).value;
		});
	});

    let lua = "return {\n";

    fields.forEach(field => {
        const value = values[field.id];

		if (
			field.type === "text" ||
			field.type === "select"
		) {
			lua += `\t${field.id} = "${value}",\n`;
		} else {
			lua += `\t${field.id} = ${value},\n`;
		}
    });

lua += `
\tdialogue_text = {
\t\tsetup = {
\t\t\tline1 = "${escapeLuaString(dialogues.setup.line1)}",
\t\t\tline2_easy = "${escapeLuaString(dialogues.setup.line2_easy)}",
\t\t\tline2_normal = "${escapeLuaString(dialogues.setup.line2_normal)}"
\t\t},
\t\tgameover = {
\t\t\tline1 = "${escapeLuaString(dialogues.gameover.line1)}",
\t\t\tline2 = "${escapeLuaString(dialogues.gameover.line2)}"
\t\t}
\t},

\tdice = {
`;

    dice.forEach(die => {
        lua += "\t\t{side_effects = {";

        lua += die.side_effects
            .map(effect => `"${effect}"`)
            .join(", ");

        lua += "}},\n";
    });

    lua += "\t},\n";
    lua += "}";

    const blob = new Blob(
        [lua],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const characterName = sanitizeFilename(
        values.name || "character"
    ).toLowerCase();

    a.download = `${characterName}.lua`;

    a.click();

    URL.revokeObjectURL(url);
}