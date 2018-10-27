const margin = 0;

const svgHeight = svgWidth = 800;
const canvasWidth = svgWidth - 2 * margin;
const canvasHeight = svgHeight - 2 * margin;

var canvas = d3.select("#chart-area")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
    .append("g")
      .attr("transform", `translate(${margin},${margin})`);

const inRow = 14;
const rowHeight = 64;
const colOutPadding = 40;
const topPadding = 100;
const colWidth = (canvasWidth - colOutPadding * 2) / inRow;
const colShift = 60;
const getCountryTranslate = (i) => {
  const row = Math.floor(i / inRow);
  const col = i % inRow;
  return `translate(${col * colWidth + colOutPadding},${topPadding+row*rowHeight})`;
}

canvas.append('text')
  .text('The Global Competitiveness Index')
  .attr('y', 60)
  .attr('x', svgWidth / 2)
  .attr('text-anchor', 'middle')
  .attr('font-family', 'Montserrat')
  .attr('font-size', 40)
  .attr('font-weight', 500)

canvas.append('text')
  .text('@Bryukh')
  .attr('y', svgHeight - 25)
  .attr('x', 40)
  .attr('text-anchor', 'start')
  .attr('font-family', 'Montserrat')
  .attr('font-size', 20)
  .attr('font-weight', 500)

const sourceText = canvas.append('text')
  .attr('y', svgHeight - 31)
  .attr('x', svgWidth - 30)
  .attr('text-anchor', 'end')
  .attr('font-family', 'Montserrat')
  .attr('font-size', 12)
  .attr('font-weight', 400);
sourceText
  .append('tspan')
  .text('Source: ')
  .attr('font-weight', 600);
sourceText
  .append('tspan')
  .text('The Global Competitiveness Report 2018');
sourceText
  .append('tspan')
  .text('World Economic Forum')
  .attr('dy', 14)
  .attr('x', svgWidth - 30);


d3.csv("data.csv").then((data) => {
  data.forEach(element => {
    element.score = parseFloat(element.Score);
  })
  const countries = canvas.selectAll()
      .data(data)
      .enter()
    .append("g")
      .attr("transform", (el, i) => getCountryTranslate(i));
  
  countries
    .append("rect")
      .attr('x', (el) => {
        if (el.Country == "Switzerland") {return 10};
        return 3})
      .attr('y', 0)
      .attr('width', (el) => {
        if (el.Country == "Switzerland") {return 30};
        if (el.Country == "Nepal") {return 0};
        return colWidth-7})
      .attr('height', 30)
      .attr('fill', "none")
      .attr('stroke', '#000000')
      .attr('stroke-width', 1);

  countries
    .append("svg:image")
      .attr("x", 2)
      .attr("y", -8.5)
      .attr("width", `${colWidth - 5}px`)
      // .attr("height", "40px")
      .attr("xlink:href", el => `../_assets/flags64/${el.Country}.png`);
  
  countries
    .append("text")
      .text((el) => el.score)
      .attr('x', colWidth / 2)
      .attr('y', 52)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Montserrat')
      .attr('font-size', 20)
      .attr('font-weight', 600)
})
