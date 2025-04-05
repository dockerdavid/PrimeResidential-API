import {
  Column,
  Entity,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CompaniesEntity } from "./companies.entity";
import { ServicesEntity } from "./services.entity";
import { TypesEntity } from "./types.entity";
import { UsersEntity } from "./users.entity";
import { ManyToOneNoAction, OneToManyNoAction } from "../decorators/relations.decorator";

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

  @ManyToOneNoAction(() => CompaniesEntity, (companiesEntity) => companiesEntity.communities)
  @JoinColumn([{ name: "company_id", referencedColumnName: "id" }])
  company: CompaniesEntity;

  @ManyToOneNoAction(() => UsersEntity, (usersEntity) => usersEntity.communities)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: UsersEntity;

  @OneToManyNoAction(() => ServicesEntity, (servicesEntity) => servicesEntity.community)
  services: ServicesEntity[];

  @OneToManyNoAction(() => TypesEntity, (typesEntity) => typesEntity.community)
  types: TypesEntity[];
}
