package com.maximumgreen.c4;


import java.util.Date;
import java.util.List;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Notification {
	@Persistent
	@PrimaryKey
	private Long id;
	
	@Persistent
	private String type;
	
	@Persistent
	private String message;
	
	@Persistent
	private Date date;
	
	@Persistent
	private String dateString;
	
	//List of users that have read this notification
	@Persistent
	private List<String> readNotification;
	
	public Notification(){
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
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

	public List<String> getReadNotification() {
		return readNotification;
	}

	public void setReadNotification(List<String> readNotification) {
		this.readNotification = readNotification;
	}
	
	public boolean addReader(String id){
		return readNotification.add(id);
	}
	
	public boolean removeReader(String id){
		return readNotification.remove(id);
	}
	
}
