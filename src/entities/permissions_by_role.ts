import {
  Entity,
  PrimaryColumn,
  Index,
  JoinColumn,
} from "typeorm";
import { PermissionsEntity } from "./permissions.entity";
import { RolesEntity } from "./roles.entity";
import { ManyToOneNoAction } from "../decorators/relations.decorator";

@Entity("permissions_by_role", { schema: "services_dbqa" })
export class PermissionsByRoleEntity {
  @PrimaryColumn({ type: "bigint", unsigned: true, name: "permission_id" })
  permissionId: string;

  @PrimaryColumn({ type: "bigint", unsigned: true, name: "role_id" })
  roleId: string;

  @ManyToOneNoAction(() => PermissionsEntity, (permission) => permission.permissionsByRole)
  @JoinColumn({ name: "permission_id" })
  @Index("IDX_25e8534db320b3bf23caa4fbc9")
  permission: PermissionsEntity;

  @ManyToOneNoAction(() => RolesEntity, (role) => role.permissionsByRole)
  @JoinColumn({ name: "role_id" })
  @Index("IDX_8550102b804d6606c91c87bac3")
  role: RolesEntity;
}
