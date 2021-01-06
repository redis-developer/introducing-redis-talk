package dev.simonprickett.rediscachedemo;

import redis.clients.jedis.Jedis;

public class App 
{
    public static void main( String[] args )
    {
        Jedis jedis = new Jedis();
        System.out.println( "Hello World!" );
        String str = jedis.get("hello");
        System.out.println(str);
        jedis.close();
    }
}
