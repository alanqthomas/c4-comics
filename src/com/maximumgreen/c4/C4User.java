package com.maximumgreen.c4;

import java.util.List;
import java.util.Map;

import javax.jdo.annotations.*;

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
	@Index
	private String username;
	
	//Use to determine if user is administrator or not
	@Persistent
	boolean administrator;
	
	//Biography for user page
	@Persistent
	private String biography;

	//URL to profile image
	@Persistent
	private String profileImageURL;
	
	//User's rating, to be calculated from their series/comics ratings
	@Persistent
	private double rating;
	
	//List of SERIES a user has created
	@Persistent
	private List<Long> userSeries;
	
	//List of users favorite SERIES' ids.  User does NOT get update notifications
	@Persistent
	private List<Long> favoriteSeries;
	
	//List of users favorite COMICS ids.  User does not get update notifications
	private List<Long> favoriteComics;
	
	//List of users favorite AUTHORS.  User does NOT get update notifications
	@Persistent
	private List<String> favoriteAuthors;
	
	//List of users SERIES subscriptions by key.  User WILL get update notifications
	@Persistent
	private List<Long> subscriptions;
	
	//List of AUTHORS(users) by key that the user is following
	@Persistent
	private List<String> following;
	
	//List of FOLLOWERS by id following this user
	@Persistent
	private List<String> followers;
	
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

	public String getProfileImageURL() {
		return profileImageURL;
	}

	public void setProfileImageURL(String profileImageURL) {
		this.profileImageURL = profileImageURL;
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

	public List<Long> getFavoriteSeries() {
		return favoriteSeries;
	}

	public void setFavoriteSeries(List<Long> favoriteSeries) {
		this.favoriteSeries = favoriteSeries;
	}

	public List<Long> getFavoriteComics() {
		return favoriteComics;
	}

	public void setFavoriteComics(List<Long> favoriteComics) {
		this.favoriteComics = favoriteComics;
	}
	
	public List<String> getFavoriteAuthors() {
		return favoriteAuthors;
	}

	public void setFavoriteAuthors(List<String> favoriteAuthors) {
		this.favoriteAuthors = favoriteAuthors;
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

	public List<String> getFollowers() {
		return followers;
	}

	public void setFollowers(List<String> followers) {
		this.followers = followers;
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
	public void addUserSeries(Long id) {
		userSeries.add(0, id);
	}
	public boolean deleteUserSeries(Long id){
		return userSeries.remove(id);
	}
	
	public void addFavoriteSeries(Long id) {
		favoriteSeries.add(0, id);
	}
	public boolean deleteFavoriteSeries(Long id){
		return favoriteSeries.remove(id);
	}
	
	public void addFavoriteComic(Long id) {
		favoriteComics.add(0, id);
	}
	public boolean deleteFavoriteComic(Long id){
		return favoriteComics.remove(id);
	}
	
	public void addFavoriteAuthor(String id){
		favoriteAuthors.add(0, id);
	}
	public boolean deleteFavoriteAuthor(String id){
		return favoriteAuthors.remove(id);
	}
	
	public void addSubscription(Long id) {
		subscriptions.add(0, id);
	}
	public boolean deleteSubscription(Long id){
		return subscriptions.remove(id);
	}
	
	public void addFollow(String id) {
		following.add(0, id);
	}
	public boolean deleteFollow(String id){
		return following.remove(id);
	}
	
	public void addFollower(String id) {
		followers.add(0, id);
	}
	public boolean deleteFollower(String id){
		return followers.remove(id);
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