package dev.simonprickett.rediscachedemo;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import redis.clients.jedis.Jedis;

public class App 
{
    private final static int CACHE_SECS = 15;
    private final static String ACCESS_KEY = System.getenv("ACCESS_KEY");

    private static String getExchangeRates(String date) throws IOException {
        String apiUrl = "http://api.exchangeratesapi.io/" + date + "?access_key=" + ACCESS_KEY;

        InputStream is = new URL(apiUrl).openStream();
        StringBuilder sb = new StringBuilder();
        
        int c;
        while ((c = is.read()) != -1) {
            sb.append((char) c);
        }

        return sb.toString();
    }

    public static void main( String[] args )
    {
        try {
            if (args.length != 1) {
                System.err.println("Usage:   <date>");
                System.err.println("Example: 2020-11-10");
                System.err.println("Example: latest");
                System.exit(-1);
            }

            String date = args[0];
            String cacheKey = "rates:" + date;

            Instant start = Instant.now();

            Jedis jedis = new Jedis();

            System.out.println("Looking in cache for: " + cacheKey);
            String rates = jedis.get(cacheKey);

            if (rates == null) {
                System.out.println("Cache miss, fetching from origin...");
                rates = getExchangeRates(date);

                System.out.println("Caching origin response for " + CACHE_SECS + " seconds at " + cacheKey);
                jedis.setex(cacheKey, CACHE_SECS, rates);
            } else {
                System.out.println("Cache hit!");
            }

            System.out.println(rates);            
            jedis.close();

            System.out.println("Time taken: " + ChronoUnit.MILLIS.between(start, Instant.now()) + " milliseconds.");
        } catch (Exception e) {
            System.err.println("Error:");
            System.err.println(e);
        }
    }
}
