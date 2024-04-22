# Restaurante Pagina Web

---

## Cosas por hacer
- [ ] Reservaciones
- [ ] Poner iconos
- [ ] Responsive
- [ ] Boton WhatsApp para contacto

## Preparación e istalación
* Tener instalado la ultima version de NodeJS

### Tecnologias utilizadas
* HTML
* CSS
* JS Y TS
* NodeJS
* Firebase (Firestore y Auth)

### Instalación 
En la carpeta del repositorio ejecutar el comando:
```npm i```

Para instalar todas las dependencias de la aplicación.
Las dependencias son las necesarias para trabajar con la base de datos de Firebase y similares.

### Ejecución
Al tener todos las dependencias instaladas, se pasa a ejecutar el siguiente comando para preparar el servidor de desarrollo donde se actualizaran los cambios locales en tiempo real.

```npm run dev```

## Diseño
> [!NOTE]
> Se uso el siguiente diseño de referencia
> [Figma](https://www.figma.com/file/pZTTf0FIeu0YnJTemMV5bA/Restaurante?type=design&node-id=0%3A1&mode=design&t=RwcY80WUoDo2nbAG-1)

![Selección_058](https://github.com/RogelioLB/restaurante/assets/71564434/da893161-c51d-4ecd-a255-41f5394ba0b2)

## Forma de trabajo

Se tendra que crear un Fork de este repositorio. Ahi se haran las modificaciones para luego pasarlas a la version final.
El deploy se hara en [vercel.com](https://vercel.com/rogeliolbs-projects), esto nos permitira ver una preview de como quedaran los cambios en la pagina sin necesidad de hacer la PR a la rama principal.
La rama de desarrollo sera la rama dev. Para acceder a ella usa el comando ```git branch dev```

### ¿Como hacer un commit al repositorio?
Una vez teniendo el fork del repositorio, lo clonaras en tu maquina y haras todos los pasos de instalación y ejecución de la pagina web.
Para hacer un cambio primero tienes que estar en la rama dev, como antes dicho. Una vez ahi puedes hacer los cambios que quieras.
Para hacer un commit es necesario saber lo siguiente, que cosas vas a cambiar y el porque.
Si modificaste 5 archivos pero la funcionalidad nueva solo funciona con 3, es mejor solo agregar los 3 archivos al commit y los demas dejarlos fuera hasta que sean necesarios.

Para agregar un archivo al commit se usa el siguiente comando ```git add nombre_del_archivo.extension```.
Asi con todos los archivos necesarios, una vez teniendo hecho esto podemos pasar a crear el commit con el siguiente comando.
```git commit -m "Descripcion del commit"``` En la descripcion escribir cuales son los cambios de manera corta

Teniendo este commit pasamos a pasar los cambios de manera global a la rama dev con el comando
```git push origin dev```
De esta forma subimos los cambios al repositorio en github, para todos aquellos que esten trabajando en la apliacion

Siempre que alguien haga un push a la rama dev, es necesario antes de modificar algun archivo de la pagina realizar un pull, es decir, traer todos los cambios nuevos hechos por los demas.
Con el siguiente comando
```git pull origin dev```
Con esto le decimos que nos de los nuevos cambios en la rama dev.
