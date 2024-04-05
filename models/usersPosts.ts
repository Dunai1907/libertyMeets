import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  PrimaryKey,
  BelongsTo,
  AutoIncrement,
  CreatedAt,
  ForeignKey,
  DeletedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Posts } from "./posts";
import { Users } from "./users";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "user_posts",
  initialAutoIncrement: "1",
})
export class UserPosts extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.NUMBER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Users)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Posts)
  post_id!: number;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @DeletedAt
  @Column
  deleted_at!: Date;
}
