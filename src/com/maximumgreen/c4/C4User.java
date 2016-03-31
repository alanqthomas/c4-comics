package com.maximumgreen.c4;

import java.util.List;
import java.util.Map;

import javax.jdo.annotations.*;

import com.google.appengine.api.blobstore.BlobKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class C4User {
	//Use unique Google ID as the user ID
	@PrimaryKey
	@Persistent
	String userID;
	
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
	private List<Long> userSeries;
	
	//List of users favorites SERIES' Keys.  User does NOT get update notifications
	@Persistent
	private List<Long> favorites;
	
	//List of users SERIES subscriptions by key.  User WILL get update notifications
	@Persistent
	private List<Long> subscriptions;
	
	//List of AUTHORS(users) by key that the user is following
	@Persistent
	private List<String> following;
	
	//Map of COMICS keys to the PAGE key that the user last read
	@Persistent
	private Map<Long, Long> lastRead;
	
	//List of KEYS to notify user of updates
	@Persistent
	private List<Long> notifications;
	
	//Empty constructor
	public C4User(){
	}
	
	//getters and setters
	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
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

	public List<Long> getUserSeries() {
		return userSeries;
	}

	public void setUserSeries(List<Long> userSeries) {
		this.userSeries = userSeries;
	}

	public List<Long> getFavorites() {
		return favorites;
	}

	public void setFavorites(List<Long> favorites) {
		this.favorites = favorites;
	}

	public List<Long> getSubscriptions() {
		return subscriptions;
	}

	public void setSubscriptions(List<Long> subscriptions) {
		this.subscriptions = subscriptions;
	}

	public List<String> getFollowing() {
		return following;
	}

	public void setFollowing(List<String> following) {
		this.following = following;
	}

	public Map<Long, Long> getLastRead() {
		return lastRead;
	}

	public void setLastRead(Map<Long, Long> lastRead) {
		this.lastRead = lastRead;
	}

	public List<Long> getNotifications() {
		return notifications;
	}

	public void setNotifications(List<Long> notifications) {
		this.notifications = notifications;
	}

	//PUBLIC METHODS ACCESSIBLE FROM ENDPOINT
	//add/delete user own series, favorites, subscriptions, following, notifications
	public  boolean addUserSeries(Long id) {
		return userSeries.add(id);
	}
	public boolean deleteUserSeries(Long id){
		return userSeries.remove(id);
	}
	
	public  boolean addFavorite(Long id) {
		return favorites.add(id);
	}
	public boolean deleteFavorite(Long id){
		return favorites.remove(id);
	}
	
	public  boolean addSubscription(Long id) {
		return subscriptions.add(id);
	}
	public boolean deleteSubscription(Long id){
		return notifications.remove(id);
	}
	
	public  boolean addFollow(String id) {
		return following.add(id);
	}
	public boolean deleteFollow(String id){
		return following.remove(id);
	}
	
	public  boolean addNotification(Long id) {
		return notifications.add(id);
	}
	public boolean deleteNotification(Long id){
		return notifications.remove(id);
	}
	
	//Method to retrieve the page key of last read page in a comic, if available
	public Long getCurrentPage(Long id){
		if (lastRead.containsKey(id))
			return lastRead.get(id);
		else
			return null;
	}

}