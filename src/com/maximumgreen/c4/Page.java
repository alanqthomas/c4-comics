package com.maximumgreen.c4;

import java.util.Date;

import javax.jdo.annotations.*;

import com.google.appengine.api.blobstore.BlobKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Page {
	//Generate a unique id
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
    
    //BlobKey to retrieve actual image from datastore
    @Persistent
    private BlobKey imageKey;
    
    //URL to image
    @Persistent
    private String imageURL;
    
    //Date the page was created
    @Persistent
    private Date dateCreated;
    
    //empty constructor
    public Page(){
    }

    //Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public BlobKey getImageKey() {
		return imageKey;
	}

	public void setImageKey(BlobKey imageKey) {
		this.imageKey = imageKey;
	}

	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
    
}