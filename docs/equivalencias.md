<!-- Archivo generado por scripts/build.mjs a partir de spec/. No lo edites a mano. -->
# Tabla de equivalencias

Cada componente del lenguaje y el servicio que lo implementa en cada proveedor. Revisado: Amazon Web Services 2026-10, Microsoft Azure 2026-10, Google Cloud 2026-10.

- **Núcleo:** los 3 proveedores tienen un servicio administrado con el mismo rol.
- **Extendido:** existe en algunos proveedores, o la equivalencia tiene diferencias importantes.
- **Notación:** elemento del lenguaje sin servicio que lo respalde.

| Familia | Núcleo | Extendido | Notación |
|---|---:|---:|---:|
| Cómputo | 10 | 3 | 0 |
| Bases de datos | 8 | 2 | 0 |
| Almacenamiento | 7 | 0 | 0 |
| Analítica | 9 | 0 | 0 |
| IA y ML | 15 | 0 | 0 |
| Mensajería e integración | 7 | 2 | 2 |
| Red | 11 | 1 | 0 |
| Seguridad | 10 | 0 | 0 |
| Operación y DevOps | 11 | 0 | 0 |
| Actores externos | 0 | 0 | 5 |
| **Total** | **88** | **8** | **7** |

## Cómputo

Donde corre el código: funciones, contenedores, máquinas y orquestación.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/compute/compute.function.svg" width="28" alt=""> | **Función**<br>`compute.function` | Núcleo | AWS Lambda | Azure Functions | Cloud Run functions |
| <img src="../icons/compute/compute.container.svg" width="28" alt=""> | **Contenedor serverless**<br>`compute.container` | Núcleo | Amazon ECS en AWS Fargate | Azure Container Apps | Cloud Run |
| <img src="../icons/compute/compute.vm.svg" width="28" alt=""> | **Máquina virtual**<br>`compute.vm` | Núcleo | Amazon EC2 | Azure Virtual Machines | Compute Engine |
| <img src="../icons/compute/compute.autoscale.svg" width="28" alt=""> | **Grupo autoescalable**<br>`compute.autoscale` | Núcleo | Amazon EC2 Auto Scaling | Azure Virtual Machine Scale Sets | Managed Instance Groups |
| <img src="../icons/compute/compute.cluster.svg" width="28" alt=""> | **Kubernetes**<br>`compute.cluster` | Núcleo | Amazon EKS | Azure Kubernetes Service (AKS) | Google Kubernetes Engine (GKE) |
| <img src="../icons/compute/compute.webapp.svg" width="28" alt=""> | **Aplicación web administrada**<br>`compute.webapp` | Núcleo | AWS Elastic Beanstalk | Azure App Service | App Engine |
| <img src="../icons/compute/compute.static.svg" width="28" alt=""> | **Sitio estático**<br>`compute.static` | Núcleo | AWS Amplify Hosting | Azure Static Web Apps | Firebase Hosting |
| <img src="../icons/compute/compute.batch.svg" width="28" alt=""> | **Proceso batch**<br>`compute.batch` | Núcleo | AWS Batch | Azure Batch | Batch |
| <img src="../icons/compute/compute.workflow.svg" width="28" alt=""> | **Orquestador**<br>`compute.workflow` | Núcleo | AWS Step Functions | Azure Logic Apps / Durable Functions | Workflows |
| <img src="../icons/compute/compute.schedule.svg" width="28" alt=""> | **Programador**<br>`compute.schedule` | Extendido | Amazon EventBridge Scheduler | Disparador de temporizador en Azure Functions / recurrencia en Logic Apps | Cloud Scheduler |
| <img src="../icons/compute/compute.accelerator.svg" width="28" alt=""> | **Acelerador GPU**<br>`compute.accelerator` | Núcleo | Instancias EC2 con GPU, AWS Trainium e Inferentia | Máquinas virtuales serie N | GPU y Cloud TPU |
| <img src="../icons/compute/compute.edge.svg" width="28" alt=""> | **Cómputo en el borde**<br>`compute.edge` | Extendido | Amazon CloudFront Functions / Lambda@Edge | Motor de reglas de Azure Front Door (sin código propio) | — |
| <img src="../icons/compute/compute.hybrid.svg" width="28" alt=""> | **Nube en sitio**<br>`compute.hybrid` | Extendido | AWS Outposts | Azure Local | Google Distributed Cloud |

- `compute.function`: Cloud Functions pasó a llamarse Cloud Run functions en 2024.
- `compute.schedule`: Azure no tiene un servicio de programación independiente desde que retiró Azure Scheduler; se resuelve con disparadores.
- `compute.edge`: Solo AWS ofrece ejecutar código propio en el borde como servicio nativo.
- `compute.hybrid`: Los tres existen pero difieren mucho en modelo de compra y servicios incluidos. Azure Stack HCI se renombró Azure Local.

## Bases de datos

Motores administrados por modelo de datos.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/db/db.relational.svg" width="28" alt=""> | **Relacional**<br>`db.relational` | Núcleo | Amazon RDS / Amazon Aurora | Azure SQL Database / Azure Database for PostgreSQL y MySQL | Cloud SQL / AlloyDB |
| <img src="../icons/db/db.document.svg" width="28" alt=""> | **Documental**<br>`db.document` | Núcleo | Amazon DocumentDB | Azure Cosmos DB (NoSQL / MongoDB) | Firestore |
| <img src="../icons/db/db.keyvalue.svg" width="28" alt=""> | **Clave-valor**<br>`db.keyvalue` | Núcleo | Amazon DynamoDB | Azure Cosmos DB (Table) / Table Storage | Bigtable / Firestore |
| <img src="../icons/db/db.widecolumn.svg" width="28" alt=""> | **Columnar ancha**<br>`db.widecolumn` | Núcleo | Amazon Keyspaces | Azure Managed Instance for Apache Cassandra | Bigtable |
| <img src="../icons/db/db.graph.svg" width="28" alt=""> | **Grafo**<br>`db.graph` | Núcleo | Amazon Neptune | Azure Cosmos DB for Apache Gremlin | Spanner Graph |
| <img src="../icons/db/db.vector.svg" width="28" alt=""> | **Vectorial**<br>`db.vector` | Núcleo | Amazon S3 Vectors / OpenSearch Service | Azure AI Search / Cosmos DB (vectores) | Vertex AI Vector Search / AlloyDB (pgvector) |
| <img src="../icons/db/db.cache.svg" width="28" alt=""> | **Caché en memoria**<br>`db.cache` | Núcleo | Amazon ElastiCache / MemoryDB | Azure Managed Redis | Memorystore |
| <img src="../icons/db/db.timeseries.svg" width="28" alt=""> | **Series de tiempo**<br>`db.timeseries` | Extendido | Amazon Timestream | Azure Data Explorer | — |
| <img src="../icons/db/db.search.svg" width="28" alt=""> | **Motor de búsqueda**<br>`db.search` | Extendido | Amazon OpenSearch Service | Azure AI Search | Vertex AI Search |
| <img src="../icons/db/db.migration.svg" width="28" alt=""> | **Migración de bases**<br>`db.migration` | Núcleo | AWS Database Migration Service | Azure Database Migration Service | Database Migration Service |

- `db.keyvalue`: En Google la elección depende del patrón: Bigtable para volumen, Firestore para apps.
- `db.vector`: Los tres también permiten pgvector en su PostgreSQL administrado.
- `db.cache`: Azure Cache for Redis está en retiro; su reemplazo es Azure Managed Redis.
- `db.timeseries`: Google no tiene motor dedicado; se resuelve con Bigtable o BigQuery. Azure Time Series Insights se retiró en 2025.
- `db.search`: Vertex AI Search es una búsqueda administrada de alto nivel; Google no ofrece OpenSearch o Elasticsearch propio.

## Almacenamiento

Objetos, discos, archivos, archivo frío, respaldo y transferencia.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/storage/storage.object.svg" width="28" alt=""> | **Objetos**<br>`storage.object` | Núcleo | Amazon S3 | Azure Blob Storage | Cloud Storage |
| <img src="../icons/storage/storage.block.svg" width="28" alt=""> | **Disco de bloque**<br>`storage.block` | Núcleo | Amazon EBS | Azure Managed Disks | Persistent Disk / Hyperdisk |
| <img src="../icons/storage/storage.file.svg" width="28" alt=""> | **Archivos compartidos**<br>`storage.file` | Núcleo | Amazon EFS / Amazon FSx | Azure Files / Azure NetApp Files | Filestore |
| <img src="../icons/storage/storage.archive.svg" width="28" alt=""> | **Archivo frío**<br>`storage.archive` | Núcleo | Amazon S3 Glacier | Nivel Archive de Blob Storage | Clase Archive de Cloud Storage |
| <img src="../icons/storage/storage.backup.svg" width="28" alt=""> | **Respaldo**<br>`storage.backup` | Núcleo | AWS Backup | Azure Backup | Backup and DR Service |
| <img src="../icons/storage/storage.lake.svg" width="28" alt=""> | **Data lake**<br>`storage.lake` | Núcleo | Amazon S3 + AWS Lake Formation | Azure Data Lake Storage / OneLake | Cloud Storage + BigLake |
| <img src="../icons/storage/storage.transfer.svg" width="28" alt=""> | **Transferencia**<br>`storage.transfer` | Núcleo | AWS DataSync / AWS Transfer Family | Azure Storage Mover / Azure Data Box | Storage Transfer Service / Transfer Appliance |

## Analítica

Warehouse, pipelines, procesamiento y gobierno de datos.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/analytics/analytics.warehouse.svg" width="28" alt=""> | **Data warehouse**<br>`analytics.warehouse` | Núcleo | Amazon Redshift | Microsoft Fabric Data Warehouse / Azure Synapse Analytics | BigQuery |
| <img src="../icons/analytics/analytics.etl.svg" width="28" alt=""> | **ETL / pipeline**<br>`analytics.etl` | Núcleo | AWS Glue | Azure Data Factory | Dataflow / Cloud Data Fusion |
| <img src="../icons/analytics/analytics.streaming.svg" width="28" alt=""> | **Procesamiento de streams**<br>`analytics.streaming` | Núcleo | Amazon Managed Service for Apache Flink | Azure Stream Analytics | Dataflow |
| <img src="../icons/analytics/analytics.distributed.svg" width="28" alt=""> | **Procesamiento distribuido**<br>`analytics.distributed` | Núcleo | Amazon EMR | Azure Databricks / Azure HDInsight | Dataproc |
| <img src="../icons/analytics/analytics.query.svg" width="28" alt=""> | **Consulta sobre el lago**<br>`analytics.query` | Núcleo | Amazon Athena | Microsoft Fabric / Synapse SQL sin servidor | BigQuery (tablas externas y BigLake) |
| <img src="../icons/analytics/analytics.bi.svg" width="28" alt=""> | **Tablero BI**<br>`analytics.bi` | Núcleo | Amazon Quick Sight | Power BI | Looker / Looker Studio |
| <img src="../icons/analytics/analytics.catalog.svg" width="28" alt=""> | **Catálogo de datos**<br>`analytics.catalog` | Núcleo | AWS Glue Data Catalog / Amazon SageMaker Catalog | Microsoft Purview | Dataplex Universal Catalog |
| <img src="../icons/analytics/analytics.lineage.svg" width="28" alt=""> | **Linaje**<br>`analytics.lineage` | Núcleo | Amazon SageMaker Catalog (linaje) | Microsoft Purview (linaje) | Dataplex (linaje de datos) |
| <img src="../icons/analytics/analytics.quality.svg" width="28" alt=""> | **Calidad de datos**<br>`analytics.quality` | Núcleo | AWS Glue Data Quality | Microsoft Purview (calidad de datos) | Dataplex (calidad de datos) |

- `analytics.bi`: QuickSight pasó a formar parte de Amazon Quick (antes Quick Suite) y se escribe Quick Sight.
- `analytics.catalog`: Google Data Catalog fue absorbido por Dataplex Universal Catalog.

## IA y ML

Modelos fundacionales, plataforma de ML y APIs de IA listas.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/ai/ai.llm.svg" width="28" alt=""> | **Modelos fundacionales**<br>`ai.llm` | Núcleo | Amazon Bedrock | Microsoft Foundry | Vertex AI (Gemini y Model Garden) |
| <img src="../icons/ai/ai.agent.svg" width="28" alt=""> | **Agente**<br>`ai.agent` | Núcleo | Amazon Bedrock AgentCore | Foundry Agent Service | Vertex AI Agent Engine |
| <img src="../icons/ai/ai.knowledge.svg" width="28" alt=""> | **Base de conocimiento**<br>`ai.knowledge` | Núcleo | Amazon Bedrock Knowledge Bases | Azure AI Search (recuperación agéntica) / Foundry | Vertex AI RAG Engine |
| <img src="../icons/ai/ai.guardrail.svg" width="28" alt=""> | **Guardrails**<br>`ai.guardrail` | Núcleo | Amazon Bedrock Guardrails | Azure AI Content Safety | Model Armor |
| <img src="../icons/ai/ai.model.svg" width="28" alt=""> | **Registro de modelos**<br>`ai.model` | Núcleo | Amazon SageMaker AI Model Registry | Registros de Azure Machine Learning | Vertex AI Model Registry |
| <img src="../icons/ai/ai.training.svg" width="28" alt=""> | **Entrenamiento**<br>`ai.training` | Núcleo | Amazon SageMaker AI (entrenamiento) | Azure Machine Learning | Vertex AI Training |
| <img src="../icons/ai/ai.inference.svg" width="28" alt=""> | **Inferencia**<br>`ai.inference` | Núcleo | Endpoints de Amazon SageMaker AI | Endpoints en línea de Azure Machine Learning | Endpoints de Vertex AI |
| <img src="../icons/ai/ai.pipeline.svg" width="28" alt=""> | **Pipeline de ML**<br>`ai.pipeline` | Núcleo | Amazon SageMaker Pipelines | Pipelines de Azure Machine Learning | Vertex AI Pipelines |
| <img src="../icons/ai/ai.features.svg" width="28" alt=""> | **Feature store**<br>`ai.features` | Núcleo | Amazon SageMaker Feature Store | Feature store de Azure Machine Learning | Vertex AI Feature Store |
| <img src="../icons/ai/ai.notebook.svg" width="28" alt=""> | **Notebook**<br>`ai.notebook` | Núcleo | Amazon SageMaker Unified Studio | Notebooks de Azure Machine Learning | Vertex AI Workbench / Colab Enterprise |
| <img src="../icons/ai/ai.vision.svg" width="28" alt=""> | **Visión**<br>`ai.vision` | Núcleo | Amazon Rekognition | Azure AI Vision | Cloud Vision API |
| <img src="../icons/ai/ai.speech.svg" width="28" alt=""> | **Voz**<br>`ai.speech` | Núcleo | Amazon Transcribe / Amazon Polly | Azure AI Speech | Speech-to-Text / Text-to-Speech |
| <img src="../icons/ai/ai.nlp.svg" width="28" alt=""> | **Lenguaje natural**<br>`ai.nlp` | Núcleo | Amazon Comprehend | Azure AI Language | Cloud Natural Language API |
| <img src="../icons/ai/ai.translate.svg" width="28" alt=""> | **Traducción**<br>`ai.translate` | Núcleo | Amazon Translate | Azure AI Translator | Cloud Translation |
| <img src="../icons/ai/ai.document.svg" width="28" alt=""> | **Extracción de documentos**<br>`ai.document` | Núcleo | Amazon Textract | Azure AI Document Intelligence | Document AI |

- `ai.llm`: Azure AI Foundry se renombró Microsoft Foundry en noviembre de 2025.

## Mensajería e integración

Colas, eventos, streams y conectores.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/msg/msg.queue.svg" width="28" alt=""> | **Cola**<br>`msg.queue` | Núcleo | Amazon SQS | Azure Service Bus (colas) / Queue Storage | Cloud Tasks / Pub/Sub (suscripción pull) |
| <img src="../icons/msg/msg.topic.svg" width="28" alt=""> | **Topic**<br>`msg.topic` | Núcleo | Amazon SNS | Azure Service Bus (topics) | Pub/Sub |
| <img src="../icons/msg/msg.bus.svg" width="28" alt=""> | **Bus de eventos**<br>`msg.bus` | Núcleo | Amazon EventBridge | Azure Event Grid | Eventarc |
| <img src="../icons/msg/msg.stream.svg" width="28" alt=""> | **Stream**<br>`msg.stream` | Núcleo | Amazon Kinesis Data Streams | Azure Event Hubs | Pub/Sub (con orden por clave) |
| <img src="../icons/msg/msg.kafka.svg" width="28" alt=""> | **Kafka**<br>`msg.kafka` | Núcleo | Amazon MSK | Azure Event Hubs (endpoint Kafka) | Managed Service for Apache Kafka |
| <img src="../icons/msg/msg.notify.svg" width="28" alt=""> | **Notificaciones push**<br>`msg.notify` | Núcleo | Amazon SNS (push móvil) | Azure Notification Hubs | Firebase Cloud Messaging |
| <img src="../icons/msg/msg.connector.svg" width="28" alt=""> | **Conector SaaS**<br>`msg.connector` | Núcleo | Amazon AppFlow | Conectores de Azure Logic Apps | Application Integration |
| <img src="../icons/msg/msg.email.svg" width="28" alt=""> | **Correo**<br>`msg.email` | Extendido | Amazon SES | Azure Communication Services (correo) | — |
| <img src="../icons/msg/msg.iot.svg" width="28" alt=""> | **Hub IoT**<br>`msg.iot` | Extendido | AWS IoT Core | Azure IoT Hub | — |
| <img src="../icons/msg/msg.api.svg" width="28" alt=""> | **API (contrato)**<br>`msg.api` | Notación | — | — | — |
| <img src="../icons/msg/msg.webhook.svg" width="28" alt=""> | **Webhook**<br>`msg.webhook` | Notación | — | — | — |

- `msg.queue`: Google no tiene un servicio llamado cola de mensajes; Pub/Sub con suscripción pull cumple el rol.
- `msg.stream`: Pub/Sub no es un log reproducible por particiones como Kinesis o Event Hubs; para eso usar msg.kafka.
- `msg.kafka`: Event Hubs habla el protocolo Kafka, pero no es Kafka completo.
- `msg.email`: Google Cloud no tiene envío de correo propio; se usa un proveedor externo.
- `msg.iot`: Google retiró Cloud IoT Core en 2023.
- `msg.api`: Es documentación del lenguaje: describe la interfaz, no crea un recurso.
- `msg.webhook`: Patrón, no servicio. Se implementa con una función y una cola.

## Red

Zonas, entrada, distribución y conectividad.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/net/net.private.svg" width="28" alt=""> | **Red privada**<br>`net.private` | Núcleo | Amazon VPC | Azure Virtual Network | VPC |
| <img src="../icons/net/net.public.svg" width="28" alt=""> | **Zona pública**<br>`net.public` | Núcleo | Subred pública de VPC | Subred con IP pública | Subred con IP externa |
| <img src="../icons/net/net.gateway.svg" width="28" alt=""> | **API gateway**<br>`net.gateway` | Núcleo | Amazon API Gateway | Azure API Management | API Gateway / Apigee |
| <img src="../icons/net/net.loadbalancer.svg" width="28" alt=""> | **Balanceador**<br>`net.loadbalancer` | Núcleo | Elastic Load Balancing | Azure Load Balancer / Application Gateway | Cloud Load Balancing |
| <img src="../icons/net/net.cdn.svg" width="28" alt=""> | **CDN**<br>`net.cdn` | Núcleo | Amazon CloudFront | Azure Front Door | Cloud CDN |
| <img src="../icons/net/net.dns.svg" width="28" alt=""> | **DNS**<br>`net.dns` | Núcleo | Amazon Route 53 | Azure DNS | Cloud DNS |
| <img src="../icons/net/net.nat.svg" width="28" alt=""> | **Salida NAT**<br>`net.nat` | Núcleo | NAT Gateway | Azure NAT Gateway | Cloud NAT |
| <img src="../icons/net/net.privatelink.svg" width="28" alt=""> | **Endpoint privado**<br>`net.privatelink` | Núcleo | AWS PrivateLink | Azure Private Link | Private Service Connect |
| <img src="../icons/net/net.peering.svg" width="28" alt=""> | **Interconexión de redes**<br>`net.peering` | Núcleo | VPC Peering / AWS Transit Gateway | VNet peering / Azure Virtual WAN | VPC Network Peering / Network Connectivity Center |
| <img src="../icons/net/net.vpn.svg" width="28" alt=""> | **VPN**<br>`net.vpn` | Núcleo | AWS Site-to-Site VPN | Azure VPN Gateway | Cloud VPN |
| <img src="../icons/net/net.dedicated.svg" width="28" alt=""> | **Enlace dedicado**<br>`net.dedicated` | Núcleo | AWS Direct Connect | Azure ExpressRoute | Cloud Interconnect |
| <img src="../icons/net/net.mesh.svg" width="28" alt=""> | **Service mesh**<br>`net.mesh` | Extendido | Amazon VPC Lattice / ECS Service Connect | Complemento Istio para AKS | Cloud Service Mesh |

- `net.cdn`: Azure CDN clásico se reemplaza por Azure Front Door.
- `net.mesh`: AWS App Mesh deja de funcionar el 30 de septiembre de 2026.

## Seguridad

Identidad, secretos, cifrado, perímetro y cumplimiento.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/sec/sec.identity.svg" width="28" alt=""> | **Identidad y acceso**<br>`sec.identity` | Núcleo | AWS IAM / IAM Identity Center | Microsoft Entra ID + Azure RBAC | Cloud IAM |
| <img src="../icons/sec/sec.customer.svg" width="28" alt=""> | **Identidad de clientes**<br>`sec.customer` | Núcleo | Amazon Cognito | Microsoft Entra External ID | Identity Platform |
| <img src="../icons/sec/sec.vault.svg" width="28" alt=""> | **Bóveda de secretos**<br>`sec.vault` | Núcleo | AWS Secrets Manager | Azure Key Vault (secretos) | Secret Manager |
| <img src="../icons/sec/sec.kms.svg" width="28" alt=""> | **Llaves de cifrado**<br>`sec.kms` | Núcleo | AWS KMS | Azure Key Vault (llaves) / Managed HSM | Cloud KMS |
| <img src="../icons/sec/sec.certificate.svg" width="28" alt=""> | **Certificados**<br>`sec.certificate` | Núcleo | AWS Certificate Manager | Azure Key Vault (certificados) | Certificate Manager |
| <img src="../icons/sec/sec.firewall.svg" width="28" alt=""> | **Firewall**<br>`sec.firewall` | Núcleo | AWS Network Firewall / Security Groups | Azure Firewall / Network Security Groups | Cloud NGFW / reglas de firewall de VPC |
| <img src="../icons/sec/sec.protection.svg" width="28" alt=""> | **WAF y anti-DDoS**<br>`sec.protection` | Núcleo | AWS WAF / AWS Shield | Azure Web Application Firewall / Azure DDoS Protection | Google Cloud Armor |
| <img src="../icons/sec/sec.policy.svg" width="28" alt=""> | **Políticas de organización**<br>`sec.policy` | Núcleo | AWS Organizations (SCP) | Azure Policy | Organization Policy Service |
| <img src="../icons/sec/sec.audit.svg" width="28" alt=""> | **Auditoría**<br>`sec.audit` | Núcleo | AWS CloudTrail | Registro de actividad de Azure | Cloud Audit Logs |
| <img src="../icons/sec/sec.posture.svg" width="28" alt=""> | **Postura y amenazas**<br>`sec.posture` | Núcleo | AWS Security Hub / Amazon GuardDuty | Microsoft Defender for Cloud | Security Command Center |

## Operación y DevOps

Observabilidad, entrega, configuración y costos.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/ops/ops.metrics.svg" width="28" alt=""> | **Métricas**<br>`ops.metrics` | Núcleo | Amazon CloudWatch | Azure Monitor (métricas) | Cloud Monitoring |
| <img src="../icons/ops/ops.logs.svg" width="28" alt=""> | **Logs**<br>`ops.logs` | Núcleo | Amazon CloudWatch Logs | Azure Monitor Logs (Log Analytics) | Cloud Logging |
| <img src="../icons/ops/ops.traces.svg" width="28" alt=""> | **Trazas**<br>`ops.traces` | Núcleo | AWS X-Ray / CloudWatch Application Signals | Application Insights | Cloud Trace |
| <img src="../icons/ops/ops.alerts.svg" width="28" alt=""> | **Alertas**<br>`ops.alerts` | Núcleo | Alarmas de Amazon CloudWatch | Alertas de Azure Monitor | Alertas de Cloud Monitoring |
| <img src="../icons/ops/ops.cicd.svg" width="28" alt=""> | **CI/CD**<br>`ops.cicd` | Núcleo | AWS CodePipeline / AWS CodeBuild | Azure Pipelines | Cloud Build / Cloud Deploy |
| <img src="../icons/ops/ops.registry.svg" width="28" alt=""> | **Registro de artefactos**<br>`ops.registry` | Núcleo | Amazon ECR | Azure Container Registry | Artifact Registry |
| <img src="../icons/ops/ops.repo.svg" width="28" alt=""> | **Repositorio de código**<br>`ops.repo` | Núcleo | AWS CodeCommit | Azure Repos | Secure Source Manager |
| <img src="../icons/ops/ops.iac.svg" width="28" alt=""> | **Infraestructura como código**<br>`ops.iac` | Núcleo | AWS CloudFormation | Bicep / Azure Resource Manager | Infrastructure Manager (Terraform) |
| <img src="../icons/ops/ops.config.svg" width="28" alt=""> | **Configuración**<br>`ops.config` | Núcleo | AWS AppConfig / Parameter Store | Azure App Configuration | Parameter Manager |
| <img src="../icons/ops/ops.cost.svg" width="28" alt=""> | **Costos**<br>`ops.cost` | Núcleo | AWS Cost Explorer / AWS Budgets | Microsoft Cost Management | Cloud Billing (informes y presupuestos) |
| <img src="../icons/ops/ops.account.svg" width="28" alt=""> | **Cuenta / proyecto**<br>`ops.account` | Núcleo | Cuenta de AWS (AWS Organizations) | Suscripción y grupo de administración | Proyecto y carpeta de Resource Manager |

- `ops.registry`: Google Container Registry se apagó; su reemplazo es Artifact Registry.
- `ops.repo`: CodeCommit volvió a disponibilidad general a fines de 2025. Cloud Source Repositories no acepta clientes nuevos.
- `ops.iac`: Deployment Manager terminó su soporte el 31 de marzo de 2026.

## Actores externos

Lo que está fuera del sistema y lo usa.

| Icono | Componente | Nivel | Amazon Web Services | Microsoft Azure | Google Cloud |
|---|---|---|---|---|---|
| <img src="../icons/actor/actor.user.svg" width="28" alt=""> | **Usuario**<br>`actor.user` | Notación | — | — | — |
| <img src="../icons/actor/actor.web.svg" width="28" alt=""> | **Navegador**<br>`actor.web` | Notación | — | — | — |
| <img src="../icons/actor/actor.mobile.svg" width="28" alt=""> | **App móvil**<br>`actor.mobile` | Notación | — | — | — |
| <img src="../icons/actor/actor.iot.svg" width="28" alt=""> | **Dispositivo**<br>`actor.iot` | Notación | — | — | — |
| <img src="../icons/actor/actor.external.svg" width="28" alt=""> | **Sistema externo**<br>`actor.external` | Notación | — | — | — |

