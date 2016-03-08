package com.maximumgreen.c4;

import java.util.List;
import java.util.Map;

import javax.jdo.annotations.*;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class User {
	//Automatically generate a unique key for each user
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;
	
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

    //Getters and Setters
	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
	}

	public String getGoogleID() {
		return googleID;
	}

	public void setGoogleID(String googleID) {
		this.googleID = googleID;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public int getUserLevel() {
		return userLevel;
	}

	public void setUserLevel(int userLevel) {
		this.userLevel = userLevel;
	}

	public String getBiography() {
		return biography;
	}

	public void setBiography(String biography) {
		this.biography = biography;
	}

	public BlobKey getBgImage() {
		return bgImage;
	}

	public void setBgImage(BlobKey bgImage) {
		this.bgImage = bgImage;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public List<Key> getUserSeries() {
		return userSeries;
	}

	public void setUserSeries(List<Key> userSeries) {
		this.userSeries = userSeries;
	}

	public List<Key> getFavorites() {
		return favorites;
	}

	public void setFavorites(List<Key> favorites) {
		this.favorites = favorites;
	}

	public List<Key> getSubscriptions() {
		return subscriptions;
	}

	public void setSubscriptions(List<Key> subscriptions) {
		this.subscriptions = subscriptions;
	}

	public Map<Key, Key> getLastRead() {
		return lastRead;
	}

	public void setLastRead(Map<Key, Key> lastRead) {
		this.lastRead = lastRead;
	}

	public List<Key> getNotifications() {
		return notifications;
	}

	public void setNotifications(List<Key> notifications) {
		this.notifications = notifications;
	}
}