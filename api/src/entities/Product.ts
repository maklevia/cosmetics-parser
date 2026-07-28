import { Collection } from "@api/entities/Collection.js";
import { StoreRecord } from "@api/entities/StoreRecord.js";
import { PriceDropQueue } from "@api/entities/PriceDropQueue.js";
import { UserNotification } from "@api/entities/UserNotification.js";
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  brand: string;

  @Column({ type: "text", nullable: true })
  image: string | null;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToMany(() => Collection, (collection) => collection.product)
  collections: Collection[];

  @OneToMany(() => StoreRecord, (record) => record.product, { cascade: true })
  storeRecords: StoreRecord[];

  @OneToMany(() => PriceDropQueue, (queue) => queue.product)
  priceDropQueues: PriceDropQueue[];

  @OneToMany(() => UserNotification, (notification) => notification.product)
  notifications: UserNotification[];
}
