import { convertMinutesToReadableHours } from "../utils/formatter.js";
import { getRacePlacementProjection } from "../api/performanceMetricsAPI.js";

export function renderRaceTable(races, tableBody, currentPage, pageSize) {
    const offset = (currentPage - 1) * pageSize;

    tableBody.innerHTML = races.map((race, index) => `
        <tr>
            <td>#${offset + index + 1}</td>
            <td>${race["Race_Title"]}</td>
            <td>${race["Date"]}</td>
            <td>${race["Race_Category"]}</td>
            <td>${race["Distance"]} km</td>
            <td>${race["Elevation_Gain"]} m+</td>
            <td>${race["N_Results"]}</td>
            <td>${convertMinutesToReadableHours(race["Time_Based_On_Flat_Equivalent"])}</td>
            <td>${race["Possible_Placement"]}</td>
        </tr>
    `).join("");
}

export function renderRaceDatabaseTable(races, tableBody, currentPage, pageSize) {
    const offset = (currentPage - 1) * pageSize;
    tableBody.innerHTML = races.map((race, index) => `
        <tr>
            <td>#${offset + index + 1}</td>
            <td>${race["Race_Title"]}</td>
            <td>${race["Date"]}</td>
            <td>${race["Race_Category"]}</td>
            <td>${race["Distance"]} km</td>
            <td>${race["Elevation_Gain"]} m+</td>
            <td>${race["N_Results"]}</td>
            <td>${race["Race_Effort"]} km</td>
        </tr>
    `).join("");
}

export async function loadRaceDatabasePage(page, limit, tableBody) {
    try {
        const offset = (page - 1) * limit;
        const data = await getRaceDatabase(limit, offset);

        const races = data.result;
        const hasNextPage = races.length === limit;

        renderRaceDatabaseTable(races, tableBody, page, limit);

        document.querySelector("#race-database-prev-btn").disabled = page <= 1;
        document.querySelector("#race-database-next-btn").disabled = !hasNextPage;

        return {
            currentPage: page,
            hasNextPage
        };

    } catch (error) {
        console.error(error);
        return {
            currentPage: page,
            hasNextPage: false
        };
    }
}

export async function loadRacePage(page, distance, elevation, totalMinutes, pageSize, tableBody) {
    try {
        const data = await getRacePlacementProjection(
            page,
            distance,
            elevation,
            totalMinutes,
            pageSize
        );

        const races = data.result;
        const hasNextPage = races.length === pageSize;

        renderRaceTable(races, tableBody, page, pageSize);

        document.querySelector("#effort-based-matching-prev-page-btn").disabled = page <= 1;
        document.querySelector("#effort-based-matching-next-btn").disabled = !hasNextPage;

        return {
            currentPage: page,
            hasNextPage
        };

    } catch (error) {
        console.error(error);
    }
}
