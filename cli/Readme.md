# how to use

`node appCoreContract.js <start block> <increment>`

Increment should be max 5000

This app will populate a local elastic search server with Birth Event.

CK Start block is 4605167

Sample: 

`node appCoreContract.js 4605167 1000`

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
