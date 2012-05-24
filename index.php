<!DOCTYPE html>
<html lang="es">
	<head>
		<meta charset="utf-8" />
		<title>Jquery ddSlick Plugin</title>
		<!-- Se incluye la libreria de Jquery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
		<!-- Se incluye el plugin ddslick -->
		<script type="text/javascript" src="js/ddslick.js"></script>
		<!-- Se incluye el archivo que contiene los elementos para mostrar en el dropdown -->
		<script type="text/javascript" src="js/cargaDatos.js"></script>
	</head>
	<body>
		<h1>Ejemplos ddslick</h1>
		<article>
			<!-- Ejemplo Dropdown Básico -->
			<div id="dropdownBasico"></div>
		</article>

		<script type="text/javascript">
			
			$(document).ready(function() {
				
				//Dropdown Básico
				$('#dropdownBasico').ddslick({
					data: ddData,
					width: 300,
					imagePosition: "left",
					selectText: "Selecciona tu red social favorita",
					onSelected: function(data){
						//Llama función que hace algo
						//console.log(data);
					}
				});
			});
			
		</script>
	</body>
</html>
