# Setup

- yarn install
- Create a database and table with the schema provided
- Create a .env file in the root of the project using the schema provided.

# How to use

`node cli/appCoreContract.js <start block> <increment>`

Increment should be max 1000

This app will populate a local elastic search server with Birth Event.

CK Start block is 4605167

Sample: 

`node cli/appCoreContract.js 4605167 1000`

# Problems

- Infuria's nodes sometimes crash, which will require you to restart, just start from the last block that completed.

# DB schema

```sql
CREATE TABLE `birth_events` (
  `kitty_id` int(11) unsigned NOT NULL,
  `original_owner` varchar(60) DEFAULT NULL,
  `matron_id` int(11) DEFAULT NULL,
  `sire_id` int(11) DEFAULT NULL,
  `genes` text,
  PRIMARY KEY (`kitty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

# .env file

```.dotenv
HOST="localhost"
USERNAME="root"
PASSWORD=""
DATABASE="crypto"
```
