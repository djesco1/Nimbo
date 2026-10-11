# Especificación del lenguaje (v0.1)

Nimbo es un lenguaje gráfico: el diagrama es el programa. Tiene tres elementos visuales y un formato de archivo que los guarda como texto.

## 1. Componentes

Un componente es un rol en la arquitectura, identificado por una clave `familia.nombre`, por ejemplo `db.relational` o `msg.queue`. La lista completa está en [`spec/components.json`](../spec/components.json) y en el [catálogo](index.html).

Cada componente tiene:

| Campo | Significado |
|---|---|
| `key` | Clave única. Es el tipo que se escribe en el archivo del diagrama. |
| `name` | Nombre para mostrar. |
| `family` | Una de las 10 familias. Define el color del icono. |
| `tier` | `core`, `extended` o `notation`. Ver [servicios-cloud.md](servicios-cloud.md#criterio-para-decidir-qué-es-común). |
| `description` | Qué rol cumple, en una frase. |
| `icon` | Cuerpo SVG en una rejilla de 44×44. |
| `note` | Diferencias entre proveedores, si las hay. |

Tres componentes se dibujan como **zonas** que contienen a otros: `net.private`, `net.public` y `ops.account`.

## 2. Relaciones

Una relación es una flecha tipada entre dos componentes. Se distingue solo por trazo y punta, porque el color pertenece a los componentes.

| Clave | Trazo | Significado |
|---|---|---|
| `rel.call` | Sólido, triángulo lleno | Llamada síncrona |
| `rel.send` | Rayas, punta abierta | Mensaje asíncrono a un consumidor |
| `rel.emit` | Rayas, punta doble | Evento para muchos suscriptores |
| `rel.flow` | Doble línea | Flujo de datos en volumen |
| `rel.read` | Sólido, círculo hueco | Lectura |
| `rel.write` | Sólido, cuadrado lleno | Escritura |
| `rel.trust` | Raya y punto, rombo hueco | Actuar con una identidad o rol |
| `rel.replicate` | Doble línea, dos puntas | Replicación |
| `rel.observe` | Puntos | Telemetría |
| `rel.depends` | Fino y gris, triángulo hueco | Orden de despliegue, sin tráfico |

Cada relación declara en [`spec/relations.json`](../spec/relations.json) qué orígenes (`from`) y destinos (`to`) acepta. Los patrones pueden ser una clave exacta (`net.gateway`), una familia (`db.*`) o cualquiera (`*`). Una flecha fuera de esos patrones es un error de tipo.

## 3. Reglas de composición

1. Una flecha expresa una sola relación y apunta en la dirección de la dependencia: el origen depende del destino.
2. La contención es espacial. Un componente dentro de una zona hereda su red o su cuenta.
3. Para entrar a una zona privada desde fuera o desde una zona pública, la flecha pasa por `net.gateway` o `net.loadbalancer`.
4. Cada relación solo admite los orígenes y destinos de su ficha.
5. Las propiedades van en una pastilla sobre la flecha. Las que no se escriben toman el valor por defecto del proveedor.
6. Un `rel.send` entre dos cómputos sin cola dibujada es válido: se inserta una `msg.queue` implícita.
7. Los ciclos de `rel.call` y `rel.depends` son errores. Los ciclos asíncronos se permiten con advertencia.
8. Los componentes de nivel notación documentan el diseño pero no crean recursos.

En la versión 0.1 el script de build verifica las reglas 4 y la existencia de tipos y nodos. Las demás quedan documentadas para el editor.

## 4. Formato de archivo

Un diagrama se guarda como JSON. Las posiciones van separadas del grafo para que un cambio de diseño no ensucie el diff de un cambio de arquitectura.

```json
{
  "name": "pedidos",
  "title": "Sistema de pedidos",
  "language": "nimbo/0.1",
  "zones": [
    { "id": "privada", "type": "net.private", "contains": ["crear_pedido", "pedidos_db"] }
  ],
  "nodes": [
    { "id": "crear_pedido", "type": "compute.function" },
    { "id": "pedidos_db", "type": "db.relational", "props": { "consistency": "strong" } }
  ],
  "edges": [
    { "rel": "rel.write", "from": "crear_pedido", "to": "pedidos_db" }
  ],
  "layout": {
    "crear_pedido": [360, 140],
    "pedidos_db": [540, 140]
  }
}
```

| Campo | Significado |
|---|---|
| `language` | Versión del lenguaje con la que se escribió el archivo. |
| `zones` | Zonas y los nodos que contienen. |
| `nodes` | Instancias de componentes. `id` es el nombre en el diagrama; `type` es la clave del componente. |
| `edges` | Relaciones entre nodos, con propiedades opcionales. |
| `layout` | Centro de cada nodo en el lienzo, en píxeles. |

El ejemplo completo está en [`spec/examples/pedidos.json`](../spec/examples/pedidos.json) y se dibuja en [`docs/examples/pedidos.svg`](examples/pedidos.svg).

## 5. Estilo de los iconos

- Rejilla de 44×44, trazo de 2 px, puntas y uniones redondeadas, sin relleno.
- Un color por familia. La forma identifica el rol dentro de la familia.
- Las zonas usan borde punteado.
- Ningún icono imita el logotipo o el icono oficial de un proveedor.
- Cada icono se publica en dos versiones: con el color de su familia en `icons/<familia>/` y con `currentColor` en `icons/mono/`, para usar en cualquier tema.
