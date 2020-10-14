let combustionZone;
let reductionZone;
let preheatingZone;
let emptyZone



let plotFlags = { T1: false, T2: false, T3: false, T4: true, T5: false, T6: false, T7: false, T8: false, P1: false, P2: false, pDrop: false, Mass: false }
let colorScale,
  pColorScale;

/*Description: function setupVis

  Set up the inital state of the different parts

 */


function setupVis(data) {

  setupGasifier();
  setupPlot(data);
  displayPeriphery(data);

}
let timeSamples



/*Description: function update()

  Reloads the dataset and updates:
      ->currentStack
      ->pressure Scale
      -> adds one point( and only one) to each ploted graph and rescales the entire display
      ->updates all periphery
 */
let count=50;

function update() {

  console.log("updatisdgsdgng")
  let fields = Object.keys(currentStack);

  d3.csv(set + '?' + Math.floor(Math.random() * 1000)) //force read.....
    .then((data) => {
		console.log("foda-se")
		console.log("kkkkkk",data)

		data=data.slice(0,data.length-count);
		count--;
		console.log("ffsasa",data)	

		
      let newData = data.map(d => { return d; });

      rawData = newData;
	  


      fields.forEach(function (d, i) {
        currentStack[fields[i]] = getSingleParameter(newData, fields[i])

      })

      timeSamples = getSingleParameter(newData, "time");

      updateColors();

      pressureDrop = computePressureDrop(newData);
      pScatter = computePScale(newData);
      addPoint();
      updateScale();

      updateCompletion(newData)
      updateFlowNPressure(newData)
      updateBars(newData)
    })

}



function toggleUpdates()
{

    if(updatesFlag==true){
      updatesFlag=false;
      
      window.clearInterval(updateProc)

      appendBrush();


    }
    else if(updatesFlag==false){
      updatesFlag=true;

      d3.select(".brush").remove();
      
      update();
      
      updateProc=window.setInterval(function(){
        update();
      }, 5000);
      

    }
  
}

/*Description: function dummyEvent()

  Debug function
 */
function dummyEvent() {
  console.log("It's me");
}




/*Description: function setupGasifier()

  Create svg container of the gasifier, 
  get a hold of the different externally specified sensor areas,
  and set the corresponding scaled color and events.

 */
function setupGasifier() {

  colorScale = computeColorScale([0, 1000], d3.interpolateYlOrRd);
  pColorScale = computeColorScale([-2000, 2000], d3.interpolateViridis);

  displayColorPalette("#palette_Container", colorScale, [1200, 0],"Temperature ºC   ")
  displayColorPalette("#pressurePalette_Container", pColorScale, [3000, -3000],"Pressure Pa")



  gasifierContainer = d3.select("#gasifier")
    .attr("width", width)
    .attr("height", height)



  gasifierContainer.select("path#T1")
    .attr("class", "gas T1")

    .attr("pointer-events", "inherit")
    .style("fill", d => colorScale(getCurrentValue("T1")))
    .style("stroke", "black")
    .on("mouseover", function (d) { console.log("T1") })
    .on("click", function (d) { togglePlot("T1") });

  gasifierContainer.select("#T2")
    .attr("class", "gas T2")

    .style("fill", d => colorScale(getCurrentValue("T2")))
    .style("stroke", "black")
    .on("mouseover", function (d) { console.log("T2") })
    .on("click", function (d) { togglePlot("T2") });


  gasifierContainer.select("#T3")
    .attr("class", "gas T3")

    .style("fill", d => colorScale(getCurrentValue("T3")))
    .style("stroke", "black")
    .on("mouseover", function (d) { console.log("T3") })
    .on("click", function (d) { togglePlot("T3") });

  gasifierContainer.select("#emptyZone")


  gasifierContainer.select("#T4")
    .attr("class", "gas T4")

    .style("fill", d => colorScale(getCurrentValue("T4")))
    .style("stroke", "black")
    .on("mouseover", function (d) { console.log("T4") })
    .on("click", function (d) { togglePlot("T4") });

  gasifierContainer.select("#T5")
    .attr("class", "gas T5")
    .style("fill", d => colorScale(getCurrentValue("T5")))
    .style("stroke", "black")
    .on("mouseover", function (d) { console.log("T5") })
    .on("click", function (d) { togglePlot("T5") });

  gasifierContainer.select("#T6")
    .attr("class", "gas T6")
    .style("fill", d => colorScale(getCurrentValue("T6")))
    .style("stroke", "black")
    .on("mouseover", function (d) { console.log("T6") })
    .on("click", function (d) { togglePlot("T6") });

  gasifierContainer.select("#T7")
    .attr("class", "gas T7")
    .style("fill", d => colorScale(getCurrentValue("T7")))
    .style("stroke", "black")
    .on("mouseover", function (d) { console.log("T7") })
    .on("click", function (d) { togglePlot("T7") });

  gasifierContainer.select("#T8")
    .attr("class", "gas T8")
    .style("fill", d => colorScale(getCurrentValue("T8")))
    .style("stroke", "black")
    .on("mouseover", function (d) { console.log("T8") })
    .on("click", function (d) { togglePlot("T8") });


  //DUMMIES
  gasifierContainer.append("circle")
    .attr("class", "gas P1")
    .style("fill", d => pColorScale(getCurrentValue("P1")))
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0)

  gasifierContainer.append("circle")
    .attr("class", "gas P2")
    .style("fill", d => pColorScale(getCurrentValue("P2")))
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0)
  gasifierContainer.append("circle")
    .attr("class", "gas pDrop")
    .style("fill", d => pColorScale(getCurrentValue("pDrop")))
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0)



  gasifierContainer.append("circle")
    .attr("class", "gas Mass")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0)



  gasifierContainer.append("circle")
    .attr("class", "gas airFlow")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0)

  // gasifierContainer.select("#outline").style("fill","#585660")


}
function updateColors() {
  let arrayStack = Object.entries(currentStack);

  arrayStack.forEach(function (d) {

    if (checkSensor(d[0]) & d[0] != "Mass" & d[0] != "airFlow") {
      gasifierContainer.select(".gas." + d[0])
        .transition()
        .duration(600)
        .ease(d3.easeLinear)
        .style("fill", colorScale(getCurrentValue(d[0])))

    }

    else if (isPressure()) {
      gasifierContainer.select(d[0])
        .transition()
        .duration(600)
        .ease(d3.easeLinear)
        .style("fill", pColorScale(getCurrentValue(d[0])))

        console.log("wareryrerg")
    }


  })


}


/*Description: function togglePLot

Function called on a gasifier zone click event
Checks plotFlags to see if the data was already ploted:
    if true, erases the corresponding zone
    else false adds it to the plot
 */
function togglePlot(sensor) {

  if (!plotFlags[sensor]) {
    plotFlags[sensor] = true;
    let currentData = getSingleParameter(rawData, sensor);
    stackPlot(currentData, sensor);
  } else {
    plotFlags[sensor] = false;
    removePlot(sensor);
  }
}




/*Description: function toggleBUttonPLot

Function called on a radio button click event
Checks plotFlags to see if the data was already ploted:
    if true, erases the corresponding zone and corresponding button
    else false adds it to the plot and corresponding button
 */
function toggleButtonPlot(button, sensor) {

  if (!plotFlags[sensor])
    d3.select(button).style("background-color", "#bbb")
  else
    d3.select(button).style("background-color", "teal")

  togglePlot(sensor);

}



/*Description: function getCUrretnValue
Returns current valu of the specified sensor
 */
function getCurrentValue(sensor) {
  if(sensor=="pDrop")
    return pressureDrop[pressureDrop.length-1].value
  return rawData[rawData.length - 1][sensor];
}


/*Description: function togglePLot

Returns fixed tempearature color scale()
for 0 to 1200ºC 
 */
function computeColorScale(range, type) {
  var myColor = d3.scaleSequential()
    .domain(range)
    .interpolator(type);

  return myColor
}




/*Description: function dispayColorpalette

creates color legend for a specified scale and div.

code taken from:http://bl.ocks.org/syntagmatic/e8ccca52559796be775553b467593a9f

 */
function displayColorPalette(selector_id, colorscale, rangeInv,text) {
  var legendheight = 200,
    legendwidth = 80,
    margin = { top: 10, right: 60, bottom: 10, left: 2 };

  var canvas = d3.select(selector_id)
    .style("height", legendheight + "px")
    .style("width", legendwidth + "px")
    .style("position", "relative")
    .append("canvas")
    .attr("height", legendheight - margin.top - margin.bottom)
    .attr("width", 1)
    .style("height", (legendheight - margin.top - margin.bottom) + "px")
    .style("width", (legendwidth - margin.left - margin.right) + "px")
    .style("border", "1px solid #000")
    .style("position", "absolute")
    .style("top", (margin.top) + "px")
    .style("left", (margin.left) + "px")
    .node();

  var ctx = canvas.getContext("2d");

  var legendscale = d3.scaleLinear()
    .range([1, legendheight - margin.top - margin.bottom])
    .domain(rangeInv);

  // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
  var image = ctx.createImageData(1, legendheight);
  d3.range(legendheight).forEach(function (i) {
    var c = d3.rgb(colorscale(legendscale.invert(i)));
    image.data[4 * i] = c.r;
    image.data[4 * i + 1] = c.g;
    image.data[4 * i + 2] = c.b;
    image.data[4 * i + 3] = 255;
  });
  ctx.putImageData(image, 0, 0);

  // A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
  // See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
  /*
  d3.range(legendheight).forEach(function(i) {
    ctx.fillStyle = colorscale(legendscale.invert(i));
    ctx.fillRect(0,i,1,1);
  });
  */

  var legendaxis = d3.axisRight()
    .scale(legendscale)
    .tickSize(6)
    .ticks(8);

  var svg = d3.select(selector_id)
    .append("svg")
    .attr("height", (legendheight) + "px")
    .attr("width", (legendwidth) + "px")
    .style("position", "absolute")
    .style("left", "0px")
    .style("top", "0px")

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
    .call(legendaxis);



    svg.append("text")   
        //.attr("class","text completionPercentage")          
        //.attr("class"," text Comp")
        .attr("transform", "translate(10,50) rotate(-90)")
        //.attr("transform", "translate(0,190)")
        
        .style("text-anchor", "middle")
        .style("font-size","8px")
        .text(text);  

  }