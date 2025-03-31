import { FiscalapiClient, FiscalapiSettings, Person, Product, TaxFile } from '../src';
import { inspect } from 'util';
inspect.defaultOptions.depth = null; // Deshabilitar la profundidad de inspección para objetos anidados la salida de la consola
inspect.defaultOptions.colors = true; // Habilitar colores para la salida de la consola

async function main() : Promise<void> {

  // Configura el cliente de FiscalAPI
  const settings: FiscalapiSettings = {
    apiUrl: 'https://localhost:7173',
    apiKey: 'sk_development_833a58f9_8212_43ce_b544_f2fa93b1e895',
    tenant: 'e839651d-1765-4cd0-ba7f-547a4c20580f',
    debug:true
  };

  // Sellos SAT CSD del emisor para emisión de CFDI
  const base64Cert = `MIIFgDCCA2igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDM0NDYwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWxpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMjMwNTE4MTQzNTM3WhcNMjcwNTE4MTQzNTM3WjCBpzEdMBsGA1UEAxMUS0FSTEEgRlVFTlRFIE5PTEFTQ08xHTAbBgNVBCkTFEtBUkxBIEZVRU5URSBOT0xBU0NPMR0wGwYDVQQKExRLQVJMQSBGVUVOVEUgTk9MQVNDTzEWMBQGA1UELRMNRlVOSzY3MTIyOFBINjEbMBkGA1UEBRMSRlVOSzY3MTIyOE1DTE5MUjA1MRMwEQYDVQQLEwpTdWN1cnNhbCAxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhNXbTSqGX6+/3Urpemyy5vVG2IdP2v7v001+c4BoMxEDFDQ32cOFdDiRxy0Fq9aR+Ojrofq8VeftvN586iyA1A6a0QnA68i7JnQKI4uJy+u0qiixuHu6u3b3BhSpoaVHcUtqFWLLlzr0yBxfVLOqVna/1/tHbQJg9hx57mp97P0JmXO1WeIqi+Zqob/mVZh2lsPGdJ8iqgjYFaFn9QVOQ1Pq74o1PTqwfzqgJSfV0zOOlESDPWggaDAYE4VNyTBisOUjlNd0x7ppcTxSi3yenrJHqkq/pqJsRLKf6VJ/s9p6bsd2bj07hSDpjlDC2lB25eEfkEkeMkXoE7ErXQ5QCwIDAQABox0wGzAMBgNVHRMBAf8EAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAHwYpgbClHULXYhK4GNTgonvXh81oqfXwCSWAyDPiTYFDWVfWM9C4ApxMLyc0XvJte75Rla+bPC08oYN3OlhbbvP3twBL/w9SsfxvkbpFn2ZfGSTXZhyiq4vjmQHW1pnFvGelwgU4v3eeRE/MjoCnE7M/Q5thpuog6WGf7CbKERnWZn8QsUaJsZSEkg6Bv2jm69ye57ab5rrOUaeMlstTfdlaHAEkUgLX/NXq7RbGwv82hkHY5b2vYcXeh34tUMBL6os3OdRlooN9ZQGkVIISvxVZpSHkYC20DFNh1Bb0ovjfujlTcka81GnbUhFGZtRuoVQ1RVpMO8xtx3YKBLp4do3hPmnRCV5hCm43OIjYx9Ov2dqICV3AaNXSLV1dW39Bak/RBiIDGHzOIW2+VMPjvvypBjmPv/tmbqNHWPSAWOxTyMx6E1gFCZvi+5F+BgkdC3Lm7U0BU0NfvsXajZd8sXnIllvEMrikCLoI/yurvexNDcF1RW/FhMsoua0eerwczcNm66pGjHm05p9DR6lFeJZrtqeqZuojdxBWy4vH6ghyJaupergoX+nmdG3JYeRttCFF/ITI68TeCES5V3Y0C3psYAg1XxcGRLGd4chPo/4xwiLkijWtgt0/to5ljGBwfK7r62PHZfL1Dp+i7V3w7hmOlhbXzP+zhMZn1GCk7KY=`; // Reemplaza con tu certificado en base64
  const base64Key = `MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIAgEAAoIBAQACAggAMBQGCCqGSIb3DQMHBAgwggS9AgEAMASCBMh4EHl7aNSCaMDA1VlRoXCZ5UUmqErAbucRBAKNQXH8t8gVCl/ItHMI2hMJ76QOECOqEi1Y89cDpegDvh/INXyMsXbzi87tfFzgq1O+9ID6aPWGg+bNGADXyXxDVdy7Nq/SCdoXvo66MTYwq8jyJeUHDHEGMVBcmZpD44VJCvLBxDcvByuevP4Wo2NKqJCwK+ecAdZc/8Rvd947SjbMHuS8BppfQWARVUqA5BLOkTAHNv6tEk/hncC7O2YOGSShart8fM8dokgGSyewHVFe08POuQ+WDHeVpvApH/SP29rwktSoiHRoL6dK+F2YeEB5SuFW9LQgYCutjapmUP/9TC3Byro9Li6UrvQHxNmgMFGQJSYjFdqlGjLibfuguLp7pueutbROoZaSxU8HqlfYxLkpJUxUwNI1ja/1t3wcivtWknVXBd13R06iVfU1HGe8Kb4u5il4a4yP4p7VT4RE3b1SBLJeG+BxHiE8gFaaKcX/Cl6JV14RPTvk/6VnAtEQ66qHJex21KKuiJo2JoOmDXVHmvGQlWXNjYgoPx28Xd5WsofL+n7HDR2Ku8XgwJw6IXBJGuoday9qWN9v/k7DGlNGB6Sm4gdVUmycMP6EGhB1vFTiDfOGQO42ywmcpKoMETPVQ5InYKE0xAOckgcminDgxWjtUHjBDPEKifEjYudPwKmR6Cf4ZdGvUWwY/zq9pPAC9bu423KeBCnSL8AQ4r5SVsW6XG0njamwfNjpegwh/YG7sS7sDtZ8gi7r6tZYjsOqZlCYU0j7QTBpuQn81Yof2nQRCFxhRJCeydmIA8+z0nXrcElk7NDPk4kYQS0VitJ2qeQYNENzGBglROkCl2y6GlxAG80IBtReCUp/xOSdlwDR0eim+SNkdStvmQM5IcWBuDKwGZc1A4v/UoLl7niV9fpl4X6bUX8lZzY4gidJOafoJ30VoY/lYGkrkEuz3GpbbT5v8fF3iXVRlEqhlpe8JSGu7Rd2cPcJSkQ1Cuj/QRhHPhFMF2KhTEf95c9ZBKI8H7SvBi7eLXfSW2Y0ve6vXBZKyjK9whgCU9iVOsJjqRXpAccaWOKi420CjmS0+uwj/Xr2wLZhPEjBA/G6Od30+eG9mICmbp/5wAGhK/ZxCT17ZETyFmOMo49jl9pxdKocJNuzMrLpSz7/g5Jwp8+y8Ck5YP7AX0R/dVA0t37DO7nAbQT5XVSYpMVh/yvpYJ9WR+tb8Yg1h2lERLR2fbuhQRcwmisZR2W3Sr2b7hX9MCMkMQw8y2fDJrzLrqKqkHcjvnI/TdzZW2MzeQDoBBb3fmgvjYg07l4kThS73wGX992w2Y+a1A2iirSmrYEm9dSh16JmXa8boGQAONQzQkHh7vpw0IBs9cnvqO1QLB1GtbBztUBXonA4TxMKLYZkVrrd2RhrYWMsDp7MpC4M0p/DA3E/qscYwq1OpwriewNdx6XXqMZbdUNqMP2viBY2VSGmNdHtVfbN/rnaeJetFGX7XgTVYD7wDq8TW9yseCK944jcT+y/o0YiT9j3OLQ2Ts0LDTQskpJSxRmXEQGy3NBDOYFTvRkcGJEQJItuol8NivJN1H9LoLIUAlAHBZxfHpUYx66YnP4PdTdMIWH+nxyekKPFfAT7olQ=`; // Reemplaza con tu clave privada en base64
  const password = '12345678a'; // Reemplaza con la contraseña de tu clave privada

  try {
    console.log('Hello Fiscalapi node...');
    
    // Crea el cliente http
    const client = FiscalapiClient.create(settings);
  
    // Listar api keys
    // const apiResponse = await client.apiKeys.getList(1, 2);
    // console.log('apiResponse:', apiResponse);

    // Obtiene api key por ID
    //  const apiResponse = await client.apiKeys.getById("2be4288f-696f-4d13-bd03-d9565101ae51",true);
    //  console.log('apiResponse:', apiResponse);

    // Crear api key
    // const modelRequest = {
    //   description: 'Api key empresa prueba',
    //   personId: '4162d2e2-d63b-4923-85eb-db1ed4e700c1',
    // };
    // const apiResponse = await client.apiKeys.create(modelRequest);
    // console.log('apiResponse:', apiResponse);


    // Actualizar api key
    // const modelRequest = {
    //   id: '2be4288f-696f-4d13-bd03-d9565101ae51',
    //   description: 'Api key empresa prueba actualizado',
    //   personId: '4162d2e2-d63b-4923-85eb-db1ed4e700c1',
    //   apiKeyStatus: 0, // 0=Deshabilitado, 1=Habilitado
    // };
    // const apiResponse = await client.apiKeys.update(modelRequest);
    // console.log('apiResponse:', apiResponse);


    // Eliminar api key
    // const apiResponse = await client.apiKeys.delete("2be4288f-696f-4d13-bd03-d9565101ae51");
    // console.log('apiResponse:', apiResponse);


    // Listar personas (emisores, receptores, clientes, empresas, usuarios)
    // const apiResponse = await client.persons.getList(1,2);
    // console.log(apiResponse);
    
    // Obtener persona (emisor, receptor, cliente, empresa, usuario) por Id
    // const apiResponse = await client.persons.getById("1", true)
    // console.log(apiResponse);

    // Crear persona (emisor, receptor, cliente, empresa, usuario)
     // const modelRequest: Person = {
     //  legalName: 'EMPRESA S.A. DE C.V.',
     //  email: 'empresa@example.com',
     //  password: 'StrongPassword123!',
     //  userTypeId: 'C', // C=Cliente, U=Usuario T=Tenant
     // };
     // const apiResponse = await client.persons.create(modelRequest);
     // console.log(apiResponse);


    // Actualizar persona (emisor, receptor, cliente, empresa, usuario)
    //  const modelRequest: Person = {
    //    id: 'cce1def0-7df0-4c44-b7b8-046a7681ced6',
    //    legalName: 'KARLA FUENTE NOLASCO',
    //    //capitalRegime: "S.A de C.V", // Régimen de capital de la persona, solo cuando es persona moral
    //    tin: 'FUNK671228PH6', // RFC
    //    email: 'karla.fuentes@example.com',
    //    userTypeId: 'C', // C=Cliente, U=Usuario T=Tenant
    //    satTaxRegimeId: '601', // General de Ley Personas Morales
    //    satCfdiUseId: 'G03', // Gastos en general.
    //    zipCode: '01160', // Código postal
    //    taxPassword: '12345678a', // Contraseña de los certificados CSD
    //    //base64Photo: 'base64Photo', // Foto de perfil en base64
    //    //password: '12345678a', // Contraseña para acceder al dashboard
    //    //password: '12345678a', // Contraseña para acceder al dashboard
    //  };
    //  const apiResponse = await client.persons.update(modelRequest);
    //  console.log(apiResponse);


    // Eliminar persona (emisor, receptor, cliente, empresa, usuario)
    // const apiResponse = await client.persons.delete("cce1def0-7df0-4c44-b7b8-046a7681ced6");
    // console.log(apiResponse);


    // Listar certificados CSD
    // const apiResponse = await client.taxFiles.getList(1, 2);
    // console.log(apiResponse);  

    // Obtener certificado CSD por ID
    // const apiResponse = await client.taxFiles.getById("7626304b-47a9-4a42-82f7-43c7d4ed6081", true);
    // console.log(apiResponse);


    // Crear certificado CSD (subir certificado y llave privada)
    // const certModelRequest: TaxFile = {
    //   personId: '3f3478b4-60fd-459e-8bfc-f8239fc96257',
    //   tin: 'FUNK671228PH6', // RFC
    //   base64File: base64Cert,
    //   fileType: 0, // 0=Certificado, 1=Llave privada
    //   password: '12345678a', // Contraseña de la llave privada0
    // };

    // const keyModelRequest: TaxFile = {
    //   personId: '3f3478b4-60fd-459e-8bfc-f8239fc96257',
    //   tin: 'FUNK671228PH6', // RFC
    //   base64File: base64Key,
    //   fileType: 1, // 0=Certificado, 1=Llave privada
    //   password: '12345678a', // Contraseña de la llave privada
    // };

    // const apiResponseCert = await client.taxFiles.create(certModelRequest);
    // console.log(apiResponseCert);

    // const apiResponseKey = await client.taxFiles.create(keyModelRequest);
    // console.log(apiResponseKey); 


    // Obtiene el último par de ids de certificados válidos y vigente de una persona. Es decir sus certificados por defecto (ids)
    // const apiResponse = await client.taxFiles.getDefaultReferences("3f3478b4-60fd-459e-8bfc-f8239fc96257");
    // console.log(apiResponse);

    // Obtiene el último par de certificados válidos y vigente de una persona. Es decir sus certificados por defecto
    // const apiResponse = await client.taxFiles.getDefaultValues("3f3478b4-60fd-459e-8bfc-f8239fc96257");
    // console.log(apiResponse);


    // Eliminar certificados por ID (Se necesita hacer dos llamadas, una para el certificado y otra para la llave privada) 
    // const apiResponseCert = await client.taxFiles.delete("174edf2d-c1e7-4040-95f7-949e3947c192"); 
    // console.log(apiResponseCert);

    // const apiResponseKey = await client.taxFiles.delete("2c592f82-0acc-47cd-866d-1676f3b7e1ef"); 
    // console.log(apiResponseKey);







    // Listar productos
    // const apiResponse = await client.products.getList(1, 2);
    // console.log('apiResponse:', apiResponse);

    // Obtiene producto por ID
    // const apiResponse = await client.products.getById("114a4be5-fb65-40b2-a762-ff0c55c6ebfa",true);
    // console.log('apiResponse:', apiResponse);

    // Crear producto
    // const modelRequest: Product = {
    //   description: 'Libro de JavaScript',
    //   unitPrice: 200,
    // }
    // const apiResponse = await client.products.create(modelRequest);
    // console.log('apiResponse:', apiResponse);

    // Actualizar producto
    // const modelRequest: Product = {
    //   id: 'cf792d75-7c81-446c-be28-f098f9cb601a',
    //   description: 'Libro de JavaScript actualizado',
    //   unitPrice: 250,
    //   satUnitMeasurementId: 'D63',
    //   satTaxObjectId: '01',
    //   satProductCodeId: '14111804',
    //   productTaxes: [
    //     {
    //       rate: 0.16, // Tasa del impuesto. El valor debe estar entre 0.00000 y 1.000000 p. ej. `0.160000` para un 16% de impuesto
    //       taxId: '002', // 001=ISR, 002=IVA, 003=IEPS
    //       taxFlagId: 'T', // T=Traslado o R=Retención
    //       taxTypeId: 'Tasa', // Tasa, Cuota o Exento
    //     },
    //     {
    //       rate: 0.08, // Tasa del impuesto
    //       taxId: '003', // 001=ISR, 002=IVA, 003=IEPS
    //       taxFlagId: 'T', // T=Traslado o R=Retención
    //       taxTypeId: 'Tasa', // Tasa, Cuota o Exento
    //     }
    //   ]
    // };
    // const apiResponse = await client.products.update(modelRequest);
    // console.log('apiResponse:', apiResponse);


    // Eliminar producto
    // const apiResponse = await client.products.delete("cf792d75-7c81-446c-be28-f098f9cb601a");
    // console.log('apiResponse:', apiResponse);


    // Listar catálogos
    // const apiResponse = await client.catalogs.getList(1, 100);
    // console.log('apiResponse:', apiResponse);

    // Obtener registro de catálogo por ID (Obtiene el registro '03' (Transferencia electrónica de fondos) en el catalogo de formas de pago (SatPaymentForms))
    // const apiResponse = await client.catalogs.getRecordById("SatPaymentForms", "03");
    // console.log('apiResponse:', apiResponse);

    // Busca en un catálogo. (Busca en el catalogo de formas de pago (SatPaymentForms) los registros que contengan la palabra 'Tarjeta')
    // const apiResponse = await client.catalogs.searchCatalog("SatPaymentForms", "Tarjeta", 1, 100);
    // console.log('apiResponse:', apiResponse);

 


    console.log('End Fiscalapi node...'); 
  } catch (error: unknown) {
    console.error('Error inesperado:', error);    
  }
}

// Ejecutar la función principal
main().catch(console.error);


