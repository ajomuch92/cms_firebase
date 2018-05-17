'use strict';
var config = {
	          apiKey: api_Key,
	          authDomain: auth_Domain,
	          databaseURL: database_URL,
	          projectId: project_Id,
	          storageBucket: storage_Bucket,
	          messagingSenderId: messaging_SenderId
	        };
	     firebase.initializeApp(config);
function cerrarSesion(){
	firebase.auth().signOut().then(function() {
	  localStorage.removeItem("valido");
	  localStorage.clear();
	  location.href="../login";
	}).catch(function(error) {
	  
	});
}
var inicio=angular.module("admin",["ngRoute","firebase"]);

inicio.config(function($routeProvider){
	$routeProvider
		.when('/',{
                templateUrl:'admin.html'})
		.when('/menus',{
                templateUrl:'menus.html',
                controller:'menusController'})
		.when('/categorias',{
                templateUrl:'categorias.html',
                controller:'categoriasController'})
		.when('/articulos',{
                templateUrl:'articulos.html',
                controller:'articulosController'})
		.when('/info',{
                templateUrl:'info.html',
                controller:'infoController'})
		.when('/config',{
                templateUrl:'config.html',
                controller:'configController'})
		.when('/galerias',{
                templateUrl:'galerias.html',
                controller:'galeriasController'})
		.otherwise({
        template : "<h1>La página solicitada no existe</h1>"});
	
});

inicio.controller('adminController',['$scope','$http','$firebaseObject',function($scope,$http,$firebaseObject){
	var ref = firebase.database().ref().child("/configuracion");
  var syncObject = $firebaseObject(ref);
  syncObject.$bindTo($scope, "configuracion");
}]);

inicio.controller('menusController',['$scope','$http','$firebaseObject','$firebaseArray',function($scope,$http,$firebaseObject,$firebaseArray){
	var ref=firebase.database().ref().child("/menus");
	var est=firebase.database().ref().child("/estados");
	$scope.menus=$firebaseObject(ref);
	$scope.estados=$firebaseObject(est);
	$scope.guardarNuevo=function(){
		var d=new Date();
		 var nuevaClave = firebase.database().ref().child('/menus').push().key;
		 var nuevoRegistro={
		 	Nombre:$scope.nombreNuevoMenu,
		 	Estado:$scope.estadoNuevoMenu,
		 	Fecha:d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear()
		 };
		 if(firebase.database().ref().child('/menus/'+nuevaClave).set(nuevoRegistro)){
		 	$('#nuevoMenu').modal('hide');
		 }
	}
	$scope.abrirModalEditar=function(clave,valor){
		$scope.claveMenuEditar=clave;
		$scope.valorMenudEditar=valor
	};
	$scope.guardarCambios=function(){
		var registro=firebase.database().ref().child("/menus/"+$scope.claveMenuEditar);
		if(registro.update($scope.valorMenudEditar)){
			$('#editarMenu').modal('hide');
		}
	};
	$scope.eliminarMenu=function(id){
		if(firebase.database().ref().child('/menus/'+id).remove()){
			$('#alerta').fadeIn();
			setTimeout("$('#alerta').fadeOut()",2000)
		}
	}
}]);

inicio.controller('categoriasController',['$scope','$http','$firebaseObject','$firebaseArray',function($scope,$http,$firebaseObject,$firebaseArray){
	var ref=firebase.database().ref().child("/categorias");
	var est=firebase.database().ref().child("/estados");
	$scope.categorias=$firebaseObject(ref);
	$scope.estados=$firebaseObject(est);
	$scope.guardarNuevo=function(){
		var d=new Date();
		 var nuevaClave = firebase.database().ref().child('/categorias').push().key;
		 var nuevoRegistro={
		 	Nombre:$scope.nombreNuevaCategoria,
		 	Estado:$scope.estadoNuevaCategoria,
		 	Fecha:d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear()
		 };
		 if(firebase.database().ref().child('/categorias/'+nuevaClave).set(nuevoRegistro)){
		 	$('#nuevaCategoria').modal('hide');
		 }
	}
	$scope.abrirModalEditar=function(clave,valor){
		$scope.claveCategoriaEditar=clave;
		$scope.valorCategoriaEditar=valor
	};
	$scope.guardarCambios=function(){
		var registro=firebase.database().ref().child("/categorias/"+$scope.claveCategoriaEditar);
		if(registro.update($scope.valorCategoriaEditar)){
			$('#editarCategoria').modal('hide');
		}
	};
	$scope.eliminarCategoria=function(id){
		if(firebase.database().ref().child('/categorias/'+id).remove()){
			$('#alerta').fadeIn();
			setTimeout("$('#alerta').fadeOut()",2000)
		}
	}
}]);

inicio.controller('articulosController',['$scope','$http','$firebaseObject','$firebaseArray',function($scope,$http,$firebaseObject,$firebaseArray){
	var ref=firebase.database().ref().child("/articulos");
	var est=firebase.database().ref().child("/estados");
	var men=firebase.database().ref().child("/menus").orderByChild("Estado") .equalTo("Publicado");
	var cat=firebase.database().ref().child("/categorias").orderByChild("Estado") .equalTo("Publicado");
	var conf=firebase.database().ref().child("/configuracion/autor");
	conf.on('value', function(snapshot) {
		$scope.autorNuevoArticulo=snapshot.val();
	});
	$scope.articulos=$firebaseObject(ref);
	$scope.estados=$firebaseObject(est);
	$scope.menus=$firebaseObject(men);
	$scope.categorias=$firebaseObject(cat);
	$scope.leerMas=false;
	$scope.tituloNuevoArticulo=null;
	$scope.estadoNuevoArticulo=null;
	$scope.categoriaNuevoArticulo=null;
	$scope.menuNuevoArticulo=null;
	$scope.fechaInicioNuevoArticulo=null;
	$scope.fechaFinNuevoArticulo=null;
	$scope.guardarNuevo=function(){
		 var nuevaClave = firebase.database().ref().child('/articulos').push().key;
		 var d=new Date();
		 var nuevoRegistro={
		 	Titulo:$scope.tituloNuevoArticulo,
		 	Cuerpo:tinyMCE.get('cuerpoArticulo').getContent(),
		 	LeerMas:$scope.leerMas,
		 	Autor: $scope.autorNuevoArticulo,
		 	Estado:$scope.estadoNuevoArticulo,
		 	Categoria:$scope.categoriaNuevoArticulo,
		 	Menu:$scope.menuNuevoArticulo,
		 	FechaInicio:$scope.fechaInicioNuevoArticulo!=null ? $scope.fechaInicioNuevoArticulo.toString() : null,
		 	FechaFin:$scope.fechaFinNuevoArticulo!=null ? $scope.fechaFinNuevoArticulo.toString() : null,
		 	Fecha:d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear()
		 };
		 if(firebase.database().ref().child('/articulos/'+nuevaClave).set(nuevoRegistro)){
		 	$('#nuevoArticulo').modal('hide');
		 }
	}
	$scope.abrirModalEditar=function(clave,valor){
		valor.FechaInicio=new Date(valor.FechaInicio);
		valor.FechaFin=new Date(valor.FechaFin);
		$scope.claveArticuloEditar=clave;
		$scope.valorArticuloEditar=valor;
		tinymce.get('cuerpoArticuloEditado').setContent(valor.Cuerpo);
	};
	$scope.guardarCambios=function(){
		var registro=firebase.database().ref().child("/articulos/"+$scope.claveArticuloEditar);
		$scope.valorArticuloEditar.Cuerpo=tinymce.get('cuerpoArticuloEditado').getContent();
		$scope.valorArticuloEditar.FechaInicio=$scope.valorArticuloEditar.FechaInicio.toString();
		$scope.valorArticuloEditar.FechaFin=$scope.valorArticuloEditar.FechaFin.toString();
		if(registro.update($scope.valorArticuloEditar)){
			$('#editarArticulo').modal('hide');
		}
	};
	$scope.eliminarArticulo=function(id){
		if(firebase.database().ref().child('/articulos/'+id).remove()){
			$('#alerta').fadeIn();
			setTimeout("$('#alerta').fadeOut()",2000);
		}
	}
}]);

inicio.controller('infoController',['$scope','$http','$firebaseObject',function($scope,$http,$firebaseObject){
	firebase.database().ref().child("/contacto").on("value",function(snapshot){
			if(snapshot.val()==null)
				$scope.habilitar=false;
			else{
				$scope.habilitar=true;
			}
		});
	var ref=firebase.database().ref().child("/contacto");
	$scope.contacto=$firebaseObject(ref);
	$scope.guardarCambios=function(){
		var nuevoRegistro;
		if(!$scope.habilitar){
			nuevoRegistro=null;
		}else{
			nuevoRegistro={
				correo:$scope.contacto.correo,
				telefono:$scope.contacto.telefono,
				fax:$scope.contacto.fax,
				direccion:$scope.contacto.direccion,
				mapa:$scope.contacto.mapa,
				ciudad:$scope.contacto.ciudad,
				estado:$scope.contacto.estado
			}
		}
		if(firebase.database().ref().child('/contacto').set(nuevoRegistro)){
			$scope.msg="Cambios guardados correctamente";
			$('#cambiosGuardados').modal('show');
		}
		else{
			$scope.msg="Error al guardar";
			$('#cambiosGuardados').modal('show');
		};
			
	};
}]);

inicio.controller('configController',['$scope','$firebaseObject','$firebaseStorage',function($scope,$firebaseObject,$firebaseStorage){
	var men=firebase.database().ref().child("/menus").orderByChild("Estado") .equalTo("Publicado");
	$scope.menus=$firebaseObject(men);
	var ref=firebase.database().ref().child("/configuracion/");
	ref.on('value', function(snapshot) {
		var img=snapshot.val().imagen;
		var storageRef=firebase.storage().ref().child(img);
		storageRef.getDownloadURL().then(function(url) {
			document.getElementById("imagen").src=url;
		}).catch(function(error){
			
		})
	});
	$scope.configuracion=$firebaseObject(ref);
	$scope.cambiarImagen=function(element){
		document.getElementById("imagen").src=window.URL.createObjectURL(document.getElementById('imagenPortada').files[0]);
	};
	$scope.guardarCambios=function(){
		var img=document.getElementById('imagenPortada').files[0];
		if(img!=undefined){
		    var storageRef = firebase.storage().ref('images/portada/'+img.name);
		    $scope.storage = $firebaseStorage(storageRef);
		    var ext=(img.name.substring(img.name.lastIndexOf("."))).toLowerCase();
		    $scope.storage.$put(img, { contentType: "imagen/"+ext });
		    $scope.configuracion.imagen='images/portada/' + img.name;
		}
		var nuevoRegistro={
			nombreSitio:$scope.configuracion.nombreSitio,
			descripcion:$scope.configuracion.descripcion,
			autor:$scope.configuracion.autor,
			imagen:$scope.configuracion.imagen,
			fecha:$scope.configuracion.fecha,
			pais:$scope.configuracion.pais,
			mainPage:$scope.configuracion.mainPage
		};
		if(firebase.database().ref().child('/configuracion/').set(nuevoRegistro)){
			$scope.msg="Cambios guardados correctamente";
			$('#cambiosGuardados').modal('show');
			//location.reload(true);
		}
		else{
			$scope.msg="Error al guardar";
			$('#cambiosGuardados').modal('show');
		};
	};
}]);

inicio.controller('galeriasController',['$scope','$http','$firebaseObject',function($scope,$http,$firebaseObject){
	var ref=firebase.database().ref().child("/galerias");
	$scope.galerias=$firebaseObject(ref);
	var est=firebase.database().ref().child("/estados");
	$scope.estados=$firebaseObject(est);
	$scope.nuevo=function(){
		document.getElementById("archivoImagen").value="";
	};
	$scope.guardarImagen=function(){
		var file=document.getElementById('archivoImagen').files[0];
		if(file!=undefined){
		    var d=new Date();
		    var nuevoRegistro={
				Nombre:file.name,
				Tamanio:Math.round(file.size/1024)+' KB',
				Fecha:d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear(),
				Descripcion:$scope.descripcion,
				Direccion:"images/galerias/"+file.name
			};			
			var nuevaClave = firebase.database().ref().child('/galerias').push().key;
			var storageRef = firebase.storage().ref();
		    if(storageRef.child('images/galerias/' + file.name).put(file) && firebase.database().ref().child('/galerias/'+nuevaClave).set(nuevoRegistro)){
		    	$('#nuevaCategoria').modal('hide');
		    }
		}
	};
	$scope.verImagen=function(direccion){
		var storageRef=firebase.storage().ref().child(direccion);
		storageRef.getDownloadURL().then(function(url) {
			document.getElementById("imagen").src=url;
		});
	};
	$scope.eliminarImagen=function(id,direccion){
		var storageRef = firebase.storage().ref();
		if(firebase.database().ref().child('/galerias/'+id).remove() && storageRef.child(direccion).delete()){
			$('#alerta').fadeIn();
			setTimeout("$('#alerta').fadeOut()",2000);
		}
	};
}]);
