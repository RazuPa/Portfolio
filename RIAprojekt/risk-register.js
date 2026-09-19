/* =========================================================
   SECURITY RISK REGISTER
   risk-register.js
   ========================================================= */


/* =========================================================
   01. DOM ELEMENTS
   ========================================================= */

/* Main form */

const riskForm =
    document.getElementById("riskForm");

const editingRiskId =
    document.getElementById("editingRiskId");


/* Risk identification */

const asset =
    document.getElementById("asset");

const category =
    document.getElementById("category");

const threat =
    document.getElementById("threat");

const vulnerability =
    document.getElementById("vulnerability");

const description =
    document.getElementById("description");


/* CIA impact */

const confidentiality =
    document.getElementById("confidentiality");

const integrity =
    document.getElementById("integrity");

const availability =
    document.getElementById("availability");


/* Inherent risk */

const likelihood =
    document.getElementById("likelihood");

const impact =
    document.getElementById("impact");


/* Risk treatment */

const treatment =
    document.getElementById("treatment");

const status =
    document.getElementById("status");

const owner =
    document.getElementById("owner");

const deadline =
    document.getElementById("deadline");

const controls =
    document.getElementById("controls");


/* Residual risk */

const residualLikelihood =
    document.getElementById("residualLikelihood");

const residualImpact =
    document.getElementById("residualImpact");


/* Notes */

const notes =
    document.getElementById("notes");


/* =========================================================
   02. RISK CALCULATION ELEMENTS
   ========================================================= */

/* Inherent risk result */

const inherentRiskScore =
    document.getElementById("inherentRiskScore");

const inherentRiskLevel =
    document.getElementById("inherentRiskLevel");

const inherentRiskResult =
    document.getElementById("inherentRiskResult");


/* Residual risk result */

const residualRiskScore =
    document.getElementById("residualRiskScore");

const residualRiskLevel =
    document.getElementById("residualRiskLevel");

const residualRiskResult =
    document.getElementById("residualRiskResult");


/* =========================================================
   03. RISK REGISTER ELEMENTS
   ========================================================= */

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


/* =========================================================
   04. DASHBOARD ELEMENTS
   ========================================================= */

const totalRisks =
    document.getElementById("totalRisks");

const highRisks =
    document.getElementById("highRisks");

const activeRisks =
    document.getElementById("activeRisks");

const mitigatedRisks =
    document.getElementById("mitigatedRisks");


/* =========================================================
   05. EDIT FORM ELEMENTS
   ========================================================= */

const formTitle =
    document.getElementById("formTitle");

const saveRiskButton =
    document.getElementById("saveRisk");

const cancelEditButton =
    document.getElementById("cancelEdit");

const resetRiskButton =
    document.getElementById("resetRisk");


/* =========================================================
   06. LOCAL STORAGE
   ========================================================= */

/*
    Risks are stored locally in the user's browser.

    This allows the application to keep saved risks
    even after the browser has been closed or refreshed.
*/

const STORAGE_KEY =
    "securityRiskRegister";

let risks =
    loadRisks();


/*
    Load saved risks from LocalStorage.
*/

function loadRisks() {

    const savedRisks =
        localStorage.getItem(STORAGE_KEY);


    /* No saved risks */

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
            "Could not read the risk register:",
            error
        );

        return [];
    }
}


/*
    Save the current risk register to LocalStorage.
*/

function saveRisks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(risks)
    );
}


/* =========================================================
   07. RISK LEVEL
   ========================================================= */

/*
    Risk score calculation:

    Risk = Likelihood × Impact

    1–4   = Low
    5–10  = Medium
    11–16 = High
    17–25 = Critical
*/

function getRiskLevel(score) {

    if (score <= 4) {

        return {
            name: "LOW",
            className: "low"
        };
    }


    if (score <= 10) {

        return {
            name: "MEDIUM",
            className: "medium"
        };
    }


    if (score <= 16) {

        return {
            name: "HIGH",
            className: "high"
        };
    }


    return {
        name: "CRITICAL",
        className: "critical"
    };
}


/* =========================================================
   08. CALCULATE RISK SCORE
   ========================================================= */

/*
    Multiply likelihood by impact.

    Both values are converted to numbers before
    the calculation is performed.
*/

function calculateRisk(
    likelihoodValue,
    impactValue
) {

    return (
        Number(likelihoodValue) *
        Number(impactValue)
    );
}


/* =========================================================
   09. UPDATE LIVE RISK CALCULATIONS
   ========================================================= */

/*
    Update both inherent risk and residual risk
    whenever the user changes the values.
*/

function updateRiskCalculations() {


    /* -----------------------------------------------------
       Inherent risk
       ----------------------------------------------------- */

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



    /* -----------------------------------------------------
       Residual risk
       ----------------------------------------------------- */

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


/* =========================================================
   10. RISK CALCULATION EVENTS
   ========================================================= */

/*
    Recalculate the risk when any risk value changes.
*/

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


/* =========================================================
   11. GENERATE RISK ID
   ========================================================= */

/*
    Generate sequential risk IDs.

    Example:

    R-001
    R-002
    R-003
*/

function generateRiskId() {

    let highestNumber = 0;


    risks.forEach(
        function (risk) {

            const number =
                Number(
                    String(risk.id)
                        .replace("R-", "")
                );


            if (
                Number.isFinite(number) &&
                number > highestNumber
            ) {

                highestNumber =
                    number;
            }
        }
    );


    const nextNumber =
        highestNumber + 1;


    return (
        "R-" +
        String(nextNumber)
            .padStart(3, "0")
    );
}


/* =========================================================
   12. CREATE RISK OBJECT
   ========================================================= */

/*
    Create a JavaScript object containing all
    information entered in the risk assessment form.
*/

function createRiskObject(id) {


    /* Calculate inherent risk */

    const inherentScore =
        calculateRisk(
            likelihood.value,
            impact.value
        );


    const inherentLevel =
        getRiskLevel(inherentScore);



    /* Calculate residual risk */

    const residualScore =
        calculateRisk(
            residualLikelihood.value,
            residualImpact.value
        );


    const residualLevel =
        getRiskLevel(residualScore);



    /* Create risk object */

    return {

        id: id,

        asset:
            asset.value.trim(),

        category:
            category.value,

        threat:
            threat.value.trim(),

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


/* =========================================================
   13. FORM SUBMISSION
   ========================================================= */

/*
    When the form is submitted:

    1. Prevent normal page reload.
    2. Check whether a risk is being edited.
    3. Create or update the risk.
    4. Save the risk register.
    5. Render the updated table.
*/

riskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const currentEditingId =
            editingRiskId.value;



        /* -------------------------------------------------
           Edit existing risk
           ------------------------------------------------- */

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


            /* -------------------------------------------------
               Create new risk
               ------------------------------------------------- */

            const newRisk =
                createRiskObject(
                    generateRiskId()
                );


            newRisk.createdAt =
                new Date().toISOString();


            risks.push(newRisk);
        }



        /* Save changes */

        saveRisks();


        /* Update interface */

        renderRisks();


        /* Reset form */

        resetForm();


        /* Scroll to risk register */

        document
            .getElementById("risk-register")
            .scrollIntoView({
                behavior: "smooth"
            });
    }
);


/* =========================================================
   14. RESET FORM
   ========================================================= */

/*
    Reset the form to its default state.
*/

function resetForm() {

    riskForm.reset();


    editingRiskId.value =
        "";


    formTitle.textContent =
        "New Risk Assessment";


    saveRiskButton.textContent =
        "Save Risk →";


    cancelEditButton.hidden =
        true;


    updateRiskCalculations();
}


/* =========================================================
   15. RESET BUTTON
   ========================================================= */

/*
    Wait until the browser has reset the form,
    then recalculate the default risk values.
*/

resetRiskButton.addEventListener(
    "click",
    function () {

        window.setTimeout(
            updateRiskCalculations,
            0
        );
    }
);


/* =========================================================
   16. CANCEL EDITING
   ========================================================= */

cancelEditButton.addEventListener(
    "click",
    function () {

        resetForm();
    }
);


/* =========================================================
   17. EDIT RISK
   ========================================================= */

/*
    Load an existing risk into the form
    so the user can edit it.
*/

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



    /* Store the ID currently being edited */

    editingRiskId.value =
        risk.id;



    /* Load identification data */

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



    /* Load CIA values */

    confidentiality.value =
        risk.confidentiality;

    integrity.value =
        risk.integrity;

    availability.value =
        risk.availability;



    /* Load inherent risk values */

    likelihood.value =
        risk.likelihood;

    impact.value =
        risk.impact;



    /* Load treatment data */

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



    /* Load residual risk values */

    residualLikelihood.value =
        risk.residualLikelihood;

    residualImpact.value =
        risk.residualImpact;



    /* Load notes */

    notes.value =
        risk.notes || "";



    /* Change form interface */

    formTitle.textContent =
        "Edit " + risk.id;


    saveRiskButton.textContent =
        "Save Changes →";


    cancelEditButton.hidden =
        false;



    /* Update calculations */

    updateRiskCalculations();



    /* Scroll to form */

    document
        .getElementById("new-risk")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   18. DELETE RISK
   ========================================================= */

/*
    Delete a risk after user confirmation.
*/

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
            "Are you sure you want to delete " +
            risk.id +
            " – " +
            risk.asset +
            "?"
        );


    if (!confirmed) {
        return;
    }



    /* Remove risk */

    risks =
        risks.filter(
            function (item) {

                return item.id !== id;
            }
        );



    /* Save updated register */

    saveRisks();



    /* Update interface */

    renderRisks();



    /* Reset form if deleted risk was being edited */

    if (
        editingRiskId.value === id
    ) {

        resetForm();
    }
}


/* =========================================================
   19. CREATE TABLE CELL
   ========================================================= */

/*
    Create a standard table cell.
*/

function createCell(text) {

    const cell =
        document.createElement("td");


    cell.textContent =
        text;


    return cell;
}


/* =========================================================
   20. CREATE RISK BADGE
   ========================================================= */

/*
    Create a colored badge representing
    the current risk level.
*/

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


/* =========================================================
   21. CREATE RISK TABLE ROW
   ========================================================= */

/*
    Create one table row for a risk.
*/

function createRiskRow(risk) {

    const row =
        document.createElement("tr");



    /* Risk ID */

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



    /* Inherent risk score */

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


    row.appendChild(
        levelCell
    );



    /* Risk owner */

    row.appendChild(
        createCell(
            risk.owner || "—"
        )
    );



    /* Status */

    row.appendChild(
        createCell(
            getEnglishStatus(
                risk.status
            )
        )
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



    /* -----------------------------------------------------
       Action buttons
       ----------------------------------------------------- */

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
        "Edit";


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
        "Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteRisk(risk.id);
        }
    );



    /* Add buttons */

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


/* =========================================================
   22. STATUS TRANSLATION
   ========================================================= */

/*
    Older risks may still contain Swedish status values
    because they were created before the interface was
    translated to English.

    This function allows those risks to continue working.
*/

function getEnglishStatus(riskStatus) {

    const statusTranslations = {

        "Öppen":
            "Open",

        "Under åtgärd":
            "In Progress",

        "Hanterad":
            "Mitigated",

        "Accepterad":
            "Accepted"
    };


    return (
        statusTranslations[riskStatus] ||
        riskStatus
    );
}


/* =========================================================
   23. FILTER RISKS
   ========================================================= */

/*
    Filter risks using:

    1. Selected risk level.
    2. Search field.
*/

function getFilteredRisks() {

    const selectedLevel =
        riskFilter.value;


    const searchText =
        riskSearch.value
            .trim()
            .toLowerCase();


    return risks.filter(
        function (risk) {


            /* Risk level filter */

            const matchesLevel =
                selectedLevel === "all" ||
                risk.levelClass ===
                    selectedLevel;



            /* Create searchable text */

            const searchableText = [

                risk.id,
                risk.asset,
                risk.category,
                risk.threat,
                risk.vulnerability,
                risk.description,
                risk.owner,
                risk.status,
                getEnglishStatus(risk.status),
                risk.treatment,
                risk.controls,
                risk.notes

            ]
                .join(" ")
                .toLowerCase();



            /* Search match */

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


/* =========================================================
   24. RENDER RISKS
   ========================================================= */

/*
    Render the risk register table.

    The empty state is displayed when:

    - No risks have been created.
    - The current filter returns no results.
*/

function renderRisks() {

    riskTableBody.replaceChildren();


    const filteredRisks =
        getFilteredRisks();



    /* -----------------------------------------------------
       No risks exist
       ----------------------------------------------------- */

    if (risks.length === 0) {

        tableWrapper.hidden =
            true;


        emptyState.hidden =
            false;


        emptyState
            .querySelector("h3")
            .textContent =
            "No Risks Registered";


        emptyState
            .querySelector("p")
            .textContent =
            "Create your first risk assessment to start building the risk register.";

    } else {

        tableWrapper.hidden =
            false;


        emptyState.hidden =
            true;
    }



    /* -----------------------------------------------------
       Risks exist but no filter results were found
       ----------------------------------------------------- */

    if (
        risks.length > 0 &&
        filteredRisks.length === 0
    ) {

        tableWrapper.hidden =
            true;


        emptyState.hidden =
            false;


        emptyState
            .querySelector("h3")
            .textContent =
            "No Matching Risks";


        emptyState
            .querySelector("p")
            .textContent =
            "Change the search query or filter to display other risks.";
    }



    /* -----------------------------------------------------
       Render risk rows
       ----------------------------------------------------- */

    filteredRisks.forEach(
        function (risk) {

            const row =
                createRiskRow(risk);


            riskTableBody.appendChild(
                row
            );
        }
    );



    /* Update dashboard */

    updateDashboard();
}


/* =========================================================
   25. UPDATE DASHBOARD
   ========================================================= */

/*
    Update dashboard statistics.
*/

function updateDashboard() {


    /* -----------------------------------------------------
       Total number of risks
       ----------------------------------------------------- */

    totalRisks.textContent =
        risks.length;



    /* -----------------------------------------------------
       High and critical risks
       ----------------------------------------------------- */

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



    /* -----------------------------------------------------
       Risks currently being treated

       Both English and old Swedish values are accepted.
       ----------------------------------------------------- */

    const activeRiskCount =
        risks.filter(
            function (risk) {

                return (
                    risk.status ===
                        "In Progress" ||

                    risk.status ===
                        "Under åtgärd"
                );
            }
        ).length;


    activeRisks.textContent =
        activeRiskCount;



    /* -----------------------------------------------------
       Mitigated risks

       Both English and old Swedish values are accepted.
       ----------------------------------------------------- */

    const mitigatedRiskCount =
        risks.filter(
            function (risk) {

                return (
                    risk.status ===
                        "Mitigated" ||

                    risk.status ===
                        "Hanterad"
                );
            }
        ).length;


    mitigatedRisks.textContent =
        mitigatedRiskCount;
}


/* =========================================================
   26. FILTER EVENT
   ========================================================= */

riskFilter.addEventListener(
    "change",
    renderRisks
);


/* =========================================================
   27. SEARCH EVENT
   ========================================================= */

riskSearch.addEventListener(
    "input",
    renderRisks
);


/* =========================================================
   28. CSV VALUE
   ========================================================= */

/*
    Prepare values for CSV export.

    Double quotes inside values are escaped
    to prevent malformed CSV data.
*/

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


/* =========================================================
   29. EXPORT CSV
   ========================================================= */

/*
    Export the complete risk register as a CSV file.
*/

exportRisks.addEventListener(
    "click",
    function () {


        /* -------------------------------------------------
           Prevent export if no risks exist
           ------------------------------------------------- */

        if (risks.length === 0) {

            window.alert(
                "There are no risks to export."
            );

            return;
        }



        /* -------------------------------------------------
           CSV column headers
           ------------------------------------------------- */

        const headers = [

            "ID",

            "Asset",

            "Category",

            "Threat",

            "Vulnerability",

            "Risk Description",

            "Confidentiality",

            "Integrity",

            "Availability",

            "Likelihood",

            "Impact",

            "Risk Score",

            "Risk Level",

            "Risk Treatment",

            "Status",

            "Risk Owner",

            "Target Date",

            "Security Controls",

            "Residual Likelihood",

            "Residual Impact",

            "Residual Risk Score",

            "Residual Risk Level",

            "Notes"
        ];



        /* -------------------------------------------------
           Create CSV rows
           ------------------------------------------------- */

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

                        getEnglishStatus(
                            risk.status
                        ),

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



        /* -------------------------------------------------
           Build CSV content
           ------------------------------------------------- */

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
            UTF-8 BOM improves compatibility
            when opening the CSV file in Excel.
        */

        const csvContent =
            "\uFEFF" +
            csvLines.join("\r\n");



        /* -------------------------------------------------
           Create downloadable CSV file
           ------------------------------------------------- */

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


/* =========================================================
   30. INITIALIZE APPLICATION
   ========================================================= */

/*
    Calculate the initial risk values
    when the page loads.
*/

updateRiskCalculations();


/*
    Render saved risks and dashboard statistics
    when the page loads.
*/

renderRisks();