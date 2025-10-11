export enum Role {
  SuperAdmin = 'superAdmin',
  GeneralAdmin = 'generalAdmin',
  ProductManager = 'productManager',
  OrderManager = 'orderManager',
  UserManager = 'userManager',
  ViewOnlyAdmin = 'viewOnlyAdmin',
  User = 'user',
}

export const RoleHierarchy: Partial<Record<Role, Role[]>> = {
  [Role.GeneralAdmin]: [
    Role.GeneralAdmin,
    Role.ProductManager,
    Role.OrderManager,
    Role.UserManager,
    Role.ViewOnlyAdmin,
  ],
  [Role.ProductManager]: [Role.ProductManager, Role.ViewOnlyAdmin],
  [Role.OrderManager]: [Role.OrderManager, Role.ViewOnlyAdmin],
  [Role.UserManager]: [Role.UserManager, Role.ViewOnlyAdmin],
  [Role.ViewOnlyAdmin]: [Role.ViewOnlyAdmin],
}