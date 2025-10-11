import { Role } from 'src/common/enums/roles.enum'

const FIELDS_TO_REMOVE = {
  SUPER_ADMIN: ['password'],
  ADMIN: [
    'password', 'createdBy', 'updatedBy', 'bannedBy', 'hideenBy',
    'deletedBy', 'restoredBy',
  ],
  PUBLIC: [
    'password', 'lastLogin', 'isBanned', 'isDeleted', 'isVisible', 'createdAt',
    'updatedAt', 'createdBy', 'updatedBy', 'bannedBy', 'bannedAt', 'hideenBy',
    'hiddenAt', 'deletedAt', 'deletedBy', 'restoredBy', 'restoredAt',
  ]
}


/**
 * Recursively sanitizes objects and arrays by removing sensitive fields
 * and converting Date objects to ISO strings.
 */
 const sanitize = (data: any, remove: string[] = []): any => {
  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item, remove))
  }

  if (data !== null && typeof data === 'object') {
    if (data instanceof Date) return data.toISOString()

    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => !remove.includes(key))
        .map(([key, value]) => [key, sanitize(value, remove)]),
    )
  }

  return data
}

export const sanitizeForSuperAdmin = (data: any) =>
  sanitize(data, FIELDS_TO_REMOVE.SUPER_ADMIN)

export const sanitizeForAdmin = (data: any) =>
  sanitize(data, FIELDS_TO_REMOVE.ADMIN)

export const sanitizeForPublic = (data: any) =>
  sanitize(data, FIELDS_TO_REMOVE.PUBLIC)