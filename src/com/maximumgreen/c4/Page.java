package com.maximumgreen.c4;

import java.util.Date;

import javax.jdo.annotations.*;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Page {
    @PrimaryKey
    @Persistent
    private Key key;
    
    //BlobKey to retrieve actual image from datastore
    @Persistent
    private BlobKey imageKey;
    
    //Date the page was created
    @Persistent
    private Date dateCreated;
    
    //Empty constructor
    public Page() {
    }

    //Getters and Setters
	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
	}

	public BlobKey getImageKey() {
		return imageKey;
	}

	public void setImageKey(BlobKey imageKey) {
		this.imageKey = imageKey;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
}