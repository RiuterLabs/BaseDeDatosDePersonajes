class CreadorDePersonajes{
    constructor(puntosInicio){
        this.datos=[];
        this.name="";
        this.selected=[];
        this.desplegadas=[];
        this.puntos=puntosInicio;
        this.cargarArchivo();
        this.initData();
        
    }

    crearBotones() {
        var data = this.datos;
        var seccionBotones = $("#seccionesBotones");
        seccionBotones.innerHTML = "";
        var title = document.createElement("h3");
        title.textContent = "Botones";

        for (var i = 0; i<data.length; i++){
            var element = data[i];
            var seccionBoton = document.createElement("div");
            seccionBoton.id = element["nombreCat"]
            var boton = this.crearBoton(element);
            
            seccionBoton.append(boton);
            seccionBotones.append(seccionBoton);
            this.crearTarjetas2(element);
        }
       
    }

    crearBoton(infoBoton){
        var boton = document.createElement("button");
        boton.textContent = infoBoton["nombreCat"];
        boton.addEventListener("click",this.desplegar.bind(this,infoBoton.nombreCat));
        return boton;
    }

    desplegar(categoria){
        if(this.desplegadas.includes(categoria)){
            this.desplegadas = this.desplegadas.filter((element)=>element!=categoria);
        }else{
            this.desplegadas.push(categoria);
        }
        this.guardarEnBaseDeDatos();
        this.updateVista();
    }


    crearTarjetas2(info){
        var seccionBotones = $("#"+info["nombreCat"]);
        var seccionTarjetas = document.getElementById("seccionTarjetas"+info["nombreCat"]);
        
        if(seccionTarjetas==undefined || seccionTarjetas==null){
            seccionTarjetas = document.createElement("div");
            seccionTarjetas.id="seccionTarjetas"+info["nombreCat"];
            seccionBotones.append(seccionTarjetas);
        }else{
            seccionTarjetas.innerHTML ="";
        }
        var tarjetas = info["tarjetas"];
        for(var i =0; i<tarjetas.length; i++){
            var infoTar = tarjetas[i];
            var tarjeta = this.crearTarjeta(infoTar);
            seccionTarjetas.append(tarjeta);
        }
        
        this.updateVista();
    }


    crearTarjeta(info){
        var tarjeta = document.createElement("section");
        tarjeta.id = info["id"]
        var h4 = document.createElement("h4");
        h4.textContent = info["titulo"];
        var puntos = document.createElement("p");
        puntos.textContent = info["coste"];
        var img = document.createElement("img");
        $(img).attr("src","../multimedia/imagenes/creador/"+info["id"]+".jpg");
        $(img).attr("alt",info["desc"]);
        var desc = document.createElement("p");
        desc.textContent = info["desc"];

        tarjeta.addEventListener("click",this.addTf.bind(this,info));

        tarjeta.append(h4);
        tarjeta.append(puntos);
        tarjeta.append(img);
        tarjeta.append(desc);
        return tarjeta;
    }

    addTf(info){
        var id = info["id"];
        var coste = info["coste"];

        if(this.selected.includes(id)){
            this.puntos+=coste;
                this.selected = this.selected.filter((valor)=>valor!==id);
        }else{
            if(coste<=this.puntos){
                
                    this.puntos-=coste;
                    this.selected.push(id);
                  
            }
    
        }
       
        this.updateVista();
        this.guardarEnBaseDeDatos();

    }

    updateVista(){
        this.updateNombre();
        this.updatePuntos();
        this.updateDesplegadas();
        this.updateSeccionesDesbloqueadas();
        this.updateTarjetas();
        this.updateYaLasTienes();
        
    }

    updateNombre(){
        var nombreTexto = $("#textoNombre");
        if(this.name==undefined || this.name==null)
            this.name = "";
        nombreTexto.val(this.name);
    }

    updateSeccionesDesbloqueadas(){
        var data = this.datos;
        for(var i =0; i<data.length; i++){
            var categoria = data[i];
            var boton = $("#"+categoria.nombreCat);
            var seccion = $("#seccionTarjetas"+categoria.nombreCat);
          
            if(!this.checkRequisitosCategorias(categoria)){
                boton.addClass("sinDesplegar");
                seccion.addClass("sinDesplegar");
            }else{
                boton.removeClass("sinDesplegar");
                if(this.desplegadas.includes(categoria.nombreCat))
                    seccion.removeClass("sinDesplegar");
            }
          
          }
    }

    checkRequisitosCategorias(categoria){
        var requisitos = categoria.requisitos;
        if(requisitos == null || requisitos ==undefined)
            return true;

        for(var i =0; i<requisitos.length; i++){
            var requisito = requisitos[i];
            if(!this.evaluarCondiciones(requisito))
                return false;
        }
        return true;
    }

    updateDesplegadas(){
        for(var i =0; i<this.datos.length; i++){
            var categoria = this.datos[i].nombreCat;
            if(this.desplegadas.includes(categoria)){
                var seccionTarjetas = $("#seccionTarjetas"+categoria);
                seccionTarjetas.removeClass("sinDesplegar");
            }else{
                var seccionTarjetas = $("#seccionTarjetas"+categoria);
                seccionTarjetas.addClass("sinDesplegar");
            }
                

        }
    }

    updatePuntos(){
        $("#puntosActuales").html(this.puntos);
    }

    updateTarjetas(){
        for(var i =0; i<this.datos.length; i++ ){
            var cat = this.datos[i];
            var valores = cat["tarjetas"];
            for(var j=0; j<valores.length; j++)
            {
                var valor = valores[j];
                var tarjeta = $("#"+valor["id"]);
                if(valor["coste"]>this.puntos && !this.selected.includes(valor["id"])){
                    tarjeta.addClass("demasiadoCara");
                    
                }else{
                    tarjeta.removeClass("demasiadoCara")
                }
                if(!this.selected.includes(valor["id"])){
                    tarjeta.removeClass("yaLaTienes");
                }
                var requisitos = valor["requisitos"];
                if(!this.checkRequisitos(requisitos)){
                    tarjeta.addClass("noTienesLaPrevia");
                }else{
                    tarjeta.removeClass("noTienesLaPrevia");
                }
            }
           
        }
    }

    checkRequisitos(requisitos){
        if(requisitos == null || requisitos ==undefined)
            return true;

        for(var i =0; i<requisitos.length; i++){
            var requisito = requisitos[i];
            if(!this.selected.includes(requisito))
                return false;
        }
        return true;
    }

    updateYaLasTienes(){
        for(var i =0; i<this.selected.length; i++ ){
            var valor = this.selected[i];
            var tarjeta = $("#"+valor);
            tarjeta.addClass("yaLaTienes");
        }
    }


    cargarArchivo(){
        fetch("archivos/datos.json")
            .then((response)=>response.json())
            .then((archivo)=>{
                this.datos=archivo;
                this.crearBotones();
                this.updateVista();
            })
    }


    guardarEnBaseDeDatos(){
        this.fetch();
    }

    fetch(){
        var request = window.indexedDB.open("Personaje",2);

        request.onerror = function(){
            console.error("Error", request.error);
        }

        request.onsuccess = function(event){
            var db = event.target.result;
           
            var transaction = db.transaction(["personaje"],"readwrite");

            var partes = transaction.objectStore("personaje");
            var cosasAGuardar = this.toJSON();
            var request2 = partes.add(cosasAGuardar);

            request2.onsuccess = function(){
                this.updateVista();
            }.bind(this);
            request2.onerror = function(){
                console.log("Error", request2.error);
            }.bind(this);
        }.bind(this);

    }

    toJSON(){
        return {
            "puntos":this.puntos,
            "seleccionados":this.selected,
            "desplegadas":this.desplegadas,
            "nombre": this.name
        }
    }

    initData(){
        var request = window.indexedDB.open("Personaje",2);

        request.onerror = function(){
            console.error("Error", request.error);
        }
        request.onsuccess = function(event){
            var db = event.target.result;
            var transaction = db.transaction(["personaje"],"readwrite");

            var partes = transaction.objectStore("personaje");
            partes.getAll().onsuccess = function(event){
                var result = event.target.result;
                var cantidad = result.length;
                if(cantidad>=1){
                    var datos = result.slice(-1)[0];
                    if(datos!=undefined){
                        this.puntos = datos.puntos;
                    this.selected = datos.seleccionados;
                    if(this.selected == undefined)
                        this.selected = [];
                    this.desplegadas = datos.desplegadas;
                    if(this.desplegadas==undefined)
                        this.desplegadas=[];
                    this.name = datos.nombre;
                    if(this.name == undefined)
                        this.name = "";
                    this.updateVista();
                    }
                    
                   
                }
                
            }.bind(this)
            
        }.bind(this);

        request.onupgradeneeded = function(event){
            var db = event.target.result;
            if(!db.objectStoreNames.contains("personaje")){
                db.createObjectStore("personaje", {autoIncrement:true});
            }
            var transaction = event.target.transaction;

            var partes = transaction.objectStore("personaje");
            var request2 = partes.add(this.partesSeleccionadas);

            request2.onsuccess = function(){
                partes.getAll().onsuccess = (event)=>{
                    var result = event.target.result;
                }
            }.bind(this);
            request2.onerror = function(){
                console.log("Error", request2.error);
            }.bind(this);
        }.bind(this);

    }

    resetDatabase(){
        var request = window.indexedDB.open("Personaje");

        request.onerror = function(){
            console.error("Error", request.error);
        }

        request.onsuccess = function(){
            this.resetDatabase();
            var db = request.result;
            var transaction = db.transaction("personaje","readwrite");

            var partes = transaction.objectStore("personaje");
            var comprobar = partes.get("latest");
            comprobar.onsuccess = function(){
                var request2 = partes.delete("latest");

                request2.onsuccess = function(){
                }.bind(this);
                request2.error = function(){
                    console.log("Error");
                }.bind(this);
            }.bind(this);
            
        }.bind(this);

    }
    imprimirCoche(datos){
        var request = window.indexedDB.open("Personaje");

        request.onerror = function(){
            console.error("Error", request.error);
        }

        request.onsuccess = function(event){
            var db = event.target.result;
            var transaction = db.transaction(["personaje"],"readwrite");

            var partes = transaction.objectStore("personaje");
            partes.getAll().onsuccess = (event)=>{
                var result = event.target.result;
            }
            
        }.bind(this);
    }



    toJSONString(){
        var string = JSON.stringify(this.toJSON());
       
        return string;
    }
     descargar() {
        var textToSave = this.toJSONString();

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'myFile.txt';
        hiddenElement.click();
      }

      readInputFile(files){
        var archivo = files[0];
        if(archivo.type.match("text.*")){
            var lector = new FileReader();
            lector.onload = function(evento){
                this.partes = new Array();
                var texto = lector.result;
                var json = JSON.parse(texto);
                if(json.puntos!=undefined)
                    this.puntos = json.puntos;
                if(json.seleccionados!=undefined)
                    this.selected = json.seleccionados;
                if(json.desplegadas!=undefined)
                    this.desplegadas = json.desplegadas;
                if(json.nombre!=undefined)
                    this.name = json.nombre;
                this.guardarEnBaseDeDatos();
                this.updateVista();
            }.bind(this)
            lector.readAsText(archivo);
        }
    }

    cambiarNombre(){
        var nombreTexto = $("#textoNombre");
        this.name = nombreTexto.val();
        this.guardarEnBaseDeDatos();
    }

    evaluarCondiciones(cond){
        if(cond.includes("|")){
            var condiciones = cond.split("|");
            for(var i =0; i<condiciones.length; i++){
                var con = condiciones[i];
                if(this.evaluarCondiciones(con))
                    return true;
            }
            return false;
        }else if(cond.includes("&")){
            var condiciones = cond.split("&");
            for(var i =0; i<condiciones.length; i++){
                var con = condiciones[i];
                if(!this.evaluarCondiciones(con))
                    return false;
            }
            return true;
        }else if(cond.includes("~")){
            var condiciones = cond.split("~");
            return !this.evaluarCondiciones(condiciones[0]);
        }

        return this.selected.includes(cond);    
    }
    
}