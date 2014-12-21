// generiraj Margaret, Keny, Chuck
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';
var margaretEhrId, kenyEhrId, chuckEhrId;

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

function randomTimeDate()
{
	// 2014-12-11T22:41:51.328+01:00
	var leto = Math.floor(Math.random()*55+1960);
	var mesec = Math.floor(Math.random()*12+1);
	var danZgM;
	if(mesec == 1 || mesec == 3 || mesec == 5 || mesec == 7 || mesec == 8 || mesec == 10 || mesec == 12)
		danZgM = 31;
	else if(mesec == 2)
		danZgM = 28;
	else
		danZgM = 30;

	var dan = Math.floor(Math.random()*danZgM+1);	
	var ura = Math.floor(Math.random()*23);
	var minuta = Math.floor(Math.random()*60+1);
	var sekunda = Math.floor(Math.random()*60);
	// var tisocinka = Math.floor(Math.random()*1000);

	var datum = leto + "-" + mesec + "-" + dan + "T" + ura + ":" + minuta + ":" + sekunda +	 "Z";
	return datum;

}

// podatkiVS: {datumInUra, telesnaTemp, telesnaTeza, telesnaVisina, sisTlak, diasTlak, nasicSKis, merilec, }
// podatkiMed: {zdravnik, zdUstanova, navodila, casInt, kolicinaDnevno, zac, kon, smernice, zdravilo}
function generirajPodatke(ehrId, podatkiVS, podatkiMed)
{	
	var sessionId = getSessionId();

	$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
	});

	var datumInUra = podatkiVS["datumInUra"];
	var telesnaTemperatura = podatkiVS["telesnaTemp"];
	var telesnaTeza = podatkiVS["telesnaTeza"];
	var telesnaVisina = podatkiVS["telesnaVisina"];
	var sistolicniKrvniTlak = podatkiVS["sisTlak"];
	var diastolicniKrvniTlak = podatkiVS["diasTlak"];
	var nasicenostKrviSKisikom = podatkiVS["nasicSKis"];
	
	var merilec = podatkiVS["merilec"];


	var podatki = {	
	   	"ctx/language": "en",
	    "ctx/territory": "SI",
	    "ctx/time": datumInUra,
	    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
	    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
	   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
	    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
	    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
	    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
	    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom
	};


	var parametriZahteve = {
	    "ehrId": ehrId,
	    templateId: 'Vital Signs',
	    format: 'FLAT',
	    committer: merilec
	};
	$.ajax({
	    url: baseUrl + "/composition?" + $.param(parametriZahteve),
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(podatki),
	    success: function (res) {
	    	console.log(res.meta.href);
	    },
	    error: function(err) {
			console.log(JSON.parse(err.responseText).userMessage);
	    }
	});


	var zdravnik = podatkiMed["zdravnik"];

	var zdUstanova = podatkiMed["zdUstanova"];
	
	var narrative = podatkiMed["navodila"];

	var timingval = podatkiMed["casInt"];
	var timingdc = podatkiMed["kolicinaDnevno"];

	var startDate = podatkiMed["zac"];
	
	var endDate  = podatkiMed["kon"];
	
	var medDir = podatkiMed["smernice"];

	var medicine = podatkiMed["zdravilo"];


	podatki = {
		"ctx/language": "en",
	    "ctx/territory": "SI",
	    "ctx/time": datumInUra,
	    "ctx/id_namespace":zdUstanova,
	    "ctx/participation_name":zdravnik,
	    "ctx/participation_function":"requester",
	    "ctx/participation_mode":"face-to-face communication",
	    "medications/medication_instruction:0/order:0/medicine": medicine,
	    "medications/medication_instruction:0/order:0/directions":medDir,
	    "medications/medication_instruction:0/order:0/dose/quantity|unit": Math.floor(Math.random()*5+1),
		"medications/medication_instruction:0/order:0/medication_timing/timing/daily_count": timingdc,
		"medications/medication_instruction:0/order:0/medication_timing/start_date": startDate,
		"medications/medication_instruction:0/order:0/medication_timing/stop_date": endDate,

		// bugg fix : Composition validation failed (there are missing or invalid values).
		'medications/medication_instruction/order/timing|formalism': 'timing',
		'medications/medication_instruction/order/timing|value': timingval,
		'medications/medication_instruction/narrative': narrative
	};

	// podatki =  {
	// 	"ctx/language":"en",
	// 	"ctx/territory":"SI",
	// 	"ctx/composer_name":"Silvia Blake",
	// 	"ctx/time":datumInUra,
	// 	"ctx/id_namespace":zdUstanova,
	// 	"ctx/id_scheme":"HOSPITAL-NS",
	// 	"ctx/participation_name":zdravnik,
	// 	"ctx/participation_function":"requester",
	// 	"ctx/participation_mode":"face-to-face communication",
	// 	"ctx/participation_id":"199",
	// 	"ctx/participation_name:1":"Lara Markham",
	// 	"ctx/participation_function:1":"performer",
	// 	"ctx/participation_id:1":"198",
	// 	"ctx/health_care_facility|name":"Hospital",
	// 	"ctx/health_care_facility|id":"9091",
	// 	"medications/context/context_detail:0/tags:0":"Tags 30",
	// 	"medications/medication_instruction:0/order:0/medicine":medicine,
	// 	"medications/medication_instruction:0/order:0/directions":"Directions 1",
	// 	"medications/medication_instruction:0/order:0/dose/quantity|magnitude":3.07,
	// 	"medications/medication_instruction:0/order:0/dose/quantity|unit": Math.floor(Math.random()*5+1),
	// 	"medications/medication_instruction:0/order:0/dose/description":"Description 49",
	// 	"medications/medication_instruction:0/order:0/medication_timing/timing_description":"Timing description 74",
	// 	"medications/medication_instruction:0/order:0/medication_timing/timing/daily_count":timingdc,
	// 	"medications/medication_instruction:0/order:0/medication_timing/timing/frequency|magnitude":66.39,
	// 	"medications/medication_instruction:0/order:0/medication_timing/timing/frequency|unit":"/d",
	// 	"medications/medication_instruction:0/order:0/medication_timing/prn":false,
	// 	"medications/medication_instruction:0/order:0/medication_timing/start_date":startDate,
	// 	"medications/medication_instruction:0/order:0/medication_timing/stop_date":"2014-12-21T19:18:53.526Z",
	// 	"medications/medication_instruction:0/order:0/medication_timing/long-term":true,
	// 	"medications/medication_instruction:0/order:0/additional_instruction:0":"Additional instruction 23",
	// 	"medications/medication_instruction:0/order:0/clinical_indication:0":"Clinical Indication 24",
	// 	"medications/medication_instruction:0/order:0/administration_details/route|code":"N.56",
	// 	"medications/medication_instruction:0/order:0/administration_details/route|value":"N.56 description",
	// 	"medications/medication_instruction:0/order:0/administration_details/site|code":"at0012",
	// 	"medications/medication_instruction:0/order:0/administration_details/delivery_method":"Delivery method 28",
	// 	"medications/medication_instruction:0/order:0/administration_details/dose_duration":"P3DT9H46M",
	// 	"medications/medication_instruction:0/order:0/comment:0":"Comment 33",
	// 	"medications/medication_instruction/order/timing|formalism": "timing",
	// 	"medications/medication_instruction/order/timing|value": "timingval",
	// 	"medications/medication_instruction/narrative": "narrative"
	// 	};

	console.log(podatki);

	parametriZahteve = {
	    "ehrId": ehrId,
	    templateId: 'Medications',
	    format: 'FLAT',
	    committer: zdravnik
	};

	$.ajax({
	    url: baseUrl + "/composition?" + $.param(parametriZahteve),
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(podatki),
	    success: function (res) {
	    	console.log(res.meta.href);
	    },
	    error: function(err) {
			console.log(JSON.parse(err.responseText).userMessage);
	    }
	});
}

function kreirajEhrZaBolnike()
{	
	var r = $.Deferred();

	sessionId = getSessionId();


	$.ajaxSetup({
	    headers: {
	        "Ehr-Session": sessionId
	    }
	});	

	// Margaret - bolnik 1
	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    
	    success: function (data) {
	        var ehrId = data.ehrId;
	        var partyData = {
		            firstNames: "Margaret",
		            lastNames: "Tuu",
		            dateOfBirth: "1972-7-18T19:20",
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId},]
		        };

	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
	                	margaretEhrId = ehrId;
	                    console.log(margaretEhrId);
	                    $("#generatorObvestila").append("<div class=\"alert alert-success alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><strong>Uspešno kreiran EHR zapis, Margaret! </strong> ehrId - <a href=\"./index.html#" + ehrId + "\" class=\"alert-link\">"+ ehrId +"</a></div>");


	                }
	            },
	            
	            error: function(err) {
	            	console.log("napaka!!! ehr bolnika ni bilo mogoče ustvariti! " + JSON.parse(err.responseText).userMessage);
	            }


	        });
	    }
	});

	// Keny - bolnik 2
	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    
	    success: function (data) {
	        var ehrId = data.ehrId;
	        var partyData = {
		            firstNames: "Keny",
		            lastNames: "Wuu",
		            dateOfBirth: "2010-4-11T19:11",
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId},]
		        };

	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
	                	kenyEhrId = ehrId;
	                    console.log(kenyEhrId);
	                    $("#generatorObvestila").append("<div class=\"alert alert-success alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><strong>Uspešno kreiran EHR zapis, Keny! </strong> ehrId - <a href=\"./index.html#" + ehrId + "\" class=\"alert-link\">"+ ehrId +"</a></div>");

	                }
	            },
	            
	            error: function(err) {
	            	console.log("napaka!!! ehr bolnika ni bilo mogoče ustvariti! " + JSON.parse(err.responseText).userMessage);
	            }


	        });
	    }
	});

	// Chuck - bolnik 3
	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    
	    success: function (data) {
	        var ehrId = data.ehrId;
	        var partyData = {
		            firstNames: "Chuck",
		            lastNames: "Noris",
		            dateOfBirth: "1982-7-12T19:10",
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId},]
		        };

	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
	                	chuckEhrId = ehrId;
	                    console.log(chuckEhrId);
	                    $("#generatorObvestila").append("<div class=\"alert alert-success alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><strong>Uspešno kreiran EHR zapis, Chuck! </strong> ehrId - <a href=\"./index.html#" + ehrId + "\" class=\"alert-link\">"+ ehrId +"</a></div>");

	                }
	            },
	            
	            error: function(err) {
	            	console.log("napaka!!! ehr bolnika ni bilo mogoče ustvariti! " + JSON.parse(err.responseText).userMessage);
	            }


	        });
	    }
	});

	setTimeout(function (){
    // and call `resolve` on the deferred object, once you're done
		r.resolve();
	}, 3000);

	// return the deferred object
	return r;

}


// podatkiVS: {datumInUra, telesnaTemp, telesnaTeza, telesnaVisina, sisTlak, diasTlak, nasicSKis, merilec, }
// podatkiMed: {zdravnik, zdUstanova, navodila, casInt, kolicinaDnevno, zac, kon, smernice, zdravilo}

function margaretRecs(ehrId)
{
	generirajPodatke(ehrId, 
		{"datumInUra":"1996-1-29T17:19:5Z", "telesnaTemp":23.2, "telesnaTeza":80, "telesnaVisina":163, "sisTlak":121, "diasTlak":60, "nasicSKis":112, "merilec":"Mike" },
		{"zdravnik":"Dr. Simon Stopar", "zdUstanova":"Zdravstveni dom Ljubljana", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":2, "zac":"1984-4-29T17:19:5Z", "kon":"1990-12-21T19:18:53.526Z", "smernice":"Pijte veliko tekocine", "zdravilo":"Amoxil"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"1997-5-12T17:19:5Z", "telesnaTemp":38.2, "telesnaTeza":98, "telesnaVisina":174, "sisTlak":115, "diasTlak":60, "nasicSKis":123, "merilec":"Stew" },
		{"zdravnik":"Dr. Nives Avancini", "zdUstanova":"Zdravstveni dom Grosuplje", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":5, "zac":"1999-4-29T17:19:5Z", "kon":"2002-12-21T19:18:53.526Z", "smernice":"Uporaba po potrebi, vendar zmerno", "zdravilo":"Aspirin"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"1998-3-11T17:19:5Z", "telesnaTemp":37.7, "telesnaTeza":90, "telesnaVisina":177, "sisTlak":122, "diasTlak":80, "nasicSKis":142, "merilec":"Boom" },
		{"zdravnik":"Dr. Peter Zorman", "zdUstanova":"Zdravstveni dom Novo Mesto", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":4, "zac":"2001-4-29T17:19:5Z", "kon":"2003-12-21T19:18:53.526Z", "smernice":"Pred uporabo bodite tesci", "zdravilo":"Omnicef"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"2010-4-21T17:19:5Z", "telesnaTemp":36.1, "telesnaTeza":88, "telesnaVisina":181, "sisTlak":131, "diasTlak":90, "nasicSKis":133, "merilec":"Tina" },
		{"zdravnik":"Dr. Marcus Johnson", "zdUstanova":"Zdravstveni dom Celje", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":3, "zac":"2002-4-29T17:19:5Z", "kon":"2005-12-21T19:18:53.526Z", "smernice":"Pred uporabo bodite tesci", "zdravilo":"Tamiflu"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"2013-6-21T17:19:5Z", "telesnaTemp":37.4, "telesnaTeza":140, "telesnaVisina":182, "sisTlak":131, "diasTlak":90, "nasicSKis":133, "merilec":"Ashely" },
		{"zdravnik":"Dr. House", "zdUstanova":"Zdravstveni dom Celje", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":3, "zac":"2003-4-29T17:19:5Z", "kon":"2004-12-21T19:18:53.526Z", "smernice":"Uporaba po potrebi, vendar zmerno", "zdravilo":"Aspirin"}
	);
}

function kenyRecs(ehrId)
{
	generirajPodatke(ehrId, 
		{"datumInUra":"1998-1-29T17:19:5Z", "telesnaTemp":37.2, "telesnaTeza":42, "telesnaVisina":140, "sisTlak":115, "diasTlak":80, "nasicSKis":112, "merilec":"Mike" },
		{"zdravnik":"Dr. Simon Stopar", "zdUstanova":"Zdravstveni dom Ljubljana", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":2, "zac":"2000-4-29T17:19:5Z", "kon":"2000-12-21T19:18:53.526Z", "smernice":"Pijte veliko tekocine", "zdravilo":"Percogesic"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"1999-8-12T17:19:5Z", "telesnaTemp":38.2, "telesnaTeza":44, "telesnaVisina":148, "sisTlak":155, "diasTlak":77, "nasicSKis":123, "merilec":"Stew" },
		{"zdravnik":"Dr. Nives Avancini", "zdUstanova":"Zdravstveni dom Grosuplje", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":5, "zac":"2000-5-29T17:19:5Z", "kon":"2003-12-21T19:18:53.526Z", "smernice":"Pijte veliko tekocine", "zdravilo":"Percogesic"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"2000-3-11T17:19:5Z", "telesnaTemp":42.7, "telesnaTeza":68, "telesnaVisina":170, "sisTlak":132, "diasTlak":70, "nasicSKis":142, "merilec":"Boom" },
		{"zdravnik":"Dr. Peter Zorman", "zdUstanova":"Zdravstveni dom Novo Mesto", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":4, "zac":"2000-7-29T17:19:5Z", "kon":"2004-12-21T19:18:53.526Z", "smernice":"Pijte veliko tekocine", "zdravilo":"BeFlex"}
	);
}

function chuckRecs(ehrId)
{
	generirajPodatke(ehrId, 
		{"datumInUra":"1998-1-29T17:19:5Z", "telesnaTemp":34.2, "telesnaTeza":100, "telesnaVisina":174, "sisTlak":121, "diasTlak":60, "nasicSKis":112, "merilec":"Mike" },
		{"zdravnik":"Dr. Simon Stopar", "zdUstanova":"Zdravstveni dom Ljubljana", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":2, "zac":"1984-4-29T17:19:5Z", "kon":"1990-12-21T19:18:53.526Z", "smernice":"Pijte veliko tekocine", "zdravilo":"Amoxil"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"1998-5-12T17:19:5Z", "telesnaTemp":38.2, "telesnaTeza":111, "telesnaVisina":175, "sisTlak":115, "diasTlak":60, "nasicSKis":123, "merilec":"Stew" },
		{"zdravnik":"Dr. Nives Avancini", "zdUstanova":"Zdravstveni dom Grosuplje", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":5, "zac":"1999-4-29T17:19:5Z", "kon":"2002-12-21T19:18:53.526Z", "smernice":"Uporaba po potrebi, vendar zmerno", "zdravilo":"Aspirin"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"1999-3-11T17:19:5Z", "telesnaTemp":37.7, "telesnaTeza":102, "telesnaVisina":176, "sisTlak":122, "diasTlak":80, "nasicSKis":142, "merilec":"Boom" },
		{"zdravnik":"Dr. Peter Zorman", "zdUstanova":"Zdravstveni dom Novo Mesto", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":4, "zac":"2001-4-29T17:19:5Z", "kon":"2003-12-21T19:18:53.526Z", "smernice":"Pred uporabo bodite tesci", "zdravilo":"Omnicef"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"2010-4-21T17:19:5Z", "telesnaTemp":36.1, "telesnaTeza":99, "telesnaVisina":177, "sisTlak":131, "diasTlak":90, "nasicSKis":133, "merilec":"Tina" },
		{"zdravnik":"Dr. Marcus Johnson", "zdUstanova":"Zdravstveni dom Celje", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":3, "zac":"2002-4-29T17:19:5Z", "kon":"2005-12-21T19:18:53.526Z", "smernice":"Pred uporabo bodite tesci", "zdravilo":"Tamiflu"}
	);
	generirajPodatke(ehrId, 
		{"datumInUra":"2013-3-21T17:19:5Z", "telesnaTemp":40.4, "telesnaTeza":98, "telesnaVisina":178, "sisTlak":131, "diasTlak":90, "nasicSKis":133, "merilec":"Ashely" },
		{"zdravnik":"Dr. House", "zdUstanova":"Zdravstveni dom Celje", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":3, "zac":"2003-4-29T17:19:5Z", "kon":"2004-12-21T19:18:53.526Z", "smernice":"Uporaba po potrebi, vendar zmerno", "zdravilo":"Aspirin"}
	);

	generirajPodatke(ehrId, 
		{"datumInUra":"2013-6-21T17:19:5Z", "telesnaTemp":37.4, "telesnaTeza":88, "telesnaVisina":179, "sisTlak":131, "diasTlak":90, "nasicSKis":133, "merilec":"Ashely" },
		{"zdravnik":"Dr. Who", "zdUstanova":"Zdravstveni dom Celje", "navodila":"Jemlji na 2 krat na dan", "casInt":4, "kolicinaDnevno":3, "zac":"2003-4-29T17:19:5Z", "kon":"2004-12-21T19:18:53.526Z", "smernice":"Uporaba po potrebi, vendar zmerno", "zdravilo":"Aspirin"}
	);


}


$(document).ready(function(){
		var merilci = ["Mike", "Lora", "Niwes", "Nike", "Amy"];
		var zdravniki = ["Dr. Nives Avancini", "Dr. Simon Stopar", 	"Dr. Peter Zorman", "Dr. Miha Kocar", "Dr. Marcus Johnson"];
		var zdUstanove = ["Zdravstveni dom Ljubljana", "Zdravstveni dom Grosuplje", "Zdravstveni dom Celje", "Zdravstveni dom Novo Mesto", "Zdravstveni dom Maribor"];
		var narratives = ["Jemlji na 4ure", "Jemlji na 8ur", "Jemlji na 12ur", "Jemlji na 2dni", "Jemlji na 2 krat na dan"];
		var medDirs = ["Pred uporabo bodite tesci", "Pijte veliko tekocine", "Uporaba po potrebi, vendar zmerno"];
		var medicines = ["Aspirin", "Amoxil", "Avelox", "Omnicef", "Percogesic", "Tamiflu", "BeFlex"];

		// datum oblike 1998-4-29T17:19:5Z
		$("#korak1").click(function(){
			if(!kenyEhrId)
				kreirajEhrZaBolnike();
			$("#korak2").css("visibility", "visible");
		});


		$("#korak2").click(function(){
			if(margaretEhrId != null && kenyEhrId!= null && chuckEhrId!= null)
			{
				margaretRecs(margaretEhrId);
				kenyRecs(kenyEhrId);
				chuckRecs(chuckEhrId);

				$("#generatorObvestila").css("visibility", "visible");
			}
		});

});
