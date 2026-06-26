const performanceMetricsUrl = "https://enduraapi.onrender.com/api/v1/performance_metrics/get_all";

export async function getAllPerformanceMetrics(distance, elevation, totalMinutes) {
    try {
        const response = await fetch(performanceMetricsUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                distance: distance,
                elevation: elevation,
                total_minutes: totalMinutes
            })
        });
        if (!response.ok) {
            throw new Error("Request failed");
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error(error);
    }
}

const racePlacementProjectionURL = "http://127.0.0.1:8000/api/v1/performance_projection/race_placement_projection";

export async function getRacePlacementProjection(page = 1, distance, elevation, totalMinutes, limit) {
    const offset = (page - 1) * limit;
    try {
        const response = await fetch(racePlacementProjectionURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                distance: distance,
                elevation: elevation,
                total_time: totalMinutes,
                limit: limit,
                offset: offset
            })
        });
        if (!response.ok) {
            throw new Error("Request failed");
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error(error);
    }
}