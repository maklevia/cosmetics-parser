import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { StoreRecord } from "@api/entities/StoreRecord.js";
import { StoreName } from "@api/types/StoreName.js";

@Entity("Price_History")
export class PriceHistory {
    @PrimaryGeneratedColumn()
    id: number;

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
