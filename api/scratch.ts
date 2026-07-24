import axios from 'axios';

async function run() {
    const apiLink = 'https://makeup.com.ua/shop/v1/search/products/?query=185823';
    const response = await axios.get(apiLink, {
        headers: { 'accept-language': 'uk' },
    });
    const data = response.data.products[0];
    console.log("Search API Title:", data.title);
    console.log("Search API SubTitle:", data.subTitle);
    console.log("Search API Brand:", data.brand.title);
}

run().catch(console.error);
