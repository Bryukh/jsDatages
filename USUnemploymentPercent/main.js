const margins = {
  top: 120,
  bottom: 100,
  left: 100,
  right: 60
};

const svgHeight = svgWidth = 800;
const chartWidth = svgWidth - margins.left - margins.right;
const chartHeight = svgHeight - margins.top - margins.bottom;
var canvas = d3.select("#chart-area")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

const chart = canvas.append("g")
      .attr("transform", `translate(${margins.left},${margins.top})`);

// Title
canvas.append('text')
  .text('Unemployment Rate in the US')
  .attr('y', 60)
  .attr('x', svgWidth / 2)
  .attr('text-anchor', 'middle')
  .attr('font-family', 'Montserrat')
  .attr('font-size', 40)
  .attr('font-weight', 500)

// Author
// canvas.append('text')
//   .text('@Bryukh')
//   .attr('y', svgHeight - 25)
//   .attr('x', 40)
//   .attr('text-anchor', 'start')
//   .attr('font-family', 'Montserrat')
//   .attr('font-size', 20)
//   .attr('font-weight', 500)
canvas.append("svg:image")
  .attr('xlink:href', '../assets/logos/MDS_URL_trans_borderless.png')
  .attr('x', 40)
  .attr('y', svgHeight - 40)
  .attr('height', 20)
// Source
const sourceText = canvas.append('text')
  .attr('y', svgHeight - 20)
  .attr('x', svgWidth - 30)
  .attr('text-anchor', 'end')
  .attr("baseline", "bottom")
  .attr('font-family', 'Montserrat')
  .attr('font-size', 14)
  .attr('font-weight', 400);
sourceText
  .append('tspan')
  .text('Source: ')
  .attr('font-weight', 600);
sourceText
  .append('tspan')
  .text('U.S. Bureau of Labor Statistics');
// sourceText
//   .append('tspan')
//   .text('World Economic Forum')
//   .attr('dy', 14)
//   .attr('x', svgWidth - 30);


d3.csv("data.csv").then((data) => {
  const cData = [];
  data.forEach(row => {
    for (const [key, value] of Object.entries(row)) {
      if (key !== "Year" && !isNaN(value)) {
        cData.push({
          date: new Date(`${key}-01-${row.Year}`),
          value: +value});
      }
    }
  });
  cData.sort((a, b) => d3.ascending(a.date, b.date));
  cData.unshift({value: 0, date: cData[0].date});
  cData.push({value: 0, date: cData[cData.length-1].date});
  const x = d3.scaleTime()
    .domain(d3.extent(cData, d => d.date))
    .range([0, chartWidth]);
  const xAxisCall = d3.axisBottom(x)
    // .tickFormat(d3.timeFormat("%Y-%B"))
    .tickSizeOuter(3);
  const xAxis = canvas.append("g")
    .attr("transform", `translate(${margins.left},${svgHeight - margins.bottom})`)
    .call(xAxisCall);
  xAxis.select("path")
    .attr("stroke-width", 3);
  xAxis.selectAll("line")
    .attr("stroke-width", 2);
  xAxis.selectAll("text")
    .attr('font-family', 'Montserrat')
    .attr('font-size', 14)
    .attr('font-weight', 400);

  const y = d3.scaleLinear()
    .domain([0, d3.max(cData, d => d.value)])
    .range([chartHeight, 0])
  const yAxisCall = d3.axisLeft(y)
    .tickFormat(d => d + "%")
    .ticks(10)
    .tickSizeInner(4)
    .tickSizeOuter(0);
  const yAxis = canvas.append("g")
    .attr("transform", `translate(${margins.left-1},${margins.top})`)
    .call(yAxisCall);
    // .call(g => g.select(".domain").remove())
  yAxis.select(".tick:first-of-type text").remove();
  yAxis.select("path")
    .attr("stroke-width", 3);
  yAxis.selectAll("line")
    .attr("stroke-width", 2);
  yAxis.selectAll("text")
    .attr('font-family', 'Montserrat')
    .attr('font-size', 16)
    .attr('font-weight', 500);
  const line = d3.line()
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y(d => y(d.value))

  chart.append("path")
    .data([cData])
    .attr("fill", mdsColors.blue)
    .attr("stroke", mdsColors.blue)
    .attr("stroke-width", 4)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);



  // const countries = canvas.selectAll()
  //     .data(data)
  //     .enter()
  //   .append("g")
  //     .attr("transform", (el, i) => getCountryTranslate(i));
  
  // countries
  //   .append("rect")
  //     .attr('x', (el) => {
  //       if (el.Country == "Switzerland") {return 10};
  //       return 3})
  //     .attr('y', 0)
  //     .attr('width', (el) => {
  //       if (el.Country == "Switzerland") {return 30};
  //       if (el.Country == "Nepal") {return 0};
  //       return colWidth-7})
  //     .attr('height', 30)
  //     .attr('fill', "none")
  //     .attr('stroke', '#000000')
  //     .attr('stroke-width', 1);

  // countries
  //   .append("svg:image")
  //     .attr("x", 2)
  //     .attr("y", -8.5)
  //     .attr("width", `${colWidth - 5}px`)
  //     // .attr("height", "40px")
  //     .attr("xlink:href", el => `../assets/flags64/${el.Country}.png`);
  
  // countries
  //   .append("text")
  //     .text((el) => el.score)
  //     .attr('x', colWidth / 2)
  //     .attr('y', 52)
  //     .attr('text-anchor', 'middle')
  //     .attr('font-family', 'Montserrat')
  //     .attr('font-size', 20)
  //     .attr('font-weight', 600)
})
