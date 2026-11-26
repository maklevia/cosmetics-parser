import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Relation
} from "typeorm";
import { Product } from "@api/modules/product/Product.js";
import { StoreRecordOverride } from "@api/modules/product/StoreRecordOverride.js";
import { PriceHistory } from "@api/modules/product/PriceHistory.js";
import { PriceDropQueue } from "@api/modules/notification/PriceDropQueue.js";
import { StoreName } from "@api/types/Enums.js";
import { ParsedProduct, VariantOptions } from "@api/types/ProductTypes.js";

@Entity("Store_Records")
export class StoreRecord {
  @PrimaryGeneratedColumn()
  id: number;

  static fromParsedProduct(product: ParsedProduct): StoreRecord {
    const record = new StoreRecord();
    record.productStoreName = product.name;
    record.inStock = product.inStock;
    record.image = product.image ?? null;
    record.latestPrice = product.price ?? null;
    record.link = product.link;
    record.storeName = product.storeName;
    record.variantId = product.variantId ?? null;
    record.options = product.options ?? null;
    return record;
  }

  @ManyToOne(() => Product, (product) => product.storeRecords, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Relation<Product>;

  @Column({ name: "store_name", type: "enum", enum: StoreName, enumName: "store_name_enum" })
  storeName: StoreName;

  @Column({ name: "product_store_name", type: "varchar", length: 255 })
  productStoreName: string;

  @Column({ type: "text"})
  link: string;

  @Column({ name: "variant_id", type: "varchar", length: 255, nullable: true })
  variantId: string | null;

  @Column({ type: "jsonb", nullable: true })
  options: VariantOptions | null;

  @Column({ type: "text", nullable: true })
  image: string | null;

  @Column({ name: "latest_price", type: "int", nullable: true })
  latestPrice: number | null;

  @Column({ name: "in_stock", type: "boolean", default: false })
  inStock: boolean;

  @CreateDateColumn({
    name: "parsed_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  parsedAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => StoreRecordOverride, (override) => override.storeRecord)
  overrides: StoreRecordOverride[];

  @OneToMany(() => PriceHistory, (history) => history.storeRecord, {
    cascade: true,
  })
  priceHistory: PriceHistory[];

  @OneToMany(() => PriceDropQueue, (queue) => queue.storeRecord)
  priceDropQueues: PriceDropQueue[];
}
