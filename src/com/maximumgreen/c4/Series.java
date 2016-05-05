package com.maximumgreen.c4;

import java.util.Date;
import java.util.List;

import javax.jdo.annotations.*;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Series {
	//Unique generated id
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Long id;
	
	//Unique user id of author
	@Persistent
	private String authorId;
	
	//Title of Series
	@Persistent
	@Index
	private String title;
	
	//Series description
	@Persistent
	private String description;
	
	//URL to bgImage
	@Persistent
	private String bgImageURL;
	
	//Date the SERIES was created
	@Persistent 
	private Date dateCreated;
	
	//String formatted date
	@Persistent
	private String dateString;
	
	//SERIES rating - average of all comics within series
	@Persistent
	private double rating;
	
	//List of COMIC ids within the series. Series -> Comics -> Pages
	@Persistent 
	private List<Long> comics;
	
	//List of USER ids subscribed to this series
	@Persistent
	private List<String> subscribers;
	
	//List of COMMENT ids for the series as a whole
	@Persistent
	private List<Long> comments;
	
	//CUSTOM CSS FIELDS
	@Persistent
	private String cssBgColor;
	
	@Persistent
	private String cssFontColor;
	
	//empty constructor
	public Series(){
	}

	//getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAuthorId() {
		return authorId;
	}

	public void setAuthorId(String authorId) {
		this.authorId = authorId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBgImageURL() {
		return bgImageURL;
	}

	public void setBgImageURL(String bgImageURL) {
		this.bgImageURL = bgImageURL;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public List<Long> getComics() {
		return comics;
	}

	public void setComics(List<Long> comics) {
		this.comics = comics;
	}

	public List<String> getSubscribers() {
		return subscribers;
	}

	public void setSubscribers(List<String> subscribers) {
		this.subscribers = subscribers;
	}

	public List<Long> getComments() {
		return comments;
	}

	public void setComments(List<Long> comments) {
		this.comments = comments;
	}
	
	//Custom Methods
	public boolean addSubscriber(String id){
		return subscribers.add(id);
	}
	
	public boolean deleteSubscriber(String id){
		return subscribers.remove(id);
	}
	
	public boolean addSeriesComic(Long id){
		return comics.add(id);
	}
	
	public boolean deleteSeriesComic(Long id){
		return comics.remove(id);
	}
	
	public boolean addSeriesComment(Long id){
		return comments.add(id);
	}
	
	public boolean deleteSeriesComment(Long id){
		return comments.remove(id);
	}
	
	//css getters/setters
	public String getCssBgColor() {
		return cssBgColor;
	}

	public void setCssBgColor(String cssBgColor) {
		this.cssBgColor = cssBgColor;
	}

	public String getCssFontColor() {
		return cssFontColor;
	}

	public void setCssFontColor(String cssFontColor) {
		this.cssFontColor = cssFontColor;
	}

	public String getDateString() {
		return dateString;
	}

	public void setDateString(String dateString) {
		this.dateString = dateString;
	}
	
}