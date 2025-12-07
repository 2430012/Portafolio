<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tablas de Multiplicar</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <h1>Tablas de Multiplicar 🔢</h1>

    <div class="tablas-container">
        <?php\]
        $limite_tablas = 10;
        
        $limite_multiplicador = 10;

        for ($i = 1; $i <= $limite_tablas; $i++) {
            
            echo '<div class="tabla-card">';
            
            echo "<h2>Tabla del $i</h2>";

            for ($j = 1; $j <= $limite_multiplicador; $j++) {
                
                $resultado = $i * $j;
                
                echo "<p>$i &times; $j = $resultado</p>";
            }

            echo '</div>';
        }
        ?>
    </div>

</body>
</html>