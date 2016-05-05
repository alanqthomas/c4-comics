package com.maximumgreen.c4;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.Index;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Comic {
	//Unique Generated Id
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@PrimaryKey
	private Long id;
	
	//ID of author
	@Persistent
	private String authorId;
	
	//ID of parent series
	@Persistent
	private Long seriesId;
	
	//Name of comic
	@Persistent
	@Index
	private String title;
	
	//List of tags the author has added to the comic
	@Persistent
	private List<Long> tags;
	
	//List of PAGE Id within this comic. Series -> Comics -> Pages
	@Persistent 
	private List<Long> pages;
	
	//Date the COMIC was created
	@Persistent 
	private Date dateCreated;
	
	//Creation Date in String form
	@Persistent
	private String dateString;
	
	//List of COMMENT IDs for the specific comic
	@Persistent
	private List<Long> comments;
	
	//Map of User keys and Integer rating given to this comic by specific user
	@Persistent(serialized = "true")
	private Map<String, Integer> ratings;
	
	//Calculated rating
	@Persistent
	private double rating;
	
	//View count - should be incremented any time a user views the page
	@Persistent
	private int viewCount;
	
	//Empty constructor
	public Comic(){
	}

	//Getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getSeriesId() {
		return seriesId;
	}

	public void setSeriesId(Long seriesId) {
		this.seriesId = seriesId;
	}
	
	public String getAuthorId() {
		return authorId;
	}
	
	public void setAuthorId(String authorId) {
		this.authorId = authorId;
	}
	
	public List<Long> getTags() {
		return tags;
	}

	public void setTags(List<Long> tags) {
		this.tags = tags;
	}

	public List<Long> getPages() {
		return pages;
	}

	public void setPages(List<Long> pages) {
		this.pages = pages;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public List<Long> getComments() {
		return comments;
	}

	public void setComments(List<Long> comments) {
		this.comments = comments;
	}

	public Map<String, Integer> getRatings() {
		return ratings;
	}

	public void setRatings(Map<String, Integer> ratings) {
		this.ratings = ratings;
	}
	
	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}
	
	public int getViewCount() {
		return viewCount;
	}
	
	public void setViewCount(int viewCount) {
		this.viewCount = viewCount;
	}
	
	public void setTitle(String title){
		this.title = title;
	}
	
	public String getTitle(){
		return title;
	}
	
	public boolean addComicPage(Long id){
		return pages.add(id);
	}
	
	public boolean deleteComicPage(Long id){
		return pages.remove(id);
	}
	
	public boolean addComicTag(Long id){
		return tags.add(id);
	}
	
	public boolean deleteComicTag(Long id){
		return tags.remove(id);
	}
	
	public boolean addComicComment(Long id){
		return comments.add(id);
	}
	
	public boolean deleteComicComment(Long id){
		return comments.remove(id);
	}

	public String getDateString() {
		return dateString;
	}

	public void setDateString(String dateString) {
		this.dateString = dateString;
	}
	
	//method to add a rating to the ratings map
	public void addRating(String userId, int rating) {
		Integer bigIntRating = rating;
		ratings.put(userId, bigIntRating);
	}
	
	//method to iterate over values in ratings map and update rating with calculated average
	public void updateRating() {
		int count = 0;
		int total = 0;
		for (Integer r : this.ratings.values()) {
			count++;
			total += r;
		}
		this.rating = total/count;
	}
	
	//simple method to increment viewCount
	public void updateViewCount() {
		viewCount += 1;
	}
	
}
