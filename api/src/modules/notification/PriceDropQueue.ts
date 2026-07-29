import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { StoreRecord } from "@api/modules/product/StoreRecord.js";
import { Product } from "@api/modules/product/Product.js";

export enum PriceDropQueueStatus {
    PENDING = 'pending',
    PROCESSED = 'processed'
}

@Entity("Price_Drop_Queue")
export class PriceDropQueue {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StoreRecord, record => record.priceDropQueues, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_record_id" })
    storeRecord: StoreRecord;

    @ManyToOne(() => Product, product => product.priceDropQueues, { onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ name: "old_price", type: "int", nullable: true })
    oldPrice: number | null;

    @Column({ name: "new_price", type: "int", nullable: true })
    newPrice: number | null;

    @Column({
        type: "enum",
        enum: PriceDropQueueStatus,
        default: PriceDropQueueStatus.PENDING
    })
    status: PriceDropQueueStatus;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}
