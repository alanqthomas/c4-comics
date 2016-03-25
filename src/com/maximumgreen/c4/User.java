package com.maximumgreen.c4;

import java.util.List;
import java.util.Map;

import javax.jdo.annotations.*;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class User {
	//Use Google ID to generate a key
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key k;
	
	//User's Google ID 
	@Persistent
	private String googleID;
	
	//User's email address
	@Persistent
	private String email;
	
	//User's name that gets displayed. Must be unique within datastore.
	@Persistent
	@Unique
	private String username;
	
	//Use to determine if user is admin or not. 0 = normal user, 1 = admin.
	@Persistent
	private int userLevel;
	
	//Biography for user page
	@Persistent
	private String biography;
	
	//Key to retrieve user's custom background image from the datastore
	@Persistent
	private BlobKey bgImage;
	
	//User's rating, to be calculated from their series/comics ratings
	@Persistent
	private double rating;
	
	//List of SERIES a user has created
	@Persistent
	private List<Key> userSeries;
	
	//List of users favorites SERIES' Keys.  User does NOT get update notifications
	@Persistent
	private List<Key> favorites;
	
	//List of users SERIES subscriptions by key.  User WILL get update notifications
	@Persistent
	private List<Key> subscriptions;
	
	//Map of COMICS keys to the PAGE key that the user last read
	@Persistent
	private Map<Key, Key> lastRead;
	
	//List of KEYS to notify user of updates
	@Persistent
	private List<Key> notifications;
	
	//Empty constructor
	public User(){
	}
}