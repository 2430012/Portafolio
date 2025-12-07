<?php
// --- CONFIGURACIÓN Y DEFINICIONES ---
date_default_timezone_set('America/Mexico_City'); // Ajusta a tu zona horaria

$file_todo = 'todo.txt';
$file_completed = 'completed.txt';
$file_incomplete = 'incomplete.txt';
$current_time = time(); // Timestamp actual

// --- FUNCIÓN PARA MOVER TAREAS VENCIDAS ---
// Esta función se ejecuta CADA VEZ que se carga la página.
function checkAndUpdateIncompleteTasks($file_todo, $file_incomplete, $current_time) {
    if (!file_exists($file_todo)) {
        return; // No hay archivo de tareas, no hay nada que hacer
    }

    $tasks_todo = file($file_todo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $new_tasks_todo = []; // Tareas que se quedan en todo.txt
    $tasks_to_move = []; // Tareas que van a incomplete.txt

    foreach ($tasks_todo as $task) {
        list($id, $description, $due_timestamp) = explode('|', $task);
        
        if ($current_time > (int)$due_timestamp) {
            // ¡La tarea está vencida!
            $tasks_to_move[] = $task; // Mantenemos el formato original
        } else {
            // La tarea aún no vence
            $new_tasks_todo[] = $task;
        }
    }

    // Si hay tareas para mover...
    if (!empty($tasks_to_move)) {
        // 1. Escribir las tareas vencidas en incomplete.txt (agregando al final)
        file_put_contents($file_incomplete, implode("\n", $tasks_to_move) . "\n", FILE_APPEND);
        
        // 2. Sobrescribir todo.txt solo con las tareas que NO vencieron
        file_put_contents($file_todo, implode("\n", $new_tasks_todo) . (empty($new_tasks_todo) ? "" : "\n"));
    }
}

// --- PROCESAMIENTO DE FORMULARIOS (POST) ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- 1. Agregar una nueva tarea ---
    if (isset($_POST['add_task']) && !empty(trim($_POST['task_description'])) && !empty($_POST['task_due'])) {
        
        $task_description = trim($_POST['task_description']);
        $due_timestamp = strtotime($_POST['task_due']); // Convierte "2025-10-30T14:30" a timestamp
        $task_id = uniqid(); // Genera un ID único
        
        // Formato: id|descripcion|timestamp_vencimiento
        $line = "$task_id|$task_description|$due_timestamp\n";
        
        // Agrega la nueva tarea al final de todo.txt
        file_put_contents($file_todo, $line, FILE_APPEND);
    }

    // --- 2. Completar una tarea ---
    if (isset($_POST['complete_task']) && !empty($_POST['task_id'])) {
        $task_id_to_complete = $_POST['task_id'];
        
        $tasks_todo = file($file_todo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $new_tasks_todo = [];

        foreach ($tasks_todo as $task) {
            list($id, $description, $due_timestamp) = explode('|', $task);
            
            if ($id == $task_id_to_complete) {
                // ¡Esta es la tarea! La movemos a completadas
                // Formato: id|descripcion|timestamp_completado
                $completed_line = "$id|$description|$current_time\n";
                file_put_contents($file_completed, $completed_line, FILE_APPEND);
            } else {
                // Esta tarea no es, la mantenemos en la lista de pendientes
                $new_tasks_todo[] = $task;
            }
        }
        
        // Sobrescribimos todo.txt solo con las tareas que quedaron pendientes
        file_put_contents($file_todo, implode("\n", $new_tasks_todo) . (empty($new_tasks_todo) ? "" : "\n"));
    }
    
    // --- Redirección PRG (Post-Redirect-Get) ---
    // Esto evita que el formulario se reenvíe si el usuario actualiza la página
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// --- EJECUTAR LA LÓGICA DE VENCIDAS ANTES DE MOSTRAR ---
checkAndUpdateIncompleteTasks($file_todo, $file_incomplete, $current_time);

// --- FUNCIÓN AUXILIAR PARA MOSTRAR LISTAS ---
function displayList($file, $title, $is_todo_list = false) {
    echo "<h2>$title</h2>";
    if (!file_exists($file) || filesize($file) == 0) {
        echo "<p>No hay tareas en esta lista.</p>";
        return;
    }
    
    $tasks = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    echo '<ul>';
    foreach ($tasks as $task) {
        list($id, $description, $timestamp) = explode('|', $task);
        // Usamos htmlspecialchars para evitar problemas de seguridad (XSS)
        $description_safe = htmlspecialchars($description);
        
        echo '<li>';
        
        if ($is_todo_list) {
            // Lista de Pendientes (con botón)
            $due_date = date('Y-m-d H:i', (int)$timestamp);
            echo "$description_safe (Vence: $due_date) ";
            
            // Formulario para completar
            echo '<form method="POST" style="display:inline;">';
            echo '<input type="hidden" name="task_id" value="' . $id . '">';
            echo '<input type="submit" name="complete_task" value="Completar">';
            echo '</form>';
            
        } else {
            // Listas Completadas o Incompletas (solo texto)
            $date_label = ($title == 'Completadas') ? 'Completada' : 'Venció';
            $date = date('Y-m-d H:i', (int)$timestamp);
            echo "$description_safe ($date_label: $date)";
        }
        
        echo '</li>';
    }
    echo '</ul>';
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List con PHP</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: auto; background-color: #f9f9f9; }
        h1, h2 { color: #333; border-bottom: 2px solid #007BFF; padding-bottom: 5px; }
        form { margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background-color: #fff; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], input[type="datetime-local"] { width: 95%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }
        input[type="submit"] { background: #007BFF; color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 4px; font-size: 16px; }
        input[name="complete_task"] { background: #28a745; margin-left: 10px; padding: 5px 10px; font-size: 14px; }
        ul { list-style-type: none; padding-left: 0; }
        li { background: #fff; margin-bottom: 8px; padding: 12px; border-radius: 4px; border: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        hr { border: 0; height: 1px; background: #ddd; margin: 30px 0; }
    </style>
</head>
<body>

    <h1>Mi Lista de Tareas (To-Do List) 📝</h1>

    <form method="POST">
        <h2>Agregar Nueva Tarea</h2>
        <label for="task_desc">Tarea:</label>
        <input type="text" id="task_desc" name="task_description" placeholder="Ej: Comprar leche" required>
        
        <label for="task_due">Fecha Límite (tiempo determinado):</label>
        <input type="datetime-local" id="task_due" name="task_due" required>
        
        <input type="submit" name="add_task" value="Agregar Tarea">
    </form>

    <hr>

    <div class="lists-container">
        
        <?php displayList($file_todo, 'Pendientes ⏳', true); ?>
        
        <hr>

        <?php displayList($file_completed, 'Completadas ✅'); ?>
        
        <hr>

        <?php displayList($file_incomplete, 'No Completadas (Vencidas) ❌'); ?>

    </div>

</body>
</html>