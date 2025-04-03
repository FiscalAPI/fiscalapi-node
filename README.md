# FiscalAPI SDK para Node.js

[![npm](https://img.shields.io/npm/v/fiscalapi.svg)](https://www.npmjs.com/package/fiscalapi)
[![License](https://img.shields.io/github/license/FiscalAPI/fiscalapi-node)](https://github.com/FiscalAPI/fiscalapi-node/blob/master/LICENSE.txt) 

**SDK oficial de FiscalAPI para Node.js**, la API de facturación CFDI y otros servicios fiscales en México. Simplifica la integración con los servicios de facturación electrónica, eliminando las complejidades del SAT y facilitando la generación de facturas, notas de crédito, complementos de pago, nómina, carta porte, y más. ¡Factura sin dolor!

## 🚀 Características

- Soporte completo para **CFDI 4.0**  
- Compatible con múltiples versiones de Node.js (desde **Node.js 12.0.0**)
- Soporte para ESM y CommonJS
- Operaciones asíncronas con Promises
- Dos modos de operación: **Por valores** o **Por referencias**
- Manejo simplificado de errores
- Búsqueda en catálogos del SAT
- Tipos TypeScript completos
- Documentación completa y ejemplos prácticos

## 📦 Instalación

**npm**:

```bash
npm install fiscalapi
```

**yarn**:

```bash
yarn add fiscalapi
```

## ⚙️ Configuración

Puedes usar el SDK tanto en aplicaciones Node.js tradicionales como en frameworks modernos (Express, NestJS, Next.js, etc.). A continuación se describen ambas formas:

### A) Aplicaciones Node.js tradicionales

1. **Crea tu objeto de configuración** con [tus credenciales](https://docs.fiscalapi.com/credentials-info):
    ```javascript
    // CommonJS
    const { FiscalapiClient } = require('fiscalapi');

    // o ESM
    import { FiscalapiClient } from 'fiscalapi';

    const settings = {
        apiUrl: "https://test.fiscalapi.com", // https://live.fiscalapi.com (producción)
        apiKey: "<tu_api_key>",
        tenant: "<tenant>"
    };
    ```

2. **Crea la instancia del cliente**:
    ```javascript
    const fiscalApi = FiscalapiClient.create(settings);
    ```

Para ejemplos completos, consulta [samples-express](https://github.com/FiscalAPI/fiscalapi-samples-express).

---

### B) Aplicaciones con Frameworks Modernos (Express, NestJS, etc.)

1. **Agrega la configuración** en tu archivo de variables de entorno (`.env`):
    ```
    FISCALAPI_API_KEY=<api_key>
    FISCALAPI_TENANT=<tenant>
    FISCALAPI_API_URL=https://test.fiscalapi.com
    ```

2. **Crea y registra el cliente** (por ejemplo, en un servicio o módulo):

    ```typescript
   // services/fiscalapi.service.ts
    import { FiscalapiClient } from 'fiscalapi' 
    import config from '../config/config';
    
    export const createFiscalApiClient = () => {    
        return FiscalapiClient.create({
            apiUrl: config.fiscalapiSettings.apiUrl,
            apiKey: config.fiscalapiSettings.apiKey,
            tenant: config.fiscalapiSettings.tenant
        });
    };
    ```

En Express:
```javascript
// En tu controlador o router
import { createFiscalApiClient } from '../services/fiscalapi.service';

const fiscalapi = createFiscalApiClient();

app.post('/invoices', async (req, res) => {
    try {
        const response = await fiscalapi.invoices.create(req.body);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

Para más ejemplos, revisa [samples-express](https://github.com/FiscalAPI/fiscalapi-samples-express).


## 🔄 Modos de Operación

FiscalAPI admite dos [modos de operación](https://docs.fiscalapi.com/modes-of-operation):

- **Por Referencias**: Envía solo IDs de objetos previamente creados en el dashboard de FiscalAPI.  
  Ideal para integraciones ligeras.

- **Por Valores**: Envía todos los campos requeridos en cada petición, con mayor control sobre los datos.  
  No se requiere configuración previa en el dashboard.


## 📝 Ejemplos de Uso

A continuación se muestran algunos ejemplos básicos para ilustrar cómo utilizar el SDK. Puedes encontrar más ejemplos en la [documentación oficial](https://docs.fiscalapi.com).

### 1. Crear una Persona (Emisor o Receptor)

```javascript
const fiscalApi = FiscalApiClient.create(settings);

const request = {
    legalName: "Persona de Prueba",
    email: "someone@somewhere.com",
    password: "YourStrongPassword123!",
};

try {
    const apiResponse = await fiscalApi.persons.create(request);
    console.log(apiResponse.data);
} catch (error) {
    console.error(error);
}
```

### 2. Subir Certificados CSD
[Descarga certificados de prueba](https://docs.fiscalapi.com/tax-files-info)

```javascript
const fiscalApi = FiscalApiClient.create(settings);

const certificadoCsd = {
    personId: "984708c4-fcc0-43bd-9d30-ec017815c20e",
    base64File: "MIIFsDCCA5igAwIBAgI...==", // Certificado .cer codificado en Base64
    fileType: "CertificateCsd",
    password: "12345678a",
    tin: "EKU9003173C9"
};

const clavePrivadaCsd = {
    personId: "984708c4-fcc0-43bd-9d30-ec017815c20e",
    base64File: "MIIFDjBABgkqhkiG9w0BBQ0...==", // Llave privada .key codificada en Base64
    fileType: "PrivateKeyCsd",
    password: "12345678a",
    tin: "EKU9003173C9"
};

try {
    const apiResponseCer = await fiscalApi.taxFiles.create(certificadoCsd);
    const apiResponseKey = await fiscalApi.taxFiles.create(clavePrivadaCsd);
    console.log(apiResponseCer.data, apiResponseKey.data);
} catch (error) {
    console.error(error);
}
```

### 3. Crear un Producto o Servicio

```javascript
const fiscalApi = FiscalApiClient.create(settings);

const request = {
    description: "Servicios contables",
    unitPrice: 100,
    satUnitMeasurementId: "E48",
    satTaxObjectId: "02",
    satProductCodeId: "84111500"
};

try {
    const apiResponse = await fiscalApi.products.create(request);
    console.log(apiResponse.data);
} catch (error) {
    console.error(error);
}
```

### 4. Actualizar Impuestos de un Producto

```javascript
const fiscalApi = FiscalApiClient.create(settings);

const request = {
    id: "310301b3-1ae9-441b-b463-51a8f9ca8ba2",
    description: "Servicios contables",
    unitPrice: 100, 
    satUnitMeasurementId: "E48",
    satTaxObjectId: "02",
    satProductCodeId: "84111500",
    productTaxes: [
        { rate: 0.16, taxId: "002", taxFlagId: "T", taxTypeId: "Tasa" },  // IVA 16%
        { rate: 0.10, taxId: "001", taxFlagId: "R", taxTypeId: "Tasa" },  // ISR 10%
        { rate: 0.10666666666, taxId: "002", taxFlagId: "R", taxTypeId: "Tasa" } // IVA 2/3 partes
    ]
};

try {
    const apiResponse = await fiscalApi.products.update(request.id, request);
    console.log(apiResponse.data);
} catch (error) {
    console.error(error);
}
```

### 5. Crear una Factura de Ingreso (Por Referencias)

```javascript
const fiscalApi = FiscalApiClient.create(settings);

const invoice = {
    versionCode: "4.0",
    series: "SDK-F",
    date: new Date(),
    paymentFormCode: "01",
    currencyCode: "MXN",
    typeCode: "I",
    expeditionZipCode: "42501",
    issuer: {
        id: "<id-emisor-en-fiscalapi>"
    },
    recipient: {
        id: "<id-receptor-en-fiscalapi>"
    },
    items: [
        {
            id: "<id-producto-en-fiscalapi>",
            quantity: 1,
            discount: 10.85
        }
    ],
    paymentMethodCode: "PUE",
};

try {
    const apiResponse = await fiscalApi.invoices.create(invoice);
    console.log(apiResponse.data);
} catch (error) {
    console.error(error);
}
```

### 6. Crear la Misma Factura de Ingreso (Por Valores)

```javascript
const fiscalApi = FiscalApiClient.create(settings);

// Agregar sellos CSD, Emisor, Receptor, Items, etc.
const invoice = {
    versionCode: "4.0",
    series: "SDK-F",
    date: new Date(),
    paymentFormCode: "01",
    currencyCode: "MXN",
    typeCode: "I",
    expeditionZipCode: "42501",
    issuer: {
        tin: "EKU9003173C9",
        legalName: "ESCUELA KEMPER URGATE",
        taxRegimeCode: "601",
        taxCredentials: [
            {
                base64File: "certificate_base64...",
                fileType: "CertificateCsd",
                password: "12345678a"
            },
            {
                base64File: "private_key_base64...",
                fileType: "PrivateKeyCsd",
                password: "12345678a"
            }
        ]
    },
    recipient: {
        tin: "EKU9003173C9",
        legalName: "ESCUELA KEMPER URGATE",
        zipCode: "42501",
        taxRegimeCode: "601",
        cfdiUseCode: "G01",
        email: "someone@somewhere.com"
    },
    items: [
        {
            itemCode: "01010101",
            quantity: 9.5,
            unitOfMeasurementCode: "E48",
            description: "Invoicing software as a service",
            unitPrice: 3587.75,
            taxObjectCode: "02",
            discount: 255.85,
            itemTaxes: [
                {
                    taxCode: "002", // IVA
                    taxTypeCode: "Tasa",
                    taxRate: 0.16,
                    taxFlagCode: "T"
                }
            ]
        }
    ],
    paymentMethodCode: "PUE",
};

try {
    const apiResponse = await fiscalApi.invoices.create(invoice);
    console.log(apiResponse.data);
} catch (error) {
    console.error(error);
}
```


### 7. Búsqueda en Catálogos del SAT

```javascript
try {
    // Busca los registros que contengan 'inter' en el catalogo 'SatUnitMeasurements' (pagina 1, tamaño pagina 10)
    const apiResponse = await fiscalApi.catalogs.searchCatalog("SatUnitMeasurements", "inter", 1, 10);

    if (apiResponse.succeeded) {
        apiResponse.data.items.forEach(item => {
            console.log(`Unidad: ${item.description}`);
        });
    } else {
        console.log(apiResponse.message);
    }
} catch (error) {
    console.error(error);
}
```

---

## 📋 Operaciones Principales

- **Facturas (CFDI)**  
  Crear facturas de ingreso, notas de crédito, complementos de pago, cancelaciones, generación de PDF/XML.
- **Personas (Clientes/Emisores)**  
  Alta y administración de personas, gestión de certificados (CSD).
- **Productos y Servicios**  
  Administración de catálogos de productos, búsqueda en catálogos SAT.


## 🤝 Contribuir

1. Haz un fork del repositorio.  
2. Crea una rama para tu feature: `git checkout -b feature/AmazingFeature`.  
3. Realiza commits de tus cambios: `git commit -m 'Add some AmazingFeature'`.  
4. Sube tu rama: `git push origin feature/AmazingFeature`.  
5. Abre un Pull Request en GitHub.


## 🐛 Reportar Problemas

1. Asegúrate de usar la última versión del SDK.  
2. Verifica si el problema ya fue reportado.  
3. Proporciona un ejemplo mínimo reproducible.  
4. Incluye los mensajes de error completos.


## 📄 Licencia

Este proyecto está licenciado bajo la Licencia **MPL-2.0**. Consulta el archivo [LICENSE](LICENSE.txt) para más detalles.


## 🔗 Enlaces Útiles

- [Documentación Oficial](https://docs.fiscalapi.com)  
- [Portal de FiscalAPI](https://fiscalapi.com)  
- [Ejemplos Node.js](https://github.com/FiscalAPI/fiscalapi-samples-node)  
- [Ejemplos Express](https://github.com/FiscalAPI/fiscalapi-samples-node-express)


---

Desarrollado con ❤️ por [Fiscalapi](https://www.fiscalapi.com)
