# Visión de los servicios de nube

Este documento recorre el catálogo de AWS, Microsoft Azure y Google Cloud, y explica cómo se eligieron los componentes que comparten los tres. Es la base de la primera versión de Nimbo: un lenguaje gráfico cuyos iconos representan roles, no productos.

La lista completa, componente por componente y con el servicio de cada proveedor, está en [equivalencias.md](equivalencias.md). Esa tabla se genera desde `spec/`, así que siempre coincide con el catálogo.

Revisado en octubre de 2026. Los catálogos cambian cada mes: la sección [Cambios recientes que afectan las equivalencias](#cambios-recientes-que-afectan-las-equivalencias) lista los que ya se tuvieron en cuenta.

## Resumen

- Los tres proveedores publican más de 200 servicios cada uno, pero la mayoría son variantes, integraciones o productos de nicho. Agrupados por el rol que cumplen en una arquitectura, quedan alrededor de cien piezas.
- Nimbo define **103 componentes** en 10 familias.
- **88 son núcleo:** los tres proveedores tienen un servicio administrado que cumple el mismo rol. Un diagrama hecho solo con componentes núcleo se puede traducir a cualquiera de los tres.
- **8 son extendidos:** existen en uno o dos proveedores, o la equivalencia tiene diferencias que cambian el diseño.
- **7 son notación:** actores externos y contratos que el lenguaje necesita para describir un sistema, pero que no crean recursos.

| Familia | Núcleo | Extendido | Notación | Total |
|---|---:|---:|---:|---:|
| Cómputo | 10 | 3 | 0 | 13 |
| Bases de datos | 8 | 2 | 0 | 10 |
| Almacenamiento | 7 | 0 | 0 | 7 |
| Analítica | 9 | 0 | 0 | 9 |
| IA y ML | 15 | 0 | 0 | 15 |
| Mensajería e integración | 7 | 2 | 2 | 11 |
| Red | 11 | 1 | 0 | 12 |
| Seguridad | 10 | 0 | 0 | 10 |
| Operación y DevOps | 11 | 0 | 0 | 11 |
| Actores externos | 0 | 0 | 5 | 5 |
| **Total** | **88** | **8** | **7** | **103** |

## Criterio para decidir qué es común

Un componente entra al núcleo solo si cumple las cuatro condiciones:

1. **Mismo rol.** Los tres servicios resuelven el mismo problema en una arquitectura, aunque cambien los detalles. Por ejemplo, Lambda, Azure Functions y Cloud Run functions ejecutan código por evento sin servidores.
2. **Servicio de primera parte.** Lo opera el propio proveedor. No cuentan los productos de terceros del marketplace.
3. **Administrado.** No hay que instalar ni parchar software. Un Elasticsearch montado a mano en máquinas virtuales no cuenta como búsqueda administrada.
4. **Vigente.** Acepta clientes nuevos y no tiene fecha de retiro anunciada.

Cuando una de las condiciones falla en un proveedor, el componente pasa a extendido y la tabla dice qué falta. Un diagrama puede usar componentes extendidos, pero la herramienta avisará qué proveedores no pueden implementarlo tal cual.

Dos reglas más para nombrar componentes:

- **Un componente es un rol, no un producto.** Cosmos DB aparece en cinco componentes (documental, clave-valor, columnar, grafo y vectorial) porque cumple cinco roles distintos según la API que se use.
- **Si dos servicios de un mismo proveedor cumplen el rol, se listan ambos.** Para relacional en AWS figuran RDS y Aurora. La elección fina entre ellos es parte del binding, no del diagrama.

## Panorama por familia

### Cómputo

El cómputo es la familia más madura y la más pareja entre proveedores. Los tres ofrecen el espectro completo: máquinas virtuales, grupos autoescalables, Kubernetes administrado, contenedores sin servidor, funciones, plataforma web, hosting estático, batch, orquestación de flujos y aceleradores.

Las diferencias están en la frontera entre contenedores y funciones. Google unificó ambos bajo Cloud Run (Cloud Functions ahora se llama Cloud Run functions). AWS los mantiene separados: Lambda para funciones y ECS con Fargate para contenedores. Azure tiene Functions y Container Apps, que pueden alojar funciones. Por eso Nimbo los modela como dos componentes distintos, `compute.function` y `compute.container`, y deja que el binding elija.

Quedan como extendidos:

- **Programador** (`compute.schedule`): AWS y Google tienen servicios dedicados (EventBridge Scheduler y Cloud Scheduler). Azure retiró Azure Scheduler y lo resuelve con disparadores de temporizador en Functions o recurrencias en Logic Apps.
- **Cómputo en el borde** (`compute.edge`): solo AWS permite correr código propio en los puntos de presencia del CDN (CloudFront Functions y Lambda@Edge). Front Door tiene un motor de reglas, pero no ejecuta código propio.
- **Nube en sitio** (`compute.hybrid`): Outposts, Azure Local y Google Distributed Cloud existen, pero difieren tanto en modelo de compra y servicios incluidos que no conviene tratarlos como equivalentes.

### Bases de datos

Los tres cubren todos los modelos de datos importantes: relacional, documental, clave-valor, columnar ancha, grafo, caché y vectorial. También ofrecen migración administrada.

El caso más interesante es Azure Cosmos DB, una sola base con varias APIs (NoSQL, MongoDB, Cassandra, Gremlin, Table) que cubre por sí sola varios componentes. En Google el grafo llegó con Spanner Graph, y la búsqueda vectorial está tanto en Vertex AI Vector Search como en AlloyDB con pgvector. Los tres proveedores permiten pgvector en su PostgreSQL administrado, lo que da una ruta portable para vectores.

Quedan como extendidos:

- **Series de tiempo** (`db.timeseries`): AWS tiene Timestream. Azure retiró Time Series Insights y hoy recomienda Azure Data Explorer. Google no tiene motor dedicado y se resuelve con Bigtable o BigQuery.
- **Motor de búsqueda** (`db.search`): AWS ofrece OpenSearch administrado y Azure tiene Azure AI Search. Google ofrece Vertex AI Search, que es una búsqueda de más alto nivel, pero no un OpenSearch o Elasticsearch propio.

Se descartó un componente de **base ledger**: AWS terminó el soporte de Amazon QLDB en 2025 y Google nunca tuvo uno. Solo queda la función ledger de Azure SQL Database, que es una característica, no un servicio.

### Almacenamiento

Es la familia más estandarizada. Objetos (S3, Blob Storage, Cloud Storage), disco de bloque, archivos compartidos, archivo frío, respaldo, data lake y transferencia masiva existen en los tres con roles casi idénticos. El archivo frío no es un servicio aparte en Azure ni en Google sino un nivel de su almacenamiento de objetos; para el diagrama da igual, porque el rol es el mismo.

### Analítica

Los tres tienen la cadena completa: warehouse (Redshift, Fabric o Synapse, BigQuery), ETL, procesamiento de streams, Spark administrado, consulta sobre el lago, BI y gobierno de datos (catálogo, linaje y calidad).

Lo que más cambió en los últimos años es el empaque. Microsoft concentra su oferta en Microsoft Fabric y Purview. AWS movió el catálogo y el linaje a Amazon SageMaker Catalog, y QuickSight pasó a ser Quick Sight dentro de Amazon Quick. Google unificó Data Catalog dentro de Dataplex Universal Catalog. Los nombres cambian, pero los roles son estables, que es justamente la razón para modelar roles.

### IA y ML

Es la familia que más creció y la que más cambia. Se divide en tres capas, y las tres son comunes:

- **IA generativa:** modelos fundacionales por API (Bedrock, Microsoft Foundry, Vertex AI), agentes administrados (Bedrock AgentCore, Foundry Agent Service, Vertex AI Agent Engine), bases de conocimiento para RAG y guardrails de seguridad (Bedrock Guardrails, Azure AI Content Safety, Model Armor).
- **Plataforma de ML:** entrenamiento, registro de modelos, endpoints de inferencia, pipelines, feature store y notebooks (SageMaker AI, Azure Machine Learning, Vertex AI).
- **APIs listas:** visión, voz, lenguaje natural, traducción y extracción de documentos.

Por lo rápido que cambian los nombres en esta familia (Azure AI Foundry pasó a llamarse Microsoft Foundry en noviembre de 2025), es la que más se beneficia de un lenguaje agnóstico. Conviene revisar sus equivalencias en cada versión.

### Mensajería e integración

Colas, topics, bus de eventos, streams, Kafka administrado, notificaciones push y conectores SaaS existen en los tres. Hay dos matices de diseño:

- Google no tiene un servicio llamado cola. Pub/Sub con suscripción pull o Cloud Tasks cumplen el rol de `msg.queue`.
- Pub/Sub no es un log reproducible por particiones como Kinesis o Event Hubs. Cuando el diseño depende de reprocesar el historial, conviene usar `msg.kafka`.

Quedan como extendidos el **correo transaccional** (Google Cloud no tiene uno propio) y el **hub IoT** (Google retiró Cloud IoT Core en 2023). `msg.api` y `msg.webhook` son notación: describen un contrato o un patrón, no un recurso.

### Red

Los conceptos de red son casi idénticos en los tres: red privada (VPC o VNet), zonas públicas, API gateway, balanceador, CDN, DNS, NAT, endpoints privados, interconexión de redes, VPN y enlace dedicado.

La excepción es el **service mesh**, que queda como extendido: AWS App Mesh deja de funcionar el 30 de septiembre de 2026, y AWS recomienda ECS Service Connect o VPC Lattice, que no son un mesh completo. Azure ofrece Istio como complemento de AKS, y Google tiene Cloud Service Mesh.

### Seguridad

Los diez componentes de seguridad son comunes: identidad y acceso, identidad de clientes, secretos, llaves de cifrado, certificados, firewall, WAF y anti-DDoS, políticas de organización, auditoría y postura de seguridad.

En Azure, Key Vault cubre tres componentes (secretos, llaves y certificados). En el diagrama siguen siendo tres iconos porque tienen relaciones distintas: una función lee un secreto, pero una base de datos usa una llave.

### Operación y DevOps

Observabilidad (métricas, logs, trazas, alertas), entrega (CI/CD, registro de artefactos, repositorio, infraestructura como código), configuración, costos y la unidad de cuenta o proyecto existen en los tres.

Dos cambios recientes hicieron posible que esta familia sea totalmente común. AWS devolvió CodeCommit a disponibilidad general a fines de 2025, y Google ofrece Secure Source Manager como repositorio Git administrado, porque Cloud Source Repositories ya no acepta clientes nuevos. En infraestructura como código, Google terminó el soporte de Deployment Manager el 31 de marzo de 2026 y su reemplazo es Infrastructure Manager, basado en Terraform.

### Actores externos

Usuario, navegador, app móvil, dispositivo y sistema externo. No son servicios, pero un diagrama sin ellos no explica quién usa el sistema. Son todos notación.

## Servicios que no son comunes

Estos servicios existen en uno o dos proveedores, o difieren tanto que no se pueden tratar como el mismo rol. La primera versión de Nimbo no los incluye como componentes. Algunos podrían entrar más adelante como extendidos.

| Servicio | AWS | Azure | Google Cloud | Motivo |
|---|---|---|---|---|
| SQL distribuido global | Aurora DSQL | Cosmos DB for PostgreSQL | Spanner | Modelos de consistencia y compatibilidad muy distintos |
| Base ledger | QLDB (soporte terminado en 2025) | Función ledger de Azure SQL | — | Ya no existe como servicio en ningún proveedor |
| GraphQL administrado | AppSync | GraphQL en API Management | — | Google no tiene un equivalente directo |
| Escritorios virtuales | WorkSpaces | Azure Virtual Desktop | — | Google no ofrece uno propio |
| Transcodificación de video | Elemental MediaConvert | — (Media Services se retiró en 2024) | Transcoder API | Azure ya no tiene servicio |
| Computación cuántica | Braket | Azure Quantum | — | Google no ofrece acceso administrado público |
| Blockchain administrado | Managed Blockchain | — | — | Solo AWS |
| Estación terrestre satelital | Ground Station | — | — | Solo AWS |
| Centro de contacto | Amazon Connect | Azure Communication Services, Dynamics 365 Contact Center | Customer Engagement Suite | Productos de negocio con alcances distintos |
| Modernización de mainframe | Mainframe Modernization | Soluciones de socios | Soluciones de socios | Solo AWS tiene un servicio propio |

## Cambios recientes que afectan las equivalencias

Estos cambios ya están reflejados en la tabla. Son el tipo de evento que obliga a revisar el catálogo en cada versión.

| Fecha | Proveedor | Cambio | Efecto en Nimbo |
|---|---|---|---|
| 2023 | Google | Retiro de Cloud IoT Core | `msg.iot` es extendido |
| 2024 | Azure | Retiro de Media Services | Transcodificación queda fuera |
| 2024 | Google | Cloud Functions pasa a llamarse Cloud Run functions | Cambia el nombre en `compute.function` |
| 2024 | Google | Cloud Source Repositories deja de aceptar clientes nuevos | `ops.repo` usa Secure Source Manager |
| 2024 | Azure | Azure Stack HCI pasa a llamarse Azure Local | Cambia el nombre en `compute.hybrid` |
| 2025 | Azure | Retiro de Time Series Insights | `db.timeseries` usa Azure Data Explorer |
| 2025 | AWS | Fin de soporte de Amazon QLDB | Se descarta el componente ledger |
| 2025 | Azure | Azure AI Foundry pasa a llamarse Microsoft Foundry | Cambia el nombre en las equivalencias de IA |
| 2025 | AWS | CodeCommit vuelve a disponibilidad general | `ops.repo` queda como núcleo |
| 2025 y 2026 | AWS | QuickSight pasa a ser Quick Sight dentro de Amazon Quick | Cambia el nombre en `analytics.bi` |
| 2026 | Google | Fin de soporte de Deployment Manager (31 de marzo) | `ops.iac` usa Infrastructure Manager |
| 2026 | AWS | Fin de App Mesh (30 de septiembre) | `net.mesh` es extendido |
| En curso | Azure | Retiro de Azure Cache for Redis | `db.cache` usa Azure Managed Redis |
| En curso | Google | Data Catalog pasa a Dataplex Universal Catalog | Cambia el nombre en `analytics.catalog` |

## Cómo sumar otro proveedor

El diseño está pensado para crecer más allá de los tres grandes. Para agregar Oracle Cloud, IBM Cloud, Alibaba Cloud, Huawei Cloud o un proveedor regional:

1. Crear `spec/bindings/<proveedor>.json` con la misma estructura que `aws.json`.
2. Llenar el servicio para cada componente. Los que no tengan equivalente se omiten.
3. Correr `npm run build`. La validación avisará qué componentes núcleo quedaron sin equivalencia en el nuevo proveedor.
4. Decidir, componente por componente, si el núcleo sigue siendo núcleo o pasa a extendido. El criterio de las cuatro condiciones sigue aplicando.

## Lo que queda para después

- **Costos.** Cada equivalencia necesita supuestos de uso (peticiones, GB, horas) y precios leídos de las APIs oficiales de cada proveedor. Va en una versión posterior.
- **Diferencias finas.** Hoy la tabla anota diferencias en texto. Una versión futura puede declararlas como capacidades (`fifo`, `exactly_once`, `replay`) para que la herramienta avise cuando un diseño las necesita y un proveedor no las ofrece.
- **Revisión periódica.** Conviene revisar el catálogo cada trimestre, empezando por IA y ML, que es la familia que más cambia.

## Fuentes

- [AWS CodeCommit returns to general availability (AWS DevOps Blog)](https://aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability)
- [AWS CodeCommit GA (InfoQ)](https://infoq.com/news/2025/12/aws-codecommit-ga)
- [What is AWS App Mesh (documentación de AWS)](https://docs.aws.amazon.com/app-mesh/latest/userguide/what-is-app-mesh.html)
- [AWS App Mesh shutdown, September 2026](https://privatedevops.com/news/aws-app-mesh-shutdown-september-2026)
- [Amazon QuickSight evoluciona a Amazon Quick Suite (AWS Blog, japonés)](https://aws.amazon.com/jp/blogs/news/reimagine-business-intelligence-amazon-quicksight-evolves-to-amazon-quick-suite)
- [Amazon Quick Suite renombrado a Amazon Quick (Serverworks)](https://blog.serverworks.co.jp/amazon-quick-suite-renamed-to-amazon-quick)
- [Azure Time Series Insights will be retired (Azure Updates)](https://azure.microsoft.com/updates/we-ll-retire-azure-time-series-insights-on-31-of-march-2025/)
- [Retiro de Azure Cache for Redis (Microsoft Tech Community)](https://techcommunity.microsoft.com/blog/azure-managed-redis/-/4458721)
- [Foundry gets new name (Directions on Microsoft)](https://www.directionsonmicrosoft.com/reports/foundry-gets-new-name-anthropic-models/)
- [Microsoft Ignite 2025: ten things you need to know (Directions on Microsoft)](https://www.directionsonmicrosoft.com/microsoft-ignite-2025-ten-things-you-need-to-know/)
- [Deployment Manager deprecations (documentación de Google Cloud)](https://docs.cloud.google.com/deployment-manager/docs/deprecations)
- [Secure Source Manager (documentación de Google Cloud)](https://docs.cloud.google.com/secure-source-manager/docs/resources)
- [Wing: the startup failed, but the language has potential (The New Stack)](https://thenewstack.io/wing-the-startup-failed-but-the-language-has-potential/)
