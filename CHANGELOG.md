# Changelog

Cambios del SDK y notas de comportamiento del API de FiscalAPI que afectan a quien usa el SDK.

## [Sin publicar]

### Cambios incompatibles (BREAKING)

- Se elimina `capitalRegime` de la interfaz `Person` (estaba `@deprecated`): el API no tiene régimen de capital, ignoraba el valor y nunca lo devolvía. En TypeScript, un objeto `Person` que lo incluya o una lectura de `person.capitalRegime` deja de compilar: quite la propiedad de su código y envíe la razón social sin régimen de capital en `legalName`. En JavaScript no hay error, pero el valor nunca tuvo efecto; quítelo también.

### Modelo `Person`

- Nuevos campos opcionales:
  - `phoneNumber` y `curp`: los aceptan la creación y la actualización de personas.
  - `country`: país de residencia fiscal expandido (solo lectura).
  - `balances`: saldos por tipo de crédito (`CreditBalance`: `creditType` y `available`, solo lectura). Solo aparecen los tipos que la persona ha tenido; un tipo ausente tiene saldo 0.
  - `isOwner`: `true` si la persona es el owner de su tenant (solo lectura).
- `password`: requerida al crear; al actualizar, `null` o vacía conserva la contraseña actual. El API nunca la devuelve.
- `userTypeId`: `"C"` (cliente, el valor por omisión al crear) o `"U"` (usuario). `"T"` (tenant) solo llega en respuestas: el API lo rechaza al crear y al actualizar solo lo acepta si la persona ya es `"T"`.

### Notas del API (sin cambio de forma en el SDK)

- `Person.taxPassword` es la contraseña de la llave privada (.key) que la persona guarda en su perfil; el API no la usa para sellar (al timbrar usa la contraseña de los certificados registrados o la de `taxCredentials`). Solo la reciben con valor la propia persona y el owner del tenant; los demás reciben `null`. Al actualizar, `null` la conserva y `""` la borra.
- En un 400 de validación, cada falla de `data` trae `attemptedValue` (este SDK no lo modela en `ValidationFailure`): el valor de un secreto (contraseñas, códigos, tokens, archivos y contraseñas de CSD/FIEL) llega enmascarado como `"[masked: n]"` (`n` es su longitud), o `"[masked]"` si la falla es de un objeto o una lista que lo contiene.
- `TaxCredential.password` solo se exige en la llave privada (.key); en el certificado (.cer) el API no la usa.
- `TaxFile.tin`: el API ya no lo exige en `taxFiles.create()`; si se omite o va vacío, usa el RFC de la persona. Si se envía, debe ser el RFC de la persona (sin distinguir mayúsculas); si no, el API responde 400 con la falla en `Tin` (después de comprobar que puede gestionar los certificados de la persona; si no, 403). El API no guarda el valor enviado: el `tin` del archivo siempre es el RFC de la persona. La interfaz `TaxFile` sigue declarando `tin: string` (la respuesta siempre lo trae); para no enviarlo desde TypeScript use `''`.
- El API ya no devuelve `twoFactorEnabled` en las personas (este SDK nunca lo modeló).
