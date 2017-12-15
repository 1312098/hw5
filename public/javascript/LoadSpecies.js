(function() {
    d3.csv("trees.csv", function(error, data) {
        function AddSpecies()
        {   
            var opt;
            var arr = data.map(item => item.qSpecies.trim().toLowerCase())
                .filter((value, index, self) => self.indexOf(value) === index)
            $.each( arr, function( key, value ) {
                opt = document.createElement("option");    
                opt.text = value
                opt.value = value
                document.getElementById('species').options.add(opt);
            })    
        }
        AddSpecies()
    })
})(d3, jQuery, $, window)