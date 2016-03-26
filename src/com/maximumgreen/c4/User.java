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
	
	//User's email address
	@Persistent
	private String email;
	
	//User's name that gets displayed. Must be unique within datastore.
	@Persistent
	@Unique
	private String username;
	
	//Use to determine if user is administrator or not
	@Persistent
	boolean administrator;
	
	//Biography for user page
	@Persistent
	private String biography;
	
	//Key to retrieve user's profile picture from the blobstore
	@Persistent
	private BlobKey profileImage;
	
	//Key to retrieve user's custom background image from the blobstore
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
	
	//List of AUTHORS(users) by key that the user is following
	@Persistent
	private List<Key> following;
	
	//Map of COMICS keys to the PAGE key that the user last read
	@Persistent
	private Map<Key, Key> lastRead;
	
	//List of KEYS to notify user of updates
	@Persistent
	private List<Key> notifications;
	
	//Empty constructor
	public User(){}
	
	//Basic constructor using information available from the Google login
	public User(Key k, String email, String username, boolean administrator){
		super();
		this.k = k;
		this.email = email;
		this.username = username;
		this.administrator = administrator;
	}
	
	//PUBLIC METHODS ACCESSIBLE FROM ENDPOINT
	//add/delete user own series, favorites, subscriptions, following, notifications
	public  boolean addUserSeries(Key k) {
		return userSeries.add(k);
	}
	public boolean deleteUserSeries(Key k){
		return userSeries.remove(k);
	}
	
	public  boolean addFavorite(Key k) {
		return favorites.add(k);
	}
	public boolean deleteFavorite(Key k){
		return favorites.remove(k);
	}
	
	public  boolean addSubscription(Key k) {
		return subscriptions.add(k);
	}
	public boolean deleteSubscription(Key k){
		return notifications.remove(k);
	}
	
	public  boolean addFollow(Key k) {
		return following.add(k);
	}
	public boolean deleteFollow(Key k){
		return following.remove(k);
	}
	
	public  boolean addNotification(Key k) {
		return notifications.add(k);
	}
	public boolean deleteNotification(Key k){
		return notifications.remove(k);
	}
	
	//Method to retrieve the page key of last read page in a comic, if available
	public Key getCurrentPage(Key k){
		if (lastRead.containsKey(k))
			return lastRead.get(k);
		else
			return null;
	}

	//Getters and Setters
	public Key getKey() {
		return k;
	}

	public void setKey(Key k) {
		this.k = k;
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

	public boolean isAdministrator() {
		return administrator;
	}

	public void setAdministrator(boolean administrator) {
		this.administrator = administrator;
	}

	public String getBiography() {
		return biography;
	}

	public void setBiography(String biography) {
		this.biography = biography;
	}

	public BlobKey getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(BlobKey profileImage) {
		this.profileImage = profileImage;
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

	public List<Key> getFollowing() {
		return following;
	}

	public void setFollowing(List<Key> following) {
		this.following = following;
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