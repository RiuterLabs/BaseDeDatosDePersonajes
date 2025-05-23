class CreadorDePersonajes{
    constructor(puntosInicio){
        this.datos=[];
        this.datosIntra=[];
        this.datosTotales=[];
        this.datosLogros=[];
        this.logrosDesbloqueados=[];
        this.colorOjos="";
        this.colorPiel="";
        this.colorPelo="";
        this.name="";
        this.nameIntra="";
        this.selected=[];
        this.desplegadas=[];
        this.logrosDesplegados=false;
        this.puntos=puntosInicio;
        this.cargarArchivo();
        this.cargarArchivoIntra();
        this.cargarArchivoLogros();
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
    crearBotonesIntra() {
        var data = this.datosIntra;
        var seccionBotones = $("#seccionesBotonesIntra");
        seccionBotones.innerHTML = "";
        var title = document.createElement("h3");
        title.html = "Intra";

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
        boton.textContent = infoBoton["tituloCat"];
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

    crearTarjetasLogros(){
        var seccionLogros = $("#seccionLogros");
        for(var i =0; i<this.datosLogros.length; i++){
            var logro = this.datosLogros[i];
            var tarjetaLogro = this.crearTarjetaLogro(logro);
            seccionLogros.append(tarjetaLogro);
        }
        this.updateVista();
    }

    crearTarjetaLogro(info){
        var tarjeta = document.createElement("section");
        tarjeta.id = "logro"+info["id"];
        tarjeta.classList.add("logroDesbloqueado");
        var h4 = document.createElement("h4");
        h4.textContent = info["titulo"];
        h4.id = "tituloLogro"+info.id;
        var puntos = document.createElement("p");
        puntos.id = "pistaLogro"+info.pista;
        puntos.textContent = info["pista"];
        var img = document.createElement("img");
        $(img).attr("src","../multimedia/imagenes/creador/"+info["id"]+".jpg");
        $(img).attr("alt",info["desc"]);
        img.id = "imgLogro"+info.id;
        var desc = document.createElement("p");
        desc.textContent = info["desc"];
        desc.id="descLogro"+info.id;
        tarjeta.classList.add("Logro");


        tarjeta.append(h4);
        tarjeta.append(puntos);
        tarjeta.append(img);
        tarjeta.append(desc);
        return tarjeta;
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
        this.addTarjeta(info);
        if(info.incompatibilidades != undefined || info.incompatibilidades !=null)
            this.computeRequisites(info);
        this.comprobarIncompatibilidadesGeneral();
        this.updateVista();
        this.guardarEnBaseDeDatos();

    }

    addTarjeta(info){
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
    }
    computeRequisites(info){
        this.comprobarIncompatibilidadesCategorias(info);
        this.comprobarIncompatibilidadesGeneral();
    }

    comprobarIncompatibilidadesCategorias(info){
        var incompatibilidades = info.incompatibilidades;
        for(var i =0; i<incompatibilidades.length; i++){
            var tarjeta = this.getTarjetaByID(incompatibilidades[i]);
            if(this.selected.includes(tarjeta.id))
                this.addTarjeta(tarjeta);
        }
    }

    getTarjetaByID(id){
        for(var i =0; i<this.datosTotales.length; i++ ){
            var cat = this.datosTotales[i];
            var valores = cat["tarjetas"];
            for(var j=0; j<valores.length; j++)
            {
                var valor = valores[j];
                if(valor.id == id)
                    return valor;
            }
           
        }
        return undefined;
    }

    comprobarIncompatibilidadesGeneral(){
        for(var i =0; i<this.datosTotales.length; i++ ){
            var cat = this.datosTotales[i];
            var valores = cat["tarjetas"];
            for(var j=0; j<valores.length; j++)
            {
                var valor = valores[j];
                var tarjeta = $("#"+valor["id"]);
                
                var requisitos = valor["requisitos"];
                if(!this.checkRequisitos(requisitos)){
                    if(this.selected.includes(valor.id)){
                        this.addTarjeta(valor);
                    }
                }
            }
           
        }
    }

    updateVista(){
        this.updateNombre();
        this.updateNombreIntra();
        this.updateColorOjos();
        this.updateColorPelo();
        this.updateColorPiel();
        this.updatePuntos();
        this.updateDesplegadas();
        this.updateSeccionesDesbloqueadas();
        this.updateTarjetas();
        this.updateYaLasTienes();
        this.updateLogros();
        
    }

    updateLogros(){
        this.checkLogros();
        var seccionLogros = $("#seccionLogros");
        if(this.logrosDesplegados)
            seccionLogros.addClass("sinDesplegar");
        else
            seccionLogros.removeClass("sinDesplegar");
    }

    checkLogros(){
        for(var i =0; i<this.datosLogros.length; i++){
            var logro = this.datosLogros[i];
            if(!this.logrosDesbloqueados.includes(logro.id)){
                if(this.checkRequisitosCategorias(logro)){
                    var header = $("#tituloLogro"+logro.id);
                    header.html(logro.titulo);
                    var desc = $("#descLogro"+logro.id);
                    desc.html(logro.desc);
                    var img =  $("#imgLogro"+logro.id);
                    img.removeClass("sinDesplegar");
                    var logroTarj = $("#logro"+logro.id);
                    logroTarj.addClass("logroDesbloqueado");
                    this.logrosDesbloqueados.push(logro.id);
                    alert("LOGRO DESBLOQUEADO: "+logro.titulo+"\n"+logro.desc);
                    this.guardarEnBaseDeDatos();
                }else{
                    var header = $("#tituloLogro"+logro.id);
                    header.html("");
                    var desc = $("#descLogro"+logro.id);
                    desc.html("");
                    var img =  $("#imgLogro"+logro.id);
                    img.addClass("sinDesplegar");
                    var logroTarj = $("#logro"+logro.id);
                    logroTarj.removeClass("logroDesbloqueado");
                }
            }
        }
    }

    updateColorOjos(){
        var nombreTexto = $("#colorOjos");
        if(this.colorOjos==undefined || this.colorOjos==null)
            this.colorOjos = "#000000";
        nombreTexto.val(this.colorOjos);
    }
    updateColorPelo(){
        var nombreTexto = $("#colorPelo");
        if(this.colorPelo==undefined || this.colorPelo==null)
            this.colorPelo = "#000000";
        nombreTexto.val(this.colorPelo);
    }
    updateColorPiel(){
        var nombreTexto = $("#colorPiel");
        if(this.colorPiel==undefined || this.colorPiel==null)
            this.colorPiel = "#000000";
        nombreTexto.val(this.colorPiel);
    }
    updateNombre(){
        var nombreTexto = $("#textoNombre");
        if(this.name==undefined || this.name==null)
            this.name = "";
        nombreTexto.val(this.name);
    }

    updateNombreIntra(){
        var nombreTexto = $("#textoNombreIntra");
        if(this.nameIntra==undefined || this.nameIntra==null)
            this.nameIntra = "";
        nombreTexto.val(this.nameIntra);
    }
    updateSeccionesDesbloqueadas(){
        var data = this.datosTotales;
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
        for(var i =0; i<this.datosTotales.length; i++){
            var categoria = this.datosTotales[i].nombreCat;
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
        for(var i =0; i<this.datosTotales.length; i++ ){
            var cat = this.datosTotales[i];
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
                for (var i=0; i<archivo.length; i++) {
                    this.datosTotales.push(archivo[i])
                }
                this.crearBotones();
                this.updateVista();
            })
    }
    cargarArchivoIntra(){
        fetch("archivos/datosIntra.json")
            .then((response)=>response.json())
            .then((archivo)=>{
                this.datosIntra=archivo;
                for (var i=0; i<archivo.length; i++) {
                    this.datosTotales.push(archivo[i])
                }
                this.crearBotonesIntra();
                this.updateVista();
            })
    }
    cargarArchivoLogros(){
        fetch("archivos/logros.json")
            .then((response)=>response.json())
            .then((archivo)=>{
                this.datosLogros=archivo;
                this.crearTarjetasLogros();
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
            "nombre": this.name,
            "nombreIntra": this.nameIntra,
            "colorOjos":this.colorOjos,
            "colorPelo":this.colorPelo,
            "colorPiel":this.colorPiel,
            "logrosDesbloqueados":this.logrosDesbloqueados
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
                    this.nameIntra = datos.nombreIntra;
                    if(this.nameIntra == undefined)
                        this.nameIntra = "";
                    this.colorOjos = datos.colorOjos;
                    if(this.colorOjos == undefined)
                        this.colorOjos = "#000000"
                    this.colorPelo = datos.colorPelo;
                    if(this.colorPelo == undefined)
                        this.colorPelo = "#000000"
                    this.colorPiel = datos.colorPiel;
                    if(this.colorPiel == undefined)
                        this.colorPiel = "#000000";
                    if(datos.logrosDesbloqueados !=undefined)
                        this.logrosDesbloqueados = datos.logrosDesbloqueados;
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
                if(json.nombreIntra!=undefined)
                    this.nameIntra = json.nombreIntra;
                if(json.colorOjos!=undefined)
                    this.colorOjos = json.colorOjos;
                if(json.colorPelo!=undefined)
                    this.colorPelo = json.colorPelo;
                if(json.colorPiel!=undefined)
                    this.colorPiel = json.colorPiel;
                if(json.logrosDesbloqueados!=undefined)
                    this.logrosDesbloqueados = json.logrosDesbloqueados;
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
    cambiarNombreIntra(){
        var nombreTexto = $("#textoNombreIntra");
        this.nameIntra = nombreTexto.val();
        this.guardarEnBaseDeDatos();
    }
    cambiarColorOjos(){
        var nombreTexto = $("#colorOjos");
        this.colorOjos = nombreTexto.val();
        this.guardarEnBaseDeDatos();
    }

    cambiarColorPiel(){
        var nombreTexto = $("#colorPiel");
        this.colorPiel = nombreTexto.val();
        this.guardarEnBaseDeDatos();
    }
    cambiarColorPelo(){
        var nombreTexto = $("#colorPelo");
        this.colorPelo = nombreTexto.val();
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
    toggleLogros(){
        this.logrosDesplegados = !this.logrosDesplegados;
        this.updateVista();
    }
    
}