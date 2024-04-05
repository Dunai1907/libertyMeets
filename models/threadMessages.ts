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
  DeletedAt,
  BelongsTo,
  UpdatedAt,
} from "sequelize-typescript";
import { v4 } from "uuid";
import { Threads } from "./threads";
import { Users } from "./users";

@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
  tableName: "thread_messages",
  initialAutoIncrement: "1",
})
export class ThreadMessages extends Model {
  @PrimaryKey
  @Default(v4)
  @Column(DataType.UUIDV4)
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column(DataType.NUMBER)
  user_id!: number;

  @AllowNull(false)
  @ForeignKey(() => Threads)
  @Column(DataType.UUIDV4)
  thread_id!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  message!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  sent_message_id!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  received_message_id!: string;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @DeletedAt
  @Column
  deleted_at!: Date;

  @BelongsTo(() => Threads, "thread_id")
  thread?: string;
}
