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
	var maxVisina, minVisina, padding=48;
	if(rows.length>0)
	{
		maxVisina = rows[0].telVisinaVr.value.magnitude;
		minVisina = rows[0].telVisinaVr.value.magnitude;
	} else {
		return;
	}
	console.log(rows.length);


	for(var key in rows)
	{	
		// datum mertive
		var casMeritveVisine = rows[key].telVisinaCas.value;
		// visina v cm
		var vrednostMeritveVisine = rows[key].telVisinaVr.value.magnitude;
		
		if(minVisina > vrednostMeritveVisine) {
			minVisina = vrednostMeritveVisine;
		} else if(maxVisina < vrednostMeritveVisine) {
			maxVisina = vrednostMeritveVisine;
		}
		podatkiTelVisina.push({"cas": new Date(casMeritveVisine), "visina":vrednostMeritveVisine});

	}

	// sortirana po datumu (najstarejši - najnovejši)
	podatkiTelVisina.sort(function(a,b){	
		if(a.cas < b.cas)
			return -1;
		else if(a.cas > b.cas)
			return 1;
		return 0;	
	});


	// maxVisina, minVisina, podatkiTelVisina(visina, datum)


	var width = $("#visina").width();
	var height = width/2;

	var vis = d3.select("#visina")
		.append("svg:svg")
			.attr("width", width)
            .attr("height", height);

    var yScale = d3.scale.linear()
	    .domain([0, maxVisina])   
		.range([height - padding, padding]); 

   	var xScale = d3.time.scale()
	    .domain([podatkiTelVisina[0].cas, podatkiTelVisina[podatkiTelVisina.length-1].cas])    // values between for month of january
		.range([padding, width - padding * 2]);

	alert(podatkiTelVisina[0].cas);

    var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale);
    

    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);
        

    vis.append("g")
        .attr("transform", "translate("+padding+",0)")
        .call(yAxis);

    vis.append("g")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    // vis.selectAll(".xaxis text")  // select all the text elements for the xaxis
    //     .attr("transform", function(d) {
    //     	return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";z
    //     });

}


$(document).ready(function(){
	preberiPodatkeZaVitalneZnake('365fc67b-a135-4c21-9175-808a4b7c912c');
	$( window ).resize(function() {

	});	
});