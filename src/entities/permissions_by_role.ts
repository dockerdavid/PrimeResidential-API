import {
  Entity,
  PrimaryColumn,
  Index,
  JoinColumn,
} from "typeorm";
import { PermissionsEntity } from "./permissions.entity";
import { RolesEntity } from "./roles.entity";
import { ManyToOneNoAction } from "../decorators/relations.decorator";

@Index("idx_permission_id", ["permissionId"])
@Index("idx_role_id", ["roleId"])
@Entity("permissions_by_role", { schema: "services_dbqa" })
export class PermissionsByRoleEntity {
  @PrimaryColumn({ type: "bigint", unsigned: true, name: "permission_id" })
  permissionId: string;

  @PrimaryColumn({ type: "bigint", unsigned: true, name: "role_id" })
  roleId: string;

  @ManyToOneNoAction(() => PermissionsEntity, permission => permission.permissionsByRole, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
    nullable: false,
  })
  @JoinColumn({ name: "permission_id" })
  permission: PermissionsEntity;

  @ManyToOneNoAction(() => RolesEntity, role => role.permissionsByRole, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
    nullable: false,
  })
  @JoinColumn({ name: "role_id" })
  role: RolesEntity;
}
