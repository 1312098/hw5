(function() {
    d3.csv("trees.csv", function(error, data) {
        var width = 750,
        height = width;

        var count = 0;
        var plot_size;
        var strt;
        var species;
        var colorA = "#c0392b";
        var colorB = "#2980b9";
    

        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("click", chonDiem)

        svg.append("image")
            .attr("width", width)
            .attr("height", height)
            .attr("xlink:href", "SanFranciscoCityWeb-Illustrator.svg");

    
        var borderPath = svg.append("rect")
        .attr("height", height)
        .attr("width", width)
        .style("stroke", "gray")
        .style("fill", "none")
        .style("stroke-width", "4px");
        
        if(error) return console.error(error);
        var projection = d3.geo.mercator()
        .center([-122.433701, 37.767683]) // San Francisco, roughly
        .scale(210000)
        .translate([width / 2, height / 2]);

        bieuDien(data);

        var drag = d3.behavior.drag().on("drag", diChuyenDiem);
        
        function capNhatThongTin(range, AorB) {
            d3.select("#nRadius" + AorB + "-value").text(range + " mile(s)");
            d3.select("#nRadius" + AorB).property("value", range).attr("value", range);

            d3.select("#" + AorB + "_outer") 
                .attr("r", range * ratio);

            bieuDien(data, locDuLieu);
        }

        d3.select("#nRadiusA").on("input", function() {
                capNhatThongTin(+this.value, "A");
        });

        d3.select("#nRadiusB").on("input", function() {
                capNhatThongTin(+this.value, "B");
        });

        function diChuyenDiem(d) {
            var x = d3.event.x; 
            var y = d3.event.y;
            d3.select(this)
                .attr("cx", x)
                .attr("cy", y);

            d3.select("#" + d3.select(this).attr("id") + "_outer")
                .attr("cx", x)
                .attr("cy", y);

            bieuDien(data, locDuLieu);
        }

        function chonDiem() {
            if (d3.event.defaultPrevented) return;
            var point = d3.mouse(this);
            var p = {x: point[0], y:point[1]};
            
            count = count + 1;
            if (count == 1) {
                svg.append("circle")
                .attr("cx", p.x)
                .attr("cy", p.y)
                .attr("r", "5px")
                .attr("id", "A")
                .attr("class", "dot")
                .attr("fill", colorA)
                .call(drag);

                svg.append("circle")
                .attr("cx", p.x)
                .attr("cy", p.y)
                .attr("r", 1 * ratio + "px")
                .attr("id", "A_outer")
                .attr("class", "dot")
                .attr("fill", "none")
                .attr("stroke", colorA);	

                capNhatThongTin(1, "A");

            } else if (count == 2) {
                svg.append("circle")
                .attr("cx", p.x)
                .attr("cy", p.y)
                .attr("r", "5px")
                .attr("id", "B")
                .attr("class", "dot")
                .attr("fill", colorB)
                .call(drag)

                svg.append("circle")
                .attr("cx", p.x)
                .attr("cy", p.y)
                .attr("r", 1 * ratio + "px")
                .attr("id", "B_outer")
                .attr("class", "dot")
                .attr("fill", "none")
                .attr("stroke", colorB);

                capNhatThongTin(1, "B");	
            }
            
        }

        d3.select('#plot_size').on('change', function() {
            plot_size = d3.select(this).property('value');
            bieuDien(data, locDuLieu);
        });

        d3.select('#streets').on('change', function() {
            strt = d3.select(this).property('value');
            bieuDien(data, locDuLieu);
        });

        d3.select('#species').on('change', function() {
            species = d3.select(this).property('value');
            bieuDien(data, locDuLieu);
        });
    
        function bieuDien(data, locDuLieu) {
            var filtered_data;
            if (locDuLieu) {
                filtered_data = locDuLieu(data);
            } else {
                filtered_data = data;
            }
    
            var circles = d3.select("svg")
            .selectAll("circle.crime")
            .data(filtered_data, function(d, i) { return d.TreeID; });

            circles.enter().append("circle")
            .attr("data-id", function(d) {return d.TreeID})
            .attr("cx", function(d) {
                var arr = [d.Longitude, d.Latitude];
                return projection(arr)[0]
            })
            .attr("cy", function(d) {
                var arr = [d.Longitude, d.Latitude];
                return projection(arr)[1]
            })
            .attr("r", "3px")
            .attr("class", "crime")
            .attr("fill", "TEAL")

            circles.exit().remove();
        }

        function locDuLieu(data) {
            var filtered = data.filter(function(crime_point) {
                var keep = true;
          
                var arr = [crime_point.Longitude, crime_point.Latitude]
                if (d3.select("#A")[0][0]) {
                    var a = projection.invert([d3.select("#A").attr("cx"), d3.select("#A").attr("cy")]);
                   
                    keep = keep && d3.geo.distance(a, arr) * 3959 <= d3.select("#nRadiusA").attr("value");
                }
                if (d3.select("#B")[0][0]) {
                    var b = projection.invert([d3.select("#B").attr("cx"), d3.select("#B").attr("cy")]);
                    keep = keep && d3.geo.distance(b, arr) * 3959 <= d3.select("#nRadiusB").attr("value");
                }

                if (plot_size && plot_size !== "all") {
                    keep = keep && crime_point.PlotSize.toLowerCase() === plot_size;
                }

                if (strt && strt !== "all") {
                    var temp = crime_point.qAddress
                    keep = keep && temp.substr(crime_point.qAddress.indexOf(' ') + 1).toLowerCase() === strt;
                }

                if (species && species !== "all") {
                    keep = keep && crime_point.qSpecies.toLowerCase() === species;
                }
               
                return keep;
            });
            return filtered;
        } 

        var upper_right = projection.invert([750, 0]);
        var lower_left = projection.invert([0, 750]);
        var dist_px = 750 * Math.sqrt(2);
        var dist_mile = d3.geo.distance(upper_right, lower_left) * 3959;
        var ratio = dist_px/dist_mile  
    })

})(d3, jQuery, $, window)