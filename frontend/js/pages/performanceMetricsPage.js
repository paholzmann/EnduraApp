import { getAllPerformanceMetrics, getRacePlacementProjection } from "../api/performanceMetricsAPI.js";
import { convertPaceToReadablePace} from "../utils/formatter.js";
import { setRaceCategoryTextColor, setPercentageBar } from "../utils/styler.js";
import { renderRaceTable, loadRacePage } from "../ui/table.js";

export function performanceMetricsPage () {
    return `
        <header class="topbar">
            <div class="topbar-left">
                <p class="eyebrow">Dashboard</p>
                <h1 class="page-title">Performance Overview</h1>
            </div>
            <div class="topbar-right">
                <button class="button button-secondary" type="button">Import Race</button>
                <button class="button button-primary">New Analysis</button>
            </div>
        </header>
        <main class="dashboard-main" id="app-main">
            <section class="dashboard-section">
                <div class="section-header">
                    <div>
                        <p class="eyebrow">Performance Metrics</p>
                        <h1 id="overview-title" class="section-title">Your Endurance Intelligence Hub</h1>
                    </div>
                </div>
                <div class="dashboard-grid">
                    <article class="card metric-card">
                        <p class="eyebrow">Input</p>
                        <form id="performance-metrics-form" class="form metric-form">
                            <div class="form-group">
                                <label for="distance">Distance (km)</label>
                                <input type="number" id="distance" name="distance" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label for="elevation">Elevation gain (m+)</label>
                                <input type="number" id="elevation" name="elevation" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label for="total-time">Total time (minutes)</label>
                                <input type="number" id="total-time" name="total-time" placeholder="0">
                            </div>
                            <button class="button button-primary" type="submit">
                                Calculate
                            </button>
                        </form>
                    </article>
                </div>
            </section>

            <section class="dashboard-section">
                <div class="section-header">
                    <div>
                        <p class="eyebrow">Basic Metrics</p>
                        <h1 id="overview-title" class="section-title">Lorem BLA BLA BLA BLA</h1>
                    </div>
                    <p class="section-description">
                        Analyze running performance, estimate race difficulty and project competitive outcomes.
                    </p>
                </div>
                <div class="dashboard-grid dashboard-grid-4">
                    <article class="card metric-card">
                        <p class="eyebrow">Race Effort</p>
                        <p id="race-effort" class="metric-value">—</p>
                        <p class="metric-description">Distance and elevation adjusted load.</p>
                    </article>
                    <article class="card metric-card">
                        <p class="eyebrow">Vertical Rate</p>
                        <p id="vertical-rate" class="metric-value">—</p>
                        <p class="metric-description">Climb intensity across race profiles.</p>
                    </article>
                    <article class="card metric-card">
                        <p class="eyebrow">Pace on flat equivalent</p>
                        <p id="pace-on-flat-equivalent" class="metric-value">—</p>
                        <p class="metric-description">Empty</p>
                    </article>
                    <article class="card metric-card">
                        <p class="eyebrow">Pace</p>
                        <p id="pace" class="metric-value">—</p>
                        <p class="metric-description">Model readiness for prediction.</p>
                    </article>
                </div>
            </section>

            <section class="dashboard-section">
                <div class="section-header">
                    <div>
                        <p class="eyebrow">Race Metrics</p>
                        <h1 class="section-title">Race Profile</h1>
                    </div>
                    <p class="section-description">
                        Comprehensive insights and performance analysis to better understand, evaluate, and compare endurance race demands.
                    </p>
                </div>
                <div class="dashboard-grid dashboard-grid-3">
                    <article class="card metric-card">
                        <p class="eyebrow">Race Category</p>
                        <p id="race-category" class="metric-value">—</p>
                        <p class="metric-description">A</p>
                    </article>
                    <article class="card metric-card">
                        <p class="eyebrow">Race Difficulty</p>
                        <div class="percentage-header">
                            <span id="race-difficulty-score" class="percentage-value">—</span>
                        </div>
                        
                        <div class="percentage-track">
                            <div id="race-difficulty-score-fill" class="percentage-fill"></div>
                        </div>
                    </article>
                    <article class="card metric-card">
                        <p class="eyebrow">Category Label</p>
                        <p id="category-label" class="metric-value">—</p>
                        <p class="metric-description">Model readiness for prediction.</p>
                    </article>
                </div>
            </section>

            <section class="dashboard-section">
                <div class="section-header">
                    <div>
                        <p class="eyebrow">Performance Projection</p>
                        <h1 class="section-title">Race Placement Projection</h1>
                    </div>
                    <p class="section-description">
                        Comprehensive insights and performance analysis to better understand, evaluate, and compare endurance race demands.
                    </p>
                </div>
                <div class="table-toolbar">
                    <input id="race-search" type="search" placeholder="Search...">
                    <select class="category-filter">
                        <option value="all">All</option>
                        <option value="50K">50K</option>
                        <option value="100K">100K</option>
                        <option value="100M">100M</option>
                    </select>
                </div>
                <div class="table-wrapper">
                    <table class="race-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Race</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Distance</th>
                                <th>Elevation</th>
                                <th>Participants</th>
                                <th>Projected time</th>
                                <th>Possible placement</th>
                            </tr>
                        </thead>
                        <tbody id="race-placement-table"></tbody>
                    </table>
                    <div class="pagination">
                        <button class="button button-primary" id="effort-based-matching-prev-page-btn">Previous</button>
                        <button class="button button-primary" id="effort-based-matching-next-btn">Next</button>
                    </div>
                </div>
            </section>
        </main>
    `;
}

export function initPerformanceMetricsPage() {
    const form = document.querySelector("#performance-metrics-form");
    const racePlacementProjectionTable = document.querySelector("#race-placement-table");
    const distanceInput = document.querySelector("#distance");
    const elevationInput = document.querySelector("#elevation");
    const totalTimeInput = document.querySelector("#total-time");

    let currentPage = 0;
    let pageSize = 10;
    let hasNextPage = false;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        currentPage = 0;
        hasNextPage = false;

        const performanceMetrics = await getAllPerformanceMetrics(
            Number(distanceInput.value),
            Number(elevationInput.value),
            Number(totalTimeInput.value)
        );
        const raceEffort = performanceMetrics.results["Race_effort"];
        const pace = convertPaceToReadablePace(performanceMetrics.results["Pace"]);
        const verticalRate = performanceMetrics.results["Vertical_rate"].toFixed(2);
        const paceOnFlatEquivalent = convertPaceToReadablePace(performanceMetrics.results["Pace_on_flat_equivalent"]);
        const raceCategory = performanceMetrics.results["Race_category"];
        const raceDifficultyScore = performanceMetrics.results["Race_difficulty_score"];
        const categoryLabel = performanceMetrics.results["Category_label"];

        const raceEffortItem = document.querySelector("#race-effort");
        raceEffortItem.textContent = `${raceEffort} km`;
        
        const paceItem = document.querySelector("#pace");
        paceItem.textContent = `${pace} min/km`;

        const verticalRateItem = document.querySelector("#vertical-rate");
        verticalRateItem.textContent = `${verticalRate} m+/km`;

        const paceOnFlatEquivalentItem = document.querySelector("#pace-on-flat-equivalent");
        paceOnFlatEquivalentItem.textContent = `${paceOnFlatEquivalent} min/km`;

        const raceCategoryItem = document.querySelector("#race-category");
        raceCategoryItem.textContent = raceCategory;
        raceCategoryItem.style.color = setRaceCategoryTextColor(raceCategoryItem, raceCategory);

        const raceDifficultyScoreItem = document.querySelector("#race-difficulty-score");
        const raceDifficultyScoreFillItem = document.querySelector("#race-difficulty-score-fill");
        setPercentageBar(raceDifficultyScoreItem, raceDifficultyScore, raceDifficultyScoreFillItem);

        const categoryLabelItem = document.querySelector("#category-label");
        categoryLabelItem.textContent = categoryLabel;


        const racePlacementProjection = await getRacePlacementProjection(1, Number(distanceInput.value), Number(elevationInput.value), Number(totalTimeInput.value), 10);
        const result = await loadRacePage(
            currentPage + 1,
            Number(distanceInput.value),
            Number(elevationInput.value),
            Number(totalTimeInput.value),
            pageSize,
            racePlacementProjectionTable
        );

        currentPage = result.currentPage;
        hasNextPage = result.hasNextPage;
    });
    document.querySelector("#effort-based-matching-next-btn")
        .addEventListener("click", async () => {
            const result = await loadRacePage(
                currentPage + 1,
                Number(distanceInput.value),
                Number(elevationInput.value),
                Number(totalTimeInput.value),
                pageSize,
                racePlacementProjectionTable
            );

            currentPage = result.currentPage;
            hasNextPage = result.hasNextPage;
        });

    document.querySelector("#effort-based-matching-prev-page-btn")
        .addEventListener("click", async () => {
            if (currentPage <= 1) return;

            const result = await loadRacePage(
                currentPage - 1,
                Number(distanceInput.value),
                Number(elevationInput.value),
                Number(totalTimeInput.value),
                pageSize,
                racePlacementProjectionTable
            );

            currentPage = result.currentPage;
            hasNextPage = result.hasNextPage;
        });
}