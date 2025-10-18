import {
  pgTable,
  serial,
  bigint,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ==================================================
// ENUMS
// ==================================================
export const userRole = pgEnum('userRole', [
  'superAdmin',
  'generalAdmin',
  'userManager',
  'productManager',
  'orderManager',
  'viewOnlyAdmin',
  'user',
])

export const productStatus = pgEnum('productStatus', ['inStock', 'discontinued', 'outOfStock'])

export const orderStatus = pgEnum('orderStatus', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
])

// ==================================================
// USERS
// ==================================================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRole('role').notNull().default('user'),
  isBanned: boolean('isBanned').notNull().default(false),
  isDeleted: boolean('isDeleted').notNull().default(false),
  lastLogin: timestamp('lastLogin'), // nullable
  createdBy: bigint('createdBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedBy: bigint('updatedBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  updatedAt: timestamp('updatedAt'), // nullable
  bannedBy: bigint('bannedBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  bannedAt: timestamp('bannedAt'), // nullable
  deletedBy: bigint('deletedBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  deletedAt: timestamp('deletedAt'), // nullable
  restoredBy: bigint('restoredBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  restoredAt: timestamp('restoredAt'), // nullable
})

// ==================================================
// REFRESH TOKENS
// ==================================================
export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  userId: bigint('userId', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull(),
  revoked: boolean('revoked').notNull().default(false),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  revokedBy: bigint('revokedBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  revokedAt: timestamp('revokedAt'), // nullable
})

// ==================================================
// PRODUCTS
// ==================================================
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'), // nullable
  price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  stock: integer('stock').notNull().default(0),
  status: productStatus('status').notNull().default('inStock'),
  isDeleted: boolean('isDeleted').notNull().default(false),
  createdBy: bigint('createdBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedBy: bigint('updatedBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  updatedAt: timestamp('updatedAt'), // nullable
  deletedBy: bigint('deletedBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  deletedAt: timestamp('deletedAt'), // nullable
  restoredBy: bigint('restoredBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  restoredAt: timestamp('restoredAt'), // nullable
})

// ==================================================
// CART
// ==================================================
export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: bigint('userId', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: bigint('productId', { mode: 'number' })
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'), // nullable
})

// ==================================================
// ORDERS
// ==================================================
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: bigint('userId', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  total: numeric('total', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  contact: varchar('contact', { length: 100 }).notNull(),
  shippingAddress: varchar('shippingAddress', { length: 255 }).notNull(),
  shippingFee: numeric('shippingFee', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  status: orderStatus('status').notNull().default('pending'),
  isDeleted: boolean('isDeleted').notNull().default(false),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedBy: bigint('updatedBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  updatedAt: timestamp('updatedAt'), // nullable
  deletedBy: bigint('deletedBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  deletedAt: timestamp('deletedAt'), // nullable
  restoredBy: bigint('restoredBy', { mode: 'number' }).references(() => users.id, {
    onDelete: 'set null',
  }),
  restoredAt: timestamp('restoredAt'), // nullable
})

// ==================================================
// ORDER ITEMS
// ==================================================
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: bigint('orderId', { mode: 'number' })
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: bigint('productId', { mode: 'number' })
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  price: numeric('price', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

// ==================================================
// REVIEWS
// ==================================================
export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    userId: bigint('userId', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: bigint('productId', { mode: 'number' })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment'), // nullable
    isVisible: boolean('isVisible').notNull().default(true),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt'), // nullable
    hiddenBy: bigint('hiddenBy', { mode: 'number' }).references(() => users.id, {
      onDelete: 'set null',
    }),
    hiddenAt: timestamp('hiddenAt'), // nullable
    restoredBy: bigint('restoredBy', { mode: 'number' }).references(() => users.id, {
      onDelete: 'set null',
    }),
    restoredAt: timestamp('restoredAt'), // nullable
  },
  (table) => ({
    uniqueKeys: [['userId', 'productId']],
    checks: ['rating >= 1 AND rating <= 5'],
  }),
)

// ==================================================
// WISHLIST
// ==================================================
export const wishlist = pgTable(
  'wishlist',
  {
    id: serial('id').primaryKey(),
    userId: bigint('userId', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: bigint('productId', { mode: 'number' })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => ({
    uniqueKeys: [['userId', 'productId']],
  }),
)

// ==================================================
// RELATIONS
// ==================================================
export const cartRelations = relations(cart, ({ one }) => ({
  product: one(products, {
    fields: [cart.productId],
    references: [products.id],
  }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  product: one(products, {
    fields: [wishlist.productId],
    references: [products.id],
  }),
}))
