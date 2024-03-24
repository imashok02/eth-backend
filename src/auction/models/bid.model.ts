import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

@Table({
  tableName: 'bids',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class Bid extends BaseModel<Bid> {
  @Column({ type: DataType.STRING, allowNull: false })
  contractAddress: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  bidAmount: string;
}
