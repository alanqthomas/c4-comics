package com.maximumgreen.c4;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class C4Rating {
	@Persistent
	@PrimaryKey
	private String id;
	
	@Persistent
	private Long comicId;
	
	@Persistent
	private double rating;
	
	public C4Rating(){
	}
	
	public C4Rating(String id, Long comicId, double rating){
		this.id = id;
		this.comicId = comicId;
		this.rating = rating;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Long getComicId() {
		return comicId;
	}

	public void setComicId(Long comicId) {
		this.comicId = comicId;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}
	
}
