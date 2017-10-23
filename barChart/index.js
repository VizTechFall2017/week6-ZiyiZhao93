var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');

var marginLeft = 100;
var marginTop = 100;

var nestedData = [];

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//set up scales to position circles using the data
var scaleX = d3.scaleBand().rangeRound([0, 600]).padding(0.1);
var scaleY = d3.scaleLinear().range([400, 0]);  //remember that 0,0 is at the top of the screen! 300 is the lowest value on the y axis


//import the data from the .csv file
d3.csv('./countryData.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key == '2007'})[0].values;

    scaleX.domain(loadData.map(function(d){return d.countryCode;}));

    // Add the x Axis
    svg.append("g")
        .attr('transform','translate(0,400)')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg.append("g")
        .attr('class','yaxis')
        .call(d3.axisLeft(scaleY));

    svg.selectAll('rect')
        .data(loadData)
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('fill', "slategray");

    drawPoints(loadData);

});


    /*
    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key == '2016'})[0].values;


    svg.append('text')
        .text('Weekly income by age and gender')
        .attr('transform','translate(300, -20)')
        .style('text-anchor','middle');

    svg.append('text')
        .text('age group')
        .attr('transform','translate(260, 440)');

    svg.append('text')
        .text('weekly income')
        .attr('transform', 'translate(-50,250)rotate(270)');

    //bind the data to the d3 selection, but don't draw it yet
    svg.selectAll('circles')
        .data(loadData)
        .enter()
        .append('circle')
        .attr('class','w_dataPoints')
        .attr('r', 5)
        .attr('fill', "lime");

    svg.selectAll('circles')
        .data(loadData)
        .enter()
        .append('circle')
        .attr('class','m_dataPoints')
        .attr('r', 5)
        .attr('fill', "blue");

    //call the drawPoints function below, and hand it the data2016 variable with the 2016 object array in it
    drawPoints(loadData);

});

*/


//this function draws the actual data points as circles.
function drawPoints(pointData){

    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.totalPop}))]);

    svg.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));

    svg.selectAll('.bars')
        .data(pointData)
        .attr('x',function(d){
            return scaleX(d.countryCode);
        })
        .attr('y',function(d){
            return scaleY(d.totalPop);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return 400 - scaleY(d.totalPop);  //400 is the beginning domain value of the y axis, set above
        });

}


function updateData(selectedYear){
    return nestedData.filter(function(d){return d.key == selectedYear})[0].values;
}


//this function runs when the HTML slider is moved
function sliderMoved(value){


    newData = updateData(value);
    drawPoints(newData);
    
}