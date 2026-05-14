// Set the chart size and spacing around the drawing area.
const width = 650;
const height = 400;
const margin = { top: 30, right: 30, bottom: 60, left: 70 };

// Create the SVG container that will hold the bar chart.
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load the credit card application data from the external CSV file.
d3.csv("Credit_Card_Applications.csv").then(function(data) {
    // Count how many applications are in each class category.
    const classCounts = d3.rollups(
        data,
        v => v.length,
        d => d.Class
    );

    // Convert the class values into clearer labels for the chart.
    const chartData = classCounts.map(function(d) {
        return {
            decision: d[0] === "1" ? "Approved" : "Denied",
            count: d[1]
        };
    });

    // Create the horizontal scale for the decision categories.
    const xScale = d3.scaleBand()
        .domain(chartData.map(d => d.decision))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    // Create the vertical scale for the number of applications.
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.count)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Draw one bar for each decision category.
    svg.selectAll("rect")
        .data(chartData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.decision))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.count));

    // Add the x-axis to show the application decisions.
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    // Add the y-axis to show the number of applications.
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Add a label for the x-axis.
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .text("Application Decision");

    // Add a label for the y-axis.
    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Number of Applications");
});
