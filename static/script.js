// Add map to HTML element.
let mymap = L.map('map').setView([46.5232672,6.6354485], 13);

// Declare legend layer variable and assign a position.
let legend = L.control({position: 'topright'});

// Declare info layer variable and assign a position.
let info = L.control({position: 'topright'});

// Declare geoJSON variable.
let geojson;

// Create classyBrew object.
let brew = new classyBrew();

// Initialize classification variable for classyBrew.
let currentClassification = 'jenks';

// Initialize current category to be mapped after window load.
let currentId = 'pcat1';

// key-value table to return real names of land categories.
let tableau_categories = {
	pcat1 : "Aires industrielles et <br> artisanales",
	pcat2 : "Aires de bâtiments",  
	pcat3 : "Surfaces de transport", 
	pcat4 : "Surfaces d'infrastructure <br> spéciale", 
	pcat5 : "Espaces verts et lieux <br> de détente",
	pcat6 : "Arboriculture fruitière,<br> viticulture, horticulture",  
	pcat7 : "Terres arables",    
	pcat8 : "Prairies naturelles,<br> pâturages locaux",  
	pcat9 : "Alpages",     
	pcat10 : "Forêt (sans forêt buissonnante)",  
	pcat11 : "Forêt buissonnante",   
	pcat12 : "Autres surfaces boisées",  
	pcat13 : "Lacs",    
	pcat14 : "Cours d’eau",    
	pcat15 : "Végétation improductive",    
	pcat16 : "Surfaces sans végétation",   
	pcat17 : "Glaciers, névés" 
};

// key-value table to return color to be used for each categories.
let tableau_couleurs = {
	pcat1 : "Reds",
	pcat2 : "Reds",  
	pcat3 : "Blues", 
	pcat4 : "Reds", 
	pcat5 : "Greens",
	pcat6 : "Greens",  
	pcat7 : "Greens",    
	pcat8 : "Greens",  
	pcat9 : "Greens",     
	pcat10 : "Greens",  
	pcat11 : "Greens",   
	pcat12 : "Greens",  
	pcat13 : "Blues",    
	pcat14 : "Blues",    
	pcat15 : "Greens",    
	pcat16 : "Purples",   
	pcat17 : "Blues" 
};

// Lists keys from tableau_categories only.
let categories = Object.keys(tableau_categories);

// Information about classification, to be displayed in HTML.
let tableau_classifications = {
	jenks : "Ruptures<br> naturelles de Jenks",
	quantile : "Quantiles",  
	equal_interval : "Intervalle régulier"
};

// main function...
function main(){
	
	// Define the background layer for the map and set options.
	L.tileLayer('add your MapBox and token here', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		zoomControl: true,
		maxZoom: 18,
		minZoom: 10,
		id: 'add_your_id_here',
	}).addTo(mymap);

	//add zoom control with options.
	mymap.zoomControl.setPosition('bottomright');
	
	// Call funtion for initial user view.
	SelectId(currentId);
	
	// Insert a "center" button in the map. 
	L.easyButton('glyphicon glyphicon-screenshot', function(btn, map){
		map.setView(new L.LatLng(46.5232672,6.6354485), 13);
	}).addTo(mymap);

}

// Function that allows to display the data selected by the user.
// Colors and legend are dynamically produced and added.
function SelectId(clickedId){
	
	currentId = clickedId;
	
	// Descriptions to be added on the page according to the selected category.
	let infosCategories = {
		pcat1 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Sont comprises dans les aires industrielles et artisanales la surface au sol des bâtiments utilisés à des fins industrielles ou artisanales, ainsi que les terrains attenants, pour autant que la taille du bâtiment ou l'aménagement de l'aire l'entourant, ou encore des informations supplémentaires, permettent d'identifier une telle utilisation. En font partie, outre les établissements de production industrielle, les entrepôts et places d'entreposage, les centres de distribution, certains bâtiments militaires (parcs des automobiles de l'armée, arsenaux), les scieries, menuiseries, entreprises de construction, cimetières de voitures et aires de stationnement d'entreprises d'importation de voitures, ou les places de transbordement de marchandises sur les aires industrielles et artisanales. Les terrains attenants englobent les silos, citernes de mazout, les installations de transport et les installations électriques, les pelouses, les jardins d'ornement, les places de stationnement, les chemins, les voies d’accès et les voies industrielles, ainsi que les boisements, les buissons et les arbustes à l'intérieur de la surface en question.<br><br>Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"</p>",
		pcat2 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Les aires de bâtiments agrègent plusieurs types de sous-catégories:\
		<br><br><b>Aires d'habitation</b><br>\
		Sont comprises dans les aires d'habitation la surface au sol des bâtiments d'habitation, ainsi que les terrains attenants, pour autant que la taille du bâtiment ou l'aménagement de l'aire l'entourant, ou encore des informations supplémentaires, permettent d'identifier une telle utilisation. Le terrain attenant correspond à l'aire appartenant au bâtiment en question, soit en règle générale la parcelle sur laquelle il se situe. Il englobe les pelouses, les jardins ornementaux, les places devant les bâtiments, les cours intérieures, les couverts à voitures, les chemins et les voies d’accès, ainsi que les boisements, les buissons et les arbustes, les arbres fruitiers et les pieds de vigne sur le terrain en question. La taille de ce terrain attenant peut fortement varier selon le cas. En font également partie, en ville, les petites places situées devant les bâtiments d'habitation, ainsi que les parcs de villas et de châteaux privés.\
		<br><br><b>Aires de bâtiments publics</b><br>\
		Les aires de bâtiments publics regroupent principalement les bâtiments publics qui ne sont pas habités, ainsi que leurs terrains attenants, à l'extérieur des surfaces d'infrastructure spéciale et des espaces verts et lieux de détente. Il s'agit des bâtiments administratifs, des établissements scolaires, des jardins d'enfants, des églises et temples, des hôpitaux, des homes, des établissements pénitentiaires, des prisons et des casernes, etc. Le terrain attenant correspond à l'aire appartenant au bâtiment en question, soit en règle générale la parcelle sur laquelle il se situe. Il englobe les pelouses, les jardins ornementaux, les places devant les bâtiments, les cours intérieures, les couverts à voitures, les chemins et les accès, ainsi que les boisements, les buissons et les arbustes, les arbres fruitiers et les pieds de vigne sur le terrain en question.\
		<br><br><b>Aires de bâtiments agricoles</b><br>\
		Les aires de bâtiments agricoles comprennent les bâtiments agricoles (fermes, habitations, bâtiments d'exploitation, étables et cabanes dans les champs et sur les alpages, granges, remises ou hangars) et les terrains qui leur sont attenants En font partie les surfaces qui peuvent être attribuées à un bâtiment agricole: entrées et voies d'accès, places compactées devant les bâtiments, jardins paysans, basses-cours, silos à fourrage et fosses à purin.\
		<br><br><b>Aires de bâtiments non déterminés</b><br>\
		Les aires de bâtiments non déterminés regroupent les bâtiments à usage mixte, à usage inconnu, et les bâtiments qui peuvent être attribués au secteur tertiaire, tels que les immeubles de bureaux, les banques, les restaurants, les hôtels, les magasins ou grands magasins. Le terrain attenant correspond à l'aire appartenant au bâtiment en question, soit en règle générale la parcelle sur laquelle il se situe. Il englobe les pelouses, les jardins, les places devant les bâtiments, les cours intérieures, les couverts à voitures, les chemins et les voies d’accès, ainsi que les boisements, les buissons et les arbustes, les arbres fruitiers et les pieds de vigne sur le terrain en question.\
		<br><br> Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"\
		</p>",
		pcat3 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Les Surfaces de transport regroupent plusieurs types de sous-catégories:\
		<br><br><b>Aires routières</b><br>\
		Les aires routières se composent des surfaces utilisées par le trafic routier roulant ou à l’arrêt. Ce sont notamment les autoroutes et les bordures d’autoroutes, les parcs de stationnement de plus de 20 places, les routes et chemins et les bordures des routes. Les aires routières comptent encore les routes et les chemins de la 1ère à la 5e classe selon les signes conventionnels des cartes nationales, que ces routes et chemins se trouvent à l’intérieur ou à l’extérieur des localités. Les routes forestières de moins de 6 m de large (4e et 5e classe sur la carte nationale) de même que les voies d’accès sans issue et les parcs de stationnement situés sur des terrains attenants aux bâtiments ou aux industries n’en font pas partie. Quant aux bordures de routes, ce sont essentiellement les talus ou autres espaces qui ont été aménagés lors de la construction des routes et qui ne sont pas utilisés à des fins agricoles, notamment les îlots au milieu de la chaussée, les talus et bandes herbeuses entre des jonctions et les espaces en bordure de forêt.\
		<br><br><b>Aires ferroviaires</b><br>\
		Les aires ferroviaires proprement dites, ainsi que les bordures de voies ferrées constituent les Aires ferroviaires. En font partie les voies ferrées, les quais couverts et les aires de transbordement de marchandises, les rails et le ballast des chemins de fer à voie normale ou à voie étroite, des chemins de fer à crémaillère et des funiculaires, les gares et les places devant ces dernières. Les tronçons ferroviaires en forêt sont également compris, à la différence des voies industrielles sur les aires industrielles. La catégorie des bordures de voies ferrées englobe les surfaces restantes ou talus sans utilisation agricole, ou bandes herbeuses entre les voies et la forêt.\
		<br><br><b>Aérodromes</b><br>\
		Cette catégorie regroupe les aérodromes civils, les aérodromes militaires et les pistes gazonnées. Outre les pistes de décollage et d’atterrissage, elle comprend les voies de roulement et les surfaces herbeuses qui ne sont pas utilisées à des fins agricoles.\
		<br><br> Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"\
		</p>",
		pcat4 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Les surfaces d’infrastructure spéciale se composent des terrains et bâtiments des installations d’approvisionnement et d’élimination, des sites d’extraction de minéraux et des décharges, des chantiers et des ruines. Les installations d’approvisionnement et d’élimination regroupent les digues des barrages, les bassins de compensation artificiels, les conduites forcées, les cuves isolées, les stations de distribution d’électricité, les installations de télécommunication ainsi que les installations d’adduction d’eau, les stations d’épuration des eaux usées, les usines d’incinération des ordures et les aires de compostage. Les sites d’extraction de matériaux et les décharges réunissent les carrières de pierres, les gravières, les tourbières en exploitation, les dépôts d’ordures ménagères, de déchets spéciaux et de décombres. En ce qui concerne les chantiers, nous avons relevé les surfaces occupées par les travaux de génie civil et les constructions diverses au moment de la prise de vue. Il peut s’agir de grandes surfaces (routes nationales, tunnels, terrains de golf).<br><br>Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"\</p>",
		pcat5 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Les espaces verts et lieux de détente comprennent les installations sportives de plein air, y compris les terrains de camping, les terrains de golf, les jardins familiaux, les cimetières et les parcs publics, ainsi que les bâtiments associés à ces infrastructures. La notion d’aménagement et d’équipement est ici essentielle. Ainsi, les zones de délassement à forte fréquentation ou les pistes de ski (qui sont le plus souvent aussi utilisées à des fins agricoles) n’en font pas partie. Par installations sportives de plein air, on entend notamment les stades, les terrains d’athlétisme, les terrains de football, les courts de tennis, les terrains d’équitation, les établissements de bain et les plages publiques ainsi que les terrains de sport des écoles, exception faite des halles de gymnastique. Parmi les parcs publics, on compte également les jardins botaniques et les jardins zoologiques, les promenades au bord de l’eau, les jetées, les remparts aménagés pour la promenade, les places de jeux pour enfants et les espaces aménagés en parc aux abords des établissements scolaires et universitaires. Les parcs privés de villas, d’hôtels et de châteaux non accessibles au public sont exclus.<br><br> Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"\</p>",
		pcat6 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Cette catégorie contient les éléments suivants:\
		<br><br><b>Arboriculture fruitière</b><br>\
		Ce mode d’utilisation comprend les surfaces de production agricole consacrées principalement à l’arboriculture fruitière. Ces surfaces regroupent les plantations d’arbres fruitiers (cultures de basses tiges) et les arbres fruitiers sur prairies et champs (plantations continues ou dispersées de hautes tiges). Dans le cas des premières, c’était la surface clôturée qui était déterminante, tandis que dans le cas des secondes, nous avons considéré toute surface délimitée par au moins trois arbres fruitiers distants de moins de 25 m. Les arbres fruitiers plantés sur des terrains attenants à des bâtiments ont en revanche été classés dans la catégorie d’habitation et d’infrastructure correspondante. Les surfaces consacrées à l’arboriculture fruitière se situent le plus souvent à la périphérie des zones d’habitation ou à proximité de domaines agricoles.\
		<br><br><b>Viticulture</b><br>\
		La viticulture englobe toutes les surfaces exclusivement consacrées à la viticulture, à savoir les plantations de vignes proprement dites et les rares vignes en pergola, que l’on rencontre seulement au Sud des Alpes (Tessin, Mesocco). Ces surfaces occupent le plus souvent des terrains exposés au sud ou au sud-est, dont la déclivité peut varier entre 10 à 35%.\
		<br><br><b>Horticulture</b><br>\
		Sont réunies dans cette catégorie toutes les surfaces consacrées à la production horticole à des fins lucratives, notamment les cultures maraîchères, les cultures de plants de légumes, de fleurs coupées, de plantes vivaces et de plantes en pots, qu’elles soient en plein air, sous des serres ou sous des tunnels de plastique. En font également partie les cultures de petits fruits, les pépinières d’arbres et de vignes, les pépinières sylvicoles situées en dehors de la forêt et les exploitations paysagères. Ne sont par contre pas comprises les pépinières en forêt, les jardins de particuliers et les jardins familiaux, ni les cultures de fruits de plein champ.\
		<br><br> Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"\
		</p>",
		pcat8 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Les prairies naturelles sont des surfaces situées dans la zone d'habitat permanent, couvertes en permanence de plantes herbacées et fauchées au moins une fois par an pour la production fourragère, où l'assolement n'est pas pratiqué.<br>\
		Sont considérés comme pâturages locaux les pâturages de la zone d’habitat permanent où les paysans font paître leur propre bétail. Il s’agit souvent de bouts de prés ou de terres arables difficilement exploitables, en particulier parce qu’ils sont trop pentus. Ils sont utilisés pour les bovins, mais aussi pour les chevaux, moutons, les chèvres et les daims. Parmi les pâturages locaux, on trouve également une petite proportion de prés et pâturages embroussaillés ayant l’aspect de terres en friche (prés et pâturages embroussaillés: degré d’embroussaillement compris entre 50 et 80%). Ne sont par contre pas compris les pâturages parsemés d’arbres fruitiers, de bosquets ou de groupes d’arbres. Pour délimiter les pâturages locaux des alpages pâturés, nous avons consulté les cadastres de la production agricole et de l’économie alpestre de l’Office fédéral de l’agriculture. Selon la région et la saison, leurs caractéristiques ressortent plus ou moins bien selon l’époque de l’année à laquelle la photographie aérienne a été prise, selon l’état de la végétation, la configuration du terrain, la topographie et la nature du sol. Il semblerait par conséquent que les pâturages locaux occupent en réalité une superficie supérieure à celle qui ressort de la présente statistique.\
		<br><br> Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"\
		</p>",
		pcat10 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Ce type d'occupation du sol recouvre deux sous-catégories:\
		<br><br><b>Forêts denses</b><br>\
		Les espaces de 25 m de large au minimum, densément boisés, dont le degré de couvert est supérieur à 60% et dont la hauteur dominante des tiges atteint au moins 3 m constituent la forêt dense. En font également partie les routes forestières et les cours d’eau de moins de 6 m de large ainsi que les surfaces temporairement non boisées à la suite de coupes, d’incendies, de tempêtes et de rajeunissement, à condition que les environs immédiats remplissent les conditions minimales de la forêt (largeur, degré de couvert et hauteur).\
		<br><br><b>Forêts clairsemées</b><br>\
		Ce mode d’utilisation comporte les espaces boisés de 50 m de large au minimum, dont le degré de couvert se situe entre 20 et 60% et dont la hauteur dominante des tiges atteint au moins 3 m, peu importe qu’ils soient utilisés ou non à des fins agricoles En font également partie les routes forestières de la 4e et 5e classe et les cours d’eau de moins de 6 m de large ainsi que les surfaces temporairement non boisées (aires afforestées, coupes de bois, surfaces forestières dévastées) si les environs immédiats sont classés dans la catégorie forêt.\
		<br><br> Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"\
		</p>",
		pcat12 : "<b><h4>" + tableau_categories[currentId] + "</h4></b><p id=descr>Les autres surfaces boisées regroupent tous les peuplements d’arbres situés sur des surfaces agricoles ou des surfaces improductives qui ne remplissent pas les conditions minimales pour être classés dans l’un des types de forêt précédents. Ils atteignent 3 m de hauteur, mais ont une largeur de moins de 25 m, ou de 25 à 50 m (avec un degré de couvert compris entre 20 et 60%), ou encore de plus de 50 m (avec un degré de couvert inférieur à 20%). Selon la région, c’est l’une ou l’autre des catégories qui domine: les haies et les extrémités de forêt sur le Plateau, les groupes d’arbres ou les peuplements très clairsemés dans les Alpes.<br><br> Les descriptions proviennent du document \"2015 OFS Description de données GEOSTAT - Statistique de la superficie NOAS04.\"\</p>",
		};
	
	// Clear the geojson layer.
	if(geojson != undefined){
		mymap.removeLayer(geojson);
	}
	
	// Clear the legend.
	mymap.removeControl(legend);
	
	// Clear the info.
	mymap.removeControl(info);
	
	// Create an empty dictionnary for classyBrew.
	let values = [];
	
  // Ask for the GeoJSON of the cantons, using jQuery's getJson function
  // Careful: there is a function getJSON in jQuery, and geoJson in Leaflet;
  //          note the difference get/geo. jQuery's function is not specific
  //          to geo, it is for all JSON files.
  $.getJSON('/data/shapes/4326', function(d){

	// ClassyBrew function statement... 
	// Adapted from Tannerjt github: http://tannerjt.github.io/classybrew-www/examples/basic/
	
	// Loop, gets data from geojson properties...
	for (let i = 0; i < d.features.length; i++){
		if (d.features[i].properties[currentId] === null) continue;
		{
			values.push(d.features[i].properties[currentId]);
		}
	}
	
	let totValues = [];
	let tot = 0;
	
	// Loop, gets data from geojson properties: total values for the RadarChart and prepare the values.
	for (let k = 1; k < 18; k++){
		for (let i = 0; i < d.features.length; i++){
			if (d.features[i].properties["cat"+k] === null) continue;
			{
				tot += d.features[i].properties["cat"+k];
			}
		}
		totValues.push(tot);
		tot = 0;
	}
	
	let totPoints = 0;
	
	for (let i = 0; i < totValues.length; i++){
		totPoints += totValues[i];
	}
	
	for (let i = 0; i < totValues.length; i++){
		totValues[i] /= totPoints;
	}
	
	for (let i = 0; i < totValues.length; i++){
		totValues[i] *= 100;
	}
	
	let scatterData = [];
	
	// Loop, gets data from geojson properties: values for the Scatter Plot and prepare the values.
	for (let i = 0; i < d.features.length; i++){
		if (d.features[i].properties[currentId] === null) continue;
		{
			scatterData.push([Math.round(d.features[i].properties[currentId]), Math.round(d.features[i].properties["dens_pop"])]);
		}
	}
	
	// Pass array to our classybrew series.
	brew.setSeries(values);

	// Define number of classes.
	brew.setNumClasses(5);
	
	// Set color ramp code.
	brew.setColorCode(tableau_couleurs[clickedId]);

	// Classify by passing in statistical method
	// i.e. equal_interval, jenks, quantile.
	brew.classify(currentClassification);

	// Legend function...
	legend.onAdd = function (mymap) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = brew.getBreaks(),
			labels = ['<strong><font size="2">' + tableau_categories[clickedId] + '</font></strong><br>Classification: ' + tableau_classifications[currentClassification]+'<br>'];

		// Loop through our intervals and generate a label with a colored square for each interval.
		for (var i = 0; i < grades.length; i++) {
			fromG = grades[i];
			to = grades[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					fromG.toFixed(1) + '% &ndash; ' + to.toFixed(1) + '%');
			}
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	// Style function to return.
	// Fill color based on brew.getColorInRange() method.
	function styleFn(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: brew.getColorInRange(feature.properties[currentId])
		}
	}
	
	// Create a div on the map, to display info.
	info.onAdd = function (mymap) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};
	
	// Info to display in the div just created above.
	info.update = function (props) {
		this._div.innerHTML = (props ?
        '<b><font size="3">' + props.nom + '</font></b><br />' + (Math.round(props.dens_pop*100)/100) + ' hab / ha'
        : 'Survoler les secteurs');		
	};
	
	
	// Add geoJson layer to the map and assign to a variable.
	geojson = L.geoJson(d, {style: styleFn, onEachFeature: onEachFeature}).addTo(mymap);
	
	// Add legend layer to the map.
	legend.addTo(mymap);
	
	// Add info layer to the map.
	info.addTo(mymap);
	
	// Highlight feature when mouse is over.
	function highlightFeature(e) {
		let layer = e.target;

		layer.setStyle({
			weight: 3,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
		info.update(layer.feature.properties);
	}

	// Unhighlight feature when mouse is not over.
	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	// Function that will create the RadarChart when the user clicks on a feature of the map.
	function createRadarChart(e) {
		
		document.getElementById("texteRadar").innerHTML = "";

		// Create an empty list that will be filled with the corresponding feature's values.
		let chart_values = []
		
		// Loop, fills the list with corresponding values.
		for (let i = 0; i < categories.length; i++){
			chart_values.push(Math.round(e.target.feature.properties[categories[i]] * 100) / 100);
		}
		
		// Highcharts' Radar Chart functions...
		Highcharts.chart('containerRadar', {

        chart: {
            polar: true,
            type: 'line'
        },

        title: {
            text: '<b>'+e.target.feature.properties["nom"]+' vs Lausanne</b><br>% couverture du sol',
            x: -80
        },

        pane: {
            size: '80%'
        },

        xAxis: {
            categories: ['Aires indust. et artis.', 'Aires de bâtiments', 'Surfaces de transport', 'Surfaces d\'infrastructure spéciale',
                    'Espaces verts et lieux de détente', 'Arboriculture fruitière, viticulture, horticulture', 'Prairies naturelles, pâturages locaux',
					 'Forêt (sans forêt buissonnante)', 'Autres surfaces boisées'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}%</b><br/>'
        },

        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
        },

        series: [{
            name: 'Lausanne',
            data: [totValues[0], totValues[1], totValues[2], totValues[3], totValues[4], totValues[5], totValues[7], totValues[9], totValues[11]],
            pointPlacement: 'on'
        }, {
            name: e.target.feature.properties["nom"],
            data: [chart_values[0], chart_values[1], chart_values[2], chart_values[3], chart_values[4], chart_values[5], chart_values[7], chart_values[9], chart_values[11]],
            pointPlacement: 'on'
        }]

    });
		}
	
	// Highcharts' Scatter Plot functions...
	$(function () {
    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: tableau_categories[currentId] + " versus densité de population"
        },
        subtitle: {
            text: 'Source: Données GEOSTAT, OFS 2015'
        },
        xAxis: {
            title: {
                enabled: true,
                text: "% d'occupation sol"
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: "Densité de population (hab / ha)"
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x}%, {point.y} hab/ha'
                }
            }
        },
        series: [{
			name: tableau_categories[currentId],
            data: scatterData
        }]
    });
});
	
	// Adds functions if event is fired.
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: createRadarChart,
		});
	}
	
	// Adds descriptions to the description div of the page.
	document.getElementById("descr").innerHTML = infosCategories[currentId];
	
		});
	}

// function that allows to choose a classification method.
function SelectClassification(clickedClassification){
	currentClassification = clickedClassification;
	SelectId(currentId);
}

// Function that allows to create an event. To simulate a click.
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

// Timer that simulate a click on the button menu 1 second after page load.
(function () {
  eventFire(document.getElementById('button-menu'), 'click');
}, 1000);

// Call main function.
$(main);