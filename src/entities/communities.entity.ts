import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UsersEntity } from "./users.entity";
import { CompaniesEntity } from "./companies.entity";
import { ServicesEntity } from "./services.entity";
import { TypesEntity } from "./types.entity";

@Index("company_id", ["companyId"], {})
@Index("user_id", ["userId"], {})
@Entity("communities", { schema: "services_dbqa" })
export class CommunitiesEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "community_name", length: 80 })
  communityName: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: string;

  @Column("bigint", { name: "company_id", unsigned: true })
  companyId: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (usersEntity) => usersEntity.communities, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: UsersEntity;

  @ManyToOne(
    () => CompaniesEntity,
    (companiesEntity) => companiesEntity.communities,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "company_id", referencedColumnName: "id" }])
  company: CompaniesEntity;

  @OneToMany(() => ServicesEntity, (servicesEntity) => servicesEntity.community)
  services: ServicesEntity[];

  @OneToMany(() => TypesEntity, (typesEntity) => typesEntity.community)
  types: TypesEntity[];
}
