(function() {
    d3.csv("trees.csv", function(error, data) {
        function AddPlotSize()
        {      
            var opt;
            var arr = []
            $.each( data, function( key, value ) {
                if ( arr.indexOf(value.PlotSize.toLowerCase()) > 0 )
                {
                }else {
                    opt = document.createElement("option");    
                    arr.push(value.PlotSize.toLowerCase())
                    opt.text = value.PlotSize.toLowerCase();
                    opt.value = value.PlotSize.toLowerCase();
                    document.getElementById('plot_size').options.add(opt);
                }
            })
        }
        AddPlotSize()
    })
})(d3, jQuery, $, window)