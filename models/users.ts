import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  Default,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from "sequelize-typescript";
import { FavoritePosts } from "./favoritePosts";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "users",
  initialAutoIncrement: "1",
})
export class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.NUMBER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(true)
  @Default("")
  @Column(DataType.STRING)
  email_verification_token: string | undefined;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(true)
  @Default("")
  @Column(DataType.STRING)
  reset_pwd_token: string | undefined;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_admin!: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  lat!: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  lng!: number;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @DeletedAt
  @Column
  deleted_at!: Date;

  @HasMany(() => FavoritePosts, { foreignKey: "user_id" })
  favoritePosts?: FavoritePosts[];
}
