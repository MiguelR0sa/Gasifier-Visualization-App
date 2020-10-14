
let svgCompletion;


/* Description: function displayPeriphery()
  Set up bar div, completion div, and flow&pressure div.
 */
function displayPeriphery(data)
{
    displayCompletion();
    displayText();
    drawBars(data);
    displayFlowNPressure(data)
    
}
let arc,
    arcLine,
    pathForeground;
var color;

/* Description: function displayCompletion()
  Create and intiliaze the progress chart by stacking
  two d3 arcs with different start and finish angles.
  And display the center text with 0% value.
*/
function displayCompletion()
{
  
     let svg_w=completionWidth*2/3,
         svg_h=completionHeight*2/3;

    let innerRadius=svg_h*2/6-30,
        outerRadius=svg_h*2/6;

     arc=d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(0)
            .endAngle(2*Math.PI);
     
     
     arcLine=d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            //.cornerRadius(20)
            .startAngle(-0.05);

    svgCompletion = d3.select("#completion_Container")
                        .append("svg")
                        .attr("width", completionWidth)
                        .attr("height", completionHeight)
                       
                        


    svgCompletion.append("g")
                 .attr("class","donut")
                 .attr("transform", "translate(" + completionWidth*2/ 3 + "," + completionHeight/2 + ")")
                   
                 
           
var pathBackground= d3.select("g.donut")
                            .append("path")
                            .attr("d",arc)
                            .attr('fill', "#98abc5")
                            .attr("stroke", "black")
                            .style("stroke-width", "2px")
                            .style("opacity", 0.7)

 pathForeground=d3.select("g.donut").append('path')
                            .datum({endAngle:0})
                            .attr("d",arcLine)
                            .attr('fill', "teal")
                            .attr("stroke", "black")
                            .style("stroke-width", "2px")
                            .style("opacity", 0.7)
                           
    d3.select("g.donut")
        .append("text")   
            .attr("class","text completionPercentage")          
            //.attr("class"," text Comp")
            .attr("transform", "translate(6,8)")
            .style("text-anchor", "middle")
            .style("font-size","24px")
            .text("100%");  
                    

}


/* Description: function displatext()
    Display the text in the completion div, by appending text to the completion svg element
*/
function displayText()
{
    svgCompletion.append("text")             
                    .attr("class"," text Title")
                    .attr("transform", "translate(" + (completionWidth/2) + " ,50 )")
                    .style("text-anchor", "middle")
                    .style("font-size","22px")
                    .text("Completion Rate");
     
    svgCompletion.append("text")             
                    .attr("class"," text")
                    .attr("transform", "translate(" + (completionWidth/5) + " 120 )")
                    .style("text-anchor", "middle")
                    .style("font-size","16px")
                    .text("Initial Load");  

    svgCompletion.append("text")             
                    .attr("class"," text initialLoad")
                    .attr("transform", "translate(" + (completionWidth/5) + " 150 )")
                    .style("text-anchor", "middle")
                    .style("font-size","20px")
                    .text(d=>(rawData[0].Mass)+"Kg");  
                    
    svgCompletion.append("text")             
                    .attr("class"," text")
                    .attr("transform", "translate(" + (completionWidth/5) + " 210 )")
                    .style("text-anchor", "middle")
                    .style("font-size","16px")
                    .text("Current Load"); 

    svgCompletion.append("text")             
                    .attr("class"," text currentLoad")
                    .attr("transform", "translate(" + (completionWidth/5) + " 240 )")
                    .style("text-anchor", "middle")
                    .style("font-size","20px")
                    .text(d=>(rawData[rawData.length-1].Mass)+"Kg"); 
                    
                    
    svgCompletion.append("text")             
                    .attr("class"," text iLoad")
                    .attr("transform", "translate(" + (completionWidth/3) + " 330 )")
                    .style("text-anchor", "middle")
                    .style("font-size","19px")
                .text("Time until completion");  

    svgCompletion.append("text")             
                  .attr("class"," text timeLeft")
                  .attr("transform", "translate(" + (completionWidth*4/5) + " 330 )")
                  .style("text-anchor", "middle")
                    .style("font-size","24px")
                    .text("2h");  
}


/* Description: function displayFLowNPressure()
    Display the text in the flow&pressure div, by appending text to the flownPressure svg element
*/
function displayFlowNPressure(data)
{
    let P1=Math.round(data[data.length-1].P1)
    let P2=Math.round(data[data.length-1].P2)


    svgFlowNPressure = d3.select("#flowNPressure_Container")
                        .append("svg")
                        .attr("width", flowNPressureWidth)
                        .attr("height", flowNPressureHeight)

    svgFlowNPressure.append("text")             
                    .attr("class"," text subTitle")
                    .attr("transform", "translate(" + (flowNPressureWidth/2) + " ,60 )")
                    .style("text-anchor", "middle")
                    .style("font-size","16px")
                    .text("Air Flow Rate");

    svgFlowNPressure.append("text")             
                    .attr("class"," text textAirFlow")
                    .attr("transform", "translate(" + (flowNPressureWidth/2) + " ,90 )")
                    .style("text-anchor", "middle")
                    .style("font-size","22px")
                    .text(data[data.length-1].airFlow+"m³/h");


    svgFlowNPressure.append("text")             
                    .attr("class"," text subTitle")
                    .attr("transform", "translate(" + (flowNPressureWidth/2) + " ,150 )")
                    .style("text-anchor", "middle")
                    .style("font-size","16px")
                    .text("Pressure at P1");

    svgFlowNPressure.append("text")             
                    .attr("class"," text textP1")
                    .attr("transform", "translate(" + (flowNPressureWidth/2) + " ,180 )")
                    .style("text-anchor", "middle")
                    .style("font-size","22px")
                    .text(P1+"Pa");


    svgFlowNPressure.append("text")             
                    .attr("class"," text subTitle")
                    .attr("transform", "translate(" + (flowNPressureWidth/2) + " ,240 )")
                    .style("text-anchor", "middle")
                    .style("font-size","16px")
                    .text("Pressure at P2");

    svgFlowNPressure.append("text")             
                    .attr("class"," text textP2")
                    .attr("transform", "translate(" + (flowNPressureWidth/2) + " ,270 )")
                    .style("text-anchor", "middle")
                    .style("font-size","22px")
                    .text(P2+"Pa")

    svgFlowNPressure.append("text")             
                    .attr("class"," text subTitle")
                    .attr("transform", "translate(" + (flowNPressureWidth/2) + " ,330 )")
                    .style("text-anchor", "middle")
                    .style("font-size","16px")
                    .text("Pressure Drop");

    svgFlowNPressure.append("text")             
                    .attr("class"," text textPressureDrop")
                    .attr("transform", "translate(" + (flowNPressureWidth/2) + " ,360 )")
                    .style("text-anchor", "middle")
                    .style("font-size","22px")
                    .text((P1-P2)+"Pa")
    
}




/* Description: function updateFLowNPressure()
Update flow and pressure values by individually selecting their respective class
*/
function updateFlowNPressure(data)
{
    let P1=Math.round(data[data.length-1].P1)
    let P2=Math.round(data[data.length-1].P2)
    svgFlowNPressure.select(".textAirFlow").text(data[data.length-1].airFlow+"m³/h")
    svgFlowNPressure.select(".textP1").text(P1+"Pa")
    svgFlowNPressure.select(".textP2").text(P2+"Pa")
    svgFlowNPressure.select(".textPressureDrop").text((P1-P2)+"Pa")

}




/* Description: function updateFLowNPressure()
Update competion values by individually selecting their respective class. 
and progress char with d3 interplations.
*/
let oldProgress=0;
function updateCompletion(data)
{
    let massData=data.slice(data.length-2,data.length)  //não inclui ultimo
    
    let consumption = (massData[0].Mass-massData[1].Mass)/(massData[1].time-massData[0].time)
    let completion=Math.round(100-data[data.length-1].Mass/data[0].Mass*100);

    let timeLeft=massData[1].Mass/consumption;
    let hoursLeft=Math.floor(timeLeft/60);
    let minutesLeft=Math.floor(timeLeft%60);
    let currentLoad=massData[1].Mass;

    completionArray={a: 100-completion, b: completion}

    var pie = d3.pie()
    .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(completionArray))

    pathForeground.transition()
                    .delay(400)
                    .duration(800)
                    .call(arcTween,completion,oldProgress);
                  
    olsProgress=completion

    //update display
    if(timeLeft<200000)
    svgCompletion.select(".timeLeft").text(hoursLeft+"h:"+minutesLeft+"m")
    svgCompletion.select(".completionPercentage").text(completion+"%")
    svgCompletion.select(".currentLoad").text(currentLoad+"Kg")
    svgCompletion.select(".initialLoad").text((rawData[0].Mass)+"Kg")



}





/* Description: function drawBras()
Set up bar chart and append text to the end of the bars.
Bars color is attained from the gasifier zone classes
*/
let svgTBars,
    svgPBars;
let barMargin=30;
let yBars;

function drawBars(data)
{
  drawTBars(data);
  drawPBars(data);
}
let barData
function drawTBars(data)
{

    barData=Object.entries(data[data.length-1]);
    barData=barData.filter(d=> d[0][0]=="T"  )


    let xBars=computeTBarXScale(barData);
    yBars=computeBarYScale(barData);

    svgTBars = d3.select("#bar_Container")
                     .append("svg")
                        //.attr("class", str)
                        .attr("width", barWidth)
                        .attr("height", barHeight);

    svgTBars.selectAll("rect")
                        .data(barData)
                        .join("rect")
                          .attr("x", barMargin )
                          .attr("y",(d,i) => xBars(i) )
                          .attr("width", d=>yBars(Math.abs(d[1])))          
                          .attr("height", (barHeight - 5*barMargin) / barData.length)
                          .style("fill", d=>getColor(d[0]))
                          .style("stroke", "black");
                          //.on("mouseover", function (d) {});



    //left axis
   xCat=computeTCategoricalScale()
    let leftAxis = d3.axisLeft(xCat);
    svgTBars.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + barMargin + " ,-20)")
    .call(leftAxis);

    

    svgTBars.selectAll("text.values")
                .data(barData)
                .join("text")
                    .attr("class","text values")
                    .text(d=> Math.round(d[1])+"Cº")
                    .attr("x",d=>yBars(Math.abs(d[1]))+1.3*barMargin)
                    .attr("y", (d,i)=> xBars(i)+13 )
                    .attr("font-size",12); 

    //Title
    svgTBars.append("text")             
                    .attr("class"," text Title")
                    .attr("transform", "translate(" + (barWidth/2) + " ,50 )")
                    .style("text-anchor", "middle")
                    .style("font-size","22px")
                    .text("Operational Parameters");  
} 



function drawPBars(data)
{
  let barData=Object.entries(data[data.length-1]);
  barData=barData.filter(d=> d[0][0].toUpperCase()=="P" )
  barData.push(["pDrop",""+getCurrentValue("pDrop")+""])


  let xBars=computePBarXScale(barData);
  yPBars=computeBarPScale(barData);

  svgPBars = d3.select("#Pbar_Container")
                   .append("svg")
                      //.attr("class", str)
                      .attr("width", PbarWidth)
                      .attr("height", PbarHeight);

  svgPBars.selectAll("rect")
                      .data(barData)
                      .join("rect")
                        .attr("x", barMargin )
                        .attr("y",(d,i)=>xBars(i))
                        .attr("width",d=>yPBars(Math.abs(d[1])) )           
                        .attr("height", (PbarHeight -1/2*PbarHeight) / barData.length)
                        .style("fill", d=>getColor(d[0]))
                        .style("stroke", "black");
                        //.on("mouseover", function (d) {});



  //left axis
 xCat=computePCategoricalScale()
  let leftAxis = d3.axisLeft(xCat);
  svgPBars.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + barMargin + " ,-20)")
  .call(leftAxis);

  

  svgPBars.selectAll("text.values")
              .data(barData)
              .join("text")
                  .attr("class","text values")
                  .text(d=>Math.round( d[1])+"Pa")
                  .attr("x",d=>  yPBars(Math.abs(d[1]))+1.3*barMargin)
                  .attr("y", (d,i)=>xBars(i) +13)
                  .attr("font-size",12); 


}


/* Description: function updateBars()
Update bars width, text and color, by using d3 transitions
*/
function updateBars(data)
{
  updateTBars(data);
  updatePBars(data);
}
function updateTBars(data)
{
    console.log("UpdateBars")

  
    let barData=Object.entries(data[data.length-1]);
 
    barData=barData.filter(d=> d[0][0]=="T" )
console.log(barData)
   

    svgTBars.selectAll("rect")
            .data(barData)
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("width", d=>yBars(Math.abs(d[1])))
              .style("fill", d=>getColor(d[0]))
              

    svgTBars.selectAll("text.values")
                .data(barData)
                .transition()
                .duration(400)
                .ease(d3.easeLinear)
                .text(d=>Math.round(d[1])+"Cº")
                .attr("x",  d=>yBars(Math.abs(d[1]))+1.3*barMargin)

}



function updatePBars(data)
{
  console.log("UpdateBars")
  
    let barData=Object.entries(data[data.length-1]);
 


    barData=barData.filter(d=> d[0][0].toUpperCase()=="P" )

    //if(data.length>5)  //hotfix
    barData.push(["pDrop",""+getCurrentValue("pDrop")+""])
   
    svgPBars.selectAll("rect")
            .data(barData)
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("width", d=>yPBars(Math.abs(d[1])))
              .style("fill", d=>getColor(d[0]))
              

    svgPBars.selectAll("text.values")
                .data(barData)
                .transition()
                .duration(400)
                .ease(d3.easeLinear)
                .text(d=>Math.round(d[1])+"Pa")
                .attr("x",  d=>yPBars(Math.abs(d[1]))+1.3*barMargin)


}
/*Description:Compute x scale related to array length */
function computeTBarXScale(data) {
    let height = barHeight - barMargin;
    let xBars = d3.scaleLinear()
      .range([3*barMargin, height])
      .domain([0, d3.max(data, function (data, i) {
        return i;
      })]);
    return xBars;
  
  }
  function computePBarXScale(data) {
    let height = PbarHeight - 1*barMargin;
    let xBars = d3.scaleLinear()
      .range([barMargin/3, height])
      .domain([0, d3.max(data, function (data, i) {
        return i;
      })]);
    return xBars;
  
  }
/*Description:Compute scale with sensor names */

function computeTCategoricalScale() {
    let height = barHeight;
    let sms = height / 20;
    let xCat = d3.scalePoint()
      .domain(["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"])
      .range([4*barMargin-4, height]);
    return xCat;
  
  }
  function computePCategoricalScale() {
    let height = PbarHeight-0.1*barMargin;
    let sms = height / 20;
    let xCat = d3.scalePoint()
      .domain(["P1", "P2","dP"])
      .range([barMargin+10, height]);
    return xCat;
  
  }

/*Description:Compute static bar scale: 0-1000ºC*/
function computeBarYScale(data) {
    let width = barWidth;
    let height = barHeight;
    let Ydomain;
    Ydomain = [0,1000];//d3.max(data, d => +d[1])];
  
    yBars = d3.scaleLinear()
      .range([margin, width-4*barMargin])
      .domain(Ydomain);
    return yBars;
  }

  function computeBarPScale(data) {
    let width = PbarWidth;
    let height = PbarHeight;
    let Ydomain;
    Ydomain = [0,3000];//d3.max(data, d => +d[1])];
  
    yBars = d3.scaleLinear()
      .range([margin, width-4*barMargin])
      .domain(Ydomain);
    return yBars;
  }
 
  //taken from http://www.adeveloperdiary.com/d3-js/how-to-create-progress-chart-using-d3-js/
  var arcTween=function(transition, newValue,oldValue) {
    transition.attrTween("d", function (d) {
        var interpolate = d3.interpolate(d.endAngle, ((2*Math.PI))*(newValue/100));
 
        var interpolateCount = d3.interpolate(oldValue, newValue);
        return function (t) {
            d.endAngle = interpolate(t);
            //middleCount.text(Math.floor(interpolateCount(t))+'%');
            return arcLine(d);
        };
    });
};
 