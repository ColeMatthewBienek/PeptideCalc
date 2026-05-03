const defaults = {
  mass: 10,
  massUnit: "mg",
  water: 2,
  dose: 250,
  doseUnit: "mcg",
  syringe: "100",
  customUnits: 100
};

const elements = {
  form: document.querySelector("#calculator"),
  mass: document.querySelector("#mass"),
  massUnit: document.querySelector("#massUnit"),
  water: document.querySelector("#water"),
  dose: document.querySelector("#dose"),
  doseUnit: document.querySelector("#doseUnit"),
  syringe: document.querySelector("#syringe"),
  customUnits: document.querySelector("#customUnits"),
  resetButton: document.querySelector("#resetButton"),
  concentration: document.querySelector("#concentration"),
  concentrationAlt: document.querySelector("#concentrationAlt"),
  drawVolume: document.querySelector("#drawVolume"),
  drawUnits: document.querySelector("#drawUnits"),
  doseCount: document.querySelector("#doseCount"),
  dosePercent: document.querySelector("#dosePercent"),
  remainingVolume: document.querySelector("#remainingVolume"),
  remainingAmount: document.querySelector("#remainingAmount"),
  doseBarFill: document.querySelector("#doseBarFill"),
  vialFill: document.querySelector("#vialFill"),
  statusBox: document.querySelector("#statusBox")
};

function numberFromInput(input) {
  return Number(input.value);
}

function toMcg(value, unit) {
  return unit === "mg" ? value * 1000 : value;
}

function syringeUnitsPerMl() {
  if (elements.syringe.value === "custom") {
    return numberFromInput(elements.customUnits);
  }
  return Number(elements.syringe.value);
}

function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits
  }).format(value);
}

function formatFixed(value, digits) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0";
}

function validate(values) {
  const errors = [];

  if (!Number.isFinite(values.totalMcg) || values.totalMcg <= 0) {
    errors.push("Vial amount must be greater than zero.");
  }

  if (!Number.isFinite(values.waterMl) || values.waterMl <= 0) {
    errors.push("Water added must be greater than zero.");
  }

  if (!Number.isFinite(values.doseMcg) || values.doseMcg <= 0) {
    errors.push("Desired dose must be greater than zero.");
  }

  if (!Number.isFinite(values.unitsPerMl) || values.unitsPerMl <= 0) {
    errors.push("Syringe scale must be greater than zero.");
  }

  if (values.doseMcg > values.totalMcg) {
    errors.push("Desired dose is larger than the whole vial.");
  }

  return errors;
}

function calculate() {
  const totalMcg = toMcg(numberFromInput(elements.mass), elements.massUnit.value);
  const waterMl = numberFromInput(elements.water);
  const doseMcg = toMcg(numberFromInput(elements.dose), elements.doseUnit.value);
  const unitsPerMl = syringeUnitsPerMl();
  const values = { totalMcg, waterMl, doseMcg, unitsPerMl };
  const errors = validate(values);

  elements.customUnits.disabled = elements.syringe.value !== "custom";

  if (errors.length > 0) {
    renderError(errors);
    return;
  }

  const concentrationMcgPerMl = totalMcg / waterMl;
  const concentrationMgPerMl = concentrationMcgPerMl / 1000;
  const drawMl = doseMcg / concentrationMcgPerMl;
  const syringeUnits = drawMl * unitsPerMl;
  const doseCount = totalMcg / doseMcg;
  const doseFraction = doseMcg / totalMcg;
  const remainingMcg = totalMcg - doseMcg;
  const remainingMl = waterMl - drawMl;

  elements.concentration.textContent = `${formatNumber(concentrationMcgPerMl, 2)} mcg/mL`;
  elements.concentrationAlt.textContent = `${formatNumber(concentrationMgPerMl, 4)} mg/mL`;
  elements.drawVolume.textContent = `${formatFixed(drawMl, 3)} mL`;
  elements.drawUnits.textContent = `${formatNumber(syringeUnits, 1)} units (${unitsPerMl} units/mL)`;
  elements.doseCount.textContent = `${formatNumber(doseCount, 1)} doses`;
  elements.dosePercent.textContent = `${formatNumber(doseFraction * 100, 2)}% of vial per dose`;
  elements.remainingVolume.textContent = `${formatFixed(Math.max(remainingMl, 0), 3)} mL`;
  elements.remainingAmount.textContent = `${formatNumber(Math.max(remainingMcg, 0), 2)} mcg left`;

  const percent = Math.min(Math.max(doseFraction * 100, 0), 100);
  elements.doseBarFill.style.width = `${percent}%`;
  elements.vialFill.style.height = `${Math.max(12, 88 - percent * 0.7)}%`;

  const warnings = [];
  if (drawMl < 0.01) {
    warnings.push("Draw volume is under 0.01 mL. Measuring this accurately may be difficult.");
  }
  if (syringeUnits < 1) {
    warnings.push("Syringe unit result is under 1 unit. Recheck concentration and dose.");
  }
  if (doseFraction > 0.25) {
    warnings.push("Single dose uses more than 25% of the vial. Verify your dose input.");
  }

  elements.statusBox.classList.remove("error");
  elements.statusBox.textContent =
    warnings.length > 0
      ? warnings.join(" ")
      : "Calculations update instantly. Recheck units before using any result.";
}

function renderError(errors) {
  elements.concentration.textContent = "--";
  elements.concentrationAlt.textContent = "Fix inputs";
  elements.drawVolume.textContent = "--";
  elements.drawUnits.textContent = "--";
  elements.doseCount.textContent = "--";
  elements.dosePercent.textContent = "--";
  elements.remainingVolume.textContent = "--";
  elements.remainingAmount.textContent = "--";
  elements.doseBarFill.style.width = "0%";
  elements.vialFill.style.height = "12%";
  elements.statusBox.classList.add("error");
  elements.statusBox.textContent = errors.join(" ");
}

function reset() {
  elements.mass.value = String(defaults.mass);
  elements.massUnit.value = defaults.massUnit;
  elements.water.value = String(defaults.water);
  elements.dose.value = String(defaults.dose);
  elements.doseUnit.value = defaults.doseUnit;
  elements.syringe.value = defaults.syringe;
  elements.customUnits.value = String(defaults.customUnits);
  calculate();
}

elements.form.addEventListener("input", calculate);
elements.form.addEventListener("change", calculate);
elements.resetButton.addEventListener("click", reset);

document.querySelectorAll("[data-water], [data-dose]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.water !== undefined) {
      elements.water.value = button.dataset.water;
    }
    if (button.dataset.dose !== undefined) {
      elements.dose.value = button.dataset.dose;
      elements.doseUnit.value = "mcg";
    }
    calculate();
  });
});

calculate();
