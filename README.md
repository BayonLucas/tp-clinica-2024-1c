# TP Clinica OnLine

![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/c1736d8d-6532-4703-a8e7-cf844974b4f9)
Entontraremos la bienvenida a la aplicación web, donde visualizaremos dos botones, uno de inicio de sesión y otro para registrarse. Estos tambien los veremos en el nav que permanecerá con nosotros mientras estemos trabajando. Se púede apreciar el logo de nuestra clinica online tanto en el fondo de la pantalla como en el boton Home de la esquina superior izquierda.

Al querer registrarse, se habilitan dos opciones:
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/fcbe71f5-211f-47e2-9fe0-e4addbea9b87)
Cada opcion tiene su propio formulario con sus respectivos campos y validaciones:

![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/f9a41930-b977-410c-9ed3-7321e6e971cd)
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/5372d422-4f5a-4612-92b3-2fc868c3ba83)

Al querer iniciar sesión nos encontraremos con el login y, como extra, 6 botones de inicio rápido:
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/00c7af02-026b-4270-8a03-3eff8ce10815)

Dentro de home veremos varias opciones que iran cambiando segun el rol de la cuenta (admin, paciente o especialista)
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/70f07e0f-5b6a-4e94-9fe2-6232448a1689)

## Usuario (admin):
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/4f34eec1-c500-4514-8679-45f5f1b5f395)
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/0e38f43f-fd11-498d-82f4-466e83a9a84a)
En esta pantalla, la cual solo se puede ingresar con una cuenta admin, veremos a todos los usuarios, con la posibilidad de filtrarlos por su rol. Al clickerar en algun paciente, se extenderá todas las historias clinicas recibió, mostrando detalles en un modal
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/fa7a3b37-091f-449f-92d3-263dbd22181e)
Tambien tendremos la posibilidad de exportar toda la info de todos los usuarios en xlsx.

## Turnos (admin):
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/4f5eb918-5533-4943-ab92-a2c144dea8e5)
Visualizaremos todos los turnos donde podremos filtrarlos por especialidad, especialista, o cualquier otro dato que se encuentre en el Historial Clinino, si es que lo posee. Ademas, hay varios botones de acciones que iran alternandose segun el rol y el estado del turno.

## Solicitar Turno (admin y paciente): 
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/0b6fbe1a-c814-4f1e-9f6a-8c679cd17d0f)
Acá podremos pedir un turno siempre y cuando el espacio esté disponible.

## Mi perfil (todos los roles):
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/4a565c1e-8b1a-4c09-ae7f-309c73fa1f1b)
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/6b7b5e7b-b8c4-4ad0-8c0c-95ca202ac22d)
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/c242e043-6db3-4b8a-980b-fffd19d0fbb3)
Acá segun el rol, hay variaciones. El admin solo tiene su informacion, pero el paciente tiene la posibilidad de ver su historia clínica completa, filtrarla por especialista o especialidad y exportarlo en pdf. Por otro lado, el especialista puede ingresar su horario laboral.

## Gráficos y estadísticas (admin):
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/becc44e8-f5e6-4ebc-b48a-5d2827ced2f7)
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/b2230f6b-dd1e-42dc-8a6a-e3fce44330d7)
Acá veremos varios gráficos, exportables a pdf, con datos relevantes para la institución

## Pacientes (especialista)
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/5f195809-1f99-4650-baa6-630b704d8d4b)
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/09c81267-01ab-4519-b862-40cc8f6dcf66)
Acá el doctor en cuestión podrá ver detalles de todos los pacientes que haya atentido alguna vez.

## Mis Turnos (Paciente y especialista):
![image](https://github.com/BayonLucas/tp-clinica-2024-1c/assets/78186463/5ba6314e-ee4f-4ecd-96a2-a46a2a52439c)
En este último apartado, podrémos visualizar todos los turnos realcionados con el usuario logueado. En el caso de los especialistas, estos podrás gestionar los turnos que les solicitaron, y los pacientes podrás calificar su atención como cancelar el turno.







