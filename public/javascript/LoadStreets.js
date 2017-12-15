(function() {
    d3.csv("trees.csv", function(error, data) {  
        function AddStreet()
        {          
            var opt;
            var arr = []
            var street;
            $.each( data, function( key, value ) {
                street = value.qAddress.substr(value.qAddress.indexOf(' ')+1);
        
                if ( arr.indexOf(street.toLowerCase()) > 0 )
                {
                    
                }else {
                    opt = document.createElement("option");    
                    arr.push(street.toLowerCase())
                    opt.text = street.toLowerCase();
                    opt.value = street.toLowerCase();
                    document.getElementById('streets').options.add(opt);
                }
            })    
        }
        AddStreet()
    })
})(d3, jQuery, $, window)