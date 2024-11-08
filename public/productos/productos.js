
async function agregarProducto() {
    // Obtener los valores de los campos del formulario
    const nombreProducto = document.getElementById('nombre_producto').value;
    const descripcionProducto = document.getElementById('descrip_producto').value;   
  
    const valor = document.getElementById('valor').value;
    const marca = document.getElementById('marca').value;
  
    // Validar los datos (opcional)
    // Aquí puedes agregar lógica para validar que los campos no estén vacíos, que el valor sea un número, etc.
  
    // Crear un nuevo objeto FormData para enviar los datos
    const formData = new FormData();
  
    // Manejar la carga de la imagen (si aplica)
    const inputImagen = document.getElementById('imagen');
    if (inputImagen.files.length) {
      const archivoImagen = inputImagen.files[0];
  
      // Validar el archivo de imagen (opcional)
      // Aquí puedes agregar lógica para verificar el tipo de archivo, tamaño, etc.
  
      formData.append('imagen', archivoImagen);
  
      // Mostrar una vista previa de la imagen (opcional)
      const lector = new FileReader();
      lector.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.width = 200; // Ajustar el ancho según sea necesario
  
        const contenedorImagen = document.getElementById('imageContainer');
        contenedorImagen.innerHTML = '';
        contenedorImagen.appendChild(img);
      };
      lector.readAsDataURL(archivoImagen);
    }
  
    // Agregar los demás datos del producto al FormData (o JSON para diferentes API)
    formData.append('nombre_producto', nombreProducto);
    formData.append('descrip_producto', descripcionProducto);
    formData.append('valor', valor);
    formData.append('marca', marca);
  
    // Determinar el punto final de la API y el tipo de contenido según tu configuración específica
    const urlApi = 'http://localhost:3000/productos'; // Reemplaza con tu punto final de API real
    const tipoContenido = formData ? 'multipart/form-data' : 'application/json'; // Ajustar según el formato de datos
  
    try {
      const respuesta = await fetch(urlApi, {
        method: 'POST',
        headers: { 'Content-Type': tipoContenido },
        // Enviar FormData o objeto JSON en el cuerpo según el tipo de contenido
        body: tipoContenido === 'multipart/form-data' ? formData : JSON.stringify({nombre_producto: nombreProducto, descrip_producto: descripcionProducto, valor, marca})
      });
      const datos = await respuesta.json();
  
      if (respuesta.ok) {
       
        resetearFormulario(); 
      } else {
        
        console.error('Error al agregar el producto:', datos);
      }
    } catch (error) {
      console.error('Error:', error); 
    }
  }

  // Función para resetear el formulario y el botón
function resetearFormulario() {
    document.getElementById('formularioProducto').reset();
    const botonEnvio = document.querySelector('#formularioProducto button');
    botonEnvio.textContent = 'Agregar Producto';
    botonEnvio.onclick = (event) => {
        event.preventDefault();
        agregarProducto();
    };
}