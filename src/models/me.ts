// src/models/me.ts
import type { CreditBalance } from './person';

/**
 * La persona de la credencial (`me.get`, GET /api/v4/me): quién es, de qué tenant y ambiente, si es el owner, lo que
 * puede hacer y sus saldos. Siempre la persona de la API key; no trae secretos.
 */
export interface MeInfo {
  /** Id de la persona. */
  id: string;

  /** Nombre o razón social. */
  legalName: string | null;

  /** RFC. */
  tin: string | null;

  /** Correo. */
  email: string | null;

  /** Tenant de la persona (el del header X-TENANT-KEY). */
  tenantId: string;

  /** Ambiente que responde: Development, Test o Production. */
  environment: string;

  /** true si la persona es el owner del tenant (el mismo valor que `features.isOwner`). */
  isOwner: boolean;

  /** Lo que la persona puede hacer: roles, permisos concedidos y negados, features del tenant y suscripción. */
  features: PersonFeatures;

  /** Saldos por tipo de crédito, como `Person.balances`; un tipo ausente tiene saldo 0. */
  balances: CreditBalance[];
}

/** Lo que la persona puede hacer (`MeInfo.features`). Es informativo: cada endpoint vuelve a evaluar su permiso. */
export interface PersonFeatures {
  /** true si la persona es el owner del tenant. */
  isOwner: boolean;

  /** Roles de la persona: Owner o Member (más Host para la persona del host). */
  roles: string[];

  /** Permisos concedidos, con la forma Área.Acción (por ejemplo, Invoices.Issue). */
  permissions: string[];

  /** Permisos que el rol de la persona tiene pero se le niegan porque al tenant le faltan features, por permiso. */
  denied: Record<string, DeniedPermission>;

  /** Features habilitados del tenant, por código (por ejemplo, emision_cfdi), con sus valores. */
  features: Record<string, PersonFeature>;

  /** La suscripción que otorga los features del tenant. */
  subscription: PersonSubscription;

  /** Los asientos de la persona en los features por persona; vacío si no tiene ninguno. */
  seatAssignments: PersonSeatAssignment[];
}

/** Un permiso negado (`PersonFeatures.denied`): los features que le faltan al tenant. */
export interface DeniedPermission {
  /** Códigos de los features que le faltan al tenant. */
  missingFeatures: string[];
}

/** Un feature habilitado del tenant (`PersonFeatures.features`). */
export interface PersonFeature {
  /** Valores del feature por código (por ejemplo, seats); vacío si no tiene. */
  values: Record<string, number>;
}

/** La suscripción que otorga los features del tenant (`PersonFeatures.subscription`). */
export interface PersonSubscription {
  /** Estado de la suscripción (active, trialing o past_due), o null si ninguna otorga features. */
  status: string | null;

  /** false si no se pudieron leer los features del tenant (o la persona no tiene roles). */
  isAvailable: boolean;
}

/** Un asiento de la persona en un feature por persona (`PersonFeatures.seatAssignments`). */
export interface PersonSeatAssignment {
  /** Código del feature (por ejemplo, descarga_cfdi). */
  featureCode: string;

  /** Unidades que ocupa de la cantidad contratada. */
  units: number;

  /** Active si cabe en la cantidad contratada (la persona usa el feature) o Suspended si no cabe. */
  status: string;
}
