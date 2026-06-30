# api_mundial_sena
aprendiendo apis restfull y mongoDB

# Taller de Consultas en Base de Datos NoSQL (Evidencia AA1-EV02)
**Aprendiz:** Javier Augusto Vera Ramírez  
**Programa:** desarrollo Backend con Node.Js y mongoDB - SENA  
**Instructor:** Leonardo Sanchez 

---

##  Tecnologías Utilizadas
- **Backend:** Node.js, Express.js
- **ODM:** Mongoose 


- **Base de Datos:** MongoDB Atlas (Cloud)
- **Pruebas de API:** Postman

---

## Solución del Taller y Evidencias de Código

### Punto 1 y 2: Creación de Colecciones y Registro de Datos de Prueba (Colombia y Japón)
Para dar solución a este requerimiento, se definieron los esquemas de datos nativos usando Mongoose. La inserción se procesa de forma dinámica mediante peticiones HTTP POST.

**Código del Controlador (Fragmento):**
```javascript
const createNewPartido = (req, res) => {
    const partido = new partidoModel({
        equipo1: req.body.equipo1,
        equipo2: req.body.equipo2,
        date: req.body.date,
        time: req.body.time
    });
    partido.save().then(response => res.status(201).json(response));
}; 
```
###  Punto 3: Actualización del documento del jugador (James Rodríguez)

**Descripción del requerimiento:** 
Se solicita realizar la actualización de un documento correspondiente a un jugador (específicamente James Rodríguez) para modificar sus campos de Club a "Real Madrid CF" y Shirt Name a "RODRÍGUEZ".

**Explicación de la lógica aplicada:**
Debido a que el modelo de datos de nuestra base de datos NoSQL implementa **Documentos Embebidos (Subdocumentos)**, la colección de `equipos` almacena internamente un arreglo con los datos de sus respectivos `jugadores`. Para realizar una actualización eficiente sin necesidad de sobreescribir todo el array ni descargar los datos al servidor, se optó por la siguiente estrategia en Node.js y Mongoose:

1. **Filtro de búsqueda compuesto:** La consulta no solo busca por el ID del equipo (`_id: idEquipo`), sino que incluye una subconsulta `"jugadores._id": idJugador` para localizar con precisión quirúrgica el registro exacto del jugador dentro del array.

2. **Uso del operador posicional `$`` de MongoDB:** En la sección de actualización, se utiliza la sintaxis `"jugadores.$.club"`. El símbolo de dólar (`$`) actúa como un marcador de posición dinámico que identifica el índice exacto del elemento del array que coincidió con el filtro de búsqueda.
3. **Operador `$set`:** Modifica exclusivamente las propiedades indicadas (`club` y `shirtName`) en lugar de alterar el resto de los campos del jugador o del equipo, manteniendo la integridad de los datos.
4. **Opción `{ new: true }`:** Fuerza a Mongoose a retornar en la promesa el documento final modificado, permitiendo enviar a Thunder Client el JSON actualizado con el código de estado HTTP `200 OK`.

# Taller de rutas de la apiRest (Evidencia AA2-EV01)
1. **Módulo de Equipos y Jugadores
    POST /api/equipos/guardar (o inserción inicial): 
Registro de los datos base de prueba para los equipos de Colombia y Japón. 
     GET /api/equipos/jugadores-japon: 
Consulta filtrada de la información requerida de todos los jugadores de Japón.  
    GET /api/equipos/jugadores-bajitos:
 Pipeline de agregación para listar los jugadores con estatura estrictamente menor a 170 cm.  
    GET / api/equipos/jugadores-mas-altos: 
Pipeline con $group y $sort para obtener los jugadores con la máxima estatura.  
    PUT /api/equipos/:idEquipo/jugadores/:idJugador: 
Actualización dirigida del subdocumento de un jugador específico (usado para el cambio de club y nombre de James Rodríguez).  

**Módulo de Partidos
    POST /api/partidos/guardar: 
Creación e inserción de un nuevo partido (ej. Colombia vs. Inglaterra). 
    GET /api/partidos/: 
Consulta general de todos los partidos registrados en el sistema. 
    PATCH /api/partidos/actualizar-hora:
 Modificación parcial por el body (idPartido y time) para cambiar el horario de un encuentro.
    DELETE /api/partidos/eliminar: 
Borrado físico de un partido específico mediante el envío de su idPartido en el cuerpo de la solicitud
