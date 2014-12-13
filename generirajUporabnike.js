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

// tukaj so zapisani ehrIdji za vse tri uporabnike.
var margaretEhrId = "07d1af0c-607f-42bc-bdbe-a76a8bcf615a";
var kenyEhrId = "d31a383a-67c2-4efb-a32f-ae161ef64eae";
var chuckEhrId = "365fc67b-a135-4c21-9175-808a4b7c912c";

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



function generirajPodatke(ehrId)
{	
	var sessionId = getSessionId();

	$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
	});

	var datumInUra = randomTimeDate();
	var telesnaTemperatura = Math.floor(Math.random()*50 - Math.random()*12);
	var telesnaTeza = Math.floor(Math.random()*90+10);
	var telesnaVisina = Math.floor(Math.random()*190+20);
	var sistolicniKrvniTlak = Math.floor(Math.random()*130+3);
	var diastolicniKrvniTlak = Math.floor(Math.random()*130+3);
	var nasicenostKrviSKisikom = Math.floor(Math.random()*212+21);
	
	var merilci = ["Mike", "Lora", "Niwes", "Nike", "Amy"];
	var merilec = merilci[Math.floor(Math.random()*merilci.length)];


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


	var zdravniki = ["Dr. Nives Avancini", "Dr. Simon Stopar", 	"Dr. Peter Zorman", "Dr. Miha Kocar", "Dr. Marcus Johnson"];
	var zdravnik = zdravniki[Math.floor(Math.random()*zdravniki.length)];

	var zdUstanove = ["Zdravstveni dom Ljubljana", "Zdravstveni dom Grosuplje", "Zdravstveni dom Celje", "Zdravstveni dom Novo Mesto", "Zdravstveni dom Maribor"];
	var zdUstanova = zdUstanove[Math.floor(Math.random()*zdUstanove.length)];
	
	var narratives = ["Jemlji na 4ure", "Jemlji na 8ur", "Jemlji na 12ur", "Jemlji na 2dni", "Jemlji na 2 krat na dan"];
	var narrative = narratives[Math.floor(Math.random()*narratives.length)];

	var timingval = Math.floor(Math.random()*10+1);
	var timingdc = Math.floor(Math.random()*4+1);

	var startDate = randomTimeDate();
	var endDate = randomTimeDate();
	if(startDate > endDate)
	{
		var tmp = endDate;
		endDate = startDate;
		startDate = tmp;
	}

	var medDirs = ["Pred uporabo bodite tesci", "Pijte veliko tekocine", "Uporaba po potrebi, vendar zmerno"];
	var medDir = medDirs[Math.floor(Math.random()*medDirs.length)];

	var medicines = ["Aspirin", "Amoxil", "Avelox", "Omnicef", "Percogesic", "Tamiflu", "BeFlex"];
	var medicine = medicines[Math.floor(Math.random()*medicines.length)];


	podatki = {
		"ctx/language": "en",
	    "ctx/territory": "SI",
	    "ctx/time": datumInUra,
	    "ctx/id_namespace":zdUstanova,
	    "ctx/participation_name":zdravnik,
	    "ctx/participation_function":"requester",
	    "ctx/participation_mode":"face-to-face communication",
	    "medications/medication_instruction:0/order:0/medicine": medicine,
	    "medications/medication_instruction:0/order:0/	":medDir,
	    "medications/medication_instruction:0/order:0/dose/quantity|unit": Math.floor(Math.random()*5+1),
		"medications/medication_instruction:0/order:0/medication_timing/timing/daily_count": timingdc,
		"medications/medication_instruction:0/order:0/medication_timing/start_date": startDate,
		"medications/medication_instruction:0/order:0/medication_timing/stop_date": endDate,

		// bugg fix : Composition validation failed (there are missing or invalid values).
		'medications/medication_instruction/order/timing|formalism': 'timing',
		'medications/medication_instruction/order/timing|value': timingval,
		'medications/medication_instruction/narrative': narrative
	};

	// console.log(podatki);

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

function dodajZapiseBolnikov()
{
	// [10-19 podatkov]
	var i = Math.floor(Math.random()*10 + 10);
	var j = Math.floor(Math.random()*10 + 10);
	var k = Math.floor(Math.random()*10 + 10);

	while(i!=0)
	{
		generirajPodatke(margaretEhrId);
		i--;
	}

	while(j!=0)
	{
		generirajPodatke(kenyEhrId);
		j--;
	}

	while(k!=0)
	{
		generirajPodatke(chuckEhrId);
		k--;
	}

}

function izpisiKreiraneEhrId()
{
	alert("margaretEhrId: " + margaretEhrId + "\nkenyEhrId: " + kenyEhrId + "\nchuckEhrId: " + chuckEhrId);

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

$(document).ready(function(){
	// kreirajEhrZaBolnike().done(izpisiKreiraneEhrId);

	//  EhrId-ji:
	// 07d1af0c-607f-42bc-bdbe-a76a8bcf615a		 1	
	// d31a383a-67c2-4efb-a32f-ae161ef64eae		 2
	// 365fc67b-a135-4c21-9175-808a4b7c912c      3

	
	// dodajZapiseBolnikov();
	
});