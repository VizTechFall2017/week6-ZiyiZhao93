var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');

var marginLeft = 100;
var marginTop = 100;

var nestedData = [];

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var scaleX = d3.scaleBand().rangeRound([0, 600]).padding(0.1);
var scaleY = d3.scaleLinear().range([400, 0]);



d3.csv('./SubwayActivityServices.csv', function(dataIn){

    console.log(dataIn);

    nestedData = d3.nest()
        .key(function(d){return d.genderCode})
        .entries(dataIn);

    var total = nestedData.filter(function(d){return d.key == '0'})[0].values;

    scaleX.domain(total.map(function(d){return d.things;}));
    scaleY.domain([0,100]);

    svg.append("g")
        .attr('transform','translate(0,400)')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg.append("g")
        .attr('class','percent')
        .call(d3.axisLeft(scaleY));

    svg.append('text')
        .text('What Do you Normally Do on the Subway?')
        .attr('transform','translate(300, -40)')
        .style('text-anchor','middle');

    svg.append('text')
        .text('percent')
        .attr('transform', 'translate(-50,-10)');

    svg.selectAll('rect')
        .data(total)
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('fill', "slategray");

    drawPoints(total);


});

function drawPoints(pointData){

    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.totalPop}))]);

    svg.selectAll('.percent')
        .call(d3.axisLeft(scaleY));

    svg.selectAll('rect')
        .data(pointData)
        .attr('x',function(d){
            return scaleX(d.things);
        })
        .attr('y',function(d){
            return scaleY(d.totalPop);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return 400 - scaleY(d.totalPop);
        });

}


function updateData(selectedGender){
    return nestedData.filter(function(d){return d.key == selectedGender})[0].values;
}


function sliderMoved(value){

    newData = updateData(value);
    drawPoints(newData);

}

