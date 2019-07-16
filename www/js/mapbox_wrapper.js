var mapbox;
var mapbox_marker = [];
var mapbox_bounds = [];
var mapbox_marker_track = [];

getMapbox = function(){
	return {
		mapbox_access_token: getStorage("mapbox_access_token"),
		mapbox_default_zoom: getStorage("mapbox_default_zoom"),
	};
};

centerMapbox = function(){
	mapbox.fitBounds(mapbox_bounds, {padding: [30, 30]}); 
};

mapboxCreateIcon = function(icon_url){
	icon = L.icon({
		iconUrl: icon_url
	});
	return icon;
};

mapboxInitMap = function(div, data){
	dump("div name =>"+div); 
	dump(data);
	try {
	
		if(empty(data.lat) && empty(data.lng)){
		   toastMsg( getTrans("Missing Coordinates","missing_coordinates") );	
		   return;
		}
		
		lat = data.lat;
		lng = data.lng;
		 
		mapbox_info = getMapbox();
		mapbox_default_zoom = mapbox_info.mapbox_default_zoom;
		if(empty(mapbox_default_zoom)){
			mapbox_default_zoom=18;
		}
		
		mapbox_token = mapbox_info.mapbox_access_token
		
		icon2=''; icon1='';
		
		if(data.use_icon){
			icon2 = mapboxCreateIcon(data.icons.destination_icon);
		    icon1 = mapboxCreateIcon(data.icons.from_icon);
		}
		
		mapbox_bounds = [];
		
		mapbox = L.map(div,{ 
		   scrollWheelZoom:true,
		   zoomControl:false,
	    }).setView([lat,lng], 5 );
	    
	    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+mapbox_token, {		    
		    maxZoom: mapbox_default_zoom,
		    id: 'mapbox.streets',		    
		}).addTo(mapbox);
		
		if(data.show_info){
		   info_html = data.info_html;
		}
	       			
		data_marker={};		
		data_marker.draggable = data.draggable;		
		if(data.use_icon){
			data_marker.icon = icon2;
		}
		dump("data_marker=>");
		dump(data_marker);
		
		mapbox_marker = L.marker([ lat , lng ], data_marker ).addTo(mapbox);  
		
		if(data.show_info){
			/*mapbox_marker.bindPopup(info_html);
			mapbox_marker.openPopup();*/
			mapbox_marker.bindPopup( info_html , {autoClose:false}).openPopup();
		}
		
		if(data.use_geocoder){
			$(".search_address_geo").hide();
			$(".iconsearch").hide();
									
			
			mobile_country_code = getStorage("mobile_country_code");
			data_geocoder = {
			    accessToken: mapbox_token ,		
			    flyTo : false
			};
			if(!empty(mobile_country_code)){
				data_geocoder.country = mobile_country_code;
			}
									
			var geocoder = new MapboxGeocoder(data_geocoder);
			document.getElementById(data.geocoder_div).appendChild(geocoder.onAdd(mapbox));						
			
			geocoder.on('result', function(e) {
			    var result = e.result;			 

			    var newLatLng = new L.LatLng(result.center[1], result.center[0]);
     	        mapbox_marker.setLatLng(newLatLng); 
			    		    
			    mapbox_bounds = [];			    
			    latlng = [result.center[1] , result.center[0] ];
				mapbox_bounds.push( latlng );
				centerMapbox();			    			  
			});
		}
		
		latlng = [lat,lng];
		mapbox_bounds.push( latlng );
		centerMapbox();
		
	} catch(err) {		
		dump(err);
	    //toastMsg(err.message);
	}  
};

mapboxDirection = function(div, data){
	mapboxInitMap(div,data);
	
	navigator.geolocation.getCurrentPosition( function(position){			
		var your_lat = position.coords.latitude;
        var your_lng = position.coords.longitude;
        
        var control = L.Routing.control({	
		waypoints: [
			    L.latLng(your_lat, your_lng),
			    L.latLng(lat, lng)
			],
		    router: L.Routing.mapbox(mapbox_token),
		    createMarker: function(i, wp, nWps) {					    
			    if(i==0){
			    	 return L.marker(wp.latLng, {icon: icon1 });
			    } else {
			    	 return L.marker(wp.latLng, {icon: icon2 });
			    }
			} 
	   });
	   
	   var routeBlock = control.onAdd(mapbox);    
   		
       mapbox_bounds.push( [your_lat,your_lng] );    
       centerMapbox();
        
	}, function(error){   		   	
   	   toastMsg( error.message );  	  
    }, 
    { timeout: 60000 , enableHighAccuracy: getLocationAccuracy(), maximumAge:Infinity } );	
};

mapboxSelectFromMap = function(div, data){
	mapboxInitMap(div,data);
	
	navigator.geolocation.getCurrentPosition( function(position){			
		var your_lat = position.coords.latitude;
        var your_lng = position.coords.longitude;
        dump("your_lat : "+ your_lat);
        dump("your_lng : "+ your_lng);
        
        if (mapbox_marker) { // check        	
	        mapbox.removeLayer(mapbox_marker); // remove
	    }
	    
	    mapbox_marker = L.marker([ your_lat , your_lng ], {
	      draggable	:true
	    } ).addTo(mapbox); 
	    
	    mapbox_marker.on('dragend', function (e) {
	    	new_lat = mapbox_marker.getLatLng().lat;
	    	new_lng = mapbox_marker.getLatLng().lng;
	    	dump("new_lat : "+ new_lat);
            dump("new_lng : "+ new_lng);
	    });
	    
	    mapbox_bounds = [];
	    latlng = [your_lat,your_lng];
		mapbox_bounds.push( latlng );
		centerMapbox();
        
    }, function(error){   		   	
   	   toastMsg( error.message );  	  
    }, 
    { timeout: 60000 , enableHighAccuracy: getLocationAccuracy(), maximumAge:Infinity } );	
};


mapboxTrackMap = function(div, data){
	mapboxInitMap(div,data);	
	
	task_lat = data.lat;
	task_lng = data.lng;
	
	setTimeout(function(){ 
		
		/*DRIVER LOCATION*/
		icon_task = mapboxCreateIcon(data.icons.destination_icon);
		icon_drop = mapboxCreateIcon(data.icons.from_icon);
		icon_driver = mapboxCreateIcon(data.icons.driver_icon);		
		
		driver_lat = $(".driver_lat").val();
		driver_lng = $(".driver_lng").val();
					
		/*DRIVER*/
		if(!empty(driver_lat)){
			dump("driver_lat=>" + driver_lat +" : " + driver_lng );				
			mapbox_marker_track[0] = L.marker([ driver_lat , driver_lng ],{
			   draggable : false ,
			   icon : icon_driver
			}).addTo(mapbox);  
						
			mapbox_marker_track[0].bindPopup( getTrans("Courier",'courier') , {autoClose:false}).openPopup();
			
			latlng = [driver_lat,driver_lng];
			mapbox_bounds.push( latlng );			
		}
		
		/*DROPOFF LOCATION*/
		dropoff_lat = $(".dropoff_lat").val();
		dropoff_lng = $(".dropoff_lng").val();
		if(!empty(dropoff_lat)){
			dump("dropoff_lat=>" + dropoff_lat +" : " + dropoff_lng );				
			
			mapbox_marker_track[1] = L.marker([ dropoff_lat , dropoff_lng ],{
			   draggable : false ,
			   icon : icon_drop
			}).addTo(mapbox);  
			
			mapbox_marker_track[1].bindPopup( getTrans("Dropoff",'dropoff') , {autoClose:false}).openPopup();
			
			latlng = [dropoff_lat,dropoff_lng];
			mapbox_bounds.push( latlng );			
		}
						
		centerMapbox();
		
		/*setTimeout(function(){ 			 
			 new_lat='14.299816596401646';
			 new_lng='121.09954811385163';
			 
			 var newLatLng = new L.LatLng( new_lat, new_lng);
     	     mapbox_marker_track[0].setLatLng(newLatLng); 
     	     latlng = [new_lat,new_lng];
			 mapbox_bounds.push( latlng );			
			 centerMapbox();
			 
		}, 3000);	*/
			
	/*END setTimeout*/
	}, 100);	
		
};