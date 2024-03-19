import {
  AutoIncrement,
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript';

export abstract class BaseModel<T = any> extends Model<T, T> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id?: number;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
