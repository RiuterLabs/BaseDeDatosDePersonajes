class CreadorDePersonajes{
    constructor(puntosInicio){
        this.datos=[];
        this.selected=[];
        this.desplegadas=[];
        this.puntos=puntosInicio;
        this.cargarArchivo();
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
        }
       
    }

    crearBoton(infoBoton){
        var boton = document.createElement("button");
        boton.textContent = infoBoton["nombreCat"];
        boton.addEventListener("click",this.crearTarjetas.bind(this,infoBoton));
        return boton;
    }

    crearTarjetas(info){
        var seccionBotones = $("#"+info["nombreCat"]);
        var seccionTarjetas = document.getElementById("seccionTarjetas"+info["nombreCat"]);
        
        if(this.desplegadas.includes(info["nombreCat"])){
            var nuevas = this.desplegadas.filter((element)=>element!==info["nombreCat"])
            this.desplegadas =nuevas;
            seccionTarjetas.innerHTML = "";
        }else{
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
            this.desplegadas.push(info["nombreCat"]);
        }
        
        this.updateVista();

    }

    crearTarjeta(info){
        var tarjeta = document.createElement("section");
        tarjeta.id = info["id"]
        var h4 = document.createElement("h4");
        h4.textContent = info["id"];
        var puntos = document.createElement("p");
        puntos.textContent = info["coste"];
        //var img = document.createElement("img");
        //$(img).attr("src","../../multimedia/imagenes/creador/"+info["id"]+".png");
        //$(img).attr("alt",info["desc"]);
        var desc = document.createElement("p");
        desc.textContent = info["desc"];

        tarjeta.addEventListener("click",this.addTf.bind(this,info));

        tarjeta.append(h4);
        tarjeta.append(puntos);
        //tarjeta.append(img);
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

    }

    updateVista(){
        this.updatePuntos();
        this.updateTarjetas();
        this.updateYaLasTienes();
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
}