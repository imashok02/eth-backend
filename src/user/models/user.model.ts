import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

@Table({ tableName: 'users', underscored: true, paranoid: true })
export class User extends BaseModel<User> {
  @Column({ type: DataType.STRING, allowNull: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address: string;

  @Column({ type: DataType.STRING, allowNull: true })
  privateKey: string;
}