package com.maximumgreen.c4;

import java.util.Date;

import javax.jdo.annotations.*;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Comment {
    //Auto-generate an id number for each comment
	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
    
	//UserID of user
	@Persistent
	private String userId;
	
	//User that made the comment
    @Persistent
    private String username;
    
    //Comment text
    @Persistent
    private String comment;
    
    //Date the comment was posted
    @Persistent
    private Date date;
    
    //Formatted string of date
    @Persistent
    private String dateString;
    
    //empty constructor
    public Comment(){
    }

    //Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getDateString() {
		return dateString;
	}

	public void setDateString(String dateString) {
		this.dateString = dateString;
	}

}