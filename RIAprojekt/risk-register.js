/* =========================================================
   SECURITY RISK REGISTER
   risk-register.js
   ========================================================= */


/* =========================
   1. DOM ELEMENTS
   ========================= */

const riskForm = document.getElementById("riskForm");

const editingRiskId = document.getElementById("editingRiskId");

const asset = document.getElementById("asset");
const category = document.getElementById("category");
const threat = document.getElementById("threat");
const vulnerability = document.getElementById("vulnerability");
const description = document.getElementById("description");

const confidentiality = document.getElementById("confidentiality");
const integrity = document.getElementById("integrity");
const availability = document.getElementById("availability");

const likelihood = document.getElementById("likelihood");
const impact = document.getElementById("impact");

const treatment = document.getElementById("treatment");
const status = document.getElementById("status");
const owner = document.getElementById("owner");
const deadline = document.getElementById("deadline");
const controls = document.getElementById("controls");

const residualLikelihood =
    document.getElementById("residualLikelihood");

const residualImpact =
    document.getElementById("residualImpact");

const notes = document.getElementById("notes");


/* Risk calculation */

const inherentRiskScore =
    document.getElementById("inherentRiskScore");

const inherentRiskLevel =
    document.getElementById("inherentRiskLevel");

const inherentRiskResult =
    document.getElementById("inherentRiskResult");

const residualRiskScore =
    document.getElementById("residualRiskScore");

const residualRiskLevel =
    document.getElementById("residualRiskLevel");

const residualRiskResult =
    document.getElementById("residualRiskResult");


/* Risk register */

const riskTableBody =
    document.getElementById("riskTableBody");

const tableWrapper =
    document.getElementById("tableWrapper");

const emptyState =
    document.getElementById("emptyState");

const riskFilter =
    document.getElementById("riskFilter");

const riskSearch =
    document.getElementById("riskSearch");

const exportRisks =
    document.getElementById("exportRisks");


/* Dashboard */

const totalRisks =
    document.getElementById("totalRisks");

const highRisks =
    document.getElementById("highRisks");

const activeRisks =
    document.getElementById("activeRisks");

const mitigatedRisks =
    document.getElementById("mitigatedRisks");


/* Edit */

const formTitle =
    document.getElementById("formTitle");

const saveRiskButton =
    document.getElementById("saveRisk");

const cancelEditButton =
    document.getElementById("cancelEdit");

const resetRiskButton =
    document.getElementById("resetRisk");


/* =========================
   2. LOCAL STORAGE
   ========================= */

const STORAGE_KEY = "securityRiskRegister";

let risks = loadRisks();


function loadRisks() {

    const savedRisks =
        localStorage.getItem(STORAGE_KEY);

    if (!savedRisks) {
        return [];
    }

    try {

        const parsedRisks =
            JSON.parse(savedRisks);

        if (Array.isArray(parsedRisks)) {
            return parsedRisks;
        }

        return [];

    } catch (error) {

        console.error(
            "Kunde inte läsa riskregistret:",
            error
        );

        return [];
    }
}


function saveRisks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(risks)
    );
}


/* =========================
   3. RISK LEVEL
   ========================= */

/*
    Risk = sannolikhet × konsekvens

    1–4   = Låg
    5–10  = Medel
    11–16 = Hög
    17–25 = Kritisk
*/

function getRiskLevel(score) {

    if (score <= 4) {

        return {
            name: "LÅG",
            className: "low"
        };
    }

    if (score <= 10) {

        return {
            name: "MEDEL",
            className: "medium"
        };
    }

    if (score <= 16) {

        return {
            name: "HÖG",
            className: "high"
        };
    }

    return {
        name: "KRITISK",
        className: "critical"
    };
}


/* =========================
   4. CALCULATE RISK
   ========================= */

function calculateRisk(
    likelihoodValue,
    impactValue
) {

    return (
        Number(likelihoodValue) *
        Number(impactValue)
    );
}


/* =========================
   5. UPDATE LIVE CALCULATION
   ========================= */

function updateRiskCalculations() {

    /* Inherent risk */

    const inherentScore =
        calculateRisk(
            likelihood.value,
            impact.value
        );

    const inherentLevel =
        getRiskLevel(inherentScore);


    inherentRiskScore.textContent =
        inherentScore;

    inherentRiskLevel.textContent =
        inherentLevel.name;

    inherentRiskResult.className =
        "risk-result " +
        inherentLevel.className;


    /* Residual risk */

    const residualScore =
        calculateRisk(
            residualLikelihood.value,
            residualImpact.value
        );

    const residualLevel =
        getRiskLevel(residualScore);


    residualRiskScore.textContent =
        residualScore;

    residualRiskLevel.textContent =
        residualLevel.name;

    residualRiskResult.className =
        "risk-result " +
        residualLevel.className;
}


/* =========================
   6. RISK CALCULATION EVENTS
   ========================= */

likelihood.addEventListener(
    "change",
    updateRiskCalculations
);

impact.addEventListener(
    "change",
    updateRiskCalculations
);

residualLikelihood.addEventListener(
    "change",
    updateRiskCalculations
);

residualImpact.addEventListener(
    "change",
    updateRiskCalculations
);


/* =========================
   7. GENERATE RISK ID
   ========================= */

function generateRiskId() {

    let highestNumber = 0;

    risks.forEach(function (risk) {

        const number =
            Number(
                String(risk.id)
                    .replace("R-", "")
            );

        if (
            Number.isFinite(number) &&
            number > highestNumber
        ) {
            highestNumber = number;
        }
    });


    const nextNumber =
        highestNumber + 1;


    return (
        "R-" +
        String(nextNumber).padStart(3, "0")
    );
}


/* =========================
   8. CREATE RISK OBJECT
   ========================= */

function createRiskObject(id) {

    const inherentScore =
        calculateRisk(
            likelihood.value,
            impact.value
        );

    const inherentLevel =
        getRiskLevel(inherentScore);


    const residualScore =
        calculateRisk(
            residualLikelihood.value,
            residualImpact.value
        );

    const residualLevel =
        getRiskLevel(residualScore);


    return {

        id: id,

        asset: asset.value.trim(),

        category: category.value,

        threat: threat.value.trim(),

        vulnerability:
            vulnerability.value.trim(),

        description:
            description.value.trim(),

        confidentiality:
            Number(confidentiality.value),

        integrity:
            Number(integrity.value),

        availability:
            Number(availability.value),

        likelihood:
            Number(likelihood.value),

        impact:
            Number(impact.value),

        score:
            inherentScore,

        level:
            inherentLevel.name,

        levelClass:
            inherentLevel.className,

        treatment:
            treatment.value,

        status:
            status.value,

        owner:
            owner.value.trim(),

        deadline:
            deadline.value,

        controls:
            controls.value.trim(),

        residualLikelihood:
            Number(
                residualLikelihood.value
            ),

        residualImpact:
            Number(
                residualImpact.value
            ),

        residualScore:
            residualScore,

        residualLevel:
            residualLevel.name,

        residualLevelClass:
            residualLevel.className,

        notes:
            notes.value.trim(),

        updatedAt:
            new Date().toISOString()
    };
}


/* =========================
   9. FORM SUBMIT
   ========================= */

riskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const currentEditingId =
            editingRiskId.value;


        /* EDIT EXISTING RISK */

        if (currentEditingId) {

            const riskIndex =
                risks.findIndex(
                    function (risk) {

                        return (
                            risk.id ===
                            currentEditingId
                        );
                    }
                );


            if (riskIndex !== -1) {

                const originalCreatedAt =
                    risks[riskIndex].createdAt;


                const updatedRisk =
                    createRiskObject(
                        currentEditingId
                    );


                updatedRisk.createdAt =
                    originalCreatedAt;


                risks[riskIndex] =
                    updatedRisk;
            }

        } else {

            /* CREATE NEW RISK */

            const newRisk =
                createRiskObject(
                    generateRiskId()
                );


            newRisk.createdAt =
                new Date().toISOString();


            risks.push(newRisk);
        }


        saveRisks();

        renderRisks();

        resetForm();


        document
            .getElementById("risk-register")
            .scrollIntoView({
                behavior: "smooth"
            });
    }
);


/* =========================
   10. RESET FORM
   ========================= */

function resetForm() {

    riskForm.reset();

    editingRiskId.value = "";

    formTitle.textContent =
        "Ny riskbedömning";

    saveRiskButton.textContent =
        "Spara risk →";

    cancelEditButton.hidden = true;

    updateRiskCalculations();
}


/* =========================
   11. RESET BUTTON
   ========================= */

resetRiskButton.addEventListener(
    "click",
    function () {

        window.setTimeout(
            updateRiskCalculations,
            0
        );
    }
);


/* =========================
   12. CANCEL EDIT
   ========================= */

cancelEditButton.addEventListener(
    "click",
    function () {

        resetForm();
    }
);


/* =========================
   13. EDIT RISK
   ========================= */

function editRisk(id) {

    const risk =
        risks.find(
            function (item) {

                return item.id === id;
            }
        );


    if (!risk) {
        return;
    }


    editingRiskId.value =
        risk.id;


    asset.value =
        risk.asset;

    category.value =
        risk.category;

    threat.value =
        risk.threat;

    vulnerability.value =
        risk.vulnerability;

    description.value =
        risk.description;

    confidentiality.value =
        risk.confidentiality;

    integrity.value =
        risk.integrity;

    availability.value =
        risk.availability;

    likelihood.value =
        risk.likelihood;

    impact.value =
        risk.impact;

    treatment.value =
        risk.treatment;

    status.value =
        risk.status;

    owner.value =
        risk.owner;

    deadline.value =
        risk.deadline || "";

    controls.value =
        risk.controls;

    residualLikelihood.value =
        risk.residualLikelihood;

    residualImpact.value =
        risk.residualImpact;

    notes.value =
        risk.notes || "";


    formTitle.textContent =
        "Redigera " + risk.id;

    saveRiskButton.textContent =
        "Spara ändringar →";

    cancelEditButton.hidden =
        false;


    updateRiskCalculations();


    document
        .getElementById("new-risk")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================
   14. DELETE RISK
   ========================= */

function deleteRisk(id) {

    const risk =
        risks.find(
            function (item) {

                return item.id === id;
            }
        );


    if (!risk) {
        return;
    }


    const confirmed =
        window.confirm(
            "Vill du ta bort " +
            risk.id +
            " – " +
            risk.asset +
            "?"
        );


    if (!confirmed) {
        return;
    }


    risks =
        risks.filter(
            function (item) {

                return item.id !== id;
            }
        );


    saveRisks();

    renderRisks();


    if (
        editingRiskId.value === id
    ) {
        resetForm();
    }
}


/* =========================
   15. CREATE TABLE CELL
   ========================= */

function createCell(text) {

    const cell =
        document.createElement("td");

    cell.textContent =
        text;

    return cell;
}


/* =========================
   16. CREATE RISK BADGE
   ========================= */

function createRiskBadge(
    level,
    levelClass
) {

    const badge =
        document.createElement("span");


    badge.className =
        "risk-badge " +
        levelClass;


    badge.textContent =
        level;


    return badge;
}


/* =========================
   17. CREATE TABLE ROW
   ========================= */

function createRiskRow(risk) {

    const row =
        document.createElement("tr");


    /* ID */

    row.appendChild(
        createCell(risk.id)
    );


    /* Asset */

    row.appendChild(
        createCell(risk.asset)
    );


    /* Threat */

    row.appendChild(
        createCell(risk.threat)
    );


    /* Risk score */

    row.appendChild(
        createCell(
            risk.score + "/25"
        )
    );


    /* Risk level */

    const levelCell =
        document.createElement("td");


    levelCell.appendChild(
        createRiskBadge(
            risk.level,
            risk.levelClass
        )
    );


    row.appendChild(levelCell);


    /* Owner */

    row.appendChild(
        createCell(
            risk.owner || "—"
        )
    );


    /* Status */

    row.appendChild(
        createCell(risk.status)
    );


    /* Residual risk */

    const residualCell =
        document.createElement("td");


    const residualBadge =
        createRiskBadge(
            risk.residualLevel,
            risk.residualLevelClass
        );


    residualBadge.textContent =
        risk.residualScore +
        "/25 " +
        risk.residualLevel;


    residualCell.appendChild(
        residualBadge
    );


    row.appendChild(
        residualCell
    );


    /* Actions */

    const actionCell =
        document.createElement("td");


    const actionContainer =
        document.createElement("div");


    actionContainer.className =
        "table-actions";


    /* Edit button */

    const editButton =
        document.createElement("button");


    editButton.type =
        "button";

    editButton.className =
        "table-action";

    editButton.textContent =
        "Redigera";


    editButton.addEventListener(
        "click",
        function () {

            editRisk(risk.id);
        }
    );


    /* Delete button */

    const deleteButton =
        document.createElement("button");


    deleteButton.type =
        "button";

    deleteButton.className =
        "table-action delete";

    deleteButton.textContent =
        "Ta bort";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteRisk(risk.id);
        }
    );


    actionContainer.appendChild(
        editButton
    );

    actionContainer.appendChild(
        deleteButton
    );

    actionCell.appendChild(
        actionContainer
    );

    row.appendChild(
        actionCell
    );


    return row;
}


/* =========================
   18. FILTER RISKS
   ========================= */

function getFilteredRisks() {

    const selectedLevel =
        riskFilter.value;


    const searchText =
        riskSearch.value
            .trim()
            .toLowerCase();


    return risks.filter(
        function (risk) {

            /* Risk level */

            const matchesLevel =
                selectedLevel === "all" ||
                risk.levelClass ===
                    selectedLevel;


            /* Search */

            const searchableText = [
                risk.id,
                risk.asset,
                risk.category,
                risk.threat,
                risk.vulnerability,
                risk.description,
                risk.owner,
                risk.status,
                risk.treatment,
                risk.controls,
                risk.notes
            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                searchableText.includes(
                    searchText
                );


            return (
                matchesLevel &&
                matchesSearch
            );
        }
    );
}


/* =========================
   19. RENDER RISKS
   ========================= */

function renderRisks() {

    riskTableBody.replaceChildren();


    const filteredRisks =
        getFilteredRisks();


    /* No risks at all */

    if (risks.length === 0) {

        tableWrapper.hidden = true;

        emptyState.hidden = false;

        emptyState.querySelector("h3")
            .textContent =
            "Inga risker registrerade";

        emptyState.querySelector("p")
            .textContent =
            "Skapa din första riskbedömning för att börja bygga riskregistret.";

    } else {

        tableWrapper.hidden = false;

        emptyState.hidden = true;
    }


    /* Risks exist but filter returned zero */

    if (
        risks.length > 0 &&
        filteredRisks.length === 0
    ) {

        tableWrapper.hidden = true;

        emptyState.hidden = false;

        emptyState.querySelector("h3")
            .textContent =
            "Inga matchande risker";

        emptyState.querySelector("p")
            .textContent =
            "Ändra sökningen eller filtret för att visa andra risker.";
    }


    /* Render */

    filteredRisks.forEach(
        function (risk) {

            const row =
                createRiskRow(risk);

            riskTableBody.appendChild(
                row
            );
        }
    );


    updateDashboard();
}


/* =========================
   20. DASHBOARD
   ========================= */

function updateDashboard() {

    /* Total */

    totalRisks.textContent =
        risks.length;


    /* High + critical */

    const highRiskCount =
        risks.filter(
            function (risk) {

                return (
                    risk.levelClass ===
                        "high" ||
                    risk.levelClass ===
                        "critical"
                );
            }
        ).length;


    highRisks.textContent =
        highRiskCount;


    /* Under treatment */

    const activeRiskCount =
        risks.filter(
            function (risk) {

                return (
                    risk.status ===
                    "Under åtgärd"
                );
            }
        ).length;


    activeRisks.textContent =
        activeRiskCount;


    /* Managed */

    const mitigatedRiskCount =
        risks.filter(
            function (risk) {

                return (
                    risk.status ===
                    "Hanterad"
                );
            }
        ).length;


    mitigatedRisks.textContent =
        mitigatedRiskCount;
}


/* =========================
   21. FILTER EVENT
   ========================= */

riskFilter.addEventListener(
    "change",
    renderRisks
);


/* =========================
   22. SEARCH EVENT
   ========================= */

riskSearch.addEventListener(
    "input",
    renderRisks
);


/* =========================
   23. CSV VALUE
   ========================= */

function csvValue(value) {

    const text =
        String(value ?? "");


    return (
        '"' +
        text.replaceAll(
            '"',
            '""'
        ) +
        '"'
    );
}


/* =========================
   24. EXPORT CSV
   ========================= */

exportRisks.addEventListener(
    "click",
    function () {

        if (risks.length === 0) {

            window.alert(
                "Det finns inga risker att exportera."
            );

            return;
        }


        const headers = [

            "ID",
            "Tillgång",
            "Kategori",
            "Hot",
            "Sårbarhet",
            "Riskbeskrivning",

            "Confidentiality",
            "Integrity",
            "Availability",

            "Sannolikhet",
            "Konsekvens",
            "Riskpoäng",
            "Risknivå",

            "Riskbehandling",
            "Status",
            "Riskägare",
            "Måldatum",
            "Säkerhetsåtgärder",

            "Kvarvarande sannolikhet",
            "Kvarvarande konsekvens",
            "Kvarvarande riskpoäng",
            "Kvarvarande risknivå",

            "Anteckningar"
        ];


        const rows =
            risks.map(
                function (risk) {

                    return [

                        risk.id,
                        risk.asset,
                        risk.category,
                        risk.threat,
                        risk.vulnerability,
                        risk.description,

                        risk.confidentiality,
                        risk.integrity,
                        risk.availability,

                        risk.likelihood,
                        risk.impact,
                        risk.score,
                        risk.level,

                        risk.treatment,
                        risk.status,
                        risk.owner,
                        risk.deadline,
                        risk.controls,

                        risk.residualLikelihood,
                        risk.residualImpact,
                        risk.residualScore,
                        risk.residualLevel,

                        risk.notes

                    ];
                }
            );


        const csvLines = [];


        csvLines.push(
            headers
                .map(csvValue)
                .join(";")
        );


        rows.forEach(
            function (row) {

                csvLines.push(
                    row
                        .map(csvValue)
                        .join(";")
                );
            }
        );


        /*
            BOM improves compatibility
            with Excel and Swedish
            characters such as å, ä, ö.
        */

        const csvContent =
            "\uFEFF" +
            csvLines.join("\r\n");


        const blob =
            new Blob(
                [csvContent],
                {
                    type:
                        "text/csv;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const downloadLink =
            document.createElement("a");


        downloadLink.href =
            url;

        downloadLink.download =
            "security-risk-register.csv";


        document.body.appendChild(
            downloadLink
        );


        downloadLink.click();


        downloadLink.remove();


        URL.revokeObjectURL(url);
    }
);


/* =========================
   25. INITIALIZE APPLICATION
   ========================= */

updateRiskCalculations();

renderRisks();