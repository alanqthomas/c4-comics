package com.maximumgreen.c4;

import java.util.Date;
import java.util.List;

import javax.jdo.annotations.*;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Series {
	//Series key should contain key of parent User
	@PrimaryKey
	@Persistent
	private Key key;
	
	//Title of Series
	@Persistent
	private String title;
	
	//Series description
	@Persistent
	private String description;
	
	//Background image used on Series page
	@Persistent
	private BlobKey bgImage;
	
	//Date the SERIES was created
	@Persistent 
	private Date dateCreated;
	
	//SERIES rating, to be calculated from their COMICS ratings
	@Persistent
	private double rating;
	
	//List of COMIC keys within the series. Series -> Comics -> Pages
	@Persistent 
	private List<Key> comics;
	
	//List of USER keys subscribed to this series
	@Persistent
	private List<Key> subscribers;
	
	//List of COMMENTS for the series as a whole
	@Persistent
	private List<Comment> comments;
	
	//Empty constructor
	public Series() {
	}

    //Getters and Setters
	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
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

	public BlobKey getBgImage() {
		return bgImage;
	}

	public void setBgImage(BlobKey bgImage) {
		this.bgImage = bgImage;
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

	public List<Key> getComics() {
		return comics;
	}

	public void setComics(List<Key> comics) {
		this.comics = comics;
	}

	public List<Key> getSubscribers() {
		return subscribers;
	}

	public void setSubscribers(List<Key> subscribers) {
		this.subscribers = subscribers;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}
}