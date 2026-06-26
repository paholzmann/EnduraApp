export function setRaceCategoryTextColor(raceCategoryItem, raceCategory) {
    if (raceCategory == '20K') {
        return "var(--utmb-20k)";
    }
    else if (raceCategory == '50K') {
        return "var(--utmb-50k)"
    }
    else if (raceCategory == '100K') {
        return "var(--utmb-100k)"
    }
    else if (raceCategory == '100M') {
        return "var(--utmb-100m)"
    }
    else {
        return "white";
    }
}
export function setPercentageBar(raceDifficultyScoreItem, raceDifficultyScore, raceDifficultyScoreFillItem) {
    const safeValue = Math.max(0, Math.min(100, raceDifficultyScore));
    const finalValue = safeValue.toFixed(2);
    raceDifficultyScoreItem.textContent = finalValue;
    raceDifficultyScoreFillItem.style.width = `${finalValue}%`;
}