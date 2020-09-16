import { RolesBuilder } from 'nest-access-control';
export enum AppRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
export const roles: RolesBuilder = new RolesBuilder();
roles
  .grant(AppRoles.USER) // define new or modify existing role. also takes an array.
  .createOwn('user') // equivalent to .createOwn('video', ['*'])
  .deleteOwn('user')
  .grant(AppRoles.ADMIN) // switch to another role without breaking the chain
  .extend(AppRoles.USER) // inherit role capabilities. also takes an array
  .readAny('user')
  .updateAny('user') // explicitly defined attributes
  .deleteAny('user');
