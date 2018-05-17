var config = {
          apiKey: api_Key,
          authDomain: auth_Domain,
          databaseURL: database_URL,
          projectId: project_Id,
          storageBucket: storage_Bucket,
          messagingSenderId: messaging_SenderId
        };
        firebase.initializeApp(config);
        function verificar(){
          var datos= firebase.database().ref('/configuracion').once('value').then(function(snapshot) {
            if(snapshot.val()==null){
              location.href="./install"
            }else{
              document.getElementById('cuerpo').style.display = 'block';
              document.title=snapshot.val().nombreSitio;
              var storageRef=firebase.storage().ref().child(snapshot.val().imagen);
              storageRef.getDownloadURL().then(function(url) {
                document.getElementById('parallax').style.backgroundImage="url("+url+")";
              })
              var url=location.href;
              var s=url.split("#!");
              var last=s[s.length-1];
              if(url==last)
              	location.href ="#!menu/"+snapshot.val().mainPage;
            }
          });          
        }
    function cambiar(objeto){
      var partes = objeto.id.split("-");
      var id_articulo=partes[1];
      var id_estrella=partes[2];
      for(var i=1;i<=id_estrella;i++){
        document.getElementById("star-"+id_articulo+"-"+i).className="fa fa-star";
      }
    }
    function reestablecer(objeto){
      var partes = objeto.id.split("-");
      var id_articulo=partes[1];
      for(var i=5;i>=1;i--){
        document.getElementById("star-"+id_articulo+"-"+i).className="fa fa-star-o";
      }
    }

function deshabilitar(index){
	for(var i=1;i<=5;i++){
		document.getElementById("star-"+index+"-"+i).onmouseleave=null;
		document.getElementById("star-"+index+"-"+i).onmousemove=null;
		document.getElementById("star-"+index+"-"+i).onclick=null;
	}
}
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function recorrido(items){
	var resultado=[];
	for(var j in items){
			nR={
				Key:j,
				Autor:items[j].Autor,
				Categoria:items[j].Categoria,
				Cuerpo:items[j].Cuerpo,
				Estado:items[j].Estado,
				Fecha:items[j].Fecha,
				FechaFin:items[j].FechaFin,
				FechaInicio:items[j].FechaInicio,
				LeerMas:items[j].LeerMas,
				Titulo:items[j].Titulo
			}
			resultado.push(nR);
		}
	return resultado;
}

function puntuar(key,index,value){
	var d=new Date();
		fecha={Fecha:d.toString()};
		var registro=firebase.database().ref().child('/articulos/'+key+'/puntuaciones/').once("value",snapshot=>{
			if(snapshot.val()==null){
				valor={Valor:value};
				if(firebase.database().ref().child('/articulos/'+key+'/puntuaciones/').set(valor) && firebase.database().ref().child('/articulos/'+key+'/puntuaciones/fechas').push(fecha)){
					deshabilitar(index);
				}
			}else{
				var u={Valor:snapshot.val().Valor+value};
				if(firebase.database().ref().child('/articulos/'+key+'/puntuaciones/').update(u) && firebase.database().ref().child('/articulos/'+key+'/puntuaciones/fechas').push(fecha)){
					deshabilitar(index);
					$.notify({
						title: '<i class="fa fa-star" aria-hidden="true"></i>',
						message: 'Puntuación enviada'
					},{
						type: 'success'
					});
				}
			}
		});
}

function lectura(key){
		var registro=firebase.database().ref().child('/articulos/'+key+'/puntuaciones/Lectura').once("value",snapshot=>{
			if(snapshot.val()==null){
				valor={Lectura:1};
				firebase.database().ref().child('/articulos/'+key+'/puntuaciones/Lectura').set(valor);
			}else{
				var u={Lectura:snapshot.val().Lectura+1};
				firebase.database().ref().child('/articulos/'+key+'/puntuaciones/Lectura').update(u);
			}
		});
}

var modulo=angular.module("index",["ngRoute","firebase","ngSanitize"]);
modulo.config(function($routeProvider,$locationProvider){
	$routeProvider
		.when('/menu/:id',{
                templateUrl:'templates/body.html',
                controller:'pageController'})
		.when('/misc/:id',{
                templateUrl:'templates/body.html',
                controller:'pageController'})
		.when('/top',{
                templateUrl:'templates/top.html',
                controller:'topController'})
		.when('/masleidos',{
                templateUrl:'templates/toplecturas.html',
                controller:'masleidosController'})
		.when('/categoria/:cat/:id',{
                templateUrl:'templates/categoria.html',
                controller:'categoriaController'})
		.when('/buscar',{
                templateUrl:'templates/buscar.html',
                controller:'buscarController'})
		.when('/Galerías',{
                templateUrl:'templates/galeria.html',
                controller:'galeriaController'})
		.when('/Conócenos',{
                templateUrl:'templates/conocenos.html',
                controller:'conocenosController'})
		.otherwise({
        		template : "<h1>La página solicitada no existe</h1>"});
	$locationProvider.hashPrefix('!');
});

modulo.controller('indexController',['$scope','$http','$firebaseObject',function($scope,$http,$firebaseObject){
	var ref = firebase.database().ref().child("/menus").orderByChild("Estado").equalTo("Publicado");
	$scope.menus=$firebaseObject(ref);
	$scope.configuracion=$firebaseObject(firebase.database().ref().child("/configuracion"));
	$scope.menus_2=[];
	firebase.database().ref().child("/categorias").on("value",snapshot=>{
		$scope.categorias=snapshot.val();
	});
	firebase.database().ref().child("/galerias").on("value",snapshot=>{
		if(snapshot!=null && snapshot!=undefined){
			$scope.menus_2.push("Galerías");
		}
	});
	firebase.database().ref().child("/contacto").on("value",snapshot=>{
		console.log(snapshot.val());
		if(snapshot.val()!=null && snapshot.val()!=undefined){
			$scope.menus_2.push("Conócenos");
		}
	});
}]);



modulo.controller('pageController',['$scope','$routeParams','$firebaseObject',function($scope,$routeParams,$firebaseObject){
	firebase.database().ref().child("/articulos").orderByChild("Menu").equalTo($routeParams.id).on("value",snapshot=>{
		var art=firebase.database().ref().child("/articulos");
		$scope.arts_temp=$firebaseObject(art);
		$scope.articulos=recorrido(snapshot.val());
	});
	$scope.puntuar=function(key,index,value){
		puntuar(key,index,value);
	}
	$scope.leerArticulo=function(art){
		$scope.art=art;
		$('#verArticulo').modal('show');
		lectura(art.Key);
	}
}]);

modulo.controller('topController',['$scope','$routeParams','$firebaseObject',function($scope,$routeParams,$firebaseObject){
	$scope.cantidad=5;
	firebase.database().ref().child("/articulos").orderByChild("Estado").equalTo("Publicado").on("value",snapshot=>{
		var art=firebase.database().ref().child("/articulos");
		$scope.arts_temp=$firebaseObject(art);
		var arr = [];
		for(var j in snapshot.val()){
			var pts=0;
			for(var i in snapshot.val()[j].puntuaciones){
				if(i="Valor"){
					pts=snapshot.val()[j].puntuaciones[i];
					break;
				}
			}
			nR={
				Autor:snapshot.val()[j].Autor,
				Categoria:snapshot.val()[j].Categoria,
				Cuerpo:snapshot.val()[j].Cuerpo,
				Estado:snapshot.val()[j].Estado,
				Fecha:snapshot.val()[j].Fecha,
				FechaFin:snapshot.val()[j].FechaFin,
				FechaInicio:snapshot.val()[j].FechaInicio,
				LeerMas:snapshot.val()[j].LeerMas,
				Titulo:snapshot.val()[j].Titulo,
				Puntos:pts
			}
			arr.push(nR);
		}
		sortByKey(arr,"Puntos");
		$scope.articles=arr;
	});
	$scope.leerArticulo=function(art){
		$scope.art=art;
		$('#verArticulo').modal('show');
		lectura(art.Key);
	}
}]);

modulo.controller('masleidosController',['$scope','$routeParams','$firebaseObject',function($scope,$routeParams,$firebaseObject){
	$scope.cantidad=5;
	firebase.database().ref().child("/articulos").orderByChild("Estado").equalTo("Publicado").on("value",snapshot=>{
		var art=firebase.database().ref().child("/articulos");
		$scope.arts_temp=$firebaseObject(art);
		var arr = [];
		for(var j in snapshot.val()){
			var pts=0;
			for(var i in snapshot.val()[j].puntuaciones){
				if(i="Lectura"){
					for(var k in snapshot.val()[j].puntuaciones[i])
					{
						pts=snapshot.val()[j].puntuaciones[i][k];
						break;
					}
				}
			}
			nR={
				Autor:snapshot.val()[j].Autor,
				Categoria:snapshot.val()[j].Categoria,
				Cuerpo:snapshot.val()[j].Cuerpo,
				Estado:snapshot.val()[j].Estado,
				Fecha:snapshot.val()[j].Fecha,
				FechaFin:snapshot.val()[j].FechaFin,
				FechaInicio:snapshot.val()[j].FechaInicio,
				LeerMas:snapshot.val()[j].LeerMas,
				Titulo:snapshot.val()[j].Titulo,
				Puntos:pts
			}
			arr.push(nR);
		}
		sortByKey(arr,"Puntos");
		$scope.articles=arr;
	});
	$scope.leerArticulo=function(art){
		$scope.art=art;
		$('#verArticulo').modal('show');
		lectura(art.Key);
	}
}]);

modulo.controller('categoriaController',['$scope','$routeParams','$firebaseObject',function($scope,$routeParams,$firebaseObject){
	$scope.categoriaReferenciada=$routeParams.cat;
	firebase.database().ref().child("/articulos").orderByChild("Categoria").equalTo($routeParams.id).on("value",snapshot=>{
		var art=firebase.database().ref().child("/articulos");
		$scope.arts_temp=$firebaseObject(art);
		$scope.articulos=recorrido(snapshot.val());
	});
	$scope.puntuar=function(key,index,value){
		puntuar(key,index,value);
	}
	$scope.leerArticulo=function(art){
		$scope.art=art;
		$('#verArticulo').modal('show');
		lectura(art.Key);
	}
}]);

modulo.controller('buscarController',['$scope','$firebaseObject',function($scope,$firebaseObject){
	firebase.database().ref().child("/articulos").on("value",snapshot=>{
		var art=firebase.database().ref().child("/articulos");
		$scope.arts_temp=$firebaseObject(art);
		$scope.articulos=recorrido(snapshot.val());
	});
	$scope.puntuar=function(key,index,value){
		puntuar(key,index,value);
	};
	$scope.leerArticulo=function(art){
		$scope.art=art;
		$('#verArticulo').modal('show');
		lectura(art.Key);
	}
}]);

modulo.controller('galeriaController',['$scope','$firebaseObject',function($scope,$firebaseObject){
	var i=1;
	firebase.database().ref().child("/galerias").on("value",snapshot=>{
		for(var k in snapshot.val()){
			var storageRef=firebase.storage().ref().child(snapshot.val()[k].Direccion);
            storageRef.getDownloadURL().then(function(url) {
            	var activa="";
            	if(i==1)
            		activa="active"
            	else
            		activa="";
            	var img='<div class="carousel-item '+activa+'"><img class="img-thumbnail" src="'+url+'" alt="Slide '+i+'"></div>';
            	$("#carrusel").append(img);
            	i++;
            });
		}
	});
}]);


modulo.controller('conocenosController',['$scope','$firebaseObject',function($scope,$firebaseObject){
	firebase.database().ref().child("/contacto").on("value",snapshot=>{
		$scope.contacto=snapshot.val();
		document.getElementById("mapa").innerHTML=snapshot.val().mapa;
	});
}]);