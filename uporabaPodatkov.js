var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

function preberiPodatkeZaZdravila(ehrId)
{
	var sessionId = getSessionId();	
	$.ajaxSetup({
	    headers: {
	        "Ehr-Session": sessionId
	    }
	});

	var aql = "SELECT " +
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/activities[at0001]/description[at0002]/items[at0003] as zdravilo, " +
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/activities[at0001]/description[at0002]/items[at0009] as smernice, " +
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/activities[at0001]/description[at0002]/items[at0010, 'Medication timing']/items[openEHR-EHR-CLUSTER.timing.v1] as kolicinaDnevno, " +
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/activities[at0001]/description[at0002]/items[at0010]/items[at0012] as zacetekZdrav, " +
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/activities[at0001]/description[at0002]/items[at0010]/items[at0013] as konecZdrav, " +
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/activities[at0001]/description[at0002]/items[at0035] as opis, " + 
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/activities[at0001]/timing/value as Order_timing, " +
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/narrative as Medication_instruction_narrative, " +
    "a/content[openEHR-EHR-INSTRUCTION.medication.v1]/other_participations as Medication_instruction_other_participations, " +
    "a/context as context, " +
    "a/language as language, " +
    "a/name as name, " +
    "a/territory as territory, " +
    "a/uid as uid "	+
	
	"from EHR e " + 
	"contains COMPOSITION a[openEHR-EHR-COMPOSITION.encounter.v1] " +
	
	"where " +
	    "a/name/value='Medications' and " +
	    "e/ehr_id/value='"+ ehrId + "' " +
	"offset 0 limit 100 ;"	

	console.log(aql);
	$.ajax({
	    url: baseUrl + "/query?" + $.param({"aql": aql}),
	    type: 'GET',
	    success: function (res) {
	        if(res != null)
	        {
	        	var rows = res.resultSet;
		        console.log(rows);
		        izpisiPodatkeZaZdravila(rows);
		        // for (var i in rows) {
		        //     $("#result").append(rows[i].uid + ': ' + rows[i].name + ' (on ' +
		        //                         rows[i].time.value + ")<br>");
		        // }
	        } else
	        {
	        	console.log('AQL pozvedba za dan ehrId ni obrodila sadov - rezultat je prazna množica!');
	        }
	    },
	    error: function(err) {
			console.log(JSON.parse(err.responseText).userMessage);
		}
	});
}
function preberiPodatkeZaVitalneZnake(ehrId)
{
	var sessionId = getSessionId();	
	$.ajaxSetup({
	    headers: {
	        "Ehr-Session": sessionId
	    }
	});

	var aql = "SELECT " +
    "a/content[openEHR-EHR-OBSERVATION.body_temperature.v1]/data[at0002]/events[at0003]/data[at0001]/items[at0004] as telTempVr, "+
    "a/content[openEHR-EHR-OBSERVATION.body_temperature.v1]/data[at0002]/events[at0003]/time as telTempCas, "+
    "a/content[openEHR-EHR-OBSERVATION.blood_pressure.v1]/data[at0001]/events[at0006]/data[at0003] as telKrvniTlak, "+
    "a/content[openEHR-EHR-OBSERVATION.blood_pressure.v1]/data[at0001]/events[at0006]/time as telKrvniTlakCas, " +
    "a/content[openEHR-EHR-OBSERVATION.height.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0004] as telVisinaVr, "+
    "a/content[openEHR-EHR-OBSERVATION.height.v1]/data[at0001]/events[at0002]/time as telVisinaCas, "+
    "a/content[openEHR-EHR-OBSERVATION.body_weight.v1]/data[at0002]/events[at0003]/data[at0001]/items[at0004] as telTezaVr, "+
    "a/content[openEHR-EHR-OBSERVATION.body_weight.v1]/data[at0002]/events[at0003]/time as telTezaCas, "+
    "a/content[openEHR-EHR-OBSERVATION.indirect_oximetry.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0006] as nasicKrviSKisikomVr, "+
    "a/content[openEHR-EHR-OBSERVATION.indirect_oximetry.v1]/data[at0001]/events[at0002]/time as nasicKrviSKisikomCas, "+
    "a/territory/code_string as territory_code_string "+
	"from EHR e "+
	"contains COMPOSITION a[openEHR-EHR-COMPOSITION.encounter.v1] "+
	"where "+
	    "a/name/value='Vital Signs' and "+
	    "e/ehr_id/value='365fc67b-a135-4c21-9175-808a4b7c912c' "+
	"offset 0 limit 100";	

	console.log(aql);
	$.ajax({
	    url: baseUrl + "/query?" + $.param({"aql": aql}),
	    type: 'GET',
	    success: function (res) {
	        if(res != null)
	        {
	        	var rows = res.resultSet;
	        	console.log(rows);	
		        izlusciPodatkeVitalnihZnakov(rows);

		        // for (var i in rows) {
		        //     $("#result").append(rows[i].uid + ': ' + rows[i].name + ' (on ' +
		        //                         rows[i].time.value + ")<br>");
		        // }
	        } else
	        {
	        	console.log('AQL pozvedba za dan ehrId ni obrodila sadov - rezultat je prazna množica!');
	        }
	    },
	    error: function(err) {
			console.log(JSON.parse(err.responseText).userMessage);
		}
	});
}

function izlusciPodatkeVitalnihZnakov(rows)
{
	var podatkiTelVisina = new Array();
	var podatkiTelTeza = new Array();
	var podatkiTelTemp = new Array();
	var podatkiTelTlak = new Array();

	for(var key in rows)
	{	
		// datum mertive
		var casMeritveVisine = rows[key].telVisinaCas.value;
		// visina v cm
		var vrednostMeritveVisine = rows[key].telVisinaVr.value.magnitude;
		
		var casMeritveTeze = rows[key].telTezaCas.value;
		var vrednostMeritveTeze = rows[key].telTezaVr.value.magnitude;

		var casMeritveTemp = rows[key].telTempCas.value;
		var vrednostMeritveTemp = rows[key].telTempVr.value.magnitude;

		var vrednostMeritveSisTlaka = rows[key].telKrvniTlak.items[0].value.magnitude; // systol
		var vrednostMeritveDiasTlaka = rows[key].telKrvniTlak.items[1].value.magnitude; // diastol
		var casMeritveKrvnegaTlaka = rows[key].telKrvniTlakCas.value;



		podatkiTelVisina.push({"cas": new Date(casMeritveVisine), "visina":vrednostMeritveVisine});
		podatkiTelTeza.push({"cas": new Date(casMeritveTeze), "teza": vrednostMeritveTeze});
		podatkiTelTemp.push({"cas": new Date(casMeritveTemp), "temp": vrednostMeritveTemp});
		podatkiTelTlak.push({"cas": new Date(casMeritveKrvnegaTlaka), "sistolicni": vrednostMeritveSisTlaka, "diastolicni": vrednostMeritveDiasTlaka});
	}

	telesnaVisinaIzpis(podatkiTelVisina);
	telesnaTezaIzpis(podatkiTelTeza);
	telesnaTemperaturaIzpis(podatkiTelTemp);
	krvniTlakIzpis(podatkiTelTlak);
	
}

function telesnaVisinaIzpis(podatkiTelVisina)
{
	// sortirana po datumu (najstarejši - najnovejši)
	podatkiTelVisina.sort(function(a,b){	
		if(a.cas < b.cas)
			return -1;
		else if(a.cas > b.cas)
			return 1;
		return 0;	
	});

	// Graf za predstavitev telesne temperature, višine in krvnega pritiska.

	var margin = {
		top: 20,
		right: 20, 
		bottom: 86,
		left: 60
	},
		width = 600 - margin.left - margin.right,
		height = width - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .06);

	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#308fef", "5fa9f3", "1176db"]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.time.format("%Y-%m-%d"));

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	var svg = d3.select("#visina").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	x.domain(podatkiTelVisina.map(function(d){
		return d.cas;
	}));	

	y.domain([0, d3.max(podatkiTelVisina, function(d){
		return d.visina;
	})]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "0.60em")
		.attr("dy", "0.80em")
		.attr("transform", "rotate(-45)" )
	.append("text")
		.attr("dy", "-.82em")
      	.style("text-anchor", "end");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
      	.attr("dy", "-.82em")
      	.style("text-anchor", "end")
      	.text("Višina (cm)");

    var visina_info = $("#visina_info");

    svg.selectAll("bar")
    	.data(podatkiTelVisina)
    .enter().append("rect")
    	.style("fill", "steelblue")
    	.style("opacity", .8)
    	.attr("x", function(d) { return x(d.cas); })
    	.attr("width", x.rangeBand())
    	.attr("y", function(d) {return y(d.visina); })
    	.attr("height", function(d) { return height - y(d.visina); })

    	.on("mouseover", function(d){
    		visina_info.css("visibility", "visible");
    		visina_info.html("<small style='color:green; font-style:italic;'>" + d.cas + " </small>&nbsp;&nbsp;&nbsp;&nbsp;" + d.visina + "cm");
    		$(this).css("fill", "green");

    	})
    	.on("mouseout", function(d){
    		visina_info.css("visibility", "hidden");
    		$(this).css("fill", "steelblue");
    	});

}

function telesnaTemperaturaIzpis(podatkiTelTemp)
{
	// sortirana po datumu (najstarejši - najnovejši)
	podatkiTelTemp.sort(function(a,b){	
		if(a.cas < b.cas)
			return -1;
		else if(a.cas > b.cas)
			return 1;
		return 0;	
	});

	// Graf za predstavitev telesne temperature, višine in krvnega pritiska.

	var margin = {
		top: 20,
		right: 20, 
		bottom: 86,
		left: 80
	},
		width = 600 - margin.left - margin.right,
		height = width - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .06);

	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#308fef", "5fa9f3", "1176db"]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.time.format("%Y-%m-%d"));

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	var svg = d3.select("#temp").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



	x.domain(podatkiTelTemp.map(function(d){
		return d.cas;
	}));	

	y.domain([d3.min(podatkiTelTemp, function(d){return d.temp}), d3.max(podatkiTelTemp, function(d){
		return d.temp;
	})]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "0.60em")
		.attr("dy", "0.80em")
		.attr("transform", "rotate(-45)" )
	.append("text")
		.attr("dy", "-.82em")
      	.style("text-anchor", "end");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
      	.attr("dy", "-.82em")
      	.style("text-anchor", "end")
      	.text("Temperatura (°C)");


    var temp_info = $("#temp_info");

    svg.selectAll("bar")
    	.data(podatkiTelTemp)
    .enter().append("rect")
    	.style("fill", "steelblue")
    	.style("opacity", .8)
    	.attr("x", function(d) { return x(d.cas); })
    	.attr("width", x.rangeBand())
    	.attr("y", function(d) {return y(d.temp); })
    	.attr("height", function(d) { return height - y(d.temp); })

    	.on("mouseover", function(d){
    		temp_info.css("visibility", "visible");
    		temp_info.html("<small style='color:green; font-style:italic;'>" + d.cas + " </small>&nbsp;&nbsp;&nbsp;&nbsp;" + d.temp + "°C");
    		$(this).css("fill", "green");


    	})
    	.on("mouseout", function(d){
    		temp_info.css("visibility", "hidden");
    		$(this).css("fill", "steelblue");
    	});

}

function telesnaTezaIzpis(podatkiTelTeza)
{
	podatkiTelTeza.sort(function(a,b){	
		if(a.cas < b.cas)
			return -1;
		else if(a.cas > b.cas)
			return 1;
		return 0;	
	});

	for(var key in podatkiTelTeza)
	{
		$("#tabela_telTez tr:last").after("<tr><td>" + podatkiTelTeza[key]["cas"] + "</td><td>" + podatkiTelTeza[key]["teza"] + "</td><tr>");
	}
}


function krvniTlakIzpis(podatkiTelTlak)
{
	for(key in podatkiTelTlak)
	{
		$("#tabela_krvniTlak tr:last").after("<tr><td>" + podatkiTelTlak[key]["cas"] + "</td><td>" + podatkiTelTlak[key]["sistolicni"] + "</td><td>" + podatkiTelTlak[key]["diastolicni"] + "</td></tr>");

	}
}

function izpisiPodatkeZaZdravila(podatkiZdravil)
{
	  // url: "http://www.drugs.com/search.php?searchterm=aspirin",
	d3.json("zdravila.json", function(json) {
		if(json==null)
			alert("Error");
		else 
		{
			console.log(json);
			alert("jupi jej");
		}
	});

	
}

$(document).ready(function(){
	preberiPodatkeZaZdravila('365fc67b-a135-4c21-9175-808a4b7c912c');
	preberiPodatkeZaVitalneZnake('365fc67b-a135-4c21-9175-808a4b7c912c');


	$( window ).resize(function() {

	});	
});