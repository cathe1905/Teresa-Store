document.addEventListener('DOMContentLoaded', () => {
    // variables
    const todosProductos= document.querySelector('#allProducts');
    const titulo= document.querySelector('#titulo');
    let articulosCarrito= JSON.parse( localStorage.getItem('articulo') ) || [];
    let contador= articulosCarrito.length || 0;
    const productCategorias= document.querySelectorAll('.dropdown-item');

    const contenedorCarrito = document.querySelector('#lista-carrito tbody');

    let total= 0;

    let vaciar= document.querySelector('#vaciar-carrito');
    
    const totalCarrito = document.querySelector('#total');
    const contadorCarrito= document.querySelector('.count-product');

    const logo= document.querySelector('#logo');

//haciendo el logo mas chico cuando haga scroll en la barra de navegacion fijada
    window.onscroll = function() {
        if(window.scrollY >= 102) {
            logo.classList.add('cuadre-sin');
            logo.classList.remove('cuadre');
        } else {
            logo.classList.add('cuadre');
            logo.classList.remove('cuadre-sin');
        }
      }

    // cuando recargue la pagina storage se actualizara en el carrito, el total y el contador
    if(articulosCarrito.length > 0) {
        articulosCarrito.forEach(articulo => {
            total += (articulo.precio * articulo.cantidad)
        })
        totalCarrito.textContent= `Total a pagar: ${total} $`
        contadorCarrito.textContent= articulosCarrito.length;
    }    
          carrito(); // esta funcion imprime los productos en carrito
          if(total == 0) {
            totalCarrito.textContent= 'Tu carrito esta vacío';
        }

        
    // llamado de todos los productos existentes al dom, al recargar la pagina
    const url= 'https://fakestoreapi.com/products';

        async function callProducts(url) {
            let respuesta= await fetch(url);
            let resultado = await respuesta.json();
            printProducts(resultado)
         }
         callProducts(url);

    //imprime todos los productos en el dom
    function printProducts(resultado) {
        console.log(resultado)
        for(let i=0; i < resultado.length; i++) {

            const divGeneral = document.createElement('div');
            divGeneral.classList.add('card', 'col-6', 'col-md-3', 'm-md-4', 'text-center');
            
            const titulo= document.createElement('h2');
            titulo.classList.add('card-title', 'fst-italic');
            titulo.textContent= resultado[i].title;

            const divFlex= document.createElement('div');
            divFlex.classList.add()

            const divBody = document.createElement('div');
            divBody.classList.add('card-body', 'd-flex', 'align-items-center');

            const imagen = document.createElement('img');
            imagen.classList.add('card-img', 'card-img-top');
            imagen.src= resultado[i].image;

            const precio= document.createElement('p');
            precio.textContent= `Price: ${resultado[i].price} $`;

            const divFooter = document.createElement('div');
            divFooter.classList.add('card-footer');

            const botonD= document.createElement('button');
            botonD.classList.add('btn', 'btn-primary', 'me-md-2', 'mb-2', 'mb-lg-0');
            botonD.textContent= 'More details';
            botonD.onclick = function() {
                seleccionarProducto(resultado[i].id)
            }

            const botonC= document.createElement('button');
            botonC.classList.add('btn', 'btn-primary');
            botonC.textContent= 'Add to Cart';
            botonC.onclick = function() {
                agregarArticulo(resultado[i])
            }

            divFlex.appendChild(imagen)
            divFlex.appendChild(precio)
            divBody.appendChild(divFlex)
            divFooter.appendChild(botonD)
            divFooter.appendChild(botonC)
            divGeneral.appendChild(titulo);
            divGeneral.appendChild(divBody);
            divGeneral.appendChild(divFooter);

            todosProductos.appendChild(divGeneral)
        }
    }
    
     //eventos

     // en dropdown u offcanvas
     productCategorias.forEach( categoria => {
        categoria.addEventListener('click', bringCategory);
    });
    vaciar.addEventListener('click', vaciarCarrito) // vaciar el carrito
    
    // hace el llamado a la api para solo traer esta categoria
    function bringCategory(e) {
        e.preventDefault();
        
        const id= e.target.getAttribute('id')
        
        const url= `https://fakestoreapi.com/products/category/${id}`;

        async function callProducts(url) {
            let respuesta= await fetch(url);
            let resultado = await respuesta.json();
            printCategory(resultado, id)
         }
         callProducts(url);
    }

    // imprime esta categoria en el dom
    function printCategory(resultado, id) {
        limpiarHTML(todosProductos)
       
       titulo.textContent= id;
       for(let i=0; i < resultado.length; i++) {

        const divGeneral = document.createElement('div');
        divGeneral.classList.add('card', 'col-6', 'col-md-3', 'm-md-4', 'text-center');
        
        const titulo= document.createElement('h2');
        titulo.classList.add('card-title', 'fst-italic');
        titulo.textContent= resultado[i].title;

        const divFlex= document.createElement('div');
        divFlex.classList.add()

        const divBody = document.createElement('div');
        divBody.classList.add('card-body', 'd-flex', 'align-items-center');

        const imagen = document.createElement('img');
        imagen.classList.add('card-img', 'card-img-top');
        imagen.src= resultado[i].image;

        const precio= document.createElement('p');
        precio.textContent= `Price: ${resultado[i].price} $`;

        const divFooter = document.createElement('div');
        divFooter.classList.add('card-footer');

        const botonD= document.createElement('button');
        botonD.classList.add('btn', 'btn-primary', 'me-md-2', 'mb-2', 'mb-lg-0');
        botonD.textContent= 'More details';
        botonD.onclick = function() {
            seleccionarProducto(resultado[i].id) //ver el producto en un modal
        }

        const botonC= document.createElement('button');
        botonC.classList.add('btn', 'btn-primary');
        botonC.textContent= 'Add to Cart';
        botonC.onclick = function() {
            agregarArticulo(resultado[i]) // agrega producto al carrito
        }
        divFlex.appendChild(imagen)
        divFlex.appendChild(precio)
        divBody.appendChild(divFlex)
        divFooter.appendChild(botonD)
        divFooter.appendChild(botonC)
        divGeneral.appendChild(titulo);
        divGeneral.appendChild(divBody);
        divGeneral.appendChild(divFooter);

        todosProductos.appendChild(divGeneral)
        }
    }
    // llamado del producto especifico al modal
    async function seleccionarProducto(id) {
         const url= `https://fakestoreapi.com/products/${id}`;

        let respuesta= await fetch(url);
        let resultado = await respuesta.json();
        modalDescription(resultado);
    }
    
    // imprimir informacion en el dom del articulo especifico
    function modalDescription(producto){
        
        const {title, image, price, description} = producto;
    
        const titulo = document.querySelector('.modal .modal-title');
        titulo.textContent= title;
    
        const body = document.querySelector('.modal .modal-body');
        body.innerHTML= `
        <img class="img-fluid" src= "${image}" alt= "${title}" /> 
        <h3 class="my-3"> Description: ${description}</h3>
        `
        const modalFooter = document.querySelector('.modal-footer');
        limpiarHTML(modalFooter);

        const precio= document.createElement('p');
        precio.textContent= `Price: ${price} $`; 

        const boton= document.createElement('button');
        boton.classList.add('btn', 'btn-primary');
        boton.textContent= 'Add to Card';
        boton.onclick = function() {
            agregarArticulo(producto) // agrega producto al carrito
        }

        modalFooter.appendChild(precio);
        modalFooter.appendChild(boton);
        
        const modal = new bootstrap.Modal('#modal', {});
        modal.show() //llamadoo del modal
    } 
    
    function agregarArticulo(articulo) {
        
        // creamos un objeto para el nuevo articulo
       var  infoArticulo = {
            imagen: articulo.image,
            titulo: articulo.title,
            precio: articulo.price,
            id: articulo.id,
            cantidad: 1
       }
       console.log(infoArticulo)

       // chequeamos si hay articulo repetidos, y solo actualizamos la cantidad
       if( articulosCarrito.some( articulo => articulo.id === infoArticulo.id ) ) { 
        const articulos = articulosCarrito.map( articulo => {
             if( articulo.id === infoArticulo.id) {
                  articulo.cantidad++;
                   return articulo; // retorna el objeto actualizado
                } else {
                    return articulo; // retorna los objetos que no son los duplicados
                }
        })
        articulosCarrito = [...articulos];
        }  else {
            articulosCarrito = [...articulosCarrito, infoArticulo];
            contador++; // se actualizara el numero en la parte superior del carrito
         }
        
         // vamos acumulando en el total los precios de productos
        total += (infoArticulo.precio * infoArticulo.cantidad)
        totalCarrito.textContent= `Total a pagar: ${total} $ `

         carrito(articulo); // imprime en el carrito este producto  
    }
    
    
    function carrito() {

        limpiarHTML(contenedorCarrito);

        articulosCarrito.forEach(articulo => {
            const row = document.createElement('tr');

            const columI = document.createElement('td');
            const imagen= document.createElement('img');
            imagen.src= articulo.imagen;
            imagen.style.width="100px";
            columI.appendChild(imagen);

            const columT = document.createElement('td');
            columT.textContent= articulo.titulo;

            const columP = document.createElement('td');
            columP.textContent= articulo.precio;

            const columC = document.createElement('td');
            columC.textContent= articulo.cantidad;

            const columB = document.createElement('td');
            const boton = document.createElement('button');
            boton.textContent= 'X';
            boton.classList.add('borrar-curso', 'text-decoration-none', 'btn', 'btn-secondary');
            boton.onclick = function(e) {
                e.stopPropagation() // impide que se cierre el dropdown del carrito al hacer click
                eliminarProducto( articulo );
            }
            
            columB.appendChild(boton)

            row.appendChild(columI)
            row.appendChild(columT)
            row.appendChild(columP)
            row.appendChild(columC)
            row.appendChild(columB)
           
            contenedorCarrito.appendChild(row);

            contadorCarrito.textContent= contador;
            
        });

        sincronizarStorage(); // se guarda en storage el producto
    }
    
    function eliminarProducto(articulo) {
    
        const {id, cantidad, precio} = articulo;
        //Eliminar del arreglo del carrito
         articulosCarrito = articulosCarrito.filter(articulo => articulo.id !== id);

        carrito(); // actualizar el carrito    
             
        total = (total - (precio * cantidad)).toFixed(2); // actualizar el total, dejando solo dos decimales para los montos

        totalCarrito.textContent= `Total a pagar: ${total} $`
        if(total == 0) {
            totalCarrito.textContent= 'Tu carrito esta vacío';
        }

        contador--;
        contadorCarrito.textContent= contador;
   }
    function limpiarHTML(elemento) {
        while(elemento.firstChild) {
            elemento.removeChild(elemento.firstChild);
        }
    }

    function sincronizarStorage() {
        localStorage.setItem('articulo', JSON.stringify(articulosCarrito));
   }

   function vaciarCarrito(e) {
    e.stopPropagation();

    articulosCarrito= [];
    total= 0;
    contador= 0;

    totalCarrito.textContent= '';
    contadorCarrito.textContent= articulosCarrito.length;

    carrito();
   }
});



