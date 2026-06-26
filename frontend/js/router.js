import { initPerformanceMetricsPage, performanceMetricsPage } from "./pages/performanceMetricsPage.js";


const pages = {
    PerformanceMetrics: performanceMetricsPage
};

export function initRouter() {
    const main = document.querySelector("#app-content");
    const navLinks = document.querySelectorAll(".nav-link");

    function renderPage(pageName) {
        main.innerHTML = pages[pageName]();
        if (pageName === "PerformanceMetrics") {
            initPerformanceMetricsPage();
        }
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.dataset.page === pageName) {
                link.classList.add("active")
            }
        });
    }
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const pageName = link.dataset.page;
            renderPage(pageName);
        });
    });

    renderPage("PerformanceMetrics");
}