import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  Default,
  PrimaryKey,
  CreatedAt,
  ForeignKey,
  HasMany,
  DeletedAt,
  BelongsTo,
  UpdatedAt,
} from "sequelize-typescript";
import { v4 } from "uuid";
import { Posts } from "./posts";
import { ThreadMessages } from "./threadMessages";
import { Users } from "./users";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "threads",
  initialAutoIncrement: "1",
})
export class Threads extends Model {
  @PrimaryKey
  @Default(v4)
  @Column(DataType.UUIDV4)
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column(DataType.NUMBER)
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

  //@BelongsTo(() => Posts, "post_id")
  //post?: Posts;

  @HasMany(() => ThreadMessages, { foreignKey: "thread_id" })
  threadMessages?: ThreadMessages[];
}
