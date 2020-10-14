
let margin = 70;
let marginRight=80
let xScatter;

let yScatter;
let currentArray = [];

let sms;
let sms1;

let maxY = { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0, T8: 0, P1: 0, P2: 0,pDrop:0,Mass:0 };
let currentMax = 0;
var series;
var currentStack = { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0, T8: 0, P1: 0, P2: 0,pDrop:0,Mass:0 }

let x_axis;
let y_axis;
let pressureDrop;

let updatesFlag=true;

let massScale;
let airFlowScale;

function setupPlot(data) {

  massScale=computeMassScale(data);
  airFlowScale=computeAirFlowScale(data);

  timeSamples=   getSingleParameter(data, "time");

  currentArray = getSingleParameter(data, 'T4')
  drawScatter(currentArray, "T4");

  pressureDrop=computePressureDrop(data);
  
  //currentArray=  currentArray = getSingleParameter(data, 'P1')
  pScatter=computePScale(data); // init P SCALE
  
  //stackPlot(currentArray,"P1")

}
function computePressureDrop(data)
{
  let pDrop=[];
  data.forEach(function(d,i) {
    pDrop.push({"time": d.time, "value":d.P1-d.P2})
    
  } );

  return pDrop; 
}
function getSingleParameter(data, sensor) {
  if(sensor=="pDrop")
     return pressureDrop;

  let singlePar = [];
  data.forEach(function (d, i) {

    singlePar[i] = { time: +d.time, value: +d[sensor] }
  })
  return singlePar;

}

//dont return sample
function getSingleParameter2(data, sensor) {
  let singlePar = [];

  if(sensor=="pDrop"){
    pressureDrop.forEach(function (d, i) {

      singlePar[i] = +d["value"] 
    })

     return singlePar;
  }
  data.forEach(function (d, i) {

    singlePar[i] = +d[sensor] 
  })
  return singlePar;

}
let brush;

function brushInit()
{

  brush=d3.brushX()                 // Add the brush feature using the d3.brush function
                  .extent( [ [margin+1,margin], [plotWidth-margin-10,plotHeight-margin-1] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                  .on("brush end",updateBrush) // Each time the brush selection changes, trigger the 'updateChart' function
}

function appendBrush(){
  svgScatterplot.append('g')
        .attr("class","brush")
          .call(brush)
}
function updateBrush()
{


  let extent = d3.event.selection  //get brush bounding box [2][2]

  let x0=extent[0],
      x1=extent[1];

  console.log(extent);
  timeDomain=[xScatter.invert(x0), xScatter.invert(x1)];


// get data within time lapse and compute mean values
  let tmpData = rawData.filter((d, i) => d.time>timeDomain[0] & d.time<timeDomain[1]) ;

  let fields=Object.keys(tmpData[0]);   
   meanValues=[];
  
   fields.forEach( function(d){
    let single = getSingleParameter2(tmpData,d)
    meanValues[d]=Math.round(single.reduce((a,b) => a + b, 0) / single.length);
  })

meanValues["pDrop"]=meanValues["P1"]-meanValues["P2"];


  meanValues["iLoad"]=+tmpData[0].Mass;
  meanValues["fLoad"]=+tmpData[tmpData.length-1].Mass;

  console.log("means",meanValues["pDrop"])


  overloadAverage(meanValues)
 // updateCompletion(tmpData);
  //updateFlowNPressure(tmpData);
  //updateBars(tmpData);
}

function drawScatter(data, sensor) {

  currentStack[sensor] = data;

  xScatter = computeXScale(data);

  maxY[sensor] = d3.max(data, d => +d.value)
  currentMax = maxY[sensor];

  yScatter = computeYScale(data, sensor);
 
  

  //create SVG
  svgScatterplot = d3.select("#linePlot_Container")
    .append("svg")
    .attr("width", plotWidth)
    .attr("height", plotHeight);



  //Title
  svgScatterplot.append("text")             
                    .attr("class"," text Title")
                    .attr("transform", "translate(" + (plotWidth/2) + " ,30 )")
                    .style("text-anchor", "middle")
                    .style("font-size","22px")
                    .text("Parameter Evolution");
  //X
  x_axis = d3.axisBottom(xScatter);
  svgScatterplot.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (plotHeight - margin) + ")")
    .call(x_axis);

     // text label for the x axis
  svgScatterplot.append("text")             
                  .attr("class"," text xLabel")
                  .attr("transform", "translate(" + (plotWidth/2) + " ," + (plotHeight-20)  + ")")
                  .style("text-anchor", "middle")
                  .style("font-size","12px")
                  .text("Time(min)");


  //y axis
  y_axis = d3.axisLeft(yScatter);
  svgScatterplot.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin + ",0)")
    .call(y_axis);

    svgScatterplot.append("text")
          .attr("class","text y axis")
          //.attr("transform", "rotate(-90)")
          .attr("transform", "translate(" + (margin -13) + ",55)")

          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size","10px")

          .text("T(ºC)"); 
  


    


  stackPlot(data, sensor)
  
  brushInit();
}

function overloadAverage(meanValues)
{
  //debugger

  //Update colors
  let fields=Object.keys(meanValues);   
  fields.forEach(function (d) {
    if(isPressure(d))
    {
      gasifierContainer.select('.gas.'+d).style("fill",pColorScale(meanValues[d]))      
    }
      else if( d[0]=="T")
     { gasifierContainer.select('.gas.'+d).style("fill",colorScale(meanValues[d]))      
  }
    }


  )
  
  //Flow and pressure

      svgFlowNPressure.select(".textAirFlow").text(meanValues["airFlow"]+"m³/h")
      svgFlowNPressure.select(".textP1").text(meanValues["P1"]+"Pa")
      svgFlowNPressure.select(".textP2").text(meanValues["P2"]+"Pa")
      svgFlowNPressure.select(".textPressureDrop").text(meanValues["pDrop"]+"Pa")
  
      //Bars, com mudança de variavel por razoes de compatibilidade

    let svc=[];
    svc[0]=meanValues;
    updateBars(svc);  
  

    // update Completion
      svgCompletion.select(".timeLeft").text("--:--")
      svgCompletion.select(".initialLoad").text(meanValues.iLoad+"Kg")
      svgCompletion.select(".currentLoad").text(meanValues.fLoad+"Kg")



}




let tmp1 = 0;



function stackPlot(data, sensor) {


  currentStack[sensor] = data;

  if(sensor!="Mass" & sensor!="airFlow" )
      maxY[sensor] = d3.max(data, d => +d.value);

  
    if (maxY[sensor] > currentMax) {
      currentMax = maxY[sensor];
      //yScatter = computeYScale(data)
      updateScale();
    }
  
  

  svgScatterplot.append("g")
                .attr("class", sensor)
                .attr("data-legend",function(d) { return sensor})
                .style("fill",  getColor(sensor))
                    .selectAll("circle")
                      // enter a second time = loop subgroup per subgroup to add all rectangles
                      .data(data)
                      // .data(function(d) { return d; })
                          .join("circle")
                          .attr("cx", function (d) { return xScatter(d.time); })
                          .attr("cy", function (d) { 
                                if(sensor=="Mass")
                                    return massScale(d.value);
                                else if(sensor=="airFlow")
                                  return airFlowScale(d.value);
                                else if(checkSensor(sensor))
                                      return yScatter(d.value);
                                else{
                                        return pScatter(d.value);
                                }
                                      })
                          .attr("r", 1)

                          .style("fill",  getColor(sensor))
                          .style("stroke", getColor(sensor))


  displayLegend();

  //Pressure axes
  if(!checkSensor(sensor)) 
  {
    svgScatterplot.select(".p.axis").remove();
    p_axis = d3.axisRight(axisScale);
   svgScatterplot.append("g")
    .attr("class", "p axis")
    .attr("transform", "translate(" + (plotWidth-marginRight) + ",0)")
    .transition()
    .duration(400)
    .ease(d3.easeLinear)
    .call(p_axis);


    svgScatterplot.append("text")
          .attr("class","text p axis")
          //.attr("transform", "rotate(-90)")
          .attr("transform", "translate(" + (plotWidth-marginRight +11) + ",55)")

          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size","10px")

          .text("P(KPa)"); 


    
  }

  if(sensor=='Mass')
  {
    mass_axis = d3.axisLeft(massScale);
    svgScatterplot.append("g")
      .attr("class", "mass axis")
      .attr("transform", "translate(" + (margin-40) + ",0)")
      .call(mass_axis);  



    svgScatterplot.append("text")
      .attr("class","text mass axis")
      //.attr("transform", "rotate(-90)")
      .attr("transform", "translate(" + (margin-40-13) + ",55)")

      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","10px")

      .text("M(Kg)"); 

  }
  if(sensor=="airFlow")
  {
    airFlow_axis = d3.axisRight(airFlowScale);

    svgScatterplot.append("g")
    .attr("class", "airflow axis")
    .attr("transform", "translate(" + (plotWidth-marginRight+32) + ",0)")
    .transition()
    .duration(400)
    .ease(d3.easeLinear)
    .call(airFlow_axis);

    svgScatterplot.append("text")
      .attr("class","text airflow axis")
      //.attr("transform", "rotate(-90)")
      .attr("transform", "translate(" + (plotWidth-marginRight+53) + ",54)")

      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","10px")

      .text("Q(m³/h)"); 
  } 



}


//return true if t sensor
function checkSensor(sensor)
{
  if(sensor!="P1" & sensor!="P2" & sensor!="pDrop")
        return true;
  else
        return false
  
}


function updateScale() {
  console.log("updateScale")
  //yScatter=computeYScale(data)
  xScatter = computeXScale(timeSamples);

  

  yScatter = computeYScale(currentStack[Object.entries(maxY).filter(d => d[1] == currentMax)[0][0]])

  let arrayStack = Object.entries(currentStack)
  arrayStack.forEach(function (d) {
    if (d[1] != 0 & d[1] != -40000 ) {
      svgScatterplot.select("g." + d[0])
                      .selectAll("circle")
                            .data(d[1])
                            .transition()
                            .duration(400)
                            .ease(d3.easeLinear)
                            .attr("cx", function (dt) { return xScatter(dt.time); })

                            .attr("cy", function (dt) { 
                    //????
                              if(d[0]=="Mass")
                                return massScale(dt.value)
                              else if(d[0]=="airFlow")
                                            return airFlowScale(dt.value);
                              else if(checkSensor(d[0]))
                                return yScatter(dt.value); 
                              else
                                return pScatter(dt.value);
                              
                              })
                              
    }
  })

  y_axis = d3.axisLeft(yScatter);

  y_axis.scale(yScatter);
  svgScatterplot.selectAll("g.y.axis")
    .transition()
    .call(y_axis);

   

  x_axis = d3.axisBottom(xScatter);

  x_axis.scale(xScatter);
  svgScatterplot.selectAll("g.x.axis")
    .transition()
    .call(x_axis);

}
function addPoint()
{
  let arrayStack = Object.entries(currentStack)
  arrayStack.forEach(function (d) {
              if (d[1] != 0) {
                svgScatterplot.select("g." + d[0])
                                    .append("circle") 
                                     .attr("cx", function (d) { return xScatter(500); })
                                 
                                      .attr("cy", function (d) { return yScatter(200); })
                                      .attr("r",2)
              }
            })
}


function removePlot(sensor) {
  console.log("removePlot",sensor)
  
 maxY[sensor] = 0;

 currentStack[sensor] = 0;


 svgScatterplot.select("g." + sensor).remove(); //plot
 svgScatterplot.selectAll(".leg." + sensor).remove(); //legend
 plotFlags[sensor]=false; //clear flag

//axes
if(currentStack["P1"]==0 & currentStack["P2"]==0 &currentStack["pDrop"]==0 )
        svgScatterplot.selectAll(".p.axis").remove();

if(currentStack["Mass"]==0 )
        svgScatterplot.selectAll(".mass.axis").remove();
if(currentStack["airFlow"]==0 )
        svgScatterplot.selectAll(".airflow.axis").remove();




  //debugger
  let tmp = d3.max(Object.values(maxY))
  
    if (currentMax > tmp) {
      currentMax = tmp;
      updateScale();
  
  }  


}


function clearPlots()
{
  fields =Object.keys(currentStack)

  fields.forEach(function(d){
    if(currentStack[d]!=0)
      removePlot(d)

})
}




function getColor(sensor) {

  return d3.select("." + sensor).style("fill");
}


function isPressure(sensor)
{
  if(sensor == 'P1' || sensor == 'P2' || sensor == 'pDrop')
    return true
  else
    return false  
}

/*Description:Compute dynamic  y scale by first searcing for its bounds*/
function computeXScale(data) {
  let width = plotWidth;
  let height = plotHeight;
  let xDomain;

  xDomain = [0, d3.max(data, d => +d.time)];
  xScale = d3.scaleLinear()
    .range([margin, width - marginRight])
    .domain(xDomain);
  return xScale;
}





function computeYScale(data) {
  let width = plotWidth;
  let height = plotHeight;
  let yDomain;

  yDomain = [currentMax, 0];

  yScale = d3.scaleLinear()
    .range([margin, height - margin])
    .domain(yDomain);
  return yScale;
}

function computeMassScale(data) {

  let width = plotWidth;
  let height = plotHeight;
  let yDomain;
  yDomain = [0, +data[0].Mass];


  let yScale = d3.scaleLinear()
    .range([height - margin,margin ])
    .domain(yDomain);
  return yScale;
}

function computeAirFlowScale(data) {

  let width = plotWidth;
  let height = plotHeight;
  let yDomain;
  yDomain = [0, 300];


  let yScale = d3.scaleLinear()
    .range([height - margin,margin ])
    .domain(yDomain);
  return yScale;
}



let axisScale;
function computePScale(data) {
  let width = plotWidth;
  let height = plotHeight;
  let yDomain;

  //Domain = d3.extent(data,function(d){return d.value});
  let max1=d3.max(data,d=>+d.P1)
  let min1=d3.min(data,d=>+d.P1)
  let max2=d3.max(data,d=>+d.P2)
  let min2=d3.min(data,d=>+d.P2)
  let max3=d3.max(pressureDrop,d=>+d.value)
  let min3=d3.min(pressureDrop,d=>+d.value)

  yDomain=[Math.min(min1,min2,min3),Math.max(max1,max2,max3)]
  let y1=[Math.min(min1,min2,min3)/1000,Math.max(max1,max2,max3)/1000]

 let  yScale = d3.scaleLinear()
    .range([height - margin,margin])
    .domain(yDomain);


    axisScale= d3.scaleLinear()
    .range([height - margin,margin])
    .domain(y1);
  return yScale;
}

function stackAllPlots(data, sensor) {
  let xScatter = computeXScale(currentArray);
  yScatter = computeYScale(currentArray, sensor);

  // Show the bars

  svg = d3.select("#div2")
    .append("svg")
    .attr("width", plotWidth)
    .attr("height", plotHeight);
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(data)
    .enter().append("g")
    .attr("class", function (d) {
      tmp1++;
      return "id" + tmp1;
    })
    .selectAll("circle")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) { return d; })
    .enter().append("circle")
    .attr("cx", function (d) { return xScatter(d.time); })
    .attr("cy", function (d) { return yScatter(d.value) })
    .attr("r", 1)
    .style("fill", "teal")
    .style("stroke", "teal")


}

function displayLegend()
{

  svgScatterplot.selectAll("g.legend").remove()   //kill 'em all
   
  let legend = svgScatterplot.append("g")
                            .attr("class","legend")
                            .attr("transform","translate(90,70)")
                            .style("font-size","12px")
                          // .call(d3.legend)
                        
                            


   let cat= Object.entries(plotFlags)
    cat=cat.filter(d=>d[1]==true)

    svgScatterplot.select("g.legend")
                      .selectAll("circle")
                        .data(cat)
                           .join("circle")
                              .attr("class",function(d,i){return "leg "+d[0]})
                              .attr("cy",function(d,i) { return i-0.25+"em"})
                              .attr("cx",0)
                              .attr("r",function(d,i) { return "0.4em"})
                              .attr("fill",d=> getColor(d[0]))


  svgScatterplot.select("g.legend")
                    .selectAll("text")
                      .data(cat)
                          .join("text")
                          .attr("class",function(d,i){return "text leg "+d[0]})
                          .attr("y",function(d,i) {return i+"em"})
                          .attr("x","1em")
                          .text(function(d) { ;return d[0]})
}