import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { StoreRecord } from "@api/entities/StoreRecord.js";
import { StoreName } from "@api/types/Enums.js";
import { ParsedProduct } from "@api/types/ProductTypes.js";

@Entity("Price_History")
export class PriceHistory {
    @PrimaryGeneratedColumn()
    @PrimaryGeneratedColumn()
    id: number;

    static fromParsedProduct(product: ParsedProduct): PriceHistory {
        const history = new PriceHistory();
        history.inStock = product.inStock;
        history.price = product.price ?? null;
        history.storeName = product.storeName;
        return history;
    }

    @ManyToOne(() => StoreRecord, record => record.priceHistory, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_record_id" })
    storeRecord: StoreRecord;

    @Column({ name: "store_name", type: "enum", enum: StoreName })
    storeName: StoreName;

    @Column({ type: "int", nullable: true })
    price: number | null;

    @Column({ name: "in_stock", type: "boolean", default: false })
    inStock: boolean;

    @CreateDateColumn({ name: "recorded_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    recordedAt: Date;
}
