package com.maximumgreen.c4;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Comic {
	//Key will contain parent Series key
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;
	
	//List of tags the author has added to the comic
	@Persistent
	private List<Tag> tags;
	
	//List of PAGE keys within this comic. Series -> Comics -> Pages
	@Persistent 
	private List<Key> pages;
	
	//Date the SERIES was created
	@Persistent 
	private Date dateCreated;
	
	//List of COMMENTS for the specific comic
	@Persistent
	private List<Comment> comments;
	
	//Map of User keys and Integer rating given to this comic by specific user
	@Persistent
	private Map<Key, Integer> ratings;
	
	//Getters and Setters
	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public List<Key> getPages() {
		return pages;
	}

	public void setPages(List<Key> pages) {
		this.pages = pages;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}

	public Map<Key, Integer> getRatings() {
		return ratings;
	}

	public void setRatings(Map<Key, Integer> ratings) {
		this.ratings = ratings;
	}
}
