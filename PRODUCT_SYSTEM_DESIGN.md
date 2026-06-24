
Use Cases:
1. Log In/Sign Up. 
User needs to log in/sign up to the web app in order to use app`s features.
2. Look for product/Add product to collection. 
User can use app`s tool to look for product on the three online stores.
User can just analyze results or choose to add the product to their collection.  
If user desides to save product, they can adjust results (meaning delete 
found result or manually paste link from another store, in case of inccorect
parsing results).
3. Delete product with tracked price. 
User can delete tracked product from their collection.
4. Setting up price drop notifications.
For each product, user can enable/disable notification when product`s price drop. Telegram notifications, Push notifications?
5. Receiving notification about price drop.
Each time the lowest price on the product drops, user gets notification with chosen method.
6. View tracked products (collection).
User has collection of tracked products. They can see the whole collection and interact with each product. 
7. View price history. 
User can see week-long??? price history for each product (storing lowest price on one of the stores)


DB structure
1. Table Users:
- id (PK): serial
- email: string
- password (hash): string
- name: string
- avatar_id (FK): table Images
- telegram_account_id: string
- created_at: timastamp
- updated_at: timestamp

2. Tabel Images:
- id (PK): serial
- filename: string
- extention: string
- path: string

3. Table Products:
- id (PK): serial
- name: string
- brand: string
- created_at: timestamp
- updated_at: timestamp

4. Table Store Records:
- id (PK): serial
- product_id (FK): table Products
- store_name: 'eva' | 'notino' | 'makeup'
- url: string
- latest_price: int
- in_stock: boolean
- priced_updated_at: timestamp

5. Table Collections:
- id (PK): string
- product_id (FK): table products
- user_id (FK): table Users
-created_at: timestamp

6. Table Price History:
- id (PK): serial
- product_id (FK): table Products
- store_name: 'eva' | 'notino' | 'makeup'
- price: int
- in_stock: boolean 
- recorded_at: timestamp





cookies/session storage/
