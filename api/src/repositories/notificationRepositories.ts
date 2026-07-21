import pool from "@api/config/db.js";
import { NotificationRow, PendingNotifDataRow } from "@api/types/NotifTypes.js";

export class NotificationRepositories {
  async createPriceDropQueue(
    storeRecordId: number,
    productId: number,
    oldPrice: number,
    newPrice: number,
  ): Promise<void> {
    const queryText: string = `
    INSERT INTO Price_Drop_Queue (store_record_id, product_id, old_price, new_price)
    VALUES ($1, $2, $3, $4)`;

    await pool.query(queryText, [storeRecordId, productId, oldPrice, newPrice]);
  }

  async updatePriceDropQueue(price_drop_queue_ids: number[]): Promise<void> {
    const queryText: string = `
    UPDATE Price_Drop_Queue 
    SET status = 'processed'
    WHERE id = ANY($1)`;

    await pool.query(queryText, [price_drop_queue_ids]);
  }

  async getPendingNotificationsData(): Promise<PendingNotifDataRow[]> {
    const queryText: string = `
    SELECT Users.id AS "userId",
    Users.telegram_account_id AS "telegramId",

    json_agg(
        json_build_object(
            'queueId', Price_Drop_Queue.id,
            'productName', Store_Records.product_store_name,
            'productId', Store_Records.product_id,
            'storeName', Store_Records.store_name,
            'productLink', Store_Records.link,
            'image', Store_Records.image,
            'oldPrice', Price_Drop_Queue.old_price,
            'newPrice', Price_Drop_Queue.new_price
        )
    ) AS "priceDropsData"
    
    FROM Price_Drop_Queue
    JOIN Collections ON Collections.product_id = Price_Drop_Queue.product_id
    JOIN Users ON Users.id = Collections.user_id
    JOIN Store_records ON Store_Records.id = Price_Drop_Queue.store_record_id
    
    WHERE Price_Drop_Queue.status = 'pending' AND Collections.notify_on_price_drop = true
    
    GROUP BY Users.id, Users.telegram_account_id;`;

    const result = await pool.query<PendingNotifDataRow>(queryText);
    return result.rows;
  }

  async createUserNotification(userId: number, productId: number, title: string, message: string, image?: string) {
    const queryText: string = `
    INSERT INTO User_Notifications (user_id, product_id, title, message, image)
    VALUES ($1, $2, $3, $4, $5)`

    await pool.query(queryText, [userId, productId, title, message, image])
  }

  async clearOldRecords(): Promise<void> {
    const queryTextQueue: string = `
    DELETE FROM Price_Drop_Queue
    WHERE status = 'processed' AND created_at < NOW() - INTERVAL '7 days';`

    await pool.query(queryTextQueue);

    const queryTextNotifs: string = `
    DELETE FROM User_Notifications
    WHERE created_at < NOW() - INTERVAL '30 days'`

    await pool.query(queryTextNotifs);
  }

  async getNotificationsByUserId(userId: number): Promise<NotificationRow[]> {
    const queryText: string = `
    SELECT id AS "notifId",
    product_id AS "productId",
    image,
    title,
    message,
    is_read AS "isRead"
    FROM User_Notifications
    WHERE user_id = $1`

    const result = await pool.query<NotificationRow>(queryText, [userId]);

    return result.rows;
  }
}
