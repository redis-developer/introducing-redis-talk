package dev.simonprickett.rediscachedemo;

import redis.clients.jedis.Jedis;

public class App 
{
    public static void main( String[] args )
    {
        /*
         * Result to cache https://api.exchangeratesapi.io/2020-11-10?base=GBP
         *
         * Example response:
         * 
         * {
         *   "rates": {
         *     "CAD": 1.7260015922,
         *     "HKD": 10.2674276488,
         *     "ISK": 181.9853559535,
         *     "PHP": 63.969590617,
         *     "DKK": 8.3474428983,
         *     "HUF": 400.7041700773,
         *     "CZK": 29.636814191,
         *     "GBP": 1.0,
         *     "RON": 5.4569817118,
         *     "SEK": 11.4371573058,
         *     "IDR": 18602.4690804301,
         *     "INR": 98.2995638182,
         *     "BRL": 7.1272551944,
         *     "RUB": 101.1736541718,
         *     "HRK": 8.4797551103,
         *     "JPY": 139.4436159358,
         *     "THB": 40.1702118117,
         *     "CHF": 1.2128993194,
         *     "EUR": 1.1212899319,
         *     "MYR": 5.4556361638,
         *     "BGN": 2.1930188489,
         *     "TRY": 10.9521994102, 
         *     "CNY": 8.7580592714,
         *     "NOK": 11.9549689963,
         *     "NZD": 1.9402800982,
         *     "ZAR": 20.576455154,
         *     "USD": 1.3240191516,
         *     "MXN": 27.0235358757,
         *     "SGD": 1.7857663456,
         *     "AUD": 1.8206384625,
         *     "ILS": 4.4721527645,
         *     "KRW": 1478.9029299306,
         *     "PLN": 5.0446834038
         *   },
         *   "base": "GBP",
         *   "date": "2020-11-10"
         * } 
         */
        
        Jedis jedis = new Jedis();
        System.out.println( "Hello World!" );
        String str = jedis.get("hello");
        System.out.println(str);
        jedis.close();
    }
}
