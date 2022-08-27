# Introduction
Strapi is a headless CMS used to manage contents such as translations, disclosures, images, and more. Strapi exposes these contents through REST API, and can be called by UI/frontend to retrieve the respective contents.

# Getting Started
1. After pulling down the repository. Go to `strapi-api` directory and perform a `npm install`
2. To start up Strapi run `npm run develop`. You can also modify .env file with .env.local database changes to do npm start.

# Accessing Strapi Dev environment
1. You can access the admin interface through [here](http://localhost:1337/admin/auth/login)
2. Use these temporary credentials to login.

# Strapi Environment
| Environment | URL |
| :---: | :---: |
| Dev | http://localhost/admin |

# Strapi translations
To load data:
1. Copy files into this folder: '.\public\translationFiles\<<langCode>>\translation.json'
   where <<langCode>> is in this format: fr-CH (language-Country)
2. The data will loaded for locals that have no translation for them yet.
# Resources
* [Strapi.io](https://strapi.io)
* [Strapi Introduction](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html)

member_type (gold, platum, silver, coper)
1, member_type, reward_level, create_date
member: 

1, gold,first name, last name, registration Date, reward point, 

reward_log
1, user_id, rewardpoint, reward_type, creation_date, reward_source


account_category (retail, wholesale, restraurant)

account
1, address, phone, isVerified

account_categories()

user_account(isDefault, isAdmin, isOwner, isFavarite, isFollowing)

product_catetory(eletronic, computer, music)
1. categoryname, description, parentCategory, rewards

product ()
1. account, productname, description, units_available, product_category, 

product_pricing
1, productid, base_price, create_date, expired_date, isActive

product_discount
id, product, discount_value, discount_unit, create_date, valid_from, valid_until, coupon_code, mini_order, max_discount_amount

campaign_type
1, shop

campaign
1. campaign_type, userid, accounnt,description, images, started, ended, viewCount, participateCount, rating, trending

shop_details
1, campaignId, productId, quantity, price

shop_response
1, shopdetail, user_id, quantity, paid

payment


http://localhost:1337/api/shop-responses?filters[shop_detail][id][$eq]=4&populate=*
http://localhost:1337/api/shop-responses?filters[shop_detail][id][$eq]=1&filters[member][id][$eq]=2&populate=*

