import pool from "@api/config/db.js"

export class ChannelRepositories {
    //now this binds specificly to telegram. if new Channles table to-be created, this repository should
    //update that table instead of users and have no idea about diff types of channels.
    async bindChannelAccount(userUuid: string, channelAccountId: number): Promise<number | undefined> {
        const queryText: string = `
        WITH deleted_token AS (
            DELETE FROM Channel_Tokens
            WHERE uuid = $2 AND expires_at > NOW()
            RETURNING user_id
        )
        UPDATE Users
        SET telegram_account_id = $1
        WHERE id = (SELECT user_id FROM deleted_token)
        RETURNING id;`

        const result = await pool.query(queryText, [channelAccountId, userUuid])
        const userId: number | undefined = result.rows[0].id;

        return userId;
    }
}
